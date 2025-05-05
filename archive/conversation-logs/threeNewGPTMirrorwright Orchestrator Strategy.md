**Created:** 5/3/2025 20:13  
**Updated:** 5/3/2025 20:26  
**Exported:** 5/3/2025 20:28  

## Prompt:
create a prompt for user based on this template and project codebase
 'https://github.com/AcidicSoil/mirrorwright-orchestrator'

enhance users request to fit their needs with a proposal to send as main prompt to strategic ai for main core work on codebase
***
based on unsloth query, create necessary prompts to setup fine-tuning instructions for assistants to execute and setup finetuning on users codebase as main context.
***
user query = 'https://docs.unsloth.ai/get-started/fine-tuning-guide'


template below here
# Mirrorwright Orchestrator - Strategic AI Prompt

## Initial Context Setup

🤖 Working alongside multi-agent Cursor system (Cline, Augment) and .cursorrules framework.

## Project Context

[Provide brief context about the current state of the Mirrorwright Orchestrator project, including any recent developments or challenges]

## Question/Task

[Clearly state what you need guidance on, being as specific as possible]

## Current Approach

[Describe your current thinking or approach to the problem, if applicable]

## Constraints

[List any technical, architectural, or process constraints that must be respected]

## Working Model

- [ ] GPT-4o (for architecture, complex design, visual reasoning)
- [ ] GPT-4.5 (for specifications, documentation, creative exploration)
- [ ] GPT-4o-mini (for rapid implementation, iterative refinements)

## Implementation Phase

- [ ] Architecture Planning
- [ ] Protocol Definition
- [ ] Implementation & Prototyping
- [ ] Validation & Testing

## Expected Output

