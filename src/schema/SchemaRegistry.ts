import fs from 'fs';
import path from 'path';

const schemaDirectory = path.join(__dirname, 'schemas');

export const getAllSchemas = (): Record<string, any> => {
  const schemas: Record<string, any> = {};
  fs.readdirSync(schemaDirectory).forEach((file) => {
    if (file.endsWith('.json')) {
      const id = file.slice(0, -5);
      const filePath = path.join(schemaDirectory, file);
      try {
        const schemaContent = fs.readFileSync(filePath, 'utf8');
        schemas[id] = JSON.parse(schemaContent);
      } catch (error) {
        console.error(`Error loading schema ${id}:`, error);
      }
    }
  });
  return schemas;
};
