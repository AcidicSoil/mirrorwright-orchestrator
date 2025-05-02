import { describe, it, expect } from 'vitest';
import { MessageValidator } from '../../src/validation/MessageValidator';
import { Message } from '../../src/orchestrator/runtime';

describe('MessageValidator', () => {
  const validator = new MessageValidator();

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
});
