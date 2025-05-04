/**
 * PromptExtractor
 *
 * Responsible for extracting prompts from conversation logs and template files
 */

import * as fs from 'fs';
import { Logger } from '../../../utils/Logger';
import { ExtractedPrompt, PromptExtractorInterface } from '../types';
import { FrontmatterParser } from './FrontmatterParser';

export class PromptExtractor implements PromptExtractorInterface {
  private logger: Logger;
  private frontmatterParser: FrontmatterParser;
  private promptPatterns: RegExp[];

  constructor() {
    this.logger = new Logger();
    this.frontmatterParser = new FrontmatterParser();

    // Common patterns for assistant prompts in conversation logs
    this.promptPatterns = [
      /# Cursor (\w+):/i,
      /Prompt for Cursor (\w+):/i,
      /# (\w+): /i,
      /# Prompt for Cursor (\w+):/i
    ];
  }

  /**
   * Extract prompts from conversation log or template file
   */
  public extractPromptsFromConversation(filePath: string): ExtractedPrompt[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // First, check if the file has frontmatter
      const parseResult = this.frontmatterParser.parseFile(filePath);

      // If it has valid frontmatter, use that to extract the prompt
      if (parseResult.hasFrontmatter && parseResult.frontmatter) {
        const agent = parseResult.frontmatter.agent.toLowerCase();

        return [{
          assistant: agent,
          prompt: content,
          lineStart: 0,
          lineEnd: content.split('\n').length
        }];
      }

      // Otherwise, fall back to regex pattern matching
      return this.extractPromptsWithRegex(content);
    } catch (error) {
      this.logger.error(`Failed to extract prompts from ${filePath}: ${error}`);
      return [];
    }
  }

  /**
   * Extract prompts using regex patterns
   */
  private extractPromptsWithRegex(content: string): ExtractedPrompt[] {
    const lines = content.split('\n');
    const extractedPrompts: ExtractedPrompt[] = [];

    for (let i = 0; i < lines.length; i++) {
      for (const pattern of this.promptPatterns) {
        const match = lines[i].match(pattern);
        if (match) {
          const assistant = match[1].toLowerCase();
          let promptContent = lines[i] + '\n';
          let j = i + 1;

          // Collect prompt content until we hit a markdown code block end or section break
          const isCodeBlock = lines[i].includes('```');
          let inCodeBlock = isCodeBlock;

          while (j < lines.length) {
            // Check for section breaks or end of content
            if (!inCodeBlock &&
                (lines[j].startsWith('## ') ||
                 lines[j].startsWith('---') ||
                 (lines[j].trim() === '' && j+1 < lines.length && lines[j+1].trim() === ''))) {
              break;
            }

            // Track code blocks
            if (lines[j].includes('```')) {
              inCodeBlock = !inCodeBlock;
            }

            promptContent += lines[j] + '\n';
            j++;
          }

          if (promptContent.trim()) {
            extractedPrompts.push({
              assistant,
              prompt: promptContent.trim(),
              lineStart: i,
              lineEnd: j
            });
          }

          // Skip to the end of this prompt
          i = j;
          break;
        }
      }
    }

    return extractedPrompts;
  }

  /**
   * Extract prompts from a directory of template files
   */
  public extractPromptsFromTemplates(templatesDir: string): ExtractedPrompt[] {
    try {
      const files = fs.readdirSync(templatesDir)
        .filter(file => file.endsWith('.md'));

      const extractedPrompts: ExtractedPrompt[] = [];

      for (const file of files) {
        const filePath = `${templatesDir}/${file}`;
        const filePrompts = this.extractPromptsFromConversation(filePath);
        extractedPrompts.push(...filePrompts);
      }

      return extractedPrompts;
    } catch (error) {
      this.logger.error(`Failed to extract prompts from templates: ${error}`);
      return [];
    }
  }
}
