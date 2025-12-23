import type { ImGuiArgument, ImGuiFunction } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode } from "../util";

function isPrimitivePointer(arg: ImGuiArgument): boolean {
    const primitivePointers = [
        "bool*",
        "float*",
        "size_t*",
        "const float*",
        "double*",
        "int*",
        "unsigned int*",
        "float[2]",
        "float[3]",
        "float[4]",
        "int[2]",
        "int[3]",
        "int[4]",
        "double[2]",
        "double[3]",
        "double[4]",
    ];

    return primitivePointers.includes(arg.type?.declaration);
}

function isValueObject(arg: ImGuiArgument): boolean {
    const valueObjects = ["ImVec2", "ImVec4", "ImTextureRef"];
    return valueObjects.includes(arg.type?.declaration);
}

function getPreProcess(function_: ImGuiFunction): string {
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

    const code = function_.arguments
        .map((arg) => {
            const type = pointerMap[arg.type?.declaration as keyof typeof pointerMap];

            if (!type) {
                return "";
            }

            return `    auto _bind_${arg.name} = ArrayParam<${type}>(${arg.name});\n`;
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

            // TODO: Refactor
            if (arg.type?.declaration === "ImVec2") {
                return `get_imvec2(${arg.name})`;
            }

            if (arg.type?.declaration === "ImVec4") {
                return `get_imvec4(${arg.name})`;
            }

            if (arg.type?.declaration === "ImTextureRef") {
                return `get_imtexture_ref(${arg.name})`;
            }

            if (isPrimitivePointer(arg)) {
                return `&_bind_${arg.name}`;
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

            if (isPrimitivePointer(arg) || isValueObject(arg)) {
                return `JsVal ${arg.name}`;
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

        let returnType = function_.return_type.declaration;
        if (returnType === "const char*") {
            returnType = "std::string";
        }

        const call = (() => {
            if (returnType === "void") {
                return `    ${name}(${args});\n`;
            }

            if (returnType === "const char*") {
                return `    return std::string(${name}(${args}));\n`;
            }

            return `    return ${name}(${args});\n`;
        })();

        const policies = (() => {
            if (function_.return_type.declaration.includes("*")) {
                return ", ReturnRef{}, AllowRawPtrs{}";
            }

            if (function_.arguments.some((arg) => arg.type?.declaration.includes("*"))) {
                return ", AllowRawPtrs{}";
            }

            return "";
        })();

        // biome-ignore format: _
        return (
            `bind_fn("${name}", [](${parameters}) -> ${returnType} {\n` +
            preProcess +
            call +
            `}${policies});\n` +
            "\n"
        );
    };

    const code = getMappedCode(functions, config, fn, "cpp");

    return code;
}
