# Strategic Usage Patterns for VibeCheck

## When to Invoke

| Scenario                            | Recommended Tool | Trigger Type |
|-------------------------------------|------------------|--------------|
| Agent is looping or verbose         | `vibe_check`     | pattern      |
| Prompt is too complex or chaotic    | `vibe_distill`   | manual or auto |
| Post-resolution reflection needed   | `vibe_learn`     | automatic    |

## Cross-Agent Use Cases

### 🧠 Cline (Scaffolding Agent)
- **Trigger**: Gets stuck re-parsing user requirements
- **Tool**: `vibe_check`
- **Effect**: Reframe user intent to reset context

### 🛠 Augment (Implementation Agent)
- **Trigger**: Encountering complex codeflow + unhelpful LLM completions
- **Tool**: `vibe_distill`
- **Effect**: Collapse into minimal directive or stepwise guide

### 🧭 ChatGPT (Strategic AI)
- **Trigger**: Overloaded user prompt that lacks direction
- **Tool**: `vibe_distill` → optionally `vibe_learn`
- **Effect**: Clarify focus → log what was learned

---
