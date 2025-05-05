/**
 * Script to register the tool failure handling rule
 */
const fs = require('fs');
const path = require('path');
const { AssistantRulesRegistry } = require('./src/assistant/AssistantRulesRegistry');

async function registerToolFailureRule() {
  try {
    console.log('Registering tool failure handling rule...');
    
    // Create registry instance
    const registry = new AssistantRulesRegistry();
    
    // Load existing rules
    await registry.loadRules();
    
    // Read the tool failure rule file
    const rulePath = path.resolve(__dirname, 'examples/assistant-rules/tool-failure-handling-rule.json');
    const ruleContent = fs.readFileSync(rulePath, 'utf-8');
    const rule = JSON.parse(ruleContent);
    
    // Add the rule to the registry
    const result = await registry.addRule('tool-failure-handling', rule);
    
    if (result) {
      console.log('Tool failure handling rule registered successfully!');
      
      // Validate all rules
      const validation = registry.validateAllRules();
      if (validation.valid) {
        console.log('All rules are valid.');
      } else {
        console.log('Some rules are invalid:');
        for (const [name, errors] of Object.entries(validation.errors)) {
          console.log(`  ${name}:`);
          errors.forEach(error => console.log(`    - ${error}`));
        }
      }
    } else {
      console.error('Failed to register tool failure handling rule.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
  }
}

// Run the registration
registerToolFailureRule();
