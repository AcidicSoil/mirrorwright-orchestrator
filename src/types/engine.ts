import { ModeDefinition, RitualDefinition } from './protocol';

/**
 * Interface for the Mode Engine
 */
export interface IModeEngine {
  /**
   * Initialize modes from definitions
   * @param modes Array of mode definitions
   */
  initializeModes(modes: ModeDefinition[]): Promise<void>;
  
  /**
   * Get all active modes
   * @returns Record of active modes by ID
   */
  getActiveModes(): Record<string, ModeDefinition>;
  
  /**
   * Activate a specific mode with context
   * @param modeId ID of the mode to activate
   * @param context Context data for the mode
   */
  activateMode(modeId: string, context: Record<string, any>): Promise<void>;
  
  /**
   * Deactivate a specific mode
   * @param modeId ID of the mode to deactivate
   */
  deactivateMode(modeId: string): Promise<void>;
  
  /**
   * Check if a mode is active
   * @param modeId ID of the mode to check
   * @returns True if the mode is active, false otherwise
   */
  isModeActive(modeId: string): boolean;
}

/**
 * Interface for the Ritual Engine
 */
export interface IRitualEngine {
  /**
   * Initialize rituals from definitions
   * @param rituals Record of ritual definitions by ID
   */
  initializeRituals(rituals: Record<string, RitualDefinition>): Promise<void>;
  
  /**
   * Get all available rituals
   * @returns Record of rituals by ID
   */
  getAvailableRituals(): Record<string, RitualDefinition>;
  
  /**
   * Execute a ritual with context
   * @param ritualId ID of the ritual to execute
   * @param context Context data for the ritual execution
   * @returns Result of the ritual execution
   */
  executeRitual(ritualId: string, context: Record<string, any>): Promise<Record<string, any>>;
  
  /**
   * Validate a ritual definition against schema
   * @param ritual Ritual definition to validate
   * @returns True if valid, throws error if invalid
   */
  validateRitual(ritual: RitualDefinition): boolean;
}

/**
 * Error types for engine operations
 */
export enum EngineErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  EXECUTION_ERROR = 'EXECUTION_ERROR',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR'
}

/**
 * Custom error class for engine operations
 */
export class EngineError extends Error {
  type: EngineErrorType;
  
  constructor(message: string, type: EngineErrorType) {
    super(message);
    this.type = type;
    this.name = 'EngineError';
  }
}
