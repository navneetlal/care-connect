import { Mastra } from "@mastra/core";

import { weatherAgent } from "./agents/weather";

export const mastra = new Mastra({
  agents: { weatherAgent },
  telemetry: {
    enabled: false
  }
});
