# Tool Failure Memory: extractAssistantPrompts

## Issue Summary

The `extractAssistantPrompts` tool reports success but generates placeholder content instead of extracting actual prompts from conversation logs.

## Memory Tags

- `#tool-failure`
- `#maintenance-needed`
- `#silent-error`
- `#prompt-extraction`

## Detailed Description

When running the `extractAssistantPrompts` tool on conversation logs containing specific prompt formats (especially those with markdown formatting or special characters), the tool fails to properly extract the prompts. Instead, it generates placeholder content based on assistant descriptions from `.cursorrules`.

The tool reports finding prompts in the log but still generates placeholders, indicating a pattern matching issue in the `extractPromptsFromConversation()` function.

## Impact

- Manual extraction is required as a workaround
- Time is wasted on debugging why extracted prompts don't match expectations
- Misleading success messages give false confidence in the extraction process

## Reproduction Steps

1. Create a conversation log with prompts using formats like `🧩 Prompt for **Augment**`
2. Run `node src/tools/extractAssistantPrompts.js "conversation-log.md"`
3. Observe that the tool reports finding prompts but generates placeholders

## Suggested Fix

Enhance the prompt pattern matching in `extractPromptsFromConversation()` to recognize more prompt formats:

```javascript
// Improved pattern matching for different prompt formats
const promptPatterns = [
  /# Cursor (\w+):/i,
  /Prompt for Cursor (\w+):/i,
  /# (\w+): /i,
  /# Prompt for Cursor (\w+):/i,
  /🧩 Prompt for \*\*(\w+)\*\*/i,  // Added pattern for "🧩 Prompt for **Augment**"
  /## 🧩 Prompt for \*\*(\w+)\*\*/i  // Added pattern for "## 🧩 Prompt for **Cline**"
];
```

## Reminder Message

"⚠️ Note: The extractAssistantPrompts tool has previously shown issues with extracting certain prompt formats from conversation logs, potentially generating placeholders instead. Consider manually verifying the extracted content after execution."
