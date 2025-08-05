#include <emscripten.h>
#include <emscripten/bind.h>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_internal.h>

#include <vector>
#include <string>

constexpr auto allow_ptr() { return emscripten::allow_raw_pointers(); }

constexpr auto return_ref() {
  return emscripten::return_value_policy::reference();
}

template <typename Func, typename... Args, typename... Policies>
constexpr void bind_func(const std::string &name, Func &&func, Policies &&...policies) {
    return emscripten::function(name.c_str(), emscripten::optional_override(std::forward<Func>(func)), std::forward<Policies>(policies)...);
}

template <typename Struct> constexpr auto bind_struct(const std::string &name) {
  return emscripten::class_<Struct>(name.c_str());
}

template <typename Func> constexpr auto override(Func &&func) {
  return emscripten::optional_override(std::forward<Func>(func));
}

#define bind_ctor() .constructor<>()

#define bind_prop(className, name, type) \
    .function("get_"#name , override([](const className& self){ return self.name; }), return_ref(), allow_ptr()) \
    .function("set_"#name , override([](className& self, type value){ self.name = value; }), allow_ptr())

    // bind_prop(ImVec2, x, float)
    // Should expand to:
    //  .function("get_x", override([](const ImVec2& self){ return self.x; }))
    // .function("set_x", override([](ImVec2& self, float value){ self.x = value; }))

#define bind_prop_str(class, name) \
    .function("get_"#name, override([](const class& self){ return std::string(self.name); })) \
    .function("set_"#name, override([](class& self, std::string value){ self.name = value.c_str(); }))

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

            for (int i = 0; i < length; ++i) {
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


template<typename T>
std::vector<T> toNativeArray(const emscripten::val& js_value) {
    if (js_value.isNull() || js_value.isUndefined() || !js_value.isArray()) {
        return std::vector<T>();
    }

    size_t length = js_value["length"].as<size_t>();
    std::vector<T> value;
    value.reserve(length);

    for (size_t i = 0; i < length; ++i) {
        value.push_back(js_value[i].as<T>());
    }

    return value;
}

template<typename T>
void updateJsArray(emscripten::val& js_value, T* array) {
    size_t length = js_value["length"].as<size_t>();
    for (size_t i = 0; i < length; ++i) {
        js_value.set(i, array[i]);
    }
}

// bool* getJsBool(emscripten::val& js_value) {
//     bool val = js_value[0].as<bool>();
//     return &val;
// }

void updateJsBool(emscripten::val& js_value, bool* b) {
    js_value.set(0, *b);
}



void modify_int_array(int* array) {
    for (int i = 0; i < 3; i++) {
        array[i] *= 2;
    }
}

void modify_bool_ptr(bool* ptr) {
    *ptr = false;
}

void test_func(emscripten::val v) {
    auto v_bind = toNativeArray<int>(v);

    modify_int_array(v_bind.data());

    updateJsArray(v, v_bind.data());

    //return v_bind;
};

EMSCRIPTEN_BINDINGS(manual) {

    bind_func("test_func", [](emscripten::val v){
        return test_func(v);
    }, allow_ptr());

    /* OpenGL3 Backend */

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

    /* Manual wrapped structs */

    /* ImVec2 */

    bind_struct<ImVec2>("ImVec2")
    bind_ctor()
    bind_prop(ImVec2, x, float)
    bind_prop(ImVec2, y, float)
    ;

    /* ImVec4 */

    bind_struct<ImVec4>("ImVec4")
    bind_ctor()
    bind_prop(ImVec4, x, float)
    bind_prop(ImVec4, y, float)
    bind_prop(ImVec4, z, float)
    bind_prop(ImVec4, w, float)
    ;

    /* ImGuiIO */

    bind_struct<ImGuiIO>("ImGuiIO")
    bind_ctor()
    bind_prop(ImGuiIO, ConfigFlags, ImGuiConfigFlags)
    bind_prop(ImGuiIO, BackendFlags, ImGuiBackendFlags)
    bind_prop(ImGuiIO, DisplaySize, ImVec2)
    bind_prop(ImGuiIO, DeltaTime, float)
    bind_prop(ImGuiIO, IniSavingRate, float)
    bind_prop_str(ImGuiIO, IniFilename)
    bind_prop_str(ImGuiIO, LogFilename)
    //bind_prop(ImGuiIO, UserData, void*)

    // Font system
    bind_prop(ImGuiIO, Fonts, ImFontAtlas*)
    bind_prop(ImGuiIO, FontGlobalScale, float)
    bind_prop(ImGuiIO, FontAllowUserScaling, bool)
    bind_prop(ImGuiIO, FontDefault, ImFont*)
    bind_prop(ImGuiIO, DisplayFramebufferScale, ImVec2)

    // Keyboard/Gamepad Navigation options
    bind_prop(ImGuiIO, ConfigNavSwapGamepadButtons, bool)
    bind_prop(ImGuiIO, ConfigNavMoveSetMousePos, bool)
    bind_prop(ImGuiIO, ConfigNavCaptureKeyboard, bool)
    bind_prop(ImGuiIO, ConfigNavEscapeClearFocusItem, bool)
    bind_prop(ImGuiIO, ConfigNavEscapeClearFocusWindow, bool)
    bind_prop(ImGuiIO, ConfigNavCursorVisibleAuto, bool)
    bind_prop(ImGuiIO, ConfigNavCursorVisibleAlways, bool)

    // Miscellaneous options
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

    // Inputs Behaviors
    bind_prop(ImGuiIO, MouseDoubleClickTime, float)
    bind_prop(ImGuiIO, MouseDoubleClickMaxDist, float)
    bind_prop(ImGuiIO, MouseDragThreshold, float)
    bind_prop(ImGuiIO, KeyRepeatDelay, float)
    bind_prop(ImGuiIO, KeyRepeatRate, float)

    // Input
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

    // Member functions
    .function("ImGuiIO_AddKeyEvent", &ImGuiIO_AddKeyEvent, allow_ptr())
    .function("ImGuiIO_AddKeyAnalogEvent", &ImGuiIO_AddKeyAnalogEvent, allow_ptr())
    .function("ImGuiIO_AddMousePosEvent", &ImGuiIO_AddMousePosEvent, allow_ptr())
    .function("ImGuiIO_AddMouseButtonEvent", &ImGuiIO_AddMouseButtonEvent, allow_ptr())
    .function("ImGuiIO_AddMouseWheelEvent", &ImGuiIO_AddMouseWheelEvent, allow_ptr())
    .function("ImGuiIO_AddMouseSourceEvent", &ImGuiIO_AddMouseSourceEvent, allow_ptr())
    .function("ImGuiIO_AddFocusEvent", &ImGuiIO_AddFocusEvent, allow_ptr())
    .function("ImGuiIO_AddInputCharacter", &ImGuiIO_AddInputCharacter, allow_ptr())
    .function("ImGuiIO_AddInputCharacterUTF16", &ImGuiIO_AddInputCharacterUTF16, allow_ptr())
    .function("ImGuiIO_AddInputCharactersUTF8", override([](ImGuiIO& self, std::string value){
        ImGuiIO_AddInputCharactersUTF8(&self, value.c_str());
    }), allow_ptr())
    .function("ImGuiIO_SetKeyEventNativeData", &ImGuiIO_SetKeyEventNativeData, allow_ptr())
    .function("ImGuiIO_SetKeyEventNativeDataEx", &ImGuiIO_SetKeyEventNativeDataEx, allow_ptr())
    .function("ImGuiIO_SetAppAcceptingEvents", &ImGuiIO_SetAppAcceptingEvents, allow_ptr())
    .function("ImGuiIO_ClearEventsQueue", &ImGuiIO_ClearEventsQueue, allow_ptr())
    .function("ImGuiIO_ClearInputKeys", &ImGuiIO_ClearInputKeys, allow_ptr())
    .function("ImGuiIO_ClearInputMouse", &ImGuiIO_ClearInputMouse, allow_ptr())
    ;

    /* ImGuiStyle */

    bind_struct<ImGuiStyle>("ImGuiStyle")
    bind_ctor()
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
    bind_prop(ImGuiStyle, MouseCursorScale, float)
    bind_prop(ImGuiStyle, AntiAliasedLines, bool)
    bind_prop(ImGuiStyle, AntiAliasedLinesUseTex, bool)
    bind_prop(ImGuiStyle, AntiAliasedFill, bool)
    bind_prop(ImGuiStyle, CurveTessellationTol, float)
    bind_prop(ImGuiStyle, CircleTessellationMaxError, float)
    //bind_prop(ImGuiStyle, Colors, ImVec4)

    // Member functions
    .function("ImGuiStyle_ScaleAllSizes", &ImGuiStyle_ScaleAllSizes, allow_ptr())
    ;

    /* Manual wrapped functions */

    /* Struct access */

    bind_func("ImGui_GetIO", [](){
        return ImGui_GetIO();
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetStyle", [](){
        return ImGui_GetStyle();
    }, return_ref(), allow_ptr());

    /* Widgets Text */

    bind_func("ImGui_Text", [](std::string fmt){
        ImGui_Text("%s", fmt.c_str());
    });

    bind_func("ImGui_TextColored", [](ImVec4 col, std::string fmt){
        ImGui_TextColored(col, "%s", fmt.c_str());
    });

    bind_func("ImGui_TextDisabled", [](std::string fmt){
        ImGui_TextDisabled("%s", fmt.c_str());
    });

    bind_func("ImGui_TextWrapped", [](std::string fmt){
        ImGui_TextWrapped("%s", fmt.c_str());
    });

    bind_func("ImGui_LabelText", [](std::string label, std::string fmt){
        ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
    });

    bind_func("ImGui_BulletText", [](std::string fmt){
        ImGui_BulletText("%s", fmt.c_str());
    });

    bind_func("ImGui_SeparatorText", [](std::string label){
        ImGui_SeparatorText(label.c_str());
    });

}

/* -------------------------------------------------------------------------- */
/* AUTO-GENERATED BINDINGS */
/* -------------------------------------------------------------------------- */

EMSCRIPTEN_BINDINGS(generated) {
    bind_struct<ImDrawListSharedData>("ImDrawListSharedData")
    bind_ctor()
    ;

    bind_struct<ImGuiContext>("ImGuiContext")
    bind_ctor()
    ;

    bind_struct<ImGuiTableSortSpecs>("ImGuiTableSortSpecs")
    bind_ctor()
    ;

    bind_struct<ImGuiTableColumnSortSpecs>("ImGuiTableColumnSortSpecs")
    bind_ctor()
    ;

    bind_struct<ImGuiStorage>("ImGuiStorage")
    bind_ctor()
    ;

    bind_struct<ImGuiMultiSelectIO>("ImGuiMultiSelectIO")
    bind_ctor()
    ;

    bind_struct<ImDrawList>("ImDrawList")
    bind_ctor()
    ;

    bind_struct<ImDrawData>("ImDrawData")
    bind_ctor()
    ;

    bind_struct<ImFontAtlas>("ImFontAtlas")
    bind_ctor()
    ;

    bind_struct<ImFont>("ImFont")
    bind_ctor()
    ;

    bind_struct<ImGuiViewport>("ImGuiViewport")
    bind_ctor()
    ;

    bind_struct<ImGuiPlatformIO>("ImGuiPlatformIO")
    bind_ctor()
    ;


    bind_func("ImGui_CreateContext", [](ImFontAtlas* shared_font_atlas){
        const auto ret = ImGui_CreateContext(shared_font_atlas);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_DestroyContext", [](ImGuiContext* ctx){
        ImGui_DestroyContext(ctx);
    }, allow_ptr());

    bind_func("ImGui_GetCurrentContext", [](){
        const auto ret = ImGui_GetCurrentContext();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_SetCurrentContext", [](ImGuiContext* ctx){
        ImGui_SetCurrentContext(ctx);
    }, allow_ptr());

    bind_func("ImGui_GetPlatformIO", [](){
        const auto ret = ImGui_GetPlatformIO();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_NewFrame", [](){
        ImGui_NewFrame();
    });

    bind_func("ImGui_EndFrame", [](){
        ImGui_EndFrame();
    });

    bind_func("ImGui_Render", [](){
        ImGui_Render();
    });

    bind_func("ImGui_GetDrawData", [](){
        const auto ret = ImGui_GetDrawData();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_ShowDemoWindow", [](emscripten::val p_open){
        auto p_open_bind = ArrayParam<bool>(p_open);
        ImGui_ShowDemoWindow(&p_open_bind);
    }, allow_ptr());

    bind_func("ImGui_ShowMetricsWindow", [](emscripten::val p_open){
        auto p_open_bind = ArrayParam<bool>(p_open);
        ImGui_ShowMetricsWindow(&p_open_bind);
    }, allow_ptr());

    bind_func("ImGui_ShowDebugLogWindow", [](emscripten::val p_open){
        auto p_open_bind = ArrayParam<bool>(p_open);
        ImGui_ShowDebugLogWindow(&p_open_bind);
    }, allow_ptr());

    bind_func("ImGui_ShowIDStackToolWindowEx", [](emscripten::val p_open){
        auto p_open_bind = ArrayParam<bool>(p_open);
        ImGui_ShowIDStackToolWindowEx(&p_open_bind);
    }, allow_ptr());

    bind_func("ImGui_ShowAboutWindow", [](emscripten::val p_open){
        auto p_open_bind = ArrayParam<bool>(p_open);
        ImGui_ShowAboutWindow(&p_open_bind);
    }, allow_ptr());

    bind_func("ImGui_ShowStyleEditor", [](ImGuiStyle* ref){
        ImGui_ShowStyleEditor(ref);
    }, allow_ptr());

    bind_func("ImGui_ShowStyleSelector", [](std::string label){
        const auto ret = ImGui_ShowStyleSelector(label.c_str());
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ShowFontSelector", [](std::string label){
        ImGui_ShowFontSelector(label.c_str());
    }, allow_ptr());

    bind_func("ImGui_ShowUserGuide", [](){
        ImGui_ShowUserGuide();
    });

    bind_func("ImGui_GetVersion", [](){
        const auto ret = ImGui_GetVersion();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_StyleColorsDark", [](ImGuiStyle* dst){
        ImGui_StyleColorsDark(dst);
    }, allow_ptr());

    bind_func("ImGui_StyleColorsLight", [](ImGuiStyle* dst){
        ImGui_StyleColorsLight(dst);
    }, allow_ptr());

    bind_func("ImGui_StyleColorsClassic", [](ImGuiStyle* dst){
        ImGui_StyleColorsClassic(dst);
    }, allow_ptr());

    bind_func("ImGui_Begin", [](std::string name, emscripten::val p_open, ImGuiWindowFlags flags){
        auto p_open_bind = ArrayParam<bool>(p_open);
        const auto ret = ImGui_Begin(name.c_str(), &p_open_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_End", [](){
        ImGui_End();
    });

    bind_func("ImGui_BeginChild", [](std::string str_id, ImVec2 size, ImGuiChildFlags child_flags, ImGuiWindowFlags window_flags){
        const auto ret = ImGui_BeginChild(str_id.c_str(), size, child_flags, window_flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndChild", [](){
        ImGui_EndChild();
    });

    bind_func("ImGui_IsWindowAppearing", [](){
        const auto ret = ImGui_IsWindowAppearing();
        return ret;
    });

    bind_func("ImGui_IsWindowCollapsed", [](){
        const auto ret = ImGui_IsWindowCollapsed();
        return ret;
    });

    bind_func("ImGui_IsWindowFocused", [](ImGuiFocusedFlags flags){
        const auto ret = ImGui_IsWindowFocused(flags);
        return ret;
    });

    bind_func("ImGui_IsWindowHovered", [](ImGuiHoveredFlags flags){
        const auto ret = ImGui_IsWindowHovered(flags);
        return ret;
    });

    bind_func("ImGui_GetWindowDrawList", [](){
        const auto ret = ImGui_GetWindowDrawList();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetWindowDpiScale", [](){
        const auto ret = ImGui_GetWindowDpiScale();
        return ret;
    });

    bind_func("ImGui_GetWindowPos", [](){
        const auto ret = ImGui_GetWindowPos();
        return ret;
    });

    bind_func("ImGui_GetWindowSize", [](){
        const auto ret = ImGui_GetWindowSize();
        return ret;
    });

    bind_func("ImGui_GetWindowWidth", [](){
        const auto ret = ImGui_GetWindowWidth();
        return ret;
    });

    bind_func("ImGui_GetWindowHeight", [](){
        const auto ret = ImGui_GetWindowHeight();
        return ret;
    });

    bind_func("ImGui_GetWindowViewport", [](){
        const auto ret = ImGui_GetWindowViewport();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_SetNextWindowPosEx", [](ImVec2 pos, ImGuiCond cond, ImVec2 pivot){
        ImGui_SetNextWindowPosEx(pos, cond, pivot);
    });

    bind_func("ImGui_SetNextWindowSize", [](ImVec2 size, ImGuiCond cond){
        ImGui_SetNextWindowSize(size, cond);
    });

    bind_func("ImGui_SetNextWindowContentSize", [](ImVec2 size){
        ImGui_SetNextWindowContentSize(size);
    });

    bind_func("ImGui_SetNextWindowCollapsed", [](bool collapsed, ImGuiCond cond){
        ImGui_SetNextWindowCollapsed(collapsed, cond);
    });

    bind_func("ImGui_SetNextWindowFocus", [](){
        ImGui_SetNextWindowFocus();
    });

    bind_func("ImGui_SetNextWindowScroll", [](ImVec2 scroll){
        ImGui_SetNextWindowScroll(scroll);
    });

    bind_func("ImGui_SetNextWindowBgAlpha", [](float alpha){
        ImGui_SetNextWindowBgAlpha(alpha);
    });

    bind_func("ImGui_SetNextWindowViewport", [](ImGuiID viewport_id){
        ImGui_SetNextWindowViewport(viewport_id);
    });

    bind_func("ImGui_SetWindowPos", [](ImVec2 pos, ImGuiCond cond){
        ImGui_SetWindowPos(pos, cond);
    });

    bind_func("ImGui_SetWindowSize", [](ImVec2 size, ImGuiCond cond){
        ImGui_SetWindowSize(size, cond);
    });

    bind_func("ImGui_SetWindowCollapsed", [](bool collapsed, ImGuiCond cond){
        ImGui_SetWindowCollapsed(collapsed, cond);
    });

    bind_func("ImGui_SetWindowFocus", [](){
        ImGui_SetWindowFocus();
    });

    bind_func("ImGui_SetWindowFontScale", [](float scale){
        ImGui_SetWindowFontScale(scale);
    });

    bind_func("ImGui_GetScrollX", [](){
        const auto ret = ImGui_GetScrollX();
        return ret;
    });

    bind_func("ImGui_GetScrollY", [](){
        const auto ret = ImGui_GetScrollY();
        return ret;
    });

    bind_func("ImGui_SetScrollX", [](float scroll_x){
        ImGui_SetScrollX(scroll_x);
    });

    bind_func("ImGui_SetScrollY", [](float scroll_y){
        ImGui_SetScrollY(scroll_y);
    });

    bind_func("ImGui_GetScrollMaxX", [](){
        const auto ret = ImGui_GetScrollMaxX();
        return ret;
    });

    bind_func("ImGui_GetScrollMaxY", [](){
        const auto ret = ImGui_GetScrollMaxY();
        return ret;
    });

    bind_func("ImGui_SetScrollHereX", [](float center_x_ratio){
        ImGui_SetScrollHereX(center_x_ratio);
    });

    bind_func("ImGui_SetScrollHereY", [](float center_y_ratio){
        ImGui_SetScrollHereY(center_y_ratio);
    });

    bind_func("ImGui_SetScrollFromPosX", [](float local_x, float center_x_ratio){
        ImGui_SetScrollFromPosX(local_x, center_x_ratio);
    });

    bind_func("ImGui_SetScrollFromPosY", [](float local_y, float center_y_ratio){
        ImGui_SetScrollFromPosY(local_y, center_y_ratio);
    });

    bind_func("ImGui_PushFont", [](ImFont* font){
        ImGui_PushFont(font);
    }, allow_ptr());

    bind_func("ImGui_PopFont", [](){
        ImGui_PopFont();
    });

    bind_func("ImGui_PushStyleColor", [](ImGuiCol idx, ImU32 col){
        ImGui_PushStyleColor(idx, col);
    });

    bind_func("ImGui_PopStyleColorEx", [](int count){
        ImGui_PopStyleColorEx(count);
    });

    bind_func("ImGui_PushStyleVar", [](ImGuiStyleVar idx, float val){
        ImGui_PushStyleVar(idx, val);
    });

    bind_func("ImGui_PushStyleVarX", [](ImGuiStyleVar idx, float val_x){
        ImGui_PushStyleVarX(idx, val_x);
    });

    bind_func("ImGui_PushStyleVarY", [](ImGuiStyleVar idx, float val_y){
        ImGui_PushStyleVarY(idx, val_y);
    });

    bind_func("ImGui_PopStyleVarEx", [](int count){
        ImGui_PopStyleVarEx(count);
    });

    bind_func("ImGui_PushItemFlag", [](ImGuiItemFlags option, bool enabled){
        ImGui_PushItemFlag(option, enabled);
    });

    bind_func("ImGui_PopItemFlag", [](){
        ImGui_PopItemFlag();
    });

    bind_func("ImGui_PushItemWidth", [](float item_width){
        ImGui_PushItemWidth(item_width);
    });

    bind_func("ImGui_PopItemWidth", [](){
        ImGui_PopItemWidth();
    });

    bind_func("ImGui_SetNextItemWidth", [](float item_width){
        ImGui_SetNextItemWidth(item_width);
    });

    bind_func("ImGui_CalcItemWidth", [](){
        const auto ret = ImGui_CalcItemWidth();
        return ret;
    });

    bind_func("ImGui_PushTextWrapPos", [](float wrap_local_pos_x){
        ImGui_PushTextWrapPos(wrap_local_pos_x);
    });

    bind_func("ImGui_PopTextWrapPos", [](){
        ImGui_PopTextWrapPos();
    });

    bind_func("ImGui_GetFont", [](){
        const auto ret = ImGui_GetFont();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetFontSize", [](){
        const auto ret = ImGui_GetFontSize();
        return ret;
    });

    bind_func("ImGui_GetFontTexUvWhitePixel", [](){
        const auto ret = ImGui_GetFontTexUvWhitePixel();
        return ret;
    });

    bind_func("ImGui_GetStyleColorVec4", [](ImGuiCol idx){
        const auto ret = ImGui_GetStyleColorVec4(idx);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetCursorScreenPos", [](){
        const auto ret = ImGui_GetCursorScreenPos();
        return ret;
    });

    bind_func("ImGui_SetCursorScreenPos", [](ImVec2 pos){
        ImGui_SetCursorScreenPos(pos);
    });

    bind_func("ImGui_GetContentRegionAvail", [](){
        const auto ret = ImGui_GetContentRegionAvail();
        return ret;
    });

    bind_func("ImGui_GetCursorPos", [](){
        const auto ret = ImGui_GetCursorPos();
        return ret;
    });

    bind_func("ImGui_GetCursorPosX", [](){
        const auto ret = ImGui_GetCursorPosX();
        return ret;
    });

    bind_func("ImGui_GetCursorPosY", [](){
        const auto ret = ImGui_GetCursorPosY();
        return ret;
    });

    bind_func("ImGui_SetCursorPos", [](ImVec2 local_pos){
        ImGui_SetCursorPos(local_pos);
    });

    bind_func("ImGui_SetCursorPosX", [](float local_x){
        ImGui_SetCursorPosX(local_x);
    });

    bind_func("ImGui_SetCursorPosY", [](float local_y){
        ImGui_SetCursorPosY(local_y);
    });

    bind_func("ImGui_GetCursorStartPos", [](){
        const auto ret = ImGui_GetCursorStartPos();
        return ret;
    });

    bind_func("ImGui_Separator", [](){
        ImGui_Separator();
    });

    bind_func("ImGui_SameLineEx", [](float offset_from_start_x, float spacing){
        ImGui_SameLineEx(offset_from_start_x, spacing);
    });

    bind_func("ImGui_NewLine", [](){
        ImGui_NewLine();
    });

    bind_func("ImGui_Spacing", [](){
        ImGui_Spacing();
    });

    bind_func("ImGui_Dummy", [](ImVec2 size){
        ImGui_Dummy(size);
    });

    bind_func("ImGui_IndentEx", [](float indent_w){
        ImGui_IndentEx(indent_w);
    });

    bind_func("ImGui_UnindentEx", [](float indent_w){
        ImGui_UnindentEx(indent_w);
    });

    bind_func("ImGui_BeginGroup", [](){
        ImGui_BeginGroup();
    });

    bind_func("ImGui_EndGroup", [](){
        ImGui_EndGroup();
    });

    bind_func("ImGui_AlignTextToFramePadding", [](){
        ImGui_AlignTextToFramePadding();
    });

    bind_func("ImGui_GetTextLineHeight", [](){
        const auto ret = ImGui_GetTextLineHeight();
        return ret;
    });

    bind_func("ImGui_GetTextLineHeightWithSpacing", [](){
        const auto ret = ImGui_GetTextLineHeightWithSpacing();
        return ret;
    });

    bind_func("ImGui_GetFrameHeight", [](){
        const auto ret = ImGui_GetFrameHeight();
        return ret;
    });

    bind_func("ImGui_GetFrameHeightWithSpacing", [](){
        const auto ret = ImGui_GetFrameHeightWithSpacing();
        return ret;
    });

    bind_func("ImGui_PushID", [](std::string str_id){
        ImGui_PushID(str_id.c_str());
    }, allow_ptr());

    bind_func("ImGui_PopID", [](){
        ImGui_PopID();
    });

    bind_func("ImGui_GetID", [](std::string str_id){
        const auto ret = ImGui_GetID(str_id.c_str());
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ButtonEx", [](std::string label, ImVec2 size){
        const auto ret = ImGui_ButtonEx(label.c_str(), size);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SmallButton", [](std::string label){
        const auto ret = ImGui_SmallButton(label.c_str());
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InvisibleButton", [](std::string str_id, ImVec2 size, ImGuiButtonFlags flags){
        const auto ret = ImGui_InvisibleButton(str_id.c_str(), size, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ArrowButton", [](std::string str_id, ImGuiDir dir){
        const auto ret = ImGui_ArrowButton(str_id.c_str(), dir);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_Checkbox", [](std::string label, emscripten::val v){
        auto v_bind = ArrayParam<bool>(v);
        const auto ret = ImGui_Checkbox(label.c_str(), &v_bind);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_RadioButton", [](std::string label, bool active){
        const auto ret = ImGui_RadioButton(label.c_str(), active);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ProgressBar", [](float fraction, ImVec2 size_arg, std::string overlay){
        ImGui_ProgressBar(fraction, size_arg, overlay.c_str());
    }, allow_ptr());

    bind_func("ImGui_Bullet", [](){
        ImGui_Bullet();
    });

    bind_func("ImGui_TextLink", [](std::string label){
        const auto ret = ImGui_TextLink(label.c_str());
        return ret;
    }, allow_ptr());

    bind_func("ImGui_TextLinkOpenURLEx", [](std::string label, std::string url){
        ImGui_TextLinkOpenURLEx(label.c_str(), url.c_str());
    }, allow_ptr());

    bind_func("ImGui_ImageEx", [](ImTextureID user_texture_id, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 tint_col, ImVec4 border_col){
        ImGui_ImageEx(user_texture_id, image_size, uv0, uv1, tint_col, border_col);
    });

    bind_func("ImGui_ImageButtonEx", [](std::string str_id, ImTextureID user_texture_id, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col){
        const auto ret = ImGui_ImageButtonEx(str_id.c_str(), user_texture_id, image_size, uv0, uv1, bg_col, tint_col);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginCombo", [](std::string label, std::string preview_value, ImGuiComboFlags flags){
        const auto ret = ImGui_BeginCombo(label.c_str(), preview_value.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndCombo", [](){
        ImGui_EndCombo();
    });

    bind_func("ImGui_ComboEx", [](std::string label, emscripten::val current_item, std::string items_separated_by_zeros, int popup_max_height_in_items){
        auto current_item_bind = ArrayParam<int>(current_item);
        const auto ret = ImGui_ComboEx(label.c_str(), &current_item_bind, items_separated_by_zeros.c_str(), popup_max_height_in_items);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragFloatEx", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_DragFloatEx(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragFloat2Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_DragFloat2Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragFloat3Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_DragFloat3Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragFloat4Ex", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_DragFloat4Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragFloatRange2Ex", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, float v_min, float v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
        auto v_current_min_bind = ArrayParam<float>(v_current_min);
        auto v_current_max_bind = ArrayParam<float>(v_current_max);
        const auto ret = ImGui_DragFloatRange2Ex(label.c_str(), &v_current_min_bind, &v_current_max_bind, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragInt2Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_DragInt2Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragInt3Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_DragInt3Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragInt4Ex", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_DragInt4Ex(label.c_str(), &v_bind, v_speed, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DragIntRange2Ex", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, int v_min, int v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
        auto v_current_min_bind = ArrayParam<int>(v_current_min);
        auto v_current_max_bind = ArrayParam<int>(v_current_max);
        const auto ret = ImGui_DragIntRange2Ex(label.c_str(), &v_current_min_bind, &v_current_max_bind, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderFloatEx", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_SliderFloatEx(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderFloat2Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_SliderFloat2Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderFloat3Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_SliderFloat3Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderFloat4Ex", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_SliderFloat4Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderAngleEx", [](std::string label, emscripten::val v_rad, float v_degrees_min, float v_degrees_max, std::string format, ImGuiSliderFlags flags){
        auto v_rad_bind = ArrayParam<float>(v_rad);
        const auto ret = ImGui_SliderAngleEx(label.c_str(), &v_rad_bind, v_degrees_min, v_degrees_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderInt2Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_SliderInt2Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderInt3Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_SliderInt3Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SliderInt4Ex", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_SliderInt4Ex(label.c_str(), &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_VSliderFloatEx", [](std::string label, ImVec2 size, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_VSliderFloatEx(label.c_str(), size, &v_bind, v_min, v_max, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputFloatEx", [](std::string label, emscripten::val v, float step, float step_fast, std::string format, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_InputFloatEx(label.c_str(), &v_bind, step, step_fast, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputFloat2Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_InputFloat2Ex(label.c_str(), &v_bind, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputFloat3Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_InputFloat3Ex(label.c_str(), &v_bind, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputFloat4Ex", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<float>(v);
        const auto ret = ImGui_InputFloat4Ex(label.c_str(), &v_bind, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputInt2", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_InputInt2(label.c_str(), &v_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputInt3", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_InputInt3(label.c_str(), &v_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputInt4", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<int>(v);
        const auto ret = ImGui_InputInt4(label.c_str(), &v_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_InputDoubleEx", [](std::string label, emscripten::val v, double step, double step_fast, std::string format, ImGuiInputTextFlags flags){
        auto v_bind = ArrayParam<double>(v);
        const auto ret = ImGui_InputDoubleEx(label.c_str(), &v_bind, step, step_fast, format.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ColorEdit3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
        auto col_bind = ArrayParam<float>(col);
        const auto ret = ImGui_ColorEdit3(label.c_str(), &col_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ColorEdit4", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
        auto col_bind = ArrayParam<float>(col);
        const auto ret = ImGui_ColorEdit4(label.c_str(), &col_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ColorPicker3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
        auto col_bind = ArrayParam<float>(col);
        const auto ret = ImGui_ColorPicker3(label.c_str(), &col_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_ColorButtonEx", [](std::string desc_id, ImVec4 col, ImGuiColorEditFlags flags, ImVec2 size){
        const auto ret = ImGui_ColorButtonEx(desc_id.c_str(), col, flags, size);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SetColorEditOptions", [](ImGuiColorEditFlags flags){
        ImGui_SetColorEditOptions(flags);
    });

    bind_func("ImGui_TreeNodeEx", [](std::string label, ImGuiTreeNodeFlags flags){
        const auto ret = ImGui_TreeNodeEx(label.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_TreePush", [](std::string str_id){
        ImGui_TreePush(str_id.c_str());
    }, allow_ptr());

    bind_func("ImGui_TreePop", [](){
        ImGui_TreePop();
    });

    bind_func("ImGui_GetTreeNodeToLabelSpacing", [](){
        const auto ret = ImGui_GetTreeNodeToLabelSpacing();
        return ret;
    });

    bind_func("ImGui_CollapsingHeader", [](std::string label, ImGuiTreeNodeFlags flags){
        const auto ret = ImGui_CollapsingHeader(label.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SetNextItemOpen", [](bool is_open, ImGuiCond cond){
        ImGui_SetNextItemOpen(is_open, cond);
    });

    bind_func("ImGui_SelectableEx", [](std::string label, bool selected, ImGuiSelectableFlags flags, ImVec2 size){
        const auto ret = ImGui_SelectableEx(label.c_str(), selected, flags, size);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginMultiSelectEx", [](ImGuiMultiSelectFlags flags, int selection_size, int items_count){
        const auto ret = ImGui_BeginMultiSelectEx(flags, selection_size, items_count);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_EndMultiSelect", [](){
        const auto ret = ImGui_EndMultiSelect();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_SetNextItemSelectionUserData", [](ImGuiSelectionUserData selection_user_data){
        ImGui_SetNextItemSelectionUserData(selection_user_data);
    });

    bind_func("ImGui_IsItemToggledSelection", [](){
        const auto ret = ImGui_IsItemToggledSelection();
        return ret;
    });

    bind_func("ImGui_BeginListBox", [](std::string label, ImVec2 size){
        const auto ret = ImGui_BeginListBox(label.c_str(), size);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndListBox", [](){
        ImGui_EndListBox();
    });

    bind_func("ImGui_BeginMenuBar", [](){
        const auto ret = ImGui_BeginMenuBar();
        return ret;
    });

    bind_func("ImGui_EndMenuBar", [](){
        ImGui_EndMenuBar();
    });

    bind_func("ImGui_BeginMainMenuBar", [](){
        const auto ret = ImGui_BeginMainMenuBar();
        return ret;
    });

    bind_func("ImGui_EndMainMenuBar", [](){
        ImGui_EndMainMenuBar();
    });

    bind_func("ImGui_BeginMenuEx", [](std::string label, bool enabled){
        const auto ret = ImGui_BeginMenuEx(label.c_str(), enabled);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndMenu", [](){
        ImGui_EndMenu();
    });

    bind_func("ImGui_MenuItemEx", [](std::string label, std::string shortcut, bool selected, bool enabled){
        const auto ret = ImGui_MenuItemEx(label.c_str(), shortcut.c_str(), selected, enabled);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginTooltip", [](){
        const auto ret = ImGui_BeginTooltip();
        return ret;
    });

    bind_func("ImGui_EndTooltip", [](){
        ImGui_EndTooltip();
    });

    bind_func("ImGui_BeginItemTooltip", [](){
        const auto ret = ImGui_BeginItemTooltip();
        return ret;
    });

    bind_func("ImGui_BeginPopup", [](std::string str_id, ImGuiWindowFlags flags){
        const auto ret = ImGui_BeginPopup(str_id.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginPopupModal", [](std::string name, emscripten::val p_open, ImGuiWindowFlags flags){
        auto p_open_bind = ArrayParam<bool>(p_open);
        const auto ret = ImGui_BeginPopupModal(name.c_str(), &p_open_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndPopup", [](){
        ImGui_EndPopup();
    });

    bind_func("ImGui_OpenPopup", [](std::string str_id, ImGuiPopupFlags popup_flags){
        ImGui_OpenPopup(str_id.c_str(), popup_flags);
    }, allow_ptr());

    bind_func("ImGui_OpenPopupOnItemClick", [](std::string str_id, ImGuiPopupFlags popup_flags){
        ImGui_OpenPopupOnItemClick(str_id.c_str(), popup_flags);
    }, allow_ptr());

    bind_func("ImGui_CloseCurrentPopup", [](){
        ImGui_CloseCurrentPopup();
    });

    bind_func("ImGui_BeginPopupContextItemEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
        const auto ret = ImGui_BeginPopupContextItemEx(str_id.c_str(), popup_flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginPopupContextWindowEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
        const auto ret = ImGui_BeginPopupContextWindowEx(str_id.c_str(), popup_flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginPopupContextVoidEx", [](std::string str_id, ImGuiPopupFlags popup_flags){
        const auto ret = ImGui_BeginPopupContextVoidEx(str_id.c_str(), popup_flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_IsPopupOpen", [](std::string str_id, ImGuiPopupFlags flags){
        const auto ret = ImGui_IsPopupOpen(str_id.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_BeginTableEx", [](std::string str_id, int columns, ImGuiTableFlags flags, ImVec2 outer_size, float inner_width){
        const auto ret = ImGui_BeginTableEx(str_id.c_str(), columns, flags, outer_size, inner_width);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndTable", [](){
        ImGui_EndTable();
    });

    bind_func("ImGui_TableNextRowEx", [](ImGuiTableRowFlags row_flags, float min_row_height){
        ImGui_TableNextRowEx(row_flags, min_row_height);
    });

    bind_func("ImGui_TableNextColumn", [](){
        const auto ret = ImGui_TableNextColumn();
        return ret;
    });

    bind_func("ImGui_TableSetColumnIndex", [](int column_n){
        const auto ret = ImGui_TableSetColumnIndex(column_n);
        return ret;
    });

    bind_func("ImGui_TableSetupColumnEx", [](std::string label, ImGuiTableColumnFlags flags, float init_width_or_weight, ImGuiID user_id){
        ImGui_TableSetupColumnEx(label.c_str(), flags, init_width_or_weight, user_id);
    }, allow_ptr());

    bind_func("ImGui_TableSetupScrollFreeze", [](int cols, int rows){
        ImGui_TableSetupScrollFreeze(cols, rows);
    });

    bind_func("ImGui_TableHeader", [](std::string label){
        ImGui_TableHeader(label.c_str());
    }, allow_ptr());

    bind_func("ImGui_TableHeadersRow", [](){
        ImGui_TableHeadersRow();
    });

    bind_func("ImGui_TableAngledHeadersRow", [](){
        ImGui_TableAngledHeadersRow();
    });

    bind_func("ImGui_TableGetSortSpecs", [](){
        const auto ret = ImGui_TableGetSortSpecs();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_TableGetColumnCount", [](){
        const auto ret = ImGui_TableGetColumnCount();
        return ret;
    });

    bind_func("ImGui_TableGetColumnIndex", [](){
        const auto ret = ImGui_TableGetColumnIndex();
        return ret;
    });

    bind_func("ImGui_TableGetRowIndex", [](){
        const auto ret = ImGui_TableGetRowIndex();
        return ret;
    });

    bind_func("ImGui_TableGetColumnName", [](int column_n){
        const auto ret = ImGui_TableGetColumnName(column_n);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_TableGetColumnFlags", [](int column_n){
        const auto ret = ImGui_TableGetColumnFlags(column_n);
        return ret;
    });

    bind_func("ImGui_TableSetColumnEnabled", [](int column_n, bool v){
        ImGui_TableSetColumnEnabled(column_n, v);
    });

    bind_func("ImGui_TableGetHoveredColumn", [](){
        const auto ret = ImGui_TableGetHoveredColumn();
        return ret;
    });

    bind_func("ImGui_TableSetBgColor", [](ImGuiTableBgTarget target, ImU32 color, int column_n){
        ImGui_TableSetBgColor(target, color, column_n);
    });

    bind_func("ImGui_ColumnsEx", [](int count, std::string id, bool borders){
        ImGui_ColumnsEx(count, id.c_str(), borders);
    }, allow_ptr());

    bind_func("ImGui_NextColumn", [](){
        ImGui_NextColumn();
    });

    bind_func("ImGui_GetColumnIndex", [](){
        const auto ret = ImGui_GetColumnIndex();
        return ret;
    });

    bind_func("ImGui_GetColumnWidth", [](int column_index){
        const auto ret = ImGui_GetColumnWidth(column_index);
        return ret;
    });

    bind_func("ImGui_SetColumnWidth", [](int column_index, float width){
        ImGui_SetColumnWidth(column_index, width);
    });

    bind_func("ImGui_GetColumnOffset", [](int column_index){
        const auto ret = ImGui_GetColumnOffset(column_index);
        return ret;
    });

    bind_func("ImGui_SetColumnOffset", [](int column_index, float offset_x){
        ImGui_SetColumnOffset(column_index, offset_x);
    });

    bind_func("ImGui_GetColumnsCount", [](){
        const auto ret = ImGui_GetColumnsCount();
        return ret;
    });

    bind_func("ImGui_BeginTabBar", [](std::string str_id, ImGuiTabBarFlags flags){
        const auto ret = ImGui_BeginTabBar(str_id.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndTabBar", [](){
        ImGui_EndTabBar();
    });

    bind_func("ImGui_BeginTabItem", [](std::string label, emscripten::val p_open, ImGuiTabItemFlags flags){
        auto p_open_bind = ArrayParam<bool>(p_open);
        const auto ret = ImGui_BeginTabItem(label.c_str(), &p_open_bind, flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_EndTabItem", [](){
        ImGui_EndTabItem();
    });

    bind_func("ImGui_TabItemButton", [](std::string label, ImGuiTabItemFlags flags){
        const auto ret = ImGui_TabItemButton(label.c_str(), flags);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SetTabItemClosed", [](std::string tab_or_docked_window_label){
        ImGui_SetTabItemClosed(tab_or_docked_window_label.c_str());
    }, allow_ptr());

    bind_func("ImGui_DockSpaceEx", [](ImGuiID dockspace_id, ImVec2 size, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class){
        const auto ret = ImGui_DockSpaceEx(dockspace_id, size, flags, window_class);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_DockSpaceOverViewportEx", [](ImGuiID dockspace_id, const ImGuiViewport* viewport, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class){
        const auto ret = ImGui_DockSpaceOverViewportEx(dockspace_id, viewport, flags, window_class);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_SetNextWindowClass", [](const ImGuiWindowClass* window_class){
        ImGui_SetNextWindowClass(window_class);
    }, allow_ptr());

    bind_func("ImGui_IsWindowDocked", [](){
        const auto ret = ImGui_IsWindowDocked();
        return ret;
    });

    bind_func("ImGui_BeginDisabled", [](bool disabled){
        ImGui_BeginDisabled(disabled);
    });

    bind_func("ImGui_EndDisabled", [](){
        ImGui_EndDisabled();
    });

    bind_func("ImGui_PushClipRect", [](ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect){
        ImGui_PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
    });

    bind_func("ImGui_PopClipRect", [](){
        ImGui_PopClipRect();
    });

    bind_func("ImGui_SetItemDefaultFocus", [](){
        ImGui_SetItemDefaultFocus();
    });

    bind_func("ImGui_SetKeyboardFocusHereEx", [](int offset){
        ImGui_SetKeyboardFocusHereEx(offset);
    });

    bind_func("ImGui_SetNavCursorVisible", [](bool visible){
        ImGui_SetNavCursorVisible(visible);
    });

    bind_func("ImGui_SetNextItemAllowOverlap", [](){
        ImGui_SetNextItemAllowOverlap();
    });

    bind_func("ImGui_IsItemHovered", [](ImGuiHoveredFlags flags){
        const auto ret = ImGui_IsItemHovered(flags);
        return ret;
    });

    bind_func("ImGui_IsItemActive", [](){
        const auto ret = ImGui_IsItemActive();
        return ret;
    });

    bind_func("ImGui_IsItemFocused", [](){
        const auto ret = ImGui_IsItemFocused();
        return ret;
    });

    bind_func("ImGui_IsItemClickedEx", [](ImGuiMouseButton mouse_button){
        const auto ret = ImGui_IsItemClickedEx(mouse_button);
        return ret;
    });

    bind_func("ImGui_IsItemVisible", [](){
        const auto ret = ImGui_IsItemVisible();
        return ret;
    });

    bind_func("ImGui_IsItemEdited", [](){
        const auto ret = ImGui_IsItemEdited();
        return ret;
    });

    bind_func("ImGui_IsItemActivated", [](){
        const auto ret = ImGui_IsItemActivated();
        return ret;
    });

    bind_func("ImGui_IsItemDeactivated", [](){
        const auto ret = ImGui_IsItemDeactivated();
        return ret;
    });

    bind_func("ImGui_IsItemDeactivatedAfterEdit", [](){
        const auto ret = ImGui_IsItemDeactivatedAfterEdit();
        return ret;
    });

    bind_func("ImGui_IsItemToggledOpen", [](){
        const auto ret = ImGui_IsItemToggledOpen();
        return ret;
    });

    bind_func("ImGui_IsAnyItemHovered", [](){
        const auto ret = ImGui_IsAnyItemHovered();
        return ret;
    });

    bind_func("ImGui_IsAnyItemActive", [](){
        const auto ret = ImGui_IsAnyItemActive();
        return ret;
    });

    bind_func("ImGui_IsAnyItemFocused", [](){
        const auto ret = ImGui_IsAnyItemFocused();
        return ret;
    });

    bind_func("ImGui_GetItemRectMin", [](){
        const auto ret = ImGui_GetItemRectMin();
        return ret;
    });

    bind_func("ImGui_GetItemRectMax", [](){
        const auto ret = ImGui_GetItemRectMax();
        return ret;
    });

    bind_func("ImGui_GetItemRectSize", [](){
        const auto ret = ImGui_GetItemRectSize();
        return ret;
    });

    bind_func("ImGui_GetMainViewport", [](){
        const auto ret = ImGui_GetMainViewport();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetBackgroundDrawListEx", [](ImGuiViewport* viewport){
        const auto ret = ImGui_GetBackgroundDrawListEx(viewport);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetForegroundDrawListEx", [](ImGuiViewport* viewport){
        const auto ret = ImGui_GetForegroundDrawListEx(viewport);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_IsRectVisibleBySize", [](ImVec2 size){
        const auto ret = ImGui_IsRectVisibleBySize(size);
        return ret;
    });

    bind_func("ImGui_IsRectVisible", [](ImVec2 rect_min, ImVec2 rect_max){
        const auto ret = ImGui_IsRectVisible(rect_min, rect_max);
        return ret;
    });

    bind_func("ImGui_GetTime", [](){
        const auto ret = ImGui_GetTime();
        return ret;
    });

    bind_func("ImGui_GetFrameCount", [](){
        const auto ret = ImGui_GetFrameCount();
        return ret;
    });

    bind_func("ImGui_GetDrawListSharedData", [](){
        const auto ret = ImGui_GetDrawListSharedData();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_GetStyleColorName", [](ImGuiCol idx){
        const auto ret = ImGui_GetStyleColorName(idx);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_SetStateStorage", [](ImGuiStorage* storage){
        ImGui_SetStateStorage(storage);
    }, allow_ptr());

    bind_func("ImGui_GetStateStorage", [](){
        const auto ret = ImGui_GetStateStorage();
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_CalcTextSizeEx", [](std::string text, std::string text_end, bool hide_text_after_double_hash, float wrap_width){
        const auto ret = ImGui_CalcTextSizeEx(text.c_str(), text_end.c_str(), hide_text_after_double_hash, wrap_width);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_IsKeyDown", [](ImGuiKey key){
        const auto ret = ImGui_IsKeyDown(key);
        return ret;
    });

    bind_func("ImGui_IsKeyPressedEx", [](ImGuiKey key, bool repeat){
        const auto ret = ImGui_IsKeyPressedEx(key, repeat);
        return ret;
    });

    bind_func("ImGui_IsKeyReleased", [](ImGuiKey key){
        const auto ret = ImGui_IsKeyReleased(key);
        return ret;
    });

    bind_func("ImGui_IsKeyChordPressed", [](ImGuiKeyChord key_chord){
        const auto ret = ImGui_IsKeyChordPressed(key_chord);
        return ret;
    });

    bind_func("ImGui_GetKeyPressedAmount", [](ImGuiKey key, float repeat_delay, float rate){
        const auto ret = ImGui_GetKeyPressedAmount(key, repeat_delay, rate);
        return ret;
    });

    bind_func("ImGui_GetKeyName", [](ImGuiKey key){
        const auto ret = ImGui_GetKeyName(key);
        return ret;
    }, return_ref(), allow_ptr());

    bind_func("ImGui_SetNextFrameWantCaptureKeyboard", [](bool want_capture_keyboard){
        ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard);
    });

    bind_func("ImGui_Shortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags){
        const auto ret = ImGui_Shortcut(key_chord, flags);
        return ret;
    });

    bind_func("ImGui_SetNextItemShortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags){
        ImGui_SetNextItemShortcut(key_chord, flags);
    });

    bind_func("ImGui_SetItemKeyOwner", [](ImGuiKey key){
        ImGui_SetItemKeyOwner(key);
    });

    bind_func("ImGui_IsMouseDown", [](ImGuiMouseButton button){
        const auto ret = ImGui_IsMouseDown(button);
        return ret;
    });

    bind_func("ImGui_IsMouseClickedEx", [](ImGuiMouseButton button, bool repeat){
        const auto ret = ImGui_IsMouseClickedEx(button, repeat);
        return ret;
    });

    bind_func("ImGui_IsMouseReleased", [](ImGuiMouseButton button){
        const auto ret = ImGui_IsMouseReleased(button);
        return ret;
    });

    bind_func("ImGui_IsMouseDoubleClicked", [](ImGuiMouseButton button){
        const auto ret = ImGui_IsMouseDoubleClicked(button);
        return ret;
    });

    bind_func("ImGui_GetMouseClickedCount", [](ImGuiMouseButton button){
        const auto ret = ImGui_GetMouseClickedCount(button);
        return ret;
    });

    bind_func("ImGui_IsMouseHoveringRectEx", [](ImVec2 r_min, ImVec2 r_max, bool clip){
        const auto ret = ImGui_IsMouseHoveringRectEx(r_min, r_max, clip);
        return ret;
    });

    bind_func("ImGui_IsMousePosValid", [](const ImVec2* mouse_pos){
        const auto ret = ImGui_IsMousePosValid(mouse_pos);
        return ret;
    }, allow_ptr());

    bind_func("ImGui_IsAnyMouseDown", [](){
        const auto ret = ImGui_IsAnyMouseDown();
        return ret;
    });

    bind_func("ImGui_GetMousePos", [](){
        const auto ret = ImGui_GetMousePos();
        return ret;
    });

    bind_func("ImGui_GetMousePosOnOpeningCurrentPopup", [](){
        const auto ret = ImGui_GetMousePosOnOpeningCurrentPopup();
        return ret;
    });

    bind_func("ImGui_IsMouseDragging", [](ImGuiMouseButton button, float lock_threshold){
        const auto ret = ImGui_IsMouseDragging(button, lock_threshold);
        return ret;
    });

    bind_func("ImGui_GetMouseDragDelta", [](ImGuiMouseButton button, float lock_threshold){
        const auto ret = ImGui_GetMouseDragDelta(button, lock_threshold);
        return ret;
    });

    bind_func("ImGui_ResetMouseDragDeltaEx", [](ImGuiMouseButton button){
        ImGui_ResetMouseDragDeltaEx(button);
    });

    bind_func("ImGui_GetMouseCursor", [](){
        const auto ret = ImGui_GetMouseCursor();
        return ret;
    });

    bind_func("ImGui_SetMouseCursor", [](ImGuiMouseCursor cursor_type){
        ImGui_SetMouseCursor(cursor_type);
    });

    bind_func("ImGui_SetNextFrameWantCaptureMouse", [](bool want_capture_mouse){
        ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse);
    });


}