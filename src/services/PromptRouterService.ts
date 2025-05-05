/**
 * PromptRouterService
 * 
 * A service that provides routing functionality for the Mirrorwright Orchestrator.
 * This service centralizes routing logic and provides methods for programmatically
 * triggering VibeCheck and other agents.
 */

import { Router, createPromptRouter } from '../router/PromptRouter';
import { Message } from '../orchestrator/runtime';
import { Logger } from '../utils/Logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for the PromptRouter service
 */
export interface PromptRouterServiceInterface {
  /**
   * Route a message to the appropriate agent
   * @param message The message to route
   * @returns The ID of the agent to route the message to
   */
  routeMessage(message: Message): string;

  /**
   * Trigger VibeCheck with a message
   * @param message The message to send to VibeCheck
   * @param fromAgent The ID of the agent triggering VibeCheck
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeCheck(message: Message, fromAgent: string): Message;

  /**
   * Trigger VibeCheck with a plan
   * @param plan The plan to check
   * @param userRequest The original user request
   * @param phase The current phase (planning, implementation, review)
   * @param fromAgent The ID of the agent triggering VibeCheck
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeCheckWithPlan(
    plan: string,
    userRequest: string,
    phase: 'planning' | 'implementation' | 'review',
    fromAgent: string
  ): Message;

  /**
   * Trigger VibeDistill with a plan
   * @param plan The plan to distill
   * @param userRequest The original user request
   * @param fromAgent The ID of the agent triggering VibeDistill
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeDistill(
    plan: string,
    userRequest: string,
    fromAgent: string
  ): Message;

  /**
   * Trigger VibeLean with a mistake
   * @param mistake The mistake to learn from
   * @param category The category of the mistake
   * @param solution The solution to the mistake
   * @param fromAgent The ID of the agent triggering VibeLean
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeLearn(
    mistake: string,
    category: string,
    solution: string,
    fromAgent: string
  ): Message;

  /**
   * Check if a message should be routed to VibeCheck
   * @param message The message to check
   * @returns Whether the message should be routed to VibeCheck
   */
  shouldRouteToVibeCheck(message: Message): boolean;
}

/**
 * Default implementation of the PromptRouter service
 */
export class PromptRouterService implements PromptRouterServiceInterface {
  private router: Router;
  private logger: Logger;

  /**
   * Create a new PromptRouterService
   */
  constructor() {
    this.router = createPromptRouter();
    this.logger = new Logger();
  }

  /**
   * Route a message to the appropriate agent
   * @param message The message to route
   * @returns The ID of the agent to route the message to
   */
  routeMessage(message: Message): string {
    return this.router.routeMessage(message);
  }

  /**
   * Trigger VibeCheck with a message
   * @param message The message to send to VibeCheck
   * @param fromAgent The ID of the agent triggering VibeCheck
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeCheck(message: Message, fromAgent: string): Message {
    this.logger.info(`Triggering VibeCheck from ${fromAgent}`);

    return {
      id: uuidv4(),
      type: 'vibe_check',
      from: fromAgent,
      to: 'vibe-check',
      content: message.content,
      phase: message.phase || 'planning',
      userRequest: message.userRequest || '',
      plan: message.plan || '',
      metadata: {
        ...message.metadata,
        tags: [...(message.metadata?.tags || []), '#vibe-check-trigger']
      }
    };
  }

  /**
   * Trigger VibeCheck with a plan
   * @param plan The plan to check
   * @param userRequest The original user request
   * @param phase The current phase (planning, implementation, review)
   * @param fromAgent The ID of the agent triggering VibeCheck
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeCheckWithPlan(
    plan: string,
    userRequest: string,
    phase: 'planning' | 'implementation' | 'review',
    fromAgent: string
  ): Message {
    this.logger.info(`Triggering VibeCheck with plan from ${fromAgent}`);

    return {
      id: uuidv4(),
      type: 'vibe_check',
      from: fromAgent,
      to: 'vibe-check',
      content: 'Check my plan',
      phase,
      userRequest,
      plan,
      metadata: {
        tags: ['#vibe-check-trigger']
      }
    };
  }

  /**
   * Trigger VibeDistill with a plan
   * @param plan The plan to distill
   * @param userRequest The original user request
   * @param fromAgent The ID of the agent triggering VibeDistill
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeDistill(
    plan: string,
    userRequest: string,
    fromAgent: string
  ): Message {
    this.logger.info(`Triggering VibeDistill from ${fromAgent}`);

    return {
      id: uuidv4(),
      type: 'vibe_distill',
      from: fromAgent,
      to: 'vibe-check',
      content: 'Distill my plan',
      userRequest,
      plan,
      metadata: {
        tags: ['#vibe-distill-trigger']
      }
    };
  }

  /**
   * Trigger VibeLean with a mistake
   * @param mistake The mistake to learn from
   * @param category The category of the mistake
   * @param solution The solution to the mistake
   * @param fromAgent The ID of the agent triggering VibeLean
   * @returns A message that can be sent to VibeCheck
   */
  triggerVibeLearn(
    mistake: string,
    category: string,
    solution: string,
    fromAgent: string
  ): Message {
    this.logger.info(`Triggering VibeLearn from ${fromAgent}`);

    return {
      id: uuidv4(),
      type: 'vibe_learn',
      from: fromAgent,
      to: 'vibe-check',
      content: 'Learn from mistake',
      mistake,
      category,
      solution,
      metadata: {
        tags: ['#vibe-learn-trigger']
      }
    };
  }

  /**
   * Check if a message should be routed to VibeCheck
   * @param message The message to check
   * @returns Whether the message should be routed to VibeCheck
   */
  shouldRouteToVibeCheck(message: Message): boolean {
    const routeTo = this.router.routeMessage(message);
    return routeTo === 'vibe-check';
  }
}

/**
 * Create a new PromptRouterService
 * @returns A new PromptRouterService
 */
export function createPromptRouterService(): PromptRouterServiceInterface {
  return new PromptRouterService();
}
