# Strategic AI Prompt Template for GPT-4.5

## Context
The Mirrorwright Orchestrator project has made significant progress with the implementation of the runtime container module, including the Agent Registry, Message Bus (both Simple and Advanced implementations), and basic message validation. We've established the core interfaces and implemented the foundational components for agent lifecycle management and message routing. Recently, we've added assistant prompts for protocol optimization and validation specialists.

## Question/Task
How can we enhance the MessageValidator to implement a more sophisticated caching mechanism that optimizes validation performance for high-throughput scenarios while maintaining type safety? Specifically, we need a design for a caching layer that can efficiently handle repeated validation of similar message structures without compromising validation accuracy.

## Current Approach
Currently, our MessageValidator uses AJV to validate messages against a JSON schema, but it creates a new validator instance for each validation and doesn't implement any caching. This approach works for basic scenarios but may become a performance bottleneck in high-throughput environments where similar messages are frequently validated.

```typescript
export class MessageValidator {
  private validator: ValidateFunction;
  private logger: Logger;

  constructor() {
    const ajv = new Ajv({ allErrors: true });
    this.validator = ajv.compile(messageSchema);
    this.logger = new Logger();
  }

  public validate(message: unknown): message is Message {
    const valid = this.validator(message);

    if (!valid && this.validator.errors) {
      this.logger.error(`Message validation failed: ${JSON.stringify(this.validator.errors)}`);
    }

    return !!valid;
  }

  public validateWithThrow(message: unknown): asserts message is Message {
    const valid = this.validator(message);

    if (!valid && this.validator.errors) {
      const errorMessage = `Message validation failed: ${JSON.stringify(this.validator.errors)}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
```

## Constraints

- Must maintain compatibility with the existing MessageValidator interface
- Must work with AJV validation library
- Must provide detailed error messages for validation failures
- Must be thread-safe and handle concurrent validation requests
- Must be configurable (cache size, expiration policy)
- Must support TypeScript strict mode and maintain type safety
- Should minimize memory usage while maximizing performance

## Expected Output

A detailed design for an enhanced MessageValidator with caching capabilities, including:

1. Architecture diagram or description of the caching mechanism
2. TypeScript interface and implementation code for the enhanced validator
3. Strategy for cache key generation and invalidation
4. Performance considerations and tradeoffs
5. Recommendations for configuration options (cache size, TTL, etc.)
6. Example usage in the context of the RuntimeContainer
