---
agent: augment
purpose: prompt extraction logic refactor
id: assistant-prompt-extraction-refactor
version: 1.0.0
---

## 🧠 Mirrorwright Orchestrator — Assistant Prompt Extraction Refactor

### 🎯 Task

Refactor `extractAssistantPrompts.ts` to utilize the new centralized `AssistantRulesRegistry`.

---

### 📍 Current State

- Prompt metadata is manually parsed or extracted via file scans.
- Assistant rules are now centralized and validated via `AssistantRulesRegistry`.

---

### ✅ Implementation Goals

1. Import `AssistantRulesRegistry` and initialize it.
2. Call `getPromptMetadataForExtraction()` to retrieve structured prompt metadata.
3. Replace legacy logic for finding assistant prompt data.
4. Apply schema-based validation prior to extracting.
5. Ensure backward compatibility if required.

---

### 🧪 Validation

- Add integration test to ensure extracted prompts match `.cursorrules` structure.
- Gracefully handle missing, disabled, or malformed rules.

---

### ⛓ Dependencies

- `AssistantRulesRegistry.ts`
- `assistant-rule.schema.yaml`
- Existing `.cursorrules`
