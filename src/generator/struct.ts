import type { CommentBinding } from "./comment.ts";
import { getJsDocComment } from "./comment.ts";
import type { FunctionBinding } from "./function.ts";
import { getFunctionCodeTs } from "./function.ts";
import type { GeneratorContext } from "./config";
import { getTsType, isStructType } from "./util.ts";

type StructField = {
    name: string;
    type: string;
    comments?: CommentBinding;
};

export type StructBinding = {
    name: string;
    fields: StructField[];
    methods: FunctionBinding[];
    comments?: CommentBinding;
};

function getMethods(context: GeneratorContext, struct: StructBinding): string {
    return struct.methods
        .map((method) => {
            const config = context.config.structs?.[struct.name]?.methods?.[method.name];
            if (config?.exclude) return "";
            if (config?.override?.ts) return config.override.ts.join("");

            return getFunctionCodeTs(context, method, `${struct.name}_`, true);
        })
        .join("");
}

function getFields(context: GeneratorContext, struct: StructBinding): string {
    return struct.fields
        .map((field) => {
            const config = context.config.structs?.[struct.name]?.fields?.[field.name];
            if (config?.exclude) return "";
            if (config?.override?.ts) return config.override.ts.join("");

            const comment = getJsDocComment(field.comments);
            const name = field.name;
            const type = getTsType(field.type);

            const getter =
                `    get ${name}(): ${type} {\n` +
                (isStructType(field.type)
                    ? `        return ${type}.From(this.ptr.get_${name}());\n`
                    : `        return this.ptr.get_${name}();\n`) +
                `    }\n`;

            const setter =
                `    set ${name}(v: ${type}) {\n` +
                `        this.ptr.set_${name}(v);\n` +
                `    }\n`;

            return comment + getter + setter;
        })
        .join("");
}

export function getStructCodeTs(context: GeneratorContext, struct: StructBinding): string {
    const config = context.config.structs?.[struct.name];
    if (config?.exclude) return "";
    if (config?.override?.ts) return config.override.ts.join("");

    const comment = getJsDocComment(struct.comments);
    const name = struct.name;

    const body = config?.opaque
        ? "    // Opaque\n"
        : `${getFields(context, struct)}\n${getMethods(context, struct)}`;

    return `${comment}export class ${name} extends ReferenceStruct {\n${body}\n}\n`;
}
