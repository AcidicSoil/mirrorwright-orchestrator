**Created:** 4/30/2025 23:27  
**Updated:** 4/30/2025 23:31  
**Exported:** 5/1/2025 7:55  

## Prompt:
# Mirrorwright Orchestrator - Strategic AI Prompt
 
## Initial Context Setup
🤖 Understood: Working alongside my multi-agent Cursor system (Cline, Augment) and .cursorrules framework.

We are continuing development on our **Mirrorwright Orchestrator** project, focusing on implementing the core protocol components from our clean-slate approach.

## Task Context
We need to define and implement the Protocol Schema structure for Mirrorwright. Based on our earlier planning, we need to create detailed TypeScript interfaces and corresponding JSON schemas for the core protocol concepts: Protocols, Modes, and Rituals.

Specifically, I need help designing the schema validation approach that will ensure user-authored protocol files (in YAML/JSON) conform to our expected structure before being loaded into the engine.

## Working Model: GPT-4.5
(Selected for specification writing and schema design)

## Implementation Phase: Protocol Definition

## Expected Output:
1. Expanded TypeScript interface definitions for Protocol, Mode, and Ritual entities, building upon our initial types
2. A recommended approach for JSON Schema validation of these structures
3. Example of how validation would be implemented in the codebase
4. Considerations for extending the schema in the future

## Additional Context or Constraints:
- We've already established initial TypeScript interfaces in our planning:
typescript
export interface Protocol {
  id: string;
  name: string;
  description?: string;
  modes: string[];
  rituals: Record<string, RitualDefinition>;
}

export interface ModeDefinition {
  id: string;
  name: string;
  entryRitual: string;
  exitRitual?: string;
  config?: Record<string, any>;
}

export interface RitualDefinition {
  id: string;
  steps: RitualStep[];
  description?: string;
}

export interface RitualStep {
  type: 'prompt' | 'action' | 'pause';
  content: string;
  next?: string;
}
- We're using Ajv for JSON Schema validation
- All protocol files will be authored in YAML for readability but processed as JSON internally

## Response:
🤖 Acknowledged: Collaborating strategically with your multi-agent Cursor system (Cline, Augment) and aligning with `.cursorrules` framework.

Let's approach this systematically, ensuring clarity, flexibility, and forward compatibility.

* * *

🧩 1. Expanded TypeScript Interface Definitions
-----------------------------------------------

Building upon your initial types, let's explicitly detail and expand them to robustly capture the structure, validation points, and configurability.

### **Updated Protocol Entities**

```typescript
export interface Protocol {
  id: string; // unique identifier
  name: string;
  description?: string;
  version: string; // schema versioning for future changes
  modes: ModeDefinition[]; // direct embedding for clarity
  rituals: Record<string, RitualDefinition>;
  metadata?: Record<string, any>; // extensibility point for custom data
}

export interface ModeDefinition {
  id: string;
  name: string;
  entryRitual: string; // explicit reference
  exitRitual?: string;
  config?: Record<string, any>; // customizable mode configuration
  allowedTransitions?: string[]; // restrict mode-to-mode transitions
}

export interface RitualDefinition {
  id: string;
  description?: string;
  steps: RitualStep[];
  metadata?: Record<string, any>; // extensibility point
}

export interface RitualStep {
  type: 'prompt' | 'action' | 'pause';
  content: string;
  next?: string; // explicit control flow (if omitted, linear assumed)
  conditions?: Condition[]; // optional conditions to determine if the step runs
}

export interface Condition {
  variable: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: any;
}
```

* * *

✅ 2. Recommended JSON Schema Validation Approach
------------------------------------------------

Given your use of Ajv, we'll define robust JSON Schemas directly aligned to our interfaces:

### **Recommended Structure:**

*   Maintain individual JSON Schema definitions per core entity (`Protocol`, `Mode`, `Ritual`)
    
*   Use `$ref` extensively for schema reuse and clarity
    
*   Enable strict validation (`additionalProperties: false`) to prevent unintended fields
    

