import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchemaValidator, schemaValidator } from '../../utils/validateSchema';
import { EngineError, EngineErrorType } from '../../types/engine';

// Mock Ajv
vi.mock('ajv', () => {
  const mockValidateFunction = vi.fn();
  return {
    default: class {
      constructor() {
        this.errors = null;
      }
      
      addSchema(schema: any, name: string) {
        return true;
      }
      
      getSchema(name: string) {
        return mockValidateFunction;
      }
      
      compile() {
        return mockValidateFunction;
      }
    }
  };
});

// Mock fs
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockImplementation((path) => {
    if (path.includes('ritual.schema.json')) {
      return JSON.stringify({
        type: 'object',
        properties: {
          id: { type: 'string' },
          steps: { type: 'array' }
        },
        required: ['id', 'steps']
      });
    }
    return '{}';
  })
}));

// Mock the logger
vi.mock('../../utils/Logger', () => ({
  Logger: class {
    info = vi.fn();
    error = vi.fn();
  }
}));

describe('SchemaValidator', () => {
  let validator: SchemaValidator;
  let mockValidate: any;

  beforeEach(() => {
    validator = new SchemaValidator();
    mockValidate = vi.fn();
    vi.mocked(validator['validators'].get).mockReturnValue(mockValidate);
  });

  describe('validate', () => {
    it('should validate valid data', () => {
      mockValidate.mockReturnValue(true);
      
      const validData = {
        id: 'test-id',
        steps: []
      };
      
      expect(validator.validate(validData, 'ritual')).toBe(true);
    });

    it('should throw on invalid data', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [{ message: 'Invalid data' }];
      
      const invalidData = {
        // Missing required fields
      };
      
      expect(() => validator.validate(invalidData, 'ritual')).toThrow(EngineError);
    });

    it('should throw when validator not found', () => {
      vi.mocked(validator['validators'].get).mockReturnValue(undefined);
      
      expect(() => validator.validate({}, 'non-existent')).toThrow(EngineError);
    });
  });

  describe('validateFile', () => {
    it('should validate a valid file', () => {
      mockValidate.mockReturnValue(true);
      
      expect(validator.validateFile('test-file.json', 'ritual')).toBe(true);
    });

    it('should throw on an invalid file', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [{ message: 'Invalid data' }];
      
      expect(() => validator.validateFile('test-file.json', 'ritual')).toThrow(EngineError);
    });

    it('should throw when file cannot be read', () => {
      vi.mocked(require('fs').readFileSync).mockImplementationOnce(() => {
        throw new Error('File not found');
      });
      
      expect(() => validator.validateFile('non-existent-file.json', 'ritual')).toThrow(EngineError);
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(schemaValidator).toBeInstanceOf(SchemaValidator);
    });
  });
});
