import type { ImGuiTypedef } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode } from "../util.ts";
import { getJsDocComment } from "./comments.ts";

export function getExtraTypedefs(): string {
    return (
        "export type ImWchar = number;\n" +
        "export type ImTextureFormat = number;\n" +
        "export type ImGuiFreeTypeLoaderFlags = number;\n"
    );
}

/**
 * Generates the TypeScript bindings code for the typedefs.
 */
export function getTypedefsCode(context: GeneratorContext): string {
    const typedefs = context.data.typedefs;
    const config = context.config.bindings?.typedefs;

    // biome-ignore format: _
    const typeMap = {
        "unsigned short": "number",
        "int": "number",
        "unsigned int": "number",
        "signed char": "number",
        "unsigned char": "number",
        "signed short": "number",
        "signed int": "number",
        "signed long long": "bigint",
        "unsigned long long": "bigint",
    };

    const fn = (typedef: ImGuiTypedef) => {
        const comment = getJsDocComment(typedef);

        const name = typedef.name;
        const declaration = typedef.type?.declaration;
        const type =
            declaration && declaration in typeMap
                ? typeMap[declaration as keyof typeof typeMap]
                : declaration;

        // biome-ignore format: _
        return (
            comment +
            `export type ${name} = ${type};\n`
        );
    };

    const code = getMappedCode(typedefs, config, fn, "ts");

    return code;
}
