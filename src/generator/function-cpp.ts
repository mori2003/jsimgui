import type { GeneratorContext } from "./config.ts";
import type { FunctionBinding } from "./function.ts";

const POINTER_MAP = new Map<string, string>([
    ["bool*", "bool"],
    ["size_t*", "size_t"],
    ["float*", "float"],
    ["const float*", "float"],
    ["float[2]", "float"],
    ["float[3]", "float"],
    ["float[4]", "float"],
    ["double*", "double"],
    ["double[2]", "double"],
    ["double[3]", "double"],
    ["double[4]", "double"],
    ["int*", "int"],
    ["int[2]", "int"],
    ["int[3]", "int"],
    ["int[4]", "int"],
    ["unsigned int*", "unsigned int"],
]);

function isPrimitivePointer(declaration: string): boolean {
    return POINTER_MAP.has(declaration);
}

function getPreProcess(function_: FunctionBinding): string {
    return function_.arguments
        .map((arg) => {
            const type = POINTER_MAP.get(arg.type);
            if (!type) {
                return "";
            }

            const size = arg.arrayBounds ?? 1;

            return `    auto param_${arg.name} = get_array_param<${type}, ${size}>(${arg.name});\n`;
        })
        .filter((line) => line !== "")
        .join("");
}

function getPostprocess(function_: FunctionBinding): string {
    return function_.arguments
        .map((arg) => {
            if (isPrimitivePointer(arg.type)) {
                return `    write_back_array_param(param_${arg.name}, ${arg.name});\n`;
            }
            return "";
        })
        .filter((line) => line !== "")
        .join("");
}

function getArguments(function_: FunctionBinding): string {
    return function_.arguments
        .map((arg) => {
            if (isPrimitivePointer(arg.type)) {
                return `param_${arg.name}.ptr`;
            }

            if (arg.type === "const char*") {
                return `${arg.name}.c_str()`;
            }

            return arg.name;
        })
        .join(", ");
}

function getParameters(function_: FunctionBinding): string {
    return function_.arguments
        .map((arg) => {
            if (arg.type === "const char*") {
                return `std::string ${arg.name}`;
            }

            if (isPrimitivePointer(arg.type)) {
                return `js_val ${arg.name}`;
            }

            return `${arg.type} ${arg.name}`;
        })
        .join(", ");
}

export function getFunctionCodeCpp(
    context: GeneratorContext,
    function_: FunctionBinding,
    isMethod: boolean,
): string {
    const config = context.config.functions?.[function_.name];
    if (config?.exclude) return "";
    if (config?.override?.cpp) return config.override.cpp.join("");

    const name = function_.name;
    const parameters = getParameters(function_);
    const args = getArguments(function_);
    const preProcess = getPreProcess(function_);
    const postProcess = getPostprocess(function_);

    let returnType = function_.returnType;
    if (returnType === "const char*") {
        returnType = "std::string";
    }

    const call = (() => {
        if (returnType === "void") {
            return `    ${name}(${args});\n`;
        }

        if (returnType === "const char*") {
            if (postProcess) {
                return `    auto const ret = std::string(${name}(${args}));\n`;
            }

            return `    return std::string(${name}(${args}));\n`;
        }

        if (postProcess) {
            return `    auto const ret = ${name}(${args});\n`;
        }

        return `    return ${name}(${args});\n`;
    })();

    const policies = (() => {
        if (returnType.includes("*")) {
            return ", rvp_ref{}, allow_raw_ptrs{}";
        }

        if (function_.arguments.some((arg) => arg.type?.includes("*"))) {
            return ", allow_raw_ptrs{}";
        }

        return "";
    })();

    const ret = postProcess && returnType !== "void" ? "    return ret;\n" : "";

    if (isMethod) {
        return (
            `.function("${name}", override([](${parameters}) -> ${returnType} {\n` +
            call +
            `}), allow_raw_ptrs{})\n` +
            "\n"
        );
    }

    return (
        `bind_fn("${name}", [](${parameters}) -> ${returnType} {\n` +
        preProcess +
        call +
        postProcess +
        ret +
        `}${policies});\n` +
        "\n"
    );
}
