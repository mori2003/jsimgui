// Filter out overloade variants and non-Ex variants of the functions.

import { getTypeMapping } from "./typedef.js";
import { getJsReturnType } from "./typedef.js";

// Because we only want to bind the Ex variants in order to use default values.
function filterFunctions(functions) {
    const excludedSuffixes = ["ID", "V", "Callback", "Int", "Ptr", "Str", "ImVec2", "ImVec4"];

    const excludedFunctions = [
        "ImGui_GetIO", // Manually bound.
        "ImGui_GetStyle", // Manually bound.

        "ImGui_TextUnformatted",
        "ImGui_TextUnformattedEx",
        "ImGui_Text", // Manually bound.
        "ImGui_TextV", // Manually bound.
        "ImGui_TextColored", // Manually bound.
        "ImGui_TextColoredV", // Manually bound.
        "ImGui_TextDisabled", // Manually bound.
        "ImGui_TextDisabledV", // Manually bound.
        "ImGui_TextWrapped", // Manually bound.
        "ImGui_TextWrappedV", // Manually bound.
        "ImGui_LabelText", // Manually bound.
        "ImGui_LabelTextV", // Manually bound.
        "ImGui_BulletText", // Manually bound.
        "ImGui_BulletTextV", // Manually bound.
        "ImGui_SeparatorText", // Manually bound.
        "ImGui_SetTooltip", // Manually bound.
        "ImGui_SetItemTooltip", // Manually bound.

        "ImGui_GetClipboardText", // Manually bound.
        "ImGui_SetClipboardText", // Manually bound.

        "ImGui_PlotLinesEx", // Manually bound.
        "ImGui_PlotHistogramEx", // Manually bound.

        "ImGui_InputTextEx", // Manually bound.
        "ImGui_InputTextWithHintEx", // Manually bound.
        "ImGui_InputTextMultilineEx", // Manually bound.

        "ImGui_ImageEx", // Manually bound.
        "ImGui_ImageButtonEx", // Manually bound.

        "ImGui_ListBox", // Excluded. Use BeginListBox/EndListBox instead.
        "ImGui_ListBoxEx", // Excluded. Use BeginListBox/EndListBox instead.
        "ImGui_ListBoxCallbackEx", // Excluded. Use BeginListBox/EndListBox instead.
        "ImGui_Combo", // Excluded. Use BeginCombo/EndCombo instead.
        "ImGui_ComboCharEx", // Excluded. Use BeginCombo/EndCombo instead.
        "ImGui_ComboCallbackEx", // Excluded. Use BeginCombo/EndCombo instead.

        "ImGui_DragScalarEx", // Excluded.
        "ImGui_DragScalarNEx", // Excluded.
        "ImGui_InputScalarEx", // Excluded.
        "ImGui_InputScalarNEx", // Excluded.
        "ImGui_SliderScalarEx", // Excluded.
        "ImGui_SliderScalarNEx", // Excluded.
        "ImGui_VSliderScalarEx", // Excluded.

        "ImGui_BeginDragDropSource",
        "ImGui_SetDragDropPayload",
        "ImGui_EndDragDropSource",
        "ImGui_BeginDragDropTarget",
        "ImGui_AcceptDragDropPayload",
        "ImGui_EndDragDropTarget",
        "ImGui_GetDragDropPayload",

        "ImGui_SetNextWindowSizeConstraints",
        "ImGui_LogToTTY",
        "ImGui_LogToFile",
        "ImGui_LogToClipboard",
        "ImGui_LogFinish",
        "ImGui_LogButtons",
        "ImGui_LogText",
        "ImGui_UpdatePlatformWindows",
        "ImGui_RenderPlatformWindowsDefaultEx",
        "ImGui_DestroyPlatformWindows",
        "ImGui_FindViewportByPlatformHandle",

        "ImGui_LoadIniSettingsFromDisk",
        "ImGui_LoadIniSettingsFromMemory",
        "ImGui_SaveIniSettingsToDisk",
        "ImGui_SaveIniSettingsToMemory",
        "ImGui_DebugTextEncoding",
        "ImGui_DebugFlashStyleColor",
        "ImGui_DebugStartItemPicker",
        "ImGui_DebugCheckVersionAndDataLayout",
        "ImGui_DebugLog",
        "ImGui_SetAllocatorFunctions",
        "ImGui_GetAllocatorFunctions",
        "ImGui_MemAlloc",
        "ImGui_MemFree",

        "ImGui_ColorConvertFloat4ToU32",
        "ImGui_ColorConvertHSVtoRGB",
        "ImGui_ColorConvertU32ToFloat4",
        "ImGui_GetColorU32",
        "ImGui_GetColorU32Ex",
        "ImGui_GetColorU32ImU32",
        "ImGui_GetColorU32ImU32Ex",
    ];

    const functionGroups = new Map();

    functions.forEach((func) => {
        const baseName = func.name.endsWith("Ex") ? func.name.slice(0, -2) : func.name;

        if (!functionGroups.has(baseName)) {
            functionGroups.set(baseName, []);
        }
        functionGroups.get(baseName).push(func.name);
    });

    const includedFunctions = new Set();

    for (const [baseName, variants] of functionGroups) {
        if (
            excludedSuffixes.some((suffix) => baseName.endsWith(suffix)) ||
            excludedFunctions.includes(baseName)
        ) {
            continue;
        }

        const exVariant = variants.find((name) => name.endsWith("Ex"));
        includedFunctions.add(exVariant || variants[0]);
    }

    // Always include these specific functions
    includedFunctions.add("ImGui_PushID");
    includedFunctions.add("ImGui_PopID");
    includedFunctions.add("ImGui_GetID");

    return functions.filter((func) =>
        func.name.startsWith("ImGui_") && includedFunctions.has(func.name) &&
        !excludedFunctions.includes(func.name)
    );
}

