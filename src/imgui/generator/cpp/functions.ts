import type { ImGuiArgument, ImGuiFunction } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode } from "../util.ts";

const pointerMap = {
    "bool*": "bool",
    "size_t*": "size_t",
    "float*": "float",
    "const float*": "float",
    "float[2]": "float",
    "float[3]": "float",
    "float[4]": "float",
    "double*": "double",
    "double[2]": "double",
    "double[3]": "double",
    "double[4]": "double",
    "int*": "int",
    "int[2]": "int",
    "int[3]": "int",
    "int[4]": "int",
    "unsigned int*": "unsigned int",
};

function isPrimitivePointer(arg: ImGuiArgument): boolean {
    return Object.keys(pointerMap).includes(arg.type?.declaration);
}

function getPreProcess(function_: ImGuiFunction): string {
    const code = function_.arguments
        .map((arg) => {
            const type = pointerMap[arg.type?.declaration as keyof typeof pointerMap];

            if (!type) {
                return "";
            }

            const size = arg.array_bounds ? `${arg.array_bounds}` : "1";

            return `    auto param_${arg.name} = get_array_param<${type}, ${size}>(${arg.name});\n`;
        })
        .filter((line) => line !== "")
        .join("");

    return code;
}

function getPostprocess(function_: ImGuiFunction): string {
    const code = function_.arguments
        .map((arg) => {
            if (!isPrimitivePointer(arg)) {
                return "";
            }

            return `    write_back_array_param(param_${arg.name}, ${arg.name});\n`;
        })
        .filter((line) => line !== "")
        .join("");

    return code;
}

export function getArguments(function_: ImGuiFunction): string {
    const code = function_.arguments
        .map((arg) => {
            if (arg.type?.declaration === "const char*") {
                return `${arg.name}.c_str()`;
            }

            if (isPrimitivePointer(arg)) {
                return `param_${arg.name}.ptr`;
            }

            return arg.name;
        })
        .join(", ");

    return code;
}

export function getParameters(function_: ImGuiFunction): string {
    const code = function_.arguments
        .map((arg) => {
            if (arg.type?.declaration === "const char*") {
                return `std::string ${arg.name}`;
            }

            if (isPrimitivePointer(arg)) {
                return `js_val ${arg.name}`;
            }

            return `${arg.type?.declaration} ${arg.name}`;
        })
        .join(", ");

    return code;
}

/**
 * Generates the C++ bindings code for the functions.
 */
export function getFunctionsCode(context: GeneratorContext): string {
    // Only use functions prefixed with "ImGui_" (functions in ImGui namespace)
    const functions = context.data.functions.filter((f) => f.name.startsWith("ImGui_"));
    const config = context.config.bindings?.functions;

    const fn = (function_: ImGuiFunction) => {
        const name = function_.name;
        const parameters = getParameters(function_);
        const args = getArguments(function_);
        const preProcess = getPreProcess(function_);
        const postProcess = getPostprocess(function_);

        let returnType = function_.return_type.declaration;
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
            if (function_.return_type.declaration.includes("*")) {
                return ", rvp_ref{}, allow_raw_ptrs{}";
            }

            if (function_.arguments.some((arg) => arg.type?.declaration.includes("*"))) {
                return ", allow_raw_ptrs{}";
            }

            return "";
        })();

        const ret = postProcess && returnType !== "void" ? "    return ret;\n" : "";

        // biome-ignore format: _
        return (
            `bind_fn("${name}", [](${parameters}) -> ${returnType} {\n` +
            preProcess +
            call +
            postProcess +
            ret +
            `}${policies});\n` +
            "\n"
        );
    };

    const code = getMappedCode(functions, config, fn, "cpp");

    return code;
}
