import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FrontmatterParser } from '../../../../src/tools/prompt-extraction/extractors/FrontmatterParser';
import * as fs from 'fs';

// Mock fs
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

describe('FrontmatterParser', () => {
  let parser: FrontmatterParser;
  
  beforeEach(() => {
    parser = new FrontmatterParser();
    vi.resetAllMocks();
  });
  
  describe('parseContent', () => {
    it('should return null frontmatter for content without frontmatter', () => {
      const content = '# Test Content\n\nThis is a test.';
      const result = parser.parseContent(content);
      
      expect(result.frontmatter).toBeNull();
      expect(result.content).toBe(content);
      expect(result.hasFrontmatter).toBe(false);
    });
    
    it('should parse valid frontmatter', () => {
      const content = `---
agent: cline
purpose: architecture
id: test-prompt
version: 1.0.0
---

# Test Content

This is a test.`;
      
      const result = parser.parseContent(content);
      
      expect(result.frontmatter).toEqual({
        agent: 'cline',
        purpose: 'architecture',
        id: 'test-prompt',
        version: '1.0.0'
      });
      expect(result.content).toBe('# Test Content\n\nThis is a test.');
      expect(result.hasFrontmatter).toBe(true);
    });
    
    it('should return null frontmatter for invalid YAML', () => {
      const content = `---
agent: cline
purpose: architecture
id: test-prompt
version: 1.0.0
- invalid yaml
---

# Test Content`;
      
      const result = parser.parseContent(content);
      
      expect(result.frontmatter).toBeNull();
      expect(result.content).toBe(content);
      expect(result.hasFrontmatter).toBe(false);
    });
    
    it('should return null frontmatter for missing required fields', () => {
      const content = `---
agent: cline
purpose: architecture
---

# Test Content`;
      
      const result = parser.parseContent(content);
      
      expect(result.frontmatter).toBeNull();
      expect(result.content).toBe('# Test Content');
      expect(result.hasFrontmatter).toBe(true);
    });
  });
  
  describe('parseFile', () => {
    it('should call readFileSync and parseContent', () => {
      const filePath = 'test.md';
      const fileContent = '# Test Content';
      
      (fs.readFileSync as any).mockReturnValue(fileContent);
      
      const parseContentSpy = vi.spyOn(parser, 'parseContent');
      parseContentSpy.mockReturnValue({
        frontmatter: null,
        content: fileContent,
        hasFrontmatter: false
      });
      
      const result = parser.parseFile(filePath);
      
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
      expect(parseContentSpy).toHaveBeenCalledWith(fileContent);
      expect(result).toEqual({
        frontmatter: null,
        content: fileContent,
        hasFrontmatter: false
      });
    });
    
    it('should handle file read errors', () => {
      const filePath = 'test.md';
      
      (fs.readFileSync as any).mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const result = parser.parseFile(filePath);
      
      expect(result).toEqual({
        frontmatter: null,
        content: '',
        hasFrontmatter: false
      });
    });
  });
});
