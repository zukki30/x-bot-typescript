import { Hono } from 'hono';
import type { Request, Response } from '@google-cloud/functions-framework';
import { createTwitterService } from './services/twitter';

export const app = new Hono();
const twitterService = createTwitterService();

app.get('/', (c) => c.text('OK'));

// おはようツイート投稿エンドポイント
app.post('/tweet/morning', async (c) => {
  try {
    await twitterService.tweetGoodMorning();
    return c.json({ status: 'success', message: 'Morning tweet posted successfully' });
  } catch (error) {
    return c.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
});

// お昼ごはんツイート
app.post('/tweet/lunch', async (c) => {
  try {
    await twitterService.tweetLunch();
    return c.json({ status: 'success', message: 'Lunch tweet posted successfully' });
  } catch (error) {
    return c.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
});

// おやすみツイート
app.post('/tweet/night', async (c) => {
  try {
    await twitterService.tweetGoodNight();
    return c.json({ status: 'success', message: 'Good night tweet posted successfully' });
  } catch (error) {
    return c.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
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

export default app;
