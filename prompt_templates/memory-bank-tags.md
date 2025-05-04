---
agent: cline
purpose: documentation
id: memory-bank-tag-schema
version: 1.0.0
---

# Memory Bank Tag Schema for Assistant Prompts

```bash
# Tagging examples
template-agent-prompt       # Template used for assistant prompt structure
workflow-agent-setup        # Steps to integrate assistants with `.cursorrules`
fix-missing-prompts         # Patch for gaps in assistant coverage
tool-extract-prompts        # Prompt extraction utility enhancements
ci-agent-sync               # CI integration for assistant prompt automation
```

Example command:

```bash
venv/bin/python tools/memory.py save --title "Agent Prompt Extractor with CI" \
  --tags tool-extract-prompts,ci-agent-sync,template-agent-prompt \
  --notes "Added GitHub Action for syncing prompts after markdown strategy updates"
```
