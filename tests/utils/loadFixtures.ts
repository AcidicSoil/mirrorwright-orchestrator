import { readdirSync, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { SchemaType } from '../../tools/validateProtocol';

/**
 * Load test fixtures for validation tests
 *
 * @param type Type of schema (protocol, mode, ritual)
 * @param validity Whether to load valid or invalid fixtures
 * @returns Array of file paths to fixtures
 */
export function loadFixtures(type: SchemaType, validity: 'valid' | 'invalid'): string[] {
  // Ensure we're not trying to load 'all' type fixtures
  if (type === 'all') {
    throw new Error("Cannot load fixtures for type 'all'. Please specify a specific type.");
  }

  // Resolve the fixtures directory
  const fixturesDir = resolve(process.cwd(), 'tests', 'fixtures', validity, type === 'protocol' ? 'protocols' : `${type}s`);

  // Check if directory exists
  if (!existsSync(fixturesDir)) {
    console.warn(`Fixtures directory not found: ${fixturesDir}`);
    return [];
  }

  try {
    // Get all files in the directory
    const files = readdirSync(fixturesDir)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json'))
      .map(file => join(fixturesDir, file));

    // Check for subdirectories
    const subdirs = readdirSync(fixturesDir)
      .filter(item => {
        const itemPath = join(fixturesDir, item);
        return statSync(itemPath).isDirectory();
      });

    // Add files from subdirectories
    for (const subdir of subdirs) {
      const subdirPath = join(fixturesDir, subdir);
      const subdirFiles = readdirSync(subdirPath)
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json'))
        .map(file => join(subdirPath, file));

      files.push(...subdirFiles);
    }

    return files;
  } catch (error) {
    console.error(`Error loading fixtures: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}
