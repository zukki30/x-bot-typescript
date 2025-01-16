import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import type { Request, Response } from '@google-cloud/functions-framework';
import { TwitterService } from './services/twitter';

export const app = new Hono();
const twitterService = new TwitterService();

app.get('/', (c) => c.text('Hello, Hono!'));

// おはようツイート投稿エンドポイント
app.post('/tweet/morning', async (c) => {
  try {
    await twitterService.tweetGoodMorning();
    return c.json({ message: 'Good morning tweet posted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Failed to post tweet' }, 500);
  }
});

// Google Cloud Functionsのエントリーポイント
export const honoFunction = async (req: Request, res: Response) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  const honoReq = new Request(req.url, {
    method: req.method,
    headers: headers,
    body: req.body,
  });

  const honoRes = await app.fetch(honoReq);
  res.status(honoRes.status);
  honoRes.headers.forEach((value: string, key: string) => res.set(key, value));
  const body = await honoRes.arrayBuffer();
  res.send(Buffer.from(body));
};
