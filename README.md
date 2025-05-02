# Mirrorwright Orchestrator

A TypeScript-based protocol orchestration framework for managing multi-agent workflows with structured communication, role clarity, and reflective loops.

## Overview

Mirrorwright Orchestrator is a robust, flexible framework designed to implement the Mirrorwright Protocol for multi-agent orchestration. It provides tools for defining, validating, and executing protocols that coordinate AI agents through strategic planning, scaffolding, and refinement processes.

## Features

- **Protocol Management**: Define, store, and retrieve strategic protocols including canvases, mode definitions, ritual definitions, and templates
- **Mode & Ritual Engine**: Load mode definitions, parse ritual steps, and manage active state/context
- **Execution Engine**: Orchestrate agent interactions, execute commands, and manage context between steps
- **Schema Validation**: Ensure protocol definitions adhere to specified schemas

## Project Structure

```
mirrorwright-orchestrator/
├── docs/                        # High-level design docs, diagrams
├── protocols/                   # User-defined protocol files (YAML/JSON/MD)
│   └── default-protocol.yaml
├── src/
│   ├── engine/                  # Core execution & mode/ritual engine
│   ├── agents/                  # Agent interface layer abstractions
│   ├── cli/                     # CLI entrypoint & commands
│   ├── schemas/                 # JSON Schema definitions
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Shared helpers (config loading, logging)
├── tests/                       # Unit & integration tests
└── examples/                    # Sample protocols & ritual runs
```

## Technology Stack

- **Language & Runtime**: TypeScript on Node.js (v18+)
- **Package Manager**: pnpm
- **CLI Framework**: Commander.js
- **Config & Protocol Files**: YAML with JSON Schema validation
- **JSON Schema Validation**: AJV
- **Testing**: Vitest
- **Logging**: Pino

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AcidicSoil/mirrorwright-orchestrator.git
cd mirrorwright-orchestrator

# Install dependencies
pnpm install

# Build the project
pnpm build
```

### Usage

```bash
# Run in development mode
pnpm dev

# Run tests
pnpm test
```

## Development

This project is in active development. Contributions are welcome!

## License

[MIT](LICENSE)
