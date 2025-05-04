# Memory Bank Configuration for Mirrorwright Orchestrator

This document outlines the configuration for the Cline memory bank integration with the Mirrorwright Orchestrator project.

## Memory Bank Structure

The memory bank is organized as follows:

```text
cursor-memory-bank/
├── memory_index.json       # Index of all memories
├── memory-bank/            # Directory containing memory files
│   ├── activeContext.md    # Current development focus
│   ├── tasks.md            # Task tracking
│   └── progress.md         # Implementation progress
```

## Memory Tags

Use the following tags when saving memories to the memory bank:

- **task-category**: The category of the task (e.g., `task-setup`, `task-implementation`, `task-testing`)
- **component-name**: The component being worked on (e.g., `component-ritual-engine`, `component-validator`)
- **template-type**: The type of template being used (e.g., `template-agent-prompt`, `template-protocol`)

Example tags:

```
template-agent-prompt       # Template used for assistant prompt structure
workflow-agent-setup        # Steps to integrate assistants with `.cursorrules`
fix-missing-prompts         # Patch for gaps in assistant coverage
tool-extract-prompts        # Prompt extraction utility enhancements
ci-agent-sync               # CI integration for assistant prompt automation
```

## Memory Bank Commands

The memory bank can be accessed using the following commands:

```bash
# Save a new memory
python tools/memory.py save --title "Memory Title" --tags tag1,tag2 --notes "Memory notes"

# Search for memories
python tools/memory.py search --query "search term"

# List all memories
python tools/memory.py list

# Get a specific memory
python tools/memory.py get --id memory_id
```

## Integration with Strategic AI

When using the Strategic AI prompt template, consider adding relevant memories to provide context:

1. Search for relevant memories using `python tools/memory.py search`
2. Include the memory content in the "Project Context" section of the prompt template
3. Reference the memory ID for traceability

## CI/CD Integration

The memory bank is integrated with CI/CD pipelines to automatically:

1. Save memories when PRs are merged
2. Update the memory index
3. Generate reports on project progress

## Best Practices

1. **Be Specific**: Use specific, descriptive titles for memories
2. **Use Tags**: Always include relevant tags to make memories searchable
3. **Include Context**: Provide enough context in the notes for the memory to be useful on its own
4. **Link Related Memories**: Reference related memories by ID in the notes
5. **Update Regularly**: Keep the memory bank up to date with the latest project state

## Example Usage

```bash
# Save a memory about implementing the ritual engine
python tools/memory.py save \
  --title "Ritual Engine Implementation" \
  --tags component-ritual-engine,task-implementation \
  --notes "Implemented the core ritual engine with support for conditional steps and error recovery."

# Search for memories related to the ritual engine
python tools/memory.py search --query "ritual engine"

# Include a memory in a Strategic AI prompt
python tools/memory.py get --id ritual-engine-implementation
```
