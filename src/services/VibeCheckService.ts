import { Logger } from '../utils/Logger';
import { VibeCheckClient, VibeCheckClientConfig } from '../clients/VibeCheckClient';

/**
 * Parameters for vibe_check operation
 */
export interface VibeCheckParams {
  /**
   * Current project phase for context-appropriate feedback
   */
  phase: 'planning' | 'implementation' | 'review';

  /**
   * Original user request - critical for alignment checking
   */
  userRequest: string;

  /**
   * Current plan or thinking
   */
  plan: string;

  /**
   * Agent's confidence level (0-1)
   */
  confidence?: number;

  /**
   * Raw sequential thinking transcript
   */
  thinkingLog?: string;

  /**
   * Previous feedback to avoid repetition and ensure progression
   */
  previousAdvice?: string;

  /**
   * Optional specific focus areas
   */
  focusAreas?: string[];

  /**
   * List of available MCP tools
   */
  availableTools?: string[];

  /**
   * Optional session ID for state management
   */
  sessionId?: string;
}

/**
 * Parameters for vibe_distill operation
 */
export interface VibeDistillParams {
  /**
   * The plan to distill
   */
  plan: string;

  /**
   * Original user request
   */
  userRequest: string;

  /**
   * Optional session ID for state management
   */
  sessionId?: string;
}

/**
 * Parameters for vibe_learn operation
 */
export interface VibeLearnParams {
  /**
   * One-sentence description of the mistake
   */
  mistake: string;

  /**
   * Category of mistake
   */
  category: 'Complex Solution Bias' | 'Feature Creep' | 'Premature Implementation' | 'Misalignment' | 'Overtooling' | 'Other';

  /**
   * How it was corrected (one sentence)
   */
  solution: string;

  /**
   * Optional session ID for state management
   */
  sessionId?: string;
}

/**
 * Result of a vibe operation
 */
export interface VibeResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * The response from the operation
   */
  response: string;

  /**
   * Error message if the operation failed
   */
  error?: string;
}

/**
 * Configuration options for the VibeCheck service
 */
export interface VibeCheckServiceConfig {
  /**
   * API key for authentication
   */
  apiKey?: string;

  /**
   * Base URL for the vibe-check-mcp-server
   * @default 'http://localhost:3000'
   */
  serverUrl?: string;

  /**
   * Timeout for requests in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Enable caching of responses
   * @default true
   */
  enableCaching?: boolean;

  /**
   * Cache TTL in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTtl?: number;
}

/**
 * Service for interacting with Vibe Check functionality
 */
export class VibeCheckService {
  private logger: Logger;
  private initialized: boolean = false;
  private client: VibeCheckClient;
  private config: VibeCheckServiceConfig;
  private cache: Map<string, { result: VibeResult, timestamp: number }> = new Map();

  /**
   * Create a new VibeCheckService
   * @param config Configuration options
   */
  constructor(config: VibeCheckServiceConfig = {}) {
    this.logger = new Logger();
    this.config = {
      apiKey: config.apiKey,
      serverUrl: config.serverUrl || 'http://localhost:3000',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      enableCaching: config.enableCaching !== false,
      cacheTtl: config.cacheTtl || 300000 // 5 minutes
    };

    // Create the client
    const clientConfig: VibeCheckClientConfig = {
      baseUrl: this.config.serverUrl,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries
    };

    this.client = new VibeCheckClient(clientConfig);
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing VibeCheck service');

      // Check if the server is healthy
      const isHealthy = await this.client.checkHealth();

      if (!isHealthy) {
        throw new Error('VibeCheck server is not healthy');
      }

      this.initialized = true;
      this.logger.info('VibeCheck service initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize VibeCheck service: ${error}`);
      throw new Error(`Failed to initialize VibeCheck service: ${error}`);
    }
  }

  /**
   * Ensure the service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('VibeCheck service is not initialized');
    }
  }

  /**
   * Generate a cache key for the given parameters
   * @param operation The operation name
   * @param params The operation parameters
   * @returns A cache key
   */
  private generateCacheKey(operation: string, params: any): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  /**
   * Get a result from the cache
   * @param operation The operation name
   * @param params The operation parameters
   * @returns The cached result, or undefined if not found or expired
   */
  private getCachedResult(operation: string, params: any): VibeResult | undefined {
    if (!this.config.enableCaching) {
      return undefined;
    }

    const key = this.generateCacheKey(operation, params);
    const cached = this.cache.get(key);

    if (!cached) {
      return undefined;
    }

    // Check if the cache entry has expired
    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheTtl!) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.result;
  }

  /**
   * Store a result in the cache
   * @param operation The operation name
   * @param params The operation parameters
   * @param result The result to cache
   */
  private cacheResult(operation: string, params: any, result: VibeResult): void {
    if (!this.config.enableCaching) {
      return;
    }

    const key = this.generateCacheKey(operation, params);
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Perform a vibe_check operation
   * @param params Parameters for vibe_check
   * @returns The vibe_check result
   */
  async check(params: VibeCheckParams): Promise<VibeResult> {
    this.ensureInitialized();
    this.logger.info(`Performing vibe_check with phase: ${params.phase}`);

    // Check cache first
    const cachedResult = this.getCachedResult('check', params);
    if (cachedResult) {
      this.logger.info('Using cached vibe_check result');
      return cachedResult;
    }

    try {
      // Call the client
      const result = await this.client.check(params);

      // Cache the result
      if (result.success) {
        this.cacheResult('check', params, result);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in vibe_check: ${error}`);
      return {
        success: false,
        response: '',
        error: `${error}`
      };
    }
  }

  /**
   * Perform a vibe_distill operation
   * @param params Parameters for vibe_distill
   * @returns The vibe_distill result
   */
  async distill(params: VibeDistillParams): Promise<VibeResult> {
    this.ensureInitialized();
    this.logger.info(`Performing vibe_distill for plan: ${params.plan.substring(0, 50)}...`);

    // Check cache first
    const cachedResult = this.getCachedResult('distill', params);
    if (cachedResult) {
      this.logger.info('Using cached vibe_distill result');
      return cachedResult;
    }

    try {
      // Call the client
      const result = await this.client.distill(params);

      // Cache the result
      if (result.success) {
        this.cacheResult('distill', params, result);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in vibe_distill: ${error}`);
      return {
        success: false,
        response: '',
        error: `${error}`
      };
    }
  }

  /**
   * Perform a vibe_learn operation
   * @param params Parameters for vibe_learn
   * @returns The vibe_learn result
   */
  async learn(params: VibeLearnParams): Promise<VibeResult> {
    this.ensureInitialized();
    this.logger.info(`Performing vibe_learn for mistake: ${params.mistake}`);

    // vibe_learn should not be cached as it's a write operation

    try {
      // Call the client
      return await this.client.learn(params);
    } catch (error) {
      this.logger.error(`Error in vibe_learn: ${error}`);
      return {
        success: false,
        response: '',
        error: `${error}`
      };
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.logger.info('Clearing VibeCheck service cache');
    this.cache.clear();
  }

  /**
   * Shutdown the service
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down VibeCheck service');
    this.clearCache();
    this.initialized = false;
  }
}
