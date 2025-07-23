#include <string>
#include <vector>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_impl_wgpu.h>
#include <dcimgui_internal.h>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5_webgl.h>
#include <emscripten/html5_webgpu.h>
#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>






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

/* -------------------------------------------------------------------------- */
/* Manual Backend Bindings - WebGL and WebGPU */
/* -------------------------------------------------------------------------- */

EMSCRIPTEN_BINDINGS(impl) {

/* -------------------------------------------------------------------------- */
/* WebGL */
/* -------------------------------------------------------------------------- */
#ifdef JSIMGUI_BACKEND_WEBGL

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
    return cImGui_ImplOpenGL3_RenderDrawData(draw_data);
}, allow_ptr());

#endif
/* -------------------------------------------------------------------------- */
/* WebGPU */
/* -------------------------------------------------------------------------- */
#ifdef JSIMGUI_BACKEND_WEBGPU

bind_func("cImGui_ImplWGPU_Init", [](){
    wgpu::Device device = wgpu::Device::Acquire(emscripten_webgpu_get_device());

    ImGui_ImplWGPU_InitInfo init_info = {
        .Device = device.MoveToCHandle(),
        .NumFramesInFlight = 3,
        .RenderTargetFormat = WGPUTextureFormat_BGRA8Unorm,
        .DepthStencilFormat = WGPUTextureFormat_Undefined,
        .PipelineMultisampleState = {
            .count = 1,
            .mask = UINT32_MAX,
            .alphaToCoverageEnabled = false,
        },
    };

    return cImGui_ImplWGPU_Init(&init_info);
});

bind_func("cImGui_ImplWGPU_Shutdown", [](){
    return cImGui_ImplWGPU_Shutdown();
});

bind_func("cImGui_ImplWGPU_NewFrame", [](){
    return cImGui_ImplWGPU_NewFrame();
});

bind_func("cImGui_ImplWGPU_RenderDrawData", [](ImDrawData* draw_data, int pass_encoder_handle){
    wgpu::RenderPassEncoder pass_encoder = wgpu::RenderPassEncoder::Acquire(
        emscripten_webgpu_import_render_pass_encoder(pass_encoder_handle)
    );

    return cImGui_ImplWGPU_RenderDrawData(draw_data, pass_encoder.MoveToCHandle());
}, allow_ptr());
#endif

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
.function("get_x", override([](const ImVec2& self){ return self.x; }), rvp_ref(), allow_ptr())
.function("set_x", override([](ImVec2& self, float value){ self.x = value; }), allow_ptr())
.function("get_y", override([](const ImVec2& self){ return self.y; }), rvp_ref(), allow_ptr())
.function("set_y", override([](ImVec2& self, float value){ self.y = value; }), allow_ptr())
;

bind_struct<ImVec4>("ImVec4")
.constructor<>()
.function("get_x", override([](const ImVec4& self){ return self.x; }), rvp_ref(), allow_ptr())
.function("set_x", override([](ImVec4& self, float value){ self.x = value; }), allow_ptr())
.function("get_y", override([](const ImVec4& self){ return self.y; }), rvp_ref(), allow_ptr())
.function("set_y", override([](ImVec4& self, float value){ self.y = value; }), allow_ptr())
.function("get_z", override([](const ImVec4& self){ return self.z; }), rvp_ref(), allow_ptr())
.function("set_z", override([](ImVec4& self, float value){ self.z = value; }), allow_ptr())
.function("get_w", override([](const ImVec4& self){ return self.w; }), rvp_ref(), allow_ptr())
.function("set_w", override([](ImVec4& self, float value){ self.w = value; }), allow_ptr())
;

bind_struct<ImTextureRef>("ImTextureRef")
.constructor<>()
.function("get__TexID", override([](const ImTextureRef& self){ return self._TexID; }), rvp_ref(), allow_ptr())
.function("set__TexID", override([](ImTextureRef& self, ImTextureID value){ self._TexID = value; }), allow_ptr())
.function("ImTextureRef_GetTexID", override([](const ImTextureRef* self){ return ImTextureRef_GetTexID(self); }), allow_ptr())
;

bind_struct<ImGuiTableSortSpecs>("ImGuiTableSortSpecs")
.constructor<>()
;

bind_struct<ImGuiTableColumnSortSpecs>("ImGuiTableColumnSortSpecs")
.constructor<>()
;

