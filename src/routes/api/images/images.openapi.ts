import { ZodTextToNumberTransformer } from "$helper"
import { createRoute, z } from "@hono/zod-openapi"

export const GetOwnImages = createRoute({
    method: 'get',
    path: '/',
    description: 'require token cookie',
    tags: ['images'],
    request: {
        query: z.object({
            size: ZodTextToNumberTransformer().default('100'),
            page: ZodTextToNumberTransformer().default('0')
        })
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

export const GetUserImages = createRoute({
    method: 'get',
    path: '/:id',
    description: 'require token cookie',
    tags: ['images'],
    request: {
        query: z.object({
            size: ZodTextToNumberTransformer().default('10'),
            page: ZodTextToNumberTransformer().default('0')
        }),
        params: z.object({
            id: z.string().uuid()
        })
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

export const GetImage = createRoute({
    method: 'get',
    path: '/:uid/:id',
    description: 'require token cookie',
    tags: ['images'],
    request: {
        params: z.object({
            uid: z.string().uuid(),
            id: z.string().uuid()
        })
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

export const PutUserImage = createRoute({
    method: 'put',
    path: '/upload',
    description: 'require token cookie',
    tags: ['images'],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        title: z.string(),
                        description: z.string(),
                        age_range: z.number().default(0),
                        ai_gen: z.boolean(),
                        tags: z.array(z.string()).default([]),
                        images: z.array(z.string().regex(/^data:image\/(?:png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g)).min(1).max(24)
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

export const DeleteUserImage = createRoute({
    method: 'delete',
    path: '/:id',
    description: 'require token cookie',
    tags: ['images'],
    request: {
        params: z.object({
            id: z.string().uuid()
        })
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