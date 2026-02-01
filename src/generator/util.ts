const TYPE_MAP = new Map<string, string>([
    ["void", "void"],
    ["int", "number"],
    ["float", "number"],
    ["double", "number"],
    ["unsigned int", "number"],
    ["bool", "boolean"],
    ["void*", "any"],
    ["char*", "string"],
    ["const char*", "string"],
    ["size_t", "number"],
    ["unsigned short", "number"],
    ["bool*", "[boolean]"],
    ["int*", "[number]"],
    ["size_t*", "[number]"],
    ["unsigned int*", "[number]"],
    ["float*", "[number]"],
    ["const float*", "number[]"],
    ["double*", "[number]"],
    ["float[2]", "[number, number]"],
    ["float[3]", "[number, number, number]"],
    ["float[4]", "[number, number, number, number]"],
    ["int[2]", "[number, number]"],
    ["int[3]", "[number, number, number]"],
    ["int[4]", "[number, number, number, number]"],
    ["double[2]", "[number, number]"],
    ["double[3]", "[number, number, number]"],
    ["double[4]", "[number, number, number, number]"],
]);

const TYPEDEFS: string[] = [
    "ImDrawIdx",
    "ImGuiID",
    "ImS8",
    "ImU8",
    "ImS16",
    "ImU16",
    "ImS32",
    "ImU32",
    "ImS64",
    "ImU64",
    "ImGuiDir",
    "ImGuiKey",
    "ImGuiMouseSource",
    "ImGuiSortDirection",
    "ImGuiCol",
    "ImGuiCond",
    "ImGuiDataType",
    "ImGuiMouseButton",
    "ImGuiMouseCursor",
    "ImGuiStyleVar",
    "ImGuiTableBgTarget",
    "ImDrawFlags",
    "ImDrawListFlags",
    "ImDrawTextFlags",
    "ImFontFlags",
    "ImFontAtlasFlags",
    "ImGuiBackendFlags",
    "ImGuiButtonFlags",
    "ImGuiChildFlags",
    "ImGuiColorEditFlags",
    "ImGuiConfigFlags",
    "ImGuiComboFlags",
    "ImGuiDockNodeFlags",
    "ImGuiDragDropFlags",
    "ImGuiFocusedFlags",
    "ImGuiHoveredFlags",
    "ImGuiInputTextFlags",
    "ImGuiItemFlags",
    "ImGuiKeyChord",
    "ImGuiListClipperFlags",
    "ImGuiPopupFlags",
    "ImGuiMultiSelectFlags",
    "ImGuiSelectableFlags",
    "ImGuiSliderFlags",
    "ImGuiTabBarFlags",
    "ImGuiTabItemFlags",
    "ImGuiTableFlags",
    "ImGuiTableColumnFlags",
    "ImGuiTableRowFlags",
    "ImGuiTreeNodeFlags",
    "ImGuiViewportFlags",
    "ImGuiWindowFlags",
    "ImWchar32",
    "ImWchar16",
    "ImWchar",
    "ImGuiSelectionUserData",
    "ImGuiInputTextCallback",
    "ImGuiSizeCallback",
    "ImTextureID",
    "ImDrawCallback",
    "ImFontAtlasRectId",
    "ImGuiInputFlags",
    "ImWchar",

    "const ImWchar*",
    //"ImTextureFormat",
];

export function isStructType(declaration: string): boolean {
    return !TYPE_MAP.has(declaration) && !TYPEDEFS.includes(declaration);
}

export function isReferenceStruct(declaration: string): boolean {
    const valueStructs = [
        "ImVec2",
        "ImVec4",
        "ImTextureRef",
        "const ImVec2*",
        "const ImVec4*",
        "const ImTextureRef*",
    ];
    return isStructType(declaration) && !valueStructs.includes(declaration);
}

export function getTsType(declaration: string): string {
    const type = TYPE_MAP.get(declaration);
    if (type) {
        return type;
    }

    declaration = declaration.replace("const ", "");
    declaration = declaration.replace("*", "");

    return declaration;
}
