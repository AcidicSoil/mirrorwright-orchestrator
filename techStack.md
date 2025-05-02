2. Technology Stack Recommendation
Balance maintainability, ecosystem maturity, and developer ergonomics:

Language & Runtime: TypeScript on Node.js (v18+)

Package Manager: pnpm (fast, disk-efficient)

CLI Framework: oclif or Commander.js

Config & Protocol Files: YAML for readability + JSON Schema for validation

JSON Schemas: AJV for runtime schema enforcement

Testing: Jest + ts-jest (with coverage)

Build & Linting:

typescript compiler

ESLint + Prettier for consistent style

Logging: pino or Winston for structured logs (split-vision logbook)

CI/CD: GitHub Actions with pnpm workflow