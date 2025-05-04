import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RitualEngine, RitualEvent, RitualExecutionResult } from '../../engine/RitualEngine';
import { RitualDefinition } from '../../types/protocol';
import { EngineError, EngineErrorType } from '../../types/engine';

// Mock the schemaValidator
vi.mock('../../utils/validateSchema', () => ({
  schemaValidator: {
    validate: vi.fn().mockResolvedValue(true)
  }
}));

describe('Enhanced RitualEngine', () => {
  let ritualEngine: RitualEngine;
  
  beforeEach(() => {
    ritualEngine = new RitualEngine();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('Initialization', () => {
    it('should initialize rituals successfully', async () => {
      // Create sample rituals
      const rituals: Record<string, RitualDefinition> = {
        'test-ritual': {
          id: 'test-ritual',
          steps: [
            {
              type: 'prompt',
              content: 'Test prompt'
            }
          ]
        }
      };
      
      // Initialize rituals
      await ritualEngine.initializeRituals(rituals);
      
      // Verify rituals are stored
      const availableRituals = ritualEngine.getAvailableRituals();
      expect(availableRituals).toHaveProperty('test-ritual');
      expect(availableRituals['test-ritual'].id).toBe('test-ritual');
    });
    
    it('should throw error if ritual validation fails', async () => {
      // Mock validation failure
      vi.mocked(ritualEngine.validateRitual).mockRejectedValueOnce(
        new EngineError('Validation failed', EngineErrorType.VALIDATION_ERROR)
      );
      
      // Create sample rituals
      const rituals: Record<string, RitualDefinition> = {
        'invalid-ritual': {
          id: 'invalid-ritual',
          steps: []
        }
      };
      
      // Initialize rituals should throw
      await expect(ritualEngine.initializeRituals(rituals)).rejects.toThrow(EngineError);
    });
  });
  
  describe('Ritual Execution', () => {
    beforeEach(async () => {
      // Create and initialize sample rituals
      const rituals: Record<string, RitualDefinition> = {
        'test-ritual': {
          id: 'test-ritual',
          steps: [
            {
              type: 'prompt',
              content: 'Test prompt'
            },
            {
              type: 'action',
              content: 'Test action'
            }
          ]
        },
        'conditional-ritual': {
          id: 'conditional-ritual',
          steps: [
            {
              type: 'prompt',
              content: 'Test prompt'
            },
            {
              type: 'action',
              content: 'Test action',
              conditions: [
                {
                  variable: 'flag',
                  operator: '==',
                  value: true
                }
              ]
            }
          ]
        }
      };
      
      await ritualEngine.initializeRituals(rituals);
    });
    
    it('should execute ritual steps in sequence', async () => {
      // Set up event listeners to track execution
      const events: any[] = [];
      
      ritualEngine.on(RitualEvent.RITUAL_START, (ritualId) => {
        events.push({ event: RitualEvent.RITUAL_START, ritualId });
      });
      
      ritualEngine.on(RitualEvent.STEP_START, (ritualId, stepIndex, stepType) => {
        events.push({ event: RitualEvent.STEP_START, ritualId, stepIndex, stepType });
      });
      
      ritualEngine.on(RitualEvent.STEP_COMPLETE, (ritualId, result) => {
        events.push({ event: RitualEvent.STEP_COMPLETE, ritualId, result });
      });
      
      ritualEngine.on(RitualEvent.RITUAL_COMPLETE, (result) => {
        events.push({ event: RitualEvent.RITUAL_COMPLETE, result });
      });
      
      // Execute ritual
      const result = await ritualEngine.executeRitual('test-ritual');
      
      // Verify result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.ritualId).toBe('test-ritual');
      expect(result.steps.total).toBe(2);
      expect(result.steps.executed).toBe(2);
      expect(result.steps.skipped).toBe(0);
      expect(result.steps.failed).toBe(0);
      
      // Verify events
      expect(events.length).toBe(5); // RITUAL_START + 2x(STEP_START + STEP_COMPLETE) + RITUAL_COMPLETE
      expect(events[0].event).toBe(RitualEvent.RITUAL_START);
      expect(events[1].event).toBe(RitualEvent.STEP_START);
      expect(events[2].event).toBe(RitualEvent.STEP_COMPLETE);
      expect(events[3].event).toBe(RitualEvent.STEP_START);
      expect(events[4].event).toBe(RitualEvent.STEP_COMPLETE);
    });
    
    it('should skip steps with unmet conditions', async () => {
      // Set up event listeners to track execution
      const events: any[] = [];
      
      ritualEngine.on(RitualEvent.STEP_SKIP, (ritualId, stepIndex, reason) => {
        events.push({ event: RitualEvent.STEP_SKIP, ritualId, stepIndex, reason });
      });
      
      // Execute ritual with context that doesn't meet conditions
      const result = await ritualEngine.executeRitual('conditional-ritual', { flag: false });
      
      // Verify result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.steps.total).toBe(2);
      expect(result.steps.executed).toBe(1);
      expect(result.steps.skipped).toBe(1);
      
      // Verify events
      expect(events.length).toBe(1);
      expect(events[0].event).toBe(RitualEvent.STEP_SKIP);
    });
    
    it('should handle execution options', async () => {
      // Create custom step handler
      const customHandler = vi.fn().mockResolvedValue('Custom result');
      
      // Execute ritual with custom options
      const result = await ritualEngine.executeRitual('test-ritual', {}, {
        stepHandlers: {
          'prompt': customHandler
        }
      });
      
      // Verify custom handler was called
      expect(customHandler).toHaveBeenCalled();
      
      // Verify result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
    
    it('should abort execution when timeout occurs', async () => {
      // Mock setTimeout to trigger immediately
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = vi.fn().mockImplementation((callback) => {
        callback();
        return 1 as any;
      });
      
      // Set up event listeners to track execution
      const events: any[] = [];
      
      ritualEngine.on(RitualEvent.RITUAL_ERROR, (ritualId, error) => {
        events.push({ event: RitualEvent.RITUAL_ERROR, ritualId, error });
      });
      
      // Execute ritual with short timeout
      try {
        await ritualEngine.executeRitual('test-ritual', {}, {
          timeout: 1 // 1ms timeout
        });
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Verify error
        expect(error).toBeInstanceOf(EngineError);
        expect((error as EngineError).type).toBe(EngineErrorType.EXECUTION_ERROR);
      }
      
      // Restore setTimeout
      global.setTimeout = originalSetTimeout;
    });
  });
});
