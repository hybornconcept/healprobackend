import { Hono } from 'hono'
import { auth } from 'hono/utils/basic-auth'
import { JwtAlgorithmNotImplemented } from 'hono/utils/jwt/types'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app

resend
better -auth
cloudfare workers
neon 
drizzle
honojs
resend
paystack