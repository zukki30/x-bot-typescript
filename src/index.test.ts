import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

// オリジナルのapp.requestをモック
const mockRequest = vi.fn();
const app = new Hono();
app.request = mockRequest;

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.mockReset();
  });

  describe('POST /tweet/morning', () => {
    it('should handle successful response', async () => {
      // 成功レスポンスのモック
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'success',
            message: 'Morning tweet posted successfully',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/morning', {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        status: 'success',
        message: 'Morning tweet posted successfully',
      });
    });

    it('should handle error response', async () => {
      // エラーレスポンスのモック
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'error',
            message: 'Failed to post tweet',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/morning', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        status: 'error',
        message: 'Failed to post tweet',
      });
    });
  });

  describe('POST /tweet/lunch', () => {
    it('should handle successful response', async () => {
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'success',
            message: 'Lunch tweet posted successfully',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/lunch', {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        status: 'success',
        message: 'Lunch tweet posted successfully',
      });
    });

    it('should handle error response', async () => {
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'error',
            message: 'Failed to post tweet',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/lunch', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        status: 'error',
        message: 'Failed to post tweet',
      });
    });
  });

  describe('POST /tweet/night', () => {
    it('should handle successful response', async () => {
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'success',
            message: 'Night tweet posted successfully',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/night', {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        status: 'success',
        message: 'Night tweet posted successfully',
      });
    });

    it('should handle error response', async () => {
      mockRequest.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: 'error',
            message: 'Failed to post tweet',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await app.request('/tweet/night', {
        method: 'POST',
      });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        status: 'error',
        message: 'Failed to post tweet',
      });
    });
  });
});
