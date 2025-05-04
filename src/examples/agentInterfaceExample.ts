import { Logger } from '../utils/Logger';
import { 
  AgentInterfaceLayer, 
  BaseAgentWrapper, 
  BaseAgentContract 
} from '../agent-interface';
import { AgentAdapter, AgentInput, AgentOutput, AgentType, AgentConfig } from '../types/agent';

/**
 * Example implementation of an AgentAdapter
 */
class ExampleAgentAdapter implements AgentAdapter {
  private logger: Logger;
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.logger = new Logger();
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    this.logger.info('Initializing example agent adapter');
  }
  
  async send(input: AgentInput): Promise<AgentOutput> {
    this.logger.info(`Sending input to example agent: ${input.prompt.substring(0, 50)}...`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      content: `Response from ${this.config.type} agent: ${input.prompt}`,
      metadata: {
        generatedAt: new Date().toISOString(),
        agent: this.config.type
      }
    };
  }
  
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down example agent adapter');
  }
}

/**
 * Run the agent interface example
 */
export async function runAgentInterfaceExample(): Promise<void> {
  const logger = new Logger();
  logger.info('Starting agent interface example');
  
  // Create the agent interface layer
  const agentInterface = new AgentInterfaceLayer();
  
  // Create agent adapters
  const clineAdapter = new ExampleAgentAdapter({ type: AgentType.cline });
  const augmentAdapter = new ExampleAgentAdapter({ type: AgentType.augment });
  
  // Create agent contracts
  const clineContract = new BaseAgentContract();
  const augmentContract = new BaseAgentContract();
  
  // Create agent wrappers
  const clineWrapper = new BaseAgentWrapper('cline-agent', clineAdapter, clineContract);
  const augmentWrapper = new BaseAgentWrapper('augment-agent', augmentAdapter, augmentContract);
  
  // Register agents
  agentInterface.registerAgent(clineWrapper);
  agentInterface.registerAgent(augmentWrapper);
  
  // Send messages to agents
  try {
    logger.info('Sending message to cline agent');
    const clineResponse = await agentInterface.send('cline-agent', 'Hello from the agent interface!', {
      sessionId: 'example-session',
      modeId: 'example-mode',
      ritualId: 'example-ritual',
      stepId: 'example-step'
    });
    
    logger.info(`Received response from cline agent: ${JSON.stringify(clineResponse)}`);
    
    logger.info('Sending message to augment agent');
    const augmentResponse = await agentInterface.send('augment-agent', 'Hello from the agent interface!', {
      sessionId: 'example-session',
      modeId: 'example-mode',
      ritualId: 'example-ritual',
      stepId: 'example-step'
    });
    
    logger.info(`Received response from augment agent: ${JSON.stringify(augmentResponse)}`);
    
    logger.info('Broadcasting message to all agents');
    await agentInterface.broadcast('Broadcast message from the agent interface!', {
      sessionId: 'example-session',
      modeId: 'example-mode',
      ritualId: 'example-ritual',
      stepId: 'example-step'
    });
  } catch (error) {
    logger.error(`Error in agent interface example: ${error}`);
  }
  
  logger.info('Agent interface example completed');
}

// Run the example if this file is executed directly
if (require.main === module) {
  runAgentInterfaceExample().catch(error => {
    console.error('Error running agent interface example:', error);
  });
}
