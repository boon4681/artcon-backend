import { Hono } from "hono";
import APIRoute from "./api/api.route.js"
import VRoute from "./v/v.route.js"
import IRoute from "./i/i.route.js"

const app = new Hono()
app.route("/api", APIRoute)
app.route("/v", VRoute)
app.route("/i", IRoute)

export default app