import { Logger } from '../utils/Logger';
import { RitualDefinition, RitualStep, Condition } from '../types/protocol';
import { EngineError, EngineErrorType, IRitualEngine } from '../types/engine';
import { schemaValidator } from '../utils/validateSchema';
import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';

/**
 * Ritual execution events
 */
export enum RitualEvent {
  RITUAL_START = 'ritual:start',
  RITUAL_COMPLETE = 'ritual:complete',
  RITUAL_ERROR = 'ritual:error',
  STEP_START = 'step:start',
  STEP_COMPLETE = 'step:complete',
  STEP_ERROR = 'step:error',
  STEP_SKIP = 'step:skip',
  CONDITION_EVALUATION = 'condition:evaluation'
}

/**
 * Ritual execution result
 */
export interface RitualExecutionResult {
  ritualId: string;
  success: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  steps: {
    total: number;
    executed: number;
    skipped: number;
    failed: number;
  };
  error?: Error;
  context: Record<string, any>;
}

/**
 * Step execution result
 */
export interface StepExecutionResult {
  stepIndex: number;
  stepType: string;
  success: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  error?: Error;
  output?: any;
}

/**
 * Ritual execution options
 */
export interface RitualExecutionOptions {
  /** Whether to continue execution after a step fails */
  continueOnStepFailure?: boolean;
  /** Maximum execution time in milliseconds */
  timeout?: number;
  /** Whether to validate the ritual before execution */
  validateBeforeExecution?: boolean;
  /** Custom step handlers */
  stepHandlers?: Record<string, (step: RitualStep, context: Record<string, any>) => Promise<any>>;
}

/**
 * Default ritual execution options
 */
const DEFAULT_EXECUTION_OPTIONS: RitualExecutionOptions = {
  continueOnStepFailure: false,
  timeout: 60000, // 1 minute
  validateBeforeExecution: true,
  stepHandlers: {}
};

/**
 * Engine responsible for managing and executing rituals
 * Implements event-driven execution pipeline with hooks and monitoring
 */
export class RitualEngine extends EventEmitter implements IRitualEngine {
  private logger: Logger;
  private rituals: Record<string, RitualDefinition> = {};
  private executionOptions: RitualExecutionOptions;
  private activeExecutions: Map<string, {
    startTime: number;
    timeout?: NodeJS.Timeout;
    abortController: AbortController;
  }> = new Map();

  /**
   * Create a new RitualEngine instance
   * @param options Default execution options
   */
  constructor(options: RitualExecutionOptions = {}) {
    super();
    this.logger = new Logger();
    this.executionOptions = { ...DEFAULT_EXECUTION_OPTIONS, ...options };

    // Register event handlers for logging
    this.registerEventHandlers();
  }

  /**
   * Register event handlers for logging
   */
  private registerEventHandlers(): void {
    this.on(RitualEvent.RITUAL_START, (ritualId: string) => {
      this.logger.info(`Ritual '${ritualId}' started`);
    });

    this.on(RitualEvent.RITUAL_COMPLETE, (result: RitualExecutionResult) => {
      this.logger.info(`Ritual '${result.ritualId}' completed in ${result.duration}ms`);
    });

    this.on(RitualEvent.RITUAL_ERROR, (ritualId: string, error: Error) => {
      this.logger.error(`Ritual '${ritualId}' failed: ${error.message}`);
    });

    this.on(RitualEvent.STEP_START, (ritualId: string, stepIndex: number, stepType: string) => {
      this.logger.info(`Ritual '${ritualId}' step ${stepIndex} (${stepType}) started`);
    });

    this.on(RitualEvent.STEP_COMPLETE, (ritualId: string, result: StepExecutionResult) => {
      this.logger.info(`Ritual '${ritualId}' step ${result.stepIndex} (${result.stepType}) completed in ${result.duration}ms`);
    });

    this.on(RitualEvent.STEP_ERROR, (ritualId: string, stepIndex: number, error: Error) => {
      this.logger.error(`Ritual '${ritualId}' step ${stepIndex} failed: ${error.message}`);
    });

    this.on(RitualEvent.STEP_SKIP, (ritualId: string, stepIndex: number, reason: string) => {
      this.logger.info(`Ritual '${ritualId}' step ${stepIndex} skipped: ${reason}`);
    });
  }

