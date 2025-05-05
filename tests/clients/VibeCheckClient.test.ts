import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VibeCheckClient } from '../../src/clients/VibeCheckClient';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}));

describe('VibeCheckClient', () => {
  let client: VibeCheckClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Create a new client before each test
    client = new VibeCheckClient({
      baseUrl: 'http://test-server:3000',
      apiKey: 'test-api-key',
      timeout: 5000,
      maxRetries: 2,
      retryDelay: 100
    });

    // Get the mock axios instance
    mockAxiosInstance = (axios.create as any).mock.results[0].value;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an axios instance with the correct configuration', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://test-server:3000',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer test-api-key'
      }
    });
  });

  it('should check health successfully', async () => {
    // Mock the axios request to return a successful response
    mockAxiosInstance.request.mockResolvedValueOnce({
      data: { status: 'ok' }
    });

    const result = await client.checkHealth();

    expect(result).toBe(true);
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/health'
    });
  });

  it('should handle health check failure', async () => {
    // Mock the axios request to throw an error
    mockAxiosInstance.request.mockRejectedValueOnce(new Error('Connection refused'));

    const result = await client.checkHealth();

    expect(result).toBe(false);
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/health'
    });
  });

  it('should perform vibe_check successfully', async () => {
    // Mock the axios request to return a successful response
    mockAxiosInstance.request.mockResolvedValueOnce({
      data: {
        success: true,
        response: 'VibeCheck result'
      }
    });

    const params = {
      phase: 'implementation' as const,
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await client.check(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeCheck result'
    });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/vibe_check',
      data: params
    });
  });

  it('should handle vibe_check failure', async () => {
    // Mock the axios request to throw an error
    mockAxiosInstance.request.mockRejectedValueOnce(new Error('Bad request'));

    const params = {
      phase: 'implementation' as const,
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await client.check(params);

    expect(result).toEqual({
      success: false,
      response: '',
      error: 'vibe_check request failed: Error: Bad request'
    });
  });

  it('should perform vibe_distill successfully', async () => {
    // Mock the axios request to return a successful response
    mockAxiosInstance.request.mockResolvedValueOnce({
      data: {
        success: true,
        response: 'VibeDistill result'
      }
    });

    const params = {
      plan: 'Test plan',
      userRequest: 'Test request'
    };

    const result = await client.distill(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeDistill result'
    });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/vibe_distill',
      data: params
    });
  });

  it('should perform vibe_learn successfully', async () => {
    // Mock the axios request to return a successful response
    mockAxiosInstance.request.mockResolvedValueOnce({
      data: {
        success: true,
        response: 'VibeLearn result'
      }
    });

    const params = {
      mistake: 'Test mistake',
      category: 'Other' as const,
      solution: 'Test solution'
    };

    const result = await client.learn(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeLearn result'
    });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/vibe_learn',
      data: params
    });
  });

  it('should retry failed requests', async () => {
    // Mock the axios request to fail twice and then succeed
    mockAxiosInstance.request
      .mockRejectedValueOnce(new Error('Connection timeout'))
      .mockRejectedValueOnce(new Error('Connection timeout'))
      .mockResolvedValueOnce({
        data: {
          success: true,
          response: 'VibeCheck result after retry'
        }
      });

    const params = {
      phase: 'implementation' as const,
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await client.check(params);

    expect(result).toEqual({
      success: true,
      response: 'VibeCheck result after retry'
    });
    expect(mockAxiosInstance.request).toHaveBeenCalledTimes(3);
  });

  it('should give up after max retries', async () => {
    // Mock the axios request to always fail
    mockAxiosInstance.request.mockRejectedValue(new Error('Connection timeout'));

    const params = {
      phase: 'implementation' as const,
      userRequest: 'Test request',
      plan: 'Test plan'
    };

    const result = await client.check(params);

    expect(result).toEqual({
      success: false,
      response: '',
      error: 'vibe_check request failed: Error: Connection timeout'
    });
    expect(mockAxiosInstance.request).toHaveBeenCalledTimes(client['config'].maxRetries);
  });
});
