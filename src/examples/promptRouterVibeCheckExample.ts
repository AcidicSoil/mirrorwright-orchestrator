/**
 * Example of using the PromptRouterService with VibeCheck
 */

import { createRuntimeContainer, Message } from '../orchestrator/runtime';
import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { v4 as uuidv4 } from 'uuid';
import { VibeCheckAdapter } from '../agents/VibeCheckAdapter';
import { PromptRouterService, createPromptRouterService } from '../services/PromptRouterService';
import { Logger } from '../utils/Logger';

/**
 * Run the example
 */
async function runPromptRouterVibeCheckExample() {
  const logger = new Logger();
  logger.info('Starting PromptRouter VibeCheck example');

  // Create the runtime container
  const container = createRuntimeContainer();

  // Create the PromptRouterService
  const promptRouterService = createPromptRouterService();

  // Create the VibeCheck agent
  const vibeCheckConfig: AgentConfig = {
    type: AgentType.vibecheck,
    options: {
      apiKey: process.env.GEMINI_API_KEY,
      serverUrl: 'http://localhost:3000',
      timeout: 30000,
      maxRetries: 3,
      enableCaching: true,
      sessionId: 'example-session'
    }
  };

  const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);

  // Create a mock agent that will use the VibeCheck agent
  const mockAgent = {
    id: 'mock',
    name: 'Mock Agent',
    capabilities: ['*'],

    async initialize() {
      logger.info('Initializing Mock Agent');
    },

    async start() {
      logger.info('Starting Mock Agent');
    },

    async stop() {
      logger.info('Stopping Mock Agent');
    },

    async handleMessage(message: Message) {
      logger.info(`Mock Agent handling message: ${message.id}`);

      // If the message is a response from VibeCheck, log it
      if (message.from === 'vibecheck' && message.type.endsWith('_response')) {
        logger.info(`Received response from VibeCheck: ${message.content}`);
        return;
      }

      // Check if the message should be routed to VibeCheck
      if (promptRouterService.shouldRouteToVibeCheck(message)) {
        logger.info('Message should be routed to VibeCheck');

        // Trigger VibeCheck with the message
        const vibeCheckMessage = promptRouterService.triggerVibeCheck(message, 'mock');
        await container.sendMessage(vibeCheckMessage);
        return;
      }

      // If the message contains a plan, trigger VibeCheck with the plan
      if (message.content?.toString().includes('plan')) {
        logger.info('Message contains a plan, triggering VibeCheck');

        // Extract the plan from the message
        const plan = 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.';
        const userRequest = 'Create a simple todo app';

        // Trigger VibeCheck with the plan
        const vibeCheckMessage = promptRouterService.triggerVibeCheckWithPlan(
          plan,
          userRequest,
          'planning',
          'mock'
        );
        await container.sendMessage(vibeCheckMessage);
        return;
      }

      // If the message contains a complex plan, trigger VibeDistill
      if (message.content?.toString().includes('complex')) {
        logger.info('Message contains a complex plan, triggering VibeDistill');

        // Extract the plan from the message
        const plan = 'First, I will set up a React application with Redux, then add Material UI, then implement authentication with Firebase, then add real-time updates, then implement offline support, then add analytics, then optimize performance...';
        const userRequest = 'Create a simple todo app';

        // Trigger VibeDistill with the plan
        const vibeDistillMessage = promptRouterService.triggerVibeDistill(
          plan,
          userRequest,
          'mock'
        );
        await container.sendMessage(vibeDistillMessage);
        return;
      }

      // If the message contains a mistake, trigger VibeLearn
      if (message.content?.toString().includes('mistake')) {
        logger.info('Message contains a mistake, triggering VibeLearn');

        // Extract the mistake from the message
        const mistake = 'Added too many features at once';
        const category = 'Feature Creep';
        const solution = 'Focus on core functionality first';

        // Trigger VibeLearn with the mistake
        const vibeLearnMessage = promptRouterService.triggerVibeLearn(
          mistake,
          category,
          solution,
          'mock'
        );
        await container.sendMessage(vibeLearnMessage);
        return;
      }

      // Default response
      logger.info('No special handling for this message');
    }
  };

  // Create the VibeCheck agent
  const vibeCheckAgent = {
    id: 'vibecheck',
    name: 'VibeCheck Agent',
    capabilities: ['vibe_check', 'vibe_distill', 'vibe_learn'],

    async initialize() {
      await vibeCheckAdapter.initialize();
    },

    async start() {},

    async stop() {
      await vibeCheckAdapter.shutdown();
    },

    async handleMessage(message: Message) {
      logger.info(`VibeCheck agent handling message: ${message.id}`);

      // Process the message based on its type
      let result;

      if (message.type === 'vibe_check') {
        result = await vibeCheckAdapter.send({
          prompt: message.content?.toString() || '',
          metadata: {
            toolType: 'vibe_check',
            params: {
              phase: message.phase || 'planning',
              userRequest: message.userRequest || 'Default user request',
              plan: message.plan || 'Default plan'
            }
          }
        });
      } else if (message.type === 'vibe_distill') {
        result = await vibeCheckAdapter.send({
          prompt: message.content?.toString() || '',
          metadata: {
            toolType: 'vibe_distill',
            params: {
              userRequest: message.userRequest || 'Default user request',
              plan: message.plan || 'Default plan'
            }
          }
        });
      } else if (message.type === 'vibe_learn') {
        result = await vibeCheckAdapter.send({
          prompt: message.content?.toString() || '',
          metadata: {
            toolType: 'vibe_learn',
            params: {
              mistake: message.mistake || 'Default mistake',
              category: message.category || 'Other',
              solution: message.solution || 'Default solution'
            }
          }
        });
      } else {
        // Default to sending the message as is
        result = await vibeCheckAdapter.send({
          prompt: message.content?.toString() || '',
          context: message
        });
      }

      // Send the response back
      await container.sendMessage({
        id: uuidv4(),
        type: `${message.type}_response`,
        from: 'vibecheck',
        to: message.from,
        content: result.content,
        metadata: result.metadata
      });
    }
  };

  // Register the agents with the runtime container
  container.registerAgent(mockAgent);
  container.registerAgent(vibeCheckAgent);

  // Initialize and start the container
  await container.init();
  await container.start();

  // Example 1: Send a message with a keyword that should trigger routing to VibeCheck
  logger.info('Example 1: Sending a message with a keyword that should trigger routing to VibeCheck');
  await container.sendMessage({
    id: uuidv4(),
    type: 'text',
    from: 'example',
    to: 'mock',
    content: 'I am stuck and need help'
  });

  // Example 2: Send a message with a tag that should trigger routing to VibeCheck
  logger.info('Example 2: Sending a message with a tag that should trigger routing to VibeCheck');
  await container.sendMessage({
    id: uuidv4(),
    type: 'text',
    from: 'example',
    to: 'mock',
    content: 'Need some guidance',
    metadata: {
      tags: ['#tunnel-vision']
    }
  });

  // Example 3: Send a message with a plan that should trigger VibeCheck
  logger.info('Example 3: Sending a message with a plan that should trigger VibeCheck');
  await container.sendMessage({
    id: uuidv4(),
    type: 'text',
    from: 'example',
    to: 'mock',
    content: 'Here is my plan for the todo app'
  });

  // Example 4: Send a message with a complex plan that should trigger VibeDistill
  logger.info('Example 4: Sending a message with a complex plan that should trigger VibeDistill');
  await container.sendMessage({
    id: uuidv4(),
    type: 'text',
    from: 'example',
    to: 'mock',
    content: 'Here is my complex plan for the todo app'
  });

  // Example 5: Send a message with a mistake that should trigger VibeLearn
  logger.info('Example 5: Sending a message with a mistake that should trigger VibeLearn');
  await container.sendMessage({
    id: uuidv4(),
    type: 'text',
    from: 'example',
    to: 'mock',
    content: 'I made a mistake in my implementation'
  });

  // Wait for all messages to be processed
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Tear down the container
  await container.teardown();
}

// Run the example if this file is executed directly
if (require.main === module) {
  runPromptRouterVibeCheckExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}

export { runPromptRouterVibeCheckExample };
