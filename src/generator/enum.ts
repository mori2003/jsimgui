import { type CommentBinding, getJsDocComment } from "./comment.ts";
import type { GeneratorContext } from "./config.ts";

type EnumField = {
    name: string;
    value: number;
    comments?: CommentBinding;
};

export type EnumBinding = {
    name: string;
    fields: EnumField[];
    comments?: CommentBinding;
};

function trimFieldName(fieldName: string, enumName: string): string {
    return fieldName.startsWith(enumName) ? fieldName.slice(enumName.length) : fieldName;
}

function trimEnumName(enumName: string, prefix: string): string {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
}

export function getEnumCodeTs(
    context: GeneratorContext,
    enum_: EnumBinding,
    prefix: string,
): string {
    const config = context.config.enums?.[enum_.name];
    if (config?.exclude) return "";
    if (config?.override?.ts) return config.override.ts.join("");

    const comment = getJsDocComment(enum_.comments);
    const name = trimEnumName(enum_.name, prefix);

    const fields = enum_.fields
        .map((field) => {
            const fieldComment = getJsDocComment(field.comments);
            const fieldName = trimFieldName(field.name, enum_.name);

            return `${fieldComment}${fieldName}: ${field.value},\n`;
        })
        .join("");

    return `${comment}${name}: {\n${fields}\n},\n`;
}
