#include <emscripten.h>
#include <emscripten/bind.h>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_internal.h>

#include <vector>
#include <string>

constexpr auto allow_ptr() {
    return emscripten::allow_raw_pointers();
}

constexpr auto rvp_ref() {
  return emscripten::return_value_policy::reference();
}

template <typename Func>
constexpr auto override(Func &&func) {
  return emscripten::optional_override(std::forward<Func>(func));
}

template <typename Func, typename... Args, typename... Policies>
constexpr void bind_func(const std::string &name, Func &&func, Policies &&...policies) {
    return emscripten::function(name.c_str(), override(std::forward<Func>(func)), std::forward<Policies>(policies)...);
}

template <typename Struct>
constexpr auto bind_struct(const std::string &name) {
  return emscripten::class_<Struct>(name.c_str());
}

#define bind_prop(className, name, type) \
    .function("get_"#name , override([](const className& self){ return self.name; }), rvp_ref(), allow_ptr()) \
    .function("set_"#name , override([](className& self, type value){ self.name = value; }), allow_ptr())

#define bind_method(name, func, ...) \
    .function(name, override(func), __VA_ARGS__)

template<typename T>
class ArrayParam {
    private:
        std::vector<T> value;
        emscripten::val& js_value;

    public:
        ArrayParam(emscripten::val& js_value) : js_value(js_value) {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return;
            }

            int length = js_value["length"].as<int>();
            value.reserve(length);

            for (int i = 0; i < length; i++) {
                value.push_back(js_value[i].as<T>());
            }
        }

        ~ArrayParam() {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return;
            }

            for (size_t i = 0; i < value.size(); i++) {
                js_value.set(i, value[i]);
            }
        }

        constexpr T* operator&() {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return nullptr;
            }

            return value.data();
        }
};

template<>
class ArrayParam<bool> {
    private:
        bool value;
        emscripten::val& js_value;

    public:
        ArrayParam(emscripten::val& js_value) : js_value(js_value) {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return;
            }

            value = js_value[0].as<bool>();
        }

        ~ArrayParam() {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return;
            }

            js_value.set(0, value);
        }

        bool* operator&() {
            if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
                return nullptr;
            }
            return &value;
        }
};

EMSCRIPTEN_BINDINGS(impl) {

    bind_func("cImGui_ImplOpenGL3_Init", [](){
        return cImGui_ImplOpenGL3_Init();
    });

    bind_func("cImGui_ImplOpenGL3_Shutdown", [](){
        return cImGui_ImplOpenGL3_Shutdown();
    });

    bind_func("cImGui_ImplOpenGL3_NewFrame", [](){
        return cImGui_ImplOpenGL3_NewFrame();
    });

    bind_func("cImGui_ImplOpenGL3_RenderDrawData", [](ImDrawData* draw_data){
        cImGui_ImplOpenGL3_RenderDrawData(draw_data);
    }, allow_ptr());

}

/* -------------------------------------------------------------------------- */
/* AUTO-GENERATED BINDINGS */
/* -------------------------------------------------------------------------- */

