/**
 * Validate an assistant rules file
 * 
 * Usage: node validate-assistant-rules.js <path-to-rules-file>
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const Ajv = require('ajv');

// Define the schema for assistant rules
const assistantRulesSchema = {
  type: 'object',
  required: ['agent', 'id', 'version', 'role', 'invocation', 'tools'],
  properties: {
    agent: { type: 'string' },
    id: { type: 'string' },
    version: { type: 'string' },
    description: { type: 'string' },
    role: { type: 'string' },
    category: { type: 'string' },
    integration_target: { type: 'string' },
    invocation: {
      type: 'object',
      required: ['trigger_conditions'],
      properties: {
        trigger_conditions: {
          type: 'array',
          items: { type: 'object' }
        },
        frequency: { type: 'string' },
        fallback_behavior: { type: 'string' }
      }
    },
    tools: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'purpose'],
        properties: {
          name: { type: 'string' },
          purpose: { type: 'string' },
          usage: { type: 'string' }
        }
      }
    },
    memory: {
      type: 'object',
      properties: {
        tagging: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    },
    routing: {
      type: 'object',
      properties: {
        eligible_agents: {
          type: 'array',
          items: { type: 'string' }
        },
        route_via: { type: 'string' },
        fallback_agent: { type: 'string' },
        notes: { type: 'string' }
      }
    }
  }
};

// Create validator
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(assistantRulesSchema);

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a path to the assistant rules file');
  process.exit(1);
}

// Read the file
try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const assistantRules = yaml.parse(fileContent);

  // Validate the assistant rules
  const valid = validate(assistantRules);

  if (valid) {
    console.log(`✅ Assistant rules are valid: ${filePath}`);
    process.exit(0);
  } else {
    console.error(`❌ Assistant rules are invalid: ${filePath}`);
    console.error('Validation errors:');
    console.error(validate.errors);
    process.exit(1);
  }
} catch (error) {
  console.error(`Error reading or parsing file: ${error.message}`);
  process.exit(1);
}
