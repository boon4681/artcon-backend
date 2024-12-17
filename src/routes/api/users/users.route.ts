import type { Variables } from "$types"
import { OpenAPIHono } from "@hono/zod-openapi"
import { DeleteUserBanner, FollowUser, GetOwnUserData, GetUserProfile, PutUserBanner } from "./users.openapi.js"
import { useAuth } from "$middlewares/auth.js"
import { token } from "$constants"
import { bucket } from "$bucket"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import { bodyLimit } from 'hono/body-limit'
import { db } from "$model"

const app = new OpenAPIHono<{ Variables: Variables }>()

app.use('*', useAuth({ jwt: { secret: process.env.JWT_SECRET!, cookie: token } }))

app.openapi(GetUserProfile, async (c) => {
    const id = c.req.param("id")
    const me = c.get('user_db')
    const user = await db.User.findOne({
        where: {
            username: id
        }
    })

    if (user) {
        const json = user.toJSON() as any
        json['followers'] = await user.countFollowers()
        json['followed'] = await me.hasFollowing(user)
        delete json['password']
        if (json.banner) {
            json.banner = '/v/' + json.banner
        }
        return c.json(json)
    }
    return c.json({ error: "User not found" }, 404)
})

app.openapi(FollowUser, async (c) => {
    const id = c.req.param("id")
    const me = c.get('user_db')
    const user = await db.User.findOne({
        where: {
            username: id
        }
    })

    if (user) {
        if (me.id == user.id) return c.json({ message: 'You cannot follow youself' }, 400)
        const has = await me.hasFollowing(user)
        if (has) {
            await me.removeFollowing(user)
            return c.json({ message: "User Unfollowed" })
        }
        await me.addFollowing(user)
        return c.json({ message: "User Followed" })
    }
    return c.json({ error: "User not found" }, 404)
})

app.openapi(GetOwnUserData, async (c) => {
    const user = c.get('user')
    if (user.banner) {
        user.banner = '/v/' + user.banner
    }
    return c.json(user)
})

app.use(PutUserBanner.path, bodyLimit({
    maxSize: 10 * 1024 * 1024,
    onError: (c) => {
        return c.json({ error: "File is too large" })
    },
}))
app.openapi(PutUserBanner, async (c) => {
    const user = c.get('user')
    const userDb = c.get('user_db')
    const body = await c.req.parseBody()
    if (!(body['banner'] instanceof File)) return c.json({})
    if (user.banner) {
        await bucket.send(new DeleteObjectCommand({
            Bucket: 'artcon',
            Key: user.banner
        }))
    }
    const type = body['banner'].type.split('/')[1];
    const arrayBuffer = await body['banner'].arrayBuffer()
    const fileContent = new Uint8Array(arrayBuffer);
    const name = randomUUID() + '.' + type
    await bucket.send(new PutObjectCommand({
        Bucket: 'artcon',
        Key: '/profiles/' + name,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: type
    }))
    userDb.set('banner', name)
    await userDb.save()
    return c.json({})
})

app.openapi(DeleteUserBanner, async (c) => {
    const user = c.get('user')
    const userDb = c.get('user_db')
    if (user.banner) {
        await bucket.send(new DeleteObjectCommand({
            Bucket: 'artcon',
            Key: user.banner
        }))
        userDb.set('banner', null)
        await userDb.save()
    }
    return c.json({})
})

export default app