import { expect } from 'chai';
import { loadFixtures } from '../utils/loadFixtures';
import { validate } from '../../tools/validateProtocol';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

describe('Mode Validation', () => {
  it('should validate valid modes', async () => {
    const fixtures = loadFixtures('mode', 'valid');
    expect(fixtures.length).to.be.greaterThan(0, 'No valid mode fixtures found');

    for (const fixture of fixtures) {
      const result = await validate(fixture, 'mode');
      expect(result.isValid, `Validation failed for ${fixture}: ${result.errors.join(', ')}`).to.be.true;
      expect(result.errors).to.be.empty;
    }
  });

  it('should validate invalid modes', async () => {
    const fixtures = loadFixtures('mode', 'invalid');
    expect(fixtures.length).to.be.greaterThan(0, 'No invalid mode fixtures found');

    for (const fixture of fixtures) {
      const result = await validate(fixture, 'mode');
      expect(result.isValid, `Validation incorrectly passed for ${fixture}`).to.be.false;
      expect(result.errors).to.not.be.empty;
    }
  });

  it('should handle corrupted YAML', async () => {
    // Create a temporary file with corrupted YAML
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'corrupted-mode.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write corrupted YAML
    writeFileSync(tempFilePath, `
      id: "corrupted-mode"
      name: "Corrupted Mode"
      description: "This YAML is corrupted
      entryRitual: "missing-quote
    `);

    const result = await validate(tempFilePath, 'mode');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('Failed to parse YAML');
  });

  it('should handle missing required fields', async () => {
    // Create a temporary file with missing required fields
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'missing-fields-mode.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write YAML with missing required fields
    writeFileSync(tempFilePath, `
      # Missing id and entryRitual fields
      name: "Missing Fields Mode"
      description: "This mode is missing required fields"
    `);

    const result = await validate(tempFilePath, 'mode');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('validation failed');
  });

  it('should handle unknown additional properties', async () => {
    // Create a temporary file with unknown properties
    const tempFilePath = join(process.cwd(), 'tests', 'fixtures', 'temp', 'unknown-props-mode.yaml');

    // Ensure directory exists
    mkdirSync(dirname(tempFilePath), { recursive: true });

    // Write YAML with unknown properties
    writeFileSync(tempFilePath, `
      id: "unknown-props-mode"
      name: "Unknown Properties Mode"
      entryRitual: "test-ritual"
      unknownProperty: "This property is not in the schema"
      anotherUnknownProperty: 123
    `);

    const result = await validate(tempFilePath, 'mode');
    expect(result.isValid).to.be.false;
    expect(result.errors[0]).to.include('validation failed');
  });
});
