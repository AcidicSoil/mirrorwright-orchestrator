/**
 * Tests for the PromptRouterService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PromptRouterService } from '../../src/services/PromptRouterService';
import { Router } from '../../src/router/PromptRouter';
import { Message } from '../../src/orchestrator/runtime';
import { v4 as uuidv4 } from 'uuid';

// Mock the PromptRouter
vi.mock('../../src/router/PromptRouter', () => {
  return {
    createPromptRouter: vi.fn().mockImplementation(() => ({
      routeMessage: vi.fn().mockReturnValue('vibe-check'),
      loadRoutingConfigs: vi.fn()
    })),
    Router: vi.fn()
  };
});

describe('PromptRouterService', () => {
  let service: PromptRouterService;
  let mockRouter: Router;

  beforeEach(() => {
    // Create a new service before each test
    service = new PromptRouterService();
    mockRouter = (service as any).router;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should route a message to the appropriate agent', () => {
    // Create a test message
    const message: Message = {
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'I am stuck and need help'
    };

    // Route the message
    const result = service.routeMessage(message);

    // Check that the router was called with the message
    expect(mockRouter.routeMessage).toHaveBeenCalledWith(message);

    // Check that the result is the expected agent ID
    expect(result).toBe('vibe-check');
  });

  it('should trigger VibeCheck with a message', () => {
    // Create a test message
    const message: Message = {
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'I am stuck and need help',
      metadata: {
        tags: ['#test-tag']
      }
    };

    // Trigger VibeCheck
    const result = service.triggerVibeCheck(message, 'test');

    // Check that the result is a valid message
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type', 'vibe_check');
    expect(result).toHaveProperty('from', 'test');
    expect(result).toHaveProperty('to', 'vibe-check');
    expect(result).toHaveProperty('content', 'I am stuck and need help');
    expect(result).toHaveProperty('metadata.tags');
    expect(result.metadata.tags).toContain('#test-tag');
    expect(result.metadata.tags).toContain('#vibe-check-trigger');
  });

  it('should trigger VibeCheck with a plan', () => {
    // Trigger VibeCheck with a plan
    const result = service.triggerVibeCheckWithPlan(
      'First, I will set up a React application with Redux...',
      'Create a simple todo app',
      'planning',
      'test'
    );

    // Check that the result is a valid message
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type', 'vibe_check');
    expect(result).toHaveProperty('from', 'test');
    expect(result).toHaveProperty('to', 'vibe-check');
    expect(result).toHaveProperty('content', 'Check my plan');
    expect(result).toHaveProperty('phase', 'planning');
    expect(result).toHaveProperty('userRequest', 'Create a simple todo app');
    expect(result).toHaveProperty('plan', 'First, I will set up a React application with Redux...');
    expect(result).toHaveProperty('metadata.tags');
    expect(result.metadata.tags).toContain('#vibe-check-trigger');
  });

  it('should trigger VibeDistill with a plan', () => {
    // Trigger VibeDistill
    const result = service.triggerVibeDistill(
      'First, I will set up a React application with Redux...',
      'Create a simple todo app',
      'test'
    );

    // Check that the result is a valid message
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type', 'vibe_distill');
    expect(result).toHaveProperty('from', 'test');
    expect(result).toHaveProperty('to', 'vibe-check');
    expect(result).toHaveProperty('content', 'Distill my plan');
    expect(result).toHaveProperty('userRequest', 'Create a simple todo app');
    expect(result).toHaveProperty('plan', 'First, I will set up a React application with Redux...');
    expect(result).toHaveProperty('metadata.tags');
    expect(result.metadata.tags).toContain('#vibe-distill-trigger');
  });

  it('should trigger VibeLearn with a mistake', () => {
    // Trigger VibeLearn
    const result = service.triggerVibeLearn(
      'Added too many features at once',
      'Feature Creep',
      'Focus on core functionality first',
      'test'
    );

    // Check that the result is a valid message
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type', 'vibe_learn');
    expect(result).toHaveProperty('from', 'test');
    expect(result).toHaveProperty('to', 'vibe-check');
    expect(result).toHaveProperty('content', 'Learn from mistake');
    expect(result).toHaveProperty('mistake', 'Added too many features at once');
    expect(result).toHaveProperty('category', 'Feature Creep');
    expect(result).toHaveProperty('solution', 'Focus on core functionality first');
    expect(result).toHaveProperty('metadata.tags');
    expect(result.metadata.tags).toContain('#vibe-learn-trigger');
  });

  it('should check if a message should be routed to VibeCheck', () => {
    // Create a test message
    const message: Message = {
      id: uuidv4(),
      type: 'text',
      from: 'test',
      content: 'I am stuck and need help'
    };

    // Check if the message should be routed to VibeCheck
    const result = service.shouldRouteToVibeCheck(message);

    // Check that the router was called with the message
    expect(mockRouter.routeMessage).toHaveBeenCalledWith(message);

    // Check that the result is true
    expect(result).toBe(true);
  });
});
