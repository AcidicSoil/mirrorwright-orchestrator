# Mirrorwright Orchestrator System Patterns

## Architecture Overview

Mirrorwright Orchestrator follows a modular, layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Orchestration Layer                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ ModeEngine  │  │RitualEngine │  │ProtocolValidator│  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                     Runtime Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │AgentRegistry│  │ MessageBus  │  │RuntimeContainer │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                      Agent Layer                        │
└─────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Protocol-First Design

All interactions are defined through structured protocols, which serve as contracts between components. This ensures:

- **Clear interfaces** between components
- **Validation** of inputs and outputs
- **Documentation** of expected behavior
- **Testability** of components in isolation

Example:
```yaml
protocol:
  name: "agent-interaction"
  version: "1.0.0"
  steps:
    - name: "initialize"
      agent: "primary"
      action: "setup"
    - name: "process"
      agent: "worker"
      action: "execute"
    - name: "finalize"
      agent: "primary"
      action: "cleanup"
```

### 2. Registry Pattern

The `AgentRegistry` maintains a catalog of available agents and their capabilities, allowing:

- **Dynamic discovery** of agents
- **Capability-based routing** of messages
- **Lifecycle management** of agent instances
- **Configuration** of agent parameters

### 3. Message Bus Pattern

The `MessageBus` provides a centralized communication channel for agents, supporting:

- **Publish-subscribe** messaging
- **Request-response** interactions
- **Broadcast** messages to multiple agents
- **Filtering** of messages based on topics or content

### 4. Container Pattern

The `RuntimeContainer` provides a controlled execution environment for agents, handling:

- **Initialization** of agent instances
- **Resource allocation** and management
- **Isolation** between agent executions
- **Cleanup** after agent execution

### 5. Pipeline Pattern

Rituals are executed as pipelines of steps, with:

- **Sequential execution** of steps
- **Conditional branching** based on step results
- **Error handling** and recovery
- **Data flow** between steps

### 6. Validator Pattern

The `ProtocolValidator` ensures that all protocols, rituals, and modes conform to their schemas, providing:

- **Schema validation** of protocol definitions
- **Runtime validation** of inputs and outputs
- **Error reporting** with detailed diagnostics
- **Schema evolution** support
