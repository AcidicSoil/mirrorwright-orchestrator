import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseAgentWrapper, BaseAgentContract, AgentContext } from '../../src/agent-interface';
import { AgentAdapter, AgentInput, AgentOutput } from '../../src/types/agent';

// Mock implementation of an AgentAdapter for testing
class MockAgentAdapter implements AgentAdapter {
  initialize = vi.fn().mockResolvedValue(undefined);
  send = vi.fn().mockImplementation(async (input: AgentInput): Promise<AgentOutput> => {
    return {
      content: `Mock response for: ${input.prompt}`,
      metadata: {
        mockAgent: true
      }
    };
  });
  shutdown = vi.fn().mockResolvedValue(undefined);
}

// Mock implementation of an AgentContract for testing
class MockAgentContract extends BaseAgentContract {
  validateRequest = vi.fn().mockImplementation(async (payload: any) => {
    return { isValid: true, payload };
  });
  
  validateResponse = vi.fn().mockImplementation(async (payload: any) => {
    return { isValid: true, payload };
  });
  
  transformInput = vi.fn().mockImplementation((input: any) => {
    return `Transformed input: ${input}`;
  });
  
  transformOutput = vi.fn().mockImplementation((output: any) => {
    return output;
  });
}

describe('AgentWrapper', () => {
  let mockAdapter: MockAgentAdapter;
  let mockContract: MockAgentContract;
  let wrapper: BaseAgentWrapper;
  
  beforeEach(() => {
    // Create fresh instances for each test
    mockAdapter = new MockAgentAdapter();
    mockContract = new MockAgentContract();
    wrapper = new BaseAgentWrapper('test-agent', mockAdapter, mockContract);
  });
  
  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });
  
  it('should invoke the agent with transformed input', async () => {
    // Create a context
    const context: AgentContext = {
      sessionId: 'test-session',
      modeId: 'test-mode',
      ritualId: 'test-ritual',
      stepId: 'test-step'
    };
    
    // Invoke the agent
    const response = await wrapper.invoke('Test input', context);
    
    // Check that the contract methods were called
    expect(mockContract.validateRequest).toHaveBeenCalledTimes(1);
    expect(mockContract.transformInput).toHaveBeenCalledTimes(1);
    expect(mockContract.validateResponse).toHaveBeenCalledTimes(1);
    expect(mockContract.transformOutput).toHaveBeenCalledTimes(1);
    
    // Check that the adapter was called with the transformed input
    expect(mockAdapter.send).toHaveBeenCalledTimes(1);
    expect(mockAdapter.send).toHaveBeenCalledWith(expect.objectContaining({
      prompt: expect.stringContaining('Transformed input'),
      metadata: expect.objectContaining({
        sessionId: 'test-session',
        modeId: 'test-mode',
        ritualId: 'test-ritual',
        stepId: 'test-step'
      })
    }));
    
    // Check the response
    expect(response).toEqual({
      content: expect.stringContaining('Mock response'),
      metadata: expect.objectContaining({
        mockAgent: true
      })
    });
  });
  
  it('should throw an error when validation fails', async () => {
    // Mock validation failure
    mockContract.validateRequest.mockResolvedValueOnce({
      isValid: false,
      errors: [{ message: 'Validation error' }],
      payload: 'Test input'
    });
    
    // Try to invoke the agent
    await expect(wrapper.invoke('Test input')).rejects.toThrow();
  });
});
