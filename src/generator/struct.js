/**
 * @file Struct generation for C++ and JavaScript.
 */

import { formatComment } from "./comment.js";
import { toJsDocType } from "./typedef.js";
import { getMethodCodeCpp, getMethodCodeJs } from "./function.js";

/**
 * A map of struct names to bind and their options.
 */
export const structBindings = {
    "ImVec2": {
        override: {
            comment: "ImVec2: 2D vector used to store positions, sizes etc.",
            constructorJs: () =>
                [
                    "    /** @param {number} x @param {number} y */",
                    "    constructor(x = 0, y = 0) {",
                    '        super("ImVec2");',
                    "        this.x = x;",
                    "        this.y = y;",
                    "    }\n",
                ].join("\n"),
        },
    },
    "ImVec4": {
        override: {
            comment:
                "ImVec4: 4D vector used to store clipping rectangles, colors etc.",
            constructorJs: () =>
                [
                    "    /** @param {number} x @param {number} y @param {number} z @param {number} w */",
                    "    constructor(x = 0, y = 0, z = 0, w = 0) {",
                    '        super("ImVec4");',
                    "        this.x = x;",
                    "        this.y = y;",
                    "        this.z = z;",
                    "        this.w = w;",
                    "    }\n",
                ].join("\n"),
        },
    },
    "ImDrawListSharedData": {
        opaque: true,
    },
    "ImGuiContext": {
        opaque: true,
    },
    "ImGuiTableSortSpecs": {
        opaque: true,
    },
    "ImGuiTableColumnSortSpecs": {
        opaque: true,
    },
    "ImGuiStyle": {
        override: {
            comment: "Runtime data for styling/colors.",
        },
        exclude: {
            fields: [
                "Colors",
            ],
            methods: [],
        },
    },
    "ImGuiIO": {
        override: {
            comment:
                "Main configuration and I/O between your application and ImGui.",
        },
        exclude: {
            fields: [
                "KeysData",
                //"Fonts",
                //"FontDefault",
                //"Ctx",

                "BackendPlatformUserData",
                "BackendRendererUserData",
                "BackendLanguageUserData",

                "MouseDown",
                "MouseClickedPos",
                "MouseClickedTime",
                "MouseClicked",
                "MouseClickedCount",
                "MouseDoubleClicked",
                "MouseDoubleClickedTime",
                "MouseClickedLastCount",
                "MouseReleased",
                "MouseDownOwned",
                "MouseDownOwnedUnlessPopupClose",
                "MouseWheelRequestAxisSwap",
                "MouseCtrlLeftAsRightClick",
                "MouseDownDuration",
                "MouseDownDurationPrev",
                "MouseDragMaxDistanceAbs",
                "MouseDragMaxDistanceSqr",
                "PenPressure",
                "AppFocusLost",
                "AppAcceptingEvents",

                "UserData",
                "IniFilename",
                "LogFilename",
                "BackendPlatformName",
                "BackendRendererName",
                "InputQueueSurrogate",
                "InputQueueCharacters",
            ],
            methods: [],
        },
    },
    "ImGuiMultiSelectIO": {
        opaque: true,
    },
    "ImDrawList": {
        opaque: true,
    },
    "ImDrawData": {
        opaque: true,
    },
    "ImFontConfig": {
        opaque: true,
        exclude: {
            fields: [
                "FontData",
                "GlyphRanges",
            ],
        },
    },
    "ImFontAtlas": {
        opaque: true,
        exclude: {
            fields: [
                "UserData",
            ],
        },
    },
    "ImFont": {
        opaque: true,
    },
};

/**
 * Generates the JavaScript code for a single struct field.
 * @param {Object} field
 * @returns {string}
 */
function getFieldCodeJs(field) {
    const type = toJsDocType(field.type.declaration);
    const comment = formatComment(
        field.comments?.attached ?? field.comments?.preceding[0] ?? "",
    );

    let getAccessor = `return this.unwrap().get_${field.name}();`;
    let setAccessor = `this.unwrap().set_${field.name}(v);`;
    if (type in structBindings) {
        getAccessor = `return ${type}.wrap(this.unwrap().get_${field.name}());`;
        setAccessor = `this.unwrap().set_${field.name}(v.unwrap());`;
    }

    return [
        `    /** @type {${type}} ${comment} */`,
        `    get ${field.name}() { ${getAccessor} }`,
        `    set ${field.name}(v) { ${setAccessor} }\n`,
    ].join("\n");
}

/**
 * Generates the JavaScript code for a single struct.
 * @param {Object} structData
 * @returns {string}
 */
function getStructCodeJs(structData, functions) {
    const comment = structBindings[structData.name]?.override?.comment ??
        formatComment(
            structData.comments?.attached ??
                structData.comments?.preceding[0] ??
                "",
        );

    const constructor =
        structBindings[structData.name]?.override?.constructorJs?.() ??
            `    constructor() { super("${structData.name}"); }\n`;

    let code = `/** [Auto] ${comment} */\n`;
    code += `export class ${structData.name} extends StructBinding {\n`;
    code += `${constructor}`;

    if (!structBindings[structData.name]?.opaque) {
        code += `\n`;

        for (const field of structData.fields) {
            if (
                structBindings[structData.name]?.exclude?.fields?.includes(
                    field.name,
                )
            ) {
                continue;
            }

            code += getFieldCodeJs(field, structData.name);
            code += `\n`;
        }

        const structMethods = functions.filter((func) =>
            func.original_class === structData.name
        );

        for (const method of structMethods) {
            code += getMethodCodeJs(method);
            code += "\n";
        }
    }

    code += `}\n\n`;
    return code;
}

/**
 * Generates the full JavaScript structs code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateStructsJs(jsonData) {
    const filteredStructs = jsonData.structs.filter((struct) =>
        struct.name in structBindings
    );

    let code = "\n";
    for (const struct of filteredStructs) {
        code += getStructCodeJs(struct, jsonData.functions);
    }

    return code;
}

/**
 * Generates the C++ code for a single struct.
 * @param {Object} structData
 * @returns {string}
 */
function getStructCodeCpp(structData, functions) {
    let code = `bind_struct<${structData.name}>("${structData.name}")\n`;
    code += `.constructor<>()\n`;

    if (!structBindings[structData.name]?.opaque) {
        for (const field of structData.fields) {
            if (
                structBindings[structData.name]?.exclude?.fields?.includes(
                    field.name,
                )
            ) {
                continue;
            }

            code +=
                `bind_prop(${structData.name}, ${field.name}, ${field.type.declaration})\n`;
        }

        const structMethods = functions.filter((func) =>
            func.original_class === structData.name
        );

        for (const method of structMethods) {
            code += getMethodCodeCpp(method);
        }
    }

    code += `;\n\n`;
    return code;
}

/**
 * Generates the full C++ structs code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateStructsCpp(jsonData) {
    const filteredStructs = jsonData.structs.filter((struct) =>
        struct.name in structBindings
    );

    let code = "\n";
    for (const struct of filteredStructs) {
        code += getStructCodeCpp(struct, jsonData.functions);
    }

    return code;
}
