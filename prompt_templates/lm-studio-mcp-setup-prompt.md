---
agent: strategicai
purpose: implementation
id: lm-studio-mcp-setup
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Configuring LM Studio for offline-first operation with structured output capabilities, tool invocation (MCP-style), and custom function calling to achieve feature parity with online GPT-class models.

---

## 🧩 Current Phase

- [x] Architecture Planning
- [ ] Protocol Definition
- [x] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Model

- [x] GPT-4o – systems/architecture/visual reasoning
- [ ] GPT-4.5 – specs/documentation/creative depth
- [ ] GPT-4o-mini – speed/iteration/CLI+tests
- [ ] Multi-Model – ensemble/reconciliation

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `docs/strategic-ai-reference/schemas/` from Mirrorwright Orchestrator
- LM Studio documentation: https://lmstudio.ai/docs/app/api/structured-output
- Any assistant rule files defining prompt format or structured output validation

### Relevant Memory Bank Tags:
[#mcp], [#tool], [#schema], [#validation], [#offline], [#lmstudio]

---

## ✅ Expected Output

1. Complete `mcp-config.json` configuration for LM Studio to handle tool discovery and JSON output routing
2. Custom schemas for function calling, JSON structure output, and assistant tool arguments
3. Example tool definitions (`tool.json` or `mcp-tool.yml`)
4. Edge case testing scenarios for validation
5. Example assistant prompt demonstrating offline function-calling with structured output

---

## ⚠️ Constraints or Considerations

- [x] Must operate in full offline mode without dependency on external APIs
- [x] Must match capabilities of ChatGPT plugins/function-calling models
- [x] Must support MCP-style tool calling (tool selection, argument validation, function execution)
- [x] Must support custom tools/scripts defined locally
- [x] Must implement JSON Schema validation for output generation
- [x] Must enable agents to read and apply schemas from various sources
- [x] Must allow access to local documentation folders to answer user queries
- [x] Must support output injection into other tools

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "LM Studio MCP Configuration" \
  --tags lmstudio,mcp,offline,tool-calling,structured-output \
  --notes "Configuration for offline LM Studio with MCP-style tool calling and structured output capabilities"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Generate `mcp-config.json` and three example tool definitions with schema for LM Studio offline operation."_
- **Prompt for Cline:** _"Scaffold structured output templates aligned with LM Studio's expected format for offline function-calling."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need to fully configure LM Studio for offline-first operation with feature parity to online GPT-class models. This should enable structured output, tool invocation (MCP-style), and custom function calling with robust local developer tooling. Can you help me set this up?

### Assistant:
I'll help you configure LM Studio for offline-first operation with all the capabilities you're looking for. Let's break this down into manageable components.

First, let's understand what we need to achieve:

1. **Offline MCP Configuration**: We need to create a configuration that allows LM Studio to operate completely offline while supporting structured outputs and tool calling.

2. **Schema Definitions**: We'll need to define schemas for function calling, JSON structure output, and tool arguments.

3. **Tool Definitions**: We'll create example tool definitions that can be discovered and invoked by LM Studio.

4. **Testing Scenarios**: We'll develop edge case tests to ensure robust validation.

5. **Example Prompts**: We'll create example assistant prompts demonstrating the offline function-calling capabilities.

Let's start with the `mcp-config.json` file, which will be the foundation of our setup:

```json
{
  "version": "1.0.0",
  "name": "mirrorwright-lmstudio-mcp",
  "description": "MCP configuration for offline LM Studio operation",
  "toolDiscovery": {
    "paths": [
      "./tools",
      "./custom-tools"
    ],
    "patterns": [
      "**/*.tool.json",
      "**/*.mcp-tool.yml"
    ],
    "refreshInterval": 60000
  },
  "outputRouting": {
    "validateSchema": true,
    "schemaPath": "./schemas/output-schema.json",
    "fallbackBehavior": "prompt-retry",
    "maxRetries": 3
  },
  "functionCalling": {
    "enabled": true,
    "mode": "auto",
    "argumentValidation": true,
    "schemaPath": "./schemas/function-schema.json"
  },
  "localDocumentation": {
    "paths": [
      "./docs",
      "./schemas"
    ],
    "formats": ["md", "json", "pdf"],
    "indexing": {
      "enabled": true,
      "refreshInterval": 3600000
    }
  },
  "logging": {
    "level": "info",
    "path": "./logs",
    "format": "json",
    "includeTimestamp": true
  }
}
```

Would you like me to continue with creating the schema definitions and tool examples next?

### User:
Yes, please continue with the schema definitions and tool examples. Also, could you explain how LM Studio will handle the structured output validation specifically? I want to make sure it properly validates against JSON schemas, especially for edge cases.

### Assistant:
I'll continue with the schema definitions and tool examples, and explain how LM Studio handles structured output validation.

Let's start with the schema definitions. We'll create three key schemas:

1. **Function Calling Schema** - Defines how tools are described and invoked
2. **Output Schema** - Defines the structure of responses
3. **Tool Arguments Schema** - Defines the parameters for specific tools

For the function calling schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Function Calling Schema",
  "type": "object",
  "required": ["name", "description", "parameters"],
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the function to be called"
    },
    "description": {
      "type": "string",
      "description": "A description of what the function does"
    },
    "parameters": {
      "type": "object",
      "description": "The parameters the function accepts",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["object"],
          "description": "The type of the parameters object"
        },
        "properties": {
          "type": "object",
          "description": "The properties of the parameters object"
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "The required properties of the parameters object"
        }
      },
      "required": ["type", "properties"]
    }
  }
}
```

For structured output validation, LM Studio uses a combination of:

1. **Schema Validation**: LM Studio validates outputs against JSON schemas using a library similar to AJV. This ensures that:
   - All required fields are present
   - Field types match expectations
   - String formats (like dates, emails) are valid
   - Numeric ranges are respected
   - Array lengths are within bounds

2. **Edge Case Handling**: LM Studio specifically addresses these edge cases:
   - **Optional vs. Required Fields**: The schema explicitly marks which fields are required
   - **Null Values**: Schema defines whether null is acceptable for each field
   - **Format Constraints**: Validates string formats (dates, URLs, emails)
   - **Default Values**: Applies defaults when fields are missing but have defaults defined
   - **Over-specification**: Handles additional properties based on schema configuration

3. **Validation Process**:
   - Pre-validation: Before sending to tools, validates structure
   - Runtime validation: During tool execution
   - Post-validation: After tool execution, validates return values

Let me show you an example tool definition that demonstrates these principles:

```json
{
  "name": "weather-lookup",
  "version": "1.0.0",
  "description": "Look up weather information for a location",
  "offline": true,
  "execution": {
    "type": "local-script",
    "path": "./tools/weather.js",
    "timeout": 5000
  },
  "schema": {
    "input": {
      "type": "object",
      "required": ["location"],
      "properties": {
        "location": {
          "type": "string",
          "description": "City name or coordinates"
        },
        "units": {
          "type": "string",
          "enum": ["metric", "imperial"],
          "default": "metric",
          "description": "Temperature units"
        },
        "forecast": {
          "type": "boolean",
          "default": false,
          "description": "Include forecast data"
        }
      }
    },
    "output": {
      "type": "object",
      "required": ["temperature", "conditions"],
      "properties": {
        "temperature": {
          "type": "number",
          "description": "Current temperature"
        },
        "conditions": {
          "type": "string",
          "description": "Weather conditions description"
        },
        "humidity": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Humidity percentage"
        },
        "forecast": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["day", "temperature"],
            "properties": {
              "day": {
                "type": "string",
                "format": "date",
                "description": "Forecast date"
              },
              "temperature": {
                "type": "number",
                "description": "Forecasted temperature"
              }
            }
          }
        }
      }
    }
  }
}
```

Would you like me to continue with more tool examples and the edge case testing scenarios?

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
