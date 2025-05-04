# Example Protocol Structure for Mirrorwright Orchestrator

This document provides example protocol files to illustrate the structure and format expected by the Mirrorwright Orchestrator system.

## Protocol Definition

```yaml
# protocols/meta-thinking/protocol.yaml
id: meta-thinking
name: Meta-Thinking Protocol
description: Activates high-level strategic cognition, recursion, and multi-agent alignment
version: 1.0.0
authors:
  - name: Mirrorwright Team
    email: example@example.com

# List of modes available in this protocol
modes:
  - strategic-planning
  - creative-exploration
  - implementation
  - reflection

# Map of available rituals in this protocol
rituals:
  entry-ritual:
    id: protocol-entry
    description: Initialize the protocol and set context

  exit-ritual:
    id: protocol-exit
    description: Summarize insights and prepare for next steps

  phase-transition:
    id: transition-between-modes
    description: Manage the transition between different modes
```

## Mode Definition

```yaml
# protocols/meta-thinking/modes/strategic-planning.yaml
id: strategic-planning
name: Strategic Planning Mode
description: Focused on high-level architecture and system design

# Rituals to run at specific points
entryRitual: strategic-entry
exitRitual: strategic-exit

# Configuration for this mode
config:
  # Prompt modifiers to apply to all agent interactions in this mode
  promptModifiers:
    - prefix: 'You are now in Strategic Planning mode. Focus on architecture, system design, and big-picture thinking.'
    - suffix: 'Consider long-term implications of design choices.'

  # Default tools to make available
  tools:
    - diagramming
    - system-modeling
    - architecture-validation

  # Agent-specific configurations
  agentConfig:
    primary:
      model: gpt-4o
      temperature: 0.7
    secondary:
      model: gpt-4.5
      temperature: 0.4
```

## Ritual Definition

```yaml
# protocols/meta-thinking/rituals/strategic-entry.yaml
id: strategic-entry
name: Strategic Planning Entry Ritual
description: Ritual to initialize the strategic planning mode

steps:
  - id: context-setting
    type: prompt
    agent: primary
    content: |
      You are entering Strategic Planning Mode.

      Current project context: {{projectContext}}
      Current task: {{currentTask}}

      Please outline the key architectural considerations for this task.
    next: goal-setting

  - id: goal-setting
    type: prompt
    agent: primary
    content: |
      Based on the architectural considerations you outlined, please define:

      1. Primary goals for this planning session
      2. Key constraints to consider
      3. Success criteria
    next: plan-creation

  - id: plan-creation
    type: prompt
    agent: primary
    content: |
      Create a structured plan that addresses the goals while respecting the constraints.

      The plan should include:

      1. Major components/systems
      2. Interactions between components
      3. Implementation phases
      4. Potential challenges and mitigations
    next: cross-validation

  - id: cross-validation
    type: prompt
    agent: secondary
    content: |
      Review the following strategic plan:

      {{primaryResults.plan-creation}}

      Please identify:

      1. Any potential weaknesses or gaps
      2. Alternative approaches that might be better
      3. Implementation challenges that might be underestimated
    next: synthesis

  - id: synthesis
    type: prompt
    agent: primary
    content: |
      You have created a strategic plan, and received feedback:

      ORIGINAL PLAN:
      {{results.plan-creation}}

      FEEDBACK:
      {{results.cross-validation}}

      Please synthesize a final strategic plan that incorporates the feedback.
      This will be the guiding document for the current strategic planning session.
```

## Prompt Template

```markdown
<!-- protocols/meta-thinking/templates/agent-reflection.md -->

# Agent Reflection Template

## Context

{{context}}

## Current Task

{{task}}

## Progress So Far

{{progress}}

## Reflection Questions

1. What are the most important insights gained so far?
2. What assumptions have been made that should be questioned?
3. What alternative approaches should be considered?
4. What potential risks or challenges might emerge?
5. How does this work connect to the broader system goals?

## Next Steps

Based on your reflection, outline the 3-5 most important next steps.
```

## How These Components Work Together

1. The **Protocol** defines the overall structure, available modes, and rituals
2. **Modes** define specific operational contexts with particular tools and agent configurations
3. **Rituals** define specific sequences of steps that accomplish a particular goal
4. **Templates** provide reusable prompt structures that can be filled with context-specific information

This modular design allows for:

- Mixing and matching components
- Extending with new modes and rituals
- Customizing behaviors while maintaining a consistent structure
- Sharing and reusing components across different protocols
