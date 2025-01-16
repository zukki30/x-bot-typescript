import axios from 'axios'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

interface OAuthParams {
  oauth_consumer_key: string
  oauth_nonce: string
  oauth_signature_method: string
  oauth_timestamp: string
  oauth_token: string
  oauth_version: string
  oauth_signature?: string
}

export class TwitterService {
  private readonly apiKey: string
  private readonly apiKeySecret: string
  private readonly accessToken: string
  private readonly accessTokenSecret: string
  private readonly baseUrl = 'https://api.twitter.com/2'

  constructor() {
    this.apiKey = process.env.X_API_KEY || ''
    this.apiKeySecret = process.env.X_API_KEY_SECRET || ''
    this.accessToken = process.env.X_ACCESS_TOKEN || ''
    this.accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET || ''
  }

  private generateAuthHeader(method: string, url: string, params: Record<string, string> = {}): string {
    const oauthParams: OAuthParams = {
      oauth_consumer_key: this.apiKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: this.accessToken,
      oauth_version: '1.0'
    }

    const allParams: Record<string, string> = { 
      ...params,
      oauth_consumer_key: oauthParams.oauth_consumer_key,
      oauth_nonce: oauthParams.oauth_nonce,
      oauth_signature_method: oauthParams.oauth_signature_method,
      oauth_timestamp: oauthParams.oauth_timestamp,
      oauth_token: oauthParams.oauth_token,
      oauth_version: oauthParams.oauth_version
    }

    const sortedParams = Object.keys(allParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
      .join('&')

    const signatureBaseString = [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(sortedParams)
    ].join('&')

    const signingKey = `${encodeURIComponent(this.apiKeySecret)}&${encodeURIComponent(this.accessTokenSecret)}`
    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64')

    oauthParams.oauth_signature = signature

    return 'OAuth ' + Object.keys(oauthParams)
      .map(key => {
        const value = oauthParams[key as keyof OAuthParams]
        return value ? `${encodeURIComponent(key)}="${encodeURIComponent(value)}"` : ''
      })
      .filter(Boolean)
      .join(', ')
  }

  async tweet(text: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/tweets`
      const authHeader = this.generateAuthHeader('POST', url)

      await axios.post(
        url,
        { text },
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        }
      )
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