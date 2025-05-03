# AJV Validation Optimization Guide

This document outlines the performance optimizations implemented for schema validation in the Mirrorwright Orchestrator project.

## Overview

The Mirrorwright Orchestrator uses AJV (Another JSON Schema Validator) for validating various objects against JSON schemas, including:

- Protocol definitions
- Mode definitions
- Ritual definitions
- Messages between agents

To optimize validation performance, we've implemented several strategies:

1. **Schema Compilation Optimization**: Configuring AJV for better performance
2. **Validation Caching**: Caching validation results to avoid redundant validations
3. **Error Formatting**: Improving error messages for better debugging
4. **Performance Monitoring**: Adding metrics to track validation performance

## Optimized Components

### 1. SchemaValidator

The `SchemaValidator` class in `src/utils/validateSchema.ts` has been optimized with:

- **AJV Configuration**: Using optimized settings for better performance
- **Schema Caching**: Precompiling schemas and caching validators
- **Result Caching**: Caching validation results for repeated validations
- **Performance Metrics**: Tracking validation time and cache statistics

### 2. MessageValidator

The `MessageValidator` class in `src/validation/MessageValidator.ts` has been optimized with:

- **Optimized AJV Configuration**: Using performance-focused settings
- **Smart Caching**: Caching validation results with a specialized hash function for messages
- **Cache Management**: Automatic cache cleanup and size limits
- **Detailed Error Formatting**: Better error messages for debugging
- **Performance Monitoring**: Tracking validation time and cache hit rates

## Configuration Options

### SchemaValidator Options

```typescript
{
  cacheEnabled?: boolean;     // Enable/disable caching (default: true)
  cacheMaxSize?: number;      // Maximum cache size (default: 1000)
  cacheExpirationMs?: number; // Cache entry expiration time (default: 60000ms)
}
```

### MessageValidator Options

```typescript
{
  cacheEnabled?: boolean;     // Enable/disable caching (default: true)
  cacheMaxSize?: number;      // Maximum cache size (default: 1000)
  cacheExpirationMs?: number; // Cache entry expiration time (default: 60000ms)
  logPerformance?: boolean;   // Enable performance logging (default: false)
}
```

## Performance Benchmarks

Benchmarks are available in `src/tests/benchmarks/validation.bench.ts` and can be run with:

```bash
pnpm benchmark
```

The benchmarks compare:

- Validation with and without caching
- First-time validation vs. subsequent validations
- Different cache sizes and expiration times
- Bulk validation performance

## Best Practices

### When to Enable Caching

Caching is most effective when:

- The same objects are validated multiple times
- Objects have similar structures
- Validation is on the critical path of performance

### Cache Size Considerations

- **Small Cache (100-200 entries)**: Good for applications with a few repeated validations
- **Medium Cache (500 entries)**: Balanced for most applications
- **Large Cache (1000+ entries)**: For high-throughput applications with many different objects

### Cache Expiration

- **Short (10s)**: For rapidly changing validation requirements
- **Medium (60s)**: Good balance for most applications
- **Long (5min+)**: For stable validation patterns with infrequent changes

## Implementation Details

### Caching Strategy

The caching implementation uses:

1. **Hash Generation**: Creating a unique key for each validated object
2. **Cache Storage**: Using a Map for O(1) lookup performance
3. **Cache Invalidation**: Automatic cleanup of expired entries
4. **Size Management**: Removing oldest entries when the cache exceeds its size limit

### Error Handling

Improved error handling includes:

1. **Formatted Error Messages**: More readable error output
2. **Error Caching**: Storing validation errors in the cache
3. **Detailed Logging**: Better context for debugging

## Future Improvements

Potential future optimizations include:

1. **Schema Partitioning**: Breaking large schemas into smaller parts for faster validation
2. **Parallel Validation**: Using worker threads for validation in high-throughput scenarios
3. **Adaptive Caching**: Dynamically adjusting cache parameters based on usage patterns
4. **Compiled Validators**: Using AJV's code generation for even faster validation

## Conclusion

These optimizations significantly improve validation performance, especially in scenarios with repeated validations of similar objects. The caching mechanism provides a good balance between performance and memory usage, with configurable parameters to adapt to different usage patterns.
