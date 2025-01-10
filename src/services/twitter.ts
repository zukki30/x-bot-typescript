import { TwitterApi } from 'twitter-api-v2'
import dotenv from 'dotenv'

dotenv.config()

const client = new TwitterApi({
  appKey: process.env.X_API_KEY || '',
  appSecret: process.env.X_API_KEY_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
})

export class TwitterService {
  private readonly twitterClient: TwitterApi

  constructor() {
    this.twitterClient = client
  }

  async tweet(text: string): Promise<void> {
    try {
      await this.twitterClient.v2.tweet(text)
      console.log('Tweet posted successfully')
    } catch (error) {
      console.error('Error posting tweet:', error)
      throw error
    }
  }

  async tweetGoodMorning(): Promise<void> {
    await this.tweet('おはようございます！')
  }
} 