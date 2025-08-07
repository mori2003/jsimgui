interface StructBinding {
    opaque?: boolean;
    exclude?: {
        fields?: string[];
        methods?: string[];
    };
    override?: {
        comment?: string;
        ctor?: string;
    };
}

interface FunctionBinding {
    exclude?: boolean;
    override?: {
        comment?: string;
        typescript?: string;
        cplusplus?: string;
    };
}

export const structBindings: Record<string, StructBinding> = {
    ImVec2: ImVec2(),
    ImVec4: ImVec4(),
    ImDrawListSharedData: { opaque: true },
    ImGuiContext: { opaque: true },
    ImGuiTableSortSpecs: { opaque: true },
    ImGuiTableColumnSortSpecs: { opaque: true },
    ImGuiStyle: ImGuiStyle(),
    ImGuiIO: ImGuiIO(),
    ImGuiMultiSelectIO: { opaque: true },
    ImDrawList: { opaque: true },
    ImDrawData: { opaque: true },
    ImFontConfig: { opaque: true },
    ImFontAtlas: { opaque: true },
    ImFont: { opaque: true },
    ImTextureRef: ImTextureRef(),
    ImFontBaked: { opaque: true },
};

export const functionBindings: Record<string, FunctionBinding> = {
    ImGui_GetVersion: ImGui_GetVersion(),
    ImGui_Text: ImGui_Text(),
    ImGui_TextColored: ImGui_TextColored(),
    ImGui_TextDisabled: ImGui_TextDisabled(),
    ImGui_TextWrapped: ImGui_TextWrapped(),
    ImGui_LabelText: ImGui_LabelText(),
    ImGui_BulletText: ImGui_BulletText(),
    ImGui_SetTooltip: ImGui_SetTooltip(),
    ImGui_SetItemTooltip: ImGui_SetItemTooltip(),
    ImGui_InputText: ImGui_InputText(),
    ImGui_InputTextMultiline: ImGui_InputTextMultiline(),
    ImGui_InputTextWithHint: ImGui_InputTextWithHint(),
    ImGui_PlotLines: ImGui_PlotLines(),
    ImGui_PlotHistogram: ImGui_PlotHistogram(),

    ImGuiIO_SetKeyEventNativeData: { exclude: true },
    ImFontAtlas_AddFontFromMemoryCompressedTTF: { exclude: true },
    ImFontAtlas_AddFontFromMemoryCompressedBase85TTF: { exclude: true },
    ImGui_DockSpace: { exclude: true },
    ImGui_SetNextWindowClass: { exclude: true },
    ImGui_GetMainViewport: { exclude: true },
    ImGui_GetWindowViewport: { exclude: true },
    ImGui_GetForegroundDrawList: { exclude: true },
    ImGui_GetBackgroundDrawList: { exclude: true },
    ImGui_DockSpaceOverViewport: { exclude: true },
    ImGui_GetPlatformIO: { exclude: true },
    ImGui_SetStateStorage: { exclude: true },
    ImGui_GetStateStorage: { exclude: true },
    ImFontAtlas_GetTexDataAsAlpha8: { exclude: true },
    ImFontAtlas_GetTexDataAsRGBA32: { exclude: true },
    ImGui_TextUnformatted: { exclude: true },
    ImGui_SetNextWindowSizeConstraints: { exclude: true },
    ImGui_ListBox: { exclude: true },
    ImGui_ListBoxCallback: { exclude: true },
    ImGui_Combo: { exclude: true },
    ImGui_ComboChar: { exclude: true },
    ImGui_ComboCallback: { exclude: true },
    ImGui_DragScalar: { exclude: true },
    ImGui_DragScalarN: { exclude: true },
    ImGui_InputScalar: { exclude: true },
    ImGui_InputScalarN: { exclude: true },
    ImGui_SliderScalar: { exclude: true },
    ImGui_SliderScalarN: { exclude: true },
    ImGui_VSliderScalar: { exclude: true },
    ImGui_BeginDragDropSource: { exclude: true },
    ImGui_SetDragDropPayload: { exclude: true },
    ImGui_EndDragDropSource: { exclude: true },
    ImGui_BeginDragDropTarget: { exclude: true },
    ImGui_AcceptDragDropPayload: { exclude: true },
    ImGui_EndDragDropTarget: { exclude: true },
    ImGui_GetDragDropPayload: { exclude: true },
    ImGui_RenderPlatformWindowsDefault: { exclude: true },
    ImGui_DestroyPlatformWindows: { exclude: true },
    ImGui_FindViewportByPlatformHandle: { exclude: true },
    ImGui_LogToTTY: { exclude: true },
    ImGui_LogToFile: { exclude: true },
    ImGui_LogToClipboard: { exclude: true },
    ImGui_LogFinish: { exclude: true },
    ImGui_LogButtons: { exclude: true },
    ImGui_LogText: { exclude: true },
    ImGui_LogTextV: { exclude: true },
    ImGui_LoadIniSettingsFromDisk: { exclude: true },
    ImGui_LoadIniSettingsFromMemory: { exclude: true },
    ImGui_SaveIniSettingsToDisk: { exclude: true },
    ImGui_SaveIniSettingsToMemory: { exclude: true },
    ImGui_DebugTextEncoding: { exclude: true },
    ImGui_DebugFlashStyleColor: { exclude: true },
    ImGui_DebugStartItemPicker: { exclude: true },
    ImGui_DebugCheckVersionAndDataLayout: { exclude: true },
    ImGui_DebugLog: { exclude: true },
    ImGui_SetAllocatorFunctions: { exclude: true },
    ImGui_GetAllocatorFunctions: { exclude: true },
    ImGui_MemAlloc: { exclude: true },
    ImGui_MemFree: { exclude: true },
    ImGui_ColorConvertFloat4ToU32: { exclude: true },
    ImGui_ColorConvertHSVtoRGB: { exclude: true },
    ImGui_ColorConvertU32ToFloat4: { exclude: true },
    ImGui_GetColorU32: { exclude: true },
    ImGui_GetColorU32ImU32: { exclude: true },
};

