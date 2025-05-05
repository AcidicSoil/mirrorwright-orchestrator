import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { VibeCheckUtils } from '../utils/VibeCheckUtils';
import { Logger } from '../utils/Logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Example of an AI assistant using VibeCheck in the background
 *
 * This demonstrates how VibeCheck can be used as a background layer
 * in the thought processing of an AI assistant, helping to prevent
 * tunnel vision, reduce complexity, and learn from mistakes.
 */
export async function runAiAssistantWithVibeCheck(): Promise<void> {
  const logger = new Logger();
  logger.info('Starting AI Assistant with VibeCheck example');

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
      sessionId: 'assistant-session'
    }
  };

  // Create the VibeCheck adapter
  const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);

  // Create a simple agent wrapper
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
      if (message.type === 'vibe_check' || message.type === 'vibe_distill' || message.type === 'vibe_learn') {
        const result = await vibeCheckAdapter.send({
          prompt: message.content,
          metadata: message.metadata
        });

        // Send the response back
        container.sendMessage({
          id: uuidv4(),
          type: `${message.type}_response`,
          from: 'vibecheck',
          to: message.from,
          content: result.content,
          metadata: {
            ...result.metadata,
            inResponseTo: message.id
          }
        });
      }
    }
  };

  // Register the agent with the runtime container
  container.registerAgent(vibeCheckAgent);

  // Create a simple AI assistant agent
  const assistantAgent = {
    id: 'assistant',
    name: 'AI Assistant',
    capabilities: ['answer_question', 'generate_code', 'explain_concept'],

    async initialize(): Promise<void> {
      logger.info('Initializing AI Assistant agent');
    },

    async start(): Promise<void> {
      logger.info('Starting AI Assistant agent');
    },

    async stop(): Promise<void> {
      logger.info('Stopping AI Assistant agent');
    },

    async handleMessage(message: any): Promise<void> {
      logger.info(`AI Assistant handling message: ${message.id}`);

      if (message.type === 'answer_question') {
        // Simulate the assistant's thought process
        logger.info('Assistant thinking about the question...');

        const userRequest = message.content;
        let initialPlan = '';

        // Simulate different responses based on the question
        if (userRequest.includes('website')) {
          initialPlan = `
          1. Create a comprehensive web application with React, Redux, and TypeScript
          2. Set up a Node.js backend with Express and MongoDB
          3. Implement authentication with JWT and OAuth
          4. Create a CI/CD pipeline with GitHub Actions
          5. Deploy to AWS using Terraform
          6. Set up monitoring with Prometheus and Grafana
          7. Implement a CDN for static assets
          8. Add analytics with Google Analytics
          9. Implement A/B testing with Optimizely
          10. Create a comprehensive test suite with Jest and Cypress
          `;
        } else if (userRequest.includes('algorithm')) {
          initialPlan = `
          1. Implement a complex algorithm using dynamic programming
          2. Optimize for time complexity using memoization
          3. Add parallel processing for better performance
          4. Create a visualization of the algorithm
          5. Write a research paper on the algorithm
          `;
        } else {
          initialPlan = `
          1. Research the topic extensively
          2. Create a comprehensive report
          3. Add visualizations and diagrams
          4. Include references and citations
          5. Create a presentation
          `;
        }

        logger.info('Initial plan:');
        logger.info(initialPlan);

        // Use VibeCheck to check the plan
        logger.info('Using VibeCheck to check the plan...');
        const checkResult = await VibeCheckUtils.check(
          container,
          {
            phase: 'planning',
            userRequest,
            plan: initialPlan,
            confidence: 0.8
          },
          'assistant'
        );

        logger.info('VibeCheck result:');
        logger.info(checkResult);

        // Use VibeDistill to simplify the plan if needed
        logger.info('Using VibeDistill to simplify the plan...');
        const distillResult = await VibeCheckUtils.distill(
          container,
          {
            plan: initialPlan,
            userRequest
          },
          'assistant'
        );

        logger.info('VibeDistill result:');
        logger.info(distillResult);

        // Use the simplified plan or the original plan if distillation failed
        const finalPlan = distillResult || initialPlan;

        // Simulate executing the plan
        logger.info('Executing the final plan...');

        // Simulate the assistant's response
        const response = `Here's my answer to your question: "${userRequest}"\n\n${finalPlan}`;

        // Send the response back
        container.sendMessage({
          id: uuidv4(),
          type: 'answer_question_response',
          from: 'assistant',
          to: message.from,
          content: response
        });

        // Learn from the experience
        if (initialPlan !== finalPlan) {
          logger.info('Learning from the experience...');
          await VibeCheckUtils.learn(
            container,
            {
              mistake: 'Created an overly complex plan for a simple request',
              category: 'Complex Solution Bias',
              solution: 'Simplified the plan to focus on the core requirements'
            },
            'assistant'
          );
        }
      }
    }
  };

  // Register the assistant agent with the runtime container
  container.registerAgent(assistantAgent);

  try {
    // Initialize and start the container
    await container.init();
    await container.start();

    logger.info('Container initialized and started');

    // Simulate a user asking a question
    logger.info('Simulating a user asking a question...');
    await container.sendMessage({
      id: uuidv4(),
      type: 'answer_question',
      from: 'user',
      to: 'assistant',
      content: 'How do I create a simple website?'
    });

    // Wait for a moment to allow the message to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate another question
    logger.info('Simulating another question...');
    await container.sendMessage({
      id: uuidv4(),
      type: 'answer_question',
      from: 'user',
      to: 'assistant',
      content: 'Can you explain a sorting algorithm?'
    });

    // Wait for a moment to allow the message to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    logger.error(`Error in AI Assistant with VibeCheck example: ${error}`);
  } finally {
    // Tear down the container
    await container.teardown();
    logger.info('Container torn down');
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runAiAssistantWithVibeCheck()
    .then(() => {
      console.log('AI Assistant with VibeCheck example completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error running AI Assistant with VibeCheck example: ${error}`);
      process.exit(1);
    });
}
