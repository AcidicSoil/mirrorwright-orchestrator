---
agent: strategicai
purpose: generation
id: gpt-4.5-prompt-generator
version: 1.0.0
---

# Mirrorwright Orchestrator - Assistant Prompt Generator

## Task

You are writing a **high-quality assistant prompt** for the Mirrorwright Orchestrator system.

The assistant role is:
> "{{assistant.description}}"

The current project state includes:

```text
{{projectStateSnapshot}}
```

## Your Output Should

- Begin with `# Cursor {{assistant.name}}: [Title]`
- Include 2–3 paragraphs of instruction
- Focus on specific, contextual, actionable tasks for the assistant
- Follow this outline:

1. **[Area 1]**
   - Task A
   - Task B

2. **[Area 2]**
   - Task A
   - Task B

3. **[Area 3]**
   - Task A
   - Task B

End with a closing paragraph that defines **success criteria**.

Model: GPT-4.5
Goal: Long-form clarity, domain-specific fidelity, aligned with `.cursorrules`
