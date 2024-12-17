import { db } from "$model";
import { getCookie } from "hono/cookie";
import { decode, verify } from "hono/jwt";
import type { MiddlewareHandler } from "hono/types";
import type { JWTPayload } from "hono/utils/jwt/types";

type AuthOptions = {
    jwt: {
        secret: string,
        cookie?: string,
    }
}

export const useAuth = ({ jwt }: AuthOptions): MiddlewareHandler => {
    return async (c, next) => {
        const token = getCookie(c, jwt.cookie ?? 'token') ?? c.req.header('Authorization')?.split("Bearer ")[1]
        if (!token) return c.json({ message: 'Unauthorized', error: 401 }, 401)
        let payload: JWTPayload | undefined = undefined
        try { payload = await verify(token, jwt.secret) } catch (error) { }
        if (!payload) return c.json({ message: 'Unauthorized', error: 401 }, 401)
        const user = await db.User.findOne({
            where: {
                email: payload.email as string,
            }
        })
        if (!user) return c.json({ message: 'Unauthorized', error: 401 }, 401)
        const role = (await user.getRole()).name
        const json = { ...user.toJSON(), role, followers: await user.countFollowers() }
        delete json['password']
        c.set("jwtPayload", payload);
        c.set("user", json);
        c.set("user_db", user);
        await next()
    }
}