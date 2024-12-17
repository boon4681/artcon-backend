import { Hono } from "hono";
import AuthRoute from "./auth/auth.route.js"
import UsersRoute from "./users/users.route.js"
import ImagesRoute from "./images/images.route.js"

const app = new Hono()

app.route("/auth", AuthRoute)
app.route("/users", UsersRoute)
app.route("/images", ImagesRoute)

export default app