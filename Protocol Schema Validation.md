**Created:** 5/2/2025 19:00  
**Updated:** 5/2/2025 19:15  
**Exported:** 5/2/2025 19:16  

## Prompt:
MirrorwrightOrchestratorPlanning(2).md

File

## Response:
Mirrorwright Orchestrator - Strategic AI Prompt
===============================================

Initial Context Setup
---------------------

🤖 Understood: Working alongside my multi-agent Cursor system (Cline, Augment) and `.cursorrules` framework.

We have completed initial project scaffolding via Cursor Cline and are transitioning into the **Protocol Definition** phase of the Mirrorwright Orchestrator project.

Task Context
------------

We need to validate the initial file-based schema setup for **protocols**, **modes**, and **rituals**. This includes ensuring proper structure, creating example YAML files for each type, and scaffolding a validator using AJV that enforces schema compliance before execution.

Working Model: GPT-4.5
----------------------

Implementation Phase: Protocol Definition
-----------------------------------------

Expected Output:
----------------

*   Complete TypeScript interface definitions for `Protocol`, `Mode`, and `Ritual`
    
*   Corresponding JSON Schema files in `schemas/`
    
*   Example YAML files under `protocols/default/` for a simple protocol with at least one mode and one ritual
    
*   A TypeScript module (`validateSchemas.ts`) using AJV to:
    
    *   Load and validate each YAML file
        
    *   Print validation success/failure per file
        

Additional Context or Constraints:
----------------------------------

*   YAML definitions must match their JSON Schema structures exactly
    
*   Each `RitualStep` may optionally include `metaCognitiveHooks` and `expectedOutputFormat`
    
*   This schema system will be the foundation for runtime ritual execution in the next phase
    
*   Use file layout conventions from `.cursorrules-quickref.md` and schema patterns from the kickoff response in `MirrorwrightOrchestratorPlanning(2).md`
    

Do you want me to generate the YAML and validator module for this phase now?

## Prompt:
Y

## Response:
Protocol Schema Validation

```typescript
// src/utils/validateSchemas.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaDir = path.resolve(__dirname, '../../schemas');
const protocolPath = path.resolve(__dirname, '../../protocols/default-protocol.yaml');

const loadSchema = (filename: string) => {
const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, filename), 'utf-8'));
ajv.addSchema(schema, filename);
};

const validateYaml = (yamlPath: string, schemaRef: string) => {
const fileContent = fs.readFileSync(yamlPath, 'utf-8');
const data = yaml.load(fileContent);
const validate = ajv.getSchema(schemaRef);

if (!validate) {
console.error(`Schema not found: ${schemaRef}`);
return;
}

const valid = validate(data);
if (valid) {
console.log(`✅ ${path.basename(yamlPath)} is valid.`);
} else {
console.error(`❌ ${path.basename(yamlPath)} has errors:`);
console.error(validate.errors);
}
};
```

Answer in chat instead

✅ **Protocol schema validation module created** at `src/utils/validateSchemas.ts`.

Next, here are the YAML examples and matching schemas:

* * *

### 📁 `protocols/default-protocol.yaml`

```yaml
name: "default-protocol"
description: "Base example protocol"
modes:
  - id: "meta-thinking"
    title: "Meta Thinking Mode"
    description: "Switches agent into strategic reflection."
    activeRituals: ["demo-ritual"]
rituals:
  - id: "demo-ritual"
    title: "Demo Ritual"
    description: "Basic example flow"
    steps:
      - promptTemplate: "demo-template.md"
        expectedOutputFormat: "text/markdown"
        metaCognitiveHooks: ["reflect:goals", "check:context"]
```

* * *

### 📁 `schemas/protocol.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Protocol",
  "type": "object",
  "required": ["name", "modes", "rituals"],
  "properties": {
    "name": { "type": "string" },
    "description": { "type": "string" },
    "modes": {
      "type": "array",
      "items": { "$ref": "mode.schema.json" }
    },
    "rituals": {
      "type": "array",
      "items": { "$ref": "ritual.schema.json" }
    }
  }
}
```

* * *

### 📁 `schemas/mode.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Mode",
  "type": "object",
  "required": ["id", "title", "activeRituals"],
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "contextModifiers": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "activeRituals": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

* * *

### 📁 `schemas/ritual.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Ritual",
  "type": "object",
  "required": ["id", "title", "steps"],
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["promptTemplate"],
        "properties": {
          "promptTemplate": { "type": "string" },
          "expectedOutputFormat": { "type": "string" },
          "metaCognitiveHooks": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```

* * *

Would you like me to add these YAML and schema files into your local workspace now, or generate another follow-up stub (e.g., CLI `run demo-ritual` handler)?



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)