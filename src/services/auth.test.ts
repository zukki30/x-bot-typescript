import { describe, it, expect } from 'vitest';
import { generateAuthHeader } from './auth';
import type { TwitterConfig } from './types';

describe('generateAuthHeader', () => {
  it('should generate a valid OAuth header', () => {
    const config: TwitterConfig = {
      apiKey: 'test_key',
      apiKeySecret: 'test_secret',
      accessToken: 'test_token',
      accessTokenSecret: 'test_token_secret',
      baseUrl: 'https://api.twitter.com/2',
    };

    const header = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets');

    expect(header).toContain('OAuth ');
    expect(header).toContain('oauth_consumer_key="test_key"');
    expect(header).toContain('oauth_token="test_token"');
    expect(header).toContain('oauth_signature_method="HMAC-SHA1"');
    expect(header).toContain('oauth_version="1.0"');
  });
});
