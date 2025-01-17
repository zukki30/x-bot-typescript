import crypto from 'node:crypto';
import type { OAuthParams, TwitterConfig } from './types';

export const generateAuthHeader = (
  config: TwitterConfig,
  method: string,
  url: string,
  params: Record<string, string> = {}
): string => {
  const oauthParams: OAuthParams = {
    oauth_consumer_key: config.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: config.accessToken,
    oauth_version: '1.0',
  };

  const allParams: Record<string, string> = {
    ...params,
    oauth_consumer_key: oauthParams.oauth_consumer_key,
    oauth_nonce: oauthParams.oauth_nonce,
    oauth_signature_method: oauthParams.oauth_signature_method,
    oauth_timestamp: oauthParams.oauth_timestamp,
    oauth_token: oauthParams.oauth_token,
    oauth_version: oauthParams.oauth_version,
  };

  const sortedParams = Object.keys(allParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&');

  const signingKey = `${encodeURIComponent(config.apiKeySecret)}&${encodeURIComponent(
    config.accessTokenSecret
  )}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  return `OAuth ${Object.keys(oauthParams)
    .map((key) => {
      const value = oauthParams[key as keyof OAuthParams];
      return value ? `${encodeURIComponent(key)}="${encodeURIComponent(value)}"` : '';
    })
    .filter(Boolean)
    .join(', ')}`;
};
