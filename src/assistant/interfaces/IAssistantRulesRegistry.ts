import { IAssistantRule } from './IAssistantRule';

/**
 * Interface for the assistant rules registry
 */
export interface IAssistantRulesRegistry {
  /**
   * Load all assistant rules from .cursorrules and other sources
   */
  loadRules(): Promise<void>;

  /**
   * Get a specific assistant's rules
   * @param assistantName The name of the assistant
   */
  getRule(assistantName: string): IAssistantRule | undefined;

  /**
   * Get all assistant rules
   */
  getAllRules(): Map<string, IAssistantRule>;

  /**
   * Update a specific assistant's rules
   * @param assistantName The name of the assistant
   * @param rule The updated rule
   */
  updateRule(assistantName: string, rule: Partial<IAssistantRule>): Promise<boolean>;

  /**
   * Add a new assistant rule
   * @param assistantName The name of the assistant
   * @param rule The new rule
   */
  addRule(assistantName: string, rule: IAssistantRule): Promise<boolean>;

  /**
   * Remove an assistant rule
   * @param assistantName The name of the assistant
   */
  removeRule(assistantName: string): Promise<boolean>;

  /**
   * Validate all rules against schema
   */
  validateAllRules(): { valid: boolean; errors: Record<string, string[]> };

  /**
   * Export rules to various formats
   * @param format The format to export to (json, yaml, markdown)
   */
  exportRules(format: 'json' | 'yaml' | 'markdown'): string;

  /**
   * Import rules from various formats
   * @param content The content to import
   * @param format The format to import from (json, yaml, markdown)
   */
  importRules(content: string, format: 'json' | 'yaml' | 'markdown'): Promise<boolean>;
}
