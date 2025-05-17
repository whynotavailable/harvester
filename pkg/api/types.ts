import { z } from "zod/v4";
import express from 'express'

export type RpcResponse = {
    statusCode: number;
    data: any;
}

export interface FunctionMetadata {
    schema: z.ZodType;
    func: (req: express.Request) => Promise<RpcResponse>;
}


