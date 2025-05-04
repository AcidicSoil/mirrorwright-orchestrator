import { Logger } from '../utils/Logger';
import { AgentWrapper } from './AgentWrapper';

/**
 * Interface for the agent registry
 */
export interface AgentRegistry {
  /**
   * Register an agent with the registry
   * @param agent The agent to register
   */
  registerAgent(agent: AgentWrapper): void;
  
  /**
   * Unregister an agent from the registry
   * @param agentId The ID of the agent to unregister
   */
  unregisterAgent(agentId: string): void;
  
  /**
   * Get an agent by its ID
   * @param agentId The ID of the agent to retrieve
   * @returns The agent, or undefined if not found
   */
  getAgent(agentId: string): AgentWrapper | undefined;
  
  /**
   * Get all registered agents
   * @returns Array of all registered agents
   */
  getAllAgents(): AgentWrapper[];
  
  /**
   * Find agents by capability
   * @param capability The capability to search for
   * @returns Array of agents with the specified capability
   */
  findAgentsByCapability(capability: string): AgentWrapper[];
}

/**
 * Implementation of the AgentRegistry interface
 */
export class DefaultAgentRegistry implements AgentRegistry {
  private agents: Map<string, AgentWrapper> = new Map();
  private logger: Logger;
  
  /**
   * Create a new default agent registry
   */
  constructor() {
    this.logger = new Logger();
  }
  
  /**
   * Register an agent with the registry
   * @param agent The agent to register
   */
  registerAgent(agent: AgentWrapper): void {
    if (this.agents.has(agent.id)) {
      this.logger.error(`Agent with ID ${agent.id} is already registered`);
      throw new Error(`Agent with ID ${agent.id} is already registered`);
    }
    
    this.agents.set(agent.id, agent);
    this.logger.info(`Registered agent: ${agent.id}`);
  }
  
  /**
   * Unregister an agent from the registry
   * @param agentId The ID of the agent to unregister
   */
  unregisterAgent(agentId: string): void {
    if (!this.agents.has(agentId)) {
      this.logger.error(`Agent with ID ${agentId} is not registered`);
      throw new Error(`Agent with ID ${agentId} is not registered`);
    }
    
    this.agents.delete(agentId);
    this.logger.info(`Unregistered agent: ${agentId}`);
  }
  
  /**
   * Get an agent by its ID
   * @param agentId The ID of the agent to retrieve
   * @returns The agent, or undefined if not found
   */
  getAgent(agentId: string): AgentWrapper | undefined {
    return this.agents.get(agentId);
  }
  
  /**
   * Get all registered agents
   * @returns Array of all registered agents
   */
  getAllAgents(): AgentWrapper[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Find agents by capability
   * @param capability The capability to search for
   * @returns Array of agents with the specified capability
   */
  findAgentsByCapability(capability: string): AgentWrapper[] {
    // This is a placeholder implementation since AgentWrapper doesn't have capabilities
    // In a real implementation, you would check agent capabilities
    return this.getAllAgents();
  }
}
