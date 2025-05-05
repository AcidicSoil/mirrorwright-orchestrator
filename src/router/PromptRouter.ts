/**
 * PromptRouter
 *
 * A router that routes messages to the appropriate agent based on routing configurations.
 * This implementation supports dynamic loading of routing configurations from files.
 * It also provides special handling for VibeCheck-specific message types.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '../utils/Logger';
import { Message } from '../orchestrator/runtime';

/**
 * Interface for a routing configuration
 */
export interface RoutingConfig {
  id: string;
  agent: string;
  triggers: RoutingTrigger[];
  route_to: string;
  fallback_behavior?: {
    onFailure: string;
    response: string;
  };
}

/**
 * Interface for a routing trigger
 */
export interface RoutingTrigger {
  type: string;
  [key: string]: any;
}

/**
 * Interface for a pattern trigger
 */
export interface PatternTrigger extends RoutingTrigger {
  type: 'pattern';
  keywords: string[];
  agent_scope?: string[];
}

/**
 * Interface for a tag trigger
 */
export interface TagTrigger extends RoutingTrigger {
  type: 'tag';
  tags: string[];
}

/**
 * Interface for a message type trigger
 */
export interface MessageTypeTrigger extends RoutingTrigger {
  type: 'message_type';
  messageTypes: string[];
}

/**
 * Interface for a router that routes messages to the appropriate agent
 */
export interface Router {
  /**
   * Route a message to the appropriate agent
   * @param message The message to route
   * @returns The ID of the agent to route the message to
   */
  routeMessage(message: Message): string;

  /**
   * Load routing configurations
   */
  loadRoutingConfigs(): void;
}

/**
 * Default implementation of the PromptRouter
 */
export class PromptRouter implements Router {
  private routingConfigs: Map<string, RoutingConfig> = new Map();
  private logger: Logger;

  /**
   * Create a new PromptRouter
   */
  constructor() {
    this.logger = new Logger();
    this.loadRoutingConfigs();
  }

  /**
   * Load routing configurations from files
   */
  loadRoutingConfigs(): void {
    try {
      // Load the VibeCheck routing config
      const vibeCheckRoutingPath = join(__dirname, '../../docs/strategic-ai-reference/assistants/vibe-check/vibe-check-routing.json');
      const vibeCheckRouting = JSON.parse(readFileSync(vibeCheckRoutingPath, 'utf-8'));
      this.routingConfigs.set('vibe-check', vibeCheckRouting);
      this.logger.info('Loaded VibeCheck routing config');

      // Load other routing configs as needed
      // ...
    } catch (error) {
      this.logger.error(`Failed to load routing configs: ${error}`);
    }
  }

  /**
   * Determine if a message should be routed to a specific agent based on pattern triggers
   * @param message The message to check
   * @param patternTrigger The pattern trigger to check against
   * @returns Whether the message should be routed based on the pattern trigger
   */
  private matchesPatternTrigger(message: Message, patternTrigger: PatternTrigger): boolean {
    // Check if the message is from an agent in the scope
    if (patternTrigger.agent_scope && !patternTrigger.agent_scope.includes(message.from)) {
      return false;
    }

    // Check if the message content contains any of the keywords
    const content = message.content?.toString().toLowerCase() || '';
    return patternTrigger.keywords.some(keyword => content.includes(keyword.toLowerCase()));
  }

  /**
   * Determine if a message should be routed to a specific agent based on tag triggers
   * @param message The message to check
   * @param tagTrigger The tag trigger to check against
   * @returns Whether the message should be routed based on the tag trigger
   */
  private matchesTagTrigger(message: Message, tagTrigger: TagTrigger): boolean {
    // Check if the message has tags in its metadata
    if (!message.metadata?.tags) {
      return false;
    }

    // Check if any of the message tags match the trigger tags
    const messageTags = Array.isArray(message.metadata.tags)
      ? message.metadata.tags
      : [message.metadata.tags];

    return tagTrigger.tags.some(tag => messageTags.includes(tag));
  }

  /**
   * Determine if a message should be routed to a specific agent based on message type triggers
   * @param message The message to check
   * @param messageTypeTrigger The message type trigger to check against
   * @returns Whether the message should be routed based on the message type trigger
   */
  private matchesMessageTypeTrigger(message: Message, messageTypeTrigger: MessageTypeTrigger): boolean {
    // Check if the message type matches any of the trigger message types
    return messageTypeTrigger.messageTypes.includes(message.type);
  }

  /**
   * Determine if a message should be routed to a specific agent
   * @param message The message to check
   * @param routingConfig The routing configuration to check against
   * @returns Whether the message should be routed based on the routing configuration
   */
  private shouldRouteToAgent(message: Message, routingConfig: RoutingConfig): boolean {
    // Special handling for VibeCheck-specific message types
    if (routingConfig.route_to === 'vibe-check' &&
        (message.type === 'vibe_check' || message.type === 'vibe_distill' || message.type === 'vibe_learn')) {
      this.logger.info(`Routing message ${message.id} to VibeCheck based on message type: ${message.type}`);
      return true;
    }

    // Check each trigger in the routing configuration
    for (const trigger of routingConfig.triggers) {
      switch (trigger.type) {
        case 'pattern':
          if (this.matchesPatternTrigger(message, trigger as PatternTrigger)) {
            return true;
          }
          break;
        case 'tag':
          if (this.matchesTagTrigger(message, trigger as TagTrigger)) {
            return true;
          }
          break;
        case 'message_type':
          if (this.matchesMessageTypeTrigger(message, trigger as MessageTypeTrigger)) {
            return true;
          }
          break;
        // Add other trigger types as needed
        default:
          this.logger.warn(`Unknown trigger type: ${trigger.type}`);
          break;
      }
    }

    return false;
  }

  /**
   * Route a message to the appropriate agent
   * @param message The message to route
   * @returns The ID of the agent to route the message to
   */
  routeMessage(message: Message): string {
    // If the message already has a destination, use that
    if (message.to) {
      return message.to;
    }

    // Check each routing configuration
    for (const [id, config] of this.routingConfigs.entries()) {
      if (this.shouldRouteToAgent(message, config)) {
        this.logger.info(`Routing message ${message.id} to ${config.route_to} based on ${id} routing config`);
        return config.route_to;
      }
    }

    // Default routing logic
    this.logger.info(`No routing match found for message ${message.id}, using default routing`);
    return message.from; // Default to sending back to the sender
  }
}

/**
 * Create a new PromptRouter
 * @returns A new PromptRouter instance
 */
export function createPromptRouter(): Router {
  return new PromptRouter();
}
