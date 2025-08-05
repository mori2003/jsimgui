import { formatComment } from "./comment.js";

const includeStructs = [
    "ImGuiContext",
    "ImDrawData",
    //"ImGuiIO" Manual binding
    //"ImGuiStyle" Manual binding
    "ImFontAtlas",
    "ImFont",
    "ImGuiMultiSelectIO",
    "ImGuiPlatformIO",
    "ImGuiViewport",
    "ImDrawList",
    "ImDrawListSharedData",
    "ImGuiTableSortSpecs",
    "ImGuiTableColumnSortSpecs",
    "ImGuiStorage",
    "ImGuiMouseCursor",
];

function getJsStructCode(structData) {
    return [
        "/** [Auto] */",
        `export class ${structData.name} extends StructBinding {`,
        `    constructor() { super("${structData.name}"); }`,
        `}`,
        "",
    ].join("\n");
}

function getCppStructCode(structData) {
    return [
        `    bind_struct<${structData.name}>("${structData.name}")`,
        `    bind_ctor()`,
        `    ;\n`,
        "",
    ].join('\n');
}

export function generateStructs(jsonData) {
    const structs = jsonData.structs.filter((struct) => includeStructs.includes(struct.name));

    const jsCode = structs.map(getJsStructCode).join("");
    const cppCode = structs.map(getCppStructCode).join("");

    return [
        jsCode,
        cppCode,
    ];
}
