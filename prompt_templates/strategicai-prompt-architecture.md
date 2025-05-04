---
agent: strategicai
purpose: architecture
id: strategicai-prompt-architecture
version: 1.0.0
---

# Prompt for Cursor StrategicAI: Prompt System Architecture

## Task Overview

As the assistant responsible for transforming user intent into structured, phase-aware prompt blueprints, develop a comprehensive architecture for the Mirrorwright Orchestrator's prompt system that aligns with protocol objectives and supports the new frontmatter standard.

## Implementation Requirements

1. **Prompt Lifecycle Management**
   - Define the complete lifecycle of a prompt template
   - Establish clear processes for creation, validation, usage, and retirement
   - Design version control and change management workflows
   - Create a governance model for prompt quality and consistency

2. **System Components**
   - Design the core components of the prompt system:
     - Template Repository: Storage and retrieval of prompt templates
     - Frontmatter Parser: Extraction and validation of metadata
     - Template Generator: Creation of new templates
     - Validation Engine: Ensuring compliance with standards
     - Analytics Module: Tracking usage and effectiveness

3. **Integration Architecture**
   - Define how the prompt system integrates with:
     - Agent Registry: Mapping templates to assistants
     - Protocol Engine: Ensuring protocol compliance
     - Memory Bank: Storing and retrieving context
     - CI/CD Pipeline: Automating validation and deployment

4. **Extensibility Framework**
   - Design for future expansion:
     - Support for new assistant types
     - Additional metadata fields
     - Enhanced validation rules
     - Advanced analytics capabilities

## Success Criteria

- The architecture supports all current and anticipated prompt system requirements
- Components are modular and loosely coupled
- The system integrates seamlessly with existing Mirrorwright components
- The architecture enables continuous improvement of prompt quality and effectiveness
