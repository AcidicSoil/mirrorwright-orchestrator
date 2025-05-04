import { Command } from 'commander';
import { Logger } from '../utils/Logger';
import { executeRitualCmd } from './executeRitual';

const program = new Command();
const logger = new Logger();

program
  .name('Mirrorwright Orchestrator CLI')
  .description('CLI for managing protocols, modes, and rituals')
  .version('0.1.0');

program.command('run <ritual>')
  .description('Run a specified ritual from the registry')
  .action(async (ritualId: string) => {
    logger.info(`Executing ritual: ${ritualId}`);
    // TODO: Add ritual execution logic here
  });

// Add the execute-ritual command
program.addCommand(executeRitualCmd);

// Add validation command
program.command('validate <type> <file>')
  .description('Validate a file against a schema')
  .action(async (type: string, file: string) => {
    logger.info(`Validating ${file} as ${type}`);

    // Import the validation module dynamically to avoid circular dependencies
    const { validateFile } = await import('./validate');

    try {
      const success = await validateFile(file, type);
      if (success) {
        logger.info(`Validation successful for ${file}`);
      }
    } catch (error) {
      logger.error(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

// Parse arguments
if (require.main === module) {
  program.parseAsync(process.argv).catch(error => {
    logger.error(`Error: ${error}`);
    process.exit(1);
  });
}