class Type {
    data;
    decl;
    jsType;
    cppType;
    isPointer;
    isString;
    isArray;
    isPrimitivePointer;
    isStruct;
    isImVec;

    constructor(typeData) {
        this.data = typeData;
        this.decl = typeData.declaration;
        this.isPointer = this.#isPointer(typeData);
        this.isString = this.#isString(typeData);
        this.isArray = this.#isArray(typeData);
        this.isPrimitivePointer = this.#isPrimitivePointer(typeData);
        this.isStruct = this.#isStruct(typeData);
        this.isImVec = this.#isImVec(typeData);
        this.cppType = this.#getCppType(typeData);
    }

    #isPointer(typeData) {
        return typeData.declaration.includes("*");
    }

    #isString(typeData) {
        return typeData.declaration === "char*" || typeData.declaration === "const char*";
    }

    #isArray(typeData) {
        return typeData.declaration.includes("[");
    }

    #isStruct(typeData) {
        return typeData.description.kind === "User" || typeData.description.inner_type?.kind === "User";
        //return typeData.declaration.includes("struct");
    }

    #isImVec(typeData) {
        return typeData.declaration.includes("ImVec") || typeData.inner_type?.declaration.includes("ImVec");
    }

    #isPrimitivePointer(typeData) {
        return typeData.description.kind === "Pointer" &&
            typeData.description.inner_type.kind === "Builtin" &&
            typeData.description.inner_type.builtin_type !== "char";
    }

    // Convert char* to std::string, primitive pointers to emscripten::val, etc.
    #getCppType(typeData) {
        if (this.isString) {
            return "std::string";
        }

        if (this.isArray || this.isPrimitivePointer) {
            return `emscripten::val`;
        }

        return typeData.declaration;
    }
}

class FunctionParam {
    name;
    type;
    jsDefaultValue;

    constructor(paramData) {
        this.name = paramData.name;
        this.type = new Type(paramData.type);
        this.jsDefaultValue = this.#getJsDefaultValueDecl(paramData.default_value, this.type);
    }

    #getJsDefaultValueDecl(defaultValue, type) {
        if (!defaultValue) return "";

        const fixNumber = (val) => {
            return val.replace(/(\d+(\.\d+)?)[df]/g, '$1')
                .replace("FLT_MAX", "Number.MAX_VALUE")
                .replace("FLT_MIN", "Number.MIN_VALUE");
        };

        // Handle NULL -> null.
        if (defaultValue === "NULL") {
            return ` = null`;
        }

        if (type.isString) {
            return (defaultValue === undefined) ? " = \"\"" : ` = ${defaultValue}`;

            //return ` = "${defaultValue}"`;
        }

        // Handle ImVecs
        if (defaultValue?.startsWith("ImVec")) {
            return ` = new ${fixNumber(defaultValue)}`;
        }

        // return ` = ${fixNumber(defaultValue)}`;
        // if (!defaultValue) {
        //     return "";
        // }

        return ` = ${fixNumber(defaultValue)}`;
    }
}

class FunctionBinding {
    name;
    trimmedName; // Removed ImGui_ prefix and Ex suffix (if present).
    params;
    returnType;

    constructor(functionData) {
        this.name = functionData.name;
        this.trimmedName = this.#getTrimmedName(functionData.name);
        this.params = functionData.arguments.map((arg) => new FunctionParam(arg));
        //this.returnType = getJsReturnType(functionData.return_type.declaration, typedefData);
        this.returnType = new Type(functionData.return_type);
    }

    #getTrimmedName(name) {
        let trimmedName = name;

        if (name.startsWith("ImGui_")) trimmedName = name.slice(6);
        if (trimmedName.endsWith("Ex")) trimmedName = trimmedName.slice(0, -2);

