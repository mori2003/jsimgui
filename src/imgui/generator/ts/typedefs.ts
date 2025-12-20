import type { GeneratorContext } from "../main.ts";
import { generateJsDocComment } from "./comments.ts";

export const generateTypedefs = (ctx: GeneratorContext): string => {
    let code = "";

    // biome-ignore format: ...
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

    for (const typedefData of ctx.data.typedefs) {
        const config = ctx.config.bindings?.typedefs;
        if (config?.[typedefData.name]?.isExcluded) {
            continue;
        }

        const comment = generateJsDocComment(typedefData);

        const overrideImpl = config?.[typedefData.name]?.overrideImpl;
        if (overrideImpl?.ts) {
            code += comment;
            code += overrideImpl.ts.join("");
            continue;
        }

        const name = typedefData.name;
        const declaration = typedefData.type?.declaration;
        const type =
            declaration && declaration in typeMap
                ? typeMap[declaration as keyof typeof typeMap]
                : declaration;

        code += comment;
        code += `export type ${name} = ${type};\n`;
    }

    // TODO: Handle the special cases.
    code += "export type ImWchar = number;\n";
    code += "export type ImTextureFormat = number;\n";
    code += "export type ImGuiFreeTypeLoaderFlags = number;\n";

    return code;
};
