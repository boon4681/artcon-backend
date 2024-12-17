import type { Context } from "hono"
import type { ZodType } from "zod"
import { validator } from 'hono/validator'
import { z } from "@hono/zod-openapi"

export const VJSON = <T>(zod: ZodType<T>) => validator("json", (value: any, c: Context) => {
    const data = zod.safeParse(value)
    if (!data.success) {
        const errors = data.error.format()
        return c.json({ message: "Invalid data", error: errors }, 400)
    }
    return data.data
})

export const ZodTextToNumberTransformer = (debug: string = "DEFAULT") => {
    return z.string()
        .refine(
            (a) => !isNaN(Number(a)),
            (a) => ({ message: `${a} is not a number` })
        )
        .transform(a => Number(a))
}