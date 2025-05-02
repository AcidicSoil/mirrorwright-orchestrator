import { Agent, Message, createRuntimeContainer, RuntimeContainerOptions } from '../orchestrator/runtime';
import { MessageBusType } from '../orchestrator/MessageBusFactory';
import { Logger } from '../utils/Logger';

/**
 * Example implementation of an Agent with filtering capabilities
 */
class AdvancedExampleAgent implements Agent {
  id: string;
  name: string;
  capabilities: string[];
  private logger: Logger;
  private messageTypes: Set<string>;
  
  constructor(id: string, name: string, capabilities: string[] = [], messageTypes: string[] = []) {
    this.id = id;
    this.name = name;
    this.capabilities = capabilities;
    this.logger = new Logger();
    this.messageTypes = new Set(messageTypes);
  }
  
  async initialize(): Promise<void> {
    this.logger.info(`Agent ${this.name} (${this.id}) initializing...`);
    // Simulate initialization work
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info(`Agent ${this.name} (${this.id}) initialized`);
  }
  
  async start(): Promise<void> {
    this.logger.info(`Agent ${this.name} (${this.id}) starting...`);
    // Simulate startup work
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info(`Agent ${this.name} (${this.id}) started`);
  }
  
  async stop(): Promise<void> {
    this.logger.info(`Agent ${this.name} (${this.id}) stopping...`);
    // Simulate shutdown work
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info(`Agent ${this.name} (${this.id}) stopped`);
  }
  
  async handleMessage(message: Message): Promise<void> {
    this.logger.info(`Agent ${this.name} (${this.id}) received message: ${JSON.stringify(message)}`);
    
    // Check if this agent can handle this message type
    if (this.messageTypes.size > 0 && !this.messageTypes.has(message.type)) {
      this.logger.info(`Agent ${this.name} (${this.id}) cannot handle message type ${message.type}`);
      return;
    }
    
    // Process the message
    this.logger.info(`Agent ${this.name} (${this.id}) processed message ${message.id}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  /**
   * Check if this agent can handle a specific message type
   * @param messageType The message type to check
   * @returns True if the agent can handle the message type, false otherwise
   */
  canHandleMessageType(messageType: string): boolean {
    return this.messageTypes.size === 0 || this.messageTypes.has(messageType);
  }
}

/**
 * Example of using the advanced runtime container
 */
export async function runAdvancedExample() {
  const logger = new Logger();
  logger.info('Starting advanced runtime example');
  
  // Create the runtime container with advanced message bus
  const options: RuntimeContainerOptions = {
    messageBusType: MessageBusType.ADVANCED
  };
  const container = createRuntimeContainer(options);
  
  // Create some specialized agents
  const agent1 = new AdvancedExampleAgent(
    'agent-1', 
    'Command Agent', 
    ['command'], 
    ['command']
  );
  
  const agent2 = new AdvancedExampleAgent(
    'agent-2', 
    'Query Agent', 
    ['query'], 
    ['query']
  );
  
  const agent3 = new AdvancedExampleAgent(
    'agent-3', 
    'Notification Agent', 
    ['notification'], 
    ['notification']
  );
  
  // Register the agents with the container
  container.registerAgent(agent1);
  container.registerAgent(agent2);
  container.registerAgent(agent3);
  
  // Initialize and start the container
  await container.init();
  await container.start();
  
  // Add message filters to the message bus
  // We need to cast to access the advanced message bus methods
  const advancedMessageBus = container.messageBus as any;
  
  // Add filters based on agent capabilities
  if (advancedMessageBus.addFilter) {
    advancedMessageBus.addFilter('agent-1', (message: Message) => 
      agent1.canHandleMessageType(message.type)
    );
    
    advancedMessageBus.addFilter('agent-2', (message: Message) => 
      agent2.canHandleMessageType(message.type)
    );
    
    advancedMessageBus.addFilter('agent-3', (message: Message) => 
      agent3.canHandleMessageType(message.type)
    );
  }
  
  // Send some targeted messages
  const commandMessage: Message = {
    id: `msg-${Date.now()}-1`,
    from: 'agent-3',
    to: 'agent-1',
    type: 'command',
    payload: { action: 'start', target: 'process-1' },
    timestamp: Date.now()
  };
  
  await container.sendMessage(commandMessage);
  
  const queryMessage: Message = {
    id: `msg-${Date.now()}-2`,
    from: 'agent-1',
    to: 'agent-2',
    type: 'query',
    payload: { resource: 'status', id: 'process-1' },
    timestamp: Date.now()
  };
  
  await container.sendMessage(queryMessage);
  
  // Send a broadcast notification
  const notificationMessage: Message = {
    id: `msg-${Date.now()}-3`,
    from: 'agent-3',
    to: '*', // Broadcast to all agents
    type: 'notification',
    payload: { level: 'info', message: 'System is running normally' },
    timestamp: Date.now()
  };
  
  await container.sendMessage(notificationMessage);
  
  // Wait a bit to see the messages being processed
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Tear down the container
  await container.teardown();
  
  logger.info('Advanced runtime example completed');
}

// Run the example if this file is executed directly
if (require.main === module) {
  runAdvancedExample().catch(error => {
    console.error('Error running advanced example:', error);
  });
}
