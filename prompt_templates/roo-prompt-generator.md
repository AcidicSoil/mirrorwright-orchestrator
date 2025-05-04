---
agent: roo
purpose: automation
id: roo-prompt-generator
version: 1.0.0
---

# Prompt for Cursor Roo: Automated Prompt Template Generator

## Task Overview

As the autonomous code-generation and CLI tooling specialist, develop an automated prompt template generator that can create standardized prompt templates with proper frontmatter for all assistants in the Mirrorwright Orchestrator project.

## Implementation Requirements

1. **Template Generation**
   - Create a CLI tool that generates prompt templates for any assistant
   - Include proper YAML frontmatter with all required fields
   - Follow established structure for each assistant type
   - Support multiple purpose categories

2. **Assistant Integration**
   - Read assistant definitions from `.cursorrules`
   - Generate appropriate templates based on assistant roles
   - Include relevant sections and components for each assistant type

3. **Customization Options**
   - Allow specification of purpose, id, and version
   - Support custom sections and components
   - Provide options for template complexity and detail level

4. **Batch Generation**
   - Support generating templates for all assistants at once
   - Create templates for common purposes (architecture, implementation, etc.)
   - Maintain consistent structure across generated templates

## CLI Interface

```bash
# Generate a single template
npx generate-prompt --agent cline --purpose architecture --id cline-arch-prompt

# Generate templates for all assistants
npx generate-prompt --all --purpose implementation

# Generate with custom sections
npx generate-prompt --agent augment --purpose refactor --sections "Task Overview,Implementation Requirements,Testing Strategy"
```

## Implementation Approach

1. Create a new CLI tool in `src/tools/prompt-generation/`
2. Implement template generation based on assistant type
3. Add frontmatter generation with validation
4. Support batch generation and customization options

## Success Criteria

- Templates are generated with valid frontmatter
- Generated templates follow established structures
- The tool is easy to use and well-documented
- Templates can be customized for different purposes
