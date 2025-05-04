# Domain Expansion Strategy for Mirrorwright Orchestrator

This document outlines a comprehensive, multi-phase roadmap for expanding the Mirrorwright Orchestrator project from its core engine to a broad, production-ready orchestration platform.

## Phase 0: Domain Discovery & Knowledge Modeling

1. **Inventory Core Concepts**
   - Catalog existing "protocol", "mode", "ritual" schemas and their relationships
   - Map out all entry points (CLI, programmatic API, `<engine>/agent-interface`)
   - Identify gaps: missing use-cases, undocumented corner-cases

2. **Define Domain Ontology**
   - Create a canonical glossary (Protocol, Mode, Ritual, Behavior Tree, Plugin)
   - Model relationships (e.g., Protocol ▶️ Mode ▶️ Ritual ▶️ Action)
   - Represent as a lightweight UML or graph schema

3. **Agent Roles & Capabilities Matrix**
   - Align Cursor Cline, Augment, and strategic-AI roles to domain areas
   - Assign which agent handles schema design, which handles execution logic, which handles testing

**Deliverables:** Domain glossary doc, UML diagram, Agent/Capability matrix

## Phase 1: Schema & Interface Expansion

1. **Extend JSON Schema Definitions**
   - Add "metadata" block to every schema (version, author, createdAt)
   - Introduce reusable schema fragments (e.g., common `identifier`, `conditions`, `transitions`)

2. **TypeScript Interface Generation**
   - Automate via codegen (e.g., `quicktype`, `typescript-json-schema`)
   - Include JSDoc comments pulled from your markdown docs

3. **Plugin Interface Spec**
   - Define an abstract `RitualPlugin` interface in `src/plugins/`
   - Methods: `initialize(context)`, `execute(args)`, `cleanup()`
   - Enforce via TS and a runtime plugin loader

**Agent:** Prompt Augment to scaffold schema fragments and plugin interfaces.  
**Model:** GPT-4o-mini for rapid generation of JSON schema snippets.

## Phase 2: Engine & Execution Core

1. **Unified Validation Loader**
   - Build a single AJV instance that loads all schemas at startup
   - Leverage `$id` and `addSchema` patterns to avoid "no schema ref" errors

2. **Execution Pipeline**
   - Design a pipeline:
     1. **Load** protocol definition
     2. **Validate** against AJV
     3. **Instantiate** mode context
     4. **Sequence** ritual executions via Behavior-Tree pattern
     5. **Emit** events/logs

3. **Asynchronous & Error-Resilient Design**
   - Wrap each ritual in a try/catch with retry/backoff policies
   - Define failure modes in schema (e.g., `onError: halt | continue | compensate`)

**Agent:** Use Cline for the high-level pipeline spec, then Augment to implement step-by-step.  
**Model:** GPT-4o for complex design and visual reasoning of the pipeline.

## Phase 3: AI-Assistant Integration & Fine-Tuning

1. **Contextual Prompting Wrapper**
   - In `engine/agent-interface.ts`, embed context: current protocol, active mode, last event
   - Standardize prompt templates for "schema update", "fixture gen", "code review"

2. **Fine-Tuned Model Deployment**
   - Follow the Unsloth CLI steps to train on your repo JSONL
   - Host as a local microservice (e.g., `fastify` or `express` endpoint)

3. **Interactive CLI Extensions**
   - Add commands like `mwo assist validate <path>` or `mwo assist fixture <schema>`
   - These invoke your fine-tuned model to generate suggestions

**Agent:** After training, use strategic-AI (GPT-4.5) to craft and optimize prompt templates.  
**Model:** GPT-4o-mini for on-the-fly suggestions in CLI.

## Phase 4: Testing, Validation & QA

1. **Comprehensive Test Matrix**
   - **Unit tests** for each plugin, validator, and utility
   - **Integration tests**: full run of a sample protocol through modes and rituals
   - **Contract tests**: verify that plugin implementations honor the Plugin interface

2. **Golden Fixtures & Snapshotting**
   - Store canonical JSON fixtures for each protocol/mode/ritual combination
   - Automate snapshot comparisons on CI (Vitest snapshot feature)

3. **Performance Benchmarks**
   - Measure schema loading, validation latency, execution throughput
   - Define SLAs (e.g., "100 validations/sec at 1,000 concurrent workflows")

**Agent:** Augment to build test harnesses; Cline to define test scenarios.  
**Model:** GPT-4.5 to review coverage and suggest edge cases.

## Phase 5: Documentation & Developer Experience

1. **Living Documentation Site**
   - Use a static-site generator (e.g., Docusaurus) pointed at your `docs/` folder
   - Auto-generate API reference from TS code via `typedoc`

2. **Quick-Start Tutorials**
   - "Your First Protocol" guide: minimal protocol through lifecycle
   - "Advanced Rituals": plugin authoring tutorial

3. **Interactive Playground**
   - Embed a web-based REPL (e.g., StackBlitz) where users can load snippets and see output
   - Tie into your fine-tuned assistant for in-browser suggestions

**Agent:** Cline to outline docs and tutorials; Augment to generate typedoc config and playground stubs.  
**Model:** GPT-4o for diagram generation and walkthrough scripts.

## Phase 6: CI/CD & Release

1. **Automated Pipeline**
   - **Lint → Build → Test → Publish** flow in GitHub Actions
   - On `main`: run full suite and, on success, publish to npm under `@mirrorwright/orchestrator`

2. **Versioning & Changelogs**
   - Adopt **SemVer** and use `standard-version` for CHANGELOG.md generation
   - Tag and release via GitHub releases API

3. **Health Monitoring**
   - Deploy a small health-check endpoint (`/status`) in your agent microservice
   - Integrate uptime checks (e.g., GitHub Actions + Cron job)

**Agent:** Cline to draft CI workflows; Augment to implement and harden scripts.  
**Model:** GPT-4.5 to audit pipeline security and reliability.
