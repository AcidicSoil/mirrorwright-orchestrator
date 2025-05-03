# Mirrorwright Orchestrator Tools

This directory contains utility tools for the Mirrorwright Orchestrator project.

## Assistant Prompt Extraction Tool

The Assistant Prompt Extraction Tool automates the process of extracting and generating assistant prompts from conversation logs for the Mirrorwright multi-agent system.

### Usage

```bash
# Using the JavaScript version (no compilation required)
node src/tools/extractAssistantPrompts.js [conversationPath] [outputDir]

# Using the TypeScript version (requires compilation)
ts-node src/tools/extractAssistantPrompts.ts [conversationPath] [outputDir]
```

Where:
- `conversationPath` is the path to the conversation log file (default: `extractAssistantPrompts.md`)
- `outputDir` is the directory to save the extracted prompts (default: `assistant-prompts`)

### Features

- Extracts existing assistant prompts from conversation logs
- Identifies missing prompts based on assistants defined in `.cursorrules`
- Generates placeholder prompts for missing assistants
- Saves individual prompt files and a combined file

### Integration with LLM (Future Enhancement)

In a future version, the tool will integrate with an LLM to automatically generate high-quality prompts for missing assistants based on:

1. The assistant's role description from `.cursorrules`
2. Current project state analysis
3. Implementation patterns in the codebase
4. Next logical development steps

### Automation Workflow

This tool can be integrated into your development workflow:

1. After strategic planning sessions, save the conversation as `extractAssistantPrompts.md`
2. Run the extraction tool to generate/update assistant prompts
3. Review and refine the generated prompts
4. Use the prompts with the corresponding assistants in the Cursor IDE

## Other Tools

- More tools will be added here as they are developed
