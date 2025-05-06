---
agent: strategicai
purpose: kickoff
id: lm-studio-integration-kickoff
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — LM Studio Integration Kickoff

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Implementing LM Studio as a provider in the Mirrorwright Orchestrator to enable testing of local models through LM Studio's accelerated backend support and access to its wide selection of models available from Huggingface.

---

## 🧩 Current Phase

- [x] Implementation & Prototyping

---

## 🤖 Working Model

- [x] GPT-4.5 – specs/documentation/creative depth

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `src/just_prompt/atoms/llm_providers/` (from just-prompting repo)
- `src/just_prompt/atoms/shared/data_types.py` (from just-prompting repo)
- `src/orchestrator/runtime.ts` (from mirrorwright-orchestrator)
- `src/types/agent.ts` (from mirrorwright-orchestrator)
- LM Studio API documentation: https://lmstudio.ai/docs/app/api/tools

### Relevant Memory Bank Tags:
[#integration], [#provider], [#lm-studio], [#local-models], [#tool-calling]

---

## ✅ Expected Output

1. A new LM Studio provider implementation in the Mirrorwright Orchestrator
2. Support for local model testing with accelerated backend
3. Integration with LM Studio's tool calling capabilities
4. Documentation on setup and usage of LM Studio provider

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported

Additional considerations:
- LM Studio operates as a local server with an OpenAI-compatible API
- Need to handle model loading and configuration
- Must support tool calling for agent functionality
- Should provide graceful fallbacks when specific models don't support certain features
- Need to handle both GGUF and MLX model formats

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "LM Studio Provider Integration" \
  --tags provider,lm-studio,local-models,tool-calling \
  --notes "Implementation of LM Studio as a provider in Mirrorwright Orchestrator for local model testing with accelerated backend support"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

- **Prompt for Augment:** _"Implement the LMStudioAdapter class in TypeScript following the provider pattern established in the codebase. Include support for tool calling and model configuration."_
- **Prompt for Cline:** _"Plan the integration architecture for LM Studio provider, including configuration options, model loading, and error handling strategies."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need to add LM Studio as a provider to our Mirrorwright Orchestrator repository. This will allow us to test models through LM Studio's accelerated backend support and access their wide selection of models available from Huggingface. 

LM Studio operates as a local server with an OpenAI-compatible API, but we need to handle specific aspects like model loading, configuration, and tool calling support. I want to follow the same provider pattern we've established in the codebase.

The key requirements are:
1. Create an LMStudioAdapter class
2. Support tool calling for agent functionality
3. Handle both GGUF and MLX model formats
4. Provide configuration options for the local server
5. Implement proper error handling and logging
6. Document the setup and usage process

Please help me plan and implement this integration.

### Assistant:
I'll help you plan and implement the LM Studio integration for Mirrorwright Orchestrator. This is an excellent addition that will enhance local model testing capabilities with accelerated backend support.

## Integration Architecture Overview

The LM Studio integration will follow our established provider pattern with these components:

1. **LMStudioAdapter**: Core adapter class implementing the `IAgentAdapter` interface
2. **LMStudioClient**: Client for communicating with the LM Studio API
3. **LMStudioConfig**: Configuration options for the LM Studio provider
4. **LMStudioService**: Service layer for managing LM Studio interactions
5. **Types and Interfaces**: For LM Studio-specific data structures

## Implementation Plan

### Phase 1: Core Infrastructure

1. **Create Provider Types**
   - Add LM Studio to provider enums in `src/types/agent.ts`
   - Define LMStudioConfig interface with server URL, model options, etc.
   - Create type definitions for LM Studio API responses

2. **Implement LMStudioClient**
   - Create HTTP client for LM Studio's OpenAI-compatible API
   - Implement methods for model loading, chat completions, etc.
   - Add error handling and retry logic

3. **Develop LMStudioAdapter**
   - Implement IAgentAdapter interface
   - Handle message formatting and response parsing
   - Support tool calling capabilities

### Phase 2: Advanced Features

4. **Tool Calling Support**
   - Implement function calling format compatible with LM Studio
   - Add support for parsing tool call responses
   - Create utilities for tool registration and execution

5. **Model Management**
   - Add support for listing available models
   - Implement model loading and configuration
   - Handle both GGUF and MLX model formats

6. **Error Handling & Logging**
   - Implement comprehensive error handling
   - Add detailed logging for debugging
   - Create recovery mechanisms for common failures

### Phase 3: Documentation & Testing

7. **Documentation**
   - Create setup guide for LM Studio integration
   - Document configuration options and best practices
   - Add examples for common use cases

8. **Testing**
   - Create unit tests for LMStudioAdapter and client
   - Implement integration tests with actual LM Studio server
   - Add performance benchmarks for different models

## Technical Considerations

- LM Studio uses an OpenAI-compatible API but may have subtle differences
- Need to handle model loading states (loaded, loading, not loaded)
- Tool calling support varies by model, need graceful fallbacks
- Local server connection requires proper error handling for offline scenarios
- Configuration should support both default and custom model paths

This integration will significantly enhance our local development capabilities and provide a pathway for testing with a wide range of models without relying on cloud APIs.

Would you like me to start with implementing any specific component of this plan first?

### User:
Let's start with implementing the core LMStudioAdapter class and the necessary types. Please provide the implementation code for these components.

### Assistant:
[Assistant's follow-up response]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
