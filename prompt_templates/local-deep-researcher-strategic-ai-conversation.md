---
agent: strategicai
purpose: template
id: local-deep-researcher-strategic-ai-conversation
version: 1.0.0
---

# 🧠 Mirrorwright Orchestrator — Strategic AI Prompt Template

## 🤖 Initial Context Setup

Working with multi-agent Cursor system (Cline, Augment) and governed by `.cursorrules`.

This prompt is part of the **Mirrorwright Orchestrator** project — a clean-slate, protocol-first orchestration system for intelligent agents.

---

## 🎯 Task Context

Setting up a local deep researcher model to replace GPT-4.5 functionality for specs/documentation/creative depth work

---

## 🧩 Current Phase

- [ ] Architecture Planning
- [x] Implementation & Prototyping
- [ ] Validation & Testing
- [ ] Documentation & Examples
- [ ] Debugging / Triage

---

## 🤖 Working Model

- [ ] GPT-4o – systems/architecture/visual reasoning
- [ ] GPT-4.5 – specs/documentation/creative depth
- [x] Local Deep Researcher – specs/documentation/creative depth (GPT-4.5 replacement)
- [ ] GPT-4o-mini – speed/iteration/CLI+tests
- [ ] Multi-Model – ensemble/reconciliation

---

## 📦 Task Input

### Input Files / Schemas / Specs:
- Configuration files for LM Studio or equivalent local inference engine
- Model configuration requirements
- Integration points with Mirrorwright Orchestrator

