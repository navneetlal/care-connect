import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { PGVECTOR_PROMPT } from "@mastra/rag";
import { PostgresStore } from "@mastra/pg";

import { createOllama } from "ollama-ai-provider";

import { agentGuidelinesTool } from "../tools/agent-guidelines-tool";
import { bookAppointmentTool } from "../tools/book-appointment-tool";
import { doctorAvailabilityTool } from "../tools/doctor-availability-tool";

import { pgVector } from '../database/pg'

import * as constant from '../contants'

const memory = new Memory({
  storage: new PostgresStore({
    host: constant.DB_HOST,
    port: constant.DB_PORT,
    user: constant.DB_USER,
    database: constant.DB_NAME,
    password: constant.DB_PASSWORD,
  }),
  vector: pgVector,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});

const ollama = createOllama({
  baseURL: constant.OLLAMA_BASE_URL,
});

const chat = ollama.chat("llama3.2:3b", {
  simulateStreaming: true
});

export const careConnectAgent = new Agent({
  name: "Sophia",
  instructions: `
  You are Sophia, a healthcare assistant for CareConnect Hospital. Help patients access healthcare services efficiently.

  Your primary functions are:
    - Provide information about doctor availability and specialties
    - Assist with booking appointments with appropriate healthcare providers
    - Analyze patient symptoms and recommend suitable medical specialties

  Important: Always use doctorAvailabilityTool to check availability and bookAppointmentTool to schedule appointments. Never attempt these functions without the proper tools.

  When you need guidance on workflows or procedures, search your knowledge base for relevant instructions.
  ${PGVECTOR_PROMPT}
`,
  model: chat,
  tools: {
    doctorAvailabilityTool,
    bookAppointmentTool,
    agentGuidelinesTool
  },
  memory: memory
});
