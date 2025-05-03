# Codebase Utilization Configuration

This document outlines the configuration for codebase utilization in the Mirrorwright Orchestrator project.

## Overview

The Mirrorwright Orchestrator codebase is organized to support protocol-driven multi-agent orchestration. This configuration guide helps developers understand how to effectively utilize the codebase for development, testing, and deployment.

## Directory Structure

```
mirrorwright-orchestrator/
├── docs/                        # High-level design docs, diagrams
├── protocols/                   # User-defined protocol files (YAML/JSON/MD)
│   └── default-protocol.yaml
├── src/
│   ├── engine/                  # Core execution & mode/ritual engine
│   ├── orchestrator/            # Runtime container for agent orchestration
│   ├── agents/                  # Agent interface layer abstractions
│   ├── cli/                     # CLI entrypoint & commands
│   ├── examples/                # Example implementations
│   ├── schemas/                 # JSON Schema definitions
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Shared helpers (config loading, logging)
├── tests/                       # Unit & integration tests
└── examples/                    # Sample protocols & ritual runs
```

## Development Workflow

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/AcidicSoil/mirrorwright-orchestrator.git
   cd mirrorwright-orchestrator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm build
   ```

### Running the Project

1. Run in development mode:
   ```bash
   pnpm dev
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

3. Validate schemas:
   ```bash
   pnpm validate:schema
   ```

### Working with Protocols

Protocols are defined in YAML files in the `protocols` directory. Each protocol consists of:

1. **Modes**: Defined in `protocols/default/modes/`
2. **Rituals**: Defined in `protocols/default/rituals/`
3. **Templates**: Defined in `protocols/default/templates/`

To validate a protocol:

```bash
pnpm validate:protocol -- --file protocols/default-protocol.yaml
```

### Working with the Schema Validation System

The schema validation system is based on AJV and supports:

1. **Protocol Schemas**: Defined in `src/schemas/protocol.schema.json`
2. **Mode Schemas**: Defined in `src/schemas/mode.schema.json`
3. **Ritual Schemas**: Defined in `src/schemas/ritual.schema.json`

To validate a specific schema type:

```bash
pnpm validate:mode -- --file protocols/default/modes/meta-thinking.yaml
pnpm validate:ritual -- --file protocols/default/rituals/init-reflection.yaml
```

## Integration with Assistant Prompts

The codebase is designed to work with assistant prompts generated from conversation logs. The integration points are:

1. **Protocol Templates**: Templates in `protocols/default/templates/` can reference assistant prompts
2. **Ritual Steps**: Ritual steps can use assistant prompts as templates
3. **Mode Configurations**: Modes can specify which assistants to use for different steps

## Best Practices

1. **Schema-First Development**: Define schemas before implementing features
2. **Test-Driven Development**: Write tests before implementing features
3. **Protocol-Driven Design**: Design protocols before implementing the engine
4. **Modular Architecture**: Keep components modular and focused on a single responsibility
5. **Documentation**: Document all components, interfaces, and protocols

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**: Check the schema definition and ensure the protocol file matches the schema
2. **Runtime Errors**: Check the logs for error messages and stack traces
3. **Build Errors**: Ensure all dependencies are installed and TypeScript is configured correctly

### Debugging

1. **Debug Logging**: Enable debug logging by setting the `LOG_LEVEL` environment variable:
   ```bash
   LOG_LEVEL=debug pnpm dev
   ```

2. **Verbose Validation**: Enable verbose validation output:
   ```bash
   pnpm validate:schema -- --verbose
   ```

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [AJV Documentation](https://ajv.js.org/guide/getting-started.html)
- [YAML Specification](https://yaml.org/spec/1.2/spec.html)
- [JSON Schema Specification](https://json-schema.org/specification.html)
