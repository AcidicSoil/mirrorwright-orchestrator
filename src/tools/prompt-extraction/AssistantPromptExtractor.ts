/**
 * AssistantPromptExtractor
 * 
 * Main class that orchestrates the prompt extraction process
 */

import { Logger } from '../../utils/Logger';
import { 
  Assistant, 
  ExtractedPrompt, 
  AssistantPromptExtractorInterface 
} from './types';
import { AssistantRegistry } from './extractors/AssistantRegistry';
import { PromptExtractor } from './extractors/PromptExtractor';
import { FileIO } from './utils/FileIO';
import { ProjectAnalyzer } from './utils/ProjectAnalyzer';

export class AssistantPromptExtractor implements AssistantPromptExtractorInterface {
  private logger: Logger;
  private assistantRegistry: AssistantRegistry;
  private promptExtractor: PromptExtractor;
  private fileIO: FileIO;
  private projectAnalyzer: ProjectAnalyzer;
  
  constructor(cursorRulesPath?: string) {
    this.logger = new Logger();
    this.assistantRegistry = new AssistantRegistry(cursorRulesPath);
    this.promptExtractor = new PromptExtractor();
    this.fileIO = new FileIO();
    this.projectAnalyzer = new ProjectAnalyzer();
  }

  /**
   * Extract prompts from conversation log
   */
  public extractPromptsFromConversation(filePath: string): ExtractedPrompt[] {
    return this.promptExtractor.extractPromptsFromConversation(filePath);
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
    const assistants = this.assistantRegistry.getAssistants();
    const missingAssistants = assistants.filter(
      assistant => !promptsByAssistant[assistant.name]
    );
    
    // Generate prompts for missing assistants based on their role
    for (const assistant of missingAssistants) {
      this.logger.info(`Generating prompt for missing assistant: ${assistant.name}`);
      
      // Use assistant description to generate a relevant prompt
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
    this.fileIO.savePrompts(prompts, outputDir);
  }

  /**
   * Run the full extraction and generation process
   */
  public run(conversationPath: string, outputDir: string): void {
    this.logger.info(`Extracting prompts from ${conversationPath}`);
    
    // Extract existing prompts
    const extractedPrompts = this.extractPromptsFromConversation(conversationPath);
    this.logger.info(`Found ${extractedPrompts.length} existing prompts`);
    
    // Get project state
    const projectState = this.projectAnalyzer.getProjectState();
    
    // Generate missing prompts
    const allPrompts = this.generateMissingPrompts(extractedPrompts, projectState);
    this.logger.info(`Generated prompts for ${Object.keys(allPrompts).length} assistants`);
    
    // Save prompts
    this.savePrompts(allPrompts, outputDir);
    this.logger.info('Assistant prompt extraction complete');
  }
}
