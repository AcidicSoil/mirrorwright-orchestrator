import { Logger } from '../utils/Logger';
import { ValidatorEngine } from '../validation/ValidatorEngine';

/**
 * Interface representing a validated message
 */
export interface ValidatedMessage {
  /** Whether the message is valid */
  isValid: boolean;
  
  /** Validation errors, if any */
  errors?: any[];
  
  /** The validated message payload */
  payload: any;
}

/**
 * Interface for agent contracts
 * Contracts validate and transform messages between agents
 */
export interface AgentContract {
  /**
   * Validate a request payload
   * @param payload The payload to validate
   * @returns The validated message
   */
  validateRequest(payload: any): Promise<ValidatedMessage>;
  
  /**
   * Validate a response payload
   * @param payload The payload to validate
   * @returns The validated message
   */
  validateResponse(payload: any): Promise<ValidatedMessage>;
  
  /**
   * Transform input before sending to an agent
   * @param input The input to transform
   * @returns The transformed input
   */
  transformInput(input: any): any;
  
  /**
   * Transform output from an agent
   * @param output The output to transform
   * @returns The transformed output
   */
  transformOutput(output: any): any;
}

/**
 * Base implementation of the AgentContract interface
 */
export class BaseAgentContract implements AgentContract {
  protected logger: Logger;
  protected validator?: ValidatorEngine;
  
  /**
   * Create a new base agent contract
   * @param validator Optional validator engine for message validation
   */
  constructor(validator?: ValidatorEngine) {
    this.logger = new Logger();
    this.validator = validator;
  }
  
  /**
   * Validate a request payload
   * @param payload The payload to validate
   * @returns The validated message
   */
  async validateRequest(payload: any): Promise<ValidatedMessage> {
    this.logger.info('Validating request payload');
    
    if (!this.validator) {
      return { isValid: true, payload };
    }
    
    try {
      // Assuming the validator has a method to validate messages
      const result = await this.validator.validate(payload, 'message');
      
      return {
        isValid: result.isValid,
        errors: result.errors,
        payload
      };
    } catch (error) {
      this.logger.error(`Error validating request: ${error}`);
      return {
        isValid: false,
        errors: [{ message: `Validation error: ${error}` }],
        payload
      };
    }
  }
  
  /**
   * Validate a response payload
   * @param payload The payload to validate
   * @returns The validated message
   */
  async validateResponse(payload: any): Promise<ValidatedMessage> {
    this.logger.info('Validating response payload');
    
    if (!this.validator) {
      return { isValid: true, payload };
    }
    
    try {
      // Assuming the validator has a method to validate messages
      const result = await this.validator.validate(payload, 'message');
      
      return {
        isValid: result.isValid,
        errors: result.errors,
        payload
      };
    } catch (error) {
      this.logger.error(`Error validating response: ${error}`);
      return {
        isValid: false,
        errors: [{ message: `Validation error: ${error}` }],
        payload
      };
    }
  }
  
  /**
   * Transform input before sending to an agent
   * @param input The input to transform
   * @returns The transformed input
   */
  transformInput(input: any): any {
    // Base implementation just passes through
    return input;
  }
  
  /**
   * Transform output from an agent
   * @param output The output to transform
   * @returns The transformed output
   */
  transformOutput(output: any): any {
    // Base implementation just passes through
    return output;
  }
}
