/**
 * PromptExtractor
 * 
 * Responsible for extracting prompts from conversation logs
 */

import * as fs from 'fs';
import { Logger } from '../../../utils/Logger';
import { ExtractedPrompt, PromptExtractorInterface } from '../types';

export class PromptExtractor implements PromptExtractorInterface {
  private logger: Logger;
  private promptPatterns: RegExp[];
  
  constructor() {
    this.logger = new Logger();
    // Common patterns for assistant prompts in conversation logs
    this.promptPatterns = [
      /# Cursor (\w+):/i,
      /Prompt for Cursor (\w+):/i
    ];
  }

  /**
   * Extract existing prompts from conversation log
   */
  public extractPromptsFromConversation(filePath: string): ExtractedPrompt[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const extractedPrompts: ExtractedPrompt[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        for (const pattern of this.promptPatterns) {
          const match = lines[i].match(pattern);
          if (match) {
            const assistant = match[1].toLowerCase();
            let promptContent = '';
            let j = i + 1;
            
            // Collect prompt content until we hit an empty line or end of file
            while (j < lines.length && lines[j].trim() !== '') {
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
    } catch (error) {
      this.logger.error(`Failed to extract prompts from ${filePath}: ${error}`);
      return [];
    }
  }
}
