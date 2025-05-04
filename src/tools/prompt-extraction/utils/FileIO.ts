/**
 * FileIO
 * 
 * Responsible for file operations related to prompt extraction
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../../utils/Logger';
import { FileIOInterface } from '../types';

export class FileIO implements FileIOInterface {
  private logger: Logger;
  
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Save prompts to output directory
   */
  public savePrompts(prompts: Record<string, string>, outputDir: string): void {
    try {
      this.ensureDirectoryExists(outputDir);
      
      // Save individual prompt files
      for (const [assistant, prompt] of Object.entries(prompts)) {
        const filePath = path.join(outputDir, `${assistant}-prompt.md`);
        fs.writeFileSync(filePath, prompt);
        this.logger.info(`Saved prompt for ${assistant} to ${filePath}`);
      }
      
      // Save combined prompts file
      const combinedContent = Object.entries(prompts)
        .map(([assistant, prompt]) => `## ${assistant}\n\n${prompt}\n\n---\n`)
        .join('\n');
      
      const combinedPath = path.join(outputDir, 'all-assistant-prompts.md');
      fs.writeFileSync(combinedPath, combinedContent);
      this.logger.info(`Saved combined prompts to ${combinedPath}`);
    } catch (error) {
      this.logger.error(`Failed to save prompts: ${error}`);
    }
  }

  /**
   * Ensure the output directory exists
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
