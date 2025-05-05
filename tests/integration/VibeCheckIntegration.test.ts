/**
 * Integration test for the VibeCheck integration
 */

import { describe, it, expect, beforeAll, afterAll, vi, beforeEach, afterEach } from 'vitest';
import { createRuntimeContainer, Message } from '../../src/orchestrator/runtime';
import { AgentFactory } from '../../src/agents/AgentFactory';
import { AgentConfig, AgentType } from '../../src/types/agent';
import { v4 as uuidv4 } from 'uuid';
import { VibeCheckAdapter } from '../../src/agents/VibeCheckAdapter';
import { PromptRouter } from '../../src/router/PromptRouter';
import { PromptRouterService, createPromptRouterService } from '../../src/services/PromptRouterService';

// Mock the fs module to avoid file system dependencies
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockImplementation((path) => {
    if (path.includes('vibe-check-routing.json')) {
      return JSON.stringify({
        id: 'vibe-check-routing',
        agent: 'PromptRouter',
        triggers: [
          {
            type: 'pattern',
            keywords: ['stuck', 'loop', 'repeating', 'what now', 'idk', 'too complex'],
            agent_scope: ['cline', 'augment', 'chatgpt']
          },
          {
            type: 'tag',
            tags: ['#tunnel-vision', '#overload', '#fail-loop']
          }
        ],
        route_to: 'vibecheck',
        fallback_behavior: {
          onFailure: 'chatgpt',
          response: 'Simulating `vibe_distill` locally. Suggesting simplified framing.'
        }
      });
    }
    return '{}';
  })
}));

// Mock the VibeCheckClient
vi.mock('../../src/clients/VibeCheckClient', () => {
  return {
    VibeCheckClient: vi.fn().mockImplementation(() => ({
      checkHealth: vi.fn().mockResolvedValue(true),
      check: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeCheck result'
      }),
      distill: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeDistill result'
      }),
      learn: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeLearn result'
      })
    }))
  };
});

