# Mirrorwright Orchestrator Planning

This document outlines the strategic planning and initialization of the Mirrorwright Orchestrator project, including directory structure, technology stack, data models, and initial implementation steps.

## Project Directory Structure

```plaintext
mirrorwright-orchestrator/
├── .cursorrules/                   # Scratchpad & lessons log
├── docs/                           # High-level design, diagrams, decisions
├── protocols/                      # Protocol definitions (YAML)
│   ├── default-protocol.yaml
│   └── templates/                  # Prompt & log templates (Markdown)
├── schemas/                        # JSON schemas for validation
│   ├── protocol.schema.json
│   ├── mode.schema.json
│   └── ritual.schema.json
├── src/
│   ├── cli/                        # CLI interface & commands
│   │   └── index.ts
│   ├── engine/                     # Mode & Ritual engine core logic
│   │   ├── ModeEngine.ts
│   │   └── RitualEngine.ts
│   ├── agents/                     # Adapters for agent communication
│   │   ├── LLManagerAdapter.ts
│   │   └── OpenAIAdapter.ts
│   ├── models/                     # TypeScript interfaces & types
│   │   └── index.ts
│   └── utils/                      # Common helpers & utilities
│       ├── Logger.ts
│       └── ConfigLoader.ts
├── tests/                          # Unit & integration testing
│   └── engine.spec.ts
├── examples/                       # Protocol examples and test cases
│   └── sample-run.ts
├── package.json
├── tsconfig.json
└── README.md                       # Project overview and setup instructions
```

## Technology Stack

| Stack Component | Recommended Choice | Rationale |
| --- | --- | --- |
| **Language** | TypeScript | Strong typing, maintainability, robust ecosystem |
| **Runtime Environment** | Node.js (latest LTS) | Stability, broad support, performance |
| **Package Manager** | pnpm | Faster, efficient dependency management |
| **Testing Framework** | Vitest or Jest | Fast, reliable, comprehensive testing |
| **CLI Utility** | Commander.js | Flexible, widely used, mature |
| **Schema Validation** | AJV (Another JSON Schema Validator) | Speed, compliance with JSON Schema standards |
| **Logging Utility** | Pino | High performance, structured logging |

## Initial Data Models/Schemas

### Protocol Schema (`protocol.schema.json`)

```typescript
export interface Protocol {
  name: string;
  description?: string;
  modes: Mode[];
  rituals: Ritual[];
}
```

### Mode Schema (`mode.schema.json`)

```typescript
export interface Mode {
  id: string;
  title: string;
  description?: string;
  contextModifiers?: Record<string, string>;
  activeRituals: string[]; // References by Ritual IDs
}
```

### Ritual Schema (`ritual.schema.json`)

```typescript
export interface Ritual {
  id: string;
  title: string;
  description?: string;
  steps: RitualStep[];
}

export interface RitualStep {
  promptTemplate: string;  // Reference to a markdown file or inline template
  expectedOutputFormat?: string;
  metaCognitiveHooks?: string[];
}
```

## Strategic Next Steps

### Phase 1 (Architecture)
- Finalize schemas
- Define core engine interfaces and key abstractions
- Setup initial Git workflows (feature branching)

### Phase 2 (Protocol & Mode Definition)
- Implement JSON schema validation with AJV
- Develop protocol and mode loading logic

### Phase 3 (Engine & CLI Implementation)
- Engine execution logic
- CLI tool enhancements for protocol management

## Multi-Agent Coordination & Guidance

### Recommended Prompt for Cursor Cline

```markdown
# Cursor Cline: Project Initialization Prompt

Initiate the Mirrorwright Orchestrator project structure as defined.
- Implement recommended technology stack (TypeScript, pnpm, Vitest).
- Scaffold initial project files (package.json, tsconfig.json, CLI, Logger utility).
- Validate file structure against proposed strategic directory layout.
```

## Model Utilization Strategy

| Task | Recommended Model | Rationale |
| --- | --- | --- |
| Architecture & Directory Layout | GPT-4o | Visual/system reasoning |
| Schema Definition & Documentation | GPT-4.5 | Detail-oriented writing |
| CLI & Utility Implementation | GPT-4o-mini | Efficient, rapid iterations |

## Post-Scaffolding Steps

### 1. Reflect & Confirm Project State
- Confirm the scaffolded structure aligns with the directory plan
- Ensure core placeholders exist
- Audit the project structure

### 2. Document in Scratchpad
```md
## Scratchpad Log – Scaffold Completion

[X] Cline ran project scaffold
[ ] Verify schema folder structure
[ ] Add placeholder ritual & mode YAMLs
[ ] Validate CLI startup
```

### 3. Update Memory Bank
```bash
venv/bin/python tools/memory.py save \
  --title "Mirrorwright Initial Scaffold" \
  --tags task-setup,template-project-init \
  --notes "Created base directory structure and core files using kickoff prompt."
```

### 4. Begin Protocol Schema Validation Work
- Implementation Phase: Protocol Definition
- Working Model: GPT-4.5
- Define and validate schema structures for Protocols, Modes, and Rituals

### 5. Run the CLI Entry Point
```bash
npm run dev -- run demo-ritual
```

### 6. Suggested Focus Areas for Augment
- CLI ergonomics
- Modular plugin setup in execution engine
- Schema validation logic performance
- TypeScript ergonomics (DRY types/shared structures)
