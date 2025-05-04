# Define the prompts for each assistant
$prompts = @{
    "cline" = @"
# Prompt for Cursor Cline: Architecture Planning for Ritual Engine

Please develop a comprehensive architecture plan for the Ritual Engine component that will:

1. Define the core interfaces and classes needed for the Ritual Engine
2. Establish a clear separation between protocol definitions and execution logic
3. Outline how rituals will be loaded, validated, and executed
4. Propose a strategy for handling conditional steps and error recovery
5. Ensure compatibility with the existing RuntimeContainer and MessageBus

The architecture should follow TypeScript best practices with strict typing and should be designed for extensibility as new ritual types are added in the future.

Label the PR: `[#architecture] Ritual Engine Component Design`
"@

    "roo" = @"
# Prompt for Cursor Roo: CLI Tool for Protocol Validation

As the autonomous code-generation and CLI tooling specialist, please develop a command-line interface tool that will:

1. Validate protocol files against their schemas
2. Generate TypeScript types from protocol schemas
3. Provide helpful error messages for invalid protocols
4. Support batch validation of multiple protocol files
5. Include a --fix option to attempt automatic repairs of common issues

The CLI should be implemented in TypeScript with a focus on performance and usability. It should integrate with the existing validator engine and follow the project's established patterns for CLI tools.

Label the PR: `[#tools] Protocol Validation CLI`
"@

    "vibecheck" = @"
# Prompt for Cursor VibeCheck: Protocol Consistency Validator

As the assistant responsible for flagging deviations from core orchestration tone, scope, or clarity, please develop a protocol consistency validator that will:

1. Analyze protocol definitions for consistency in naming conventions and structure
2. Identify potential ambiguities or unclear specifications in ritual steps
3. Flag deviations from established patterns in mode definitions
4. Suggest improvements to maintain clarity and coherence across the protocol
5. Ensure that all protocol components align with the project's architectural vision

The validator should be implemented as a module that can be integrated with the existing validation pipeline and should provide actionable feedback for improving protocol quality.

Label the PR: `[#quality] Protocol Consistency Validator`
"@

    "cursorscan" = @"
# Prompt for Cursor CursorScan: Protocol Lifecycle Tracker

As the assistant responsible for mapping file changes, agent contributions, and prompt evolutions to traceable protocol lifecycle metadata, please develop a protocol lifecycle tracking system that will:

1. Track changes to protocol definitions over time
2. Associate changes with specific agents or contributors
3. Generate reports on protocol evolution and maturity
4. Maintain a history of prompt variations used for each protocol component
5. Provide insights into which parts of the protocol are most actively developed or stable

The tracking system should be implemented as a module that integrates with the existing codebase and should provide both programmatic access and CLI reporting capabilities.

Label the PR: `[#metadata] Protocol Lifecycle Tracking System`
"@

    "promptrouter" = @"
# Prompt for Cursor PromptRouter: Intent-Based Routing System

As the assistant responsible for routing user prompts to the optimal model and protocol phase context, please develop an intent-based routing system that will:

1. Analyze user prompts to determine the underlying intent and task type
2. Select the most appropriate model (GPT-4o, GPT-4.5, GPT-4o-mini) based on the task requirements
3. Determine the relevant protocol phase context for the prompt
4. Route the prompt to the appropriate assistant with the necessary context
5. Track routing decisions and outcomes to improve future routing accuracy

The routing system should be implemented as a module that integrates with the existing orchestration framework and should be configurable to adapt to new models and protocol phases as they are added.

Label the PR: `[#orchestration] Intent-Based Prompt Routing System`
"@

    "strategicai" = @"
# Prompt for Cursor StrategicAI: Protocol-Aligned Prompt Blueprint Generator

As the assistant responsible for transforming user intent into structured, phase-aware prompt blueprints, please develop a prompt blueprint generator that will:

1. Convert high-level user requirements into structured prompt templates
2. Align prompt structures with protocol objectives and constraints
3. Incorporate phase-specific context and guidance into prompts
4. Generate variations of prompts optimized for different models (GPT-4o, GPT-4.5, GPT-4o-mini)
5. Include appropriate memory hooks and next-step handoffs in generated prompts

The blueprint generator should be implemented as a module that can be used programmatically or via CLI and should follow the established patterns for prompt templates in the project.

Label the PR: `[#prompts] Protocol-Aligned Blueprint Generator`
"@

    "augment" = @"
# Prompt for Cursor Augment: Enhance Prompt Extractor

Please refactor `src/tools/extractAssistantPrompts.ts` to:
1. Modularize the following:
   - prompt extraction logic
   - file IO
   - assistant registry loading
   - project state scanner
2. Add Vitest test coverage for:
   - `extractPromptsFromConversation()`
   - `loadAssistantsFromCursorRules()`
   - `savePrompts()`
3. Ensure CLI usage remains intact (`ts-node` compatibility)

Label the PR: `[#test] Add test coverage + refactor extractAssistantPrompts`
"@
}

# Output directory
$outputDir = "assistant-prompts"

# Ensure output directory exists
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Save individual prompt files
foreach ($assistant in $prompts.Keys) {
    $filePath = Join-Path $outputDir "$assistant-prompt.md"
    Set-Content -Path $filePath -Value $prompts[$assistant]
    Write-Host "Saved prompt for $assistant to $filePath"
}

# Save combined prompts file
$combinedContent = ""
foreach ($assistant in $prompts.Keys) {
    $combinedContent += "## $assistant`n`n$($prompts[$assistant])`n`n---`n`n"
}

$combinedPath = Join-Path $outputDir "all-assistant-prompts.md"
Set-Content -Path $combinedPath -Value $combinedContent
Write-Host "Saved combined prompts to $combinedPath"

Write-Host "Assistant prompt update complete"
