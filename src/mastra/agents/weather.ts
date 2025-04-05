// import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createOllama } from "ollama-ai-provider";
import { weatherTool } from "../tools/weather-tool";

import { Memory } from "@mastra/memory";

const memory = new Memory({
  options: {
    lastMessages: 5, // Keep 5 most recent messages
  },
});

const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

const chat = ollama.chat("phi4-mini", {
  simulateStreaming: true,
});

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: chat,
  tools: { weatherTool },
  memory: memory,
});
