import { describe, bench } from 'vitest';
import { SchemaValidator } from '../../src/utils/validateSchema';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

// Path to test fixtures
const validFixturesPath = resolve(__dirname, '../fixtures/valid');

// Load sample data for benchmarking
const sampleProtocolPath = resolve(validFixturesPath, 'protocols/default-protocol.yaml');
const sampleModePath = resolve(validFixturesPath, 'modes/meta-thinking.yaml');
const sampleRitualPath = resolve(validFixturesPath, 'rituals/init-reflection.yaml');

const sampleProtocol = yaml.load(readFileSync(sampleProtocolPath, 'utf-8'));
const sampleMode = yaml.load(readFileSync(sampleModePath, 'utf-8'));
const sampleRitual = yaml.load(readFileSync(sampleRitualPath, 'utf-8'));

describe('Protocol Validator Performance Benchmarks', () => {
  // Benchmark SchemaValidator with and without caching
  describe('SchemaValidator - Protocol', () => {
    bench('validate protocol without cache', () => {
      const validator = new SchemaValidator({ cacheEnabled: false });
      validator.validate(sampleProtocol, 'protocol');
    });

    bench('validate protocol with cache (first run)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      validator.validate(sampleProtocol, 'protocol');
    });

    bench('validate protocol with cache (subsequent runs)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      // Prime the cache
      validator.validate(sampleProtocol, 'protocol');
      // Benchmark the cached validation
      return () => {
        validator.validate(sampleProtocol, 'protocol');
      };
    });
  });

  // Benchmark SchemaValidator with and without caching for modes
  describe('SchemaValidator - Mode', () => {
    bench('validate mode without cache', () => {
      const validator = new SchemaValidator({ cacheEnabled: false });
      validator.validate(sampleMode, 'mode');
    });

    bench('validate mode with cache (first run)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      validator.validate(sampleMode, 'mode');
    });

    bench('validate mode with cache (subsequent runs)', () => {
      const validator = new SchemaValidator({ cacheEnabled: true });
      // Prime the cache
      validator.validate(sampleMode, 'mode');
      // Benchmark the cached validation
      return () => {
        validator.validate(sampleMode, 'mode');
      };
    });
  });

  // Benchmark SchemaValidator with and without caching for rituals
  describe('SchemaValidator - Ritual', () => {
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

  // Benchmark different cache expiration times
  describe('Cache Expiration Impact', () => {
    bench('short expiration (10s)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheExpirationMs: 10000
      });
      
      for (let i = 0; i < 10; i++) {
        validator.validate(sampleProtocol, 'protocol');
        validator.validate(sampleMode, 'mode');
        validator.validate(sampleRitual, 'ritual');
      }
    });

    bench('medium expiration (60s)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheExpirationMs: 60000
      });
      
      for (let i = 0; i < 10; i++) {
        validator.validate(sampleProtocol, 'protocol');
        validator.validate(sampleMode, 'mode');
        validator.validate(sampleRitual, 'ritual');
      }
    });

    bench('long expiration (300s)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheExpirationMs: 300000
      });
      
      for (let i = 0; i < 10; i++) {
        validator.validate(sampleProtocol, 'protocol');
        validator.validate(sampleMode, 'mode');
        validator.validate(sampleRitual, 'ritual');
      }
    });
  });

  // Benchmark cache size impact
  describe('Cache Size Impact', () => {
    bench('small cache (100 entries)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 100
      });
      
      for (let i = 0; i < 200; i++) {
        // Create slightly different objects to test cache behavior
        validator.validate({
          ...sampleProtocol,
          id: `protocol-${i % 150}` // Create 150 different IDs to test cache eviction
        }, 'protocol');
      }
    });

    bench('medium cache (1000 entries)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 1000
      });
      
      for (let i = 0; i < 200; i++) {
        validator.validate({
          ...sampleProtocol,
          id: `protocol-${i % 150}`
        }, 'protocol');
      }
    });

    bench('large cache (10000 entries)', () => {
      const validator = new SchemaValidator({ 
        cacheEnabled: true,
        cacheMaxSize: 10000
      });
      
      for (let i = 0; i < 200; i++) {
        validator.validate({
          ...sampleProtocol,
          id: `protocol-${i % 150}`
        }, 'protocol');
      }
    });
  });
});
