import { Logger } from '../utils/Logger';
import { Message, MessageBus as RuntimeMessageBus } from '../orchestrator/runtime';
import { createMessageBus, MessageBusType } from '../orchestrator/MessageBusFactory';

/**
 * Message structure for agent interface layer
 */
export interface AgentMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Identifier of the sending agent */
  from: string;
  
  /** Identifier of the receiving agent */
  to: string;
  
  /** Message type */
  type: string;
  
  /** Message payload */
  payload: any;
  
  /** Message metadata */
  metadata?: Record<string, any>;
  
  /** Timestamp when the message was created */
  timestamp: number;
}

/**
 * Message handler function type
 */
export type MessageHandler = (message: AgentMessage) => Promise<void>;

/**
 * Interface for the agent interface message bus
 */
export interface MessageBus {
  /**
   * Emit a message to the bus
   * @param event The event name
   * @param message The message to emit
   */
  emit(event: string, message: AgentMessage): Promise<void>;
  
  /**
   * Listen for messages on the bus
   * @param event The event name
   * @param handler The handler function for received messages
   */
  on(event: string, handler: MessageHandler): void;
  
  /**
   * Remove a listener from the bus
   * @param event The event name
   * @param handler The handler function to remove
   */
  off(event: string, handler: MessageHandler): void;
}

/**
 * Implementation of the MessageBus interface using the runtime message bus
 */
export class RuntimeMessageBusAdapter implements MessageBus {
  private runtimeBus: RuntimeMessageBus;
  private logger: Logger;
  private handlers: Map<string, Map<MessageHandler, (message: Message) => Promise<void>>> = new Map();
  
  /**
   * Create a new runtime message bus adapter
   * @param busType The type of message bus to use
   */
  constructor(busType: MessageBusType = MessageBusType.ADVANCED) {
    this.runtimeBus = createMessageBus(busType);
    this.logger = new Logger();
  }
  
  /**
   * Emit a message to the bus
   * @param event The event name
   * @param message The message to emit
   */
  async emit(event: string, message: AgentMessage): Promise<void> {
    this.logger.info(`Emitting message to ${event}: ${message.id}`);
    
    // Convert to runtime message format
    const runtimeMessage: Message = {
      id: message.id,
      from: message.from,
      to: message.to,
      type: message.type,
      payload: message.payload,
      metadata: {
        ...message.metadata,
        event
      },
      timestamp: message.timestamp
    };
    
    // Publish to the runtime bus
    await this.runtimeBus.publish(runtimeMessage);
  }
  
  /**
   * Listen for messages on the bus
   * @param event The event name
   * @param handler The handler function for received messages
   */
  on(event: string, handler: MessageHandler): void {
    this.logger.info(`Adding listener for event: ${event}`);
    
    // Create a wrapper handler that converts runtime messages to agent messages
    const wrapperHandler = async (message: Message): Promise<void> => {
      // Check if the message is for this event
      if (message.metadata?.event !== event) {
        return;
      }
      
      // Convert to agent message format
      const agentMessage: AgentMessage = {
        id: message.id,
        from: message.from,
        to: message.to,
        type: message.type,
        payload: message.payload,
        metadata: message.metadata,
        timestamp: message.timestamp
      };
      
      // Call the handler
      await handler(agentMessage);
    };
    
    // Store the mapping between the original handler and the wrapper
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Map());
    }
    
    this.handlers.get(event)!.set(handler, wrapperHandler);
    
    // Subscribe to the runtime bus
    this.runtimeBus.subscribe(event, wrapperHandler);
  }
  
  /**
   * Remove a listener from the bus
   * @param event The event name
   * @param handler The handler function to remove
   */
  off(event: string, handler: MessageHandler): void {
    this.logger.info(`Removing listener for event: ${event}`);
    
    // Get the wrapper handler
    const wrapperHandler = this.handlers.get(event)?.get(handler);
    
    if (wrapperHandler) {
      // Unsubscribe from the runtime bus
      this.runtimeBus.unsubscribe(event);
      
      // Remove the mapping
      this.handlers.get(event)!.delete(handler);
      
      if (this.handlers.get(event)!.size === 0) {
        this.handlers.delete(event);
      }
    }
  }
}
