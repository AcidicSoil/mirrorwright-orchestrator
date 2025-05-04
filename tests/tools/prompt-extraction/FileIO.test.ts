import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { FileIO } from '../../../src/tools/prompt-extraction';

// Mock the Logger class
vi.mock('../../../src/utils/Logger', () => ({
  Logger: class {
    info() {}
    error() {}
  }
}));

// Mock the fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn()
}));

describe('FileIO', () => {
  const mockPrompts = {
    'assistant1': 'Prompt for assistant 1',
    'assistant2': 'Prompt for assistant 2'
  };

  const outputDir = 'test-output';

  beforeEach(() => {
    // Reset mock function calls
    vi.clearAllMocks();

    // Mock existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);
  });

  it('should save individual prompt files', () => {
    const fileIO = new FileIO();
    fileIO.savePrompts(mockPrompts, outputDir);

    // Check that writeFileSync was called for each prompt
    expect(fs.writeFileSync).toHaveBeenCalledTimes(3); // 2 individual files + 1 combined file

    // Check that the individual files were written correctly
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(outputDir, 'assistant1-prompt.md'),
      'Prompt for assistant 1'
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(outputDir, 'assistant2-prompt.md'),
      'Prompt for assistant 2'
    );
  });

  it('should save a combined prompts file', () => {
    const fileIO = new FileIO();
    fileIO.savePrompts(mockPrompts, outputDir);

    // Check that the combined file was written correctly
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(outputDir, 'all-assistant-prompts.md'),
      expect.stringContaining('## assistant1')
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(outputDir, 'all-assistant-prompts.md'),
      expect.stringContaining('## assistant2')
    );
  });

  it('should create the output directory if it does not exist', () => {
    // Mock existsSync to return false
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const fileIO = new FileIO();
    fileIO.savePrompts(mockPrompts, outputDir);

    // Check that mkdirSync was called
    expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
  });
});
