#!/usr/bin/env node

/**
 * Improved Assistant Prompt Extraction CLI Tool
 *
 * This script provides an enhanced command-line interface for extracting and generating
 * assistant prompts from conversation logs for the Mirrorwright Orchestrator.
 *
 * Improvements:
 * - Enhanced pattern matching for different prompt formats
 * - Better section detection in conversation logs
 * - Support for table-based prompt definitions
 * - Improved error handling and reporting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

/**
 * Simple logger with colored output
 */
class Logger {
  info(message) {
    console.log(`${colors.bright}${colors.blue}[INFO]${colors.reset} ${message}`);
  }

  success(message) {
    console.log(`${colors.bright}${colors.green}[SUCCESS]${colors.reset} ${message}`);
  }

  warn(message) {
    console.log(`${colors.bright}${colors.yellow}[WARNING]${colors.reset} ${message}`);
  }

  error(message) {
    console.error(`${colors.bright}${colors.red}[ERROR]${colors.reset} ${message}`);
  }
}

const logger = new Logger();

/**
 * Load assistant definitions from .cursorrules
 */
function loadAssistantsFromCursorRules() {
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
    logger.error(`Failed to load assistants from .cursorrules: ${error}`);
    return [];
  }
}

/**
 * Extract existing prompts from conversation log with enhanced pattern matching
 */
