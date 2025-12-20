import type { ImGuiStruct } from "../interface";
import type { GeneratorContext } from "../main.ts";

import { getParameters } from "./functions.ts";
import { getArguments } from "./functions.ts";

const generateMethods = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    const structMethods = ctx.data.functions.filter((f) => f.original_class === structData.name);

    for (const methodData of structMethods) {
        const config = ctx.config.bindings?.structs?.[structData.name];
        if (config?.methods?.[methodData.name]?.isExcluded) {
            continue;
        }

        const overrideImpl = config?.methods?.[methodData.name]?.overrideImpl;
        if (overrideImpl?.cpp) {
            code += overrideImpl.cpp.join("");
            continue;
        }

        const name = methodData.name;
        const returnType = methodData.return_type.declaration;
        const parameters = getParameters(methodData);
        const args = getArguments(methodData);

        code += `.function("${name}", override([](${parameters}) -> ${returnType} {\n`;

        if (returnType === "void") {
            code += `    ${name}(${args});\n`;
        } else {
            code += `    return ${name}(${args});\n`;
        }

        code += `}), AllowRawPtrs{})\n`;

        code += "\n";
    }

    return code;
};

const generateFields = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    for (const field of structData.fields) {
        const config = ctx.config.bindings?.structs;
        if (config?.[structData.name]?.fields?.[field.name]?.isExcluded) {
            continue;
        }

        const overrideImpl = config?.[structData.name]?.fields?.[field.name]?.overrideImpl;
        if (overrideImpl?.cpp) {
            code += overrideImpl.cpp.join("");
            continue;
        }

        // TODO: Refactor!
        if (field.type.declaration === "ImVec2") {
            code += `.function("get_${field.name}", override([](const ${structData.name}& self){ return wrap_imvec2(self.${field.name}); }), ReturnRef{}, AllowRawPtrs{})\n`;
            code += `.function("set_${field.name}", override([](${structData.name}& self, JsVal value){ self.${field.name} = get_imvec2(value); }), AllowRawPtrs{})\n`;
            code += "\n";
            continue;
        }

        code += `.function("get_${field.name}", override([](const ${structData.name}& self){ return self.${field.name}; }), ReturnRef{}, AllowRawPtrs{})\n`;

        code += `.function("set_${field.name}", override([](${structData.name}& self, ${field.type.declaration} value){ self.${field.name} = value; }), AllowRawPtrs{})\n`;

        code += "\n";
    }

    return code;
};

const generateBody = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    code += generateFields(structData, ctx);
    code += generateMethods(structData, ctx);

    return code;
};

export const generateStructs = (ctx: GeneratorContext): string => {
    let code = "";

    for (const structData of ctx.data.structs) {
        const config = ctx.config.bindings?.structs;
        if (config?.[structData.name]?.isExcluded) {
            continue;
        }

        const name = structData.name;
        const structBody = config?.[structData.name]?.isOpaque ? "" : generateBody(structData, ctx);

        code += `bind_struct<${name}>("${name}")\n`;
        code += ".constructor<>()\n";
        code += structBody;
        code += ";\n";
    }

    return code;
};
