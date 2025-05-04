---
agent: promptrouter
purpose: implementation
id: promptrouter-intent-routing
version: 1.0.0
---

# Prompt for Cursor PromptRouter: Intent-Based Routing System

As the assistant responsible for routing user prompts to the optimal model and protocol phase context, please develop an intent-based routing system that will:

1. Analyze user prompts to determine the underlying intent and task type
2. Select the most appropriate model (GPT-4o, GPT-4.5, GPT-4o-mini) based on the task requirements
3. Determine the relevant protocol phase context for the prompt
4. Route the prompt to the appropriate assistant with the necessary context
5. Track routing decisions and outcomes to improve future routing accuracy

The routing system should be implemented as a module that integrates with the existing orchestration framework and should be configurable to adapt to new models and protocol phases as they are added.

Label the PR: `[#orchestration] Intent-Based Prompt Routing System`
