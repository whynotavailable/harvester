import z from 'zod/v4'
import { addToRegistry } from './utils'

// ignore this warning, it won't actually work.
const types = require('./types.ts')

const schemaKeys = Object.keys(types)
    .filter(x => x.endsWith('Schema'))

const schemas: Record<string, string> = {}

schemaKeys.forEach(schemaKey => {
    const key = schemaKey.replace("Schema", "")
    z.globalRegistry.add(types[schemaKey], { id: key })
    schemas[key] = JSON.stringify(z.toJSONSchema(types[schemaKey]))
})

console.log(JSON.stringify(z.toJSONSchema(z.globalRegistry), null, 3))
