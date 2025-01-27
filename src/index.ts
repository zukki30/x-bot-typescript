import { Hono } from 'hono';
import { createTwitterService } from './services/twitter';

const app = new Hono();
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

// Functions Framework用のエクスポート
export const honoFunction = app.fetch;

// テスト用にappをエクスポート
export default app;
