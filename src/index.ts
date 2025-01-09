import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import type { Request, Response } from '@google-cloud/functions-framework'

const app = new Hono()

app.get('/', (c) => c.text('Hello, Hono!'))

// Google Cloud Functionsのエントリーポイント
export const honoFunction = async (req: Request, res: Response) => {
  const headers = new Headers()
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  })

  const honoReq = new Request(req.url, {
    method: req.method,
    headers: headers,
    body: req.body
  })
  
  const honoRes = await app.fetch(honoReq)
  res.status(honoRes.status)
  honoRes.headers.forEach((value: string, key: string) => res.set(key, value))
  const body = await honoRes.arrayBuffer()
  res.send(Buffer.from(body))
}