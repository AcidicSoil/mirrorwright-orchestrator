---
agent: strategicai
purpose: example
id: strategic-ai-conversation-example
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Designing the Agent Interface Layer architecture to enable seamless communication between different agent types while maintaining protocol compliance.

---

## 🧩 Current Phase

- [x] Architecture Planning
- [x] Protocol Definition
- [ ] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning
- [ ] GPT-4.5 – specs/documentation/creative depth
- [ ] GPT-4o-mini – speed/iteration/CLI+tests
- [ ] Multi-Model – ensemble/reconciliation

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `src/orchestrator/runtime.ts` - Current runtime container implementation
- `protocols/default/schemas/agent-message.yaml` - Agent message schema
- `src/validator/ValidatorEngine.ts` - Validation engine for protocol compliance

### Relevant Memory Bank Tags:
[#agent], [#protocol], [#architecture], [#message-bus]

---

## ✅ Expected Output

A detailed architecture proposal for the Agent Interface Layer, including:

1. Recommended approach with justification (message bus vs. direct communication)
2. Key components and their responsibilities
3. Communication flow diagrams
4. Interface definitions for agent integration
5. Error handling and recovery strategies
6. Considerations for future extensibility

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported

Additional requirements:
- Must work with our existing TypeScript/Node.js codebase
- Must support multiple agent types (LLM, rule-based, human-in-the-loop)
- Must provide clear error handling and recovery mechanisms

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Agent Interface Layer Architecture Decision" \
  --tags architecture-decision,component-agent,pattern-message-bus \
  --notes "Selected message bus pattern for agent communication with centralized validation"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement AgentInterface.ts using message bus abstraction. Include validators for each message type."_
- **Prompt for Cline:** _"Plan CLI usage patterns for agent-run command, including dry-run mode and validation toggles."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
What's the most effective architecture for implementing the Agent Interface Layer that will enable seamless communication between different agent types while maintaining protocol compliance? We're considering two main approaches: a Message Bus Pattern with a central message bus that all agents connect to, or Direct Agent Communication where agents communicate directly with each other. Both would leverage our ValidatorEngine for message validation.

### Assistant:
Based on your requirements and the Mirrorwright Orchestrator's architecture, I recommend the **Message Bus Pattern** as the optimal approach for your Agent Interface Layer. Here's my detailed analysis:

## Architecture Recommendation: Message Bus Pattern

### Key Components & Responsibilities

1. **AgentMessageBus**
   - Central hub for all agent communication
   - Handles message routing based on agent IDs and message types
   - Enforces protocol validation via ValidatorEngine
   - Maintains message history and state

2. **AgentInterface**
   - Abstract class/interface that all agents implement
   - Provides standard methods for connecting to the message bus
   - Defines message handling callbacks
   - Includes lifecycle hooks (init, start, teardown)

3. **MessageValidator**
   - Extension of ValidatorEngine focused on agent messages
   - Validates messages against protocol schemas
   - Provides typed validation errors for agents

4. **AgentRegistry**
   - Manages agent registration and discovery
   - Maintains agent metadata and capabilities
   - Handles agent lifecycle events

### Communication Flow

```
Agent A → AgentInterface → MessageValidator → AgentMessageBus → MessageValidator → AgentInterface → Agent B
```

This centralized approach offers several advantages:

1. **Centralized Validation**: All messages pass through a single validation point, ensuring protocol compliance
2. **Simplified Agent Implementation**: Agents only need to implement the AgentInterface, not worry about routing
3. **Message Tracing**: Easier to trace message flows and debug communication issues
4. **Extensibility**: New agent types can be added without modifying existing agents
5. **Middleware Support**: Can add middleware for logging, transformation, etc.

### Error Handling Strategy

1. **Validation Errors**: Caught at the MessageValidator level, returned to sending agent
2. **Delivery Errors**: Handled by the MessageBus with retry policies
3. **Agent Failures**: Detected via heartbeats, with recovery options

### Interface Definition (TypeScript)

```typescript
interface AgentMessage {
  id: string;
  type: string;
  sender: string;
  recipient: string | 'broadcast';
  payload: unknown;
  timestamp: number;
  correlationId?: string;
}

interface AgentInterface {
  id: string;
  capabilities: string[];

  // Lifecycle
  init(): Promise<void>;
  start(): Promise<void>;
  teardown(): Promise<void>;

  // Messaging
  sendMessage(message: AgentMessage): Promise<void>;
  onMessage(callback: (message: AgentMessage) => Promise<void>): void;

  // Status
  getStatus(): AgentStatus;
}
```

Would you like me to elaborate on any specific aspect of this architecture?

### User:
This looks excellent. Could you provide more details on how the MessageBus would handle asynchronous communication patterns? Also, how would you recommend implementing the agent discovery mechanism?

### Assistant:
I'd be happy to elaborate on those aspects of the MessageBus architecture!

## Asynchronous Communication Patterns in MessageBus

The MessageBus should support multiple asynchronous patterns to accommodate different agent interaction needs:

### 1. **Publish/Subscribe Pattern**

```typescript
interface MessageBus {
  // For topic-based messaging
  publish(topic: string, payload: unknown): Promise<void>;
  subscribe(topic: string, callback: (payload: unknown) => Promise<void>): Subscription;
}
```

This allows:
- One-to-many communication
- Interest-based message filtering
- Decoupled communication where publishers don't need to know subscribers

### 2. **Request/Response Pattern**

```typescript
interface MessageBus {
  // For RPC-like interactions
  request<T>(agentId: string, requestType: string, payload: unknown, timeout?: number): Promise<T>;
  registerHandler(requestType: string, handler: (payload: unknown) => Promise<unknown>): void;
}
```

This enables:
- Waiting for responses to specific requests
- Timeout handling for unresponsive agents
- Correlation of requests and responses

### 3. **Event Streams**

```typescript
interface MessageBus {
  // For continuous data flows
  createStream(streamId: string): MessageStream;
  subscribeToStream(streamId: string): AsyncIterable<unknown>;
}
```

Perfect for:
- Long-running processes with incremental results
- Real-time data processing
- Progress reporting

### 4. **Message Queuing**

```typescript
interface MessageBus {
  // For guaranteed delivery
  enqueue(queue: string, message: AgentMessage): Promise<void>;
  processQueue(queue: string, handler: (message: AgentMessage) => Promise<void>): QueueProcessor;
}
```

Benefits:
- Persistence across restarts
- Load balancing across multiple agent instances
- Retry mechanisms for failed processing

## Agent Discovery Implementation

For agent discovery, I recommend a hybrid approach combining static registration and dynamic discovery:

### 1. **AgentRegistry Service**

```typescript
class AgentRegistry {
  // Static registration
  registerAgent(agentMetadata: AgentMetadata): void;
  unregisterAgent(agentId: string): void;

  // Discovery
  getAgentById(agentId: string): AgentMetadata | null;
  findAgentsByCapability(capability: string): AgentMetadata[];
  findAgentsByType(agentType: string): AgentMetadata[];

  // Events
  onAgentRegistered(callback: (agent: AgentMetadata) => void): void;
  onAgentUnregistered(callback: (agentId: string) => void): void;
}

interface AgentMetadata {
  id: string;
  type: string;
  capabilities: string[];
  status: AgentStatus;
  endpoints?: {
    http?: string;
    websocket?: string;
    grpc?: string;
  };
  properties: Record<string, unknown>;
}
```

### 2. **Discovery Mechanisms**

1. **Startup Registration**:
   - Agents register with the AgentRegistry during initialization
   - Configuration-based static agent list for core system agents

2. **Heartbeat & Health Checks**:
   ```typescript
   interface AgentRegistry {
     startHealthChecks(intervalMs: number): void;
     updateAgentStatus(agentId: string, status: AgentStatus): void;
   }
   ```

3. **Capability Advertisements**:
   - Agents periodically broadcast their capabilities
   - Registry updates capability index for efficient lookup

4. **Dynamic Discovery Protocol**:
   ```typescript
   // Special message types
   const DISCOVERY_MESSAGE_TYPES = {
     DISCOVERY_REQUEST: 'agent.discovery.request',
     DISCOVERY_RESPONSE: 'agent.discovery.response',
     CAPABILITY_ADVERTISEMENT: 'agent.capability.advertisement',
   };
   ```

### 3. **Implementation Strategy**

```typescript
// In RuntimeContainer.ts
class RuntimeContainer {
  private agentRegistry: AgentRegistry;
  private messageBus: MessageBus;

  constructor() {
    this.agentRegistry = new AgentRegistry();
    this.messageBus = new MessageBus(this.agentRegistry);

    // Connect registry and message bus
    this.agentRegistry.onAgentRegistered((agent) => {
      this.messageBus.notifyAgentJoined(agent);
    });

    this.agentRegistry.onAgentUnregistered((agentId) => {
      this.messageBus.notifyAgentLeft(agentId);
    });

    // Setup discovery protocol handlers
    this.messageBus.registerHandler(
      DISCOVERY_MESSAGE_TYPES.DISCOVERY_REQUEST,
      this.handleDiscoveryRequest.bind(this)
    );
  }

  private async handleDiscoveryRequest(payload: unknown): Promise<AgentMetadata[]> {
    const { capabilities, types } = payload as DiscoveryRequest;
    let agents: AgentMetadata[] = [];

    if (capabilities && capabilities.length > 0) {
      agents = this.agentRegistry.findAgentsByCapability(capabilities[0]);
      // Filter for additional capabilities
      for (let i = 1; i < capabilities.length; i++) {
        agents = agents.filter(agent =>
          agent.capabilities.includes(capabilities[i])
        );
      }
    } else if (types && types.length > 0) {
      agents = [];
      for (const type of types) {
        agents.push(...this.agentRegistry.findAgentsByType(type));
      }
    } else {
      // Return all agents if no filters specified
      agents = this.agentRegistry.getAllAgents();
    }

    return agents;
  }
}
```

This approach provides:
1. **Flexibility**: Works with both static and dynamic agent populations
2. **Resilience**: Handles agent failures and restarts gracefully
3. **Efficiency**: Optimized lookups for common discovery patterns
4. **Extensibility**: Can add new discovery mechanisms without breaking existing ones

Would you like me to elaborate on any other aspects of the MessageBus or agent discovery implementation?

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
