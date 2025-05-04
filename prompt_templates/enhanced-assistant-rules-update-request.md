---
agent: strategicai
purpose: implementation
id: enhanced-assistant-rules-update-request
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`, alongside ChatGPT as a strategic thinking partner. This integrated approach ensures comprehensive orchestration across all intelligent agents.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents with clearly defined role boundaries and communication patterns.

---

## 🎯 Task Context

Creating updated system instruction rule files for all assistants to govern response outputs and ensure consistent, high-quality interactions across the Mirrorwright Orchestrator system. These rules must align with the existing ChatGPT strategic thinking partner role while establishing complementary capabilities for each assistant in the multi-agent ecosystem.

---

## 🧩 Current Phase

- [x] Architecture Planning
- [x] Protocol Definition
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
- `.cursorrules` - Current cursor rules file
- `.cursorrules-quickref.md` - Quick reference for cursor rules
- `prompt_templates/mirrorwright-strategic-ai-conversation-template.md` - Strategic AI conversation template
- `assistant-prompts/all-assistant-prompts.md` - Current assistant prompts
- ChatGPT system instructions (provided in the request)

### Relevant Memory Bank Tags:
[#agent], [#rules], [#prompt], [#system-instructions], [#orchestration], [#multi-agent], [#role-boundaries]

---

## ✅ Expected Output

1. Updated system instruction rule files for each assistant (Cline, Augment, Roo, VibeCheck, StrategicAI, PromptRouter) that align with ChatGPT's strategic thinking partner role
2. Each rule file should include:
   - Clear role definition and responsibilities with explicit boundaries
   - Response format guidelines and communication excellence standards
   - Interaction patterns with other assistants (including ChatGPT)
   - Output validation criteria and quality metrics
   - Error handling procedures and recovery mechanisms
   - Context preservation and management techniques
   - Multi-model strategy recommendations where applicable
   - Documentation enhancement responsibilities
3. A unified approach to system instructions that maintains each assistant's unique capabilities while ensuring protocol compliance and cross-agent collaboration
4. Specific guidance on context management, architecture guidance, and agentic collaboration that complements ChatGPT's strategic thinking partner role

---

## ⚠️ Constraints or Considerations

- [x] Must maintain protocol validation (`ajv` or equivalent)
- [x] Must be extensible to new agent types or schema evolutions
- [x] Should follow project structure (e.g., `engine/`, `rituals/`, `modes/`)
- [x] Recovery and error logging required (define how)
- [x] Cross-agent compatibility (human, LLM, rule-based) must be preserved
- [x] Synchronous + async operation supported
- [x] Must align with existing `.cursorrules` structure
- [x] Should incorporate YAML frontmatter for validation
- [x] Must support the extraction process via `extractAssistantPrompts.ts`
- [x] Must establish clear role boundaries between assistants
- [x] Should include context management strategies similar to ChatGPT's approach
- [x] Must incorporate multi-model strategy and agent selection guidance
- [x] Should emphasize strategic thinking and second brain mentality where appropriate

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Enhanced Assistant Rules Update" \
  --tags system-instructions,agent-rules,protocol-compliance,multi-agent-collaboration,role-boundaries \
  --notes "Created updated system instruction rule files for all assistants to govern response outputs with clear role boundaries and collaboration patterns"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement the updated assistant rule files following the specified structure. Ensure each file includes proper frontmatter, clear role boundaries, and collaboration patterns that complement ChatGPT's strategic thinking partner role."_
- **Prompt for Cline:** _"Plan the integration of the updated assistant rules with the existing orchestration system, including validation and testing strategies. Focus on how these rules establish a cohesive multi-agent ecosystem with ChatGPT as the strategic thinking partner."_
- **Prompt for ChatGPT:** _"Review the updated assistant rule files to ensure they complement your strategic thinking partner role. Provide feedback on how to enhance cross-agent collaboration and maintain clear role boundaries."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]
- **ChatGPT System Instructions:** [Current strategic thinking partner instructions]

---

## 💬 Conversation

### User:
I need updated system instruction rule files for all our assistants (Cline, Augment, Roo, VibeCheck, StrategicAI, PromptRouter) to govern their response outputs, with special attention to how they complement ChatGPT's role as a strategic thinking partner. 

Each assistant should have clear guidelines on their role, response format, interaction patterns with other assistants (including ChatGPT), and error handling procedures. The rules should maintain each assistant's unique capabilities while ensuring protocol compliance and cross-agent collaboration across the Mirrorwright Orchestrator system.

The updated rules should incorporate elements from ChatGPT's current system instructions, particularly:
1. Clear role boundaries between assistants
2. Context management strategies
3. Multi-model strategy and agent selection guidance
4. Strategic thinking and second brain mentality
5. Communication excellence standards
6. Architecture guidance approaches
7. Documentation enhancement responsibilities
8. Agentic collaboration patterns

Please provide a comprehensive plan for creating these updated rule files, including the structure, key components, and implementation approach. The files should be compatible with our existing `.cursorrules` structure and support the extraction process via `extractAssistantPrompts.ts`.

### Assistant:
[Assistant's response here]

### User:
[Your follow-up question or feedback]

### Assistant:
[Assistant's follow-up response]

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
