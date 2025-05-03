#!/usr/bin/env node

import { SchemaValidator, SchemaType, schemaValidator } from '../src/utils/validateSchema';
import { resolve, join, extname } from 'path';
import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import chalk from 'chalk';

// Define command line options
interface CommandLineOptions {
  schemaType: SchemaType;
  filePath: string | null;
  recursive: boolean;
  verbose: boolean;
  help: boolean;
}

// Parse command line arguments
function parseArgs(): CommandLineOptions {
  const args = process.argv.slice(2);
  const options: CommandLineOptions = {
    schemaType: 'all',
    filePath: null,
    recursive: false,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--type' || arg === '-t') {
      const value = args[++i];
      if (value && ['mode', 'ritual', 'protocol', 'all'].includes(value)) {
        options.schemaType = value as SchemaType;
      } else {
        console.error(chalk.red(`Invalid schema type: ${value}`));
        options.help = true;
      }
    } else if (arg === '--recursive' || arg === '-r') {
      options.recursive = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (!arg.startsWith('-')) {
      options.filePath = arg;
    }
  }

  return options;
}

// Show help message
function showHelp(): void {
  console.log(`
${chalk.bold('Protocol Validator')}

Validates protocol, mode, and ritual files against their respective schemas.

${chalk.bold('Usage:')}
  npx ts-node tools/validateProtocol.ts [options] [file|directory]

${chalk.bold('Options:')}
  --type, -t <type>     Schema type to validate against (mode, ritual, protocol, all)
  --recursive, -r       Recursively validate files in directories
  --verbose, -v         Show detailed validation information
  --help, -h            Show this help message

${chalk.bold('Examples:')}
  npx ts-node tools/validateProtocol.ts --type ritual protocols/default/rituals/init.yaml
  npx ts-node tools/validateProtocol.ts --type all --recursive protocols/
  `);
}

// Validate a single file
async function validateFile(filePath: string, schemaType: SchemaType, verbose: boolean): Promise<boolean> {
  try {
    console.log(chalk.blue(`Validating ${filePath} against ${schemaType} schema...`));
    
    // Determine file type and load content
    const ext = extname(filePath).toLowerCase();
    let data;
    
    if (ext === '.yaml' || ext === '.yml') {
      // Parse YAML file
      const fileContent = readFileSync(filePath, 'utf-8');
      data = yaml.load(fileContent);
    } else if (ext === '.json') {
      // Parse JSON file
      data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } else {
      console.warn(chalk.yellow(`Skipping unsupported file type: ${filePath}`));
      return false;
    }
    
    if (schemaType === 'all') {
      // Try all schema types
      let validated = false;
      
      for (const type of ['mode', 'ritual', 'protocol'] as const) {
        try {
          schemaValidator.validate(data, type);
          console.log(chalk.green(`✅ ${filePath} is valid against ${type} schema`));
          validated = true;
          break;
        } catch (error) {
          if (verbose) {
            console.log(chalk.yellow(`Not valid as ${type}: ${error.message}`));
          }
        }
      }
      
      if (!validated) {
        console.error(chalk.red(`❌ ${filePath} is not valid against any schema`));
        return false;
      }
    } else {
      // Validate against specific schema type
      try {
        schemaValidator.validate(data, schemaType);
        console.log(chalk.green(`✅ ${filePath} is valid against ${schemaType} schema`));
      } catch (error) {
        console.error(chalk.red(`❌ ${filePath} validation failed: ${error.message}`));
        if (verbose && error.details) {
          console.error(chalk.red('Validation errors:'));
          console.error(error.details);
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red(`Error processing ${filePath}: ${error.message}`));
    return false;
  }
}

// Validate all files in a directory
async function validateDirectory(
  dirPath: string, 
  schemaType: SchemaType, 
  recursive: boolean,
  verbose: boolean
): Promise<{ total: number; valid: number; invalid: number }> {
  const stats = { total: 0, valid: 0, invalid: 0 };
  
  try {
    const files = readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = join(dirPath, file);
      const fileStat = statSync(fullPath);
      
      if (fileStat.isDirectory() && recursive) {
        // Recursively validate subdirectory
        const subStats = await validateDirectory(fullPath, schemaType, recursive, verbose);
        stats.total += subStats.total;
        stats.valid += subStats.valid;
        stats.invalid += subStats.invalid;
      } else if (fileStat.isFile()) {
        // Only process YAML and JSON files
        const ext = extname(file).toLowerCase();
        if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
          stats.total++;
          const isValid = await validateFile(fullPath, schemaType, verbose);
          if (isValid) {
            stats.valid++;
          } else {
            stats.invalid++;
          }
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error reading directory ${dirPath}: ${error.message}`));
  }
  
  return stats;
}

// Main function
async function main(): Promise<void> {
  const options = parseArgs();
  
  if (options.help || !options.filePath) {
    showHelp();
    process.exit(options.help ? 0 : 1);
  }
  
  const fullPath = resolve(process.cwd(), options.filePath);
  
  if (!existsSync(fullPath)) {
    console.error(chalk.red(`File or directory not found: ${fullPath}`));
    process.exit(1);
  }
  
  const stats = statSync(fullPath);
  let validationStats = { total: 0, valid: 0, invalid: 0 };
  
  console.log(chalk.blue(`Starting validation with schema type: ${options.schemaType}`));
  
  if (stats.isDirectory()) {
    // Validate all files in directory
    console.log(chalk.blue(`Validating directory: ${fullPath}${options.recursive ? ' (recursive)' : ''}`));
    validationStats = await validateDirectory(fullPath, options.schemaType, options.recursive, options.verbose);
  } else {
    // Validate single file
    validationStats.total = 1;
    const isValid = await validateFile(fullPath, options.schemaType, options.verbose);
    if (isValid) {
      validationStats.valid = 1;
    } else {
      validationStats.invalid = 1;
    }
  }
  
  // Print summary
  console.log(chalk.blue('\nValidation Summary:'));
  console.log(`Total files: ${validationStats.total}`);
  console.log(chalk.green(`Valid: ${validationStats.valid}`));
  
  if (validationStats.invalid > 0) {
    console.log(chalk.red(`Invalid: ${validationStats.invalid}`));
    process.exit(1);
  } else {
    console.log(chalk.green('All files are valid!'));
  }
  
  // Print cache stats if verbose
  if (options.verbose) {
    const cacheStats = schemaValidator.getCacheStats();
    console.log(chalk.blue('\nCache Stats:'));
    console.log(`Size: ${cacheStats.size}/${cacheStats.maxSize}`);
    console.log(`Enabled: ${cacheStats.enabled}`);
  }
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1);
});
