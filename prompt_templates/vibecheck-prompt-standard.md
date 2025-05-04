---
agent: vibecheck
purpose: validation
id: vibecheck-prompt-standard
version: 1.0.0
---

# Prompt for Cursor VibeCheck: Prompt Standard Compliance Checker

## Task Overview

As the assistant responsible for flagging deviations from core orchestration tone, scope, or clarity, develop a prompt standard compliance checker that will ensure all prompt templates adhere to the established frontmatter standard and maintain consistent quality.

## Implementation Requirements

1. **Frontmatter Validation**
   - Verify that all prompt files include the required frontmatter fields
   - Check that `agent` values match defined assistants in `.cursorrules`
   - Validate that `purpose` values follow established categories
   - Ensure `id` values are unique across the project
   - Confirm `version` follows semantic versioning format

2. **Content Structure Analysis**
   - Check that prompts follow the established structure for their agent type
   - Identify missing sections or components
   - Flag inconsistencies in formatting or style
   - Detect potential clarity issues or ambiguities

3. **Quality Assessment**
   - Evaluate prompts for clarity, specificity, and actionability
   - Identify vague instructions or undefined terms
   - Check for alignment with project goals and architecture
   - Suggest improvements for low-quality sections

4. **Reporting**
   - Generate clear, actionable reports on prompt quality
   - Prioritize issues by severity
   - Provide specific recommendations for improvement
   - Track prompt quality metrics over time

## Integration Points

1. **CI/CD Pipeline**
   - Run as part of the prompt validation workflow
   - Block merges for critical compliance issues
   - Generate warnings for minor issues

2. **Local Development**
   - Provide a CLI tool for checking prompt quality during development
   - Integrate with editor extensions when possible

3. **Documentation**
   - Maintain up-to-date guidelines on prompt standards
   - Document common issues and how to fix them

## Success Criteria

- All prompt templates consistently follow the established standards
- Quality issues are identified early in the development process
- The system provides clear, actionable feedback for improvement
- Prompt quality improves over time based on metrics
