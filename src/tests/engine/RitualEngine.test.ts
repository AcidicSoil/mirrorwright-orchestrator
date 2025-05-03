import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RitualEngine } from '../../engine/RitualEngine';
import { RitualDefinition } from '../../types/protocol';
import { EngineError, EngineErrorType } from '../../types/engine';

// Mock the schema validator
vi.mock('../../utils/validateSchema', () => ({
  schemaValidator: {
    validate: vi.fn().mockImplementation((data, schemaType) => {
      // Mock validation logic
      if (schemaType === 'ritual') {
        if (!data.id || !data.steps || !Array.isArray(data.steps)) {
          throw new EngineError('Invalid ritual', EngineErrorType.VALIDATION_ERROR);
        }
        
        // Check each step
        for (const step of data.steps) {
          if (!step.type || !step.content) {
            throw new EngineError('Invalid ritual step', EngineErrorType.VALIDATION_ERROR);
          }
          
          if (!['prompt', 'action', 'pause'].includes(step.type)) {
            throw new EngineError(`Invalid step type: ${step.type}`, EngineErrorType.VALIDATION_ERROR);
          }
        }
      }
      return true;
    })
  }
}));

// Mock the logger
vi.mock('../../utils/Logger', () => ({
  Logger: class {
    info = vi.fn();
    error = vi.fn();
  }
}));

describe('RitualEngine', () => {
  let ritualEngine: RitualEngine;
  let validRituals: Record<string, RitualDefinition>;

  beforeEach(() => {
    ritualEngine = new RitualEngine();
    validRituals = {
      'test-ritual-1': {
        id: 'test-ritual-1',
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
      'test-ritual-2': {
        id: 'test-ritual-2',
        description: 'Test ritual with conditions',
        steps: [
          {
            type: 'prompt',
            content: 'Test prompt with condition',
            conditions: [
              {
                variable: 'testVar',
                operator: '==',
                value: true
              }
            ]
          },
          {
            type: 'pause',
            content: 'Test pause'
          }
        ]
      }
    };
  });

  describe('initializeRituals', () => {
    it('should initialize valid rituals', async () => {
      await expect(ritualEngine.initializeRituals(validRituals)).resolves.not.toThrow();
      expect(ritualEngine.getAvailableRituals()).toEqual(validRituals);
    });

    it('should throw on invalid rituals', async () => {
      const invalidRituals = {
        'invalid-ritual': {
          // Missing id
          steps: [
            {
              type: 'invalid-type', // Invalid type
              content: 'Test content'
            }
          ]
        }
      } as unknown as Record<string, RitualDefinition>;

      await expect(ritualEngine.initializeRituals(invalidRituals)).rejects.toThrow(EngineError);
    });
  });

  describe('getAvailableRituals', () => {
    it('should return all available rituals', async () => {
      await ritualEngine.initializeRituals(validRituals);
      expect(ritualEngine.getAvailableRituals()).toEqual(validRituals);
    });

    it('should return an empty object when no rituals are available', () => {
      expect(ritualEngine.getAvailableRituals()).toEqual({});
    });
  });

  describe('validateRitual', () => {
    it('should validate a valid ritual', () => {
      expect(ritualEngine.validateRitual(validRituals['test-ritual-1'])).toBe(true);
    });

    it('should throw on an invalid ritual', () => {
      const invalidRitual = {
        // Missing id
        steps: [
          {
            type: 'invalid-type', // Invalid type
            content: 'Test content'
          }
        ]
      } as unknown as RitualDefinition;

      expect(() => ritualEngine.validateRitual(invalidRitual)).toThrow(EngineError);
    });
  });

  describe('executeRitual', () => {
    it('should execute a ritual with context', async () => {
      await ritualEngine.initializeRituals(validRituals);
      const context = { testVar: true };
      const result = await ritualEngine.executeRitual('test-ritual-1', context);
      
      // Check that the result contains the original context
      expect(result).toHaveProperty('testVar', true);
      
      // Check that the result contains the mock results from steps
      expect(result).toHaveProperty('lastPromptResult');
      expect(result).toHaveProperty('lastActionResult');
    });

    it('should throw when executing a non-existent ritual', async () => {
      await ritualEngine.initializeRituals(validRituals);
      await expect(ritualEngine.executeRitual('non-existent-ritual', {})).rejects.toThrow(EngineError);
    });

    it('should respect conditions when executing steps', async () => {
      await ritualEngine.initializeRituals(validRituals);
      
      // Context that satisfies the condition
      const contextTrue = { testVar: true };
      const resultTrue = await ritualEngine.executeRitual('test-ritual-2', contextTrue);
      
      // The prompt step should be executed
      expect(resultTrue).toHaveProperty('lastPromptResult');
      
      // Context that does not satisfy the condition
      const contextFalse = { testVar: false };
      const resultFalse = await ritualEngine.executeRitual('test-ritual-2', contextFalse);
      
      // The prompt step should be skipped
      expect(resultFalse).not.toHaveProperty('lastPromptResult');
      
      // The pause step should still be executed
      expect(resultFalse).toHaveProperty('lastPauseResult');
    });
  });
});
