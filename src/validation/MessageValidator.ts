import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { Message } from '../orchestrator/runtime';
import { Logger } from '../utils/Logger';
import messageSchema from '../schemas/message.schema.json';
import { performance } from 'perf_hooks';

/**
 * Cache entry for message validation results
 */
interface ValidationCacheEntry {
  result: boolean;
  timestamp: number;
  hash: string;
  errors?: ErrorObject[] | null;
}

/**
 * Configuration options for MessageValidator
 */
export interface MessageValidatorOptions {
  /** Enable validation result caching */
  cacheEnabled?: boolean;
  /** Maximum number of cache entries */
  cacheMaxSize?: number;
  /** Cache entry expiration time in milliseconds */
  cacheExpirationMs?: number;
  /** Enable performance metrics logging */
  logPerformance?: boolean;
}

/**
 * Optimized validator for message objects with caching
 */
export class MessageValidator {
  private validator: ValidateFunction;
  private logger: Logger;
  private validationCache: Map<string, ValidationCacheEntry>;
  private cacheEnabled: boolean;
  private cacheMaxSize: number;
  private cacheExpirationMs: number;
  private logPerformance: boolean;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private totalValidations: number = 0;

  /**
   * Create a new message validator with caching
   * @param options Configuration options
   */
  constructor(options: MessageValidatorOptions = {}) {
    // Configure AJV with optimizations
    const ajv = new Ajv({
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

    // Add formats for better validation
    addFormats(ajv);

    // Precompile the validator for better performance
    this.validator = ajv.compile(messageSchema);
    this.logger = new Logger();

    // Configure caching
    this.cacheEnabled = options.cacheEnabled ?? true;
    this.cacheMaxSize = options.cacheMaxSize ?? 1000;
    this.cacheExpirationMs = options.cacheExpirationMs ?? 60000; // 1 minute default
    this.logPerformance = options.logPerformance ?? false;
    this.validationCache = new Map();

    this.logger.info('MessageValidator initialized with caching');
  }

  /**
   * Generate a simple hash for caching
   * @param message Message to hash
   * @returns Hash string
   */
  private generateHash(message: unknown): string {
    // Simple hash function for caching
    // In production, consider using a more robust hashing algorithm
    try {
      // For messages, we can use a simplified hash based on key properties
      if (typeof message === 'object' && message !== null) {
        const msg = message as any;
        // Use key fields that are likely to be unique but ignore timestamp
        // which changes frequently but doesn't affect schema validity
        const keyParts = [
          msg.id,
          msg.from,
          msg.to,
          msg.type,
          // Include payload and metadata structure but not all content
          typeof msg.payload === 'object' ? Object.keys(msg.payload || {}).sort().join(',') : typeof msg.payload,
          typeof msg.metadata === 'object' ? Object.keys(msg.metadata || {}).sort().join(',') : typeof msg.metadata
        ];
        return keyParts.filter(Boolean).join(':');
      }

      // Fallback to full JSON stringify for non-message objects
      return JSON.stringify(message);
    } catch (error) {
      // If JSON.stringify fails, return a fallback
      return String(message);
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

      if (this.logPerformance) {
        this.logger.info(`Cleaned ${entriesToDelete} oldest cache entries due to size limit`);
      }
    }

    if (expiredCount > 0 && this.logPerformance) {
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
   * Validate a message against the schema with caching
   * @param message The message to validate
   * @returns True if the message is valid, false otherwise
   */
  public validate(message: unknown): message is Message {
    const startTime = this.logPerformance ? performance.now() : 0;
    this.totalValidations++;

    // Check cache if enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(message);
      const cachedResult = this.validationCache.get(hash);

      if (cachedResult) {
        // Cache hit
        this.cacheHits++;

        if (this.logPerformance) {
          const endTime = performance.now();
          this.logger.info(`Cache hit for message validation (${(endTime - startTime).toFixed(2)}ms)`);
        }

        // If cached result is invalid and has errors, log them
        if (!cachedResult.result && cachedResult.errors) {
          this.logger.error(`Message validation failed (cached): ${this.formatErrors(cachedResult.errors)}`);
        }

        return cachedResult.result;
      }

      // Cache miss
      this.cacheMisses++;

      // Clean cache periodically (10% chance)
      if (Math.random() < 0.1) {
        this.cleanCache();
      }
    }

    // Perform validation
    const valid = this.validator(message);

    // Cache the result if caching is enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(message);
      this.validationCache.set(hash, {
        result: !!valid,
        timestamp: Date.now(),
        hash,
        errors: valid ? null : [...(this.validator.errors || [])]
      });
    }

    // Log validation errors
    if (!valid && this.validator.errors) {
      const formattedErrors = this.formatErrors(this.validator.errors);
      this.logger.error(`Message validation failed: ${formattedErrors}`);
    }

    if (this.logPerformance) {
      const endTime = performance.now();
      this.logger.info(`Message validation completed in ${(endTime - startTime).toFixed(2)}ms`);
    }

    return !!valid;
  }

  /**
   * Validate a message and throw an error if it's invalid
   * @param message The message to validate
   * @throws Error if the message is invalid
   */
  public validateWithThrow(message: unknown): asserts message is Message {
    const startTime = this.logPerformance ? performance.now() : 0;
    this.totalValidations++;

    // Check cache if enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(message);
      const cachedResult = this.validationCache.get(hash);

      if (cachedResult) {
        // Cache hit
        this.cacheHits++;

        if (this.logPerformance) {
          const endTime = performance.now();
          this.logger.info(`Cache hit for message validation with throw (${(endTime - startTime).toFixed(2)}ms)`);
        }

        // If cached result is invalid, throw the same error
        if (!cachedResult.result) {
          const errorMessage = `Message validation failed: ${this.formatErrors(cachedResult.errors)}`;
          this.logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        return;
      }

      // Cache miss
      this.cacheMisses++;

      // Clean cache periodically (10% chance)
      if (Math.random() < 0.1) {
        this.cleanCache();
      }
    }

    // Perform validation
    const valid = this.validator(message);

    // Cache the result if caching is enabled
    if (this.cacheEnabled) {
      const hash = this.generateHash(message);
      this.validationCache.set(hash, {
        result: !!valid,
        timestamp: Date.now(),
        hash,
        errors: valid ? null : [...(this.validator.errors || [])]
      });
    }

    // Handle validation errors
    if (!valid && this.validator.errors) {
      const formattedErrors = this.formatErrors(this.validator.errors);
      const errorMessage = `Message validation failed: ${formattedErrors}`;
      this.logger.error(errorMessage);

      if (this.logPerformance) {
        const endTime = performance.now();
        this.logger.info(`Message validation with throw failed in ${(endTime - startTime).toFixed(2)}ms`);
      }

      throw new Error(errorMessage);
    }

    if (this.logPerformance) {
      const endTime = performance.now();
      this.logger.info(`Message validation with throw completed in ${(endTime - startTime).toFixed(2)}ms`);
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
  public getCacheStats(): {
    size: number;
    maxSize: number;
    enabled: boolean;
    hits: number;
    misses: number;
    totalValidations: number;
    hitRate: number;
  } {
    return {
      size: this.validationCache.size,
      maxSize: this.cacheMaxSize,
      enabled: this.cacheEnabled,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      totalValidations: this.totalValidations,
      hitRate: this.totalValidations > 0 ? this.cacheHits / this.totalValidations : 0
    };
  }
}
