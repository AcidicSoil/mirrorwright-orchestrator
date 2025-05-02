import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Message } from '../../src/orchestrator/runtime';
import { AdvancedMessageBus, MessageFilter } from '../../src/orchestrator/AdvancedMessageBus';

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

describe('AdvancedMessageBus', () => {
  let messageBus: AdvancedMessageBus;
  let handler1: (message: Message) => Promise<void>;
  let handler2: (message: Message) => Promise<void>;
  
  beforeEach(() => {
    messageBus = new AdvancedMessageBus();
    handler1 = vi.fn().mockResolvedValue(undefined);
    handler2 = vi.fn().mockResolvedValue(undefined);
  });
  
  it('should deliver messages to subscribed handlers', async () => {
    messageBus.subscribe('agent-1', handler1);
    
    const message = createTestMessage('agent-2', 'agent-1');
    await messageBus.publish(message);
    
    // Wait for async queue processing
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(handler1).toHaveBeenCalledWith(message);
  });
  
  it('should not deliver messages after unsubscribe', async () => {
    messageBus.subscribe('agent-1', handler1);
    messageBus.unsubscribe('agent-1');
    
    const message = createTestMessage('agent-2', 'agent-1');
    await messageBus.publish(message);
    
    // Wait for async queue processing
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(handler1).not.toHaveBeenCalled();
  });
  
  it('should broadcast messages to all subscribers except sender', async () => {
    messageBus.subscribe('agent-1', handler1);
    messageBus.subscribe('agent-2', handler2);
    
    const broadcastMessage = createTestMessage('agent-1', '*');
    await messageBus.publish(broadcastMessage);
    
    // Wait for async queue processing
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // agent-1 should not receive its own broadcast
    expect(handler1).not.toHaveBeenCalled();
    
    // agent-2 should receive the broadcast with its ID as the recipient
    expect(handler2).toHaveBeenCalledWith(expect.objectContaining({
      id: broadcastMessage.id,
      from: 'agent-1',
      to: 'agent-2',
      type: broadcastMessage.type,
      payload: broadcastMessage.payload,
      timestamp: broadcastMessage.timestamp
    }));
  });
  
  it('should filter messages based on message filters', async () => {
    messageBus.subscribe('agent-1', handler1);
    
    // Add a filter that only accepts messages of type 'allowed'
    const typeFilter: MessageFilter = (message: Message) => message.type === 'allowed';
    messageBus.addFilter('agent-1', typeFilter);
    
    // This message should be filtered out
    const filteredMessage = createTestMessage('agent-2', 'agent-1', 'filtered');
    await messageBus.publish(filteredMessage);
    
    // This message should be delivered
    const allowedMessage = createTestMessage('agent-2', 'agent-1', 'allowed');
    await messageBus.publish(allowedMessage);
    
    // Wait for async queue processing
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(handler1).not.toHaveBeenCalledWith(filteredMessage);
    expect(handler1).toHaveBeenCalledWith(allowedMessage);
  });
  
  it('should clear filters when requested', async () => {
    messageBus.subscribe('agent-1', handler1);
    
    // Add a filter that only accepts messages of type 'allowed'
    const typeFilter: MessageFilter = (message: Message) => message.type === 'allowed';
    messageBus.addFilter('agent-1', typeFilter);
    
    // Clear the filters
    messageBus.clearFilters('agent-1');
    
    // This message should now be delivered
    const message = createTestMessage('agent-2', 'agent-1', 'any-type');
    await messageBus.publish(message);
    
    // Wait for async queue processing
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(handler1).toHaveBeenCalledWith(message);
  });
});
