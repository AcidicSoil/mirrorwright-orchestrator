# PromptRouter Integration with VibeCheck

This document describes the integration between the PromptRouter and VibeCheck in the Mirrorwright Orchestrator.

## Overview

The PromptRouter is responsible for routing messages to the appropriate agent based on routing configurations. It has been enhanced to support VibeCheck-specific message types and to provide a service for programmatically triggering VibeCheck.

## Components

### PromptRouter

The PromptRouter has been enhanced to support VibeCheck-specific message types:

- `vibe_check`: Trigger a metacognitive check on a plan or approach
- `vibe_distill`: Simplify a complex plan
- `vibe_learn`: Learn from a mistake

It also supports routing messages to VibeCheck based on:

- Pattern triggers: Keywords in the message content
- Tag triggers: Tags in the message metadata
- Message type triggers: Specific message types

### PromptRouterService

The PromptRouterService provides a centralized service for routing logic and methods for programmatically triggering VibeCheck:

- `routeMessage`: Route a message to the appropriate agent
- `triggerVibeCheck`: Trigger VibeCheck with a message
- `triggerVibeCheckWithPlan`: Trigger VibeCheck with a plan
- `triggerVibeDistill`: Trigger VibeDistill with a plan
- `triggerVibeLearn`: Trigger VibeLearn with a mistake
- `shouldRouteToVibeCheck`: Check if a message should be routed to VibeCheck

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

## Usage

### Basic Usage

The PromptRouter is automatically used by the runtime container to determine the recipient of messages that don't have a specified recipient:

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

## Examples

See the `src/examples/promptRouterVibeCheckExample.ts` file for a complete example of using the PromptRouterService with VibeCheck.

## Testing

The integration between the PromptRouter and VibeCheck is tested in the `tests/integration/VibeCheckIntegration.test.ts` file.

## Next Steps

- Add support for more trigger types
- Add support for more VibeCheck-specific message types
- Add support for more agents
- Add support for more routing configurations
- Add support for more fallback behaviors
