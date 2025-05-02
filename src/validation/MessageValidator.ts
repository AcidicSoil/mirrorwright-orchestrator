import Ajv, { ValidateFunction } from 'ajv';
import { Message } from '../orchestrator/runtime';
import { Logger } from '../utils/Logger';
import messageSchema from '../schemas/message.schema.json';

/**
 * Validator for message objects
 */
export class MessageValidator {
  private validator: ValidateFunction;
  private logger: Logger;

  /**
   * Create a new message validator
   */
  constructor() {
    const ajv = new Ajv({ allErrors: true });
    this.validator = ajv.compile(messageSchema);
    this.logger = new Logger();
  }

  /**
   * Validate a message against the schema
   * @param message The message to validate
   * @returns True if the message is valid, false otherwise
   */
  public validate(message: unknown): message is Message {
    const valid = this.validator(message);
    
    if (!valid && this.validator.errors) {
      this.logger.error(`Message validation failed: ${JSON.stringify(this.validator.errors)}`);
    }
    
    return !!valid;
  }

  /**
   * Validate a message and throw an error if it's invalid
   * @param message The message to validate
   * @throws Error if the message is invalid
   */
  public validateWithThrow(message: unknown): asserts message is Message {
    const valid = this.validator(message);
    
    if (!valid && this.validator.errors) {
      const errorMessage = `Message validation failed: ${JSON.stringify(this.validator.errors)}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