function ImVec2() {
    return {
        override: {
            comment: "2D vector used to store positions, sizes etc.",
            ctor: [
                "    constructor(x = 0, y = 0) {\n",
                "        super('ImVec2');\n",
                "        this.x = x;\n",
                "        this.y = y;\n",
                "    }\n",
            ].join(""),
        },
    };
}

function ImVec4() {
    return {
        override: {
            comment: "4D vector used to store clipping rectangles, colors etc.",
            ctor: [
                "    constructor(x = 0, y = 0, z = 0, w = 0) {\n",
                "        super('ImVec4');\n",
                "        this.x = x;\n",
                "        this.y = y;\n",
                "        this.z = z;\n",
                "        this.w = w;\n",
                "    }\n",
            ].join(""),
        },
    };
}

function ImTextureRef() {
    return {
        override: {
            comment: "ImTextureRef = higher-level identifier for a texture.",
            ctor: [
                "    constructor(id: ImTextureID) {\n",
                "        super('ImTextureRef');\n",
                "        this._TexID = id;\n",
                "    }\n",
            ].join(""),
        },
        exclude: {
            fields: ["_TexData"],
        },
    };
}

function ImGuiStyle() {
    return {
        override: {
            comment: "Runtime data for styling/colors.",
        },
        exclude: {
            fields: ["Colors"],
        },
    };
}

function ImGuiIO() {
    return {
        override: {
            comment: "Main configuration and I/O between your application and ImGui.",
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
                "MouseReleasedTime",
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
        },
    };
}

