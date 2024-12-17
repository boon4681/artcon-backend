import 'dotenv/config'
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export const bucket = new S3Client({
    region: "workspace",
    credentials: {
        accessKeyId: process.env['BUCKET_KEY']!,
        secretAccessKey: process.env['BUCKET_SECRET']!,
    },
    endpoint: process.env['BUCKET_ENDPOINT'],
    forcePathStyle: true
});