EMSCRIPTEN_BINDINGS(jsimgui) {
/* -------------------------------------------------------------------------- */
/* STRUCTS */
/* -------------------------------------------------------------------------- */

bind_struct<ImDrawListSharedData>("ImDrawListSharedData")
.constructor<>()
;

bind_struct<ImGuiContext>("ImGuiContext")
.constructor<>()
;

bind_struct<ImVec2>("ImVec2")
.constructor<>()
bind_prop(ImVec2, x, float)
bind_prop(ImVec2, y, float)
;

bind_struct<ImVec4>("ImVec4")
.constructor<>()
bind_prop(ImVec4, x, float)
bind_prop(ImVec4, y, float)
bind_prop(ImVec4, z, float)
bind_prop(ImVec4, w, float)
;

bind_struct<ImGuiTableSortSpecs>("ImGuiTableSortSpecs")
.constructor<>()
;

bind_struct<ImGuiTableColumnSortSpecs>("ImGuiTableColumnSortSpecs")
.constructor<>()
;

bind_struct<ImGuiStyle>("ImGuiStyle")
.constructor<>()
bind_prop(ImGuiStyle, Alpha, float)
bind_prop(ImGuiStyle, DisabledAlpha, float)
bind_prop(ImGuiStyle, WindowPadding, ImVec2)
bind_prop(ImGuiStyle, WindowRounding, float)
bind_prop(ImGuiStyle, WindowBorderSize, float)
bind_prop(ImGuiStyle, WindowMinSize, ImVec2)
bind_prop(ImGuiStyle, WindowTitleAlign, ImVec2)
bind_prop(ImGuiStyle, WindowMenuButtonPosition, ImGuiDir)
bind_prop(ImGuiStyle, ChildRounding, float)
bind_prop(ImGuiStyle, ChildBorderSize, float)
bind_prop(ImGuiStyle, PopupRounding, float)
bind_prop(ImGuiStyle, PopupBorderSize, float)
bind_prop(ImGuiStyle, FramePadding, ImVec2)
bind_prop(ImGuiStyle, FrameRounding, float)
bind_prop(ImGuiStyle, FrameBorderSize, float)
bind_prop(ImGuiStyle, ItemSpacing, ImVec2)
bind_prop(ImGuiStyle, ItemInnerSpacing, ImVec2)
bind_prop(ImGuiStyle, CellPadding, ImVec2)
bind_prop(ImGuiStyle, TouchExtraPadding, ImVec2)
bind_prop(ImGuiStyle, IndentSpacing, float)
bind_prop(ImGuiStyle, ColumnsMinSpacing, float)
bind_prop(ImGuiStyle, ScrollbarSize, float)
bind_prop(ImGuiStyle, ScrollbarRounding, float)
bind_prop(ImGuiStyle, GrabMinSize, float)
bind_prop(ImGuiStyle, GrabRounding, float)
bind_prop(ImGuiStyle, LogSliderDeadzone, float)
bind_prop(ImGuiStyle, TabRounding, float)
bind_prop(ImGuiStyle, TabBorderSize, float)
bind_prop(ImGuiStyle, TabMinWidthForCloseButton, float)
bind_prop(ImGuiStyle, TabBarBorderSize, float)
bind_prop(ImGuiStyle, TabBarOverlineSize, float)
bind_prop(ImGuiStyle, TableAngledHeadersAngle, float)
bind_prop(ImGuiStyle, TableAngledHeadersTextAlign, ImVec2)
bind_prop(ImGuiStyle, ColorButtonPosition, ImGuiDir)
bind_prop(ImGuiStyle, ButtonTextAlign, ImVec2)
bind_prop(ImGuiStyle, SelectableTextAlign, ImVec2)
bind_prop(ImGuiStyle, SeparatorTextBorderSize, float)
bind_prop(ImGuiStyle, SeparatorTextAlign, ImVec2)
bind_prop(ImGuiStyle, SeparatorTextPadding, ImVec2)
bind_prop(ImGuiStyle, DisplayWindowPadding, ImVec2)
bind_prop(ImGuiStyle, DisplaySafeAreaPadding, ImVec2)
bind_prop(ImGuiStyle, DockingSeparatorSize, float)
bind_prop(ImGuiStyle, MouseCursorScale, float)
bind_prop(ImGuiStyle, AntiAliasedLines, bool)
bind_prop(ImGuiStyle, AntiAliasedLinesUseTex, bool)
bind_prop(ImGuiStyle, AntiAliasedFill, bool)
bind_prop(ImGuiStyle, CurveTessellationTol, float)
bind_prop(ImGuiStyle, CircleTessellationMaxError, float)
bind_prop(ImGuiStyle, HoverStationaryDelay, float)
bind_prop(ImGuiStyle, HoverDelayShort, float)
bind_prop(ImGuiStyle, HoverDelayNormal, float)
bind_prop(ImGuiStyle, HoverFlagsForTooltipMouse, ImGuiHoveredFlags)
bind_prop(ImGuiStyle, HoverFlagsForTooltipNav, ImGuiHoveredFlags)
bind_method("ImGuiStyle_ScaleAllSizes", [](ImGuiStyle* self, float scale_factor){
    return ImGuiStyle_ScaleAllSizes(self, scale_factor);
}, allow_ptr())
;

bind_struct<ImGuiIO>("ImGuiIO")
.constructor<>()
bind_prop(ImGuiIO, ConfigFlags, ImGuiConfigFlags)
bind_prop(ImGuiIO, BackendFlags, ImGuiBackendFlags)
bind_prop(ImGuiIO, DisplaySize, ImVec2)
bind_prop(ImGuiIO, DeltaTime, float)
bind_prop(ImGuiIO, IniSavingRate, float)
bind_prop(ImGuiIO, Fonts, ImFontAtlas*)
bind_prop(ImGuiIO, FontGlobalScale, float)
bind_prop(ImGuiIO, FontAllowUserScaling, bool)
bind_prop(ImGuiIO, FontDefault, ImFont*)
bind_prop(ImGuiIO, DisplayFramebufferScale, ImVec2)
bind_prop(ImGuiIO, ConfigNavSwapGamepadButtons, bool)
bind_prop(ImGuiIO, ConfigNavMoveSetMousePos, bool)
bind_prop(ImGuiIO, ConfigNavCaptureKeyboard, bool)
bind_prop(ImGuiIO, ConfigNavEscapeClearFocusItem, bool)
bind_prop(ImGuiIO, ConfigNavEscapeClearFocusWindow, bool)
bind_prop(ImGuiIO, ConfigNavCursorVisibleAuto, bool)
bind_prop(ImGuiIO, ConfigNavCursorVisibleAlways, bool)
bind_prop(ImGuiIO, ConfigDockingNoSplit, bool)
bind_prop(ImGuiIO, ConfigDockingWithShift, bool)
bind_prop(ImGuiIO, ConfigDockingAlwaysTabBar, bool)
bind_prop(ImGuiIO, ConfigDockingTransparentPayload, bool)
bind_prop(ImGuiIO, ConfigViewportsNoAutoMerge, bool)
bind_prop(ImGuiIO, ConfigViewportsNoTaskBarIcon, bool)
bind_prop(ImGuiIO, ConfigViewportsNoDecoration, bool)
bind_prop(ImGuiIO, ConfigViewportsNoDefaultParent, bool)
bind_prop(ImGuiIO, MouseDrawCursor, bool)
bind_prop(ImGuiIO, ConfigMacOSXBehaviors, bool)
bind_prop(ImGuiIO, ConfigInputTrickleEventQueue, bool)
bind_prop(ImGuiIO, ConfigInputTextCursorBlink, bool)
bind_prop(ImGuiIO, ConfigInputTextEnterKeepActive, bool)
bind_prop(ImGuiIO, ConfigDragClickToInputText, bool)
bind_prop(ImGuiIO, ConfigWindowsResizeFromEdges, bool)
bind_prop(ImGuiIO, ConfigWindowsMoveFromTitleBarOnly, bool)
bind_prop(ImGuiIO, ConfigWindowsCopyContentsWithCtrlC, bool)
bind_prop(ImGuiIO, ConfigScrollbarScrollByPage, bool)
bind_prop(ImGuiIO, ConfigMemoryCompactTimer, float)
bind_prop(ImGuiIO, MouseDoubleClickTime, float)
bind_prop(ImGuiIO, MouseDoubleClickMaxDist, float)
bind_prop(ImGuiIO, MouseDragThreshold, float)
bind_prop(ImGuiIO, KeyRepeatDelay, float)
bind_prop(ImGuiIO, KeyRepeatRate, float)
bind_prop(ImGuiIO, ConfigErrorRecovery, bool)
bind_prop(ImGuiIO, ConfigErrorRecoveryEnableAssert, bool)
bind_prop(ImGuiIO, ConfigErrorRecoveryEnableDebugLog, bool)
bind_prop(ImGuiIO, ConfigErrorRecoveryEnableTooltip, bool)
bind_prop(ImGuiIO, ConfigDebugIsDebuggerPresent, bool)
bind_prop(ImGuiIO, ConfigDebugHighlightIdConflicts, bool)
bind_prop(ImGuiIO, ConfigDebugBeginReturnValueOnce, bool)
bind_prop(ImGuiIO, ConfigDebugBeginReturnValueLoop, bool)
bind_prop(ImGuiIO, ConfigDebugIgnoreFocusLoss, bool)
bind_prop(ImGuiIO, ConfigDebugIniSettings, bool)
bind_prop(ImGuiIO, WantCaptureMouse, bool)
bind_prop(ImGuiIO, WantCaptureKeyboard, bool)
bind_prop(ImGuiIO, WantTextInput, bool)
bind_prop(ImGuiIO, WantSetMousePos, bool)
bind_prop(ImGuiIO, WantSaveIniSettings, bool)
bind_prop(ImGuiIO, NavActive, bool)
bind_prop(ImGuiIO, NavVisible, bool)
bind_prop(ImGuiIO, Framerate, float)
bind_prop(ImGuiIO, MetricsRenderVertices, int)
bind_prop(ImGuiIO, MetricsRenderIndices, int)
bind_prop(ImGuiIO, MetricsRenderWindows, int)
bind_prop(ImGuiIO, MetricsActiveWindows, int)
bind_prop(ImGuiIO, MouseDelta, ImVec2)
bind_prop(ImGuiIO, Ctx, ImGuiContext*)
bind_prop(ImGuiIO, MousePos, ImVec2)
bind_prop(ImGuiIO, MouseWheel, float)
bind_prop(ImGuiIO, MouseWheelH, float)
bind_prop(ImGuiIO, MouseSource, ImGuiMouseSource)
bind_prop(ImGuiIO, MouseHoveredViewport, ImGuiID)
bind_prop(ImGuiIO, KeyCtrl, bool)
bind_prop(ImGuiIO, KeyShift, bool)
bind_prop(ImGuiIO, KeyAlt, bool)
bind_prop(ImGuiIO, KeySuper, bool)
bind_prop(ImGuiIO, KeyMods, ImGuiKeyChord)
bind_prop(ImGuiIO, WantCaptureMouseUnlessPopupClose, bool)
bind_prop(ImGuiIO, MousePosPrev, ImVec2)
bind_method("ImGuiIO_AddKeyEvent", [](ImGuiIO* self, ImGuiKey key, bool down){
    return ImGuiIO_AddKeyEvent(self, key, down);
}, allow_ptr())
bind_method("ImGuiIO_AddKeyAnalogEvent", [](ImGuiIO* self, ImGuiKey key, bool down, float v){
    return ImGuiIO_AddKeyAnalogEvent(self, key, down, v);
}, allow_ptr())
bind_method("ImGuiIO_AddMousePosEvent", [](ImGuiIO* self, float x, float y){
    return ImGuiIO_AddMousePosEvent(self, x, y);
}, allow_ptr())
bind_method("ImGuiIO_AddMouseButtonEvent", [](ImGuiIO* self, int button, bool down){
    return ImGuiIO_AddMouseButtonEvent(self, button, down);
}, allow_ptr())
bind_method("ImGuiIO_AddMouseWheelEvent", [](ImGuiIO* self, float wheel_x, float wheel_y){
    return ImGuiIO_AddMouseWheelEvent(self, wheel_x, wheel_y);
}, allow_ptr())
bind_method("ImGuiIO_AddMouseSourceEvent", [](ImGuiIO* self, ImGuiMouseSource source){
    return ImGuiIO_AddMouseSourceEvent(self, source);
}, allow_ptr())
bind_method("ImGuiIO_AddMouseViewportEvent", [](ImGuiIO* self, ImGuiID id){
    return ImGuiIO_AddMouseViewportEvent(self, id);
}, allow_ptr())
bind_method("ImGuiIO_AddFocusEvent", [](ImGuiIO* self, bool focused){
    return ImGuiIO_AddFocusEvent(self, focused);
}, allow_ptr())
bind_method("ImGuiIO_AddInputCharacter", [](ImGuiIO* self, unsigned int c){
    return ImGuiIO_AddInputCharacter(self, c);
}, allow_ptr())
bind_method("ImGuiIO_AddInputCharacterUTF16", [](ImGuiIO* self, ImWchar16 c){
    return ImGuiIO_AddInputCharacterUTF16(self, c);
}, allow_ptr())
bind_method("ImGuiIO_AddInputCharactersUTF8", [](ImGuiIO* self, std::string str){
    return ImGuiIO_AddInputCharactersUTF8(self, str.c_str());
}, allow_ptr())
bind_method("ImGuiIO_SetKeyEventNativeData", [](ImGuiIO* self, ImGuiKey key, int native_keycode, int native_scancode){
    return ImGuiIO_SetKeyEventNativeData(self, key, native_keycode, native_scancode);
}, allow_ptr())
bind_method("ImGuiIO_SetAppAcceptingEvents", [](ImGuiIO* self, bool accepting_events){
    return ImGuiIO_SetAppAcceptingEvents(self, accepting_events);
}, allow_ptr())
bind_method("ImGuiIO_ClearEventsQueue", [](ImGuiIO* self){
    return ImGuiIO_ClearEventsQueue(self);
}, allow_ptr())
bind_method("ImGuiIO_ClearInputKeys", [](ImGuiIO* self){
    return ImGuiIO_ClearInputKeys(self);
}, allow_ptr())
bind_method("ImGuiIO_ClearInputMouse", [](ImGuiIO* self){
    return ImGuiIO_ClearInputMouse(self);
}, allow_ptr())
;

bind_struct<ImGuiMultiSelectIO>("ImGuiMultiSelectIO")
.constructor<>()
;

bind_struct<ImDrawList>("ImDrawList")
.constructor<>()
;

bind_struct<ImDrawData>("ImDrawData")
.constructor<>()
;

bind_struct<ImFontConfig>("ImFontConfig")
.constructor<>()
;

bind_struct<ImFontAtlas>("ImFontAtlas")
.constructor<>()
;

bind_struct<ImFont>("ImFont")
.constructor<>()
;


/* -------------------------------------------------------------------------- */
/* FUNCTIONS */
/* -------------------------------------------------------------------------- */

bind_func("ImGui_CreateContext", [](ImFontAtlas* shared_font_atlas){
    return ImGui_CreateContext(shared_font_atlas);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_DestroyContext", [](ImGuiContext* ctx){
    return ImGui_DestroyContext(ctx);
}, allow_ptr());

bind_func("ImGui_GetCurrentContext", [](){
    return ImGui_GetCurrentContext();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetCurrentContext", [](ImGuiContext* ctx){
    return ImGui_SetCurrentContext(ctx);
}, allow_ptr());

bind_func("ImGui_GetIO", [](){
    return ImGui_GetIO();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetPlatformIO", [](){
    return ImGui_GetPlatformIO();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetStyle", [](){
    return ImGui_GetStyle();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_NewFrame", [](){
    return ImGui_NewFrame();
});

bind_func("ImGui_EndFrame", [](){
    return ImGui_EndFrame();
});

bind_func("ImGui_Render", [](){
    return ImGui_Render();
});

bind_func("ImGui_GetDrawData", [](){
    return ImGui_GetDrawData();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_ShowDemoWindow", [](emscripten::val p_open){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_ShowDemoWindow(&p_open_bind);
}, allow_ptr());

bind_func("ImGui_ShowMetricsWindow", [](emscripten::val p_open){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_ShowMetricsWindow(&p_open_bind);
}, allow_ptr());

bind_func("ImGui_ShowDebugLogWindow", [](emscripten::val p_open){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_ShowDebugLogWindow(&p_open_bind);
}, allow_ptr());

bind_func("ImGui_ShowIDStackToolWindowEx", [](emscripten::val p_open){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_ShowIDStackToolWindowEx(&p_open_bind);
}, allow_ptr());

bind_func("ImGui_ShowAboutWindow", [](emscripten::val p_open){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_ShowAboutWindow(&p_open_bind);
}, allow_ptr());

bind_func("ImGui_ShowStyleEditor", [](ImGuiStyle* ref){
    return ImGui_ShowStyleEditor(ref);
}, allow_ptr());

bind_func("ImGui_ShowStyleSelector", [](std::string label){
    return ImGui_ShowStyleSelector(label.c_str());
}, allow_ptr());

bind_func("ImGui_ShowFontSelector", [](std::string label){
    return ImGui_ShowFontSelector(label.c_str());
}, allow_ptr());

bind_func("ImGui_ShowUserGuide", [](){
    return ImGui_ShowUserGuide();
});

// MANUAL OVERRIDE
bind_func("ImGui_GetVersion", [](){
    return std::string(ImGui_GetVersion());
});

bind_func("ImGui_StyleColorsDark", [](ImGuiStyle* dst){
    return ImGui_StyleColorsDark(dst);
}, allow_ptr());

bind_func("ImGui_StyleColorsLight", [](ImGuiStyle* dst){
    return ImGui_StyleColorsLight(dst);
}, allow_ptr());

bind_func("ImGui_StyleColorsClassic", [](ImGuiStyle* dst){
    return ImGui_StyleColorsClassic(dst);
}, allow_ptr());

bind_func("ImGui_Begin", [](std::string name, emscripten::val p_open, ImGuiWindowFlags flags){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_Begin(name.c_str(), &p_open_bind, flags);
}, allow_ptr());

bind_func("ImGui_End", [](){
    return ImGui_End();
});

bind_func("ImGui_BeginChild", [](std::string str_id, ImVec2 size, ImGuiChildFlags child_flags, ImGuiWindowFlags window_flags){
    return ImGui_BeginChild(str_id.c_str(), size, child_flags, window_flags);
}, allow_ptr());

bind_func("ImGui_EndChild", [](){
    return ImGui_EndChild();
});

bind_func("ImGui_IsWindowAppearing", [](){
    return ImGui_IsWindowAppearing();
});

bind_func("ImGui_IsWindowCollapsed", [](){
    return ImGui_IsWindowCollapsed();
});

bind_func("ImGui_IsWindowFocused", [](ImGuiFocusedFlags flags){
    return ImGui_IsWindowFocused(flags);
});

bind_func("ImGui_IsWindowHovered", [](ImGuiHoveredFlags flags){
    return ImGui_IsWindowHovered(flags);
});

bind_func("ImGui_GetWindowDrawList", [](){
    return ImGui_GetWindowDrawList();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetWindowDpiScale", [](){
    return ImGui_GetWindowDpiScale();
});

bind_func("ImGui_GetWindowPos", [](){
    return ImGui_GetWindowPos();
});

bind_func("ImGui_GetWindowSize", [](){
    return ImGui_GetWindowSize();
});

bind_func("ImGui_GetWindowWidth", [](){
    return ImGui_GetWindowWidth();
});

bind_func("ImGui_GetWindowHeight", [](){
    return ImGui_GetWindowHeight();
});

bind_func("ImGui_GetWindowViewport", [](){
    return ImGui_GetWindowViewport();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetNextWindowPosEx", [](ImVec2 pos, ImGuiCond cond, ImVec2 pivot){
    return ImGui_SetNextWindowPosEx(pos, cond, pivot);
});

bind_func("ImGui_SetNextWindowSize", [](ImVec2 size, ImGuiCond cond){
    return ImGui_SetNextWindowSize(size, cond);
});

bind_func("ImGui_SetNextWindowContentSize", [](ImVec2 size){
    return ImGui_SetNextWindowContentSize(size);
});

bind_func("ImGui_SetNextWindowCollapsed", [](bool collapsed, ImGuiCond cond){
    return ImGui_SetNextWindowCollapsed(collapsed, cond);
});

bind_func("ImGui_SetNextWindowFocus", [](){
    return ImGui_SetNextWindowFocus();
});

bind_func("ImGui_SetNextWindowScroll", [](ImVec2 scroll){
    return ImGui_SetNextWindowScroll(scroll);
});

bind_func("ImGui_SetNextWindowBgAlpha", [](float alpha){
    return ImGui_SetNextWindowBgAlpha(alpha);
});

bind_func("ImGui_SetNextWindowViewport", [](ImGuiID viewport_id){
    return ImGui_SetNextWindowViewport(viewport_id);
});

bind_func("ImGui_SetWindowPos", [](ImVec2 pos, ImGuiCond cond){
    return ImGui_SetWindowPos(pos, cond);
});

bind_func("ImGui_SetWindowSize", [](ImVec2 size, ImGuiCond cond){
    return ImGui_SetWindowSize(size, cond);
});

bind_func("ImGui_SetWindowCollapsed", [](bool collapsed, ImGuiCond cond){
    return ImGui_SetWindowCollapsed(collapsed, cond);
});

bind_func("ImGui_SetWindowFocus", [](){
    return ImGui_SetWindowFocus();
});

bind_func("ImGui_SetWindowFontScale", [](float scale){
    return ImGui_SetWindowFontScale(scale);
});

bind_func("ImGui_GetScrollX", [](){
    return ImGui_GetScrollX();
});

bind_func("ImGui_GetScrollY", [](){
    return ImGui_GetScrollY();
});

bind_func("ImGui_SetScrollX", [](float scroll_x){
    return ImGui_SetScrollX(scroll_x);
});

bind_func("ImGui_SetScrollY", [](float scroll_y){
    return ImGui_SetScrollY(scroll_y);
});

bind_func("ImGui_GetScrollMaxX", [](){
    return ImGui_GetScrollMaxX();
});

bind_func("ImGui_GetScrollMaxY", [](){
    return ImGui_GetScrollMaxY();
});

bind_func("ImGui_SetScrollHereX", [](float center_x_ratio){
    return ImGui_SetScrollHereX(center_x_ratio);
});

bind_func("ImGui_SetScrollHereY", [](float center_y_ratio){
    return ImGui_SetScrollHereY(center_y_ratio);
});

bind_func("ImGui_SetScrollFromPosX", [](float local_x, float center_x_ratio){
    return ImGui_SetScrollFromPosX(local_x, center_x_ratio);
});

bind_func("ImGui_SetScrollFromPosY", [](float local_y, float center_y_ratio){
    return ImGui_SetScrollFromPosY(local_y, center_y_ratio);
});

bind_func("ImGui_PushFont", [](ImFont* font){
    return ImGui_PushFont(font);
}, allow_ptr());

bind_func("ImGui_PopFont", [](){
    return ImGui_PopFont();
});

bind_func("ImGui_PushStyleColor", [](ImGuiCol idx, ImU32 col){
    return ImGui_PushStyleColor(idx, col);
});

bind_func("ImGui_PopStyleColorEx", [](int count){
    return ImGui_PopStyleColorEx(count);
});

bind_func("ImGui_PushStyleVar", [](ImGuiStyleVar idx, float val){
    return ImGui_PushStyleVar(idx, val);
});

bind_func("ImGui_PushStyleVarX", [](ImGuiStyleVar idx, float val_x){
    return ImGui_PushStyleVarX(idx, val_x);
});

bind_func("ImGui_PushStyleVarY", [](ImGuiStyleVar idx, float val_y){
    return ImGui_PushStyleVarY(idx, val_y);
});

bind_func("ImGui_PopStyleVarEx", [](int count){
    return ImGui_PopStyleVarEx(count);
});

bind_func("ImGui_PushItemFlag", [](ImGuiItemFlags option, bool enabled){
    return ImGui_PushItemFlag(option, enabled);
});

bind_func("ImGui_PopItemFlag", [](){
    return ImGui_PopItemFlag();
});

bind_func("ImGui_PushItemWidth", [](float item_width){
    return ImGui_PushItemWidth(item_width);
});

bind_func("ImGui_PopItemWidth", [](){
    return ImGui_PopItemWidth();
});

bind_func("ImGui_SetNextItemWidth", [](float item_width){
    return ImGui_SetNextItemWidth(item_width);
});

bind_func("ImGui_CalcItemWidth", [](){
    return ImGui_CalcItemWidth();
});

bind_func("ImGui_PushTextWrapPos", [](float wrap_local_pos_x){
    return ImGui_PushTextWrapPos(wrap_local_pos_x);
});

bind_func("ImGui_PopTextWrapPos", [](){
    return ImGui_PopTextWrapPos();
});

bind_func("ImGui_GetFont", [](){
    return ImGui_GetFont();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetFontSize", [](){
    return ImGui_GetFontSize();
});

bind_func("ImGui_GetFontTexUvWhitePixel", [](){
    return ImGui_GetFontTexUvWhitePixel();
});

bind_func("ImGui_GetStyleColorVec4", [](ImGuiCol idx){
    return ImGui_GetStyleColorVec4(idx);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetCursorScreenPos", [](){
    return ImGui_GetCursorScreenPos();
});

bind_func("ImGui_SetCursorScreenPos", [](ImVec2 pos){
    return ImGui_SetCursorScreenPos(pos);
});

bind_func("ImGui_GetContentRegionAvail", [](){
    return ImGui_GetContentRegionAvail();
});

bind_func("ImGui_GetCursorPos", [](){
    return ImGui_GetCursorPos();
});

bind_func("ImGui_GetCursorPosX", [](){
    return ImGui_GetCursorPosX();
});

bind_func("ImGui_GetCursorPosY", [](){
    return ImGui_GetCursorPosY();
});

bind_func("ImGui_SetCursorPos", [](ImVec2 local_pos){
    return ImGui_SetCursorPos(local_pos);
});

bind_func("ImGui_SetCursorPosX", [](float local_x){
    return ImGui_SetCursorPosX(local_x);
});

bind_func("ImGui_SetCursorPosY", [](float local_y){
    return ImGui_SetCursorPosY(local_y);
});

bind_func("ImGui_GetCursorStartPos", [](){
    return ImGui_GetCursorStartPos();
});

bind_func("ImGui_Separator", [](){
    return ImGui_Separator();
});

bind_func("ImGui_SameLineEx", [](float offset_from_start_x, float spacing){
    return ImGui_SameLineEx(offset_from_start_x, spacing);
});

bind_func("ImGui_NewLine", [](){
    return ImGui_NewLine();
});

bind_func("ImGui_Spacing", [](){
    return ImGui_Spacing();
});

bind_func("ImGui_Dummy", [](ImVec2 size){
    return ImGui_Dummy(size);
});

bind_func("ImGui_IndentEx", [](float indent_w){
    return ImGui_IndentEx(indent_w);
});

bind_func("ImGui_UnindentEx", [](float indent_w){
    return ImGui_UnindentEx(indent_w);
});

bind_func("ImGui_BeginGroup", [](){
    return ImGui_BeginGroup();
});

bind_func("ImGui_EndGroup", [](){
    return ImGui_EndGroup();
});

bind_func("ImGui_AlignTextToFramePadding", [](){
    return ImGui_AlignTextToFramePadding();
});

bind_func("ImGui_GetTextLineHeight", [](){
    return ImGui_GetTextLineHeight();
});

bind_func("ImGui_GetTextLineHeightWithSpacing", [](){
    return ImGui_GetTextLineHeightWithSpacing();
});

bind_func("ImGui_GetFrameHeight", [](){
    return ImGui_GetFrameHeight();
});

bind_func("ImGui_GetFrameHeightWithSpacing", [](){
    return ImGui_GetFrameHeightWithSpacing();
});

bind_func("ImGui_PushID", [](std::string str_id){
    return ImGui_PushID(str_id.c_str());
}, allow_ptr());

bind_func("ImGui_PopID", [](){
    return ImGui_PopID();
});

bind_func("ImGui_GetID", [](std::string str_id){
    return ImGui_GetID(str_id.c_str());
}, allow_ptr());

// MANUAL OVERRIDE
bind_func("ImGui_Text", [](std::string fmt){
    return ImGui_Text("%s", fmt.c_str());
});

// MANUAL OVERRIDE
bind_func("ImGui_TextColored", [](ImVec4 col, std::string fmt){
    return ImGui_TextColored(col, "%s", fmt.c_str());
});

// MANUAL OVERRIDE
bind_func("ImGui_TextDisabled", [](std::string fmt){
    return ImGui_TextDisabled("%s", fmt.c_str());
});

// MANUAL OVERRIDE
bind_func("ImGui_TextWrapped", [](std::string fmt){
    return ImGui_TextWrapped("%s", fmt.c_str());
});

// MANUAL OVERRIDE
bind_func("ImGui_LabelText", [](std::string label, std::string fmt){
    return ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
});

// MANUAL OVERRIDE
bind_func("ImGui_BulletText", [](std::string fmt){
    return ImGui_BulletText("%s", fmt.c_str());
});

bind_func("ImGui_SeparatorText", [](std::string label){
    return ImGui_SeparatorText(label.c_str());
}, allow_ptr());

bind_func("ImGui_ButtonEx", [](std::string label, ImVec2 size){
    return ImGui_ButtonEx(label.c_str(), size);
}, allow_ptr());

bind_func("ImGui_SmallButton", [](std::string label){
    return ImGui_SmallButton(label.c_str());
}, allow_ptr());

bind_func("ImGui_InvisibleButton", [](std::string str_id, ImVec2 size, ImGuiButtonFlags flags){
    return ImGui_InvisibleButton(str_id.c_str(), size, flags);
}, allow_ptr());

bind_func("ImGui_ArrowButton", [](std::string str_id, ImGuiDir dir){
    return ImGui_ArrowButton(str_id.c_str(), dir);
}, allow_ptr());

bind_func("ImGui_Checkbox", [](std::string label, emscripten::val v){
    auto v_bind =  ArrayParam<bool>(v);
    return ImGui_Checkbox(label.c_str(), &v_bind);
}, allow_ptr());

bind_func("ImGui_RadioButton", [](std::string label, bool active){
    return ImGui_RadioButton(label.c_str(), active);
}, allow_ptr());

bind_func("ImGui_ProgressBar", [](float fraction, ImVec2 size_arg, std::string overlay){
    return ImGui_ProgressBar(fraction, size_arg, overlay.c_str());
}, allow_ptr());

bind_func("ImGui_Bullet", [](){
    return ImGui_Bullet();
});

bind_func("ImGui_TextLink", [](std::string label){
    return ImGui_TextLink(label.c_str());
}, allow_ptr());

bind_func("ImGui_TextLinkOpenURLEx", [](std::string label, std::string url){
    return ImGui_TextLinkOpenURLEx(label.c_str(), url.c_str());
}, allow_ptr());

bind_func("ImGui_BeginCombo", [](std::string label, std::string preview_value, ImGuiComboFlags flags){
    return ImGui_BeginCombo(label.c_str(), preview_value.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_EndCombo", [](){
    return ImGui_EndCombo();
});

bind_func("ImGui_DragFloatEx", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_DragFloatEx(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragFloat2Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_DragFloat2Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragFloat3Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_DragFloat3Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragFloat4Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_DragFloat4Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragFloatRange2Ex", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, float v_min, float v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
    auto v_current_min_bind =  ArrayParam<float>(v_current_min);
    auto v_current_max_bind =  ArrayParam<float>(v_current_max);
    return ImGui_DragFloatRange2Ex(label.c_str(), &v_current_min_bind, &v_current_max_bind, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragInt2Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_DragInt2Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragInt3Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_DragInt3Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragInt4Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_DragInt4Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_DragIntRange2Ex", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, int v_min, int v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
    auto v_current_min_bind =  ArrayParam<int>(v_current_min);
    auto v_current_max_bind =  ArrayParam<int>(v_current_max);
    return ImGui_DragIntRange2Ex(label.c_str(), &v_current_min_bind, &v_current_max_bind, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderFloatEx", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_SliderFloatEx(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderFloat2Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_SliderFloat2Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderFloat3Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_SliderFloat3Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderFloat4Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_SliderFloat4Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderAngleEx", [](std::string label, emscripten::val v_rad, float v_degrees_min, float v_degrees_max, std::string format, ImGuiSliderFlags flags){
    auto v_rad_bind =  ArrayParam<float>(v_rad);
    return ImGui_SliderAngleEx(label.c_str(), &v_rad_bind, v_degrees_min, v_degrees_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderInt2Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_SliderInt2Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderInt3Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_SliderInt3Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SliderInt4Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_SliderInt4Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_VSliderFloatEx", [](std::string label, ImVec2 size, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_VSliderFloatEx(label.c_str(), size, &v_bind, v_min, v_max, format.c_str(), flags);
}, allow_ptr());

// MANUAL OVERRIDE
bind_func("ImGui_InputTextEx", [](std::string label, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextEx(label.c_str(), buf_data, buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});

// MANUAL OVERRIDE
bind_func("ImGui_InputTextMultilineEx", [](std::string label, emscripten::val buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextMultilineEx(label.c_str(), buf_data, buf_size, size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});

// MANUAL OVERRIDE
bind_func("ImGui_InputTextWithHintEx", [](std::string label, std::string hint, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    auto buf_data = buf_bind.data();
    const auto ret = ImGui_InputTextWithHintEx(label.c_str(), hint.c_str(), buf_data, buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data));
    return ret;
});

bind_func("ImGui_InputFloatEx", [](std::string label, emscripten::val v, float step, float step_fast, std::string format, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_InputFloatEx(label.c_str(), &v_bind, step, step_fast, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_InputFloat2Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_InputFloat2Ex(label.c_str(), &v_bind, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_InputFloat3Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_InputFloat3Ex(label.c_str(), &v_bind, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_InputFloat4Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<float>(v);
    return ImGui_InputFloat4Ex(label.c_str(), &v_bind, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_InputInt2", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_InputInt2(label.c_str(), &v_bind, flags);
}, allow_ptr());

bind_func("ImGui_InputInt3", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_InputInt3(label.c_str(), &v_bind, flags);
}, allow_ptr());

bind_func("ImGui_InputInt4", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto v_bind =  ArrayParam<int>(v);
    return ImGui_InputInt4(label.c_str(), &v_bind, flags);
}, allow_ptr());

bind_func("ImGui_InputDoubleEx", [](std::string label, double* v, double step, double step_fast, std::string format, ImGuiInputTextFlags flags){
    return ImGui_InputDoubleEx(label.c_str(), v, step, step_fast, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_ColorEdit3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto col_bind =  ArrayParam<float>(col);
    return ImGui_ColorEdit3(label.c_str(), &col_bind, flags);
}, allow_ptr());

bind_func("ImGui_ColorEdit4", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto col_bind =  ArrayParam<float>(col);
    return ImGui_ColorEdit4(label.c_str(), &col_bind, flags);
}, allow_ptr());

bind_func("ImGui_ColorPicker3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto col_bind =  ArrayParam<float>(col);
    return ImGui_ColorPicker3(label.c_str(), &col_bind, flags);
}, allow_ptr());

bind_func("ImGui_ColorPicker4", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags, const float* ref_col){
    auto col_bind =  ArrayParam<float>(col);
    return ImGui_ColorPicker4(label.c_str(), &col_bind, flags, ref_col);
}, allow_ptr());

bind_func("ImGui_ColorButtonEx", [](std::string desc_id, ImVec4 col, ImGuiColorEditFlags flags, ImVec2 size){
    return ImGui_ColorButtonEx(desc_id.c_str(), col, flags, size);
}, allow_ptr());

bind_func("ImGui_SetColorEditOptions", [](ImGuiColorEditFlags flags){
    return ImGui_SetColorEditOptions(flags);
});

bind_func("ImGui_TreeNodeEx", [](std::string label, ImGuiTreeNodeFlags flags){
    return ImGui_TreeNodeEx(label.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_TreePush", [](std::string str_id){
    return ImGui_TreePush(str_id.c_str());
}, allow_ptr());

bind_func("ImGui_TreePop", [](){
    return ImGui_TreePop();
});

bind_func("ImGui_GetTreeNodeToLabelSpacing", [](){
    return ImGui_GetTreeNodeToLabelSpacing();
});

bind_func("ImGui_CollapsingHeader", [](std::string label, ImGuiTreeNodeFlags flags){
    return ImGui_CollapsingHeader(label.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SetNextItemOpen", [](bool is_open, ImGuiCond cond){
    return ImGui_SetNextItemOpen(is_open, cond);
});

bind_func("ImGui_SelectableEx", [](std::string label, bool selected, ImGuiSelectableFlags flags, ImVec2 size){
    return ImGui_SelectableEx(label.c_str(), selected, flags, size);
}, allow_ptr());

bind_func("ImGui_BeginMultiSelectEx", [](ImGuiMultiSelectFlags flags, int selection_size, int items_count){
    return ImGui_BeginMultiSelectEx(flags, selection_size, items_count);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_EndMultiSelect", [](){
    return ImGui_EndMultiSelect();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetNextItemSelectionUserData", [](ImGuiSelectionUserData selection_user_data){
    return ImGui_SetNextItemSelectionUserData(selection_user_data);
});

bind_func("ImGui_IsItemToggledSelection", [](){
    return ImGui_IsItemToggledSelection();
});

bind_func("ImGui_BeginListBox", [](std::string label, ImVec2 size){
    return ImGui_BeginListBox(label.c_str(), size);
}, allow_ptr());

bind_func("ImGui_EndListBox", [](){
    return ImGui_EndListBox();
});

// MANUAL OVERRIDE
bind_func("ImGui_PlotLinesEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotLinesEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
}, allow_ptr());

// MANUAL OVERRIDE
bind_func("ImGui_PlotHistogramEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotHistogramEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
}, allow_ptr());

bind_func("ImGui_BeginMenuBar", [](){
    return ImGui_BeginMenuBar();
});

bind_func("ImGui_EndMenuBar", [](){
    return ImGui_EndMenuBar();
});

bind_func("ImGui_BeginMainMenuBar", [](){
    return ImGui_BeginMainMenuBar();
});

bind_func("ImGui_EndMainMenuBar", [](){
    return ImGui_EndMainMenuBar();
});

bind_func("ImGui_BeginMenuEx", [](std::string label, bool enabled){
    return ImGui_BeginMenuEx(label.c_str(), enabled);
}, allow_ptr());

bind_func("ImGui_EndMenu", [](){
    return ImGui_EndMenu();
});

bind_func("ImGui_MenuItemEx", [](std::string label, std::string shortcut, bool selected, bool enabled){
    return ImGui_MenuItemEx(label.c_str(), shortcut.c_str(), selected, enabled);
}, allow_ptr());

bind_func("ImGui_BeginTooltip", [](){
    return ImGui_BeginTooltip();
});

bind_func("ImGui_EndTooltip", [](){
    return ImGui_EndTooltip();
});

// MANUAL OVERRIDE
bind_func("ImGui_SetTooltip", [](std::string fmt){
    return ImGui_SetTooltip("%s", fmt.c_str());
});

bind_func("ImGui_BeginItemTooltip", [](){
    return ImGui_BeginItemTooltip();
});

// MANUAL OVERRIDE
bind_func("ImGui_SetItemTooltip", [](std::string fmt){
    return ImGui_SetItemTooltip("%s", fmt.c_str());
});

bind_func("ImGui_BeginPopup", [](std::string str_id, ImGuiWindowFlags flags){
    return ImGui_BeginPopup(str_id.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupModal", [](std::string name, emscripten::val p_open, ImGuiWindowFlags flags){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_BeginPopupModal(name.c_str(), &p_open_bind, flags);
}, allow_ptr());

bind_func("ImGui_EndPopup", [](){
    return ImGui_EndPopup();
});

bind_func("ImGui_OpenPopup", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_OpenPopup(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_OpenPopupOnItemClick", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_OpenPopupOnItemClick(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_CloseCurrentPopup", [](){
    return ImGui_CloseCurrentPopup();
});

bind_func("ImGui_BeginPopupContextItemEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextItemEx(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupContextWindowEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextWindowEx(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupContextVoidEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextVoidEx(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_IsPopupOpen", [](std::string str_id, ImGuiPopupFlags flags){
    return ImGui_IsPopupOpen(str_id.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_BeginTableEx", [](std::string str_id, int columns, ImGuiTableFlags flags, ImVec2 outer_size, float inner_width){
    return ImGui_BeginTableEx(str_id.c_str(), columns, flags, outer_size, inner_width);
}, allow_ptr());

bind_func("ImGui_EndTable", [](){
    return ImGui_EndTable();
});

bind_func("ImGui_TableNextRowEx", [](ImGuiTableRowFlags row_flags, float min_row_height){
    return ImGui_TableNextRowEx(row_flags, min_row_height);
});

bind_func("ImGui_TableNextColumn", [](){
    return ImGui_TableNextColumn();
});

bind_func("ImGui_TableSetColumnIndex", [](int column_n){
    return ImGui_TableSetColumnIndex(column_n);
});

bind_func("ImGui_TableSetupColumnEx", [](std::string label, ImGuiTableColumnFlags flags, float init_width_or_weight, ImGuiID user_id){
    return ImGui_TableSetupColumnEx(label.c_str(), flags, init_width_or_weight, user_id);
}, allow_ptr());

bind_func("ImGui_TableSetupScrollFreeze", [](int cols, int rows){
    return ImGui_TableSetupScrollFreeze(cols, rows);
});

bind_func("ImGui_TableHeader", [](std::string label){
    return ImGui_TableHeader(label.c_str());
}, allow_ptr());

bind_func("ImGui_TableHeadersRow", [](){
    return ImGui_TableHeadersRow();
});

bind_func("ImGui_TableAngledHeadersRow", [](){
    return ImGui_TableAngledHeadersRow();
});

bind_func("ImGui_TableGetSortSpecs", [](){
    return ImGui_TableGetSortSpecs();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_TableGetColumnCount", [](){
    return ImGui_TableGetColumnCount();
});

bind_func("ImGui_TableGetColumnIndex", [](){
    return ImGui_TableGetColumnIndex();
});

bind_func("ImGui_TableGetRowIndex", [](){
    return ImGui_TableGetRowIndex();
});

bind_func("ImGui_TableGetColumnName", [](int column_n){
    return ImGui_TableGetColumnName(column_n);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_TableGetColumnFlags", [](int column_n){
    return ImGui_TableGetColumnFlags(column_n);
});

bind_func("ImGui_TableSetColumnEnabled", [](int column_n, bool v){
    return ImGui_TableSetColumnEnabled(column_n, v);
});

bind_func("ImGui_TableGetHoveredColumn", [](){
    return ImGui_TableGetHoveredColumn();
});

bind_func("ImGui_TableSetBgColor", [](ImGuiTableBgTarget target, ImU32 color, int column_n){
    return ImGui_TableSetBgColor(target, color, column_n);
});

bind_func("ImGui_ColumnsEx", [](int count, std::string id, bool borders){
    return ImGui_ColumnsEx(count, id.c_str(), borders);
}, allow_ptr());

bind_func("ImGui_NextColumn", [](){
    return ImGui_NextColumn();
});

bind_func("ImGui_GetColumnIndex", [](){
    return ImGui_GetColumnIndex();
});

bind_func("ImGui_GetColumnWidth", [](int column_index){
    return ImGui_GetColumnWidth(column_index);
});

bind_func("ImGui_SetColumnWidth", [](int column_index, float width){
    return ImGui_SetColumnWidth(column_index, width);
});

bind_func("ImGui_GetColumnOffset", [](int column_index){
    return ImGui_GetColumnOffset(column_index);
});

bind_func("ImGui_SetColumnOffset", [](int column_index, float offset_x){
    return ImGui_SetColumnOffset(column_index, offset_x);
});

bind_func("ImGui_GetColumnsCount", [](){
    return ImGui_GetColumnsCount();
});

bind_func("ImGui_BeginTabBar", [](std::string str_id, ImGuiTabBarFlags flags){
    return ImGui_BeginTabBar(str_id.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_EndTabBar", [](){
    return ImGui_EndTabBar();
});

bind_func("ImGui_BeginTabItem", [](std::string label, emscripten::val p_open, ImGuiTabItemFlags flags){
    auto p_open_bind =  ArrayParam<bool>(p_open);
    return ImGui_BeginTabItem(label.c_str(), &p_open_bind, flags);
}, allow_ptr());

bind_func("ImGui_EndTabItem", [](){
    return ImGui_EndTabItem();
});

bind_func("ImGui_TabItemButton", [](std::string label, ImGuiTabItemFlags flags){
    return ImGui_TabItemButton(label.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_SetTabItemClosed", [](std::string tab_or_docked_window_label){
    return ImGui_SetTabItemClosed(tab_or_docked_window_label.c_str());
}, allow_ptr());

bind_func("ImGui_DockSpaceEx", [](ImGuiID dockspace_id, ImVec2 size, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class){
    return ImGui_DockSpaceEx(dockspace_id, size, flags, window_class);
}, allow_ptr());

bind_func("ImGui_DockSpaceOverViewportEx", [](ImGuiID dockspace_id, const ImGuiViewport* viewport, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class){
    return ImGui_DockSpaceOverViewportEx(dockspace_id, viewport, flags, window_class);
}, allow_ptr());

bind_func("ImGui_SetNextWindowClass", [](const ImGuiWindowClass* window_class){
    return ImGui_SetNextWindowClass(window_class);
}, allow_ptr());

bind_func("ImGui_IsWindowDocked", [](){
    return ImGui_IsWindowDocked();
});

bind_func("ImGui_BeginDisabled", [](bool disabled){
    return ImGui_BeginDisabled(disabled);
});

bind_func("ImGui_EndDisabled", [](){
    return ImGui_EndDisabled();
});

bind_func("ImGui_PushClipRect", [](ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect){
    return ImGui_PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
});

bind_func("ImGui_PopClipRect", [](){
    return ImGui_PopClipRect();
});

bind_func("ImGui_SetItemDefaultFocus", [](){
    return ImGui_SetItemDefaultFocus();
});

bind_func("ImGui_SetKeyboardFocusHereEx", [](int offset){
    return ImGui_SetKeyboardFocusHereEx(offset);
});

bind_func("ImGui_SetNavCursorVisible", [](bool visible){
    return ImGui_SetNavCursorVisible(visible);
});

bind_func("ImGui_SetNextItemAllowOverlap", [](){
    return ImGui_SetNextItemAllowOverlap();
});

bind_func("ImGui_IsItemHovered", [](ImGuiHoveredFlags flags){
    return ImGui_IsItemHovered(flags);
});

bind_func("ImGui_IsItemActive", [](){
    return ImGui_IsItemActive();
});

bind_func("ImGui_IsItemFocused", [](){
    return ImGui_IsItemFocused();
});

bind_func("ImGui_IsItemClickedEx", [](ImGuiMouseButton mouse_button){
    return ImGui_IsItemClickedEx(mouse_button);
});

bind_func("ImGui_IsItemVisible", [](){
    return ImGui_IsItemVisible();
});

bind_func("ImGui_IsItemEdited", [](){
    return ImGui_IsItemEdited();
});

bind_func("ImGui_IsItemActivated", [](){
    return ImGui_IsItemActivated();
});

bind_func("ImGui_IsItemDeactivated", [](){
    return ImGui_IsItemDeactivated();
});

bind_func("ImGui_IsItemDeactivatedAfterEdit", [](){
    return ImGui_IsItemDeactivatedAfterEdit();
});

bind_func("ImGui_IsItemToggledOpen", [](){
    return ImGui_IsItemToggledOpen();
});

bind_func("ImGui_IsAnyItemHovered", [](){
    return ImGui_IsAnyItemHovered();
});

bind_func("ImGui_IsAnyItemActive", [](){
    return ImGui_IsAnyItemActive();
});

bind_func("ImGui_IsAnyItemFocused", [](){
    return ImGui_IsAnyItemFocused();
});

bind_func("ImGui_GetItemRectMin", [](){
    return ImGui_GetItemRectMin();
});

bind_func("ImGui_GetItemRectMax", [](){
    return ImGui_GetItemRectMax();
});

bind_func("ImGui_GetItemRectSize", [](){
    return ImGui_GetItemRectSize();
});

bind_func("ImGui_GetMainViewport", [](){
    return ImGui_GetMainViewport();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetBackgroundDrawListEx", [](ImGuiViewport* viewport){
    return ImGui_GetBackgroundDrawListEx(viewport);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetForegroundDrawListEx", [](ImGuiViewport* viewport){
    return ImGui_GetForegroundDrawListEx(viewport);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_IsRectVisibleBySize", [](ImVec2 size){
    return ImGui_IsRectVisibleBySize(size);
});

bind_func("ImGui_IsRectVisible", [](ImVec2 rect_min, ImVec2 rect_max){
    return ImGui_IsRectVisible(rect_min, rect_max);
});

bind_func("ImGui_GetTime", [](){
    return ImGui_GetTime();
});

bind_func("ImGui_GetFrameCount", [](){
    return ImGui_GetFrameCount();
});

bind_func("ImGui_GetDrawListSharedData", [](){
    return ImGui_GetDrawListSharedData();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetStyleColorName", [](ImGuiCol idx){
    return ImGui_GetStyleColorName(idx);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetStateStorage", [](ImGuiStorage* storage){
    return ImGui_SetStateStorage(storage);
}, allow_ptr());

bind_func("ImGui_GetStateStorage", [](){
    return ImGui_GetStateStorage();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_CalcTextSizeEx", [](std::string text, std::string text_end, bool hide_text_after_double_hash, float wrap_width){
    return ImGui_CalcTextSizeEx(text.c_str(), text_end.c_str(), hide_text_after_double_hash, wrap_width);
}, allow_ptr());

bind_func("ImGui_IsKeyDown", [](ImGuiKey key){
    return ImGui_IsKeyDown(key);
});

bind_func("ImGui_IsKeyPressedEx", [](ImGuiKey key, bool repeat){
    return ImGui_IsKeyPressedEx(key, repeat);
});

bind_func("ImGui_IsKeyReleased", [](ImGuiKey key){
    return ImGui_IsKeyReleased(key);
});

bind_func("ImGui_IsKeyChordPressed", [](ImGuiKeyChord key_chord){
    return ImGui_IsKeyChordPressed(key_chord);
});

bind_func("ImGui_GetKeyPressedAmount", [](ImGuiKey key, float repeat_delay, float rate){
    return ImGui_GetKeyPressedAmount(key, repeat_delay, rate);
});

bind_func("ImGui_GetKeyName", [](ImGuiKey key){
    return ImGui_GetKeyName(key);
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetNextFrameWantCaptureKeyboard", [](bool want_capture_keyboard){
    return ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard);
});

bind_func("ImGui_Shortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags){
    return ImGui_Shortcut(key_chord, flags);
});

bind_func("ImGui_SetNextItemShortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags){
    return ImGui_SetNextItemShortcut(key_chord, flags);
});

bind_func("ImGui_SetItemKeyOwner", [](ImGuiKey key){
    return ImGui_SetItemKeyOwner(key);
});

bind_func("ImGui_IsMouseDown", [](ImGuiMouseButton button){
    return ImGui_IsMouseDown(button);
});

bind_func("ImGui_IsMouseClickedEx", [](ImGuiMouseButton button, bool repeat){
    return ImGui_IsMouseClickedEx(button, repeat);
});

bind_func("ImGui_IsMouseReleased", [](ImGuiMouseButton button){
    return ImGui_IsMouseReleased(button);
});

bind_func("ImGui_IsMouseDoubleClicked", [](ImGuiMouseButton button){
    return ImGui_IsMouseDoubleClicked(button);
});

bind_func("ImGui_GetMouseClickedCount", [](ImGuiMouseButton button){
    return ImGui_GetMouseClickedCount(button);
});

bind_func("ImGui_IsMouseHoveringRectEx", [](ImVec2 r_min, ImVec2 r_max, bool clip){
    return ImGui_IsMouseHoveringRectEx(r_min, r_max, clip);
});

bind_func("ImGui_IsMousePosValid", [](const ImVec2* mouse_pos){
    return ImGui_IsMousePosValid(mouse_pos);
}, allow_ptr());

bind_func("ImGui_IsAnyMouseDown", [](){
    return ImGui_IsAnyMouseDown();
});

bind_func("ImGui_GetMousePos", [](){
    return ImGui_GetMousePos();
});

bind_func("ImGui_GetMousePosOnOpeningCurrentPopup", [](){
    return ImGui_GetMousePosOnOpeningCurrentPopup();
});

bind_func("ImGui_IsMouseDragging", [](ImGuiMouseButton button, float lock_threshold){
    return ImGui_IsMouseDragging(button, lock_threshold);
});

bind_func("ImGui_GetMouseDragDelta", [](ImGuiMouseButton button, float lock_threshold){
    return ImGui_GetMouseDragDelta(button, lock_threshold);
});

bind_func("ImGui_ResetMouseDragDeltaEx", [](ImGuiMouseButton button){
    return ImGui_ResetMouseDragDeltaEx(button);
});

bind_func("ImGui_GetMouseCursor", [](){
    return ImGui_GetMouseCursor();
});

bind_func("ImGui_SetMouseCursor", [](ImGuiMouseCursor cursor_type){
    return ImGui_SetMouseCursor(cursor_type);
});

bind_func("ImGui_SetNextFrameWantCaptureMouse", [](bool want_capture_mouse){
    return ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse);
});

bind_func("ImGui_GetClipboardText", [](){
    return ImGui_GetClipboardText();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_SetClipboardText", [](std::string text){
    return ImGui_SetClipboardText(text.c_str());
}, allow_ptr());

bind_func("ImGui_UpdatePlatformWindows", [](){
    return ImGui_UpdatePlatformWindows();
});


}