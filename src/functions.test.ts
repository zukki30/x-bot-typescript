import { describe, it, expect } from 'vitest';
import type { Request, Response } from '@google-cloud/functions-framework';
import { honoRequest } from './functions';

describe('honoRequest', () => {
  const mockRes = {
    status: () => {},
    set: () => {},
    send: () => {},
  } as unknown as Response;

  it('should create a Request with correct headers', async () => {
    const mockReq = {
      url: 'http://localhost/test',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'x-multiple': ['value1', 'value2'],
      },
      body: null,
    } as unknown as Request;

    const result = await honoRequest(mockReq, mockRes);

    expect(result.url).toBe('http://localhost/test');
    expect(result.method).toBe('POST');
    expect(result.headers.get('content-type')).toBe('application/json');
    expect(result.headers.get('accept')).toBe('application/json');
    expect(result.headers.get('x-multiple')).toBe('value1, value2');
  });

  it('should handle empty headers', async () => {
    const mockReq = {
      url: 'http://localhost/test',
      method: 'GET',
      headers: {},
      body: null,
    } as unknown as Request;

    const result = await honoRequest(mockReq, mockRes);

    expect(result.url).toBe('http://localhost/test');
    expect(result.method).toBe('GET');
    expect([...result.headers.entries()].length).toBe(0);
  });

  it('should handle request body', async () => {
    const mockBody = JSON.stringify({ test: 'data' });
    const mockReq = {
      url: 'http://localhost/test',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: mockBody,
    } as unknown as Request;

    const result = await honoRequest(mockReq, mockRes);

    expect(result.url).toBe('http://localhost/test');
    expect(result.method).toBe('POST');
    const resultBody = await result.text();
    expect(resultBody).toBe(mockBody);
  });

  it('should handle null values in headers', async () => {
    const mockReq = {
      url: 'http://localhost/test',
      method: 'GET',
      headers: {
        'valid-header': 'value',
        'null-header': null,
        'undefined-header': undefined,
      },
      body: null,
    } as unknown as Request;

    const result = await honoRequest(mockReq, mockRes);

    expect(result.headers.get('valid-header')).toBe('value');
    expect(result.headers.get('null-header')).toBeNull();
    expect(result.headers.get('undefined-header')).toBeNull();
  });
});
