const numberMapping = {
    "int": "number",
    "float": "number",
    "double": "number",
    "signed char": "number", // ImS8
    "unsigned char": "number", // ImU8
    "signed short": "number", // ImS16
    "unsigned short": "number", // ImU16
    "signed int": "number", // ImS32
    "unsigned int": "number", // ImU32
    "signed long long": "number", // ImS64
    "unsigned long long": "number", // ImU64
};

/**
 * Map the C++ typedefs to the JavaScript types.
 * @param {object} typedefData The typedef data.
 * @returns {Map<string, string>} A map of C++ typedefs to JavaScript types.
 */
export function getTypeMapping(typedefData) {
    const typeMap = new Map();

    typeMap.set("void", "void");
    typeMap.set("bool", "boolean");
    typeMap.set("char", "string");
    typeMap.set("int", "number");
    typeMap.set("float", "number");
    typeMap.set("double", "number");
    typeMap.set("unsigned char", "number");
    typeMap.set("signed char", "number");
    typeMap.set("unsigned short", "number");
    typeMap.set("signed short", "number");
    typeMap.set("unsigned int", "number");
    typeMap.set("signed int", "number");
    typeMap.set("unsigned long", "number");
    typeMap.set("signed long", "number");
    typeMap.set("unsigned long long", "number");
    typeMap.set("signed long long", "number");



    // for (const [key, value] of Object.entries(numberMapping)) {
    //     typeMap.set(key, value);
    // for (const [key, value] of Object.entries(numberMapping)) {
    //     typeMap.set(key, value);
    // }

    // Add the typedefs. If a typedef is already in the map, use it.
    for (const typedef of typedefData) {
        if (typeMap.has(typedef.type.declaration)) {
            typeMap.set(typedef.name, typeMap.get(typedef.type.declaration));
        }
    }

    return typeMap;
}

export function generateTypedefs(jsonData) {
    const typeMap = getTypeMapping(jsonData.typedefs);
    const types = new Set(jsonData.typedefs.map((typedef) => {
        return typedef.name;
    }));

    let typedefs = "";
    for (const type of types) {
        if (typeMap.has(type)) {
            typedefs += `/** [Auto] @typedef {${typeMap.get(type)}} ${type} */\n`;
        }
    }

    return [
        "",
        typedefs,
    ].join("\n");
}

/**
 * Map the C++ type declaration to the JavaScript return type.
 * @param {string} typeDeclaration The C++ type declaration.
 * @returns {string} The JavaScript type.
 */
export function getJsReturnType(typeDeclaration, typedefData) {
    let jsType = typeDeclaration;

    // Remove the const qualifier.
    if (typeDeclaration.startsWith("const")) {
        jsType = typeDeclaration.slice(6);
    }

    // Remove the pointer qualifier.
    if (typeDeclaration.endsWith("*")) {
        jsType = jsType.slice(0, -1);
    }

    const typeMap = getTypeMapping(typedefData);
    return typeMap.get(jsType) || jsType;
}

/**
 * Map the C++ type declaration to the JavaScript parameter type.
 * @param {string} typeDeclaration The C++ type declaration.
 * @returns {string} The JavaScript type.
 */
export function getJsParamType(typeDeclaration, typedefData) {
    let jsType = typeDeclaration;

    // Remove the const qualifier.
    if (typeDeclaration.startsWith("const")) {
        jsType = typeDeclaration.slice(6);
    }

    // Remove the pointer qualifier.
    if (typeDeclaration.endsWith("*")) {
        jsType = jsType.slice(0, -1);
    }

    const typeMap = getTypeMapping(typedefData);
    return typeMap.get(jsType) || jsType;
}
