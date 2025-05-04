import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/Logger';

// Point to the correct schema directory
const schemaDirectory = path.join(__dirname, '../schemas');
const logger = new Logger();

/**
 * Get a specific schema by ID
 * @param id Schema ID (without .json extension)
 * @returns The schema object or undefined if not found
 */
export const getSchema = (id: string): Record<string, any> | undefined => {
  try {
    // Handle special cases for file naming
    let fileName = `${id}.json`;
    if (id === 'mode') {
      fileName = 'mode.schema.json';
    } else if (id === 'ritual') {
      fileName = 'ritual.schema.json';
    } else if (id === 'protocol') {
      fileName = 'protocol.json';
    }

    const filePath = path.join(schemaDirectory, fileName);
    const schemaContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(schemaContent);
  } catch (error) {
    logger.error(`Error loading schema ${id}: ${error}`);
    return undefined;
  }
};

/**
 * Get all schemas from the schema directory
 * @returns Record of schema ID to schema object
 */
export const getAllSchemas = (): Record<string, any> => {
  const schemas: Record<string, any> = {};
  try {
    fs.readdirSync(schemaDirectory).forEach((file) => {
      if (file.endsWith('.json')) {
        // Extract ID from filename (handle special cases)
        let id: string;
        if (file === 'mode.schema.json') {
          id = 'mode';
        } else if (file === 'ritual.schema.json') {
          id = 'ritual';
        } else if (file === 'protocol.json') {
          id = 'protocol';
        } else {
          id = file.slice(0, -5);
        }

        const filePath = path.join(schemaDirectory, file);
        try {
          const schemaContent = fs.readFileSync(filePath, 'utf8');
          schemas[id] = JSON.parse(schemaContent);
        } catch (error) {
          logger.error(`Error loading schema ${id}: ${error}`);
        }
      }
    });
  } catch (error) {
    logger.error(`Error reading schema directory: ${error}`);
  }
  return schemas;
};
