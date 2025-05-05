---
agent: strategicai
purpose: Review and evaluate documentation organization proposals
id: gpt4o-review-docs-organization
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Reviewing and evaluating the proposed documentation organization strategy for Mirrorwright Orchestrator, focusing on the strategic-ai-reference directory structure, README templates, $docref linking approach, and prompt extraction workflow integration.

---

## 🧩 Current Phase

- [x] Implementation & Prototyping
- [x] Documentation & Examples

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `docs/strategic-ai-reference/docs-upload-strategy.md`
- `docs/strategic-ai-reference/readme-templates.md`
- `tools/validate-docrefs.ts` (proposed)
- `src/tools/extractAssistantPrompts.js`
- `src/tools/prompt-extraction/cli.ts`

### Relevant Memory Bank Tags:
[#documentation], [#strategy], [#assistant-infra], [#mirrorwright], [#prompt-extraction]

---

## ✅ Expected Output

1. Evaluate the proposed 7-category documentation organization structure
2. Assess the README templates for each subfolder
3. Review the $docref auto-linking strategy and format choices (.schema.md vs .schema.yaml)
4. Provide specific recommendations for improving prompt extraction tool integration
5. Suggest workflow improvements to prevent overwriting existing prompt files
6. Identify any potential implementation challenges or missing considerations

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Prompt extraction tool currently overwrites existing files in output directory

Additional considerations:
- Documentation must serve both human developers and AI assistants
- Structure should support automated extraction and validation
- Organization should reduce cognitive load and improve navigability
- System must scale as the project grows with new assistants and schemas
- Need backup strategy for existing prompt files before extraction

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Documentation Organization and Prompt Extraction Workflow" \
  --tags documentation,strategic-ai-reference,docref,prompt-extraction \
  --notes "Evaluation of documentation structure and improvements to prompt extraction workflow"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the strategic-ai-reference directory structure with README templates based on the reviewed strategy. Add $docref links to schema files using the approved format. Enhance the prompt extraction tool with backup capabilities."_
- **Prompt for Cline:** _"Plan the integration of the documentation organization strategy with existing validation tools and CI/CD pipelines. Design a validation step for prompt templates."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
As GPT-4o, please review our proposed documentation organization strategy for the Mirrorwright Orchestrator project and our prompt extraction workflow. 

For documentation organization, we've designed a structure centered around a `strategic-ai-reference` directory with 7 categories (core, schemas, tools, assistants, memory, templates, conversations), README templates for each subfolder, and a $docref linking system for schema files.

For prompt extraction, we currently use `extractAssistantPrompts.js` which overwrites existing files in the output directory without confirmation.

I'd like your assessment of:
1. The overall documentation organization approach and category breakdown
2. The README template structure and content
3. The decision to use .schema.md over .schema.yaml for LLM-friendly access
4. The $docref linking conventions and validation approach
5. How to better integrate the prompt extraction tool into our workflow
6. Strategies to prevent accidental overwriting of existing prompt files

Please identify any potential issues, suggest improvements, and evaluate how well these systems will scale as our project grows. Consider both human developer and AI assistant usage patterns.

### Assistant:
[GPT-4o's response will appear here]

### User:
Based on your review, what specific implementation steps should we prioritize first? And what would be the most effective way to implement a backup strategy for the prompt extraction tool that preserves version history while still allowing for automated updates?

### Assistant:
[GPT-4o's follow-up response will appear here]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.

## 🔄 Prompt Extraction Workflow Improvements

To better integrate the prompt extraction tool into your workflow:

1. **Add a Script to package.json**:
   ```json
   "scripts": {
     "extract-prompts": "node src/tools/extractAssistantPrompts.js",
     "extract-prompts:templates": "ts-node src/tools/prompt-extraction/cli.ts --templates-dir prompt_templates"
   }
   ```

2. **Create a Backup Strategy**:
   ```bash
   # Bash script example (save as extract-with-backup.sh)
   #!/bin/bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="prompt-output-backup-$TIMESTAMP"

   # Backup existing prompts if directory exists
   if [ -d "prompt-output" ]; then
     mkdir -p "$BACKUP_DIR"
     cp -r prompt-output/* "$BACKUP_DIR"
     echo "Backed up existing prompts to $BACKUP_DIR"
   fi

   # Run extraction tool
   node src/tools/extractAssistantPrompts.js "$1" prompt-output
   ```

3. **Implement Version Control Integration**:
   - Ensure prompt files are tracked in git
   - Create pre-commit hooks for validation

4. **Create a Validation Step**:
   - Add validation for frontmatter completeness
   - Check for required fields in prompt templates

5. **Implement a Two-Way Sync**:
   - Create tools to sync changes between prompt files and conversation logs

6. **Integrate with CI/CD**:
   - Add extraction to your pipeline
   - Automate validation and testing

7. **Create a Prompt Template Generator**:
   - Build tools to generate new templates with proper frontmatter

8. **Implement a Prompt Diff Tool**:
   - Show differences between extracted and existing prompts before overwriting
