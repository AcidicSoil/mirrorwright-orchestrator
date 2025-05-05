🟦 Implementation Card — Add Prompt Metadata Method to Registry
===============================================================

**Agent:** Cline

---

📌 Task
-------

Add a method `getPromptMetadataForExtraction()` to `AssistantRulesRegistry` that returns structured prompt metadata per assistant rule.

---

📄 Description
--------------

Each assistant rule contains prompt configuration used by `extractAssistantPrompts.ts`. This method centralizes and standardizes access to that data for downstream consumers.

---

🔗 Dependencies
---------------

- `AssistantRulesRegistry.ts`
- `IAssistantRule.ts`
- `assistant-rule.schema.yaml`

---

✅ Acceptance Criteria
---------------------

- Method signature:

```ts
getPromptMetadataForExtraction(): AssistantPromptMetadata[]
```

- Each entry includes:
  - `name`, `role`, `purpose`, `promptSignature`, `promptBody`, `version`
- Rules with missing fields are skipped (log warning)
- Unit tested using `examples/assistant-rules/*.json`
- Errors do not crash registry operation
