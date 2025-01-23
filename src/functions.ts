import type { Request, Response } from '@google-cloud/functions-framework';

export const honoRequest = async (req: Request, res: Response) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  return new globalThis.Request(req.url, {
    method: req.method,
    headers: headers,
    body: req.body,
  });
};
