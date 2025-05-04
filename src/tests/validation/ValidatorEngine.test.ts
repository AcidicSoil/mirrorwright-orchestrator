import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validatorEngine, SchemaType } from '../../validation/ValidatorEngine';
import { getSchema } from '../../schema/SchemaRegistry';

// Mock the SchemaRegistry
vi.mock('../../schema/SchemaRegistry', () => ({
  getSchema: vi.fn(),
  getAllSchemas: vi.fn().mockReturnValue({
    'protocol': { /* mock protocol schema */ },
    'mode': { /* mock mode schema */ },
    'ritual': { /* mock ritual schema */ }
  })
}));

// Mock the Logger
vi.mock('../../utils/Logger', () => ({
  Logger: class {
    info = vi.fn();
    error = vi.fn();
  }
}));

describe('ValidatorEngine', () => {
  // Sample valid data for each schema type
  const validProtocol = {
    id: 'test-protocol',
    name: 'Test Protocol',
    version: '1.0.0',
    modes: [
      {
        id: 'test-mode',
        name: 'Test Mode',
        entryRitual: 'test-ritual'
      }
    ],
    rituals: {
      'test-ritual': {
        id: 'test-ritual',
        steps: [
          {
            type: 'prompt',
            content: 'Test prompt'
          }
        ]
      }
    }
  };

  const validMode = {
    id: 'test-mode',
    name: 'Test Mode',
    entryRitual: 'test-ritual'
  };

  const validRitual = {
    id: 'test-ritual',
    steps: [
      {
        type: 'prompt',
        content: 'Test prompt'
      }
    ]
  };

  // Sample invalid data for each schema type
  const invalidProtocol = {
    // Missing required fields
    id: 'test-protocol'
  };

  const invalidMode = {
    // Missing required fields
    id: 'test-mode'
  };

  const invalidRitual = {
    // Missing required fields
    id: 'test-ritual'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate a valid protocol', () => {
      const result = validatorEngine.validate(validProtocol, 'protocol');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate a valid mode', () => {
      const result = validatorEngine.validate(validMode, 'mode');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate a valid ritual', () => {
      const result = validatorEngine.validate(validRitual, 'ritual');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return errors for an invalid protocol', () => {
      const result = validatorEngine.validate(invalidProtocol, 'protocol');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return errors for an invalid mode', () => {
      const result = validatorEngine.validate(invalidMode, 'mode');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return errors for an invalid ritual', () => {
      const result = validatorEngine.validate(invalidRitual, 'ritual');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle unknown schema types', () => {
      const result = validatorEngine.validate({}, 'unknown-schema' as SchemaType);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No validator found for schema type: unknown-schema');
    });

    it('should detect schema type from content when using "all"', () => {
      const result = validatorEngine.validate(validProtocol, 'all');
      expect(result.isValid).toBe(true);
    });

    it('should return error when unable to detect schema type from content', () => {
      const result = validatorEngine.validate({}, 'all');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Could not determine schema type from content');
    });
  });

  describe('getValidator', () => {
    it('should return a validator function for a valid schema type', () => {
      const validator = validatorEngine.getValidator('protocol');
      expect(typeof validator).toBe('function');

      const result = validator(validProtocol);
      expect(result.isValid).toBe(true);
    });
  });
});
