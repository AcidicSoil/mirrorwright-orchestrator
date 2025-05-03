/**
 * Assistant Prompt Extraction Tool
 * 
 * This tool automates the extraction and generation of assistant prompts from conversation logs
 * for the Mirrorwright Orchestrator multi-agent system.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/Logger';

// Define assistant types from .cursorrules
interface Assistant {
  name: string;
  description: string;
  promptTemplate?: string;
}

interface ExtractedPrompt {
  assistant: string;
  prompt: string;
  lineStart: number;
  lineEnd: number;
}

interface AssistantPromptExtractor {
  extractPromptsFromConversation(filePath: string): ExtractedPrompt[];
  generateMissingPrompts(existingPrompts: ExtractedPrompt[], projectState: string): Record<string, string>;
  savePrompts(prompts: Record<string, string>, outputDir: string): void;
  run(conversationPath: string, outputDir: string): void;
}

export class DefaultAssistantPromptExtractor implements AssistantPromptExtractor {
  private logger: Logger;
  private assistants: Assistant[];
  
  constructor() {
    this.logger = new Logger();
    this.assistants = this.loadAssistantsFromCursorRules();
  }

  /**
   * Load assistant definitions from .cursorrules
   */
  private loadAssistantsFromCursorRules(): Assistant[] {
    try {
      const cursorRulesPath = path.resolve(process.cwd(), '.cursorrules');
      const content = fs.readFileSync(cursorRulesPath, 'utf8');
      
      // Extract assistant definitions using regex
      const assistantSection = content.match(/assistants:([\s\S]*?)(?=\n\n|$)/)?.[1] || '';
      const assistantMatches = [...assistantSection.matchAll(/(\w+):\s*"([^"]+)"/g)];
      
      return assistantMatches.map(match => ({
        name: match[1],
        description: match[2]
      }));
    } catch (error) {
      this.logger.error(`Failed to load assistants from .cursorrules: ${error}`);
      return [];
    }
  }

  /**
   * Extract existing prompts from conversation log
   */
  public extractPromptsFromConversation(filePath: string): ExtractedPrompt[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const extractedPrompts: ExtractedPrompt[] = [];
      
      // Common patterns for assistant prompts in conversation logs
      const promptPatterns = [
        /# Cursor (\w+):/i,
        /Prompt for Cursor (\w+):/i
      ];
      
      for (let i = 0; i < lines.length; i++) {
        for (const pattern of promptPatterns) {
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

  /**
   * Generate missing prompts based on project state and assistant roles
   */
  public generateMissingPrompts(
    existingPrompts: ExtractedPrompt[], 
    projectState: string
  ): Record<string, string> {
    const promptsByAssistant: Record<string, string> = {};
    
    // First, add all existing prompts
    for (const prompt of existingPrompts) {
      promptsByAssistant[prompt.assistant] = prompt.prompt;
    }
    
    // Identify missing assistants
    const missingAssistants = this.assistants.filter(
      assistant => !promptsByAssistant[assistant.name]
    );
    
    // Generate prompts for missing assistants based on their role
    for (const assistant of missingAssistants) {
      this.logger.info(`Generating prompt for missing assistant: ${assistant.name}`);
      
      // Use assistant description to generate a relevant prompt
      // In a real implementation, this would use an LLM to generate the prompt
      // based on the project state and assistant description
      promptsByAssistant[assistant.name] = this.generatePromptTemplate(
        assistant.name, 
        assistant.description,
        projectState
      );
    }
    
    return promptsByAssistant;
  }

  /**
   * Generate a prompt template based on assistant role
   * In production, this would call an LLM to generate the prompt
   */
  private generatePromptTemplate(
    assistantName: string, 
    description: string,
    projectState: string
  ): string {
    // This is a placeholder - in production this would call an LLM
    return `# Cursor ${assistantName}: Auto-generated Prompt

Based on role: "${description}"

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.
`;
  }

  /**
   * Save prompts to output directory
   */
  public savePrompts(prompts: Record<string, string>, outputDir: string): void {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
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
   * Run the full extraction and generation process
   */
  public run(conversationPath: string, outputDir: string): void {
    this.logger.info(`Extracting prompts from ${conversationPath}`);
    
    // Extract existing prompts
    const extractedPrompts = this.extractPromptsFromConversation(conversationPath);
    this.logger.info(`Found ${extractedPrompts.length} existing prompts`);
    
    // Get project state (in production, this would analyze the codebase)
    const projectState = this.getProjectState();
    
    // Generate missing prompts
    const allPrompts = this.generateMissingPrompts(extractedPrompts, projectState);
    this.logger.info(`Generated prompts for ${Object.keys(allPrompts).length} assistants`);
    
    // Save prompts
    this.savePrompts(allPrompts, outputDir);
    this.logger.info('Assistant prompt extraction complete');
  }

  /**
   * Get current project state
   * In production, this would analyze the codebase
   */
  private getProjectState(): string {
    // This is a placeholder - in production this would analyze the codebase
    return "Current project state would be analyzed here";
  }
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const conversationPath = process.argv[2] || 'extractAssistantPrompts.md';
  const outputDir = process.argv[3] || 'assistant-prompts';
  
  const extractor = new DefaultAssistantPromptExtractor();
  extractor.run(conversationPath, outputDir);
}
