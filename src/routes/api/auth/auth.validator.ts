import { z } from "zod";

export const ZEmailLogin = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30)
})

export const ZEmailRegister = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30),
    name: z.string(),
    username: z.string()
})