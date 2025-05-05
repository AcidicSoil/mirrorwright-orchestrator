# VibeCheck Integration

The Mirrorwright Orchestrator includes integration with VibeCheck, a metacognitive intervention agent that provides tools for interrupting stuck reasoning, simplifying complexity, and capturing learning.

## Overview

VibeCheck provides metacognitive oversight capabilities through three core tools:

1. **vibe_check**: Pattern interrupt mechanism to break tunnel vision
2. **vibe_distill**: Simplification tool to reduce complexity
3. **vibe_learn**: Feedback loop to record and learn from mistakes

## Architecture

The VibeCheck integration follows a modular approach with the following components:

- **VibeCheckClient**: Client for communicating with the vibe-check-mcp-server
- **VibeCheckService**: Service that provides the VibeCheck functionality with caching and error handling
- **VibeCheckAdapter**: Adapter that implements the AgentAdapter interface with session management
- **PromptRouter**: Router that routes messages to VibeCheck based on triggers
- **PromptRouterService**: Service that provides methods for programmatically triggering VibeCheck
- **Runtime Container**: Container that manages the lifecycle of the VibeCheck agent

### Component Diagram

```ascii
┌─────────────────┐    ┌─────────────────┐
│ Runtime         │    │  Agent Registry │
│ Container       │◄───┤                 │
└─────────────────┘    └─────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│ PromptRouter    │    │  Message Bus    │
└─────────────────┘    └─────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│ PromptRouter    │    │  Other Agent    │
│ Service         │    │    Adapters     │
└─────────────────┘    └─────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│ VibeCheckAdapter│    │  Other Services │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  VibeCheck      │
│   Service       │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  VibeCheck      │
│   Client        │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  vibe-check-    │
│   mcp-server    │
└─────────────────┘
```

## Usage

### Basic Usage

To use VibeCheck in your application:

```typescript
import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { RuntimeAgentWrapper } from '../orchestrator/RuntimeAgentWrapper';
import { v4 as uuidv4 } from 'uuid';

// Create the runtime container
const container = createRuntimeContainer();

// Create the VibeCheck agent
const vibeCheckConfig: AgentConfig = {
  type: AgentType.vibecheck,
  options: {
    apiKey: process.env.GEMINI_API_KEY,
    serverUrl: 'http://localhost:3000',
    timeout: 30000,
    maxRetries: 3,
    enableCaching: true,
    cacheTtl: 300000, // 5 minutes
    sessionId: 'my-session-id'
  }
};

const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);
const vibeCheckAgent = new RuntimeAgentWrapper(
  'vibecheck',
  'VibeCheck Agent',
  ['vibe_check', 'vibe_distill', 'vibe_learn'],
  vibeCheckAdapter
);

// Register the agent with the runtime container
container.registerAgent(vibeCheckAgent);

// Initialize and start the container
await container.init();
await container.start();

// Example of sending a vibe_check message
await container.sendMessage({
  id: uuidv4(),
  type: 'vibe_check',
  from: 'example',
  to: 'vibecheck',
  content: 'Check my plan',
  metadata: {
    phase: 'planning',
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux...'
  }
});

// Example of sending a vibe_distill message
await container.sendMessage({
  id: uuidv4(),
  type: 'vibe_distill',
  from: 'example',
  to: 'vibecheck',
  content: 'Distill my plan',
  metadata: {
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux, then add Material UI, then implement authentication with Firebase, then add real-time updates, then implement offline support, then add analytics, then optimize performance...'
  }
});

// Example of sending a vibe_learn message
await container.sendMessage({
  id: uuidv4(),
  type: 'vibe_learn',
  from: 'example',
  to: 'vibecheck',
  content: 'Learn from mistake',
  metadata: {
    mistake: 'Added too many features at once',
    category: 'Feature Creep',
    solution: 'Focus on core functionality first'
  }
});
```

### Using VibeCheckUtils

The VibeCheckUtils class provides helper functions for using VibeCheck tools:

```typescript
import { VibeCheckUtils } from '../utils/VibeCheckUtils';

// Example of using vibe_check
const checkResult = await VibeCheckUtils.check(
  container,
  {
    phase: 'planning',
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.'
  },
  'example'
);

console.log('VibeCheck Result:');
console.log(checkResult);

// Example of using vibe_distill
const distillResult = await VibeCheckUtils.distill(
  container,
  {
    plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.',
    userRequest: 'Create a simple todo app'
  },
  'example'
);

console.log('VibeDistill Result:');
console.log(distillResult);

// Example of using vibe_learn
const learnResult = await VibeCheckUtils.learn(
  container,
  {
    mistake: 'Implemented a complex database schema for a simple todo app',
    category: 'Complex Solution Bias',
    solution: 'Used a simpler data structure that meets the actual requirements'
  },
  'example'
);

console.log('VibeLearn Result:');
console.log(learnResult);

// Example of sending a command
const commandResult = await VibeCheckUtils.sendCommand(
  container,
  'clear_cache',
  {},
  'example'
);

console.log('Command Result:');
console.log(commandResult);
```

