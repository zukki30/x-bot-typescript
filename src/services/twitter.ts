import axios from 'axios';
import dotenv from 'dotenv';
import type { TwitterConfig } from './types';
import { formatDateYYYYMMDD } from '../utils/date';
import { generateAuthHeader } from './auth';

dotenv.config();

const createTwitterConfig = (): TwitterConfig => ({
  apiKey: process.env.X_API_KEY || '',
  apiKeySecret: process.env.X_API_KEY_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
  baseUrl: 'https://api.twitter.com/2',
});

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
      return tweet(config, `${formatDateYYYYMMDD(now)} - おはようございます！`);
    },
  };
};
