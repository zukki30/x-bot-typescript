import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createTwitterService } from './services/twitter';
import type { IncomingMessage, ServerResponse } from 'node:http';

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
export const honoFunction = async (req: IncomingMessage, res: ServerResponse) => {
  const server = serve(app);
  await server.listen(process.env.PORT || 8080);
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
};

export default app;
