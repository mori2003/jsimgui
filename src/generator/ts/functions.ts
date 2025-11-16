import type { ImGuiArgument, ImGuiFunction } from "../interface";
import type { GeneratorContext } from "../main.ts";
import { generateJsDocComment } from "./comments.ts";
import { getTsType, isStructType } from "./structs.ts";

const getDefaultValue = (arg: ImGuiArgument): string => {
    // TODO: Refactor!
    let defaultValue = arg.default_value ?? "";
    defaultValue = defaultValue.replace("FLT_MIN", "Number.MIN_VALUE");
    defaultValue = defaultValue.replace("FLT_MAX", "Number.MAX_VALUE");

    if (defaultValue === "NULL" && arg.type?.declaration === "const char*") {
        return '""';
    }

    if (defaultValue === "NULL") {
        return "null";
    }

    if (defaultValue === "ImVec2(0.0f, 0.0f)") {
        return `new ImVec2(0.0, 0.0)`;
    }

    if (defaultValue.startsWith("ImVec")) {
        return `new ${defaultValue}`;
    }

    if (/^[+-]?[\d.]+f$/.test(defaultValue)) {
        return defaultValue.slice(0, -1);
    }

    if (defaultValue === "sizeof(float)") {
        return "4";
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

            if (
                arg.type?.description?.kind === "Pointer" &&
                arg.type?.description?.inner_type?.kind === "User" &&
                arg.type?.declaration !== "ImVec2" &&
                arg.type?.declaration !== "size_t*" &&
                arg.type?.declaration !== "const ImVec2*" &&
                arg.type?.declaration !== "const ImVec4*" &&
                arg.type?.declaration !== "ImVec4" &&
                arg.type?.declaration !== "ImTextureRef"
            ) {
                return `${arg.name}?.ptr ?? null`;
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
            const defaultValue = getDefaultValue(arg);

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
