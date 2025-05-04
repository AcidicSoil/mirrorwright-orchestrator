import * as fs from 'fs';
import { Logger } from './Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';
import { validatorEngine, SchemaType as ValidatorSchemaType, ValidationResult } from '../validation/ValidatorEngine';
import yaml from 'yaml';
import path from 'path';

// Re-export the SchemaType for backward compatibility
export type SchemaType = ValidatorSchemaType;

/**
 * Schema validation utility that uses the unified ValidatorEngine
 * This is a wrapper for backward compatibility and provides additional utilities
 */
export class SchemaValidator {
  private logger: Logger;

  /**
   * Create a new schema validator
   */
  constructor() {
    this.logger = new Logger();

    // Register validation hooks for logging
    this.registerValidationHooks();
  }

  /**
   * Register validation hooks with the ValidatorEngine
   */
  private registerValidationHooks(): void {
    // Add post-validation hook for logging
    validatorEngine.addPostValidationHook((result: ValidationResult) => {
      if (!result.isValid) {
        this.logger.error(`Validation failed for ${result.schemaType}:\n${result.errors.join('\n')}`);
      }
    });
  }

  /**
   * Validate data against a schema
   * @param data Data to validate
   * @param schemaType Type of schema to validate against
   * @returns True if valid, throws error if invalid
   */
  public async validate(data: unknown, schemaType: string): Promise<boolean> {
    const startTime = performance.now();
    this.logger.info(`Validating ${schemaType} using unified validator...`);

    try {
      // Use the ValidatorEngine to validate the data
      const result = await validatorEngine.validate(data, schemaType as ValidatorSchemaType);

      if (!result.isValid) {
        // Format errors for better readability
        const formattedErrors = result.errors.join('\n');

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
  public async validateFile(filePath: string, schemaType: string): Promise<boolean> {
    const startTime = performance.now();
    this.logger.info(`Validating file ${filePath} as ${schemaType}...`);

    try {
      // Determine file type from extension
      const ext = path.extname(filePath).toLowerCase();
      let data: any;

      // Parse file based on extension
      if (ext === '.json') {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } else if (ext === '.yaml' || ext === '.yml') {
        data = yaml.parse(fs.readFileSync(filePath, 'utf-8'));
      } else {
        throw new Error(`Unsupported file extension: ${ext}`);
      }

      // Validate the data
      const result = await this.validate(data, schemaType);

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
   * Determine schema type from file path
   * @param filePath Path to the file
   * @returns Schema type
   */
  public determineSchemaTypeFromPath(filePath: string): ValidatorSchemaType {
    const fileName = path.basename(filePath).toLowerCase();
    const dirName = path.dirname(filePath).toLowerCase();

    // Check filename first
    if (fileName.includes('protocol')) {
      return 'protocol';
    } else if (fileName.includes('mode')) {
      return 'mode';
    } else if (fileName.includes('ritual')) {
      return 'ritual';
    }

    // Check directory structure
    if (dirName.includes('protocols')) {
      return 'protocol';
    } else if (dirName.includes('modes')) {
      return 'mode';
    } else if (dirName.includes('rituals')) {
      return 'ritual';
    }

    // Default to 'all' if we can't determine
    return 'all';
  }

  /**
   * Validate a directory of files
   * @param dirPath Path to the directory
   * @param recursive Whether to recursively validate subdirectories
   * @returns Object with validation results
   */
  public async validateDirectory(dirPath: string, recursive: boolean = false): Promise<{
    valid: string[];
    invalid: { path: string; errors: string[] }[];
  }> {
    const valid: string[] = [];
    const invalid: { path: string; errors: string[] }[] = [];

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory() && recursive) {
          // Recursively validate subdirectory
          const subResults = await this.validateDirectory(filePath, recursive);
          valid.push(...subResults.valid);
          invalid.push(...subResults.invalid);
        } else if (stats.isFile() && (file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml'))) {
          // Determine schema type from path
          const schemaType = this.determineSchemaTypeFromPath(filePath);

          try {
            await this.validateFile(filePath, schemaType);
            valid.push(filePath);
          } catch (error) {
            if (error instanceof EngineError && error.type === EngineErrorType.VALIDATION_ERROR) {
              invalid.push({
                path: filePath,
                errors: [error.message]
              });
            } else {
              invalid.push({
                path: filePath,
                errors: [`Error: ${error instanceof Error ? error.message : String(error)}`]
              });
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error validating directory ${dirPath}: ${error}`);
      throw new EngineError(
        `Error validating directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.VALIDATION_ERROR
      );
    }

    return { valid, invalid };
  }

  /**
   * Clear the validation cache
   */
  public clearCache(): void {
    validatorEngine.clearCache();
    this.logger.info('Validation cache cleared');
  }

  /**
   * Reload schemas from disk
   */
  public reloadSchemas(): void {
    validatorEngine.reload();
    this.logger.info('Schemas reloaded');
  }

  /**
   * Add a custom schema directory
   * @param directory Directory path
   */
  public addSchemaDirectory(directory: string): void {
    validatorEngine.addSchemaDirectory(directory);
    this.logger.info(`Added schema directory: ${directory}`);
  }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator();
