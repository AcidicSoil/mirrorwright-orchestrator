import { IAssistantRule } from './interfaces/IAssistantRule';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'yaml';

/**
 * Class for managing updates to assistant rules
 */
export class RuleUpdateManager {
  private logger: Logger;
  
  /**
   * Create a new rule update manager
   */
  constructor() {
    this.logger = new Logger();
  }
  
  /**
   * Update .cursorrules file with new assistant definitions
   * @param rules Map of assistant rules
   * @returns Success or failure
   */
  public async updateCursorRules(rules: Map<string, IAssistantRule>): Promise<boolean> {
    try {
      const cursorRulesPath = path.resolve(process.cwd(), '.cursorrules');
      
      // Read current .cursorrules
      let content = fs.readFileSync(cursorRulesPath, 'utf-8');
      
      // Extract assistant section
      const assistantSection = content.match(/assistants:([\s\S]*?)(?=\n\n|$)/)?.[0] || '';
      
      // Create new assistant section
      let newAssistantSection = 'assistants:\n';
      for (const [name, rule] of rules.entries()) {
        newAssistantSection += `  ${name}: "${rule.description}"\n`;
      }
      
      // Replace assistant section
      content = content.replace(assistantSection, newAssistantSection);
      
      // Write back to file
      fs.writeFileSync(cursorRulesPath, content, 'utf-8');
      
      this.logger.info('Updated .cursorrules file');
      return true;
    } catch (error) {
      this.logger.error(`Failed to update .cursorrules: ${error}`);
      return false;
    }
  }
  
  /**
   * Update prompt templates with new assistant rules
   * @param rule The updated rule
   * @returns Success or failure
   */
  public async updatePromptTemplates(rule: IAssistantRule): Promise<boolean> {
    try {
      const promptTemplatesDir = path.resolve(process.cwd(), 'prompt_templates');
      
      // Find relevant prompt templates
      const files = fs.readdirSync(promptTemplatesDir);
      
      for (const file of files) {
        const filePath = path.join(promptTemplatesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check if this template is for the current assistant
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.parse(frontmatterMatch[1]);
          
          if (frontmatter.agent === rule.name) {
            // Update frontmatter
            const newFrontmatter = {
              ...frontmatter,
              version: rule.version
            };
            
            // Replace frontmatter
            const newContent = content.replace(
              /^---\n([\s\S]*?)\n---/,
              `---\n${yaml.stringify(newFrontmatter)}---`
            );
            
            // Write back to file
            fs.writeFileSync(filePath, newContent, 'utf-8');
            
            this.logger.info(`Updated prompt template: ${file}`);
          }
        }
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to update prompt templates: ${error}`);
      return false;
    }
  }
  
  /**
   * Update guidelines files with new assistant rules
   * @param rule The updated rule
   * @returns Success or failure
   */
  public async updateGuidelinesFiles(rule: IAssistantRule): Promise<boolean> {
    try {
      // Check for guidelines file
      const guidelinesFile = path.resolve(process.cwd(), `${rule.name}-userGuidelines.md`);
      
      if (fs.existsSync(guidelinesFile)) {
        // Read current guidelines
        let content = fs.readFileSync(guidelinesFile, 'utf-8');
        
        // Update core identity section
        content = content.replace(
          /## 🎯 Core Identity\n\n([\s\S]*?)(?=\n\n---)/,
          `## 🎯 Core Identity\n\n${rule.role}\n\nOperate under \`.cursorrules\`, coordinating with ${Object.keys(rule.interactionPatterns.withAssistants).join(', ')}.`
        );
        
        // Update responsibilities section
        let responsibilitiesSection = '## 💡 Primary Responsibilities\n\n';
        rule.responsibilities.forEach((responsibility, index) => {
          responsibilitiesSection += `${index + 1}. **${responsibility.split(':')[0]}**\n`;
          responsibilitiesSection += `   ${responsibility.split(':')[1]}\n\n`;
        });
        
        content = content.replace(
          /## 💡 Primary Responsibilities\n\n([\s\S]*?)(?=\n\n---)/,
          responsibilitiesSection
        );
        
        // Write back to file
        fs.writeFileSync(guidelinesFile, content, 'utf-8');
        
        this.logger.info(`Updated guidelines file: ${guidelinesFile}`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to update guidelines files: ${error}`);
      return false;
    }
  }
  
  /**
   * Create version history entry for rule update
   * @param assistantName The name of the assistant
   * @param oldRule The old rule
   * @param newRule The new rule
   */
  public async createVersionHistoryEntry(
    assistantName: string,
    oldRule: IAssistantRule | null,
    newRule: IAssistantRule
  ): Promise<void> {
    try {
      const historyDir = path.resolve(process.cwd(), 'assistant-rules-history');
      
      // Create history directory if it doesn't exist
      if (!fs.existsSync(historyDir)) {
        fs.mkdirSync(historyDir, { recursive: true });
      }
      
      // Create history file
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const historyFile = path.join(historyDir, `${assistantName}-${timestamp}.json`);
      
      // Create history entry
      const historyEntry = {
        timestamp: new Date().toISOString(),
        assistant: assistantName,
        oldRule,
        newRule,
        changes: this.generateChanges(oldRule, newRule)
      };
      
      // Write history entry
      fs.writeFileSync(historyFile, JSON.stringify(historyEntry, null, 2), 'utf-8');
      
      this.logger.info(`Created version history entry: ${historyFile}`);
    } catch (error) {
      this.logger.error(`Failed to create version history entry: ${error}`);
    }
  }
  
  /**
   * Generate changes between old and new rules
   * @param oldRule The old rule
   * @param newRule The new rule
   * @returns List of changes
   */
  private generateChanges(oldRule: IAssistantRule | null, newRule: IAssistantRule): string[] {
    const changes: string[] = [];
    
    if (!oldRule) {
      changes.push('Added new assistant');
      return changes;
    }
    
    // Check for changes in each field
    if (oldRule.description !== newRule.description) {
      changes.push(`Changed description from "${oldRule.description}" to "${newRule.description}"`);
    }
    
    if (oldRule.version !== newRule.version) {
      changes.push(`Updated version from ${oldRule.version} to ${newRule.version}`);
    }
    
    if (oldRule.role !== newRule.role) {
      changes.push('Updated role description');
    }
    
    // Check for changes in responsibilities
    if (JSON.stringify(oldRule.responsibilities) !== JSON.stringify(newRule.responsibilities)) {
      changes.push('Updated responsibilities');
    }
    
    // Check for changes in response format
    if (JSON.stringify(oldRule.responseFormat) !== JSON.stringify(newRule.responseFormat)) {
      changes.push('Updated response format');
    }
    
    // Check for changes in interaction patterns
    if (JSON.stringify(oldRule.interactionPatterns) !== JSON.stringify(newRule.interactionPatterns)) {
      changes.push('Updated interaction patterns');
    }
    
    // Check for changes in error handling
    if (oldRule.errorHandling !== newRule.errorHandling) {
      changes.push('Updated error handling');
    }
    
    // Check for changes in context preservation
    if (oldRule.contextPreservation !== newRule.contextPreservation) {
      changes.push('Updated context preservation');
    }
    
    return changes;
  }
}
