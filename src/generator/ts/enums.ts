import type { GeneratorContext } from "../main.ts";
import { generateJsDocComment } from "./comments.ts";

const trimFieldName = (field: string, enumName: string): string => {
    return field.startsWith(enumName) ? field.slice(enumName.length) : field;
};

const trimEnumName = (enumName: string): string => {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith("ImGui") ? trimmed.slice(5) : trimmed;
};

export const generateEnums = (ctx: GeneratorContext): string => {
    let code = "";

    for (const enumData of ctx.data.enums) {
        const config = ctx.config.bindings?.enums;
        if (config?.[enumData.name]?.isExcluded) {
            continue;
        }

        const comment = generateJsDocComment(enumData);
        const name = trimEnumName(enumData.name);

        code += comment;
        code += `${name}: {\n`;

        for (const field of enumData.elements) {
            const fieldComment = generateJsDocComment(field);
            const fieldName = trimFieldName(field.name, enumData.name);

            code += fieldComment;
            code += `${fieldName}: ${field.value},\n`;
        }

        code += "},\n";
    }

    // TODO: Handle this case.
    code += "FreeTypeLoaderFlags: {\n";
    code += "NoHinting: 1,\n";
    code += "NoAutoHint: 2,\n";
    code += "ForceAutoHint: 4,\n";
    code += "LightHinting: 8,\n";
    code += "MonoHinting: 16,\n";
    code += "Bold: 32,\n";
    code += "Oblique: 64,\n";
    code += "Monochrome: 128,\n";
    code += "LoadColor: 256,\n";
    code += "Bitmap: 512,\n";
    code += "},\n";

    return code;
};
