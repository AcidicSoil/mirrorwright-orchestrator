---
agent: strategicai
purpose: documentation
id: prompt-templates-readme
version: 1.0.0
---

# Prompt Templates for Mirrorwright Orchestrator

This directory contains prompt templates and configuration files for the Mirrorwright Orchestrator project.

## Overview

Prompt templates are used to standardize interactions with different AI assistants and ensure consistent, high-quality outputs. These templates are designed to work with the Mirrorwright Protocol and can be used with various AI models.

## Agent Roles

- **Cursor Cline**: Strategic planning and requirements clarification
- **Cursor Augment**: Scaffolding, architecture setup, optimization, and refactoring
- **ChatGPT**: Strategy and meta-thinking

## When to Use Each Agent

- **For strategic planning or requirements clarification:** call Cline
- **For scaffolding or initial project setup:** call Augment
- **For optimization and refactoring:** call Augment
- **For high-level strategy and meta-thinking:** call ChatGPT

## Directory Contents

- **mirrorwright-strategic-ai-conversation-template.md**: Universal conversation template for Strategic AI interactions
- **mirrorwright-strategic-ai-conversation-example.md**: Example of a filled-in conversation template
- **chatGPT-strategicAI-prompt_template.md**: Original template for Strategic AI interactions
- **memory-bank-config.md**: Configuration for the Cline memory bank integration
- **assistant-prompt-extraction-config.md**: Configuration for the assistant prompt extraction process
- **codebase-utilization-config.md**: Configuration for codebase utilization
- **memory-bank-tags.md**: Tag schema for memory bank entries
- **gpt-4o-prompt-extractor.md**: GPT-4o specific template for prompt extraction
- **gpt-4.5-prompt-extractor.md**: GPT-4.5 specific template for prompt extraction
- **gpt-4o-mini-prompt-extractor.md**: GPT-4o-mini specific template for prompt extraction

## Usage

### Strategic AI Conversation Template

The Strategic AI conversation template (`mirrorwright-strategic-ai-conversation-template.md`) is used for high-level strategic guidance on the Mirrorwright Orchestrator project. This template is designed to:

1. Support conversations at any stage of the workflow
2. Work with both Cursor assistants (Cline, Augment) and ChatGPT
3. Maintain context continuity across different models
4. Record the conversation for later extraction using the prompt extraction tool

To use this template:

1. Copy the template content
2. Fill in the sections with your specific context, task, and constraints
3. Select the appropriate working model and implementation phase
4. Add your initial prompt in the Conversation section
5. Submit the prompt to the Strategic AI assistant
6. Record the conversation as it progresses

An example of a filled-in template is available in `mirrorwright-strategic-ai-conversation-example.md`.

### Original Strategic AI Prompt Template

The original Strategic AI prompt template (`chatGPT-strategicAI-prompt_template.md`) is still available for reference and can be used for simpler interactions.

### Memory Bank Integration

The memory bank configuration (`memory-bank-config.md`) outlines how to integrate with the memory bank system. This integration enables:

1. Storing and retrieving project memories
2. Tracking development progress
3. Maintaining context across different development phases

### Assistant Prompt Extraction

The assistant prompt extraction configuration (`assistant-prompt-extraction-config.md`) describes how to automatically extract prompts from conversation logs and generate standardized templates. This process:

1. Analyzes conversation logs to identify assistant prompts
2. Categorizes prompts by assistant type
3. Generates standardized templates
4. Saves templates to the `assistant-prompts` directory

The conversation template includes a dedicated Conversation section that makes it easier for the prompt extraction tool to identify and extract the relevant parts of the conversation.

### Codebase Utilization

The codebase utilization configuration (`codebase-utilization-config.md`) provides guidance on how to effectively use the Mirrorwright Orchestrator codebase for development, testing, and deployment.

## Frontmatter Standard

All prompt template files must include YAML frontmatter at the beginning of the file. This frontmatter provides metadata about the template and enables automated processing and validation.

### Required Frontmatter Fields

```yaml
---
agent: [agent-name]
purpose: [purpose-category]
id: [unique-identifier]
version: [semantic-version]
---
```

| Field | Description | Required | Example Values |
|-------|-------------|----------|----------------|
| `agent` | The assistant this prompt is designed for | Yes | `cline`, `augment`, `strategicai`, `vibecheck`, etc. |
| `purpose` | The primary purpose of this prompt | Yes | `architecture`, `implementation`, `documentation`, `testing`, etc. |
| `id` | A unique identifier for this prompt | Yes | `cline-architecture-prompt`, `augment-refactor-prompt` |
| `version` | Semantic version number | Yes | `1.0.0`, `0.2.1` |

For more details, see the [Prompt Frontmatter Standard](prompt-frontmatter-standard.md) document.

## Best Practices

1. **Frontmatter**: Always include the required frontmatter fields at the beginning of each template
2. **Consistency**: Use the same template structure for all interactions with a specific assistant
3. **Clarity**: Clearly define the context, task, and constraints in each prompt
4. **Specificity**: Be specific about the expected output format and level of detail
5. **Conversation Recording**: Record the full conversation in the template for later extraction
6. **Handoff Instructions**: Include clear next-step handoff instructions for other assistants
7. **Reference Links**: Maintain the reference links section for context continuity
8. **Iteration**: Iterate on prompts based on the quality of the outputs
9. **Documentation**: Document any changes to prompt templates and their rationale

## Contributing

To contribute to the prompt templates:

1. Create a new branch for your changes
2. Create a new template using the template generator:

   ```bash
   node src/tools/generate-prompt-template.js <agent> <purpose> <id> [output-file]
   ```

   Example:

   ```bash
   node src/tools/generate-prompt-template.js cline architecture cline-new-architecture-prompt
   ```

3. Edit the generated template to add your content
   - Ensure all templates include the required frontmatter fields
   - Follow the established template structure for the target assistant
4. Validate your changes with the frontmatter validation tool:

   ```bash
   node src/tools/check-frontmatter.js
   ```

5. Test your changes with the target assistant
6. Submit a pull request with a clear description of your changes

The CI/CD pipeline includes a GitHub Action that automatically validates the frontmatter in all prompt templates. Pull requests with invalid frontmatter will fail this check.

## Resources

- [Mirrorwright Protocol Documentation](../docs/protocol.md)
- [Assistant Prompt Guidelines](../docs/assistant-prompts.md)
- [Memory Bank Documentation](../docs/memory-bank.md)