### Using the PromptRouter

The PromptRouter automatically routes messages to VibeCheck based on triggers defined in the routing configuration:

```typescript
// Send a message without specifying a recipient
await container.sendMessage({
  id: uuidv4(),
  type: 'text',
  from: 'example',
  content: 'I am stuck and need help', // This will trigger routing to VibeCheck
});

// Send a message with tags that trigger routing to VibeCheck
await container.sendMessage({
  id: uuidv4(),
  type: 'text',
  from: 'example',
  content: 'Need some guidance',
  metadata: {
    tags: ['#tunnel-vision'] // This will trigger routing to VibeCheck
  }
});
```

### Using the PromptRouterService

The PromptRouterService provides methods for programmatically triggering VibeCheck:

```typescript
import { createPromptRouterService } from '../services/PromptRouterService';

// Create the PromptRouterService
const promptRouterService = createPromptRouterService();

// Check if a message should be routed to VibeCheck
const message = {
  id: uuidv4(),
  type: 'text',
  from: 'example',
  content: 'I am stuck and need help'
};
const shouldRoute = promptRouterService.shouldRouteToVibeCheck(message);

// Trigger VibeCheck with a message
const vibeCheckMessage = promptRouterService.triggerVibeCheck(message, 'example');
await container.sendMessage(vibeCheckMessage);

// Trigger VibeCheck with a plan
const vibeCheckWithPlanMessage = promptRouterService.triggerVibeCheckWithPlan(
  'First, I will set up a React application with Redux...',
  'Create a simple todo app',
  'planning',
  'example'
);
await container.sendMessage(vibeCheckWithPlanMessage);

// Trigger VibeDistill with a plan
const vibeDistillMessage = promptRouterService.triggerVibeDistill(
  'First, I will set up a React application with Redux...',
  'Create a simple todo app',
  'example'
);
await container.sendMessage(vibeDistillMessage);

// Trigger VibeLearn with a mistake
const vibeLearnMessage = promptRouterService.triggerVibeLearn(
  'Added too many features at once',
  'Feature Creep',
  'Focus on core functionality first',
  'example'
);
await container.sendMessage(vibeLearnMessage);
```

For more information about the PromptRouter integration with VibeCheck, see the [PromptRouter VibeCheck Integration](./promptrouter-vibecheck-integration.md) documentation.

### Advanced Features

The VibeCheck integration includes several advanced features:

#### Session Management

VibeCheck supports session management to maintain context across multiple interactions:

```typescript
// Set the session ID when creating the agent
const vibeCheckConfig: AgentConfig = {
  type: AgentType.vibecheck,
  options: {
    apiKey: process.env.GEMINI_API_KEY,
    sessionId: 'my-session-id'
  }
};

// Update the session ID at runtime
await container.sendMessage({
  id: uuidv4(),
  type: 'command',
  from: 'example',
  to: 'vibecheck',
  content: 'Set session',
  metadata: {
    command: 'set_session',
    sessionId: 'new-session-id'
  }
});
```

#### Caching

VibeCheck supports caching to improve performance and reduce API calls:

```typescript
// Enable caching when creating the agent
const vibeCheckConfig: AgentConfig = {
  type: AgentType.vibecheck,
  options: {
    apiKey: process.env.GEMINI_API_KEY,
    enableCaching: true,
    cacheTtl: 300000 // 5 minutes
  }
};

// Clear the cache at runtime
await container.sendMessage({
  id: uuidv4(),
  type: 'command',
  from: 'example',
  to: 'vibecheck',
  content: 'Clear cache',
  metadata: {
    command: 'clear_cache'
  }
});
```

#### Natural Language Processing

VibeCheck can infer the tool type from natural language prompts:

```typescript
// Send a message that will be inferred as a vibe_check
await container.sendMessage({
  id: uuidv4(),
  type: 'text',
  from: 'example',
  to: 'vibecheck',
  content: 'I need a metacognitive check on my approach to break tunnel vision',
  context: {
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux...',
    phase: 'planning'
  }
});

// Send a message that will be inferred as a vibe_distill
await container.sendMessage({
  id: uuidv4(),
  type: 'text',
  from: 'example',
  to: 'vibecheck',
  content: 'Please simplify this complex plan',
  context: {
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux...'
  }
});

// Send a message that will be inferred as a vibe_learn
await container.sendMessage({
  id: uuidv4(),
  type: 'text',
  from: 'example',
  to: 'vibecheck',
  content: 'Learn from mistake: Overcomplicating solution, category: Complex Solution Bias, solution: Simplify approach'
});
```

