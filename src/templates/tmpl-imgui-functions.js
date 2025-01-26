export const ImGui = { // Line will get removed.
    /** [Manual] Access the ImGuiIO structure (mouse/keyboard/gamepad inputs, time, various configuration options/flags) @returns {ImGuiIO} */
    GetIO: () => { return ImGuiIO.wrap(Mod.main.ImGui_GetIO()) },
    /** [Manual] Access the ImGuiStyle structure (colors, sizes). Always use PushStyleColor(), PushStyleVar() to modify style mid-frame! @returns {ImGuiStyle} */
    GetStyle: () => { return ImGuiStyle.wrap(Mod.main.ImGui_GetStyle()) },

    /* Widgets Text */
    Text: (fmt) => {  return Mod.main.ImGui_Text(fmt) },
    TextColored: (col, fmt) => { return Mod.main.ImGui_TextColored(col.unwrap(), fmt) },
    TextDisabled: (fmt) => { return Mod.main.ImGui_TextDisabled(fmt) },
    TextWrapped: (fmt) => { return Mod.main.ImGui_TextWrapped(fmt) },
    LabelText: (label, fmt) => { return Mod.main.ImGui_LabelText(label, fmt) },
    BulletText: (fmt) => { return Mod.main.ImGui_BulletText(fmt) },
    SeparatorText: (label) => { return Mod.main.ImGui_SeparatorText(label) },

    SetTooltip: (fmt) => { return Mod.main.ImGui_SetTooltip(fmt) },
    SetItemTooltip: (fmt) => { return Mod.main.ImGui_SetItemTooltip(fmt) },

    PlotLines: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotLinesEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size.unwrap()) },

    PlotHistogram: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotHistogramEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size.unwrap()) },

    InputText: (label, buf, buf_size, flags = 0) => { return Mod.main.ImGui_InputText(label, buf, buf_size, flags) },

    InputTextMultiline: (label, buf, buf_size, size = new ImVec2(0, 0), flags = 0) => { return Mod.main.ImGui_InputTextMultilineEx(label, buf, buf_size, size.unwrap(), flags) },

    InputTextWithHint: (label, hint, buf, buf_size, flags = 0) => { return Mod.main.ImGui_InputTextWithHintEx(label, hint, buf, buf_size, flags) },

    GetClipboardText: () => { return Mod.main.ImGui_GetClipboardText() },
    SetClipboardText: (text) => { return Mod.main.ImGui_SetClipboardText(text) },

    Image: (user_texture_id, image_size, uv0 = new ImVec2(0, 0), uv1 = new ImVec2(1, 1), tint_col = new ImVec4(1, 1, 1, 1), border_col = new ImVec4(0, 0, 0, 0)) => { return Mod.main.ImGui_ImageEx(user_texture_id, image_size.unwrap(), uv0.unwrap(), uv1.unwrap(), tint_col.unwrap(), border_col.unwrap()) },
}; // Line will get removed.
