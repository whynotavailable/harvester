import { z } from "zod/v4";

export const rpcRequestSchema = z.object({
    key: z.string(),
    data: z.any()
})

export type RpcRequest = z.infer<typeof rpcRequestSchema>;

export const helloSchema = z.object({
    name: z.string(),
})

export type Hello = z.infer<typeof helloSchema>;

export const simpleResponseSchema = z.object({
    message: z.string()
});

export type SimpleResponse = z.infer<typeof simpleResponseSchema>;
