import { Logger } from '../utils/Logger';
import { AgentWrapper, AgentContext } from './AgentWrapper';
import { AgentRegistry, DefaultAgentRegistry } from './AgentRegistry';
import { MessageBus, AgentMessage, RuntimeMessageBusAdapter } from './MessageBus';
import { MessageBusType } from '../orchestrator/MessageBusFactory';

/**
 * Options for creating an agent interface layer
 */
export interface AgentInterfaceLayerOptions {
  /** The message bus to use */
  messageBus?: MessageBus;
  
  /** The agent registry to use */
  agentRegistry?: AgentRegistry;
}

/**
 * Core manager that brokers agent interactions via bus and contracts
 */
export class AgentInterfaceLayer {
  private messageBus: MessageBus;
  private agentRegistry: AgentRegistry;
  private logger: Logger;
  
  /**
   * Create a new agent interface layer
   * @param options Options for creating the agent interface layer
   */
  constructor(options: AgentInterfaceLayerOptions = {}) {
    this.messageBus = options.messageBus || new RuntimeMessageBusAdapter(MessageBusType.ADVANCED);
    this.agentRegistry = options.agentRegistry || new DefaultAgentRegistry();
    this.logger = new Logger();
  }
  
  /**
   * Send a message to an agent
   * @param agentId The ID of the agent to send to
   * @param input The input to send
   * @param context Optional context for the agent
   * @returns Promise resolving to the agent's response
   */
  async send(agentId: string, input: any, context?: AgentContext): Promise<any> {
    this.logger.info(`Sending message to agent ${agentId}`);
    
    // Get the agent
    const agent = this.agentRegistry.getAgent(agentId);
    
    if (!agent) {
      this.logger.error(`Agent with ID ${agentId} not found`);
      throw new Error(`Agent with ID ${agentId} not found`);
    }
    
    try {
      // Create a message ID
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a message
      const message: AgentMessage = {
        id: messageId,
        from: 'agent-interface',
        to: agentId,
        type: 'invoke',
        payload: input,
        metadata: {
          sessionId: context?.sessionId,
          modeId: context?.modeId,
          ritualId: context?.ritualId,
          stepId: context?.stepId
        },
        timestamp: Date.now()
      };
      
      // Emit the message
      await this.messageBus.emit(`agent:${agentId}:invoke`, message);
      
      // Invoke the agent
      const response = await agent.invoke(input, context);
      
      // Create a response message
      const responseMessage: AgentMessage = {
        id: `resp-${messageId}`,
        from: agentId,
        to: 'agent-interface',
        type: 'response',
        payload: response,
        metadata: {
          requestId: messageId,
          sessionId: context?.sessionId,
          modeId: context?.modeId,
          ritualId: context?.ritualId,
          stepId: context?.stepId
        },
        timestamp: Date.now()
      };
      
      // Emit the response message
      await this.messageBus.emit(`agent:${agentId}:response`, responseMessage);
      
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to agent ${agentId}: ${error}`);
      
      // Create an error message
      const errorMessage: AgentMessage = {
        id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        from: 'agent-interface',
        to: agentId,
        type: 'error',
        payload: { error: error.message },
        metadata: {
          sessionId: context?.sessionId,
          modeId: context?.modeId,
          ritualId: context?.ritualId,
          stepId: context?.stepId
        },
        timestamp: Date.now()
      };
      
      // Emit the error message
      await this.messageBus.emit(`agent:${agentId}:error`, errorMessage);
      
      throw error;
    }
  }
  
  /**
   * Broadcast a message to all agents
   * @param input The input to broadcast
   * @param context Optional context for the agents
   */
  async broadcast(input: any, context?: AgentContext): Promise<void> {
    this.logger.info('Broadcasting message to all agents');
    
    // Get all agents
    const agents = this.agentRegistry.getAllAgents();
    
    // Create a message ID
    const messageId = `broadcast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a message
    const message: AgentMessage = {
      id: messageId,
      from: 'agent-interface',
      to: '*',
      type: 'broadcast',
      payload: input,
      metadata: {
        sessionId: context?.sessionId,
        modeId: context?.modeId,
        ritualId: context?.ritualId,
        stepId: context?.stepId
      },
      timestamp: Date.now()
    };
    
    // Emit the message
    await this.messageBus.emit('agent:broadcast', message);
    
    // Send to each agent
    for (const agent of agents) {
      try {
        await agent.invoke(input, context);
      } catch (error) {
        this.logger.error(`Error broadcasting to agent ${agent.id}: ${error}`);
        // Continue with other agents
      }
    }
  }
  
  /**
   * Register an agent with the interface layer
   * @param agent The agent to register
   */
  registerAgent(agent: AgentWrapper): void {
    this.logger.info(`Registering agent: ${agent.id}`);
    this.agentRegistry.registerAgent(agent);
  }
  
  /**
   * Unregister an agent from the interface layer
   * @param agentId The ID of the agent to unregister
   */
  unregisterAgent(agentId: string): void {
    this.logger.info(`Unregistering agent: ${agentId}`);
    this.agentRegistry.unregisterAgent(agentId);
  }
  
  /**
   * Get the agent registry
   * @returns The agent registry
   */
  getAgentRegistry(): AgentRegistry {
    return this.agentRegistry;
  }
  
  /**
   * Get the message bus
   * @returns The message bus
   */
  getMessageBus(): MessageBus {
    return this.messageBus;
  }
}
