import type { ImGuiFunction, ImGuiStruct, StructField } from "../interface";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode } from "../util.ts";
import { getParameters } from "./functions.ts";
import { getArguments } from "./functions.ts";

function getMethods(context: GeneratorContext, struct: ImGuiStruct): string {
    const methods = context.data.functions.filter((f) => f.original_class === struct.name);
    const config = context.config.bindings?.structs?.[struct.name]?.methods;

    const fn = (method: ImGuiFunction) => {
        const name = method.name;
        const returnType = method.return_type.declaration;
        const parameters = getParameters(method);
        const args = getArguments(method);

        const call =
            method.return_type.declaration === "void"
                ? `    ${name}(${args});\n`
                : `    return ${name}(${args});\n`;

        // biome-ignore format: _
        return (
            `.function("${name}", override([](${parameters}) -> ${returnType} {\n` +
            call +
            `}), AllowRawPtrs{})\n` +
            "\n"
        );
    };

    const code = getMappedCode(methods, config, fn, "cpp");

    return code;
}

function getFields(context: GeneratorContext, struct: ImGuiStruct): string {
    const fields = struct.fields;
    const config = context.config.bindings?.structs?.[struct.name]?.fields;

    const fn = (field: StructField) => {
        const type = field.type.declaration;

        // Handle Value Object wrappers (ImVec2, ImVec4, ImTextureRef)
        // TODO: Refactor this mess!
        if (type === "ImVec2") {
            const getter =
                `.function("get_${field.name}", override([](${struct.name} const* self){\n` +
                `    return wrap_imvec2(self->${field.name});\n` +
                `}), ReturnRef{}, AllowRawPtrs{})\n`;

            const setter =
                `.function("set_${field.name}", override([](${struct.name}* self, JsVal value){\n` +
                `    self->${field.name} = get_imvec2(value);\n` +
                `}), AllowRawPtrs{})\n`;

            // biome-ignore format: _
            return (
                getter +
                setter +
                "\n"
            );
        }

        const getter =
            `.function("get_${field.name}", override([](${struct.name} const* self){\n` +
            `    return self->${field.name};\n` +
            `}), ReturnRef{}, AllowRawPtrs{})\n`;

        const setter =
            `.function("set_${field.name}", override([](${struct.name}* self, ${type} value){\n` +
            `    self->${field.name} = value;\n` +
            `}), AllowRawPtrs{})\n`;

        // biome-ignore format: _
        return (
            getter +
            setter +
            "\n"
        );
    };

    const code = getMappedCode(fields, config, fn, "cpp");

    return code;
}

/**
 * Generates the C++ bindings code for the structs.
 */
export function getStructsCode(context: GeneratorContext): string {
    const structs = context.data.structs;
    const config = context.config.bindings?.structs;

    const fn = (struct: ImGuiStruct) => {
        const name = struct.name;
        const body = config?.[name]?.isOpaque
            ? ""
            : getFields(context, struct) + getMethods(context, struct);

        // biome-ignore format: _
        return (
            `bind_struct<${name}>("${name}")\n` +
            ".constructor<>()\n" +
            body +
            ";\n"
        );
    };

    const code = getMappedCode(structs, config, fn, "cpp");

    return code;
}
