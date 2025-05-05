import { AgentAdapter, AgentConfig, AgentInput, AgentOutput } from '../types/agent';
import {
  VibeCheckService,
  VibeCheckParams,
  VibeDistillParams,
  VibeLearnParams,
  VibeCheckServiceConfig
} from '../services/VibeCheckService';
import { Logger } from '../utils/Logger';

/**
 * Configuration options for the VibeCheck adapter
 */
export interface VibeCheckAdapterConfig {
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

  /**
   * Session ID for state management
   */
  sessionId?: string;
}

/**
 * Adapter for the VibeCheck agent
 * VibeCheck provides metacognitive oversight capabilities
 */
export class VibeCheckAdapter implements AgentAdapter {
  private config: AgentConfig;
  private logger: Logger;
  private service: VibeCheckService;
  private sessionId?: string;

  /**
   * Create a new VibeCheckAdapter
   * @param config Configuration for the VibeCheck agent
   */
  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = new Logger();

    // Extract VibeCheck-specific configuration
    const adapterConfig = config.options as VibeCheckAdapterConfig || {};

    // Create service configuration
    const serviceConfig: VibeCheckServiceConfig = {
      apiKey: adapterConfig.apiKey,
      serverUrl: adapterConfig.serverUrl,
      timeout: adapterConfig.timeout,
      maxRetries: adapterConfig.maxRetries,
      enableCaching: adapterConfig.enableCaching,
      cacheTtl: adapterConfig.cacheTtl
    };

