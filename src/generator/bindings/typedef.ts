import { generateJsDocComment } from "./comment.ts";
import type { ImGuiTypedef } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";

/**
 * @deprecated
 * TODO: Refactor this function
 *
 * Converts a C/C++ type to a TypeScript type.
 * @param type - The C/C++ type as a string.
 * @returns The corresponding TypeScript type as a string.
 *
 * @example
 * toTsType("int")
 * // -> "number"
 *
 * toTsType("const char*")
 * // -> "string"
 *
 * toTsType("float*")
 * // -> "number[]"
 */
export const toTsType = (type: string): string => {
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
        return typeMap[type as keyof typeof typeMap];
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
};

/**
 * Generates TypeScript code for the typedefs.
 * @param ctx - The generator context.
 * @returns The TypeScript code for typedefs.
 *
 * @example
 * tsGenerateTypedefs(ctx)
 * // ->
 * // export type ImU8 = number;
 * // ...
 */
export const tsGenerateTypedefs = (ctx: GeneratorContext): string => {
    const baseTypeMap = {
        void: "void",
        bool: "boolean",
        char: "string",
        int: "number",
        float: "number",
        double: "number",
        size_t: "number",
        "unsigned int": "number",
        "signed int": "number",
        "unsigned short": "number",
        "signed short": "number",
        "unsigned char": "number",
        "signed char": "number",
        "unsigned long long": "bigint",
        "signed long long": "bigint",
        "void*": "any",

        ImU8: "number",
        ImS64: "bigint",
        ImU64: "bigint",
    };

    return ctx.data.typedefs
        .map((typedefData: ImGuiTypedef) => {
            if (
                ctx.config.bindings?.typedefs?.find((e) => e.name === typedefData.name)?.isExcluded
            ) {
                return "";
            }

            const comment = generateJsDocComment(typedefData);
            const name = typedefData.name;
            const declaration = typedefData.type?.declaration;
            const type =
                declaration && declaration in baseTypeMap
                    ? baseTypeMap[declaration as keyof typeof baseTypeMap]
                    : declaration;

            return `${comment}export type ${name} = ${type};\n`;
        })
        .join("");
};
