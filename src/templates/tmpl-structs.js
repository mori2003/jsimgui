
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
