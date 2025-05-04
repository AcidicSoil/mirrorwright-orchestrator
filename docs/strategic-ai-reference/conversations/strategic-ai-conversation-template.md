# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

[Fill in the current objective — e.g., "Refining Agent Interface Layer architecture", "Implementing CLI for ritual execution", "Writing docs for mode schema"]

---

## 🧩 Current Phase
(Select one from the dropdowns below)

- [ ] Architecture Planning
- [ ] Protocol Definition
- [ ] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Model
(Use model matching per `.cursorrules-quickref.md` and memory bank guidance)

- [ ] GPT-4o – systems/architecture/visual reasoning
- [ ] GPT-4.5 – specs/documentation/creative depth
- [ ] GPT-4o-mini – speed/iteration/CLI+tests
- [ ] Multi-Model – ensemble/reconciliation

---

## 📦 Task Input

### Input Files / Schemas / Specs:
[Reference any filenames (e.g., `protocols/agent-sync.yaml`, `tools/validate.ts`, etc.)]

### Relevant Memory Bank Tags:
[#protocol], [#agent], [#ritual], [#cli], [#docs], [#test], etc.

---

## ✅ Expected Output

[Be precise — e.g., "Compare message bus vs. direct agent wiring", "List schema fields for mode files", "Draft a CLI interface contract with options + flags"]

---

## ⚠️ Constraints or Considerations

- [ ] Must maintain protocol validation (`ajv` or equivalent)
- [ ] Must be extensible to new agent types or schema evolutions
- [ ] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [ ] Recovery and error logging required (define how)
- [ ] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [ ] Synchronous + async operation supported

[Add any additional requirements or references here]

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Task Title Here" \
  --tags task-category,component-name,template-type \
  --notes "Brief description of task outcome or decision"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"[Implementation task for Augment - e.g., 'Implement ComponentName.ts using specified pattern. Include validators for each type.']"_
- **Prompt for Cline:** _"[Planning task for Cline - e.g., 'Plan usage patterns for command-name, including options and validation toggles.']"_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
[Your initial prompt or question here]

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
