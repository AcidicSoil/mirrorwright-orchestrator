import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VibeCheckService, VibeCheckParams, VibeDistillParams, VibeLearnParams } from '../../src/services/VibeCheckService';
import { VibeCheckClient } from '../../src/clients/VibeCheckClient';

// Mock the VibeCheckClient
vi.mock('../../src/clients/VibeCheckClient', () => {
  return {
    VibeCheckClient: vi.fn().mockImplementation(() => ({
      checkHealth: vi.fn().mockResolvedValue(true),
      check: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeCheck result'
      }),
      distill: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeDistill result'
      }),
      learn: vi.fn().mockResolvedValue({
        success: true,
        response: 'VibeLearn result'
      })
    }))
  };
});

describe('VibeCheckService', () => {
  let service: VibeCheckService;
  let mockClient: any;

  beforeEach(() => {
    // Create a new service before each test
    service = new VibeCheckService({
      apiKey: 'test-api-key',
      serverUrl: 'http://test-server:3000',
      timeout: 5000,
      maxRetries: 2,
      enableCaching: true,
      cacheTtl: 60000
    });

    // Get the mock client
    mockClient = (VibeCheckClient as any).mock.results[0].value;

    // Clear mock calls
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a client with the correct configuration', () => {
    expect(VibeCheckClient).toHaveBeenCalledWith({
      baseUrl: 'http://test-server:3000',
      apiKey: 'test-api-key',
      timeout: 5000,
      maxRetries: 2
    });
  });

  it('should initialize the service', async () => {
    await service.initialize();
    expect(mockClient.checkHealth).toHaveBeenCalled();
    expect(service['initialized']).toBe(true);
  });

  it('should throw an error if health check fails', async () => {
    mockClient.checkHealth.mockResolvedValueOnce(false);

    await expect(service.initialize()).rejects.toThrow('VibeCheck server is not healthy');
    expect(service['initialized']).toBe(false);
  });

  it('should perform vibe_check', async () => {
    await service.initialize();

    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await service.check(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeCheck result'
    });
    expect(mockClient.check).toHaveBeenCalledWith(params);
  });

  it('should throw an error if not initialized', async () => {
    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    await expect(service.check(params)).rejects.toThrow('VibeCheck service is not initialized');
  });

  it('should perform vibe_distill', async () => {
    await service.initialize();

    const params: VibeDistillParams = {
      plan: 'Test plan',
      userRequest: 'Test request'
    };

    const result = await service.distill(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeDistill result'
    });
    expect(mockClient.distill).toHaveBeenCalledWith(params);
  });

  it('should perform vibe_learn', async () => {
    await service.initialize();

    const params: VibeLearnParams = {
      mistake: 'Test mistake',
      category: 'Other',
      solution: 'Test solution'
    };

    const result = await service.learn(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeLearn result'
    });
    expect(mockClient.learn).toHaveBeenCalledWith(params);
  });

  it('should cache vibe_check results', async () => {
    await service.initialize();

    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    // First call should use the client
    await service.check(params);
    expect(mockClient.check).toHaveBeenCalledTimes(1);

    // Second call with the same params should use the cache
    await service.check(params);
    expect(mockClient.check).toHaveBeenCalledTimes(1);
  });

  it('should not cache vibe_learn results', async () => {
    await service.initialize();

    const params: VibeLearnParams = {
      mistake: 'Test mistake',
      category: 'Other',
      solution: 'Test solution'
    };

    // First call should use the client
    await service.learn(params);
    expect(mockClient.learn).toHaveBeenCalledTimes(1);

    // Second call with the same params should also use the client
    await service.learn(params);
    expect(mockClient.learn).toHaveBeenCalledTimes(2);
  });

  it('should clear the cache', async () => {
    await service.initialize();

    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    // First call should use the client
    await service.check(params);
    expect(mockClient.check).toHaveBeenCalledTimes(1);

    // Clear the cache
    service.clearCache();

    // Next call should use the client again
    await service.check(params);
    expect(mockClient.check).toHaveBeenCalledTimes(2);
  });

  it('should handle client errors in vibe_check', async () => {
    await service.initialize();

    mockClient.check.mockRejectedValueOnce(new Error('Test error'));

    const params: VibeCheckParams = {
      phase: 'implementation',
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await service.check(params);

    expect(result).toEqual({
      success: false,
      response: '',
      error: 'Error: Test error'
    });
  });

  it('should shutdown the service', async () => {
    await service.initialize();
    await service.shutdown();
    expect(service['initialized']).toBe(false);
    expect(service['cache'].size).toBe(0);
  });
});
