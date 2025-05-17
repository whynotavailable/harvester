import { helloSchema, type Hello, type SimpleResponse } from "shared";
import { addFunction } from "..";
import { statusOk } from "../http";

export function setup() {
    addFunction("hi", helloSchema, async (req) => {
        const body: Hello = req.body.data;

        const response: SimpleResponse = {
            message: body.name
        }

        return statusOk(response)
    })
}
