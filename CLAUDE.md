# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## RUNE Dictionary Server - DigitalOcean Serverless Functions

This is a serverless REST API service for the RUNE RPG game that handles runes, aspects, and user authentication. It's built with Bun.js and deployed to DigitalOcean Functions.

## Development Commands

### Building and Deployment
```bash
bun run build      # Build serverless function using docts
bun run deploy     # Deploy to DigitalOcean Functions
bun run publish    # Build and deploy in sequence
bun run url        # Get deployed function URLs
```

### Function Management
```bash
bun run new <method-name>     # Create new serverless function
bun run remove <method-name>  # Remove serverless function
bun run destroy               # Undeploy entire serverless package
```

## Architecture Overview

### Request Flow
The service follows a **Strategy Pattern** for request handling:

1. **Entry Point** (`src/main/index/index.ts`): DigitalOcean Function handler
2. **Request Processing** (`src/App.ts`): Main application controller
3. **Strategy Selection**: Routes requests based on action type to appropriate service
4. **Service Layer**: Domain-specific business logic (Runes, Aspects, Auth)
5. **Repository Layer**: Database operations with MongoDB

### Strategy Pattern Implementation
Actions follow the naming convention `{type}_{operation}` (e.g., `rune_get_runes`, `aspect_insert_aspect`):

- **rune_*** → RouteService (src/application/services/runes.service.ts:80)
- **aspect_*** → AspectService (src/application/services/aspects.service.ts:25)
- **auth_*** → AuthService (src/application/services/auth.service.ts:45)

### Database Architecture
- **MongoDB Atlas** connection with persistent connection pooling
- **Mongoose ODM** for data modeling
- **Repository Pattern** for data access abstraction
- Models: Users, Runes, Aspects, Characters, Logs

### Key Components

#### Authentication System
- API key-based authentication via `AuthService.Authenticate()`
- User validation occurs before all requests except OPTIONS preflight

#### CORS Configuration
Pre-configured CORS headers for cross-origin requests:
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials support enabled
- Custom headers: Authorization, X-Requested-With

#### Error Handling
Centralized error handling in `App.Error()` with structured error responses and logging via `Logger.GetInstance()`.

## Build System

### docts Configuration
The project uses **docts** (DigitalOcean CLI Tools) with custom Rollup configuration:

- **External Dependencies**: Mongoose kept external for optimal bundle size
- **Bundled Dependencies**: topsyde-utils bundled to resolve ES module issues
- **Bundle Analysis**: Automated size reporting and dependency analysis

### TypeScript Configuration
- **Base URL**: `./src` for absolute imports
- **Target**: ESNext with Node.js module resolution
- **Strict Mode**: Enabled with selective strictness flags

## Environment Variables

Required in `project.yml`:
```yaml
MONGO_USERNAME: your_atlas_username
MONGO_PASSWORD: your_atlas_password
MONGO_HOST: your_cluster_host
MONGO_DATABASE: your_database_name
```

## Development Notes

- **Use Bun**: All commands use `bun run` instead of `npm run`
- **Serverless Optimized**: Dependencies kept external for faster cold starts
- **Connection Persistence**: MongoDB connections are cached for performance
- **Memory Limit**: Functions configured with 512MB memory limit
- **Runtime**: Node.js 18 for DigitalOcean Functions compatibility