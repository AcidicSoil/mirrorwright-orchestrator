import Ajv from 'ajv';
import { JSONSchemaType } from 'ajv';
import { getAllSchemas } from '../../src/schema/SchemaRegistry';

const ajv = new Ajv({ allErrors: true, strict: false });

const schemas = getAllSchemas();

Object.keys(schemas).forEach((schemaId) => {
  ajv.addSchema(schemas[schemaId], schemaId);
});

type ValidationResult = {
  valid: boolean;
  errors?: any[];
};

const validate = async (type: string, data: any): Promise<ValidationResult> => {
  const validateFunc = ajv.getSchema(type);
  if (!validateFunc) {
    return { valid: false, errors: [`No validator found for type '${type}'`] };
  }
  try {
    const result = await validateFunc(data);
    return { valid: result, errors: validateFunc.errors || [] };
  } catch (error) {
    console.error('Validation error:', error);
    return { valid: false, errors: [error instanceof Error ? error.message : 'Unknown validation error'] };
  }
};

export { validate };
