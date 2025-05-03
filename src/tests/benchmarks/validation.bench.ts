import { describe, bench } from 'vitest';
import { SchemaValidator } from '../../utils/validateSchema';
import { MessageValidator } from '../../validation/MessageValidator';
import { Message } from '../../orchestrator/runtime';

// Sample data for benchmarking
const sampleMessage: Message = {
  id: 'test-message-1',
  from: 'agent-1',
  to: 'agent-2',
  type: 'test',
  payload: { 
    content: 'Hello, world!',
    data: {
      value: 42,
      nested: {
        property: 'test'
      }
    }
  },
  metadata: {
    priority: 'high',
    tags: ['important', 'test']
  },
  timestamp: Date.now()
};

// Create a large array of similar messages for bulk testing
const generateMessages = (count: number): Message[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...sampleMessage,
    id: `test-message-${i}`,
    timestamp: Date.now() + i
  }));
};

// Sample ritual for schema validation
const sampleRitual = {
  id: 'test-ritual',
  description: 'Test ritual for benchmarking',
  steps: [
    {
      type: 'prompt',
      content: 'Test prompt'
    },
    {
      type: 'action',
      content: 'Test action'
    }
  ]
};

describe('Validation Performance Benchmarks', () => {
  // Benchmark SchemaValidator with and without caching
  describe('SchemaValidator', () => {
    bench('validate ritual without cache', () => {
      const validator = new SchemaValidator({ cacheEnabled: false });
      validator.validate(sampleRitual, 'ritual');
    });

    bench('validate ritual with cache (first run)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      validator.validate(sampleRitual, 'ritual');
    });

    bench('validate ritual with cache (subsequent runs)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      // Prime the cache
      validator.validate(sampleRitual, 'ritual');
      // Benchmark the cached validation
      return () => {
        validator.validate(sampleRitual, 'ritual');
      };
    });
  });

  // Benchmark MessageValidator with and without caching
  describe('MessageValidator', () => {
    bench('validate message without cache', () => {
      const validator = new MessageValidator({ cacheEnabled: false });
      validator.validate(sampleMessage);
    });

    bench('validate message with cache (first run)', () => {
      const validator = new MessageValidator({ cacheEnabled: true });
      validator.validate(sampleMessage);
    });

    bench('validate message with cache (subsequent runs)', () => {
      const validator = new MessageValidator({ cacheEnabled: true });
      // Prime the cache
      validator.validate(sampleMessage);
      // Benchmark the cached validation
      return () => {
        validator.validate(sampleMessage);
      };
    });

    bench('validate 100 similar messages without cache', () => {
      const messages = generateMessages(100);
      const validator = new MessageValidator({ cacheEnabled: false });
      
      for (const message of messages) {
        validator.validate(message);
      }
    });

    bench('validate 100 similar messages with cache', () => {
      const messages = generateMessages(100);
      const validator = new MessageValidator({ cacheEnabled: true });
      
      for (const message of messages) {
        validator.validate(message);
      }
    });
  });

  // Benchmark different cache sizes
  describe('Cache Size Impact', () => {
    bench('small cache (100 entries)', () => {
      const messages = generateMessages(200);
      const validator = new MessageValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 100
      });
      
      for (const message of messages) {
        validator.validate(message);
      }
    });

    bench('medium cache (500 entries)', () => {
      const messages = generateMessages(200);
      const validator = new MessageValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 500
      });
      
      for (const message of messages) {
        validator.validate(message);
      }
    });

    bench('large cache (1000 entries)', () => {
      const messages = generateMessages(200);
      const validator = new MessageValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 1000
      });
      
      for (const message of messages) {
        validator.validate(message);
      }
    });
  });

  // Benchmark different cache expiration times
  describe('Cache Expiration Impact', () => {
    bench('short expiration (10s)', () => {
      const validator = new MessageValidator({ 
        cacheEnabled: true,
        cacheExpirationMs: 10000
      });
      
      for (let i = 0; i < 100; i++) {
        validator.validate({
          ...sampleMessage,
          id: `test-message-${i % 20}` // Reuse 20 different IDs
        });
      }
    });

    bench('medium expiration (60s)', () => {
      const validator = new MessageValidator({ 
        cacheEnabled: true,
        cacheExpirationMs: 60000
      });
      
      for (let i = 0; i < 100; i++) {
        validator.validate({
          ...sampleMessage,
          id: `test-message-${i % 20}` // Reuse 20 different IDs
        });
      }
    });
  });
});
