# Mirrorwright Orchestrator: Mode & Ritual Engine Refactoring Reference

## Key Interfaces (src/types/engine.ts)

```typescript
/**
 * Interface for the Mode Engine
 */
export interface IModeEngine {
  /**
   * Initialize modes from definitions
   * @param modes Array of mode definitions
   */
  initializeModes(modes: ModeDefinition[]): Promise<void>;
  
  /**
   * Get all active modes
   * @returns Record of active modes by ID
   */
  getActiveModes(): Record<string, ModeDefinition>;
  
  /**
   * Activate a specific mode with context
   * @param modeId ID of the mode to activate
   * @param context Context data for the mode
   */
  activateMode(modeId: string, context: Record<string, any>): Promise<void>;
  
  /**
   * Deactivate a specific mode
   * @param modeId ID of the mode to deactivate
   */
  deactivateMode(modeId: string): Promise<void>;
  
  /**
   * Check if a mode is active
   * @param modeId ID of the mode to check
   * @returns True if the mode is active, false otherwise
   */
  isModeActive(modeId: string): boolean;
}

/**
 * Interface for the Ritual Engine
 */
export interface IRitualEngine {
  /**
   * Initialize rituals from definitions
   * @param rituals Record of ritual definitions by ID
   */
  initializeRituals(rituals: Record<string, RitualDefinition>): Promise<void>;
  
  /**
   * Get all available rituals
   * @returns Record of rituals by ID
   */
  getAvailableRituals(): Record<string, RitualDefinition>;
  
  /**
   * Execute a ritual with context
   * @param ritualId ID of the ritual to execute
   * @param context Context data for the ritual execution
   * @returns Result of the ritual execution
   */
  executeRitual(ritualId: string, context: Record<string, any>): Promise<Record<string, any>>;
  
  /**
   * Validate a ritual definition against schema
   * @param ritual Ritual definition to validate
   * @returns True if valid, throws error if invalid
   */
  validateRitual(ritual: RitualDefinition): boolean;
}

/**
 * Error types for engine operations
 */
export enum EngineErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  EXECUTION_ERROR = 'EXECUTION_ERROR',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR'
}

/**
 * Custom error class for engine operations
 */
export class EngineError extends Error {
  type: EngineErrorType;
  
  constructor(message: string, type: EngineErrorType) {
    super(message);
    this.type = type;
    this.name = 'EngineError';
  }
}
```

## Schema Validation Utility (src/utils/validateSchema.ts)

```typescript
/**
 * Schema validation utility
 */
export class SchemaValidator {
  private ajv: Ajv;
  private logger: Logger;
  private validators: Map<string, ValidateFunction>;
  
  /**
   * Create a new schema validator
   */
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.logger = new Logger();
    this.validators = new Map();
    
    // Initialize validators
    this.initializeValidators();
  }
  
  /**
   * Validate data against a schema
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public validate(data: unknown, schemaType: string): boolean {
    const validator = this.validators.get(schemaType);
    
    if (!validator) {
      throw new EngineError(
        `Schema validator not found for type: ${schemaType}`,
        EngineErrorType.NOT_FOUND_ERROR
      );
    }
    
    const valid = validator(data);
    
    if (!valid && validator.errors) {
      const errorDetails = JSON.stringify(validator.errors, null, 2);
      this.logger.error(`Validation failed for ${schemaType}: ${errorDetails}`);
      throw new EngineError(
        `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} validation failed: ${errorDetails}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
    
    return true;
  }
  
  /**
   * Validate a file against a schema
   * @param filePath Path to the file to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public validateFile(filePath: string, schemaType: string): boolean {
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      return this.validate(data, schemaType);
    } catch (error) {
      if (error instanceof EngineError) throw error;
      
      this.logger.error(`Failed to validate file ${filePath}: ${error}`);
      throw new EngineError(
        `Failed to validate file ${filePath}: ${error}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
  }
}
```

## ModeEngine Implementation (src/engine/ModeEngine.ts)

```typescript
/**
 * Engine responsible for managing modes and their lifecycle
 */
export class ModeEngine implements IModeEngine {
  private logger: Logger;
  private activeModes: Record<string, ModeDefinition> = {};

