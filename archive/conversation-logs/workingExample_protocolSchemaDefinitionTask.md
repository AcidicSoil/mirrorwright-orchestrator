
# Working Example: Protocol Schema Definition Task

Here's a ready-to-use example showing how to apply our enhanced prompt structure for your next Mirrorwright Orchestrator development task:

```markdown
# Mirrorwright Orchestrator - Strategic AI Prompt

## Initial Context Setup
🤖 Understood: Working alongside my multi-agent Cursor system (Cline, Augment) and `.cursorrules` framework.

We are continuing development on our **Mirrorwright Orchestrator** project, focusing on implementing the core protocol components from our clean-slate approach.

## Task Context
We need to define and implement the Protocol Schema structure for Mirrorwright. Based on our earlier planning, we need to create detailed TypeScript interfaces and corresponding JSON schemas for the core protocol concepts: Protocols, Modes, and Rituals.

Specifically, I need help designing the schema validation approach that will ensure user-authored protocol files (in YAML/JSON) conform to our expected structure before being loaded into the engine.

## Working Model: GPT-4.5
(Selected for specification writing and schema design)

## Implementation Phase: Protocol Definition

## Expected Output:
1. Expanded TypeScript interface definitions for Protocol, Mode, and Ritual entities, building upon our initial types
2. A recommended approach for JSON Schema validation of these structures
3. Example of how validation would be implemented in the codebase
4. Considerations for extending the schema in the future

## Additional Context or Constraints:
- We've already established initial TypeScript interfaces in our planning:
```typescript
export interface Protocol {
  id: string;
  name: string;
  description?: string;
  modes: string[];
  rituals: Record<string, RitualDefinition>;
}

export interface ModeDefinition {
  id: string;
  name: string;
  entryRitual: string;
  exitRitual?: string;
  config?: Record<string, any>;
}

export interface RitualDefinition {
  id: string;
  steps: RitualStep[];
  description?: string;
}

export interface RitualStep {
  type: 'prompt' | 'action' | 'pause';
  content: string;
  next?: string;
}
```
- We're using Ajv for JSON Schema validation
- All protocol files will be authored in YAML for readability but processed as JSON internally
```

## How to Use This Example

1. **Copy and Paste**: Use this template in your next ChatGPT conversation.

2. **Adjust as Needed**: Modify the task context, model selection, and expected outputs based on your current focus.

3. **Sequential Development**:
   - After receiving a response on the schema structure, you could follow up with:
     - A prompt for Cursor Cline to implement the schema files
     - A subsequent task to design the loading/validation mechanism
     - A task to create example protocol files using the schema

4. **Model Ensemble Check**: For critical schema decisions, consider running a separate prompt with GPT-4o to get a second perspective on the schema design, then reconcile the approaches.

This practical example is ready for immediate use and demonstrates how to effectively communicate your task needs within the Mirrorwright project context.
