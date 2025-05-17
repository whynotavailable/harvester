import z from "zod/v4";
import express from 'express'
import { rpcRequestSchema, type FunctionMetadata, type RpcRequest } from "./types";
import { register } from "./functions/_register";

export const functionList: Record<string, FunctionMetadata> = {}
export function addFunction(key: string, func: FunctionMetadata) {
    functionList[key] = func;
}

register()

// Create Express app
const app = express();
app.use(express.json());

// Add RPC endpoint
app.get('/health', (_req, res) => {
    res.send({ status: 'ok' })
});

const info: Record<string, any> = {}

for (const key in functionList) {
    info[key] = z.toJSONSchema(functionList[key].schema)
}

app.get('/_info', (_req, res) => {
    res.send(info)
})

function validate(schema: z.ZodType, body: any, res: express.Response): boolean {
    const { error } = schema.safeParse(body)

    if (error != null) {
        res.statusCode = 400;
        res.send(error.issues)
        return false
    }

    return true;
}

app.post('/rpc', (req, res) => {
    if (!validate(rpcRequestSchema, req.body, res)) {
        return
    }

    const body: RpcRequest = req.body;

    if (!(body.key in functionList)) {
        res.statusCode = 400;
        res.send(`Function ${body.key} does not exist`)
        return
    }

    const functionMetadata = functionList[body.key];

    if (!validate(functionMetadata.schema, body.data, res)) {
        return
    }

    functionList[body.key].func(req, res);
})

// Start the server
const PORT = process.env.PORT || 5433;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

