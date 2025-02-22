import type { ImGuiData } from "./interface.ts";

// TODO: Refactor... hacky solution.
/** Converts a C++ type declaration to a TypeScript type. */
export function toTsType(type: string): string {
    let tsType = type;

    const typeMap = {
        bool: "boolean",
        int: "number",
        float: "number",
        double: "number",
        char: "string",
        size_t: "number",
        "unsigned int": "number",
        "const char*": "string",

        "bool*": "boolean[]",
        "int*": "number[]",
        "float*": "number[]",
        "const float*": "number[]",
        "double*": "number[]",
        "char*": "string[]",
    };

    if (type in typeMap) {
        return typeMap[type];
    }

    if (type.endsWith("]")) {
        return "number[]";
    }

    if (type.endsWith("*")) {
        tsType = tsType.slice(0, -1);
    }

    if (type.startsWith("const ")) {
        tsType = tsType.slice(6);
    }

    return tsType;
}

/** Generates TypeScript type definitions from the ImGui data. */
export function generateTypedefs(jsonData: ImGuiData): string {
    const baseTypeMap = new Map([
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

    const newTypedefMap = new Map([...baseTypeMap]);

    for (const typedef of jsonData.typedefs) {
        const type = typedef.type.declaration;
        const name = typedef.name;

        if (newTypedefMap.has(type)) {
            newTypedefMap.set(name, newTypedefMap.get(type) ?? type);
        }
    }

    for (const key of baseTypeMap.keys()) {
        newTypedefMap.delete(key);
    }

    const typedefs = Array.from(newTypedefMap.keys()).map((typedef) => {
        return `export type ${typedef} = ${newTypedefMap.get(typedef)};\n`;
    });

    return typedefs.join("");
}
