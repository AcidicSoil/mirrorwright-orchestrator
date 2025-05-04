---
agent: augment
purpose: implementation
id: augment-prompt-extractor-update
version: 1.0.0
---

# Prompt for Cursor Augment: Update Prompt Extraction Tool for Frontmatter Support

## Task Overview

Enhance the `extractAssistantPrompts.js` tool to support YAML frontmatter in prompt template files. This update will improve prompt identification, categorization, and validation.

## Implementation Requirements

1. **Add Frontmatter Parsing**
   - Implement a function to detect and parse YAML frontmatter in markdown files
   - Extract `agent`, `purpose`, `id`, and `version` fields
   - Handle files both with and without frontmatter for backward compatibility

2. **Update Prompt Extraction Logic**
   - Prioritize frontmatter `agent` field for categorization when available
   - Fall back to regex pattern matching for files without frontmatter
   - Add validation for required frontmatter fields
   - Emit clear warnings for files with missing or invalid frontmatter

3. **Enhance Error Handling**
   - Add specific error types for frontmatter parsing issues
   - Provide helpful error messages that guide users to fix frontmatter problems
   - Log warnings for files that don't follow the new standard

4. **Add CLI Options**
   - Add a `--validate-frontmatter` flag to check all prompt files for valid frontmatter
   - Add a `--fix-frontmatter` option to generate missing frontmatter based on file content

## Code Structure

Update the following components:

1. Create a new `FrontmatterParser` class in `src/tools/prompt-extraction/extractors/`
2. Modify `PromptExtractor` to use the frontmatter parser
3. Update the CLI interface to support the new options
4. Add tests for frontmatter parsing and validation

## Testing Requirements

1. Add test cases for:
   - Files with valid frontmatter
   - Files with invalid or incomplete frontmatter
   - Files without frontmatter
   - Edge cases (empty files, malformed YAML, etc.)

2. Ensure backward compatibility with existing prompt files

## Success Criteria

- All prompt files can be correctly identified by their frontmatter
- The extraction tool provides clear warnings for non-compliant files
- CI checks can validate frontmatter compliance
- Existing functionality continues to work for files without frontmatter
