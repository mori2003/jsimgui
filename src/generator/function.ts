import { formatComment } from "./comment.ts";
import type { ImGuiArgument, ImGuiData, ImGuiFunction } from "./interface.ts";
import { toTsType } from "./types.ts";
import { isStructBound } from "./struct.ts";
import { functionBindings } from "./bindings.ts";

/** Filter out functions by a given prefix. Also filters out overload variants. */
function filterFunctionsByPrefix(functions: ImGuiFunction[], prefix: string): ImGuiFunction[] {
    const excludedSuffixes = ["V", "Callback", "Ptr", "Str", "ImVec2", "ImVec4"];

    return functions.filter(
        (func) =>
            func.name.startsWith(prefix) &&
            !excludedSuffixes.some((suffix) => func.name.endsWith(suffix)),
    );
}

/** Get the TypeScript default value from a c++ default value string. */
function getTsDefaultValue(defaultValue: string): string {
    if (!defaultValue) {
        return "";
    }

    const fixNumber = (val: string) => {
        return val
            .replace(/(\d+(\.\d+)?)[df]/g, "$1")
            .replace("FLT_MAX", "Number.MAX_VALUE")
            .replace("FLT_MIN", "Number.MIN_VALUE");
    };

    if (defaultValue.startsWith('"') && defaultValue.endsWith('"')) {
        return ` = "${defaultValue.slice(1, -1)}"`;
    }

    if (defaultValue === "NULL") {
        return " = null";
    }

    if (defaultValue.startsWith("ImVec")) {
        return ` = new ${fixNumber(defaultValue)}`;
    }

    return ` = ${fixNumber(defaultValue)}`;
}

function getFuncArgsTs(args: ImGuiArgument[]): string {
    return args
        .map((arg) => {
            if (!arg.type) {
                return `${arg.name}: any`;
            }

            const argType = toTsType(arg.type.declaration);
            const defaultValue = getTsDefaultValue(arg.default_value ?? "");
            if (defaultValue === " = null") {
                return `${arg.name}?: ${argType}`;
            }

            return arg.default_value
                ? `${arg.name}: ${argType}${defaultValue}`
                : `${arg.name}: ${argType}`;
        })
        .join(", ");
}

function getCallArgsTs(args: ImGuiArgument[]): string {
    return args
        .map((arg) => {
            if (!arg.type) {
                return `${arg.name}`;
            }

            const argType = toTsType(arg.type.declaration);

            if (isStructBound(argType)) {
                return `${arg.name}?._ptr || null`;
            }

            return `${arg.name}`;
        })
        .join(", ");
}

/** Generates TypeScript code for a function. */
export function getFunctionCodeTs(functionData: ImGuiFunction): string {
    if (functionBindings[functionData.name]?.exclude) {
        return "";
    }

    const override = functionBindings[functionData.name]?.override?.typescript;
    if (override) {
        return override;
    }

    const trimmedName = functionData.name.slice(6); // Remove the "ImGui_" prefix.
    const functionComment = formatComment(
        functionData.comments?.attached ?? functionData.comments?.preceding?.[0],
    );

    const funcArgs = getFuncArgsTs(functionData.arguments);
    const callArgs = getCallArgsTs(functionData.arguments);

    const returnType = toTsType(functionData.return_type.declaration);
    const funcCall = isStructBound(returnType)
        ? `return ${returnType}.wrap(Mod.export.${functionData.name}(${callArgs}));`
        : `return Mod.export.${functionData.name}(${callArgs});`;

    return [
        functionComment ? `    /** ${functionComment} */\n` : "",
        `    ${trimmedName}(${funcArgs}): ${returnType} { ${funcCall} },\n`,
        "\n",
    ].join("");
}

/** Generates TypeScript code for a class method. */
export function getMethodCodeTs(functionData: ImGuiFunction): string {
    if (functionBindings[functionData.name]?.exclude) {
        return "";
    }

    const override = functionBindings[functionData.name]?.override?.typescript;
    if (override) {
        return override;
    }

    const trimmedName = functionData.name.replace(`${functionData.original_class}_`, "");
    const functionComment = formatComment(
        functionData.comments?.attached ?? functionData.comments?.preceding?.[0],
    );

    // Slice arguments to remove "self".
    const args = functionData.arguments.slice(1);

    const funcArgs = getFuncArgsTs(args);
    const callArgs = getCallArgsTs(args);

    const returnType = toTsType(functionData.return_type.declaration);
    const funcCall = isStructBound(returnType)
        ? `return ${returnType}.wrap(this._ptr.${functionData.name}(${callArgs}));`
        : `return this._ptr.${functionData.name}(${callArgs});`;

    return [
        functionComment ? `    /** ${functionComment} */\n` : "",
        `    ${trimmedName}(${funcArgs}): ${returnType} { ${funcCall} }\n`,
        "\n",
    ].join("");
}

