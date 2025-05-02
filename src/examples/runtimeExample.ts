import { Agent, Message, createRuntimeContainer } from '../orchestrator/runtime';
import { Logger } from '../utils/Logger';

/**
 * Example implementation of an Agent
 */
class ExampleAgent implements Agent {
  id: string;
  name: string;
  capabilities: string[];
  private logger: Logger;
  
  constructor(id: string, name: string, capabilities: string[] = []) {
    this.id = id;
    this.name = name;
    this.capabilities = capabilities;
    this.logger = new Logger();
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
    // Process the message
    this.logger.info(`Agent ${this.name} (${this.id}) processed message ${message.id}`);
  }
}

/**
 * Example of using the runtime container
 */
async function runExample() {
  const logger = new Logger();
  logger.info('Starting runtime example');
  
  // Create the runtime container
  const container = createRuntimeContainer();
  
  // Create some agents
  const agent1 = new ExampleAgent('agent-1', 'Example Agent 1', ['capability1', 'capability2']);
  const agent2 = new ExampleAgent('agent-2', 'Example Agent 2', ['capability3']);
  
  // Register the agents with the container
  container.registerAgent(agent1);
  container.registerAgent(agent2);
  
  // Initialize and start the container
  await container.init();
  await container.start();
  
  // Send some messages between agents
  const message1: Message = {
    id: `msg-${Date.now()}-1`,
    from: 'agent-1',
    to: 'agent-2',
    type: 'example',
    payload: { content: 'Hello from Agent 1!' },
    timestamp: Date.now()
  };
  
  await container.sendMessage(message1);
  
  const message2: Message = {
    id: `msg-${Date.now()}-2`,
    from: 'agent-2',
    to: 'agent-1',
    type: 'example',
    payload: { content: 'Hello from Agent 2!' },
    timestamp: Date.now()
  };
  
  await container.sendMessage(message2);
  
  // Wait a bit to see the messages being processed
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Tear down the container
  await container.teardown();
  
  logger.info('Runtime example completed');
}

// Run the example if this file is executed directly
if (require.main === module) {
  runExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}
