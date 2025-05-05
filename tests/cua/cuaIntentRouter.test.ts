import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DefaultCUAIntentRouter } from '../../src/router/CUAIntentRouter';
import { CUActionType } from '../../src/types/cuaction';

// Mock the Logger
vi.mock('../../src/utils/Logger', () => {
  return {
    Logger: vi.fn().mockImplementation(() => {
      return {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn()
      };
    })
  };
});

describe('DefaultCUAIntentRouter', () => {
  let router: DefaultCUAIntentRouter;

  beforeEach(() => {
    router = new DefaultCUAIntentRouter();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('detectCUAIntent', () => {
    it('should detect file operation intents', () => {
      expect(router.detectCUAIntent('Please open the file config.json')).toBe(true);
      expect(router.detectCUAIntent('Can you read the file for me?')).toBe(true);
      expect(router.detectCUAIntent('Write this content to a file')).toBe(true);
      expect(router.detectCUAIntent('Create a new file called test.txt')).toBe(true);
    });

    it('should detect command execution intents', () => {
      expect(router.detectCUAIntent('Run the command npm install')).toBe(true);
      expect(router.detectCUAIntent('Execute the script build.sh')).toBe(true);
      expect(router.detectCUAIntent('Can you run this shell command?')).toBe(true);
    });

    it('should detect web browsing intents', () => {
      expect(router.detectCUAIntent('Browse to the website example.com')).toBe(true);
      expect(router.detectCUAIntent('Open the URL https://example.com')).toBe(true);
      expect(router.detectCUAIntent('Visit the documentation website')).toBe(true);
    });

    it('should not detect non-CUA intents', () => {
      expect(router.detectCUAIntent('What is the weather today?')).toBe(false);
      expect(router.detectCUAIntent('Tell me a joke')).toBe(false);
      expect(router.detectCUAIntent('What is the capital of France?')).toBe(false);
    });
  });

  describe('extractCUARequest', () => {
    it('should extract file read requests', () => {
      const request = router.extractCUARequest('Please open the file config.json', 'test-agent');
      
      expect(request).not.toBeNull();
      expect(request?.action_type).toBe(CUActionType.OPEN_FILE);
      expect(request?.context?.agent_id).toBe('test-agent');
    });

    it('should extract file write requests', () => {
      const request = router.extractCUARequest('Write "Hello, world!" to a file called test.txt', 'test-agent');
      
      expect(request).not.toBeNull();
      expect(request?.action_type).toBe(CUActionType.WRITE_FILE);
      expect(request?.context?.agent_id).toBe('test-agent');
    });

    it('should extract command execution requests', () => {
      const request = router.extractCUARequest('Run the command npm install', 'test-agent');
      
      expect(request).not.toBeNull();
      expect(request?.action_type).toBe(CUActionType.RUN_COMMAND);
      expect(request?.context?.agent_id).toBe('test-agent');
    });

    it('should extract web browsing requests', () => {
      const request = router.extractCUARequest('Open the URL https://example.com', 'test-agent');
      
      expect(request).not.toBeNull();
      expect(request?.action_type).toBe(CUActionType.BROWSE_WEB);
      expect(request?.context?.agent_id).toBe('test-agent');
    });

    it('should return null for non-CUA intents', () => {
      const request = router.extractCUARequest('What is the weather today?', 'test-agent');
      
      expect(request).toBeNull();
    });
  });
});
