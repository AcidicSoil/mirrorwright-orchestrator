# Integrating Report Schema with Cline and Roo Agents

This document explains how to integrate the report schema with the Cline and Roo agents in the Mirrorwright Orchestrator system.

## Overview

Augment generates structured reports when validating and optimizing protocols. These reports follow a specific schema defined in `src/schemas/report.schema.yaml` and include tags that facilitate cross-agent coordination. Cline and Roo should be updated to process these reports and take appropriate actions.

## Cline Integration

Cline is responsible for implementing structural changes suggested by Augment.

### Responsibilities

1. **Monitor Reports**:
   - Periodically check for new reports in `reports/augment/`
   - Look for reports with the `#handoff→Cline` tag

2. **Process Recommendations**:
   - Parse the `recommendations` section of the report
   - Implement the suggested changes, such as adding missing fields or extracting common fragments

3. **Update Protocols**:
   - Modify the protocol files based on the recommendations
   - Ensure the changes maintain the integrity of the protocol

### Implementation

```typescript
// Example implementation in Cline agent
import { readdir } from 'fs/promises';
import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';

async function processAugmentReports() {
  const reportsDir = join(process.cwd(), 'reports/augment');
  const files = await readdir(reportsDir);
  
  for (const file of files) {
    if (!file.endsWith('.report.yaml')) continue;
    
    const reportPath = join(reportsDir, file);
    const report = load(readFileSync(reportPath, 'utf-8'));
    
    // Check if this report is for Cline
    const isForCline = report.recommendations.some(rec => 
      rec.tags && rec.tags.includes('#handoff→Cline')
    );
    
    if (isForCline) {
      // Process the recommendations
      for (const rec of report.recommendations) {
        if (rec.tags && rec.tags.includes('#handoff→Cline')) {
          // Implement the recommendation
          // ...
        }
      }
    }
  }
}
```

## Roo Integration

Roo is responsible for enforcing rules and ensuring protocol integrity.

### Responsibilities

1. **Validate Reports**:
   - Validate reports against the schema defined in `src/schemas/report.schema.yaml`
   - Ensure reports include all required fields and follow the correct structure

2. **Monitor Compliance**:
   - Look for reports with the `#handoff→Roo` tag
   - Verify that the suggested changes comply with the project's rules and guidelines

3. **Raise Alerts**:
   - Alert when reports are missing required tags or fields
   - Notify when recommendations might violate project guidelines

### Implementation

```typescript
// Example implementation in Roo agent
import { validateReport } from '../tools/validate-reports';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

async function validateAugmentReports() {
  const reportsDir = join(process.cwd(), 'reports/augment');
  const files = await readdir(reportsDir);
  
  for (const file of files) {
    if (!file.endsWith('.report.yaml')) continue;
    
    const reportPath = join(reportsDir, file);
    const result = validateReport(reportPath);
    
    if (!result.valid) {
      console.error(`Invalid report: ${file}`);
      console.error(result.errors);
      // Alert or take corrective action
    }
    
    // Check if this report is for Roo
    const report = load(readFileSync(reportPath, 'utf-8'));
    const isForRoo = report.recommendations.some(rec => 
      rec.tags && rec.tags.includes('#handoff→Roo')
    );
    
    if (isForRoo) {
      // Process the recommendations
      for (const rec of report.recommendations) {
        if (rec.tags && rec.tags.includes('#handoff→Roo')) {
          // Verify compliance
          // ...
        }
      }
    }
  }
}
```

## Cross-Agent Coordination

Reports include tags that facilitate cross-agent coordination:

- `#handoff→Cline`: Indicates that Cline should take action based on the report
- `#handoff→Roo`: Indicates that Roo should review the report for compliance
- `#review-needed`: Indicates that human review is required

These tags should be included in the `recommendations` section of the report.

## Memory Integration

Both Cline and Roo should update the memory system when processing reports:

```typescript
// Example memory integration
function updateMemory(report) {
  const memory = {
    title: `Processed report for ${report.file}`,
    tags: ['#report-processed', ...report.metadata.vibe_learn.tags],
    notes: `Processed recommendations from Augment's report on ${report.file}`,
    source: report.file,
    link: `reports/augment/${report.file.replace(/\//g, '_')}.report.yaml`
  };
  
  // Save to memory system
  // ...
}
```

## CI/CD Integration

Reports are automatically validated in the CI/CD pipeline using the GitHub workflow defined in `.github/workflows/validate-reports.yml`. This ensures that all reports follow the correct structure and can be processed by Cline and Roo.
