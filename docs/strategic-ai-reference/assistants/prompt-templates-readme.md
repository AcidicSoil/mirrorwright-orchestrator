# Prompt Templates for Mirrorwright Orchestrator

This directory contains prompt templates and configuration files for the Mirrorwright Orchestrator project.

## Overview

Prompt templates are used to standardize interactions with different AI assistants and ensure consistent, high-quality outputs. These templates are designed to work with the Mirrorwright Protocol and can be used with various AI models.

## Agent Roles

- **Cursor Cline**: Strategic planning and requirements clarification
- **Cursor Augment**: Scaffolding, architecture setup, optimization, and refactoring
- **ChatGPT**: Strategy and meta-thinking

## When to Use Each Agent

### Cursor Cline

Use Cline for:
- Strategic planning and architecture design
- Requirements clarification and analysis
- High-level system design
- Project structure planning

### Cursor Augment

Use Augment for:
- Scaffolding new components and modules
- Setting up architecture based on plans
- Optimizing existing code
- Refactoring for better maintainability

### ChatGPT

Use ChatGPT for:
- Strategic thinking and meta-cognitive support
- Workflow optimization and creative problem-solving
- Documentation and knowledge management
- Cross-agent coordination and alignment

## Available Templates

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

The memory bank configuration (`memory-bank-config.md`) provides information on how to integrate with the Cline memory bank. This includes:

1. Memory bank structure
2. Memory tags
3. Memory bank commands
4. Integration with Strategic AI

### Assistant Prompt Extraction

The assistant prompt extraction configuration (`assistant-prompt-extraction-config.md`) provides information on how to extract prompts from conversation logs and generate standardized templates for different assistants.

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

5. Submit a pull request with your changes
6. Update the README.md file to include your new template
7. Update the memory bank with information about your new template:

   ```bash
   python tools/memory.py save --title "New Template: <template-name>" --tags template-<agent>-prompt --notes "Added new template for <purpose>"
   ```

8. Run the assistant prompt extraction tool to generate updated prompts:

   ```bash
   node tools/extractAssistantPrompts.js extractAssistantPrompts.md assistant-prompts
   ```

9. Document any changes to prompt templates and their rationale
