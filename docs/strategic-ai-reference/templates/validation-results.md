# Prompt Template Validation Results

This document shows the current validation status of prompt templates in the Mirrorwright Orchestrator project.

## Valid Templates

The following prompt templates have valid frontmatter and conform to the established standards:

1. `prompt_templates/assistant-prompt-extraction-config.md`
2. `prompt_templates/augment-prompt-extractor-update.md`
3. `prompt_templates/augment-refactor-prompt.md`
4. `prompt_templates/cline-architecture-prompt.md`
5. `prompt_templates/cline-prompt-ci-validation.md`
6. `prompt_templates/codebase-utilization-config.md`
7. `prompt_templates/cursorscan-prompt-analytics.md`
8. `prompt_templates/cursorscan-prompt.md`
9. `prompt_templates/gpt-4.5-prompt-generator.md`
10. `prompt_templates/gpt-4o-mini-prompt-extractor.md`
11. `prompt_templates/gpt-4o-prompt-validator.md`
12. `prompt_templates/memory-bank-config.md`
13. `prompt_templates/memory-bank-tags.md`
14. `prompt_templates/mirrorwright-strategic-ai-conversation-example.md`
15. `prompt_templates/mirrorwright-strategic-ai-conversation-template.md`
16. `prompt_templates/prompt-frontmatter-standard.md`
17. `prompt_templates/promptrouter-prompt.md`
18. `prompt_templates/promptrouter-template-selection.md`
19. `prompt_templates/README.md`
20. `prompt_templates/roo-cli-prompt.md`
21. `prompt_templates/roo-prompt-generator.md`
22. `prompt_templates/strategicai-prompt-architecture.md`
23. `prompt_templates/strategicai-prompt.md`
24. `prompt_templates/vibecheck-prompt-standard.md`
25. `prompt_templates/vibecheck-prompt.md`

## Invalid Templates

No invalid templates were found in the current validation run.

## Validation Process

Templates are validated using the following criteria:

1. Must include YAML frontmatter with the required fields:
   - `agent`: The assistant this prompt is designed for
   - `purpose`: The primary purpose of this prompt
   - `id`: A unique identifier for this prompt
   - `version`: Semantic version number

2. The `agent` field must match one of the assistants defined in `.cursorrules`

3. The `purpose` field must be one of the recognized purpose categories

4. The `id` field must be unique across all prompt templates

5. The `version` field must follow semantic versioning (MAJOR.MINOR.PATCH)

## Validation Tool

Templates are validated using the frontmatter validation tool:

```bash
node src/tools/check-frontmatter.js
```

This tool is integrated with the CI/CD pipeline to ensure that all prompt templates conform to the established standards.
