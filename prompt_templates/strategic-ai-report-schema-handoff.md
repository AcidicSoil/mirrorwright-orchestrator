---
agent: strategicai
purpose: handoff
id: strategic-ai-report-schema-handoff
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment, Roo) and governed by `.cursorrules`.

This prompt finalizes a validation framework for Augment's output reports. It includes schema definition, valid and invalid fixtures, and proposes CI/CD integration to ensure structured, cross-agent-readable feedback on protocol refinement.

---

## 🎯 Task Context

Deliver a validation-ready schema and fixture suite for Augment Output Reports to standardize feedback and agent handoffs during protocol optimization. Ensure the reports are both human-readable and machine-parseable for downstream use by Roo, Cline, CI tools, and Strategic AI.

---

## 🧩 Current Phase

- [x] Validation & Testing
- [x] Documentation & Examples

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning
- [x] GPT-4.5 – specs/documentation/creative depth
- [ ] GPT-4o-mini – speed/iteration/CLI+tests

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `src/schemas/report.schema.yaml`
- `tests/fixtures/report/valid/agent-refinement-cycle.report.yaml`
- `tests/fixtures/report/invalid/{missing-fields, bad-type, malformed-structure}.report.yaml`

### Relevant Memory Bank Tags:
[#report], [#schema], [#ajv], [#validation], [#augment], [#ci]

---

## ✅ Expected Output

- Confirm the `report.schema.yaml` meets use case requirements for Augment's feedback reports
- Review and validate fixtures for both pass and fail cases
- Implement CI pipeline logic to validate future `.report.yaml` files against the schema
- Propose location in repo (e.g. `schemas/`, `tests/fixtures/`) and reference hooks in `.cursorrules`

---

## ⚠️ Constraints or Considerations

- [x] Must maintain AJV schema compatibility (draft-07)
- [x] Must be usable by CI/CD tools for auto-validation
- [x] Output reports must be compatible with Roo/Cline parsing
- [x] Tags like `#handoff→Cline`, `#review-needed` must be preserved for downstream routing
- [x] Output must be valid YAML and integrated with `vibe_learn` memory logic
- [x] Report format must not conflict with existing assistant-generated prompt styles

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Augment Report Schema + Validation System" \
  --tags schema,augment,report,validation \
  --notes "Implements a reusable schema + fixtures for Augment output reports to support agent handoff, memory logging, and CI testing."
```

* * *

🛠️ Next-Step Handoff (IDE/Assistant)
-------------------------------------

*   **Prompt for Cline:**  
    _"Scaffold validation entry point for `src/schemas/report.schema.yaml` and integrate into pre-merge CI. Include schema registry if needed."_
    
*   **Prompt for Roo:**  
    _"Monitor `reports/augment/*.report.yaml` for compliance with `report.schema.yaml`. Raise alerts for invalid structure or missing tags like `#handoff→Cline`."_
    
*   **Prompt for Augment:**  
    _"Ensure all ritual validation reports follow the schema defined in `src/schemas/report.schema.yaml`. Include tag-driven handoff markers and memory hooks."_
    

* * *

📌 Reference
------------

*   **Kickoff Summary:** Mirrorwright Report Validation Initiative
    
*   **Strategic Guidelines:** See `.cursorrules` and memory log for validation phases
    
*   **Project Prompt Template:** `prompt_templates/mirrorwright-strategic-ai-conversation-template.md`
    

* * *

💬 Conversation
---------------

### User:

I want structured validation for Augment's ritual output reports. YAML. Schema-validated. Includes memory hooks, routing tags, and example fixtures.

### Assistant:

Here is a complete `report.schema.yaml` with a valid report, three invalid ones, and proposed CI integration to validate future Augment outputs. Includes memory tags, path targets, and human-readable summaries. Ready to hand off.
