# Mode Schema

This document defines the JSON Schema for modes in the Mirrorwright Orchestrator system.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "entryRitual": {
      "type": "string"
    },
    "exitRitual": {
      "type": ["string", "null"]
    },
    "contextModifiers": {
      "type": "object",
      "additionalProperties": true
    },
    "activeRituals": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "allowedTransitions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "config": {
      "type": "object",
      "additionalProperties": true
    }
  },
  "required": ["id", "name", "entryRitual"],
  "additionalProperties": false
}
```

## Schema Components

### Mode

A mode represents a specific operational context within a protocol:

- **id**: A unique identifier for the mode
- **name**: A human-readable name for the mode
- **title**: An optional title for the mode (can be more descriptive than the name)
- **description**: An optional description of the mode
- **entryRitual**: The ritual to run when entering this mode
- **exitRitual**: An optional ritual to run when exiting this mode
- **contextModifiers**: Optional modifiers to apply to the context when in this mode
- **activeRituals**: Optional list of rituals that are active in this mode
- **allowedTransitions**: Optional list of modes that can be transitioned to from this mode
- **config**: Optional configuration for this mode

## Usage

Modes are used to define specific operational contexts within a protocol. They specify which rituals to run when entering or exiting the mode, what context modifiers to apply, and which other modes can be transitioned to.

Example:

```yaml
id: strategic-planning
name: Strategic Planning Mode
description: Focused on high-level architecture and system design
entryRitual: strategic-entry
exitRitual: strategic-exit
contextModifiers:
  focus: architecture
  depth: high-level
activeRituals:
  - architecture-review
  - system-design
allowedTransitions:
  - implementation
  - creative-exploration
config:
  promptModifiers:
    - prefix: 'You are now in Strategic Planning mode.'
    - suffix: 'Consider long-term implications of design choices.'
```
