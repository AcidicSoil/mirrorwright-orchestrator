---
agent: cline
purpose: rule registry scaffolding
id: registry-add-prompt-metadata-method
version: 1.0.0
---

## 🧠 Mirrorwright Orchestrator — Registry Enhancement

### 🎯 Task

Extend `AssistantRulesRegistry` with a typed method:
```ts
getPromptMetadataForExtraction(): AssistantPromptMetadata[]
```

---

### 📍 Requirements

1. Loop through all loaded assistant rules
2. Validate rule schema for required prompt fields
3. Extract and return an array of prompt metadata:

```ts
type AssistantPromptMetadata = {
  name: string
  role: string
  purpose: string
  promptSignature: string
  promptBody: string
  version: string
}
```

---

### 🧪 Tests

- Add unit tests for this method using Augment/Cline example rules
- Ensure rules with missing fields are skipped with log warnings

---

### 📎 Notes

- This method will be used by `extractAssistantPrompts.ts`
- Optionally add filters: `enabled`, `stage`, `group`
