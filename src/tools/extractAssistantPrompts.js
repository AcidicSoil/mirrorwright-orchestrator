#!/usr/bin/env node

/**
 * Assistant Prompt Extraction CLI Tool
 * 
 * This script provides a command-line interface for extracting and generating
 * assistant prompts from conversation logs for the Mirrorwright Orchestrator.
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
 * Extract existing prompts from conversation log
 */
function extractPromptsFromConversation(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const extractedPrompts = [];
    
    // Common patterns for assistant prompts in conversation logs
    const promptPatterns = [
      /# Cursor (\w+):/i,
      /Prompt for Cursor (\w+):/i,
      /# (\w+): /i
    ];
    
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
    
    return extractedPrompts;
  } catch (error) {
    logger.error(`Failed to extract prompts from ${filePath}: ${error}`);
    return [];
  }
}

/**
 * Generate a prompt for an LLM to create assistant-specific prompts
 */
function generateLLMPrompt(assistantName, description, projectState) {
  return `
You are helping to generate a prompt for the "${assistantName}" assistant in the Mirrorwright Orchestrator project.

The assistant's role is: "${description}"

Current project state:
${projectState}

Please generate a detailed prompt for this assistant that:
1. Aligns with their role description
2. Addresses the current project state
3. Focuses on the next logical development steps
4. Follows the format:

# Cursor ${assistantName}: [Title that reflects current focus]

[2-3 paragraphs of specific instructions]

1. **[First focus area]**
   - [Specific task]
   - [Specific task]

2. **[Second focus area]**
   - [Specific task]
   - [Specific task]

3. **[Third focus area]**
   - [Specific task]
   - [Specific task]

[Closing paragraph with success criteria]

Your prompt should be specific, actionable, and focused on the current state of the project.
`;
}

/**
 * Get current project state by analyzing the codebase
 */
function getProjectState() {
  try {
    // Get list of directories to analyze project structure
    const dirs = fs.readdirSync(process.cwd(), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.') && name !== 'node_modules');
    
    // Get recent git commits to understand recent changes
    let recentCommits = '';
    try {
      recentCommits = execSync('git log --oneline -n 5', { encoding: 'utf8' });
    } catch (e) {
      recentCommits = 'No git history available';
    }
    
    // Check for package.json to understand dependencies
    let dependencies = '';
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      dependencies = JSON.stringify(packageJson.dependencies || {}, null, 2);
    } catch (e) {
      dependencies = 'No package.json found';
    }
    
    return `
Project Structure:
- Directories: ${dirs.join(', ')}

Recent Changes:
${recentCommits}

Dependencies:
${dependencies}

Current Implementation:
- The Mirrorwright Orchestrator has a runtime container module with agent registry, lifecycle hooks, and message routing
- Message validation is implemented using AJV
- Both Simple and Advanced message bus implementations are available
- Agent lifecycle (initialize/start/stop) is managed by the runtime container
`;
  } catch (error) {
    logger.error(`Failed to analyze project state: ${error}`);
    return 'Unable to analyze project state';
  }
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
  const conversationPath = args[0] || 'extractAssistantPrompts.md';
  const outputDir = args[1] || 'assistant-prompts';
  
  logger.info(`Extracting prompts from ${conversationPath}`);
  
  // Load assistants from .cursorrules
  const assistants = loadAssistantsFromCursorRules();
  logger.info(`Found ${assistants.length} assistants in .cursorrules`);
  
  // Extract existing prompts
  const extractedPrompts = extractPromptsFromConversation(conversationPath);
  logger.info(`Found ${extractedPrompts.length} existing prompts in conversation`);
  
  // Create a map of assistant name to prompt
  const promptsByAssistant = {};
  for (const prompt of extractedPrompts) {
    promptsByAssistant[prompt.assistant] = prompt.prompt;
  }
  
  // Get project state
  const projectState = getProjectState();
  
  // Identify missing assistants
  const missingAssistants = assistants.filter(
    assistant => !promptsByAssistant[assistant.name]
  );
  
  if (missingAssistants.length > 0) {
    logger.warn(`Missing prompts for ${missingAssistants.length} assistants`);
    
    // In a real implementation, this would use an LLM to generate the prompts
    // For now, we'll just create placeholder prompts
    for (const assistant of missingAssistants) {
      logger.info(`Generating placeholder prompt for ${assistant.name}`);
      
      // Generate LLM prompt (in production, this would be sent to an LLM)
      const llmPrompt = generateLLMPrompt(
        assistant.name, 
        assistant.description,
        projectState
      );
      
      // For now, just create a placeholder
      promptsByAssistant[assistant.name] = `# Cursor ${assistant.name}: Auto-generated Prompt

Based on role: "${assistant.description}"

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.
`;
      
      // In production, you would use:
      // const generatedPrompt = await callLLM(llmPrompt);
      // promptsByAssistant[assistant.name] = generatedPrompt;
    }
  }
  
  // Save prompts
  savePrompts(promptsByAssistant, outputDir);
  logger.success('Assistant prompt extraction complete');
}

// Run the main function
main();
