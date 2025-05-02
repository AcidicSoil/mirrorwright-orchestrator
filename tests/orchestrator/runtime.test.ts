import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  Agent, 
  Message, 
  DefaultAgentRegistry, 
  SimpleMessageBus, 
  DefaultRuntimeContainer,
  createRuntimeContainer
} from '../../src/orchestrator/runtime';

// Mock implementation of an Agent for testing
class MockAgent implements Agent {
  id: string;
  name: string;
  capabilities: string[];
  config?: Record<string, any>;
  
  // Spy functions for testing
  initialize = vi.fn().mockResolvedValue(undefined);
  start = vi.fn().mockResolvedValue(undefined);
  stop = vi.fn().mockResolvedValue(undefined);
  handleMessage = vi.fn().mockResolvedValue(undefined);
  
  constructor(id: string, name: string, capabilities: string[] = []) {
    this.id = id;
    this.name = name;
    this.capabilities = capabilities;
  }
}

// Helper function to create a test message
function createTestMessage(from: string, to: string, type: string = 'test'): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    from,
    to,
    type,
    payload: { test: 'data' },
    timestamp: Date.now()
  };
}

describe('AgentRegistry', () => {
  let registry: DefaultAgentRegistry;
  let agent: MockAgent;
  
  beforeEach(() => {
    registry = new DefaultAgentRegistry();
    agent = new MockAgent('agent-1', 'Test Agent');
  });
  
  it('should register an agent', () => {
    registry.registerAgent(agent);
    expect(registry.getAgent('agent-1')).toBe(agent);
  });
  
  it('should throw when registering an agent with duplicate ID', () => {
    registry.registerAgent(agent);
    const duplicateAgent = new MockAgent('agent-1', 'Duplicate Agent');
    expect(() => registry.registerAgent(duplicateAgent)).toThrow();
  });
  
  it('should unregister an agent', () => {
    registry.registerAgent(agent);
    registry.unregisterAgent('agent-1');
    expect(registry.getAgent('agent-1')).toBeUndefined();
  });
  
  it('should throw when unregistering a non-existent agent', () => {
    expect(() => registry.unregisterAgent('non-existent')).toThrow();
  });
  
  it('should get all agents', () => {
    const agent2 = new MockAgent('agent-2', 'Test Agent 2');
    registry.registerAgent(agent);
    registry.registerAgent(agent2);
    
    const allAgents = registry.getAllAgents();
    expect(allAgents).toHaveLength(2);
    expect(allAgents).toContain(agent);
    expect(allAgents).toContain(agent2);
  });
});

describe('MessageBus', () => {
  let messageBus: SimpleMessageBus;
  let handler: (message: Message) => Promise<void>;
  
  beforeEach(() => {
    messageBus = new SimpleMessageBus();
    handler = vi.fn().mockResolvedValue(undefined);
  });
  
  it('should deliver messages to subscribed handlers', async () => {
    messageBus.subscribe('agent-1', handler);
    
    const message = createTestMessage('agent-2', 'agent-1');
    await messageBus.publish(message);
    
    expect(handler).toHaveBeenCalledWith(message);
  });
  
  it('should not deliver messages after unsubscribe', async () => {
    messageBus.subscribe('agent-1', handler);
    messageBus.unsubscribe('agent-1');
    
    const message = createTestMessage('agent-2', 'agent-1');
    await messageBus.publish(message);
    
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('RuntimeContainer', () => {
  let container: DefaultRuntimeContainer;
  let agent1: MockAgent;
  let agent2: MockAgent;
  
  beforeEach(() => {
    container = new DefaultRuntimeContainer();
    agent1 = new MockAgent('agent-1', 'Test Agent 1');
    agent2 = new MockAgent('agent-2', 'Test Agent 2');
  });
  
  afterEach(async () => {
    await container.teardown();
  });
  
  it('should initialize all registered agents', async () => {
    container.registerAgent(agent1);
    container.registerAgent(agent2);
    
    await container.init();
    
    expect(agent1.initialize).toHaveBeenCalled();
    expect(agent2.initialize).toHaveBeenCalled();
  });
  
  it('should start all registered agents', async () => {
    container.registerAgent(agent1);
    container.registerAgent(agent2);
    
    await container.init();
    await container.start();
    
    expect(agent1.start).toHaveBeenCalled();
    expect(agent2.start).toHaveBeenCalled();
  });
  
  it('should stop all registered agents during teardown', async () => {
    container.registerAgent(agent1);
    container.registerAgent(agent2);
    
    await container.init();
    await container.start();
    await container.teardown();
    
    expect(agent1.stop).toHaveBeenCalled();
    expect(agent2.stop).toHaveBeenCalled();
  });
  
  it('should deliver messages between agents', async () => {
    container.registerAgent(agent1);
    container.registerAgent(agent2);
    
    await container.init();
    await container.start();
    
    const message = createTestMessage('agent-1', 'agent-2');
    await container.sendMessage(message);
    
    expect(agent2.handleMessage).toHaveBeenCalledWith(message);
  });
  
  it('should throw when sending a message from an unregistered agent', async () => {
    container.registerAgent(agent2);
    
    await container.init();
    await container.start();
    
    const message = createTestMessage('agent-1', 'agent-2');
    await expect(container.sendMessage(message)).rejects.toThrow();
  });
  
  it('should throw when sending a message to an unregistered agent', async () => {
    container.registerAgent(agent1);
    
    await container.init();
    await container.start();
    
    const message = createTestMessage('agent-1', 'agent-2');
    await expect(container.sendMessage(message)).rejects.toThrow();
  });
  
  it('should initialize and start newly registered agents when already running', async () => {
    container.registerAgent(agent1);
    
    await container.init();
    await container.start();
    
    // Register a new agent after the container is already running
    container.registerAgent(agent2);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(agent2.initialize).toHaveBeenCalled();
    expect(agent2.start).toHaveBeenCalled();
  });
  
  it('should create a runtime container with factory function', () => {
    const container = createRuntimeContainer();
    expect(container).toBeInstanceOf(DefaultRuntimeContainer);
  });
});