## Configuration

### VibeCheck Routing Configuration

The VibeCheck routing configuration is defined in `docs/strategic-ai-reference/assistants/vibe-check/vibe-check-routing.json`:

```json
{
  "id": "vibe-check-routing",
  "agent": "PromptRouter",
  "triggers": [
    {
      "type": "pattern",
      "keywords": ["stuck", "loop", "repeating", "what now", "idk", "too complex"],
      "agent_scope": ["cline", "augment", "chatgpt"]
    },
    {
      "type": "tag",
      "tags": ["#tunnel-vision", "#overload", "#fail-loop"]
    },
    {
      "type": "message_type",
      "messageTypes": ["vibe_check", "vibe_distill", "vibe_learn"]
    }
  ],
  "route_to": "vibe-check",
  "fallback_behavior": {
    "onFailure": "chatgpt",
    "response": "Simulating `vibe_distill` locally. Suggesting simplified framing."
  }
}
```

### VibeCheck Rules

The VibeCheck rules are defined in `docs/strategic-ai-reference/assistants/vibe-check/vibe-check.rules.yaml`:

```yaml
agent: vibe-check
id: vibe-check.rules
version: 1.0.0

role: metacognitive-intervention
category: strategic-ai
integration_target: mirrorwright-orchestrator

invocation:
  trigger_conditions:
    - agent_output_contains: ["looping", "stuck", "repeating", "unclear"]
    - context_tag: ["#overload", "#tunnel-vision", "#complexity", "#error-loop"]
    - agent_type_in: ["chatgpt", "cline", "augment"]
    - promptrouter_hint: ["invoke: vibe-check"]
  frequency: adaptive
  fallback_behavior: >
    If VibeCheck cannot be reached or invoked, the host agent should trigger an internal
    prompt to pause and offer a simple clarification step or suggest requesting human guidance.
```

## Testing

The VibeCheck integration includes comprehensive tests:

- **Unit Tests**:
  - `VibeCheckClient.test.ts`: Tests for the client that communicates with the vibe-check-mcp-server
  - `VibeCheckService.test.ts`: Tests for the service that provides caching and error handling
  - `VibeCheckAdapter.test.ts`: Tests for the adapter that implements the AgentAdapter interface
  - `VibeCheckUtils.test.ts`: Tests for the helper functions for using VibeCheck tools
  - `PromptRouterService.test.ts`: Tests for the service that provides methods for programmatically triggering VibeCheck

- **Integration Tests**:
  - `VibeCheckIntegration.test.ts`: Tests for the integration with the runtime container, PromptRouter, and PromptRouterService

To run the tests:

```bash
# Run all VibeCheck tests
npm test -- --testPathPattern=VibeCheck

# Run specific test files
npm test -- tests/clients/VibeCheckClient.test.ts
npm test -- tests/services/VibeCheckService.test.ts
npm test -- tests/agents/VibeCheckAdapter.test.ts
npm test -- tests/utils/VibeCheckUtils.test.ts
npm test -- tests/integration/VibeCheckIntegration.test.ts
```

## Troubleshooting

### Common Issues

1. **Connection Issues**:
   - Ensure the vibe-check-mcp-server is running and accessible at the configured URL
   - Check that the API key is valid
   - Verify network connectivity

2. **Initialization Failures**:
   - Check the server health status
   - Ensure the server is properly configured
   - Check for error messages in the logs

3. **Routing Issues**:
   - Verify that the routing configuration is loaded correctly
   - Check that the message format matches the expected format
   - Ensure the PromptRouter is properly initialized

### Debugging

To enable debug logging:

```typescript
// Set the log level to debug
import { Logger } from '../utils/Logger';
Logger.setLevel('debug');
```

## Future Improvements

- **Enhanced Session Management**: Add support for persistent sessions across restarts
- **Advanced Caching**: Implement more sophisticated caching strategies
- **Custom Prompts**: Allow customization of the prompts used for each tool
- **Metrics and Monitoring**: Add support for collecting metrics and monitoring
- **Batch Processing**: Add support for batch processing of messages
- **Error Handling**: Improve error handling and recovery
- **Offline Mode**: Add support for offline operation when the server is not available
- **Streaming Responses**: Add support for streaming responses for long-running operations
- **Multi-Agent Collaboration**: Enhance integration with other agents for collaborative problem-solving
- **Enhanced PromptRouter Integration**: Add support for more trigger types and routing strategies
- **Automated Triggering**: Implement automatic triggering of VibeCheck based on agent behavior patterns
- **Feedback Loop**: Implement a feedback loop to improve routing decisions based on outcomes
