---
agent: roo
purpose: implementation
id: roo-cli-protocol-validator
version: 1.0.0
---

# Prompt for Cursor Roo: CLI Tool for Protocol Validation

As the autonomous code-generation and CLI tooling specialist, please develop a command-line interface tool that will:

1. Validate protocol files against their schemas
2. Generate TypeScript types from protocol schemas
3. Provide helpful error messages for invalid protocols
4. Support batch validation of multiple protocol files
5. Include a --fix option to attempt automatic repairs of common issues

The CLI should be implemented in TypeScript with a focus on performance and usability. It should integrate with the existing validator engine and follow the project's established patterns for CLI tools.

Label the PR: `[#tools] Protocol Validation CLI`
