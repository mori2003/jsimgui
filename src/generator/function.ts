import { getJsDocComment } from "./comment";
import type { CommentBinding } from "./comment.ts";
import type { GeneratorContext } from "./config";
import { getTsType, isReferenceStruct, isStructType } from "./util.ts";

type FunctionArgument = {
    name: string;
    type: string;
    defaultValue?: string;
    arrayBounds?: number;
};

export type FunctionBinding = {
    name: string;
    arguments: FunctionArgument[];
    returnType: string;
    comments?: CommentBinding;
};

function getDefaultValue(param: FunctionArgument): string {
    let defaultValue = param.defaultValue;

    if (!defaultValue) {
        return "";
    }

    // Use JavaScript's numeric limits
    defaultValue = defaultValue.replace("FLT_MIN", "Number.MIN_VALUE");
    defaultValue = defaultValue.replace("FLT_MAX", "Number.MAX_VALUE");

    if (defaultValue === "NULL" && param.type === "const char*") {
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

function getParameters(function_: FunctionBinding, isMethod: boolean): string {
    return function_.arguments
        .filter((arg) => !(isMethod && arg.name === "self"))
        .map((arg) => {
            let type = getTsType(arg.type ?? "any");
            const defaultValue = getDefaultValue(arg);

            // "in" is a reserved keyword
            let name = arg.name;
            if (arg.name === "in") {
                name = "in_";
            }

            // Add nullability to the type if the default value is null.
            // Used for pointer parameters.
            // Example: "bool* p_open = NULL" -> "[boolean] | null = null"
            if (defaultValue === "null") {
                type = `${type} | null`;
            }

            const defaultPart = defaultValue ? ` = ${defaultValue}` : "";
            return `${name}: ${type}${defaultPart}`;
        })
        .join(", ");
}

export function getArguments(function_: FunctionBinding, isMethod: boolean): string {
    return function_.arguments
        .filter((arg) => !(isMethod && arg.name === "self"))
        .map((arg) => {
            // "in" is a reserved keyword
            let name = arg.name;
            if (arg.name === "in") {
                name = "in_";
            }

            if (isReferenceStruct(arg.type)) {
                return `${name}?.ptr ?? null`;
            }

            return name;
        })
        .join(", ");
}

function getCall(function_: FunctionBinding, isMethod: boolean): string {
    const args = getArguments(function_, isMethod);
    const returnType = getTsType(function_.returnType);

    const exports = isMethod ? "this.ptr." : "Mod.export.";

    if (isStructType(function_.returnType)) {
        return `        return ${returnType}.From(${exports}${function_.name}(${args}));`;
    }

    if (returnType === "void") {
        return `        ${exports}${function_.name}(${args});\n`;
    }

    return `        return ${exports}${function_.name}(${args});\n`;
}

export function getFunctionCodeTs(
    context: GeneratorContext,
    function_: FunctionBinding,
    prefix: string,
    isMethod: boolean,
): string {
    const config = context.config.functions?.[function_.name];
    if (config?.exclude) return "";
    if (config?.override?.ts) return config.override.ts.join("");

    const comment = getJsDocComment(function_.comments);
    const name = function_.name.slice(prefix.length);
    const returnType = getTsType(function_.returnType);

    const params = getParameters(function_, isMethod);
    const call = getCall(function_, isMethod);

    if (isMethod) {
        return `${comment}${name}(${params}): ${returnType} {\n${call}\n}\n`;
    }

    return `${comment}${name}(${params}): ${returnType} {\n${call}\n},\n`;
}
