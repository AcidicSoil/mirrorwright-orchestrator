import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '../utils/Logger';
import { VibeCheckParams, VibeDistillParams, VibeLearnParams, VibeResult } from '../services/VibeCheckService';

/**
 * Configuration options for the VibeCheck client
 */
export interface VibeCheckClientConfig {
  /**
   * Base URL for the vibe-check-mcp-server
   * @default 'http://localhost:3000'
   */
  baseUrl?: string;

  /**
   * API key for authentication
   */
  apiKey?: string;

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
   * Delay between retry attempts in milliseconds
   * @default 1000 (1 second)
   */
  retryDelay?: number;
}

/**
 * Client for interacting with the vibe-check-mcp-server
 */
export class VibeCheckClient {
  private client: AxiosInstance;
  private logger: Logger;
  private config: Required<VibeCheckClientConfig>;

  /**
   * Create a new VibeCheck client
   * @param config Configuration options
   */
  constructor(config: VibeCheckClientConfig = {}) {
    this.logger = new Logger();
    
    // Set default configuration values
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3000',
      apiKey: config.apiKey || '',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000
    };

    // Create axios instance
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {})
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use((config) => {
      this.logger.info(`Sending request to ${config.url}`);
      return config;
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        this.logger.info(`Received response from ${response.config.url} with status ${response.status}`);
        return response;
      },
      (error) => {
        if (error.response) {
          this.logger.error(`Request failed with status ${error.response.status}: ${error.message}`);
        } else if (error.request) {
          this.logger.error(`No response received: ${error.message}`);
        } else {
          this.logger.error(`Request setup failed: ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a request to the vibe-check-mcp-server with retry logic
   * @param config Request configuration
   * @returns Promise resolving to the response
   */
  private async makeRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await this.client.request<T>(config);
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * attempt;
          this.logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('Request failed after multiple attempts');
  }

  /**
   * Check the health of the vibe-check-mcp-server
   * @returns Promise resolving to true if the server is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ status: string }>({
        method: 'GET',
        url: '/health'
      });
      
      return response.data.status === 'ok';
    } catch (error) {
      this.logger.error(`Health check failed: ${error}`);
      return false;
    }
  }

  /**
   * Perform a vibe_check operation
   * @param params Parameters for vibe_check
   * @returns Promise resolving to the vibe_check result
   */
  async check(params: VibeCheckParams): Promise<VibeResult> {
    try {
      const response = await this.makeRequest<VibeResult>({
        method: 'POST',
        url: '/api/vibe_check',
        data: params
      });
      
      return response.data;
    } catch (error) {
      this.logger.error(`vibe_check failed: ${error}`);
      return {
        success: false,
        response: '',
        error: `vibe_check request failed: ${error}`
      };
    }
  }

  /**
   * Perform a vibe_distill operation
   * @param params Parameters for vibe_distill
   * @returns Promise resolving to the vibe_distill result
   */
  async distill(params: VibeDistillParams): Promise<VibeResult> {
    try {
      const response = await this.makeRequest<VibeResult>({
        method: 'POST',
        url: '/api/vibe_distill',
        data: params
      });
      
      return response.data;
    } catch (error) {
      this.logger.error(`vibe_distill failed: ${error}`);
      return {
        success: false,
        response: '',
        error: `vibe_distill request failed: ${error}`
      };
    }
  }

  /**
   * Perform a vibe_learn operation
   * @param params Parameters for vibe_learn
   * @returns Promise resolving to the vibe_learn result
   */
  async learn(params: VibeLearnParams): Promise<VibeResult> {
    try {
      const response = await this.makeRequest<VibeResult>({
        method: 'POST',
        url: '/api/vibe_learn',
        data: params
      });
      
      return response.data;
    } catch (error) {
      this.logger.error(`vibe_learn failed: ${error}`);
      return {
        success: false,
        response: '',
        error: `vibe_learn request failed: ${error}`
      };
    }
  }
}
