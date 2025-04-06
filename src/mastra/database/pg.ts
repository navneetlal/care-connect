import { PgVector } from "@mastra/pg";
import pkg from "pg";

import * as constant from '../contants'

const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "care_connect",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
});

export const pgVector = new PgVector(
  `postgresql://${constant.DB_USER}:${constant.DB_PASSWORD}@${constant.DB_HOST}:${constant.DB_PORT}/${constant.DB_NAME}`,
);

export default pool;
