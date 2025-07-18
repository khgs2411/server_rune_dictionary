# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Deploy
- `bun run build` - Build the project using docts
- `bun run deploy` - Deploy to DigitalOcean serverless functions 
- `bun run publish` - Build and deploy in sequence
- `bun run destroy` - Remove deployment from DigitalOcean
- `bun run url` - Get the deployed function URL

### Function Management
- `bun run new` - Create new serverless function
- `bun run remove` - Remove serverless function

### Testing and Code Quality
- `bun run test` - Run tests (currently just "test" command)
- ESLint and Prettier are configured but no package.json scripts exist for them
- TypeScript compilation uses `noEmit: true` (no build output)

## Architecture Overview

This is a **serverless TypeScript application** designed for DigitalOcean Functions that provides a rune dictionary API with MongoDB persistence.

### Core Architecture Pattern
The application follows a **strategy pattern** with action-based routing:
1. **Entry Point**: `src/main/index/index.ts` - Main serverless function handler
2. **Request Processing**: `src/App.ts` - Central request processor with strategy pattern
3. **Action Routing**: Actions are parsed and routed to appropriate services (rune, aspect, auth)

### Key Components

**Base Classes** (`src/base/`):
- `service.base.ts` - Base service class with run function pattern
- `database.base.ts` - Database connection base
- `singleton.ts` - Singleton pattern implementation  
- `provider.base.ts` - Provider pattern base

**Domain Layer** (`src/application/domain/`):
- `rune/` - Rune entity with types, enums, and properties
- `aspect/` - Aspect entity with types, enums, and properties

**Service Layer** (`src/application/services/`):
- `runes.service.ts` - CRUD operations for runes
- `aspects.service.ts` - CRUD operations for aspects  
- `auth.service.ts` - Authentication service

**Data Layer** (`src/database/`):
- `connections/mongodb.database.ts` - MongoDB connection management
- `models/` - Mongoose models for all entities
- `repositories/` - Repository pattern for data access

### Request Flow
1. Request enters via `main/index/index.ts`
2. `App.Request()` authenticates user and determines strategy
3. `App.Process()` routes to appropriate service based on action type
4. Service executes specific action method
5. Response formatted and returned via `App.Response()`

### Action System
Actions follow pattern: `{TYPE}_{VERB}_{ENTITY}` (e.g., `RUNE_GET_RUNES`, `ASPECT_INSERT_ASPECT`)
- Parsed to determine strategy type (rune, aspect, auth)
- Routed to corresponding service's Call method
- Service maps action to specific implementation method

### Database Integration
- Uses Mongoose ODM with MongoDB
- Connection initialized once and reused (serverless optimization)
- Repository pattern abstracts data access from services
- Models define schema and validation

### Authentication
- API key-based authentication via `AuthService.Authenticate()`
- User context passed through ProcessArgs to all services