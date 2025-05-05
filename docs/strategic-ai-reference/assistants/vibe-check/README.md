# VibeCheck Integration (Assistant: `vibe-check`)

This folder contains rule definitions, routing heuristics, and strategic usage guides for the VibeCheck metacognitive tools integrated into the Mirrorwright Orchestrator.

## Purpose

Enable interruption of stuck, looping, or overly complex agent behaviors through metacognitive intervention tools:
- `vibe_check` — interrupt and reframe
- `vibe_distill` — simplify and collapse complexity
- `vibe_learn` — learn from recovery

## Contents

| File                        | Description                                      |
|-----------------------------|--------------------------------------------------|
| `vibe-check.rules.yaml`     | YAML rules file defining invocation logic        |
| `vibe-check-routing.json`   | PromptRouter routing heuristics and fallbacks    |
| `usage-patterns.md`         | Strategic scenarios for invocation               |

## Integration Targets

- PromptRouter (routing triggers)
- Cline, Augment, ChatGPT (eligible invoking agents)
- Runtime AgentWrapper (to monitor, invoke, and log)

---
