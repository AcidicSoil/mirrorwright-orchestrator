# Mirrorwright Orchestrator Technical Context

## Technology Stack

### Core Technologies

- **TypeScript**: Primary implementation language for type safety and developer experience
- **Node.js**: Runtime environment for server-side execution
- **AJV**: JSON Schema validation for protocol and message validation
- **YAML**: Configuration and protocol definition format
- **JSON Schema**: Schema definition language for validation

### Development Tools

- **npm**: Package management
- **Vitest**: Testing framework
- **ESLint**: Code quality and style enforcement
- **TypeDoc**: API documentation generation
- **Git**: Version control
- **GitHub Actions**: CI/CD pipeline

## Development Environment

### Setup Requirements

1. **Node.js**: v18.x or later
2. **npm**: v9.x or later
3. **Git**: Latest version
4. **VS Code**: Recommended IDE with extensions:
   - ESLint
   - Prettier
   - TypeScript
   - YAML

### Project Structure

```
mirrorwright-orchestrator/
├── src/                    # Source code
│   ├── orchestrator/       # Core orchestration components
│   ├── runtime/            # Runtime container and agent registry
│   ├── protocols/          # Protocol definitions and validators
│   ├── agents/             # Agent implementations
│   └── utils/              # Utility functions and helpers
├── tests/                  # Test suite
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── fixtures/           # Test fixtures
├── docs/                   # Documentation
├── examples/               # Example implementations
├── tools/                  # Development and utility tools
├── prompt_templates/       # Templates for AI assistants
└── cursor-memory-bank/     # Memory bank for development context
```

## Technical Constraints

### Performance Requirements

- **Latency**: Minimal overhead for agent interactions
- **Throughput**: Support for high-volume message processing
- **Memory**: Efficient memory usage for long-running processes

### Compatibility Requirements

- **Node.js Versions**: Support for LTS versions (14.x, 16.x, 18.x)
- **Browser Compatibility**: Support for modern browsers (if client-side components are used)
- **API Compatibility**: Stable APIs with semantic versioning

### Security Requirements

- **Input Validation**: Comprehensive validation of all inputs
- **Isolation**: Proper isolation between agent executions
- **Authentication**: Support for authentication of agents and clients
- **Authorization**: Fine-grained access control for agent operations

## Dependencies

### Core Dependencies

- **typescript**: Type system and compiler
- **ajv**: JSON Schema validation
- **js-yaml**: YAML parsing and serialization
- **uuid**: Unique identifier generation
- **winston**: Logging framework

### Development Dependencies

- **vitest**: Testing framework
- **eslint**: Code quality and style enforcement
- **prettier**: Code formatting
- **typedoc**: API documentation generation
- **ts-node**: TypeScript execution environment

## Deployment Considerations

### Packaging

- **npm Package**: Published as an npm package
- **Docker Image**: Optional containerized deployment

### Runtime Requirements

- **Node.js Runtime**: LTS versions
- **Memory**: Depends on workload, typically 512MB minimum
- **CPU**: Depends on workload, typically 1 core minimum

### Monitoring

- **Logging**: Structured logging with configurable levels
- **Metrics**: Performance and health metrics
- **Tracing**: Distributed tracing for complex workflows
