import { readFileSync } from 'fs';
import { basename, join } from 'path';
import yaml from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Load schemas directly from files
const protocolSchema = JSON.parse(readFileSync(join(__dirname, '../src/schemas/protocol.json'), 'utf-8'));
const modeSchema = JSON.parse(readFileSync(join(__dirname, '../src/schemas/mode.schema.json'), 'utf-8'));
const ritualSchema = JSON.parse(readFileSync(join(__dirname, '../src/schemas/ritual.schema.json'), 'utf-8'));

export type SchemaType = 'protocol' | 'mode' | 'ritual' | 'all';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Create and configure Ajv instance
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strictSchema: false,
  strictTypes: false,
  schemas: [
    {
      $id: "https://json-schema.org/draft-07/schema#",
      $schema: "https://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      type: ["object", "boolean"]
    }
  ]
});

// Add formats
addFormats(ajv);

// Add schemas with explicit IDs
const protocolSchemaWithId = { ...protocolSchema, $id: 'protocol' };
const modeSchemaWithId = { ...modeSchema, $id: 'mode' };
const ritualSchemaWithId = { ...ritualSchema, $id: 'ritual' };

// Add schemas
ajv.addSchema(protocolSchemaWithId, 'protocol');
ajv.addSchema(modeSchemaWithId, 'mode');
ajv.addSchema(ritualSchemaWithId, 'ritual');

// Compile validators
const validators = {
  protocol: ajv.compile(protocolSchemaWithId),
  mode: ajv.compile(modeSchemaWithId),
  ritual: ajv.compile(ritualSchemaWithId)
};

/**
 * Validates a YAML file against a schema
 *
 * @param filePath Path to the YAML file to validate
 * @param schemaType Type of schema to validate against (protocol, mode, ritual, or all)
 * @returns Validation result with isValid flag and any errors
 */
export async function validate(filePath: string, schemaType?: SchemaType): Promise<ValidationResult> {
  try {
    // Determine schema type from file path if not provided
    if (!schemaType) {
      schemaType = determineSchemaTypeFromPath(filePath);
    }

    // Read and parse the YAML file
    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to read file: ${error instanceof Error ? error.message : String(error)}`]
      };
    }

    // Parse YAML content
    let data: any;
    try {
      data = yaml.parse(content);

      // Check if the file is empty or not valid YAML
      if (!data) {
        return {
          isValid: false,
          errors: ['File is empty or contains invalid YAML']
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`]
      };
    }

    // Validate against schema
    try {
      if (schemaType === 'all') {
        // Try to determine the schema type from the content
        const detectedType = determineSchemaTypeFromContent(data);
        if (!detectedType) {
          return {
            isValid: false,
            errors: ['Could not determine schema type from content']
          };
        }
        schemaType = detectedType;
      }

      // Get the appropriate validator
      if (schemaType === 'all') {
        return {
          isValid: false,
          errors: ['Cannot validate against "all" schema type directly']
        };
      }

      const validator = validators[schemaType as keyof typeof validators];
      if (!validator) {
        return {
          isValid: false,
          errors: [`No validator found for schema type: ${schemaType}`]
        };
      }

      // Perform validation
      const valid = validator(data);

      if (!valid) {
        // Format validation errors
        const errors = formatValidationErrors(validator.errors || []);
        return {
          isValid: false,
          errors
        };
      }

      return {
        isValid: true,
        errors: []
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  } catch (error) {
    // Catch any unexpected errors
    return {
      isValid: false,
      errors: [`Unexpected error: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

/**
 * Format validation errors for better readability
 */
function formatValidationErrors(errors: any[]): string[] {
  if (!errors || errors.length === 0) {
    return ['Unknown validation error'];
  }

  return errors.map(error => {
    const path = error.instancePath || '';
    const message = error.message || 'Invalid value';
    const params = error.params ? ` (${JSON.stringify(error.params)})` : '';

    return `${path}: ${message}${params}`;
  });
}

/**
 * Attempts to determine the schema type from the file path
 */
function determineSchemaTypeFromPath(filePath: string): SchemaType {
  const fileName = basename(filePath).toLowerCase();

  if (fileName.includes('protocol')) {
    return 'protocol';
  } else if (fileName.includes('mode')) {
    return 'mode';
  } else if (fileName.includes('ritual')) {
    return 'ritual';
  }

  // Check parent directory
  const pathParts = filePath.toLowerCase().split('/');
  if (pathParts.includes('protocols')) {
    return 'protocol';
  } else if (pathParts.includes('modes')) {
    return 'mode';
  } else if (pathParts.includes('rituals')) {
    return 'ritual';
  }

  // Default to protocol if we can't determine
  return 'protocol';
}

/**
 * Attempts to determine the schema type from the content
 */
function determineSchemaTypeFromContent(data: any): SchemaType | null {
  // Protocol typically has modes and rituals
  if (data.modes && data.rituals) {
    return 'protocol';
  }

  // Mode typically has id, name, and entryRitual
  if (data.id && data.name && data.entryRitual) {
    return 'mode';
  }

  // Ritual typically has id and steps
  if (data.id && data.steps) {
    return 'ritual';
  }

  return null;
}

// CLI interface
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let filePath: string | undefined;
  let schemaType: SchemaType | undefined;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && i + 1 < args.length) {
      schemaType = args[i + 1] as SchemaType;
      i++; // Skip the next argument
    } else if (!filePath) {
      filePath = args[i];
    }
  }

  if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
  }

  const result = await validate(filePath, schemaType);
  console.log({
    isValid: result.isValid,
    errors: result.errors
  });

  if (!result.isValid) {
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
