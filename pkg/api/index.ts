/* LICENSE
Harvester is a program to understand your data.
Copyright (C) 2025 whynotavailable

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import z from "zod/v4";
import express from 'express'
import { type FunctionMetadata, type RpcResponse } from "./types";
import { register } from "./functions/_register";
import { rpcRequestSchema, type RpcRequest } from "shared";

export const functionList: Record<string, FunctionMetadata> = {}
export function addFunction(key: string, schema: z.ZodType, func: (req: express.Request) => Promise<RpcResponse>) {
    functionList[key] = {
        schema,
        func
    };
}

register()

// Create Express app
const app = express();
app.use(express.json());

// Add RPC endpoint
app.get('/_health', (_req, res) => {
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

app.post('/_rpc', (req, res) => {
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

    // Swap to promise with error fallback
    functionList[body.key].func(req)
        .then(response => {
            res.statusCode = response.statusCode;
            res.send(response.data)
        })
        .catch(response => {
            res.statusCode = 500;
            res.send(response)
        })
})

// Start the server
const PORT = process.env.PORT || 5433;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

