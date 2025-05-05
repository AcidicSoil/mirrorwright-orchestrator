import { Logger } from '../utils/Logger';
import { IAssistantRule } from './interfaces/IAssistantRule';
import { IAssistantRulesRegistry } from './interfaces/IAssistantRulesRegistry';
import { RuleUpdateManager } from './RuleUpdateManager';
import { AssistantRuleSchema } from './AssistantRuleSchema';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'yaml';

/**
 * Central registry for managing assistant rules
 */
export class AssistantRulesRegistry implements IAssistantRulesRegistry {
  private rules: Map<string, IAssistantRule>;
  private logger: Logger;
  private updateManager: RuleUpdateManager;
  private schema: AssistantRuleSchema;

  /**
   * Create a new assistant rules registry
   */
  constructor() {
    this.rules = new Map();
    this.logger = new Logger();
    this.updateManager = new RuleUpdateManager();
    this.schema = new AssistantRuleSchema();
  }

  /**
   * Load all assistant rules from .cursorrules and other sources
   */
  public async loadRules(): Promise<void> {
    try {
      // Load from .cursorrules
      await this.loadFromCursorRules();
      
      // Load from prompt templates
      await this.loadFromPromptTemplates();
      
      // Load from guidelines files
      await this.loadFromGuidelinesFiles();
      
      this.logger.info(`Loaded ${this.rules.size} assistant rules`);
    } catch (error) {
      this.logger.error(`Failed to load assistant rules: ${error}`);
      throw new Error(`Failed to load assistant rules: ${error}`);
    }
  }

  /**
   * Load assistant definitions from .cursorrules
   */
  private async loadFromCursorRules(): Promise<void> {
    try {
      const cursorRulesPath = path.resolve(process.cwd(), '.cursorrules');
      const content = fs.readFileSync(cursorRulesPath, 'utf-8');

      // Extract assistant definitions using regex
      const assistantSection = content.match(/assistants:([\s\S]*?)(?=\n\n|$)/)?.[1] || '';
      const assistantMatches = [...assistantSection.matchAll(/(\w+):\s*"([^"]+)"/g)];

      for (const match of assistantMatches) {
        const name = match[1];
        const description = match[2];
        
        // Create basic rule if it doesn't exist
        if (!this.rules.has(name)) {
          this.rules.set(name, {
            name,
            description,
            version: '1.0.0',
            role: description,
            responsibilities: [],
            responseFormat: {
              structure: '',
              examples: []
            },
            interactionPatterns: {
              withHuman: '',
              withAssistants: {}
            },
            errorHandling: '',
            contextPreservation: ''
          });
        } else {
          // Update description if rule exists
          const rule = this.rules.get(name)!;
          rule.description = description;
        }
      }
    } catch (error) {
      this.logger.error(`Failed to load from .cursorrules: ${error}`);
    }
  }

