---
agent: cline
purpose: implementation
id: cline-prompt-ci-validation
version: 1.0.0
---

# Prompt for Cursor Cline: Implement CI Validation for Prompt Frontmatter

## Task Overview

Develop a CI validation system to ensure all prompt template files in the Mirrorwright Orchestrator project include proper YAML frontmatter. This will enforce the new prompt frontmatter standard and prevent non-compliant files from being merged.

## Implementation Requirements

1. **Create a Validation Script**
   - Develop a script that scans all prompt template files
   - Check for the presence of required frontmatter fields (`agent`, `purpose`, `id`, `version`)
   - Validate that the `agent` field matches a known assistant from `.cursorrules`
   - Generate a report of compliant and non-compliant files

2. **GitHub Action Integration**
   - Create or update a GitHub Action workflow to run the validation script
   - Configure the action to run on pull requests and pushes to main branches
   - Set the action to fail if any prompt files are missing required frontmatter
   - Provide clear error messages that guide contributors to fix issues

3. **Documentation**
   - Update relevant documentation to explain the frontmatter requirements
   - Add examples of valid frontmatter
   - Include instructions for running the validation locally

## Implementation Approach

1. **Validation Script**
   ```typescript
   // validate-prompt-frontmatter.ts
   import * as fs from 'fs';
   import * as path from 'path';
   import * as yaml from 'js-yaml';
   import { AssistantRegistry } from '../prompt-extraction/extractors/AssistantRegistry';

   // Implementation details...
   ```

2. **GitHub Action Workflow**
   ```yaml
   # .github/workflows/validate-prompts.yml
   name: Validate Prompt Frontmatter

   on:
     pull_request:
       paths:
         - 'prompt_templates/**/*.md'
     push:
       branches: [main]
       paths:
         - 'prompt_templates/**/*.md'

   jobs:
     validate:
       runs-on: ubuntu-latest
       steps:
         # Implementation details...
   ```

## Success Criteria

- All new prompt files must include valid frontmatter to pass CI
- The validation system provides clear, actionable feedback for fixing issues
- The process is documented and easy for contributors to follow
- The validation can be run locally during development
