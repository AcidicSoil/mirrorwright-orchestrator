import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CUAAdapter, CUAAgentConfig } from '../../src/agents/CUAAdapter';
import { AgentType } from '../../src/types/agent';
import { CUActionType, CUActionStatus } from '../../src/types/cuaction';

// Mock the Logger
vi.mock('../../src/utils/Logger', () => {
  return {
    Logger: vi.fn().mockImplementation(() => {
      return {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn()
      };
    })
  };
});

describe('CUAAdapter', () => {
  let adapter: CUAAdapter;
  const config: CUAAgentConfig = {
    type: AgentType.augment,
    dryRunDefault: true,
    maxTimeout: 5000,
    allowedPaths: ['/allowed/path'],
    allowedCommands: ['echo', 'ls']
  };

  beforeEach(() => {
    adapter = new CUAAdapter(config);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    await expect(adapter.initialize()).resolves.not.toThrow();
  });

  it('should shutdown successfully', async () => {
    await expect(adapter.shutdown()).resolves.not.toThrow();
  });

  it('should process a file read request in dry run mode', async () => {
    const input = {
      prompt: JSON.stringify({
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: '/allowed/path/test.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      }),
      context: {}
    };

    const result = await adapter.send(input);
    const parsedResult = JSON.parse(result.content);

    expect(parsedResult.status).toBe(CUActionStatus.SUCCESS);
    expect(parsedResult.metadata.dryRun).toBe(true);
  });

  it('should process a command execution request in dry run mode', async () => {
    const input = {
      prompt: JSON.stringify({
        action_type: CUActionType.RUN_COMMAND,
        payload: {
          command: 'echo',
          args: ['Hello, world!']
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      }),
      context: {}
    };

    const result = await adapter.send(input);
    const parsedResult = JSON.parse(result.content);

    expect(parsedResult.status).toBe(CUActionStatus.SUCCESS);
    expect(parsedResult.metadata.dryRun).toBe(true);
  });

  it('should handle parsing errors gracefully', async () => {
    const input = {
      prompt: 'This is not a valid CUActionRequest',
      context: {}
    };

    const result = await adapter.send(input);
    
    expect(result.content).toContain('Error');
    expect(result.metadata.error).toBe(true);
  });

  it('should use the request context if provided', async () => {
    const cuaRequest = {
      action_type: CUActionType.WRITE_FILE,
      payload: {
        path: '/allowed/path/test.txt',
        content: 'Hello, world!'
      },
      context: {
        agent_id: 'test-agent',
        timestamp: new Date().toISOString()
      }
    };

    const input = {
      prompt: 'Write to a file',
      context: {
        cuaRequest
      }
    };

    const result = await adapter.send(input);
    const parsedResult = JSON.parse(result.content);

    expect(parsedResult.status).toBe(CUActionStatus.SUCCESS);
    expect(parsedResult.metadata.dryRun).toBe(true);
  });
});
