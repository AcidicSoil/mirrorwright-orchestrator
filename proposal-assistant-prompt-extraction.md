# Proposal: Automated Assistant Prompt Extraction Process

## Overview

This proposal outlines a system to automate the extraction and generation of assistant prompts for the Mirrorwright Orchestrator multi-agent system. The goal is to eliminate manual intervention in the prompt creation process, enabling iterative development with consistent, high-quality prompts for all assistants.

## Current Challenge

Currently, assistant prompts are manually extracted from conversation logs or created ad-hoc. This process:
- Is time-consuming and error-prone
- Results in inconsistent prompt formats
- Often leaves some assistants without updated prompts
- Doesn't systematically incorporate project state

## Proposed Solution

An automated tool that:
1. Extracts existing prompts from conversation logs
2. Identifies missing prompts based on assistants defined in `.cursorrules`
3. Generates high-quality prompts for missing assistants using an LLM
4. Saves all prompts in a standardized format

## Implementation Details

I've created a prototype implementation with two versions:
- `src/tools/extractAssistantPrompts.js` (JavaScript version, ready to use)
- `src/tools/extractAssistantPrompts.ts` (TypeScript version, for integration)

### Key Features

1. **Automatic Extraction**
   - Parses conversation logs using regex patterns to identify assistant prompts
   - Handles various prompt formats and markdown structures

2. **Assistant Role Analysis**
   - Reads `.cursorrules` to identify all assistants in the ecosystem
   - Maps extracted prompts to the correct assistants

3. **Project State Analysis**
   - Analyzes the codebase structure, recent commits, and dependencies
   - Creates a project state summary for context-aware prompt generation

4. **LLM Integration (Future)**
   - Generates prompts for missing assistants using an LLM
   - Ensures prompts align with assistant roles and project state

5. **Standardized Output**
   - Creates individual prompt files for each assistant
   - Generates a combined file with all prompts

### Usage Workflow

```bash
# After strategic planning sessions
node src/tools/extractAssistantPrompts.js extractAssistantPrompts.md assistant-prompts
```

## Benefits

1. **Consistency**: All assistants have up-to-date, properly formatted prompts
2. **Efficiency**: Eliminates manual prompt extraction and creation
3. **Completeness**: Ensures no assistant is left without a prompt
4. **Context-Awareness**: Generated prompts reflect current project state
5. **Iterative Development**: Supports rapid iteration cycles

## Next Steps

1. Review this proposal and the prototype implementation
2. Approve integration of the tool into the development workflow
3. Enhance with LLM integration for high-quality prompt generation
4. Create a CI/CD step to automatically update prompts after strategic sessions

## Seeking Approval

I'm seeking Strategic AI's confirmation on:
1. The overall approach to automating assistant prompt extraction
2. The prototype implementation in the tools directory
3. The planned LLM integration for generating missing prompts
4. The standardized prompt format and output structure

This automation will significantly streamline our development process and ensure all assistants in the Mirrorwright ecosystem have high-quality, context-aware prompts at all times.
