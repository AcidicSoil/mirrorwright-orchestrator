# Mirrorwright Orchestrator

A TypeScript-based protocol orchestration framework for managing multi-agent workflows with structured communication, role clarity, and reflective loops.

## Overview

Mirrorwright Orchestrator is a robust, flexible framework designed to implement the Mirrorwright Protocol for multi-agent orchestration. It provides tools for defining, validating, and executing protocols that coordinate AI agents through strategic planning, scaffolding, and refinement processes.

## Features

- **Protocol Management**: Define, store, and retrieve strategic protocols including canvases, mode definitions, ritual definitions, and templates
- **Mode & Ritual Engine**: Load mode definitions, parse ritual steps, and manage active state/context
- **Execution Engine**: Orchestrate agent interactions, execute commands, and manage context between steps
- **Schema Validation**: Ensure protocol definitions adhere to specified schemas
- **Runtime Container**: Manage agent lifecycle, registration, and message routing between agents
  - **Advanced Message Routing**: Support for broadcast messages, message filtering, and capability-based routing
  - **Message Validation**: Schema-based validation of messages to ensure protocol compliance
  - **Agent Capabilities**: Capability-based message handling and routing

## Project Structure

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

# Kickoff with the initial prompt
cat kickoff-prompt-mirrorwright.txt | pnpm dev

# Reference documentation
see mirrorwright-reference.md for detailed usage
```

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

See the example in `src/examples/runtimeExample.ts` for a complete demonstration.

### Advanced Message Routing

The Mirrorwright Orchestrator supports advanced message routing features:

```typescript
import { createRuntimeContainer, RuntimeContainerOptions } from './src/orchestrator/runtime';
import { MessageBusType } from './src/orchestrator/MessageBusFactory';

// Create a runtime container with advanced message bus
const options: RuntimeContainerOptions = {
  messageBusType: MessageBusType.ADVANCED
};
const container = createRuntimeContainer(options);

// Register agents
container.registerAgent(agent1);
container.registerAgent(agent2);

// Initialize and start the container
await container.init();
await container.start();

// Send a broadcast message to all agents
await container.sendMessage({
  id: 'broadcast-1',
  from: 'agent-1',
  to: '*', // Broadcast to all agents
  type: 'notification',
  payload: { level: 'info', message: 'System starting' },
  timestamp: Date.now()
});

// Access the advanced message bus for filtering
const advancedMessageBus = container.messageBus as any;
if (advancedMessageBus.addFilter) {
  // Add a filter that only accepts messages of a specific type
  advancedMessageBus.addFilter('agent-2', (message) => message.type === 'command');
}
```

See the example in `src/examples/advancedRuntimeExample.ts` for a complete demonstration of advanced features.

## Development

This project is in active development. Contributions are welcome!

### Agent Guidelines

The Mirrorwright Orchestrator uses a multi-agent approach for development:

- **Cursor Cline**: Strategic planning and requirements clarification
- **Cursor Augment**: Scaffolding, architecture setup, optimization, and refactoring
- **Cursor Roo**: Autonomous code-generation and CLI tooling specialist
- **ChatGPT**: Strategy and meta-thinking

For detailed guidelines on using the Augment agent, see [Augment Agent Guidelines](docs/augment-agent-guidelines.md).

For examples of using Roo for code generation, see the example rituals in `protocols/examples/roo-codegen.yaml`.

## License

[MIT](LICENSE)