### Relevant Memory Bank Tags:
[#local-inference], [#model-configuration], [#deep-researcher], [#tool-calling], [#json-schema]

---

## ✅ Expected Output

Configure a local deep researcher model that can fully replace GPT-4.5 capabilities for specs/documentation/creative depth work, with equivalent tool calling, structured outputs, and JSON schema validation capabilities.

---

## ⚠️ Constraints or Considerations

- [x] Must support MCP-style tool calling equivalent to GPT-4.5
- [x] Must handle structured outputs with the same fidelity as GPT-4.5
- [x] Must support JSON schema validation
- [x] Must enable custom function calling capabilities
- [x] Must operate completely offline/locally
- [x] Performance should be comparable to online GPT-class models
- [ ] Resource requirements must be documented (RAM, GPU, etc.)
- [ ] Integration with existing Mirrorwright protocols must be seamless

---

## 🧠 Memory Hooks (optional)

```bash
python tools/memory.py save --title "Local Deep Researcher Configuration" \
  --tags local-inference,model-configuration,deep-researcher \
  --notes "Configuration details for setting up local deep researcher as GPT-4.5 replacement"
```

---

## 🛠️ Next-Step Handoff (IDE/Assistant)

If this task is complete or ready for implementation:

- **Prompt for Augment:** _"Implement integration layer between Mirrorwright Orchestrator and local deep researcher model, ensuring all tool calling capabilities are preserved."_
- **Prompt for Cline:** _"Plan testing methodology to verify local deep researcher model matches GPT-4.5 capabilities for specs/documentation/creative tasks."_

---

## 📌 Reference

- **Kickoff Summary:** [Kickoff Prompt Mirrorwright]
- **Strategic Guidelines:** [Mirrorwright Reference Guide]
- **Project Prompt Template:** [chatGPT-strategicAI-prompt_template.md]
- **Quick Tags & CLI Commands:** [`.cursorrules-quickref.md`]

---

## 💬 Conversation

### User:
I need to set up a local deep researcher model that can replace GPT-4.5 for specs/documentation/creative depth work. It should do everything GPT-4.5 does but run locally.

### Assistant:
I understand you want to implement a local alternative to GPT-4.5 specifically for deep research tasks like creating specifications, documentation, and creative work. Let me outline what this would entail:

First, we need to identify the key capabilities of GPT-4.5 that are essential for your workflow:
1. Advanced reasoning for complex specifications
2. Structured documentation generation
3. Creative depth for ideation and problem-solving
4. Tool calling capabilities
5. JSON schema validation
6. Structured output formatting

For a local implementation, I recommend:

**Model Selection:**
- Consider Claude 3 Opus or Mixtral 8x22B models via LM Studio
- These models have demonstrated comparable capabilities to GPT-4.5 for deep thinking tasks

**Infrastructure Requirements:**
- GPU with 24GB+ VRAM (ideally 48GB for optimal performance)
- Quantization options (GPTQ, AWQ) to reduce VRAM requirements if needed
- SSD storage for model weights and context database

**Integration Architecture:**
1. Set up LM Studio with your selected model
2. Configure the API endpoint to match OpenAI's format for seamless integration
3. Implement a compatibility layer in Mirrorwright that handles:
   - Tool definition passing
   - Function calling standardization
   - Output validation against schemas

**Performance Considerations:**
- Local inference will be slower than OpenAI's API
- Consider implementing a caching layer for common queries
- Use batched processing for documentation generation tasks

Would you like me to focus on any particular aspect of this implementation first?

### User:
Can you provide specific LM Studio configuration settings that would enable the tool calling and structured output capabilities? That's the part I'm most concerned about matching.

### Assistant:
Absolutely. Here are the specific LM Studio configuration settings to enable tool calling and structured output capabilities comparable to GPT-4.5:

**LM Studio Configuration for Tool Calling & Structured Outputs:**

1. **Model Selection:**
   - Choose models with strong tool-use capabilities: Claude 3 Opus, Mixtral 8x22B, or Llama 3 70B
   - Download the model in GGUF format with appropriate quantization (Q4_K_M offers good balance)

2. **API Server Settings:**
   - Enable "OpenAI Compatible Server" in LM Studio settings
   - Set port to 1234 (or your preferred port)
   - Enable "Function Calling" option explicitly
   - Set context length to maximum supported by your model (8K-32K)

3. **Inference Parameters:**
   - Temperature: 0.1-0.3 (lower for more deterministic outputs)
   - Top P: 0.95
   - Frequency Penalty: 0.0
   - Presence Penalty: 0.0
   - Enable "Grammar-based Sampling" for structured outputs

4. **Function Calling Configuration:**
   ```json
   {
     "tools": [
       {
         "type": "function",
         "function": {
           "name": "example_function",
           "description": "Example function description",
           "parameters": {
             "type": "object",
             "properties": {
               "param1": {
                 "type": "string",
                 "description": "Parameter description"
               }
             },
             "required": ["param1"]
           }
         }
       }
     ],
     "tool_choice": "auto"
   }
   ```

5. **Response Format Configuration:**
   ```json
   {
     "response_format": {
       "type": "json_object"
     }
   }
   ```

6. **Integration Code:**
   ```typescript
   // Example integration with Mirrorwright
   const response = await fetch('http://localhost:1234/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: "local-model",
       messages: messages,
       tools: tools, // Your function definitions
       tool_choice: "auto",
       temperature: 0.2,
       response_format: { type: "json_object" }
     })
   });
   ```

7. **System Prompt Enhancement:**
   Add this to your system prompts to improve structured output compliance:
   ```
   You must use the provided functions when appropriate. Respond with structured data exactly matching the requested schema. Always validate your output against the schema before responding.
   ```

8. **Advanced Settings:**
   - In LM Studio's advanced settings, enable "Enforce JSON Output" option
   - Set "Grammar File" to JSON if available in your LM Studio version
   - Enable "Continuous Batching" for performance

These configurations will closely match GPT-4.5's capabilities for tool calling and structured outputs. The key is properly formatting the function definitions and using the appropriate system prompts to guide the model's behavior.

Would you like me to elaborate on any specific aspect of this configuration?

---

## ✅ Usage Guide:

- **Use this template at *any point in the workflow.*** Cursor agents (Augment, Cline) or ChatGPT can pick up from any filled section.
- **Supports continuity across models**: fill in `Working Model` and `Phase` to guide model response style and depth.
- **Portable to CLI or `.prompt.md` files**: this markdown block can be saved as `task-[name].md` in `prompts/` or `docs/`.
- **Conversation section**: Use this to record the actual conversation with the AI assistant, which can be extracted later using the prompt extraction tool.
