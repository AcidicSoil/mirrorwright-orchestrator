import { readFileSync } from 'fs';
import { Logger } from './Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';
import { validatorEngine, SchemaType as ValidatorSchemaType } from '../validation/ValidatorEngine';

// Re-export the SchemaType for backward compatibility
export type SchemaType = ValidatorSchemaType;

/**
 * Schema validation utility that uses the unified ValidatorEngine
 * This is a wrapper for backward compatibility
 */
export class SchemaValidator {
  private logger: Logger;

  /**
   * Create a new schema validator
   */
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Validate data against a schema
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public validate(data: unknown, schemaType: string): boolean {
    const startTime = performance.now();
    this.logger.info(`Validating ${schemaType} using unified validator...`);

    try {
      // Use the ValidatorEngine to validate the data
      const result = validatorEngine.validate(data, schemaType as ValidatorSchemaType);

      if (!result.isValid) {
        // Format errors for better readability
        const formattedErrors = result.errors.join('\n');
        this.logger.error(`Validation failed for ${schemaType}:\n${formattedErrors}`);

        throw new EngineError(
          `${schemaType.charAt(0).toUpperCase() + schemaType.slice(1)} validation failed:\n${formattedErrors}`,
          EngineErrorType.VALIDATION_ERROR
        );
      }

      const endTime = performance.now();
      this.logger.info(`${schemaType} validation completed in ${(endTime - startTime).toFixed(2)}ms`);

      return true;
    } catch (error) {
      if (error instanceof EngineError) {
        throw error;
      }

      this.logger.error(`Validation error: ${error}`);
      throw new EngineError(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
  }

  /**
   * Validate a file against a schema
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
        `Failed to validate file ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }
  }

  /**
   * Clear the validation cache (no-op for compatibility)
   */
  public clearCache(): void {
    this.logger.info('Cache clearing is handled by ValidatorEngine');
  }

  /**
   * Get cache statistics (dummy for compatibility)
   * @returns Cache statistics
   */
  public getCacheStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: 0,
      maxSize: 0,
      enabled: false
    };
  }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator();