bind_struct<ImGuiStyle>("ImGuiStyle")
.constructor<>()
.function("get_FontSizeBase", override([](const ImGuiStyle& self){ return self.FontSizeBase; }), rvp_ref(), allow_ptr())
.function("set_FontSizeBase", override([](ImGuiStyle& self, float value){ self.FontSizeBase = value; }), allow_ptr())
.function("get_FontScaleMain", override([](const ImGuiStyle& self){ return self.FontScaleMain; }), rvp_ref(), allow_ptr())
.function("set_FontScaleMain", override([](ImGuiStyle& self, float value){ self.FontScaleMain = value; }), allow_ptr())
.function("get_FontScaleDpi", override([](const ImGuiStyle& self){ return self.FontScaleDpi; }), rvp_ref(), allow_ptr())
.function("set_FontScaleDpi", override([](ImGuiStyle& self, float value){ self.FontScaleDpi = value; }), allow_ptr())
.function("get_Alpha", override([](const ImGuiStyle& self){ return self.Alpha; }), rvp_ref(), allow_ptr())
.function("set_Alpha", override([](ImGuiStyle& self, float value){ self.Alpha = value; }), allow_ptr())
.function("get_DisabledAlpha", override([](const ImGuiStyle& self){ return self.DisabledAlpha; }), rvp_ref(), allow_ptr())
.function("set_DisabledAlpha", override([](ImGuiStyle& self, float value){ self.DisabledAlpha = value; }), allow_ptr())
.function("get_WindowPadding", override([](const ImGuiStyle& self){ return self.WindowPadding; }), rvp_ref(), allow_ptr())
.function("set_WindowPadding", override([](ImGuiStyle& self, ImVec2 value){ self.WindowPadding = value; }), allow_ptr())
.function("get_WindowRounding", override([](const ImGuiStyle& self){ return self.WindowRounding; }), rvp_ref(), allow_ptr())
.function("set_WindowRounding", override([](ImGuiStyle& self, float value){ self.WindowRounding = value; }), allow_ptr())
.function("get_WindowBorderSize", override([](const ImGuiStyle& self){ return self.WindowBorderSize; }), rvp_ref(), allow_ptr())
.function("set_WindowBorderSize", override([](ImGuiStyle& self, float value){ self.WindowBorderSize = value; }), allow_ptr())
.function("get_WindowBorderHoverPadding", override([](const ImGuiStyle& self){ return self.WindowBorderHoverPadding; }), rvp_ref(), allow_ptr())
.function("set_WindowBorderHoverPadding", override([](ImGuiStyle& self, float value){ self.WindowBorderHoverPadding = value; }), allow_ptr())
.function("get_WindowMinSize", override([](const ImGuiStyle& self){ return self.WindowMinSize; }), rvp_ref(), allow_ptr())
.function("set_WindowMinSize", override([](ImGuiStyle& self, ImVec2 value){ self.WindowMinSize = value; }), allow_ptr())
.function("get_WindowTitleAlign", override([](const ImGuiStyle& self){ return self.WindowTitleAlign; }), rvp_ref(), allow_ptr())
.function("set_WindowTitleAlign", override([](ImGuiStyle& self, ImVec2 value){ self.WindowTitleAlign = value; }), allow_ptr())
.function("get_WindowMenuButtonPosition", override([](const ImGuiStyle& self){ return self.WindowMenuButtonPosition; }), rvp_ref(), allow_ptr())
.function("set_WindowMenuButtonPosition", override([](ImGuiStyle& self, ImGuiDir value){ self.WindowMenuButtonPosition = value; }), allow_ptr())
.function("get_ChildRounding", override([](const ImGuiStyle& self){ return self.ChildRounding; }), rvp_ref(), allow_ptr())
.function("set_ChildRounding", override([](ImGuiStyle& self, float value){ self.ChildRounding = value; }), allow_ptr())
.function("get_ChildBorderSize", override([](const ImGuiStyle& self){ return self.ChildBorderSize; }), rvp_ref(), allow_ptr())
.function("set_ChildBorderSize", override([](ImGuiStyle& self, float value){ self.ChildBorderSize = value; }), allow_ptr())
.function("get_PopupRounding", override([](const ImGuiStyle& self){ return self.PopupRounding; }), rvp_ref(), allow_ptr())
.function("set_PopupRounding", override([](ImGuiStyle& self, float value){ self.PopupRounding = value; }), allow_ptr())
.function("get_PopupBorderSize", override([](const ImGuiStyle& self){ return self.PopupBorderSize; }), rvp_ref(), allow_ptr())
.function("set_PopupBorderSize", override([](ImGuiStyle& self, float value){ self.PopupBorderSize = value; }), allow_ptr())
.function("get_FramePadding", override([](const ImGuiStyle& self){ return self.FramePadding; }), rvp_ref(), allow_ptr())
.function("set_FramePadding", override([](ImGuiStyle& self, ImVec2 value){ self.FramePadding = value; }), allow_ptr())
.function("get_FrameRounding", override([](const ImGuiStyle& self){ return self.FrameRounding; }), rvp_ref(), allow_ptr())
.function("set_FrameRounding", override([](ImGuiStyle& self, float value){ self.FrameRounding = value; }), allow_ptr())
.function("get_FrameBorderSize", override([](const ImGuiStyle& self){ return self.FrameBorderSize; }), rvp_ref(), allow_ptr())
.function("set_FrameBorderSize", override([](ImGuiStyle& self, float value){ self.FrameBorderSize = value; }), allow_ptr())
.function("get_ItemSpacing", override([](const ImGuiStyle& self){ return self.ItemSpacing; }), rvp_ref(), allow_ptr())
.function("set_ItemSpacing", override([](ImGuiStyle& self, ImVec2 value){ self.ItemSpacing = value; }), allow_ptr())
.function("get_ItemInnerSpacing", override([](const ImGuiStyle& self){ return self.ItemInnerSpacing; }), rvp_ref(), allow_ptr())
.function("set_ItemInnerSpacing", override([](ImGuiStyle& self, ImVec2 value){ self.ItemInnerSpacing = value; }), allow_ptr())
.function("get_CellPadding", override([](const ImGuiStyle& self){ return self.CellPadding; }), rvp_ref(), allow_ptr())
.function("set_CellPadding", override([](ImGuiStyle& self, ImVec2 value){ self.CellPadding = value; }), allow_ptr())
.function("get_TouchExtraPadding", override([](const ImGuiStyle& self){ return self.TouchExtraPadding; }), rvp_ref(), allow_ptr())
.function("set_TouchExtraPadding", override([](ImGuiStyle& self, ImVec2 value){ self.TouchExtraPadding = value; }), allow_ptr())
.function("get_IndentSpacing", override([](const ImGuiStyle& self){ return self.IndentSpacing; }), rvp_ref(), allow_ptr())
.function("set_IndentSpacing", override([](ImGuiStyle& self, float value){ self.IndentSpacing = value; }), allow_ptr())
.function("get_ColumnsMinSpacing", override([](const ImGuiStyle& self){ return self.ColumnsMinSpacing; }), rvp_ref(), allow_ptr())
.function("set_ColumnsMinSpacing", override([](ImGuiStyle& self, float value){ self.ColumnsMinSpacing = value; }), allow_ptr())
.function("get_ScrollbarSize", override([](const ImGuiStyle& self){ return self.ScrollbarSize; }), rvp_ref(), allow_ptr())
.function("set_ScrollbarSize", override([](ImGuiStyle& self, float value){ self.ScrollbarSize = value; }), allow_ptr())
.function("get_ScrollbarRounding", override([](const ImGuiStyle& self){ return self.ScrollbarRounding; }), rvp_ref(), allow_ptr())
.function("set_ScrollbarRounding", override([](ImGuiStyle& self, float value){ self.ScrollbarRounding = value; }), allow_ptr())
.function("get_GrabMinSize", override([](const ImGuiStyle& self){ return self.GrabMinSize; }), rvp_ref(), allow_ptr())
.function("set_GrabMinSize", override([](ImGuiStyle& self, float value){ self.GrabMinSize = value; }), allow_ptr())
.function("get_GrabRounding", override([](const ImGuiStyle& self){ return self.GrabRounding; }), rvp_ref(), allow_ptr())
.function("set_GrabRounding", override([](ImGuiStyle& self, float value){ self.GrabRounding = value; }), allow_ptr())
.function("get_LogSliderDeadzone", override([](const ImGuiStyle& self){ return self.LogSliderDeadzone; }), rvp_ref(), allow_ptr())
.function("set_LogSliderDeadzone", override([](ImGuiStyle& self, float value){ self.LogSliderDeadzone = value; }), allow_ptr())
.function("get_ImageBorderSize", override([](const ImGuiStyle& self){ return self.ImageBorderSize; }), rvp_ref(), allow_ptr())
.function("set_ImageBorderSize", override([](ImGuiStyle& self, float value){ self.ImageBorderSize = value; }), allow_ptr())
.function("get_TabRounding", override([](const ImGuiStyle& self){ return self.TabRounding; }), rvp_ref(), allow_ptr())
.function("set_TabRounding", override([](ImGuiStyle& self, float value){ self.TabRounding = value; }), allow_ptr())
.function("get_TabBorderSize", override([](const ImGuiStyle& self){ return self.TabBorderSize; }), rvp_ref(), allow_ptr())
.function("set_TabBorderSize", override([](ImGuiStyle& self, float value){ self.TabBorderSize = value; }), allow_ptr())
.function("get_TabCloseButtonMinWidthSelected", override([](const ImGuiStyle& self){ return self.TabCloseButtonMinWidthSelected; }), rvp_ref(), allow_ptr())
.function("set_TabCloseButtonMinWidthSelected", override([](ImGuiStyle& self, float value){ self.TabCloseButtonMinWidthSelected = value; }), allow_ptr())
.function("get_TabCloseButtonMinWidthUnselected", override([](const ImGuiStyle& self){ return self.TabCloseButtonMinWidthUnselected; }), rvp_ref(), allow_ptr())
.function("set_TabCloseButtonMinWidthUnselected", override([](ImGuiStyle& self, float value){ self.TabCloseButtonMinWidthUnselected = value; }), allow_ptr())
.function("get_TabBarBorderSize", override([](const ImGuiStyle& self){ return self.TabBarBorderSize; }), rvp_ref(), allow_ptr())
.function("set_TabBarBorderSize", override([](ImGuiStyle& self, float value){ self.TabBarBorderSize = value; }), allow_ptr())
.function("get_TabBarOverlineSize", override([](const ImGuiStyle& self){ return self.TabBarOverlineSize; }), rvp_ref(), allow_ptr())
.function("set_TabBarOverlineSize", override([](ImGuiStyle& self, float value){ self.TabBarOverlineSize = value; }), allow_ptr())
.function("get_TableAngledHeadersAngle", override([](const ImGuiStyle& self){ return self.TableAngledHeadersAngle; }), rvp_ref(), allow_ptr())
.function("set_TableAngledHeadersAngle", override([](ImGuiStyle& self, float value){ self.TableAngledHeadersAngle = value; }), allow_ptr())
.function("get_TableAngledHeadersTextAlign", override([](const ImGuiStyle& self){ return self.TableAngledHeadersTextAlign; }), rvp_ref(), allow_ptr())
.function("set_TableAngledHeadersTextAlign", override([](ImGuiStyle& self, ImVec2 value){ self.TableAngledHeadersTextAlign = value; }), allow_ptr())
.function("get_TreeLinesFlags", override([](const ImGuiStyle& self){ return self.TreeLinesFlags; }), rvp_ref(), allow_ptr())
.function("set_TreeLinesFlags", override([](ImGuiStyle& self, ImGuiTreeNodeFlags value){ self.TreeLinesFlags = value; }), allow_ptr())
.function("get_TreeLinesSize", override([](const ImGuiStyle& self){ return self.TreeLinesSize; }), rvp_ref(), allow_ptr())
.function("set_TreeLinesSize", override([](ImGuiStyle& self, float value){ self.TreeLinesSize = value; }), allow_ptr())
.function("get_TreeLinesRounding", override([](const ImGuiStyle& self){ return self.TreeLinesRounding; }), rvp_ref(), allow_ptr())
.function("set_TreeLinesRounding", override([](ImGuiStyle& self, float value){ self.TreeLinesRounding = value; }), allow_ptr())
.function("get_ColorButtonPosition", override([](const ImGuiStyle& self){ return self.ColorButtonPosition; }), rvp_ref(), allow_ptr())
.function("set_ColorButtonPosition", override([](ImGuiStyle& self, ImGuiDir value){ self.ColorButtonPosition = value; }), allow_ptr())
.function("get_ButtonTextAlign", override([](const ImGuiStyle& self){ return self.ButtonTextAlign; }), rvp_ref(), allow_ptr())
.function("set_ButtonTextAlign", override([](ImGuiStyle& self, ImVec2 value){ self.ButtonTextAlign = value; }), allow_ptr())
.function("get_SelectableTextAlign", override([](const ImGuiStyle& self){ return self.SelectableTextAlign; }), rvp_ref(), allow_ptr())
.function("set_SelectableTextAlign", override([](ImGuiStyle& self, ImVec2 value){ self.SelectableTextAlign = value; }), allow_ptr())
.function("get_SeparatorTextBorderSize", override([](const ImGuiStyle& self){ return self.SeparatorTextBorderSize; }), rvp_ref(), allow_ptr())
.function("set_SeparatorTextBorderSize", override([](ImGuiStyle& self, float value){ self.SeparatorTextBorderSize = value; }), allow_ptr())
.function("get_SeparatorTextAlign", override([](const ImGuiStyle& self){ return self.SeparatorTextAlign; }), rvp_ref(), allow_ptr())
.function("set_SeparatorTextAlign", override([](ImGuiStyle& self, ImVec2 value){ self.SeparatorTextAlign = value; }), allow_ptr())
.function("get_SeparatorTextPadding", override([](const ImGuiStyle& self){ return self.SeparatorTextPadding; }), rvp_ref(), allow_ptr())
.function("set_SeparatorTextPadding", override([](ImGuiStyle& self, ImVec2 value){ self.SeparatorTextPadding = value; }), allow_ptr())
.function("get_DisplayWindowPadding", override([](const ImGuiStyle& self){ return self.DisplayWindowPadding; }), rvp_ref(), allow_ptr())
.function("set_DisplayWindowPadding", override([](ImGuiStyle& self, ImVec2 value){ self.DisplayWindowPadding = value; }), allow_ptr())
.function("get_DisplaySafeAreaPadding", override([](const ImGuiStyle& self){ return self.DisplaySafeAreaPadding; }), rvp_ref(), allow_ptr())
.function("set_DisplaySafeAreaPadding", override([](ImGuiStyle& self, ImVec2 value){ self.DisplaySafeAreaPadding = value; }), allow_ptr())
.function("get_DockingSeparatorSize", override([](const ImGuiStyle& self){ return self.DockingSeparatorSize; }), rvp_ref(), allow_ptr())
.function("set_DockingSeparatorSize", override([](ImGuiStyle& self, float value){ self.DockingSeparatorSize = value; }), allow_ptr())
.function("get_MouseCursorScale", override([](const ImGuiStyle& self){ return self.MouseCursorScale; }), rvp_ref(), allow_ptr())
.function("set_MouseCursorScale", override([](ImGuiStyle& self, float value){ self.MouseCursorScale = value; }), allow_ptr())
.function("get_AntiAliasedLines", override([](const ImGuiStyle& self){ return self.AntiAliasedLines; }), rvp_ref(), allow_ptr())
.function("set_AntiAliasedLines", override([](ImGuiStyle& self, bool value){ self.AntiAliasedLines = value; }), allow_ptr())
.function("get_AntiAliasedLinesUseTex", override([](const ImGuiStyle& self){ return self.AntiAliasedLinesUseTex; }), rvp_ref(), allow_ptr())
.function("set_AntiAliasedLinesUseTex", override([](ImGuiStyle& self, bool value){ self.AntiAliasedLinesUseTex = value; }), allow_ptr())
.function("get_AntiAliasedFill", override([](const ImGuiStyle& self){ return self.AntiAliasedFill; }), rvp_ref(), allow_ptr())
.function("set_AntiAliasedFill", override([](ImGuiStyle& self, bool value){ self.AntiAliasedFill = value; }), allow_ptr())
.function("get_CurveTessellationTol", override([](const ImGuiStyle& self){ return self.CurveTessellationTol; }), rvp_ref(), allow_ptr())
.function("set_CurveTessellationTol", override([](ImGuiStyle& self, float value){ self.CurveTessellationTol = value; }), allow_ptr())
.function("get_CircleTessellationMaxError", override([](const ImGuiStyle& self){ return self.CircleTessellationMaxError; }), rvp_ref(), allow_ptr())
.function("set_CircleTessellationMaxError", override([](ImGuiStyle& self, float value){ self.CircleTessellationMaxError = value; }), allow_ptr())
.function("get_HoverStationaryDelay", override([](const ImGuiStyle& self){ return self.HoverStationaryDelay; }), rvp_ref(), allow_ptr())
.function("set_HoverStationaryDelay", override([](ImGuiStyle& self, float value){ self.HoverStationaryDelay = value; }), allow_ptr())
.function("get_HoverDelayShort", override([](const ImGuiStyle& self){ return self.HoverDelayShort; }), rvp_ref(), allow_ptr())
.function("set_HoverDelayShort", override([](ImGuiStyle& self, float value){ self.HoverDelayShort = value; }), allow_ptr())
.function("get_HoverDelayNormal", override([](const ImGuiStyle& self){ return self.HoverDelayNormal; }), rvp_ref(), allow_ptr())
.function("set_HoverDelayNormal", override([](ImGuiStyle& self, float value){ self.HoverDelayNormal = value; }), allow_ptr())
.function("get_HoverFlagsForTooltipMouse", override([](const ImGuiStyle& self){ return self.HoverFlagsForTooltipMouse; }), rvp_ref(), allow_ptr())
.function("set_HoverFlagsForTooltipMouse", override([](ImGuiStyle& self, ImGuiHoveredFlags value){ self.HoverFlagsForTooltipMouse = value; }), allow_ptr())
.function("get_HoverFlagsForTooltipNav", override([](const ImGuiStyle& self){ return self.HoverFlagsForTooltipNav; }), rvp_ref(), allow_ptr())
.function("set_HoverFlagsForTooltipNav", override([](ImGuiStyle& self, ImGuiHoveredFlags value){ self.HoverFlagsForTooltipNav = value; }), allow_ptr())
.function("ImGuiStyle_ScaleAllSizes", override([](ImGuiStyle* self, float scale_factor){ return ImGuiStyle_ScaleAllSizes(self, scale_factor); }), allow_ptr())
;