/** Generates TypeScript code for the functions in the ImGui data. */
export function generateFunctionsTs(jsonData: ImGuiData): string {
    const functions = filterFunctionsByPrefix(jsonData.functions, "ImGui_");
    const functionCode = functions.map((func) => getFunctionCodeTs(func)).join("");

    return ["    /* Functions */\n", "\n", ...functionCode].join("");
}

function isStringArg(arg) {
    const decl = arg.type?.declaration;

    return decl === "const char*";
}

function isPrimitivePointerArg(arg) {
    const decl = arg.type?.declaration;

    return (
        decl === "void*" ||
        decl === "float*" ||
        decl === "int*" ||
        decl === "bool*" ||
        decl?.endsWith("]")
    );
}

function getFuncArgsCpp(args: ImGuiArgument[]): string {
    return args
        .map((arg) => {
            if (!arg.type) {
                return "";
            }

            if (isStringArg(arg)) {
                return `std::string ${arg.name}`;
            }

            if (isPrimitivePointerArg(arg)) {
                return `emscripten::val ${arg.name}`;
            }

            return `${arg.type?.declaration} ${arg.name}`;
        })
        .join(", ");
}

function getCallArgsCpp(args: ImGuiArgument[]): string {
    return args
        .map((arg) => {
            if (isStringArg(arg)) {
                return `${arg.name}.c_str()`;
            }

            if (isPrimitivePointerArg(arg)) {
                return `&_bind_${arg.name}`;
            }

            return arg.name;
        })
        .join(", ");
}

/** Generates C++ code for a function. */
function getFunctionCodeCpp(functionData: ImGuiFunction): string {
    if (functionBindings[functionData.name]?.exclude) {
        return "";
    }

    const override = functionBindings[functionData.name]?.override?.cplusplus;
    if (override) {
        return override;
    }

    let policies = "";
    let allowedPtr = false;

    if (functionData.return_type.declaration.includes("*")) {
        policies = ", rvp_ref(), allow_ptr()";
        allowedPtr = true;
    }

    if (!allowedPtr && functionData.arguments.some((arg) => arg.type?.declaration.includes("*"))) {
        policies = ", allow_ptr()";
    }

    const funcArgs = getFuncArgsCpp(functionData.arguments);
    const callArgs = getCallArgsCpp(functionData.arguments);

    const bindings = functionData.arguments
        .map((arg) => {
            if (isPrimitivePointerArg(arg)) {
                let trimmedType = arg.type?.declaration.replace("*", "");
                if (trimmedType.endsWith("]")) {
                    trimmedType = trimmedType.slice(0, -3);
                }

                return `    auto _bind_${arg.name} = ArrayParam<${trimmedType}>(${arg.name});\n`;
            }

            return "";
        })
        .join("");

    const funcBody = functionData.arguments.some((arg) => isPrimitivePointerArg(arg))
        ? [
              bindings,
              functionData.return_type.declaration === "void"
                  ? `    ${functionData.name}(${callArgs});\n`
                  : `    const auto _ret = ${functionData.name}(${callArgs});\n`,
              functionData.return_type.declaration === "void"
                  ? "    return;\n"
                  : "    return _ret;\n",
          ].join("")
        : `    return ${functionData.name}(${callArgs});\n`;

    return [
        `bind_fn("${functionData.name}", [](${funcArgs}){\n`,
        funcBody,
        `}${policies});\n`,
        "\n",
    ].join("");
}

/** Generates C++ code for a struct method. */
export function getMethodCodeCpp(functionData: ImGuiFunction): string {
    if (functionBindings[functionData.name]?.exclude) {
        return "";
    }

    const override = functionBindings[functionData.name]?.override?.cplusplus;
    if (override) {
        return override;
    }

    const funcArgs = getFuncArgsCpp(functionData.arguments);
    const callArgs = getCallArgsCpp(functionData.arguments);

    return `.function("${functionData.name}", override([](${funcArgs}){ return ${functionData.name}(${callArgs}); }), allow_ptr())\n`;
}

/** Generates C++ code for the functions in the ImGui data. */
export function generateFunctionsCpp(jsonData: ImGuiData): string {
    const functions = filterFunctionsByPrefix(jsonData.functions, "ImGui_");
    return functions.map((func) => getFunctionCodeCpp(func)).join("");
}
