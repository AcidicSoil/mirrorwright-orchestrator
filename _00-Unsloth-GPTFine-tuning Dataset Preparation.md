**Created:** 5/3/2025 20:15  
**Updated:** 5/3/2025 20:16  
**Exported:** 5/3/2025 20:42  

## Prompt:
Uns­loth Fine‑Tuning Instruction Prompts
1. Data‑Preparation Prompt (GPT‑4.5)

Extract and structure all relevant code, schema definitions, documentation comments, and test fixtures from our mirrorwright-orchestrator repo into a JSONL dataset suitable for fine‑tuning. Follow the Uns­loth “get‑started fine‑tuning” guide: each record should have "prompt" (developer question or directive) and "completion" (the code snippet, schema, or explanation). Group by file type (e.g., *.ts, *.yaml, *.md). Ensure no records exceed 1,000 tokens.
You are an LLM prompt engineer preparing training data.  
Take the JSONL from “Data‑Preparation Prompt” and transform each entry into:

{"prompt":"<|developer|> <question_or_directive>\n<|assistant|>","completion":"<code_or_explanation> <|endoftext|>"}

Ensure:
- <|developer|> and <|assistant|> tokens are present  
- Each completion ends with <|endoftext|>  
- No additional whitespace or metadata  

Output a new JSONL file ready for fine‑tuning.

## Response:
Here's your enhanced, structured fine-tuning preparation workflow using Uns­loth instructions, tailored specifically for the **Mirrorwright Orchestrator** project. The structured JSONL output will be immediately ready for fine-tuning your AI model based on your GitHub repository.

* * *

Unsloth Fine-Tuning Instruction Prompts
=======================================

Step 1: Data-Preparation Prompt (GPT-4.5)
-----------------------------------------

Extract, structure, and organize relevant data from the `mirrorwright-orchestrator` repository into a JSONL format following Uns­loth’s fine-tuning guidelines:

### Dataset Structure (each entry):

```json
{
  "prompt": "<developer question or directive>",
  "completion": "<code snippet, schema, or explanation>"
}
```

### Guidelines for Data Extraction:

*   **Code**: Include critical function implementations, type definitions, and key utility code snippets (`*.ts`).
    
*   **Schema Definitions**: JSON or YAML definitions of protocols, modes, rituals (`*.yaml`, `*.json`).
    
*   **Documentation Comments**: Extract well-written inline comments and Markdown documentation (`*.md`, code comments).
    
*   **Test Fixtures**: Representative test cases and fixtures (`tests/**/*.json`, etc.).
    

### Constraints:

*   **Token limit**: Each JSONL record ≤ 1,000 tokens.
    
*   **Organization**: Group by file type clearly (e.g., `*.ts`, `*.yaml`, `*.md`, `*.json`).
    

### Example JSONL Record:

```json
{"prompt": "How do I define a Mirrorwright protocol in YAML?","completion": "protocol:\n  name: 'meta-thinking'\n  version: '1.0.0'\n  modes:\n    - name: 'reflection'\n      steps:\n        - type: 'prompt'\n          content: 'Analyze current assumptions...'\n<|endoftext|>"}
```

* * *

Step 2: Fine-Tuning JSONL Formatting (GPT-4.5)
----------------------------------------------

Transform the extracted dataset into a finalized Uns­loth-compatible JSONL format:

*   Each entry clearly delineated by `<|developer|>` and `<|assistant|>` tokens.
    
*   Completion ends explicitly with `<|endoftext|>`.
    

### Target Format:

```json
{"prompt":"<|developer|> How do I define a Mirrorwright protocol in YAML?\n<|assistant|>","completion":"protocol:\n  name: 'meta-thinking'\n  version: '1.0.0'\n  modes:\n    - name: 'reflection'\n      steps:\n        - type: 'prompt'\n          content: 'Analyze current assumptions...'\n<|endoftext|>"}
```

*   **No extra whitespace or metadata**.
    
*   **Uniform structure** for efficient parsing.
    

* * *

Recommended Workflow:
---------------------

*   **Phase 1: Extraction & Structuring (GPT-4.5)**  
    Focus on completeness and relevance. Include explanatory comments and key test fixtures for clarity.
    
*   **Phase 2: Formatting for Fine-Tuning (GPT-4.5)**  
    Ensure strict adherence to Uns­loth formatting guidelines, clearly marking roles with explicit tokens (`<|developer|>` and `<|assistant|>`), and maintaining token constraints.
    
*   **Phase 3: Final Validation & Model Fine-Tuning**  
    Run quick validation checks on your JSONL data:
    
    ```bash
    python tools/validate_finetune_jsonl.py --input data_finetune.jsonl
    ```
    
    Proceed to fine-tuning using your Uns­loth setup.
    

* * *

Strategic Considerations:
-------------------------

*   Utilize your multi-agent Cursor IDE (`Cline`, `Augment`) with `.cursorrules` framework to automate and validate parts of this workflow efficiently.
    
*   Leverage `GPT-4o-mini` for rapid iterative checks and preliminary structuring, followed by validation with `GPT-4.5` for high-quality documentation and fine-tuning readiness.
    

* * *

This structured process aligns closely with Mirrorwright's core philosophy and strategic goals, ensuring your fine-tuned model precisely reflects your intended workflows and project-specific nuances.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)