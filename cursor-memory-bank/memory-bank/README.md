# Memory Bank Files

This directory contains the memory bank files for the Mirrorwright Orchestrator project.

## Core Files

- **tasks.md**: Central source of truth for task tracking
- **activeContext.md**: Maintains focus of current development phase
- **progress.md**: Tracks implementation status

## Usage

These files are used by the Memory Bank system to track development progress and maintain context across different development phases.

## Memory Management

Use the memory.py script to save and retrieve memories:

```bash
# Save a new memory
python tools/memory.py save --title "Task Title" --tags tag1,tag2 --notes "Important notes"

# Search existing memories
python tools/memory.py search --query "keywords"
```

## Tags

Use these standard tags to keep your Memory Bank clean and powerful:

| Tag Group            | Example Usage                                  | Purpose                                  |
| -------------------- | ---------------------------------------------- | ---------------------------------------- |
| `topic-[subject]`    | `topic-typescript`, `topic-protocol`           | Fast search by subject or tool           |
| `task-[type]`        | `task-debugging`, `task-setup`                 | Search by type of task                   |
| `fix-[issue]`        | `fix-validation`, `fix-api`                    | Quickly retrieve fixes for common errors |
| `template-[usecase]` | `template-protocol`, `template-ritual`         | Find reusable templates                  |
| `workflow-[process]` | `workflow-validation`, `workflow-orchestrator` | Retrieve full step-by-step flows         |
