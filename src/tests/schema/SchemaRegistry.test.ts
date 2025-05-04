import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSchema, getAllSchemas } from '../../schema/SchemaRegistry';
import fs from 'fs';
import path from 'path';

// Mock fs and path
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    readFileSync: vi.fn(),
    readdirSync: vi.fn()
  };
});

vi.mock('path', async () => {
  const actual = await vi.importActual('path');
  return {
    ...actual,
    join: vi.fn()
  };
});

// Mock Logger
vi.mock('../../utils/Logger', () => ({
  Logger: class {
    info = vi.fn();
    error = vi.fn();
  }
}));

describe('SchemaRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSchema', () => {
    it('should return a schema for a valid ID', () => {
      // Mock the readFileSync to return a valid schema
      const mockSchema = { type: 'object', properties: {} };
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(mockSchema));
      (path.join as any).mockReturnValue('/path/to/schema.json');

      const schema = getSchema('protocol');
      expect(schema).toEqual(mockSchema);
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(path.join).toHaveBeenCalled();
    });

    it('should handle special case for mode schema', () => {
      // Mock the readFileSync to return a valid schema
      const mockSchema = { type: 'object', properties: {} };
      (fs.readFileSync as any).mockReturnValue(JSON.stringify(mockSchema));
      (path.join as any).mockReturnValue('/path/to/mode.schema.json');

      const schema = getSchema('mode');
      expect(schema).toEqual(mockSchema);
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(path.join).toHaveBeenCalled();
    });

    it('should return undefined for an invalid ID', () => {
      // Mock the readFileSync to throw an error
      (fs.readFileSync as any).mockImplementation(() => {
        throw new Error('File not found');
      });
      (path.join as any).mockReturnValue('/path/to/invalid.json');

      const schema = getSchema('invalid');
      expect(schema).toBeUndefined();
    });
  });

  describe('getAllSchemas', () => {
    it('should return all schemas', () => {
      // Mock the readdirSync to return a list of schema files
      (fs.readdirSync as any).mockReturnValue(['protocol.json', 'mode.schema.json', 'ritual.schema.json']);
      (path.join as any).mockImplementation((dir, file) => `/path/to/${file}`);

      // Mock the readFileSync to return valid schemas
      (fs.readFileSync as any).mockImplementation((path) => {
        if (path.includes('protocol.json')) {
          return JSON.stringify({ type: 'object', properties: { protocol: {} } });
        } else if (path.includes('mode.schema.json')) {
          return JSON.stringify({ type: 'object', properties: { mode: {} } });
        } else if (path.includes('ritual.schema.json')) {
          return JSON.stringify({ type: 'object', properties: { ritual: {} } });
        }
        return '{}';
      });

      const schemas = getAllSchemas();
      expect(Object.keys(schemas)).toContain('protocol');
      expect(Object.keys(schemas)).toContain('mode');
      expect(Object.keys(schemas)).toContain('ritual');
      expect(fs.readdirSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalledTimes(3);
    });

    it('should handle errors when reading schemas', () => {
      // Mock the readdirSync to return a list of schema files
      (fs.readdirSync as any).mockReturnValue(['protocol.json', 'invalid.json']);
      (path.join as any).mockImplementation((dir, file) => `/path/to/${file}`);

      // Mock the readFileSync to return valid schema for protocol but throw for invalid
      (fs.readFileSync as any).mockImplementation((path) => {
        if (path.includes('protocol.json')) {
          return JSON.stringify({ type: 'object', properties: { protocol: {} } });
        }
        throw new Error('Invalid JSON');
      });

      const schemas = getAllSchemas();
      expect(Object.keys(schemas)).toContain('protocol');
      expect(Object.keys(schemas)).not.toContain('invalid');
    });

    it('should handle errors when reading directory', () => {
      // Mock the readdirSync to throw an error
      (fs.readdirSync as any).mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const schemas = getAllSchemas();
      expect(Object.keys(schemas).length).toBe(0);
    });
  });
});
