import { Hono } from 'hono';
import { createTwitterService } from './services/twitter';
import { serve } from '@hono/node-server';

const app = new Hono();
const twitterService = createTwitterService();

// Cloud Functions用のエクスポート
export const honoFunction = app.fetch;
// テスト用にappをエクスポート
export default app;

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

// Cloud Run用のサーバー起動
if (process.env.K_SERVICE) {
  // Cloud Run環境の場合
  const port = Number.parseInt(process.env.PORT || '8080');
  serve({
    fetch: app.fetch,
    port,
  });
}
