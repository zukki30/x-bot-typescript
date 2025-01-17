import { describe, it, expect, beforeEach } from 'vitest';
import { generateAuthHeader } from './auth';
import type { TwitterConfig } from './types';

describe('generateAuthHeader', () => {
  let config: TwitterConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test_key',
      apiKeySecret: 'test_secret',
      accessToken: 'test_token',
      accessTokenSecret: 'test_token_secret',
      baseUrl: 'https://api.twitter.com/2',
    };
  });

  it('should generate a valid OAuth header', () => {
    const header = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets');

    expect(header).toContain('OAuth ');
    expect(header).toContain('oauth_consumer_key="test_key"');
    expect(header).toContain('oauth_token="test_token"');
    expect(header).toContain('oauth_signature_method="HMAC-SHA1"');
    expect(header).toContain('oauth_version="1.0"');
    expect(header).toMatch(/oauth_nonce="[a-f0-9]{32}"/);
    expect(header).toMatch(/oauth_timestamp="\d+"/);
    expect(header).toMatch(/oauth_signature="[^"]+"/);
  });

  it('should include additional params in signature calculation', () => {
    const params = { status: 'Hello World' };
    const header1 = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets');
    const header2 = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets', params);

    expect(header1).not.toBe(header2);
  });

  it('should handle different HTTP methods', () => {
    const headerPost = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets');
    const headerGet = generateAuthHeader(config, 'GET', 'https://api.twitter.com/2/tweets');

    expect(headerPost).not.toBe(headerGet);
  });

  it('should handle different URLs', () => {
    const header1 = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/tweets');
    const header2 = generateAuthHeader(config, 'POST', 'https://api.twitter.com/2/users');

    expect(header1).not.toBe(header2);
  });
});
