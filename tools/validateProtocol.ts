import { readFileSync } from 'fs';
import { basename } from 'path';
import yaml from 'yaml';
import { validatorEngine, SchemaType, ValidationResult } from '../src/validation/ValidatorEngine';

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

    // Use the ValidatorEngine to validate the data
    return validatorEngine.validate(data, schemaType);
  } catch (error) {
    // Catch any unexpected errors
    return {
      isValid: false,
      errors: [`Unexpected error: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
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

// Note: We're now using the determineSchemaTypeFromContent method from ValidatorEngine

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
