# Assistant Rules Registry Implementation Plan

## Overview

This document outlines the implementation plan for the AssistantRulesRegistry, a centralized system for managing all assistant rules and instructions in the Mirrorwright Orchestrator. The registry will serve as a single point of contact for updating assistant rules, ensuring changes propagate consistently across the system.

## Architecture

### Core Components

1. **AssistantRulesRegistry**
   - Central class for managing assistant rules
   - Provides methods for reading, updating, and validating rules
   - Handles persistence and propagation of changes

2. **AssistantRuleSchema**
   - JSON Schema for validating assistant rules
   - Ensures consistency and required fields

3. **RuleUpdateManager**
   - Handles the propagation of rule updates to various files
   - Manages version control and change history

4. **CLI Interface**
   - Command-line tools for interacting with the registry
   - Supports viewing, updating, and validating rules

### Directory Structure

```
src/
├── assistant/
│   ├── AssistantRulesRegistry.ts       # Main registry class
│   ├── AssistantRuleSchema.ts          # Schema definition
│   ├── RuleUpdateManager.ts            # Update propagation
│   └── interfaces/
│       ├── IAssistantRule.ts           # Rule interface
│       └── IAssistantRulesRegistry.ts  # Registry interface
├── cli/
│   └── assistant-rules.ts              # CLI commands
└── schemas/
    └── assistant-rule.schema.yaml      # JSON Schema for rules
```

## Implementation Details

### 1. AssistantRulesRegistry Class

```typescript
// src/assistant/AssistantRulesRegistry.ts

import { Logger } from '../utils/Logger';
import { IAssistantRule } from './interfaces/IAssistantRule';
import { RuleUpdateManager } from './RuleUpdateManager';
import { validateRule } from './AssistantRuleSchema';

export class AssistantRulesRegistry {
  private rules: Map<string, IAssistantRule>;
  private logger: Logger;
  private updateManager: RuleUpdateManager;

  constructor() {
    this.rules = new Map();
    this.logger = new Logger();
    this.updateManager = new RuleUpdateManager();
  }

  /**
   * Load all assistant rules from .cursorrules and other sources
   */
  public async loadRules(): Promise<void> {
    // Load from .cursorrules
    // Load from prompt templates
    // Load from guidelines files
  }

  /**
   * Get a specific assistant's rules
   */
  public getRule(assistantName: string): IAssistantRule | undefined {
    return this.rules.get(assistantName);
  }

  /**
   * Get all assistant rules
   */
  public getAllRules(): Map<string, IAssistantRule> {
    return this.rules;
  }

  /**
   * Update a specific assistant's rules
   */
  public async updateRule(assistantName: string, rule: Partial<IAssistantRule>): Promise<boolean> {
    // Validate rule update
    // Update in-memory rule
    // Propagate changes via updateManager
    // Return success/failure
  }

  /**
   * Add a new assistant rule
   */
  public async addRule(assistantName: string, rule: IAssistantRule): Promise<boolean> {
    // Validate new rule
    // Add to in-memory rules
    // Propagate changes via updateManager
    // Return success/failure
  }

  /**
   * Remove an assistant rule
   */
  public async removeRule(assistantName: string): Promise<boolean> {
    // Remove from in-memory rules
    // Propagate changes via updateManager
    // Return success/failure
  }

  /**
   * Validate all rules against schema
   */
  public validateAllRules(): { valid: boolean; errors: Record<string, string[]> } {
    // Validate all rules against schema
    // Return validation results
  }
}
```

### 2. IAssistantRule Interface

```typescript
// src/assistant/interfaces/IAssistantRule.ts

export interface IAssistantRule {
  name: string;
  description: string;
  version: string;
  role: string;
  responsibilities: string[];
  responseFormat: {
    structure: string;
    examples: string[];
  };
  interactionPatterns: {
    withHuman: string;
    withAssistants: Record<string, string>;
  };
  errorHandling: string;
  contextPreservation: string;
  metadata: Record<string, any>;
}
```

### 3. AssistantRuleSchema

