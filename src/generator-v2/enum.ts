import { getJsDocComment } from "./comment.ts";
import type { ImGuiEnum } from "./interface.ts";
import { type CodeOutput, context } from "./main.ts";

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

const ts = (): string => {
    return context.data.enums
        .map((enumData: ImGuiEnum) => {
            const name = trimEnumName(enumData.name);
            const comment = getJsDocComment(enumData.comments?.preceding?.[0], enumData);

            const fields = enumData.elements.map((element) => {
                const fieldName = trimFieldName(element.name, enumData.name);
                const fieldComment = getJsDocComment(element.comments?.attached, element);

                return `${fieldComment}${fieldName}: ${element.value},\n`;
            });

            return `${comment}${name}: {\n${fields.join("")}},\n`;
        })
        .join("");
};

export const generateEnums = (): CodeOutput => {
    return {
        ts: ts(),
        cpp: "",
    };
};
