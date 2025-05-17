import { fetch } from 'bun'
import type { RpcRequest } from 'shared'
import type { z } from 'zod/v4'

const uri = "http://localhost:5433/_rpc"

export async function callApi(key: string, body: any): Promise<Response> {
    const json: RpcRequest = {
        key: key,
        data: body
    }

    return await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
}

export async function validateResponse<T extends z.ZodType>(response: Response, schema: T): Promise<z.infer<T>> {
    const { data, error } = schema.safeParse(await response.json())

    if (error != null) {
        throw error;
    }

    return data;
}
