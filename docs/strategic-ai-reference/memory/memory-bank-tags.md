# Memory Bank Tag Schema for Assistant Prompts

This document defines the tag schema for memory bank entries related to assistant prompts in the Mirrorwright Orchestrator project.

## Tag Categories

### Template Tags

Tags related to prompt templates:

```bash
# Tagging examples
template-agent-prompt       # Template used for assistant prompt structure
template-protocol           # Template used for protocol definitions
template-ritual             # Template used for ritual definitions
template-mode               # Template used for mode definitions
```

### Workflow Tags

Tags related to agent workflows:

```bash
# Tagging examples
workflow-agent-setup        # Steps to integrate assistants with `.cursorrules`
workflow-protocol-design    # Steps to design a new protocol
workflow-ritual-execution   # Steps to execute a ritual
workflow-mode-transition    # Steps to transition between modes
```

### Fix Tags

Tags related to fixes and patches:

```bash
# Tagging examples
fix-missing-prompts         # Patch for gaps in assistant coverage
fix-schema-validation       # Patch for schema validation issues
fix-ritual-execution        # Patch for ritual execution issues
fix-mode-transition         # Patch for mode transition issues
```

### Tool Tags

Tags related to tools and utilities:

```bash
# Tagging examples
tool-extract-prompts        # Prompt extraction utility enhancements
tool-validate-schema        # Schema validation utility enhancements
tool-execute-ritual         # Ritual execution utility enhancements
tool-transition-mode        # Mode transition utility enhancements
```

### CI/CD Tags

Tags related to CI/CD integration:

```bash
# Tagging examples
ci-agent-sync               # CI integration for assistant prompt automation
ci-schema-validation        # CI integration for schema validation
ci-ritual-execution         # CI integration for ritual execution testing
ci-mode-transition          # CI integration for mode transition testing
```

## Usage Examples

### Saving a Memory

```bash
# Save a memory about a new prompt template
python tools/memory.py save \
  --title "New Agent Prompt Template" \
  --tags template-agent-prompt,workflow-agent-setup \
  --notes "Created a new prompt template for the VibeCheck assistant to validate protocol consistency."
```

### Searching for Memories

```bash
# Search for memories related to prompt templates
python tools/memory.py search --query "template-agent-prompt"

# Search for memories related to workflow setup
python tools/memory.py search --query "workflow-agent-setup"
```

## Best Practices

1. **Be Consistent**: Use the established tag schema consistently
2. **Be Specific**: Use specific tags that clearly identify the category and purpose
3. **Use Multiple Tags**: Include multiple tags to make memories more discoverable
4. **Update Tags**: Update tags as the project evolves and new categories emerge
5. **Document New Tags**: Document new tags in this file when they are created
