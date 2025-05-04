/**
 * Type definitions for the Assistant Prompt Extraction Tool
 */

/**
 * Represents an assistant defined in .cursorrules
 */
export interface Assistant {
  name: string;
  description: string;
  promptTemplate?: string;
}

/**
 * Represents frontmatter data in a prompt template
 */
export interface Frontmatter {
  agent: string;
  purpose: string;
  id: string;
  version: string;
  [key: string]: any;
}

/**
 * Result of frontmatter parsing
 */
export interface FrontmatterParseResult {
  frontmatter: Frontmatter | null;
  content: string;
  hasFrontmatter: boolean;
}

/**
 * Represents an extracted prompt from a conversation log
 */
export interface ExtractedPrompt {
  assistant: string;
  prompt: string;
  lineStart: number;
  lineEnd: number;
}

/**
 * Interface for prompt extraction functionality
 */
export interface PromptExtractorInterface {
  extractPromptsFromConversation(filePath: string): ExtractedPrompt[];
  extractPromptsFromTemplates(templatesDir: string): ExtractedPrompt[];
}

/**
 * Interface for assistant registry functionality
 */
export interface AssistantRegistryInterface {
  loadAssistants(): Assistant[];
  getAssistants(): Assistant[];
}

/**
 * Interface for file I/O operations
 */
export interface FileIOInterface {
  savePrompts(prompts: Record<string, string>, outputDir: string): void;
}

/**
 * Interface for project analysis
 */
export interface ProjectAnalyzerInterface {
  getProjectState(): string;
}

/**
 * Interface for the main assistant prompt extractor
 */
export interface AssistantPromptExtractorInterface {
  extractPromptsFromConversation(filePath: string): ExtractedPrompt[];
  extractPromptsFromTemplates(templatesDir: string): ExtractedPrompt[];
  generateMissingPrompts(existingPrompts: ExtractedPrompt[], projectState: string): Record<string, string>;
  savePrompts(prompts: Record<string, string>, outputDir: string): void;
  run(conversationPath: string, outputDir: string, templatesDir?: string): void;
}
