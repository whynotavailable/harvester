import { dumpSchema, helloSchema, type Hello } from "shared"

const hi: Hello = {
    name: "dave"
}

console.log(dumpSchema(helloSchema))
