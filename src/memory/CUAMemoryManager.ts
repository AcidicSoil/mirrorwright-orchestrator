import { Logger } from '../utils/Logger';
import { CUActionRequest, CUActionResponse, CUActionType } from '../types/cuaction';

/**
 * Interface for managing CUA action memory
 */
export interface CUAMemoryManager {
  /**
   * Record a CUA action and its result
   * @param request The CUA action request
   * @param response The CUA action response
   * @returns A unique identifier for the recorded action
   */
  recordAction(request: CUActionRequest, response: CUActionResponse): Promise<string>;

  /**
   * Get the history of CUA actions
   * @param limit Maximum number of actions to retrieve
   * @param filter Optional filter criteria
   * @returns Array of recorded actions
   */
  getActionHistory(limit?: number, filter?: CUAActionFilter): Promise<CUAActionRecord[]>;

  /**
   * Get a specific CUA action by ID
   * @param actionId The action ID
   * @returns The action record, or null if not found
   */
  getActionById(actionId: string): Promise<CUAActionRecord | null>;
}

/**
 * Filter criteria for CUA actions
 */
export interface CUAActionFilter {
  /**
   * Filter by action type
   */
  actionType?: CUActionType;

  /**
   * Filter by agent ID
   */
  agentId?: string;

  /**
   * Filter by status
   */
  status?: 'success' | 'error';

  /**
   * Filter by time range (start)
   */
  startTime?: Date;

  /**
   * Filter by time range (end)
   */
  endTime?: Date;
}

/**
 * Record of a CUA action
 */
export interface CUAActionRecord {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * The action request
   */
  request: CUActionRequest;

  /**
   * The action response
   */
  response: CUActionResponse;

  /**
   * Timestamp when the action was recorded
   */
  timestamp: Date;

  /**
   * Tags for the action
   */
  tags?: string[];
}

/**
 * Default implementation of the CUA memory manager
 */
export class DefaultCUAMemoryManager implements CUAMemoryManager {
  private logger: Logger;
  private actionRecords: CUAActionRecord[] = [];

  constructor() {
    this.logger = new Logger();
  }

  async recordAction(request: CUActionRequest, response: CUActionResponse): Promise<string> {
    const actionId = this.generateActionId();
    
    const record: CUAActionRecord = {
      id: actionId,
      request,
      response,
      timestamp: new Date(),
      tags: this.generateTags(request, response)
    };
    
    this.actionRecords.push(record);
    this.logger.info(`Recorded CUA action: ${actionId}`);
    
    // TODO: Implement persistent storage
    
    return actionId;
  }

  async getActionHistory(limit: number = 100, filter?: CUAActionFilter): Promise<CUAActionRecord[]> {
    let filteredRecords = this.actionRecords;
    
    // Apply filters if provided
    if (filter) {
      if (filter.actionType) {
        filteredRecords = filteredRecords.filter(record => 
          record.request.action_type === filter.actionType
        );
      }
      
      if (filter.agentId) {
        filteredRecords = filteredRecords.filter(record => 
          record.request.context?.agent_id === filter.agentId
        );
      }
      
      if (filter.status) {
        filteredRecords = filteredRecords.filter(record => 
          record.response.status.toLowerCase() === filter.status
        );
      }
      
      if (filter.startTime) {
        filteredRecords = filteredRecords.filter(record => 
          record.timestamp >= filter.startTime!
        );
      }
      
      if (filter.endTime) {
        filteredRecords = filteredRecords.filter(record => 
          record.timestamp <= filter.endTime!
        );
      }
    }
    
    // Sort by timestamp (newest first) and limit the results
    return filteredRecords
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getActionById(actionId: string): Promise<CUAActionRecord | null> {
    const record = this.actionRecords.find(record => record.id === actionId);
    return record || null;
  }

  /**
   * Generate a unique ID for an action
   * @returns A unique ID
   */
  private generateActionId(): string {
    return `cua-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate tags for an action based on the request and response
   * @param request The CUA action request
   * @param response The CUA action response
   * @returns Array of tags
   */
  private generateTags(request: CUActionRequest, response: CUActionResponse): string[] {
    const tags: string[] = [];
    
    // Add tag for action type
    tags.push(`cu-action-${request.action_type}`);
    
    // Add tag for status
    tags.push(`status-${response.status.toLowerCase()}`);
    
    // Add tag for agent
    if (request.context?.agent_id) {
      tags.push(`agent-${request.context.agent_id}`);
    }
    
    // Add tag for dry run
    if (request.dry_run) {
      tags.push('dry-run');
    }
    
    return tags;
  }
}
