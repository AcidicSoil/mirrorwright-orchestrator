import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import yaml from 'yaml';
import { IAssistantRule } from './interfaces/IAssistantRule';
import { Logger } from '../utils/Logger';

/**
 * Class for validating assistant rules against the schema
 */
export class AssistantRuleSchema {
  private ajv: Ajv;
  private validate: Ajv.ValidateFunction;
  private logger: Logger;

  /**
   * Create a new assistant rule schema validator
   */
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.logger = new Logger();

    // Load schema from YAML file
    try {
      const schemaPath = resolve(__dirname, '../../schemas/assistant-rule.schema.yaml');
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      const schema = yaml.parse(schemaContent);

      // Compile validator
      this.validate = this.ajv.compile(schema);
    } catch (error) {
      this.logger.error(`Failed to load assistant rule schema: ${error}`);
      throw new Error(`Failed to load assistant rule schema: ${error}`);
    }
  }

  /**
   * Validate an assistant rule against the schema
   * @param rule The rule to validate
   * @returns Validation result
   */
  public validateRule(rule: Partial<IAssistantRule>): { valid: boolean; errors: string[] } {
    const valid = this.validate(rule);
    
    if (!valid) {
      return {
        valid: false,
        errors: (this.validate.errors || []).map(err => `${err.instancePath} ${err.message}`)
      };
    }
    
    return { valid: true, errors: [] };
  }
}