function extractPromptsFromConversation(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const extractedPrompts = [];

    // Enhanced patterns for assistant prompts in conversation logs
    const promptPatterns = [
      /# Cursor (\w+):/i,
      /Prompt for Cursor (\w+):/i,
      /# (\w+): /i,
      /# Prompt for Cursor (\w+):/i,
      /🧩 Prompt for \*\*(\w+)\*\*/i,  // Added pattern for "🧩 Prompt for **Augment**"
      /## 🧩 Prompt for \*\*(\w+)\*\*/i,  // Added pattern for "## 🧩 Prompt for **Cline**"
      /\*\*(\w+)\*\* \| .+ \| .+/i  // Pattern for table row with assistant name in bold
    ];

    // First, try to extract from tables (like in the conversation log)
    extractPromptsFromTables(lines, extractedPrompts);

    // Then try the regular pattern matching approach
    for (let i = 0; i < lines.length; i++) {
      for (const pattern of promptPatterns) {
        const match = lines[i].match(pattern);
        if (match) {
          const assistant = match[1].toLowerCase();
          let promptContent = lines[i] + '\n';
          let j = i + 1;

          // Collect prompt content until we hit a markdown code block end or section break
          const isCodeBlock = lines[i].includes('```');
          let inCodeBlock = isCodeBlock;

          while (j < lines.length) {
            // Check for section breaks or end of content
            if (!inCodeBlock &&
                (lines[j].startsWith('## ') ||
                 lines[j].startsWith('---') ||
                 lines[j].includes('* * *') ||
                 (lines[j].trim() === '' && j+1 < lines.length && lines[j+1].trim() === ''))) {
              break;
            }

            // Track code blocks
            if (lines[j].includes('```')) {
              inCodeBlock = !inCodeBlock;
            }

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

    // Special handling for the Core Prompt Templates table
    // If we found the table but didn't properly extract individual prompts
    if (extractedPrompts.length > 0) {
      // Check if any of the extracted prompts is just a table row
      const tableRowPrompts = extractedPrompts.filter(p =>
        p.prompt.startsWith('| **') &&
        p.prompt.includes('|') &&
        p.prompt.endsWith('|')
      );

      if (tableRowPrompts.length > 0) {
        logger.info(`Found ${tableRowPrompts.length} table row prompts, generating proper prompts`);

        // Process each table row prompt
        for (const rowPrompt of tableRowPrompts) {
          const cells = rowPrompt.prompt.split('|').map(c => c.trim()).filter(c => c);

          if (cells.length >= 3) {
            // Extract assistant name
            const assistantMatch = cells[0].match(/\*\*([^*]+)\*\*/i);
            if (assistantMatch) {
              const assistant = assistantMatch[1].toLowerCase();

              // Extract purpose (last column)
              const purpose = cells[cells.length - 1].replace(/\.$/, '').trim();

              // Extract file path (middle column)
              let filePath = '';
              const filePathMatch = cells[1].match(/`([^`]+)`/);
              if (filePathMatch) {
                filePath = filePathMatch[1];
              }

              // Generate a proper prompt
              const properPrompt = generatePromptFromTableRow(assistant, filePath, purpose);

              // Replace the table row prompt with the proper prompt
              const index = extractedPrompts.findIndex(p => p.assistant === assistant);
              if (index !== -1) {
                extractedPrompts[index].prompt = properPrompt;
                logger.info(`Generated proper prompt for ${assistant}`);
              }
            }
          }
        }
      }
    }

    return extractedPrompts;
  } catch (error) {
    logger.error(`Failed to extract prompts from ${filePath}: ${error}`);
    return [];
  }
}

/**
 * Extract prompts from markdown tables in the conversation log
 */
function extractPromptsFromTables(lines, extractedPrompts) {
  // Find table sections
  let inTable = false;
  let tableStart = -1;
  let tableHeaders = [];
  let tableTitle = '';
  let foundAssistantTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for table title (usually appears before the table)
    if (!inTable && (line.includes('Core Prompt Templates') || line.includes('Assistant') && line.includes('Prompt File'))) {
      tableTitle = line;
      foundAssistantTable = true;
      // Look ahead for the actual table
      continue;
    }

    // Detect table start (header row)
    if (line.startsWith('| ') && line.endsWith(' |') && !inTable) {
      tableStart = i;
      tableHeaders = line.split('|').map(h => h.trim()).filter(h => h);
      inTable = true;

      // Check if this is the assistant table we're looking for
      const hasAssistantColumn = tableHeaders.some(h => h.toLowerCase().includes('assistant'));
      const hasPromptFileColumn = tableHeaders.some(h => h.toLowerCase().includes('file') || h.toLowerCase().includes('prompt'));
      const hasPurposeColumn = tableHeaders.some(h => h.toLowerCase().includes('purpose'));

      if (!hasAssistantColumn || (!hasPromptFileColumn && !hasPurposeColumn)) {
        // Not the table we're looking for
        inTable = false;
        foundAssistantTable = false;
      }

      continue;
    }

    // Skip separator row
    if (inTable && line.startsWith('| ---') && line.endsWith(' |')) {
      continue;
    }

    // Process table row
    if (inTable && line.startsWith('| ') && line.endsWith(' |')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);

      // Need at least 3 columns: Assistant, Prompt File, Purpose
      if (cells.length >= 3) {
        // Check if this is an assistant definition row
        const assistantMatch = cells[0].match(/\*\*([^*]+)\*\*/i);
        if (assistantMatch) {
          const assistant = assistantMatch[1].toLowerCase();

          // Find the purpose/description column (usually the last column)
          let purpose = cells[cells.length - 1];

          // Find the file path column (usually the middle column)
          let filePath = '';
          const filePathMatch = cells[1].match(/`([^`]+)`/);
          if (filePathMatch) {
            filePath = filePathMatch[1];
          }

          // Create a prompt based on the table information
          const prompt = generatePromptFromTableRow(assistant, filePath, purpose);

          extractedPrompts.push({
            assistant,
            prompt,
            lineStart: i,
            lineEnd: i + 1
          });

          logger.info(`Extracted assistant '${assistant}' from table row`);
        }
      }
      continue;
    }

    // Detect table end
    if (inTable && (!line.startsWith('| ') || line === '')) {
      inTable = false;
      tableTitle = '';
    }
  }

  // If we found the assistant table but didn't extract any prompts, try a different approach
  if (foundAssistantTable && extractedPrompts.length === 0) {
    // Look for the table content as a whole
    let tableContent = '';
    let inAssistantTable = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Look for the start of the assistant table section
      if (!inAssistantTable && line.includes('Core Prompt Templates')) {
        inAssistantTable = true;
        continue;
      }

      // Collect table content
      if (inAssistantTable && line.startsWith('|')) {
        tableContent += line + '\n';
      }

      // Detect end of table section
      if (inAssistantTable && line.includes('* * *') && tableContent) {
        break;
      }
    }

    // If we found table content, extract assistants from it
    if (tableContent) {
      const tableLines = tableContent.split('\n');
      const headerLine = tableLines[0];

      // Skip header and separator lines
      for (let i = 2; i < tableLines.length; i++) {
        const line = tableLines[i].trim();
        if (!line || !line.startsWith('|')) continue;

        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 3) {
          // Extract assistant name
          const assistantMatch = cells[0].match(/\*\*([^*]+)\*\*/i);
          if (assistantMatch) {
            const assistant = assistantMatch[1].toLowerCase();

            // Extract purpose (last column)
            const purpose = cells[cells.length - 1].replace(/\.$/, '').trim();

            // Extract file path (middle column)
            let filePath = '';
            const filePathMatch = cells[1].match(/`([^`]+)`/);
            if (filePathMatch) {
              filePath = filePathMatch[1];
            }

            // Generate a proper prompt
            const prompt = generatePromptFromTableRow(assistant, filePath, purpose);

            extractedPrompts.push({
              assistant,
              prompt,
              lineStart: i,
              lineEnd: i + 1
            });

            logger.info(`Extracted assistant '${assistant}' from table content`);
          }
        }
      }
    }
  }
}

/**
 * Generate a prompt based on table row information
 */
function generatePromptFromTableRow(assistant, filePath, purpose) {
  // Clean up the purpose text (remove trailing periods, etc.)
  purpose = purpose.replace(/\.$/, '').trim();

  // Extract the base filename without path or extension
  let fileName = assistant;
  let purposeId = '';

  if (filePath) {
    // Try to extract filename from path
    const fileNameMatch = filePath.match(/\/([^\/]+)\.md$/) || filePath.match(/([^\/]+)\.md$/);
    if (fileNameMatch) {
      fileName = fileNameMatch[1];
    } else {
      // If no .md extension, use the whole path as a base
      fileName = filePath.split('/').pop().replace(/[^\w-]/g, '-').toLowerCase();
    }

    // Extract purpose from filename
    const purposeParts = fileName.split('-');
    if (purposeParts.length > 1) {
      // Remove the assistant name if it's part of the filename
      if (purposeParts[0].toLowerCase() === assistant.toLowerCase()) {
        purposeParts.shift();
      }
      purposeId = purposeParts.join('-');
    }
  }

  // Determine a purpose type from the purpose text or filename
  let purposeType = 'implementation';
  const purposeLower = purpose.toLowerCase();

  if (purposeLower.includes('refactor') || purposeLower.includes('optimi') || purposeLower.includes('enhance')) {
    purposeType = 'optimization';
  } else if (purposeLower.includes('scaffold') || purposeLower.includes('structure') || purposeLower.includes('template')) {
    purposeType = 'scaffolding';
  } else if (purposeLower.includes('plan') || purposeLower.includes('architect') || purposeLower.includes('design')) {
    purposeType = 'planning';
  } else if (purposeLower.includes('document') || purposeLower.includes('guide')) {
    purposeType = 'documentation';
  } else if (purposeLower.includes('test') || purposeLower.includes('valid')) {
    purposeType = 'testing';
  }

  // Create a title based on the purpose
  const title = purpose.split(' ').slice(0, 3).join(' ');

  // Create an ID from the filename or purpose
  const id = purposeId || `${assistant}-${purposeType}-directive`;

  // Generate a more detailed prompt based on the assistant and purpose
  return `---
agent: ${assistant}
purpose: ${purposeType}
id: ${id}
version: 1.0.0
---

# Prompt for Cursor ${assistant.charAt(0).toUpperCase() + assistant.slice(1)}: ${title}

## Role

You are ${assistant.charAt(0).toUpperCase() + assistant.slice(1)}, a specialized assistant in the Mirrorwright Orchestrator project. Your primary responsibility is to ${purpose.toLowerCase()}.

## Core Responsibilities

1. **Primary Focus**
   - ${purpose}
   - Ensure alignment with project goals and standards
   - Maintain consistency with established patterns

2. **Quality and Integration**
   - Validate your work against project requirements
   - Ensure compatibility with other components
   - Follow best practices for ${purposeType}

3. **Documentation and Communication**
   - Document your approach and decisions
   - Provide clear explanations of your work
   - Communicate effectively with other assistants

## Implementation Guidelines

Follow the established patterns in the Mirrorwright Orchestrator codebase. Ensure your work is well-structured, maintainable, and aligned with the project's architectural principles.

## Output Format

Provide your output in a clear, structured format that includes:
- A summary of your approach
- The implementation details
- Any considerations or trade-offs
- Next steps or recommendations

Remember to focus on ${purposeType} excellence and maintain alignment with the overall project goals.
`;
}

/**
 * Save prompts to output directory
 */
function savePrompts(prompts, outputDir) {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save individual prompt files
    for (const [assistant, prompt] of Object.entries(prompts)) {
      const filePath = path.join(outputDir, `${assistant}-prompt.md`);
      fs.writeFileSync(filePath, prompt);
      logger.success(`Saved prompt for ${assistant} to ${filePath}`);
    }

    // Save combined prompts file
    const combinedContent = Object.entries(prompts)
      .map(([assistant, prompt]) => `## ${assistant}\n\n${prompt}\n\n---\n`)
      .join('\n');

    const combinedPath = path.join(outputDir, 'all-assistant-prompts.md');
    fs.writeFileSync(combinedPath, combinedContent);
    logger.success(`Saved combined prompts to ${combinedPath}`);
  } catch (error) {
    logger.error(`Failed to save prompts: ${error}`);
  }
}

/**
 * Main function
 */
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Improved Assistant Prompt Extraction Tool

Usage:
  node src/tools/improved-extractAssistantPrompts.js [conversationPath] [outputDir] [options]

Arguments:
  conversationPath       Path to conversation log file (default: extractAssistantPrompts.md)
  outputDir              Directory to save extracted prompts (default: assistant-prompts)

Options:
  --help, -h             Show this help message
  --verbose, -v          Show verbose output
  --force, -f            Overwrite existing prompt files
  --no-placeholders, -n  Don't generate placeholders for missing assistants
`);
    return;
  }

  const conversationPath = args[0] || 'extractAssistantPrompts.md';
  const outputDir = args[1] || 'assistant-prompts';
  const verbose = args.includes('--verbose') || args.includes('-v');
  const force = args.includes('--force') || args.includes('-f');
  const noPlaceholders = args.includes('--no-placeholders') || args.includes('-n');

  // Validate input file exists
  if (!fs.existsSync(conversationPath)) {
    logger.error(`Conversation file not found: ${conversationPath}`);
    return;
  }

  logger.info(`Extracting prompts from ${conversationPath}`);

  // Load assistants from .cursorrules
  const assistants = loadAssistantsFromCursorRules();
  logger.info(`Found ${assistants.length} assistants in .cursorrules`);

  // Extract existing prompts
  const extractedPrompts = extractPromptsFromConversation(conversationPath);
  logger.info(`Found ${extractedPrompts.length} existing prompts in conversation`);

  // Create a map of assistant name to prompt
  const promptsByAssistant = {};

  // Group prompts by assistant (in case there are multiple prompts for the same assistant)
  const promptsByAssistantMap = new Map();
  for (const prompt of extractedPrompts) {
    if (!promptsByAssistantMap.has(prompt.assistant)) {
      promptsByAssistantMap.set(prompt.assistant, []);
    }
    promptsByAssistantMap.get(prompt.assistant).push(prompt);
  }

  // For each assistant, use the most detailed prompt
  for (const [assistant, prompts] of promptsByAssistantMap.entries()) {
    // Sort prompts by length (longest first)
    prompts.sort((a, b) => b.prompt.length - a.prompt.length);

    // Use the longest prompt
    promptsByAssistant[assistant] = prompts[0].prompt;

    if (verbose && prompts.length > 1) {
      logger.info(`Found ${prompts.length} prompts for ${assistant}, using the most detailed one`);
    }
  }

  // Identify missing assistants
  const missingAssistants = assistants.filter(
    assistant => !promptsByAssistant[assistant.name]
  );

  if (missingAssistants.length > 0) {
    if (noPlaceholders) {
      logger.warn(`Missing prompts for ${missingAssistants.length} assistants (not generating placeholders)`);
    } else {
      logger.warn(`Missing prompts for ${missingAssistants.length} assistants (generating placeholders)`);

      // Create placeholder prompts for missing assistants
      for (const assistant of missingAssistants) {
        logger.info(`Generating placeholder prompt for ${assistant.name}`);

        // Determine a purpose type based on the assistant description
        let purposeType = 'implementation';
        const descLower = assistant.description.toLowerCase();

        if (descLower.includes('optimi') || descLower.includes('refactor') || descLower.includes('enhance')) {
          purposeType = 'optimization';
        } else if (descLower.includes('scaffold') || descLower.includes('structure')) {
          purposeType = 'scaffolding';
        } else if (descLower.includes('plan') || descLower.includes('architect')) {
          purposeType = 'planning';
        } else if (descLower.includes('valid') || descLower.includes('test')) {
          purposeType = 'validation';
        } else if (descLower.includes('route') || descLower.includes('direct')) {
          purposeType = 'routing';
        }

        // Create a placeholder with proper frontmatter
        promptsByAssistant[assistant.name] = `---
agent: ${assistant.name}
purpose: ${purposeType}
id: ${assistant.name}-${purposeType}-directive
version: 1.0.0
---

# Prompt for Cursor ${assistant.name}: ${assistant.name.charAt(0).toUpperCase() + assistant.name.slice(1)} Directive

## Role

You are ${assistant.name.charAt(0).toUpperCase() + assistant.name.slice(1)}, a specialized assistant in the Mirrorwright Orchestrator project. Your primary responsibility is aligned with: "${assistant.description}"

## Core Responsibilities

1. **Primary Focus**
   - ${assistant.description}
   - Ensure alignment with project goals and standards
   - Maintain consistency with established patterns

2. **Quality and Integration**
   - Validate your work against project requirements
   - Ensure compatibility with other components
   - Follow best practices for ${purposeType}

3. **Documentation and Communication**
   - Document your approach and decisions
   - Provide clear explanations of your work
   - Communicate effectively with other assistants

## Implementation Guidelines

Follow the established patterns in the Mirrorwright Orchestrator codebase. Ensure your work is well-structured, maintainable, and aligned with the project's architectural principles.

## Output Format

Provide your output in a clear, structured format that includes:
- A summary of your approach
- The implementation details
- Any considerations or trade-offs
- Next steps or recommendations

Remember to focus on ${purposeType} excellence and maintain alignment with the overall project goals.
`;
      }
    }
  }

  // Check if output directory exists
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Created output directory: ${outputDir}`);
    } catch (error) {
      logger.error(`Failed to create output directory: ${error}`);
      return;
    }
  } else if (force) {
    logger.info(`Output directory exists, will overwrite existing files`);
  } else {
    // Check if files already exist
    const existingFiles = Object.keys(promptsByAssistant)
      .map(assistant => path.join(outputDir, `${assistant}-prompt.md`))
      .filter(filePath => fs.existsSync(filePath));

    if (existingFiles.length > 0) {
      logger.warn(`${existingFiles.length} prompt files already exist. Use --force to overwrite.`);
      logger.info(`Existing files: ${existingFiles.join(', ')}`);

      // Remove existing files from the prompts to save
      for (const filePath of existingFiles) {
        const assistant = path.basename(filePath, '-prompt.md');
        delete promptsByAssistant[assistant];
      }
    }
  }

  // Save prompts
  if (Object.keys(promptsByAssistant).length > 0) {
    savePrompts(promptsByAssistant, outputDir);
    logger.success('Assistant prompt extraction complete');
  } else {
    logger.info('No new prompts to save');
  }
}

// Run the main function
main();
