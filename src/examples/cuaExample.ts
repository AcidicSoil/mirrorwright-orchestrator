import { CUAAdapter, CUAAgentConfig } from '../agents/CUAAdapter';
import { DefaultCUAIntentRouter } from '../router/CUAIntentRouter';
import { DefaultCUAMemoryManager } from '../memory/CUAMemoryManager';
import { AgentType } from '../types/agent';
import { CUActionType, CUActionStatus } from '../types/cuaction';
import { Logger } from '../utils/Logger';

/**
 * Example of using the CUA integration
 */
async function runCUAExample() {
  const logger = new Logger();
  logger.info('Starting CUA example');

  // Create the CUA adapter
  const config: CUAAgentConfig = {
    type: AgentType.augment,
    dryRunDefault: true, // Use dry run mode by default for safety
    maxTimeout: 5000,
    allowedPaths: ['.', './examples', './src'],
    allowedCommands: ['echo', 'ls', 'dir', 'npm']
  };

  const cuaAdapter = new CUAAdapter(config);
  await cuaAdapter.initialize();

  // Create the CUA intent router
  const cuaIntentRouter = new DefaultCUAIntentRouter();

  // Create the CUA memory manager
  const cuaMemoryManager = new DefaultCUAMemoryManager();

  try {
    // Example 1: Process a natural language prompt
    const prompt = 'Please read the file package.json and tell me what dependencies it has.';
    logger.info(`Processing prompt: ${prompt}`);

    // Detect if the prompt contains a CUA intent
    if (cuaIntentRouter.detectCUAIntent(prompt)) {
      logger.info('CUA intent detected');

      // Extract the CUA request
      const cuaRequest = cuaIntentRouter.extractCUARequest(prompt, 'example-agent');

      if (cuaRequest) {
        logger.info(`Extracted CUA request: ${JSON.stringify(cuaRequest)}`);

        // Send the request to the CUA adapter
        const response = await cuaAdapter.send({
          prompt: JSON.stringify(cuaRequest),
          context: { cuaRequest }
        });

        // Parse the response
        const cuaResponse = JSON.parse(response.content);
        logger.info(`CUA response: ${JSON.stringify(cuaResponse)}`);

        // Record the action in the memory manager
        await cuaMemoryManager.recordAction(cuaRequest, cuaResponse);

        // Process the response
        if (cuaResponse.status === CUActionStatus.SUCCESS) {
          logger.info('CUA action succeeded');
          logger.info(`Result: ${cuaResponse.result}`);
        } else {
          logger.error('CUA action failed');
          logger.error(`Error: ${cuaResponse.result}`);
        }
      } else {
        logger.warn('Could not extract CUA request from prompt');
      }
    } else {
      logger.info('No CUA intent detected');
    }

    // Example 2: Direct CUA request
    logger.info('Processing direct CUA request');

    const directRequest = {
      action_type: CUActionType.RUN_COMMAND,
      payload: {
        command: 'echo',
        args: ['Hello, world!']
      },
      context: {
        agent_id: 'example-agent',
        timestamp: new Date().toISOString()
      }
    };

    // Send the request to the CUA adapter
    const directResponse = await cuaAdapter.send({
      prompt: JSON.stringify(directRequest),
      context: { cuaRequest: directRequest }
    });

    // Parse the response
    const directCuaResponse = JSON.parse(directResponse.content);
    logger.info(`Direct CUA response: ${JSON.stringify(directCuaResponse)}`);

    // Record the action in the memory manager
    await cuaMemoryManager.recordAction(directRequest, directCuaResponse);

    // Example 3: Get action history
    logger.info('Getting action history');

    const history = await cuaMemoryManager.getActionHistory();
    logger.info(`Action history: ${JSON.stringify(history)}`);

    // Example 4: Filter action history
    logger.info('Filtering action history by type');

    const filteredHistory = await cuaMemoryManager.getActionHistory(100, {
      actionType: CUActionType.RUN_COMMAND
    });
    logger.info(`Filtered action history: ${JSON.stringify(filteredHistory)}`);
  } catch (error) {
    logger.error(`Error in CUA example: ${error}`);
  } finally {
    // Clean up
    await cuaAdapter.shutdown();
    logger.info('CUA example completed');
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runCUAExample().catch(error => {
    console.error('Error running CUA example:', error);
    process.exit(1);
  });
}

export { runCUAExample };
