---
agent: roo
purpose: implementation
id: gpt-4o-mini-prompt-extractor
version: 1.0.0
---

# Mirrorwright Prompt Ops Task - o4-mini

## Goal

Build/adjust a fast utility to:

- Extract all assistant prompts from markdown logs
- Identify missing assistants from `.cursorrules`
- Save to `assistant-prompts/[name]-prompt.md` and a combined file

Focus: speed, scriptability, maintenance ease.

Current script path: `src/tools/extractAssistantPrompts.js`
Add: CLI help, clearer file error handling, CI-integration flag

Model: GPT-4o-mini
Use for: CLI tools, shell integration, automation
