/**
 * Interface for assistant rules
 */
export interface IAssistantRule {
  /**
   * The name of the assistant (e.g., "augment", "cline", "roo")
   */
  name: string;

  /**
   * A brief description of the assistant's purpose
   */
  description: string;

  /**
   * The version of the assistant rule (e.g., "1.0.0")
   */
  version: string;

  /**
   * A detailed description of the assistant's role in the system
   */
  role: string;

  /**
   * A list of the assistant's primary responsibilities
   */
  responsibilities: string[];

  /**
   * Description of the expected response format
   */
  responseFormat: {
    /**
     * Description of the expected response structure
     */
    structure: string;

    /**
     * Examples of properly formatted responses
     */
    examples: string[];
  };

  /**
   * How the assistant should interact with humans and other assistants
   */
  interactionPatterns: {
    /**
     * How the assistant should interact with human users
     */
    withHuman: string;

    /**
     * How the assistant should interact with other assistants
     */
    withAssistants: Record<string, string>;
  };

  /**
   * Guidelines for how the assistant should handle errors
   */
  errorHandling: string;

  /**
   * Guidelines for how the assistant should preserve context
   */
  contextPreservation: string;

  /**
   * Additional metadata about the assistant
   */
  metadata?: Record<string, any>;

  /**
   * Tags for categorizing the assistant
   */
  tags?: string[];

  /**
   * YAML frontmatter for prompt templates
   */
  frontmatter?: {
    agent: string;
    purpose: string;
    id: string;
    version: string;
  };
}
