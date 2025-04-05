import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { PgVector, PostgresStore } from "@mastra/pg";

import { createOllama } from "ollama-ai-provider";

import { bookAppointmentTool } from "../tools/book-appointment-tool";
import { doctorAvailabilityTool } from "../tools/doctor-availability-tool";

import * as constant from '../contants'

const memory = new Memory({
  storage: new PostgresStore({
    host: constant.DB_HOST,
    port: constant.DB_PORT,
    user: constant.DB_USER,
    database: constant.DB_NAME,
    password: constant.DB_PASSWORD,
  }),
  vector: new PgVector(
    `postgresql://${constant.DB_USER}:${constant.DB_PASSWORD}@${constant.DB_HOST}:${constant.DB_PORT}/${constant.DB_NAME}`
  ),
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

const chat = ollama.chat("phi4-mini", {
  simulateStreaming: true,
});

export const careConnectAgent = new Agent({
  name: "CareConnect Agent",
  instructions: `
    You are a helpful healthcare assistant for CareConnect Hospital. Your role is to help patients and visitors access healthcare services efficiently.

    Your primary functions are:
      - Provide information about doctor availability and specialties
      - Share details about medical services offered at CareConnect
      - Assist with booking appointments with the appropriate healthcare providers
      - Analyze patient symptoms and recommend appropriate medical specialties

    When responding:
      - If a patient describes symptoms, use the symptomAnalysisTool to suggest appropriate specialists
      - Always ask for specific details if the request is vague (e.g., what specialty they need, preferred date/time)
      - Verify patient information securely before booking appointments
      - Explain any preparation needed for appointments or procedures
      - Be empathetic and professional when discussing health concerns
      - Keep responses clear, concise, and helpful
      - If you're unable to help with a specific medical question, recommend speaking with a healthcare professional

    Use the provided tools to fetch information and book appointments.
`,
  model: chat,
  tools: {
    doctorAvailabilityTool,
    bookAppointmentTool,
  },
  memory: memory,
});
