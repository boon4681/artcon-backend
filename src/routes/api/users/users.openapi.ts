import { createRoute, z } from "@hono/zod-openapi"

export const GetUserProfile = createRoute({
    method: 'get',
    path: '/profile/:id',
    description: 'require token cookie',
    tags: ['user'],
    request: {},
    responses: {
        200: {
            description: 'Get own user data',
        },
        401: {
            description: 'Unauthorized'
        }
    }
})

export const FollowUser = createRoute({
    method: 'get',
    path: '/follow/:id',
    description: 'require token cookie',
    tags: ['user'],
    request: {},
    responses: {
        200: {
            description: 'Get own user data',
        },
        401: {
            description: 'Unauthorized'
        }
    }
})

export const GetOwnUserData = createRoute({
    method: 'get',
    path: '/@me',
    description: 'require token cookie',
    tags: ['user'],
    request: {},
    responses: {
        200: {
            description: 'Get own user data',
        },
        401: {
            description: 'Unauthorized'
        }
    }
})

export const PutUserBanner = createRoute({
    method: 'put',
    path: '/@me/banner',
    description: "",
    tags: ["user"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        banner: z.string().regex(/^data:image\/(?:png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g)
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Get own user data',
        },
        401: {
            description: 'Unauthorized'
        }
    }
})

export const DeleteUserBanner = createRoute({
    method: 'delete',
    path: '/@me/banner',
    description: "",
    tags: ["user"],
    responses: {
        200: {
            description: 'Get own user data',
        },
        401: {
            description: 'Unauthorized'
        }
    }
})