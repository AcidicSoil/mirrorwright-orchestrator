---
agent: strategicai
purpose: documentation
id: improved-assistant-prompt-extraction
version: 1.0.0
---

# Improved Assistant Prompt Extraction Tool

## Overview

The Improved Assistant Prompt Extraction Tool enhances the original extraction tool with better pattern matching, table extraction, and more robust error handling. This tool is designed to extract assistant prompts from conversation logs and generate standardized prompt templates for different assistants in the Mirrorwright Orchestrator project.

## Key Improvements

1. **Enhanced Pattern Matching**
   - Added support for more prompt formats in conversation logs
   - Improved detection of section boundaries
   - Better handling of markdown formatting

2. **Table-Based Extraction**
   - Added ability to extract assistant information from markdown tables
   - Supports extraction from tables with assistant names, file paths, and descriptions
   - Generates structured prompts based on table information

3. **Improved Error Handling**
   - Better file path validation and error reporting
   - More informative error messages
   - Graceful handling of missing files or invalid content

4. **Frontmatter Support**
   - Generates prompts with proper YAML frontmatter
   - Includes agent, purpose, id, and version fields
   - Follows the established frontmatter standard

5. **Better Documentation**
   - Improved help text and usage instructions
   - Clear explanation of command-line options
   - Examples of common usage patterns

## Usage

```bash
node src/tools/improved-extractAssistantPrompts.js [conversationPath] [outputDir] [options]
```

### Arguments

- `conversationPath`: Path to the conversation log file (default: `extractAssistantPrompts.md`)
- `outputDir`: Directory to save extracted prompts (default: `assistant-prompts`)

### Options

- `--help`, `-h`: Show help message
- `--verbose`, `-v`: Show verbose output

### Examples

```bash
# Basic usage with default paths
node src/tools/improved-extractAssistantPrompts.js

# Specify conversation log and output directory
node src/tools/improved-extractAssistantPrompts.js my-conversation.md my-prompts

# Show verbose output
node src/tools/improved-extractAssistantPrompts.js --verbose
```

## Implementation Details

The improved tool includes several key enhancements:

### Enhanced Pattern Matching

```javascript
// Enhanced patterns for assistant prompts in conversation logs
const promptPatterns = [
  /# Cursor (\w+):/i,
  /Prompt for Cursor (\w+):/i,
  /# (\w+): /i,
  /# Prompt for Cursor (\w+):/i,
  /🧩 Prompt for \*\*(\w+)\*\*/i,  // Added pattern for "🧩 Prompt for **Augment**"
  /## 🧩 Prompt for \*\*(\w+)\*\*/i,  // Added pattern for "## 🧩 Prompt for **Cline**"
  /\*\*(\w+)\*\* \| .+ \| .+/i  // Pattern for table row with assistant name in bold
];
```

### Table Extraction

```javascript
/**
 * Extract prompts from markdown tables in the conversation log
 */
function extractPromptsFromTables(lines, extractedPrompts) {
  // Find table sections
  let inTable = false;
  let tableStart = -1;
  let tableHeaders = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect table start (header row)
    if (line.startsWith('| ') && line.endsWith(' |') && !inTable) {
      tableStart = i;
      tableHeaders = line.split('|').map(h => h.trim()).filter(h => h);
      inTable = true;
      continue;
    }
    
    // Process table row
    if (inTable && line.startsWith('| ') && line.endsWith(' |')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // Check if this is an assistant definition row
      const assistantMatch = cells[0].match(/\*\*(\w+)\*\*/i);
      if (assistantMatch) {
        const assistant = assistantMatch[1].toLowerCase();
        
        // Extract purpose and file path
        // ...
      }
    }
  }
}
```

### Frontmatter Generation

```javascript
// Create a placeholder with proper frontmatter
promptsByAssistant[assistant.name] = `---
agent: ${assistant.name}
purpose: implementation
id: ${assistant.name}-prompt
version: 1.0.0
---

# Cursor ${assistant.name}: Auto-generated Prompt

Based on role: "${assistant.description}"

This prompt would be generated based on:
1. The assistant's role description
2. Current project state
3. Implementation patterns
4. Next logical development steps

Current focus areas would be extracted from project state analysis.
`;
```

## Integration with Existing Tools

The improved extraction tool is designed to work alongside the existing tools in the Mirrorwright Orchestrator project:

1. **AssistantRulesRegistry**: Uses the same assistant definitions from `.cursorrules`
2. **Prompt Templates**: Generates prompts that follow the established template format
3. **CI/CD Integration**: Can be integrated into the existing CI/CD pipeline

## Future Enhancements

1. **LLM Integration**: Add support for generating prompts using an LLM
2. **Template Customization**: Allow customization of prompt templates
3. **Validation**: Add validation of extracted prompts against schema
4. **Diff Generation**: Show differences between extracted and existing prompts
5. **Interactive Mode**: Add interactive mode for selecting which prompts to extract

## Conclusion

The Improved Assistant Prompt Extraction Tool provides a more robust and flexible way to extract and generate assistant prompts from conversation logs. By supporting more formats and providing better error handling, it ensures that all assistant prompts are properly extracted and formatted according to the established standards.
