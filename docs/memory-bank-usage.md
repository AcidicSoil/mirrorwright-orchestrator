# Cline Memory Bank Usage Guide

## Overview

The Cline Memory Bank is a structured documentation system that allows Cline to maintain context across sessions. It transforms Cline from a stateless assistant into a persistent development partner that can effectively "remember" your project details over time.

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

```
projectbrief.md → productContext.md → activeContext.md → progress.md
     ↓                                     ↑
systemPatterns.md → techContext.md --------+
```

### Core Files

1. **projectbrief.md**
   - Foundation document that shapes all other files
   - Defines core requirements and goals
   - Source of truth for project scope

2. **productContext.md**
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. **activeContext.md**
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. **systemPatterns.md**
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. **techContext.md**
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. **progress.md**
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

## Setting Up the Memory Bank

### Initial Setup

1. Run the setup script to create the memory bank structure:

   ```bash
   python tools/setup_memory_bank.py --setup
   ```

2. Verify the setup:

   ```bash
   python tools/setup_memory_bank.py --check
   ```

3. Update the core memory bank files with project-specific information.

### Integrating with Cline

1. Add the Cline Memory Bank custom instructions to your `.clinerules` file:

   ```bash
   cat .clinerules-memory-bank >> .clinerules
   ```

   Or, if you prefer to keep them separate, you can reference the file in your conversations with Cline.

## Using the Memory Bank

### Saving Memories

Use the `memory.py` script to save important lessons, templates, and workflows:

```bash
python tools/memory.py save --title "Task Title" --tags tag1,tag2 --notes "Important notes"
```

### Searching Memories

Search for existing memories:

```bash
python tools/memory.py search --query "keywords"
```

### Working with Cline

1. **Start a new task**: Ask Cline to "follow your custom instructions" to read the Memory Bank files and continue where you left off.

2. **Update the Memory Bank**: When you make significant progress or discover new patterns, ask Cline to "update memory bank" to document the current state.

3. **Plan Mode**: Use this mode for strategy discussions and high-level planning.

4. **Act Mode**: Use this mode for implementation and executing specific tasks.

## Best Practices

1. **Keep Memory Bank Files Updated**: Regularly update the memory bank files to reflect the current state of the project.

2. **Use Tags Consistently**: Develop a consistent tagging system for memories to make them easier to find.

3. **Document Key Decisions**: Record important decisions and their rationale in the memory bank.

4. **Update After Milestones**: Update the memory bank after completing significant milestones.

5. **Review Before New Tasks**: Review relevant memories before starting new tasks to maintain context.

## Troubleshooting

### Memory Bank Not Found

If Cline cannot find the memory bank files, verify that they exist in the correct location:

```bash
python tools/setup_memory_bank.py --check
```

### Cline Not Following Instructions

If Cline is not following the memory bank instructions, make sure you've added the custom instructions to your `.clinerules` file or explicitly ask Cline to "follow your custom instructions" at the start of your conversation.

### Memory Search Not Working

If memory search is not working, check that the memory index file exists and is properly formatted:

```bash
cat cursor-memory-bank/memory_index.json
```

## Advanced Usage

### Custom Modes

The memory bank system supports custom modes for different phases of development. These modes are defined in the `cursor-memory-bank/custom_modes` directory.

### Visual Process Maps

Visual process maps help guide Cline through complex workflows. These maps are defined in the `cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps` directory.

### Memory Bank Maintenance

Use the `memory_maintenance.py` script to clean up old memories, organize memories by tags, and generate reports:

```bash
python tools/memory_maintenance.py --clean
python tools/memory_maintenance.py --report
```
