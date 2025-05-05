import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VibeCheckAdapter } from '../../src/agents/VibeCheckAdapter';
import { AgentConfig, AgentType } from '../../src/types/agent';
import { VibeCheckService } from '../../src/services/VibeCheckService';

// Mock the VibeCheckService
vi.mock('../../src/services/VibeCheckService', () => {
  return {
    VibeCheckService: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      shutdown: vi.fn().mockResolvedValue(undefined),
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
      }),
      clearCache: vi.fn()
    }))
  };
});

describe('VibeCheckAdapter', () => {
  let adapter: VibeCheckAdapter;
  let mockService: any;

  beforeEach(() => {
    // Create a new adapter before each test
    const config: AgentConfig = {
      type: AgentType.vibecheck,
      options: {
        apiKey: 'test-api-key',
        serverUrl: 'http://test-server:3000',
        timeout: 5000,
        maxRetries: 2,
        enableCaching: true,
        sessionId: 'test-session'
      }
    };

    // Clear mock calls
    vi.clearAllMocks();

    adapter = new VibeCheckAdapter(config);
    mockService = adapter['service'];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize the adapter with the correct configuration', () => {
    expect(VibeCheckService).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      serverUrl: 'http://test-server:3000',
      timeout: 5000,
      maxRetries: 2,
      enableCaching: true,
      cacheTtl: undefined
    });
    expect(adapter['sessionId']).toBe('test-session');
  });

  it('should initialize the adapter', async () => {
    await adapter.initialize();
    expect(mockService.initialize).toHaveBeenCalled();
  });

  it('should shutdown the adapter', async () => {
    await adapter.shutdown();
    expect(mockService.shutdown).toHaveBeenCalled();
    expect(adapter['sessionId']).toBeUndefined();
  });

  it('should handle regular prompts', async () => {
    const input = {
      prompt: 'Test prompt'
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('VibeCheck received: Test prompt');
    expect(output.metadata?.agent).toBe('vibecheck');
  });

  it('should handle vibe_check requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_check',
        params: {
          phase: 'planning',
          userRequest: 'Original request',
          plan: 'Current plan'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeCheck result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_check');
    expect(mockService.check).toHaveBeenCalledWith({
      ...input.metadata.params,
      sessionId: 'test-session'
    });
  });

  it('should handle vibe_distill requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_distill',
        params: {
          userRequest: 'Original request',
          plan: 'Current plan'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeDistill result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_distill');
    expect(mockService.distill).toHaveBeenCalledWith({
      ...input.metadata.params,
      sessionId: 'test-session'
    });
  });

  it('should handle vibe_learn requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_learn',
        params: {
          mistake: 'Made a mistake',
          category: 'Other',
          solution: 'Fixed it'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeLearn result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_learn');
    expect(mockService.learn).toHaveBeenCalledWith({
      ...input.metadata.params,
      sessionId: 'test-session'
    });
  });

  it('should handle unknown tool types', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'unknown_tool',
        params: {}
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('Error: Unknown tool type');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.error).toBe(true);
  });

  it('should handle errors in vibe_check', async () => {
    mockService.check.mockRejectedValueOnce(new Error('Test error'));

    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_check',
        params: {
          phase: 'planning',
          userRequest: 'Original request',
          plan: 'Current plan'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('Error in vibe_check');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_check');
    expect(output.metadata?.success).toBe(false);
  });

  it('should update session ID from input metadata', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        sessionId: 'new-session-id'
      }
    };

    await adapter.send(input);

    expect(adapter['sessionId']).toBe('new-session-id');
  });

  it('should infer vibe_check from prompt content', async () => {
    const input = {
      prompt: 'Please perform a vibe_check on my plan to break tunnel vision',
      context: {
        userRequest: 'Original request',
        plan: 'Current plan',
        phase: 'planning'
      }
    };

    await adapter.send(input);

    expect(mockService.check).toHaveBeenCalled();
    const params = mockService.check.mock.calls[0][0];
    expect(params.phase).toBe('planning');
    expect(params.userRequest).toBe('Original request');
    expect(params.plan).toBe('Current plan');
    expect(params.sessionId).toBe('test-session');
  });

  it('should infer vibe_distill from prompt content', async () => {
    const input = {
      prompt: 'Please distill this complex plan',
      context: {
        userRequest: 'Original request',
        plan: 'Complex plan with many steps'
      }
    };

    await adapter.send(input);

    expect(mockService.distill).toHaveBeenCalled();
    const params = mockService.distill.mock.calls[0][0];
    expect(params.userRequest).toBe('Original request');
    expect(params.plan).toBe('Complex plan with many steps');
    expect(params.sessionId).toBe('test-session');
  });

  it('should infer vibe_learn from prompt content', async () => {
    const input = {
      prompt: 'Learn from mistake: Overcomplicating solution, category: Complex Solution Bias, solution: Simplify approach'
    };

    await adapter.send(input);

    expect(mockService.learn).toHaveBeenCalled();
    const params = mockService.learn.mock.calls[0][0];
    expect(params.mistake).toContain('Overcomplicating solution');
    expect(params.category).toBe('Complex Solution Bias');
    expect(params.solution).toContain('Simplify approach');
    expect(params.sessionId).toBe('test-session');
  });

  it('should handle clear_cache command', async () => {
    const input = {
      prompt: 'Clear cache',
      metadata: {
        command: 'clear_cache'
      }
    };

    const output = await adapter.send(input);

    expect(mockService.clearCache).toHaveBeenCalled();
    expect(output.content).toBe('Cache cleared successfully');
    expect(output.metadata?.success).toBe(true);
  });

  it('should handle set_session command', async () => {
    const input = {
      prompt: 'Set session',
      metadata: {
        command: 'set_session',
        sessionId: 'command-session-id'
      }
    };

    const output = await adapter.send(input);

    expect(adapter['sessionId']).toBe('command-session-id');
    expect(output.content).toBe('Session ID set to command-session-id');
    expect(output.metadata?.success).toBe(true);
  });

  it('should handle get_status command', async () => {
    const input = {
      prompt: 'Get status',
      metadata: {
        command: 'get_status'
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('VibeCheck agent status');
    expect(output.metadata?.success).toBe(true);
  });

  it('should handle unknown commands', async () => {
    const input = {
      prompt: 'Unknown command',
      metadata: {
        command: 'unknown_command'
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('Unknown command');
    expect(output.metadata?.success).toBe(false);
  });
});