bind_struct<ImGuiIO>("ImGuiIO")
.constructor<>()
.function("get_ConfigFlags", override([](const ImGuiIO& self){ return self.ConfigFlags; }), rvp_ref(), allow_ptr())
.function("set_ConfigFlags", override([](ImGuiIO& self, ImGuiConfigFlags value){ self.ConfigFlags = value; }), allow_ptr())
.function("get_BackendFlags", override([](const ImGuiIO& self){ return self.BackendFlags; }), rvp_ref(), allow_ptr())
.function("set_BackendFlags", override([](ImGuiIO& self, ImGuiBackendFlags value){ self.BackendFlags = value; }), allow_ptr())
.function("get_DisplaySize", override([](const ImGuiIO& self){ return self.DisplaySize; }), rvp_ref(), allow_ptr())
.function("set_DisplaySize", override([](ImGuiIO& self, ImVec2 value){ self.DisplaySize = value; }), allow_ptr())
.function("get_DisplayFramebufferScale", override([](const ImGuiIO& self){ return self.DisplayFramebufferScale; }), rvp_ref(), allow_ptr())
.function("set_DisplayFramebufferScale", override([](ImGuiIO& self, ImVec2 value){ self.DisplayFramebufferScale = value; }), allow_ptr())
.function("get_DeltaTime", override([](const ImGuiIO& self){ return self.DeltaTime; }), rvp_ref(), allow_ptr())
.function("set_DeltaTime", override([](ImGuiIO& self, float value){ self.DeltaTime = value; }), allow_ptr())
.function("get_IniSavingRate", override([](const ImGuiIO& self){ return self.IniSavingRate; }), rvp_ref(), allow_ptr())
.function("set_IniSavingRate", override([](ImGuiIO& self, float value){ self.IniSavingRate = value; }), allow_ptr())
.function("get_Fonts", override([](const ImGuiIO& self){ return self.Fonts; }), rvp_ref(), allow_ptr())
.function("set_Fonts", override([](ImGuiIO& self, ImFontAtlas* value){ self.Fonts = value; }), allow_ptr())
.function("get_FontDefault", override([](const ImGuiIO& self){ return self.FontDefault; }), rvp_ref(), allow_ptr())
.function("set_FontDefault", override([](ImGuiIO& self, ImFont* value){ self.FontDefault = value; }), allow_ptr())
.function("get_FontAllowUserScaling", override([](const ImGuiIO& self){ return self.FontAllowUserScaling; }), rvp_ref(), allow_ptr())
.function("set_FontAllowUserScaling", override([](ImGuiIO& self, bool value){ self.FontAllowUserScaling = value; }), allow_ptr())
.function("get_ConfigNavSwapGamepadButtons", override([](const ImGuiIO& self){ return self.ConfigNavSwapGamepadButtons; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavSwapGamepadButtons", override([](ImGuiIO& self, bool value){ self.ConfigNavSwapGamepadButtons = value; }), allow_ptr())
.function("get_ConfigNavMoveSetMousePos", override([](const ImGuiIO& self){ return self.ConfigNavMoveSetMousePos; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavMoveSetMousePos", override([](ImGuiIO& self, bool value){ self.ConfigNavMoveSetMousePos = value; }), allow_ptr())
.function("get_ConfigNavCaptureKeyboard", override([](const ImGuiIO& self){ return self.ConfigNavCaptureKeyboard; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavCaptureKeyboard", override([](ImGuiIO& self, bool value){ self.ConfigNavCaptureKeyboard = value; }), allow_ptr())
.function("get_ConfigNavEscapeClearFocusItem", override([](const ImGuiIO& self){ return self.ConfigNavEscapeClearFocusItem; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavEscapeClearFocusItem", override([](ImGuiIO& self, bool value){ self.ConfigNavEscapeClearFocusItem = value; }), allow_ptr())
.function("get_ConfigNavEscapeClearFocusWindow", override([](const ImGuiIO& self){ return self.ConfigNavEscapeClearFocusWindow; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavEscapeClearFocusWindow", override([](ImGuiIO& self, bool value){ self.ConfigNavEscapeClearFocusWindow = value; }), allow_ptr())
.function("get_ConfigNavCursorVisibleAuto", override([](const ImGuiIO& self){ return self.ConfigNavCursorVisibleAuto; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavCursorVisibleAuto", override([](ImGuiIO& self, bool value){ self.ConfigNavCursorVisibleAuto = value; }), allow_ptr())
.function("get_ConfigNavCursorVisibleAlways", override([](const ImGuiIO& self){ return self.ConfigNavCursorVisibleAlways; }), rvp_ref(), allow_ptr())
.function("set_ConfigNavCursorVisibleAlways", override([](ImGuiIO& self, bool value){ self.ConfigNavCursorVisibleAlways = value; }), allow_ptr())
.function("get_ConfigDockingNoSplit", override([](const ImGuiIO& self){ return self.ConfigDockingNoSplit; }), rvp_ref(), allow_ptr())
.function("set_ConfigDockingNoSplit", override([](ImGuiIO& self, bool value){ self.ConfigDockingNoSplit = value; }), allow_ptr())
.function("get_ConfigDockingWithShift", override([](const ImGuiIO& self){ return self.ConfigDockingWithShift; }), rvp_ref(), allow_ptr())
.function("set_ConfigDockingWithShift", override([](ImGuiIO& self, bool value){ self.ConfigDockingWithShift = value; }), allow_ptr())
.function("get_ConfigDockingAlwaysTabBar", override([](const ImGuiIO& self){ return self.ConfigDockingAlwaysTabBar; }), rvp_ref(), allow_ptr())
.function("set_ConfigDockingAlwaysTabBar", override([](ImGuiIO& self, bool value){ self.ConfigDockingAlwaysTabBar = value; }), allow_ptr())
.function("get_ConfigDockingTransparentPayload", override([](const ImGuiIO& self){ return self.ConfigDockingTransparentPayload; }), rvp_ref(), allow_ptr())
.function("set_ConfigDockingTransparentPayload", override([](ImGuiIO& self, bool value){ self.ConfigDockingTransparentPayload = value; }), allow_ptr())
.function("get_ConfigViewportsNoAutoMerge", override([](const ImGuiIO& self){ return self.ConfigViewportsNoAutoMerge; }), rvp_ref(), allow_ptr())
.function("set_ConfigViewportsNoAutoMerge", override([](ImGuiIO& self, bool value){ self.ConfigViewportsNoAutoMerge = value; }), allow_ptr())
.function("get_ConfigViewportsNoTaskBarIcon", override([](const ImGuiIO& self){ return self.ConfigViewportsNoTaskBarIcon; }), rvp_ref(), allow_ptr())
.function("set_ConfigViewportsNoTaskBarIcon", override([](ImGuiIO& self, bool value){ self.ConfigViewportsNoTaskBarIcon = value; }), allow_ptr())
.function("get_ConfigViewportsNoDecoration", override([](const ImGuiIO& self){ return self.ConfigViewportsNoDecoration; }), rvp_ref(), allow_ptr())
.function("set_ConfigViewportsNoDecoration", override([](ImGuiIO& self, bool value){ self.ConfigViewportsNoDecoration = value; }), allow_ptr())
.function("get_ConfigViewportsNoDefaultParent", override([](const ImGuiIO& self){ return self.ConfigViewportsNoDefaultParent; }), rvp_ref(), allow_ptr())
.function("set_ConfigViewportsNoDefaultParent", override([](ImGuiIO& self, bool value){ self.ConfigViewportsNoDefaultParent = value; }), allow_ptr())
.function("get_ConfigDpiScaleFonts", override([](const ImGuiIO& self){ return self.ConfigDpiScaleFonts; }), rvp_ref(), allow_ptr())
.function("set_ConfigDpiScaleFonts", override([](ImGuiIO& self, bool value){ self.ConfigDpiScaleFonts = value; }), allow_ptr())
.function("get_ConfigDpiScaleViewports", override([](const ImGuiIO& self){ return self.ConfigDpiScaleViewports; }), rvp_ref(), allow_ptr())
.function("set_ConfigDpiScaleViewports", override([](ImGuiIO& self, bool value){ self.ConfigDpiScaleViewports = value; }), allow_ptr())
.function("get_MouseDrawCursor", override([](const ImGuiIO& self){ return self.MouseDrawCursor; }), rvp_ref(), allow_ptr())
.function("set_MouseDrawCursor", override([](ImGuiIO& self, bool value){ self.MouseDrawCursor = value; }), allow_ptr())
.function("get_ConfigMacOSXBehaviors", override([](const ImGuiIO& self){ return self.ConfigMacOSXBehaviors; }), rvp_ref(), allow_ptr())
.function("set_ConfigMacOSXBehaviors", override([](ImGuiIO& self, bool value){ self.ConfigMacOSXBehaviors = value; }), allow_ptr())
.function("get_ConfigInputTrickleEventQueue", override([](const ImGuiIO& self){ return self.ConfigInputTrickleEventQueue; }), rvp_ref(), allow_ptr())
.function("set_ConfigInputTrickleEventQueue", override([](ImGuiIO& self, bool value){ self.ConfigInputTrickleEventQueue = value; }), allow_ptr())
.function("get_ConfigInputTextCursorBlink", override([](const ImGuiIO& self){ return self.ConfigInputTextCursorBlink; }), rvp_ref(), allow_ptr())
.function("set_ConfigInputTextCursorBlink", override([](ImGuiIO& self, bool value){ self.ConfigInputTextCursorBlink = value; }), allow_ptr())
.function("get_ConfigInputTextEnterKeepActive", override([](const ImGuiIO& self){ return self.ConfigInputTextEnterKeepActive; }), rvp_ref(), allow_ptr())
.function("set_ConfigInputTextEnterKeepActive", override([](ImGuiIO& self, bool value){ self.ConfigInputTextEnterKeepActive = value; }), allow_ptr())
.function("get_ConfigDragClickToInputText", override([](const ImGuiIO& self){ return self.ConfigDragClickToInputText; }), rvp_ref(), allow_ptr())
.function("set_ConfigDragClickToInputText", override([](ImGuiIO& self, bool value){ self.ConfigDragClickToInputText = value; }), allow_ptr())
.function("get_ConfigWindowsResizeFromEdges", override([](const ImGuiIO& self){ return self.ConfigWindowsResizeFromEdges; }), rvp_ref(), allow_ptr())
.function("set_ConfigWindowsResizeFromEdges", override([](ImGuiIO& self, bool value){ self.ConfigWindowsResizeFromEdges = value; }), allow_ptr())
.function("get_ConfigWindowsMoveFromTitleBarOnly", override([](const ImGuiIO& self){ return self.ConfigWindowsMoveFromTitleBarOnly; }), rvp_ref(), allow_ptr())
.function("set_ConfigWindowsMoveFromTitleBarOnly", override([](ImGuiIO& self, bool value){ self.ConfigWindowsMoveFromTitleBarOnly = value; }), allow_ptr())
.function("get_ConfigWindowsCopyContentsWithCtrlC", override([](const ImGuiIO& self){ return self.ConfigWindowsCopyContentsWithCtrlC; }), rvp_ref(), allow_ptr())
.function("set_ConfigWindowsCopyContentsWithCtrlC", override([](ImGuiIO& self, bool value){ self.ConfigWindowsCopyContentsWithCtrlC = value; }), allow_ptr())
.function("get_ConfigScrollbarScrollByPage", override([](const ImGuiIO& self){ return self.ConfigScrollbarScrollByPage; }), rvp_ref(), allow_ptr())
.function("set_ConfigScrollbarScrollByPage", override([](ImGuiIO& self, bool value){ self.ConfigScrollbarScrollByPage = value; }), allow_ptr())
.function("get_ConfigMemoryCompactTimer", override([](const ImGuiIO& self){ return self.ConfigMemoryCompactTimer; }), rvp_ref(), allow_ptr())
.function("set_ConfigMemoryCompactTimer", override([](ImGuiIO& self, float value){ self.ConfigMemoryCompactTimer = value; }), allow_ptr())
.function("get_MouseDoubleClickTime", override([](const ImGuiIO& self){ return self.MouseDoubleClickTime; }), rvp_ref(), allow_ptr())
.function("set_MouseDoubleClickTime", override([](ImGuiIO& self, float value){ self.MouseDoubleClickTime = value; }), allow_ptr())
.function("get_MouseDoubleClickMaxDist", override([](const ImGuiIO& self){ return self.MouseDoubleClickMaxDist; }), rvp_ref(), allow_ptr())
.function("set_MouseDoubleClickMaxDist", override([](ImGuiIO& self, float value){ self.MouseDoubleClickMaxDist = value; }), allow_ptr())
.function("get_MouseDragThreshold", override([](const ImGuiIO& self){ return self.MouseDragThreshold; }), rvp_ref(), allow_ptr())
.function("set_MouseDragThreshold", override([](ImGuiIO& self, float value){ self.MouseDragThreshold = value; }), allow_ptr())
.function("get_KeyRepeatDelay", override([](const ImGuiIO& self){ return self.KeyRepeatDelay; }), rvp_ref(), allow_ptr())
.function("set_KeyRepeatDelay", override([](ImGuiIO& self, float value){ self.KeyRepeatDelay = value; }), allow_ptr())
.function("get_KeyRepeatRate", override([](const ImGuiIO& self){ return self.KeyRepeatRate; }), rvp_ref(), allow_ptr())
.function("set_KeyRepeatRate", override([](ImGuiIO& self, float value){ self.KeyRepeatRate = value; }), allow_ptr())
.function("get_ConfigErrorRecovery", override([](const ImGuiIO& self){ return self.ConfigErrorRecovery; }), rvp_ref(), allow_ptr())
.function("set_ConfigErrorRecovery", override([](ImGuiIO& self, bool value){ self.ConfigErrorRecovery = value; }), allow_ptr())
.function("get_ConfigErrorRecoveryEnableAssert", override([](const ImGuiIO& self){ return self.ConfigErrorRecoveryEnableAssert; }), rvp_ref(), allow_ptr())
.function("set_ConfigErrorRecoveryEnableAssert", override([](ImGuiIO& self, bool value){ self.ConfigErrorRecoveryEnableAssert = value; }), allow_ptr())
.function("get_ConfigErrorRecoveryEnableDebugLog", override([](const ImGuiIO& self){ return self.ConfigErrorRecoveryEnableDebugLog; }), rvp_ref(), allow_ptr())
.function("set_ConfigErrorRecoveryEnableDebugLog", override([](ImGuiIO& self, bool value){ self.ConfigErrorRecoveryEnableDebugLog = value; }), allow_ptr())
.function("get_ConfigErrorRecoveryEnableTooltip", override([](const ImGuiIO& self){ return self.ConfigErrorRecoveryEnableTooltip; }), rvp_ref(), allow_ptr())
.function("set_ConfigErrorRecoveryEnableTooltip", override([](ImGuiIO& self, bool value){ self.ConfigErrorRecoveryEnableTooltip = value; }), allow_ptr())
.function("get_ConfigDebugIsDebuggerPresent", override([](const ImGuiIO& self){ return self.ConfigDebugIsDebuggerPresent; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugIsDebuggerPresent", override([](ImGuiIO& self, bool value){ self.ConfigDebugIsDebuggerPresent = value; }), allow_ptr())
.function("get_ConfigDebugHighlightIdConflicts", override([](const ImGuiIO& self){ return self.ConfigDebugHighlightIdConflicts; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugHighlightIdConflicts", override([](ImGuiIO& self, bool value){ self.ConfigDebugHighlightIdConflicts = value; }), allow_ptr())
.function("get_ConfigDebugHighlightIdConflictsShowItemPicker", override([](const ImGuiIO& self){ return self.ConfigDebugHighlightIdConflictsShowItemPicker; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugHighlightIdConflictsShowItemPicker", override([](ImGuiIO& self, bool value){ self.ConfigDebugHighlightIdConflictsShowItemPicker = value; }), allow_ptr())
.function("get_ConfigDebugBeginReturnValueOnce", override([](const ImGuiIO& self){ return self.ConfigDebugBeginReturnValueOnce; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugBeginReturnValueOnce", override([](ImGuiIO& self, bool value){ self.ConfigDebugBeginReturnValueOnce = value; }), allow_ptr())
.function("get_ConfigDebugBeginReturnValueLoop", override([](const ImGuiIO& self){ return self.ConfigDebugBeginReturnValueLoop; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugBeginReturnValueLoop", override([](ImGuiIO& self, bool value){ self.ConfigDebugBeginReturnValueLoop = value; }), allow_ptr())
.function("get_ConfigDebugIgnoreFocusLoss", override([](const ImGuiIO& self){ return self.ConfigDebugIgnoreFocusLoss; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugIgnoreFocusLoss", override([](ImGuiIO& self, bool value){ self.ConfigDebugIgnoreFocusLoss = value; }), allow_ptr())
.function("get_ConfigDebugIniSettings", override([](const ImGuiIO& self){ return self.ConfigDebugIniSettings; }), rvp_ref(), allow_ptr())
.function("set_ConfigDebugIniSettings", override([](ImGuiIO& self, bool value){ self.ConfigDebugIniSettings = value; }), allow_ptr())
.function("get_WantCaptureMouse", override([](const ImGuiIO& self){ return self.WantCaptureMouse; }), rvp_ref(), allow_ptr())
.function("set_WantCaptureMouse", override([](ImGuiIO& self, bool value){ self.WantCaptureMouse = value; }), allow_ptr())
.function("get_WantCaptureKeyboard", override([](const ImGuiIO& self){ return self.WantCaptureKeyboard; }), rvp_ref(), allow_ptr())
.function("set_WantCaptureKeyboard", override([](ImGuiIO& self, bool value){ self.WantCaptureKeyboard = value; }), allow_ptr())
.function("get_WantTextInput", override([](const ImGuiIO& self){ return self.WantTextInput; }), rvp_ref(), allow_ptr())
.function("set_WantTextInput", override([](ImGuiIO& self, bool value){ self.WantTextInput = value; }), allow_ptr())
.function("get_WantSetMousePos", override([](const ImGuiIO& self){ return self.WantSetMousePos; }), rvp_ref(), allow_ptr())
.function("set_WantSetMousePos", override([](ImGuiIO& self, bool value){ self.WantSetMousePos = value; }), allow_ptr())
.function("get_WantSaveIniSettings", override([](const ImGuiIO& self){ return self.WantSaveIniSettings; }), rvp_ref(), allow_ptr())
.function("set_WantSaveIniSettings", override([](ImGuiIO& self, bool value){ self.WantSaveIniSettings = value; }), allow_ptr())
.function("get_NavActive", override([](const ImGuiIO& self){ return self.NavActive; }), rvp_ref(), allow_ptr())
.function("set_NavActive", override([](ImGuiIO& self, bool value){ self.NavActive = value; }), allow_ptr())
.function("get_NavVisible", override([](const ImGuiIO& self){ return self.NavVisible; }), rvp_ref(), allow_ptr())
.function("set_NavVisible", override([](ImGuiIO& self, bool value){ self.NavVisible = value; }), allow_ptr())
.function("get_Framerate", override([](const ImGuiIO& self){ return self.Framerate; }), rvp_ref(), allow_ptr())
.function("set_Framerate", override([](ImGuiIO& self, float value){ self.Framerate = value; }), allow_ptr())
.function("get_MetricsRenderVertices", override([](const ImGuiIO& self){ return self.MetricsRenderVertices; }), rvp_ref(), allow_ptr())
.function("set_MetricsRenderVertices", override([](ImGuiIO& self, int value){ self.MetricsRenderVertices = value; }), allow_ptr())
.function("get_MetricsRenderIndices", override([](const ImGuiIO& self){ return self.MetricsRenderIndices; }), rvp_ref(), allow_ptr())
.function("set_MetricsRenderIndices", override([](ImGuiIO& self, int value){ self.MetricsRenderIndices = value; }), allow_ptr())
.function("get_MetricsRenderWindows", override([](const ImGuiIO& self){ return self.MetricsRenderWindows; }), rvp_ref(), allow_ptr())
.function("set_MetricsRenderWindows", override([](ImGuiIO& self, int value){ self.MetricsRenderWindows = value; }), allow_ptr())
.function("get_MetricsActiveWindows", override([](const ImGuiIO& self){ return self.MetricsActiveWindows; }), rvp_ref(), allow_ptr())
.function("set_MetricsActiveWindows", override([](ImGuiIO& self, int value){ self.MetricsActiveWindows = value; }), allow_ptr())
.function("get_MouseDelta", override([](const ImGuiIO& self){ return self.MouseDelta; }), rvp_ref(), allow_ptr())
.function("set_MouseDelta", override([](ImGuiIO& self, ImVec2 value){ self.MouseDelta = value; }), allow_ptr())
.function("get_Ctx", override([](const ImGuiIO& self){ return self.Ctx; }), rvp_ref(), allow_ptr())
.function("set_Ctx", override([](ImGuiIO& self, ImGuiContext* value){ self.Ctx = value; }), allow_ptr())
.function("get_MousePos", override([](const ImGuiIO& self){ return self.MousePos; }), rvp_ref(), allow_ptr())
.function("set_MousePos", override([](ImGuiIO& self, ImVec2 value){ self.MousePos = value; }), allow_ptr())
.function("get_MouseWheel", override([](const ImGuiIO& self){ return self.MouseWheel; }), rvp_ref(), allow_ptr())
.function("set_MouseWheel", override([](ImGuiIO& self, float value){ self.MouseWheel = value; }), allow_ptr())
.function("get_MouseWheelH", override([](const ImGuiIO& self){ return self.MouseWheelH; }), rvp_ref(), allow_ptr())
.function("set_MouseWheelH", override([](ImGuiIO& self, float value){ self.MouseWheelH = value; }), allow_ptr())
.function("get_MouseSource", override([](const ImGuiIO& self){ return self.MouseSource; }), rvp_ref(), allow_ptr())
.function("set_MouseSource", override([](ImGuiIO& self, ImGuiMouseSource value){ self.MouseSource = value; }), allow_ptr())
.function("get_MouseHoveredViewport", override([](const ImGuiIO& self){ return self.MouseHoveredViewport; }), rvp_ref(), allow_ptr())
.function("set_MouseHoveredViewport", override([](ImGuiIO& self, ImGuiID value){ self.MouseHoveredViewport = value; }), allow_ptr())
.function("get_KeyCtrl", override([](const ImGuiIO& self){ return self.KeyCtrl; }), rvp_ref(), allow_ptr())
.function("set_KeyCtrl", override([](ImGuiIO& self, bool value){ self.KeyCtrl = value; }), allow_ptr())
.function("get_KeyShift", override([](const ImGuiIO& self){ return self.KeyShift; }), rvp_ref(), allow_ptr())
.function("set_KeyShift", override([](ImGuiIO& self, bool value){ self.KeyShift = value; }), allow_ptr())
.function("get_KeyAlt", override([](const ImGuiIO& self){ return self.KeyAlt; }), rvp_ref(), allow_ptr())
.function("set_KeyAlt", override([](ImGuiIO& self, bool value){ self.KeyAlt = value; }), allow_ptr())
.function("get_KeySuper", override([](const ImGuiIO& self){ return self.KeySuper; }), rvp_ref(), allow_ptr())
.function("set_KeySuper", override([](ImGuiIO& self, bool value){ self.KeySuper = value; }), allow_ptr())
.function("get_KeyMods", override([](const ImGuiIO& self){ return self.KeyMods; }), rvp_ref(), allow_ptr())
.function("set_KeyMods", override([](ImGuiIO& self, ImGuiKeyChord value){ self.KeyMods = value; }), allow_ptr())
.function("get_WantCaptureMouseUnlessPopupClose", override([](const ImGuiIO& self){ return self.WantCaptureMouseUnlessPopupClose; }), rvp_ref(), allow_ptr())
.function("set_WantCaptureMouseUnlessPopupClose", override([](ImGuiIO& self, bool value){ self.WantCaptureMouseUnlessPopupClose = value; }), allow_ptr())
.function("get_MousePosPrev", override([](const ImGuiIO& self){ return self.MousePosPrev; }), rvp_ref(), allow_ptr())
.function("set_MousePosPrev", override([](ImGuiIO& self, ImVec2 value){ self.MousePosPrev = value; }), allow_ptr())
.function("ImGuiIO_AddKeyEvent", override([](ImGuiIO* self, ImGuiKey key, bool down){ return ImGuiIO_AddKeyEvent(self, key, down); }), allow_ptr())
.function("ImGuiIO_AddKeyAnalogEvent", override([](ImGuiIO* self, ImGuiKey key, bool down, float v){ return ImGuiIO_AddKeyAnalogEvent(self, key, down, v); }), allow_ptr())
.function("ImGuiIO_AddMousePosEvent", override([](ImGuiIO* self, float x, float y){ return ImGuiIO_AddMousePosEvent(self, x, y); }), allow_ptr())
.function("ImGuiIO_AddMouseButtonEvent", override([](ImGuiIO* self, int button, bool down){ return ImGuiIO_AddMouseButtonEvent(self, button, down); }), allow_ptr())
.function("ImGuiIO_AddMouseWheelEvent", override([](ImGuiIO* self, float wheel_x, float wheel_y){ return ImGuiIO_AddMouseWheelEvent(self, wheel_x, wheel_y); }), allow_ptr())
.function("ImGuiIO_AddMouseSourceEvent", override([](ImGuiIO* self, ImGuiMouseSource source){ return ImGuiIO_AddMouseSourceEvent(self, source); }), allow_ptr())
.function("ImGuiIO_AddMouseViewportEvent", override([](ImGuiIO* self, ImGuiID id){ return ImGuiIO_AddMouseViewportEvent(self, id); }), allow_ptr())
.function("ImGuiIO_AddFocusEvent", override([](ImGuiIO* self, bool focused){ return ImGuiIO_AddFocusEvent(self, focused); }), allow_ptr())
.function("ImGuiIO_AddInputCharacter", override([](ImGuiIO* self, unsigned int c){ return ImGuiIO_AddInputCharacter(self, c); }), allow_ptr())
.function("ImGuiIO_AddInputCharacterUTF16", override([](ImGuiIO* self, ImWchar16 c){ return ImGuiIO_AddInputCharacterUTF16(self, c); }), allow_ptr())
.function("ImGuiIO_AddInputCharactersUTF8", override([](ImGuiIO* self, std::string str){ return ImGuiIO_AddInputCharactersUTF8(self, str.c_str()); }), allow_ptr())
.function("ImGuiIO_SetAppAcceptingEvents", override([](ImGuiIO* self, bool accepting_events){ return ImGuiIO_SetAppAcceptingEvents(self, accepting_events); }), allow_ptr())
.function("ImGuiIO_ClearEventsQueue", override([](ImGuiIO* self){ return ImGuiIO_ClearEventsQueue(self); }), allow_ptr())
.function("ImGuiIO_ClearInputKeys", override([](ImGuiIO* self){ return ImGuiIO_ClearInputKeys(self); }), allow_ptr())
.function("ImGuiIO_ClearInputMouse", override([](ImGuiIO* self){ return ImGuiIO_ClearInputMouse(self); }), allow_ptr())
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

bind_struct<ImFontBaked>("ImFontBaked")
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
    auto _bind_p_open = ArrayParam<bool>(p_open);
    ImGui_ShowDemoWindow(&_bind_p_open);
    return;
}, allow_ptr());

bind_func("ImGui_ShowMetricsWindow", [](emscripten::val p_open){
    auto _bind_p_open = ArrayParam<bool>(p_open);
    ImGui_ShowMetricsWindow(&_bind_p_open);
    return;
}, allow_ptr());

bind_func("ImGui_ShowDebugLogWindow", [](emscripten::val p_open){
    auto _bind_p_open = ArrayParam<bool>(p_open);
    ImGui_ShowDebugLogWindow(&_bind_p_open);
    return;
}, allow_ptr());

bind_func("ImGui_ShowIDStackToolWindow", [](emscripten::val p_open){
    auto _bind_p_open = ArrayParam<bool>(p_open);
    ImGui_ShowIDStackToolWindow(&_bind_p_open);
    return;
}, allow_ptr());

bind_func("ImGui_ShowAboutWindow", [](emscripten::val p_open){
    auto _bind_p_open = ArrayParam<bool>(p_open);
    ImGui_ShowAboutWindow(&_bind_p_open);
    return;
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
    auto _bind_p_open = ArrayParam<bool>(p_open);
    const auto _ret = ImGui_Begin(name.c_str(), &_bind_p_open, flags);
    return _ret;
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

bind_func("ImGui_SetNextWindowPos", [](ImVec2 pos, ImGuiCond cond, ImVec2 pivot){
    return ImGui_SetNextWindowPos(pos, cond, pivot);
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

bind_func("ImGui_PushFontFloat", [](ImFont* font, float font_size_base_unscaled){
    return ImGui_PushFontFloat(font, font_size_base_unscaled);
}, allow_ptr());

bind_func("ImGui_PopFont", [](){
    return ImGui_PopFont();
});

bind_func("ImGui_GetFont", [](){
    return ImGui_GetFont();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_GetFontSize", [](){
    return ImGui_GetFontSize();
});

bind_func("ImGui_GetFontBaked", [](){
    return ImGui_GetFontBaked();
}, rvp_ref(), allow_ptr());

bind_func("ImGui_PushStyleColor", [](ImGuiCol idx, ImU32 col){
    return ImGui_PushStyleColor(idx, col);
});

bind_func("ImGui_PopStyleColor", [](int count){
    return ImGui_PopStyleColor(count);
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

bind_func("ImGui_PopStyleVar", [](int count){
    return ImGui_PopStyleVar(count);
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

bind_func("ImGui_SameLine", [](float offset_from_start_x, float spacing){
    return ImGui_SameLine(offset_from_start_x, spacing);
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

bind_func("ImGui_Indent", [](float indent_w){
    return ImGui_Indent(indent_w);
});

bind_func("ImGui_Unindent", [](float indent_w){
    return ImGui_Unindent(indent_w);
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

bind_func("ImGui_PushIDInt", [](int int_id){
    return ImGui_PushIDInt(int_id);
});

bind_func("ImGui_GetIDInt", [](int int_id){
    return ImGui_GetIDInt(int_id);
});

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
    return ImGui_TextWrapped("%s", fmt.c_str());
});

bind_func("ImGui_LabelText", [](std::string label, std::string fmt){
    return ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
});

bind_func("ImGui_BulletText", [](std::string fmt){
    return ImGui_BulletText("%s", fmt.c_str());
});

bind_func("ImGui_SeparatorText", [](std::string label){
    return ImGui_SeparatorText(label.c_str());
}, allow_ptr());

bind_func("ImGui_Button", [](std::string label, ImVec2 size){
    return ImGui_Button(label.c_str(), size);
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
    auto _bind_v = ArrayParam<bool>(v);
    const auto _ret = ImGui_Checkbox(label.c_str(), &_bind_v);
    return _ret;
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

bind_func("ImGui_TextLinkOpenURL", [](std::string label, std::string url){
    return ImGui_TextLinkOpenURL(label.c_str(), url.c_str());
}, allow_ptr());

bind_func("ImGui_Image", [](ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1){
    return ImGui_Image(tex_ref, image_size, uv0, uv1);
});

bind_func("ImGui_ImageWithBg", [](ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col){
    return ImGui_ImageWithBg(tex_ref, image_size, uv0, uv1, bg_col, tint_col);
});

bind_func("ImGui_ImageButton", [](std::string str_id, ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col){
    return ImGui_ImageButton(str_id.c_str(), tex_ref, image_size, uv0, uv1, bg_col, tint_col);
}, allow_ptr());

bind_func("ImGui_BeginCombo", [](std::string label, std::string preview_value, ImGuiComboFlags flags){
    return ImGui_BeginCombo(label.c_str(), preview_value.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_EndCombo", [](){
    return ImGui_EndCombo();
});

bind_func("ImGui_DragFloat", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_DragFloat(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragFloat2", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_DragFloat2(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragFloat3", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_DragFloat3(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragFloat4", [](std::string label, emscripten::val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_DragFloat4(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragFloatRange2", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, float v_min, float v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
    auto _bind_v_current_min = ArrayParam<float>(v_current_min);
    auto _bind_v_current_max = ArrayParam<float>(v_current_max);
    const auto _ret = ImGui_DragFloatRange2(label.c_str(), &_bind_v_current_min, &_bind_v_current_max, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragInt", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_DragInt(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragInt2", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_DragInt2(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragInt3", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_DragInt3(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragInt4", [](std::string label, emscripten::val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_DragInt4(label.c_str(), &_bind_v, v_speed, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_DragIntRange2", [](std::string label, emscripten::val v_current_min, emscripten::val v_current_max, float v_speed, int v_min, int v_max, std::string format, std::string format_max, ImGuiSliderFlags flags){
    auto _bind_v_current_min = ArrayParam<int>(v_current_min);
    auto _bind_v_current_max = ArrayParam<int>(v_current_max);
    const auto _ret = ImGui_DragIntRange2(label.c_str(), &_bind_v_current_min, &_bind_v_current_max, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderFloat", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_SliderFloat(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderFloat2", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_SliderFloat2(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderFloat3", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_SliderFloat3(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderFloat4", [](std::string label, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_SliderFloat4(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderAngle", [](std::string label, emscripten::val v_rad, float v_degrees_min, float v_degrees_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v_rad = ArrayParam<float>(v_rad);
    const auto _ret = ImGui_SliderAngle(label.c_str(), &_bind_v_rad, v_degrees_min, v_degrees_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderInt", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_SliderInt(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderInt2", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_SliderInt2(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderInt3", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_SliderInt3(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_SliderInt4", [](std::string label, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_SliderInt4(label.c_str(), &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_VSliderFloat", [](std::string label, ImVec2 size, emscripten::val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_VSliderFloat(label.c_str(), size, &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_VSliderInt", [](std::string label, ImVec2 size, emscripten::val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_VSliderInt(label.c_str(), size, &_bind_v, v_min, v_max, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputText", [](std::string label, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    std::vector<char> buf_data(buf_size);
    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);
    buf_data[buf_size - 1] = '\0';
    const auto ret = ImGui_InputText(label.c_str(), buf_data.data(), buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data.data()));
    return ret;
});

bind_func("ImGui_InputTextMultiline", [](std::string label, emscripten::val buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    std::vector<char> buf_data(buf_size);
    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);
    buf_data[buf_size - 1] = '\0';
    const auto ret = ImGui_InputTextMultiline(label.c_str(), buf_data.data(), buf_size, size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data.data()));
    return ret;
});

bind_func("ImGui_InputTextWithHint", [](std::string label, std::string hint, emscripten::val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto buf_bind = buf[0].as<std::string>();
    std::vector<char> buf_data(buf_size);
    strncpy(buf_data.data(), buf_bind.c_str(), buf_size - 1);
    buf_data[buf_size - 1] = '\0';
    const auto ret = ImGui_InputTextWithHint(label.c_str(), hint.c_str(), buf_data.data(), buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(buf_data.data()));
    return ret;
});

bind_func("ImGui_InputFloat", [](std::string label, emscripten::val v, float step, float step_fast, std::string format, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_InputFloat(label.c_str(), &_bind_v, step, step_fast, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputFloat2", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_InputFloat2(label.c_str(), &_bind_v, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputFloat3", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_InputFloat3(label.c_str(), &_bind_v, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputFloat4", [](std::string label, emscripten::val v, std::string format, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<float>(v);
    const auto _ret = ImGui_InputFloat4(label.c_str(), &_bind_v, format.c_str(), flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputInt", [](std::string label, emscripten::val v, int step, int step_fast, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_InputInt(label.c_str(), &_bind_v, step, step_fast, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputInt2", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_InputInt2(label.c_str(), &_bind_v, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputInt3", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_InputInt3(label.c_str(), &_bind_v, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputInt4", [](std::string label, emscripten::val v, ImGuiInputTextFlags flags){
    auto _bind_v = ArrayParam<int>(v);
    const auto _ret = ImGui_InputInt4(label.c_str(), &_bind_v, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_InputDouble", [](std::string label, double* v, double step, double step_fast, std::string format, ImGuiInputTextFlags flags){
    return ImGui_InputDouble(label.c_str(), v, step, step_fast, format.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_ColorEdit3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto _bind_col = ArrayParam<float>(col);
    const auto _ret = ImGui_ColorEdit3(label.c_str(), &_bind_col, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_ColorEdit4", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto _bind_col = ArrayParam<float>(col);
    const auto _ret = ImGui_ColorEdit4(label.c_str(), &_bind_col, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_ColorPicker3", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags){
    auto _bind_col = ArrayParam<float>(col);
    const auto _ret = ImGui_ColorPicker3(label.c_str(), &_bind_col, flags);
    return _ret;
}, allow_ptr());

bind_func("ImGui_ColorPicker4", [](std::string label, emscripten::val col, ImGuiColorEditFlags flags, const float* ref_col){
    auto _bind_col = ArrayParam<float>(col);
    const auto _ret = ImGui_ColorPicker4(label.c_str(), &_bind_col, flags, ref_col);
    return _ret;
}, allow_ptr());

bind_func("ImGui_ColorButton", [](std::string desc_id, ImVec4 col, ImGuiColorEditFlags flags, ImVec2 size){
    return ImGui_ColorButton(desc_id.c_str(), col, flags, size);
}, allow_ptr());

bind_func("ImGui_SetColorEditOptions", [](ImGuiColorEditFlags flags){
    return ImGui_SetColorEditOptions(flags);
});

bind_func("ImGui_TreeNode", [](std::string label){
    return ImGui_TreeNode(label.c_str());
}, allow_ptr());

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

bind_func("ImGui_Selectable", [](std::string label, bool selected, ImGuiSelectableFlags flags, ImVec2 size){
    return ImGui_Selectable(label.c_str(), selected, flags, size);
}, allow_ptr());

bind_func("ImGui_BeginMultiSelect", [](ImGuiMultiSelectFlags flags, int selection_size, int items_count){
    return ImGui_BeginMultiSelect(flags, selection_size, items_count);
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

bind_func("ImGui_PlotLines", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotLines(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
}, allow_ptr());

bind_func("ImGui_PlotHistogram", [](std::string label, emscripten::val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size){
    auto values_bind = ArrayParam<float>(values);
    return ImGui_PlotHistogram(label.c_str(), &values_bind, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, sizeof(float));
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

bind_func("ImGui_BeginMenu", [](std::string label, bool enabled){
    return ImGui_BeginMenu(label.c_str(), enabled);
}, allow_ptr());

bind_func("ImGui_EndMenu", [](){
    return ImGui_EndMenu();
});

bind_func("ImGui_MenuItem", [](std::string label, std::string shortcut, bool selected, bool enabled){
    return ImGui_MenuItem(label.c_str(), shortcut.c_str(), selected, enabled);
}, allow_ptr());

bind_func("ImGui_BeginTooltip", [](){
    return ImGui_BeginTooltip();
});

bind_func("ImGui_EndTooltip", [](){
    return ImGui_EndTooltip();
});

bind_func("ImGui_SetTooltip", [](std::string fmt){
    return ImGui_SetTooltip("%s", fmt.c_str());
});

bind_func("ImGui_BeginItemTooltip", [](){
    return ImGui_BeginItemTooltip();
});

bind_func("ImGui_SetItemTooltip", [](std::string fmt){
    return ImGui_SetItemTooltip("%s", fmt.c_str());
});

bind_func("ImGui_BeginPopup", [](std::string str_id, ImGuiWindowFlags flags){
    return ImGui_BeginPopup(str_id.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupModal", [](std::string name, emscripten::val p_open, ImGuiWindowFlags flags){
    auto _bind_p_open = ArrayParam<bool>(p_open);
    const auto _ret = ImGui_BeginPopupModal(name.c_str(), &_bind_p_open, flags);
    return _ret;
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

bind_func("ImGui_BeginPopupContextItem", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextItem(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupContextWindow", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextWindow(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_BeginPopupContextVoid", [](std::string str_id, ImGuiPopupFlags popup_flags){
    return ImGui_BeginPopupContextVoid(str_id.c_str(), popup_flags);
}, allow_ptr());

bind_func("ImGui_IsPopupOpen", [](std::string str_id, ImGuiPopupFlags flags){
    return ImGui_IsPopupOpen(str_id.c_str(), flags);
}, allow_ptr());

bind_func("ImGui_BeginTable", [](std::string str_id, int columns, ImGuiTableFlags flags, ImVec2 outer_size, float inner_width){
    return ImGui_BeginTable(str_id.c_str(), columns, flags, outer_size, inner_width);
}, allow_ptr());

bind_func("ImGui_EndTable", [](){
    return ImGui_EndTable();
});

bind_func("ImGui_TableNextRow", [](ImGuiTableRowFlags row_flags, float min_row_height){
    return ImGui_TableNextRow(row_flags, min_row_height);
});

bind_func("ImGui_TableNextColumn", [](){
    return ImGui_TableNextColumn();
});

bind_func("ImGui_TableSetColumnIndex", [](int column_n){
    return ImGui_TableSetColumnIndex(column_n);
});

bind_func("ImGui_TableSetupColumn", [](std::string label, ImGuiTableColumnFlags flags, float init_width_or_weight, ImGuiID user_id){
    return ImGui_TableSetupColumn(label.c_str(), flags, init_width_or_weight, user_id);
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

bind_func("ImGui_Columns", [](int count, std::string id, bool borders){
    return ImGui_Columns(count, id.c_str(), borders);
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
    auto _bind_p_open = ArrayParam<bool>(p_open);
    const auto _ret = ImGui_BeginTabItem(label.c_str(), &_bind_p_open, flags);
    return _ret;
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

bind_func("ImGui_SetKeyboardFocusHere", [](int offset){
    return ImGui_SetKeyboardFocusHere(offset);
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

bind_func("ImGui_IsItemClicked", [](ImGuiMouseButton mouse_button){
    return ImGui_IsItemClicked(mouse_button);
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

bind_func("ImGui_CalcTextSize", [](std::string text, std::string text_end, bool hide_text_after_double_hash, float wrap_width){
    return ImGui_CalcTextSize(text.c_str(), text_end.c_str(), hide_text_after_double_hash, wrap_width);
}, allow_ptr());

bind_func("ImGui_IsKeyDown", [](ImGuiKey key){
    return ImGui_IsKeyDown(key);
});

bind_func("ImGui_IsKeyPressed", [](ImGuiKey key, bool repeat){
    return ImGui_IsKeyPressed(key, repeat);
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

bind_func("ImGui_IsMouseClicked", [](ImGuiMouseButton button, bool repeat){
    return ImGui_IsMouseClicked(button, repeat);
});

bind_func("ImGui_IsMouseReleased", [](ImGuiMouseButton button){
    return ImGui_IsMouseReleased(button);
});

bind_func("ImGui_IsMouseDoubleClicked", [](ImGuiMouseButton button){
    return ImGui_IsMouseDoubleClicked(button);
});

bind_func("ImGui_IsMouseReleasedWithDelay", [](ImGuiMouseButton button, float delay){
    return ImGui_IsMouseReleasedWithDelay(button, delay);
});

bind_func("ImGui_GetMouseClickedCount", [](ImGuiMouseButton button){
    return ImGui_GetMouseClickedCount(button);
});

bind_func("ImGui_IsMouseHoveringRect", [](ImVec2 r_min, ImVec2 r_max, bool clip){
    return ImGui_IsMouseHoveringRect(r_min, r_max, clip);
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

bind_func("ImGui_ResetMouseDragDelta", [](ImGuiMouseButton button){
    return ImGui_ResetMouseDragDelta(button);
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
