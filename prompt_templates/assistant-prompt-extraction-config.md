---
agent: promptrouter
purpose: documentation
id: assistant-prompt-extraction-config
version: 1.0.0
---

# Assistant Prompt Extraction Configuration

This document outlines the configuration for the assistant prompt extraction process in the Mirrorwright Orchestrator project.

## Overview

The assistant prompt extraction process automatically extracts prompts from conversation logs and generates standardized prompt templates for different assistants. This automation ensures consistency across all assistant interactions and enables iterative development of prompts without manual intervention.

## Extraction Process

1. Conversation logs are analyzed to identify assistant prompts
2. Prompts are categorized by assistant type (e.g., Strategic AI, Augment, Cline)
3. Standardized templates are generated based on the extracted prompts
4. Templates are saved to the `assistant-prompts` directory
5. A combined file with all prompts is generated for easy reference

## Configuration

### Directory Structure

```text
mirrorwright-orchestrator/
├── prompt_templates/                # Template definitions
│   ├── gpt-4o-prompt-extractor.md   # GPT-4o specific template
│   ├── gpt-4.5-prompt-extractor.md  # GPT-4.5 specific template
│   └── gpt-4o-mini-prompt-extractor.md # GPT-4o-mini specific template
├── assistant-prompts/               # Generated assistant prompts
│   ├── strategicai-prompt.md        # Strategic AI prompt
│   ├── augment-prompt.md            # Augment prompt
│   ├── cline-prompt.md              # Cline prompt
│   └── all-assistant-prompts.md     # Combined file with all prompts
├── tools/                           # Extraction tools
│   └── extractAssistantPrompts.js   # Prompt extraction script
└── .github/workflows/               # CI/CD configuration
    └── update-assistant-prompts.yml # Workflow for automatic updates
```

### Extraction Tool

The extraction tool is implemented in `tools/extractAssistantPrompts.js` and can be run with the following command:

```bash
node tools/extractAssistantPrompts.js <input_file> <output_directory>
```

Where:

- `<input_file>` is the path to the conversation log file
- `<output_directory>` is the directory where the generated prompts will be saved

### Model-Specific Templates

Different models are used for different aspects of the prompt extraction process:

1. **GPT-4o**: Used for complex prompt analysis and template generation
2. **GPT-4.5**: Used for detailed documentation and creative exploration
3. **GPT-4o-mini**: Used for rapid implementation and iterative refinements

Each model has a specific template in the `prompt_templates` directory that defines how it should process the conversation logs.

### CI/CD Integration

The prompt extraction process is integrated with CI/CD pipelines to automatically update assistant prompts when changes are made to the conversation logs or templates. The workflow is defined in `.github/workflows/update-assistant-prompts.yml` and is triggered when:

1. Changes are made to the `strategy/**.md` files
2. Changes are made to the `.cursorrules` file
3. Changes are made to the extraction tool

## Usage

### Manual Extraction

To manually extract prompts from a conversation log:

```bash
node tools/extractAssistantPrompts.js extractAssistantPrompts.md assistant-prompts
```

### Adding to Memory Bank

To add the extracted prompts to the memory bank:

```bash
python tools/memory.py save --title "Updated Assistant Prompts" --tags template-agent-prompt,tool-extract-prompts --notes "Updated assistant prompts based on recent conversations"
```

### Customizing Templates

To customize the templates used for prompt extraction:

1. Edit the appropriate template in the `prompt_templates` directory
2. Run the extraction tool to generate new prompts
3. Review the generated prompts and make adjustments as needed
4. Commit the changes to trigger the CI/CD pipeline
