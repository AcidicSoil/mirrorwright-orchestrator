**Created:** 5/4/2025 9:08  
**Updated:** 5/4/2025 11:25  
**Exported:** 5/4/2025 11:26  

## Prompt:
# Mirrorwright Orchestrator - Strategic AI Prompt 

## Initial Context Setup

🤖 Working alongside multi-agent Cursor system (Cline, Augment) and `.cursorrules` framework.

## Project Context

We've recently enhanced the Mirrorwright Orchestrator with a robust validation system and execution pipeline. Key improvements include:

1. Enhanced SchemaRegistry with dynamic loading and caching
2. Improved ValidatorEngine with hooks and event-based validation
3. Robust RitualEngine with an event-driven execution pipeline
4. CLI integration for ritual execution and validation

We're now moving toward implementing the Agent Interface Layer and multi-agent collaboration mechanisms.

## Question/Task

What's the most effective architecture for implementing the Agent Interface Layer that will enable seamless communication between different agent types while maintaining protocol compliance?

## Current Approach

We're considering two main approaches:

1. **Message Bus Pattern**: A central message bus that all agents connect to, with protocol-specific message validation
2. **Direct Agent Communication**: Agents communicate directly with each other, with protocol validation at the agent level

Both approaches would leverage our enhanced ValidatorEngine for message validation.

## Constraints

- Must work with our existing TypeScript/Node.js codebase
- Must support multiple agent types (LLM, rule-based, human-in-the-loop)
- Must maintain protocol compliance through validation
- Must be extensible for future agent types
- Must support both synchronous and asynchronous communication
- Must provide clear error handling and recovery mechanisms

## Working Model

- [x] GPT-4o (for architecture, complex design, visual reasoning)
- [ ] GPT-4.5 (for specifications, documentation, creative exploration)
- [ ] GPT-4o-mini (for rapid implementation, iterative refinements)

## Implementation Phase

- [x] Architecture Planning
- [x] Protocol Definition
- [ ] Implementation & Prototyping
- [ ] Validation & Testing

## Expected Output

A detailed architecture proposal for the Agent Interface Layer, including:

1. Recommended approach with justification
2. Key components and their responsibilities
3. Communication flow diagrams
4. Interface definitions for agent integration
5. Error handling and recovery strategies
6. Considerations for future extensibility
fix up template that was originally overwritten by assistant, retrieve the original or recreate it if necessary. template needs to be usable at any stage of processing. user should be able to hand this to cursor assistants in IDE or chatGPT project GPT's, then they should be able to fill in the template for either or assistant or GPT to rapidly iterate the dev workflow

## Response:
Here is a **recreated and upgraded universal template** for Mirrorwright Orchestrator strategic development prompts. It merges your overwritten version with the original strategic scaffold from `chatGPT-strategicAI-prompt_template.md`chatGPT-strategicAI-pro…, enhanced to support any stage of development and usable by both Cursor agents and ChatGPT across models.

* * *

````markdown
# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

[Fill in the current objective — e.g., “Refining Agent Interface Layer architecture”, “Implementing CLI for ritual execution”, “Writing docs for mode schema”]

---

## 🧩 Current Phase  
(Select one from the dropdowns below)

- [ ] Architecture Planning  
- [ ] Protocol Definition  
- [ ] Implementation & Prototyping  
- [ ] Validation & Testing  
- [ ] Documentation & Examples  
- [ ] Debugging / Triage  

---

## 🤖 Working Model  
(Use model matching per `.cursorrules-quickref.md` and memory bank guidance)

- [ ] GPT-4o – systems/architecture/visual reasoning  
- [ ] GPT-4.5 – specs/documentation/creative depth  
- [ ] GPT-4o-mini – speed/iteration/CLI+tests  
- [ ] Multi-Model – ensemble/reconciliation  

---

## 📦 Task Input

