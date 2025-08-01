# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rune Dictionary Server - DigitalOcean Serverless API

This is the dictionary server component of the Rune RPG multi-service architecture, providing a serverless API for game data management.

## Development Commands

```bash
# Build & Deployment
bun run build           # Build with docts
bun run deploy          # Deploy to DigitalOcean Functions
bun run publish         # Build and deploy sequence (build + deploy)
bun run destroy         # Undeploy from DigitalOcean Functions

# Function Management
bun run new             # Create new serverless function
bun run remove          # Remove serverless function
bun run url             # Get deployed function URL

# Development Scripts
bun scripts/run.scripts.ts  # Run utility scripts for testing services
```

## High-Level Architecture

### Service Structure
The server follows a **Strategy Pattern** architecture where requests are routed based on their action type:

1. **Entry Point** (`src/main/index/index.ts`):
   - Handles DigitalOcean Functions requests
   - Manages MongoDB connection persistence across invocations
   - Routes requests to App for processing

2. **Request Router** (`src/App.ts`):
   - Authenticates requests via API key
   - Determines strategy type (rune, aspect, auth) from action
   - Routes to appropriate service

3. **Service Layer** (`src/application/services/`):
   - `RuneService` - CRUD operations for runes
   - `AspectService` - CRUD operations for aspects
   - `AuthService` - API key authentication and user management

4. **Data Layer**:
   - **Models** (`src/database/models/`) - Mongoose schemas for MongoDB
   - **Repositories** (`src/database/repositories/`) - Data access layer
   - **Connection** (`src/database/connections/mongodb.database.ts`) - MongoDB connection management

### Key Architectural Patterns

1. **Serverless Optimization**:
   - Connection pooling for MongoDB to persist across function invocations
   - Lightweight initialization for cold starts

2. **Action-Based Routing**:
   - Actions follow pattern: `{ENTITY}_{OPERATION}_{TARGET}`
   - Examples: `RUNE_GET_RUNES`, `ASPECT_INSERT_ASPECT`, `AUTH_CREATE_USER`

3. **Base Classes**:
   - `BaseService` - Common service functionality
   - `Database` - Database connection abstraction
   - `Singleton` - Singleton pattern implementation

4. **Type Safety**:
   - Strong TypeScript typing throughout
   - Type guards for runtime validation
   - Domain-specific types in `application/domain/`

### Environment Configuration
The server expects these environment variables (configured in `project.yml`):
- `MONGO_USERNAME` - MongoDB Atlas username
- `MONGO_PASSWORD` - MongoDB Atlas password
- `MONGO_HOST` - MongoDB Atlas cluster host
- `MONGO_DATABASE` - Database name

### Integration with Other Services
- Provides game data (runes, aspects) to the client application
- Shared MongoDB models with matchmaking server
- Deployed via DigitalOcean Functions for serverless scaling

## Project Context
This server is part of the larger Rune RPG system. Refer to the parent `CLAUDE.md` file for overall architecture and cross-service documentation.

### Important Notes from Parent Documentation
- Use `bun` instead of `npm` for all JavaScript/TypeScript operations
- Database connection: Use `await Mongo.Connection()` 
- This is part of a multi-service game architecture with Vue 3 client and WebSocket matchmaking server