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

- **chatGPT-strategicAI-prompt_template.md**: Template for Strategic AI interactions
- **memory-bank-config.md**: Configuration for the Cline memory bank integration
- **assistant-prompt-extraction-config.md**: Configuration for the assistant prompt extraction process
- **codebase-utilization-config.md**: Configuration for codebase utilization
- **memory-bank-tags.md**: Tag schema for memory bank entries
- **gpt-4o-prompt-extractor.md**: GPT-4o specific template for prompt extraction
- **gpt-4.5-prompt-extractor.md**: GPT-4.5 specific template for prompt extraction
- **gpt-4o-mini-prompt-extractor.md**: GPT-4o-mini specific template for prompt extraction

## Usage

### Strategic AI Prompt Template

The Strategic AI prompt template (`chatGPT-strategicAI-prompt_template.md`) is used for high-level strategic guidance on the Mirrorwright Orchestrator project. To use this template:

1. Copy the template content
2. Fill in the sections with your specific context, question, and constraints
3. Select the appropriate working model and implementation phase
4. Submit the prompt to the Strategic AI assistant

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

### Codebase Utilization

The codebase utilization configuration (`codebase-utilization-config.md`) provides guidance on how to effectively use the Mirrorwright Orchestrator codebase for development, testing, and deployment.

## Best Practices

1. **Consistency**: Use the same template structure for all interactions with a specific assistant
2. **Clarity**: Clearly define the context, question, and constraints in each prompt
3. **Specificity**: Be specific about the expected output format and level of detail
4. **Iteration**: Iterate on prompts based on the quality of the outputs
5. **Documentation**: Document any changes to prompt templates and their rationale

## Contributing

To contribute to the prompt templates:

1. Create a new branch for your changes
2. Make your changes to the relevant template files
3. Test your changes with the target assistant
4. Submit a pull request with a clear description of your changes

## Resources

- [Mirrorwright Protocol Documentation](../docs/protocol.md)
- [Assistant Prompt Guidelines](../docs/assistant-prompts.md)
- [Memory Bank Documentation](../docs/memory-bank.md)
