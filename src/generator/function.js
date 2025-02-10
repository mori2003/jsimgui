/**
 * @file Function generation for C++ and JavaScript.
 *
 * Also generates struct methods.
 */

import { formatComment } from "./comment.js";
import { structBindings } from "./struct.js";
import { getJsDeclaration, toJsDocType } from "./typedef.js";

/**
 * A map of function names to exclude and override.
 */
export const functionOverrides = {
    "ImGui_GetVersion": {
        override: {
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_GetVersion", [](){
    return std::string(ImGui_GetVersion());
});
`;
            },
        },
    },

    "ImGui_Text": {
        override: {
            customJs: () => {
                return `    /** [Manual] formatted text
     * @param {string} fmt
     * @returns {void}
     */
    Text: (fmt) => { return Mod.main.ImGui_Text(fmt); },
`;
            },

            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_Text", [](std::string fmt){
    return ImGui_Text("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_TextColored": {
        override: {
            customJs: () => {
                return `    /** [Manual] shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor();
     * @param {ImVec4} col
     * @param {string} fmt
     * @returns {void}
     */
    TextColored: (col, fmt) => { return Mod.main.ImGui_TextColored(col?.unwrap() || null, fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_TextColored", [](ImVec4 col, std::string fmt){
    return ImGui_TextColored(col, "%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_TextDisabled": {
        override: {
            customJs: () => {
                return `    /** [Manual] shortcut for PushStyleColor(ImGuiCol_TextDisabled); Text(fmt, ...); PopStyleColor();
     * @param {string} fmt
     * @returns {void}
     */
    TextDisabled: (fmt) => { return Mod.main.ImGui_TextDisabled(fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_TextDisabled", [](std::string fmt){
    return ImGui_TextDisabled("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_TextWrapped": {
        override: {
            customJs: () => {
                return `    /** [Manual] shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize().
     * @param {string} fmt
     * @returns {void}
     */
    TextWrapped: (fmt) => { return Mod.main.ImGui_TextWrapped(fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_TextWrapped", [](std::string fmt){
    return ImGui_TextWrapped("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_LabelText": {
        override: {
            customJs: () => {
                return `    /** [Manual] display text+label aligned the same way as value+label widgets
     * @param {string} label
     * @param {string} fmt
     * @returns {void}
     */
    LabelText: (label, fmt) => { return Mod.main.ImGui_LabelText(label, fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_LabelText", [](std::string label, std::string fmt){
    return ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_BulletText": {
        override: {
            customJs: () => {
                return `    /** [Manual] shortcut for Bullet()+Text()
     * @param {string} fmt
     * @returns {void}
     */
    BulletText: (fmt) => { return Mod.main.ImGui_BulletText(fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_BulletText", [](std::string fmt){
    return ImGui_BulletText("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_SetTooltip": {
        override: {
            customJs: () => {
                return `    /** [Manual] set a text-only tooltip. Often used after a ImGui::IsItemHovered() check. Override any previous call to SetTooltip().
     * @param {string} fmt
     * @returns {void}
     */
    SetTooltip: (fmt) => { return Mod.main.ImGui_SetTooltip(fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_SetTooltip", [](std::string fmt){
    return ImGui_SetTooltip("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_SetItemTooltip": {
        override: {
            customJs: () => {
                return `    /** [Manual] set a text-only tooltip if preceding item was hovered. override any previous call to SetTooltip().
     * @param {string} fmt
     * @returns {void}
     */
    SetItemTooltip: (fmt) => { return Mod.main.ImGui_SetItemTooltip(fmt); },
`;
            },
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_SetItemTooltip", [](std::string fmt){
    return ImGui_SetItemTooltip("%s", fmt.c_str());
});
`;
            },
        },
    },

    "ImGui_InputTextEx": {
        override: {
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_InputTextEx", [](std::string label, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextEx(label.c_str(), buf_data, buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});
`;
            },
        },
    },

    "ImGui_InputTextMultilineEx": {
        override: {
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_InputTextMultilineEx", [](std::string label, emscripten::val buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextMultilineEx(label.c_str(), buf_data, buf_size, size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});
`;
            },
        },
    },

    "ImGui_InputTextWithHintEx": {
        override: {
            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_InputTextWithHintEx", [](std::string label, std::string hint, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextWithHintEx(label.c_str(), hint.c_str(), buf_data, buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});
`;
            },
        },
    },

    "ImGui_PlotLinesEx": {
        override: {
            customJs: () => {
                return `    /** [Manual]
     * @param {string} label
     * @param {float} values
     * @param {number} values_count
     * @param {number} values_offset
     * @param {string} overlay_text
     * @param {number} scale_min
     * @param {number} scale_max
     * @param {ImVec2} graph_size
     * @returns {void}
     */
    PlotLines: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotLinesEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?.unwrap() || null); },
`;
            },

            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_PlotLinesEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotLinesEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
}, allow_ptr());
`;
            },
        },
    },

    "ImGui_PlotHistogramEx": {
        override: {
            customJs: () => {
                return `    /** [Manual]
     * @param {string} label
     * @param {float} values
     * @param {number} values_count
     * @param {number} values_offset
     * @param {string} overlay_text
     * @param {number} scale_min
     * @param {number} scale_max
     * @param {ImVec2} graph_size
     * @returns {void}
     */
    PlotHistogram: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotHistogramEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?.unwrap() || null); },
`;
            },

            customCpp: () => {
                return `// MANUAL OVERRIDE
bind_func("ImGui_PlotHistogramEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotHistogramEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
}, allow_ptr());
`;
            },
        },
    },

    //     "ImFontAtlas_AddFontFromFileTTF": {
    //         override: {
    //             customJs: () => {
    //                 return `    /** [Auto]
    //      * @param {string} filename
    //      * @param {number} size_pixels
    //      * @param {ImFontConfig} font_cfg
    //      * @param {Array<ImWchar>} glyph_ranges
    //      * @returns {ImFont}
    //      */
    //     AddFontFromFileTTF(filename, size_pixels, font_cfg = null, glyph_ranges = null) { return ImFont.wrap(this.unwrap().ImFontAtlas_AddFontFromFileTTF(filename, size_pixels, font_cfg?.unwrap() || null, glyph_ranges)); }`;
    //             },
    //             customCpp: () => {
    //                 return `// MANUAL OVERRIDE
    // BIND_METHOD("ImFontAtlas_AddFontFromFileTTF", [](ImFontAtlas* self, std::string filename, float size_pixels, const ImFontConfig* font_cfg, emscripten::val glyph_ranges){
    //     auto glyph_ranges_bind = ArrayParam<ImWchar>(glyph_ranges);
    //     return ImFontAtlas_AddFontFromFileTTF(self, filename.c_str(), size_pixels, font_cfg, &glyph_ranges_bind);
    // })`;
    //             },
    //         },
    //     },

    //     "ImFontAtlas_AddFontFromMemoryTTF": {
    //         override: {
    //             customJs: () => {
    //                 return `    /** [Auto]
    //      * @param {Array} font_data
    //      * @param {number} font_data_size
    //      * @param {number} size_pixels
    //      * @param {ImFontConfig} font_cfg
    //      * @param {Array<ImWchar>} glyph_ranges
    //      * @returns {ImFont}
    //      */
    //     AddFontFromMemoryTTF(font_data, font_data_size, size_pixels, font_cfg = null, glyph_ranges = null) { return ImFont.wrap(this.unwrap().ImFontAtlas_AddFontFromMemoryTTF(font_data, font_data_size, size_pixels, font_cfg?.unwrap() || null, glyph_ranges)); }`;
    //             },
    //             customCpp: () => {
    //                 return `// MANUAL OVERRIDE
    // BIND_METHOD("ImFontAtlas_AddFontFromMemoryTTF", [](ImFontAtlas* self, emscripten::val font_data, int font_data_size, float size_pixels, const ImFontConfig* font_cfg, emscripten::val glyph_ranges){
    //     auto font_data_bind = ArrayParam<int>(font_data);
    //     auto glyph_ranges_bind = ArrayParam<ImWchar>(glyph_ranges);
    //     return ImFontAtlas_AddFontFromMemoryTTF(self, &font_data_bind, font_data_size, size_pixels, font_cfg, &glyph_ranges_bind);
    // })
    // `;
    //             },
    //         },
    //     },

    "ImGui_ImageEx": { exclude: true }, // WIP
    "ImGui_ImageButtonEx": { exclude: true }, // WIP

    "ImGuiIO_SetKeyEventNativeDataEx": { exclude: true },
    "ImFontAtlas_AddFontFromMemoryCompressedTTF": { exclude: true },
    "ImFontAtlas_AddFontFromMemoryCompressedBase85TTF": { exclude: true },
    "ImFontAtlas_GetTexDataAsAlpha8": { exclude: true },
    "ImFontAtlas_GetTexDataAsRGBA32": { exclude: true },

    "ImGui_TextUnformattedEx": { exclude: true },
    "ImGui_SetNextWindowSizeConstraints": { exclude: true },

    "ImGui_ListBox": { exclude: true },
    "ImGui_ListBoxEx": { exclude: true },
    "ImGui_ListBoxCallbackEx": { exclude: true },
    "ImGui_Combo": { exclude: true },
    "ImGui_ComboCharEx": { exclude: true },
    "ImGui_ComboCallbackEx": { exclude: true },

    "ImGui_DragScalarEx": { exclude: true },
    "ImGui_DragScalarNEx": { exclude: true },
    "ImGui_InputScalarEx": { exclude: true },
    "ImGui_InputScalarNEx": { exclude: true },
    "ImGui_SliderScalarEx": { exclude: true },
    "ImGui_SliderScalarNEx": { exclude: true },
    "ImGui_VSliderScalarEx": { exclude: true },

    "ImGui_BeginDragDropSource": { exclude: true },
    "ImGui_SetDragDropPayload": { exclude: true },
    "ImGui_EndDragDropSource": { exclude: true },
    "ImGui_BeginDragDropTarget": { exclude: true },
    "ImGui_AcceptDragDropPayload": { exclude: true },
    "ImGui_EndDragDropTarget": { exclude: true },
    "ImGui_GetDragDropPayload": { exclude: true },
    "ImGui_RenderPlatformWindowsDefaultEx": { exclude: true },
    "ImGui_DestroyPlatformWindows": { exclude: true },
    "ImGui_FindViewportByPlatformHandle": { exclude: true },

    "ImGui_LogToTTY": { exclude: true },
    "ImGui_LogToFile": { exclude: true },
    "ImGui_LogToClipboard": { exclude: true },
    "ImGui_LogFinish": { exclude: true },
    "ImGui_LogButtons": { exclude: true },
    "ImGui_LogText": { exclude: true },
    "ImGui_LogTextV": { exclude: true },

    "ImGui_LoadIniSettingsFromDisk": { exclude: true },
    "ImGui_LoadIniSettingsFromMemory": { exclude: true },
    "ImGui_SaveIniSettingsToDisk": { exclude: true },
    "ImGui_SaveIniSettingsToMemory": { exclude: true },
    "ImGui_DebugTextEncoding": { exclude: true },
    "ImGui_DebugFlashStyleColor": { exclude: true },
    "ImGui_DebugStartItemPicker": { exclude: true },
    "ImGui_DebugCheckVersionAndDataLayout": { exclude: true },
    "ImGui_DebugLog": { exclude: true },
    "ImGui_SetAllocatorFunctions": { exclude: true },
    "ImGui_GetAllocatorFunctions": { exclude: true },
    "ImGui_MemAlloc": { exclude: true },
    "ImGui_MemFree": { exclude: true },

    "ImGui_ColorConvertFloat4ToU32": { exclude: true },
    "ImGui_ColorConvertHSVtoRGB": { exclude: true },
    "ImGui_ColorConvertU32ToFloat4": { exclude: true },
    "ImGui_GetColorU32": { exclude: true },
    "ImGui_GetColorU32Ex": { exclude: true },
    "ImGui_GetColorU32ImU32": { exclude: true },
    "ImGui_GetColorU32ImU32Ex": { exclude: true },
};

/**
 * Filters the functions. We only want to use the Ex variants of the functions, because we can use default parameters in JavaScript.
 * @param {Array} functions
 * @returns {Array}
 */
function filterFunctions(functions) {
    const excludedSuffixes = [
        "ID",
        "V",
        "Callback",
        "Int",
        "Ptr",
        "Str",
        "ImVec2",
        "ImVec4",
    ];

    const excludedFunctions = Object.keys(functionOverrides).filter((name) =>
        functionOverrides[name].exclude
    );

    const functionGroups = new Map();

    functions.forEach((func) => {
        const baseName = func.name.endsWith("Ex")
            ? func.name.slice(0, -2)
            : func.name;

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

/**
 * Checks if the argument is a string.
 * @param {Object} arg
 * @returns {boolean}
 */
function isStringArg(arg) {
    const decl = arg.type?.declaration;

    return decl === "const char*";
}

/**
 * Checks if the argument is a primitive pointer.
 * @param {Object} arg
 * @returns {boolean}
 */
function isPrimitivePointerArg(arg) {
    const decl = arg.type?.declaration;

    return decl === "void*" ||
        decl === "float*" ||
        decl === "int*" ||
        decl === "bool*" ||
        decl?.endsWith("]");
}

/**
 * Generates the parameter list for the JSDoc comment.
 * @param {Array} params
 * @returns {string}
 */
export function getJsDocParams(params) {
    let code = "";

    for (const param of params) {
        if (!param.type) {
            code += `     * @param {any} ${param.name}\n`;
        } else {
            const type = toJsDocType(param.type.declaration);
            code += `     * @param {${type}} ${param.name}\n`;
        }
    }

    return code;
}

/**
 * Generates the parameter list for the JavaScript function.
 * @param {Array} params
 * @returns {string}
 */
export function getJsParamList(params) {
    return params.map((param) => {
        const defaultValue = (() => {
            const val = param.default_value;

            if (!val) return "";

            const fixNumber = (val) => {
                return val.replace(/(\d+(\.\d+)?)[df]/g, "$1")
                    .replace("FLT_MAX", "Number.MAX_VALUE")
                    .replace("FLT_MIN", "Number.MIN_VALUE");
            };

            if (val.startsWith("\"") && val.endsWith("\"")) {
                return ` = "${val.slice(1, -1)}"`;
            }

            if (val === "NULL") {
                return ` = null`;
            }

            if (val.startsWith("ImVec")) {
                return ` = new ${fixNumber(val)}`;
            }

            return ` = ${fixNumber(val)}`;
        })();

        return `${param.name}${defaultValue}`;
    }).join(", ");
}

/**
 * Generates the call list for the JavaScript function.
 * @param {Array} params
 * @returns {string}
 */
export function getJsCallList(params) {
    return params.map((param) => {
        let call = param.name;

        if (param.type) {
            const type = getJsDeclaration(param.type.declaration);

            if (type in structBindings) {
                call = `${call}?.unwrap() || null`;
            }
        }

        return call;
    }).join(", ");
}

/**
 * Generates the JavaScript code for a single function.
 * @param {Object} func
 * @returns {string}
 */
export function getFunctionCodeJs(func) {
    if (functionOverrides[func.name]?.override?.customJs) {
        return functionOverrides[func.name].override.customJs();
    }

    const comment = formatComment(
        func.comments?.attached ?? func.comments?.preceding[0] ?? "",
    );
    let trimmedName = func.name.replace(`ImGui_`, "");
    if (trimmedName.endsWith("Ex")) {
        trimmedName = trimmedName.slice(0, -2);
    }

    const args = func.arguments;

    const callList = getJsCallList(args);
    const retType = toJsDocType(func.return_type.declaration);

    let funcCall = "";

    if (retType in structBindings) {
        funcCall =
            `return ${retType}.wrap(Mod.main.${func.name}(${callList}));`;
    } else {
        funcCall = `return Mod.main.${func.name}(${callList});`;
    }

    let code = "    /**\n";
    code += `     * [Auto] ${comment}\n`;
    code += `${getJsDocParams(args)}`;
    code += `     * @returns {${retType}}\n`;
    code += `     */\n`;
    code += `    ${trimmedName}: (${
        getJsParamList(args)
    }) => { ${funcCall} },\n`;

    return code;
}

/**
 * Generates the JavaScript method code for a struct.
 * @param {Object} method
 * @returns {string}
 */
export function getMethodCodeJs(method) {
    if (functionOverrides[method.name]?.exclude) {
        return "";
    }

    if (functionOverrides[method.name]?.override?.customJs) {
        return functionOverrides[method.name].override.customJs();
    }

    const comment = formatComment(
        method.comments?.attached ?? method.comments?.preceding[0] ?? "",
    );
    const trimmedName = method.name.replace(`${method.original_class}_`, "");

    // Slice arguments to remove "self".
    const args = method.arguments.slice(1);

    const callList = getJsCallList(args);
    const retType = toJsDocType(method.return_type.declaration);


    let code = "    /**\n";
    code += `     * [Auto] ${comment}\n`;
    code += `${getJsDocParams(args)}`;
    code += `     * @returns {${retType}}\n`;
    code += `     */\n`;
    code += `    ${trimmedName}(${getJsParamList(args)}) { return this.unwrap().${method.name}(${callList}) }\n`;

    return code;
}

/**
 * Generates the full JavaScript functions code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateFunctionsJs(jsonData) {
    const functions = filterFunctions(jsonData.functions);

    let code = "\n";
    code += "/**\n";
    code += " * Access to the ImGui functions.\n";
    code += " * @namespace\n";
    code += " */\n";
    code += "export const ImGui = {\n";

    for (const func of functions) {
        code += getFunctionCodeJs(func);
        code += "\n";
    }

    code += "};\n";

    return code;
}

function getCppCallList(func) {
    return func.arguments.map((arg) => {
        if (isStringArg(arg)) {
            return `${arg.name}.c_str()`;
        }

        if (isStringArg(arg) || isPrimitivePointerArg(arg)) {
            return `&${arg.name}_bind`;
        }

        return arg.name;
    }).join(", ");
}

function getCppParamList(func) {
    return func.arguments.map((arg) => {
        if (!arg.type) return "";

        if (isStringArg(arg)) {
            return `std::string ${arg.name}`;
        }

        if (isPrimitivePointerArg(arg)) {
            return `emscripten::val ${arg.name}`;
        }

        return `${arg.type?.declaration} ${arg.name}`;
    }).join(", ");
}

function getCppBindings(func) {
    let code = "";

    for (const arg of func.arguments) {
        if (isPrimitivePointerArg(arg)) {
            let trimmedType = arg.type?.declaration.replace("*", "");
            if (trimmedType.endsWith("]")) {
                trimmedType = trimmedType.slice(0, -3);
            }

            code +=
                `    auto ${arg.name}_bind =  ArrayParam<${trimmedType}>(${arg.name});\n`;
        }
    }

    return code;
}

/**
 * Generates the C++ code for a single function.
 * @param {Object} func
 * @returns {string}
 */
export function getFunctionCodeCpp(func) {
    if (functionOverrides[func.name]?.override?.customCpp) {
        return functionOverrides[func.name].override.customCpp();
    }

    let policies = "";
    let allowedPtr = false;

    if (func.return_type.declaration.includes("*")) {
        policies = ", rvp_ref(), allow_ptr()";
        allowedPtr = true;
    }

    if (!allowedPtr && func.arguments.some((arg) => arg.type?.declaration.includes("*"))) {
        policies = ", allow_ptr()";
    }

    let code = "";
    code += `bind_func("${func.name}", [](${getCppParamList(func)}){\n`;
    code += getCppBindings(func);
    code += `    return ${func.name}(${getCppCallList(func)});\n`;
    code += `}${policies});\n`;
    return code;
}

export function getMethodCodeCpp(method) {
    if (functionOverrides[method.name]?.exclude) {
        return "";
    }

    if (functionOverrides[method.name]?.override?.customCpp) {
        return functionOverrides[method.name].override.customCpp();
    }

    return [
        `bind_method("${method.name}", [](${getCppParamList(method)}){`,
        //bindings,
        `    return ${method.name}(${getCppCallList(method)});`,
        "}, allow_ptr())",
        "",
    ].join("\n");
}

/**
 * Generates the full C++ functions code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateFunctionsCpp(jsonData) {
    const functions = filterFunctions(jsonData.functions);

    let code = "\n";

    for (const func of functions) {
        code += getFunctionCodeCpp(func);
        code += "\n";
    }

    return code;
}
