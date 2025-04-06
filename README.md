# CareConnect Hospital Assistant

A demonstration project showing how to build AI-powered agents using the Mastra framework. This project features a virtual healthcare assistant named Sophia that helps patients check doctor availability and book medical appointments.

## Overview

This is an educational project designed to showcase the capabilities of AI agents in a healthcare context. The agent can access external tools, maintain conversation history, and use vector search to retrieve relevant information from a knowledge base.

## Features

- **Doctor Availability Checking**: Query for doctors by specialty, name, or date
- **Appointment Booking**: Schedule appointments through a structured process
- **Conversation Memory**: Maintain context across multiple user interactions
- **Vector Knowledge Base**: Access guidelines through semantic search
- **Tool Integration**: Show how agents can use external services

## Project Structure

```
care-connect/
├── src/
│   └── mastra/
│       ├── agents/          # AI agent definitions
│       ├── database/        # Database connections and repositories
│       │   └── repositories/
│       ├── knowledge_base/  # Hospital guidelines and policies
│       ├── services/        # Core business logic
│       │   ├── appointment/
│       │   └── doctor/
│       ├── tools/           # Tools for the agent to use
│       ├── constants.ts     # Configuration constants
│       └── index.ts         # Main entry point
```

## Technologies Used

- **Mastra Framework**: Core agent framework with memory and tools
- **Ollama**: Local LLM provider for AI capabilities
- **PostgreSQL**: Database with pgvector extension for vector storage
- **TypeScript**: Type-safe development environment with Zod schemas

## Learning Points

This project demonstrates several key concepts in AI agent development:

1. **Tool-using Agents**: The agent uses specialized tools to perform actions like checking availability and booking appointments
2. **Contextual Memory**: Maintains conversation history for more natural interactions
3. **Vector Search**: Implements semantic search for retrieving relevant information
4. **Repository Pattern**: Organizes database access code in a maintainable way
5. **Type Safety**: Uses Zod schemas to define input/output types for tools

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL with pgvector extension
- Ollama for local LLM support

### Environment Variables

Create a `.env` file in the root directory:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=care_connect

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434/api
MODEL_NAME=llama3.2:3b

# Application Settings
APP_PORT=3000
APP_ENV=development
LOG_LEVEL=info
```

### Database Setup

1. Create the PostgreSQL database with pgvector extension
2. Create tables for doctors, patients, availability slots, and appointments

### Installation and Running

1. Install dependencies: `npm install`
2. Start Ollama server: `ollama serve`
3. Run the application: `npm start`

## Example Interactions

```
User: Hi, I need to see a dermatologist for a skin rash.

Sophia: Hello! I'm Sophia, a healthcare assistant for CareConnect. I'd be happy to help you find a dermatologist for your skin rash. Let me check which dermatologists are available. Could you let me know what day you're looking to book an appointment?

User: Is anyone available next Tuesday?

Sophia: Let me check the availability for dermatologists next Tuesday. One moment please...

[Agent uses doctorAvailabilityTool]

Sophia: Great news! We have 2 dermatologists available next Tuesday:

1. Dr. Sarah Johnson - Available at: 9:00 AM, 11:30 AM, 2:00 PM
2. Dr. Michael Chen - Available at: 10:15 AM, 3:45 PM

Which doctor would you prefer to see, and what time works best for you?
```

## Extending the Project

To add new capabilities to the agent:

1. Create new repositories for data access
2. Implement service functions for business logic
3. Build tools that connect to these services
4. Update the agent's instructions
5. Add relevant knowledge to the vector database

## License

This project is open source and available under the MIT license.
