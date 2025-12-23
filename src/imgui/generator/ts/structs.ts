import type { ImGuiFunction, ImGuiStruct, StructField } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode, getTsType, isStructType } from "../util.ts";
import { getJsDocComment } from "./comments.ts";
import { getArguments, getParameters } from "./functions.ts";

function getMethods(context: GeneratorContext, struct: ImGuiStruct): string {
    const methods = context.data.functions.filter((f) => f.original_class === struct.name);
    const config = context.config.bindings?.structs?.[struct.name]?.methods;

    const fn = (method: ImGuiFunction) => {
        const comment = getJsDocComment(method);

        // Slice off the "<struct_name>_": ImGui_Begin() -> Begin().
        const name = method.name.slice(struct.name.length + 1);
        const returnType = getTsType(method.return_type.declaration);

        // Get parameters and arguments without the first "self" parameter/argument.
        const params = getParameters(method, true);
        const args = getArguments(method, true);

        const call =
            method.return_type.declaration === "void"
                ? `        this.ptr.${method.name}(${args});\n`
                : `        return this.ptr.${method.name}(${args});\n`;

        // biome-ignore format: _
        return (
            comment +
            `    ${name}(${params}): ${returnType} {\n` +
            call +
            `    }\n` +
            "\n"
        );
    };

    const code = getMappedCode(methods, config, fn, "ts");

    return code;
}

function getFields(context: GeneratorContext, struct: ImGuiStruct): string {
    const fields = struct.fields;
    const config = context.config.bindings?.structs?.[struct.name]?.fields;

    const fn = (field: StructField) => {
        const comment = getJsDocComment(field);
        const name = field.name;
        const type = getTsType(field.type.declaration);

        // biome-ignore format: _
        const getter = (
            `    get ${name}(): ${type} {\n` +
            (isStructType(context, type) ?
            `        return ${type}.From(this.ptr.get_${name}());\n` :
            `        return this.ptr.get_${name}();\n`) +
            `    }\n`
        );

        // biome-ignore format: _
        const setter = (
            `    set ${name}(v: ${type}) {\n` +
            `        this.ptr.set_${name}(v);\n` +
            `    }\n`
        );

        return comment + getter + setter;
    };

    const code = getMappedCode(fields, config, fn, "ts");

    return code;
}

/**
 * Generates the TypeScript bindings code for the structs.
 */
export function getStructsCode(context: GeneratorContext): string {
    const structs = context.data.structs;
    const config = context.config.bindings?.structs;

    const fn = (struct: ImGuiStruct) => {
        const comment = getJsDocComment(struct);
        const name = struct.name;

        const body = config?.[name]?.isOpaque
            ? "    // Opaque\n"
            : getFields(context, struct) + getMethods(context, struct);

        // biome-ignore format: _
        return (
            comment +
            `export class ${name} extends StructBinding {\n` +
            body +
            `}\n` +
            "\n"
        );
    };

    const code = getMappedCode(structs, config, fn, "ts");

    return code;
}
