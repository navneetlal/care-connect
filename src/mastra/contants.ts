// Model and API keys
export const MODEL_NAME = process.env.MODEL_NAME || "phi4-mini";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";

// Database configuration
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT || "5432");
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_NAME = process.env.DB_NAME || "care_connect";

// Application settings
export const APP_PORT = parseInt(process.env.APP_PORT || "3000");
export const APP_ENV = process.env.APP_ENV || "development";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

// Memory settings
export const MEMORY_MESSAGE_COUNT = parseInt(process.env.MEMORY_MESSAGE_COUNT || "10");