describe('VibeCheck Integration', () => {
  let container;
  let vibeCheckAgent;
  let messageHandlerSpy;
  let promptRouterService: PromptRouterService;

  beforeAll(async () => {
    // Create the runtime container
    container = createRuntimeContainer();

    // Create the PromptRouterService
    promptRouterService = createPromptRouterService();

    // Create the VibeCheck agent
    const vibeCheckConfig: AgentConfig = {
      type: AgentType.vibecheck,
      options: {
        apiKey: 'test-api-key',
        serverUrl: 'http://test-server:3000',
        timeout: 5000,
        maxRetries: 2,
        enableCaching: true,
        sessionId: 'integration-test-session'
      }
    };

    const vibeCheckAdapter = new VibeCheckAdapter(vibeCheckConfig);

    // Spy on the send method
    vi.spyOn(vibeCheckAdapter, 'send').mockImplementation(async (input) => {
      return {
        content: `VibeCheck processed: ${input.prompt}`,
        metadata: {
          agent: 'vibecheck',
          toolType: input.metadata?.toolType,
          timestamp: new Date().toISOString()
        }
      };
    });

    // Create a message handler spy
    messageHandlerSpy = vi.fn().mockResolvedValue(undefined);

    vibeCheckAgent = {
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
        messageHandlerSpy(message);

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
        } else if (message.type === 'command') {
          result = await vibeCheckAdapter.send({
            prompt: message.content?.toString() || '',
            metadata: {
              command: message.metadata?.command,
              sessionId: message.metadata?.sessionId
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

    // Register the agent with the runtime container
    container.registerAgent(vibeCheckAgent);

    // Initialize and start the container
    await container.init();
    await container.start();
  });

  afterAll(async () => {
    // Stop the container
    await container.teardown();
  });

  beforeEach(() => {
    messageHandlerSpy.mockClear();
  });

  it('should route a message to VibeCheck based on keywords', async () => {
    // Send a message with a keyword that should trigger routing to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'I am stuck and need help',
    });

    // Check that the message was routed to VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const message = messageHandlerSpy.mock.calls[0][0];
    expect(message.to).toBe('vibecheck');
  });

  it('should route a message to VibeCheck based on tags', async () => {
    // Send a message with a tag that should trigger routing to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'Need some guidance',
      metadata: {
        tags: ['#tunnel-vision']
      }
    });

    // Check that the message was routed to VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const message = messageHandlerSpy.mock.calls[0][0];
    expect(message.to).toBe('vibecheck');
  });

  it('should handle a vibe_check request', async () => {
    // Send a vibe_check message directly to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'vibe_check',
      from: 'test',
      to: 'vibecheck',
      content: 'Check my plan',
      phase: 'planning',
      userRequest: 'Create a simple todo app',
      plan: 'First, I will set up a React application with Redux...'
    });

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const message = messageHandlerSpy.mock.calls[0][0];
    expect(message.type).toBe('vibe_check');
    expect(message.phase).toBe('planning');
  });

  it('should handle a vibe_distill request', async () => {
    // Send a vibe_distill message directly to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'vibe_distill',
      from: 'test',
      to: 'vibecheck',
      content: 'Distill my plan',
      userRequest: 'Create a simple todo app',
      plan: 'First, I will set up a React application with Redux, then add Material UI, then implement authentication with Firebase, then add real-time updates, then implement offline support, then add analytics, then optimize performance...'
    });

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const message = messageHandlerSpy.mock.calls[0][0];
    expect(message.type).toBe('vibe_distill');
  });

  it('should handle a vibe_learn request', async () => {
    // Send a vibe_learn message directly to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'vibe_learn',
      from: 'test',
      to: 'vibecheck',
      content: 'Learn from mistake',
      mistake: 'Added too many features at once',
      category: 'Feature Creep',
      solution: 'Focus on core functionality first'
    });

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const message = messageHandlerSpy.mock.calls[0][0];
    expect(message.type).toBe('vibe_learn');
  });

  it('should handle a message with inferred vibe_check', async () => {
    // Send a message that should be inferred as a vibe_check
    await container.sendMessage({
      id: uuidv4(),
      type: 'text',
      from: 'test',
      to: 'vibecheck',
      content: 'I need a metacognitive check on my approach to break tunnel vision',
    });

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
  });

  it('should handle a command message', async () => {
    // Send a command message to VibeCheck
    await container.sendMessage({
      id: uuidv4(),
      type: 'command',
      from: 'test',
      to: 'vibecheck',
      content: 'Get status',
      metadata: {
        command: 'get_status'
      }
    });

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
  });

  it('should use the PromptRouterService to trigger VibeCheck', async () => {
    // Create a message
    const message: Message = {
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'I need help with my plan'
    };

    // Check if the message should be routed to VibeCheck
    const shouldRoute = promptRouterService.shouldRouteToVibeCheck(message);
    expect(shouldRoute).toBe(true);

    // Trigger VibeCheck with the message
    const vibeCheckMessage = promptRouterService.triggerVibeCheck(message, 'test');
    await container.sendMessage(vibeCheckMessage);

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const handledMessage = messageHandlerSpy.mock.calls[messageHandlerSpy.mock.calls.length - 1][0];
    expect(handledMessage.type).toBe('vibe_check');
    expect(handledMessage.from).toBe('test');
    expect(handledMessage.to).toBe('vibecheck');
  });

  it('should use the PromptRouterService to trigger VibeCheck with a plan', async () => {
    // Trigger VibeCheck with a plan
    const vibeCheckMessage = promptRouterService.triggerVibeCheckWithPlan(
      'First, I will set up a React application with Redux...',
      'Create a simple todo app',
      'planning',
      'test'
    );
    await container.sendMessage(vibeCheckMessage);

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const handledMessage = messageHandlerSpy.mock.calls[messageHandlerSpy.mock.calls.length - 1][0];
    expect(handledMessage.type).toBe('vibe_check');
    expect(handledMessage.from).toBe('test');
    expect(handledMessage.to).toBe('vibecheck');
    expect(handledMessage.phase).toBe('planning');
    expect(handledMessage.userRequest).toBe('Create a simple todo app');
    expect(handledMessage.plan).toBe('First, I will set up a React application with Redux...');
  });

  it('should use the PromptRouterService to trigger VibeDistill', async () => {
    // Trigger VibeDistill
    const vibeDistillMessage = promptRouterService.triggerVibeDistill(
      'First, I will set up a React application with Redux...',
      'Create a simple todo app',
      'test'
    );
    await container.sendMessage(vibeDistillMessage);

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const handledMessage = messageHandlerSpy.mock.calls[messageHandlerSpy.mock.calls.length - 1][0];
    expect(handledMessage.type).toBe('vibe_distill');
    expect(handledMessage.from).toBe('test');
    expect(handledMessage.to).toBe('vibecheck');
    expect(handledMessage.userRequest).toBe('Create a simple todo app');
    expect(handledMessage.plan).toBe('First, I will set up a React application with Redux...');
  });

  it('should use the PromptRouterService to trigger VibeLearn', async () => {
    // Trigger VibeLearn
    const vibeLearnMessage = promptRouterService.triggerVibeLearn(
      'Added too many features at once',
      'Feature Creep',
      'Focus on core functionality first',
      'test'
    );
    await container.sendMessage(vibeLearnMessage);

    // Check that the message was handled by VibeCheck
    expect(messageHandlerSpy).toHaveBeenCalled();
    const handledMessage = messageHandlerSpy.mock.calls[messageHandlerSpy.mock.calls.length - 1][0];
    expect(handledMessage.type).toBe('vibe_learn');
    expect(handledMessage.from).toBe('test');
    expect(handledMessage.to).toBe('vibecheck');
    expect(handledMessage.mistake).toBe('Added too many features at once');
    expect(handledMessage.category).toBe('Feature Creep');
    expect(handledMessage.solution).toBe('Focus on core functionality first');
  });
});
