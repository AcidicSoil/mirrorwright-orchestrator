**Created:** 5/2/2025 21:32  
**Updated:** 5/2/2025 21:33  
**Exported:** 5/2/2025 21:39  

## Prompt:
# Mirrorwright Orchestrator - Strategic AI Prompt

## Initial Context Setup
🤖 Understood: Working alongside my multi-agent Cursor system (Cline, Augment) and .cursorrules framework.

We have just completed initial project scaffolding via Cursor Cline. Now, we are entering the **Protocol Definition** phase.

## Working Model: GPT-4.5

## Implementation Phase: Protocol Definition

## Task:
Define and validate schema structures for:
- Protocols
- Modes
- Rituals

## Expected Output:
- TypeScript interface definitions
- Corresponding JSON Schemas
- Example YAML file(s)
- AJV-based validator function scaffolds

## Additional Constraints:
- File-based YAML definitions should be schema-validated before loading into the engine
- Ritual steps may include metacognitive hooks, prompt template references, or conditional logic

## Response:
🤖 **Context Sync:**  
Working within the multi-agent Cursor system (Cline, Augment) and aligned with `.cursorrules`. You've successfully completed initial project scaffolding via Cursor Cline and are now progressing to the **Protocol Definition** phase of the **Mirrorwright Orchestrator**.

* * *

Strategic Outline for Protocol Definition Phase (Using GPT-4.5)
---------------------------------------------------------------

### 📌 **Task Breakdown:**

**Objective:** Clearly define schema structures for:

*   **Protocols**
    
*   **Modes**
    
*   **Rituals**
    

* * *

🛠️ Recommended Structured Deliverables:
----------------------------------------

### 1️⃣ **TypeScript Interface Definitions:**

Define clear, extensible interfaces for your data models:

```typescript
// Protocol definition
export interface Protocol {
  name: string;
  description?: string;
  version: string;
  modes: Mode[];
  rituals: Ritual[];
}

// Mode definition
export interface Mode {
  id: string;
  name: string;
  description?: string;
  activeRitualIds: string[];
  contextModifiers?: Record<string, any>;
}

// Ritual definition
export interface Ritual {
  id: string;
  name: string;
  description?: string;
  steps: RitualStep[];
}

// Ritual step definition
export interface RitualStep {
  stepType: 'metacognitive' | 'promptTemplate' | 'conditionalLogic';
  action: string;
  conditions?: Record<string, any>;
  templateRef?: string;
}
```

* * *

### 2️⃣ **JSON Schema Definitions (for AJV Validation):**

Create JSON schema files corresponding directly to the TypeScript interfaces above.

**Example (protocol.schema.json):**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Protocol",
  "type": "object",
  "required": ["name", "version", "modes", "rituals"],
  "properties": {
    "name": { "type": "string" },
    "description": { "type": "string" },
    "version": { "type": "string" },
    "modes": {
      "type": "array",
      "items": { "$ref": "#/definitions/Mode" }
    },
    "rituals": {
      "type": "array",
      "items": { "$ref": "#/definitions/Ritual" }
    }
  },
  "definitions": {
    "Mode": {
      "type": "object",
      "required": ["id", "name", "activeRitualIds"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "activeRitualIds": { 
          "type": "array",
          "items": { "type": "string" }
        },
        "contextModifiers": { "type": "object" }
      }
    },
    "Ritual": {
      "type": "object",
      "required": ["id", "name", "steps"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "steps": {
          "type": "array",
          "items": { "$ref": "#/definitions/RitualStep" }
        }
      }
    },
    "RitualStep": {
      "type": "object",
      "required": ["stepType", "action"],
      "properties": {
        "stepType": { 
          "type": "string",
          "enum": ["metacognitive", "promptTemplate", "conditionalLogic"]
        },
        "action": { "type": "string" },
        "conditions": { "type": "object" },
        "templateRef": { "type": "string" }
      }
    }
  }
}
```

* * *

### 3️⃣ **Example YAML File(s):**

An example YAML file illustrating a realistic Protocol definition (`protocol-example.yaml`):

```yaml
name: "Meta-Thinking Protocol"
description: "Guides agent interactions with strategic meta-cognition"
version: "1.0.0"
modes:
  - id: "meta-thinking"
    name: "Meta-Thinking Mode"
    description: "Facilitates reflective agent strategies"
    activeRitualIds: ["ritual-reflective-prompting"]
    contextModifiers:
      reflectionDepth: 3

rituals:
  - id: "ritual-reflective-prompting"
    name: "Reflective Prompting"
    description: "Executes strategic reflective questioning"
    steps:
      - stepType: "promptTemplate"
        action: "invoke-prompt-template"
        templateRef: "templates/reflective-prompt.md"
      - stepType: "metacognitive"
        action: "record-reflection"
      - stepType: "conditionalLogic"
        action: "evaluate-next-step"
        conditions:
          reflectionScore: ">5"
```

* * *

### 4️⃣ **AJV-based Validator Function Scaffolds:**

Set up AJV validator scaffolds to ensure YAML definitions are correct before loading:

```typescript
import Ajv from 'ajv';
import yaml from 'js-yaml';
import fs from 'fs';

const ajv = new Ajv({ allErrors: true });

// Load schema
const schema = JSON.parse(fs.readFileSync('schemas/protocol.schema.json', 'utf-8'));
const validateProtocol = ajv.compile(schema);

// Validator function scaffold
export function validateProtocolYaml(filePath: string) {
  const yamlData = yaml.load(fs.readFileSync(filePath, 'utf-8'));
  const valid = validateProtocol(yamlData);

  if (!valid) {
    console.error('Validation errors:', validateProtocol.errors);
    throw new Error('Invalid protocol definition.');
  }

  return yamlData; // Valid protocol object
}
```

* * *

🚩 Strategic Considerations & Next Steps:
-----------------------------------------

*   **Validation Layer First**: Prioritize robust schema validation upfront to minimize runtime errors.
    
*   **Iterative Schema Design**: Be prepared for schema refinement based on practical feedback during implementation.
    
*   **Cross-Model Validation**: For critical schema elements, consider ensemble validation with GPT-4o to ensure robustness of the schema logic.
    

* * *

📝 Prepared Prompt for Cursor Augment:
--------------------------------------

To delegate optimization, provide the following prepared instruction:

**Prompt for Cursor Augment:**

> **Phase:** Protocol Definition (Validation)  
> **Task:**
> 
> *   Review AJV validator implementation for performance
>     
> *   Recommend optimization strategies for schema compilation and validation speed
>     
> *   Suggest comprehensive test cases for protocol validation
>     

* * *

📌 **Next Actionable Steps:**

*   Implement these schema definitions and validators into your project.
    
*   Run validation tests iteratively.
    
*   Prepare to use **GPT-4o-mini** for rapid iteration on AJV validator implementations and **GPT-4o** for cross-model validation.
    

This structured approach ensures your Protocol Definition phase is solid, scalable, and strategically aligned with the Mirrorwright Orchestrator's vision and goals.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)