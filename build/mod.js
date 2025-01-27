/**
 * jsimgui - JavaScript bindings for Dear ImGui.
 *
 * @module jsimgui
 * @version 0.1.3
 * @author mori2003
 * @license MIT
 *
 * @file
 * The JavaScript API for exported ImGui functions, structs and enums.
 *
 * Index:
 * 1. Helpers
 * 2. Typedefs
 * 3. Structs
 * 4. Functions
 * 5. Enums
 * 6. Web Implementation
 *
 * The bindings are tagged:
 * [Manual] - Manually written bindings.
 * [Auto] - Auto-generated bindings.
 *
 * For source code and more information:
 * @see {@link https://github.com/mori2003/jsimgui|jsimgui}
 */

import MainExport from "./jsimgui.js";

/* -------------------------------------------------------------------------- */
/* 1. Helpers */
/* -------------------------------------------------------------------------- */

/** A singleton class that handles the initialization of the exported main and demo modules. */
class Mod {
    static #main;

    static async initMain() {
        if (this.#main) throw new Error("Main module is already initialized.");

        await MainExport().then((module) => (this.#main = module));
    }

    static get main() {
        if (!this.#main) throw new Error("Main module is not initialized.");
        return this.#main;
    }
}

/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    #ref;

    constructor(name) {
        this.#ref = new Mod.main[name]();
    }

    static wrap(ref) {
        const wrap = new this;
        wrap.#ref = ref;
        return wrap;
    }

    unwrap() {
        return this.#ref;
    }
}

/* -------------------------------------------------------------------------- */
/* 2. Typedefs */
/* -------------------------------------------------------------------------- */

/** [Auto] @typedef {number} ImGuiID */
/** [Auto] @typedef {number} ImS8 */
/** [Auto] @typedef {number} ImU8 */
/** [Auto] @typedef {number} ImS16 */
/** [Auto] @typedef {number} ImU16 */
/** [Auto] @typedef {number} ImS32 */
/** [Auto] @typedef {number} ImU32 */
/** [Auto] @typedef {number} ImS64 */
/** [Auto] @typedef {number} ImU64 */
/** [Auto] @typedef {number} ImGuiDir */
/** [Auto] @typedef {number} ImGuiKey */
/** [Auto] @typedef {number} ImGuiMouseSource */
/** [Auto] @typedef {number} ImGuiSortDirection */
/** [Auto] @typedef {number} ImGuiCol */
/** [Auto] @typedef {number} ImGuiCond */
/** [Auto] @typedef {number} ImGuiDataType */
/** [Auto] @typedef {number} ImGuiMouseButton */
/** [Auto] @typedef {number} ImGuiMouseCursor */
/** [Auto] @typedef {number} ImGuiStyleVar */
/** [Auto] @typedef {number} ImGuiTableBgTarget */
/** [Auto] @typedef {number} ImDrawFlags */
/** [Auto] @typedef {number} ImDrawListFlags */
/** [Auto] @typedef {number} ImFontAtlasFlags */
/** [Auto] @typedef {number} ImGuiBackendFlags */
/** [Auto] @typedef {number} ImGuiButtonFlags */
/** [Auto] @typedef {number} ImGuiChildFlags */
/** [Auto] @typedef {number} ImGuiColorEditFlags */
/** [Auto] @typedef {number} ImGuiConfigFlags */
/** [Auto] @typedef {number} ImGuiComboFlags */
/** [Auto] @typedef {number} ImGuiDockNodeFlags */
/** [Auto] @typedef {number} ImGuiDragDropFlags */
/** [Auto] @typedef {number} ImGuiFocusedFlags */
/** [Auto] @typedef {number} ImGuiHoveredFlags */
/** [Auto] @typedef {number} ImGuiInputFlags */
/** [Auto] @typedef {number} ImGuiInputTextFlags */
/** [Auto] @typedef {number} ImGuiItemFlags */
/** [Auto] @typedef {number} ImGuiKeyChord */
/** [Auto] @typedef {number} ImGuiPopupFlags */
/** [Auto] @typedef {number} ImGuiMultiSelectFlags */
/** [Auto] @typedef {number} ImGuiSelectableFlags */
/** [Auto] @typedef {number} ImGuiSliderFlags */
/** [Auto] @typedef {number} ImGuiTabBarFlags */
/** [Auto] @typedef {number} ImGuiTabItemFlags */
/** [Auto] @typedef {number} ImGuiTableFlags */
/** [Auto] @typedef {number} ImGuiTableColumnFlags */
/** [Auto] @typedef {number} ImGuiTableRowFlags */
/** [Auto] @typedef {number} ImGuiTreeNodeFlags */
/** [Auto] @typedef {number} ImGuiViewportFlags */
/** [Auto] @typedef {number} ImGuiWindowFlags */
/** [Auto] @typedef {number} ImTextureID */
/** [Auto] @typedef {number} ImDrawIdx */
/** [Auto] @typedef {number} ImWchar32 */
/** [Auto] @typedef {number} ImWchar16 */
/** [Auto] @typedef {number} ImWchar */
/** [Auto] @typedef {number} ImGuiSelectionUserData */

/* -------------------------------------------------------------------------- */
/* 3. Structs */
/* -------------------------------------------------------------------------- */

/** [Manual] A 2D vector used to store positions, sizes etc. */
export class ImVec2 extends StructBinding {

    /** @param {number} x @param {number} y */
    constructor(x, y) {
        super("ImVec2");
        this.x = x;
        this.y = y;
    }

    /** @type {number} */
    get x() { return this.unwrap().get_x(); }
    set x(value) { this.unwrap().set_x(value); }

    /** @type {number} */
    get y() { return this.unwrap().get_y(); }
    set y(value) { this.unwrap().set_y(value); }
}

/** [Manual] A 4D vector used to store clipping rectangles, colors etc. */
export class ImVec4 extends StructBinding {

    /** @param {number} x @param {number} y @param {number} z @param {number} w */
    constructor(x, y, z, w) {
        super("ImVec4");
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /** @type {number} */
    get x() { return this.unwrap().get_x(); }
    set x(value) { this.unwrap().set_x(value); }

    /** @type {number} */
    get y() { return this.unwrap().get_y(); }
    set y(value) { this.unwrap().set_y(value); }

    /** @type {number} */
    get z() { return this.unwrap().get_z(); }
    set z(value) { this.unwrap().set_z(value); }

    /** @type {number} */
    get w() { return this.unwrap().get_w(); }
    set w(value) { this.unwrap().set_w(value); }
}

/** [Manual] Main configuration and I/O between your application and ImGui. */
export class ImGuiIO extends StructBinding {

    constructor() { super("ImGuiIO"); }

    /** @type {ImGuiConfigFlags} */
    get ConfigFlags() { return this.unwrap().get_ConfigFlags(); }
    set ConfigFlags(value) { this.unwrap().set_ConfigFlags(value); }

    /** @type {ImGuiBackendFlags} */
    get BackendFlags() { return this.unwrap().get_BackendFlags(); }
    set BackendFlags(value) { this.unwrap().set_BackendFlags(value); }

    /** @type {ImVec2} */
    get DisplaySize() { return ImVec2.wrap(this.unwrap().get_DisplaySize()); }
    set DisplaySize(value) { this.unwrap().set_DisplaySize(value.unwrap()); }

    /** @type {number} */
    get DeltaTime() { return this.unwrap().get_DeltaTime(); }
    set DeltaTime(value) { this.unwrap().set_DeltaTime(value); }

    /** @type {number} */
    get IniSavingRate() { return this.unwrap().get_IniSavingRate(); }
    set IniSavingRate(value) { this.unwrap().set_IniSavingRate(value); }

    /** @type {string} */
    //get IniFilename() { return this.unwrap().get_IniFilename(); }
    //set IniFilename(value) { this.unwrap().set_IniFilename(value); }

    /** @type {string} */
    //get LogFilename() { return this.unwrap().get_LogFilename(); }
    //set LogFilename(value) { this.unwrap().set_LogFilename(value); }

    /** @type {ImFontAtlas} */
    get Fonts() { return ImFontAtlas.wrap(this.unwrap().get_Fonts()); }
    set Fonts(value) { this.unwrap().set_Fonts(value.unwrap()); }

    /** @type {number} */
    get FontGlobalScale() { return this.unwrap().get_FontGlobalScale(); }
    set FontGlobalScale(value) { this.unwrap().set_FontGlobalScale(value); }

    /** @type {boolean} */
    get FontAllowUserScaling() { return this.unwrap().get_FontAllowUserScaling(); }
    set FontAllowUserScaling(value) { this.unwrap().set_FontAllowUserScaling(value); }

    /** @type {ImFont} */
    get FontDefault() { return ImFont.wrap(this.unwrap().get_FontDefault()); }
    set FontDefault(value) { this.unwrap().set_FontDefault(value.unwrap()); }

    /** @type {ImVec2} */
    get DisplayFramebufferScale() { return this.unwrap().get_DisplayFramebufferScale(); }
    set DisplayFramebufferScale(value) { this.unwrap().set_DisplayFramebufferScale(value); }

    /** @type {boolean} */
    get ConfigNavSwapGamepadButtons() { return this.unwrap().get_ConfigNavSwapGamepadButtons(); }
    set ConfigNavSwapGamepadButtons(value) { this.unwrap().set_ConfigNavSwapGamepadButtons(value); }

    /** @type {boolean} */
    get ConfigNavMoveSetMousePos() { return this.unwrap().get_ConfigNavMoveSetMousePos(); }
    set ConfigNavMoveSetMousePos(value) { this.unwrap().set_ConfigNavMoveSetMousePos(value); }

    /** @type {boolean} */
    get ConfigNavCaptureKeyboard() { return this.unwrap().get_ConfigNavCaptureKeyboard(); }
    set ConfigNavCaptureKeyboard(value) { this.unwrap().set_ConfigNavCaptureKeyboard(value); }


    /** @type {boolean} */
    get ConfigNavEscapeClearFocusItem() { return this.unwrap().get_ConfigNavEscapeClearFocusItem(); }
    set ConfigNavEscapeClearFocusItem(value) { this.unwrap().set_ConfigNavEscapeClearFocusItem(value); }

    /** @type {boolean} */
    get ConfigNavEscapeClearFocusWindow() { return this.unwrap().get_ConfigNavEscapeClearFocusWindow(); }
    set ConfigNavEscapeClearFocusWindow(value) { this.unwrap().set_ConfigNavEscapeClearFocusWindow(value); }

    /** @type {boolean} */
    get ConfigNavCursorVisibleAuto() { return this.unwrap().get_ConfigNavCursorVisibleAuto(); }
    set ConfigNavCursorVisibleAuto(value) { this.unwrap().set_ConfigNavCursorVisibleAuto(value); }

    /** @type {boolean} */
    get ConfigNavCursorVisibleAlways() { return this.unwrap().get_ConfigNavCursorVisibleAlways(); }
    set ConfigNavCursorVisibleAlways(value) { this.unwrap().set_ConfigNavCursorVisibleAlways(value); }

    /** @type {boolean} */
    get ConfigDockingNoSplit() { return this.unwrap().get_ConfigDockingNoSplit(); }
    set ConfigDockingNoSplit(value) { this.unwrap().set_ConfigDockingNoSplit(value); }


    /** @type {boolean} */
    get ConfigDockingWithShift() { return this.unwrap().get_ConfigDockingWithShift(); }
    set ConfigDockingWithShift(value) { this.unwrap().set_ConfigDockingWithShift(value); }

    /** @type {boolean} */
    get ConfigDockingAlwaysTabBar() { return this.unwrap().get_ConfigDockingAlwaysTabBar(); }
    set ConfigDockingAlwaysTabBar(value) { this.unwrap().set_ConfigDockingAlwaysTabBar(value); }

    /** @type {boolean} */
    get ConfigDockingTransparentPayload() { return this.unwrap().get_ConfigDockingTransparentPayload(); }
    set ConfigDockingTransparentPayload(value) { this.unwrap().set_ConfigDockingTransparentPayload(value); }

    /** @type {boolean} */
    get ConfigViewportsNoAutoMerge() { return this.unwrap().get_ConfigViewportsNoAutoMerge(); }
    set ConfigViewportsNoAutoMerge(value) { this.unwrap().set_ConfigViewportsNoAutoMerge(value); }

    /** @type {boolean} */
    get ConfigViewportsNoTaskBarIcon() { return this.unwrap().get_ConfigViewportsNoTaskBarIcon(); }
    set ConfigViewportsNoTaskBarIcon(value) { this.unwrap().set_ConfigViewportsNoTaskBarIcon(value); }

    /** @type {boolean} */
    get ConfigViewportsNoDecoration() { return this.unwrap().get_ConfigViewportsNoDecoration(); }
    set ConfigViewportsNoDecoration(value) { this.unwrap().set_ConfigViewportsNoDecoration(value); }

    /** @type {boolean} */
    get ConfigViewportsNoDefaultParent() { return this.unwrap().get_ConfigViewportsNoDefaultParent(); }
    set ConfigViewportsNoDefaultParent(value) { this.unwrap().set_ConfigViewportsNoDefaultParent(value); }

    /** @type {boolean} */
    get MouseDrawCursor() { return this.unwrap().get_MouseDrawCursor(); }
    set MouseDrawCursor(value) { this.unwrap().set_MouseDrawCursor(value); }

    /** @type {boolean} */
    get ConfigMacOSXBehaviors() { return this.unwrap().get_ConfigMacOSXBehaviors(); }
    set ConfigMacOSXBehaviors(value) { this.unwrap().set_ConfigMacOSXBehaviors(value); }

    /** @type {boolean} */
    get ConfigInputTrickleEventQueue() { return this.unwrap().get_ConfigInputTrickleEventQueue(); }
    set ConfigInputTrickleEventQueue(value) { this.unwrap().set_ConfigInputTrickleEventQueue(value); }

    /** @type {boolean} */
    get ConfigInputTextCursorBlink() { return this.unwrap().get_ConfigInputTextCursorBlink(); }
    set ConfigInputTextCursorBlink(value) { this.unwrap().set_ConfigInputTextCursorBlink(value); }

    /** @type {boolean} */
    get ConfigInputTextEnterKeepActive() { return this.unwrap().get_ConfigInputTextEnterKeepActive(); }
    set ConfigInputTextEnterKeepActive(value) { this.unwrap().set_ConfigInputTextEnterKeepActive(value); }

    /** @type {boolean} */
    get ConfigDragClickToInputText() { return this.unwrap().get_ConfigDragClickToInputText(); }
    set ConfigDragClickToInputText(value) { this.unwrap().set_ConfigDragClickToInputText(value); }

    /** @type {boolean} */
    get ConfigWindowsResizeFromEdges() { return this.unwrap().get_ConfigWindowsResizeFromEdges(); }
    set ConfigWindowsResizeFromEdges(value) { this.unwrap().set_ConfigWindowsResizeFromEdges(value); }

    /** @type {boolean} */
    get ConfigWindowsMoveFromTitleBarOnly() { return this.unwrap().get_ConfigWindowsMoveFromTitleBarOnly(); }
    set ConfigWindowsMoveFromTitleBarOnly(value) { this.unwrap().set_ConfigWindowsMoveFromTitleBarOnly(value); }

    /** @type {boolean} */
    get ConfigWindowsCopyContentsWithCtrlC() { return this.unwrap().get_ConfigWindowsCopyContentsWithCtrlC(); }
    set ConfigWindowsCopyContentsWithCtrlC(value) { this.unwrap().set_ConfigWindowsCopyContentsWithCtrlC(value); }

    /** @type {boolean} */
    get ConfigScrollbarScrollByPage() { return this.unwrap().get_ConfigScrollbarScrollByPage(); }
    set ConfigScrollbarScrollByPage(value) { this.unwrap().set_ConfigScrollbarScrollByPage(value); }

    /** @type {number} */
    get ConfigMemoryCompactTimer() { return this.unwrap().get_ConfigMemoryCompactTimer(); }
    set ConfigMemoryCompactTimer(value) { this.unwrap().set_ConfigMemoryCompactTimer(value); }

    /** @type {number} */
    get MouseDoubleClickTime() { return this.unwrap().get_MouseDoubleClickTime(); }
    set MouseDoubleClickTime(value) { this.unwrap().set_MouseDoubleClickTime(value); }

    /** @type {number} */
    get MouseDoubleClickMaxDist() { return this.unwrap().get_MouseDoubleClickMaxDist(); }
    set MouseDoubleClickMaxDist(value) { this.unwrap().set_MouseDoubleClickMaxDist(value); }

    /** @type {number} */
    get MouseDragThreshold() { return this.unwrap().get_MouseDragThreshold(); }
    set MouseDragThreshold(value) { this.unwrap().set_MouseDragThreshold(value); }

    /** @type {number} */
    get KeyRepeatDelay() { return this.unwrap().get_KeyRepeatDelay(); }
    set KeyRepeatDelay(value) { this.unwrap().set_KeyRepeatDelay(value); }

    /** @type {number} */
    get KeyRepeatRate() { return this.unwrap().get_KeyRepeatRate(); }
    set KeyRepeatRate(value) { this.unwrap().set_KeyRepeatRate(value); }

    /** @param {ImGuiKey} key @param {boolean} down */
    AddKeyEvent(key, down) { return this.unwrap().ImGuiIO_AddKeyEvent(key, down); }

    /** @param {ImGuiKey} key @param {boolean} down @param {number} v */
    AddKeyAnalogEvent(key, down, v) { return this.unwrap().ImGuiIO_AddKeyAnalogEvent(key, down, v); }

    /** @param {number} x @param {number} y */
    AddMousePosEvent(x, y) { return this.unwrap().ImGuiIO_AddMousePosEvent(x, y); }

    /** @param {number} button @param {boolean} down */
    AddMouseButtonEvent(button, down) { return this.unwrap().ImGuiIO_AddMouseButtonEvent(button, down); }

    /** @param {number} wheel_x @param {number} wheel_y */
    AddMouseWheelEvent(wheel_x, wheel_y) { return this.unwrap().ImGuiIO_AddMouseWheelEvent(wheel_x, wheel_y); }

    /** @param {ImGuiMouseSource} source */
    AddMouseSourceEvent(source) { return this.unwrap().ImGuiIO_AddMouseSourceEvent(source); }

    /** @param {ImGuiID} id */
    AddMouseViewportEvent(id) { return this.unwrap().ImGuiIO_AddMouseViewportEvent(id); }

    /** @param {boolean} focused */
    AddFocusEvent(focused) { return this.unwrap().ImGuiIO_AddFocusEvent(focused); }

    /** @param {number} c */
    AddInputCharacter(c) { return this.unwrap().ImGuiIO_AddInputCharacter(c); }

    /** @param {number} c */
    AddInputCharacterUTF16(c) { return this.unwrap().ImGuiIO_AddInputCharacterUTF16(c); }

    /** @param {string} str */
    AddInputCharactersUTF8(str) { return this.unwrap().ImGuiIO_AddInputCharactersUTF8(str); }

    /** @param {ImGuiKey} key @param {number} native_keycode @param {number} native_scancode */
    SetKeyEventNativeData(key, native_keycode, native_scancode) { return this.unwrap().ImGuiIO_SetKeyEventNativeData(key, native_keycode, native_scancode); }

    /** @param {boolean} accepting_events */
    SetAppAcceptingEvents(accepting_events) { return this.unwrap().ImGuiIO_SetAppAcceptingEvents(accepting_events); }

    ClearEventsQueue() { return this.unwrap().ImGuiIO_ClearEventsQueue(); }
    ClearInputKeys() { return this.unwrap().ImGuiIO_ClearInputKeys(); }
    ClearInputMouse() { return this.unwrap().ImGuiIO_ClearInputMouse(); }
}

/** [Manual] Runtime data for styling/colors. */
export class ImGuiStyle extends StructBinding {

    constructor() { super("ImGuiStyle"); }

    /** @type {number} */
    get Alpha() { return this.unwrap().get_Alpha(); }
    set Alpha(value) { this.unwrap().set_Alpha(value); }

    /** @type {number} */
    get DisabledAlpha() { return this.unwrap().get_DisabledAlpha(); }
    set DisabledAlpha(value) { this.unwrap().set_DisabledAlpha(value); }

    /** @type {ImVec2} */
    get WindowPadding() { return ImVec2.wrap(this.unwrap().get_WindowPadding()); }
    set WindowPadding(value) { this.unwrap().set_WindowPadding(value); }

    /** @type {number} */
    get WindowRounding() { return this.unwrap().get_WindowRounding(); }
    set WindowRounding(value) { this.unwrap().set_WindowRounding(value); }

    /** @type {number} */
    get WindowBorderSize() { return this.unwrap().get_WindowBorderSize(); }
    set WindowBorderSize(value) { this.unwrap().set_WindowBorderSize(value); }

    /** @type {ImVec2} */
    get WindowMinSize() { return ImVec2.wrap(this.unwrap().get_WindowMinSize()); }
    set WindowMinSize(value) { this.unwrap().set_WindowMinSize(value.unwrap()); }

    /** @type {ImVec2} */
    get WindowTitleAlign() { return ImVec2.wrap(this.unwrap().get_WindowTitleAlign()); }
    set WindowTitleAlign(value) { this.unwrap().set_WindowTitleAlign(value.unwrap()); }

    /** @type {ImGuiDir} */
    get WindowMenuButtonPosition() { return this.unwrap().get_WindowMenuButtonPosition(); }
    set WindowMenuButtonPosition(value) { this.unwrap().set_WindowMenuButtonPosition(value); }

    /** @type {number} */
    get ChildRounding() { return this.unwrap().get_ChildRounding(); }
    set ChildRounding(value) { this.unwrap().set_ChildRounding(value); }

    /** @type {number} */
    get ChildBorderSize() { return this.unwrap().get_ChildBorderSize(); }
    set ChildBorderSize(value) { this.unwrap().set_ChildBorderSize(value); }

    /** @type {number} */
    get PopupRounding() { return this.unwrap().get_PopupRounding(); }
    set PopupRounding(value) { this.unwrap().set_PopupRounding(value); }

    /** @type {number} */
    get PopupBorderSize() { return this.unwrap().get_PopupBorderSize(); }
    set PopupBorderSize(value) { this.unwrap().set_PopupBorderSize(value); }

    /** @type {ImVec2} */
    get FramePadding() { return ImVec2.wrap(this.unwrap().get_FramePadding()); }
    set FramePadding(value) { this.unwrap().set_FramePadding(value.unwrap()); }

    /** @type {number} */
    get FrameRounding() { return this.unwrap().get_FrameRounding(); }
    set FrameRounding(value) { this.unwrap().set_FrameRounding(value); }

    /** @type {number} */
    get FrameBorderSize() { return this.unwrap().get_FrameBorderSize(); }
    set FrameBorderSize(value) { this.unwrap().set_FrameBorderSize(value); }

    /** @type {ImVec2} */
    get ItemSpacing() { return ImVec2.wrap(this.unwrap().get_ItemSpacing()); }
    set ItemSpacing(value) { this.unwrap().set_ItemSpacing(value.unwrap()); }

    /** @type {ImVec2} */
    get ItemInnerSpacing() { return ImVec2.wrap(this.unwrap().get_ItemInnerSpacing()); }
    set ItemInnerSpacing(value) { this.unwrap().set_ItemInnerSpacing(value.unwrap()); }

    /** @type {ImVec2} */
    get CellPadding() { return ImVec2.wrap(this.unwrap().get_CellPadding()); }
    set CellPadding(value) { this.unwrap().set_CellPadding(value.unwrap()); }

    /** @type {ImVec2} */
    get TouchExtraPadding() { return ImVec2.wrap(this.unwrap().get_TouchExtraPadding()); }
    set TouchExtraPadding(value) { this.unwrap().set_TouchExtraPadding(value.unwrap()); }

    /** @type {number} */
    get IndentSpacing() { return this.unwrap().get_IndentSpacing(); }
    set IndentSpacing(value) { this.unwrap().set_IndentSpacing(value); }

    /** @type {number} */
    get ColumnsMinSpacing() { return this.unwrap().get_ColumnsMinSpacing(); }
    set ColumnsMinSpacing(value) { this.unwrap().set_ColumnsMinSpacing(value); }

    /** @type {number} */
    get ScrollbarSize() { return this.unwrap().get_ScrollbarSize(); }
    set ScrollbarSize(value) { this.unwrap().set_ScrollbarSize(value); }

    /** @type {number} */
    get ScrollbarRounding() { return this.unwrap().get_ScrollbarRounding(); }
    set ScrollbarRounding(value) { this.unwrap().set_ScrollbarRounding(value); }

    /** @type {number} */
    get GrabMinSize() { return this.unwrap().get_GrabMinSize(); }
    set GrabMinSize(value) { this.unwrap().set_GrabMinSize(value); }

    /** @type {number} */
    get GrabRounding() { return this.unwrap().get_GrabRounding(); }
    set GrabRounding(value) { this.unwrap().set_GrabRounding(value); }

    /** @type {number} */
    get LogSliderDeadzone() { return this.unwrap().get_LogSliderDeadzone(); }
    set LogSliderDeadzone(value) { this.unwrap().set_LogSliderDeadzone(value); }

    /** @type {number} */
    get TabRounding() { return this.unwrap().get_TabRounding(); }
    set TabRounding(value) { this.unwrap().set_TabRounding(value); }

    /** @type {number} */
    get TabBorderSize() { return this.unwrap().get_TabBorderSize(); }
    set TabBorderSize(value) { this.unwrap().set_TabBorderSize(value); }

    /** @type {number} */
    get TabMinWidthForCloseButton() { return this.unwrap().get_TabMinWidthForCloseButton(); }
    set TabMinWidthForCloseButton(value) { this.unwrap().set_TabMinWidthForCloseButton(value); }

    /** @type {number} */
    get TabBarBorderSize() { return this.unwrap().get_TabBarBorderSize(); }
    set TabBarBorderSize(value) { this.unwrap().set_TabBarBorderSize(value); }

    /** @type {number} */
    get TabBarOverlineSize() { return this.unwrap().get_TabBarOverlineSize(); }
    set TabBarOverlineSize(value) { this.unwrap().set_TabBarOverlineSize(value); }

    /** @type {number} */
    get TableAngledHeadersAngle() { return this.unwrap().get_TableAngledHeadersAngle(); }
    set TableAngledHeadersAngle(value) { this.unwrap().set_TableAngledHeadersAngle(value); }

    /** @type {ImVec2} */
    get TableAngledHeadersTextAlign() { return ImVec2.wrap(this.unwrap().get_TableAngledHeadersTextAlign()); }
    set TableAngledHeadersTextAlign(value) { this.unwrap().set_TableAngledHeadersTextAlign(value.unwrap()); }

    /** @type {ImGuiDir} */
    get ColorButtonPosition() { return this.unwrap().get_ColorButtonPosition(); }
    set ColorButtonPosition(value) { this.unwrap().set_ColorButtonPosition(value); }

    /** @type {ImVec2} */
    get ButtonTextAlign() { return ImVec2.wrap(this.unwrap().get_ButtonTextAlign()); }
    set ButtonTextAlign(value) { this.unwrap().set_ButtonTextAlign(value.unwrap()); }

    /** @type {ImVec2} */
    get SelectableTextAlign() { return ImVec2.wrap(this.unwrap().get_SelectableTextAlign()); }
    set SelectableTextAlign(value) { this.unwrap().set_SelectableTextAlign(value.unwrap()); }

    /** @type {number} */
    get SeparatorTextBorderSize() { return this.unwrap().get_SeparatorTextBorderSize(); }
    set SeparatorTextBorderSize(value) { this.unwrap().set_SeparatorTextBorderSize(value); }

    /** @type {ImVec2} */
    get SeparatorTextAlign() { return ImVec2.wrap(this.unwrap().get_SeparatorTextAlign()); }
    set SeparatorTextAlign(value) { this.unwrap().set_SeparatorTextAlign(value.unwrap()); }

    /** @type {ImVec2} */
    get SeparatorTextPadding() { return ImVec2.wrap(this.unwrap().get_SeparatorTextPadding()); }
    set SeparatorTextPadding(value) { this.unwrap().set_SeparatorTextPadding(value.unwrap()); }

    /** @type {ImVec2} */
    get DisplayWindowPadding() { return ImVec2.wrap(this.unwrap().get_DisplayWindowPadding()); }
    set DisplayWindowPadding(value) { this.unwrap().set_DisplayWindowPadding(value.unwrap()); }

    /** @type {ImVec2} */
    get DisplaySafeAreaPadding() { return ImVec2.wrap(this.unwrap().get_DisplaySafeAreaPadding()); }
    set DisplaySafeAreaPadding(value) { this.unwrap().set_DisplaySafeAreaPadding(value.unwrap()); }

    /** @type {number} */
    get DockingSeparatorSize() { return this.unwrap().get_DockingSeparatorSize(); }
    set DockingSeparatorSize(value) { this.unwrap().set_DockingSeparatorSize(value); }

    /** @type {number} */
    get MouseCursorScale() { return this.unwrap().get_MouseCursorScale(); }
    set MouseCursorScale(value) { this.unwrap().set_MouseCursorScale(value); }

    /** @type {boolean} */
    get AntiAliasedLines() { return this.unwrap().get_AntiAliasedLines(); }
    set AntiAliasedLines(value) { this.unwrap().set_AntiAliasedLines(value); }

    /** @type {boolean} */
    get AntiAliasedLinesUseTex() { return this.unwrap().get_AntiAliasedLinesUseTex(); }
    set AntiAliasedLinesUseTex(value) { this.unwrap().set_AntiAliasedLinesUseTex(value); }

    /** @type {boolean} */
    get AntiAliasedFill() { return this.unwrap().get_AntiAliasedFill(); }
    set AntiAliasedFill(value) { this.unwrap().set_AntiAliasedFill(value); }

    /** @type {number} */
    get CurveTessellationTol() { return this.unwrap().get_CurveTessellationTol(); }
    set CurveTessellationTol(value) { this.unwrap().set_CurveTessellationTol(value); }

    /** @type {number} */
    get CircleTessellationMaxError() { return this.unwrap().get_CircleTessellationMaxError(); }
    set CircleTessellationMaxError(value) { this.unwrap().set_CircleTessellationMaxError(value); }

    // /** @type {ImVec4} */
    // get Colors() { return ImVec4.wrap(this.unwrap().get_Colors()); }
    // set Colors(value) { this.unwrap().set_Colors(value.unwrap()); }

    /** @type {number} */
    get HoverStationaryDelay() { return this.unwrap().get_HoverStationaryDelay(); }
    set HoverStationaryDelay(value) { this.unwrap().set_HoverStationaryDelay(value); }

    /** @type {number} */
    get HoverDelayShort() { return this.unwrap().get_HoverDelayShort(); }
    set HoverDelayShort(value) { this.unwrap().set_HoverDelayShort(value); }

    /** @type {number} */
    get HoverDelayNormal() { return this.unwrap().get_HoverDelayNormal(); }
    set HoverDelayNormal(value) { this.unwrap().set_HoverDelayNormal(value); }

    /** @type {ImGuiHoveredFlags} */
    get HoverFlagsForTooltipMouse() { return this.unwrap().get_HoverFlagsForTooltipMouse(); }
    set HoverFlagsForTooltipMouse(value) { this.unwrap().set_HoverFlagsForTooltipMouse(value); }

    /** @type {ImGuiHoveredFlags} */
    get HoverFlagsForTooltipNav() { return this.unwrap().get_HoverFlagsForTooltipNav(); }
    set HoverFlagsForTooltipNav(value) { this.unwrap().set_HoverFlagsForTooltipNav(value); }

    /** @param {number} scale_factor */
    ScaleAllSizes(scale_factor) { return this.unwrap().ImGuiStyle_ScaleAllSizes(scale_factor); }
}

/** [Auto] */
export class ImDrawListSharedData extends StructBinding {
    constructor() { super("ImDrawListSharedData"); }
}
/** [Auto] */
export class ImGuiContext extends StructBinding {
    constructor() { super("ImGuiContext"); }
}
/** [Auto] */
export class ImGuiTableSortSpecs extends StructBinding {
    constructor() { super("ImGuiTableSortSpecs"); }
}
/** [Auto] */
export class ImGuiTableColumnSortSpecs extends StructBinding {
    constructor() { super("ImGuiTableColumnSortSpecs"); }
}
/** [Auto] */
export class ImGuiStorage extends StructBinding {
    constructor() { super("ImGuiStorage"); }
}
/** [Auto] */
export class ImGuiMultiSelectIO extends StructBinding {
    constructor() { super("ImGuiMultiSelectIO"); }
}
/** [Auto] */
export class ImDrawList extends StructBinding {
    constructor() { super("ImDrawList"); }
}
/** [Auto] */
export class ImDrawData extends StructBinding {
    constructor() { super("ImDrawData"); }
}
/** [Auto] */
export class ImFontAtlas extends StructBinding {
    constructor() { super("ImFontAtlas"); }
}
/** [Auto] */
export class ImFont extends StructBinding {
    constructor() { super("ImFont"); }
}
/** [Auto] */
export class ImGuiViewport extends StructBinding {
    constructor() { super("ImGuiViewport"); }
}
/** [Auto] */
export class ImGuiPlatformIO extends StructBinding {
    constructor() { super("ImGuiPlatformIO"); }
}

/* -------------------------------------------------------------------------- */
/* 4. Functions */
/* -------------------------------------------------------------------------- */

/**
 * Namespace that provides access to the OpenGL3 backend functions.
 * @namespace {ImGuiImplOpenGL3}
 */
export const ImGuiImplOpenGL3 = {
    /** [Manual] Initializes the OpenGL3 backend. @returns {boolean} */
    Init: () => { return Mod.main.cImGui_ImplOpenGL3_Init(); },

    /** [Manual] Shuts down the OpenGL3 backend. @returns {void} */
    Shutdown: () => { return Mod.main.cImGui_ImplOpenGL3_Shutdown(); },

    /** [Manual] Starts a new OpenGL3 frame. @returns {void} */
    NewFrame: () => { return Mod.main.cImGui_ImplOpenGL3_NewFrame(); },

    /** [Manual] Renders the OpenGL3 frame. @param {ImDrawData} draw_data @returns {void} */
    RenderDrawData: (draw_data) => { return Mod.main.cImGui_ImplOpenGL3_RenderDrawData(draw_data.unwrap()); },
};

/**
 * Namespace that provides access to the ImGui functions.
 * @namespace {ImGui}
 */
export const ImGui = {
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

    /** [Auto] */
    CreateContext: (shared_font_atlas = null) => { return ImGuiContext.wrap(Mod.main.ImGui_CreateContext(shared_font_atlas)) },
    /** [Auto] */
    DestroyContext: (ctx = null) => { return Mod.main.ImGui_DestroyContext(ctx) },
    /** [Auto] */
    GetCurrentContext: () => { return ImGuiContext.wrap(Mod.main.ImGui_GetCurrentContext()) },
    /** [Auto] */
    SetCurrentContext: (ctx) => { return Mod.main.ImGui_SetCurrentContext(ctx) },
    /** [Auto] */
    GetPlatformIO: () => { return ImGuiPlatformIO.wrap(Mod.main.ImGui_GetPlatformIO()) },
    /** [Auto] */
    NewFrame: () => { return Mod.main.ImGui_NewFrame() },
    /** [Auto] */
    EndFrame: () => { return Mod.main.ImGui_EndFrame() },
    /** [Auto] */
    Render: () => { return Mod.main.ImGui_Render() },
    /** [Auto] */
    GetDrawData: () => { return ImDrawData.wrap(Mod.main.ImGui_GetDrawData()) },
    /** [Auto] */
    ShowDemoWindow: (p_open = null) => { return Mod.main.ImGui_ShowDemoWindow(p_open) },
    /** [Auto] */
    ShowMetricsWindow: (p_open = null) => { return Mod.main.ImGui_ShowMetricsWindow(p_open) },
    /** [Auto] */
    ShowDebugLogWindow: (p_open = null) => { return Mod.main.ImGui_ShowDebugLogWindow(p_open) },
    /** [Auto] */
    ShowIDStackToolWindow: (p_open = null) => { return Mod.main.ImGui_ShowIDStackToolWindowEx(p_open) },
    /** [Auto] */
    ShowAboutWindow: (p_open = null) => { return Mod.main.ImGui_ShowAboutWindow(p_open) },
    /** [Auto] */
    ShowStyleEditor: (ref = null) => { return Mod.main.ImGui_ShowStyleEditor(ref) },
    /** [Auto] */
    ShowStyleSelector: (label) => { return Mod.main.ImGui_ShowStyleSelector(label) },
    /** [Auto] */
    ShowFontSelector: (label) => { return Mod.main.ImGui_ShowFontSelector(label) },
    /** [Auto] */
    ShowUserGuide: () => { return Mod.main.ImGui_ShowUserGuide() },
    /** [Auto] */
    GetVersion: () => { return Mod.main.ImGui_GetVersion() },
    /** [Auto] */
    StyleColorsDark: (dst = null) => { return Mod.main.ImGui_StyleColorsDark(dst) },
    /** [Auto] */
    StyleColorsLight: (dst = null) => { return Mod.main.ImGui_StyleColorsLight(dst) },
    /** [Auto] */
    StyleColorsClassic: (dst = null) => { return Mod.main.ImGui_StyleColorsClassic(dst) },
    /** [Auto] */
    Begin: (name, p_open = null, flags = 0) => { return Mod.main.ImGui_Begin(name, p_open, flags) },
    /** [Auto] */
    End: () => { return Mod.main.ImGui_End() },
    /** [Auto] */
    BeginChild: (str_id, size = new ImVec2(0, 0), child_flags = 0, window_flags = 0) => { return Mod.main.ImGui_BeginChild(str_id, size.unwrap(), child_flags, window_flags) },
    /** [Auto] */
    EndChild: () => { return Mod.main.ImGui_EndChild() },
    /** [Auto] */
    IsWindowAppearing: () => { return Mod.main.ImGui_IsWindowAppearing() },
    /** [Auto] */
    IsWindowCollapsed: () => { return Mod.main.ImGui_IsWindowCollapsed() },
    /** [Auto] */
    IsWindowFocused: (flags = 0) => { return Mod.main.ImGui_IsWindowFocused(flags) },
    /** [Auto] */
    IsWindowHovered: (flags = 0) => { return Mod.main.ImGui_IsWindowHovered(flags) },
    /** [Auto] */
    GetWindowDrawList: () => { return ImDrawList.wrap(Mod.main.ImGui_GetWindowDrawList()) },
    /** [Auto] */
    GetWindowDpiScale: () => { return Mod.main.ImGui_GetWindowDpiScale() },
    /** [Auto] */
    GetWindowPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetWindowPos()) },
    /** [Auto] */
    GetWindowSize: () => { return ImVec2.wrap(Mod.main.ImGui_GetWindowSize()) },
    /** [Auto] */
    GetWindowWidth: () => { return Mod.main.ImGui_GetWindowWidth() },
    /** [Auto] */
    GetWindowHeight: () => { return Mod.main.ImGui_GetWindowHeight() },
    /** [Auto] */
    GetWindowViewport: () => { return ImGuiViewport.wrap(Mod.main.ImGui_GetWindowViewport()) },
    /** [Auto] */
    SetNextWindowPos: (pos, cond = 0, pivot = new ImVec2(0, 0)) => { return Mod.main.ImGui_SetNextWindowPosEx(pos.unwrap(), cond, pivot.unwrap()) },
    /** [Auto] */
    SetNextWindowSize: (size, cond = 0) => { return Mod.main.ImGui_SetNextWindowSize(size.unwrap(), cond) },
    /** [Auto] */
    SetNextWindowContentSize: (size) => { return Mod.main.ImGui_SetNextWindowContentSize(size.unwrap()) },
    /** [Auto] */
    SetNextWindowCollapsed: (collapsed, cond = 0) => { return Mod.main.ImGui_SetNextWindowCollapsed(collapsed, cond) },
    /** [Auto] */
    SetNextWindowFocus: () => { return Mod.main.ImGui_SetNextWindowFocus() },
    /** [Auto] */
    SetNextWindowScroll: (scroll) => { return Mod.main.ImGui_SetNextWindowScroll(scroll.unwrap()) },
    /** [Auto] */
    SetNextWindowBgAlpha: (alpha) => { return Mod.main.ImGui_SetNextWindowBgAlpha(alpha) },
    /** [Auto] */
    SetNextWindowViewport: (viewport_id) => { return Mod.main.ImGui_SetNextWindowViewport(viewport_id) },
    /** [Auto] */
    SetWindowPos: (pos, cond = 0) => { return Mod.main.ImGui_SetWindowPos(pos.unwrap(), cond) },
    /** [Auto] */
    SetWindowSize: (size, cond = 0) => { return Mod.main.ImGui_SetWindowSize(size.unwrap(), cond) },
    /** [Auto] */
    SetWindowCollapsed: (collapsed, cond = 0) => { return Mod.main.ImGui_SetWindowCollapsed(collapsed, cond) },
    /** [Auto] */
    SetWindowFocus: () => { return Mod.main.ImGui_SetWindowFocus() },
    /** [Auto] */
    SetWindowFontScale: (scale) => { return Mod.main.ImGui_SetWindowFontScale(scale) },
    /** [Auto] */
    GetScrollX: () => { return Mod.main.ImGui_GetScrollX() },
    /** [Auto] */
    GetScrollY: () => { return Mod.main.ImGui_GetScrollY() },
    /** [Auto] */
    SetScrollX: (scroll_x) => { return Mod.main.ImGui_SetScrollX(scroll_x) },
    /** [Auto] */
    SetScrollY: (scroll_y) => { return Mod.main.ImGui_SetScrollY(scroll_y) },
    /** [Auto] */
    GetScrollMaxX: () => { return Mod.main.ImGui_GetScrollMaxX() },
    /** [Auto] */
    GetScrollMaxY: () => { return Mod.main.ImGui_GetScrollMaxY() },
    /** [Auto] */
    SetScrollHereX: (center_x_ratio = 0.5) => { return Mod.main.ImGui_SetScrollHereX(center_x_ratio) },
    /** [Auto] */
    SetScrollHereY: (center_y_ratio = 0.5) => { return Mod.main.ImGui_SetScrollHereY(center_y_ratio) },
    /** [Auto] */
    SetScrollFromPosX: (local_x, center_x_ratio = 0.5) => { return Mod.main.ImGui_SetScrollFromPosX(local_x, center_x_ratio) },
    /** [Auto] */
    SetScrollFromPosY: (local_y, center_y_ratio = 0.5) => { return Mod.main.ImGui_SetScrollFromPosY(local_y, center_y_ratio) },
    /** [Auto] */
    PushFont: (font) => { return Mod.main.ImGui_PushFont(font) },
    /** [Auto] */
    PopFont: () => { return Mod.main.ImGui_PopFont() },
    /** [Auto] */
    PushStyleColor: (idx, col) => { return Mod.main.ImGui_PushStyleColor(idx, col) },
    /** [Auto] */
    PopStyleColor: (count = 1) => { return Mod.main.ImGui_PopStyleColorEx(count) },
    /** [Auto] */
    PushStyleVar: (idx, val) => { return Mod.main.ImGui_PushStyleVar(idx, val) },
    /** [Auto] */
    PushStyleVarX: (idx, val_x) => { return Mod.main.ImGui_PushStyleVarX(idx, val_x) },
    /** [Auto] */
    PushStyleVarY: (idx, val_y) => { return Mod.main.ImGui_PushStyleVarY(idx, val_y) },
    /** [Auto] */
    PopStyleVar: (count = 1) => { return Mod.main.ImGui_PopStyleVarEx(count) },
    /** [Auto] */
    PushItemFlag: (option, enabled) => { return Mod.main.ImGui_PushItemFlag(option, enabled) },
    /** [Auto] */
    PopItemFlag: () => { return Mod.main.ImGui_PopItemFlag() },
    /** [Auto] */
    PushItemWidth: (item_width) => { return Mod.main.ImGui_PushItemWidth(item_width) },
    /** [Auto] */
    PopItemWidth: () => { return Mod.main.ImGui_PopItemWidth() },
    /** [Auto] */
    SetNextItemWidth: (item_width) => { return Mod.main.ImGui_SetNextItemWidth(item_width) },
    /** [Auto] */
    CalcItemWidth: () => { return Mod.main.ImGui_CalcItemWidth() },
    /** [Auto] */
    PushTextWrapPos: (wrap_local_pos_x = 0.0) => { return Mod.main.ImGui_PushTextWrapPos(wrap_local_pos_x) },
    /** [Auto] */
    PopTextWrapPos: () => { return Mod.main.ImGui_PopTextWrapPos() },
    /** [Auto] */
    GetFont: () => { return ImFont.wrap(Mod.main.ImGui_GetFont()) },
    /** [Auto] */
    GetFontSize: () => { return Mod.main.ImGui_GetFontSize() },
    /** [Auto] */
    GetFontTexUvWhitePixel: () => { return ImVec2.wrap(Mod.main.ImGui_GetFontTexUvWhitePixel()) },
    /** [Auto] */
    GetStyleColorVec4: (idx) => { return ImVec4.wrap(Mod.main.ImGui_GetStyleColorVec4(idx)) },
    /** [Auto] */
    GetCursorScreenPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorScreenPos()) },
    /** [Auto] */
    SetCursorScreenPos: (pos) => { return Mod.main.ImGui_SetCursorScreenPos(pos.unwrap()) },
    /** [Auto] */
    GetContentRegionAvail: () => { return ImVec2.wrap(Mod.main.ImGui_GetContentRegionAvail()) },
    /** [Auto] */
    GetCursorPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorPos()) },
    /** [Auto] */
    GetCursorPosX: () => { return Mod.main.ImGui_GetCursorPosX() },
    /** [Auto] */
    GetCursorPosY: () => { return Mod.main.ImGui_GetCursorPosY() },
    /** [Auto] */
    SetCursorPos: (local_pos) => { return Mod.main.ImGui_SetCursorPos(local_pos.unwrap()) },
    /** [Auto] */
    SetCursorPosX: (local_x) => { return Mod.main.ImGui_SetCursorPosX(local_x) },
    /** [Auto] */
    SetCursorPosY: (local_y) => { return Mod.main.ImGui_SetCursorPosY(local_y) },
    /** [Auto] */
    GetCursorStartPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorStartPos()) },
    /** [Auto] */
    Separator: () => { return Mod.main.ImGui_Separator() },
    /** [Auto] */
    SameLine: (offset_from_start_x = 0.0, spacing = -1.0) => { return Mod.main.ImGui_SameLineEx(offset_from_start_x, spacing) },
    /** [Auto] */
    NewLine: () => { return Mod.main.ImGui_NewLine() },
    /** [Auto] */
    Spacing: () => { return Mod.main.ImGui_Spacing() },
    /** [Auto] */
    Dummy: (size) => { return Mod.main.ImGui_Dummy(size.unwrap()) },
    /** [Auto] */
    Indent: (indent_w = 0.0) => { return Mod.main.ImGui_IndentEx(indent_w) },
    /** [Auto] */
    Unindent: (indent_w = 0.0) => { return Mod.main.ImGui_UnindentEx(indent_w) },
    /** [Auto] */
    BeginGroup: () => { return Mod.main.ImGui_BeginGroup() },
    /** [Auto] */
    EndGroup: () => { return Mod.main.ImGui_EndGroup() },
    /** [Auto] */
    AlignTextToFramePadding: () => { return Mod.main.ImGui_AlignTextToFramePadding() },
    /** [Auto] */
    GetTextLineHeight: () => { return Mod.main.ImGui_GetTextLineHeight() },
    /** [Auto] */
    GetTextLineHeightWithSpacing: () => { return Mod.main.ImGui_GetTextLineHeightWithSpacing() },
    /** [Auto] */
    GetFrameHeight: () => { return Mod.main.ImGui_GetFrameHeight() },
    /** [Auto] */
    GetFrameHeightWithSpacing: () => { return Mod.main.ImGui_GetFrameHeightWithSpacing() },
    /** [Auto] */
    PushID: (str_id) => { return Mod.main.ImGui_PushID(str_id) },
    /** [Auto] */
    PopID: () => { return Mod.main.ImGui_PopID() },
    /** [Auto] */
    GetID: (str_id) => { return Mod.main.ImGui_GetID(str_id) },
    /** [Auto] */
    Button: (label, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_ButtonEx(label, size.unwrap()) },
    /** [Auto] */
    SmallButton: (label) => { return Mod.main.ImGui_SmallButton(label) },
    /** [Auto] */
    InvisibleButton: (str_id, size, flags = 0) => { return Mod.main.ImGui_InvisibleButton(str_id, size.unwrap(), flags) },
    /** [Auto] */
    ArrowButton: (str_id, dir) => { return Mod.main.ImGui_ArrowButton(str_id, dir) },
    /** [Auto] */
    Checkbox: (label, v) => { return Mod.main.ImGui_Checkbox(label, v) },
    /** [Auto] */
    RadioButton: (label, active) => { return Mod.main.ImGui_RadioButton(label, active) },
    /** [Auto] */
    ProgressBar: (fraction, size_arg = new ImVec2(-Number.MIN_VALUE, 0), overlay = null) => { return Mod.main.ImGui_ProgressBar(fraction, size_arg.unwrap(), overlay) },
    /** [Auto] */
    Bullet: () => { return Mod.main.ImGui_Bullet() },
    /** [Auto] */
    TextLink: (label) => { return Mod.main.ImGui_TextLink(label) },
    /** [Auto] */
    TextLinkOpenURL: (label, url = null) => { return Mod.main.ImGui_TextLinkOpenURLEx(label, url) },
    /** [Auto] */
    BeginCombo: (label, preview_value, flags = 0) => { return Mod.main.ImGui_BeginCombo(label, preview_value, flags) },
    /** [Auto] */
    EndCombo: () => { return Mod.main.ImGui_EndCombo() },
    /** [Auto] */
    DragFloat: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloatEx(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragFloat2: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat2Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragFloat3: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat3Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragFloat4: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat4Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragFloatRange2: (label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", format_max = null, flags = 0) => { return Mod.main.ImGui_DragFloatRange2Ex(label, v_current_min, v_current_max, v_speed, v_min, v_max, format, format_max, flags) },
    /** [Auto] */
    DragInt2: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt2Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragInt3: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt3Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragInt4: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt4Ex(label, v, v_speed, v_min, v_max, format, flags) },
    /** [Auto] */
    DragIntRange2: (label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", format_max = null, flags = 0) => { return Mod.main.ImGui_DragIntRange2Ex(label, v_current_min, v_current_max, v_speed, v_min, v_max, format, format_max, flags) },
    /** [Auto] */
    SliderFloat: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloatEx(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderFloat2: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat2Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderFloat3: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat3Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderFloat4: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat4Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderAngle: (label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0, format = "%.0f deg", flags = 0) => { return Mod.main.ImGui_SliderAngleEx(label, v_rad, v_degrees_min, v_degrees_max, format, flags) },
    /** [Auto] */
    SliderInt2: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt2Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderInt3: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt3Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    SliderInt4: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt4Ex(label, v, v_min, v_max, format, flags) },
    /** [Auto] */
    VSliderFloat: (label, size, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_VSliderFloatEx(label, size.unwrap(), v, v_min, v_max, format, flags) },
    /** [Auto] */
    InputFloat: (label, v, step = 0.0, step_fast = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloatEx(label, v, step, step_fast, format, flags) },
    /** [Auto] */
    InputFloat2: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat2Ex(label, v, format, flags) },
    /** [Auto] */
    InputFloat3: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat3Ex(label, v, format, flags) },
    /** [Auto] */
    InputFloat4: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat4Ex(label, v, format, flags) },
    /** [Auto] */
    InputInt2: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt2(label, v, flags) },
    /** [Auto] */
    InputInt3: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt3(label, v, flags) },
    /** [Auto] */
    InputInt4: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt4(label, v, flags) },
    /** [Auto] */
    InputDouble: (label, v, step = 0.0, step_fast = 0.0, format = "%.6f", flags = 0) => { return Mod.main.ImGui_InputDoubleEx(label, v, step, step_fast, format, flags) },
    /** [Auto] */
    ColorEdit3: (label, col, flags = 0) => { return Mod.main.ImGui_ColorEdit3(label, col, flags) },
    /** [Auto] */
    ColorEdit4: (label, col, flags = 0) => { return Mod.main.ImGui_ColorEdit4(label, col, flags) },
    /** [Auto] */
    ColorPicker3: (label, col, flags = 0) => { return Mod.main.ImGui_ColorPicker3(label, col, flags) },
    /** [Auto] */
    ColorPicker4: (label, col, flags = 0, ref_col = null) => { return Mod.main.ImGui_ColorPicker4(label, col, flags, ref_col) },
    /** [Auto] */
    ColorButton: (desc_id, col, flags = 0, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_ColorButtonEx(desc_id, col.unwrap(), flags, size.unwrap()) },
    /** [Auto] */
    SetColorEditOptions: (flags) => { return Mod.main.ImGui_SetColorEditOptions(flags) },
    /** [Auto] */
    TreeNode: (label, flags = 0) => { return Mod.main.ImGui_TreeNodeEx(label, flags) },
    /** [Auto] */
    TreePush: (str_id) => { return Mod.main.ImGui_TreePush(str_id) },
    /** [Auto] */
    TreePop: () => { return Mod.main.ImGui_TreePop() },
    /** [Auto] */
    GetTreeNodeToLabelSpacing: () => { return Mod.main.ImGui_GetTreeNodeToLabelSpacing() },
    /** [Auto] */
    CollapsingHeader: (label, flags = 0) => { return Mod.main.ImGui_CollapsingHeader(label, flags) },
    /** [Auto] */
    SetNextItemOpen: (is_open, cond = 0) => { return Mod.main.ImGui_SetNextItemOpen(is_open, cond) },
    /** [Auto] */
    Selectable: (label, selected = false, flags = 0, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_SelectableEx(label, selected, flags, size.unwrap()) },
    /** [Auto] */
    BeginMultiSelect: (flags, selection_size = -1, items_count = -1) => { return ImGuiMultiSelectIO.wrap(Mod.main.ImGui_BeginMultiSelectEx(flags, selection_size, items_count)) },
    /** [Auto] */
    EndMultiSelect: () => { return ImGuiMultiSelectIO.wrap(Mod.main.ImGui_EndMultiSelect()) },
    /** [Auto] */
    SetNextItemSelectionUserData: (selection_user_data) => { return Mod.main.ImGui_SetNextItemSelectionUserData(selection_user_data) },
    /** [Auto] */
    IsItemToggledSelection: () => { return Mod.main.ImGui_IsItemToggledSelection() },
    /** [Auto] */
    BeginListBox: (label, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_BeginListBox(label, size.unwrap()) },
    /** [Auto] */
    EndListBox: () => { return Mod.main.ImGui_EndListBox() },
    /** [Auto] */
    BeginMenuBar: () => { return Mod.main.ImGui_BeginMenuBar() },
    /** [Auto] */
    EndMenuBar: () => { return Mod.main.ImGui_EndMenuBar() },
    /** [Auto] */
    BeginMainMenuBar: () => { return Mod.main.ImGui_BeginMainMenuBar() },
    /** [Auto] */
    EndMainMenuBar: () => { return Mod.main.ImGui_EndMainMenuBar() },
    /** [Auto] */
    BeginMenu: (label, enabled = true) => { return Mod.main.ImGui_BeginMenuEx(label, enabled) },
    /** [Auto] */
    EndMenu: () => { return Mod.main.ImGui_EndMenu() },
    /** [Auto] */
    MenuItem: (label, shortcut = null, selected = false, enabled = true) => { return Mod.main.ImGui_MenuItemEx(label, shortcut, selected, enabled) },
    /** [Auto] */
    BeginTooltip: () => { return Mod.main.ImGui_BeginTooltip() },
    /** [Auto] */
    EndTooltip: () => { return Mod.main.ImGui_EndTooltip() },
    /** [Auto] */
    BeginItemTooltip: () => { return Mod.main.ImGui_BeginItemTooltip() },
    /** [Auto] */
    BeginPopup: (str_id, flags = 0) => { return Mod.main.ImGui_BeginPopup(str_id, flags) },
    /** [Auto] */
    BeginPopupModal: (name, p_open = null, flags = 0) => { return Mod.main.ImGui_BeginPopupModal(name, p_open, flags) },
    /** [Auto] */
    EndPopup: () => { return Mod.main.ImGui_EndPopup() },
    /** [Auto] */
    OpenPopup: (str_id, popup_flags = 0) => { return Mod.main.ImGui_OpenPopup(str_id, popup_flags) },
    /** [Auto] */
    OpenPopupOnItemClick: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_OpenPopupOnItemClick(str_id, popup_flags) },
    /** [Auto] */
    CloseCurrentPopup: () => { return Mod.main.ImGui_CloseCurrentPopup() },
    /** [Auto] */
    BeginPopupContextItem: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextItemEx(str_id, popup_flags) },
    /** [Auto] */
    BeginPopupContextWindow: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextWindowEx(str_id, popup_flags) },
    /** [Auto] */
    BeginPopupContextVoid: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextVoidEx(str_id, popup_flags) },
    /** [Auto] */
    IsPopupOpen: (str_id, flags = 0) => { return Mod.main.ImGui_IsPopupOpen(str_id, flags) },
    /** [Auto] */
    BeginTable: (str_id, columns, flags = 0, outer_size = new ImVec2(0.0, 0.0), inner_width = 0.0) => { return Mod.main.ImGui_BeginTableEx(str_id, columns, flags, outer_size.unwrap(), inner_width) },
    /** [Auto] */
    EndTable: () => { return Mod.main.ImGui_EndTable() },
    /** [Auto] */
    TableNextRow: (row_flags = 0, min_row_height = 0.0) => { return Mod.main.ImGui_TableNextRowEx(row_flags, min_row_height) },
    /** [Auto] */
    TableNextColumn: () => { return Mod.main.ImGui_TableNextColumn() },
    /** [Auto] */
    TableSetColumnIndex: (column_n) => { return Mod.main.ImGui_TableSetColumnIndex(column_n) },
    /** [Auto] */
    TableSetupColumn: (label, flags = 0, init_width_or_weight = 0.0, user_id = 0) => { return Mod.main.ImGui_TableSetupColumnEx(label, flags, init_width_or_weight, user_id) },
    /** [Auto] */
    TableSetupScrollFreeze: (cols, rows) => { return Mod.main.ImGui_TableSetupScrollFreeze(cols, rows) },
    /** [Auto] */
    TableHeader: (label) => { return Mod.main.ImGui_TableHeader(label) },
    /** [Auto] */
    TableHeadersRow: () => { return Mod.main.ImGui_TableHeadersRow() },
    /** [Auto] */
    TableAngledHeadersRow: () => { return Mod.main.ImGui_TableAngledHeadersRow() },
    /** [Auto] */
    TableGetSortSpecs: () => { return ImGuiTableSortSpecs.wrap(Mod.main.ImGui_TableGetSortSpecs()) },
    /** [Auto] */
    TableGetColumnCount: () => { return Mod.main.ImGui_TableGetColumnCount() },
    /** [Auto] */
    TableGetColumnIndex: () => { return Mod.main.ImGui_TableGetColumnIndex() },
    /** [Auto] */
    TableGetRowIndex: () => { return Mod.main.ImGui_TableGetRowIndex() },
    /** [Auto] */
    TableGetColumnName: (column_n = -1) => { return Mod.main.ImGui_TableGetColumnName(column_n) },
    /** [Auto] */
    TableGetColumnFlags: (column_n = -1) => { return Mod.main.ImGui_TableGetColumnFlags(column_n) },
    /** [Auto] */
    TableSetColumnEnabled: (column_n, v) => { return Mod.main.ImGui_TableSetColumnEnabled(column_n, v) },
    /** [Auto] */
    TableGetHoveredColumn: () => { return Mod.main.ImGui_TableGetHoveredColumn() },
    /** [Auto] */
    TableSetBgColor: (target, color, column_n = -1) => { return Mod.main.ImGui_TableSetBgColor(target, color, column_n) },
    /** [Auto] */
    Columns: (count = 1, id = null, borders = true) => { return Mod.main.ImGui_ColumnsEx(count, id, borders) },
    /** [Auto] */
    NextColumn: () => { return Mod.main.ImGui_NextColumn() },
    /** [Auto] */
    GetColumnIndex: () => { return Mod.main.ImGui_GetColumnIndex() },
    /** [Auto] */
    GetColumnWidth: (column_index = -1) => { return Mod.main.ImGui_GetColumnWidth(column_index) },
    /** [Auto] */
    SetColumnWidth: (column_index, width) => { return Mod.main.ImGui_SetColumnWidth(column_index, width) },
    /** [Auto] */
    GetColumnOffset: (column_index = -1) => { return Mod.main.ImGui_GetColumnOffset(column_index) },
    /** [Auto] */
    SetColumnOffset: (column_index, offset_x) => { return Mod.main.ImGui_SetColumnOffset(column_index, offset_x) },
    /** [Auto] */
    GetColumnsCount: () => { return Mod.main.ImGui_GetColumnsCount() },
    /** [Auto] */
    BeginTabBar: (str_id, flags = 0) => { return Mod.main.ImGui_BeginTabBar(str_id, flags) },
    /** [Auto] */
    EndTabBar: () => { return Mod.main.ImGui_EndTabBar() },
    /** [Auto] */
    BeginTabItem: (label, p_open = null, flags = 0) => { return Mod.main.ImGui_BeginTabItem(label, p_open, flags) },
    /** [Auto] */
    EndTabItem: () => { return Mod.main.ImGui_EndTabItem() },
    /** [Auto] */
    TabItemButton: (label, flags = 0) => { return Mod.main.ImGui_TabItemButton(label, flags) },
    /** [Auto] */
    SetTabItemClosed: (tab_or_docked_window_label) => { return Mod.main.ImGui_SetTabItemClosed(tab_or_docked_window_label) },
    /** [Auto] */
    DockSpace: (dockspace_id, size = new ImVec2(0, 0), flags = 0, window_class = null) => { return Mod.main.ImGui_DockSpaceEx(dockspace_id, size.unwrap(), flags, window_class) },
    /** [Auto] */
    DockSpaceOverViewport: (dockspace_id = 0, viewport = null, flags = 0, window_class = null) => { return Mod.main.ImGui_DockSpaceOverViewportEx(dockspace_id, viewport, flags, window_class) },
    /** [Auto] */
    SetNextWindowClass: (window_class) => { return Mod.main.ImGui_SetNextWindowClass(window_class) },
    /** [Auto] */
    IsWindowDocked: () => { return Mod.main.ImGui_IsWindowDocked() },
    /** [Auto] */
    BeginDisabled: (disabled = true) => { return Mod.main.ImGui_BeginDisabled(disabled) },
    /** [Auto] */
    EndDisabled: () => { return Mod.main.ImGui_EndDisabled() },
    /** [Auto] */
    PushClipRect: (clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) => { return Mod.main.ImGui_PushClipRect(clip_rect_min.unwrap(), clip_rect_max.unwrap(), intersect_with_current_clip_rect) },
    /** [Auto] */
    PopClipRect: () => { return Mod.main.ImGui_PopClipRect() },
    /** [Auto] */
    SetItemDefaultFocus: () => { return Mod.main.ImGui_SetItemDefaultFocus() },
    /** [Auto] */
    SetKeyboardFocusHere: (offset = 0) => { return Mod.main.ImGui_SetKeyboardFocusHereEx(offset) },
    /** [Auto] */
    SetNavCursorVisible: (visible) => { return Mod.main.ImGui_SetNavCursorVisible(visible) },
    /** [Auto] */
    SetNextItemAllowOverlap: () => { return Mod.main.ImGui_SetNextItemAllowOverlap() },
    /** [Auto] */
    IsItemHovered: (flags = 0) => { return Mod.main.ImGui_IsItemHovered(flags) },
    /** [Auto] */
    IsItemActive: () => { return Mod.main.ImGui_IsItemActive() },
    /** [Auto] */
    IsItemFocused: () => { return Mod.main.ImGui_IsItemFocused() },
    /** [Auto] */
    IsItemClicked: (mouse_button = 0) => { return Mod.main.ImGui_IsItemClickedEx(mouse_button) },
    /** [Auto] */
    IsItemVisible: () => { return Mod.main.ImGui_IsItemVisible() },
    /** [Auto] */
    IsItemEdited: () => { return Mod.main.ImGui_IsItemEdited() },
    /** [Auto] */
    IsItemActivated: () => { return Mod.main.ImGui_IsItemActivated() },
    /** [Auto] */
    IsItemDeactivated: () => { return Mod.main.ImGui_IsItemDeactivated() },
    /** [Auto] */
    IsItemDeactivatedAfterEdit: () => { return Mod.main.ImGui_IsItemDeactivatedAfterEdit() },
    /** [Auto] */
    IsItemToggledOpen: () => { return Mod.main.ImGui_IsItemToggledOpen() },
    /** [Auto] */
    IsAnyItemHovered: () => { return Mod.main.ImGui_IsAnyItemHovered() },
    /** [Auto] */
    IsAnyItemActive: () => { return Mod.main.ImGui_IsAnyItemActive() },
    /** [Auto] */
    IsAnyItemFocused: () => { return Mod.main.ImGui_IsAnyItemFocused() },
    /** [Auto] */
    GetItemRectMin: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectMin()) },
    /** [Auto] */
    GetItemRectMax: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectMax()) },
    /** [Auto] */
    GetItemRectSize: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectSize()) },
    /** [Auto] */
    GetMainViewport: () => { return ImGuiViewport.wrap(Mod.main.ImGui_GetMainViewport()) },
    /** [Auto] */
    GetBackgroundDrawList: (viewport = null) => { return ImDrawList.wrap(Mod.main.ImGui_GetBackgroundDrawListEx(viewport)) },
    /** [Auto] */
    GetForegroundDrawList: (viewport = null) => { return ImDrawList.wrap(Mod.main.ImGui_GetForegroundDrawListEx(viewport)) },
    /** [Auto] */
    IsRectVisibleBySize: (size) => { return Mod.main.ImGui_IsRectVisibleBySize(size.unwrap()) },
    /** [Auto] */
    IsRectVisible: (rect_min, rect_max) => { return Mod.main.ImGui_IsRectVisible(rect_min.unwrap(), rect_max.unwrap()) },
    /** [Auto] */
    GetTime: () => { return Mod.main.ImGui_GetTime() },
    /** [Auto] */
    GetFrameCount: () => { return Mod.main.ImGui_GetFrameCount() },
    /** [Auto] */
    GetDrawListSharedData: () => { return ImDrawListSharedData.wrap(Mod.main.ImGui_GetDrawListSharedData()) },
    /** [Auto] */
    GetStyleColorName: (idx) => { return Mod.main.ImGui_GetStyleColorName(idx) },
    /** [Auto] */
    SetStateStorage: (storage) => { return Mod.main.ImGui_SetStateStorage(storage) },
    /** [Auto] */
    GetStateStorage: () => { return ImGuiStorage.wrap(Mod.main.ImGui_GetStateStorage()) },
    /** [Auto] */
    CalcTextSize: (text, text_end = null, hide_text_after_double_hash = false, wrap_width = -1.0) => { return ImVec2.wrap(Mod.main.ImGui_CalcTextSizeEx(text, text_end, hide_text_after_double_hash, wrap_width)) },
    /** [Auto] */
    IsKeyDown: (key) => { return Mod.main.ImGui_IsKeyDown(key) },
    /** [Auto] */
    IsKeyPressed: (key, repeat = true) => { return Mod.main.ImGui_IsKeyPressedEx(key, repeat) },
    /** [Auto] */
    IsKeyReleased: (key) => { return Mod.main.ImGui_IsKeyReleased(key) },
    /** [Auto] */
    IsKeyChordPressed: (key_chord) => { return Mod.main.ImGui_IsKeyChordPressed(key_chord) },
    /** [Auto] */
    GetKeyPressedAmount: (key, repeat_delay, rate) => { return Mod.main.ImGui_GetKeyPressedAmount(key, repeat_delay, rate) },
    /** [Auto] */
    GetKeyName: (key) => { return Mod.main.ImGui_GetKeyName(key) },
    /** [Auto] */
    SetNextFrameWantCaptureKeyboard: (want_capture_keyboard) => { return Mod.main.ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard) },
    /** [Auto] */
    Shortcut: (key_chord, flags = 0) => { return Mod.main.ImGui_Shortcut(key_chord, flags) },
    /** [Auto] */
    SetNextItemShortcut: (key_chord, flags = 0) => { return Mod.main.ImGui_SetNextItemShortcut(key_chord, flags) },
    /** [Auto] */
    SetItemKeyOwner: (key) => { return Mod.main.ImGui_SetItemKeyOwner(key) },
    /** [Auto] */
    IsMouseDown: (button) => { return Mod.main.ImGui_IsMouseDown(button) },
    /** [Auto] */
    IsMouseClicked: (button, repeat = false) => { return Mod.main.ImGui_IsMouseClickedEx(button, repeat) },
    /** [Auto] */
    IsMouseReleased: (button) => { return Mod.main.ImGui_IsMouseReleased(button) },
    /** [Auto] */
    IsMouseDoubleClicked: (button) => { return Mod.main.ImGui_IsMouseDoubleClicked(button) },
    /** [Auto] */
    GetMouseClickedCount: (button) => { return Mod.main.ImGui_GetMouseClickedCount(button) },
    /** [Auto] */
    IsMouseHoveringRect: (r_min, r_max, clip = true) => { return Mod.main.ImGui_IsMouseHoveringRectEx(r_min.unwrap(), r_max.unwrap(), clip) },
    /** [Auto] */
    IsMousePosValid: (mouse_pos = null) => { return Mod.main.ImGui_IsMousePosValid(mouse_pos.unwrap()) },
    /** [Auto] */
    IsAnyMouseDown: () => { return Mod.main.ImGui_IsAnyMouseDown() },
    /** [Auto] */
    GetMousePos: () => { return ImVec2.wrap(Mod.main.ImGui_GetMousePos()) },
    /** [Auto] */
    GetMousePosOnOpeningCurrentPopup: () => { return ImVec2.wrap(Mod.main.ImGui_GetMousePosOnOpeningCurrentPopup()) },
    /** [Auto] */
    IsMouseDragging: (button, lock_threshold = -1.0) => { return Mod.main.ImGui_IsMouseDragging(button, lock_threshold) },
    /** [Auto] */
    GetMouseDragDelta: (button = 0, lock_threshold = -1.0) => { return ImVec2.wrap(Mod.main.ImGui_GetMouseDragDelta(button, lock_threshold)) },
    /** [Auto] */
    ResetMouseDragDelta: (button = 0) => { return Mod.main.ImGui_ResetMouseDragDeltaEx(button) },
    /** [Auto] */
    GetMouseCursor: () => { return Mod.main.ImGui_GetMouseCursor() },
    /** [Auto] */
    SetMouseCursor: (cursor_type) => { return Mod.main.ImGui_SetMouseCursor(cursor_type) },
    /** [Auto] */
    SetNextFrameWantCaptureMouse: (want_capture_mouse) => { return Mod.main.ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse) },

};

