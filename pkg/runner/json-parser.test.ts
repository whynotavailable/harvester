import { expect, test } from "bun:test";
import { dive, type FieldSet } from "./json-parser";

test("basics", () => {
    const t = {
        "restaurant": {
            "id": "rest_12345",
            "name": "The Golden Fork",
            "cuisine": "Contemporary American",
            "locations": [
                {
                    "address": "123 Main St",
                    "city": "Boston",
                    "state": null,
                    "coordinates": {
                        "latitude": 42.3601,
                        "longitude": -71.0589
                    },
                    "seating_capacity": 85
                }
            ],
            "menu_items": [
                {
                    "name": "Truffle Mac & Cheese",
                    "price": 18.99,
                    "categories": [
                        "pasta",
                        "vegetarian"
                    ],
                    "allergens": [
                        "dairy",
                        "gluten"
                    ],
                    "available": true
                }
            ],
            "ratings": {
                "overall": 4.5,
                "service": 4.7,
                "ambiance": 4.3,
                "food": 4.6
            }
        }
    };

    const fields: FieldSet = {};
    dive("", t, fields);

    expect(fields[""]).toContain("object");
    expect(fields[".restaurant.id"]).toContain("string");
    expect(fields[".restaurant.locations[].state"]).toContain("null");
    expect(fields[".restaurant.locations"]).toContain("array");
    expect(fields[".restaurant.locations[].coordinates.latitude"]).toContain("number");
    expect(fields[".restaurant.menu_items[].available"]).toContain("boolean");
})

test("adt", () => {
    const t = {
        "name": "Mixed Array Example",
        "description": "Array with different data types",
        "mixed_array": [
            42,
            "Hello World",
            {
                "key": "value",
                "active": true
            }
        ]
    };

    const fields: FieldSet = {};
    dive("", t, fields);

    expect(fields[""]).toContain("object");

    expect(fields[".mixed_array[]"]).toContain("string");
    expect(fields[".mixed_array[]"]).toContain("object");
    expect(fields[".mixed_array[]"]).toContain("number");

    expect(fields[".mixed_array[].key"]).toContain("string");
})


test("template", () => {
    const t = {};

    const fields: FieldSet = {};
    dive("", t, fields);

    // expect(fields[""]).toContain("");
})


test("multi", () => {
    const t1 = {
        "test": 1
    };

    const t2 = {
        "test": "1"
    };

    const fields: FieldSet = {};
    dive("", t1, fields);
    dive("", t2, fields);

    expect(fields[".test"]).toContain("string");
    expect(fields[".test"]).toContain("number");
})
