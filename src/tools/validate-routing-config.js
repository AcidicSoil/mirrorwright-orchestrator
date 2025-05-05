/**
 * Validate a routing configuration file
 * 
 * Usage: node validate-routing-config.js <path-to-routing-config>
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Define the schema for routing configurations
const routingConfigSchema = {
  type: 'object',
  required: ['id', 'agent', 'triggers', 'route_to'],
  properties: {
    id: { type: 'string' },
    agent: { type: 'string' },
    triggers: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { type: 'string' },
          keywords: { 
            type: 'array',
            items: { type: 'string' }
          },
          agent_scope: { 
            type: 'array',
            items: { type: 'string' }
          },
          tags: { 
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    },
    route_to: { type: 'string' },
    fallback_behavior: {
      type: 'object',
      properties: {
        onFailure: { type: 'string' },
        response: { type: 'string' }
      }
    }
  }
};

// Create validator
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(routingConfigSchema);

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a path to the routing configuration file');
  process.exit(1);
}

// Read the file
try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const routingConfig = JSON.parse(fileContent);

  // Validate the routing configuration
  const valid = validate(routingConfig);

  if (valid) {
    console.log(`✅ Routing configuration is valid: ${filePath}`);
    process.exit(0);
  } else {
    console.error(`❌ Routing configuration is invalid: ${filePath}`);
    console.error('Validation errors:');
    console.error(validate.errors);
    process.exit(1);
  }
} catch (error) {
  console.error(`Error reading or parsing file: ${error.message}`);
  process.exit(1);
}
