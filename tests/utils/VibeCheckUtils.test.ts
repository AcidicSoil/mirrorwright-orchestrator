import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VibeCheckUtils } from '../../src/utils/VibeCheckUtils';
import { RuntimeContainer, Message } from '../../src/orchestrator/runtime';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('mock-uuid')
}));

describe('VibeCheckUtils', () => {
  let mockContainer: RuntimeContainer;
  let mockMessageBus: any;
  let messageHandler: (message: Message) => Promise<void>;
  let sentMessages: Message[] = [];

  beforeEach(() => {
    sentMessages = [];
    messageHandler = vi.fn();

    // Create a mock message bus
    mockMessageBus = {
      subscribe: vi.fn((id, handler) => {
        messageHandler = handler;
      }),
      unsubscribe: vi.fn(),
      publish: vi.fn()
    };

    // Create a mock container
    mockContainer = {
      registry: {} as any,
      messageBus: mockMessageBus,
      init: vi.fn(),
      start: vi.fn(),
      teardown: vi.fn(),
      registerAgent: vi.fn(),
      sendMessage: vi.fn(async (message: Message) => {
        sentMessages.push(message);
        
        // Simulate a response after a short delay
        setTimeout(() => {
          const responseMessage: Message = {
            id: uuidv4(),
            from: 'vibecheck',
            to: message.from,
            type: `${message.type}_response`,
            content: `Mock response for ${message.type}`,
            metadata: {
              inResponseTo: message.id,
              success: true
            }
          };
          
          messageHandler(responseMessage);
        }, 10);
      })
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send a vibe_check request and receive a response', async () => {
    const result = await VibeCheckUtils.check(
      mockContainer,
      {
        phase: 'planning',
        userRequest: 'Test request',
        plan: 'Test plan'
      },
      'test-agent'
    );

    expect(mockContainer.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: 'test-agent',
      to: 'vibecheck',
      type: 'vibe_check',
      metadata: expect.objectContaining({
        toolType: 'vibe_check',
        params: expect.objectContaining({
          phase: 'planning',
          userRequest: 'Test request',
          plan: 'Test plan'
        })
      })
    }));

    expect(mockMessageBus.subscribe).toHaveBeenCalledWith('test-agent-response-handler', expect.any(Function));
    expect(mockMessageBus.unsubscribe).toHaveBeenCalledWith('test-agent-response-handler');
    expect(result).toBe('Mock response for vibe_check');
  });

  it('should send a vibe_distill request and receive a response', async () => {
    const result = await VibeCheckUtils.distill(
      mockContainer,
      {
        plan: 'Test plan',
        userRequest: 'Test request'
      },
      'test-agent'
    );

    expect(mockContainer.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: 'test-agent',
      to: 'vibecheck',
      type: 'vibe_distill',
      metadata: expect.objectContaining({
        toolType: 'vibe_distill',
        params: expect.objectContaining({
          plan: 'Test plan',
          userRequest: 'Test request'
        })
      })
    }));

    expect(mockMessageBus.subscribe).toHaveBeenCalledWith('test-agent-response-handler', expect.any(Function));
    expect(mockMessageBus.unsubscribe).toHaveBeenCalledWith('test-agent-response-handler');
    expect(result).toBe('Mock response for vibe_distill');
  });

  it('should send a vibe_learn request and receive a response', async () => {
    const result = await VibeCheckUtils.learn(
      mockContainer,
      {
        mistake: 'Test mistake',
        category: 'Complex Solution Bias',
        solution: 'Test solution'
      },
      'test-agent'
    );

    expect(mockContainer.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: 'test-agent',
      to: 'vibecheck',
      type: 'vibe_learn',
      metadata: expect.objectContaining({
        toolType: 'vibe_learn',
        params: expect.objectContaining({
          mistake: 'Test mistake',
          category: 'Complex Solution Bias',
          solution: 'Test solution'
        })
      })
    }));

    expect(mockMessageBus.subscribe).toHaveBeenCalledWith('test-agent-response-handler', expect.any(Function));
    expect(mockMessageBus.unsubscribe).toHaveBeenCalledWith('test-agent-response-handler');
    expect(result).toBe('Mock response for vibe_learn');
  });

  it('should send a command and receive a response', async () => {
    const result = await VibeCheckUtils.sendCommand(
      mockContainer,
      'clear_cache',
      {},
      'test-agent'
    );

    expect(mockContainer.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: 'test-agent',
      to: 'vibecheck',
      type: 'command',
      metadata: expect.objectContaining({
        command: 'clear_cache'
      })
    }));

    expect(mockMessageBus.subscribe).toHaveBeenCalledWith('test-agent-response-handler', expect.any(Function));
    expect(mockMessageBus.unsubscribe).toHaveBeenCalledWith('test-agent-response-handler');
    expect(result).toBe('Mock response for command');
  });
});
