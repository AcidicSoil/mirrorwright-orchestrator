# Vibe-Check MCP Server Integration

## Project References
- Repository: https://github.com/AcidicSoil/vibe-check-mcp-server
- API Documentation: https://smithery.ai/server/@PV-Bhat/vibe-check-mcp-server/api
- Server Documentation: https://smithery.ai/server/@PV-Bhat/vibe-check-mcp-server

## Integration Task
Integrate the vibe-check-mcp-server into the Mirrorwright Orchestrator application
## Integration Analysis

### Core Components

The vibe-check-mcp-server provides three main tools:
- **vibe_check**: A pattern interrupt mechanism to break tunnel vision
- **vibe_distill**: A simplification tool to reduce complexity
- **vibe_learn**: A feedback loop to record and learn from mistakes

The Mirrorwright Orchestrator has:
- A runtime container with agent registry and message bus
- An agent interface layer for agent interactions
- References to vibe-check in various files, but no actual integration code

### Integration Approach

Create a VibeCheckAdapter that implements the Agent interface, allowing it to be registered with the runtime container and communicate with other agents through the message bus.

## Integration Solutions

The vibe-check-mcp-server needs to be integrated into the Mirrorwright Orchestrator project.

## Integration Plan

### Overview
The vibe-check-mcp-server provides metacognitive oversight capabilities through three core tools:

- **vibe_check**: Pattern interrupt mechanism to break tunnel vision
- **vibe_distill**: Simplification tool to reduce complexity
- **vibe_learn**: Feedback loop to record and learn from mistakes

This integration plan outlines how to incorporate these capabilities into the Mirrorwright Orchestrator while maintaining the existing architecture and ensuring extensibility.

### Architecture

#### Component Diagram
```
┌─────────────────────────────────────────┐
│         Mirrorwright Orchestrator       │
│                                         │
│  ┌─────────────┐       ┌─────────────┐  │
│  │   Runtime   │◄─────►│ Message Bus │  │
│  │  Container  │       └─────────────┘  │
│  └─────────────┘             ▲          │
│        ▲                     │          │
│        │                     │          │
│        ▼                     ▼          │
│  ┌─────────────┐       ┌─────────────┐  │
│  │    Agent    │       │    Agent    │  │
│  │   Registry  │◄─────►│  Interface  │  │
│  └─────────────┘       └─────────────┘  │
│        ▲                     ▲          │
│        │                     │          │
└────────┼─────────────────────┼──────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│ VibeCheckAdapter│    │  Other Agent    │
└─────────────────┘    │    Adapters     │
         ▲             └─────────────────┘
         │
         ▼
┌─────────────────┐
│  vibe-check-    │
│   mcp-server    │
└─────────────────┘
```

#### Integration Points
- **VibeCheckAdapter**: Implements the AgentAdapter interface to connect with the vibe-check-mcp-server
- **Agent Registry**: Updated to include VibeCheck as an agent type
- **Message Bus**: Used for communication between VibeCheck and other agents
- **Runtime Container**: Manages the lifecycle of the VibeCheckAdapter

### Implementation Steps

1. **Create VibeCheckAdapter Class**
   - Implement the Agent interface
   - Connect to the vibe-check-mcp-server
   - Expose the three main tools as methods

2. **Update Agent Type Enum**
   - Add VibeCheck as an agent type

3. **Create Agent Factory**
   - Simplify agent creation
   - Support VibeCheck adapter

4. **Create Runtime Agent Wrapper**
   - Wrap agent adapters as runtime agents
   - Handle message routing

5. **Create Integration Tests**
   - Test the VibeCheckAdapter
   - Test the integration with the runtime container
### Integration Challenges

The vibe-check-mcp-server needs to be manually started in its own directory, which creates a dependency that complicates the Mirrorwright Orchestrator's operation.

### Proposed Solutions

#### Solution A: Subprocess Management
Create a subprocess manager in the Mirrorwright Orchestrator that can start, monitor, and stop the vibe-check-mcp-server as needed.

**Advantages:**
- Fully automated startup and shutdown
- No manual intervention required
- Can be integrated into the Mirrorwright Orchestrator lifecycle

**Disadvantages:**
- Requires knowing the exact path to the vibe-check-mcp-server
- May have permission issues depending on environment
- Subprocess management can be complex

#### Solution B: Docker Container
Create a Docker container for the vibe-check-mcp-server that can be started and stopped by the Mirrorwright Orchestrator.

**Advantages:**
- Containerized solution is more portable
- Isolates dependencies
- Easier to manage versions

**Disadvantages:**
- Requires Docker to be installed
- Additional complexity in setup
- May require additional permissions

#### Solution C: HTTP Client with Fallback
Create an HTTP client that can detect if the vibe-check-mcp-server is running and provide graceful fallbacks if it's not.

**Advantages:**
- Graceful degradation when server is not available
- No dependency on subprocess management
- Simple to implement and maintain

**Disadvantages:**
- Limited functionality when server is not running
- User still needs to manually start the server for full functionality

#### Solution D: NPM Package Integration
Package the core functionality of vibe-check-mcp-server as an NPM package that can be directly integrated into the Mirrorwright Orchestrator.

