🟨 Implementation Card — Validate Assistant Rules
=================================================

**Agent:** Shared / System

---

📌 Task
-------

Ensure all assistant rules meet structural and schema requirements before integration into prompt extraction or CLI pipelines.

---

📄 Description
--------------

Valid assistant rules are required for prompt extraction, versioning, and downstream orchestration. Run full validation and flag any nonconformities.

---

🔗 Dependencies
---------------

- `AssistantRulesRegistry.validateAllRules()`
- `assistant-rule.schema.yaml`
- `examples/assistant-rules/*.json`

---

✅ Acceptance Criteria
---------------------

- All rules pass JSON Schema validation
- Rules missing key fields (`name`, `role`, `promptSignature`, etc.) are flagged
- Validation log includes assistant name, failure reason, and severity
- Checklist reflects updated validation status
