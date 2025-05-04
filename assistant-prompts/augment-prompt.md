# Prompt for Cursor Augment: Enhance Prompt Extractor

Please refactor `src/tools/extractAssistantPrompts.ts` to:
1. Modularize the following:
   - prompt extraction logic
   - file IO
   - assistant registry loading
   - project state scanner
2. Add Vitest test coverage for:
   - `extractPromptsFromConversation()`
   - `loadAssistantsFromCursorRules()`
   - `savePrompts()`
3. Ensure CLI usage remains intact (`ts-node` compatibility)

Label the PR: `[#test] Add test coverage + refactor extractAssistantPrompts`