import { Logger } from '../utils/Logger';
import { RitualDefinition, RitualStep, Condition } from '../types/protocol';
import { EngineError, EngineErrorType, IRitualEngine } from '../types/engine';
import { schemaValidator } from '../utils/validateSchema';

/**
 * Engine responsible for managing and executing rituals
 */
export class RitualEngine implements IRitualEngine {
  private logger: Logger;
  private rituals: Record<string, RitualDefinition> = {};

  /**
   * Create a new RitualEngine instance
   */
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Initialize rituals from definitions
   * @param rituals Record of ritual definitions by ID
   * @throws EngineError if validation fails or initialization fails
   */
  public async initializeRituals(rituals: Record<string, RitualDefinition>): Promise<void> {
    this.logger.info('Initializing rituals...');

    try {
      // Validate each ritual against schema
      for (const [id, ritual] of Object.entries(rituals)) {
        try {
          this.validateRitual(ritual);
        } catch (error) {
          throw new EngineError(
            `Invalid ritual detected (${id}): ${error instanceof Error ? error.message : String(error)}`,
            EngineErrorType.VALIDATION_ERROR
          );
        }
      }

      // Store rituals
      this.rituals = { ...rituals };

      this.logger.info(`Initialized ${Object.keys(rituals).length} rituals successfully.`);
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }
      
      throw new EngineError(
        `Failed to initialize rituals: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.INITIALIZATION_ERROR
      );
    }
  }

  /**
   * Get all available rituals
   * @returns Record of rituals by ID
   */
  public getAvailableRituals(): Record<string, RitualDefinition> {
    return { ...this.rituals };
  }

  /**
   * Execute a ritual with context
   * @param ritualId ID of the ritual to execute
   * @param context Context data for the ritual execution
   * @returns Result of the ritual execution
   * @throws EngineError if ritual not found or execution fails
   */
  public async executeRitual(ritualId: string, context: Record<string, any>): Promise<Record<string, any>> {
    try {
      const ritual = this.rituals[ritualId];
      if (!ritual) {
        throw new EngineError(
          `Ritual '${ritualId}' not found.`,
          EngineErrorType.NOT_FOUND_ERROR
        );
      }

      this.logger.info(`Executing ritual '${ritualId}' with context: ${JSON.stringify(context, null, 2)}`);

      // Execute ritual steps
      const result = await this.executeRitualSteps(ritual.steps, context);

      this.logger.info(`Ritual '${ritualId}' executed successfully.`);

      return result;
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }
      
      throw new EngineError(
        `Failed to execute ritual '${ritualId}': ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }

  /**
   * Validate a ritual definition against schema
   * @param ritual Ritual definition to validate
   * @returns True if valid, throws error if invalid
   * @throws EngineError if validation fails
   */
  public validateRitual(ritual: RitualDefinition): boolean {
    try {
      return schemaValidator.validate(ritual, 'ritual');
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }
      
      throw new EngineError(
        `Ritual validation failed: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
  }

  /**
   * Execute ritual steps with context
   * @param steps Array of ritual steps
   * @param context Context data for the ritual execution
   * @returns Result of the ritual execution
   * @private
   */
  private async executeRitualSteps(steps: RitualStep[], context: Record<string, any>): Promise<Record<string, any>> {
    const result: Record<string, any> = { ...context };
    
    // Start with the first step
    let currentStepIndex = 0;
    
    while (currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      
      // Check if step should be executed based on conditions
      if (step.conditions && !this.evaluateConditions(step.conditions, result)) {
        // Skip this step if conditions are not met
        this.logger.info(`Skipping step due to unmet conditions`);
        
        // Move to next step
        if (step.next) {
          // Find the step with the matching ID
          const nextStepIndex = steps.findIndex(s => s.type === step.next);
          if (nextStepIndex >= 0) {
            currentStepIndex = nextStepIndex;
          } else {
            // If next step not found, move to the next sequential step
            currentStepIndex++;
          }
        } else {
          // If no next step specified, move to the next sequential step
          currentStepIndex++;
        }
        
        continue;
      }
      
      // Execute the step based on its type
      try {
        switch (step.type) {
          case 'prompt':
            // Handle prompt step
            await this.executePromptStep(step, result);
            break;
            
          case 'action':
            // Handle action step
            await this.executeActionStep(step, result);
            break;
            
          case 'pause':
            // Handle pause step
            await this.executePauseStep(step, result);
            break;
            
          default:
            throw new EngineError(
              `Unknown step type: ${(step as any).type}`,
              EngineErrorType.EXECUTION_ERROR
            );
        }
      } catch (error) {
        throw new EngineError(
          `Failed to execute step: ${error instanceof Error ? error.message : String(error)}`,
          EngineErrorType.EXECUTION_ERROR
        );
      }
      
      // Determine next step
      if (step.next) {
        // Find the step with the matching ID
        const nextStepIndex = steps.findIndex(s => s.type === step.next);
        if (nextStepIndex >= 0) {
          currentStepIndex = nextStepIndex;
        } else {
          // If next step not found, move to the next sequential step
          currentStepIndex++;
        }
      } else {
        // If no next step specified, move to the next sequential step
        currentStepIndex++;
      }
    }
    
    return result;
  }

  /**
   * Evaluate conditions against context
   * @param conditions Array of conditions to evaluate
   * @param context Context data to evaluate against
   * @returns True if all conditions are met, false otherwise
   * @private
   */
  private evaluateConditions(conditions: Condition[], context: Record<string, any>): boolean {
    return conditions.every(condition => {
      const { variable, operator, value } = condition;
      
      // Get the variable value from context
      const variableValue = context[variable];
      
      // Evaluate the condition based on the operator
      switch (operator) {
        case '==':
          return variableValue === value;
        case '!=':
          return variableValue !== value;
        case '>':
          return variableValue > value;
        case '<':
          return variableValue < value;
        case '>=':
          return variableValue >= value;
        case '<=':
          return variableValue <= value;
        default:
          this.logger.error(`Unknown operator: ${operator}`);
          return false;
      }
    });
  }

  /**
   * Execute a prompt step
   * @param step Prompt step to execute
   * @param context Context data for the step execution
   * @private
   */
  private async executePromptStep(step: RitualStep, context: Record<string, any>): Promise<void> {
    this.logger.info(`Executing prompt step: ${step.content}`);
    
    // TODO: Implement prompt step execution
    // This would typically involve:
    // 1. Loading a prompt template
    // 2. Filling in template variables from context
    // 3. Sending the prompt to an LLM
    // 4. Processing the response
    
    // For now, just log the step
    this.logger.info(`Prompt step executed with content: ${step.content}`);
    
    // Update context with mock result for now
    context.lastPromptResult = `Mock response for: ${step.content}`;
  }

  /**
   * Execute an action step
   * @param step Action step to execute
   * @param context Context data for the step execution
   * @private
   */
  private async executeActionStep(step: RitualStep, context: Record<string, any>): Promise<void> {
    this.logger.info(`Executing action step: ${step.content}`);
    
    // TODO: Implement action step execution
    // This would typically involve:
    // 1. Parsing the action command
    // 2. Executing the action
    // 3. Processing the result
    
    // For now, just log the step
    this.logger.info(`Action step executed with content: ${step.content}`);
    
    // Update context with mock result for now
    context.lastActionResult = `Mock action result for: ${step.content}`;
  }

  /**
   * Execute a pause step
   * @param step Pause step to execute
   * @param context Context data for the step execution
   * @private
   */
  private async executePauseStep(step: RitualStep, context: Record<string, any>): Promise<void> {
    this.logger.info(`Executing pause step: ${step.content}`);
    
    // TODO: Implement pause step execution
    // This would typically involve:
    // 1. Parsing the pause duration
    // 2. Waiting for the specified duration
    
    // For now, just log the step
    this.logger.info(`Pause step executed with content: ${step.content}`);
    
    // Update context with mock result for now
    context.lastPauseResult = `Mock pause result for: ${step.content}`;
  }
}
