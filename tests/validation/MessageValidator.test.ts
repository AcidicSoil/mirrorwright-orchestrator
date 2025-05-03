import { describe, it, expect, beforeEach } from 'vitest';
import { MessageValidator, MessageValidatorOptions } from '../../src/validation/MessageValidator';
import { Message } from '../../src/orchestrator/runtime';

describe('MessageValidator', () => {
  let validator: MessageValidator;

  beforeEach(() => {
    // Create a new validator for each test to ensure clean cache state
    validator = new MessageValidator({
      cacheEnabled: true,
      logPerformance: false
    });
  });

  it('should validate a valid message', () => {
    const validMessage: Message = {
      id: 'msg-1',
      from: 'agent-1',
      to: 'agent-2',
      type: 'test',
      payload: { content: 'Hello!' },
      timestamp: Date.now()
    };

    expect(validator.validate(validMessage)).toBe(true);
    expect(() => validator.validateWithThrow(validMessage)).not.toThrow();
  });

  it('should reject a message with missing required fields', () => {
    const invalidMessage = {
      id: 'msg-1',
      from: 'agent-1',
      // Missing 'to' field
      type: 'test',
      payload: { content: 'Hello!' },
      timestamp: Date.now()
    };

    expect(validator.validate(invalidMessage)).toBe(false);
    expect(() => validator.validateWithThrow(invalidMessage)).toThrow();
  });

  it('should reject a message with invalid field types', () => {
    const invalidMessage = {
      id: 'msg-1',
      from: 'agent-1',
      to: 'agent-2',
      type: 'test',
      payload: 'This should be an object, not a string',
      timestamp: Date.now()
    };

    expect(validator.validate(invalidMessage)).toBe(false);
    expect(() => validator.validateWithThrow(invalidMessage)).toThrow();
  });

  it('should accept a message with optional metadata', () => {
    const validMessage: Message = {
      id: 'msg-1',
      from: 'agent-1',
      to: 'agent-2',
      type: 'test',
      payload: { content: 'Hello!' },
      metadata: { priority: 'high', tags: ['important'] },
      timestamp: Date.now()
    };

    expect(validator.validate(validMessage)).toBe(true);
    expect(() => validator.validateWithThrow(validMessage)).not.toThrow();
  });

  describe('Caching', () => {
    it('should cache validation results', () => {
      const validMessage: Message = {
        id: 'cache-test-1',
        from: 'agent-1',
        to: 'agent-2',
        type: 'test',
        payload: { content: 'Hello!' },
        timestamp: Date.now()
      };

      // First validation should cache the result
      expect(validator.validate(validMessage)).toBe(true);

      // Get cache stats
      const stats = validator.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);

      // Second validation should use the cache
      expect(validator.validate(validMessage)).toBe(true);

      // Check updated stats
      const updatedStats = validator.getCacheStats();
      expect(updatedStats.hits).toBe(1);
      expect(updatedStats.misses).toBe(1);
    });

    it('should cache validation errors', () => {
      const invalidMessage = {
        id: 'cache-test-2',
        from: 'agent-1',
        // Missing 'to' field
        type: 'test',
        payload: { content: 'Hello!' },
        timestamp: Date.now()
      };

      // First validation should cache the error
      expect(validator.validate(invalidMessage)).toBe(false);

      // Second validation should use the cache
      expect(validator.validate(invalidMessage)).toBe(false);

      // Check stats
      const stats = validator.getCacheStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('should clear cache when requested', () => {
      const validMessage: Message = {
        id: 'cache-test-3',
        from: 'agent-1',
        to: 'agent-2',
        type: 'test',
        payload: { content: 'Hello!' },
        timestamp: Date.now()
      };

      // Validate to populate cache
      validator.validate(validMessage);

      // Check cache has entries
      expect(validator.getCacheStats().size).toBeGreaterThan(0);

      // Clear cache
      validator.clearCache();

      // Check cache is empty
      expect(validator.getCacheStats().size).toBe(0);
    });
  });

  describe('Configuration', () => {
    it('should respect cacheEnabled option', () => {
      // Create validator with cache disabled
      const noCache = new MessageValidator({ cacheEnabled: false });

      const validMessage: Message = {
        id: 'config-test-1',
        from: 'agent-1',
        to: 'agent-2',
        type: 'test',
        payload: { content: 'Hello!' },
        timestamp: Date.now()
      };

      // Validate twice
      noCache.validate(validMessage);
      noCache.validate(validMessage);

      // Check no cache hits occurred
      const stats = noCache.getCacheStats();
      expect(stats.enabled).toBe(false);
      expect(stats.hits).toBe(0);
    });

    it('should respect cacheMaxSize option', () => {
      // Create validator with small cache
      const smallCache = new MessageValidator({
        cacheEnabled: true,
        cacheMaxSize: 2
      });

      // Validate 3 different messages
      for (let i = 0; i < 3; i++) {
        smallCache.validate({
          id: `size-test-${i}`,
          from: 'agent-1',
          to: 'agent-2',
          type: 'test',
          payload: { content: `Message ${i}` },
          timestamp: Date.now()
        });
      }

      // Check cache size is limited
      const stats = smallCache.getCacheStats();
      expect(stats.size).toBeLessThanOrEqual(2);
    });
  });
});
