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
}; // Line will get removed.
