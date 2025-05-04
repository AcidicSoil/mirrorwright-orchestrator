import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  AgentInterfaceLayer, 
  BaseAgentWrapper, 
  BaseAgentContract,
  AgentContext
} from '../../src/agent-interface';
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

describe('AgentInterfaceLayer', () => {
  let agentInterface: AgentInterfaceLayer;
  let mockAdapter: MockAgentAdapter;
  let mockContract: BaseAgentContract;
  let mockWrapper: BaseAgentWrapper;
  
  beforeEach(() => {
    // Create fresh instances for each test
    agentInterface = new AgentInterfaceLayer();
    mockAdapter = new MockAgentAdapter();
    mockContract = new BaseAgentContract();
    mockWrapper = new BaseAgentWrapper('mock-agent', mockAdapter, mockContract);
    
    // Register the mock agent
    agentInterface.registerAgent(mockWrapper);
  });
  
  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });
  
  it('should register and retrieve agents', () => {
    // Get the agent registry
    const registry = agentInterface.getAgentRegistry();
    
    // Check that the mock agent is registered
    const agent = registry.getAgent('mock-agent');
    expect(agent).toBeDefined();
    expect(agent).toBe(mockWrapper);
    
    // Check that all agents includes the mock agent
    const allAgents = registry.getAllAgents();
    expect(allAgents).toContain(mockWrapper);
  });
  
  it('should send messages to agents', async () => {
    // Create a context
    const context: AgentContext = {
      sessionId: 'test-session',
      modeId: 'test-mode',
      ritualId: 'test-ritual',
      stepId: 'test-step'
    };
    
    // Send a message
    const response = await agentInterface.send('mock-agent', 'Test message', context);
    
    // Check that the adapter was called
    expect(mockAdapter.send).toHaveBeenCalledTimes(1);
    expect(mockAdapter.send).toHaveBeenCalledWith(expect.objectContaining({
      prompt: expect.any(String),
      metadata: expect.objectContaining({
        sessionId: 'test-session',
        modeId: 'test-mode',
        ritualId: 'test-ritual',
        stepId: 'test-step'
      })
    }));
    
    // Check the response
    expect(response).toEqual({
      content: expect.stringContaining('Test message'),
      metadata: expect.objectContaining({
        mockAgent: true
      })
    });
  });
  
  it('should broadcast messages to all agents', async () => {
    // Create a context
    const context: AgentContext = {
      sessionId: 'test-session',
      modeId: 'test-mode',
      ritualId: 'test-ritual',
      stepId: 'test-step'
    };
    
    // Broadcast a message
    await agentInterface.broadcast('Broadcast test', context);
    
    // Check that the adapter was called
    expect(mockAdapter.send).toHaveBeenCalledTimes(1);
    expect(mockAdapter.send).toHaveBeenCalledWith(expect.objectContaining({
      prompt: expect.any(String),
      metadata: expect.objectContaining({
        sessionId: 'test-session',
        modeId: 'test-mode',
        ritualId: 'test-ritual',
        stepId: 'test-step'
      })
    }));
  });
  
  it('should throw an error when sending to a non-existent agent', async () => {
    // Try to send a message to a non-existent agent
    await expect(agentInterface.send('non-existent-agent', 'Test message')).rejects.toThrow();
  });
});
