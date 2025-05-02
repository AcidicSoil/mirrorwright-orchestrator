import { Logger } from '../utils/Logger';

/**
 * Interface representing an agent in the Mirrorwright Orchestrator
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string;

  /** Human-readable name of the agent */
  name: string;

  /** List of capabilities this agent provides */
  capabilities: string[];

  /** Agent configuration */
  config?: Record<string, any>;

  /**
   * Initialize the agent with its configuration
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>;

  /**
   * Start the agent's execution
   * @returns Promise that resolves when the agent has started
   */
  start(): Promise<void>;

  /**
   * Stop the agent's execution
   * @returns Promise that resolves when the agent has stopped
   */
  stop(): Promise<void>;

  /**
   * Handle a message sent to this agent
   * @param message The message to handle
   * @returns Promise that resolves with an optional response message
   */
  handleMessage(message: Message): Promise<Message | void>;
}

/**
 * Message structure for inter-agent communication
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;

  /** Identifier of the sending agent */
  from: string;

  /** Identifier of the receiving agent */
  to: string;

  /** Message type */
  type: string;

  /** Message payload */
  payload: Record<string, any>;

  /** Message metadata */
  metadata?: Record<string, any>;

  /** Timestamp when the message was created */
  timestamp: number;
}

/**
 * Interface for the agent registry
 */
export interface AgentRegistry {
  /**
   * Register an agent with the registry
   * @param agent The agent to register
   */
  registerAgent(agent: Agent): void;

  /**
   * Unregister an agent from the registry
   * @param agentId The ID of the agent to unregister
   */
  unregisterAgent(agentId: string): void;

  /**
   * Get an agent by its ID
   * @param agentId The ID of the agent to retrieve
   * @returns The agent, or undefined if not found
   */
  getAgent(agentId: string): Agent | undefined;

  /**
   * Get all registered agents
   * @returns Array of all registered agents
   */
  getAllAgents(): Agent[];
}

/**
 * Interface for the message bus
 */
export interface MessageBus {
  /**
   * Publish a message to the bus
   * @param message The message to publish
   */
  publish(message: Message): Promise<void>;

  /**
   * Subscribe to messages on the bus
   * @param agentId The ID of the agent subscribing
   * @param handler The handler function for received messages
   */
  subscribe(agentId: string, handler: (message: Message) => Promise<void>): void;

  /**
   * Unsubscribe from messages on the bus
   * @param agentId The ID of the agent unsubscribing
   */
  unsubscribe(agentId: string): void;
}

/**
 * Interface for the runtime container
 */
export interface RuntimeContainer {
  /** The agent registry */
  registry: AgentRegistry;

  /** The message bus */
  messageBus: MessageBus;

  /**
   * Initialize the runtime container
   * @returns Promise that resolves when initialization is complete
   */
  init(): Promise<void>;

  /**
   * Start the runtime container
   * @returns Promise that resolves when the container has started
   */
  start(): Promise<void>;

  /**
   * Tear down the runtime container
   * @returns Promise that resolves when the container has been torn down
   */
  teardown(): Promise<void>;

  /**
   * Register an agent with the runtime
   * @param agent The agent to register
   */
  registerAgent(agent: Agent): void;

  /**
   * Send a message from one agent to another
   * @param message The message to send
   */
  sendMessage(message: Message): Promise<void>;
}

/**
 * Default implementation of the agent registry
 */
export class DefaultAgentRegistry implements AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  registerAgent(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      this.logger.error(`Agent with ID ${agent.id} is already registered`);
      throw new Error(`Agent with ID ${agent.id} is already registered`);
    }

    this.agents.set(agent.id, agent);
    this.logger.info(`Registered agent: ${agent.name} (${agent.id})`);
  }

  unregisterAgent(agentId: string): void {
    if (!this.agents.has(agentId)) {
      this.logger.error(`Agent with ID ${agentId} is not registered`);
      throw new Error(`Agent with ID ${agentId} is not registered`);
    }

    this.agents.delete(agentId);
    this.logger.info(`Unregistered agent: ${agentId}`);
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}

/**
 * Simple implementation of the message bus
 */
export class SimpleMessageBus implements MessageBus {
  private handlers: Map<string, (message: Message) => Promise<void>> = new Map();
  private logger: Logger;
  private messageValidator: import('../validation/MessageValidator').MessageValidator;

  constructor() {
    this.logger = new Logger();
    // Lazy-load the MessageValidator to avoid circular dependencies
    import('../validation/MessageValidator').then(module => {
      this.messageValidator = new module.MessageValidator();
    });
  }

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

    const handler = this.handlers.get(message.to);
    if (handler) {
      try {
        await handler(message);
      } catch (error) {
        this.logger.error(`Error handling message ${message.id}: ${error}`);
      }
    } else {
      this.logger.error(`No handler registered for agent ${message.to}`);
    }
  }

  subscribe(agentId: string, handler: (message: Message) => Promise<void>): void {
    this.handlers.set(agentId, handler);
    this.logger.info(`Agent ${agentId} subscribed to messages`);
  }

  unsubscribe(agentId: string): void {
    this.handlers.delete(agentId);
    this.logger.info(`Agent ${agentId} unsubscribed from messages`);
  }
}

/**
 * Default implementation of the runtime container
 */
