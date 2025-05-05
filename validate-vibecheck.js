const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Load the schema
const schemaPath = path.resolve(__dirname, 'src/schemas/assistant-rule.schema.yaml');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
const yaml = require('yaml');
const schema = yaml.parse(schemaContent);

// Load the rule
const rulePath = path.resolve(__dirname, 'examples/assistant-rules/vibecheck-rule.json');
const ruleContent = fs.readFileSync(rulePath, 'utf-8');
const rule = JSON.parse(ruleContent);

// Create validator
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// Validate
const valid = validate(rule);

if (valid) {
  console.log('✅ VibeCheck rule is valid');
} else {
  console.error('❌ VibeCheck rule is invalid:');
  console.error(validate.errors);
}
