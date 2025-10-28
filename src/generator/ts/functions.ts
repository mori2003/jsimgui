import type { ImGuiFunction } from "../interface";
import type { GeneratorContext } from "../main.ts";
import { generateJsDocComment } from "./comments.ts";
import { getTsType, isStructType } from "./structs.ts";

const getDefaultValue = (defaultValue: string) => {
    if (defaultValue === "NULL") {
        return "null";
    }

    if (defaultValue.startsWith("ImVec")) {
        return `new ${defaultValue}`;
    }

    if (/^-?[\d.]+f$/.test(defaultValue)) {
        return defaultValue.slice(0, -1);
    }

    return defaultValue;
};

export const getArguments = (functionData: ImGuiFunction, skipSelf: boolean = false) => {
    let code = "";

    code += functionData.arguments
        .map((arg) => {
            if (skipSelf && arg.name === "self") {
                return "";
            }

            return `${arg.name}`;
        })
        .join(", ");

    if (code.startsWith(",")) {
        code = code.slice(2);
    }

    return code;
};

export const getParameters = (functionData: ImGuiFunction, skipSelf: boolean = false) => {
    let code = "";

    code += functionData.arguments
        .map((arg) => {
            if (skipSelf && arg.name === "self") {
                return "";
            }

            let type = getTsType(arg.type?.declaration ?? "any");
            const defaultValue = getDefaultValue(arg.default_value ?? "");

            if (defaultValue === "null") {
                type = `${type} | null`;
            }

            return `${arg.name}: ${type}${defaultValue ? ` = ${defaultValue}` : ""}`;
        })
        .join(", ");

    if (code.startsWith(",")) {
        code = code.slice(2);
    }

    return code;
};

export const generateFunctions = (ctx: GeneratorContext): string => {
    let code = "";

    const functions = ctx.data.functions.filter((f) => f.name.startsWith("ImGui_"));

    for (const functionData of functions) {
        const config = ctx.config.bindings?.functions;
        if (config?.[functionData.name]?.isExcluded) {
            continue;
        }

        const comment = generateJsDocComment(functionData);

        const overrideImpl = config?.[functionData.name]?.overrideImpl;
        if (overrideImpl?.ts) {
            code += comment;
            code += overrideImpl.ts.join("");
            continue;
        }

        const name = functionData.name.slice(6);
        const type = getTsType(functionData.return_type.declaration);

        const parameters = getParameters(functionData);
        const args = getArguments(functionData);

        code += comment;
        code += `    ${name}(${parameters}): ${type} {\n`;

        if (functionData.return_type.declaration === "void") {
            code += `        Mod.export.${functionData.name}(${args});\n`;
        } else {
            if (isStructType(type, ctx)) {
                code += `        return ${type}.From(Mod.export.${functionData.name}(${args}));\n`;
            } else {
                code += `        return Mod.export.${functionData.name}(${args});\n`;
            }
        }
        code += `    },\n`;
    }

    return code;
};
