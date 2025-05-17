# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

Harvester is a TypeScript project that uses Bun as its runtime, structured with a monorepo approach using workspaces:

- **pkg/api**: Express server implementing an RPC API with function registration and validation

  - Provides endpoints for health checks (`_health`), API information (`_info`), and RPC calls (`_rpc`)
  - Uses Zod schemas for request validation
  - Functions can be registered via the `addFunction` system

- **pkg/runner**: Client for examining data sources and uploading the data.

  - Uses the `ky` HTTP client library
  - Includes a JSON parser for traversing and analyzing JSON structures
  - Contains utilities for validating API responses against Zod schemas

- **pkg/shared**: Shared types and utilities used across packages

  - Defines common Zod schemas and type definitions
  - Shared utility functions for schema handling

## Common Commands

### Installation

```bash
# Install all dependencies
bun install
```

### TypeScript Type Checking

```bash
# Type check all packages
bun run ts-check

# Type check a specific package
cd pkg/api
bun run --filter "{package name}" ts-check
```

### Testing

```bash
# Run tests
bun test

# Run a specific test file
bun test pkg/runner/json-parser.test.ts
```

### Running

```bash
# Run the API server
cd pkg/api
bun run index.ts

# Run the runner client
cd pkg/runner
bun run index.ts
```

## Development Notes

- API functions are registered in `pkg/api/functions/_register.ts` and implemented in individual files in the
  `pkg/api/functions/` directory
- New API functions should use the shared Zod schemas or define new ones in the appropriate package
- Changes to shared types should be coordinated across packages
- Tests use Bun's built-in test framework (`bun:test`)

