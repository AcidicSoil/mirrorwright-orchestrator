# Memory Entry: Prompt Template Frontmatter Standard

## Title

Standardized YAML Frontmatter for Prompt Templates

## Tags

template-agent-prompt,workflow-agent-setup,tool-extract-prompts,ci-agent-sync

## Notes
Implemented a standardized YAML frontmatter approach for prompt templates:

1. Created a frontmatter schema with required fields:
   - `agent`: The assistant the prompt is designed for (e.g., cline, augment)
   - `purpose`: The primary purpose of the prompt (e.g., architecture, implementation)
   - `id`: A unique identifier for the prompt
   - `version`: Semantic version number

2. Enhanced the prompt extraction tool to:
   - Parse YAML frontmatter in prompt template files
   - Use frontmatter for prompt categorization
   - Fall back to regex pattern matching for backward compatibility
   - Extract prompts from both conversation logs and template files

3. Added validation for prompt frontmatter:
   - Created a GitHub Action to validate frontmatter in PR checks
   - Implemented a validation script that checks for required fields
   - Added tests for frontmatter parsing and validation

4. Created example prompt templates for all assistants with proper frontmatter

5. Added a template generator tool:
   - Created `src/tools/generate-prompt-template.js` for scaffolding new templates
   - Implemented validation of agent names against .cursorrules
   - Added documentation with usage examples

This enhancement improves prompt identification, categorization, and validation, making the prompt system more robust and maintainable.

## Future Enhancements

Potential next steps for the prompt template system:

1. **Analytics Integration**
   - Track prompt usage frequency and patterns
   - Collect effectiveness metrics for different prompt structures
   - Implement feedback loop for continuous improvement

2. **Template Generator Enhancements**
   - Add interactive CLI with guided prompts
   - Support specialized templates for different tasks
   - Implement template versioning and change tracking

3. **Memory Bank Integration**
   - Store templates in memory bank for easier retrieval
   - Track template evolution over time
   - Associate templates with specific tasks or project phases

## Implementation Notes

The validation system is designed to be extensible. When adding new frontmatter fields or validation rules:

1. Update the `REQUIRED_FIELDS` array in `check-frontmatter.js`
2. Add corresponding validation logic in the `validatePromptTemplates` function
3. Update the documentation in `prompt_templates/README.md`
4. Update the template generator to include new fields

## Related Files

- `src/tools/check-frontmatter.js`
- `src/tools/generate-prompt-template.js`
- `.github/workflows/validate-prompt-frontmatter.yml`
- `prompt_templates/README.md`
- `prompt_templates/prompt-frontmatter-standard.md`
