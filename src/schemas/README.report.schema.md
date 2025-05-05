# Report Schema Documentation

## Overview

The `report.schema.yaml` defines a standardized format for Augment's output reports in the Mirrorwright Orchestrator system. These reports provide structured feedback on protocols, enabling better coordination between different agents (Augment, Cline, Roo) in the system.

## Purpose

- Standardize how Augment provides feedback on protocols
- Enable machine-readable validation results
- Support cross-agent handoffs via tags
- Integrate with memory systems via `vibe_learn` hooks
- Facilitate CI/CD validation of reports

## Schema Structure

The report schema includes:

- **type**: Classification of report purpose (review, validation, optimization, triage)
- **file**: Path to the protocol file being analyzed
- **summary**: Human-readable summary of the report
- **findings**: Array of issues or insights found during validation
- **recommendations**: Array of suggested actions to improve the protocol
- **metadata**: Additional information about the report, including author and memory hooks

## Usage

### Generating Reports

Augment should generate reports that conform to this schema when validating protocols:

```yaml
type: review
file: protocols/example.yaml
summary: "Validation of example protocol"
findings:
  - id: missing_field
    severity: warning
    message: "Missing required field"
    path: "/ritual/steps/0/onFailure"
    tag: "#optimize-ritual"
recommendations:
  - action: "Add missing field"
    new_field:
      onFailure: "fallback_action"
    tags: ["#handoff→Cline"]
metadata:
  author: augment
  created: "2025-05-05T10:00:00Z"
  vibe_learn:
    tags: ["#optimize-ritual"]
    description: "Protocol improved with fallback logic"
```

### Validating Reports

Reports can be validated using AJV:

```typescript
import Ajv from 'ajv';
import yaml from 'js-yaml';
import fs from 'fs';

const ajv = new Ajv({ allErrors: true });
const schema = yaml.load(fs.readFileSync('src/schemas/report.schema.yaml', 'utf-8'));
const validateReport = ajv.compile(schema);

const report = yaml.load(fs.readFileSync('path/to/report.yaml', 'utf-8'));
const valid = validateReport(report);

if (!valid) {
  console.error('Invalid report:', validateReport.errors);
} else {
  console.log('Report is valid');
}
```

## Integration with Other Agents

### Cline

Cline should look for reports with the `#handoff→Cline` tag and process them accordingly.

### Roo

Roo should validate reports against this schema and ensure they follow the correct structure.

### Strategic AI

Strategic AI can use these reports to track protocol improvements and suggest architectural changes.

## Test Fixtures

Test fixtures for this schema are available in:

- `tests/fixtures/report/valid/agent-refinement-cycle.report.yaml` (valid example)
- `tests/fixtures/report/invalid/` (invalid examples for testing)
