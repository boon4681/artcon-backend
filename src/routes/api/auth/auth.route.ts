import 'dotenv/config'
import { googleAuth } from '@hono/oauth-providers/google'
import { Hono } from 'hono'
import { argv } from '$argv'
import { db } from '$model'
import { faker } from '@faker-js/faker/locale/en_US'
import { create_discriminator } from './utils.js'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import { html } from 'hono/html'
import { validator } from 'hono/validator'
import { ZEmailLogin, ZEmailRegister } from './auth.validator.js'
import bcrypt from "bcrypt";
import { VJSON } from '$helper'
import { token } from '$constants'
const app = new Hono()

app.get('/google', googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ['openid', 'email', 'profile'],
    redirect_uri: argv.mode === 'production' ? process.env.REDIRECT_GOOGLE ?? 'http://localhost:5173/api/auth/google' : 'http://localhost:5173/api/auth/google'
}), async (c) => {
    const user = c.get('user-google')!

    let userAuth = await db.User.findOne({
        where: {
            email: user.email
        }
    })
    if (userAuth && userAuth?.password) {
        return c.json({ message: "Please login with another method.", error: 401 }, 401)
    }
    if (!userAuth) {
        const username = user.name ?? faker.food.fruit()
        const { discriminator, fullname } = await create_discriminator(username)
        await db.User.create({
            username: username,
            email: user.email!,
            fullname,
            hashtag: discriminator
        })
        userAuth = await db.User.findOne({
            where: {
                email: user.email
            }
        })
    }
    const signed = await sign({ ...user, id: userAuth!.getDataValue('id'), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, }, process.env.JWT_SECRET!)
    setCookie(c, token, signed)
    return c.html(html`<script>window.close()</script>`)
})


app.post('/email/login', VJSON(ZEmailLogin), async (c) => {
    const data = c.req.valid("json")
    let userAuth = await db.User.findOne({
        where: {
            email: data.email
        }
    })
    if (!userAuth) {
        return c.json({ message: "Cannot find your account" }, 401)
    }
    if (!userAuth.password) {
        return c.json({ message: "Please login with another method." }, 401)
    }
    const EQ = bcrypt.compareSync(data.password + 'user-pwd' + data.email, userAuth.password);
    if (!EQ) {
        return c.json({ message: "Unauthorized: email or password is wrong" }, 401)
    }
    const signed = await sign({ id: userAuth!.id, email: userAuth.email, username: userAuth.username, role: (await userAuth.getRole()).name ?? "member", role_id: userAuth?.role_id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, }, process.env.JWT_SECRET!)
    setCookie(c, token, signed)
    return c.json({ message: "Login successfully" })
})

app.post('/email/signup', VJSON(ZEmailRegister), async (c) => {
    const data = c.req.valid("json")
    let userAuth = await db.User.findOne({
        where: {
            email: data.email
        }
    })
    if (userAuth) {
        return c.json({ message: "This email is already exist" }, 401)
    }
    const { discriminator, fullname } = await create_discriminator(data.username)
    const hash = bcrypt.hashSync(data.password + 'user-pwd' + data.email, 13);
    await db.User.create({
        email: data.email,
        username: data.username,
        fullname,
        hashtag: discriminator,
        password: hash
    })
    return c.json({ message: "Signup successfully" })
})

export default app