import type { Variables } from "$types"
import { OpenAPIHono } from "@hono/zod-openapi"
import { useAuth } from "$middlewares/auth.js"
import { token } from "$constants"
import { bucket } from "$bucket"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { db, sequelize } from "$model"
import { DeleteUserImage, GetImage, GetOwnImages, GetUserImages, PutUserImage } from "./images.openapi.js"
import { randomUUID } from "node:crypto"

const app = new OpenAPIHono<{ Variables: Variables }>()

app.use('*', useAuth({ jwt: { secret: process.env.JWT_SECRET!, cookie: token } }))

app.openapi(GetOwnImages, async (c) => {
    const { size, page } = c.req.valid("query")
    const userDb = c.get("user_db")
    const images = await userDb.getImages({
        offset: page * size,
        limit: size
    })
    return c.json(images.map(a => a.toJSON()))
})

app.openapi(GetUserImages, async (c) => {
    const { size, page } = c.req.valid("query")
    const id = c.req.param("id")
    const user = await db.User.findOne({
        where: {
            id: id
        }
    })
    if (!user) return c.json({ error: "user not found" }, 404)
    const images = await user.getImages({
        offset: page * size,
        limit: size
    })
    return c.json(images.map(a => a.toJSON()))
})

app.openapi(GetImage, async (c) => {
    const { uid, id } = c.req.valid("param")
    const image = await db.Image.findOne({
        where: {
            owner_id: uid,
            id
        },
        include: [
            {
                model: db.User,
                attributes: ['username'],
                as: 'owner'
            },
            {
                model: db.Tag,
                attributes: ['name'],
                through: { attributes: [] },
            }
        ]
    })
    if (!image) return c.json({ error: "image not found" }, 404)
    return c.json(image)
})


app.openapi(PutUserImage, async (c) => {
    const user = c.get('user')
    const req = c.req.valid("json")
    const mapped = req.images.map((image, i) => {
        const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = image.split(';')[0].split('/')[1];
        const name = String(i).padStart(4, '0') + '-' + randomUUID() + '.' + type
        return {
            name,
            type,
            data: base64Data,
            key: "/images/" + user.id + '/' + name
        }
    })
    try {
        await sequelize.transaction(async t => {
            const imageDb = await db.Image.create({
                title: req.title,
                description: req.description,
                buyable: false,
                age_range: req.age_range,
                size: 0,
                ai_gen: req.ai_gen,
                rating: 0,
                likes: 0,
                owner_id: user.id,
                images: mapped.map(a => a.name)
            }, { transaction: t })
            for (const tag of req.tags) {
                await db.Tag.findOrCreate({
                    where: {
                        name: tag
                    },
                    transaction: t
                })
                await imageDb.addTag(tag, { transaction: t })
            }
            for (const { type, data, key } of mapped) {
                await bucket.send(new PutObjectCommand({
                    Bucket: 'artcon',
                    Key: key,
                    Body: data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`
                }))
            }
        });
    } catch (error) {
        console.log(error)
        return c.json({ error })
    }
    return c.json({})
})

app.openapi(DeleteUserImage, async (c) => {
    const user = c.get('user')
    const { id } = c.req.valid("param")
    const image = await db.Image.findByPk(id)
    if (!image) return c.json({ error: "image not found" }, 404)
    const images = image.get("images")
    try {
        for (const key of images) {
            await bucket.send(new DeleteObjectCommand({
                Bucket: 'artcon',
                Key: "/images/" + user + '/' + key
            }))
        }
    } catch (error) {

    }
    await image.destroy()
    return c.json({})
})

export default app