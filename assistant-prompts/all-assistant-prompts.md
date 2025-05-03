## cline

### 🔧 **Prompt for Cursor Cline: Ritual & Mode Schema Setup**

```md
# Cursor Cline: Schema + Validator Setup

Implement the following components:

1. **TypeScript Interfaces**
   - `Protocol`, `Mode`, `Ritual`, `RitualStep`

2. **JSON Schemas**
   - `schemas/protocol.schema.json`
   - `schemas/mode.schema.json`
   - `schemas/ritual.schema.json`

3. **Validator Utility**
   - Create `src/utils/validateSchema.ts` that:
     - Uses AJV to validate any of the three schemas
     - Accepts a path and schema type
     - Throws on error with formatted output

Ensure compatibility with the CLI runner (in `src/cli/index.ts`) and prepare a stub command to load a ritual from YAML and print its steps.
```

* * *

### ✨ **Prompt for Cursor Augment: CLI + Engine Enhancement**

```md
# Cursor Augment: Ritual Execution Loop + CLI Enhancements

Refactor CLI and core engine components as follows:

1. **CLI Command Updates**
   - Add `run` command that accepts:
     - `--ritual-id` or positional argument
     - Optional `--mode-id`
   - Load protocol, ritual, and mode from `protocols/default`

2. **Ritual Engine**
   - Parse ritual steps and output each step prompt to console
   - Apply any `metaCognitiveHooks` via comment decorators
   - Scaffold internal execution loop for rituals

3. **Logging Hook**
   - Log each step to `split-vision-logbook.log`
   - Format: timestamp, ritual ID, step prompt, mode context

This establishes an early interactive feedback loop while enabling safe iteration.
```

* * *

🔁 Strategic AI Transition Prompt (Use in ChatGPT)

---

## augment

Prompt for Cursor Augment:
Refactor and optimize the `ModeEngine` and `RitualEngine` modules to be modular, extensible, and schema-driven. Improve error handling, isolate side effects, and suggest unit tests.
```

* * *

🧭 Summary: Mirrorwright Phase Transition Checklist
---------------------------------------------------

| Phase | Status |
| --- | --- |
| Project Scaffolded (Cline) | ✅ Done |
| Scratchpad + Memory Update | ✅ Now |
| Ritual/Mode Schema Design | 🚧 Next |
| CLI Smoke Test | 🟡 In Progress |
| Protocol Validator (AJV) | ⏭️ Upcoming |

* * *

Would you like a follow-up command set to initialize `ritual.yaml`, `mode.yaml`, and a basic CLI ritual runner stub for immediate iteration?

## Prompt:
sure and transition prompts for assistants for cursor IDE

## Response:
Excellent. Here's a clean continuation strategy for you — including follow-up command sets, assistant handoff prompts for the Cursor IDE agents (Cline, Augment), and model context transitions aligned with the `.cursorrules` system.

* * *

✅ Immediate Follow-Up: Command Set to Seed Ritual/Mode Files
------------------------------------------------------------

### 📁 **File Creation Commands**

```bash
# Create initial structure
mkdir -p protocols/default/rituals
mkdir -p protocols/default/modes
mkdir -p protocols/default/templates

# Seed basic ritual YAML
cat > protocols/default/rituals/init-reflection.yaml <<EOF
id: init-reflection
title: Initial Reflection Ritual
description: Establish baseline alignment for a new protocol
steps:
  - promptTemplate: reflection-init.md
    expectedOutputFormat: markdown
    metaCognitiveHooks:
      - "self-check: alignment"
EOF

# Seed basic mode YAML
cat > protocols/default/modes/meta-thinking.yaml <<EOF
id: meta-thinking
title: Meta-Thinking Mode
description: Enables recursive reflection and protocol alignment
contextModifiers:
  focus: "high"
activeRituals:
  - init-reflection
EOF

# Seed prompt template
cat > protocols/default/templates/reflection-init.md <<EOF

---

## vibecheck

# Cursor vibecheck: Auto-generated Prompt

Based on role: "Flag deviations from core orchestration tone, scope, or clarity across all agent communications."

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.


---

## cursorscan

# Cursor cursorscan: Auto-generated Prompt

Based on role: "Map all file changes, agent contributions, and prompt evolutions to traceable protocol lifecycle metadata."

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.


---

## promptrouter

# Cursor promptrouter: Auto-generated Prompt

Based on role: "Route user prompts to optimal model and protocol phase context based on task intent and current orchestration scope."

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.


---

## strategicai

# Cursor strategicai: Auto-generated Prompt

Based on role: "Transform user intent into structured, phase-aware prompt blueprints aligned with protocol objectives."

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.


---
