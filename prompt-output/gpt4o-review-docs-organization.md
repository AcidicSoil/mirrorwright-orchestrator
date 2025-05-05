---
agent: strategicai
purpose: Review and evaluate documentation organization proposals
id: gpt4o-review-docs-organization
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Reviewing and evaluating the proposed documentation organization strategy for Mirrorwright Orchestrator, focusing on the strategic-ai-reference directory structure, README templates, and $docref linking approach.

---

## 🧩 Current Phase

- [x] Implementation & Prototyping
- [x] Documentation & Examples

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `docs/strategic-ai-reference/docs-upload-strategy.md`
- `docs/strategic-ai-reference/readme-templates.md`
- `tools/validate-docrefs.ts` (proposed)

### Relevant Memory Bank Tags:
[#documentation], [#strategy], [#assistant-infra], [#mirrorwright]

---

## ✅ Expected Output

1. Evaluate the proposed 7-category documentation organization structure
2. Assess the README templates for each subfolder
3. Review the $docref auto-linking strategy and format choices (.schema.md vs .schema.yaml)
4. Provide specific recommendations for improvements or alternatives
5. Identify any potential implementation challenges or missing considerations

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved

Additional considerations:
- Documentation must serve both human developers and AI assistants
- Structure should support automated extraction and validation
- Organization should reduce cognitive load and improve navigability
- System must scale as the project grows with new assistants and schemas

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Documentation Organization Strategy Review" \
  --tags documentation,strategic-ai-reference,docref \
  --notes "Evaluation of the proposed documentation structure, README templates, and $docref linking approach"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the strategic-ai-reference directory structure with README templates based on the reviewed strategy. Add $docref links to schema files using the approved format."_
- **Prompt for Cline:** _"Plan the integration of the documentation organization strategy with existing validation tools and CI/CD pipelines."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
As GPT-4o, please review our proposed documentation organization strategy for the Mirrorwright Orchestrator project. We've designed a structure centered around a `strategic-ai-reference` directory with 7 categories (core, schemas, tools, assistants, memory, templates, conversations), README templates for each subfolder, and a $docref linking system for schema files.

I'd like your assessment of:
1. The overall organization approach and category breakdown
2. The README template structure and content
3. The decision to use .schema.md over .schema.yaml for LLM-friendly access
4. The $docref linking conventions and validation approach

Please identify any potential issues, suggest improvements, and evaluate how well this structure will scale as our project grows. Consider both human developer and AI assistant usage patterns.

### Assistant:
[GPT-4o's response will appear here]

### User:
Based on your review, what specific implementation steps should we prioritize first? And are there any categories or documentation types we've overlooked that would be valuable for multi-agent orchestration?

### Assistant:
[GPT-4o's follow-up response will appear here]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
