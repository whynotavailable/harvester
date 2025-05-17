import { dumpSchema, helloSchema, simpleResponseSchema, type Hello } from "shared"
import { callApi, validateResponse } from "./service";

const hi: Hello = {
    name: "dave"
};

(async () => {
    const resp = await callApi("hi", hi);
    const data = await validateResponse(resp, simpleResponseSchema)
    console.log(data.message)
})().then().catch(err => {
    console.error(err)
});