    this.service = new VibeCheckService(serviceConfig);
    this.sessionId = adapterConfig.sessionId;
  }

  /**
   * Initialize the VibeCheck agent
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing VibeCheck agent');
    await this.service.initialize();
  }

  /**
   * Send input to the VibeCheck agent and get a response
   * @param input The input data for the agent
   * @returns Promise resolving to the agent's output
   */
  async send(input: AgentInput): Promise<AgentOutput> {
    this.logger.info(`Sending input to VibeCheck agent: ${input.prompt.substring(0, 50)}...`);

    // Update session ID if provided in the input
    if (input.metadata?.sessionId) {
      this.sessionId = input.metadata.sessionId;
      this.logger.info(`Updated session ID to ${this.sessionId}`);
    }

    // Check if this is a tool call
    if (input.metadata?.toolType) {
      return this.handleToolCall(input);
    }

    // Check if this is a command
    if (input.metadata?.command) {
      return this.handleCommand(input);
    }

    // Try to infer the tool type from the prompt
    const inferredToolType = this.inferToolType(input.prompt);
    if (inferredToolType) {
      this.logger.info(`Inferred tool type: ${inferredToolType}`);

      // Create a new input with the inferred tool type
      const toolInput: AgentInput = {
        ...input,
        metadata: {
          ...input.metadata,
          toolType: inferredToolType,
          params: this.extractToolParams(inferredToolType, input.prompt, input.context)
        }
      };

      return this.handleToolCall(toolInput);
    }

    // Default behavior for regular prompts
    return {
      content: `VibeCheck received: ${input.prompt}\n\nTo use VibeCheck tools, try one of the following:\n- vibe_check: Metacognitive questioning to break tunnel vision\n- vibe_distill: Simplify complex plans\n- vibe_learn: Record mistakes and solutions for learning`,
      metadata: {
        agent: 'vibecheck',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Infer the tool type from the prompt
   * @param prompt The prompt to analyze
   * @returns The inferred tool type, or undefined if none could be inferred
   */
  private inferToolType(prompt: string): string | undefined {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('vibe_check') || lowerPrompt.includes('check') ||
        lowerPrompt.includes('metacognitive') || lowerPrompt.includes('tunnel vision')) {
      return 'vibe_check';
    }

    if (lowerPrompt.includes('vibe_distill') || lowerPrompt.includes('distill') ||
        lowerPrompt.includes('simplify') || lowerPrompt.includes('reduce complexity')) {
      return 'vibe_distill';
    }

    if (lowerPrompt.includes('vibe_learn') || lowerPrompt.includes('learn') ||
        lowerPrompt.includes('mistake') || lowerPrompt.includes('solution')) {
      return 'vibe_learn';
    }

    return undefined;
  }

  /**
   * Extract tool parameters from the prompt
   * @param toolType The tool type
   * @param prompt The prompt to extract parameters from
   * @param context Additional context
   * @returns The extracted parameters
   */
  private extractToolParams(toolType: string, prompt: string, context?: Record<string, any>): any {
    switch (toolType) {
      case 'vibe_check':
        return this.extractVibeCheckParams(prompt, context);

      case 'vibe_distill':
        return this.extractVibeDistillParams(prompt, context);

      case 'vibe_learn':
        return this.extractVibeLearnParams(prompt, context);

      default:
        return {};
    }
  }

  /**
   * Extract vibe_check parameters from the prompt
   * @param prompt The prompt to extract parameters from
   * @param context Additional context
   * @returns The extracted parameters
   */
  private extractVibeCheckParams(prompt: string, context?: Record<string, any>): VibeCheckParams {
    // Default values
    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: '',
      plan: prompt,
      sessionId: this.sessionId
    };

    // Try to extract phase
    if (prompt.toLowerCase().includes('planning')) {
      params.phase = 'planning';
    } else if (prompt.toLowerCase().includes('review')) {
      params.phase = 'review';
    }

    // Try to extract user request
    const userRequestMatch = prompt.match(/user request[:\s]+["']?([^"'\n]+)["']?/i);
    if (userRequestMatch && userRequestMatch[1]) {
      params.userRequest = userRequestMatch[1].trim();
    } else if (context?.userRequest) {
      params.userRequest = context.userRequest;
    } else {
      params.userRequest = 'Unknown user request';
    }

    // Use context if available
    if (context?.phase) {
      params.phase = context.phase;
    }
    if (context?.plan) {
      params.plan = context.plan;
    }
    if (context?.confidence) {
      params.confidence = context.confidence;
    }
    if (context?.thinkingLog) {
      params.thinkingLog = context.thinkingLog;
    }
    if (context?.previousAdvice) {
      params.previousAdvice = context.previousAdvice;
    }
    if (context?.focusAreas) {
      params.focusAreas = context.focusAreas;
    }
    if (context?.availableTools) {
      params.availableTools = context.availableTools;
    }

    return params;
  }

  /**
   * Extract vibe_distill parameters from the prompt
   * @param prompt The prompt to extract parameters from
   * @param context Additional context
   * @returns The extracted parameters
   */
  private extractVibeDistillParams(prompt: string, context?: Record<string, any>): VibeDistillParams {
    // Default values
    const params: VibeDistillParams = {
      plan: prompt,
      userRequest: '',
      sessionId: this.sessionId
    };

    // Try to extract user request
    const userRequestMatch = prompt.match(/user request[:\s]+["']?([^"'\n]+)["']?/i);
    if (userRequestMatch && userRequestMatch[1]) {
      params.userRequest = userRequestMatch[1].trim();
    } else if (context?.userRequest) {
      params.userRequest = context.userRequest;
    } else {
      params.userRequest = 'Unknown user request';
    }

    // Use context if available
    if (context?.plan) {
      params.plan = context.plan;
    }

    return params;
  }

  /**
   * Extract vibe_learn parameters from the prompt
   * @param prompt The prompt to extract parameters from
   * @param context Additional context
   * @returns The extracted parameters
   */
  private extractVibeLearnParams(prompt: string, context?: Record<string, any>): VibeLearnParams {
    // Default values
    const params: VibeLearnParams = {
      mistake: '',
      category: 'Other',
      solution: '',
      sessionId: this.sessionId
    };

    // Try to extract mistake
    const mistakeMatch = prompt.match(/mistake[:\s]+["']?([^"'\n]+)["']?/i);
    if (mistakeMatch && mistakeMatch[1]) {
      params.mistake = mistakeMatch[1].trim();
    } else {
      params.mistake = prompt;
    }

    // Try to extract category
    const categoryMatch = prompt.match(/category[:\s]+["']?([^"'\n]+)["']?/i);
    if (categoryMatch && categoryMatch[1]) {
      const category = categoryMatch[1].trim();
      if (category.includes('Complex') || category.includes('complex')) {
        params.category = 'Complex Solution Bias';
      } else if (category.includes('Feature') || category.includes('feature')) {
        params.category = 'Feature Creep';
      } else if (category.includes('Premature') || category.includes('premature')) {
        params.category = 'Premature Implementation';
      } else if (category.includes('Misalign') || category.includes('misalign')) {
        params.category = 'Misalignment';
      } else if (category.includes('Overtool') || category.includes('overtool')) {
        params.category = 'Overtooling';
      } else {
        params.category = 'Other';
      }
    }

    // Try to extract solution
    const solutionMatch = prompt.match(/solution[:\s]+["']?([^"'\n]+)["']?/i);
    if (solutionMatch && solutionMatch[1]) {
      params.solution = solutionMatch[1].trim();
    } else {
      params.solution = 'No solution provided';
    }

    // Use context if available
    if (context?.mistake) {
      params.mistake = context.mistake;
    }
    if (context?.category) {
      params.category = context.category;
    }
    if (context?.solution) {
      params.solution = context.solution;
    }

    return params;
  }

  /**
   * Handle a command
   * @param input The input data for the command
   * @returns Promise resolving to the command's output
   */
  private async handleCommand(input: AgentInput): Promise<AgentOutput> {
    const command = input.metadata?.command;

    switch (command) {
      case 'clear_cache':
        this.service.clearCache();
        return {
          content: 'Cache cleared successfully',
          metadata: {
            agent: 'vibecheck',
            command,
            success: true,
            timestamp: new Date().toISOString()
          }
        };

      case 'set_session':
        const sessionId = input.metadata?.sessionId;
        if (sessionId) {
          this.sessionId = sessionId;
          return {
            content: `Session ID set to ${sessionId}`,
            metadata: {
              agent: 'vibecheck',
              command,
              success: true,
              sessionId,
              timestamp: new Date().toISOString()
            }
          };
        } else {
          return {
            content: 'Error: No session ID provided',
            metadata: {
              agent: 'vibecheck',
              command,
              success: false,
              error: 'No session ID provided',
              timestamp: new Date().toISOString()
            }
          };
        }

      case 'get_status':
        return {
          content: `VibeCheck agent status:\nInitialized: ${this.initialized}\nSession ID: ${this.sessionId || 'None'}`,
          metadata: {
            agent: 'vibecheck',
            command,
            success: true,
            initialized: this.initialized,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
          }
        };

      default:
        return {
          content: `Unknown command: ${command}`,
          metadata: {
            agent: 'vibecheck',
            command,
            success: false,
            error: `Unknown command: ${command}`,
            timestamp: new Date().toISOString()
          }
        };
    }
  }

  /**
   * Handle a tool call
   * @param input The input data for the tool call
   * @returns Promise resolving to the tool's output
   */
  private async handleToolCall(input: AgentInput): Promise<AgentOutput> {
    const toolType = input.metadata?.toolType;
    const params = input.metadata?.params || {};

    switch (toolType) {
      case 'vibe_check':
        return this.handleVibeCheck(params as VibeCheckParams);

      case 'vibe_distill':
        return this.handleVibeDistill(params as VibeDistillParams);

      case 'vibe_learn':
        return this.handleVibeLearn(params as VibeLearnParams);

      default:
        this.logger.error(`Unknown tool type: ${toolType}`);
        return {
          content: `Error: Unknown tool type: ${toolType}`,
          metadata: {
            agent: 'vibecheck',
            error: true,
            timestamp: new Date().toISOString()
          }
        };
    }
  }

  /**
   * Handle a vibe_check tool call
   * @param params Parameters for vibe_check
   * @returns Promise resolving to the tool's output
   */
  private async handleVibeCheck(params: VibeCheckParams): Promise<AgentOutput> {
    try {
      // Add session ID if available
      const sessionParams: VibeCheckParams = {
        ...params,
        sessionId: params.sessionId || this.sessionId
      };

      // Start timing for metrics
      const startTime = Date.now();

      // Call the service
      const result = await this.service.check(sessionParams);

      // Calculate duration for metrics
      const duration = Date.now() - startTime;

      // Log metrics
      this.logger.info(`vibe_check completed in ${duration}ms with success=${result.success}`);

      // Return the result
      return {
        content: result.response,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_check',
          success: result.success,
          error: result.error,
          duration,
          sessionId: sessionParams.sessionId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error(`Error in vibe_check: ${error}`);
      return {
        content: `Error in vibe_check: ${error}`,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_check',
          success: false,
          error: `${error}`,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Handle a vibe_distill tool call
   * @param params Parameters for vibe_distill
   * @returns Promise resolving to the tool's output
   */
  private async handleVibeDistill(params: VibeDistillParams): Promise<AgentOutput> {
    try {
      // Add session ID if available
      const sessionParams: VibeDistillParams = {
        ...params,
        sessionId: params.sessionId || this.sessionId
      };

      // Start timing for metrics
      const startTime = Date.now();

      // Call the service
      const result = await this.service.distill(sessionParams);

      // Calculate duration for metrics
      const duration = Date.now() - startTime;

      // Log metrics
      this.logger.info(`vibe_distill completed in ${duration}ms with success=${result.success}`);

      // Return the result
      return {
        content: result.response,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_distill',
          success: result.success,
          error: result.error,
          duration,
          sessionId: sessionParams.sessionId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error(`Error in vibe_distill: ${error}`);
      return {
        content: `Error in vibe_distill: ${error}`,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_distill',
          success: false,
          error: `${error}`,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Handle a vibe_learn tool call
   * @param params Parameters for vibe_learn
   * @returns Promise resolving to the tool's output
   */
  private async handleVibeLearn(params: VibeLearnParams): Promise<AgentOutput> {
    try {
      // Add session ID if available
      const sessionParams: VibeLearnParams = {
        ...params,
        sessionId: params.sessionId || this.sessionId
      };

      // Start timing for metrics
      const startTime = Date.now();

      // Call the service
      const result = await this.service.learn(sessionParams);

      // Calculate duration for metrics
      const duration = Date.now() - startTime;

      // Log metrics
      this.logger.info(`vibe_learn completed in ${duration}ms with success=${result.success}`);

      // Return the result
      return {
        content: result.response,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_learn',
          success: result.success,
          error: result.error,
          duration,
          sessionId: sessionParams.sessionId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error(`Error in vibe_learn: ${error}`);
      return {
        content: `Error in vibe_learn: ${error}`,
        metadata: {
          agent: 'vibecheck',
          toolType: 'vibe_learn',
          success: false,
          error: `${error}`,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Shutdown the VibeCheck agent
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down VibeCheck agent');

    try {
      // Clear any session data
      this.sessionId = undefined;

      // Shutdown the service
      await this.service.shutdown();

      this.logger.info('VibeCheck agent shutdown complete');
    } catch (error) {
      this.logger.error(`Error during VibeCheck agent shutdown: ${error}`);
      throw new Error(`Error during VibeCheck agent shutdown: ${error}`);
    }
  }

  /**
   * Get the initialized state of the agent
   * @returns Whether the agent is initialized
   */
  get initialized(): boolean {
    return this.service !== undefined;
  }
}
