/**
 * AssistantRegistry
 * 
 * Responsible for loading and managing assistant definitions from .cursorrules
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../../utils/Logger';
import { Assistant, AssistantRegistryInterface } from '../types';

export class AssistantRegistry implements AssistantRegistryInterface {
  private logger: Logger;
  private assistants: Assistant[] = [];
  private cursorRulesPath: string;
  
  constructor(cursorRulesPath?: string) {
    this.logger = new Logger();
    this.cursorRulesPath = cursorRulesPath || path.resolve(process.cwd(), '.cursorrules');
    this.assistants = this.loadAssistants();
  }

  /**
   * Load assistant definitions from .cursorrules
   */
  public loadAssistants(): Assistant[] {
    try {
      const content = fs.readFileSync(this.cursorRulesPath, 'utf8');
      
      // Extract assistant definitions using regex
      const assistantSection = content.match(/assistants:([\s\S]*?)(?=\n\n|$)/)?.[1] || '';
      const assistantMatches = [...assistantSection.matchAll(/(\w+):\s*"([^"]+)"/g)];
      
      this.assistants = assistantMatches.map(match => ({
        name: match[1],
        description: match[2]
      }));
      
      return this.assistants;
    } catch (error) {
      this.logger.error(`Failed to load assistants from .cursorrules: ${error}`);
      return [];
    }
  }

  /**
   * Get the loaded assistants
   */
  public getAssistants(): Assistant[] {
    return this.assistants;
  }
}
