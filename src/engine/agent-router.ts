import { AgentAdapter, AgentConfig, AgentType } from '../types/agent';
import { RooAdapter } from '../agents';
import { Logger } from '../utils/Logger';

/**
 * Factory function to create an agent adapter based on agent type
 * @param config Configuration for the agent
 * @returns The appropriate agent adapter instance
 */
export function createAgentAdapter(config: AgentConfig): AgentAdapter {
  const logger = new Logger();
  logger.info(`Creating agent adapter for type: ${config.type}`);
  
  switch (config.type) {
    case AgentType.roo:
      return new RooAdapter(config);
      
    // Other agent types would be handled here
    // case AgentType.cline:
    //   return new ClineAdapter(config);
    // case AgentType.augment:
    //   return new AugmentAdapter(config);
      
    default:
      logger.error(`Unknown agent type: ${config.type}`);
      throw new Error(`Unknown agent type: ${config.type}`);
  }
}
