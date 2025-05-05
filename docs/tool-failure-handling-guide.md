# Tool Failure Handling Guide

This guide outlines the protocol for handling tool failures and unexpected outputs in the Mirrorwright Orchestrator system.

## Overview

Tools are essential components of the Mirrorwright Orchestrator, but they can sometimes fail or produce unexpected outputs. This guide provides a standardized approach for detecting, documenting, and communicating tool failures to ensure they are properly addressed.

## Tool Failure Protocol

### 1. Detection

When using tools, always verify that:
- The tool executed without errors
- The output matches expected format and content
- The output is relevant to the user's request
- The tool's success message accurately reflects the actual outcome

### 2. Documentation

When a tool failure is detected, document:
- Tool name and function
- Input parameters provided
- Expected output
- Actual output received
- Type of failure (error, silent failure, unexpected output)
- Impact on the current task

### 3. User Communication

When informing users about tool failures:
- Be transparent but not alarmist
- Clearly explain what went wrong
- Describe how it affects the current task
- Present alternatives if available
- Provide enough technical detail for debugging without overwhelming

### 4. Memory Integration

Use the `remember` tool or `vibe_learn` to document tool failures with tags:
- `#tool-failure`
- `#maintenance-needed`
- `#silent-error`

### 5. Reminder Protocol

When a previously failed tool is used again:
- Check if the tool has failed before in this conversation
- Remind the user about the previous failure
- Suggest alternatives if available
- Offer to try again with different parameters if appropriate

## Example Response Format

```
⚠️ **Tool Failure Detected**: [Brief description of what went wrong]

**Impact**: [How this affects the current task]

**Alternative**: [What can be done instead, if applicable]

**Failure Details**:
- Tool: [Tool name]
- Input: [Parameters provided]
- Expected: [What should have happened]
- Actual: [What actually happened]
- Error Type: [Classification of the error]

*Note: This issue has been documented and should be addressed in future maintenance.*
```

## Known Tool Issues

### extractAssistantPrompts

**Issue**: The tool reports success but generates placeholder content instead of extracting actual prompts from conversation logs.

**Workaround**: Manually extract prompts from conversation logs and save them to the appropriate files.

**Reminder Message**: "⚠️ Note: The extractAssistantPrompts tool has previously shown issues with extracting certain prompt formats from conversation logs, potentially generating placeholders instead. Consider manually verifying the extracted content after execution."

## Implementation

The tool failure handling protocol is implemented as an assistant rule in the AssistantRulesRegistry:

- Rule: `tool-failure-handling-rule.json`
- Prompt Template: `tool-failure-handling-prompt.md`
- Memory Example: `tool-failure-extractAssistantPrompts.md`

To register the rule, run:

```bash
node register-tool-failure-rule.js
```
