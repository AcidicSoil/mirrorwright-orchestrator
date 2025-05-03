# Mirrorwright - Prompt QA & Project State Reflection

## Inputs:
- Assistant: {{assistant.name}}
- Prompt Draft:
```markdown
{{promptContent}}
```

- Project State:
```txt
{{projectStateSnapshot}}
```

## Instructions:
1. Verify the prompt matches the assistant's role and current dev stage
2. Identify missing or outdated tasks
3. Recommend improvements or a full rewrite if needed

Model: GPT-4o  
Use for: Strategic alignment, prompt integrity, active development reflection