```typescript
// src/assistant/AssistantRuleSchema.ts

import Ajv from 'ajv';
import { IAssistantRule } from './interfaces/IAssistantRule';

const ajv = new Ajv({ allErrors: true });

// Load schema from YAML file
const schema = loadSchemaFromFile('../schemas/assistant-rule.schema.yaml');

// Compile validator
const validate = ajv.compile(schema);

/**
 * Validate an assistant rule against the schema
 */
export function validateRule(rule: Partial<IAssistantRule>): { valid: boolean; errors: string[] } {
  const valid = validate(rule);
  
  if (!valid) {
    return {
      valid: false,
      errors: (validate.errors || []).map(err => `${err.instancePath} ${err.message}`)
    };
  }
  
  return { valid: true, errors: [] };
}
```

### 4. RuleUpdateManager

```typescript
// src/assistant/RuleUpdateManager.ts

import { IAssistantRule } from './interfaces/IAssistantRule';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'yaml';

export class RuleUpdateManager {
  private logger: Logger;
  
  constructor() {
    this.logger = new Logger();
  }
  
  /**
   * Update .cursorrules file with new assistant definitions
   */
  public async updateCursorRules(rules: Map<string, IAssistantRule>): Promise<boolean> {
    // Read current .cursorrules
    // Update assistant definitions
    // Write back to file
    // Return success/failure
  }
  
  /**
   * Update prompt templates with new assistant rules
   */
  public async updatePromptTemplates(rule: IAssistantRule): Promise<boolean> {
    // Find relevant prompt templates
    // Update content based on rule changes
    // Write back to files
    // Return success/failure
  }
  
  /**
   * Update guidelines files with new assistant rules
   */
  public async updateGuidelinesFiles(rule: IAssistantRule): Promise<boolean> {
    // Find relevant guidelines files
    // Update content based on rule changes
    // Write back to files
    // Return success/failure
  }
  
  /**
   * Create version history entry for rule update
   */
  public async createVersionHistoryEntry(
    assistantName: string,
    oldRule: IAssistantRule | null,
    newRule: IAssistantRule
  ): Promise<void> {
    // Create version history entry
    // Store in version history file
  }
}
```

### 5. CLI Interface

