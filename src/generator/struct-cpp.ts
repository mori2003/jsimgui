import type { GeneratorContext } from "./config";
import { getFunctionCodeCpp } from "./function-cpp";
import type { StructBinding } from "./struct";

function getMethods(context: GeneratorContext, struct: StructBinding): string {
    return struct.methods
        .map((method) => {
            const config = context.config.structs?.[struct.name]?.methods?.[method.name];
            if (config?.exclude) return "";
            if (config?.override?.cpp) return config.override.cpp.join("");

            return getFunctionCodeCpp(context, method, true);
        })
        .join("");
}

function getFields(context: GeneratorContext, struct: StructBinding): string {
    return struct.fields
        .map((field) => {
            const config = context.config.structs?.[struct.name]?.fields?.[field.name];
            if (config?.exclude) return "";
            if (config?.override?.cpp) return config.override.cpp.join("");

            const type = field.type;

            const getter =
                `.function("get_${field.name}", override([](${struct.name} const* self){\n` +
                `    return self->${field.name};\n` +
                `}), rvp_ref{}, allow_raw_ptrs{})\n`;

            const setter =
                `.function("set_${field.name}", override([](${struct.name}* self, ${type} value){\n` +
                `    self->${field.name} = value;\n` +
                `}), allow_raw_ptrs{})\n`;

            return `${getter + setter}\n`;
        })
        .join("");
}

export function getStructCodeCpp(context: GeneratorContext, struct: StructBinding): string {
    const config = context.config.structs?.[struct.name];
    if (config?.exclude) return "";

    const name = struct.name;

    const body = config?.opaque ? "" : getFields(context, struct) + getMethods(context, struct);

    return `bind_struct<${name}>("${name}")\n.constructor<>()\n${body};\n`;
}
