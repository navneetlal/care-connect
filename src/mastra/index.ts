import { Mastra } from "@mastra/core";

import { careConnectAgent } from "./agents/assistant";

export const mastra = new Mastra({
  agents: { careConnectAgent },
  telemetry: {
    enabled: false
  }
});
