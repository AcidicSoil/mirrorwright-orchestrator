import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { RuntimeAgentWrapper } from '../orchestrator/RuntimeAgentWrapper';
import { VibeCheckUtils } from '../utils/VibeCheckUtils';
import { Logger } from '../utils/Logger';

/**
 * Example of using the VibeCheckUtils
 */
export async function runVibeCheckUtilsExample(): Promise<void> {
  const logger = new Logger();
  logger.info('Starting VibeCheckUtils example');
  
  // Create the runtime container
  const container = createRuntimeContainer();
  
  // Create the VibeCheck agent
  const vibeCheckConfig: AgentConfig = {
    type: AgentType.vibecheck,
    options: {
      apiKey: process.env.GEMINI_API_KEY || 'test-api-key',
      serverUrl: 'http://localhost:3000',
      timeout: 30000,
      maxRetries: 3,
      enableCaching: true,
      cacheTtl: 300000, // 5 minutes
      sessionId: 'example-session'
    }
  };
  
  // Create the VibeCheck adapter
  const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);
  
  // Create a simple agent wrapper
  const vibeCheckAgent = new RuntimeAgentWrapper(
    'vibecheck',
    'VibeCheck Agent',
    ['vibe_check', 'vibe_distill', 'vibe_learn'],
    vibeCheckAdapter
  );
  
  // Register the agent with the runtime container
  container.registerAgent(vibeCheckAgent);
  
  try {
    // Initialize and start the container
    await container.init();
    await container.start();
    
    logger.info('Container initialized and started');
    
    // Example of using vibe_check
    logger.info('Using vibe_check');
    const checkResult = await VibeCheckUtils.check(
      container,
      {
        phase: 'planning',
        userRequest: 'Create a simple todo app',
        plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.'
      },
      'example'
    );
    
    logger.info('VibeCheck Result:');
    logger.info(checkResult);
    
    // Example of using vibe_distill
    logger.info('Using vibe_distill');
    const distillResult = await VibeCheckUtils.distill(
      container,
      {
        plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.',
        userRequest: 'Create a simple todo app'
      },
      'example'
    );
    
    logger.info('VibeDistill Result:');
    logger.info(distillResult);
    
    // Example of using vibe_learn
    logger.info('Using vibe_learn');
    const learnResult = await VibeCheckUtils.learn(
      container,
      {
        mistake: 'Implemented a complex database schema for a simple todo app',
        category: 'Complex Solution Bias',
        solution: 'Used a simpler data structure that meets the actual requirements'
      },
      'example'
    );
    
    logger.info('VibeLearn Result:');
    logger.info(learnResult);
    
    // Example of sending a command
    logger.info('Sending command');
    const commandResult = await VibeCheckUtils.sendCommand(
      container,
      'clear_cache',
      {},
      'example'
    );
    
    logger.info('Command Result:');
    logger.info(commandResult);
  } catch (error) {
    logger.error(`Error in VibeCheckUtils example: ${error}`);
  } finally {
    // Tear down the container
    await container.teardown();
    logger.info('Container torn down');
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runVibeCheckUtilsExample()
    .then(() => {
      console.log('VibeCheckUtils example completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error running VibeCheckUtils example: ${error}`);
      process.exit(1);
    });
}
