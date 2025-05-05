/**
 * TypeScript interfaces for LangGraph integration
 */

/**
 * Interface for a LangGraph node
 */
export interface LangGraphNode<TInput, TOutput> {
  /**
   * Process input and produce output
   * @param input Input data for the node
   * @returns Output data from the node
   */
  process(input: TInput): Promise<TOutput>;

  /**
   * Initialize the node
   */
  initialize(): Promise<void>;

  /**
   * Clean up resources used by the node
   */
  cleanup(): Promise<void>;
}

/**
 * Configuration for a LangGraph node
 */
export interface LangGraphNodeConfig {
  /**
   * Unique identifier for the node
   */
  id: string;

  /**
   * Human-readable name for the node
   */
  name: string;

  /**
   * Description of the node's functionality
   */
  description?: string;

  /**
   * Maximum execution time in milliseconds
   */
  timeout?: number;

  /**
   * Number of retries on failure
   */
  retries?: number;

  /**
   * Additional configuration options
   */
  options?: Record<string, any>;
}

/**
 * Interface for a LangGraph edge connecting two nodes
 */
export interface LangGraphEdge {
  /**
   * Source node ID
   */
  from: string;

  /**
   * Target node ID
   */
  to: string;

  /**
   * Condition for following this edge
   */
  condition?: (data: any) => boolean;
}

/**
 * Interface for a LangGraph graph
 */
export interface LangGraph {
  /**
   * Nodes in the graph
   */
  nodes: Record<string, LangGraphNode<any, any>>;

  /**
   * Edges connecting nodes
   */
  edges: LangGraphEdge[];

  /**
   * Entry point node ID
   */
  entryNode: string;

  /**
   * Exit point node ID
   */
  exitNode?: string;

  /**
   * Execute the graph with the given input
   * @param input Input data for the graph
   * @returns Output data from the graph
   */
  execute(input: any): Promise<any>;
}