### Input Files / Schemas / Specs:
[Reference any filenames (e.g., `protocols/agent-sync.yaml`, `tools/validate.ts`, etc.)]

### Relevant Memory Bank Tags:
[#protocol], [#agent], [#ritual], [#cli], [#docs], [#test], etc.

---

## ✅ Expected Output

[Be precise — e.g., “Compare message bus vs. direct agent wiring”, “List schema fields for mode files”, “Draft a CLI interface contract with options + flags”]

---

## ⚠️ Constraints or Considerations

- [ ] Must maintain protocol validation (`ajv` or equivalent)
- [ ] Must be extensible to new agent types or schema evolutions
- [ ] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [ ] Recovery and error logging required (define how)
- [ ] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [ ] Synchronous + async operation supported

[Add any additional requirements or references here]

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Agent Interface Layer Draft" \
  --tags task-interface,component-agent,template-llm-prompt \
  --notes "Used message bus approach for abstract agent messaging"
````

* * *

🛠️ Next-Step Handoff (IDE/Assistant)
-------------------------------------

If this task is complete or ready for implementation:

*   **Prompt for Augment:** _"Implement `AgentInterface.ts` using message bus abstraction. Include validators for each message type."_
    
*   **Prompt for Cline:** _"Plan CLI usage patterns for `agent-run` command, including dry-run mode and validation toggles."_
    

* * *

📌 Reference
------------

*   **Kickoff Summary:** \[Kickoff Prompt Mirrorwright\]kickoff-prompt-mirrorwr…
    
*   **Strategic Guidelines:** \[Mirrorwright Reference Guide\]mirrorwright-reference
    
*   **Project Prompt Template:** \[chatGPT-strategicAI-prompt\_template.md\]chatGPT-strategicAI-pro…
    
*   **Quick Tags & CLI Commands:** \[`.cursorrules-quickref.md`\].cursorrules-quickref
    

* * *

```

---

### ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.

Would you like this templated as a standalone `.md` file you can drop into `prompts/` or `templates/`?
```

## Prompt:
Y

## Response:
✅ The reusable prompt template has been regenerated as a standalone file:

**Download mirrorwright-task-template.md**

You can now drop this directly into your `prompts/`, `docs/`, or `templates/` folder within the Mirrorwright Orchestrator project and reuse it at any stage of the workflow. Ready for Cursor IDE, ChatGPT, or model ensemble sessions.

Would you like a `.prompt.json` version for automated ingestion as well?

## Prompt:
regenerate in single snippet for user

## Response:
Here’s the **fully regenerated universal strategic prompt template** for the Mirrorwright Orchestrator, ready to drop into any `prompts/` or `templates/` folder as a `.md` file:

* * *

````markdown
# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

[Fill in the current objective — e.g., “Refining Agent Interface Layer architecture”, “Implementing CLI for ritual execution”, “Writing docs for mode schema”]

---

## 🧩 Current Phase  
(Select one from the dropdowns below)

- [ ] Architecture Planning  
- [ ] Protocol Definition  
- [ ] Implementation & Prototyping  
- [ ] Validation & Testing  
- [ ] Documentation & Examples  
- [ ] Debugging / Triage  

---

## 🤖 Working Model  
(Use model matching per `.cursorrules-quickref.md` and memory bank guidance)

- [ ] GPT-4o – systems/architecture/visual reasoning  
- [ ] GPT-4.5 – specs/documentation/creative depth  
- [ ] GPT-4o-mini – speed/iteration/CLI+tests  
- [ ] Multi-Model – ensemble/reconciliation  

---

## 📦 Task Input

### Input Files / Schemas / Specs:
[Reference any filenames (e.g., `protocols/agent-sync.yaml`, `tools/validate.ts`, etc.)]

### Relevant Memory Bank Tags:
[#protocol], [#agent], [#ritual], [#cli], [#docs], [#test], etc.

---

## ✅ Expected Output

[Be precise — e.g., “Compare message bus vs. direct agent wiring”, “List schema fields for mode files”, “Draft a CLI interface contract with options + flags”]

---

## ⚠️ Constraints or Considerations

- [ ] Must maintain protocol validation (`ajv` or equivalent)
- [ ] Must be extensible to new agent types or schema evolutions
- [ ] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [ ] Recovery and error logging required (define how)
- [ ] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [ ] Synchronous + async operation supported

[Add any additional requirements or references here]

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Agent Interface Layer Draft" \\
  --tags task-interface,component-agent,template-llm-prompt \\
  --notes "Used message bus approach for abstract agent messaging"
````

* * *

🛠️ Next-Step Handoff (IDE/Assistant)
-------------------------------------

If this task is complete or ready for implementation:

*   **Prompt for Augment:** _"Implement `AgentInterface.ts` using message bus abstraction. Include validators for each message type."_
    
*   **Prompt for Cline:** _"Plan CLI usage patterns for `agent-run` command, including dry-run mode and validation toggles."_
    

* * *

📌 Reference
------------

*   **Kickoff Summary:** \[Kickoff Prompt Mirrorwright\]
    
*   **Strategic Guidelines:** \[Mirrorwright Reference Guide\]
    
*   **Project Prompt Template:** \[chatGPT-strategicAI-prompt\_template.md\]
    
*   **Quick Tags & CLI Commands:** \[`.cursorrules-quickref.md`\]
    

```

---

Let me know if you’d like a pre-filled example for a specific component like `ValidatorEngine` or `Agent Sync`.
```

## Prompt:
are these universal as well like the template generated here?
***
🛠️ Next-Step Handoff (IDE/Assistant)
If this task is complete or ready for implementation:

Prompt for Augment: "Implement AgentInterface.ts using message bus abstraction. Include validators for each message type."

Prompt for Cline: "Plan CLI usage patterns for agent-run command, including dry-run mode and validation toggles."

📌 Reference
Kickoff Summary: [Kickoff Prompt Mirrorwright]

Strategic Guidelines: [Mirrorwright Reference Guide]

Project Prompt Template: [chatGPT-strategicAI-prompt_template.md]

Quick Tags & CLI Commands: [.cursorrules-quickref.md]

yaml
Copy
Edit

---

---

Let me know if you’d like a pre-filled example for a specific component like ValidatorEngine or Agent Sync.
***

## Response:
Excellent question — and yes, **those bottom sections are designed to be universally reusable** across any task prompt in the Mirrorwright Orchestrator system, with minor edits per context.

### 🔁 Reusability Breakdown

#### ✅ **🛠️ Next-Step Handoff (IDE/Assistant)**

This is a modular **handoff scaffold**:

*   Can be included in **every task prompt** to pass execution smoothly to Cursor agents.
    
*   Always include **at least one `Prompt for Augment` and/or `Prompt for Cline`** based on the phase.
    
*   Easily templated as:
    

```markdown
## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:
- **Prompt for Augment:** _"[describe what Augment should scaffold/optimize]"_  
- **Prompt for Cline:** _"[describe what Cline should plan/specify]"_
```

#### ✅ **📌 Reference**

This block anchors the task to core knowledge and aids multi-agent continuity:

*   Always keep these **4 references**:
    
    *   **Kickoff Summary**
        
    *   **Strategic Guidelines**
        
    *   **Prompt Template**
        
    *   **Quick Tags & CLI Commands**
        
*   Can be universally copied into every `.prompt.md`, `.mode.yaml`, `.ritual.md`, or Scratchpad entry.
    

Example:

```markdown
## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]
```

* * *

### 🧠 Summary

Yes — both `🛠️ Next-Step Handoff` and `📌 Reference` are **designed as reusable prompt scaffolds** across any task, schema, mode, or doc in the system.

Would you like me to package these as a reusable `template-blocks.md` reference file for pasting or programmatic use in `.prompt.md` generation?



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)