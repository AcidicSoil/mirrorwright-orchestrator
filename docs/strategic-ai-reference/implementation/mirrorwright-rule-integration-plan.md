🧠 Mirrorwright Orchestrator — Assistant Rule Integration Plan
==============================================================

This document outlines the strategy, validation steps, and modular implementation tasks to integrate the centralized `AssistantRulesRegistry` into the prompt extraction pipeline for the Mirrorwright Orchestrator system.

---

📋 Pre-Implementation Checklist
-------------------------------

### 1. 🧱 System Stability

- [ ] `AssistantRulesRegistry` loads without errors and includes all expected assistants
- [ ] `getRule()` returns complete rule objects with prompt data
- [ ] `validateAllRules()` produces zero blocking errors
- [ ] Type definitions exported (e.g., `IAssistantRule`, `PromptMetadata`)

### 2. 📄 Rule Format Validation

- [ ] Each assistant rule includes:
  - [ ] `name`
  - [ ] `role`
  - [ ] `purpose`
  - [ ] `promptSignature`
  - [ ] `promptBody` or pointer to prompt template
- [ ] All rules pass against `assistant-rule.schema.yaml`
- [ ] Prompts extracted are not duplicated elsewhere (deprecate legacy sources)

### 3. 🧠 Strategic Handling

- [ ] Clarified how to handle:
  - [ ] Assistants with multiple prompt styles?
  - [ ] Rule versioning (`stage`, `enabled`, `version`)?
  - [ ] Fallback behavior for malformed or missing prompts?
- [ ] Optional: Add metadata fields (`enabled`, `visibility`, `group`)

### 4. 🛠 Integration & Refactoring

- [ ] Add `getPromptMetadataForExtraction()` to `AssistantRulesRegistry`
- [ ] Import and use this method in `extractAssistantPrompts.ts`
- [ ] Replace any file-scanning or hardcoded rule logic
- [ ] Add graceful error handling + logging for invalid prompt definitions

### 5. 🔁 Testing & Verification

- [ ] Unit test for `getPromptMetadataForExtraction()`
- [ ] Integration test for `extractAssistantPrompts.ts` using mock rules
- [ ] Validate against real project output: `.cursorrules`, prompt templates, YAML frontmatter

### 6. 📚 Documentation

- [ ] Update `README.assistant-rules-registry.md` to reference prompt extraction pipeline
- [ ] Add usage example under "Extracting Prompts from Centralized Rules"

---

🟦 Implementation Cards
-----------------------

### 📌 Card 1: Add Prompt Metadata Method to Registry

**Agent:** Cline

**Description:** Add a method `getPromptMetadataForExtraction()` to `AssistantRulesRegistry` that returns structured prompt metadata per assistant rule.

**Dependencies:**

- `AssistantRulesRegistry.ts`
- `IAssistantRule.ts`
- `assistant-rule.schema.yaml`

**Acceptance Criteria:**

- Returns: `{ name, role, purpose, promptSignature, promptBody, version }[]`
- Logs and skips incomplete/invalid rules
- Unit tested using example rule files

---

### 📌 Card 2: Refactor Prompt Extraction Logic

**Agent:** Augment

**Description:** Replace logic in `extractAssistantPrompts.ts` to dynamically load prompt data from `AssistantRulesRegistry`.

**Dependencies:**

- Completed Card 1 (registry method)
- `extractAssistantPrompts.ts`

**Acceptance Criteria:**

- Uses registry as source of truth
- Compatible with `.cursorrules` structure
- Skips/logs errors gracefully
- Covered by integration test

---

### 📌 Card 3: Validate Assistant Rules

**Agent:** Shared / System

**Description:** Validate that all assistant rule files meet schema requirements and contain necessary fields for prompt extraction.

**Dependencies:**

- `validateAllRules()` from registry
- `assistant-rule.schema.yaml`
- `examples/assistant-rules/*.json`

**Acceptance Criteria:**

- Schema validation passes for all rules
- Missing/malformed rules flagged and logged
- Checklist updated to reflect validation pass/fail

---

🔄 Next Actions
---------------

- [ ] Create directory structure for implementation cards and checklists
- [ ] Assign Card 1 to Cline for implementation
- [ ] Assign Card 2 to Augment for implementation
- [ ] Schedule validation session for Card 3
