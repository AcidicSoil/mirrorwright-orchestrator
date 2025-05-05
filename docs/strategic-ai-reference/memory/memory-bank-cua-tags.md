# Memory Bank CUA Action Tags

This document defines the tag schema for Computer Use Agent (CUA) action memories in the Mirrorwright Orchestrator project.

## CUA Action Tags

When recording CUA actions in the memory bank, use the following tag structure:

### Action Type Tags

Tags for different types of CUA actions:

```bash
# Action type tags
cu-action-open_file        # File read operations
cu-action-write_file       # File write operations
cu-action-run_command      # Command execution
cu-action-browse_web       # Web browsing
```

### Status Tags

Tags for the status of CUA actions:

```bash
# Status tags
status-success             # Successful CUA action
status-error               # Failed CUA action
```

### Agent Tags

Tags for the agent that performed the action:

```bash
# Agent tags
agent-augment              # Action performed by Augment
agent-cline                # Action performed by Cline
agent-roo                  # Action performed by Roo
```

### Mode Tags

Tags for the mode in which the action was performed:

```bash
# Mode tags
mode-implementation        # Action performed in implementation mode
mode-testing               # Action performed in testing mode
mode-documentation         # Action performed in documentation mode
```

### Special Tags

Special tags for CUA actions:

```bash
# Special tags
dry-run                    # Action was a dry run (not actually executed)
security-validated         # Action passed security validation
high-risk                  # Action with potential security implications
```

## Example Usage

```bash
# Record a file write action
python tools/memory.py save \
  --title "Updated configuration file" \
  --tags cu-action-write_file,status-success,agent-augment,mode-implementation \
  --notes "Updated the configuration file with new CUA settings"

# Record a command execution action
python tools/memory.py save \
  --title "Installed langgraph-cua-py package" \
  --tags cu-action-run_command,status-success,agent-cline,mode-implementation \
  --notes "Installed the langgraph-cua-py package via npm"

# Record a failed action
python tools/memory.py save \
  --title "Failed to access restricted directory" \
  --tags cu-action-open_file,status-error,agent-roo,high-risk \
  --notes "Attempted to access a restricted directory, blocked by security policy"
```

## Integration with CUA Memory Manager

The CUA Memory Manager automatically generates these tags when recording actions. The tags are used for:

1. **Filtering**: Finding specific types of actions
2. **Auditing**: Tracking security-sensitive operations
3. **Debugging**: Identifying failed actions
4. **Analytics**: Analyzing patterns of CUA usage

## Best Practices

1. **Be Specific**: Use specific, descriptive titles for CUA action memories
2. **Include Context**: Provide enough context in the notes to understand the purpose of the action
3. **Tag Consistently**: Use the standard tag format for consistency
4. **Record All Actions**: Record both successful and failed actions for a complete audit trail
5. **Include Security Context**: For high-risk actions, include security validation information