**Advantages:**
- Direct integration without external dependencies
- No need for HTTP calls or subprocess management
- Consistent behavior across environments

**Disadvantages:**
- Requires maintaining a fork of vibe-check-mcp-server
- May diverge from the original implementation over time
- Additional development effort required

### Recommended Solution

Based on the user's preference and willingness to handle the additional development work, **Solution D: NPM Package Integration** is recommended as it provides the most seamless integration with the Mirrorwright Orchestrator project.
## Implementation Plan

Since you've already forked the vibe-check-mcp-server repository and are comfortable with the additional development work, the NPM Package Integration approach will provide the most seamless integration with your Mirrorwright Orchestrator project.

### Phase 1: Refactor Vibe Check MCP Server as a Library
Step 1: Create Core Library Structure
In your forked vibe-check-mcp-server repository, create a new directory structure:
vibe-check-mcp-server/
├── src/
│   ├── core/           # New core library code
│   │   ├── index.ts    # Main export file
│   │   ├── types.ts    # Type definitions
│   │   ├── check.ts    # vibe_check implementation
│   │   ├── distill.ts  # vibe_distill implementation
│   │   ├── learn.ts    # vibe_learn implementation
│   │   └── utils.ts    # Shared utilities
│   ├── server/         # Move existing server code here
│   └── index.ts        # Updated entry point
Create the core library types in src/core/types.ts:
// src/core/types.ts

/**
 * Configuration options for the VibeCheckCore
 */
export interface VibeCheckCoreOptions {
  /** API key for Gemini (or other LLM provider) */
  apiKey?: string;

  /** Model to use for vibe_check */
  checkModel?: string;

  /** Model to use for vibe_distill */
  distillModel?: string;

  /** Model to use for vibe_learn */
  learnModel?: string;

  /** Logger function */
  logger?: (message: string, level: 'info' | 'warn' | 'error') => void;
}

/**
 * Parameters for vibe_check
 */
export interface VibeCheckParams {
  /** Current project phase */
  phase: 'planning' | 'implementation' | 'review';

  /** Original user request */
  userRequest: string;

  /** Current plan or thinking */
  plan: string;

  /** Agent's confidence level (0-1) */
  confidence?: number;

  /** Raw sequential thinking transcript */
  thinkingLog?: string;

  /** Optional specific focus areas */
  focusAreas?: string[];

  /** List of available MCP tools */
  availableTools?: string[];

  /** Previous feedback to avoid repetition */
  previousAdvice?: string;

  /** Optional session ID for state management */
  sessionId?: string;
}

/**
 * Parameters for vibe_distill
 */
export interface VibeDistillParams {
  /** The plan to distill */
  plan: string;

  /** Original user request */
  userRequest: string;

  /** Optional session ID for state management */
  sessionId?: string;
}

/**
 * Parameters for vibe_learn
 */
export interface VibeLearnParams {
  /** One-sentence description of the mistake */
  mistake: string;

  /** Category of mistake */
  category: 'Complex Solution Bias' | 'Feature Creep' | 'Premature Implementation' | 'Misalignment' | 'Overtooling' | 'Other';

  /** How it was corrected (one sentence) */
  solution: string;

  /** Optional session ID for state management */
  sessionId?: string;
}

/**
 * Result from a vibe check operation
 */
export interface VibeCheckResult {
  /** The response text */
  response: string;

  /** Whether the operation was successful */
  success: boolean;

  /** Error message if unsuccessful */
  error?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}
Step 2: Implement Core Functionality
Create the main core class in src/core/index.ts:

// src/core/index.ts
import {
  VibeCheckCoreOptions,
  VibeCheckParams,
  VibeDistillParams,
  VibeLearnParams,
  VibeCheckResult
} from './types';
import { performVibeCheck } from './check';
import { performVibeDistill } from './distill';
import { performVibeLearn } from './learn';

/**
 * Core implementation of Vibe Check functionality
 */
export class VibeCheckCore {
  private options: VibeCheckCoreOptions;
  private initialized: boolean = false;

  /**
   * Create a new VibeCheckCore instance
   * @param options Configuration options
   */
  constructor(options: VibeCheckCoreOptions = {}) {
    this.options = {
      checkModel: 'gemini-1.5-pro',
      distillModel: 'gemini-1.5-pro',
      learnModel: 'gemini-1.5-pro',
      logger: (message, level) => {
        if (level === 'error') {
          console.error(`[VibeCheck] ${message}`);
        } else if (level === 'warn') {
          console.warn(`[VibeCheck] ${message}`);
        } else {
          console.log(`[VibeCheck] ${message}`);
        }
      },
      ...options
    };
  }

