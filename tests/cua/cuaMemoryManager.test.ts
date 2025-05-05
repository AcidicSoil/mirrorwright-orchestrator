import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DefaultCUAMemoryManager } from '../../src/memory/CUAMemoryManager';
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

describe('DefaultCUAMemoryManager', () => {
  let memoryManager: DefaultCUAMemoryManager;

  beforeEach(() => {
    memoryManager = new DefaultCUAMemoryManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('recordAction', () => {
    it('should record a CUA action', async () => {
      const request = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const response = {
        result: 'File opened successfully',
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100
        }
      };

      const actionId = await memoryManager.recordAction(request, response);
      
      expect(actionId).toBeDefined();
      expect(typeof actionId).toBe('string');
    });
  });

  describe('getActionHistory', () => {
    it('should return an empty array when no actions are recorded', async () => {
      const history = await memoryManager.getActionHistory();
      
      expect(history).toEqual([]);
    });

    it('should return recorded actions', async () => {
      const request = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const response = {
        result: 'File opened successfully',
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100
        }
      };

      await memoryManager.recordAction(request, response);
      
      const history = await memoryManager.getActionHistory();
      
      expect(history.length).toBe(1);
      expect(history[0].request).toEqual(request);
      expect(history[0].response).toEqual(response);
    });

    it('should limit the number of actions returned', async () => {
      const request1 = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test1.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const request2 = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test2.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const response = {
        result: 'File opened successfully',
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100
        }
      };

      await memoryManager.recordAction(request1, response);
      await memoryManager.recordAction(request2, response);
      
      const history = await memoryManager.getActionHistory(1);
      
      expect(history.length).toBe(1);
    });

    it('should filter actions by type', async () => {
      const request1 = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const request2 = {
        action_type: CUActionType.WRITE_FILE,
        payload: {
          path: 'test.txt',
          content: 'Hello, world!'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const response = {
        result: 'Success',
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100
        }
      };

      await memoryManager.recordAction(request1, response);
      await memoryManager.recordAction(request2, response);
      
      const history = await memoryManager.getActionHistory(100, { actionType: CUActionType.WRITE_FILE });
      
      expect(history.length).toBe(1);
      expect(history[0].request.action_type).toBe(CUActionType.WRITE_FILE);
    });
  });

  describe('getActionById', () => {
    it('should return null for non-existent action IDs', async () => {
      const action = await memoryManager.getActionById('non-existent-id');
      
      expect(action).toBeNull();
    });

    it('should return an action by ID', async () => {
      const request = {
        action_type: CUActionType.OPEN_FILE,
        payload: {
          path: 'test.txt'
        },
        context: {
          agent_id: 'test-agent',
          timestamp: new Date().toISOString()
        }
      };

      const response = {
        result: 'File opened successfully',
        status: CUActionStatus.SUCCESS,
        metadata: {
          duration: 100
        }
      };

      const actionId = await memoryManager.recordAction(request, response);
      const action = await memoryManager.getActionById(actionId);
      
      expect(action).not.toBeNull();
      expect(action?.id).toBe(actionId);
      expect(action?.request).toEqual(request);
      expect(action?.response).toEqual(response);
    });
  });
});
