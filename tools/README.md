# Mirrorwright Orchestrator Tools

This directory contains various tools for the Mirrorwright Orchestrator project.

## Memory Bank Tools

### memory.py

A tool for managing the memory bank system.

```bash
# Save a new memory
python tools/memory.py save --title "Task Title" --tags tag1,tag2 --notes "Important notes"

# Search existing memories
python tools/memory.py search --query "keywords"
```

### setup_memory_bank.py

A tool for setting up and verifying the memory bank system.

```bash
# Check if the memory bank system is properly set up
python tools/setup_memory_bank.py --check

# Set up the memory bank system
python tools/setup_memory_bank.py --setup
```

### memory_maintenance.py

A tool for maintaining the memory bank system.

```bash
# List all memories in the memory bank
python tools/memory_maintenance.py --list

# List all tags used in the memory bank
python tools/memory_maintenance.py --tags

# Generate a report of the memory bank
python tools/memory_maintenance.py --report
```

## Conversation and Prompt Tools

### recreate-conversation.js

A tool for creating new conversation templates based on the Strategic AI Prompt Template.

```bash
# Create a new conversation template
node tools/recreate-conversation.js path/to/new-conversation.md
```

This tool:

1. Copies the Strategic AI conversation template
2. Prompts you for the task context
3. Creates a new file with the template and your task context
4. Prepares it for use with any AI assistant (Cursor agents or ChatGPT)

### extractAssistantPrompts.js

A tool for extracting assistant prompts from conversation logs.

```bash
# Extract prompts from a conversation log
node tools/extractAssistantPrompts.js [conversationPath] [outputDir]
```

Where:

- `conversationPath` is the path to the conversation log file (default: `extractAssistantPrompts.md`)
- `outputDir` is the directory to save the extracted prompts (default: `assistant-prompts`)

## Other Tools

### llm_api.py

A tool for interacting with language models.

```bash
python tools/llm_api.py --prompt "Your question" --provider "openai"
```

### screenshot_utils.py

A tool for taking screenshots of web pages.

```bash
python tools/screenshot_utils.py URL --output output.png
```

### search_engine.py

A tool for searching the web.

```bash
python tools/search_engine.py "search keywords"
```

### web_scraper.py

A tool for scraping web pages.

```bash
python tools/web_scraper.py --max-concurrent 3 URL1 URL2
```
