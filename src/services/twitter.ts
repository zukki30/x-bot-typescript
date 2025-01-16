import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config();

interface OAuthParams {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_token: string;
  oauth_version: string;
  oauth_signature?: string;
}

interface TwitterConfig {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
  baseUrl: string;
}

const createTwitterConfig = (): TwitterConfig => ({
  apiKey: process.env.X_API_KEY || '',
  apiKeySecret: process.env.X_API_KEY_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
  baseUrl: 'https://api.twitter.com/2',
});

const generateAuthHeader = (
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

const formatDate = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const tweet = async (config: TwitterConfig, text: string): Promise<void> => {
  try {
    const url = `${config.baseUrl}/tweets`;
    const authHeader = generateAuthHeader(config, 'POST', url);

    await axios.post(
      url,
      { text },
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Tweet posted successfully');
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
};

export const createTwitterService = () => {
  const config = createTwitterConfig();

  return {
    tweet: (text: string) => tweet(config, text),
    tweetGoodMorning: () => {
      const now = new Date();
      return tweet(config, `おはようございます！ (${formatDate(now)})`);
    },
  };
};
