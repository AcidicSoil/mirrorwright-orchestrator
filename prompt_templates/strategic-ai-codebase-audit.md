---
agent: strategicai
purpose: audit
id: strategic-ai-codebase-audit
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Codebase Audit

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Conduct a comprehensive audit of the latest changes (past 24 hours) to identify architectural patterns, integration points, and optimization opportunities across the codebase.

---

## 🧩 Current Phase

- [x] Validation & Testing
- [x] Documentation & Examples

---

## 🤖 Working Model

- [x] GPT-4.5 – specs/documentation/creative depth

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `src/agents/VibeCheckAdapter.ts`
- `src/services/VibeCheckService.ts`
- `src/assistant/AssistantRulesRegistry.ts`
- `src/tools/improved-extractAssistantPrompts.js`
- `src/router/PromptRouter.ts`
- `src/services/PromptRouterService.ts`
- `docs/strategic-ai-reference/assistants/vibe-check/*`
- `src/schemas/assistant-rule.schema.yaml`
- `src/schemas/report.schema.yaml`

### Relevant Memory Bank Tags:
[#vibecheck], [#assistant-rules], [#prompt-extraction], [#integration], [#validation]

---

## ✅ Expected Output

1. Architectural assessment of recent integrations (VibeCheck, AssistantRulesRegistry, PromptRouter)
2. Identification of cross-cutting concerns and potential refactoring opportunities
3. Evaluation of test coverage and validation approaches
4. Recommendations for standardization across similar components
5. Suggestions for documentation improvements and knowledge sharing

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported

Additional considerations:
- Focus on integration points between components rather than individual implementations
- Identify patterns that could be standardized across the codebase
- Evaluate the balance between flexibility and complexity in recent additions
- Consider the impact on the overall developer experience and maintainability

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Strategic AI Codebase Audit" \
  --tags audit,architecture,integration,optimization \
  --notes "Comprehensive review of recent integrations with focus on architectural patterns and optimization opportunities"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the highest-priority optimizations identified in the Strategic AI audit, focusing on cross-cutting concerns and standardization opportunities."_
- **Prompt for Cline:** _"Plan a documentation sprint to address the gaps identified in the Strategic AI audit, with focus on developer onboarding and knowledge sharing."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need a comprehensive audit of our recent changes (past 24 hours) to identify architectural patterns, integration points, and optimization opportunities. We've implemented several major components including VibeCheck integration, AssistantRulesRegistry, and improved prompt extraction tools. I'm particularly interested in how these components interact, potential standardization opportunities, and recommendations for improving our overall architecture.

Please focus on:
1. Cross-cutting concerns across these new integrations
2. Patterns that could be standardized
3. Test coverage and validation approaches
4. Documentation gaps and knowledge sharing opportunities

### Assistant:
[Assistant's response here]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
