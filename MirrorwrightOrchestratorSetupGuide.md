
# Mirrorwright Orchestrator Setup Guide

Here are specific prompts and instructions you can use with your Cursor assistants to build your project:

## 1. Project Initialization (Terminal Commands)

```bash
# Initialize the project with pnpm
mkdir -p mirrorwright-orchestrator
cd mirrorwright-orchestrator
pnpm init
pnpm add -D typescript @types/node ts-node
pnpm add ajv yaml
pnpm pkg set "type"="module"
pnpm pkg set "engines.node"=">=18"

# Create basic directory structure
mkdir -p src/{types,schemas,validation,engine,cli} protocols test
```

## 2. TypeScript Setup (Prompt for Cline)

```
Create a tsconfig.json file configured for a modern TypeScript project with:
- ESNext module system
- Strict type checking
- Source maps enabled
- Output directory set to dist
- Include appropriate directories
- Target ES2022 or later
```

## 3. Implement Core Types (Prompt for Cline)

```
Create src/types/index.ts with the TypeScript interfaces for our protocol system, based on:

- Protocol interface with id, name, description, version, modes array, rituals record
- ModeDefinition with id, name, entryRitual, exitRitual, config, and allowedTransitions
- RitualDefinition with id, description, steps array
- RitualStep with type (prompt, action, pause), content, next, and conditions
- Condition interface for step execution logic

Add proper JSDoc comments for all interfaces and properties.
```

## 4. Schema Creation (Prompt for Cline)

```
Create src/schemas/protocol-schema.json implementing the JSON Schema for our Protocol type.
Use draft-07 schema with:
- Clear definitions section for all component schemas
- References ($ref) for component reuse
- Required fields properly specified
- Appropriate property types and constraints
- Nested validation for complex structures
```

## 5. Validation Utility (Prompt for Augment)

```
Create src/validation/validate-protocol.ts that:
1. Imports Ajv and our schema
2. Sets up a validator with allErrors enabled
3. Exports a validateProtocol function that:
   - Takes a protocol object
   - Validates it against our schema
   - Returns the protocol typecasted if valid
   - Throws detailed validation errors if invalid
4. Includes a utility to validate from YAML files
```

## 6. Sample Protocol (Prompt for Augment)

```
Create protocols/meta-thinking/protocol.yaml as a reference implementation with:
- All required Protocol fields
- At least 2 modes (strategic-planning, implementation)
- Simple entry/exit rituals
- Example ritual steps showing different step types
- Sample conditions for conditional execution
- Comprehensive metadata to demonstrate extensibility
```

## 7. CLI Entry Point (Prompt for Cline)

```
Create src/cli/index.ts implementing a basic CLI that:
1. Uses commander or similar for argument parsing
2. Provides a validate command to validate protocol files
3. Includes help text explaining usage
4. Handles errors gracefully with descriptive messages
5. Supports validating a single file or directory of protocols
```

## 8. Custom Instructions for Cursor Assistants

### For Augment:

```
You are the optimization specialist for Mirrorwright Orchestrator.
Focus on:
- Ensuring protocol validation is robust and performant
- Creating comprehensive test cases for schema validation
- Refactoring code to improve maintainability
- Implementing advanced features for protocol execution
- Emphasizing TypeScript best practices
```

### For Cline:

```
You are the architecture specialist for Mirrorwright Orchestrator.
Focus on:
- Implementing the core TypeScript interfaces
- Creating the directory structure and essential files
- Establishing best practices for protocol design
- Setting up initial CLI functionality
- Building on the TypeScript schema designs
```

## 9. Package Scripts (Prompt for Cline)

```
Update package.json scripts to include:
- build: Compile TypeScript
- start: Run the compiled CLI
- dev: Run with ts-node for development
- validate: Run schema validation on example protocols
- test: Run test suite
- lint: Run ESLint or similar for code quality
```

Let me know which specific area you'd like to focus on first, and I can provide more detailed guidance!
