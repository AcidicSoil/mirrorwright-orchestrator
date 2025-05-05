import { Logger } from '../utils/Logger';
import { CUActionRequest, CUActionType } from '../types/cuaction';

/**
 * Interface for a router that detects CUA intents in prompts
 */
export interface CUAIntentRouter {
  /**
   * Detect if a prompt contains a CUA intent
   * @param prompt The prompt to analyze
   * @returns Whether the prompt contains a CUA intent
   */
  detectCUAIntent(prompt: string): boolean;

  /**
   * Extract a CUA action request from a prompt
   * @param prompt The prompt to extract from
   * @param agentId The ID of the agent making the request
   * @returns The extracted CUA action request, or null if no valid request could be extracted
   */
  extractCUARequest(prompt: string, agentId: string): CUActionRequest | null;
}

/**
 * Configuration for the CUA intent router
 */
export interface CUAIntentRouterConfig {
  /**
   * Keywords that indicate file operations
   */
  fileKeywords?: string[];

  /**
   * Keywords that indicate command execution
   */
  commandKeywords?: string[];

  /**
   * Keywords that indicate web browsing
   */
  webKeywords?: string[];

  /**
   * Minimum confidence threshold for intent detection (0-1)
   */
  confidenceThreshold?: number;
}

/**
 * Default implementation of the CUA intent router
 */
export class DefaultCUAIntentRouter implements CUAIntentRouter {
  private logger: Logger;
  private config: CUAIntentRouterConfig;

  // Default keywords for intent detection
  private static readonly DEFAULT_FILE_KEYWORDS = [
    'open file', 'read file', 'write file', 'create file', 'edit file',
    'save file', 'delete file', 'append to file'
  ];

  private static readonly DEFAULT_COMMAND_KEYWORDS = [
    'run command', 'execute command', 'run script', 'execute script',
    'shell command', 'terminal command', 'command line'
  ];

  private static readonly DEFAULT_WEB_KEYWORDS = [
    'browse web', 'open url', 'visit website', 'web page', 'navigate to'
  ];

  constructor(config: CUAIntentRouterConfig = {}) {
    this.config = {
      fileKeywords: config.fileKeywords || DefaultCUAIntentRouter.DEFAULT_FILE_KEYWORDS,
      commandKeywords: config.commandKeywords || DefaultCUAIntentRouter.DEFAULT_COMMAND_KEYWORDS,
      webKeywords: config.webKeywords || DefaultCUAIntentRouter.DEFAULT_WEB_KEYWORDS,
      confidenceThreshold: config.confidenceThreshold || 0.7
    };
    this.logger = new Logger();
  }

  detectCUAIntent(prompt: string): boolean {
    const normalizedPrompt = prompt.toLowerCase();
    
    // Check for file operation keywords
    const hasFileIntent = this.config.fileKeywords!.some(keyword => 
      normalizedPrompt.includes(keyword.toLowerCase())
    );
    
    // Check for command execution keywords
    const hasCommandIntent = this.config.commandKeywords!.some(keyword => 
      normalizedPrompt.includes(keyword.toLowerCase())
    );
    
    // Check for web browsing keywords
    const hasWebIntent = this.config.webKeywords!.some(keyword => 
      normalizedPrompt.includes(keyword.toLowerCase())
    );
    
    return hasFileIntent || hasCommandIntent || hasWebIntent;
  }

  extractCUARequest(prompt: string, agentId: string): CUActionRequest | null {
    const normalizedPrompt = prompt.toLowerCase();
    
    // Try to determine the action type
    let actionType: CUActionType | null = null;
    
    // Check for file operations
    if (this.config.fileKeywords!.some(keyword => normalizedPrompt.includes(keyword.toLowerCase()))) {
      // Determine if it's a read or write operation
      if (normalizedPrompt.includes('open') || normalizedPrompt.includes('read')) {
        actionType = CUActionType.OPEN_FILE;
      } else if (normalizedPrompt.includes('write') || normalizedPrompt.includes('create') || 
                normalizedPrompt.includes('save') || normalizedPrompt.includes('edit')) {
        actionType = CUActionType.WRITE_FILE;
      }
    }
    
    // Check for command execution
    else if (this.config.commandKeywords!.some(keyword => normalizedPrompt.includes(keyword.toLowerCase()))) {
      actionType = CUActionType.RUN_COMMAND;
    }
    
    // Check for web browsing
    else if (this.config.webKeywords!.some(keyword => normalizedPrompt.includes(keyword.toLowerCase()))) {
      actionType = CUActionType.BROWSE_WEB;
    }
    
    // If no action type could be determined, return null
    if (!actionType) {
      return null;
    }
    
    // TODO: Extract payload details from the prompt
    // This would require more sophisticated NLP to extract file paths, command arguments, etc.
    // For now, we'll just create a placeholder payload
    
    const request: CUActionRequest = {
      action_type: actionType,
      payload: this.createPlaceholderPayload(actionType, prompt),
      context: {
        agent_id: agentId,
        timestamp: new Date().toISOString()
      }
    };
    
    return request;
  }

  /**
   * Create a placeholder payload for a CUA action
   * @param actionType The type of action
   * @param prompt The original prompt
   * @returns A placeholder payload
   */
  private createPlaceholderPayload(actionType: CUActionType, prompt: string): any {
    switch (actionType) {
      case CUActionType.OPEN_FILE:
        return {
          path: 'placeholder_path.txt'
        };
      
      case CUActionType.WRITE_FILE:
        return {
          path: 'placeholder_path.txt',
          content: 'Placeholder content'
        };
      
      case CUActionType.RUN_COMMAND:
        return {
          command: 'echo',
          args: ['Placeholder command']
        };
      
      case CUActionType.BROWSE_WEB:
        return {
          url: 'https://example.com'
        };
      
      default:
        return {};
    }
  }
}
