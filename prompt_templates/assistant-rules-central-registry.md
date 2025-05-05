---
agent: strategicai
purpose: implementation
id: assistant-rules-central-registry
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment, Roo, VibeCheck, PromptRouter) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Designing and implementing a centralized registry system for managing all assistant rules and instructions, creating a single point of contact for updates that propagate across the entire system.

---

## 🧩 Current Phase

- [x] Architecture Planning
- [ ] Protocol Definition
- [x] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning
- [ ] GPT-4.5 – specs/documentation/creative depth
- [ ] GPT-4o-mini – speed/iteration/CLI+tests
- [ ] Multi-Model – ensemble/reconciliation

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `.cursorrules` - Current cursor rules file with assistant definitions
- `src/tools/extractAssistantPrompts.ts` - Current prompt extraction tool
- `src/tools/prompt-extraction/AssistantRegistry.ts` - Existing assistant registry
- `src/schemas/report.schema.yaml` - Schema for Augment reports
- `prompt_templates/` - Directory with prompt templates
- `augment-userGuidelines.md` - Augment's guidelines

### Relevant Memory Bank Tags:
[#agent], [#rules], [#prompt], [#system-instructions], [#orchestration], [#multi-agent], [#role-boundaries]

---

## ✅ Expected Output

1. A comprehensive architecture for a centralized assistant rules registry system
2. Implementation plan for a TypeScript class that serves as the single point of contact
3. Schema definition for assistant rules
4. Integration strategy with existing tools (extractAssistantPrompts.ts)
5. CLI interface for updating assistant rules

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported
- [x] Must integrate with existing extraction process via `extractAssistantPrompts.ts`
- [x] Must support YAML frontmatter validation
- [x] Should include version control for assistant rules
- [x] Must provide a clear API for updating rules

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Assistant Rules Registry Architecture" \
  --tags agent,rules,system-instructions,registry \
  --notes "Centralized registry for managing all assistant rules with single update point"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the AssistantRulesRegistry class following the architecture design. Include validation, update methods, and integration with existing tools."_
- **Prompt for Cline:** _"Plan the CLI interface for the assistant rules registry, including command structure, options, and validation."_

---

## 📌 Reference

- **Kickoff Summary:** [Mirrorwright Assistant Rules Registry]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need a single point of contact for updating all assistant rules/instructions in the Mirrorwright Orchestrator. Currently, assistant definitions are in `.cursorrules`, prompts are extracted with `extractAssistantPrompts.ts`, and each assistant has its own guidelines. How can we create a centralized system that allows updating all assistant rules from one place while maintaining the existing extraction process and validation?

### Assistant:
[GPT-4o's response will go here]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
