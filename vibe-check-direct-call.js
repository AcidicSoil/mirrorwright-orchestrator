/**
 * Simple script to directly call the VibeCheck MCP tools
 */

// Import the required modules
const axios = require('axios');

// Sample developer query and plan
const userQuery = "How do I implement a dark mode toggle for my website?";
const developerPlan = `
1. Create a comprehensive theming system with support for multiple themes (dark, light, high contrast, etc.)
2. Implement a theme provider using React Context API with TypeScript generics for type safety
3. Create a custom hook for accessing the theme context
4. Set up a Redux store to manage theme state globally
5. Create actions and reducers for theme changes
6. Implement middleware to persist theme preference in localStorage, cookies, and IndexedDB for redundancy
7. Add theme synchronization across tabs using BroadcastChannel API
8. Create a theme configuration file with all possible color variations
9. Implement CSS-in-JS solution with styled-components for dynamic theming
10. Create animations for smooth transitions between themes
11. Add system preference detection using matchMedia
12. Implement a theme scheduler to automatically switch themes based on time of day
13. Create comprehensive documentation for the theming system
14. Add unit tests, integration tests, and end-to-end tests for the theming system
15. Set up a CI/CD pipeline specifically for theme testing
`;

// Function to call vibe_check
async function callVibeCheck() {
  console.log("Calling vibe_check with the following input:");
  console.log("User Query:", userQuery);
  console.log("Developer Plan:", developerPlan);
  console.log("\n");

  try {
    const response = await axios.post('http://localhost:3000/vibe_check', {
      phase: 'planning',
      userRequest: userQuery,
      plan: developerPlan,
      confidence: 0.9,
      availableTools: ['React', 'CSS', 'localStorage'],
      thinkingLog: 'I need to implement a dark mode toggle. I should create a comprehensive theming system...'
    });

    console.log("VibeCheck Response:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling vibe_check:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return null;
  }
}

// Function to call vibe_distill
async function callVibeDistill(vibeCheckResult) {
  console.log("\nCalling vibe_distill with the following input:");
  console.log("User Query:", userQuery);
  console.log("Developer Plan:", developerPlan);
  console.log("\n");

  try {
    const response = await axios.post('http://localhost:3000/vibe_distill', {
      plan: developerPlan,
      userRequest: userQuery
    });

    console.log("VibeDistill Response:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling vibe_distill:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return null;
  }
}

// Function to call vibe_learn
async function callVibeLearn(vibeCheckResult, vibeDistillResult) {
  console.log("\nCalling vibe_learn with the following input:");
  
  const mistake = "Created an overly complex plan for a simple dark mode toggle";
  const category = "Complex Solution Bias";
  const solution = "Focused on the core requirement and implemented a simpler solution";
  
  console.log("Mistake:", mistake);
  console.log("Category:", category);
  console.log("Solution:", solution);
  console.log("\n");

  try {
    const response = await axios.post('http://localhost:3000/vibe_learn', {
      mistake,
      category,
      solution
    });

    console.log("VibeLearn Response:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling vibe_learn:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return null;
  }
}

// Main function to run the example
async function main() {
  console.log("=== VibeCheck Direct Call Example ===");
  console.log("This example demonstrates how to directly call the VibeCheck MCP tools.");
  console.log("Make sure the vibe-check-mcp-server is running at http://localhost:3000");
  console.log("\n");

  // Call vibe_check
  const vibeCheckResult = await callVibeCheck();

  // Call vibe_distill
  const vibeDistillResult = await callVibeDistill(vibeCheckResult);

  // Call vibe_learn
  await callVibeLearn(vibeCheckResult, vibeDistillResult);

  console.log("\n=== Example Complete ===");
  console.log("This demonstrates how VibeCheck works in the background to:");
  console.log("1. Identify issues with complex plans (vibe_check)");
  console.log("2. Simplify overly complex plans (vibe_distill)");
  console.log("3. Learn from mistakes to improve future planning (vibe_learn)");
}

// Run the main function
main().catch(error => {
  console.error("Unhandled error:", error);
});
