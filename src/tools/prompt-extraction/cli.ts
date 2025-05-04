#!/usr/bin/env node

/**
 * CLI entry point for the Assistant Prompt Extraction Tool
 */

import { AssistantPromptExtractor } from './AssistantPromptExtractor';

/**
 * Main CLI function
 */
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Assistant Prompt Extraction Tool

Usage:
  ts-node src/tools/prompt-extraction/cli.ts [conversationPath] [outputDir] [options]

Arguments:
  conversationPath       Path to conversation log file (default: extractAssistantPrompts.md)
  outputDir              Directory to save extracted prompts (default: assistant-prompts)

Options:
  --templates-dir, -t    Directory containing prompt template files with frontmatter
  --validate, -v         Validate frontmatter in template files
  --help, -h             Show this help message
`);
    return;
  }

  // Parse positional arguments
  let conversationPath = 'extractAssistantPrompts.md';
  let outputDir = 'assistant-prompts';
  let templatesDir: string | undefined;

  // Handle positional arguments
  if (args.length > 0 && !args[0].startsWith('-')) {
    conversationPath = args[0];
  }

  if (args.length > 1 && !args[1].startsWith('-')) {
    outputDir = args[1];
  }

  // Handle named options
  const templatesDirIndex = args.indexOf('--templates-dir');
  if (templatesDirIndex !== -1 && args.length > templatesDirIndex + 1) {
    templatesDir = args[templatesDirIndex + 1];
  } else {
    const templatesDirShortIndex = args.indexOf('-t');
    if (templatesDirShortIndex !== -1 && args.length > templatesDirShortIndex + 1) {
      templatesDir = args[templatesDirShortIndex + 1];
    }
  }

  // Run the extractor
  const extractor = new AssistantPromptExtractor();
  extractor.run(conversationPath, outputDir, templatesDir);
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main();
}

// Export the main function for programmatic usage
export { main };
