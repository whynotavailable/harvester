import { z } from "zod/v4";

export const helloSchema = z.object({
    name: z.string(),
})

export type Hello = z.infer<typeof helloSchema>;