        return trimmedName;
    }

    getJsParamList() {
        return this.params.map((param) => `${param.name}${param.jsDefaultValue}`).join(", ");
    }

    getJsCallList() {
        return this.params.map((param) => {
            let call = param.name;

            if (param.type.isImVec) {
                call = `${call}.unwrap()`;
            }
            // If it is a struct, use toNative().
            // if (param.type.isString) {
            //     call = `${call}.c_str()`;
            // }

            return call;
        }).join(", ");
    }

    getCppParamList() {
        return this.params.map((param) => `${param.type.cppType} ${param.name}`).join(", ");
    }

    getCppCallList() {
        return this.params.map((param) => {
            let call = param.name;

            if (param.type.isString) {
                call = `${call}.c_str()`;
            }

            if (param.type.isArray) {
                //call = `&ArrayParam<${param.type.decl.slice(0, -3)}>(${call})`;
                call = `&${call}_bind`;
            }

            if (param.type.isPrimitivePointer) {
                if (param.type.decl === "bool*") {
                    call = `&${call}_bind`;
                }
                else {
                    call = `&${call}_bind`;
                }
                //call = `&PointerParam<${param.type.decl.replace("*", "")}>(${call})`;
                //call = `${call}_bind.data()`;
            }

            return call;
        }).join(", ");
    }

    getCppBindings() {
        let code = "";

        for (const param of this.params) {
            // Gets the type without * or [].
            let type = param.type.decl.replace(/\*|\[.*\]/g, "");

            if (param.type.isPrimitivePointer || param.type.isArray) {
                // if (type === "bool") {
                //     code += `        bool ${param.name}_bind = ${param.name}[0].as<bool>();\n`;
                // }
                // else {
                //     code += `        auto ${param.name}_bind = toNativeArray<${type}>(${param.name});\n`;
                // }
                code += `        auto ${param.name}_bind = ArrayParam<${type}>(${param.name});\n`;
            }
        }

        return code;
    }

    getCppUpdates() {
        let code = "";

        for (const param of this.params) {
            if (param.type.isPrimitivePointer || param.type.isArray) {
                if (param.type.decl === "bool*") {
                    code += `        updateJsBool(${param.name}, &${param.name}_bind);\n`;
                }
                else {
                    code += `        updateJsArray(${param.name}, ${param.name}_bind.data());\n`;
                }
            }
        }

        return code;
    }
}

function getJsFunctionCode(functionData, typedefData) {
    const func = new FunctionBinding(functionData);

    //let code =
        `    ${func.trimmedName}: (${func.getJsParamList()}) => { return Mod.main.${func.name}(${func.getJsCallList()}) },\n`;

    let code = [
        "    /** [Auto] */",
        `    ${func.trimmedName}: (${func.getJsParamList()}) => { return Mod.main.${func.name}(${func.getJsCallList()}) },`,
        "",
    ].join("\n");

    if (func.returnType.isStruct) {
        const wrapperType = func.returnType.decl.replace("*", "").replace("const ", "");
        const typeMap = getTypeMapping(typedefData)

        if (!(typeMap.has(wrapperType))) {
            code = [
                "    /** [Auto] */",
                `    ${func.trimmedName}: (${func.getJsParamList()}) => { return ${wrapperType}.wrap(Mod.main.${func.name}(${func.getJsCallList()})) },`,
                "",
            ].join("\n");
        }
    }

    // if (func.returnType.isStruct) {
    //     const wrapperType = "test";
    //     code =
    //         `${func.trimmedName}: (${func.getJsParamList()}) => { return toWrap(Mod.get().${func.name}(${func.getJsCallList()}), ${wrapperType}) },\n`;
    // }

    return code;
}

function getCppFunctionCode(functionData) {
    const func = new FunctionBinding(functionData);

    let policies = "";
    let allowedPtr = false;

    if (func.returnType.isPointer) {
        policies = `, return_ref(), allow_ptr()`;
        allowedPtr = true;
    }

    if (!allowedPtr && func.params.some((param) => param.type.isPointer)) {
        policies = `, allow_ptr()`;
    }

    let code =  `    bind_func("${func.name}", [](${func.getCppParamList()}){\n`;

    if (func.returnType.decl === "void") {
        code += func.getCppBindings();
        code += `        ${functionData.name}(${func.getCppCallList()});\n`;
        //code += func.getCppUpdates();
    } else {
        code += func.getCppBindings();
        code += `        const auto ret = ${functionData.name}(${func.getCppCallList()});\n`;
        //code += func.getCppUpdates();
        code += `        return ret;\n`;
    }

    code += `    }${policies});\n`;
    code += "\n";

    return code;
}

export function generateFunctions(jsonData) {
    const functions = filterFunctions(jsonData.functions);
    let manualBindings = Deno.readTextFileSync("./src/templates/tmpl-imgui-functions.js");
    manualBindings = manualBindings.split('\n').slice(1, -2).join('\n');

    let jsFunctions = "";

    for (const func of functions) {
        jsFunctions += getJsFunctionCode(func, jsonData.typedefs);
    }

    const jsCode = [
        "/**",
        " * Namespace that provides access to the ImGui functions.",
        " * @namespace {ImGui}",
        " */",
        "export const ImGui = {",
        manualBindings,
        "",
        jsFunctions,
        "};",
        "",
    ].join("\n");

    const cppCode = functions.map(getCppFunctionCode).join("");

    return [
        jsCode,
        cppCode,
    ];
}
