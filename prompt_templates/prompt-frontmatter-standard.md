---
agent: strategicai
purpose: documentation
id: prompt-frontmatter-standard
version: 1.0.0
---

# Mirrorwright Orchestrator - Prompt Frontmatter Standard

## Overview

This document defines the standard for YAML frontmatter in all prompt template files within the Mirrorwright Orchestrator project. Implementing this standard ensures consistent identification, extraction, and processing of prompts across the system.

## Frontmatter Schema

Every prompt template file must include the following YAML frontmatter at the beginning of the file:

```yaml
---
agent: [agent-name]
purpose: [purpose-category]
id: [unique-identifier]
version: [semantic-version]
---
```

### Field Definitions

| Field | Description | Required | Example Values |
|-------|-------------|----------|----------------|
| `agent` | The assistant this prompt is designed for | Yes | `cline`, `augment`, `strategicai`, `vibecheck`, etc. |
| `purpose` | The primary purpose of this prompt | Yes | `architecture`, `implementation`, `documentation`, `testing`, etc. |
| `id` | A unique identifier for this prompt | Yes | `cline-architecture-prompt`, `augment-refactor-prompt` |
| `version` | Semantic version number | Yes | `1.0.0`, `0.2.1` |

## Implementation Guidelines

1. **File Naming**: While not strictly required, it's recommended to name files in a way that reflects their purpose and agent, e.g., `cline-architecture-prompt.md`.

2. **Versioning**: Increment the version number when making significant changes to a prompt:
   - Major version (1.0.0 → 2.0.0): Complete rewrite or fundamental change in approach
   - Minor version (1.0.0 → 1.1.0): Adding new sections or capabilities
   - Patch version (1.0.0 → 1.0.1): Fixing typos or minor improvements

3. **Content Structure**: After the frontmatter, follow the established prompt structure for the specific agent type.

## Example

```markdown
---
agent: cline
purpose: architecture
id: cline-architecture-prompt
version: 1.0.0
---

# Prompt for Cursor Cline: Architecture Planning

As the assistant responsible for strategic planning and requirements clarification...
```

## Integration with Extraction Tool

The `extractAssistantPrompts.js` tool has been updated to:

1. Parse YAML frontmatter in prompt files
2. Use the `agent` field to categorize prompts
3. Validate that all required frontmatter fields are present
4. Emit warnings for files without valid frontmatter

## CI/CD Integration

A GitHub Action has been added to validate that all prompt template files include proper frontmatter. This check runs automatically on pull requests to ensure compliance with the standard.

## Template Generation

A template generator script has been created to help users create new prompt templates with valid frontmatter:

```bash
node src/tools/generate-prompt-template.js <agent> <purpose> <id> [output-file]
```

This script validates the agent name against the assistants defined in `.cursorrules` and generates a template with the required frontmatter fields.

## Future Enhancements

The frontmatter standard is designed to be extensible. Future enhancements may include:

1. **Analytics Integration**
   - Add fields for tracking prompt usage and effectiveness
   - Implement metrics collection for prompt performance
   - Create a feedback loop for continuous improvement

2. **Template Generator Enhancements**
   - Add interactive CLI with guided prompts
   - Support specialized templates for different tasks
   - Implement template versioning and change tracking

3. **Memory Bank Integration**
   - Store templates in memory bank for easier retrieval
   - Track template evolution over time
   - Associate templates with specific tasks or project phases

These enhancements will be implemented as the prompt system evolves and matures.
