#include <cstdint>
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
    bind_prop(ImGuiStyle, HoverStationaryDelay, float)
    bind_prop(ImGuiStyle, HoverDelayShort, float)
    bind_prop(ImGuiStyle, HoverDelayNormal, float)
    bind_prop(ImGuiStyle, HoverFlagsForTooltipMouse, ImGuiHoveredFlags)
    bind_prop(ImGuiStyle, HoverFlagsForTooltipNav, ImGuiHoveredFlags)

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
        return ImGui_Text("%s", fmt.c_str());
    });

    bind_func("ImGui_TextColored", [](ImVec4 col, std::string fmt){
        return ImGui_TextColored(col, "%s", fmt.c_str());
    });

    bind_func("ImGui_TextDisabled", [](std::string fmt){
        return ImGui_TextDisabled("%s", fmt.c_str());
    });

    bind_func("ImGui_TextWrapped", [](std::string fmt){
       return  ImGui_TextWrapped("%s", fmt.c_str());
    });

    bind_func("ImGui_LabelText", [](std::string label, std::string fmt){
        return ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
    });

    bind_func("ImGui_BulletText", [](std::string fmt){
        return ImGui_BulletText("%s", fmt.c_str());
    });

    bind_func("ImGui_SeparatorText", [](std::string label){
        return ImGui_SeparatorText(label.c_str());
    });

    bind_func("ImGui_SetTooltip", [](std::string fmt){
        return ImGui_SetTooltip("%s", fmt.c_str());
    });

    bind_func("ImGui_SetItemTooltip", [](std::string fmt){
        return ImGui_SetItemTooltip("%s", fmt.c_str());
    });

    bind_func("ImGui_PlotLinesEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
        auto values_bind = ArrayParam<float>(values);
        return ImGui_PlotLinesEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
    }, allow_ptr());

    bind_func("ImGui_PlotHistogramEx", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
        auto values_bind = ArrayParam<float>(values);
        return ImGui_PlotHistogramEx(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
    }, allow_ptr());

    /* Widgets Input with Keyboard */
    bind_func("ImGui_InputText", [](std::string label, std::string buf, size_t buf_size, ImGuiInputTextFlags flags){
        return ImGui_InputText(label.c_str(), buf.data(), buf_size, flags);
    }, allow_ptr());

    bind_func("ImGui_InputTextMultilineEx", [](std::string label, std::string buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){
        return ImGui_InputTextMultilineEx(label.c_str(), buf.data(), buf_size, size, flags, nullptr, nullptr);
    }, allow_ptr());

    bind_func("ImGui_InputTextWithHintEx", [](std::string label, std::string hint, std::string buf, size_t buf_size, ImGuiInputTextFlags flags){
        return ImGui_InputTextWithHintEx(label.c_str(), hint.c_str(), buf.data(), buf_size, flags, nullptr, nullptr);
    }, allow_ptr());

    bind_func("ImGui_GetClipboardText", [](){
        return std::string(ImGui_GetClipboardText());
    });

    bind_func("ImGui_SetClipboardText", [](std::string text){
        return ImGui_SetClipboardText(text.c_str());
    });

    bind_func("ImGui_ImageEx", [](int user_texture_id, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 tint_col, ImVec4 border_col){
        return ImGui_ImageEx(user_texture_id, image_size, uv0, uv1, tint_col, border_col);
    });

    bind_func("ImGui_ImageButtonEx", [](std::string str_id, int user_texture_id, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col){
        return ImGui_ImageButtonEx(str_id.c_str(), user_texture_id, image_size, uv0, uv1, bg_col, tint_col);
    });

}
