import { type CommentBinding, getJsDocComment } from "./comment";
import type { GeneratorContext } from "./config";

export type TypedefBinding = {
    name: string;
    declaration: string;
    comments?: CommentBinding;
};

const TYPE_MAP = new Map<string, string>([
    ["short", "number"],
    ["unsigned short", "number"],
    ["signed short", "number"],
    ["int", "number"],
    ["unsigned int", "number"],
    ["signed int", "number"],
    ["unsigned char", "number"],
    ["signed char", "number"],
    ["long long", "bigint"],
    ["signed long long", "bigint"],
    ["unsigned long long", "bigint"],
]);

export function getTypedefCodeTs(context: GeneratorContext, typedef: TypedefBinding): string {
    const config = context.config.typedefs?.[typedef.name];
    if (config?.exclude) return "";
    if (config?.override?.ts) return config.override.ts.join("");

    const comment = getJsDocComment(typedef.comments);
    const name = typedef.name;
    const declaration = typedef.declaration;
    const type = TYPE_MAP.has(declaration) ? TYPE_MAP.get(declaration) : declaration;

    return `${comment}export type ${name} = ${type};\n`;
}

export function getExtraTypedefs(): string {
    return (
        "export type ImWchar = number;\n" +
        "export type ImTextureFormat = number;\n" +
        "export type ImGuiFreeTypeLoaderFlags = number;\n"
    );
}
