# Mirrorwright Orchestrator Project Structure

This document provides an overview of the Mirrorwright Orchestrator project's directory structure and organization.

## Directory Structure

```text
mirrorwright-orchestrator/
├── docs/                        # High-level design docs, diagrams
├── protocols/                   # User-defined protocol files (YAML/JSON/MD)
│   └── default-protocol.yaml
├── src/
│   ├── engine/                  # Core execution & mode/ritual engine
│   ├── orchestrator/            # Runtime container for agent orchestration
│   ├── agents/                  # Agent interface layer abstractions
│   ├── cli/                     # CLI entrypoint & commands
│   ├── examples/                # Example implementations
│   ├── schemas/                 # JSON Schema definitions
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Shared helpers (config loading, logging)
├── tests/                       # Unit & integration tests
└── examples/                    # Sample protocols & ritual runs
```

## Key Components

### Protocol Management

The `protocols/` directory contains user-defined protocol files, including:
- Protocol definitions
- Mode configurations
- Ritual definitions
- Prompt templates

### Core Engine

The `src/engine/` directory contains the core execution and mode/ritual engine, including:
- Mode Engine: Loads mode definitions, manages active state/context
- Ritual Engine: Parses ritual steps, executes commands, manages context

### Orchestration

The `src/orchestrator/` directory contains the runtime container for agent orchestration, including:
- Agent Registry: Manages agent registration and lifecycle
- Message Bus: Routes messages between agents
- Runtime Container: Coordinates agent interactions

### Agent Interface

The `src/agents/` directory contains abstractions for agent interfaces, including:
- Agent adapters for different agent types
- Capability definitions
- Message handling logic

### CLI

The `src/cli/` directory contains the command-line interface for the Mirrorwright Orchestrator, including:
- Command definitions
- Argument parsing
- Execution logic

### Schemas

The `src/schemas/` directory contains JSON Schema definitions for validating protocol files, including:
- Protocol schema
- Mode schema
- Ritual schema
- Message schema

### Utilities

The `src/utils/` directory contains shared helpers and utilities, including:
- Configuration loading
- Logging
- Schema validation
- File operations

## Technology Stack

- **Language & Runtime**: TypeScript on Node.js (v18+)
- **Package Manager**: pnpm
- **CLI Framework**: Commander.js
- **Config & Protocol Files**: YAML with JSON Schema validation
- **JSON Schema Validation**: AJV
- **Testing**: Vitest
- **Logging**: Pino
