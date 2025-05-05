🟪 Implementation Card — Refactor Prompt Extraction to Use Registry
===================================================================

**Agent:** Augment

---

📌 Task
-------

Refactor `extractAssistantPrompts.ts` to use the centralized `AssistantRulesRegistry` as its source of prompt metadata.

---

📄 Description
--------------

All assistant prompt definitions are now maintained in centralized rule files. Extraction logic should use the new registry to load and validate prompt data before processing.

---

🔗 Dependencies
---------------

- `extractAssistantPrompts.ts`
- `AssistantRulesRegistry.getPromptMetadataForExtraction()` (from Cline card)
- `.cursorrules`, `.cursorrules-quickref.md`

---

✅ Acceptance Criteria
---------------------

- Extracts all prompts from registry, not filesystem or hardcoded sources
- Filters out invalid prompt metadata gracefully (logs warnings)
- Output matches `.cursorrules` format
- Covered by integration test using sample rules
- No hardcoded assistant names or template paths remain
