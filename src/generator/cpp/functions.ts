import type { ImGuiFunction } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";

export const getPreProcess = (functionData: ImGuiFunction) => {
    let code = "";

    code += functionData.arguments
        .map((arg) => {
            if (arg.type?.declaration === "bool*") {
                return `    auto _bind_${arg.name} = ArrayParam<bool>(${arg.name});\n`;
            }

            return "";
        })
        .join("");

    return code;
};

export const getArguments = (functionData: ImGuiFunction) => {
    let code = "";

    code += functionData.arguments
        .map((arg) => {
            if (arg.type?.declaration === "const char*") {
                return `${arg.name}.c_str()`;
            }

            if (arg.type?.declaration === "ImVec2") {
                return `get_imvec2(${arg.name})`;
            }

            if (arg.type?.declaration === "ImVec4") {
                return `get_imvec4(${arg.name})`;
            }

            if (arg.type?.declaration === "ImTextureRef") {
                return `get_imtexture_ref(${arg.name})`;
            }

            if (arg.type?.declaration === "bool*") {
                return `&_bind_${arg.name}`;
            }

            return arg.name;
        })
        .join(", ");

    return code;
};

export const getParameters = (functionData: ImGuiFunction) => {
    let code = "";

    code += functionData.arguments
        .map((arg) => {
            if (arg.type?.declaration === "const char*") {
                return `std::string ${arg.name}`;
            }

            if (arg.type?.declaration === "bool*") {
                return `JsVal ${arg.name}`;
            }

            if (
                arg.type?.declaration === "ImVec2" ||
                arg.type?.declaration === "ImVec4" ||
                arg.type?.declaration === "ImTextureRef"
            ) {
                return `JsVal ${arg.name}`;
            }

            return `${arg.type?.declaration} ${arg.name}`;
        })
        .join(", ");

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

        let policies = "";
        let allowedPtr = false;

        if (functionData.return_type.declaration.includes("*")) {
            policies = ", rvp_ref(), allow_ptr()";
            allowedPtr = true;
        }

        if (
            !allowedPtr &&
            functionData.arguments.some((arg) => arg.type?.declaration.includes("*"))
        ) {
            policies = ", allow_ptr()";
        }

        const overrideImpl = config?.[functionData.name]?.overrideImpl;
        if (overrideImpl?.cpp) {
            code += overrideImpl.cpp.join("");
            continue;
        }

        const name = functionData.name;
        const returnType = functionData.return_type.declaration;
        const parameters = getParameters(functionData);
        const args = getArguments(functionData);

        const preProcess = getPreProcess(functionData);

        code += `bind_fn("${name}", [](${parameters}) -> ${returnType} {\n`;
        code += preProcess;

        if (returnType === "void") {
            code += `    ${name}(${args});\n`;
        } else {
            code += `    return ${name}(${args});\n`;
        }

        code += `}${policies});\n`;
        code += "\n";
    }

    return code;
};
