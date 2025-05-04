import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolve } from 'path';
import * as fs from 'fs';
import { AssistantRegistry } from '../../../src/tools/prompt-extraction';

// Mock the Logger class
vi.mock('../../../src/utils/Logger', () => ({
  Logger: class {
    info() {}
    error() {}
  }
}));

// Mock fs.readFileSync
vi.mock('fs', () => ({
  readFileSync: vi.fn((path) => {
    if (path.includes('mock-cursorrules')) {
      return `# Mock .cursorrules for testing

# Assistants

assistants:
  augment: "Test assistant for augmentation tasks"
  cline: "Test assistant for cline tasks"
  strategicai: "Test assistant for strategic AI tasks"`;
    }
    throw new Error('File not found');
  })
}));

describe('AssistantRegistry', () => {
  const fixturesPath = resolve(__dirname, '../../fixtures/prompt-extraction');
  let registry: AssistantRegistry;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Use the mock .cursorrules file for testing
    registry = new AssistantRegistry(resolve(fixturesPath, 'mock-cursorrules'));
  });

  it('should load assistants from .cursorrules', () => {
    const assistants = registry.getAssistants();

    // Check that we loaded the correct number of assistants
    expect(assistants.length).toBe(3);

    // Check that the assistants have the correct properties
    expect(assistants[0].name).toBe('augment');
    expect(assistants[0].description).toBe('Test assistant for augmentation tasks');

    expect(assistants[1].name).toBe('cline');
    expect(assistants[1].description).toBe('Test assistant for cline tasks');

    expect(assistants[2].name).toBe('strategicai');
    expect(assistants[2].description).toBe('Test assistant for strategic AI tasks');
  });

  it('should return an empty array if .cursorrules is not found', () => {
    // Mock readFileSync to throw an error
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    const invalidRegistry = new AssistantRegistry('non-existent-file');
    const assistants = invalidRegistry.getAssistants();

    expect(assistants).toEqual([]);
  });
});
