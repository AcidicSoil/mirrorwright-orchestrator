# Integrating Report Schema with Augment Agent

This document explains how to integrate the report schema with the Augment agent in the Mirrorwright Orchestrator system.

## Overview

The Augment agent should generate structured reports when validating and optimizing protocols. These reports follow a specific schema defined in `src/schemas/report.schema.yaml` and are validated using the tool in `tools/validate-reports.js`.

## Report Structure

Each report should include:

- **type**: Classification of report purpose (review, validation, optimization, triage)
- **file**: Path to the protocol file being analyzed
- **summary**: Human-readable summary of the report
- **findings**: Array of issues or insights found during validation
- **recommendations**: Array of suggested actions to improve the protocol
- **metadata**: Additional information about the report, including author and memory hooks

## Example Report

```yaml
type: review
file: protocols/example-protocol.yaml
summary: Augment reviewed the example protocol and found potential improvements.

findings:
  - id: missing_fallback_handler
    severity: warning
    message: "Protocol is missing fallback handlers for error cases."
    path: "/modes/0/exitRitual"
    tag: "#optimize-ritual"

  - id: redundant_configuration
    severity: info
    message: "Consider reusing common configuration into a shared fragment."
    path: "/modes/0/config"
    tag: "#refactor-modular"

recommendations:
  - action: "Add fallback handlers for error cases"
    new_field:
      exitRitual: "handle_error"
    tags: ["#handoff→Cline", "#review-needed"]

  - action: "Extract common configuration"
    insert_fragment: "fragments/common-config.yaml"
    tags: ["#refactor-modular"]

metadata:
  author: augment
  created: 2025-05-05T14:30:00Z
  vibe_learn:
    tags: ["#optimize-ritual", "#review-needed"]
    description: "Example protocol improved with fallback handlers and modular configuration."
    source: protocols/example-protocol.yaml
    link: reports/augment/example-protocol.report.yaml
```

## Integration Steps

1. **Update Augment's Guidelines**:
   - Modify Augment's guidelines to include information about generating reports that conform to this schema
   - Ensure Augment includes proper tags for cross-agent handoffs (`#handoff→Cline`, `#handoff→Roo`, `#review-needed`)

2. **Generate Reports**:
   - When validating a protocol, Augment should generate a report and save it to `reports/augment/{protocol-name}.report.yaml`
   - The report should include all findings and recommendations

3. **Include Memory Hooks**:
   - Each report should include `vibe_learn` hooks in the metadata section
   - These hooks should include tags, description, source, and link

4. **Validate Reports**:
   - Augment should validate its own reports against the schema before saving them
   - This can be done using the `validateReport` function from `tools/validate-reports.js`

## Cross-Agent Coordination

Reports include tags that facilitate cross-agent coordination:

- `#handoff→Cline`: Indicates that Cline should take action based on the report
- `#handoff→Roo`: Indicates that Roo should review the report for compliance
- `#review-needed`: Indicates that human review is required

These tags should be included in the `recommendations` section of the report.

## Validation

Reports can be validated using the validation tool:

```bash
# Validate all reports
npm run validate:reports

# Validate only reports that should be valid
npm run validate:reports:valid

# Validate a specific report
node tools/validate-reports.js valid reports/augment/example-protocol.report.yaml
```

## CI/CD Integration

Reports are automatically validated in the CI/CD pipeline using the GitHub workflow defined in `.github/workflows/validate-reports.yml`.
