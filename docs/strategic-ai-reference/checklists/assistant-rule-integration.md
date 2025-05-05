📋 Assistant Rule Integration Checklist
=======================================

Use this checklist to validate system readiness before integrating centralized assistant rules into the prompt extraction workflow.

---

1. 🧱 System Stability
-----------------------

- [ ] `AssistantRulesRegistry` loads without errors and includes all expected assistants
- [ ] `getRule()` returns complete rule objects with prompt data
- [ ] `validateAllRules()` produces zero blocking errors
- [ ] Type definitions exported (e.g., `IAssistantRule`, `PromptMetadata`)

---

2. 📄 Rule Format Validation
-----------------------------

- [ ] Each assistant rule includes:
  - [ ] `name`
  - [ ] `role`
  - [ ] `purpose`
  - [ ] `promptSignature`
  - [ ] `promptBody` or pointer to prompt template
- [ ] All rules pass against `assistant-rule.schema.yaml`
- [ ] Prompts extracted are not duplicated elsewhere (deprecate legacy sources)

---

3. 🧠 Strategic Handling
-------------------------

- [ ] Clarified how to handle:
  - [ ] Assistants with multiple prompt styles?
  - [ ] Rule versioning (`stage`, `enabled`, `version`)?
  - [ ] Fallback behavior for malformed or missing prompts?
- [ ] Optional: Add metadata fields (`enabled`, `visibility`, `group`)

---

4. 🛠 Integration & Refactoring
--------------------------------

- [ ] Add `getPromptMetadataForExtraction()` to `AssistantRulesRegistry`
- [ ] Import and use this method in `extractAssistantPrompts.ts`
- [ ] Replace any file-scanning or hardcoded rule logic
- [ ] Add graceful error handling + logging for invalid prompt definitions

---

5. 🔁 Testing & Verification
-----------------------------

- [ ] Unit test for `getPromptMetadataForExtraction()`
- [ ] Integration test for `extractAssistantPrompts.ts` using mock rules
- [ ] Validate against real project output: `.cursorrules`, prompt templates, YAML frontmatter

---

6. 📚 Documentation
--------------------

- [ ] Update `README.assistant-rules-registry.md` to reference prompt extraction pipeline
- [ ] Add usage example under "Extracting Prompts from Centralized Rules"