  /**
   * Load assistant rules from prompt templates
   */
  private async loadFromPromptTemplates(): Promise<void> {
    try {
      const promptTemplatesDir = path.resolve(process.cwd(), 'prompt_templates');
      
      if (!fs.existsSync(promptTemplatesDir)) {
        this.logger.warn('Prompt templates directory not found');
        return;
      }
      
      const files = fs.readdirSync(promptTemplatesDir);
      
      for (const file of files) {
        const filePath = path.join(promptTemplatesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.parse(frontmatterMatch[1]);
          
          if (frontmatter.agent) {
            const name = frontmatter.agent;
            
            // Update rule if it exists
            if (this.rules.has(name)) {
              const rule = this.rules.get(name)!;
              rule.frontmatter = frontmatter;
              
              // Extract role from content if available
              const roleMatch = content.match(/## 🤖 Initial Context Setup\n\n([\s\S]*?)(?=\n\n---)/);
              if (roleMatch) {
                rule.role = roleMatch[1].trim();
              }
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to load from prompt templates: ${error}`);
    }
  }

  /**
   * Load assistant rules from guidelines files
   */
  private async loadFromGuidelinesFiles(): Promise<void> {
    try {
      // Check for guidelines files
      const files = fs.readdirSync(process.cwd());
      
      for (const file of files) {
        if (file.endsWith('-userGuidelines.md')) {
          const name = file.replace('-userGuidelines.md', '');
          
          // Update rule if it exists
          if (this.rules.has(name)) {
            const rule = this.rules.get(name)!;
            const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
            
            // Extract role from content if available
            const roleMatch = content.match(/## 🎯 Core Identity\n\n([\s\S]*?)(?=\n\n---)/);
            if (roleMatch) {
              rule.role = roleMatch[1].trim();
            }
            
            // Extract responsibilities from content if available
            const responsibilitiesMatch = content.match(/## 💡 Primary Responsibilities\n\n([\s\S]*?)(?=\n\n---)/);
            if (responsibilitiesMatch) {
              const responsibilities = responsibilitiesMatch[1].trim();
              const responsibilityMatches = [...responsibilities.matchAll(/\d+\.\s+\*\*([^*]+)\*\*\n\s+([\s\S]*?)(?=\n\n\d+\.|$)/g)];
              
              rule.responsibilities = responsibilityMatches.map(match => `${match[1]}: ${match[2].trim()}`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to load from guidelines files: ${error}`);
    }
  }

  /**
   * Get a specific assistant's rules
   * @param assistantName The name of the assistant
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
   * @param assistantName The name of the assistant
   * @param rule The updated rule
   */
  public async updateRule(assistantName: string, rule: Partial<IAssistantRule>): Promise<boolean> {
    try {
      // Check if assistant exists
      if (!this.rules.has(assistantName)) {
        this.logger.error(`Assistant "${assistantName}" not found`);
        return false;
      }
      
      // Get current rule
      const currentRule = this.rules.get(assistantName)!;
      
      // Create new rule with updates
      const newRule: IAssistantRule = {
        ...currentRule,
        ...rule
      };
      
      // Validate new rule
      const { valid, errors } = this.schema.validateRule(newRule);
      
      if (!valid) {
        this.logger.error(`Invalid rule for "${assistantName}":`);
        errors.forEach(error => this.logger.error(`  - ${error}`));
        return false;
      }
      
      // Update rule in memory
      this.rules.set(assistantName, newRule);
      
      // Create version history entry
      await this.updateManager.createVersionHistoryEntry(assistantName, currentRule, newRule);
      
      // Update files
      const cursorRulesUpdated = await this.updateManager.updateCursorRules(this.rules);
      const promptTemplatesUpdated = await this.updateManager.updatePromptTemplates(newRule);
      const guidelinesUpdated = await this.updateManager.updateGuidelinesFiles(newRule);
      
      if (!cursorRulesUpdated || !promptTemplatesUpdated || !guidelinesUpdated) {
        this.logger.warn(`Some updates failed for "${assistantName}"`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to update rule for "${assistantName}": ${error}`);
      return false;
    }
  }

  /**
   * Add a new assistant rule
   * @param assistantName The name of the assistant
   * @param rule The new rule
   */
  public async addRule(assistantName: string, rule: IAssistantRule): Promise<boolean> {
    try {
      // Check if assistant already exists
      if (this.rules.has(assistantName)) {
        this.logger.error(`Assistant "${assistantName}" already exists`);
        return false;
      }
      
      // Ensure name is set
      rule.name = assistantName;
      
      // Validate new rule
      const { valid, errors } = this.schema.validateRule(rule);
      
      if (!valid) {
        this.logger.error(`Invalid rule for "${assistantName}":`);
        errors.forEach(error => this.logger.error(`  - ${error}`));
        return false;
      }
      
      // Add rule to memory
      this.rules.set(assistantName, rule);
      
      // Create version history entry
      await this.updateManager.createVersionHistoryEntry(assistantName, null, rule);
      
      // Update files
      const cursorRulesUpdated = await this.updateManager.updateCursorRules(this.rules);
      const promptTemplatesUpdated = await this.updateManager.updatePromptTemplates(rule);
      const guidelinesUpdated = await this.updateManager.updateGuidelinesFiles(rule);
      
      if (!cursorRulesUpdated || !promptTemplatesUpdated || !guidelinesUpdated) {
        this.logger.warn(`Some updates failed for "${assistantName}"`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to add rule for "${assistantName}": ${error}`);
      return false;
    }
  }

  /**
   * Remove an assistant rule
   * @param assistantName The name of the assistant
   */
  public async removeRule(assistantName: string): Promise<boolean> {
    try {
      // Check if assistant exists
      if (!this.rules.has(assistantName)) {
        this.logger.error(`Assistant "${assistantName}" not found`);
        return false;
      }
      
      // Get current rule for history
      const currentRule = this.rules.get(assistantName)!;
      
      // Remove rule from memory
      this.rules.delete(assistantName);
      
      // Create version history entry
      await this.updateManager.createVersionHistoryEntry(
        assistantName,
        currentRule,
        { ...currentRule, metadata: { removed: true } }
      );
      
      // Update files
      const cursorRulesUpdated = await this.updateManager.updateCursorRules(this.rules);
      
      if (!cursorRulesUpdated) {
        this.logger.warn(`Failed to update .cursorrules for "${assistantName}"`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to remove rule for "${assistantName}": ${error}`);
      return false;
    }
  }

  /**
   * Validate all rules against schema
   */
  public validateAllRules(): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    let valid = true;
    
    for (const [name, rule] of this.rules.entries()) {
      const result = this.schema.validateRule(rule);
      
      if (!result.valid) {
        valid = false;
        errors[name] = result.errors;
      }
    }
    
    return { valid, errors };
  }

  /**
   * Export rules to various formats
   * @param format The format to export to (json, yaml, markdown)
   */
  public exportRules(format: 'json' | 'yaml' | 'markdown'): string {
    const rulesArray = Array.from(this.rules.values());
    
    switch (format) {
      case 'json':
        return JSON.stringify(rulesArray, null, 2);
      
      case 'yaml':
        return yaml.stringify(rulesArray);
      
      case 'markdown':
        let markdown = '# Assistant Rules\n\n';
        
        for (const rule of rulesArray) {
          markdown += `## ${rule.name}\n\n`;
          markdown += `**Description:** ${rule.description}\n\n`;
          markdown += `**Version:** ${rule.version}\n\n`;
          markdown += `**Role:** ${rule.role}\n\n`;
          
          markdown += '**Responsibilities:**\n\n';
          rule.responsibilities.forEach((responsibility, index) => {
            markdown += `${index + 1}. ${responsibility}\n`;
          });
          markdown += '\n';
          
          markdown += '**Response Format:**\n\n';
          markdown += `Structure: ${rule.responseFormat.structure}\n\n`;
          markdown += 'Examples:\n\n';
          rule.responseFormat.examples.forEach(example => {
            markdown += `- ${example}\n`;
          });
          markdown += '\n';
          
          markdown += '**Interaction Patterns:**\n\n';
          markdown += `With Human: ${rule.interactionPatterns.withHuman}\n\n`;
          markdown += 'With Assistants:\n\n';
          Object.entries(rule.interactionPatterns.withAssistants).forEach(([assistant, pattern]) => {
            markdown += `- ${assistant}: ${pattern}\n`;
          });
          markdown += '\n';
          
          markdown += `**Error Handling:** ${rule.errorHandling}\n\n`;
          markdown += `**Context Preservation:** ${rule.contextPreservation}\n\n`;
          
          if (rule.metadata) {
            markdown += '**Metadata:**\n\n';
            Object.entries(rule.metadata).forEach(([key, value]) => {
              markdown += `- ${key}: ${value}\n`;
            });
            markdown += '\n';
          }
          
          if (rule.tags) {
            markdown += `**Tags:** ${rule.tags.join(', ')}\n\n`;
          }
          
          markdown += '---\n\n';
        }
        
        return markdown;
    }
  }

  /**
   * Import rules from various formats
   * @param content The content to import
   * @param format The format to import from (json, yaml, markdown)
   */
  public async importRules(content: string, format: 'json' | 'yaml' | 'markdown'): Promise<boolean> {
    try {
      let rulesArray: IAssistantRule[] = [];
      
      switch (format) {
        case 'json':
          rulesArray = JSON.parse(content);
          break;
        
        case 'yaml':
          rulesArray = yaml.parse(content);
          break;
        
        case 'markdown':
          this.logger.error('Markdown import not implemented');
          return false;
      }
      
      // Validate and add each rule
      for (const rule of rulesArray) {
        const { valid, errors } = this.schema.validateRule(rule);
        
        if (!valid) {
          this.logger.error(`Invalid rule for "${rule.name}":`);
          errors.forEach(error => this.logger.error(`  - ${error}`));
          return false;
        }
        
        // Add or update rule
        if (this.rules.has(rule.name)) {
          await this.updateRule(rule.name, rule);
        } else {
          await this.addRule(rule.name, rule);
        }
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to import rules: ${error}`);
      return false;
    }
  }
}
