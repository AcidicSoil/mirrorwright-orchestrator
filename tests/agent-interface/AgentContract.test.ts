import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseAgentContract } from '../../src/agent-interface';
import { ValidatorEngine } from '../../src/validation/ValidatorEngine';

// Mock implementation of ValidatorEngine for testing
class MockValidatorEngine {
  validate = vi.fn().mockImplementation(async (data: any, schemaType: string) => {
    return {
      isValid: true,
      errors: [],
      data,
      schemaType,
      timestamp: Date.now()
    };
  });
}

describe('AgentContract', () => {
  let mockValidator: MockValidatorEngine;
  let contract: BaseAgentContract;
  
  beforeEach(() => {
    // Create fresh instances for each test
    mockValidator = new MockValidatorEngine();
    contract = new BaseAgentContract(mockValidator as unknown as ValidatorEngine);
  });
  
  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });
  
  it('should validate request payloads', async () => {
    // Validate a request
    const result = await contract.validateRequest({ test: 'data' });
    
    // Check that the validator was called
    expect(mockValidator.validate).toHaveBeenCalledTimes(1);
    expect(mockValidator.validate).toHaveBeenCalledWith({ test: 'data' }, 'message');
    
    // Check the result
    expect(result).toEqual({
      isValid: true,
      payload: { test: 'data' }
    });
  });
  
  it('should validate response payloads', async () => {
    // Validate a response
    const result = await contract.validateResponse({ test: 'data' });
    
    // Check that the validator was called
    expect(mockValidator.validate).toHaveBeenCalledTimes(1);
    expect(mockValidator.validate).toHaveBeenCalledWith({ test: 'data' }, 'message');
    
    // Check the result
    expect(result).toEqual({
      isValid: true,
      payload: { test: 'data' }
    });
  });
  
  it('should handle validation errors', async () => {
    // Mock validation failure
    mockValidator.validate.mockResolvedValueOnce({
      isValid: false,
      errors: [{ message: 'Validation error' }],
      data: { test: 'data' },
      schemaType: 'message',
      timestamp: Date.now()
    });
    
    // Validate a request
    const result = await contract.validateRequest({ test: 'data' });
    
    // Check the result
    expect(result).toEqual({
      isValid: false,
      errors: [{ message: 'Validation error' }],
      payload: { test: 'data' }
    });
  });
  
  it('should transform input and output', () => {
    // Transform input
    const transformedInput = contract.transformInput('Test input');
    expect(transformedInput).toBe('Test input');
    
    // Transform output
    const transformedOutput = contract.transformOutput('Test output');
    expect(transformedOutput).toBe('Test output');
  });
});
