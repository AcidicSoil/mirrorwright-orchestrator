import { Logger } from '../utils/Logger';
import { AgentContract } from './AgentContract';
import { AgentAdapter, AgentInput, AgentOutput } from '../types/agent';

/**
 * Interface for agent context
 */
export interface AgentContext {
  /** Session ID for the context */
  sessionId?: string;
  
  /** Mode ID for the context */
  modeId?: string;
  
  /** Ritual ID for the context */
  ritualId?: string;
  
  /** Step ID for the context */
  stepId?: string;
  
  /** Additional context data */
  data?: Record<string, any>;
}

/**
 * Interface for agent wrappers
 * Wrappers handle connection logic and error wrapping for agents
 */
export interface AgentWrapper {
  /** Unique identifier for the agent */
  id: string;
  
  /** Agent contract for validation and transformation */
  contract: AgentContract;
  
  /**
   * Invoke the agent with input
   * @param input The input for the agent
   * @param context Optional context for the agent
   * @returns Promise resolving to the agent's output
   */
  invoke(input: any, context?: AgentContext): Promise<any>;
}

/**
 * Base implementation of the AgentWrapper interface
 */
export class BaseAgentWrapper implements AgentWrapper {
  id: string;
  contract: AgentContract;
  protected adapter: AgentAdapter;
  protected logger: Logger;
  
  /**
   * Create a new base agent wrapper
   * @param id Unique identifier for the agent
   * @param adapter The agent adapter to wrap
   * @param contract The agent contract for validation and transformation
   */
  constructor(id: string, adapter: AgentAdapter, contract: AgentContract) {
    this.id = id;
    this.adapter = adapter;
    this.contract = contract;
    this.logger = new Logger();
  }
  
  /**
   * Invoke the agent with input
   * @param input The input for the agent
   * @param context Optional context for the agent
   * @returns Promise resolving to the agent's output
   */
  async invoke(input: any, context?: AgentContext): Promise<any> {
    this.logger.info(`Invoking agent ${this.id}`);
    
    try {
      // Validate the request
      const validatedRequest = await this.contract.validateRequest(input);
      
      if (!validatedRequest.isValid) {
        this.logger.error(`Invalid request for agent ${this.id}: ${JSON.stringify(validatedRequest.errors)}`);
        throw new Error(`Invalid request for agent ${this.id}: ${JSON.stringify(validatedRequest.errors)}`);
      }
      
      // Transform the input
      const transformedInput = this.contract.transformInput(validatedRequest.payload);
      
      // Prepare the agent input
      const agentInput: AgentInput = {
        prompt: typeof transformedInput === 'string' ? transformedInput : JSON.stringify(transformedInput),
        context: context?.data,
        metadata: {
          sessionId: context?.sessionId,
          modeId: context?.modeId,
          ritualId: context?.ritualId,
          stepId: context?.stepId
        }
      };
      
      // Send to the agent
      const output: AgentOutput = await this.adapter.send(agentInput);
      
      // Transform the output
      const transformedOutput = this.contract.transformOutput(output);
      
      // Validate the response
      const validatedResponse = await this.contract.validateResponse(transformedOutput);
      
      if (!validatedResponse.isValid) {
        this.logger.error(`Invalid response from agent ${this.id}: ${JSON.stringify(validatedResponse.errors)}`);
        throw new Error(`Invalid response from agent ${this.id}: ${JSON.stringify(validatedResponse.errors)}`);
      }
      
      return validatedResponse.payload;
    } catch (error) {
      this.logger.error(`Error invoking agent ${this.id}: ${error}`);
      throw error;
    }
  }
}
