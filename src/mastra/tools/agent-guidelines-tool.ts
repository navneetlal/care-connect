import { embedMany, embed } from "ai";
import { PgVector } from "@mastra/pg";
import { createVectorQueryTool, MDocument } from "@mastra/rag";
import { readFileSync } from "node:fs";
import { ollama } from "ollama-ai-provider";

import * as constant from "../contants";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { createTool } from "@mastra/core";

async function initializeVectorDB() {
  try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDirPath = dirname(currentFilePath);
    const basePath = resolve(currentDirPath, "../..");

    const guidelinesPath = join(
      basePath,
      "src/mastra/knowledge_base/guidelines.md",
    );

    console.log(basePath);

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

    const pgVector = new PgVector(
      `postgresql://${constant.DB_USER}:${constant.DB_PASSWORD}@${constant.DB_HOST}:${constant.DB_PORT}/${constant.DB_NAME}`,
    );

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

// initializeVectorDB()

// export const agentGuidelinesTool = createVectorQueryTool({
//   vectorStoreName: 'pgVector',
//   indexName: 'guidelines',
//   id: "agentGuidelinesTool",
//   model: ollama.embedding('nomic-embed-text'),
//   description: "Access the CareConnect hospital guidelines and policies",
// });
//
// // Define proper schemas for the tool
const GuidelinesQueryInputSchema = z.object({
  query: z.string().describe("The text to search for in the guidelines"),
  topK: z
    .number()
    .optional()
    .default(3)
    .describe("Number of results to return"),
});

const GuidelinesQueryOutputSchema = z.object({
  results: z.array(
    z.object({
      text: z.string(),
      score: z.number().optional(),
    }),
  ),
  message: z.string().optional(),
});

// Create a custom tool instead of using createVectorQueryTool
export const checkAgentGuidelinesTool = createTool({
  id: "checkAgentGuidelinesTool",
  description:
    "Search for information in the CareConnect hospital guidelines and policies",
  inputSchema: GuidelinesQueryInputSchema,
  outputSchema: GuidelinesQueryOutputSchema,
  execute: async ({ context }) => {
    try {
      console.log("✉️ checkAgentGuidelinesTool called with:", context);

      const { embedding } = await embed({
        model: ollama.embedding("nomic-embed-text"),
        value: context.query,
      });

      const pgVector = new PgVector(
        `postgresql://${constant.DB_USER}:${constant.DB_PASSWORD}@${constant.DB_HOST}:${constant.DB_PORT}/${constant.DB_NAME}`,
      );

      // Search the vector database
      const searchResults = await pgVector.query({
        indexName: "guidelines",
        queryVector: embedding,
      });

      if (!searchResults || searchResults.length === 0) {
        return {
          results: [],
          message: "No relevant information found in the guidelines.",
        };
      }

      return {
        results: searchResults.map((result) => ({
          text: result.metadata?.text,
          score: result.score,
        })),
      };
    } catch (error) {
      console.error("Error in agentGuidelinesTool:", error);
      return {
        results: [],
        message: "Unable to search guidelines at this time due to an error.",
      };
    }
  },
});
