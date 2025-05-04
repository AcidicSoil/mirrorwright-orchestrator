# Mirrorwright Orchestrator

A TypeScript-based protocol orchestration framework for managing multi-agent workflows with structured communication, role clarity, and reflective loops.

## Overview

Mirrorwright Orchestrator is a robust, flexible framework designed to implement the Mirrorwright Protocol for multi-agent orchestration. It provides tools for defining, validating, and executing protocols that coordinate AI agents through strategic planning, scaffolding, and refinement processes.

## Features

- **Protocol Management**: Define, store, and retrieve strategic protocols including canvases, mode definitions, ritual definitions, and templates
- **Mode & Ritual Engine**: Load mode definitions, parse ritual steps, and manage active state/context
- **Execution Engine**: Orchestrate agent interactions, execute commands, and manage context between steps
- **Schema Validation**: Ensure protocol definitions adhere to specified schemas with optimized AJV implementation
- **Runtime Container**: Manage agent lifecycle, registration, and message routing between agents
  - **Advanced Message Routing**: Support for broadcast messages, message filtering, and capability-based routing
  - **Message Validation**: Schema-based validation of messages to ensure protocol compliance
  - **Agent Capabilities**: Capability-based message handling and routing

## Project Structure

```text
mirrorwright-orchestrator/
├── docs/                        # High-level design docs, diagrams
│   ├── strategic-ai-reference/  # Reference documentation for strategic AI
│   └── memory-bank-usage.md     # Memory bank usage guide
├── protocols/                   # User-defined protocol files (YAML/JSON/MD)
│   ├── core/                    # Core protocol definitions
│   │   └── schemas/             # JSON Schema definitions for protocols
│   └── default-protocol.yaml    # Default protocol configuration
├── prompt_templates/            # Templates for assistant prompts
├── src/
│   ├── agent-interface/         # Agent interface abstractions
│   ├── cli/                     # CLI entrypoint & commands
│   ├── engine/                  # Core execution & mode/ritual engine
│   │   ├── ModeEngine.ts        # Mode management and lifecycle
│   │   └── RitualEngine.ts      # Ritual execution and step processing
│   ├── orchestrator/            # Runtime container for agent orchestration
│   │   ├── runtime.ts           # Core runtime container implementation
│   │   └── AdvancedMessageBus.ts # Enhanced message routing
│   ├── schema/                  # Schema registry and management
│   │   └── SchemaRegistry.ts    # Centralized schema loading and caching
│   ├── tools/                   # Utility tools and scripts
│   │   ├── extractAssistantPrompts.js # Extract assistant prompts from conversations
│   │   └── prompt-extraction/   # Modular prompt extraction utilities
│   ├── types/                   # TypeScript type definitions
│   │   ├── engine.ts            # Engine interfaces
│   │   └── protocol.ts          # Protocol data models
│   ├── utils/                   # Shared helpers
│   │   ├── Logger.ts            # Logging utility
│   │   └── validateSchema.ts    # Schema validation wrapper
│   └── validation/              # Validation system
│       ├── ValidatorEngine.ts   # Unified validator with hooks and caching
│       └── MessageValidator.ts  # Message schema validation
├── tests/                       # Unit & integration tests
│   ├── engine/                  # Engine component tests
│   ├── orchestrator/            # Runtime container tests
│   └── validation/              # Validation system tests
├── tools/                       # Project tools and utilities
│   ├── memory_maintenance.py    # Memory bank maintenance
│   └── recreate-conversation.js # Conversation template creation
└── cursor-memory-bank/          # Cline memory bank for context persistence
```

## Technology Stack

- **Language & Runtime**: TypeScript on Node.js (v18+)
- **Package Manager**: pnpm
- **CLI Framework**: Commander.js
- **Config & Protocol Files**: YAML with JSON Schema validation
- **JSON Schema Validation**: AJV with optimizations
- **Testing**: Vitest
- **Logging**: Pino
- **Memory Management**: Cline Memory Bank

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

# Validate schemas
pnpm validate:all

# Extract assistant prompts
node src/tools/extractAssistantPrompts.js extractAssistantPrompts.md assistant-prompts

# Manage memory bank
python tools/memory_maintenance.py --list
```

## Core Components

### Schema Validation System

The Mirrorwright Orchestrator includes a robust schema validation system:

```typescript
import { schemaValidator } from './utils/validateSchema';

// Validate data against a schema
try {
  await schemaValidator.validate(modeData, 'mode');
  console.log('Mode is valid!');
} catch (error) {
  console.error('Validation failed:', error.message);
}

// Validate a file
const filePath = 'protocols/default/modes/meta-thinking.yaml';
await schemaValidator.validateFile(filePath);
```

The validation system features:

- Centralized schema registry with caching
- Optimized AJV configuration for performance
- Pre/post validation hooks for extensibility
- Detailed error reporting

### Runtime Container

The Mirrorwright Orchestrator includes a runtime container that manages agent lifecycle and message routing:

```typescript
import { createRuntimeContainer, Agent } from './src/orchestrator/runtime';

// Create a runtime container
const container = createRuntimeContainer();

// Register agents
container.registerAgent(myAgent);

// Initialize and start the container
await container.init();
await container.start();

// Send messages between agents
await container.sendMessage({
  id: 'msg-1',
  from: 'agent-1',
  to: 'agent-2',
  type: 'example',
  payload: { content: 'Hello!' },
  timestamp: Date.now()
});

// Tear down the container when done
await container.teardown();
```

### Mode & Ritual Engine

The Mode & Ritual Engine provides a flexible system for defining and executing agent workflows:

```typescript
import { ModeEngine } from './src/engine/ModeEngine';
import { RitualEngine } from './src/engine/RitualEngine';

// Initialize mode engine
const modeEngine = new ModeEngine();
await modeEngine.initializeModes(modes);

// Activate a mode
await modeEngine.activateMode('meta-thinking', { depth: 3 });

// Initialize ritual engine
const ritualEngine = new RitualEngine();
await ritualEngine.initializeRituals(rituals);

// Execute a ritual
const result = await ritualEngine.executeRitual('reflective-prompting', {
  input: 'How can I improve this design?'
});
```

The engine system features:

- Event-driven execution pipeline
- Extensible step handlers
- Context management between steps
- Validation integration

### Memory Bank System

The Mirrorwright Orchestrator includes a memory bank system for maintaining context across development sessions:

```bash
# Save a new memory
python tools/memory.py save --title "Task Title" --tags tag1,tag2 --notes "Important notes"

# Search existing memories
python tools/memory.py search --query "keywords"
```

The memory bank consists of core files:

- **projectbrief.md**: Foundation document that defines core requirements
- **activeContext.md**: Tracks current work focus
- **progress.md**: Tracks implementation status
- **tasks.md**: Central source of truth for task tracking

## Development

This project is in active development. Contributions are welcome!

### Agent Guidelines

The Mirrorwright Orchestrator uses a multi-agent approach for development:

- **Cursor Cline**: Strategic planning and requirements clarification
- **Cursor Augment**: Scaffolding, architecture setup, optimization, and refactoring
- **Cursor Roo**: Autonomous code-generation and CLI tooling specialist
- **ChatGPT**: Strategy and meta-thinking partner for high-level guidance

For detailed guidelines on using the Augment agent, see [Augment Agent Guidelines](docs/augment-agent-guidelines.md).

For strategic AI conversation templates, see [Strategic AI Conversation Template](prompt_templates/mirrorwright-strategic-ai-conversation-template.md).

## License

[MIT](LICENSE)
