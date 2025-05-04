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
  const conversationPath = process.argv[2] || 'extractAssistantPrompts.md';
  const outputDir = process.argv[3] || 'assistant-prompts';

  const extractor = new AssistantPromptExtractor();
  extractor.run(conversationPath, outputDir);
}
