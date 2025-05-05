/**
 * Test suite for report validation
 */

const { validateReport, validateReports } = require('../tools/validate-reports');
const path = require('path');
const assert = require('assert');

describe('Report Validation', () => {
  describe('Valid Reports', () => {
    it('should validate a valid report', () => {
      const reportPath = path.resolve(__dirname, 'fixtures/report/valid/agent-refinement-cycle.report.yaml');
      const result = validateReport(reportPath);
      
      assert.strictEqual(result.valid, true, 'Report should be valid');
      assert.strictEqual(result.errors, null, 'There should be no errors');
    });
    
    it('should validate all valid reports', () => {
      const pattern = path.resolve(__dirname, 'fixtures/report/valid/*.report.yaml');
      const success = validateReports(pattern, true);
      
      assert.strictEqual(success, true, 'All valid reports should pass validation');
    });
  });
  
  describe('Invalid Reports', () => {
    it('should fail on missing required fields', () => {
      const reportPath = path.resolve(__dirname, 'fixtures/report/invalid/missing-fields.report.yaml');
      const result = validateReport(reportPath);
      
      assert.strictEqual(result.valid, false, 'Report should be invalid');
      assert.notStrictEqual(result.errors, null, 'There should be errors');
      
      // Check for specific error about missing required fields
      const missingFieldsError = result.errors.find(error => 
        error.keyword === 'required' && 
        (error.params.missingProperty === 'findings' || error.params.missingProperty === 'recommendations')
      );
      
      assert.notStrictEqual(missingFieldsError, undefined, 'Should have error about missing required fields');
    });
    
    it('should fail on incorrect field type', () => {
      const reportPath = path.resolve(__dirname, 'fixtures/report/invalid/bad-type.report.yaml');
      const result = validateReport(reportPath);
      
      assert.strictEqual(result.valid, false, 'Report should be invalid');
      assert.notStrictEqual(result.errors, null, 'There should be errors');
      
      // Check for specific error about incorrect type
      const typeError = result.errors.find(error => 
        error.keyword === 'type' && 
        error.instancePath === '/findings'
      );
      
      assert.notStrictEqual(typeError, undefined, 'Should have error about incorrect type');
    });
    
    it('should fail on malformed structure', () => {
      const reportPath = path.resolve(__dirname, 'fixtures/report/invalid/malformed-structure.report.yaml');
      const result = validateReport(reportPath);
      
      assert.strictEqual(result.valid, false, 'Report should be invalid');
      assert.notStrictEqual(result.errors, null, 'There should be errors');
      
      // Check for specific error about missing required field in findings
      const structureError = result.errors.find(error => 
        error.keyword === 'required' && 
        error.instancePath.startsWith('/findings/')
      );
      
      assert.notStrictEqual(structureError, undefined, 'Should have error about malformed structure');
    });
    
    it('should validate all invalid reports as invalid', () => {
      const pattern = path.resolve(__dirname, 'fixtures/report/invalid/*.report.yaml');
      const success = validateReports(pattern, false);
      
      assert.strictEqual(success, true, 'All invalid reports should fail validation');
    });
  });
});
