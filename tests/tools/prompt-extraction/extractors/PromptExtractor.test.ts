import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromptExtractor } from '../../../../src/tools/prompt-extraction/extractors/PromptExtractor';
import { FrontmatterParser } from '../../../../src/tools/prompt-extraction/extractors/FrontmatterParser';
import * as fs from 'fs';

// Mock fs and FrontmatterParser
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
}));

vi.mock('../../../../src/tools/prompt-extraction/extractors/FrontmatterParser', () => ({
  FrontmatterParser: vi.fn().mockImplementation(() => ({
    parseFile: vi.fn(),
    parseContent: vi.fn(),
  })),
}));

describe('PromptExtractor', () => {
  let extractor: PromptExtractor;
  let mockFrontmatterParser: any;
  
  beforeEach(() => {
    vi.resetAllMocks();
    extractor = new PromptExtractor();
    mockFrontmatterParser = (extractor as any).frontmatterParser;
  });
  
  describe('extractPromptsFromConversation', () => {
    it('should use frontmatter when available', () => {
      const filePath = 'test.md';
      const fileContent = `---
agent: cline
purpose: architecture
id: test-prompt
version: 1.0.0
---

# Test Content`;
      
      (fs.readFileSync as any).mockReturnValue(fileContent);
      
      mockFrontmatterParser.parseFile.mockReturnValue({
        frontmatter: {
          agent: 'cline',
          purpose: 'architecture',
          id: 'test-prompt',
          version: '1.0.0'
        },
        content: '# Test Content',
        hasFrontmatter: true
      });
      
      const result = extractor.extractPromptsFromConversation(filePath);
      
      expect(mockFrontmatterParser.parseFile).toHaveBeenCalledWith(filePath);
      expect(result).toEqual([{
        assistant: 'cline',
        prompt: fileContent,
        lineStart: 0,
        lineEnd: fileContent.split('\n').length
      }]);
    });
    
    it('should fall back to regex pattern matching when no frontmatter', () => {
      const filePath = 'test.md';
      const fileContent = `# Cursor Cline: Test Prompt

This is a test prompt.`;
      
      (fs.readFileSync as any).mockReturnValue(fileContent);
      
      mockFrontmatterParser.parseFile.mockReturnValue({
        frontmatter: null,
        content: fileContent,
        hasFrontmatter: false
      });
      
      const result = extractor.extractPromptsFromConversation(filePath);
      
      expect(mockFrontmatterParser.parseFile).toHaveBeenCalledWith(filePath);
      expect(result).toEqual([{
        assistant: 'cline',
        prompt: fileContent,
        lineStart: 0,
        lineEnd: 2
      }]);
    });
    
    it('should handle file read errors', () => {
      const filePath = 'test.md';
      
      (fs.readFileSync as any).mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const result = extractor.extractPromptsFromConversation(filePath);
      
      expect(result).toEqual([]);
    });
  });
  
  describe('extractPromptsFromTemplates', () => {
    it('should extract prompts from all markdown files in a directory', () => {
      const templatesDir = 'prompt_templates';
      const files = ['file1.md', 'file2.md', 'file3.txt'];
      
      (fs.readdirSync as any).mockReturnValue(files);
      
      const extractSpy = vi.spyOn(extractor, 'extractPromptsFromConversation');
      extractSpy.mockReturnValueOnce([{
        assistant: 'cline',
        prompt: 'Prompt 1',
        lineStart: 0,
        lineEnd: 1
      }]);
      
      extractSpy.mockReturnValueOnce([{
        assistant: 'augment',
        prompt: 'Prompt 2',
        lineStart: 0,
        lineEnd: 1
      }]);
      
      const result = extractor.extractPromptsFromTemplates(templatesDir);
      
      expect(fs.readdirSync).toHaveBeenCalledWith(templatesDir);
      expect(extractSpy).toHaveBeenCalledTimes(2);
      expect(extractSpy).toHaveBeenCalledWith(`${templatesDir}/file1.md`);
      expect(extractSpy).toHaveBeenCalledWith(`${templatesDir}/file2.md`);
      expect(result).toEqual([
        {
          assistant: 'cline',
          prompt: 'Prompt 1',
          lineStart: 0,
          lineEnd: 1
        },
        {
          assistant: 'augment',
          prompt: 'Prompt 2',
          lineStart: 0,
          lineEnd: 1
        }
      ]);
    });
    
    it('should handle directory read errors', () => {
      const templatesDir = 'prompt_templates';
      
      (fs.readdirSync as any).mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const result = extractor.extractPromptsFromTemplates(templatesDir);
      
      expect(result).toEqual([]);
    });
  });
});