  /**
   * Initialize rituals from definitions
   * @param rituals Record of ritual definitions by ID
   * @throws EngineError if validation fails or initialization fails
   */
  public async initializeRituals(rituals: Record<string, RitualDefinition>): Promise<void> {
    this.logger.info('Initializing rituals...');
    const startTime = performance.now();

    try {
      // Validate each ritual against schema
      for (const [id, ritual] of Object.entries(rituals)) {
        try {
          await this.validateRitual(ritual);
        } catch (error) {
          throw new EngineError(
            `Invalid ritual detected (${id}): ${error instanceof Error ? error.message : String(error)}`,
            EngineErrorType.VALIDATION_ERROR
          );
        }
      }

      // Store rituals
      this.rituals = { ...rituals };

      const endTime = performance.now();
      this.logger.info(`Initialized ${Object.keys(rituals).length} rituals successfully in ${(endTime - startTime).toFixed(2)}ms.`);
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
   * @param options Execution options
   * @returns Result of the ritual execution
   * @throws EngineError if ritual not found or execution fails
   */
  public async executeRitual(
    ritualId: string,
    context: Record<string, any> = {},
    options: RitualExecutionOptions = {}
  ): Promise<RitualExecutionResult> {
    // Merge options with defaults
    const execOptions = { ...this.executionOptions, ...options };
    const startTime = performance.now();
    const executionId = `${ritualId}-${Date.now()}`;
    const abortController = new AbortController();

    // Create execution tracking
    this.activeExecutions.set(executionId, {
      startTime,
      abortController
    });

    // Set timeout if specified
    if (execOptions.timeout && execOptions.timeout > 0) {
      const timeout = setTimeout(() => {
        this.abortExecution(executionId, new Error(`Ritual execution timed out after ${execOptions.timeout}ms`));
      }, execOptions.timeout);

      this.activeExecutions.get(executionId)!.timeout = timeout;
    }

    try {
      // Get the ritual definition
      const ritual = this.rituals[ritualId];
      if (!ritual) {
        throw new EngineError(
          `Ritual '${ritualId}' not found.`,
          EngineErrorType.NOT_FOUND_ERROR
        );
      }

      // Validate ritual if required
      if (execOptions.validateBeforeExecution) {
        await this.validateRitual(ritual);
      }

      // Emit ritual start event
      this.emit(RitualEvent.RITUAL_START, ritualId, context);

      // Execute ritual steps
      const result = await this.executeRitualSteps(
        ritual.id,
        ritual.steps,
        context,
        execOptions,
        abortController.signal
      );

      // Calculate execution stats
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Create execution result
      const executionResult: RitualExecutionResult = {
        ritualId: ritual.id,
        success: true,
        startTime,
        endTime,
        duration,
        steps: result.stepStats,
        context: result.context
      };

      // Emit ritual complete event
      this.emit(RitualEvent.RITUAL_COMPLETE, executionResult);

      // Clean up execution tracking
      this.cleanupExecution(executionId);

      return executionResult;
    } catch (error) {
      // Calculate execution stats
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Create error result
      const errorResult: RitualExecutionResult = {
        ritualId,
        success: false,
        startTime,
        endTime,
        duration,
        steps: {
          total: 0,
          executed: 0,
          skipped: 0,
          failed: 0
        },
        error: error instanceof Error ? error : new Error(String(error)),
        context
      };

      // Emit ritual error event
      this.emit(RitualEvent.RITUAL_ERROR, ritualId, errorResult.error);

      // Clean up execution tracking
      this.cleanupExecution(executionId);

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
   * Abort an active ritual execution
   * @param executionId Execution ID to abort
   * @param reason Reason for aborting
   */
  public abortExecution(executionId: string, reason: Error): void {
    const execution = this.activeExecutions.get(executionId);
    if (execution) {
      this.logger.info(`Aborting ritual execution ${executionId}: ${reason.message}`);

      // Abort the execution
      execution.abortController.abort(reason);

      // Clean up timeout
      if (execution.timeout) {
        clearTimeout(execution.timeout);
      }

      // Remove from active executions
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Clean up execution tracking
   * @param executionId Execution ID to clean up
   */
  private cleanupExecution(executionId: string): void {
    const execution = this.activeExecutions.get(executionId);
    if (execution) {
      // Clean up timeout
      if (execution.timeout) {
        clearTimeout(execution.timeout);
      }

      // Remove from active executions
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Validate a ritual definition against schema
   * @param ritual Ritual definition to validate
   * @returns True if valid, throws error if invalid
   * @throws EngineError if validation fails
   */
  public async validateRitual(ritual: RitualDefinition): Promise<boolean> {
    try {
      return await schemaValidator.validate(ritual, 'ritual');
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
   * @param ritualId ID of the ritual being executed
   * @param steps Array of ritual steps
   * @param context Context data for the ritual execution
   * @param options Execution options
   * @param abortSignal Abort signal for cancellation
   * @returns Result of the ritual execution
   * @private
   */
  private async executeRitualSteps(
    ritualId: string,
    steps: RitualStep[],
    context: Record<string, any>,
    options: RitualExecutionOptions,
    abortSignal?: AbortSignal
  ): Promise<{
    context: Record<string, any>;
    stepStats: {
      total: number;
      executed: number;
      skipped: number;
      failed: number;
    };
  }> {
    // Clone context to avoid modifying the original
    const result: Record<string, any> = { ...context };

    // Initialize step statistics
    const stepStats = {
      total: steps.length,
      executed: 0,
      skipped: 0,
      failed: 0
    };

    // Start with the first step
    let currentStepIndex = 0;

    // Execute steps until we reach the end or encounter an error
    while (currentStepIndex < steps.length) {
      // Check if execution was aborted
      if (abortSignal?.aborted) {
        const reason = abortSignal.reason || new Error('Ritual execution aborted');
        throw new EngineError(
          `Ritual execution aborted: ${reason.message}`,
          EngineErrorType.EXECUTION_ERROR
        );
      }

      const step = steps[currentStepIndex];
      const stepStartTime = performance.now();

      // Emit step start event
      this.emit(RitualEvent.STEP_START, ritualId, currentStepIndex, step.type);

      try {
        // Check if step should be executed based on conditions
        if (step.conditions && !this.evaluateConditions(step.conditions, result)) {
          // Skip this step if conditions are not met
          const skipReason = 'Conditions not met';
          this.emit(RitualEvent.STEP_SKIP, ritualId, currentStepIndex, skipReason);

          // Update statistics
          stepStats.skipped++;

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
        let stepOutput: any;

        // Check for custom step handler
        if (options.stepHandlers && options.stepHandlers[step.type]) {
          // Use custom step handler
          stepOutput = await options.stepHandlers[step.type](step, result);
        } else {
          // Use built-in step handler
          switch (step.type) {
            case 'prompt':
              // Handle prompt step
              stepOutput = await this.executePromptStep(step, result);
              break;

            case 'action':
              // Handle action step
              stepOutput = await this.executeActionStep(step, result);
              break;

            case 'pause':
              // Handle pause step
              stepOutput = await this.executePauseStep(step, result);
              break;

            default:
              throw new EngineError(
                `Unknown step type: ${(step as any).type}`,
                EngineErrorType.EXECUTION_ERROR
              );
          }
        }

        // Update statistics
        stepStats.executed++;

        // Calculate step duration
        const stepEndTime = performance.now();
        const stepDuration = stepEndTime - stepStartTime;

        // Create step result
        const stepResult: StepExecutionResult = {
          stepIndex: currentStepIndex,
          stepType: step.type,
          success: true,
          startTime: stepStartTime,
          endTime: stepEndTime,
          duration: stepDuration,
          output: stepOutput
        };

        // Emit step complete event
        this.emit(RitualEvent.STEP_COMPLETE, ritualId, stepResult);

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
      } catch (error) {
        // Update statistics
        stepStats.failed++;

        // Emit step error event
        this.emit(
          RitualEvent.STEP_ERROR,
          ritualId,
          currentStepIndex,
          error instanceof Error ? error : new Error(String(error))
        );

        // If continueOnStepFailure is false, throw the error
        if (!options.continueOnStepFailure) {
          throw new EngineError(
            `Failed to execute step ${currentStepIndex}: ${error instanceof Error ? error.message : String(error)}`,
            EngineErrorType.EXECUTION_ERROR
          );
        }

        // Otherwise, move to the next step
        currentStepIndex++;
      }
    }

    return { context: result, stepStats };
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
   * @returns Result of the prompt execution
   * @private
   */
  private async executePromptStep(step: RitualStep, context: Record<string, any>): Promise<any> {
    this.logger.info(`Executing prompt step: ${step.content}`);

    try {
      // TODO: Implement prompt step execution
      // This would typically involve:
      // 1. Loading a prompt template
      // 2. Filling in template variables from context
      // 3. Sending the prompt to an LLM
      // 4. Processing the response

      // For now, just log the step
      this.logger.info(`Prompt step executed with content: ${step.content}`);

      // Create result
      const result = `Mock response for: ${step.content}`;

      // Update context
      context.lastPromptResult = result;

      // Store result in context with step-specific key
      const resultKey = `prompt_${Date.now()}`;
      context[resultKey] = result;

      return result;
    } catch (error) {
      this.logger.error(`Error executing prompt step: ${error}`);
      throw new EngineError(
        `Failed to execute prompt step: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }

  /**
   * Execute an action step
   * @param step Action step to execute
   * @param context Context data for the step execution
   * @returns Result of the action execution
   * @private
   */
  private async executeActionStep(step: RitualStep, context: Record<string, any>): Promise<any> {
    this.logger.info(`Executing action step: ${step.content}`);

    try {
      // TODO: Implement action step execution
      // This would typically involve:
      // 1. Parsing the action command
      // 2. Executing the action
      // 3. Processing the result

      // For now, just log the step
      this.logger.info(`Action step executed with content: ${step.content}`);

      // Create result
      const result = `Mock action result for: ${step.content}`;

      // Update context
      context.lastActionResult = result;

      // Store result in context with step-specific key
      const resultKey = `action_${Date.now()}`;
      context[resultKey] = result;

      return result;
    } catch (error) {
      this.logger.error(`Error executing action step: ${error}`);
      throw new EngineError(
        `Failed to execute action step: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }

  /**
   * Execute a pause step
   * @param step Pause step to execute
   * @param context Context data for the step execution
   * @returns Result of the pause execution
   * @private
   */
  private async executePauseStep(step: RitualStep, context: Record<string, any>): Promise<any> {
    this.logger.info(`Executing pause step: ${step.content}`);

    try {
      // Parse pause duration (default to 1000ms)
      const pauseDuration = parseInt(step.content, 10) || 1000;

      // Wait for the specified duration
      await new Promise(resolve => setTimeout(resolve, pauseDuration));

      this.logger.info(`Pause step executed with duration: ${pauseDuration}ms`);

      // Create result
      const result = `Paused for ${pauseDuration}ms`;

      // Update context
      context.lastPauseResult = result;

      // Store result in context with step-specific key
      const resultKey = `pause_${Date.now()}`;
      context[resultKey] = result;

      return result;
    } catch (error) {
      this.logger.error(`Error executing pause step: ${error}`);
      throw new EngineError(
        `Failed to execute pause step: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }
}
