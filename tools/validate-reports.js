/**
 * Report Validation Tool
 *
 * This script validates Augment output reports against the report schema.
 * It can be used in CI/CD pipelines to ensure reports are properly formatted.
 */

const Ajv = require('ajv');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob.glob || glob);

/**
 * Validate a report against the schema
 * @param {string} reportPath - Path to the report file
 * @returns {object} Validation result
 */
function validateReport(reportPath) {
  try {
    // Load schema
    const schemaPath = path.resolve(__dirname, '../src/schemas/report.schema.yaml');
    const schema = yaml.load(fs.readFileSync(schemaPath, 'utf-8'));

    // Create validator
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    // Load report
    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    const report = yaml.load(reportContent, { schema: yaml.JSON_SCHEMA });

    // Ensure all string values are properly handled
    const processedReport = JSON.parse(JSON.stringify(report));

    // Validate
    const valid = validate(processedReport);

    return {
      valid,
      errors: validate.errors,
      report,
      path: reportPath
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error.message }],
      path: reportPath
    };
  }
}

/**
 * Validate all reports in a directory
 * @param {string} pattern - Glob pattern for report files
 * @param {boolean} expectValid - Whether reports should be valid
 * @returns {Promise<boolean>} Whether all validations passed
 */
async function validateReports(pattern, expectValid = true) {
  try {
    const files = await globPromise(pattern);

    console.log(`Validating ${files.length} reports (expectValid=${expectValid})...`);

    let passCount = 0;
    let failCount = 0;

    for (const file of files) {
      const result = validateReport(file);
      const relativePath = path.relative(process.cwd(), file);

      if (result.valid === expectValid) {
        console.log(`✅ ${relativePath}`);
        passCount++;
      } else {
        console.error(`❌ ${relativePath}`);
        if (result.errors) {
          result.errors.forEach(error => {
            console.error(`   - ${error.instancePath || '/'}: ${error.message}`);
          });
        }
        failCount++;
      }
    }

    console.log(`\nResults: ${passCount} passed, ${failCount} failed`);

    return failCount === 0;
  } catch (error) {
    console.error(`Error validating reports: ${error.message}`);
    return false;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    try {
      if (command === 'valid') {
        // Validate files that should be valid
        const pattern = args[1] || 'reports/augment/**/*.report.yaml';
        const success = await validateReports(pattern, true);
        process.exit(success ? 0 : 1);
      } else if (command === 'invalid') {
        // Validate files that should be invalid
        const pattern = args[1] || 'tests/fixtures/report/invalid/*.report.yaml';
        const success = await validateReports(pattern, false);
        process.exit(success ? 0 : 1);
      } else if (command === 'test') {
        // Run tests on fixtures
        const validSuccess = await validateReports('tests/fixtures/report/valid/*.report.yaml', true);
        const invalidSuccess = await validateReports('tests/fixtures/report/invalid/*.report.yaml', false);
        process.exit(validSuccess && invalidSuccess ? 0 : 1);
      } else {
        console.error('Usage: node validate-reports.js [valid|invalid|test] [pattern]');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = {
  validateReport,
  validateReports
};
