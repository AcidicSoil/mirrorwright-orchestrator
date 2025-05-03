import { expect } from 'chai';
import { loadFixtures } from '../utils/loadFixtures';
import { validate } from '../../tools/validateProtocol';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

describe('Ritual Validation', () => {
  it('should validate valid rituals', async () => {
    const fixtures = loadFixtures('ritual', 'valid');
    expect(fixtures.length).to.be.greaterThan(0, 'No valid ritual fixtures found');

    for (const fixture of fixtures) {
      const result = await validate(fixture, 'ritual');
      expect(result.isValid, `Validation failed for ${fixture}: ${result.errors.join(', ')}`).to.be.true;
      expect(result.errors).to.be.empty;
    }
  });

  it('should validate invalid rituals', async () => {
    const fixtures = loadFixtures('ritual', 'invalid');
    expect(fixtures.length).to.be.greaterThan(0, 'No invalid ritual fixtures found');

    for (const fixture of fixtures) {
      const result = await validate(fixture, 'ritual');
      expect(result.isValid, `Validation incorrectly passed for ${fixture}`).to.be.false;
      expect(result.errors).to.not.be.empty;
    }
  });

  it('should handle corrupted YAML', async () => {
    // Create a temporary file with corrupted YAML
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'corrupted-ritual.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write corrupted YAML
    writeFileSync(tempFilePath, `
      id: "corrupted-ritual"
      description: "This YAML is corrupted
      steps:
        - type: "prompt
          content: "Missing quote
    `);

    const result = await validate(tempFilePath, 'ritual');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('Failed to parse YAML');
  });

  it('should handle missing required fields', async () => {
    // Create a temporary file with missing required fields
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'missing-fields-ritual.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write YAML with missing required fields
    writeFileSync(tempFilePath, `
      # Missing id field
      description: "This ritual is missing required fields"
      # Missing steps array
    `);

    const result = await validate(tempFilePath, 'ritual');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('validation failed');
  });

  it('should handle unknown additional properties', async () => {
    // Create a temporary file with unknown properties
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'unknown-props-ritual.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write YAML with unknown properties
    writeFileSync(tempFilePath, `
      id: "unknown-props-ritual"
      description: "This ritual has unknown properties"
      steps:
        - type: "prompt"
          content: "Valid step"
      unknownProperty: "This property is not in the schema"
      anotherUnknownProperty: 123
    `);

    const result = await validate(tempFilePath, 'ritual');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('validation failed');
  });

  it('should handle invalid step types', async () => {
    // Create a temporary file with invalid step type
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'invalid-step-type-ritual.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write YAML with invalid step type
    writeFileSync(tempFilePath, `
      id: "invalid-step-type-ritual"
      description: "This ritual has an invalid step type"
      steps:
        - type: "invalid-type"
          content: "This step has an invalid type"
    `);

    const result = await validate(tempFilePath, 'ritual');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('validation failed');
  });
});
