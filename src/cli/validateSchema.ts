#!/usr/bin/env node

import { SchemaValidator, SchemaType } from '../utils/validateSchema';
import { resolve } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { Logger } from '../utils/Logger';

const logger = new Logger();

// Parse command line arguments
const args = process.argv.slice(2);
let schemaType: SchemaType = 'all';
let filePath: string | null = null;
let recursive = false;

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--type' || arg === '-t') {
    const typeArg = args[++i];
    if (['mode', 'ritual', 'protocol', 'all'].includes(typeArg)) {
      schemaType = typeArg as SchemaType;
    } else {
      logger.error(`Invalid schema type: ${typeArg}`);
      process.exit(1);
    }
  } else if (arg === '--file' || arg === '-f') {
    filePath = args[++i];
  } else if (arg === '--recursive' || arg === '-r') {
    recursive = true;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (!filePath) {
    // Assume it's a file path if not recognized and no file path set yet
    filePath = arg;
  }
}

// Print help if no arguments provided
if (args.length === 0) {
  printHelp();
  process.exit(0);
}

// Create validator
const validator = new SchemaValidator({
  cacheEnabled: true,
  logPerformance: true
});

// Validate file or directory
async function main() {
  try {
    if (!filePath) {
      logger.error('No file or directory specified');
      process.exit(1);
    }
    
    const fullPath = resolve(process.cwd(), filePath);
    
    if (!existsSync(fullPath)) {
      logger.error(`File or directory not found: ${fullPath}`);
      process.exit(1);
    }
    
    const stats = statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Validate all files in directory
      await validateDirectory(fullPath, schemaType, recursive);
    } else {
      // Validate single file
      await validateFile(fullPath, schemaType);
    }
    
    // Print cache stats
    const cacheStats = validator.getCacheStats();
    logger.info(`Cache stats: ${JSON.stringify(cacheStats, null, 2)}`);
    
  } catch (error) {
    logger.error(`Validation failed: ${error}`);
    process.exit(1);
  }
}

// Validate a single file
async function validateFile(filePath: string, schemaType: SchemaType): Promise<void> {
  try {
    logger.info(`Validating ${filePath} against ${schemaType} schema...`);
    
    if (schemaType === 'all') {
      // Try all schema types
      let validated = false;
      
      for (const type of ['mode', 'ritual', 'protocol'] as const) {
        try {
          validator.validateFile(filePath, type);
          logger.info(`✅ ${filePath} is valid against ${type} schema`);
          validated = true;
          break;
        } catch (error) {
          // Continue to next schema type
        }
      }
      
      if (!validated) {
        logger.error(`❌ ${filePath} is not valid against any schema`);
      }
    } else {
      // Validate against specific schema type
      validator.validateFile(filePath, schemaType);
      logger.info(`✅ ${filePath} is valid against ${schemaType} schema`);
    }
  } catch (error) {
    logger.error(`❌ ${filePath} validation failed: ${error}`);
  }
}

// Validate all files in a directory
async function validateDirectory(dirPath: string, schemaType: SchemaType, recursive: boolean): Promise<void> {
  logger.info(`Validating files in ${dirPath}...`);
  
  const files = readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = resolve(dirPath, file);
    const stats = statSync(fullPath);
    
    if (stats.isDirectory() && recursive) {
      // Recursively validate subdirectories
      await validateDirectory(fullPath, schemaType, recursive);
    } else if (stats.isFile() && file.endsWith('.json')) {
      // Validate JSON files
      await validateFile(fullPath, schemaType);
    }
  }
}

// Print help message
function printHelp() {
  console.log(`
Schema Validator CLI

Usage:
  ts-node src/cli/validateSchema.ts [options] [file|directory]

Options:
  --type, -t <type>     Schema type to validate against (mode, ritual, protocol, all)
  --file, -f <path>     File or directory to validate
  --recursive, -r       Recursively validate files in directories
  --help, -h            Show this help message

Examples:
  ts-node src/cli/validateSchema.ts --type ritual protocols/default/rituals/init.json
  ts-node src/cli/validateSchema.ts --type all --recursive protocols/
  `);
}

// Run the main function
main().catch(error => {
  logger.error(`Unhandled error: ${error}`);
  process.exit(1);
});
