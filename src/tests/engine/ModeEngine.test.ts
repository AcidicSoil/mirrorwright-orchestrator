import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ModeEngine } from '../../engine/ModeEngine';
import { ModeDefinition } from '../../types/protocol';
import { EngineError, EngineErrorType } from '../../types/engine';

// Mock the schema validator
vi.mock('../../utils/validateSchema', () => ({
  schemaValidator: {
    validate: vi.fn().mockImplementation((data, schemaType) => {
      // Mock validation logic
      if (schemaType === 'mode') {
        if (!data.id || !data.name || !data.entryRitual) {
          throw new EngineError('Invalid mode', EngineErrorType.VALIDATION_ERROR);
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

describe('ModeEngine', () => {
  let modeEngine: ModeEngine;
  let validModes: ModeDefinition[];

  beforeEach(() => {
    modeEngine = new ModeEngine();
    validModes = [
      {
        id: 'test-mode-1',
        name: 'Test Mode 1',
        entryRitual: 'test-ritual-1'
      },
      {
        id: 'test-mode-2',
        name: 'Test Mode 2',
        entryRitual: 'test-ritual-2',
        exitRitual: 'test-ritual-3',
        config: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    ];
  });

  describe('initializeModes', () => {
    it('should initialize valid modes', async () => {
      await expect(modeEngine.initializeModes(validModes)).resolves.not.toThrow();
      expect(modeEngine.getActiveModes()).toEqual({
        'test-mode-1': validModes[0],
        'test-mode-2': validModes[1]
      });
    });

    it('should throw on invalid modes', async () => {
      const invalidModes = [
        {
          // Missing id
          name: 'Invalid Mode',
          entryRitual: 'test-ritual'
        }
      ] as unknown as ModeDefinition[];

      await expect(modeEngine.initializeModes(invalidModes)).rejects.toThrow(EngineError);
    });
  });

  describe('getActiveModes', () => {
    it('should return all active modes', async () => {
      await modeEngine.initializeModes(validModes);
      expect(modeEngine.getActiveModes()).toEqual({
        'test-mode-1': validModes[0],
        'test-mode-2': validModes[1]
      });
    });

    it('should return an empty object when no modes are active', () => {
      expect(modeEngine.getActiveModes()).toEqual({});
    });
  });

  describe('isModeActive', () => {
    it('should return true for active modes', async () => {
      await modeEngine.initializeModes(validModes);
      expect(modeEngine.isModeActive('test-mode-1')).toBe(true);
      expect(modeEngine.isModeActive('test-mode-2')).toBe(true);
    });

    it('should return false for inactive modes', async () => {
      await modeEngine.initializeModes(validModes);
      expect(modeEngine.isModeActive('non-existent-mode')).toBe(false);
    });
  });

  describe('activateMode', () => {
    it('should activate a mode with context', async () => {
      await modeEngine.initializeModes(validModes);
      const context = { key: 'value' };
      await expect(modeEngine.activateMode('test-mode-1', context)).resolves.not.toThrow();
    });

    it('should throw when activating a non-existent mode', async () => {
      await modeEngine.initializeModes(validModes);
      await expect(modeEngine.activateMode('non-existent-mode', {})).rejects.toThrow(EngineError);
      expect(modeEngine.isModeActive('non-existent-mode')).toBe(false);
    });
  });

  describe('deactivateMode', () => {
    it('should deactivate an active mode', async () => {
      await modeEngine.initializeModes(validModes);
      await expect(modeEngine.deactivateMode('test-mode-1')).resolves.not.toThrow();
      expect(modeEngine.isModeActive('test-mode-1')).toBe(false);
      expect(modeEngine.isModeActive('test-mode-2')).toBe(true);
    });

    it('should throw when deactivating a non-existent mode', async () => {
      await modeEngine.initializeModes(validModes);
      await expect(modeEngine.deactivateMode('non-existent-mode')).rejects.toThrow(EngineError);
    });
  });
});
