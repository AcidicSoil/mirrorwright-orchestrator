import { MessageBus } from './runtime';
import { SimpleMessageBus } from './runtime';
import { AdvancedMessageBus } from './AdvancedMessageBus';

/**
 * Message bus type
 */
export enum MessageBusType {
  SIMPLE = 'simple',
  ADVANCED = 'advanced'
}

/**
 * Create a message bus
 * @param type The type of message bus to create
 * @returns A new message bus instance
 */
export function createMessageBus(type: MessageBusType = MessageBusType.SIMPLE): MessageBus {
  switch (type) {
    case MessageBusType.ADVANCED:
      return new AdvancedMessageBus();
    case MessageBusType.SIMPLE:
    default:
      return new SimpleMessageBus();
  }
}
