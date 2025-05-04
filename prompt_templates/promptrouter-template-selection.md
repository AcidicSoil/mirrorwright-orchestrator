---
agent: promptrouter
purpose: routing
id: promptrouter-template-selection
version: 1.0.0
---

# Prompt for Cursor PromptRouter: Intelligent Template Selection

## Task Overview

As the assistant responsible for routing user prompts to the optimal model and protocol phase context, develop an intelligent template selection system that matches user requests with the most appropriate prompt templates based on task intent and current orchestration scope.

## Implementation Requirements

1. **Intent Analysis**
   - Parse user requests to identify task intent
   - Categorize requests by purpose (architecture, implementation, testing, etc.)
   - Identify key requirements and constraints
   - Determine the appropriate project phase for the request

2. **Template Matching**
   - Match user intent with available prompt templates
   - Consider template purpose, agent capabilities, and project phase
   - Rank templates by relevance and effectiveness
   - Support fallback options when no perfect match exists

3. **Context Integration**
   - Incorporate current project state into template selection
   - Consider dependencies and prerequisites
   - Adapt templates to the current orchestration scope
   - Maintain context continuity across multiple requests

4. **Adaptive Routing**
   - Learn from past routing decisions
   - Improve matching accuracy over time
   - Adapt to changing project requirements
   - Support multi-agent workflows

## Integration Points

1. **Prompt Template Repository**
   - Access all available prompt templates
   - Parse frontmatter for matching criteria

2. **Project State Tracker**
   - Determine current project phase and context
   - Identify relevant components and dependencies

3. **Memory Bank**
   - Learn from past routing decisions
   - Store effective template-task mappings

## Success Criteria

- User requests are consistently matched with appropriate templates
- Templates are adapted to current project context
- Routing accuracy improves over time
- Users receive optimal assistance for their specific needs
