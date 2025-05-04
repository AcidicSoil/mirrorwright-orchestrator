import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { Logger } from '../utils/Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';
import { schemaRegistry, SchemaRegistry } from '../schema/SchemaRegistry';
import EventEmitter from 'events';

// Define schema types
export type SchemaType = 'mode' | 'ritual' | 'protocol' | 'all';

// Define validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
  schemaType?: SchemaType;
  timestamp?: number;
}

// Define validation hook types
export type ValidationHook = (result: ValidationResult) => void | Promise<void>;

// Define validator engine configuration
export interface ValidatorEngineConfig {
  /** Enable validation caching */
  enableCaching?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Custom schema registry instance */
  schemaRegistry?: SchemaRegistry;
  /** Enable validation events */
  enableEvents?: boolean;
}

/**
 * Unified validator engine for all schema types
 * Uses SchemaRegistry to load schemas and AJV for validation
 * Supports validation hooks, caching, and events
 */
export class ValidatorEngine extends EventEmitter {
  private ajv: Ajv;
  private logger: Logger;
  private validators: Map<string, ValidateFunction>;
  private validationCache: Map<string, { result: ValidationResult, timestamp: number }>;
  private initialized: boolean = false;
  private registry: SchemaRegistry;
  private config: ValidatorEngineConfig;
  private preValidationHooks: ValidationHook[] = [];
  private postValidationHooks: ValidationHook[] = [];

  /**
   * Create a new validator engine
   * @param config Configuration options
   */
  constructor(config: ValidatorEngineConfig = {}) {
    super();

    // Set default configuration
    this.config = {
      enableCaching: true,
      cacheTTL: 30000, // 30 seconds
      schemaRegistry: schemaRegistry,
      enableEvents: true,
      ...config
    };

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
    this.validationCache = new Map();
    this.registry = this.config.schemaRegistry!;

    // Initialize validators
    this.initialize();
  }

  /**
   * Initialize schema validators
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    const startTime = performance.now();
    this.logger.info('Initializing schema validators...');

    try {
      // Load all schemas from registry
      const schemas = this.registry.getAllSchemas();

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
      const params = err.params ? ` (${JSON.stringify(err.params)})` : '';
      return `${path ? `At ${path}: ` : ''}${message}${params}`;
    });
  }

  /**
   * Generate a cache key for validation
   * @param data Data to validate
   * @param schemaType Schema type
   * @returns Cache key
   */
  private generateCacheKey(data: any, schemaType: SchemaType): string {
    // Simple hash function for objects
    const hash = (obj: any): string => {
      const str = JSON.stringify(obj);
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0; // Convert to 32bit integer
      }
      return h.toString(16);
    };

