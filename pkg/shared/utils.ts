import z from "zod/v4";

export function dumpSchema(obj: z.ZodType): string {
    return JSON.stringify(z.toJSONSchema(obj))
}

export function addToRegistry(id: string, schema: z.ZodType) {
    z.globalRegistry.add(schema, { id })
}