```typescript
// src/cli/assistant-rules.ts

import { program } from 'commander';
import { AssistantRulesRegistry } from '../assistant/AssistantRulesRegistry';
import { Logger } from '../utils/Logger';

const registry = new AssistantRulesRegistry();
const logger = new Logger();

// View command
program
  .command('view [assistant]')
  .description('View assistant rules')
  .action(async (assistant?: string) => {
    await registry.loadRules();
    
    if (assistant) {
      const rule = registry.getRule(assistant);
      if (rule) {
        console.log(JSON.stringify(rule, null, 2));
      } else {
        logger.error(`Assistant "${assistant}" not found`);
      }
    } else {
      const rules = registry.getAllRules();
      console.log(JSON.stringify(Array.from(rules.entries()), null, 2));
    }
  });

// Update command
program
  .command('update <assistant>')
  .description('Update assistant rules')
  .option('-f, --file <file>', 'JSON file with rule updates')
  .option('-r, --role <role>', 'Update assistant role')
  .option('-d, --description <description>', 'Update assistant description')
  // Add more options for other fields
  .action(async (assistant, options) => {
    await registry.loadRules();
    
    const rule = registry.getRule(assistant);
    if (!rule) {
      logger.error(`Assistant "${assistant}" not found`);
      return;
    }
    
    const updates: Record<string, any> = {};
    
    // Process file if provided
    if (options.file) {
      try {
        const fileContent = fs.readFileSync(options.file, 'utf-8');
        const fileUpdates = JSON.parse(fileContent);
        Object.assign(updates, fileUpdates);
      } catch (error) {
        logger.error(`Failed to read update file: ${error}`);
        return;
      }
    }
    
    // Process individual field updates
    if (options.role) updates.role = options.role;
    if (options.description) updates.description = options.description;
    // Process other fields
    
    const success = await registry.updateRule(assistant, updates);
    
    if (success) {
      logger.info(`Successfully updated rules for "${assistant}"`);
    } else {
      logger.error(`Failed to update rules for "${assistant}"`);
    }
  });

// Add command
program
  .command('add <assistant>')
  .description('Add a new assistant')
  .requiredOption('-f, --file <file>', 'JSON file with assistant rules')
  .action(async (assistant, options) => {
    await registry.loadRules();
    
    try {
      const fileContent = fs.readFileSync(options.file, 'utf-8');
      const rule = JSON.parse(fileContent);
      
      const success = await registry.addRule(assistant, rule);
      
      if (success) {
        logger.info(`Successfully added assistant "${assistant}"`);
      } else {
        logger.error(`Failed to add assistant "${assistant}"`);
      }
    } catch (error) {
      logger.error(`Failed to read rule file: ${error}`);
    }
  });

// Remove command
program
  .command('remove <assistant>')
  .description('Remove an assistant')
  .action(async (assistant) => {
    await registry.loadRules();
    
    const success = await registry.removeRule(assistant);
    
    if (success) {
      logger.info(`Successfully removed assistant "${assistant}"`);
    } else {
      logger.error(`Failed to remove assistant "${assistant}"`);
    }
  });

// Validate command
program
  .command('validate [assistant]')
  .description('Validate assistant rules')
  .action(async (assistant?: string) => {
    await registry.loadRules();
    
    if (assistant) {
      const rule = registry.getRule(assistant);
      if (!rule) {
        logger.error(`Assistant "${assistant}" not found`);
        return;
      }
      
      const { valid, errors } = validateRule(rule);
      
      if (valid) {
        logger.info(`Rules for "${assistant}" are valid`);
      } else {
        logger.error(`Rules for "${assistant}" are invalid:`);
        errors.forEach(error => logger.error(`  - ${error}`));
      }
    } else {
      const { valid, errors } = registry.validateAllRules();
      
      if (valid) {
        logger.info('All assistant rules are valid');
      } else {
        logger.error('Some assistant rules are invalid:');
        Object.entries(errors).forEach(([assistant, assistantErrors]) => {
          logger.error(`  ${assistant}:`);
          assistantErrors.forEach(error => logger.error(`    - ${error}`));
        });
      }
    }
  });

program.parse(process.argv);
```

## Integration with Existing Tools

### 1. Integration with extractAssistantPrompts.ts

The AssistantRulesRegistry will be integrated with the existing extractAssistantPrompts.ts tool to ensure that extracted prompts are consistent with the centralized rules. This will involve:

1. Modifying extractAssistantPrompts.ts to use the AssistantRulesRegistry for loading assistant definitions
2. Ensuring that extracted prompts are validated against the rules in the registry
3. Providing a way to update the registry when new prompts are extracted

### 2. Integration with Validation System

The AssistantRulesRegistry will be integrated with the existing validation system to ensure that assistant rules are properly validated. This will involve:

1. Adding a new schema for assistant rules
2. Integrating with the ValidatorEngine
3. Adding validation hooks for assistant rules

## Implementation Steps

1. **Create Schema Definition**
   - Define JSON Schema for assistant rules
   - Implement validation functions

2. **Implement Core Classes**
   - Implement AssistantRulesRegistry
   - Implement RuleUpdateManager
   - Define interfaces

3. **Integrate with Existing Tools**
   - Modify extractAssistantPrompts.ts
   - Integrate with validation system

4. **Implement CLI Interface**
   - Create commands for viewing, updating, adding, removing, and validating rules

5. **Add Tests**
   - Unit tests for core classes
   - Integration tests for CLI interface
   - Validation tests for schema

6. **Update Documentation**
   - Add documentation for the AssistantRulesRegistry
   - Update existing documentation to reference the registry

## Conclusion

The AssistantRulesRegistry will provide a centralized system for managing all assistant rules and instructions in the Mirrorwright Orchestrator. By implementing this registry, we will create a single point of contact for updating assistant rules, ensuring changes propagate consistently across the system while maintaining the existing extraction process and validation.
