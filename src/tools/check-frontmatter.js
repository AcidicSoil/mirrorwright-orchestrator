#!/usr/bin/env node

/**
 * Simple script to check frontmatter in prompt templates
 *
 * This script validates that all prompt templates in the prompt_templates directory
 * include the required YAML frontmatter fields: agent, purpose, id, and version.
 *
 * Future enhancements:
 * - Add support for additional frontmatter fields (tags, model, phase)
 * - Implement analytics for tracking prompt usage and effectiveness
 * - Integrate with memory bank for template storage and retrieval
 * - Add support for template versioning and change tracking
 */

const fs = require('fs');
const path = require('path');

// Define required frontmatter fields
const REQUIRED_FIELDS = ['agent', 'purpose', 'id', 'version'];

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

// Parse frontmatter from a markdown file
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if the content starts with frontmatter delimiter
    if (!content.startsWith('---')) {
      return {
        frontmatter: null,
        hasFrontmatter: false
      };
    }

    // Find the end of the frontmatter
    const endIndex = content.indexOf('---', 3);
    if (endIndex === -1) {
      return {
        frontmatter: null,
        hasFrontmatter: false
      };
    }

    // Extract the frontmatter
    const frontmatterStr = content.substring(3, endIndex).trim();

    // Parse the frontmatter as YAML
    const frontmatter = {};
    const lines = frontmatterStr.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();

      // Remove quotes if present
      frontmatter[key] = value.replace(/^["'](.*)["']$/, '$1');
    }

    return {
      frontmatter,
      hasFrontmatter: true
    };
  } catch (error) {
    console.error(`Failed to parse frontmatter from ${filePath}: ${error}`);
    return {
      frontmatter: null,
      hasFrontmatter: false
    };
  }
}

// Check if a version string follows semantic versioning
function isValidVersion(version) {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
  return semverRegex.test(version);
}

// Validate all prompt template files
function validatePromptTemplates() {
  console.log('Validating prompt frontmatter...');

  // Load assistants from .cursorrules
  const assistants = loadAssistants();
  const assistantNames = assistants.map(a => a.name);

  console.log(`Found ${assistantNames.length} assistants: ${assistantNames.join(', ')}`);

  // Get all markdown files in the prompt templates directory
  const promptTemplatesDir = 'prompt_templates';
  const files = fs.readdirSync(promptTemplatesDir)
    .filter(file => file.endsWith('.md'));

  console.log(`Found ${files.length} markdown files`);

  const result = {
    valid: [],
    invalid: []
  };

  // Validate each file
  for (const file of files) {
    const filePath = path.join(promptTemplatesDir, file);
    const parseResult = parseFrontmatter(filePath);

    if (!parseResult.hasFrontmatter) {
      result.invalid.push({
        path: filePath,
        errors: ['Missing frontmatter']
      });
      continue;
    }

    if (!parseResult.frontmatter) {
      result.invalid.push({
        path: filePath,
        errors: ['Invalid frontmatter format']
      });
      continue;
    }

    const errors = [];

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!parseResult.frontmatter[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check agent name
    if (parseResult.frontmatter.agent && !assistantNames.includes(parseResult.frontmatter.agent.toLowerCase())) {
      errors.push(`Unknown agent: ${parseResult.frontmatter.agent}. Must be one of: ${assistantNames.join(', ')}`);
    }

    // Check version format
    if (parseResult.frontmatter.version && !isValidVersion(parseResult.frontmatter.version)) {
      errors.push(`Invalid version format: ${parseResult.frontmatter.version}. Must follow semantic versioning (e.g., 1.0.0)`);
    }

    if (errors.length > 0) {
      result.invalid.push({
        path: filePath,
        errors
      });
    } else {
      result.valid.push(filePath);
    }
  }

  // Log results
  console.log(`\nValidation complete: ${result.valid.length} valid, ${result.invalid.length} invalid\n`);

  if (result.invalid.length > 0) {
    console.log('Invalid files:');
    for (const file of result.invalid) {
      console.log(`- ${file.path}:`);
      for (const error of file.errors) {
        console.log(`  - ${error}`);
      }
    }
  }

  if (result.valid.length > 0) {
    console.log('\nValid files:');
    for (const file of result.valid) {
      console.log(`- ${file}`);
    }
  }

  // Save results to file for GitHub Action
  fs.writeFileSync('validation-results.json', JSON.stringify(result, null, 2));

  return result;
}

// Run the validator
validatePromptTemplates();
