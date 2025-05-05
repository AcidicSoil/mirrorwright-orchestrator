import { v4 as uuidv4 } from 'uuid';
import { Logger } from './Logger';
import { RuntimeContainer, Message } from '../orchestrator/runtime';
import { VibeCheckParams, VibeDistillParams, VibeLearnParams } from '../services/VibeCheckService';

/**
 * Helper functions for using VibeCheck tools
 */
export class VibeCheckUtils {
  private static logger = new Logger();

  /**
   * Send a message to the VibeCheck agent and wait for a response
   * @param container The runtime container
   * @param message The message to send
   * @param fromAgentId The ID of the agent sending the message
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to the response message
   */
  private static async sendAndWaitForResponse(
    container: RuntimeContainer,
    message: Message,
    fromAgentId: string,
    timeoutMs: number = 30000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a message handler to listen for the response
      const messageHandler = (responseMessage: Message) => {
        // Check if this is a response to our message
        if (
          responseMessage.to === fromAgentId &&
          responseMessage.from === 'vibecheck' &&
          responseMessage.metadata?.inResponseTo === message.id
        ) {
          // Remove the message handler
          container.messageBus.unsubscribe(`${fromAgentId}-response-handler`);
          
          // Resolve with the response content
          resolve(responseMessage.content?.toString() || '');
        }
      };

      // Subscribe to messages
      container.messageBus.subscribe(`${fromAgentId}-response-handler`, messageHandler);

      // Set a timeout
      const timeout = setTimeout(() => {
        // Remove the message handler
        container.messageBus.unsubscribe(`${fromAgentId}-response-handler`);
        
        // Reject with a timeout error
        reject(new Error(`Timeout waiting for response from VibeCheck after ${timeoutMs}ms`));
      }, timeoutMs);

      // Send the message
      container.sendMessage(message)
        .catch(error => {
          // Remove the message handler
          container.messageBus.unsubscribe(`${fromAgentId}-response-handler`);
          
          // Clear the timeout
          clearTimeout(timeout);
          
          // Reject with the error
          reject(error);
        });
    });
  }

  /**
   * Perform a vibe_check operation
   * @param container The runtime container
   * @param params Parameters for vibe_check
   * @param fromAgentId The ID of the agent sending the request
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to the vibe_check result
   */
  static async check(
    container: RuntimeContainer,
    params: VibeCheckParams,
    fromAgentId: string,
    timeoutMs: number = 30000
  ): Promise<string> {
    this.logger.info(`Sending vibe_check request from ${fromAgentId}`);

    // Create the message
    const message: Message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_check',
      content: 'Perform vibe_check',
      metadata: {
        toolType: 'vibe_check',
        params
      }
    };

    // Send the message and wait for a response
    return this.sendAndWaitForResponse(container, message, fromAgentId, timeoutMs);
  }

  /**
   * Perform a vibe_distill operation
   * @param container The runtime container
   * @param params Parameters for vibe_distill
   * @param fromAgentId The ID of the agent sending the request
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to the vibe_distill result
   */
  static async distill(
    container: RuntimeContainer,
    params: VibeDistillParams,
    fromAgentId: string,
    timeoutMs: number = 30000
  ): Promise<string> {
    this.logger.info(`Sending vibe_distill request from ${fromAgentId}`);

    // Create the message
    const message: Message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_distill',
      content: 'Perform vibe_distill',
      metadata: {
        toolType: 'vibe_distill',
        params
      }
    };

    // Send the message and wait for a response
    return this.sendAndWaitForResponse(container, message, fromAgentId, timeoutMs);
  }

  /**
   * Perform a vibe_learn operation
   * @param container The runtime container
   * @param params Parameters for vibe_learn
   * @param fromAgentId The ID of the agent sending the request
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to the vibe_learn result
   */
  static async learn(
    container: RuntimeContainer,
    params: VibeLearnParams,
    fromAgentId: string,
    timeoutMs: number = 30000
  ): Promise<string> {
    this.logger.info(`Sending vibe_learn request from ${fromAgentId}`);

    // Create the message
    const message: Message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_learn',
      content: 'Perform vibe_learn',
      metadata: {
        toolType: 'vibe_learn',
        params
      }
    };

    // Send the message and wait for a response
    return this.sendAndWaitForResponse(container, message, fromAgentId, timeoutMs);
  }

  /**
   * Send a command to the VibeCheck agent
   * @param container The runtime container
   * @param command The command to send
   * @param params Additional parameters for the command
   * @param fromAgentId The ID of the agent sending the command
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to the command result
   */
  static async sendCommand(
    container: RuntimeContainer,
    command: string,
    params: Record<string, any> = {},
    fromAgentId: string,
    timeoutMs: number = 30000
  ): Promise<string> {
    this.logger.info(`Sending command ${command} to VibeCheck from ${fromAgentId}`);

    // Create the message
    const message: Message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'command',
      content: `Execute command: ${command}`,
      metadata: {
        command,
        ...params
      }
    };

    // Send the message and wait for a response
    return this.sendAndWaitForResponse(container, message, fromAgentId, timeoutMs);
  }
}
