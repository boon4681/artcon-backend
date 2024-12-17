import { bucket } from "$bucket";
import { Hono } from "hono";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from "@aws-sdk/client-s3";
const app = new Hono()

app.get("/:uid/:key", async (c) => {
    const uid = c.req.param('uid')
    const key = c.req.param('key')
    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i.test(uid)) {
        return c.json({ error: "invalid path" })
    }
    if (!/^[0-9]{4}-[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\.[a-zA-Z]+/i.test(key)) {
        return c.json({ error: "invalid path" })
    }
    const getObjectCommand = new GetObjectCommand({
        Bucket: "artcon",
        Key: '/images/' + uid + "/" + key
    });
    const url = await getSignedUrl(bucket, getObjectCommand, {
        expiresIn: 60,
    })
    return fetch(url)
})

export default app