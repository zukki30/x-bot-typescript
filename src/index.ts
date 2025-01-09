import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => c.text('Hello, Hono!'))

// Google Cloud Functionsのエントリーポイント
export const honoFunction = serve(app)