[Specify what kind of output you're looking for: architecture proposal, evaluation of options, workflow recommendation, etc.]

---

## Example

### Project Context

We're implementing the protocol validation engine for Mirrorwright Orchestrator. We have defined the TypeScript interfaces and basic JSON Schema structure, but we're unsure about the most efficient way to handle conditional validation based on protocol modes.

### Question/Task

What's the most efficient architecture for implementing conditional validation rules that can vary based on the active mode in a protocol?

### Current Approach

We're considering two options:

1. A single validator with conditional logic
2. Multiple specialized validators that get selected based on mode

### Constraints

- Must work with Ajv validation library
- Must provide clear, specific error messages
- Must be extensible for future mode types

### Working Model

- [x] GPT-4o (for architecture, complex design, visual reasoning)
- [ ] GPT-4.5 (for specifications, documentation, creative exploration)
- [ ] GPT-4o-mini (for rapid implementation, iterative refinements)

### Implementation Phase

- [ ] Architecture Planning
- [x] Protocol Definition
- [ ] Implementation & Prototyping
- [ ] Validation & Testing

### Expected Output

A recommendation on which approach to take, with justification and a high-level design for the validation architecture.

## Response:
Thought for 6 seconds

Here’s a ready‑to‑use suite of prompts—starting with your core Strategic AI prompt (filled out for Mirrorwright Orchestrator) and then a set of fine‑tuning instruction prompts based on the Uns­loth guide. You can send the first one as your “main” prompt to kick off high‑level strategic work, and then invoke the subsequent prompts to prepare and run the fine‑tuning process.

* * *

```markdown
# Mirrorwright Orchestrator - Strategic AI Prompt

## Initial Context Setup

🤖 Listening…  
Understood: Working alongside my multi‑agent Cursor system (Cline, Augment) and `.cursorrules` framework.

## Project Context

We have the Mirrorwright Orchestrator codebase in GitHub:  
`https://github.com/AcidicSoil/mirrorwright-orchestrator`  
This is a brand‑new, from‑scratch TypeScript/Node.js project to implement the Mirrorwright Protocol for multi‑agent orchestration. It already contains:

- JSON schemas and TS interfaces for Protocol, Mode, Ritual  
- A CLI scaffolding (`src/cli/index.ts`)  
- A test suite with Vitest  
- Placeholder directories for `protocols/`, `modes/`, `rituals/`, `engine/`, `utils/`

Recent challenges:

- Unifying the AJV‑based validation between CLI and programmatic APIs  
- Defining a clear plugin model for ritual execution  
- Establishing the optimal directory and module boundaries for extensibility

## Question/Task

What is the **most strategic**, **scalable** plan to:

1. **Evolve** our existing validation and execution engine into a cohesive, multi‑agent orchestration core?  
2. **Integrate** a fine‑tuned assistant—trained directly on our codebase and docs—to accelerate daily dev tasks (schema updates, fixture generation, code reviews)?

## Current Approach

- We’ve split validation into two modules (CLI vs. internal) but face “no schema with key or ref” errors.  
- We’re exploring an AJV “multi‑schema loader” pattern vs. compile‑time schema bundling.  
- We’ve begun drafting a JSONL export of code/docs for fine‑tuning, following the Uns­loth guide.

## Constraints

- Must maintain `.cursorrules` role boundaries (Cline for scaffolding, Augment for refactoring).  
- Backend must remain TypeScript/Node.js with pnpm, Vitest.  
- Fine‑tuned model should integrate via a simple HTTP wrapper into our `engine/agent-interface` layer.  
- Training data must come exclusively from `src/` and `docs/`, with no external noise.

## Working Model

- [ ] GPT-4o (for architecture, complex design, visual reasoning)  
- [ ] GPT-4.5 (for fine‑tuning plan, prompt crafting, deep documentation)  
- [ ] GPT-4o-mini (for rapid prototyping of JSONL examples, test fixtures)

## Implementation Phase

- [ ] Architecture Planning  
- [ ] Protocol Definition  
- [ ] Implementation & Prototyping  
- [ ] Validation & Testing  

## Expected Output

1. A **high‑level architecture proposal** showing how to unify validation, execution, and agent orchestration.  
2. A **roadmap** for extracting, formatting, and fine‑tuning an LLM on our codebase (with specific prompt templates).  
3. **Concrete prompt templates** to feed into Uns­loth’s fine‑tuning pipeline.

```

* * *

Uns­loth Fine‑Tuning Instruction Prompts
----------------------------------------

**1\. Data‑Preparation Prompt (GPT‑4.5)**

> _Extract and structure all relevant code, schema definitions, documentation comments, and test fixtures from our `mirrorwright-orchestrator` repo into a JSONL dataset suitable for fine‑tuning. Follow the Uns­loth “get‑started fine‑tuning” guide: each record should have `"prompt"` (developer question or directive) and `"completion"` (the code snippet, schema, or explanation). Group by file type (e.g., `*.ts`, `*.yaml`, `*.md`). Ensure no records exceed 1,000 tokens._

```text
You are a data‑prep assistant.  
Given the Mirrorwright Orchestrator repo at https://github.com/AcidicSoil/mirrorwright-orchestrator, recursively scan these folders:  
- src/ (TypeScript code)  
- protocols/ (YAML schemas)  
- docs/ (Markdown)  
- tests/ (Vitest fixtures)  

For each logical unit (function, class, schema, doc section, test case), produce a JSONL line:

{"prompt": "<contextual developer question>", "completion": "<the code or text>"}

Example:
{"prompt":"How do I validate a protocol schema in ProtocolValidator.ts?","completion":"export function validateProtocol(...) { /*…*/ }"}

Follow Uns­loth’s formatting rules exactly: JSONL, UTF‑8, no trailing commas.  
```

* * *

**2\. Prompt‑Engineering for Fine‑Tuning (GPT‑4.5)**

> _Convert the raw JSONL dataset into training‑ready prompts by adding instruction prefixes and stop‑sequences compatible with Uns­loth’s pipeline. Tag each record by role (`developer→assistant`) and insert special tokens as needed._

```text
You are an LLM prompt engineer preparing training data.  
Take the JSONL from “Data‑Preparation Prompt” and transform each entry into:

{"prompt":"<|developer|> <question_or_directive>\n<|assistant|>","completion":"<code_or_explanation> <|endoftext|>"}

Ensure:
- `<|developer|>` and `<|assistant|>` tokens are present  
- Each completion ends with `<|endoftext|>`  
- No additional whitespace or metadata  

Output a new JSONL file ready for fine‑tuning.
```

* * *

**3\. Fine‑Tuning Execution Prompt (GPT‑4.5)**

> _Using the Uns­loth CLI/API, generate the fine‑tuning command or API call. Specify hyperparameters tuned for code/documentation tasks (e.g., low learning rate, few epochs). Include validation split and model selection._

```text
You are an automated trainer.  
Given the training JSONL and the Uns­loth fine‑tuning guide (https://docs.unsloth.ai/get-started/fine-tuning-guide), produce:

1. The exact CLI command or HTTP API call to start fine‑tuning, e.g.:

   unsloth fine_tunes.create \
     --model gpt-4o-mini \
     --train_file path/to/train.jsonl \
     --validation_file path/to/valid.jsonl \
     --n_epochs 3 \
     --learning_rate 1e-5 \
     --batch_size 8

2. A brief rationale for hyperparameter choices suited to a TypeScript codebase.  
3. Post‑training steps: how to retrieve the new model ID, evaluate on held‑out samples, and integrate into `engine/agent-interface.ts`.
```

* * *

Paste the **Strategic AI prompt** into your main ChatGPT session to drive architecture‑level guidance, then use the **Fine‑Tuning Instruction Prompts** in separate calls (or chain them) to produce your JSONL, craft prompts, and launch the Uns­loth fine‑tuning pipeline—all tailored to Mirrorwright Orchestrator.

## Prompt:
then provide next steps extensive guide to full domain expansion?

## Response:
Below is a structured, multi‑phase roadmap for “full domain expansion” of the Mirrorwright Orchestrator project—taking you from core engine to a broad, production‑ready orchestration platform, complete with AI‑assistant integration, extensible plugins, documentation, tests, and deployment pipelines.

* * *

Phase 0: Domain Discovery & Knowledge Modeling
----------------------------------------------

1.  **Inventory Core Concepts**
    
    *   Catalog existing “protocol”, “mode”, “ritual” schemas and their relationships
        
    *   Map out all entry points (CLI, programmatic API, `<engine>/agent-interface`)
        
    *   Identify gaps: missing use‑cases, undocumented corner‑cases
        
2.  **Define Domain Ontology**
    
    *   Create a canonical glossary (Protocol, Mode, Ritual, Behavior Tree, Plugin)
        
    *   Model relationships (e.g., Protocol ▶️ Mode ▶️ Ritual ▶️ Action)
        
    *   Represent as a lightweight UML or graph schema
        
3.  **Agent Roles & Capabilities Matrix**
    
    *   Align Cursor Cline, Augment, and strategic‑AI roles to domain areas
        
    *   Assign which agent handles schema design, which handles execution logic, which handles testing
        

> **Deliverables:** Domain glossary doc, UML diagram, Agent/Capability matrix

* * *

Phase 1: Schema & Interface Expansion
-------------------------------------

1.  **Extend JSON Schema Definitions**
    
    *   Add “metadata” block to every schema (version, author, createdAt)
        
    *   Introduce reusable schema fragments (e.g., common `identifier`, `conditions`, `transitions`)
        
2.  **TypeScript Interface Generation**
    
    *   Automate via codegen (e.g., `quicktype`, `typescript-json-schema`)
        
    *   Include JSDoc comments pulled from your markdown docs
        
3.  **Plugin Interface Spec**
    
    *   Define an abstract `RitualPlugin` interface in `src/plugins/`
        
    *   Methods: `initialize(context)`, `execute(args)`, `cleanup()`
        
    *   Enforce via TS and a runtime plugin loader
        

> **Agent:** Prompt Augment to scaffold schema fragments and plugin interfaces.  
> **Model:** GPT‑4o‑mini for rapid generation of JSON schema snippets.

* * *

Phase 2: Engine & Execution Core
--------------------------------

1.  **Unified Validation Loader**
    
    *   Build a single AJV instance that loads all schemas at startup
        
    *   Leverage `$id` and `addSchema` patterns to avoid “no schema ref” errors
        
2.  **Execution Pipeline**
    
    *   Design a pipeline:
        
        1.  **Load** protocol definition
            
        2.  **Validate** against AJV
            
        3.  **Instantiate** mode context
            
        4.  **Sequence** ritual executions via Behavior‑Tree pattern
            
        5.  **Emit** events/logs
            
3.  **Asynchronous & Error‑Resilient Design**
    
    *   Wrap each ritual in a try/catch with retry/backoff policies
        
    *   Define failure modes in schema (e.g., `onError: halt | continue | compensate`)
        

> **Agent:** Use Cline for the high‑level pipeline spec, then Augment to implement step‑by‑step.  
> **Model:** GPT‑4o for complex design and visual reasoning of the pipeline.

* * *

Phase 3: AI‑Assistant Integration & Fine‑Tuning
-----------------------------------------------

1.  **Contextual Prompting Wrapper**
    
    *   In `engine/agent-interface.ts`, embed context: current protocol, active mode, last event
        
    *   Standardize prompt templates for “schema update”, “fixture gen”, “code review”
        
2.  **Fine‑Tuned Model Deployment**
    
    *   Follow the Uns­loth CLI steps to train on your repo JSONL
        
    *   Host as a local microservice (e.g., `fastify` or `express` endpoint)
        
3.  **Interactive CLI Extensions**
    
    *   Add commands like `mwo assist validate <path>` or `mwo assist fixture <schema>`
        
    *   These invoke your fine‑tuned model to generate suggestions
        

> **Agent:** After training, use strategic‑AI (GPT‑4.5) to craft and optimize prompt templates.  
> **Model:** GPT‑4o‑mini for on‑the‑fly suggestions in CLI.

* * *

Phase 4: Testing, Validation & QA
---------------------------------

1.  **Comprehensive Test Matrix**
    
    *   **Unit tests** for each plugin, validator, and utility
        
    *   **Integration tests**: full run of a sample protocol through modes and rituals
        
    *   **Contract tests**: verify that plugin implementations honor the Plugin interface
        
2.  **Golden Fixtures & Snapshotting**
    
    *   Store canonical JSON fixtures for each protocol/mode/ritual combination
        
    *   Automate snapshot comparisons on CI (Vitest snapshot feature)
        
3.  **Performance Benchmarks**
    
    *   Measure schema loading, validation latency, execution throughput
        
    *   Define SLAs (e.g., “100 validations/sec at 1,000 concurrent workflows”)
        

> **Agent:** Augment to build test harnesses; Cline to define test scenarios.  
> **Model:** GPT‑4.5 to review coverage and suggest edge cases.

* * *

Phase 5: Documentation & Developer Experience
---------------------------------------------

1.  **Living Documentation Site**
    
    *   Use a static‑site generator (e.g., Docusaurus) pointed at your `docs/` folder
        
    *   Auto‑generate API reference from TS code via `typedoc`
        
2.  **Quick‑Start Tutorials**
    
    *   “Your First Protocol” guide: minimal protocol through lifecycle
        
    *   “Advanced Rituals”: plugin authoring tutorial
        
3.  **Interactive Playground**
    
    *   Embed a web‑based REPL (e.g., StackBlitz) where users can load snippets and see output
        
    *   Tie into your fine‑tuned assistant for in‑browser suggestions
        

> **Agent:** Cline to outline docs and tutorials; Augment to generate typedoc config and playground stubs.  
> **Model:** GPT‑4o for diagram generation and walkthrough scripts.

* * *

Phase 6: CI/CD & Release
------------------------

1.  **Automated Pipeline**
    
    *   **Lint → Build → Test → Publish** flow in GitHub Actions
        
    *   On `main`: run full suite and, on success, publish to npm under `@mirrorwright/orchestrator`
        
2.  **Versioning & Changelogs**
    
    *   Adopt **SemVer** and use `standard‑version` for CHANGELOG.md generation
        
    *   Tag and release via GitHub releases API
        
3.  **Health Monitoring**
    
    *   Deploy a small health‑check endpoint (`/status`) in your agent microservice
        
    *   Integrate uptime checks (e.g., GitHub Actions + Cron job)
        

> **Agent:** Cline to draft CI workflows; Augment to implement and harden scripts.  
> **Model:** GPT‑4.5 to audit pipeline security and reliability.

* * *

### Context‑Limit Alert & Continuity

⚠️ We’ve covered six broad phases. Once we hit deep implementation details, we’ll approach context limits.  
**Suggestion:** After next two implementation sprints, export key artifacts (UML, JSONL schema samples, CI configs) into a new session.

—  
This roadmap gives you an end‑to‑end domain expansion plan, aligns agent roles (Cline/Augment/Strategic AI), ties in fine‑tuning, and ensures you build an extensible, production‑ready orchestration platform.

## Prompt:
augmentRooExport.md

File

provide user with necessary prompts to assistants to add roo-code as additional assistant in all rules in codebase and context where relevant

## Response:
Thought for a couple of seconds

Below are tailored prompts you can feed to each agent (Augment, Cline, and Strategic AI) to weave **Roo Code** into every rule, schema, and context in your Mirrorwright Orchestrator codebase. Drop these directly into your multi‑agent workflow.

* * *

### Prompt for Augment

> **Task:** Update `.cursorrules`, schemas, and TypeScript definitions to include Roo Code as a first‑class agent everywhere “agent” appears.
> 
> **Context:**
> 
> *   We’ve defined agents Cline and Augment in `.cursorrules` and in our JSON schemas (`agent.type` enum).
>     
> *   We need to insert “roo” alongside “cline” and “augment” across:
>     
>     *   `.cursorrules` rules
>         
>     *   `protocol.schema.json` / `mode.schema.json` / `ritual.schema.json` (`agent.type`)
>         
>     *   `AgentType` TS enum in `src/types/agent.ts`
>         
>     *   Agent dispatcher in `src/engine/agent-router.ts`
>         
> 
> **Instructions:**
> 
> 1.  In `.cursorrules`, add a new block:
>     
>     ```yaml
>     roo:
>       description: "Autonomous code‑generation and CLI tooling specialist"
>       triggers: ["ritual.step == 'codegen'", "ritual.meta.roo == true"]
>     ```
>     
> 2.  In each JSON schema under `properties.agent.type.enum`, append `"roo"`.
>     
> 3.  In `src/types/agent.ts`, extend:
>     
>     ```ts
>     export enum AgentType {
>       cline = "cline",
>       augment = "augment",
>       roo = "roo",
>     }
>     ```
>     
> 4.  In `src/engine/agent-router.ts`, wire `roo` to `RooAdapter`:
>     
>     ```ts
>     case AgentType.roo:
>       return new RooAdapter(config);
>     ```
>     
> 5.  Adjust any code or comments that list agent names.
>     
> 
> **Deliverable:** A PR branch that systematically patches all occurrences, schema files, and `.cursorrules` with Roo Code support.

* * *

### Prompt for Cline

> **Task:** Scaffold a new `RooAdapter` implementation and example rituals invoking “roo.”
> 
> **Context:**
> 
> *   We need a concrete adapter class under `src/agents/` and sample YAML rituals.
>     
> *   Roo should handle codegen and CLI‑automation steps.
>     
> 
> **Instructions:**
> 
> 1.  Generate `src/agents/RooAdapter.ts` implementing our `AgentAdapter` interface with stub methods:
>     
>     ```ts
>     export class RooAdapter implements AgentAdapter { … }
>     ```
>     
> 2.  In `src/agents/index.ts`, export `RooAdapter`.
>     
> 3.  Add two example rituals in `protocols/examples/roo-codegen.yaml` demonstrating:
>     
>     ```yaml
>     - name: generate-cli-command
>       agent: roo
>       input:
>         prompt: "Create an `mwo` CLI command for protocol listing"
>     ```
>     
> 4.  Update the README.md “Agent Examples” section to showcase Roo usage.
>     
> 
> **Deliverable:** New files & example YAML in a feature branch ready for review.

* * *

### Prompt for Strategic AI (GPT‑4o or GPT‑4.5)

> **Task:** Review and validate the Roo integration across architecture, schemas, agent roles, and workflows—then propose any missing edge‑cases or pattern refinements.
> 
> **Context:**
> 
> *   Agents now include Cline, Augment, and Roo.
>     
> *   We’ve updated `.cursorrules`, schemas, adapters, and sample rituals.
>     
> 
> **Instructions:**
> 
> 1.  Analyze the updated `.cursorrules` and JSON schemas—verify completeness and consistency for agent dispatch logic.
>     
> 2.  Propose any additional rule triggers or utility fields in Mekanism (e.g., `ritual.meta.rooPriority`) to fine‑tune Roo’s activation.
>     
> 3.  Recommend improvements to the agent‑router sequence to optimize failover between agents.
>     
> 4.  Identify any documentation gaps in “When to call Roo vs. Cline/Augment.”
>     
> 
> **Expected Output:**
> 
> *   A brief architectural critique (2–3 bullet points)
>     
> *   A prioritized list of 3–5 refinements (schema additions, rule tweaks, router logic)
>     
> *   Sample YAML snippet illustrating any new rule you recommend
>     

* * *

Paste each of these into your Cursor workflow at the appropriate stage. This ensures **Roo Code** is fully recognized as an equal‑partner agent throughout your entire codebase and rule set.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)