/**
 * Assistant Prompt Extraction Tool
 * 
 * This tool automates the extraction and generation of assistant prompts from conversation logs
 * for the Mirrorwright Orchestrator multi-agent system.
 */

// Export types
export * from './types';

// Export main extractor
export { AssistantPromptExtractor } from './AssistantPromptExtractor';

// Export individual components
export { AssistantRegistry } from './extractors/AssistantRegistry';
export { PromptExtractor } from './extractors/PromptExtractor';
export { FileIO } from './utils/FileIO';
export { ProjectAnalyzer } from './utils/ProjectAnalyzer';
