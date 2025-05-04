#!/usr/bin/env node

/**
 * CLI entry point for the Assistant Prompt Extraction Tool
 */

import { AssistantPromptExtractor } from './AssistantPromptExtractor';

/**
 * Main CLI function
 */
function main() {
  const conversationPath = process.argv[2] || 'extractAssistantPrompts.md';
  const outputDir = process.argv[3] || 'assistant-prompts';
  
  const extractor = new AssistantPromptExtractor();
  extractor.run(conversationPath, outputDir);
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main();
}

// Export the main function for programmatic usage
export { main };
