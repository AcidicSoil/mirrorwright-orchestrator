import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolve } from 'path';
import * as fs from 'fs';
import { AssistantPromptExtractor } from '../../../src/tools/prompt-extraction';

// Mock the Logger class
vi.mock('../../../src/utils/Logger', () => ({
  Logger: class {
    info() {}
    error() {}
  }
}));

// Mock the fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn((path) => {
    if (path.includes('mock-cursorrules')) {
      return `# Mock .cursorrules for testing

# Assistants

assistants:
  augment: "Test assistant for augmentation tasks"
  cline: "Test assistant for cline tasks"
  strategicai: "Test assistant for strategic AI tasks"`;
    } else if (path.includes('sample-conversation.md')) {
      return `# Cursor augment: Test Prompt

This is a test prompt for the augment assistant.
It should be extracted correctly.
Multiple lines should be preserved.

Prompt for Cursor cline: Another Test

This is another test prompt for the cline assistant.
It should also be extracted correctly.`;
    }
    return '';
  })
}));

describe('AssistantPromptExtractor Integration', () => {
  const fixturesPath = resolve(__dirname, '../../fixtures/prompt-extraction');
  const sampleConversationPath = resolve(fixturesPath, 'sample-conversation.md');
  const mockCursorRulesPath = resolve(fixturesPath, 'mock-cursorrules');
  const outputDir = 'test-output';

  beforeEach(() => {
    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should run the full extraction process', () => {
    const extractor = new AssistantPromptExtractor(mockCursorRulesPath);
    extractor.run(sampleConversationPath, outputDir);

    // Check that writeFileSync was called for each assistant
    expect(fs.writeFileSync).toHaveBeenCalledTimes(4); // 3 assistants + 1 combined file

    // Check that the files were written for each assistant
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('augment-prompt.md'),
      expect.any(String)
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('cline-prompt.md'),
      expect.any(String)
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('strategicai-prompt.md'),
      expect.any(String)
    );

    // Check that the combined file was written
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('all-assistant-prompts.md'),
      expect.any(String)
    );
  });
});
