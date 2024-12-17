import { bucket } from "$bucket";
import { Hono } from "hono";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from "@aws-sdk/client-s3";
const app = new Hono()

app.get("/:key", async (c) => {
    const key = c.req.param('key')
    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\.[a-zA-Z]+/i.test(key)) {
        return c.json({error: "invalid path"})
    }
    const getObjectCommand = new GetObjectCommand({
        Bucket: "artcon",
        Key: '/profiles/' + key
    });
    const url = await getSignedUrl(bucket, getObjectCommand, {
        expiresIn: 60,
    })
    return fetch(url)
})

export default app