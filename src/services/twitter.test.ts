import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import axios from 'axios';
import { createTwitterService } from './twitter';

// Axiosのモック
vi.mock('axios');
// 認証ヘッダー生成のモック
vi.mock('./auth', () => ({
  generateAuthHeader: vi.fn().mockReturnValue('OAuth test_header'),
}));

describe('TwitterService', () => {
  let twitterService: ReturnType<typeof createTwitterService>;

  beforeEach(() => {
    vi.clearAllMocks();
    // axiosのモックをリセット
    (axios.post as Mock).mockReset();
    twitterService = createTwitterService();
  });

  describe('tweet', () => {
    it('should post a tweet successfully', async () => {
      // axiosのレスポンスをモック
      (axios.post as Mock).mockResolvedValueOnce({ data: { id: '123' } });

      await twitterService.tweet('Hello, World!');

      // axiosが正しいパラメータで呼ばれたことを確認
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets',
        { text: 'Hello, World!' },
        {
          headers: {
            Authorization: 'OAuth test_header',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle API errors', async () => {
      // APIエラーをシミュレート
      (axios.post as Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(twitterService.tweet('Hello, World!')).rejects.toThrow('API Error');
    });
  });

  describe('tweetGoodMorning', () => {
    it('should post a morning tweet with current time', async () => {
      // 時刻を固定
      const mockDate = new Date(2024, 0, 1, 9, 30);
      vi.setSystemTime(mockDate);

      (axios.post as Mock).mockResolvedValueOnce({ data: { id: '123' } });

      await twitterService.tweetGoodMorning();

      // 正しいメッセージでツイートされたことを確認
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets',
        { text: '2024/01/01 - 18:30 - おはようございます！' },
        expect.any(Object)
      );

      // システム時刻をリセット
      vi.useRealTimers();
    });

    it('should handle API errors in morning tweet', async () => {
      (axios.post as Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(twitterService.tweetGoodMorning()).rejects.toThrow('API Error');
    });
  });

  describe('tweetLunch', () => {
    it('should post a lunch tweet with current time', async () => {
      // 時刻を固定
      const mockDate = new Date(2024, 0, 1, 12, 0);
      vi.setSystemTime(mockDate);

      (axios.post as Mock).mockResolvedValueOnce({ data: { id: '123' } });

      await twitterService.tweetLunch();

      // 正しいメッセージでツイートされたことを確認
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets',
        { text: '2024/01/01 - 21:00 - お昼ごはんいただきます！' },
        expect.any(Object)
      );

      // システム時刻をリセット
      vi.useRealTimers();
    });

    it('should handle API errors in lunch tweet', async () => {
      (axios.post as Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(twitterService.tweetLunch()).rejects.toThrow('API Error');
    });
  });

  describe('tweetGoodNight', () => {
    it('should post a good night tweet with current time', async () => {
      // 時刻を固定
      const mockDate = new Date(2024, 0, 1, 22, 0);
      vi.setSystemTime(mockDate);

      (axios.post as Mock).mockResolvedValueOnce({ data: { id: '123' } });

      await twitterService.tweetGoodNight();

      // 正しいメッセージでツイートされたことを確認
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitter.com/2/tweets',
        { text: '2024/01/01 - 07:00 - おやすみなさい！' },
        expect.any(Object)
      );

      // システム時刻をリセット
      vi.useRealTimers();
    });

    it('should handle API errors in good night tweet', async () => {
      (axios.post as Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(twitterService.tweetGoodNight()).rejects.toThrow('API Error');
    });
  });
});
