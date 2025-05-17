import ky, { type KyResponse } from 'ky'
import type { RpcRequest } from 'shared'
import type { z } from 'zod/v4'

export async function callApi(key: string, body: any): Promise<KyResponse> {
    const json: RpcRequest = {
        key: key,
        data: body
    }
    return await ky.post("", {
        json
    })
}

export function validateResponse<T extends z.ZodType>(response: KyResponse, schema: T): z.infer<T> {
    const { data, error } = schema.safeParse(response.json())

    if (error != null) {
        throw error;
    }

    return data;
}
