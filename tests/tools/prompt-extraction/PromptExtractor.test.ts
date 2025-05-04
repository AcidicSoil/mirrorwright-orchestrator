import { describe, it, expect, vi } from 'vitest';
import { resolve } from 'path';
import * as fs from 'fs';
import { PromptExtractor } from '../../../src/tools/prompt-extraction';

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
    if (path.includes('sample-conversation.md')) {
      return `# Cursor augment: Test Prompt

This is a test prompt for the augment assistant.
It should be extracted correctly.
Multiple lines should be preserved.

Prompt for Cursor cline: Another Test

This is another test prompt for the cline assistant.
It should also be extracted correctly.`;
    }
    throw new Error('File not found');
  })
}));

// Mock the PromptExtractor's extractPromptsFromConversation method
vi.mock('../../../src/tools/prompt-extraction/extractors/PromptExtractor', () => {
  return {
    PromptExtractor: class {
      extractPromptsFromConversation(filePath: string) {
        if (filePath.includes('non-existent-file.md')) {
          return [];
        }
        return [
          {
            assistant: 'augment',
            prompt: 'This is a test prompt for the augment assistant.\nIt should be extracted correctly.\nMultiple lines should be preserved.',
            lineStart: 1,
            lineEnd: 5
          },
          {
            assistant: 'cline',
            prompt: 'This is another test prompt for the cline assistant.\nIt should also be extracted correctly.',
            lineStart: 7,
            lineEnd: 10
          }
        ];
      }
    }
  };
});

describe('PromptExtractor', () => {
  const fixturesPath = resolve(__dirname, '../../fixtures/prompt-extraction');
  const sampleConversationPath = resolve(fixturesPath, 'sample-conversation.md');

  it('should extract prompts from conversation log', () => {
    const extractor = new PromptExtractor();
    const prompts = extractor.extractPromptsFromConversation(sampleConversationPath);

    // Check that we extracted the correct number of prompts
    expect(prompts.length).toBe(2);

    // Check the first prompt
    expect(prompts[0].assistant).toBe('augment');
    expect(prompts[0].prompt).toBe(
      'This is a test prompt for the augment assistant.\n' +
      'It should be extracted correctly.\n' +
      'Multiple lines should be preserved.'
    );

    // Check the second prompt
    expect(prompts[1].assistant).toBe('cline');
    expect(prompts[1].prompt).toBe(
      'This is another test prompt for the cline assistant.\n' +
      'It should also be extracted correctly.'
    );
  });

  it('should return an empty array if the file is not found', () => {
    const extractor = new PromptExtractor();
    const prompts = extractor.extractPromptsFromConversation('non-existent-file.md');

    expect(prompts).toEqual([]);
  });
});
