export type FieldSet = Record<string, Set<string>>;

function append(key: string, kind: string, fields: FieldSet) {
    if (key in fields) {
        fields[key].add(kind)
    }
    else {
        fields[key] = new Set([kind])
    }
}

function isArray(data: unknown): data is Array<unknown> {
    return Array.isArray(data);
}

function isObject(data: unknown): data is Record<string, unknown> {
    return typeof data === "object";
}

export function dive(prefix: string, data: unknown, fields: FieldSet) {
    if (isArray(data)) {
        append(prefix, "array", fields);

        for (const elem of data) {
            dive(`${prefix}[]`, elem, fields)
        }
    }
    else if (data === null) {
        // typeof null presents as 'object' so need to handle it
        append(prefix, "null", fields);
    }
    else if (isObject(data)) {
        append(prefix, "object", fields);

        for (const key in data) {
            dive(`${prefix}.${key}`, data[key], fields)
        }
    }
    else {
        append(prefix, typeof data, fields);
    }
}

