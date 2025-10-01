import { generateJsDocComment } from "./comment.ts";
import type { ImGuiEnum } from "./interface.ts";
import type { GeneratorContext } from "./main";

/**
 * Trims the field name to remove the enum name prefix.
 * @param field - The name of the field to trim.
 * @param enumName - The name of the enum to trim.
 * @returns The trimmed field name.
 */
const trimFieldName = (field: string, enumName: string): string => {
    return field.startsWith(enumName) ? field.slice(enumName.length) : field;
};

/**
 * Trims the enum name to remove the "ImGui" prefix and "_" suffix.
 * @param enumName - The name of the enum to trim.
 * @returns The trimmed enum name.
 */
const trimEnumName = (enumName: string): string => {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith("ImGui") ? trimmed.slice(5) : trimmed;
};

/**
 * Generates TypeScript code for the enums and flags.
 * @param ctx - The generator context.
 * @returns The TypeScript code for the enums and flags properties. This will be placed
 * in the ImGui object.
 */
export const tsGenerateEnums = (ctx: GeneratorContext): string => {
    return ctx.data.enums
        .map((enumData: ImGuiEnum) => {
            // TODO: enable exclusion via config file.
            // if (shouldExclude(ctx, enumData, "enums")) {
            //     return "";
            // }

            const name = trimEnumName(enumData.name);
            const comment = generateJsDocComment(enumData);

            const fields = enumData.elements.map((element) => {
                const fieldName = trimFieldName(element.name, enumData.name);
                const fieldComment = generateJsDocComment(element);
                return `${fieldComment}${fieldName}: ${element.value},\n`;
            });

            return `${comment}${name}: {\n${fields.join("")}},\n`;
        })
        .join("");
};
