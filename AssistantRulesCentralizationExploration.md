# Assistant Rules Centralization Exploration

May 5, 2025

## Core Question

"Single-point of contact for updating all assistant rules/instructions? How? Is it possible?"

## Current State Analysis

- Assistant definitions are stored in .cursorrules file
- Assistant prompts are extracted using extractAssistantPrompts.ts
- There's a report schema system for Augment's output reports
- Each assistant has specific roles and responsibilities
- Templates use YAML frontmatter for validation

## Implementation Plan

Create a Centralized Assistant Rules Registry that serves as the single point of contact for all assistant rules and instructions in the Mirrorwright Orchestrator.

## Summary of Implementation

We've designed and implemented a comprehensive solution for creating a single point of contact for updating all assistant rules and instructions in the Mirrorwright Orchestrator. Here's what we've created:

### AssistantRulesRegistry

A central class for managing all assistant rules with methods for:

- Loading rules from various sources (.cursorrules, prompt templates, guidelines files)
- Getting, updating, adding, and removing rules
- Validating rules against a schema
- Exporting and importing rules in various formats

### RuleUpdateManager

A class for propagating rule updates to various files:

- Updating .cursorrules with new assistant definitions
- Updating prompt templates with new assistant rules
- Updating guidelines files with new assistant rules
- Creating version history entries for rule updates

### AssistantRuleSchema

A class for validating assistant rules against a JSON Schema:

- Defined a comprehensive schema for assistant rules
- Implemented validation logic

### CLI Interface

A command-line interface for managing assistant rules:

- View, update, add, remove, and validate rules
- Export and import rules in various formats

### Documentation

Comprehensive documentation for the assistant rules registry:

- Implementation plan
- README with usage examples
- Schema documentation

### Example Rules

Sample rule files for Augment and Cline to demonstrate the format

## Usage

The AssistantRulesRegistry can be used as follows:

```typescript
// Import the registry
import { AssistantRulesRegistry } from './src/assistant/AssistantRulesRegistry';

// Create a new registry
const registry = new AssistantRulesRegistry();

// Load all assistant rules
await registry.loadRules();

// Get a specific assistant's rules
const augmentRule = registry.getRule('augment');

// Update a specific assistant's rules
await registry.updateRule('augment', {
  description: 'New description',
  version: '1.1.0'
});

// Add a new assistant
await registry.addRule('newassistant', {
  name: 'newassistant',
  description: 'New assistant',
  version: '1.0.0',
  // ... other required fields
});

// Remove an assistant
await registry.removeRule('oldassistant');

// Validate all rules
const { valid, errors } = registry.validateAllRules();

// Export rules to various formats
const jsonRules = registry.exportRules('json');
const yamlRules = registry.exportRules('yaml');
const markdownRules = registry.exportRules('markdown');

// Import rules from various formats
await registry.importRules(jsonContent, 'json');
```

The CLI interface can be used as follows:

```bash
# View all assistant rules
npm run assistant-rules:view

# View rules for a specific assistant
npm run assistant-rules:view -- augment

# Update assistant rules from a file
npm run assistant-rules:update -- augment --file examples/assistant-rules/augment-rule.json

# Add a new assistant from a file
npm run assistant-rules:add -- newassistant --file examples/assistant-rules/new-assistant-rule.json

# Remove an assistant
npm run assistant-rules:remove -- oldassistant

# Validate all assistant rules
npm run assistant-rules:validate

# Export rules to a file
npm run assistant-rules:export -- --format yaml --output assistant-rules.yaml

# Import rules from a file
npm run assistant-rules:import -- --file assistant-rules.yaml --format yaml
```

## Next Steps

1. **Integration with extractAssistantPrompts.ts** - Modify extractAssistantPrompts.ts to use the AssistantRulesRegistry for loading assistant definitions and ensuring that extracted prompts are consistent with the centralized rules.
2. **Add Tests** - Create unit tests for the AssistantRulesRegistry, RuleUpdateManager, and AssistantRuleSchema classes, as well as integration tests for the CLI interface.
3. **Implement Version Control** - Enhance the version control system for assistant rules to track changes over time and support rollbacks.
4. **Add Web Interface** - Create a web interface for managing assistant rules, making it easier for non-technical users to update rules.
5. **Enhance Documentation** - Add more detailed documentation for each component, including examples and best practices.

## Implementation Files

### Core Implementation Files

- src/assistant/AssistantRulesRegistry.ts - Main registry class
- src/assistant/RuleUpdateManager.ts - Update propagation manager
- src/assistant/AssistantRuleSchema.ts - Schema validation
- src/assistant/interfaces/IAssistantRule.ts - Rule interface
- src/assistant/interfaces/IAssistantRulesRegistry.ts - Registry interface
- src/schemas/assistant-rule.schema.yaml - JSON Schema for rules
- src/cli/assistant-rules.ts - CLI interface

### Documentation Files

- docs/README.assistant-rules-registry.md - Main documentation
- docs/assistant-rules-registry-implementation-plan.md - Implementation plan

### Example Files

- examples/assistant-rules/augment-rule.json - Example rule for Augment
- examples/assistant-rules/cline-rule.json - Example rule for Cline