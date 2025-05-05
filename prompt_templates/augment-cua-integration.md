---
agent: augment
purpose: implementation
id: augment-cua-integration
version: 1.0.0
cu_intent: true
cu_actions:
  - open_file
  - write_file
  - run_command
---

# Prompt for Cursor Augment: CUA Integration

## Task Overview

As the assistant responsible for scaffolding, optimization, and refactoring, implement the LangGraph node wrapping `langgraph-cua-py` with schema-compliant input/output. Register the route in PromptRouter and validate `.cursorrules` for new `CUA_AGENT_ROLE` permissions. Add dry-run safety features.

## Implementation Requirements

1. **Schema Implementation**
   - Create the CUAction schema in `src/schemas/cuaction.schema.json`
   - Create TypeScript interfaces for CUAction in `src/types/cuaction.ts`
   - Ensure schema validation using AJV

2. **LangGraph Node Implementation**
   - Create the LangGraph node interface in `src/types/langgraph.ts`
   - Implement the CUA LangGraph node in `src/agents/CUAAdapter.ts`
   - Add support for dry-run mode for safety

3. **PromptRouter Integration**
   - Create the CUA intent router in `src/router/CUAIntentRouter.ts`
   - Add detection for file operations, command execution, and web browsing
   - Implement natural language parsing for CUA intents

4. **Memory Integration**
   - Create the CUA memory manager in `src/memory/CUAMemoryManager.ts`
   - Add support for recording CUA actions and their results
   - Implement filtering and retrieval of CUA actions

5. **Security Features**
   - Implement path validation for file operations
   - Add command allowlist for command execution
   - Add timeout support for long-running operations
   - Implement dry-run mode for testing without execution

6. **Documentation**
   - Create documentation for the CUA integration in `docs/strategic-ai-reference/tools/langgraph-cua-py-integration.md`
   - Create schema documentation in `docs/strategic-ai-reference/schemas/cuaction.schema.md`
   - Create documentation for Augment's CUA routing in `docs/strategic-ai-reference/assistants/augment-cua-routing.md`

7. **Testing**
   - Create tests for the CUA adapter in `tests/cua/cuaAdapter.test.ts`
   - Create tests for the CUA intent router in `tests/cua/cuaIntentRouter.test.ts`
   - Create tests for the CUA memory manager in `tests/cua/cuaMemoryManager.test.ts`

## Technical Constraints

- Use TypeScript for all implementation
- Follow the existing project structure and patterns
- Ensure all code is properly typed and documented
- Add appropriate error handling
- Implement security features to prevent unauthorized access
- Use dry-run mode by default for safety

## Example Usage

```typescript
// Example of using the CUA integration
const cuaAdapter = new CUAAdapter({
  type: AgentType.augment,
  dryRunDefault: true
});

const cuaIntentRouter = new DefaultCUAIntentRouter();
const cuaMemoryManager = new DefaultCUAMemoryManager();

// Process a natural language prompt
const prompt = 'Please read the file package.json';

if (cuaIntentRouter.detectCUAIntent(prompt)) {
  const cuaRequest = cuaIntentRouter.extractCUARequest(prompt, 'agent-id');
  
  if (cuaRequest) {
    const response = await cuaAdapter.send({
      prompt: JSON.stringify(cuaRequest),
      context: { cuaRequest }
    });
    
    const cuaResponse = JSON.parse(response.content);
    await cuaMemoryManager.recordAction(cuaRequest, cuaResponse);
    
    // Process the response
    console.log(cuaResponse.result);
  }
}
```

## Deliverables

1. Schema and interface files
2. CUA adapter implementation
3. CUA intent router implementation
4. CUA memory manager implementation
5. Documentation files
6. Test files
7. Example usage file

## References

- [LangGraph Documentation](https://python.langchain.com/docs/langchain_graph)
- [AJV Documentation](https://ajv.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Conversation

### User:

Implement LangGraph node wrapping `langgraph-cua-py` with schema-compliant input/output. Register route in PromptRouter and validate `.cursorrules` for new `CUA_AGENT_ROLE` permissions. Add dry-run safety.

### Assistant:

I'll implement the LangGraph node for CUA integration with all the required components. Let me break this down into steps:

1. First, I'll create the schema and interfaces for CUAction requests and responses
2. Then I'll implement the LangGraph node interface and CUA adapter
3. Next, I'll create the CUA intent router for detecting and routing CUA intents
4. I'll add memory integration for tracking CUA actions
5. Finally, I'll update .cursorrules to include the CUA_AGENT_ROLE

Let me start with the schema implementation:

[Implementation details follow...]

I've completed the implementation with the following files:

- `src/schemas/cuaction.schema.json`: Schema for CUA actions
- `src/types/cuaction.ts`: TypeScript interfaces for CUA actions
- `src/types/langgraph.ts`: LangGraph node interface
- `src/agents/CUAAdapter.ts`: CUA adapter implementation
- `src/router/CUAIntentRouter.ts`: CUA intent router
- `src/memory/CUAMemoryManager.ts`: CUA memory manager
- `docs/strategic-ai-reference/tools/langgraph-cua-py-integration.md`: Integration documentation
- `docs/strategic-ai-reference/schemas/cuaction.schema.md`: Schema documentation
- `docs/strategic-ai-reference/assistants/augment-cua-routing.md`: Augment routing documentation
- `tests/cua/cuaAdapter.test.ts`: CUA adapter tests
- `tests/cua/cuaIntentRouter.test.ts`: CUA intent router tests
- `tests/cua/cuaMemoryManager.test.ts`: CUA memory manager tests
- `src/examples/cuaExample.ts`: Example usage

I've also updated `.cursorrules` to include the CUA_AGENT_ROLE and appropriate permissions.

All implementations include dry-run safety features, with dry-run mode enabled by default in the CUA adapter.

Would you like me to explain any specific part of the implementation in more detail?
