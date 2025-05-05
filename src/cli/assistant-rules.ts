import { program } from 'commander';
import { AssistantRulesRegistry } from '../assistant/AssistantRulesRegistry';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';
import * as path from 'path';

const registry = new AssistantRulesRegistry();
const logger = new Logger();

/**
 * CLI command for managing assistant rules
 */
export async function setupAssistantRulesCLI(): Promise<void> {
  // View command
  program
    .command('view')
    .description('View assistant rules')
    .argument('[assistant]', 'Assistant name (optional)')
    .option('-f, --format <format>', 'Output format (json, yaml, markdown)', 'json')
    .action(async (assistant?: string, options?: { format: 'json' | 'yaml' | 'markdown' }) => {
      await registry.loadRules();
      
      const format = options?.format || 'json';
      
      if (assistant) {
        const rule = registry.getRule(assistant);
        if (rule) {
          switch (format) {
            case 'json':
              console.log(JSON.stringify(rule, null, 2));
              break;
            case 'yaml':
              console.log(yaml.stringify(rule));
              break;
            case 'markdown':
              console.log(registry.exportRules('markdown').split(`## ${assistant}`)[1].split('---')[0]);
              break;
          }
        } else {
          logger.error(`Assistant "${assistant}" not found`);
        }
      } else {
        console.log(registry.exportRules(format));
      }
    });

  // Update command
  program
    .command('update')
    .description('Update assistant rules')
    .argument('<assistant>', 'Assistant name')
    .option('-f, --file <file>', 'JSON file with rule updates')
    .option('-r, --role <role>', 'Update assistant role')
    .option('-d, --description <description>', 'Update assistant description')
    .option('-v, --version <version>', 'Update assistant version')
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
      if (options.version) updates.version = options.version;
      
      const success = await registry.updateRule(assistant, updates);
      
      if (success) {
        logger.info(`Successfully updated rules for "${assistant}"`);
      } else {
        logger.error(`Failed to update rules for "${assistant}"`);
      }
    });

  // Add command
  program
    .command('add')
    .description('Add a new assistant')
    .argument('<assistant>', 'Assistant name')
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
    .command('remove')
    .description('Remove an assistant')
    .argument('<assistant>', 'Assistant name')
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
    .command('validate')
    .description('Validate assistant rules')
    .argument('[assistant]', 'Assistant name (optional)')
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

  // Export command
  program
    .command('export')
    .description('Export assistant rules')
    .option('-f, --format <format>', 'Output format (json, yaml, markdown)', 'json')
    .option('-o, --output <file>', 'Output file')
    .action(async (options) => {
      await registry.loadRules();
      
      const format = options.format || 'json';
      const output = registry.exportRules(format);
      
      if (options.output) {
        fs.writeFileSync(options.output, output, 'utf-8');
        logger.info(`Exported rules to ${options.output}`);
      } else {
        console.log(output);
      }
    });

  // Import command
  program
    .command('import')
    .description('Import assistant rules')
    .requiredOption('-f, --file <file>', 'Input file')
    .option('--format <format>', 'Input format (json, yaml, markdown)', 'json')
    .action(async (options) => {
      await registry.loadRules();
      
      try {
        const fileContent = fs.readFileSync(options.file, 'utf-8');
        const format = options.format || 'json';
        
        const success = await registry.importRules(fileContent, format);
        
        if (success) {
          logger.info('Successfully imported rules');
        } else {
          logger.error('Failed to import rules');
        }
      } catch (error) {
        logger.error(`Failed to read import file: ${error}`);
      }
    });

  return program;
}

/**
 * Main function for CLI
 */
if (require.main === module) {
  setupAssistantRulesCLI()
    .then(() => program.parse(process.argv))
    .catch(error => {
      console.error(`Error: ${error}`);
      process.exit(1);
    });
}
