import { z } from "zod/v4";
import express from 'express'

export const rpcRequestSchema = z.object({
    key: z.string(),
    data: z.any()
})

export type RpcRequest = z.infer<typeof rpcRequestSchema>;

export interface FunctionMetadata {
    schema: z.ZodType;
    func: (req: express.Request, resp: express.Response) => void;
}