/* -------------------------------------------------------------------------- */
/* 5. Enums */
/* -------------------------------------------------------------------------- */

/**
 * Namespace that provides access to the Enums.
 * @namespace {ImEnum}
 */
export const ImEnum = {
    /** [Auto] */
    WindowFlags: {
        None: 0,
        NoTitleBar: 1,
        NoResize: 2,
        NoMove: 4,
        NoScrollbar: 8,
        NoScrollWithMouse: 16,
        NoCollapse: 32,
        AlwaysAutoResize: 64,
        NoBackground: 128,
        NoSavedSettings: 256,
        NoMouseInputs: 512,
        MenuBar: 1024,
        HorizontalScrollbar: 2048,
        NoFocusOnAppearing: 4096,
        NoBringToFrontOnFocus: 8192,
        AlwaysVerticalScrollbar: 16384,
        AlwaysHorizontalScrollbar: 32768,
        NoNavInputs: 65536,
        NoNavFocus: 131072,
        UnsavedDocument: 262144,
        NoDocking: 524288,
        NoNav: 196608,
        NoDecoration: 43,
        NoInputs: 197120
    },
    /** [Auto] */
    ChildFlags: {
        None: 0,
        Borders: 1,
        AlwaysUseWindowPadding: 2,
        ResizeX: 4,
        ResizeY: 8,
        AutoResizeX: 16,
        AutoResizeY: 32,
        AlwaysAutoResize: 64,
        FrameStyle: 128,
        NavFlattened: 256
    },
    /** [Auto] */
    ItemFlags: {
        None: 0,
        NoTabStop: 1,
        NoNav: 2,
        NoNavDefaultFocus: 4,
        ButtonRepeat: 8,
        AutoClosePopups: 16,
        AllowDuplicateId: 32
    },
    /** [Auto] */
    InputTextFlags: {
        None: 0,
        CharsDecimal: 1,
        CharsHexadecimal: 2,
        CharsScientific: 4,
        CharsUppercase: 8,
        CharsNoBlank: 16,
        AllowTabInput: 32,
        EnterReturnsTrue: 64,
        EscapeClearsAll: 128,
        CtrlEnterForNewLine: 256,
        ReadOnly: 512,
        Password: 1024,
        AlwaysOverwrite: 2048,
        AutoSelectAll: 4096,
        ParseEmptyRefVal: 8192,
        DisplayEmptyRefVal: 16384,
        NoHorizontalScroll: 32768,
        NoUndoRedo: 65536,
        ElideLeft: 131072,
        CallbackCompletion: 262144,
        CallbackHistory: 524288,
        CallbackAlways: 1048576,
        CallbackCharFilter: 2097152,
        CallbackResize: 4194304,
        CallbackEdit: 8388608
    },
    /** [Auto] */
    TreeNodeFlags: {
        None: 0,
        Selected: 1,
        Framed: 2,
        AllowOverlap: 4,
        NoTreePushOnOpen: 8,
        NoAutoOpenOnLog: 16,
        DefaultOpen: 32,
        OpenOnDoubleClick: 64,
        OpenOnArrow: 128,
        Leaf: 256,
        Bullet: 512,
        FramePadding: 1024,
        SpanAvailWidth: 2048,
        SpanFullWidth: 4096,
        SpanLabelWidth: 8192,
        SpanAllColumns: 16384,
        LabelSpanAllColumns: 32768,
        NavLeftJumpsBackHere: 131072,
        CollapsingHeader: 26
    },
    /** [Auto] */
    PopupFlags: {
        None: 0,
        MouseButtonLeft: 0,
        MouseButtonRight: 1,
        MouseButtonMiddle: 2,
        NoReopen: 32,
        NoOpenOverExistingPopup: 128,
        NoOpenOverItems: 256,
        AnyPopupId: 1024,
        AnyPopupLevel: 2048,
        AnyPopup: 3072
    },
    /** [Auto] */
    SelectableFlags: {
        None: 0,
        NoAutoClosePopups: 1,
        SpanAllColumns: 2,
        AllowDoubleClick: 4,
        Disabled: 8,
        AllowOverlap: 16,
        Highlight: 32
    },
    /** [Auto] */
    ComboFlags: {
        None: 0,
        PopupAlignLeft: 1,
        HeightSmall: 2,
        HeightRegular: 4,
        HeightLarge: 8,
        HeightLargest: 16,
        NoArrowButton: 32,
        NoPreview: 64,
        WidthFitPreview: 128
    },
    /** [Auto] */
    TabBarFlags: {
        None: 0,
        Reorderable: 1,
        AutoSelectNewTabs: 2,
        TabListPopupButton: 4,
        NoCloseWithMiddleMouseButton: 8,
        NoTabListScrollingButtons: 16,
        NoTooltip: 32,
        DrawSelectedOverline: 64,
        FittingPolicyResizeDown: 128,
        FittingPolicyScroll: 256
    },
    /** [Auto] */
    TabItemFlags: {
        None: 0,
        UnsavedDocument: 1,
        SetSelected: 2,
        NoCloseWithMiddleMouseButton: 4,
        NoPushId: 8,
        NoTooltip: 16,
        NoReorder: 32,
        Leading: 64,
        Trailing: 128,
        NoAssumedClosure: 256
    },
    /** [Auto] */
    FocusedFlags: {
        None: 0,
        ChildWindows: 1,
        RootWindow: 2,
        AnyWindow: 4,
        NoPopupHierarchy: 8,
        DockHierarchy: 16,
        RootAndChildWindows: 3
    },
    /** [Auto] */
    HoveredFlags: {
        None: 0,
        ChildWindows: 1,
        RootWindow: 2,
        AnyWindow: 4,
        NoPopupHierarchy: 8,
        DockHierarchy: 16,
        AllowWhenBlockedByPopup: 32,
        AllowWhenBlockedByActiveItem: 128,
        AllowWhenOverlappedByItem: 256,
        AllowWhenOverlappedByWindow: 512,
        AllowWhenDisabled: 1024,
        NoNavOverride: 2048,
        AllowWhenOverlapped: 768,
        RectOnly: 928,
        RootAndChildWindows: 3,
        ForTooltip: 4096,
        Stationary: 8192,
        DelayNone: 16384,
        DelayShort: 32768,
        DelayNormal: 65536,
        NoSharedDelay: 131072
    },
    /** [Auto] */
    DockNodeFlags: {
        None: 0,
        KeepAliveOnly: 1,
        NoDockingOverCentralNode: 4,
        PassthruCentralNode: 8,
        NoDockingSplit: 16,
        NoResize: 32,
        AutoHideTabBar: 64,
        NoUndocking: 128
    },
    /** [Auto] */
    DragDropFlags: {
        None: 0,
        SourceNoPreviewTooltip: 1,
        SourceNoDisableHover: 2,
        SourceNoHoldToOpenOthers: 4,
        SourceAllowNullID: 8,
        SourceExtern: 16,
        PayloadAutoExpire: 32,
        PayloadNoCrossContext: 64,
        PayloadNoCrossProcess: 128,
        AcceptBeforeDelivery: 1024,
        AcceptNoDrawDefaultRect: 2048,
        AcceptNoPreviewTooltip: 4096,
        AcceptPeekOnly: 3072
    },
    /** [Auto] */
    DataType: {
        S8: 0,
        U8: 1,
        S16: 2,
        U16: 3,
        S32: 4,
        U32: 5,
        S64: 6,
        U64: 7,
        Float: 8,
        Double: 9,
        Bool: 10,
        String: 11,
        COUNT: 12
    },
    /** [Auto] */
    Dir: {
        _None: -1,
        _Left: 0,
        _Right: 1,
        _Up: 2,
        _Down: 3,
        _COUNT: 4
    },
    /** [Auto] */
    SortDirection: {
        _None: 0,
        _Ascending: 1,
        _Descending: 2
    },
    /** [Auto] */
    Key: {
        _None: 0,
        _NamedKey_BEGIN: 512,
        _Tab: 512,
        _LeftArrow: 513,
        _RightArrow: 514,
        _UpArrow: 515,
        _DownArrow: 516,
        _PageUp: 517,
        _PageDown: 518,
        _Home: 519,
        _End: 520,
        _Insert: 521,
        _Delete: 522,
        _Backspace: 523,
        _Space: 524,
        _Enter: 525,
        _Escape: 526,
        _LeftCtrl: 527,
        _LeftShift: 528,
        _LeftAlt: 529,
        _LeftSuper: 530,
        _RightCtrl: 531,
        _RightShift: 532,
        _RightAlt: 533,
        _RightSuper: 534,
        _Menu: 535,
        _0: 536,
        _1: 537,
        _2: 538,
        _3: 539,
        _4: 540,
        _5: 541,
        _6: 542,
        _7: 543,
        _8: 544,
        _9: 545,
        _A: 546,
        _B: 547,
        _C: 548,
        _D: 549,
        _E: 550,
        _F: 551,
        _G: 552,
        _H: 553,
        _I: 554,
        _J: 555,
        _K: 556,
        _L: 557,
        _M: 558,
        _N: 559,
        _O: 560,
        _P: 561,
        _Q: 562,
        _R: 563,
        _S: 564,
        _T: 565,
        _U: 566,
        _V: 567,
        _W: 568,
        _X: 569,
        _Y: 570,
        _Z: 571,
        _F1: 572,
        _F2: 573,
        _F3: 574,
        _F4: 575,
        _F5: 576,
        _F6: 577,
        _F7: 578,
        _F8: 579,
        _F9: 580,
        _F10: 581,
        _F11: 582,
        _F12: 583,
        _F13: 584,
        _F14: 585,
        _F15: 586,
        _F16: 587,
        _F17: 588,
        _F18: 589,
        _F19: 590,
        _F20: 591,
        _F21: 592,
        _F22: 593,
        _F23: 594,
        _F24: 595,
        _Apostrophe: 596,
        _Comma: 597,
        _Minus: 598,
        _Period: 599,
        _Slash: 600,
        _Semicolon: 601,
        _Equal: 602,
        _LeftBracket: 603,
        _Backslash: 604,
        _RightBracket: 605,
        _GraveAccent: 606,
        _CapsLock: 607,
        _ScrollLock: 608,
        _NumLock: 609,
        _PrintScreen: 610,
        _Pause: 611,
        _Keypad0: 612,
        _Keypad1: 613,
        _Keypad2: 614,
        _Keypad3: 615,
        _Keypad4: 616,
        _Keypad5: 617,
        _Keypad6: 618,
        _Keypad7: 619,
        _Keypad8: 620,
        _Keypad9: 621,
        _KeypadDecimal: 622,
        _KeypadDivide: 623,
        _KeypadMultiply: 624,
        _KeypadSubtract: 625,
        _KeypadAdd: 626,
        _KeypadEnter: 627,
        _KeypadEqual: 628,
        _AppBack: 629,
        _AppForward: 630,
        _GamepadStart: 631,
        _GamepadBack: 632,
        _GamepadFaceLeft: 633,
        _GamepadFaceRight: 634,
        _GamepadFaceUp: 635,
        _GamepadFaceDown: 636,
        _GamepadDpadLeft: 637,
        _GamepadDpadRight: 638,
        _GamepadDpadUp: 639,
        _GamepadDpadDown: 640,
        _GamepadL1: 641,
        _GamepadR1: 642,
        _GamepadL2: 643,
        _GamepadR2: 644,
        _GamepadL3: 645,
        _GamepadR3: 646,
        _GamepadLStickLeft: 647,
        _GamepadLStickRight: 648,
        _GamepadLStickUp: 649,
        _GamepadLStickDown: 650,
        _GamepadRStickLeft: 651,
        _GamepadRStickRight: 652,
        _GamepadRStickUp: 653,
        _GamepadRStickDown: 654,
        _MouseLeft: 655,
        _MouseRight: 656,
        _MouseMiddle: 657,
        _MouseX1: 658,
        _MouseX2: 659,
        _MouseWheelX: 660,
        _MouseWheelY: 661,
        ImGuiMod_None: 0,
        ImGuiMod_Ctrl: 4096,
        ImGuiMod_Shift: 8192,
        ImGuiMod_Alt: 16384,
        ImGuiMod_Super: 32768
    },
    /** [Auto] */
    InputFlags: {
        None: 0,
        Repeat: 1,
        RouteActive: 1024,
        RouteFocused: 2048,
        RouteGlobal: 4096,
        RouteAlways: 8192,
        RouteOverFocused: 16384,
        RouteOverActive: 32768,
        RouteUnlessBgFocused: 65536,
        RouteFromRootWindow: 131072,
        Tooltip: 262144
    },
    /** [Auto] */
    ConfigFlags: {
        None: 0,
        NavEnableKeyboard: 1,
        NavEnableGamepad: 2,
        NoMouse: 16,
        NoMouseCursorChange: 32,
        NoKeyboard: 64,
        DockingEnable: 128,
        ViewportsEnable: 1024,
        DpiEnableScaleViewports: 16384,
        DpiEnableScaleFonts: 32768,
        IsSRGB: 1048576,
        IsTouchScreen: 2097152
    },
    /** [Auto] */
    BackendFlags: {
        None: 0,
        HasGamepad: 1,
        HasMouseCursors: 2,
        HasSetMousePos: 4,
        RendererHasVtxOffset: 8,
        PlatformHasViewports: 1024,
        HasMouseHoveredViewport: 2048,
        RendererHasViewports: 4096
    },
    /** [Auto] */
    Col: {
        Text: 0,
        TextDisabled: 1,
        WindowBg: 2,
        ChildBg: 3,
        PopupBg: 4,
        Border: 5,
        BorderShadow: 6,
        FrameBg: 7,
        FrameBgHovered: 8,
        FrameBgActive: 9,
        TitleBg: 10,
        TitleBgActive: 11,
        TitleBgCollapsed: 12,
        MenuBarBg: 13,
        ScrollbarBg: 14,
        ScrollbarGrab: 15,
        ScrollbarGrabHovered: 16,
        ScrollbarGrabActive: 17,
        CheckMark: 18,
        SliderGrab: 19,
        SliderGrabActive: 20,
        Button: 21,
        ButtonHovered: 22,
        ButtonActive: 23,
        Header: 24,
        HeaderHovered: 25,
        HeaderActive: 26,
        Separator: 27,
        SeparatorHovered: 28,
        SeparatorActive: 29,
        ResizeGrip: 30,
        ResizeGripHovered: 31,
        ResizeGripActive: 32,
        TabHovered: 33,
        Tab: 34,
        TabSelected: 35,
        TabSelectedOverline: 36,
        TabDimmed: 37,
        TabDimmedSelected: 38,
        TabDimmedSelectedOverline: 39,
        DockingPreview: 40,
        DockingEmptyBg: 41,
        PlotLines: 42,
        PlotLinesHovered: 43,
        PlotHistogram: 44,
        PlotHistogramHovered: 45,
        TableHeaderBg: 46,
        TableBorderStrong: 47,
        TableBorderLight: 48,
        TableRowBg: 49,
        TableRowBgAlt: 50,
        TextLink: 51,
        TextSelectedBg: 52,
        DragDropTarget: 53,
        NavCursor: 54,
        NavWindowingHighlight: 55,
        NavWindowingDimBg: 56,
        ModalWindowDimBg: 57,
        COUNT: 58
    },
    /** [Auto] */
    StyleVar: {
        Alpha: 0,
        DisabledAlpha: 1,
        WindowPadding: 2,
        WindowRounding: 3,
        WindowBorderSize: 4,
        WindowMinSize: 5,
        WindowTitleAlign: 6,
        ChildRounding: 7,
        ChildBorderSize: 8,
        PopupRounding: 9,
        PopupBorderSize: 10,
        FramePadding: 11,
        FrameRounding: 12,
        FrameBorderSize: 13,
        ItemSpacing: 14,
        ItemInnerSpacing: 15,
        IndentSpacing: 16,
        CellPadding: 17,
        ScrollbarSize: 18,
        ScrollbarRounding: 19,
        GrabMinSize: 20,
        GrabRounding: 21,
        TabRounding: 22,
        TabBorderSize: 23,
        TabBarBorderSize: 24,
        TabBarOverlineSize: 25,
        TableAngledHeadersAngle: 26,
        TableAngledHeadersTextAlign: 27,
        ButtonTextAlign: 28,
        SelectableTextAlign: 29,
        SeparatorTextBorderSize: 30,
        SeparatorTextAlign: 31,
        SeparatorTextPadding: 32,
        DockingSeparatorSize: 33,
        COUNT: 34
    },
    /** [Auto] */
    ButtonFlags: {
        None: 0,
        MouseButtonLeft: 1,
        MouseButtonRight: 2,
        MouseButtonMiddle: 4,
        EnableNav: 8
    },
    /** [Auto] */
    ColorEditFlags: {
        None: 0,
        NoAlpha: 2,
        NoPicker: 4,
        NoOptions: 8,
        NoSmallPreview: 16,
        NoInputs: 32,
        NoTooltip: 64,
        NoLabel: 128,
        NoSidePreview: 256,
        NoDragDrop: 512,
        NoBorder: 1024,
        AlphaBar: 65536,
        AlphaPreview: 131072,
        AlphaPreviewHalf: 262144,
        HDR: 524288,
        DisplayRGB: 1048576,
        DisplayHSV: 2097152,
        DisplayHex: 4194304,
        Uint8: 8388608,
        Float: 16777216,
        PickerHueBar: 33554432,
        PickerHueWheel: 67108864,
        InputRGB: 134217728,
        InputHSV: 268435456
    },
    /** [Auto] */
    SliderFlags: {
        None: 0,
        Logarithmic: 32,
        NoRoundToFormat: 64,
        NoInput: 128,
        WrapAround: 256,
        ClampOnInput: 512,
        ClampZeroRange: 1024,
        NoSpeedTweaks: 2048,
        AlwaysClamp: 1536
    },
    /** [Auto] */
    MouseButton: {
        Left: 0,
        Right: 1,
        Middle: 2,
        COUNT: 5
    },
    /** [Auto] */
    MouseCursor: {
        None: -1,
        Arrow: 0,
        TextInput: 1,
        ResizeAll: 2,
        ResizeNS: 3,
        ResizeEW: 4,
        ResizeNESW: 5,
        ResizeNWSE: 6,
        Hand: 7,
        NotAllowed: 8,
        COUNT: 9
    },
    /** [Auto] */
    MouseSource: {
        _Mouse: 0,
        _TouchScreen: 1,
        _Pen: 2,
        _COUNT: 3
    },
    /** [Auto] */
    Cond: {
        None: 0,
        Always: 1,
        Once: 2,
        FirstUseEver: 4,
        Appearing: 8
    },
    /** [Auto] */
    TableFlags: {
        None: 0,
        Resizable: 1,
        Reorderable: 2,
        Hideable: 4,
        Sortable: 8,
        NoSavedSettings: 16,
        ContextMenuInBody: 32,
        RowBg: 64,
        BordersInnerH: 128,
        BordersOuterH: 256,
        BordersInnerV: 512,
        BordersOuterV: 1024,
        BordersH: 384,
        BordersV: 1536,
        BordersInner: 640,
        BordersOuter: 1280,
        Borders: 1920,
        NoBordersInBody: 2048,
        NoBordersInBodyUntilResize: 4096,
        SizingFixedFit: 8192,
        SizingFixedSame: 16384,
        SizingStretchProp: 24576,
        SizingStretchSame: 32768,
        NoHostExtendX: 65536,
        NoHostExtendY: 131072,
        NoKeepColumnsVisible: 262144,
        PreciseWidths: 524288,
        NoClip: 1048576,
        PadOuterX: 2097152,
        NoPadOuterX: 4194304,
        NoPadInnerX: 8388608,
        ScrollX: 16777216,
        ScrollY: 33554432,
        SortMulti: 67108864,
        SortTristate: 134217728,
        HighlightHoveredColumn: 268435456
    },
    /** [Auto] */
    TableColumnFlags: {
        None: 0,
        Disabled: 1,
        DefaultHide: 2,
        DefaultSort: 4,
        WidthStretch: 8,
        WidthFixed: 16,
        NoResize: 32,
        NoReorder: 64,
        NoHide: 128,
        NoClip: 256,
        NoSort: 512,
        NoSortAscending: 1024,
        NoSortDescending: 2048,
        NoHeaderLabel: 4096,
        NoHeaderWidth: 8192,
        PreferSortAscending: 16384,
        PreferSortDescending: 32768,
        IndentEnable: 65536,
        IndentDisable: 131072,
        AngledHeader: 262144,
        IsEnabled: 16777216,
        IsVisible: 33554432,
        IsSorted: 67108864,
        IsHovered: 134217728
    },
    /** [Auto] */
    TableRowFlags: {
        None: 0,
        Headers: 1
    },
    /** [Auto] */
    TableBgTarget: {
        None: 0,
        RowBg0: 1,
        RowBg1: 2,
        CellBg: 3
    },
    /** [Auto] */
    MultiSelectFlags: {
        None: 0,
        SingleSelect: 1,
        NoSelectAll: 2,
        NoRangeSelect: 4,
        NoAutoSelect: 8,
        NoAutoClear: 16,
        NoAutoClearOnReselect: 32,
        BoxSelect1d: 64,
        BoxSelect2d: 128,
        BoxSelectNoScroll: 256,
        ClearOnEscape: 512,
        ClearOnClickVoid: 1024,
        ScopeWindow: 2048,
        ScopeRect: 4096,
        SelectOnClick: 8192,
        SelectOnClickRelease: 16384,
        NavWrapX: 65536
    },
    /** [Auto] */
    SelectionRequestType: {
        _None: 0,
        _SetAll: 1,
        _SetRange: 2
    },
    /** [Auto] */
    ImDrawFlags: {
        None: 0,
        Closed: 1,
        RoundCornersTopLeft: 16,
        RoundCornersTopRight: 32,
        RoundCornersBottomLeft: 64,
        RoundCornersBottomRight: 128,
        RoundCornersNone: 256,
        RoundCornersTop: 48,
        RoundCornersBottom: 192,
        RoundCornersLeft: 80,
        RoundCornersRight: 160,
        RoundCornersAll: 240
    },
    /** [Auto] */
    ImDrawListFlags: {
        None: 0,
        AntiAliasedLines: 1,
        AntiAliasedLinesUseTex: 2,
        AntiAliasedFill: 4,
        AllowVtxOffset: 8
    },
    /** [Auto] */
    ImFontAtlasFlags: {
        None: 0,
        NoPowerOfTwoHeight: 1,
        NoMouseCursors: 2,
        NoBakedLines: 4
    },
    /** [Auto] */
    ViewportFlags: {
        None: 0,
        IsPlatformWindow: 1,
        IsPlatformMonitor: 2,
        OwnedByApp: 4,
        NoDecoration: 8,
        NoTaskBarIcon: 16,
        NoFocusOnAppearing: 32,
        NoFocusOnClick: 64,
        NoInputs: 128,
        NoRendererClear: 256,
        NoAutoMerge: 512,
        TopMost: 1024,
        CanHostOtherWindows: 2048,
        IsMinimized: 4096,
        IsFocused: 8192
    },

};

