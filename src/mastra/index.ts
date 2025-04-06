import { Mastra } from "@mastra/core";

import { careConnectAgent } from "./agents/assistant";
import { pgVector } from './database/pg'

export const mastra = new Mastra({
  agents: { careConnectAgent },
  vectors: {
    pgVector
  },
  telemetry: {
    enabled: false
  }
});
