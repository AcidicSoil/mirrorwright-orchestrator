# Protocol Schema

This document defines the JSON Schema for protocols in the Mirrorwright Orchestrator system.

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "title": "Protocol",
  "type": "object",
  "properties": {
    "id": {"type": "string"},
    "name": {"type": "string"},
    "description": {"type": ["string", "null"]},
    "version": {"type": "string"},
    "modes": {
      "type": "array",
      "items": {"$ref": "#/definitions/ModeDefinition"}
    },
    "rituals": {
      "type": "object",
      "additionalProperties": {"$ref": "#/definitions/RitualDefinition"}
    },
    "metadata": {"type": ["object", "null"]}
  },
  "required": ["id", "name", "version", "modes", "rituals"],
  "definitions": {
    "ModeDefinition": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "entryRitual": {"type": "string"},
        "exitRitual": {"type": ["string", "null"]},
        "config": {"type": ["object", "null"]},
        "allowedTransitions": {
          "type": ["array", "null"],
          "items": {"type": "string"}
        }
      },
      "required": ["id", "name", "entryRitual"]
    },
    "RitualDefinition": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "description": {"type": ["string", "null"]},
        "steps": {
          "type": "array",
          "items": {"$ref": "#/definitions/RitualStep"}
        },
        "metadata": {"type": ["object", "null"]}
      },
      "required": ["id", "steps"]
    },
    "RitualStep": {
      "type": "object",
      "properties": {
        "type": {"type": "string", "enum": ["prompt", "action", "pause"]},
        "content": {"type": "string"},
        "next": {"type": ["string", "null"]},
        "conditions": {
          "type": ["array", "null"],
          "items": {"$ref": "#/definitions/Condition"}
        }
      },
      "required": ["type", "content"]
    },
    "Condition": {
      "type": "object",
      "properties": {
        "variable": {"type": "string"},
        "operator": {
          "type": "string",
          "enum": ["==", "!=", ">", "<", ">=", "<="]
        },
        "value": {}
      },
      "required": ["variable", "operator", "value"]
    }
  }
}
```

## Schema Components

### Protocol

The top-level protocol definition includes:

- **id**: A unique identifier for the protocol
- **name**: A human-readable name for the protocol
- **description**: An optional description of the protocol
- **version**: The version of the protocol
- **modes**: An array of mode definitions
- **rituals**: A map of ritual definitions
- **metadata**: Optional additional metadata

### Mode Definition

A mode represents a specific operational context within a protocol:

- **id**: A unique identifier for the mode
- **name**: A human-readable name for the mode
- **entryRitual**: The ritual to run when entering this mode
- **exitRitual**: An optional ritual to run when exiting this mode
- **config**: Optional configuration for this mode
- **allowedTransitions**: Optional list of modes that can be transitioned to from this mode

### Ritual Definition

A ritual defines a sequence of steps to accomplish a specific goal:

- **id**: A unique identifier for the ritual
- **description**: An optional description of the ritual
- **steps**: An array of ritual steps
- **metadata**: Optional additional metadata

### Ritual Step

A step within a ritual:

- **type**: The type of step (prompt, action, or pause)
- **content**: The content of the step (e.g., prompt text, action command)
- **next**: An optional identifier for the next step
- **conditions**: Optional conditions for executing this step

### Condition

A condition for executing a ritual step:

- **variable**: The variable to check
- **operator**: The comparison operator
- **value**: The value to compare against
