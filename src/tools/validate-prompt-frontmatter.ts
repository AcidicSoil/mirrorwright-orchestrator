#!/usr/bin/env node

/**
 * Validate frontmatter in prompt template files
 */

import * as fs from 'fs';
import * as path from 'path';
import { FrontmatterParser } from './prompt-extraction/extractors/FrontmatterParser';
import { AssistantRegistry } from './prompt-extraction/extractors/AssistantRegistry';
import { Logger } from '../../utils/Logger';

interface ValidationResult {
  valid: string[];
  invalid: Array<{
    path: string;
    errors: string[];
  }>;
}

class PromptFrontmatterValidator {
  private logger: Logger;
  private frontmatterParser: FrontmatterParser;
  private assistantRegistry: AssistantRegistry;
  private promptTemplatesDir: string;

  constructor(promptTemplatesDir: string = 'prompt_templates') {
    this.logger = new Logger();
    this.frontmatterParser = new FrontmatterParser();
    this.assistantRegistry = new AssistantRegistry();
    this.promptTemplatesDir = promptTemplatesDir;
  }

  /**
   * Validate all prompt template files
   */
  public validate(): ValidationResult {
    this.logger.info('Validating prompt frontmatter...');

    // Load assistants from .cursorrules
    const assistants = this.assistantRegistry.loadAssistants();
    const assistantNames = assistants.map(a => a.name.toLowerCase());

    // Get all markdown files in the prompt templates directory
    const files = this.getMarkdownFiles(this.promptTemplatesDir);
    this.logger.info(`Found ${files.length} markdown files`);

    const result: ValidationResult = {
      valid: [],
      invalid: []
    };

    // Validate each file
    for (const file of files) {
      const filePath = path.join(this.promptTemplatesDir, file);
      const parseResult = this.frontmatterParser.parseFile(filePath);

      if (!parseResult.hasFrontmatter) {
        result.invalid.push({
          path: filePath,
          errors: ['Missing frontmatter']
        });
        continue;
      }

      if (!parseResult.frontmatter) {
        result.invalid.push({
          path: filePath,
          errors: ['Invalid frontmatter format']
        });
        continue;
      }

      const errors: string[] = [];

      // Check required fields
      const requiredFields = ['agent', 'purpose', 'id', 'version'];
      for (const field of requiredFields) {
        if (!parseResult.frontmatter[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      }

      // Check agent name
      if (parseResult.frontmatter.agent && !assistantNames.includes(parseResult.frontmatter.agent.toLowerCase())) {
        errors.push(`Unknown agent: ${parseResult.frontmatter.agent}. Must be one of: ${assistantNames.join(', ')}`);
      }

      // Check version format
      if (parseResult.frontmatter.version && !this.isValidVersion(parseResult.frontmatter.version)) {
        errors.push(`Invalid version format: ${parseResult.frontmatter.version}. Must follow semantic versioning (e.g., 1.0.0)`);
      }

      if (errors.length > 0) {
        result.invalid.push({
          path: filePath,
          errors
        });
      } else {
        result.valid.push(filePath);
      }
    }

    // Log results
    this.logger.info(`Validation complete: ${result.valid.length} valid, ${result.invalid.length} invalid`);

    // Save results to file for GitHub Action
    fs.writeFileSync('validation-results.json', JSON.stringify(result, null, 2));

    return result;
  }

  /**
   * Get all markdown files in a directory
   */
  private getMarkdownFiles(dir: string): string[] {
    try {
      return fs.readdirSync(dir)
        .filter(file => file.endsWith('.md'));
    } catch (error) {
      this.logger.error(`Failed to read directory ${dir}: ${error}`);
      return [];
    }
  }

  /**
   * Check if a version string follows semantic versioning
   */
  private isValidVersion(version: string): boolean {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    return semverRegex.test(version);
  }
}

// Run the validator if this file is executed directly
if (require.main === module) {
  const validator = new PromptFrontmatterValidator();
  const result = validator.validate();

  // Exit with error code if any invalid files
  if (result.invalid.length > 0) {
    process.exit(1);
  }
}

// Export the validator for programmatic usage
export { PromptFrontmatterValidator };
