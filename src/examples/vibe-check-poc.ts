import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { RuntimeAgentWrapper } from '../orchestrator/RuntimeAgentWrapper';
import { VibeCheckUtils } from '../utils/VibeCheckUtils';
import { Logger } from '../utils/Logger';

/**
 * Proof of Concept for VibeCheck Integration
 * 
 * This example demonstrates how to use VibeCheck to improve a complex plan
 * and learn from mistakes in a real-world scenario.
 */
export async function runVibeCheckPoc(): Promise<void> {
  const logger = new Logger();
  logger.info('Starting VibeCheck Proof of Concept');
  
  // Create the runtime container
  const container = createRuntimeContainer();
  
  // Create the VibeCheck agent configuration
  const vibeCheckConfig: AgentConfig = {
    type: AgentType.vibecheck,
    options: {
      apiKey: process.env.GEMINI_API_KEY || 'test-api-key',
      serverUrl: 'http://localhost:3000',
      timeout: 30000,
      maxRetries: 3,
      enableCaching: true,
      cacheTtl: 300000, // 5 minutes
      sessionId: 'poc-session'
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
    
    // Scenario: A developer is planning to implement a simple feature but has created an overly complex plan
    const userRequest = 'Add a dark mode toggle to our website';
    
    const complexPlan = `
    1. Create a comprehensive theming system with support for multiple themes (dark, light, high contrast, etc.)
    2. Implement a theme provider using React Context API with TypeScript generics for type safety
    3. Create a custom hook for accessing the theme context
    4. Set up a Redux store to manage theme state globally
    5. Create actions and reducers for theme changes
    6. Implement middleware to persist theme preference in localStorage, cookies, and IndexedDB for redundancy
    7. Add theme synchronization across tabs using BroadcastChannel API
    8. Create a theme configuration file with all possible color variations
    9. Implement CSS-in-JS solution with styled-components for dynamic theming
    10. Create animations for smooth transitions between themes
    11. Add system preference detection using matchMedia
    12. Implement a theme scheduler to automatically switch themes based on time of day
    13. Create comprehensive documentation for the theming system
    14. Add unit tests, integration tests, and end-to-end tests for the theming system
    15. Set up a CI/CD pipeline specifically for theme testing
    16. Create a theme editor for users to customize their themes
    17. Implement theme sharing functionality
    18. Add analytics to track theme usage
    19. Create a theme marketplace for users to download custom themes
    20. Implement a theme preview feature
    `;
    
    // Step 1: Use vibe_check to identify issues with the plan
    logger.info('Step 1: Using vibe_check to identify issues with the plan');
    const checkResult = await VibeCheckUtils.check(
      container,
      {
        phase: 'planning',
        userRequest,
        plan: complexPlan,
        confidence: 0.9,
        availableTools: ['React', 'CSS', 'localStorage'],
        thinkingLog: 'I need to implement a dark mode toggle. I should create a comprehensive theming system...'
      },
      'developer'
    );
    
    logger.info('VibeCheck Result:');
    logger.info(checkResult);
    
    // Step 2: Use vibe_distill to simplify the plan
    logger.info('Step 2: Using vibe_distill to simplify the plan');
    const distillResult = await VibeCheckUtils.distill(
      container,
      {
        plan: complexPlan,
        userRequest
      },
      'developer'
    );
    
    logger.info('VibeDistill Result:');
    logger.info(distillResult);
    
    // Step 3: Implement the simplified plan (simulated)
    logger.info('Step 3: Implementing the simplified plan (simulated)');
    const simplifiedPlan = distillResult || `
    1. Add a simple dark mode toggle button in the header
    2. Create a CSS class for dark mode styles
    3. Use localStorage to remember user preference
    4. Add a simple event listener to toggle between modes
    `;
    
    // Step 4: Learn from the experience
    logger.info('Step 4: Learning from the experience');
    const learnResult = await VibeCheckUtils.learn(
      container,
      {
        mistake: 'Created an overly complex plan for a simple dark mode toggle',
        category: 'Complex Solution Bias',
        solution: 'Focused on the core requirement and implemented a simpler solution that meets the user needs'
      },
      'developer'
    );
    
    logger.info('VibeLearn Result:');
    logger.info(learnResult);
    
    // Step 5: Apply the learning to a new scenario
    logger.info('Step 5: Applying the learning to a new scenario');
    
    const newUserRequest = 'Add a language selector to our website';
    const newPlan = `
    1. Add a simple language selector dropdown in the header
    2. Store selected language in localStorage
    3. Use React Context to provide language strings to components
    4. Create a simple translation file for each supported language
    5. Add a language detection based on browser settings for first-time users
    `;
    
    const finalCheckResult = await VibeCheckUtils.check(
      container,
      {
        phase: 'planning',
        userRequest: newUserRequest,
        plan: newPlan,
        confidence: 0.8,
        availableTools: ['React', 'localStorage', 'i18next'],
        previousAdvice: 'Focus on core requirements and avoid over-engineering'
      },
      'developer'
    );
    
    logger.info('Final VibeCheck Result:');
    logger.info(finalCheckResult);
    
  } catch (error) {
    logger.error(`Error in VibeCheck POC: ${error}`);
  } finally {
    // Tear down the container
    await container.teardown();
    logger.info('Container torn down');
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runVibeCheckPoc()
    .then(() => {
      console.log('VibeCheck POC completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error running VibeCheck POC: ${error}`);
      process.exit(1);
    });
}
