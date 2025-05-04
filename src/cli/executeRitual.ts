import { Command } from 'commander';
import { RitualEngine, RitualEvent } from '../engine/RitualEngine';
import { Logger } from '../utils/Logger';
import { readFileSync } from 'fs';
import yaml from 'yaml';
import path from 'path';

const logger = new Logger();

/**
 * Execute a ritual from the command line
 * @param ritualPath Path to the ritual YAML file
 * @param contextPath Optional path to a context JSON file
 */
export async function executeRitualCommand(ritualPath: string, contextPath?: string): Promise<void> {
  try {
    // Load ritual from file
    logger.info(`Loading ritual from ${ritualPath}`);
    const ritualContent = readFileSync(ritualPath, 'utf-8');
    const ritual = yaml.parse(ritualContent);
    
    // Load context if provided
    let context: Record<string, any> = {};
    if (contextPath) {
      logger.info(`Loading context from ${contextPath}`);
      const contextContent = readFileSync(contextPath, 'utf-8');
      context = JSON.parse(contextContent);
    }
    
    // Create ritual engine
    const ritualEngine = new RitualEngine();
    
    // Register event handlers
    ritualEngine.on(RitualEvent.RITUAL_START, (ritualId) => {
      logger.info(`Ritual '${ritualId}' started`);
    });
    
    ritualEngine.on(RitualEvent.RITUAL_COMPLETE, (result) => {
      logger.info(`Ritual '${result.ritualId}' completed in ${result.duration}ms`);
      logger.info(`Steps: ${result.steps.executed} executed, ${result.steps.skipped} skipped, ${result.steps.failed} failed`);
    });
    
    ritualEngine.on(RitualEvent.RITUAL_ERROR, (ritualId, error) => {
      logger.error(`Ritual '${ritualId}' failed: ${error.message}`);
    });
    
    // Initialize rituals
    await ritualEngine.initializeRituals({
      [ritual.id]: ritual
    });
    
    // Execute ritual
    const result = await ritualEngine.executeRitual(ritual.id, context);
    
    // Output result
    console.log(JSON.stringify(result, null, 2));
    
    logger.info('Ritual execution completed successfully');
  } catch (error) {
    logger.error(`Failed to execute ritual: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Create command
export const executeRitualCmd = new Command('execute-ritual')
  .description('Execute a ritual from a YAML file')
  .argument('<ritual-path>', 'Path to the ritual YAML file')
  .option('-c, --context <context-path>', 'Path to a context JSON file')
  .action(async (ritualPath, options) => {
    await executeRitualCommand(ritualPath, options.context);
  });