Example JSON Schema Outline:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "Condition": {
      "type": "object",
      "properties": {
        "variable": {"type": "string"},
        "operator": {"type": "string", "enum": ["==", "!=", ">", "<", ">=", "<="]},
        "value": {}
      },
      "required": ["variable", "operator", "value"],
      "additionalProperties": false
    },
    "RitualStep": {
      "type": "object",
      "properties": {
        "type": {"type": "string", "enum": ["prompt", "action", "pause"]},
        "content": {"type": "string"},
        "next": {"type": "string"},
        "conditions": {
          "type": "array",
          "items": {"$ref": "#/definitions/Condition"}
        }
      },
      "required": ["type", "content"],
      "additionalProperties": false
    },
    "RitualDefinition": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "description": {"type": "string"},
        "steps": {
          "type": "array",
          "items": {"$ref": "#/definitions/RitualStep"}
        },
        "metadata": {"type": "object"}
      },
      "required": ["id", "steps"],
      "additionalProperties": false
    },
    "ModeDefinition": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "entryRitual": {"type": "string"},
        "exitRitual": {"type": "string"},
        "config": {"type": "object"},
        "allowedTransitions": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "required": ["id", "name", "entryRitual"],
      "additionalProperties": false
    },
    "Protocol": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "version": {"type": "string"},
        "modes": {
          "type": "array",
          "items": {"$ref": "#/definitions/ModeDefinition"}
        },
        "rituals": {
          "type": "object",
          "additionalProperties": {"$ref": "#/definitions/RitualDefinition"}
        },
        "metadata": {"type": "object"}
      },
      "required": ["id", "name", "version", "modes", "rituals"],
      "additionalProperties": false
    }
  },
  "$ref": "#/definitions/Protocol"
}
```

* * *

🚧 3. Example Validation Implementation in Codebase
---------------------------------------------------

Using Ajv in the TypeScript codebase:

**Example:**

```typescript
import Ajv, { ValidateFunction } from 'ajv';
import schema from './protocol-schema.json';

const ajv = new Ajv({ allErrors: true });
const validate: ValidateFunction = ajv.compile(schema);

export function validateProtocol(protocolJson: any) {
  const valid = validate(protocolJson);
  if (!valid) {
    console.error(validate.errors);
    throw new Error(`Protocol validation failed: ${ajv.errorsText(validate.errors)}`);
  }
  return true;
}

// Usage Example
import yaml from 'yaml';
import fs from 'fs';

const file = fs.readFileSync('protocol.yaml', 'utf8');
const protocol = yaml.parse(file);

try {
  validateProtocol(protocol);
  console.log('✅ Protocol is valid!');
} catch (error) {
  console.error('❌ Validation Error:', error);
}
```

* * *

🔍 4. Future-Proofing Schema Considerations
-------------------------------------------

*   **Versioning**: Include a mandatory `version` field to manage schema evolutions explicitly.
    
*   **Metadata Field**: Use `metadata` objects to safely add extra info without breaking existing schema rules.
    
*   **Conditions**: Allow `conditions` arrays on `RitualStep` to facilitate future conditional execution logic.
    
*   **Allowed Transitions**: Define explicit `allowedTransitions` to enforce intentional mode transitions.
    
*   **Enum Extensions**: Keep enum fields (`type`, `operator`) open-ended (via configuration) for future growth.
    

* * *

📝 Recommended Next Steps (Prompts for Agents):
-----------------------------------------------

**Prompt for Cursor Cline:**

*   Scaffold JSON schema files (`protocol-schema.json`) into the repository under `/schemas`.
    
*   Setup the Ajv validation environment (dependencies, configuration).
    

**Prompt for Cursor Augment:**

*   Optimize schema loading and validation functions for better performance and clearer error logging.
    
*   Setup test suite to validate schema robustness.
    

* * *

This structure provides comprehensive validation, clear integration points, and flexibility for future Mirrorwright enhancements. Let’s verify and integrate with the Cursor agents to move forward efficiently!



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)