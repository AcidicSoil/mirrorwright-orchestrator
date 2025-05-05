---
agent: augment
purpose: integration
id: handoff-vibecheck-assistant-integration
version: 1.0.0
---

# 📦 Handoff: VibeCheck Assistant Rule Integration

## Context

ChatGPT has completed:
- `vibe-check.rules.yaml` (invocation + fallback logic)
- `vibe-check-routing.json` (PromptRouter heuristic)
- `usage-patterns.md` (cross-agent strategic scenarios)
- `README.md` (bundle overview)

## Location

Proposed path:  
`docs/strategic-ai-reference/assistants/vibe-check/`

## Task

1. Move completed artifacts into the directory above.
2. Validate the YAML + JSON syntax for runtime ingestion.
3. Register `vibe-check` agent in agent registry.
4. Ensure PromptRouter reads routing file dynamically.
5. Confirm AgentFactory and AgentWrapper can interface with `VibeCheckAdapter`.

## Notes

All tools (`vibe_check`, `vibe_distill`, `vibe_learn`) assume synchronous call capability via NPM integration. No HTTP fallback required unless directed by PromptRouter fallback logic.

---
note:
  Also log milestone as `vibecheck-integration-handoff` under internal strategic AI tracking.
  Tag: `#milestone-vibecheck-mcp-core`
---

#handoff→Augment #handoff→PromptRouter #handoff→Cline #handoff→ChatGPT