/* -------------------------------------------------------------------------- */
/* 6. Web Implementation */
/* -------------------------------------------------------------------------- */

/**
 * Namespace for the Web implementation of jsimgui.
 * @namespace {ImGuiImplWeb}
 */
export const ImGuiImplWeb = {
    /**
     * Initializes the ImGuiImplWeb module.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    Init: async (canvas) => {
        await Mod.initMain();

        const context = canvas.getContext("webgl2") || canvas.getContext("webgpu");

        if (!context) {
            throw new Error("Failed to get WebGL2 or WebGPU context.");
        }

        ImGui.CreateContext(null);
        ImGuiImplWeb.SetupIO(canvas);

        if (context instanceof WebGL2RenderingContext) {
            const handle = Mod.main.GL.registerContext(context, context.getContextAttributes());
            Mod.main.GL.makeContextCurrent(handle);

            ImGuiImplOpenGL3.Init();
        }
    },

    BeginRender: () => {
        ImGuiImplOpenGL3.NewFrame();
        ImGui.NewFrame();
    },

    EndRender: () => {
        ImGui.Render();
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    },

    /**
     * Sets up the IO for the canvas.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    SetupIO: (canvas) => {
        canvas.tabIndex = 1;

        // Prevent right click context menu.
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        const io = ImGui.GetIO();
        io.BackendFlags = ImEnum.BackendFlags.HasMouseCursors;

        const updateCanvasSize = () => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            const dpr = globalThis.devicePixelRatio || 1;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        };
        updateCanvasSize();

        globalThis.addEventListener("resize", updateCanvasSize);

        const keyMap = {
            "Tab": ImEnum.Key._Tab,
            "ArrowLeft": ImEnum.Key._LeftArrow,
            "ArrowRight": ImEnum.Key._RightArrow,
            "ArrowUp": ImEnum.Key._UpArrow,
            "ArrowDown": ImEnum.Key._DownArrow,
            "PageUp": ImEnum.Key._PageUp,
            "PageDown": ImEnum.Key._PageDown,
            "Home": ImEnum.Key._Home,
            "End": ImEnum.Key._End,
            "Insert": ImEnum.Key._Insert,
            "Delete": ImEnum.Key._Delete,
            "Backspace": ImEnum.Key._Backspace,
            "Space": ImEnum.Key._Space,
            "Enter": ImEnum.Key._Enter,
            "Escape": ImEnum.Key._Escape,

            "Control": ImEnum.Key._LeftCtrl,
            "Shift": ImEnum.Key._LeftShift,
            "Alt": ImEnum.Key._LeftAlt,
            "Super": ImEnum.Key._LeftSuper,

            "0": ImEnum.Key._0,
            "1": ImEnum.Key._1,
            "2": ImEnum.Key._2,
            "3": ImEnum.Key._3,
            "4": ImEnum.Key._4,
            "5": ImEnum.Key._5,
            "6": ImEnum.Key._6,
            "7": ImEnum.Key._7,
            "8": ImEnum.Key._8,
            "9": ImEnum.Key._9,

            "A": ImEnum.Key._A,
            "a": ImEnum.Key._A,
            "B": ImEnum.Key._B,
            "b": ImEnum.Key._B,
            "C": ImEnum.Key._C,
            "c": ImEnum.Key._C,
            "D": ImEnum.Key._D,
            "d": ImEnum.Key._D,
            "E": ImEnum.Key._E,
            "e": ImEnum.Key._E,
            "F": ImEnum.Key._F,
            "f": ImEnum.Key._F,
            "G": ImEnum.Key._G,
            "g": ImEnum.Key._G,
            "H": ImEnum.Key._H,
            "h": ImEnum.Key._H,
            "I": ImEnum.Key._I,
            "i": ImEnum.Key._I,
            "J": ImEnum.Key._J,
            "j": ImEnum.Key._J,
            "K": ImEnum.Key._K,
            "k": ImEnum.Key._K,
            "L": ImEnum.Key._L,
            "l": ImEnum.Key._L,
            "M": ImEnum.Key._M,
            "m": ImEnum.Key._M,
            "N": ImEnum.Key._N,
            "n": ImEnum.Key._N,
            "O": ImEnum.Key._O,
            "o": ImEnum.Key._O,
            "P": ImEnum.Key._P,
            "p": ImEnum.Key._P,
            "Q": ImEnum.Key._Q,
            "q": ImEnum.Key._Q,
            "R": ImEnum.Key._R,
            "r": ImEnum.Key._R,
            "S": ImEnum.Key._S,
            "s": ImEnum.Key._S,
            "T": ImEnum.Key._T,
            "t": ImEnum.Key._T,
            "U": ImEnum.Key._U,
            "u": ImEnum.Key._U,
            "V": ImEnum.Key._V,
            "v": ImEnum.Key._V,
            "W": ImEnum.Key._W,
            "w": ImEnum.Key._W,
            "X": ImEnum.Key._X,
            "x": ImEnum.Key._X,
            "Y": ImEnum.Key._Y,
            "y": ImEnum.Key._Y,
            "Z": ImEnum.Key._Z,
            "z": ImEnum.Key._Z,
        };

        canvas.addEventListener("keydown", (event) => {
            io.AddKeyEvent(keyMap[event.key], true);

            if (event.key.length === 1) {
                io.AddInputCharactersUTF8(event.key);
            }
        });

        canvas.addEventListener("keyup", (event) => {
            io.AddKeyEvent(keyMap[event.key], false);
        });

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            io.AddMousePosEvent(event.clientX - rect.left, event.clientY - rect.top);

            const cursorStyle = ImGui.GetMouseCursor();
            switch (cursorStyle) {
                case ImEnum.MouseCursor.None:
                    canvas.style.cursor = "none";
                    break;
                case ImEnum.MouseCursor.Arrow:
                    canvas.style.cursor = "default";
                    break;
                case ImEnum.MouseCursor.TextInput:
                    canvas.style.cursor = "text";
                    break;
                case ImEnum.MouseCursor.Hand:
                    canvas.style.cursor = "pointer";
                    break;
                case ImEnum.MouseCursor.ResizeAll:
                    canvas.style.cursor = "all-scroll";
                    break;
                case ImEnum.MouseCursor.ResizeNS:
                    canvas.style.cursor = "ns-resize";
                    break;
                case ImEnum.MouseCursor.ResizeEW:
                    canvas.style.cursor = "ew-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNESW:
                    canvas.style.cursor = "nesw-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNWSE:
                    canvas.style.cursor = "nwse-resize";
                    break;
                case ImEnum.MouseCursor.NotAllowed:
                    canvas.style.cursor = "not-allowed";
                    break;
                default:
                    canvas.style.cursor = "default";
                    break;
            }
        });

        const mouseMap = {
            0: 0,
            1: 2,
            2: 1,
        };

        canvas.addEventListener(
            "mousedown",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], true);
            },
        );

        canvas.addEventListener(
            "mouseup",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], false);
            },
        );

        canvas.addEventListener(
            "wheel",
            (event) => {
                io.AddMouseWheelEvent(-event.deltaX * 0.01, -event.deltaY * 0.01);
            },
        );

        canvas.addEventListener("focus", () => {
            io.AddFocusEvent(true);
        });

        canvas.addEventListener("blur", () => {
            io.AddFocusEvent(false);
        });
    },
};