function ImGui_GetVersion() {
    return {
        override: {
            cplusplus: [
                'bind_func("ImGui_GetVersion", [](){\n',
                "    return std::string(ImGui_GetVersion());\n",
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_Text() {
    return {
        override: {
            typescript: [
                "    /** formatted text */\n",
                "    Text(fmt: string): void { return Mod.export.ImGui_Text(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_Text", [](std::string fmt){\n',
                '    return ImGui_Text("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_TextColored() {
    return {
        override: {
            typescript: [
                "    /** shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor(); */\n",
                "    TextColored(col: ImVec4, fmt: string): void { return Mod.export.ImGui_TextColored(col?._ptr, fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_TextColored", [](ImVec4 col, std::string fmt){\n',
                '    return ImGui_TextColored(col, "%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_TextDisabled() {
    return {
        override: {
            typescript: [
                "    /** shortcut for PushStyleColor(ImGuiCol_TextDisabled); Text(fmt, ...); PopStyleColor(); */\n",
                "    TextDisabled(fmt: string): void { return Mod.export.ImGui_TextDisabled(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_TextDisabled", [](std::string fmt){\n',
                '    return ImGui_TextDisabled("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_TextWrapped() {
    return {
        override: {
            typescript: [
                "    /** shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize(). */\n",
                "    TextWrapped(fmt: string): void { return Mod.export.ImGui_TextWrapped(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_TextWrapped", [](std::string fmt){\n',
                '    return ImGui_TextWrapped("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_LabelText() {
    return {
        override: {
            typescript: [
                "    /** display text+label aligned the same way as value+label widgets */\n",
                "    LabelText(label: string, fmt: string): void { return Mod.export.ImGui_LabelText(label, fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_LabelText", [](std::string label, std::string fmt){\n',
                '    return ImGui_LabelText(label.c_str(), "%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_BulletText() {
    return {
        override: {
            typescript: [
                "    /** shortcut for Bullet()+Text() */\n",
                "    BulletText(fmt: string): void { return Mod.export.ImGui_BulletText(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_BulletText", [](std::string fmt){\n',
                '    return ImGui_BulletText("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_SetTooltip() {
    return {
        override: {
            typescript: [
                "    /** set a text-only tooltip. Often used after a ImGui::IsItemHovered() check. */\n",
                "    SetTooltip(fmt: string): void { return Mod.export.ImGui_SetTooltip(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_SetTooltip", [](std::string fmt){\n',
                '    return ImGui_SetTooltip("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_SetItemTooltip() {
    return {
        override: {
            typescript: [
                "    /** set a text-only tooltip if preceding item was hovered. override any previous call to SetTooltip(). */\n",
                "    SetItemTooltip(fmt: string): void { return Mod.export.ImGui_SetItemTooltip(fmt); },\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_SetItemTooltip", [](std::string fmt){\n',
                '    return ImGui_SetItemTooltip("%s", fmt.c_str());\n',
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_InputText() {
    return {
        override: {
            typescript: [
                "    InputText(label: string, buf: string[], buf_size: number, flags: ImGuiInputTextFlags = 0): boolean { return Mod.export.ImGui_InputText(label, buf, buf_size, flags); },\n",
                "\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_InputText", [](std::string label, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){\n',
                "    auto buf_bind = buf[0].as<std::string>();\n",
                "    std::vector<char> buf_data(buf_size);\n",
                "    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);\n",
                "    buf_data[buf_size - 1] = '\\0';\n",
                "    const auto ret = ImGui_InputText(label.c_str(), buf_data.data(), buf_size, flags, nullptr, nullptr);\n",
                "    buf.set(0, std::string(buf_data.data()));\n",
                "    return ret;\n",
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_InputTextMultiline() {
    return {
        override: {
            typescript: [
                "    InputTextMultiline(label: string, buf: string[], buf_size: number, size: ImVec2 = new ImVec2(0, 0), flags: ImGuiInputTextFlags = 0): boolean { return Mod.export.ImGui_InputTextMultiline(label, buf, buf_size, size?._ptr, flags); },\n",
                "\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_InputTextMultiline", [](std::string label, emscripten::val buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){\n',
                "    auto buf_bind = buf[0].as<std::string>();\n",
                "    std::vector<char> buf_data(buf_size);\n",
                "    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);\n",
                "    buf_data[buf_size - 1] = '\\0';\n",
                "    const auto ret = ImGui_InputTextMultiline(label.c_str(), buf_data.data(), buf_size, size, flags, nullptr, nullptr);\n",
                "    buf.set(0, std::string(buf_data.data()));\n",
                "    return ret;\n",
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_InputTextWithHint() {
    return {
        override: {
            typescript: [
                "    InputTextWithHint(label: string, hint: string, buf: string[], buf_size: number, flags: ImGuiInputTextFlags = 0): boolean { return Mod.export.ImGui_InputTextWithHint(label, hint, buf, buf_size, flags); },\n",
                "\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_InputTextWithHint", [](std::string label, std::string hint, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){\n',
                "    auto buf_bind = buf[0].as<std::string>();\n",
                "    std::vector<char> buf_data(buf_size);\n",
                "    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);\n",
                "    buf_data[buf_size - 1] = '\\0';\n",
                "    const auto ret = ImGui_InputTextWithHint(label.c_str(), hint.c_str(), buf_data.data(), buf_size, flags, nullptr, nullptr);\n",
                "    buf.set(0, std::string(buf_data.data()));\n",
                "    return ret;\n",
                "});\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_PlotLines() {
    return {
        override: {
            typescript: [
                "    PlotLines(label: string, values: number[], values_count: number, values_offset: number = 0, overlay_text: string = '', scale_min: number = Number.MAX_VALUE, scale_max: number = Number.MAX_VALUE, graph_size: ImVec2 = new ImVec2(0, 0)): void { return Mod.export.ImGui_PlotLines(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?._ptr); },\n",
                "\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_PlotLines", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){\n',
                "    auto values_bind = ArrayParam<float>(values);\n",
                "    return ImGui_PlotLines(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));\n",
                "}, allow_ptr());\n",
                "\n",
            ].join(""),
        },
    };
}

function ImGui_PlotHistogram() {
    return {
        override: {
            typescript: [
                "    PlotHistogram(label: string, values: number[], values_count: number, values_offset: number = 0, overlay_text: string = '', scale_min: number = Number.MAX_VALUE, scale_max: number = Number.MAX_VALUE, graph_size: ImVec2 = new ImVec2(0, 0)): void { return Mod.export.ImGui_PlotHistogram(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?._ptr); },\n",
                "\n",
            ].join(""),
            cplusplus: [
                'bind_func("ImGui_PlotHistogram", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){\n',
                "    auto values_bind = ArrayParam<float>(values);\n",
                "    return ImGui_PlotHistogram(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));\n",
                "}, allow_ptr());\n",
                "\n",
            ].join(""),
        },
    };
}
