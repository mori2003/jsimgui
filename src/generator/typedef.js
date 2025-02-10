/**
 * @file Typedef generation for JavaScript and for usage in the function binding process.
 */

/**
 * Generates the full JavaScript typedef code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateTypedefs(jsonData) {
    const newTypedefMap = new Map([
        ["void", "void"],
        ["bool", "boolean"],
        ["char", "string"],
        ["int", "number"],
        ["float", "number"],
        ["double", "number"],
        ["unsigned char", "number"],
        ["signed char", "number"],
        ["unsigned short", "number"],
        ["signed short", "number"],
        ["unsigned int", "number"],
        ["signed int", "number"],
        ["unsigned long", "number"],
        ["signed long", "number"],
        ["unsigned long long", "BigInt"],
        ["signed long long", "BigInt"],
    ]);

    for (const typedef of jsonData.typedefs) {
        const type = typedef.type.declaration;
        const name = typedef.name;

        if (newTypedefMap.has(name)) {
            continue;
        }

        if (newTypedefMap.has(type)) {
            newTypedefMap.set(name, newTypedefMap.get(type));
        }
    }


    let code = "";

    for (const typedef of jsonData.typedefs) {
        const type = typedef.type.declaration;
        const name = typedef.name;

        if (newTypedefMap.has(type)) {
            code += `/** @typedef {${newTypedefMap.get(type)}} ${name} [Auto] */\n`;
        }
    }

    return code;
}

/**
 * Get the JavaScript declaration for the given type.
 * @param {string} type
 * @returns {string}
 */
export function getJsDeclaration(type) {
    type = type.replace("const ", ""); // Remove the const qualifier.
    type = type.replace("*", ""); // Remove the pointer qualifier.

    return type;
}

/** Map the C++ type declaration to the JavaScript return type. */
export const docTypeMap = new Map([
    ["void", "void"],
    ["bool", "boolean"],
    ["char", "string"],
    ["const char*", "string"],
    ["int", "number"],
    ["float", "number"],
    ["double", "number"],
    ["unsigned char", "number"],
    ["signed char", "number"],
    ["unsigned short", "number"],
    ["signed short", "number"],
    ["unsigned int", "number"],
    ["signed int", "number"],
    ["unsigned long", "number"],
    ["signed long", "number"],
    ["unsigned long long", "BigInt"],
    ["signed long long", "BigInt"],
]);

/**
 * Get the JavaScript documentation type for the given type.
 * @param {string} type
 * @returns {string}
 */
export function toJsDocType(type) {
    return docTypeMap.get(type) || getJsDeclaration(type);
}