export class DefaultRuntimeContainer implements RuntimeContainer {
  registry: AgentRegistry;
  messageBus: MessageBus;
  private logger: Logger;
  private initialized: boolean = false;
  private running: boolean = false;

  constructor() {
    this.registry = new DefaultAgentRegistry();
    this.messageBus = new SimpleMessageBus();
    this.logger = new Logger();
  }

  async init(): Promise<void> {
    if (this.initialized) {
      this.logger.info('Runtime container already initialized');
      return;
    }

    this.logger.info('Initializing runtime container');

    // Initialize all registered agents
    const agents = this.registry.getAllAgents();
    for (const agent of agents) {
      try {
        await agent.initialize();
      } catch (error) {
        this.logger.error(`Failed to initialize agent ${agent.id}: ${error}`);
        throw error;
      }
    }

    this.initialized = true;
    this.logger.info('Runtime container initialized successfully');
  }

  async start(): Promise<void> {
    if (!this.initialized) {
      this.logger.error('Cannot start runtime container: not initialized');
      throw new Error('Runtime container not initialized');
    }

    if (this.running) {
      this.logger.info('Runtime container already running');
      return;
    }

    this.logger.info('Starting runtime container');

    // Start all registered agents
    const agents = this.registry.getAllAgents();
    for (const agent of agents) {
      try {
        await agent.start();

        // Subscribe the agent to the message bus
        this.messageBus.subscribe(agent.id, async (message: Message) => {
          try {
            await agent.handleMessage(message);
          } catch (error) {
            this.logger.error(`Error in agent ${agent.id} handling message ${message.id}: ${error}`);
          }
        });
      } catch (error) {
        this.logger.error(`Failed to start agent ${agent.id}: ${error}`);
        throw error;
      }
    }

    this.running = true;
    this.logger.info('Runtime container started successfully');
  }

  async teardown(): Promise<void> {
    if (!this.initialized) {
      this.logger.info('Runtime container not initialized, nothing to tear down');
      return;
    }

    this.logger.info('Tearing down runtime container');

    // Stop all registered agents
    const agents = this.registry.getAllAgents();
    for (const agent of agents) {
      try {
        // Unsubscribe the agent from the message bus
        this.messageBus.unsubscribe(agent.id);

        // Stop the agent
        await agent.stop();
      } catch (error) {
        this.logger.error(`Error stopping agent ${agent.id}: ${error}`);
        // Continue teardown despite errors
      }
    }

    this.initialized = false;
    this.running = false;
    this.logger.info('Runtime container torn down successfully');
  }

  registerAgent(agent: Agent): void {
    this.registry.registerAgent(agent);

    // If the container is already running, initialize and start the agent
    if (this.running) {
      (async () => {
        try {
          await agent.initialize();
          await agent.start();

          // Subscribe the agent to the message bus
          this.messageBus.subscribe(agent.id, async (message: Message) => {
            try {
              await agent.handleMessage(message);
            } catch (error) {
              this.logger.error(`Error in agent ${agent.id} handling message ${message.id}: ${error}`);
            }
          });
        } catch (error) {
          this.logger.error(`Failed to initialize and start agent ${agent.id}: ${error}`);
        }
      })();
    }
  }

  async sendMessage(message: Message): Promise<void> {
    if (!this.running) {
      this.logger.error('Cannot send message: runtime container not running');
      throw new Error('Runtime container not running');
    }

    // Validate message format using the MessageValidator
    try {
      const { MessageValidator } = await import('../validation/MessageValidator');
      const validator = new MessageValidator();
      validator.validateWithThrow(message);
    } catch (error) {
      this.logger.error(`Invalid message format: ${error}`);
      throw new Error(`Invalid message format: ${error}`);
    }

    // Validate that the sender is registered
    const sender = this.registry.getAgent(message.from);
    if (!sender) {
      this.logger.error(`Cannot send message: sender ${message.from} not registered`);
      throw new Error(`Sender ${message.from} not registered`);
    }

    // Validate that the recipient is registered
    const recipient = this.registry.getAgent(message.to);
    if (!recipient) {
      this.logger.error(`Cannot send message: recipient ${message.to} not registered`);
      throw new Error(`Recipient ${message.to} not registered`);
    }

    // Validate that the sender has the capability to send this message type
    if (message.type && !sender.capabilities.includes(message.type) && !sender.capabilities.includes('*')) {
      this.logger.error(`Sender ${message.from} does not have the capability to send messages of type ${message.type}`);
      throw new Error(`Sender ${message.from} does not have the capability to send messages of type ${message.type}`);
    }

    // Publish the message to the message bus
    await this.messageBus.publish(message);
  }
}

/**
 * Options for creating a runtime container
 */
export interface RuntimeContainerOptions {
  /** The type of message bus to use */
  messageBusType?: import('./MessageBusFactory').MessageBusType;
}

/**
 * Create a new runtime container instance
 * @param options Options for creating the runtime container
 * @returns A new runtime container
 */
export function createRuntimeContainer(options?: RuntimeContainerOptions): RuntimeContainer {
  const container = new DefaultRuntimeContainer();

  // If options are provided, configure the container
  if (options) {
    if (options.messageBusType) {
      import('./MessageBusFactory').then(module => {
        container.messageBus = module.createMessageBus(options.messageBusType);
      });
    }
  }

  return container;
}