  /**
   * Create a new ModeEngine instance
   */
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Initialize modes from definitions
   * @param modes Array of mode definitions
   * @throws EngineError if validation fails or initialization fails
   */
  public async initializeModes(modes: ModeDefinition[]): Promise<void> {
    this.logger.info('Initializing modes...');

    try {
      // Validate each mode against schema
      for (const mode of modes) {
        try {
          schemaValidator.validate(mode, 'mode');
        } catch (error) {
          throw new EngineError(
            `Invalid mode detected (${mode.id}): ${error instanceof Error ? error.message : String(error)}`,
            EngineErrorType.VALIDATION_ERROR
          );
        }
      }

      // Store modes
      this.activeModes = modes.reduce((acc: Record<string, ModeDefinition>, mode: ModeDefinition) => {
        acc[mode.id] = mode;
        return acc;
      }, {});

      this.logger.info(`Initialized ${modes.length} modes successfully.`);
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }
      
      throw new EngineError(
        `Failed to initialize modes: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.INITIALIZATION_ERROR
      );
    }
  }

  // Other methods...
}
```

## RitualEngine Implementation (src/engine/RitualEngine.ts)

```typescript
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

  // Other methods...
}
```

## Ritual Schema (src/schemas/ritual.schema.json)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Ritual",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the ritual"
    },
    "description": {
      "type": ["string", "null"],
      "description": "Optional description of the ritual"
    },
    "steps": {
      "type": "array",
      "description": "Sequence of steps to execute in the ritual",
      "items": {
        "$ref": "#/definitions/RitualStep"
      }
    },
    "metadata": {
      "type": ["object", "null"],
      "description": "Optional metadata for the ritual",
      "additionalProperties": true
    }
  },
  "required": ["id", "steps"],
  "additionalProperties": false,
  "definitions": {
    "RitualStep": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["prompt", "action", "pause"],
          "description": "Type of ritual step"
        },
        "content": {
          "type": "string",
          "description": "Content of the step (prompt text, action command, or pause message)"
        },
        "next": {
          "type": ["string", "null"],
          "description": "Optional identifier of the next step to execute (for non-linear flow)"
        },
        "conditions": {
          "type": ["array", "null"],
          "description": "Optional conditions that determine if the step should be executed",
          "items": {
            "$ref": "#/definitions/Condition"
          }
        }
      },
      "required": ["type", "content"],
      "additionalProperties": false
    },
    "Condition": {
      "type": "object",
      "properties": {
        "variable": {
          "type": "string",
          "description": "Name of the variable to check"
        },
        "operator": {
          "type": "string",
          "enum": ["==", "!=", ">", "<", ">=", "<="],
          "description": "Comparison operator"
        },
        "value": {
          "description": "Value to compare against"
        }
      },
      "required": ["variable", "operator", "value"],
      "additionalProperties": false
    }
  }
}
```

## Unit Test Example (src/tests/engine/RitualEngine.test.ts)

```typescript
describe('RitualEngine', () => {
  let ritualEngine: RitualEngine;
  let validRituals: Record<string, RitualDefinition>;

  beforeEach(() => {
    ritualEngine = new RitualEngine();
    validRituals = {
      'test-ritual-1': {
        id: 'test-ritual-1',
        steps: [
          {
            type: 'prompt',
            content: 'Test prompt'
          },
          {
            type: 'action',
            content: 'Test action'
          }
        ]
      },
      'test-ritual-2': {
        id: 'test-ritual-2',
        description: 'Test ritual with conditions',
        steps: [
          {
            type: 'prompt',
            content: 'Test prompt with condition',
            conditions: [
              {
                variable: 'testVar',
                operator: '==',
                value: true
              }
            ]
          },
          {
            type: 'pause',
            content: 'Test pause'
          }
        ]
      }
    };
  });

  describe('executeRitual', () => {
    it('should execute a ritual with context', async () => {
      await ritualEngine.initializeRituals(validRituals);
      const context = { testVar: true };
      const result = await ritualEngine.executeRitual('test-ritual-1', context);
      
      // Check that the result contains the original context
      expect(result).toHaveProperty('testVar', true);
      
      // Check that the result contains the mock results from steps
      expect(result).toHaveProperty('lastPromptResult');
      expect(result).toHaveProperty('lastActionResult');
    });

    it('should respect conditions when executing steps', async () => {
      await ritualEngine.initializeRituals(validRituals);
      
      // Context that satisfies the condition
      const contextTrue = { testVar: true };
      const resultTrue = await ritualEngine.executeRitual('test-ritual-2', contextTrue);
      
      // The prompt step should be executed
      expect(resultTrue).toHaveProperty('lastPromptResult');
      
      // Context that does not satisfy the condition
      const contextFalse = { testVar: false };
      const resultFalse = await ritualEngine.executeRitual('test-ritual-2', contextFalse);
      
      // The prompt step should be skipped
      expect(resultFalse).not.toHaveProperty('lastPromptResult');
      
      // The pause step should still be executed
      expect(resultFalse).toHaveProperty('lastPauseResult');
    });
  });
});
```

## Key Improvements

1. **Modularity**
   - Clear separation of concerns between engines
   - Well-defined interfaces for each component
   - Isolated validation from execution logic

2. **Type Safety**
   - Strong TypeScript typing throughout
   - Elimination of `any` types
   - Proper interface implementations

3. **Error Handling**
   - Custom error types for different scenarios
   - Detailed error messages with context
   - Consistent error handling patterns

4. **Schema Validation**
   - Centralized validation utility
   - Detailed schema definitions
   - Comprehensive error reporting

5. **Testability**
   - Pure functions where possible
   - Mockable dependencies
   - Clear component boundaries

6. **Extensibility**
   - Support for different step types
   - Conditional execution
   - Non-linear flow control
