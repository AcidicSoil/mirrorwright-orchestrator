import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Logger } from './Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';

// Import schemas
import modeSchema from '../schemas/mode.schema.json';
import protocolSchema from '../schemas/protocol.json';

// Define schema types
export type SchemaType = 'mode' | 'ritual' | 'protocol' | 'all';

// Define validation cache interface
interface ValidationCacheEntry {
  result: boolean;
  timestamp: number;
  hash: string;
}

/**
 * Schema validation utility with performance optimizations
 */
export class SchemaValidator {
  private ajv: Ajv;
  private logger: Logger;
  private validators: Map<string, ValidateFunction>;
  private validationCache: Map<string, ValidationCacheEntry>;
  private cacheEnabled: boolean;
  private cacheMaxSize: number;
  private cacheExpirationMs: number;

  /**
   * Create a new schema validator
   * @param options Configuration options
   */
  constructor(options: {
    cacheEnabled?: boolean;
    cacheMaxSize?: number;
    cacheExpirationMs?: number;
  } = {}) {
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
      cache: true          // Enable internal AJV cache
    });

    // Add formats and keywords
    addFormats(this.ajv);
    addKeywords(this.ajv);

    this.logger = new Logger();
    this.validators = new Map();

    // Configure caching
    this.cacheEnabled = options.cacheEnabled ?? true;
    this.cacheMaxSize = options.cacheMaxSize ?? 1000;
    this.cacheExpirationMs = options.cacheExpirationMs ?? 60000; // 1 minute default
    this.validationCache = new Map();

    // Initialize validators
    this.initializeValidators();
  }

  /**
   * Initialize schema validators with optimizations
   */
  private initializeValidators(): void {
    const startTime = performance.now();

    try {
      // Add schemas
      this.ajv.addSchema(modeSchema, 'mode');
      this.ajv.addSchema(protocolSchema, 'protocol');

      // Precompile validators for better performance
      const modeValidator = this.ajv.getSchema('mode');
      const protocolValidator = this.ajv.getSchema('protocol');

      // Store validators
      if (modeValidator) this.validators.set('mode', modeValidator);
      if (protocolValidator) this.validators.set('protocol', protocolValidator);

      // Try to load ritual schema dynamically
      try {
        // This assumes ritual schema is in the same directory as other schemas
        const ritualSchemaPath = resolve(__dirname, '../../schemas/ritual.schema.json');
        const ritualSchema = JSON.parse(readFileSync(ritualSchemaPath, 'utf-8'));
        this.ajv.addSchema(ritualSchema, 'ritual');
        const ritualValidator = this.ajv.getSchema('ritual');
        if (ritualValidator) this.validators.set('ritual', ritualValidator);
      } catch (error) {
        this.logger.error(`Failed to load ritual schema: ${error}`);
      }

      const endTime = performance.now();
      this.logger.info(`Schema validators initialized in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      this.logger.error(`Failed to initialize validators: ${error}`);
      throw new EngineError(
        `Failed to initialize schema validators: ${error}`,
        EngineErrorType.INITIALIZATION_ERROR
      );
    }
  }

  /**
   * Generate a simple hash for caching
   * @param data Data to hash
   * @param schemaType Schema type
   * @returns Hash string
   */
  private generateHash(data: unknown, schemaType: string): string {
    // Simple hash function for caching
    // In production, consider using a more robust hashing algorithm
    try {
      return `${schemaType}:${JSON.stringify(data)}`;
    } catch (error) {
      // If JSON.stringify fails, return a fallback
      return `${schemaType}:${String(data)}`;
    }
  }

  /**
   * Clean expired cache entries
   */
  private cleanCache(): void {
    const now = Date.now();
    let expiredCount = 0;

    // Remove expired entries
    for (const [key, entry] of this.validationCache.entries()) {
      if (now - entry.timestamp > this.cacheExpirationMs) {
        this.validationCache.delete(key);
        expiredCount++;
      }
    }

    // If cache is too large, remove oldest entries
    if (this.validationCache.size > this.cacheMaxSize) {
      const entriesToDelete = this.validationCache.size - this.cacheMaxSize;
      const entries = Array.from(this.validationCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, entriesToDelete);

      for (const [key] of entries) {
        this.validationCache.delete(key);
      }

      this.logger.info(`Cleaned ${entriesToDelete} oldest cache entries due to size limit`);
    }

    if (expiredCount > 0) {
      this.logger.info(`Cleaned ${expiredCount} expired cache entries`);
    }
  }

  /**
   * Format validation errors for better readability
   * @param errors Validation errors
   * @returns Formatted error string
   */
  private formatErrors(errors: ErrorObject[] | null | undefined): string {
    if (!errors || errors.length === 0) {
      return 'Unknown validation error';
    }

    return errors.map(error => {
      const path = error.instancePath || '';
      const message = error.message || 'Invalid value';
      const params = error.params ? ` (${JSON.stringify(error.params)})` : '';

      return `${path}: ${message}${params}`;
    }).join('\n');
  }

  /**
   * Validate data against a schema with performance optimizations
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public validate(data: unknown, schemaType: string): boolean {
    const startTime = performance.now();

    // Check cache if enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(data, schemaType);
      const cachedResult = this.validationCache.get(hash);

      if (cachedResult) {
        // Cache hit
        const endTime = performance.now();
        this.logger.info(`Cache hit for ${schemaType} validation (${(endTime - startTime).toFixed(2)}ms)`);

        // If cached result is invalid, throw the same error
        if (!cachedResult.result) {
          throw new EngineError(
            `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} validation failed (cached result)`,
            EngineErrorType.VALIDATION_ERROR
          );
        }

        return true;
      }

      // Clean cache periodically
      if (Math.random() < 0.1) { // 10% chance to clean on each validation
        this.cleanCache();
      }
    }

    // Get validator
    const validator = this.validators.get(schemaType);

    if (!validator) {
      throw new EngineError(
        `Schema validator not found for type: ${schemaType}`,
        EngineErrorType.NOT_FOUND_ERROR
      );
    }

    // Perform validation
    const valid = validator(data);

    // Cache the result if caching is enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(data, schemaType);
      this.validationCache.set(hash, {
        result: !!valid,
        timestamp: Date.now(),
        hash
      });
    }

    // Handle validation errors
    if (!valid && validator.errors) {
      const formattedErrors = this.formatErrors(validator.errors);
      this.logger.error(`Validation failed for ${schemaType}:\n${formattedErrors}`);

      throw new EngineError(
        `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} validation failed:\n${formattedErrors}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }

    const endTime = performance.now();
    this.logger.info(`${schemaType} validation completed in ${(endTime - startTime).toFixed(2)}ms`);

    return true;
  }

  /**
   * Validate a file against a schema with performance optimizations
   * @param filePath Path to the file to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public validateFile(filePath: string, schemaType: string): boolean {
    const startTime = performance.now();

    try {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      const result = this.validate(data, schemaType);

      const endTime = performance.now();
      this.logger.info(`File ${filePath} validated in ${(endTime - startTime).toFixed(2)}ms`);

      return result;
    } catch (error) {
      if (error instanceof EngineError) throw error;

      this.logger.error(`Failed to validate file ${filePath}: ${error}`);
      throw new EngineError(
        `Failed to validate file ${filePath}: ${error}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
  }

  /**
   * Clear the validation cache
   */
  public clearCache(): void {
    const cacheSize = this.validationCache.size;
    this.validationCache.clear();
    this.logger.info(`Cleared validation cache (${cacheSize} entries)`);
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  public getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.validationCache.size,
      maxSize: this.cacheMaxSize,
      enabled: this.cacheEnabled
    };
  }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator();
