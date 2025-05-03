# Strategic AI Prompt Template

## Context
[Provide brief context about the current state of the Mirrorwright Orchestrator project, including any recent developments or challenges]

## Question/Task
[Clearly state what you need guidance on, being as specific as possible]

## Current Approach
[Describe your current thinking or approach to the problem, if applicable]

## Constraints
[List any technical, architectural, or process constraints that must be respected]

## Expected Output
[Specify what kind of output you're looking for: architecture proposal, evaluation of options, workflow recommendation, etc.]

---

Example:

## Context
We're implementing the protocol validation engine for Mirrorwright Orchestrator. We have defined the TypeScript interfaces and basic JSON Schema structure, but we're unsure about the most efficient way to handle conditional validation based on protocol modes.

## Question/Task
What's the most efficient architecture for implementing conditional validation rules that can vary based on the active mode in a protocol?

## Current Approach
We're considering two options:
1. A single validator with conditional logic
2. Multiple specialized validators that get selected based on mode

## Constraints
- Must work with Ajv validation library
- Must provide clear, specific error messages
- Must be extensible for future mode types

## Expected Output
A recommendation on which approach to take, with justification and a high-level design for the validation architecture.
