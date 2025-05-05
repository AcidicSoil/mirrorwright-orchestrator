import { AgentAdapter, AgentConfig, AgentType } from '../types/agent';
import { RooAdapter } from './RooAdapter';
import { VibeCheckAdapter } from './VibeCheckAdapter';
import { Logger } from '../utils/Logger';

/**
 * Factory for creating agent adapters
 */
export class AgentFactory {
  private static logger = new Logger();

  /**
   * Create an agent adapter
   * @param config Configuration for the agent
   * @returns A new agent adapter
   */
  static createAgent(config: AgentConfig): AgentAdapter {
    this.logger.info(`Creating agent adapter for type: ${config.type}`);
    
    switch (config.type) {
      case AgentType.roo:
        return new RooAdapter(config);
      
      case AgentType.vibecheck:
        return new VibeCheckAdapter(config);
      
      // Add other agent types as they are implemented
      // case AgentType.cline:
      //   return new ClineAdapter(config);
      // case AgentType.augment:
      //   return new AugmentAdapter(config);
      
      default:
        this.logger.error(`Unsupported agent type: ${config.type}`);
        throw new Error(`Unsupported agent type: ${config.type}`);
    }
  }
}
