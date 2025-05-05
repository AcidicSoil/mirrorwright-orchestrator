import { AgentAdapter, AgentConfig } from '../types/agent';
import { AgentFactory } from '../agents';
import { Logger } from '../utils/Logger';

/**
 * Factory function to create an agent adapter based on agent type
 * @param config Configuration for the agent
 * @returns The appropriate agent adapter instance
 */
export function createAgentAdapter(config: AgentConfig): AgentAdapter {
  const logger = new Logger();
  logger.info(`Creating agent adapter for type: ${config.type}`);

  try {
    return AgentFactory.createAgent(config);
  } catch (error) {
    logger.error(`Failed to create agent adapter: ${error}`);
    throw error;
  }
}
