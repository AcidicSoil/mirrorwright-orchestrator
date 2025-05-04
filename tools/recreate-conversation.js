#!/usr/bin/env node

/**
 * Recreate Conversation Tool
 * 
 * This tool helps recreate a conversation template for the Mirrorwright Orchestrator.
 * It copies the template to a new file and prepares it for use.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const outputPath = args[0];
    
    if (!outputPath) {
      console.error('Error: Output path is required');
      console.log('Usage: node recreate-conversation.js <output_path>');
      process.exit(1);
    }
    
    // Get template path
    const templatePath = path.join(__dirname, '..', 'prompt_templates', 'mirrorwright-strategic-ai-conversation-template.md');
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      console.error(`Error: Template not found at ${templatePath}`);
      process.exit(1);
    }
    
    // Read template
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Get task context from user
    const taskContext = await askQuestion('Enter the task context: ');
    
    // Replace task context in template
    let modifiedTemplate = template.replace(
      '[Fill in the current objective — e.g., "Refining Agent Interface Layer architecture", "Implementing CLI for ritual execution", "Writing docs for mode schema"]',
      taskContext
    );
    
    // Write to output file
    fs.writeFileSync(outputPath, modifiedTemplate);
    
    console.log(`Conversation template created at ${outputPath}`);
    console.log('You can now edit this file to add more details and start your conversation.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Ask a question and get user input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} - The user's answer
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

// Export the main function for programmatic usage
module.exports = { main };
