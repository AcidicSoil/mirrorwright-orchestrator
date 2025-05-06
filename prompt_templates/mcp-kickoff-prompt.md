---
agent: strategicai
purpose: kickoff
id: mcp-lmstudio-kickoff
version: 1.0.0
---

# 🧠 Model Context Protocol (MCP) — Multi-Agent Kickoff Prompt

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Augment, Cline, Roo, VibeCheck, PromptRouter, StrategicAI) and governed by `.cursorrules`.

This kickoff prompt coordinates the **Model Context Protocol (MCP)** implementation for LM Studio — enabling offline-first operation with structured output capabilities, tool invocation, and custom function calling to match online GPT-class models.

---

## 🎯 Task Context

The MCP LM Studio plugin project requires a coordinated effort across multiple specialized agents to implement a complete offline LM Studio setup with MCP-style tool calling, structured output validation, and custom function capabilities. This kickoff prompt initiates and orchestrates this multi-agent workflow.

---

## 🧩 Current Phase

- [x] Architecture Planning
- [ ] Protocol Definition
- [x] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Models & Agent Roles

| Agent | Role | Primary Responsibility |
|-------|------|------------------------|
| **StrategicAI** | Coordinator | Transform user intent into structured, phase-aware prompt blueprints aligned with protocol objectives |
| **Augment** | Implementer | Scaffolding, optimization, and refactoring with focus on protocol schemas and speculative alternatives |
| **Cline** | Architect | Strategic planning and requirements clarification for the MCP architecture |
| **Roo** | Tooling Specialist | Autonomous code-generation and CLI tooling for MCP implementation |
| **VibeCheck** | Quality Control | Flag deviations from core orchestration tone, scope, or clarity across agent communications |
| **PromptRouter** | Workflow Manager | Route prompts to optimal model and protocol phase context based on task intent |

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- `prompt_templates/lm-studio-mcp-setup-prompt.md` - Initial setup prompt
- `prompt_templates/lm-studio-mcp-handoff.md` - Handoff documentation
- LM Studio documentation: https://lmstudio.ai/docs/app/api/structured-output

### Relevant Memory Bank Tags:
[#mcp], [#tool], [#schema], [#validation], [#offline], [#lmstudio]

---

## ✅ Expected Output

1. Complete `mcp-config.json` configuration for LM Studio
2. Custom schemas for function calling, JSON structure output, and tool arguments
3. Example tool definitions (`*.tool.json` or `*.mcp-tool.yml`)
4. Edge case testing scenarios for validation
5. Example assistant prompts demonstrating offline function-calling
6. Integration with Mirrorwright Orchestrator

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

## 🧠 Memory Hooks

```bash
python tools/memory.py save --title "MCP LM Studio Kickoff" \
  --tags lmstudio,mcp,offline,tool-calling,structured-output,kickoff \
  --notes "Kickoff for MCP LM Studio plugin project with multi-agent coordination"
```

---

## 🛠️ Multi-Agent Workflow

### 1. StrategicAI (Coordinator)
- **Input**: User requirements and project context
- **Output**: Structured blueprint for MCP implementation
- **Handoff**: `#handoff→Cline` for architecture planning

### 2. Cline (Architect)
- **Input**: StrategicAI blueprint
- **Output**: Detailed architecture and requirements specification
- **Handoff**: `#handoff→Augment` for implementation

### 3. Augment (Implementer)
- **Input**: Cline's architecture specification
- **Output**: Implementation of `mcp-config.json` and schema definitions
- **Handoff**: `#handoff→Roo` for tooling and CLI development

### 4. Roo (Tooling Specialist)
- **Input**: Augment's implementation
- **Output**: CLI tools and example tool definitions
- **Handoff**: `#handoff→VibeCheck` for quality control

### 5. VibeCheck (Quality Control)
- **Input**: Complete implementation
- **Output**: Quality assessment and improvement suggestions
- **Handoff**: `#handoff→PromptRouter` for workflow optimization

### 6. PromptRouter (Workflow Manager)
- **Input**: Validated implementation
- **Output**: Optimized prompt routing for MCP workflow
- **Handoff**: `#handoff→StrategicAI` for final review and user presentation

---

## 📌 Reference

- **Kickoff Summary**: [MCP LM Studio Kickoff]
- **Strategic Guidelines**: [Mirrorwright Reference Guide]
- **Project Prompt Template**: [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands**: [`.cursorrules-quickref.md`]
- **Original LM Studio MCP Setup**: [prompt_templates/lm-studio-mcp-setup-prompt.md]

---

## 💬 Initial Agent Prompts

### StrategicAI Initial Prompt
```
Transform the MCP LM Studio requirements into a structured blueprint for implementation, focusing on offline operation, tool calling capabilities, and structured output validation.
```

### Cline Initial Prompt
```
Based on the StrategicAI blueprint, develop a detailed architecture for the MCP LM Studio plugin, specifying component interactions, data flows, and integration points with Mirrorwright Orchestrator.
```

### Augment Initial Prompt
```
Implement the core MCP configuration and schema definitions based on Cline's architecture, ensuring compatibility with LM Studio's API and Mirrorwright Orchestrator's requirements.
```

### Roo Initial Prompt
```
Develop CLI tools and example tool definitions for the MCP LM Studio plugin, focusing on developer ergonomics and integration with existing workflows.
```

### VibeCheck Initial Prompt
```
Evaluate the MCP implementation for alignment with project goals, consistency across components, and adherence to best practices for offline LLM operation.
```

### PromptRouter Initial Prompt
```
Optimize prompt routing for the MCP workflow, ensuring efficient coordination between agents and appropriate model selection for different tasks.
```
