# Memory Bank Configuration for Mirrorwright Orchestrator

This document outlines the configuration for the Cline memory bank integration with the Mirrorwright Orchestrator project.

## Memory Bank Structure

The memory bank is organized as follows:

```
cursor-memory-bank/
├── memory_index.json       # Index of all memories
├── memory-bank/            # Directory containing memory files
│   ├── activeContext.md    # Current development focus
│   ├── tasks.md            # Task tracking
│   └── progress.md         # Implementation progress
```

## Memory Tags

Use the following tags when saving memories to the memory bank:

```bash
# Core Project Tags
project-architecture       # High-level architecture decisions
protocol-design            # Protocol structure and design
validation-system          # Schema validation components
agent-integration          # Agent communication and integration

# Implementation Tags
feature-implementation     # New feature implementation
bug-fix                    # Bug fixes
refactor                   # Code refactoring
performance-optimization   # Performance improvements

# Documentation Tags
template-agent-prompt      # Template used for assistant prompt structure
workflow-agent-setup       # Steps to integrate assistants with `.cursorrules`
fix-missing-prompts        # Patch for gaps in assistant coverage
tool-extract-prompts       # Prompt extraction utility enhancements
ci-agent-sync              # CI integration for assistant prompt automation

# Process Tags
decision-record            # Important project decisions
lesson-learned             # Lessons learned during development
best-practice              # Best practices identified
```

## Memory Commands

Use the following commands to interact with the memory bank:

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

1. Extract assistant prompts from conversation logs
2. Generate new prompt templates based on the extracted prompts
3. Save the generated templates to the memory bank
4. Update the assistant prompts in the repository

This automation is configured in the `.github/workflows/update-assistant-prompts.yml` file.
