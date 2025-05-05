/**
 * TypeScript interfaces for Computer Use Agent (CUA) actions
 */

/**
 * Types of actions that a CUA can perform
 */
export enum CUActionType {
  OPEN_FILE = 'open_file',
  WRITE_FILE = 'write_file',
  RUN_COMMAND = 'run_command',
  BROWSE_WEB = 'browse_web'
}

/**
 * Base interface for all CUA action payloads
 */
export interface CUActionPayload {
  // Base interface for type safety
}

/**
 * Payload for opening a file
 */
export interface OpenFilePayload extends CUActionPayload {
  path: string;
}

/**
 * Payload for writing to a file
 */
export interface WriteFilePayload extends CUActionPayload {
  path: string;
  content: string;
  append?: boolean;
}

/**
 * Payload for running a command
 */
export interface RunCommandPayload extends CUActionPayload {
  command: string;
  args?: string[];
  cwd?: string;
  timeout?: number;
}

/**
 * Payload for browsing the web
 */
export interface BrowseWebPayload extends CUActionPayload {
  url: string;
}

/**
 * Context information for a CUA action
 */
export interface CUActionContext {
  mode?: string;
  agent_id: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Request for a CUA action
 */
export interface CUActionRequest {
  action_type: CUActionType;
  payload: OpenFilePayload | WriteFilePayload | RunCommandPayload | BrowseWebPayload;
  context?: CUActionContext;
  dry_run?: boolean;
}

/**
 * Status of a CUA action response
 */
export enum CUActionStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Metadata for a CUA action response
 */
export interface CUActionMetadata {
  duration?: number;
  retries?: number;
  environment?: Record<string, any>;
  [key: string]: any;
}

/**
 * Response from a CUA action
 */
export interface CUActionResponse {
  result: string | Record<string, any>;
  status: CUActionStatus;
  metadata?: CUActionMetadata;
}
