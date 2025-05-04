import * as fs from 'fs';
import { Logger } from '../../../utils/Logger';
import { Frontmatter, FrontmatterParseResult } from '../types';

/**
 * Class for parsing YAML frontmatter from markdown files
 */
export class FrontmatterParser {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Parse frontmatter from a markdown file
   */
  public parseFile(filePath: string): FrontmatterParseResult {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return this.parseContent(content);
    } catch (error) {
      this.logger.error(`Failed to parse frontmatter from ${filePath}: ${error}`);
      return {
        frontmatter: null,
        content: '',
        hasFrontmatter: false
      };
    }
  }

  /**
   * Parse frontmatter from a string
   */
  public parseContent(content: string): FrontmatterParseResult {
    // Check if the content starts with frontmatter delimiter
    if (!content.startsWith('---')) {
      return {
        frontmatter: null,
        content,
        hasFrontmatter: false
      };
    }

    try {
      // Find the end of the frontmatter
      const endIndex = content.indexOf('---', 3);
      if (endIndex === -1) {
        return {
          frontmatter: null,
          content,
          hasFrontmatter: false
        };
      }

      // Extract the frontmatter and content
      const frontmatterStr = content.substring(3, endIndex).trim();
      const remainingContent = content.substring(endIndex + 3).trim();

      // Parse the frontmatter as YAML
      const frontmatter = this.parseYaml(frontmatterStr);

      return {
        frontmatter,
        content: remainingContent,
        hasFrontmatter: true
      };
    } catch (error) {
      this.logger.error(`Failed to parse frontmatter: ${error}`);
      return {
        frontmatter: null,
        content,
        hasFrontmatter: false
      };
    }
  }

  /**
   * Parse YAML string into an object
   */
  private parseYaml(yamlStr: string): Frontmatter | null {
    try {
      // Simple YAML parser for frontmatter
      // In a real implementation, you would use a library like js-yaml
      const lines = yamlStr.split('\n');
      const frontmatter: Record<string, any> = {};

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex === -1) continue;

        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine.substring(colonIndex + 1).trim();

        // Remove quotes if present
        frontmatter[key] = value.replace(/^["'](.*)["']$/, '$1');
      }

      // Validate required fields
      if (!this.validateFrontmatter(frontmatter)) {
        return null;
      }

      return frontmatter as Frontmatter;
    } catch (error) {
      this.logger.error(`Failed to parse YAML: ${error}`);
      return null;
    }
  }

  /**
   * Validate that the frontmatter has all required fields
   */
  private validateFrontmatter(frontmatter: Record<string, any>): boolean {
    const requiredFields = ['agent', 'purpose', 'id', 'version'];

    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        this.logger.warn(`Missing required frontmatter field: ${field}`);
        return false;
      }
    }

    return true;
  }
}
