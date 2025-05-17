import { helloSchema, type Hello } from "shared";
import { addFunction } from "..";

export function setup() {
    addFunction("hi", {
        schema: helloSchema,
        func(req, resp) {
            const body: Hello = req.body;

            resp.send({
                hi: body.name
            })
        },
    })
}
