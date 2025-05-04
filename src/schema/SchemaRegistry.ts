import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/Logger';
import { EngineError, EngineErrorType } from '../types/engine';
import { performance } from 'perf_hooks';

/**
 * Schema Registry Configuration
 */
export interface SchemaRegistryConfig {
  /** Base directory for schemas */
  baseDirectory?: string;
  /** Additional directories to search for schemas */
  additionalDirectories?: string[];
  /** Enable schema caching */
  enableCaching?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
}

/**
 * Schema Registry class for managing JSON schemas
 * Provides dynamic loading, caching, and schema resolution
 */
export class SchemaRegistry {
  private logger: Logger;
  private config: SchemaRegistryConfig;
  private schemaCache: Map<string, { schema: Record<string, any>, timestamp: number }>;
  private initialized: boolean = false;
  private defaultSchemaDirectory: string;

  /**
   * Create a new schema registry
   * @param config Configuration options
   */
  constructor(config: SchemaRegistryConfig = {}) {
    this.logger = new Logger();
    this.defaultSchemaDirectory = path.join(__dirname, '../schemas');

    // Set default configuration
    this.config = {
      baseDirectory: this.defaultSchemaDirectory,
      additionalDirectories: [],
      enableCaching: true,
      cacheTTL: 60000, // 1 minute
      ...config
    };

    this.schemaCache = new Map();
    this.logger.info('Schema registry initialized');
  }

  /**
   * Initialize the schema registry
   * Preloads schemas if caching is enabled
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    const startTime = performance.now();
    this.logger.info('Initializing schema registry...');

    if (this.config.enableCaching) {
      // Preload schemas into cache
      this.getAllSchemas();
    }

    this.initialized = true;
    const endTime = performance.now();
    this.logger.info(`Schema registry initialized in ${(endTime - startTime).toFixed(2)}ms`);
  }

  /**
   * Get all schema directories to search
   * @returns Array of directory paths
   */
  private getSchemaDirectories(): string[] {
    const directories = [this.config.baseDirectory!];

    if (this.config.additionalDirectories && this.config.additionalDirectories.length > 0) {
      directories.push(...this.config.additionalDirectories);
    }

    return directories;
  }

  /**
   * Normalize schema ID from filename
   * @param filename Schema filename
   * @returns Normalized schema ID
   */
  private normalizeSchemaId(filename: string): string {
    if (filename === 'mode.schema.json') {
      return 'mode';
    } else if (filename === 'ritual.schema.json') {
      return 'ritual';
    } else if (filename === 'protocol.json') {
      return 'protocol';
    } else if (filename.endsWith('.schema.json')) {
      return filename.slice(0, -12); // Remove .schema.json
    } else if (filename.endsWith('.json')) {
      return filename.slice(0, -5); // Remove .json
    }

    return filename;
  }

  /**
   * Get schema filename from ID
   * @param id Schema ID
   * @returns Schema filename
   */
  private getSchemaFilename(id: string): string {
    if (id === 'mode') {
      return 'mode.schema.json';
    } else if (id === 'ritual') {
      return 'ritual.schema.json';
    } else if (id === 'protocol') {
      return 'protocol.json';
    }

    return `${id}.json`;
  }

  /**
   * Check if a schema is cached and valid
   * @param id Schema ID
   * @returns True if cached and valid, false otherwise
   */
  private isCacheValid(id: string): boolean {
    if (!this.config.enableCaching) {
      return false;
    }

    const cached = this.schemaCache.get(id);
    if (!cached) {
      return false;
    }

    const now = Date.now();
    return (now - cached.timestamp) < this.config.cacheTTL!;
  }

  /**
   * Get a specific schema by ID
   * @param id Schema ID (without .json extension)
   * @returns The schema object or undefined if not found
   */
  public getSchema(id: string): Record<string, any> | undefined {
    // Check cache first
    if (this.isCacheValid(id)) {
      return this.schemaCache.get(id)!.schema;
    }

    try {
      const fileName = this.getSchemaFilename(id);
      const directories = this.getSchemaDirectories();

      // Try each directory
      for (const directory of directories) {
        const filePath = path.join(directory, fileName);

        if (fs.existsSync(filePath)) {
          const schemaContent = fs.readFileSync(filePath, 'utf8');
          const schema = JSON.parse(schemaContent);

          // Cache the schema if caching is enabled
          if (this.config.enableCaching) {
            this.schemaCache.set(id, { schema, timestamp: Date.now() });
          }

          return schema;
        }
      }

      this.logger.error(`Schema not found: ${id}`);
      return undefined;
    } catch (error) {
      this.logger.error(`Error loading schema ${id}: ${error}`);
      return undefined;
    }
  }

  /**
   * Get all schemas from all schema directories
   * @returns Record of schema ID to schema object
   */
  public getAllSchemas(): Record<string, any> {
    const schemas: Record<string, any> = {};
    const directories = this.getSchemaDirectories();

    try {
      // Process each directory
      for (const directory of directories) {
        if (!fs.existsSync(directory)) {
          this.logger.error(`Schema directory does not exist: ${directory}`);
          continue;
        }

        fs.readdirSync(directory).forEach((file) => {
          if (file.endsWith('.json')) {
            const id = this.normalizeSchemaId(file);

            // Skip if already loaded from a higher priority directory
            if (schemas[id]) {
              return;
            }

            const filePath = path.join(directory, file);
            try {
              const schemaContent = fs.readFileSync(filePath, 'utf8');
              const schema = JSON.parse(schemaContent);

              schemas[id] = schema;

              // Cache the schema if caching is enabled
              if (this.config.enableCaching) {
                this.schemaCache.set(id, { schema, timestamp: Date.now() });
              }
            } catch (error) {
              this.logger.error(`Error loading schema ${id}: ${error}`);
            }
          }
        });
      }
    } catch (error) {
      this.logger.error(`Error reading schema directories: ${error}`);
    }

    return schemas;
  }

  /**
   * Add a custom schema directory
   * @param directory Directory path
   */
  public addSchemaDirectory(directory: string): void {
    if (!this.config.additionalDirectories) {
      this.config.additionalDirectories = [];
    }

    if (!this.config.additionalDirectories.includes(directory)) {
      this.config.additionalDirectories.push(directory);
      this.logger.info(`Added schema directory: ${directory}`);

      // Invalidate cache
      if (this.config.enableCaching) {
        this.schemaCache.clear();
      }
    }
  }

  /**
   * Clear the schema cache
   */
  public clearCache(): void {
    this.schemaCache.clear();
    this.logger.info('Schema cache cleared');
  }

  /**
   * Reload all schemas from disk
   * @returns Record of schema ID to schema object
   */
  public reloadSchemas(): Record<string, any> {
    this.clearCache();
    return this.getAllSchemas();
  }
}

// Create and export singleton instance
export const schemaRegistry = new SchemaRegistry();

// Backward compatibility functions
export const getSchema = (id: string): Record<string, any> | undefined => {
  return schemaRegistry.getSchema(id);
};

export const getAllSchemas = (): Record<string, any> => {
  return schemaRegistry.getAllSchemas();
};
