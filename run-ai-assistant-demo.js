/**
 * Simple script to run the AI Assistant with VibeCheck example
 */

// Check if the vibe-check-mcp-server is running
console.log('Starting AI Assistant with VibeCheck example...');
console.log('Note: This example simulates how VibeCheck works in the background');
console.log('as part of the thought processing of an AI assistant.');
console.log('\nThe VibeCheck integration is designed to be a background layer');
console.log('that helps prevent tunnel vision, reduce complexity, and learn from mistakes.');
console.log('\nThe user interacts with the AI assistant, not directly with VibeCheck.');
console.log('\nStarting the example...\n');

// Compile and run the TypeScript file
require('ts-node/register');
require('./src/examples/ai-assistant-with-vibe-check');
