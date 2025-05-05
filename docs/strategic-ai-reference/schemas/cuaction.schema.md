# CUAction Schema Documentation

## Overview

The `cuaction.schema.json` defines the structure for Computer Use Agent (CUA) action requests and responses in the Mirrorwright Orchestrator system. These schemas enable standardized communication between agents and the CUA system for file operations, command execution, and web browsing.

## Purpose

- Standardize how agents request computer use actions
- Enable validation of CUA requests and responses
- Support traceability and logging of CUA actions
- Ensure security through structured validation

## Schema Structure

### CUActionRequest

The CUActionRequest schema defines the structure for requesting a CUA action:

```json
{
  "action_type": "open_file | write_file | run_command | browse_web",
  "payload": {
    // Action-specific payload
  },
  "context": {
    "mode": "string",
    "agent_id": "string",
    "timestamp": "string"
  },
  "dry_run": false
}
```

#### Action Types

The schema supports the following action types:

1. **open_file**: Open and read a file
2. **write_file**: Write content to a file
3. **run_command**: Execute a system command
4. **browse_web**: Access a web URL

#### Payloads

Each action type has a specific payload structure:

##### OpenFilePayload

```json
{
  "path": "string"
}
```

##### WriteFilePayload

```json
{
  "path": "string",
  "content": "string",
  "append": false
}
```

##### RunCommandPayload

```json
{
  "command": "string",
  "args": ["string"],
  "cwd": "string",
  "timeout": 30000
}
```

##### BrowseWebPayload

```json
{
  "url": "string"
}
```

#### Context

The context object provides additional information about the action:

```json
{
  "mode": "string",
  "agent_id": "string",
  "timestamp": "string"
}
```

### CUActionResponse

The CUActionResponse schema defines the structure for CUA action responses:

```json
{
  "result": "string | object",
  "status": "success | error",
  "metadata": {
    "duration": 0,
    "retries": 0,
    "environment": {}
  }
}
```

## Validation Rules

The schema enforces the following validation rules:

1. `action_type` must be one of the defined enum values
2. `payload` must match the structure for the specified action type
3. `context.agent_id` and `context.timestamp` are required
4. `result` and `status` are required in responses

## Integration with Other Components

### Agent Adapters

Agent adapters should validate CUA requests against this schema before processing.

### Memory System

The memory system should store CUA actions with appropriate tags based on this schema.

### PromptRouter

The PromptRouter should detect CUA intents and structure them according to this schema.

## Examples

### Example: File Read Request

```json
{
  "action_type": "open_file",
  "payload": {
    "path": "src/config.json"
  },
  "context": {
    "mode": "implementation",
    "agent_id": "augment-123",
    "timestamp": "2023-05-01T12:00:00Z"
  }
}
```

### Example: Command Execution Request

```json
{
  "action_type": "run_command",
  "payload": {
    "command": "npm",
    "args": ["install", "--save", "langgraph-cua-py"],
    "cwd": ".",
    "timeout": 60000
  },
  "context": {
    "mode": "implementation",
    "agent_id": "cline-456",
    "timestamp": "2023-05-01T12:05:00Z"
  },
  "dry_run": true
}
```

### Example: Success Response

```json
{
  "result": "Package installed successfully",
  "status": "success",
  "metadata": {
    "duration": 5432,
    "retries": 0,
    "environment": {
      "node_version": "18.15.0"
    }
  }
}
```

### Example: Error Response

```json
{
  "result": "Error: ENOENT: no such file or directory",
  "status": "error",
  "metadata": {
    "duration": 123,
    "retries": 1,
    "error_code": "ENOENT"
  }
}
```

## Test Fixtures

Test fixtures for this schema are available in:

- `tests/fixtures/cuaction/valid/` (valid examples)
- `tests/fixtures/cuaction/invalid/` (invalid examples for testing)
