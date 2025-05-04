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

### Parameters

- `conversationPath`: Path to the conversation log file (e.g., `extractAssistantPrompts.md`)
- `outputDir`: Directory where the generated prompts will be saved (e.g., `assistant-prompts`)

### Output

The tool generates the following files in the specified output directory:

- `all-assistant-prompts.md`: A single file containing all extracted prompts
- Individual prompt files for each assistant (e.g., `augment-prompt.md`, `cline-prompt.md`)

### Implementation

The tool is implemented in both JavaScript and TypeScript:

- `src/tools/extractAssistantPrompts.js`: JavaScript implementation
- `src/tools/extractAssistantPrompts.ts`: TypeScript implementation

Both versions provide the same functionality, but the TypeScript version offers better type safety and integration with the rest of the TypeScript codebase.

## Other Tools

Additional tools may be added to this directory as the project evolves, including:

- Protocol validation tools
- Schema generation tools
- Test utilities
- Documentation generators

Each tool should follow the same pattern of providing both a JavaScript and TypeScript implementation, along with clear documentation on usage and parameters.
