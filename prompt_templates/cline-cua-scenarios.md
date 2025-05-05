---
agent: cline
purpose: planning
id: cline-cua-scenarios
version: 1.0.0
cu_intent: false
---

# Prompt for Cursor Cline: CUA User Scenarios

## Task Overview

As the assistant responsible for strategic planning and requirements clarification, plan user-facing scenarios where Computer Use Agents (CUAs) are needed (file management, local CLI tools, browser actions). Define input patterns and map to `CUActionRequest` schema for testing.

## Planning Requirements

1. **Scenario Identification**
   - Identify common user scenarios that would benefit from CUA capabilities
   - Categorize scenarios by action type (file operations, command execution, web browsing)
   - Prioritize scenarios based on user value and implementation complexity

2. **Input Pattern Definition**
   - Define natural language patterns that indicate CUA intent
   - Create example prompts for each scenario
   - Map prompts to structured CUActionRequest objects

3. **Schema Mapping**
   - Ensure all scenarios map to the CUAction schema
   - Define payload structures for each action type
   - Include context information for traceability

4. **Testing Strategy**
   - Define test cases for each scenario
   - Include both positive and negative test cases
   - Consider edge cases and error handling

5. **User Experience**
   - Define how users will interact with CUA capabilities
   - Consider feedback mechanisms for CUA actions
   - Plan for error handling and recovery

## Technical Constraints

- All scenarios must map to the CUAction schema
- Consider security implications of each scenario
- Ensure scenarios are realistic and valuable to users
- Focus on scenarios that can be implemented with the current architecture

## Example Scenarios

### File Operations

1. **Reading Configuration Files**
   - User prompt: "Show me the content of package.json"
   - CUActionRequest:
     ```json
     {
       "action_type": "open_file",
       "payload": {
         "path": "package.json"
       }
     }
     ```

2. **Creating New Files**
   - User prompt: "Create a new file called example.txt with the content 'Hello, world!'"
   - CUActionRequest:
     ```json
     {
       "action_type": "write_file",
       "payload": {
         "path": "example.txt",
         "content": "Hello, world!"
       }
     }
     ```

### Command Execution

1. **Installing Dependencies**
   - User prompt: "Install the package lodash"
   - CUActionRequest:
     ```json
     {
       "action_type": "run_command",
       "payload": {
         "command": "npm",
         "args": ["install", "lodash"]
       }
     }
     ```

2. **Running Tests**
   - User prompt: "Run the test suite"
   - CUActionRequest:
     ```json
     {
       "action_type": "run_command",
       "payload": {
         "command": "npm",
         "args": ["test"]
       }
     }
     ```

### Web Browsing

1. **Checking Documentation**
   - User prompt: "Open the TypeScript documentation"
   - CUActionRequest:
     ```json
     {
       "action_type": "browse_web",
       "payload": {
         "url": "https://www.typescriptlang.org/docs/"
       }
     }
     ```

2. **Searching for Solutions**
   - User prompt: "Search for solutions to 'TypeScript interface extends multiple interfaces'"
   - CUActionRequest:
     ```json
     {
       "action_type": "browse_web",
       "payload": {
         "url": "https://www.google.com/search?q=TypeScript+interface+extends+multiple+interfaces"
       }
     }
     ```

## Deliverables

1. Comprehensive list of user scenarios
2. Natural language patterns for each scenario
3. Mapping of scenarios to CUActionRequest objects
4. Test cases for each scenario
5. User experience recommendations

## References

- [CUAction Schema](../docs/strategic-ai-reference/schemas/cuaction.schema.md)
- [LangGraph CUA-PY Integration](../docs/strategic-ai-reference/tools/langgraph-cua-py-integration.md)

## Conversation

### User:

Plan user-facing scenarios where CUAs are needed (file management, local CLI tools, browser actions). Define input patterns and map to `CUActionRequest` schema for testing.

### Assistant:

I'll develop a comprehensive plan for user-facing scenarios that would benefit from Computer Use Agent (CUA) capabilities. Let me break this down into categories and map them to the CUActionRequest schema.

## File Management Scenarios

### 1. Configuration File Operations

Users often need to view, edit, or create configuration files. These operations are perfect candidates for CUA automation.

**Example User Inputs:**
- "Show me the content of tsconfig.json"
- "Update package.json to add lodash as a dependency"
- "Create a new .env file with DATABASE_URL=postgres://localhost:5432/mydb"

**CUActionRequest Mapping:**
```typescript
// Reading configuration
{
  action_type: "open_file",
  payload: {
    path: "tsconfig.json"
  },
  context: {
    agent_id: "cline-123",
    timestamp: "2023-05-01T12:00:00Z"
  }
}

// Updating configuration
{
  action_type: "write_file",
  payload: {
    path: "package.json",
    content: "...", // Updated content
    append: false
  },
  context: {
    agent_id: "cline-123",
    timestamp: "2023-05-01T12:05:00Z"
  }
}

// Creating configuration
{
  action_type: "write_file",
  payload: {
    path: ".env",
    content: "DATABASE_URL=postgres://localhost:5432/mydb",
    append: false
  },
  context: {
    agent_id: "cline-123",
    timestamp: "2023-05-01T12:10:00Z"
  }
}
```

[Additional scenario details follow...]

## Testing Strategy

For each scenario, we should test:
1. Natural language detection accuracy
2. Parameter extraction precision
3. Error handling for invalid inputs
4. Security validation for sensitive operations

I recommend creating a test suite with both unit tests for the CUA intent router and integration tests for end-to-end flows.

## User Experience Recommendations

1. Always confirm potentially destructive actions before execution
2. Provide clear feedback about what action was taken
3. Use dry-run mode for new users to build trust
4. Maintain an audit log of all CUA actions for transparency

Would you like me to expand on any particular scenario or aspect of this plan?
