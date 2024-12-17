
import { init } from '$model'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Route from "./routes/route.js"
const app = new Hono()

await init()
app.route("/", Route)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
