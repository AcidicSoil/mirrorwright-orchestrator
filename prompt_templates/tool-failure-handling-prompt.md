---
agent: system
purpose: error-handling
id: tool-failure-handling-protocol
version: 1.0.0
---

# Tool Failure Handling Protocol

## 🔍 Overview

This protocol defines how to handle tool failures, unexpected outputs, and situations where manual intervention is required due to tool limitations or errors.

## 🚨 Detection Guidelines

When using tools, always verify that:
1. The tool executed without errors
2. The output matches expected format and content
3. The output is relevant to the user's request
4. The tool's success message accurately reflects the actual outcome

## 📝 Documentation Requirements

When a tool failure is detected, document:
- Tool name and function
- Input parameters provided
- Expected output
- Actual output received
- Type of failure (error, silent failure, unexpected output)
- Impact on the current task

## 🗣️ User Communication

When informing users about tool failures:
1. Be transparent but not alarmist
2. Clearly explain what went wrong
3. Describe how it affects the current task
4. Present alternatives if available
5. Provide enough technical detail for debugging without overwhelming

## 🔄 Reminder Protocol

When a previously failed tool is used again:
1. Check if the tool has failed before in this conversation
2. Remind the user about the previous failure
3. Suggest alternatives if available
4. Offer to try again with different parameters if appropriate

## 📊 Example Response Format

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

## 🧠 Memory Integration

Use the `remember` tool or `vibe_learn` to document tool failures with tags:
- `#tool-failure`
- `#maintenance-needed`
- `#silent-error`

This ensures the issue is tracked for future maintenance and improvement.
