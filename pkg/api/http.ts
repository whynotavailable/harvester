import type { RpcResponse } from "./types";

export function statusOk(data: any): RpcResponse {
    return {
        statusCode: 200,
        data
    }
}
