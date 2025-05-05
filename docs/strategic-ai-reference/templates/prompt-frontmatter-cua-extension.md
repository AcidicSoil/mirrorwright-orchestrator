# Mirrorwright Orchestrator - Prompt Frontmatter CUA Extension

## Overview

This document extends the [Prompt Frontmatter Standard](./prompt-frontmatter-standard.md) to include support for Computer Use Agent (CUA) intents. This extension enables prompts to indicate whether they may trigger CUA actions and what types of actions they might require.

## Extended Frontmatter Schema

In addition to the standard frontmatter fields, prompts that may involve CUA actions should include the following fields:

```yaml
---
agent: [agent-name]
purpose: [purpose-category]
id: [unique-identifier]
version: [semantic-version]
cu_intent: true
cu_actions:
  - [action_type]
  - [action_type]
---
```

### New Field Definitions

| Field | Description | Required | Example Values |
|-------|-------------|----------|----------------|
| `cu_intent` | Indicates whether the prompt may trigger CUA actions | No (defaults to false) | `true`, `false` |
| `cu_actions` | Array of CUA action types that may be triggered | No (required if cu_intent is true) | `open_file`, `write_file`, `run_command`, `browse_web` |

## Implementation Guidelines

1. **Security Awareness**: Prompts with `cu_intent: true` should be treated with higher security awareness, as they may involve file system or command execution operations.

2. **Action Specificity**: Be as specific as possible about the types of actions that may be triggered. This helps with security validation and routing.

3. **Documentation**: Include clear documentation in the prompt about what CUA actions may be performed and why they are necessary.

## Example

```markdown
---
agent: augment
purpose: implementation
id: augment-file-generator
version: 1.0.0
cu_intent: true
cu_actions:
  - open_file
  - write_file
---

# Prompt for Cursor Augment: File Generator

As the assistant responsible for scaffolding and optimization, generate the necessary files for...
```

## Integration with CUA System

The `cu_intent` and `cu_actions` fields are used by:

1. **PromptRouter**: To route prompts to agents with appropriate CUA permissions
2. **CUAIntentRouter**: To validate that the requested actions match the declared intent
3. **Security Validator**: To enforce security policies based on declared intents
4. **Memory Bank**: To tag memories with appropriate CUA action tags

## Validation Rules

The following validation rules apply to the CUA extension:

1. If `cu_intent` is `true`, then `cu_actions` must be present and non-empty
2. All values in `cu_actions` must be valid CUA action types
3. Agents must have appropriate permissions in `.cursorrules` to perform the declared actions

## CI/CD Integration

The frontmatter validation GitHub Action has been updated to validate the CUA extension fields. This ensures that all prompts with CUA intents are properly declared and validated.

## Best Practices

1. **Least Privilege**: Only declare the minimum set of CUA actions needed for the prompt
2. **Clear Documentation**: Document why each CUA action is needed
3. **Security First**: Consider security implications of each CUA action
4. **Dry Run**: Use dry run mode for potentially destructive actions
5. **Error Handling**: Include clear error handling instructions for CUA actions
