/**
 * Assistant Prompt Extraction Tool
 *
 * This tool automates the extraction and generation of assistant prompts from conversation logs
 * for the Mirrorwright Orchestrator multi-agent system.
 *
 * This file is maintained for backward compatibility.
 * For new code, import from './prompt-extraction' instead.
 */

import { AssistantPromptExtractor } from './prompt-extraction';

// Re-export the new implementation for backward compatibility
export { AssistantPromptExtractor as DefaultAssistantPromptExtractor };

/**
 * CLI entry point
 */
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Assistant Prompt Extraction Tool

Usage:
  ts-node src/tools/extractAssistantPrompts.ts [conversationPath] [outputDir] [options]

Arguments:
  conversationPath       Path to conversation log file (default: extractAssistantPrompts.md)
  outputDir              Directory to save extracted prompts (default: assistant-prompts)

Options:
  --templates-dir, -t    Directory containing prompt template files with frontmatter
  --validate, -v         Validate frontmatter in template files
  --help, -h             Show this help message
`);
    process.exit(0);
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
