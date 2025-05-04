#!/usr/bin/env node

/**
 * Generate a new prompt template with frontmatter
 *
 * Usage: node src/tools/generate-prompt-template.js <agent> <purpose> <id> [output-file]
 *
 * Example: node src/tools/generate-prompt-template.js cline architecture cline-new-architecture-prompt
 *
 * This script generates a new prompt template with the required YAML frontmatter fields
 * and validates the agent name against the assistants defined in .cursorrules.
 *
 * Future enhancements:
 * - Add interactive CLI with guided prompts for template creation
 * - Support specialized templates for different tasks and purposes
 * - Implement template versioning and change tracking
 * - Add support for additional frontmatter fields (tags, model, phase)
 * - Integrate with memory bank for template storage and retrieval
 */

const fs = require('fs');
const path = require('path');

// Load assistants from .cursorrules
function loadAssistants() {
  try {
    const cursorRulesPath = path.resolve(process.cwd(), '.cursorrules');
    const content = fs.readFileSync(cursorRulesPath, 'utf8');

    // Extract assistant definitions using regex
    const assistantSection = content.match(/assistants:([\s\S]*?)(?=\n\n|$)/)?.[1] || '';
    const assistantMatches = [...assistantSection.matchAll(/(\w+):\s*"([^"]+)"/g)];

    return assistantMatches.map(match => ({
      name: match[1].toLowerCase(),
      description: match[2]
    }));
  } catch (error) {
    console.error(`Failed to load assistants from .cursorrules: ${error}`);
    return [];
  }
}

// Generate a new prompt template
function generatePromptTemplate(agent, purpose, id, outputFile) {
  // Validate agent
  const assistants = loadAssistants();
  const assistantNames = assistants.map(a => a.name);

  if (!assistantNames.includes(agent.toLowerCase())) {
    console.error(`Error: Unknown agent "${agent}". Must be one of: ${assistantNames.join(', ')}`);
    process.exit(1);
  }

  // Validate purpose
  const validPurposes = ['architecture', 'implementation', 'documentation', 'testing', 'validation', 'refactoring', 'generation', 'example'];
  if (!validPurposes.includes(purpose.toLowerCase())) {
    console.warn(`Warning: Uncommon purpose "${purpose}". Common purposes are: ${validPurposes.join(', ')}`);
  }

  // Generate template content
  const template = `---
agent: ${agent.toLowerCase()}
purpose: ${purpose.toLowerCase()}
id: ${id}
version: 1.0.0
---

# Prompt for Cursor ${agent.charAt(0).toUpperCase() + agent.slice(1)}: [Title]

As the assistant responsible for [role description], please [main task] that will:

1. [Task 1]
2. [Task 2]
3. [Task 3]
4. [Task 4]
5. [Task 5]

[Additional context, constraints, or requirements]

Label the PR: \`[#tag] Brief Description\`
`;

  // Determine output file path
  let outputPath;
  if (outputFile) {
    outputPath = outputFile.endsWith('.md') ? outputFile : `${outputFile}.md`;
  } else {
    outputPath = path.join('prompt_templates', `${id}.md`);
  }

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.error(`Error: File "${outputPath}" already exists. Please choose a different output file.`);
    process.exit(1);
  }

  // Write template to file
  try {
    fs.writeFileSync(outputPath, template);
    console.log(`Successfully generated prompt template: ${outputPath}`);
  } catch (error) {
    console.error(`Failed to write template to file: ${error}`);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Error: Missing required arguments.');
    console.log('Usage: node src/tools/generate-prompt-template.js <agent> <purpose> <id> [output-file]');
    console.log('Example: node src/tools/generate-prompt-template.js cline architecture cline-new-architecture-prompt');
    process.exit(1);
  }

  const agent = args[0];
  const purpose = args[1];
  const id = args[2];
  const outputFile = args[3];

  return { agent, purpose, id, outputFile };
}

// Main function
function main() {
  const { agent, purpose, id, outputFile } = parseArgs();
  generatePromptTemplate(agent, purpose, id, outputFile);
}

// Run the script
main();