    return `${schemaType}:${hash(data)}`;
  }

  /**
   * Check if a validation result is cached and valid
   * @param data Data to validate
   * @param schemaType Schema type
   * @returns Cached validation result or undefined
   */
  private getCachedValidation(data: any, schemaType: SchemaType): ValidationResult | undefined {
    if (!this.config.enableCaching) {
      return undefined;
    }

    const cacheKey = this.generateCacheKey(data, schemaType);
    const cached = this.validationCache.get(cacheKey);

    if (!cached) {
      return undefined;
    }

    const now = Date.now();
    if ((now - cached.timestamp) > this.config.cacheTTL!) {
      // Cache expired
      this.validationCache.delete(cacheKey);
      return undefined;
    }

    return cached.result;
  }

  /**
   * Cache a validation result
   * @param data Data that was validated
   * @param schemaType Schema type
   * @param result Validation result
   */
  private cacheValidation(data: any, schemaType: SchemaType, result: ValidationResult): void {
    if (!this.config.enableCaching) {
      return;
    }

    const cacheKey = this.generateCacheKey(data, schemaType);
    this.validationCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Add a pre-validation hook
   * @param hook Hook function to call before validation
   */
  public addPreValidationHook(hook: ValidationHook): void {
    this.preValidationHooks.push(hook);
  }

  /**
   * Add a post-validation hook
   * @param hook Hook function to call after validation
   */
  public addPostValidationHook(hook: ValidationHook): void {
    this.postValidationHooks.push(hook);
  }

  /**
   * Clear all validation hooks
   */
  public clearHooks(): void {
    this.preValidationHooks = [];
    this.postValidationHooks = [];
  }

  /**
   * Execute pre-validation hooks
   * @param result Validation result
   */
  private async executePreValidationHooks(result: ValidationResult): Promise<void> {
    for (const hook of this.preValidationHooks) {
      try {
        await hook(result);
      } catch (error) {
        this.logger.error(`Error in pre-validation hook: ${error}`);
      }
    }
  }

  /**
   * Execute post-validation hooks
   * @param result Validation result
   */
  private async executePostValidationHooks(result: ValidationResult): Promise<void> {
    for (const hook of this.postValidationHooks) {
      try {
        await hook(result);
      } catch (error) {
        this.logger.error(`Error in post-validation hook: ${error}`);
      }
    }

    // Emit validation event if enabled
    if (this.config.enableEvents) {
      if (result.isValid) {
        this.emit('validation:success', result);
      } else {
        this.emit('validation:error', result);
      }
      this.emit('validation:complete', result);
    }
  }

  /**
   * Validate data against a schema
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns Validation result
   */
  public async validate(data: any, schemaType: SchemaType): Promise<ValidationResult> {
    const startTime = performance.now();
    this.logger.info(`Validating ${schemaType}...`);

    // Create initial result object
    const initialResult: ValidationResult = {
      isValid: false,
      errors: [],
      data,
      schemaType,
      timestamp: Date.now()
    };

    // Execute pre-validation hooks
    await this.executePreValidationHooks(initialResult);

    // Check cache first
    const cachedResult = this.getCachedValidation(data, schemaType);
    if (cachedResult) {
      this.logger.info(`Using cached validation result for ${schemaType}`);

      // Execute post-validation hooks with cached result
      await this.executePostValidationHooks(cachedResult);

      return cachedResult;
    }

    // Ensure validators are initialized
    if (!this.initialized) {
      this.initialize();
    }

    // Handle 'all' schema type
    if (schemaType === 'all') {
      // Try to determine the schema type from the content
      const detectedType = this.determineSchemaTypeFromContent(data);
      if (!detectedType) {
        const result: ValidationResult = {
          isValid: false,
          errors: ['Could not determine schema type from content'],
          data,
          schemaType,
          timestamp: Date.now()
        };

        // Execute post-validation hooks
        await this.executePostValidationHooks(result);

        return result;
      }
      schemaType = detectedType;
    }

    // Get the appropriate validator
    const validator = this.validators.get(schemaType);
    if (!validator) {
      const result: ValidationResult = {
        isValid: false,
        errors: [`No validator found for schema type: ${schemaType}`],
        data,
        schemaType,
        timestamp: Date.now()
      };

      // Execute post-validation hooks
      await this.executePostValidationHooks(result);

      return result;
    }

    // Perform validation
    const valid = validator(data);

    let result: ValidationResult;

    if (!valid) {
      // Format validation errors
      const errors = this.formatErrors(validator.errors || []);
      const endTime = performance.now();
      this.logger.info(`Validation failed for ${schemaType} in ${(endTime - startTime).toFixed(2)}ms`);

      result = {
        isValid: false,
        errors,
        data,
        schemaType,
        timestamp: Date.now()
      };
    } else {
      const endTime = performance.now();
      this.logger.info(`Validation successful for ${schemaType} in ${(endTime - startTime).toFixed(2)}ms`);

      result = {
        isValid: true,
        errors: [],
        data,
        schemaType,
        timestamp: Date.now()
      };
    }

    // Cache the result
    this.cacheValidation(data, schemaType, result);

    // Execute post-validation hooks
    await this.executePostValidationHooks(result);

    return result;
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
  public getValidator(schemaType: SchemaType): (data: any) => Promise<ValidationResult> {
    return (data: any) => this.validate(data, schemaType);
  }

  /**
   * Clear the validation cache
   */
  public clearCache(): void {
    this.validationCache.clear();
    this.logger.info('Validation cache cleared');
  }

  /**
   * Reload all schemas and rebuild validators
   */
  public reload(): void {
    this.logger.info('Reloading schemas and rebuilding validators...');

    // Clear caches
    this.clearCache();
    this.validators.clear();

    // Reset initialization flag
    this.initialized = false;

    // Reinitialize
    this.initialize();
  }

  /**
   * Add a custom schema directory to the registry and reload
   * @param directory Directory path
   */
  public addSchemaDirectory(directory: string): void {
    this.registry.addSchemaDirectory(directory);
    this.reload();
  }
}

// Export singleton instance
export const validatorEngine = new ValidatorEngine();

// Backward compatibility function
export const validate = async (type: string, data: any): Promise<ValidationResult> => {
  return validatorEngine.validate(data, type as SchemaType);
};