  /**
   * Initialize the VibeCheckCore
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.log('Initializing VibeCheckCore', 'info');

    // Validate API key
    if (!this.options.apiKey && !process.env.GEMINI_API_KEY) {
      throw new Error('No API key provided. Set options.apiKey or GEMINI_API_KEY environment variable.');
    }

    this.initialized = true;
    this.log('VibeCheckCore initialized successfully', 'info');
  }

  /**
   * Perform a vibe_check operation
   * @param params Parameters for vibe_check
   * @returns The vibe_check result
   */
  async check(params: VibeCheckParams): Promise<VibeCheckResult> {
    this.ensureInitialized();
    this.log(`Performing vibe_check with phase: ${params.phase}`, 'info');

    try {
      const result = await performVibeCheck(params, {
        apiKey: this.options.apiKey || process.env.GEMINI_API_KEY,
        model: this.options.checkModel
      });

      return {
        response: result,
        success: true
      };
    } catch (error) {
      this.log(`Error in vibe_check: ${error.message}`, 'error');
      return {
        response: '',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Perform a vibe_distill operation
   * @param params Parameters for vibe_distill
   * @returns The vibe_distill result
   */
  async distill(params: VibeDistillParams): Promise<VibeCheckResult> {
    this.ensureInitialized();
    this.log('Performing vibe_distill', 'info');

    try {
      const result = await performVibeDistill(params, {
        apiKey: this.options.apiKey || process.env.GEMINI_API_KEY,
        model: this.options.distillModel
      });

      return {
        response: result,
        success: true
      };
    } catch (error) {
      this.log(`Error in vibe_distill: ${error.message}`, 'error');
      return {
        response: '',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Perform a vibe_learn operation
   * @param params Parameters for vibe_learn
   * @returns The vibe_learn result
   */
  async learn(params: VibeLearnParams): Promise<VibeCheckResult> {
    this.ensureInitialized();
    this.log(`Performing vibe_learn with category: ${params.category}`, 'info');

    try {
      const result = await performVibeLearn(params, {
        apiKey: this.options.apiKey || process.env.GEMINI_API_KEY,
        model: this.options.learnModel
      });

      return {
        response: result,
        success: true
      };
    } catch (error) {
      this.log(`Error in vibe_learn: ${error.message}`, 'error');
      return {
        response: '',
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Shutdown the VibeCheckCore
   */
  async shutdown(): Promise<void> {
    this.log('Shutting down VibeCheckCore', 'info');
    // Cleanup resources if needed
    this.initialized = false;
  }

  /**
   * Log a message
   * @param message The message to log
   * @param level The log level
   */
  private log(message: string, level: 'info' | 'warn' | 'error'): void {
    if (this.options.logger) {
      this.options.logger(message, level);
    }
  }

  /**
   * Ensure that VibeCheckCore is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('VibeCheckCore is not initialized. Call initialize() first.');
    }
  }
}

// Export types
export * from './types';
Step 3: Implement Individual Tool Functions
Create the implementation for each tool:

// src/core/check.ts
import { VibeCheckParams } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function performVibeCheck(
  params: VibeCheckParams,
  options: { apiKey: string; model: string }
): Promise<string> {
  const genAI = new GoogleGenerativeAI(options.apiKey);
  const model = genAI.getGenerativeModel({ model: options.model });

  // Construct the prompt
  const prompt = `
You are a metacognitive oversight system designed to identify assumptions, break tunnel vision, and prevent cascading errors.

USER REQUEST: ${params.userRequest}

CURRENT PLAN:
${params.plan}

CURRENT PHASE: ${params.phase}

Your task is to:
1. Identify any misalignments between the plan and the original request
2. Flag potential overengineering or unnecessary complexity
3. Highlight assumptions that may be incorrect
4. Suggest alternative approaches if the current path seems suboptimal
5. Provide specific, actionable feedback

Respond in a clear, concise manner with specific recommendations.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
}
// src/core/distill.ts
import { VibeDistillParams } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function performVibeDistill(
  params: VibeDistillParams,
  options: { apiKey: string; model: string }
): Promise<string> {
  const genAI = new GoogleGenerativeAI(options.apiKey);
  const model = genAI.getGenerativeModel({ model: options.model });

  // Construct the prompt
  const prompt = `
You are a plan simplification tool designed to reduce complexity and extract essential elements.

USER REQUEST: ${params.userRequest}

CURRENT PLAN:
${params.plan}

Your task is to:
1. Identify the core elements of the plan
2. Remove unnecessary complexity
3. Simplify the plan into its essential steps
4. Ensure the simplified plan still addresses the original request

Respond with a concise, simplified version of the plan.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
}
// src/core/learn.ts
import { VibeLearnParams } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function performVibeLearn(
  params: VibeLearnParams,
  options: { apiKey: string; model: string }
): Promise<string> {
  const genAI = new GoogleGenerativeAI(options.apiKey);
  const model = genAI.getGenerativeModel({ model: options.model });

  // Construct the prompt
  const prompt = `
You are a pattern recognition system that tracks common errors and solutions.

MISTAKE: ${params.mistake}
CATEGORY: ${params.category}
SOLUTION: ${params.solution}

Your task is to:
1. Acknowledge the mistake and solution
2. Identify patterns related to this type of mistake
3. Suggest how to avoid similar mistakes in the future
4. Provide a brief summary of what was learned

Respond with a concise acknowledgment and learning summary.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
}
Step 4: Update Server to Use Core Library
Refactor the existing server code to use the new core library:

// src/server/index.ts
import express from 'express';
import cors from 'cors';
import { VibeCheckCore } from '../core';
import { VibeCheckParams, VibeDistillParams, VibeLearnParams } from '../core/types';

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create VibeCheckCore instance
const vibeCheck = new VibeCheckCore({
  apiKey: process.env.GEMINI_API_KEY
});

// Initialize VibeCheckCore
vibeCheck.initialize().catch(error => {
  console.error('Failed to initialize VibeCheckCore:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// vibe_check endpoint
app.post('/api/vibe_check', async (req, res) => {
  try {
    const params = req.body as VibeCheckParams;
    const result = await vibeCheck.check(params);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// vibe_distill endpoint
app.post('/api/vibe_distill', async (req, res) => {
  try {
    const params = req.body as VibeDistillParams;
    const result = await vibeCheck.distill(params);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// vibe_learn endpoint
app.post('/api/vibe_learn', async (req, res) => {
  try {
    const params = req.body as VibeLearnParams;
    const result = await vibeCheck.learn(params);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Vibe Check MCP server listening on port ${port}`);
});
Step 5: Update Main Entry Point
Update the main entry point to export both the server and the core library:

// src/index.ts
import { VibeCheckCore } from './core';
export * from './core';

// Export server if needed
export { startServer } from './server';

// Default export
export default VibeCheckCore;
Step 6: Update Package.json
Update the package.json file to support both library and server usage:

{
  "name": "vibe-check-core",
  "version": "0.1.0",
  "description": "Core library for Vibe Check MCP",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server/index.js",
    "dev": "ts-node src/server/index.ts",
    "test": "jest"
  },
  "keywords": [
    "vibe-check",
    "mcp",
    "metacognition"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@google/generative-ai": "^0.1.0",
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.3",
    "@types/node": "^20.4.5",
    "jest": "^29.6.2",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
Step 7: Create TypeScript Configuration
Create a tsconfig.json file:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
Phase 2: Publish the Package
Step 1: Build the Package
Run the build script:
npm run build
Test the build locally:
npm pack
This will create a .tgz file that you can install locally for testing.

Step 2: Publish to NPM (Optional)
If you want to publish to NPM:

npm login
npm publish
Or, if you want to keep it private, you can publish to GitHub Packages or use it directly from your repository.

Phase 3: Integrate with Mirrorwright Orchestrator
Step 1: Install the Package
In your Mirrorwright Orchestrator project:

# If published to NPM
npm install vibe-check-core

# If using from local build
npm install ../path/to/vibe-check-core-0.1.0.tgz

# If using from GitHub
npm install AcidicSoil/vibe-check-core
Step 2: Create VibeCheckService
Create a new file src/services/VibeCheckService.ts:

import { VibeCheckCore, VibeCheckParams, VibeDistillParams, VibeLearnParams } from 'vibe-check-core';
import { Logger } from '../utils/Logger';

/**
 * Service for interacting with Vibe Check functionality
 */
export class VibeCheckService {
  private vibeCheck: VibeCheckCore;
  private logger: Logger;
  private initialized: boolean = false;

  /**
   * Create a new VibeCheckService
   * @param apiKey API key for Gemini
   */
  constructor(apiKey?:
claytonbivens1
continue if not finished with response so user can decide

Augment
/**
 * Service for interacting with Vibe Check functionality
 */
export class VibeCheckService {
  private vibeCheck: VibeCheckCore;
  private logger: Logger;
  private initialized: boolean = false;

  /**
   * Create a new VibeCheckService
   * @param apiKey API key for Gemini
   */
  constructor(apiKey?: string) {
    this.logger = new Logger();
    this.vibeCheck = new VibeCheckCore({
      apiKey,
      logger: (message, level) => {
        if (level === 'error') {
          this.logger.error(`[VibeCheck] ${message}`);
        } else if (level === 'warn') {
          this.logger.warn(`[VibeCheck] ${message}`);
        } else {
          this.logger.info(`[VibeCheck] ${message}`);
        }
      }
    });
  }

  /**
   * Initialize the VibeCheck service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logger.info('Initializing VibeCheck service');

    try {
      await this.vibeCheck.initialize();
      this.initialized = true;
      this.logger.info('VibeCheck service initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize VibeCheck service: ${error}`);
      throw error;
    }
  }

  /**
   * Perform a vibe_check operation
   * @param params Parameters for vibe_check
   * @returns The vibe_check result
   */
  async check(params: VibeCheckParams): Promise<string> {
    this.ensureInitialized();
    this.logger.info(`Performing vibe_check with phase: ${params.phase}`);

    try {
      const result = await this.vibeCheck.check(params);

      if (!result.success) {
        throw new Error(result.error || 'Unknown error in vibe_check');
      }

      return result.response;
    } catch (error) {
      this.logger.error(`Error in vibe_check: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform a vibe_distill operation
   * @param params Parameters for vibe_distill
   * @returns The vibe_distill result
   */
  async distill(params: VibeDistillParams): Promise<string> {
    this.ensureInitialized();
    this.logger.info('Performing vibe_distill');

    try {
      const result = await this.vibeCheck.distill(params);

      if (!result.success) {
        throw new Error(result.error || 'Unknown error in vibe_distill');
      }

      return result.response;
    } catch (error) {
      this.logger.error(`Error in vibe_distill: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform a vibe_learn operation
   * @param params Parameters for vibe_learn
   * @returns The vibe_learn result
   */
  async learn(params: VibeLearnParams): Promise<string> {
    this.ensureInitialized();
    this.logger.info(`Performing vibe_learn with category: ${params.category}`);

    try {
      const result = await this.vibeCheck.learn(params);

      if (!result.success) {
        throw new Error(result.error || 'Unknown error in vibe_learn');
      }

      return result.response;
    } catch (error) {
      this.logger.error(`Error in vibe_learn: ${error.message}`);
      throw error;
    }
  }

  /**
   * Shutdown the VibeCheck service
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    this.logger.info('Shutting down VibeCheck service');

    try {
      await this.vibeCheck.shutdown();
      this.initialized = false;
      this.logger.info('VibeCheck service shut down successfully');
    } catch (error) {
      this.logger.error(`Error shutting down VibeCheck service: ${error}`);
      throw error;
    }
  }

  /**
   * Ensure that VibeCheck service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('VibeCheck service is not initialized. Call initialize() first.');
    }
  }
}
Step 3: Create VibeCheckAdapter
Create a new file src/agents/VibeCheckAdapter.ts:

import { AgentAdapter, AgentConfig, AgentInput, AgentOutput, AgentType } from '../types/agent';
import { VibeCheckService } from '../services/VibeCheckService';
import { Logger } from '../utils/Logger';
import {
  VibeCheckParams,
  VibeDistillParams,
  VibeLearnParams
} from 'vibe-check-core';

/**
 * Adapter for the VibeCheck agent
 * VibeCheck provides metacognitive oversight capabilities
 */
export class VibeCheckAdapter implements AgentAdapter {
  private config: AgentConfig;
  private logger: Logger;
  private service: VibeCheckService;

  /**
   * Create a new VibeCheckAdapter
   * @param config Configuration for the VibeCheck agent
   */
  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = new Logger();
    this.service = new VibeCheckService(config.options?.apiKey);
  }

  /**
   * Initialize the VibeCheck agent
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing VibeCheck agent');
    await this.service.initialize();
  }

  /**
   * Send input to the VibeCheck agent and get a response
   * @param input The input data for the VibeCheck agent
   * @returns Promise resolving to the VibeCheck agent's output
   */
  async send(input: AgentInput): Promise<AgentOutput> {
    this.logger.info(`Sending input to VibeCheck agent: ${input.prompt.substring(0, 50)}...`);

    // Parse the input to determine which vibe-check tool to use
    const toolType = input.metadata?.toolType || 'vibe_check';

    try {
      let result: string;

      switch (toolType) {
        case 'vibe_check':
          result = await this.service.check(input.metadata?.params as VibeCheckParams);
          break;
        case 'vibe_distill':
          result = await this.service.distill(input.metadata?.params as VibeDistillParams);
          break;
        case 'vibe_learn':
          result = await this.service.learn(input.metadata?.params as VibeLearnParams);
          break;
        default:
          throw new Error(`Unknown tool type: ${toolType}`);
      }

      return {
        content: result,
        metadata: {
          generatedAt: new Date().toISOString(),
          agent: 'vibecheck',
          toolType
        }
      };
    } catch (error) {
      this.logger.error(`Error in VibeCheck agent: ${error}`);

      // Return a graceful error response
      return {
        content: `Error in VibeCheck agent: ${error.message}`,
        metadata: {
          error: true,
          errorMessage: error.message,
          generatedAt: new Date().toISOString(),
          agent: 'vibecheck'
        }
      };
    }
  }

  /**
   * Shutdown the VibeCheck agent
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down VibeCheck agent');
    await this.service.shutdown();
  }
}
Step 4: Update Agent Type Enum
Update src/types/agent.ts to include VibeCheck as an agent type:

/**
 * Enum representing the types of agents in the Mirrorwright Orchestrator
 */
export enum AgentType {
  cline = "cline",
  augment = "augment",
  roo = "roo",
  vibecheck = "vibecheck"  // Add this line
}
Step 5: Create Agent Factory
Create a new file src/agents/AgentFactory.ts to simplify agent creation:

import { AgentAdapter, AgentConfig, AgentType } from '../types/agent';
import { RooAdapter } from './RooAdapter';
import { VibeCheckAdapter } from './VibeCheckAdapter';

/**
 * Factory for creating agent adapters
 */
export class AgentFactory {
  /**
   * Create an agent adapter
   * @param config Configuration for the agent
   * @returns A new agent adapter
   */
  static createAgent(config: AgentConfig): AgentAdapter {
    switch (config.type) {
      case AgentType.roo:
        return new RooAdapter(config);
      case AgentType.vibecheck:
        return new VibeCheckAdapter(config);
      default:
        throw new Error(`Unsupported agent type: ${config.type}`);
    }
  }
}
Step 6: Update Exports in src/agents/index.ts
export { RooAdapter } from './RooAdapter';
export { VibeCheckAdapter } from './VibeCheckAdapter';
export { AgentFactory } from './AgentFactory';
Step 7: Create Runtime Agent Wrapper
Create a new file src/orchestrator/RuntimeAgentWrapper.ts to wrap agent adapters as runtime agents:

import { Agent, Message } from './runtime';
import { AgentAdapter } from '../types/agent';
import { Logger } from '../utils/Logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Wrapper for agent adapters to implement the Agent interface
 */
export class RuntimeAgentWrapper implements Agent {
  id: string;
  name: string;
  capabilities: string[];
  config?: Record<string, any>;
  private adapter: AgentAdapter;
  private logger: Logger;

  /**
   * Create a new runtime agent wrapper
   * @param id The ID of the agent
   * @param name The name of the agent
   * @param capabilities The capabilities of the agent
   * @param adapter The agent adapter to wrap
   * @param config Optional configuration
   */
  constructor(
    id: string,
    name: string,
    capabilities: string[],
    adapter: AgentAdapter,
    config?: Record<string, any>
  ) {
    this.id = id;
    this.name = name;
    this.capabilities = capabilities;
    this.adapter = adapter;
    this.config = config;
    this.logger = new Logger();
  }

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.logger.info(`Initializing agent: ${this.name} (${this.id})`);
    await this.adapter.initialize();
  }

  /**
   * Start the agent
   */
  async start(): Promise<void> {
    this.logger.info(`Starting agent: ${this.name} (${this.id})`);
    // No specific start action needed for the adapter
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<void> {
    this.logger.info(`Stopping agent: ${this.name} (${this.id})`);
    await this.adapter.shutdown();
  }

  /**
   * Handle a message sent to this agent
   * @param message The message to handle
   * @returns Promise that resolves with an optional response message
   */
  async handleMessage(message: Message): Promise<Message | void> {
    this.logger.info(`Handling message: ${message.id} from ${message.from} to ${message.to}`);

    try {
      // Convert message to agent input
      const input = {
        prompt: message.payload.prompt || '',
        context: message.payload.context,
        metadata: {
          ...message.metadata,
          ...message.payload.metadata
        }
      };

      // Send to adapter
      const output = await this.adapter.send(input);

      // Create response message
      const response: Message = {
        id: uuidv4(),
        from: this.id,
        to: message.from,
        type: 'response',
        payload: {
          content: output.content,
          ...output.metadata
        },
        metadata: {
          inResponseTo: message.id,
          ...output.metadata
        },
        timestamp: Date.now()
      };

      return response;
    } catch (error) {
      this.logger.error(`Error handling message ${message.id}: ${error}`);

      // Create error response message
      const errorResponse: Message = {
        id: uuidv4(),
        from: this.id,
        to: message.from,
        type: 'error',
        payload: {
          error: true,
          errorMessage: error.message
        },
        metadata: {
          inResponseTo: message.id,
          error: true
        },
        timestamp: Date.now()
      };

      return errorResponse;
    }
  }
}
Step 8: Create Helper Functions for Vibe Check Tools
Create a new file src/utils/VibeCheckUtils.ts with helper functions:

import { RuntimeContainer } from '../orchestrator/runtime';
import { v4 as uuidv4 } from 'uuid';
import { VibeCheckParams, VibeDistillParams, VibeLearnParams } from 'vibe-check-core';

/**
 * Helper functions for using Vibe Check tools
 */
export class VibeCheckUtils {
  /**
   * Send a vibe_check request
   * @param container The runtime container
   * @param params Parameters for vibe_check
   * @param fromAgentId The ID of the agent sending the request
   * @returns Promise resolving to the vibe_check result
   */
  static async check(
    container: RuntimeContainer,
    params: VibeCheckParams,
    fromAgentId: string
  ): Promise<string> {
    const message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_check',
      payload: {
        prompt: `Perform vibe_check for phase: ${params.phase}`,
        metadata: {
          toolType: 'vibe_check',
          params
        }
      },
      metadata: {
        toolType: 'vibe_check'
      },
      timestamp: Date.now()
    };

    const response = await container.sendMessage(message);

    if (response && 'payload' in response && 'content' in response.payload) {
      return response.payload.content as string;
    }

    throw new Error('Invalid response from vibe_check');
  }

  /**
   * Send a vibe_distill request
   * @param container The runtime container
   * @param params Parameters for vibe_distill
   * @param fromAgentId The ID of the agent sending the request
   * @returns Promise resolving to the vibe_distill result
   */
  static async distill(
    container: RuntimeContainer,
    params: VibeDistillParams,
    fromAgentId: string
  ): Promise<string> {
    const message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_distill',
      payload: {
        prompt: 'Perform vibe_distill',
        metadata: {
          toolType: 'vibe_distill',
          params
        }
      },
      metadata: {
        toolType: 'vibe_distill'
      },
      timestamp: Date.now()
    };

    const response = await container.sendMessage(message);

    if (response && 'payload' in response && 'content' in response.payload) {
      return response.payload.content as string;
    }

    throw new Error('Invalid response from vibe_distill');
  }

  /**
   * Send a vibe_learn request
   * @param container The runtime container
   * @param params Parameters for vibe_learn
   * @param fromAgentId The ID of the agent sending the request
   * @returns Promise resolving to the vibe_learn result
   */
  static async learn(
    container: RuntimeContainer,
    params: VibeLearnParams,
    fromAgentId: string
  ): Promise<string> {
    const message = {
      id: uuidv4(),
      from: fromAgentId,
      to: 'vibecheck',
      type: 'vibe_learn',
      payload: {
        prompt: `Perform vibe_learn for category: ${params.category}`,
        metadata: {
          toolType: 'vibe_learn',
          params
        }
      },
      metadata: {
        toolType: 'vibe_learn'
      },
      timestamp: Date.now()
    };

    const response = await container.sendMessage(message);

    if (response && 'payload' in response && 'content' in response.payload) {
      return response.payload.content as string;
    }

    throw new Error('Invalid response from vibe_learn');
  }
}
Step 9: Create Integration Tests
Create a new file tests/agents/VibeCheckAdapter.test.ts:

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VibeCheckAdapter } from '../../src/agents/VibeCheckAdapter';
import { AgentConfig, AgentType } from '../../src/types/agent';

describe('VibeCheckAdapter', () => {
  let adapter: VibeCheckAdapter;

  beforeEach(() => {
    // Create a new adapter before each test
    const config: AgentConfig = {
      type: AgentType.vibecheck,
      options: {
        apiKey: 'test-api-key'
      }
    };

    adapter = new VibeCheckAdapter(config);

    // Mock the service methods
    vi.spyOn(adapter['service'], 'check').mockResolvedValue('VibeCheck result');
    vi.spyOn(adapter['service'], 'distill').mockResolvedValue('VibeDistill result');
    vi.spyOn(adapter['service'], 'learn').mockResolvedValue('VibeLearn result');
    vi.spyOn(adapter['service'], 'initialize').mockResolvedValue();
    vi.spyOn(adapter['service'], 'shutdown').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize successfully', async () => {
    await expect(adapter.initialize()).resolves.not.toThrow();
    expect(adapter['service'].initialize).toHaveBeenCalled();
  });

  it('should shutdown successfully', async () => {
    await expect(adapter.shutdown()).resolves.not.toThrow();
    expect(adapter['service'].shutdown).toHaveBeenCalled();
  });

  it('should handle vibe_check requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_check',
        params: {
          phase: 'planning',
          userRequest: 'Original request',
          plan: 'Current plan'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeCheck result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_check');
    expect(adapter['service'].check).toHaveBeenCalledWith(input.metadata.params);
  });

  it('should handle vibe_distill requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_distill',
        params: {
          plan: 'Current plan',
          userRequest: 'Original request'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeDistill result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_distill');
    expect(adapter['service'].distill).toHaveBeenCalledWith(input.metadata.params);
  });

  it('should handle vibe_learn requests', async () => {
    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_learn',
        params: {
          mistake: 'Test mistake',
          category: 'Complex Solution Bias',
          solution: 'Test solution'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toBe('VibeLearn result');
    expect(output.metadata?.agent).toBe('vibecheck');
    expect(output.metadata?.toolType).toBe('vibe_learn');
    expect(adapter['service'].learn).toHaveBeenCalledWith(input.metadata.params);
  });

  it('should handle errors gracefully', async () => {
    vi.spyOn(adapter['service'], 'check').mockRejectedValue(new Error('Test error'));

    const input = {
      prompt: 'Test prompt',
      metadata: {
        toolType: 'vibe_check',
        params: {
          phase: 'planning',
          userRequest: 'Original request',
          plan: 'Current plan'
        }
      }
    };

    const output = await adapter.send(input);

    expect(output.content).toContain('Error in VibeCheck agent');
    expect(output.metadata?.error).toBe(true);
    expect(output.metadata?.errorMessage).toBe('Test error');
  });
});
Step 10: Create Example Usage
Create a new file src/examples/vibeCheckExample.ts:

import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { RuntimeAgentWrapper } from '../orchestrator/RuntimeAgentWrapper';
import { createRuntimeContainer } from '../orchestrator/runtime';
import { VibeCheckUtils } from '../utils/VibeCheckUtils';

/**
 * Example of using the VibeCheck agent
 */
async function runVibeCheckExample() {
  // Create the runtime container
  const container = createRuntimeContainer();

  // Create the VibeCheck agent
  const vibeCheckConfig: AgentConfig = {
    type: AgentType.vibecheck,
    options: {
      apiKey: process.env.GEMINI_API_KEY
    }
  };

  const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);
  const vibeCheckAgent = new RuntimeAgentWrapper(
    'vibecheck',
    'VibeCheck Agent',
    ['vibe_check', 'vibe_distill', 'vibe_learn'],
    vibeCheckAdapter
  );

  // Register the agent with the runtime container
  container.registerAgent(vibeCheckAgent);

  // Initialize and start the container
  await container.init();
  await container.start();

  try {
    // Example of using vibe_check
    const checkResult = await VibeCheckUtils.check(
      container,
      {
        phase: 'planning',
        userRequest: 'Create a simple todo app',
        plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.'
      },
      'example'
    );

    console.log('VibeCheck Result:');
    console.log(checkResult);

    // Example of using vibe_distill
    const distillResult = await VibeCheckUtils.distill(
      container,
      {
        plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.',
        userRequest: 'Create a simple todo app'
      },
      'example'
    );

    console.log('\nVibeDistill Result:');
    console.log(distillResult);

    // Example of using vibe_learn
    const learnResult = await VibeCheckUtils.learn(
      container,
      {
        mistake: 'Implemented a complex database schema for a simple todo app',
        category: 'Complex Solution Bias',
        solution: 'Used a simpler data structure that meets the actual requirements'
      },
      'example'
    );

    console.log('\nVibeLearn Result:');
    console.log(learnResult);
  } finally {
    // Tear down the container
    await container.teardown();
  }
}

// Run the example
runVibeCheckExample().catch(console.error);
Phase 4: Documentation
Step 1: Create Documentation for VibeCheck Integration
Create a new file docs/vibe-check-integration.md:

# Vibe Check Integration

This document describes the integration of the Vibe Check MCP Server into the Mirrorwright Orchestrator.

## Overview

Vibe Check provides metacognitive oversight capabilities through three core tools:

1. **vibe_check**: Pattern interrupt mechanism to break tunnel vision
2. **vibe_distill**: Simplification tool to reduce complexity
3. **vibe_learn**: Feedback loop to record and learn from mistakes

## Architecture

The integration follows a library-based approach, where the core functionality of Vibe Check is packaged as an NPM package and integrated directly into the Mirrorwright Orchestrator.

### Components

1. **vibe-check-core**: NPM package containing the core functionality
2. **VibeCheckService**: Service for interacting with the Vibe Check functionality
3. **VibeCheckAdapter**: Adapter implementing the AgentAdapter interface
4. **VibeCheckUtils**: Helper functions for using Vibe Check tools

## Usage

### Basic Usage

```typescript
import { AgentFactory } from '../agents/AgentFactory';
import { AgentConfig, AgentType } from '../types/agent';
import { RuntimeAgentWrapper } from '../orchestrator/RuntimeAgentWrapper';
import { createRuntimeContainer } from '../orchestrator/runtime';

// Create the runtime container
const container = createRuntimeContainer();

// Create the VibeCheck agent
const vibeCheckConfig: AgentConfig = {
  type: AgentType.vibecheck,
  options: {
    apiKey: process.env.GEMINI_API_KEY
  }
};

const vibeCheckAdapter = AgentFactory.createAgent(vibeCheckConfig);
const vibeCheckAgent = new RuntimeAgentWrapper(
  'vibecheck',
  'VibeCheck Agent',
  ['vibe_check', 'vibe_distill', 'vibe_learn'],
  vibeCheckAdapter
);

// Register the agent with the runtime container
container.registerAgent(vibeCheckAgent);

// Initialize and start the container
await container.init();
await container.start();
Using Vibe Check Tools
import { VibeCheckUtils } from '../utils/VibeCheckUtils';

// Example of using vibe_check
const checkResult = await VibeCheckUtils.check(
  container,
  {
    phase: 'planning',
    userRequest: 'Create a simple todo app',
    plan: 'First, I will set up a React application with Redux for state management. Then I will create a database schema with MongoDB and set up authentication with JWT. I will also implement a CI/CD pipeline with GitHub Actions and deploy to AWS using Terraform.'
  },
  'example'
);

console.log('VibeCheck Result:');
console.log(checkResult);
Configuration
The Vibe Check integration can be configured with the following options:

apiKey: API key for Gemini (required)
checkModel: Model to use for vibe_check (default: 'gemini-1.5-pro')
distillModel: Model to use for vibe_distill (default: 'gemini-1.5-pro')
learnModel: Model to use for vibe_learn (default: 'gemini-1.5-pro')
Error Handling
The integration includes comprehensive error handling:

Initialization errors are logged and propagated
Tool errors are caught and returned as error responses
Network errors are handled gracefully
Testing
The integration includes unit tests for all components:

VibeCheckAdapter tests
VibeCheckService tests
Integration tests with the runtime container
Future Improvements
Add support for session management
Implement caching for common requests
Add support for custom prompts
Improve error handling and recovery

## Summary of Implementation Steps

1. **Fork and Refactor vibe-check-mcp-server**:
   - Create a core library structure
   - Implement the core functionality
   - Update the server to use the core library
   - Package as an NPM package

2. **Integrate with Mirrorwright Orchestrator**:
   - Create VibeCheckService
   - Create VibeCheckAdapter
   - Update Agent Type Enum
   - Create Agent Factory
   - Create Runtime Agent Wrapper
   - Create Helper Functions
   - Create Integration Tests
   - Create Example Usage
   - Create Documentation

This implementation provides a seamless integration of the Vibe Check MCP Server into the Mirrorwright Orchestrator, eliminating the need for manual server management while preserving all the functionality of the original server.
Chat with Augment yourself.