/**
 * Simple script to run the VibeCheck Proof of Concept
 */

// Check if the vibe-check-mcp-server is running
console.log('Checking if vibe-check-mcp-server is running...');
console.log('Note: Make sure the vibe-check-mcp-server is running at http://localhost:3000');
console.log('You can start it by running: npm start in the vibe-check-mcp-server directory');
console.log('\nStarting VibeCheck Proof of Concept...\n');

// Compile and run the TypeScript file
require('ts-node/register');
require('./src/examples/vibe-check-poc');
