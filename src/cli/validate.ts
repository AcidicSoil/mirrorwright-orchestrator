import { readFileSync } from 'fs';
import { basename } from 'path';
import yaml from 'yaml';
import { validatorEngine, SchemaType } from '../validation/ValidatorEngine';
import chalk from 'chalk';

/**
 * Determine schema type from file path
 * @param filePath Path to the file
 * @returns Schema type
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
 * Validate a YAML file against a schema
 * @param filePath Path to the file
 * @param schemaType Type of schema to validate against
 * @returns Validation result
 */
export async function validateFile(filePath: string, schemaType?: SchemaType): Promise<boolean> {
  try {
    // Determine schema type from file path if not provided
    if (!schemaType) {
      schemaType = determineSchemaTypeFromPath(filePath);
    }

    console.log(chalk.blue(`Validating ${filePath} as ${schemaType}...`));

    // Read and parse the YAML file
    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(chalk.red(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`));
      return false;
    }

    // Parse YAML content
    let data: any;
    try {
      data = yaml.parse(content);

      // Check if the file is empty or not valid YAML
      if (!data) {
        console.error(chalk.red('File is empty or contains invalid YAML'));
        return false;
      }
    } catch (error) {
      console.error(chalk.red(`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`));
      return false;
    }

    // Use the ValidatorEngine to validate the data
    const result = validatorEngine.validate(data, schemaType);

    if (result.isValid) {
      console.log(chalk.green(`✓ ${filePath} is valid`));
      return true;
    } else {
      console.error(chalk.red(`✗ ${filePath} is invalid:`));
      result.errors.forEach(error => {
        console.error(chalk.red(`  - ${error}`));
      });
      return false;
    }
  } catch (error) {
    console.error(chalk.red(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`));
    return false;
  }
}

/**
 * CLI command handler
 */
export async function validateCommand(args: string[]): Promise<void> {
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
    console.error(chalk.red('Please provide a file path'));
    process.exit(1);
  }

  const success = await validateFile(filePath, schemaType);
  if (!success) {
    process.exit(1);
  }
}

// Run the command if this file is executed directly
if (require.main === module) {
  validateCommand(process.argv.slice(2)).catch(error => {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  });
}
