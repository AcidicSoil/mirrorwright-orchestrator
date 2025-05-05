# Assistant Rules Registry

## Overview

The Assistant Rules Registry is a centralized system for managing all assistant rules and instructions in the Mirrorwright Orchestrator. It serves as a single point of contact for updating assistant rules, ensuring changes propagate consistently across the system while maintaining the existing extraction process and validation.

## Purpose

- Provide a single point of contact for updating assistant rules
- Ensure consistency across all assistant definitions
- Maintain version history of rule changes
- Validate rules against a schema
- Integrate with existing tools like extractAssistantPrompts.ts

## Components

### AssistantRulesRegistry

The core class that manages assistant rules. It provides methods for:

- Loading rules from various sources
- Getting rules for specific assistants
- Updating rules
- Adding new assistants
- Removing assistants
- Validating rules against the schema

### RuleUpdateManager

Handles the propagation of rule updates to various files:

- Updates .cursorrules with new assistant definitions
- Updates prompt templates with new assistant rules
- Updates guidelines files with new assistant rules
- Creates version history entries for rule updates

### CLI Interface

Command-line tools for interacting with the registry:

- `assistant-rules view [assistant]` - View assistant rules
- `assistant-rules update <assistant>` - Update assistant rules
- `assistant-rules add <assistant>` - Add a new assistant
- `assistant-rules remove <assistant>` - Remove an assistant
- `assistant-rules validate [assistant]` - Validate assistant rules

## Usage

### Viewing Assistant Rules

```bash
# View all assistant rules
npm run assistant-rules view

# View rules for a specific assistant
npm run assistant-rules view augment
```

### Updating Assistant Rules

```bash
# Update assistant rules from a file
npm run assistant-rules update augment --file path/to/updates.json

# Update specific fields
npm run assistant-rules update augment --role "New role description" --description "New description"
```

### Adding a New Assistant

```bash
# Add a new assistant from a file
npm run assistant-rules add newassistant --file path/to/rules.json
```

### Removing an Assistant

```bash
# Remove an assistant
npm run assistant-rules remove oldassistant
```

### Validating Assistant Rules

```bash
# Validate all assistant rules
npm run assistant-rules validate

# Validate rules for a specific assistant
npm run assistant-rules validate augment
```

## Integration with Existing Tools

### extractAssistantPrompts.ts

The AssistantRulesRegistry is integrated with extractAssistantPrompts.ts to ensure that extracted prompts are consistent with the centralized rules:

- extractAssistantPrompts.ts uses the AssistantRulesRegistry for loading assistant definitions
- Extracted prompts are validated against the rules in the registry
- The registry can be updated when new prompts are extracted

### Validation System

The AssistantRulesRegistry is integrated with the existing validation system:

- A JSON Schema for assistant rules is defined in `src/schemas/assistant-rule.schema.yaml`
- The ValidatorEngine is used to validate assistant rules
- Validation hooks are added for assistant rules

## Rule Schema

Assistant rules follow a structured schema defined in `src/schemas/assistant-rule.schema.yaml`. The schema includes:

- **name**: The name of the assistant
- **description**: A brief description of the assistant's purpose
- **version**: The version of the assistant rule
- **role**: A detailed description of the assistant's role in the system
- **responsibilities**: A list of the assistant's primary responsibilities
- **responseFormat**: Description of the expected response structure and examples
- **interactionPatterns**: How the assistant should interact with humans and other assistants
- **errorHandling**: Guidelines for how the assistant should handle errors
- **contextPreservation**: Guidelines for how the assistant should preserve context
- **metadata**: Additional metadata about the assistant
- **tags**: Tags for categorizing the assistant
- **frontmatter**: YAML frontmatter for prompt templates

## Implementation

For implementation details, see the [Assistant Rules Registry Implementation Plan](./assistant-rules-registry-implementation-plan.md).
