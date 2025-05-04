import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { Logger } from '../utils/Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';
import { getSchema, getAllSchemas } from '../schema/SchemaRegistry';

// Define schema types
export type SchemaType = 'mode' | 'ritual' | 'protocol' | 'all';

// Define validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Unified validator engine for all schema types
 * Uses SchemaRegistry to load schemas and AJV for validation
 */
export class ValidatorEngine {
  private ajv: Ajv;
  private logger: Logger;
  private validators: Map<string, ValidateFunction>;
  private initialized: boolean = false;

  /**
   * Create a new validator engine
   */
  constructor() {
    // Configure AJV with optimizations
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      code: {
        source: true,
        optimize: true,
        lines: true
      },
      strictSchema: false, // Improves performance but reduces strictness
      strictTypes: false,  // Improves performance but reduces strictness
      schemas: [
        {
          $id: "https://json-schema.org/draft-07/schema#",
          $schema: "https://json-schema.org/draft-07/schema#",
          title: "Core schema meta-schema",
          type: ["object", "boolean"]
        }
      ]
    });

    // Add formats and keywords
    addFormats(this.ajv);
    addKeywords(this.ajv);

    this.logger = new Logger();
    this.validators = new Map();

    // Initialize validators
    this.initialize();
  }

  /**
   * Initialize schema validators
   */
  private initialize(): void {
    const startTime = performance.now();
    this.logger.info('Initializing schema validators...');

    try {
      // Load all schemas from registry
      const schemas = getAllSchemas();

      // Add each schema to AJV
      for (const [id, schema] of Object.entries(schemas)) {
        this.ajv.addSchema(schema, id);
        const validator = this.ajv.getSchema(id);
        if (validator) {
          this.validators.set(id, validator);
          this.logger.info(`Loaded schema: ${id}`);
        } else {
          this.logger.error(`Failed to get validator for schema: ${id}`);
        }
      }

      this.initialized = true;
      const endTime = performance.now();
      this.logger.info(`Schema validators initialized in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      this.logger.error(`Failed to initialize schema validators: ${error}`);
      throw new EngineError(
        `Failed to initialize schema validators: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.INITIALIZATION_ERROR
      );
    }
  }

  /**
   * Format validation errors for better readability
   * @param errors AJV error objects
   * @returns Formatted error strings
   */
  private formatErrors(errors: ErrorObject[]): string[] {
    return errors.map(err => {
      const path = err.instancePath || '';
      const message = err.message || 'Unknown error';
      return `${path ? `At ${path}: ` : ''}${message}`;
    });
  }

  /**
   * Validate data against a schema
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns Validation result
   */
  public validate(data: any, schemaType: SchemaType): ValidationResult {
    const startTime = performance.now();
    this.logger.info(`Validating ${schemaType}...`);

    // Ensure validators are initialized
    if (!this.initialized) {
      this.initialize();
    }

    // Handle 'all' schema type
    if (schemaType === 'all') {
      // Try to determine the schema type from the content
      const detectedType = this.determineSchemaTypeFromContent(data);
      if (!detectedType) {
        return {
          isValid: false,
          errors: ['Could not determine schema type from content']
        };
      }
      schemaType = detectedType;
    }

    // Get the appropriate validator
    const validator = this.validators.get(schemaType);
    if (!validator) {
      return {
        isValid: false,
        errors: [`No validator found for schema type: ${schemaType}`]
      };
    }

    // Perform validation
    const valid = validator(data);

    if (!valid) {
      // Format validation errors
      const errors = this.formatErrors(validator.errors || []);
      const endTime = performance.now();
      this.logger.info(`Validation failed for ${schemaType} in ${(endTime - startTime).toFixed(2)}ms`);

      return {
        isValid: false,
        errors
      };
    }

    const endTime = performance.now();
    this.logger.info(`Validation successful for ${schemaType} in ${(endTime - startTime).toFixed(2)}ms`);

    return {
      isValid: true,
      errors: []
    };
  }

  /**
   * Attempts to determine the schema type from the content
   * @param data Data to analyze
   * @returns Detected schema type or null if not detected
   */
  private determineSchemaTypeFromContent(data: any): SchemaType | null {
    // Protocol typically has modes and rituals
    if (data.modes && data.rituals) {
      return 'protocol';
    }

    // Mode typically has id, name, and entryRitual
    if (data.id && data.name && data.entryRitual) {
      return 'mode';
    }

    // Ritual typically has id and steps
    if (data.id && data.steps) {
      return 'ritual';
    }

    return null;
  }

  /**
   * Get a validator function for a specific schema type
   * @param schemaType Type of schema to get validator for
   * @returns Validator function
   */
  public getValidator(schemaType: SchemaType): (data: any) => ValidationResult {
    return (data: any) => this.validate(data, schemaType);
  }
}

// Export singleton instance
export const validatorEngine = new ValidatorEngine();

// Backward compatibility function
export const validate = async (type: string, data: any): Promise<ValidationResult> => {
  return validatorEngine.validate(data, type as SchemaType);
};
