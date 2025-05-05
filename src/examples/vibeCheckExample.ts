import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { Logger } from '../utils/Logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Example of using the VibeCheck agent
 */
export async function runVibeCheckExample(): Promise<void> {
  const logger = new Logger();
  logger.info('Starting VibeCheck example');
  
  // Create the runtime container
  const container = createRuntimeContainer();
  
  // Create the VibeCheck agent
  const vibeCheckConfig: AgentConfig = {
    type: AgentType.vibecheck,
    options: {
      apiKey: process.env.GEMINI_API_KEY || 'test-api-key'
    }
  };
  
  // Create a simple agent wrapper for the VibeCheck adapter
  const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);
  
  // Create a simple agent implementation
  const vibeCheckAgent = {
    id: 'vibecheck',
    name: 'VibeCheck Agent',
    capabilities: ['vibe_check', 'vibe_distill', 'vibe_learn'],
    
    async initialize(): Promise<void> {
      logger.info('Initializing VibeCheck agent');
      await vibeCheckAdapter.initialize();
    },
    
    async start(): Promise<void> {
      logger.info('Starting VibeCheck agent');
    },
    
    async stop(): Promise<void> {
      logger.info('Stopping VibeCheck agent');
      await vibeCheckAdapter.shutdown();
    },
    
    async handleMessage(message: any): Promise<void> {
      logger.info(`VibeCheck agent handling message: ${message.id}`);
      
      // Process the message based on its type
      if (message.type === 'vibe_check') {
        const result = await vibeCheckAdapter.send({
          prompt: message.content,
          metadata: {
            toolType: 'vibe_check',
            params: {
              phase: message.phase || 'planning',
              userRequest: message.userRequest || 'Default user request',
              plan: message.plan || 'Default plan'
            }
          }
        });
        
        // Send the response back
        container.sendMessage({
          id: uuidv4(),
          type: 'vibe_check_response',
          from: 'vibecheck',
          to: message.from,
          content: result.content,
          metadata: result.metadata
        });
      } else if (message.type === 'vibe_distill') {
        const result = await vibeCheckAdapter.send({
          prompt: message.content,
          metadata: {
            toolType: 'vibe_distill',
            params: {
              plan: message.plan || 'Default plan',
              userRequest: message.userRequest || 'Default user request'
            }
          }
        });
        
        // Send the response back
        container.sendMessage({
          id: uuidv4(),
          type: 'vibe_distill_response',
          from: 'vibecheck',
          to: message.from,
          content: result.content,
          metadata: result.metadata
        });
      } else if (message.type === 'vibe_learn') {
        const result = await vibeCheckAdapter.send({
          prompt: message.content,
          metadata: {
            toolType: 'vibe_learn',
            params: {
              mistake: message.mistake || 'Default mistake',
              category: message.category || 'Other',
              solution: message.solution || 'Default solution'
            }
          }
        });
        
        // Send the response back
        container.sendMessage({
          id: uuidv4(),
          type: 'vibe_learn_response',
          from: 'vibecheck',
          to: message.from,
          content: result.content,
          metadata: result.metadata
        });
      }
    }
  };
  
  // Register the agent with the runtime container
  container.registerAgent(vibeCheckAgent);
  
  // Initialize and start the container
  await container.init();
  await container.start();
  
  // Example of sending a message to the VibeCheck agent
  logger.info('Sending a vibe_check message to the VibeCheck agent');
  await container.sendMessage({
    id: uuidv4(),
    type: 'vibe_check',
    from: 'example',
    to: 'vibecheck',
    content: 'Check my plan',
    phase: 'planning',
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.'
  });
  
  // Wait for a moment to allow the message to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Tear down the container
  await container.teardown();
  
  logger.info('VibeCheck example completed');
}
