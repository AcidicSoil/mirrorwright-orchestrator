import { Logger } from '../utils/Logger';
import { ModeDefinition } from '../types/protocol';
import { EngineError, EngineErrorType, IModeEngine } from '../types/engine';
import { schemaValidator } from '../utils/validateSchema';

/**
 * Engine responsible for managing modes and their lifecycle
 */
export class ModeEngine implements IModeEngine {
  private logger: Logger;
  private activeModes: Record<string, ModeDefinition> = {};

  /**
   * Create a new ModeEngine instance
   */
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Initialize modes from definitions
   * @param modes Array of mode definitions
   * @throws EngineError if validation fails or initialization fails
   */
  public async initializeModes(modes: ModeDefinition[]): Promise<void> {
    this.logger.info('Initializing modes...');

    try {
      // Validate each mode against schema
      for (const mode of modes) {
        try {
          schemaValidator.validate(mode, 'mode');
        } catch (error) {
          throw new EngineError(
            `Invalid mode detected (${mode.id}): ${error instanceof Error ? error.message : String(error)}`,
            EngineErrorType.VALIDATION_ERROR
          );
        }
      }

      // Store modes
      this.activeModes = modes.reduce((acc: Record<string, ModeDefinition>, mode: ModeDefinition) => {
        acc[mode.id] = mode;
        return acc;
      }, {});

      this.logger.info(`Initialized ${modes.length} modes successfully.`);
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }

      throw new EngineError(
        `Failed to initialize modes: ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.INITIALIZATION_ERROR
      );
    }
  }

  /**
   * Get all active modes
   * @returns Record of active modes by ID
   */
  public getActiveModes(): Record<string, ModeDefinition> {
    return { ...this.activeModes };
  }

  /**
   * Check if a mode is active
   * @param modeId ID of the mode to check
   * @returns True if the mode is active, false otherwise
   */
  public isModeActive(modeId: string): boolean {
    return !!this.activeModes[modeId];
  }

  /**
   * Activate a specific mode with context
   * @param modeId ID of the mode to activate
   * @param context Context data for the mode
   * @throws EngineError if mode not found or activation fails
   */
  public async activateMode(modeId: string, context: Record<string, any>): Promise<void> {
    try {
      const mode = this.activeModes[modeId];
      if (!mode) {
        throw new EngineError(
          `Mode '${modeId}' not found.`,
          EngineErrorType.NOT_FOUND_ERROR
        );
      }

      // Apply context modifiers if they exist
      const modifiedContext = {
        ...context,
        ...(mode.config || {})
      };

      this.logger.info(`Activating mode '${modeId}' with context: ${JSON.stringify(modifiedContext, null, 2)}`);

      // TODO: Integrate with mode-specific activation logic
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }

      throw new EngineError(
        `Failed to activate mode '${modeId}': ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }

  /**
   * Deactivate a specific mode
   * @param modeId ID of the mode to deactivate
   * @throws EngineError if mode not found or deactivation fails
   */
  public async deactivateMode(modeId: string): Promise<void> {
    try {
      const mode = this.activeModes[modeId];
      if (!mode) {
        throw new EngineError(
          `Mode '${modeId}' not found.`,
          EngineErrorType.NOT_FOUND_ERROR
        );
      }

      this.logger.info(`Deactivating mode '${modeId}'`);

      // TODO: Integrate with mode-specific deactivation logic

      delete this.activeModes[modeId];
    } catch (error) {
      // Re-throw EngineErrors, wrap others
      if (error instanceof EngineError) {
        throw error;
      }

      throw new EngineError(
        `Failed to deactivate mode '${modeId}': ${error instanceof Error ? error.message : String(error)}`,
        EngineErrorType.EXECUTION_ERROR
      );
    }
  }
}
