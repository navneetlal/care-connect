import { embedMany, embed } from "ai";
import { createVectorQueryTool, MDocument } from "@mastra/rag";
import { readFileSync } from "node:fs";
import { ollama } from "ollama-ai-provider";

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { pgVector } from '../database/pg'

async function initializeVectorDB() {
  try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDirPath = dirname(currentFilePath);
    const basePath = resolve(currentDirPath, "../..");

    const guidelinesPath = join(
      basePath,
      "src/mastra/knowledge_base/guidelines.md",
    );

    const guidelineContent = readFileSync(guidelinesPath).toString("utf-8");

    const doc = MDocument.fromMarkdown(guidelineContent);

    const chunks = await doc.chunk({
      strategy: "markdown",
      size: 512,
      overlap: 50,
    });

    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: ollama.embedding("nomic-embed-text"),
    });

    const dimension = embeddings[0].length;

    try {
      await pgVector.createIndex({
        indexName: "guidelines",
        dimension: dimension,
        indexConfig: {
          type: "hnsw",
        },
      });
    } catch (error: any) {
      if (!error.message?.includes("already exists")) {
        throw error;
      }
      console.log("Index already exists, continuing with upsert");
    }

    await pgVector.upsert({
      indexName: "guidelines",
      vectors: embeddings,
      metadata: chunks.map((chunk) => ({
        text: chunk.text,
        createdAt: new Date().toISOString(),
      })),
    });
    console.log(
      "Vector database initialization completed for guidlines fromMarkdown",
    );
  } catch (error) {
    console.error("Error initializing guidlines vector database:", error);
  }
}

initializeVectorDB()

export const agentGuidelinesTool = createVectorQueryTool({
  vectorStoreName: 'pgVector',
  indexName: 'guidelines',
  id: "agentGuidelinesTool",
  model: ollama.embedding('nomic-embed-text'),
  description: "Access the CareConnect hospital guidelines and policies"
});
