import { validate } from '../validation/ValidatorEngine';

const validateSchema = (type: string, data: any) => {
  const result = validate(type, data);
  if (!result.valid) {
    console.error(`❌ Validation failed:\n`, result.errors);
    process.exit(1);
  }
  console.log('✅ Validation successful');
};

export default validateSchema;
