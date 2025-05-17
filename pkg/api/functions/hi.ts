import { helloSchema, type Hello } from "shared";
import { addFunction } from "..";
import { statusOk } from "../http";

export function setup() {
    addFunction("hi", helloSchema, async (req) => {
        const body: Hello = req.body;

        return statusOk({
            hi: body.name
        })
    })
}
