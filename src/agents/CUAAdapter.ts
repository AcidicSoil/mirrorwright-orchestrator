import { AgentAdapter, AgentConfig, AgentInput, AgentOutput } from '../types/agent';
import { CUActionRequest, CUActionResponse, CUActionStatus } from '../types/cuaction';
import { LangGraphNode } from '../types/langgraph';
import { Logger } from '../utils/Logger';

/**
 * Configuration for the CUA agent
 */
export interface CUAAgentConfig extends AgentConfig {
  /**
   * Path to the langgraph-cua-py executable
   */
  cuaPyPath?: string;

  /**
   * Whether to run in dry-run mode by default
   */
  dryRunDefault?: boolean;

  /**
   * Maximum timeout for CUA actions in milliseconds
   */
  maxTimeout?: number;

  /**
   * Allowed file paths (for security)
   */
  allowedPaths?: string[];

  /**
   * Allowed commands (for security)
   */
  allowedCommands?: string[];
}

/**
 * LangGraph node for CUA actions
 */
class CUALangGraphNode implements LangGraphNode<CUActionRequest, CUActionResponse> {
  private logger: Logger;
  private config: CUAAgentConfig;

  constructor(config: CUAAgentConfig) {
    this.config = config;
    this.logger = new Logger();
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing CUA LangGraph node');
    // TODO: Initialize langgraph-cua-py
  }

  async process(input: CUActionRequest): Promise<CUActionResponse> {
    this.logger.info(`Processing CUA action: ${input.action_type}`);

    // Apply dry run setting from config if not specified in request
    const dryRun = input.dry_run ?? this.config.dryRunDefault ?? false;

    if (dryRun) {
      this.logger.info('Dry run mode - validating but not executing');
      return {
        result: 'Dry run - action validated but not executed',
        status: CUActionStatus.SUCCESS,
        metadata: {
          dryRun: true,
          timestamp: new Date().toISOString()
        }
      };
    }

    // TODO: Implement actual CUA action execution using langgraph-cua-py
    // This is a placeholder implementation
    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        result: `Executed ${input.action_type} successfully`,
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error(`Error executing CUA action: ${error}`);
      return {
        result: `Error: ${error instanceof Error ? error.message : String(error)}`,
        status: CUActionStatus.ERROR,
        metadata: {
          error: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up CUA LangGraph node');
    // TODO: Clean up langgraph-cua-py resources
  }
}

/**
 * Adapter for the Computer Use Agent (CUA)
 */
export class CUAAdapter implements AgentAdapter {
  private logger: Logger;
  private config: CUAAgentConfig;
  private langGraphNode: CUALangGraphNode;

  constructor(config: CUAAgentConfig) {
    this.config = config;
    this.logger = new Logger();
    this.langGraphNode = new CUALangGraphNode(config);
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing CUA adapter');
    await this.langGraphNode.initialize();
  }

  async send(input: AgentInput): Promise<AgentOutput> {
    this.logger.info('CUA adapter received input');

    try {
      // Parse the input as a CUActionRequest
      const cuaRequest = this.parseCUARequest(input);

      // Process the request through the LangGraph node
      const cuaResponse = await this.langGraphNode.process(cuaRequest);

      // Convert the response to AgentOutput
      return {
        content: JSON.stringify(cuaResponse),
        metadata: {
          cuaAction: cuaRequest.action_type,
          status: cuaResponse.status,
          ...cuaResponse.metadata
        }
      };
    } catch (error) {
      this.logger.error(`Error in CUA adapter: ${error}`);
      return {
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          error: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down CUA adapter');
    await this.langGraphNode.cleanup();
  }

  /**
   * Parse AgentInput into a CUActionRequest
   * @param input Agent input
   * @returns CUA action request
   */
  private parseCUARequest(input: AgentInput): CUActionRequest {
    // If the input already contains a parsed CUActionRequest, use it
    if (input.context?.cuaRequest) {
      return input.context.cuaRequest as CUActionRequest;
    }

    // Otherwise, try to parse the prompt as a CUActionRequest
    try {
      // Check if the prompt is a JSON string
      if (input.prompt.trim().startsWith('{')) {
        return JSON.parse(input.prompt) as CUActionRequest;
      }

      // TODO: Implement natural language parsing to extract CUActionRequest
      // This would require integration with an LLM to parse natural language into structured requests

      throw new Error('Unable to parse input as CUActionRequest');
    } catch (error) {
      throw new Error(`Failed to parse CUA request: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
