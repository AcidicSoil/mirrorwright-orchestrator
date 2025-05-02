import { Message, MessageBus } from './runtime';
import { Logger } from '../utils/Logger';
import { MessageValidator } from '../validation/MessageValidator';

/**
 * Message filter function type
 */
export type MessageFilter = (message: Message) => boolean;

/**
 * Advanced implementation of the message bus with filtering and broadcast capabilities
 */
export class AdvancedMessageBus implements MessageBus {
  private handlers: Map<string, (message: Message) => Promise<void>> = new Map();
  private filters: Map<string, MessageFilter[]> = new Map();
  private logger: Logger;
  private messageValidator: MessageValidator;
  private messageQueue: Message[] = [];
  private processingQueue: boolean = false;
  
  /**
   * Create a new advanced message bus
   */
  constructor() {
    this.logger = new Logger();
    // Lazy-load the MessageValidator to avoid circular dependencies
    import('../validation/MessageValidator').then(module => {
      this.messageValidator = new module.MessageValidator();
    });
  }
  
  /**
   * Publish a message to the bus
   * @param message The message to publish
   */
  async publish(message: Message): Promise<void> {
    this.logger.info(`Publishing message: ${message.id} from ${message.from} to ${message.to}`);
    
    // Validate the message if validator is available
    if (this.messageValidator) {
      try {
        this.messageValidator.validateWithThrow(message);
      } catch (error) {
        this.logger.error(`Invalid message format: ${error}`);
        return;
      }
    }
    
    // Add message to the queue
    this.messageQueue.push(message);
    
    // Process the queue if not already processing
    if (!this.processingQueue) {
      await this.processQueue();
    }
  }
  
  /**
   * Process the message queue
   */
  private async processQueue(): Promise<void> {
    this.processingQueue = true;
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      
      // Handle broadcast messages (to: '*')
      if (message.to === '*') {
        await this.handleBroadcast(message);
        continue;
      }
      
      // Handle direct messages
      const handler = this.handlers.get(message.to);
      if (handler) {
        // Apply filters
        const filters = this.filters.get(message.to) || [];
        const shouldDeliver = filters.every(filter => filter(message));
        
        if (shouldDeliver) {
          try {
            await handler(message);
          } catch (error) {
            this.logger.error(`Error handling message ${message.id}: ${error}`);
          }
        } else {
          this.logger.info(`Message ${message.id} filtered for recipient ${message.to}`);
        }
      } else {
        this.logger.error(`No handler registered for agent ${message.to}`);
      }
    }
    
    this.processingQueue = false;
  }
  
  /**
   * Handle a broadcast message
   * @param message The broadcast message
   */
  private async handleBroadcast(message: Message): Promise<void> {
    this.logger.info(`Broadcasting message: ${message.id} from ${message.from}`);
    
    const deliveryPromises: Promise<void>[] = [];
    
    for (const [agentId, handler] of this.handlers.entries()) {
      // Don't send broadcast back to sender
      if (agentId === message.from) {
        continue;
      }
      
      // Apply filters
      const filters = this.filters.get(agentId) || [];
      const shouldDeliver = filters.every(filter => filter(message));
      
      if (shouldDeliver) {
        // Create a copy of the message with the specific recipient
        const recipientMessage: Message = {
          ...message,
          to: agentId
        };
        
        deliveryPromises.push(
          handler(recipientMessage).catch(error => {
            this.logger.error(`Error handling broadcast message ${message.id} for ${agentId}: ${error}`);
          })
        );
      }
    }
    
    // Wait for all deliveries to complete
    await Promise.all(deliveryPromises);
  }
  
  /**
   * Subscribe to messages on the bus
   * @param agentId The ID of the agent subscribing
   * @param handler The handler function for received messages
   */
  subscribe(agentId: string, handler: (message: Message) => Promise<void>): void {
    this.handlers.set(agentId, handler);
    this.logger.info(`Agent ${agentId} subscribed to messages`);
  }
  
  /**
   * Unsubscribe from messages on the bus
   * @param agentId The ID of the agent unsubscribing
   */
  unsubscribe(agentId: string): void {
    this.handlers.delete(agentId);
    this.filters.delete(agentId);
    this.logger.info(`Agent ${agentId} unsubscribed from messages`);
  }
  
  /**
   * Add a filter for an agent
   * @param agentId The ID of the agent
   * @param filter The filter function
   */
  addFilter(agentId: string, filter: MessageFilter): void {
    if (!this.filters.has(agentId)) {
      this.filters.set(agentId, []);
    }
    
    this.filters.get(agentId)!.push(filter);
    this.logger.info(`Added filter for agent ${agentId}`);
  }
  
  /**
   * Remove all filters for an agent
   * @param agentId The ID of the agent
   */
  clearFilters(agentId: string): void {
    this.filters.delete(agentId);
    this.logger.info(`Cleared filters for agent ${agentId}`);
  }
}
