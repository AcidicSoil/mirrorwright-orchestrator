---
agent: strategicai
purpose: implementation
id: assistant-rules-update-request
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Creating updated system instruction rule files for all assistants to govern response outputs and ensure consistent, high-quality interactions across the Mirrorwright Orchestrator system.

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
- `.cursorrules` - Current cursor rules file
- `.cursorrules-quickref.md` - Quick reference for cursor rules
- `prompt_templates/mirrorwright-strategic-ai-conversation-template.md` - Strategic AI conversation template
- `assistant-prompts/all-assistant-prompts.md` - Current assistant prompts

### Relevant Memory Bank Tags:
[#agent], [#rules], [#prompt], [#system-instructions], [#orchestration]

---

## ✅ Expected Output

1. Updated system instruction rule files for each assistant (Cline, Augment, Roo, VibeCheck, StrategicAI, PromptRouter)
2. Each rule file should include:
   - Clear role definition and responsibilities
   - Response format guidelines
   - Interaction patterns with other assistants
   - Output validation criteria
   - Error handling procedures
   - Context preservation mechanisms
3. A unified approach to system instructions that maintains each assistant's unique capabilities while ensuring protocol compliance

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported
- [x] Must align with existing `.cursorrules` structure
- [x] Should incorporate YAML frontmatter for validation
- [x] Must support the extraction process via `extractAssistantPrompts.ts`

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Assistant Rules Update" \
  --tags system-instructions,agent-rules,protocol-compliance \
  --notes "Created updated system instruction rule files for all assistants to govern response outputs"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the updated assistant rule files following the specified structure. Ensure each file includes proper frontmatter and follows the established patterns."_
- **Prompt for Cline:** _"Plan the integration of the updated assistant rules with the existing orchestration system, including validation and testing strategies."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need updated system instruction rule files for all our assistants (Cline, Augment, Roo, VibeCheck, StrategicAI, PromptRouter) to govern their response outputs. Each assistant should have clear guidelines on their role, response format, interaction patterns with other assistants, and error handling procedures. The rules should maintain each assistant's unique capabilities while ensuring protocol compliance across the Mirrorwright Orchestrator system.

Please provide a comprehensive plan for creating these updated rule files, including the structure, key components, and implementation approach. The files should be compatible with our existing `.cursorrules` structure and support the extraction process via `extractAssistantPrompts.ts`.

### Assistant:
[Assistant's response here]

### User:
[Your follow-up question or feedback]

### Assistant:
[Assistant's follow-up response]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
