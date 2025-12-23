import type { ImGuiArgument, ImGuiFunction } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode, getTsType, isStructType } from "../util.ts";
import { getJsDocComment } from "./comments.ts";

/**
 * Get the TypeScript code for the default value of a parameter.
 */
function getDefaultValue(param: ImGuiArgument): string {
    // TODO: Refactor this mess!
    let defaultValue = param.default_value;

    if (!defaultValue) {
        return "";
    }

    // Use JavaScript's maximum number constants
    // TODO: Use 32bit float constants?
    defaultValue = defaultValue.replace("FLT_MIN", "Number.MIN_VALUE");
    defaultValue = defaultValue.replace("FLT_MAX", "Number.MAX_VALUE");

    if (defaultValue === "NULL" && param.type?.declaration === "const char*") {
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

    // Remove 'f' suffix from float literals (e.g., "0.5f" -> "0.5")
    if (/^[+-]?[\d.]+f$/.test(defaultValue)) {
        return defaultValue.slice(0, -1);
    }

    // Use 32-bit (4 bytes) float size of C++ instead of JavaScript's 64-bit (8 bytes) number size
    if (defaultValue === "sizeof(float)") {
        return "4";
    }

    return defaultValue;
}

/**
 * Get the TypeScript code for the call arguments of a function.
 */
export function getArguments(function_: ImGuiFunction, skipSelf: boolean = false): string {
    /**
     * Check if a parameter is a bound struct which is not a value object
     * (ImVec2, ImVec4, ImTextureRef) and not some primitive pointer type.
     */
    const isNonValueObjectStruct = (arg: ImGuiArgument) => {
        const type = arg.type;

        // TODO: Refactor this mess!
        return (
            type?.description?.kind === "Pointer" &&
            type?.description?.inner_type?.kind === "User" &&
            type?.declaration !== "ImVec2" &&
            type?.declaration !== "ImVec4" &&
            type?.declaration !== "const ImVec2*" &&
            type?.declaration !== "const ImVec4*" &&
            type?.declaration !== "ImTextureRef" &&
            type?.declaration !== "size_t*"
        );
    };

    const code = function_.arguments
        .filter((arg) => !(skipSelf && arg.name === "self"))
        .map((arg) => {
            if (isNonValueObjectStruct(arg)) {
                return `${arg.name}?.ptr ?? null`;
            }

            return arg.name;
        })
        .join(", ");

    return code;
}

/**
 * Get the TypeScript code for the parameters of a function.
 */
export function getParameters(function_: ImGuiFunction, skipSelf: boolean = false): string {
    const code = function_.arguments
        .filter((param) => !(skipSelf && param.name === "self"))
        .map((param) => {
            let type = getTsType(param.type?.declaration ?? "any");
            const defaultValue = getDefaultValue(param);

            // Add nullability to the type if the default value is null.
            // Used for pointer parameters.
            // Example: "bool* p_open = NULL" -> "[boolean] | null = null"
            if (defaultValue === "null") {
                type = `${type} | null`;
            }

            const defaultPart = defaultValue ? ` = ${defaultValue}` : "";
            return `${param.name}: ${type}${defaultPart}`;
        })
        .join(", ");

    return code;
}

/**
 * Generates the TypeScript bindings code for the functions.
 */
export function getFunctionsCode(context: GeneratorContext): string {
    // Only use functions prefixed with "ImGui_" (functions in ImGui namespace)
    const functions = context.data.functions.filter((f) => f.name.startsWith("ImGui_"));
    const config = context.config.bindings?.functions;

    const fn = (function_: ImGuiFunction) => {
        const comment = getJsDocComment(function_);

        // Remove "ImGui_" prefix from function name
        const name = function_.name.slice(6);
        const returnType = getTsType(function_.return_type.declaration);

        const params = getParameters(function_);
        const args = getArguments(function_);

        const call = (() => {
            const returnDecl = function_.return_type.declaration;

            if (returnDecl === "void") {
                return `        Mod.export.${function_.name}(${args});\n`;
            }

            if (isStructType(context, returnType)) {
                return `        return ${returnType}.From(Mod.export.${function_.name}(${args}));`;
            }

            return `        return Mod.export.${function_.name}(${args});\n`;
        })();

        // biome-ignore format: _
        return (
            comment +
            `    ${name}(${params}): ${returnType} {\n` +
            call +
            `    },\n` +
            "\n"
        );
    };

    const code = getMappedCode(functions, config, fn, "ts");

    return code;
}
