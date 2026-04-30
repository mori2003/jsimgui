#include <dcimgui.h>
#include <dcimgui_internal.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_impl_wgpu.h>

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten/wire.h>
#include <emscripten/heap.h>
#include <emscripten/stack.h>

#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

#include <array>
#include <cstddef>
#include <cstdint>
#include <ranges>
#include <type_traits>
#include <utility>
#include <vector>
#include <string>

#include <malloc.h>

using js_val = emscripten::val;
using allow_raw_ptrs = emscripten::allow_raw_pointers;
using rvp_ref = emscripten::return_value_policy::reference;

template <typename... Ts>
consteval auto unused(Ts&&...) -> void {};

template <typename Fn>
constexpr auto override(Fn&& fn) {
    return emscripten::optional_override(std::forward<Fn>(fn));
}

template <typename Fn, typename... Policies>
constexpr auto bind_fn(const char* name, Fn&& fn, Policies&&... policies) -> void {
    return emscripten::function(
        name,
        emscripten::optional_override(std::forward<Fn>(fn)),
        std::forward<Policies>(policies)...
    );
}

template <typename T>
constexpr auto bind_struct(const char* name) -> emscripten::class_<T> {
    return emscripten::class_<T>(name);
}

template <typename T, size_t N>
struct array_param {
    std::array<T, N> arr = {};
    T* ptr = nullptr;
};

template <typename T, size_t N>
inline auto get_array_param(js_val const& v) -> array_param<T, N> {
    array_param<T, N> out{};

    if (v.isNull() || v.isUndefined() || !v.isArray())
        return out;

    auto const len = v["length"].as<size_t>();
    if (len <= 0 || len > N)
        return out;

    for (auto const i : std::views::iota(0uz, len)) {
        out.arr[i] = v[i].as<T>();
    }

    out.ptr = out.arr.data();
    return out;
}

template <typename T, size_t N>
inline auto write_back_array_param(array_param<T, N> const& out, js_val& v) -> void {
    if (!out.ptr)
        return;

    for (auto const i : std::views::iota(0uz, N)) {
        v.set(i, out.arr[i]);
    }
}

template <typename T>
struct vector_param {
    std::vector<T> vec = {};
    T* ptr = nullptr;
};

template <typename T>
inline auto get_vector_param(js_val const& v) -> vector_param<T> {
    vector_param<T> out{};

    if (v.isNull() || v.isUndefined() || !v.isArray())
        return out;

    auto const len = v["length"].as<size_t>();
    if (len <= 0)
        return out;

    out.vec.reserve(len);
    for (auto const i : std::views::iota(0uz, len)) {
        out.vec.emplace_back(v[i].as<T>());
    }

    out.ptr = out.vec.data();
    return out;
}

template <typename T>
inline auto write_back_vector_param(vector_param<T> const& out, js_val& v) -> void {
    if (!out.ptr)
        return;

    for (auto const i : std::views::iota(0uz, out.vec.size())) {
        v.set(i, out.vec[i]);
    }
}

static auto get_clipboard_fn = js_val::null();
static auto set_clipboard_fn = js_val::null();

static auto get_clipboard_text(ImGuiContext* ctx) -> const char* {
    unused(ctx);

    static auto text = std::string();
    text = get_clipboard_fn().as<std::string>();
    return text.c_str();
};

static auto set_clipboard_text(ImGuiContext* ctx, const char* text) -> void {
    unused(ctx);

    set_clipboard_fn(std::string(text));
};

EMSCRIPTEN_BINDINGS(web) {
    bind_fn("SetupIniSettings", []() -> void {
        auto const& io = ImGui_GetIO();
        io->IniFilename = nullptr;
    });

    bind_fn("SetupClipboardFunctions", [](js_val get_fn, js_val set_fn) -> void {
        auto const& platform_io = ImGui_GetPlatformIO();

        get_clipboard_fn = std::move(get_fn);
        set_clipboard_fn = std::move(set_fn);

        platform_io->Platform_GetClipboardTextFn = get_clipboard_text;
        platform_io->Platform_SetClipboardTextFn = set_clipboard_text;
    });

    bind_fn("get_wasm_heap_info", []() -> js_val {
        auto obj = js_val::object();

        obj.set("size", js_val(emscripten_get_heap_size()));
        obj.set("max", js_val(emscripten_get_heap_max()));
        obj.set("sbrk_ptr", js_val(*emscripten_get_sbrk_ptr()));

        return obj;
    });

    bind_fn("get_wasm_stack_info", []() -> js_val {
        auto obj = js_val::object();

        obj.set("base", js_val(emscripten_stack_get_base()));
        obj.set("end", js_val(emscripten_stack_get_end()));
        obj.set("current", js_val(emscripten_stack_get_current()));
        obj.set("free", js_val(emscripten_stack_get_free()));

        return obj;
    });

    bind_fn("get_wasm_mall_info", []() -> js_val {
        auto const& info = mallinfo();
        auto obj = js_val::object();

        obj.set("arena", js_val(info.arena));
        obj.set("ordblks", js_val(info.ordblks));
        obj.set("smblks", js_val(info.smblks));
        obj.set("hblks", js_val(info.hblks));
        obj.set("hblkhd", js_val(info.hblkhd));
        obj.set("usmblks", js_val(info.usmblks));
        obj.set("fsmblks", js_val(info.fsmblks));
        obj.set("uordblks", js_val(info.uordblks));
        obj.set("fordblks", js_val(info.fordblks));
        obj.set("keepcost", js_val(info.keepcost));

        return obj;
    });
}

EMSCRIPTEN_BINDINGS(webgl) {
    bind_fn("cImGui_ImplOpenGL3_Init", []() -> bool {
        return cImGui_ImplOpenGL3_Init();
    });

    bind_fn("cImGui_ImplOpenGL3_Shutdown", []() -> void {
        cImGui_ImplOpenGL3_Shutdown();
    });

    bind_fn("cImGui_ImplOpenGL3_NewFrame", []() -> void {
        cImGui_ImplOpenGL3_NewFrame();
    });

    bind_fn(
        "cImGui_ImplOpenGL3_RenderDrawData",
        [](ImDrawData* draw_data) -> void {
            cImGui_ImplOpenGL3_RenderDrawData(draw_data);
        },
        allow_raw_ptrs{}
    );
}

EMSCRIPTEN_BINDINGS(webgpu) {
    bind_fn("cImGui_ImplWGPU_Init", [](uintptr_t handle) -> bool {
        auto const device = reinterpret_cast<WGPUDevice>(handle);

        auto init_info = ImGui_ImplWGPU_InitInfo{
            .Device = device,
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

    bind_fn("cImGui_ImplWGPU_Shutdown", []() -> void {
        cImGui_ImplWGPU_Shutdown();
    });

    bind_fn("cImGui_ImplWGPU_NewFrame", []() -> void {
        cImGui_ImplWGPU_NewFrame();
    });

    bind_fn(
        "cImGui_ImplWGPU_RenderDrawData",
        [](ImDrawData* draw_data, uintptr_t handle) -> void {
            auto const pass_encoder = reinterpret_cast<WGPURenderPassEncoder>(handle);

            cImGui_ImplWGPU_RenderDrawData(draw_data, pass_encoder);
        },
        allow_raw_ptrs{}
    );
}


EMSCRIPTEN_BINDINGS(imgui) {
emscripten::value_object<ImVec2>("ImVec2")
.field("x", &ImVec2::x)
.field("y", &ImVec2::y)
;
emscripten::value_object<ImVec4>("ImVec4")
.field("x", &ImVec4::x)
.field("y", &ImVec4::y)
.field("z", &ImVec4::z)
.field("w", &ImVec4::w)
;
emscripten::value_object<ImTextureRef>("ImTextureRef")
.field("_TexID", &ImTextureRef::_TexID)
;
bind_struct<ImDrawListSharedData>("ImDrawListSharedData")
.constructor<>()
;
bind_struct<ImFontAtlasBuilder>("ImFontAtlasBuilder")
.constructor<>()
;
bind_struct<ImFontLoader>("ImFontLoader")
.constructor<>()
;
bind_struct<ImGuiContext>("ImGuiContext")
.constructor<>()
;
bind_struct<ImGuiTableSortSpecs>("ImGuiTableSortSpecs")
.constructor<>()
.function("get_Specs", override([](ImGuiTableSortSpecs const* self){
    return self->Specs;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Specs", override([](ImGuiTableSortSpecs* self, const ImGuiTableColumnSortSpecs* value){
    self->Specs = value;
}), allow_raw_ptrs{})

.function("get_SpecsCount", override([](ImGuiTableSortSpecs const* self){
    return self->SpecsCount;
}), allow_raw_ptrs{})
.function("set_SpecsCount", override([](ImGuiTableSortSpecs* self, int value){
    self->SpecsCount = value;
}), allow_raw_ptrs{})

.function("get_SpecsDirty", override([](ImGuiTableSortSpecs const* self){
    return self->SpecsDirty;
}), allow_raw_ptrs{})
.function("set_SpecsDirty", override([](ImGuiTableSortSpecs* self, bool value){
    self->SpecsDirty = value;
}), allow_raw_ptrs{})

;
bind_struct<ImGuiTableColumnSortSpecs>("ImGuiTableColumnSortSpecs")
.constructor<>()
.function("get_ColumnUserID", override([](ImGuiTableColumnSortSpecs const* self){
    return self->ColumnUserID;
}), allow_raw_ptrs{})
.function("set_ColumnUserID", override([](ImGuiTableColumnSortSpecs* self, ImGuiID value){
    self->ColumnUserID = value;
}), allow_raw_ptrs{})

.function("get_ColumnIndex", override([](ImGuiTableColumnSortSpecs const* self){
    return self->ColumnIndex;
}), allow_raw_ptrs{})
.function("set_ColumnIndex", override([](ImGuiTableColumnSortSpecs* self, ImS16 value){
    self->ColumnIndex = value;
}), allow_raw_ptrs{})

.function("get_SortOrder", override([](ImGuiTableColumnSortSpecs const* self){
    return self->SortOrder;
}), allow_raw_ptrs{})
.function("set_SortOrder", override([](ImGuiTableColumnSortSpecs* self, ImS16 value){
    self->SortOrder = value;
}), allow_raw_ptrs{})

.function("get_SortDirection", override([](ImGuiTableColumnSortSpecs const* self){
    return self->SortDirection;
}), allow_raw_ptrs{})
.function("set_SortDirection", override([](ImGuiTableColumnSortSpecs* self, ImGuiSortDirection value){
    self->SortDirection = value;
}), allow_raw_ptrs{})

;
bind_struct<ImGuiStyle>("ImGuiStyle")
.constructor<>()
.function("get_FontSizeBase", override([](ImGuiStyle const* self){
    return self->FontSizeBase;
}), allow_raw_ptrs{})
.function("set_FontSizeBase", override([](ImGuiStyle* self, float value){
    self->FontSizeBase = value;
}), allow_raw_ptrs{})

.function("get_FontScaleMain", override([](ImGuiStyle const* self){
    return self->FontScaleMain;
}), allow_raw_ptrs{})
.function("set_FontScaleMain", override([](ImGuiStyle* self, float value){
    self->FontScaleMain = value;
}), allow_raw_ptrs{})

.function("get_FontScaleDpi", override([](ImGuiStyle const* self){
    return self->FontScaleDpi;
}), allow_raw_ptrs{})
.function("set_FontScaleDpi", override([](ImGuiStyle* self, float value){
    self->FontScaleDpi = value;
}), allow_raw_ptrs{})

.function("get_Alpha", override([](ImGuiStyle const* self){
    return self->Alpha;
}), allow_raw_ptrs{})
.function("set_Alpha", override([](ImGuiStyle* self, float value){
    self->Alpha = value;
}), allow_raw_ptrs{})

.function("get_DisabledAlpha", override([](ImGuiStyle const* self){
    return self->DisabledAlpha;
}), allow_raw_ptrs{})
.function("set_DisabledAlpha", override([](ImGuiStyle* self, float value){
    self->DisabledAlpha = value;
}), allow_raw_ptrs{})

.function("get_WindowPadding", override([](ImGuiStyle const* self){
    return self->WindowPadding;
}), allow_raw_ptrs{})
.function("set_WindowPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->WindowPadding = value;
}), allow_raw_ptrs{})

.function("get_WindowRounding", override([](ImGuiStyle const* self){
    return self->WindowRounding;
}), allow_raw_ptrs{})
.function("set_WindowRounding", override([](ImGuiStyle* self, float value){
    self->WindowRounding = value;
}), allow_raw_ptrs{})

.function("get_WindowBorderSize", override([](ImGuiStyle const* self){
    return self->WindowBorderSize;
}), allow_raw_ptrs{})
.function("set_WindowBorderSize", override([](ImGuiStyle* self, float value){
    self->WindowBorderSize = value;
}), allow_raw_ptrs{})

.function("get_WindowBorderHoverPadding", override([](ImGuiStyle const* self){
    return self->WindowBorderHoverPadding;
}), allow_raw_ptrs{})
.function("set_WindowBorderHoverPadding", override([](ImGuiStyle* self, float value){
    self->WindowBorderHoverPadding = value;
}), allow_raw_ptrs{})

.function("get_WindowMinSize", override([](ImGuiStyle const* self){
    return self->WindowMinSize;
}), allow_raw_ptrs{})
.function("set_WindowMinSize", override([](ImGuiStyle* self, ImVec2 value){
    self->WindowMinSize = value;
}), allow_raw_ptrs{})

.function("get_WindowTitleAlign", override([](ImGuiStyle const* self){
    return self->WindowTitleAlign;
}), allow_raw_ptrs{})
.function("set_WindowTitleAlign", override([](ImGuiStyle* self, ImVec2 value){
    self->WindowTitleAlign = value;
}), allow_raw_ptrs{})

.function("get_WindowMenuButtonPosition", override([](ImGuiStyle const* self){
    return self->WindowMenuButtonPosition;
}), allow_raw_ptrs{})
.function("set_WindowMenuButtonPosition", override([](ImGuiStyle* self, ImGuiDir value){
    self->WindowMenuButtonPosition = value;
}), allow_raw_ptrs{})

.function("get_ChildRounding", override([](ImGuiStyle const* self){
    return self->ChildRounding;
}), allow_raw_ptrs{})
.function("set_ChildRounding", override([](ImGuiStyle* self, float value){
    self->ChildRounding = value;
}), allow_raw_ptrs{})

.function("get_ChildBorderSize", override([](ImGuiStyle const* self){
    return self->ChildBorderSize;
}), allow_raw_ptrs{})
.function("set_ChildBorderSize", override([](ImGuiStyle* self, float value){
    self->ChildBorderSize = value;
}), allow_raw_ptrs{})

.function("get_PopupRounding", override([](ImGuiStyle const* self){
    return self->PopupRounding;
}), allow_raw_ptrs{})
.function("set_PopupRounding", override([](ImGuiStyle* self, float value){
    self->PopupRounding = value;
}), allow_raw_ptrs{})

.function("get_PopupBorderSize", override([](ImGuiStyle const* self){
    return self->PopupBorderSize;
}), allow_raw_ptrs{})
.function("set_PopupBorderSize", override([](ImGuiStyle* self, float value){
    self->PopupBorderSize = value;
}), allow_raw_ptrs{})

.function("get_FramePadding", override([](ImGuiStyle const* self){
    return self->FramePadding;
}), allow_raw_ptrs{})
.function("set_FramePadding", override([](ImGuiStyle* self, ImVec2 value){
    self->FramePadding = value;
}), allow_raw_ptrs{})

.function("get_FrameRounding", override([](ImGuiStyle const* self){
    return self->FrameRounding;
}), allow_raw_ptrs{})
.function("set_FrameRounding", override([](ImGuiStyle* self, float value){
    self->FrameRounding = value;
}), allow_raw_ptrs{})

.function("get_FrameBorderSize", override([](ImGuiStyle const* self){
    return self->FrameBorderSize;
}), allow_raw_ptrs{})
.function("set_FrameBorderSize", override([](ImGuiStyle* self, float value){
    self->FrameBorderSize = value;
}), allow_raw_ptrs{})

.function("get_ItemSpacing", override([](ImGuiStyle const* self){
    return self->ItemSpacing;
}), allow_raw_ptrs{})
.function("set_ItemSpacing", override([](ImGuiStyle* self, ImVec2 value){
    self->ItemSpacing = value;
}), allow_raw_ptrs{})

.function("get_ItemInnerSpacing", override([](ImGuiStyle const* self){
    return self->ItemInnerSpacing;
}), allow_raw_ptrs{})
.function("set_ItemInnerSpacing", override([](ImGuiStyle* self, ImVec2 value){
    self->ItemInnerSpacing = value;
}), allow_raw_ptrs{})

.function("get_CellPadding", override([](ImGuiStyle const* self){
    return self->CellPadding;
}), allow_raw_ptrs{})
.function("set_CellPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->CellPadding = value;
}), allow_raw_ptrs{})

.function("get_TouchExtraPadding", override([](ImGuiStyle const* self){
    return self->TouchExtraPadding;
}), allow_raw_ptrs{})
.function("set_TouchExtraPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->TouchExtraPadding = value;
}), allow_raw_ptrs{})

.function("get_IndentSpacing", override([](ImGuiStyle const* self){
    return self->IndentSpacing;
}), allow_raw_ptrs{})
.function("set_IndentSpacing", override([](ImGuiStyle* self, float value){
    self->IndentSpacing = value;
}), allow_raw_ptrs{})

.function("get_ColumnsMinSpacing", override([](ImGuiStyle const* self){
    return self->ColumnsMinSpacing;
}), allow_raw_ptrs{})
.function("set_ColumnsMinSpacing", override([](ImGuiStyle* self, float value){
    self->ColumnsMinSpacing = value;
}), allow_raw_ptrs{})

.function("get_ScrollbarSize", override([](ImGuiStyle const* self){
    return self->ScrollbarSize;
}), allow_raw_ptrs{})
.function("set_ScrollbarSize", override([](ImGuiStyle* self, float value){
    self->ScrollbarSize = value;
}), allow_raw_ptrs{})

.function("get_ScrollbarRounding", override([](ImGuiStyle const* self){
    return self->ScrollbarRounding;
}), allow_raw_ptrs{})
.function("set_ScrollbarRounding", override([](ImGuiStyle* self, float value){
    self->ScrollbarRounding = value;
}), allow_raw_ptrs{})

.function("get_ScrollbarPadding", override([](ImGuiStyle const* self){
    return self->ScrollbarPadding;
}), allow_raw_ptrs{})
.function("set_ScrollbarPadding", override([](ImGuiStyle* self, float value){
    self->ScrollbarPadding = value;
}), allow_raw_ptrs{})

.function("get_GrabMinSize", override([](ImGuiStyle const* self){
    return self->GrabMinSize;
}), allow_raw_ptrs{})
.function("set_GrabMinSize", override([](ImGuiStyle* self, float value){
    self->GrabMinSize = value;
}), allow_raw_ptrs{})

.function("get_GrabRounding", override([](ImGuiStyle const* self){
    return self->GrabRounding;
}), allow_raw_ptrs{})
.function("set_GrabRounding", override([](ImGuiStyle* self, float value){
    self->GrabRounding = value;
}), allow_raw_ptrs{})

.function("get_LogSliderDeadzone", override([](ImGuiStyle const* self){
    return self->LogSliderDeadzone;
}), allow_raw_ptrs{})
.function("set_LogSliderDeadzone", override([](ImGuiStyle* self, float value){
    self->LogSliderDeadzone = value;
}), allow_raw_ptrs{})

.function("get_ImageRounding", override([](ImGuiStyle const* self){
    return self->ImageRounding;
}), allow_raw_ptrs{})
.function("set_ImageRounding", override([](ImGuiStyle* self, float value){
    self->ImageRounding = value;
}), allow_raw_ptrs{})

.function("get_ImageBorderSize", override([](ImGuiStyle const* self){
    return self->ImageBorderSize;
}), allow_raw_ptrs{})
.function("set_ImageBorderSize", override([](ImGuiStyle* self, float value){
    self->ImageBorderSize = value;
}), allow_raw_ptrs{})

.function("get_TabRounding", override([](ImGuiStyle const* self){
    return self->TabRounding;
}), allow_raw_ptrs{})
.function("set_TabRounding", override([](ImGuiStyle* self, float value){
    self->TabRounding = value;
}), allow_raw_ptrs{})

.function("get_TabBorderSize", override([](ImGuiStyle const* self){
    return self->TabBorderSize;
}), allow_raw_ptrs{})
.function("set_TabBorderSize", override([](ImGuiStyle* self, float value){
    self->TabBorderSize = value;
}), allow_raw_ptrs{})

.function("get_TabMinWidthBase", override([](ImGuiStyle const* self){
    return self->TabMinWidthBase;
}), allow_raw_ptrs{})
.function("set_TabMinWidthBase", override([](ImGuiStyle* self, float value){
    self->TabMinWidthBase = value;
}), allow_raw_ptrs{})

.function("get_TabMinWidthShrink", override([](ImGuiStyle const* self){
    return self->TabMinWidthShrink;
}), allow_raw_ptrs{})
.function("set_TabMinWidthShrink", override([](ImGuiStyle* self, float value){
    self->TabMinWidthShrink = value;
}), allow_raw_ptrs{})

.function("get_TabCloseButtonMinWidthSelected", override([](ImGuiStyle const* self){
    return self->TabCloseButtonMinWidthSelected;
}), allow_raw_ptrs{})
.function("set_TabCloseButtonMinWidthSelected", override([](ImGuiStyle* self, float value){
    self->TabCloseButtonMinWidthSelected = value;
}), allow_raw_ptrs{})

.function("get_TabCloseButtonMinWidthUnselected", override([](ImGuiStyle const* self){
    return self->TabCloseButtonMinWidthUnselected;
}), allow_raw_ptrs{})
.function("set_TabCloseButtonMinWidthUnselected", override([](ImGuiStyle* self, float value){
    self->TabCloseButtonMinWidthUnselected = value;
}), allow_raw_ptrs{})

.function("get_TabBarBorderSize", override([](ImGuiStyle const* self){
    return self->TabBarBorderSize;
}), allow_raw_ptrs{})
.function("set_TabBarBorderSize", override([](ImGuiStyle* self, float value){
    self->TabBarBorderSize = value;
}), allow_raw_ptrs{})

.function("get_TabBarOverlineSize", override([](ImGuiStyle const* self){
    return self->TabBarOverlineSize;
}), allow_raw_ptrs{})
.function("set_TabBarOverlineSize", override([](ImGuiStyle* self, float value){
    self->TabBarOverlineSize = value;
}), allow_raw_ptrs{})

.function("get_TableAngledHeadersAngle", override([](ImGuiStyle const* self){
    return self->TableAngledHeadersAngle;
}), allow_raw_ptrs{})
.function("set_TableAngledHeadersAngle", override([](ImGuiStyle* self, float value){
    self->TableAngledHeadersAngle = value;
}), allow_raw_ptrs{})

.function("get_TableAngledHeadersTextAlign", override([](ImGuiStyle const* self){
    return self->TableAngledHeadersTextAlign;
}), allow_raw_ptrs{})
.function("set_TableAngledHeadersTextAlign", override([](ImGuiStyle* self, ImVec2 value){
    self->TableAngledHeadersTextAlign = value;
}), allow_raw_ptrs{})

.function("get_TreeLinesFlags", override([](ImGuiStyle const* self){
    return self->TreeLinesFlags;
}), allow_raw_ptrs{})
.function("set_TreeLinesFlags", override([](ImGuiStyle* self, ImGuiTreeNodeFlags value){
    self->TreeLinesFlags = value;
}), allow_raw_ptrs{})

.function("get_TreeLinesSize", override([](ImGuiStyle const* self){
    return self->TreeLinesSize;
}), allow_raw_ptrs{})
.function("set_TreeLinesSize", override([](ImGuiStyle* self, float value){
    self->TreeLinesSize = value;
}), allow_raw_ptrs{})

.function("get_TreeLinesRounding", override([](ImGuiStyle const* self){
    return self->TreeLinesRounding;
}), allow_raw_ptrs{})
.function("set_TreeLinesRounding", override([](ImGuiStyle* self, float value){
    self->TreeLinesRounding = value;
}), allow_raw_ptrs{})

.function("get_DragDropTargetRounding", override([](ImGuiStyle const* self){
    return self->DragDropTargetRounding;
}), allow_raw_ptrs{})
.function("set_DragDropTargetRounding", override([](ImGuiStyle* self, float value){
    self->DragDropTargetRounding = value;
}), allow_raw_ptrs{})

.function("get_DragDropTargetBorderSize", override([](ImGuiStyle const* self){
    return self->DragDropTargetBorderSize;
}), allow_raw_ptrs{})
.function("set_DragDropTargetBorderSize", override([](ImGuiStyle* self, float value){
    self->DragDropTargetBorderSize = value;
}), allow_raw_ptrs{})

.function("get_DragDropTargetPadding", override([](ImGuiStyle const* self){
    return self->DragDropTargetPadding;
}), allow_raw_ptrs{})
.function("set_DragDropTargetPadding", override([](ImGuiStyle* self, float value){
    self->DragDropTargetPadding = value;
}), allow_raw_ptrs{})

.function("get_ColorMarkerSize", override([](ImGuiStyle const* self){
    return self->ColorMarkerSize;
}), allow_raw_ptrs{})
.function("set_ColorMarkerSize", override([](ImGuiStyle* self, float value){
    self->ColorMarkerSize = value;
}), allow_raw_ptrs{})

.function("get_ColorButtonPosition", override([](ImGuiStyle const* self){
    return self->ColorButtonPosition;
}), allow_raw_ptrs{})
.function("set_ColorButtonPosition", override([](ImGuiStyle* self, ImGuiDir value){
    self->ColorButtonPosition = value;
}), allow_raw_ptrs{})

.function("get_ButtonTextAlign", override([](ImGuiStyle const* self){
    return self->ButtonTextAlign;
}), allow_raw_ptrs{})
.function("set_ButtonTextAlign", override([](ImGuiStyle* self, ImVec2 value){
    self->ButtonTextAlign = value;
}), allow_raw_ptrs{})

.function("get_SelectableTextAlign", override([](ImGuiStyle const* self){
    return self->SelectableTextAlign;
}), allow_raw_ptrs{})
.function("set_SelectableTextAlign", override([](ImGuiStyle* self, ImVec2 value){
    self->SelectableTextAlign = value;
}), allow_raw_ptrs{})

.function("get_SeparatorSize", override([](ImGuiStyle const* self){
    return self->SeparatorSize;
}), allow_raw_ptrs{})
.function("set_SeparatorSize", override([](ImGuiStyle* self, float value){
    self->SeparatorSize = value;
}), allow_raw_ptrs{})

.function("get_SeparatorTextBorderSize", override([](ImGuiStyle const* self){
    return self->SeparatorTextBorderSize;
}), allow_raw_ptrs{})
.function("set_SeparatorTextBorderSize", override([](ImGuiStyle* self, float value){
    self->SeparatorTextBorderSize = value;
}), allow_raw_ptrs{})

.function("get_SeparatorTextAlign", override([](ImGuiStyle const* self){
    return self->SeparatorTextAlign;
}), allow_raw_ptrs{})
.function("set_SeparatorTextAlign", override([](ImGuiStyle* self, ImVec2 value){
    self->SeparatorTextAlign = value;
}), allow_raw_ptrs{})

.function("get_SeparatorTextPadding", override([](ImGuiStyle const* self){
    return self->SeparatorTextPadding;
}), allow_raw_ptrs{})
.function("set_SeparatorTextPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->SeparatorTextPadding = value;
}), allow_raw_ptrs{})

.function("get_DisplayWindowPadding", override([](ImGuiStyle const* self){
    return self->DisplayWindowPadding;
}), allow_raw_ptrs{})
.function("set_DisplayWindowPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->DisplayWindowPadding = value;
}), allow_raw_ptrs{})

.function("get_DisplaySafeAreaPadding", override([](ImGuiStyle const* self){
    return self->DisplaySafeAreaPadding;
}), allow_raw_ptrs{})
.function("set_DisplaySafeAreaPadding", override([](ImGuiStyle* self, ImVec2 value){
    self->DisplaySafeAreaPadding = value;
}), allow_raw_ptrs{})

.function("get_DockingNodeHasCloseButton", override([](ImGuiStyle const* self){
    return self->DockingNodeHasCloseButton;
}), allow_raw_ptrs{})
.function("set_DockingNodeHasCloseButton", override([](ImGuiStyle* self, bool value){
    self->DockingNodeHasCloseButton = value;
}), allow_raw_ptrs{})

.function("get_DockingSeparatorSize", override([](ImGuiStyle const* self){
    return self->DockingSeparatorSize;
}), allow_raw_ptrs{})
.function("set_DockingSeparatorSize", override([](ImGuiStyle* self, float value){
    self->DockingSeparatorSize = value;
}), allow_raw_ptrs{})

.function("get_MouseCursorScale", override([](ImGuiStyle const* self){
    return self->MouseCursorScale;
}), allow_raw_ptrs{})
.function("set_MouseCursorScale", override([](ImGuiStyle* self, float value){
    self->MouseCursorScale = value;
}), allow_raw_ptrs{})

.function("get_AntiAliasedLines", override([](ImGuiStyle const* self){
    return self->AntiAliasedLines;
}), allow_raw_ptrs{})
.function("set_AntiAliasedLines", override([](ImGuiStyle* self, bool value){
    self->AntiAliasedLines = value;
}), allow_raw_ptrs{})

.function("get_AntiAliasedLinesUseTex", override([](ImGuiStyle const* self){
    return self->AntiAliasedLinesUseTex;
}), allow_raw_ptrs{})
.function("set_AntiAliasedLinesUseTex", override([](ImGuiStyle* self, bool value){
    self->AntiAliasedLinesUseTex = value;
}), allow_raw_ptrs{})

.function("get_AntiAliasedFill", override([](ImGuiStyle const* self){
    return self->AntiAliasedFill;
}), allow_raw_ptrs{})
.function("set_AntiAliasedFill", override([](ImGuiStyle* self, bool value){
    self->AntiAliasedFill = value;
}), allow_raw_ptrs{})

.function("get_CurveTessellationTol", override([](ImGuiStyle const* self){
    return self->CurveTessellationTol;
}), allow_raw_ptrs{})
.function("set_CurveTessellationTol", override([](ImGuiStyle* self, float value){
    self->CurveTessellationTol = value;
}), allow_raw_ptrs{})

.function("get_CircleTessellationMaxError", override([](ImGuiStyle const* self){
    return self->CircleTessellationMaxError;
}), allow_raw_ptrs{})
.function("set_CircleTessellationMaxError", override([](ImGuiStyle* self, float value){
    self->CircleTessellationMaxError = value;
}), allow_raw_ptrs{})

.function("get_Colors", override([](const ImGuiStyle& self){ 
    auto obj = emscripten::val::array();
    for (auto i = 0; i < ImGuiCol_COUNT; i++) {
        obj.set(i, self.Colors[i]);
    };
    return obj;
}), rvp_ref{}, allow_raw_ptrs{})

.function("set_Colors", override([](ImGuiStyle& self, js_val value){
    for (auto i = 0; i < ImGuiCol_COUNT; i++) {
        self.Colors[i] = value[i].as<ImVec4>();
    };
}), allow_raw_ptrs{})

.function("get_HoverStationaryDelay", override([](ImGuiStyle const* self){
    return self->HoverStationaryDelay;
}), allow_raw_ptrs{})
.function("set_HoverStationaryDelay", override([](ImGuiStyle* self, float value){
    self->HoverStationaryDelay = value;
}), allow_raw_ptrs{})

.function("get_HoverDelayShort", override([](ImGuiStyle const* self){
    return self->HoverDelayShort;
}), allow_raw_ptrs{})
.function("set_HoverDelayShort", override([](ImGuiStyle* self, float value){
    self->HoverDelayShort = value;
}), allow_raw_ptrs{})

.function("get_HoverDelayNormal", override([](ImGuiStyle const* self){
    return self->HoverDelayNormal;
}), allow_raw_ptrs{})
.function("set_HoverDelayNormal", override([](ImGuiStyle* self, float value){
    self->HoverDelayNormal = value;
}), allow_raw_ptrs{})

.function("get_HoverFlagsForTooltipMouse", override([](ImGuiStyle const* self){
    return self->HoverFlagsForTooltipMouse;
}), allow_raw_ptrs{})
.function("set_HoverFlagsForTooltipMouse", override([](ImGuiStyle* self, ImGuiHoveredFlags value){
    self->HoverFlagsForTooltipMouse = value;
}), allow_raw_ptrs{})

.function("get_HoverFlagsForTooltipNav", override([](ImGuiStyle const* self){
    return self->HoverFlagsForTooltipNav;
}), allow_raw_ptrs{})
.function("set_HoverFlagsForTooltipNav", override([](ImGuiStyle* self, ImGuiHoveredFlags value){
    self->HoverFlagsForTooltipNav = value;
}), allow_raw_ptrs{})

.function("ImGuiStyle_ScaleAllSizes", override([](ImGuiStyle* self, float scale_factor) -> void {
    ImGuiStyle_ScaleAllSizes(self, scale_factor);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiIO>("ImGuiIO")
.constructor<>()
.function("get_ConfigFlags", override([](ImGuiIO const* self){
    return self->ConfigFlags;
}), allow_raw_ptrs{})
.function("set_ConfigFlags", override([](ImGuiIO* self, ImGuiConfigFlags value){
    self->ConfigFlags = value;
}), allow_raw_ptrs{})

.function("get_BackendFlags", override([](ImGuiIO const* self){
    return self->BackendFlags;
}), allow_raw_ptrs{})
.function("set_BackendFlags", override([](ImGuiIO* self, ImGuiBackendFlags value){
    self->BackendFlags = value;
}), allow_raw_ptrs{})

.function("get_DisplaySize", override([](ImGuiIO const* self){
    return self->DisplaySize;
}), allow_raw_ptrs{})
.function("set_DisplaySize", override([](ImGuiIO* self, ImVec2 value){
    self->DisplaySize = value;
}), allow_raw_ptrs{})

.function("get_DisplayFramebufferScale", override([](ImGuiIO const* self){
    return self->DisplayFramebufferScale;
}), allow_raw_ptrs{})
.function("set_DisplayFramebufferScale", override([](ImGuiIO* self, ImVec2 value){
    self->DisplayFramebufferScale = value;
}), allow_raw_ptrs{})

.function("get_DeltaTime", override([](ImGuiIO const* self){
    return self->DeltaTime;
}), allow_raw_ptrs{})
.function("set_DeltaTime", override([](ImGuiIO* self, float value){
    self->DeltaTime = value;
}), allow_raw_ptrs{})

.function("get_IniSavingRate", override([](ImGuiIO const* self){
    return self->IniSavingRate;
}), allow_raw_ptrs{})
.function("set_IniSavingRate", override([](ImGuiIO* self, float value){
    self->IniSavingRate = value;
}), allow_raw_ptrs{})

.function("get_IniFilename", override([](ImGuiIO const* self){
    return self->IniFilename;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_IniFilename", override([](ImGuiIO* self, const char* value){
    self->IniFilename = value;
}), allow_raw_ptrs{})

.function("get_LogFilename", override([](ImGuiIO const* self){
    return self->LogFilename;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_LogFilename", override([](ImGuiIO* self, const char* value){
    self->LogFilename = value;
}), allow_raw_ptrs{})

.function("get_UserData", override([](ImGuiIO const* self){
    return self->UserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_UserData", override([](ImGuiIO* self, void* value){
    self->UserData = value;
}), allow_raw_ptrs{})

.function("get_Fonts", override([](ImGuiIO const* self){
    return self->Fonts;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Fonts", override([](ImGuiIO* self, ImFontAtlas* value){
    self->Fonts = value;
}), allow_raw_ptrs{})

.function("get_FontDefault", override([](ImGuiIO const* self){
    return self->FontDefault;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_FontDefault", override([](ImGuiIO* self, ImFont* value){
    self->FontDefault = value;
}), allow_raw_ptrs{})

.function("get_FontAllowUserScaling", override([](ImGuiIO const* self){
    return self->FontAllowUserScaling;
}), allow_raw_ptrs{})
.function("set_FontAllowUserScaling", override([](ImGuiIO* self, bool value){
    self->FontAllowUserScaling = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavSwapGamepadButtons", override([](ImGuiIO const* self){
    return self->ConfigNavSwapGamepadButtons;
}), allow_raw_ptrs{})
.function("set_ConfigNavSwapGamepadButtons", override([](ImGuiIO* self, bool value){
    self->ConfigNavSwapGamepadButtons = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavMoveSetMousePos", override([](ImGuiIO const* self){
    return self->ConfigNavMoveSetMousePos;
}), allow_raw_ptrs{})
.function("set_ConfigNavMoveSetMousePos", override([](ImGuiIO* self, bool value){
    self->ConfigNavMoveSetMousePos = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavCaptureKeyboard", override([](ImGuiIO const* self){
    return self->ConfigNavCaptureKeyboard;
}), allow_raw_ptrs{})
.function("set_ConfigNavCaptureKeyboard", override([](ImGuiIO* self, bool value){
    self->ConfigNavCaptureKeyboard = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavEscapeClearFocusItem", override([](ImGuiIO const* self){
    return self->ConfigNavEscapeClearFocusItem;
}), allow_raw_ptrs{})
.function("set_ConfigNavEscapeClearFocusItem", override([](ImGuiIO* self, bool value){
    self->ConfigNavEscapeClearFocusItem = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavEscapeClearFocusWindow", override([](ImGuiIO const* self){
    return self->ConfigNavEscapeClearFocusWindow;
}), allow_raw_ptrs{})
.function("set_ConfigNavEscapeClearFocusWindow", override([](ImGuiIO* self, bool value){
    self->ConfigNavEscapeClearFocusWindow = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavCursorVisibleAuto", override([](ImGuiIO const* self){
    return self->ConfigNavCursorVisibleAuto;
}), allow_raw_ptrs{})
.function("set_ConfigNavCursorVisibleAuto", override([](ImGuiIO* self, bool value){
    self->ConfigNavCursorVisibleAuto = value;
}), allow_raw_ptrs{})

.function("get_ConfigNavCursorVisibleAlways", override([](ImGuiIO const* self){
    return self->ConfigNavCursorVisibleAlways;
}), allow_raw_ptrs{})
.function("set_ConfigNavCursorVisibleAlways", override([](ImGuiIO* self, bool value){
    self->ConfigNavCursorVisibleAlways = value;
}), allow_raw_ptrs{})

.function("get_ConfigDockingNoSplit", override([](ImGuiIO const* self){
    return self->ConfigDockingNoSplit;
}), allow_raw_ptrs{})
.function("set_ConfigDockingNoSplit", override([](ImGuiIO* self, bool value){
    self->ConfigDockingNoSplit = value;
}), allow_raw_ptrs{})

.function("get_ConfigDockingNoDockingOver", override([](ImGuiIO const* self){
    return self->ConfigDockingNoDockingOver;
}), allow_raw_ptrs{})
.function("set_ConfigDockingNoDockingOver", override([](ImGuiIO* self, bool value){
    self->ConfigDockingNoDockingOver = value;
}), allow_raw_ptrs{})

.function("get_ConfigDockingWithShift", override([](ImGuiIO const* self){
    return self->ConfigDockingWithShift;
}), allow_raw_ptrs{})
.function("set_ConfigDockingWithShift", override([](ImGuiIO* self, bool value){
    self->ConfigDockingWithShift = value;
}), allow_raw_ptrs{})

.function("get_ConfigDockingAlwaysTabBar", override([](ImGuiIO const* self){
    return self->ConfigDockingAlwaysTabBar;
}), allow_raw_ptrs{})
.function("set_ConfigDockingAlwaysTabBar", override([](ImGuiIO* self, bool value){
    self->ConfigDockingAlwaysTabBar = value;
}), allow_raw_ptrs{})

.function("get_ConfigDockingTransparentPayload", override([](ImGuiIO const* self){
    return self->ConfigDockingTransparentPayload;
}), allow_raw_ptrs{})
.function("set_ConfigDockingTransparentPayload", override([](ImGuiIO* self, bool value){
    self->ConfigDockingTransparentPayload = value;
}), allow_raw_ptrs{})

.function("get_ConfigViewportsNoAutoMerge", override([](ImGuiIO const* self){
    return self->ConfigViewportsNoAutoMerge;
}), allow_raw_ptrs{})
.function("set_ConfigViewportsNoAutoMerge", override([](ImGuiIO* self, bool value){
    self->ConfigViewportsNoAutoMerge = value;
}), allow_raw_ptrs{})

.function("get_ConfigViewportsNoTaskBarIcon", override([](ImGuiIO const* self){
    return self->ConfigViewportsNoTaskBarIcon;
}), allow_raw_ptrs{})
.function("set_ConfigViewportsNoTaskBarIcon", override([](ImGuiIO* self, bool value){
    self->ConfigViewportsNoTaskBarIcon = value;
}), allow_raw_ptrs{})

.function("get_ConfigViewportsNoDecoration", override([](ImGuiIO const* self){
    return self->ConfigViewportsNoDecoration;
}), allow_raw_ptrs{})
.function("set_ConfigViewportsNoDecoration", override([](ImGuiIO* self, bool value){
    self->ConfigViewportsNoDecoration = value;
}), allow_raw_ptrs{})

.function("get_ConfigViewportsNoDefaultParent", override([](ImGuiIO const* self){
    return self->ConfigViewportsNoDefaultParent;
}), allow_raw_ptrs{})
.function("set_ConfigViewportsNoDefaultParent", override([](ImGuiIO* self, bool value){
    self->ConfigViewportsNoDefaultParent = value;
}), allow_raw_ptrs{})

.function("get_ConfigViewportsPlatformFocusSetsImGuiFocus", override([](ImGuiIO const* self){
    return self->ConfigViewportsPlatformFocusSetsImGuiFocus;
}), allow_raw_ptrs{})
.function("set_ConfigViewportsPlatformFocusSetsImGuiFocus", override([](ImGuiIO* self, bool value){
    self->ConfigViewportsPlatformFocusSetsImGuiFocus = value;
}), allow_raw_ptrs{})

.function("get_ConfigDpiScaleFonts", override([](ImGuiIO const* self){
    return self->ConfigDpiScaleFonts;
}), allow_raw_ptrs{})
.function("set_ConfigDpiScaleFonts", override([](ImGuiIO* self, bool value){
    self->ConfigDpiScaleFonts = value;
}), allow_raw_ptrs{})

.function("get_ConfigDpiScaleViewports", override([](ImGuiIO const* self){
    return self->ConfigDpiScaleViewports;
}), allow_raw_ptrs{})
.function("set_ConfigDpiScaleViewports", override([](ImGuiIO* self, bool value){
    self->ConfigDpiScaleViewports = value;
}), allow_raw_ptrs{})

.function("get_MouseDrawCursor", override([](ImGuiIO const* self){
    return self->MouseDrawCursor;
}), allow_raw_ptrs{})
.function("set_MouseDrawCursor", override([](ImGuiIO* self, bool value){
    self->MouseDrawCursor = value;
}), allow_raw_ptrs{})

.function("get_ConfigMacOSXBehaviors", override([](ImGuiIO const* self){
    return self->ConfigMacOSXBehaviors;
}), allow_raw_ptrs{})
.function("set_ConfigMacOSXBehaviors", override([](ImGuiIO* self, bool value){
    self->ConfigMacOSXBehaviors = value;
}), allow_raw_ptrs{})

.function("get_ConfigInputTrickleEventQueue", override([](ImGuiIO const* self){
    return self->ConfigInputTrickleEventQueue;
}), allow_raw_ptrs{})
.function("set_ConfigInputTrickleEventQueue", override([](ImGuiIO* self, bool value){
    self->ConfigInputTrickleEventQueue = value;
}), allow_raw_ptrs{})

.function("get_ConfigInputTextCursorBlink", override([](ImGuiIO const* self){
    return self->ConfigInputTextCursorBlink;
}), allow_raw_ptrs{})
.function("set_ConfigInputTextCursorBlink", override([](ImGuiIO* self, bool value){
    self->ConfigInputTextCursorBlink = value;
}), allow_raw_ptrs{})

.function("get_ConfigInputTextEnterKeepActive", override([](ImGuiIO const* self){
    return self->ConfigInputTextEnterKeepActive;
}), allow_raw_ptrs{})
.function("set_ConfigInputTextEnterKeepActive", override([](ImGuiIO* self, bool value){
    self->ConfigInputTextEnterKeepActive = value;
}), allow_raw_ptrs{})

.function("get_ConfigDragClickToInputText", override([](ImGuiIO const* self){
    return self->ConfigDragClickToInputText;
}), allow_raw_ptrs{})
.function("set_ConfigDragClickToInputText", override([](ImGuiIO* self, bool value){
    self->ConfigDragClickToInputText = value;
}), allow_raw_ptrs{})

.function("get_ConfigWindowsResizeFromEdges", override([](ImGuiIO const* self){
    return self->ConfigWindowsResizeFromEdges;
}), allow_raw_ptrs{})
.function("set_ConfigWindowsResizeFromEdges", override([](ImGuiIO* self, bool value){
    self->ConfigWindowsResizeFromEdges = value;
}), allow_raw_ptrs{})

.function("get_ConfigWindowsMoveFromTitleBarOnly", override([](ImGuiIO const* self){
    return self->ConfigWindowsMoveFromTitleBarOnly;
}), allow_raw_ptrs{})
.function("set_ConfigWindowsMoveFromTitleBarOnly", override([](ImGuiIO* self, bool value){
    self->ConfigWindowsMoveFromTitleBarOnly = value;
}), allow_raw_ptrs{})

.function("get_ConfigWindowsCopyContentsWithCtrlC", override([](ImGuiIO const* self){
    return self->ConfigWindowsCopyContentsWithCtrlC;
}), allow_raw_ptrs{})
.function("set_ConfigWindowsCopyContentsWithCtrlC", override([](ImGuiIO* self, bool value){
    self->ConfigWindowsCopyContentsWithCtrlC = value;
}), allow_raw_ptrs{})

.function("get_ConfigScrollbarScrollByPage", override([](ImGuiIO const* self){
    return self->ConfigScrollbarScrollByPage;
}), allow_raw_ptrs{})
.function("set_ConfigScrollbarScrollByPage", override([](ImGuiIO* self, bool value){
    self->ConfigScrollbarScrollByPage = value;
}), allow_raw_ptrs{})

.function("get_ConfigMemoryCompactTimer", override([](ImGuiIO const* self){
    return self->ConfigMemoryCompactTimer;
}), allow_raw_ptrs{})
.function("set_ConfigMemoryCompactTimer", override([](ImGuiIO* self, float value){
    self->ConfigMemoryCompactTimer = value;
}), allow_raw_ptrs{})

.function("get_MouseDoubleClickTime", override([](ImGuiIO const* self){
    return self->MouseDoubleClickTime;
}), allow_raw_ptrs{})
.function("set_MouseDoubleClickTime", override([](ImGuiIO* self, float value){
    self->MouseDoubleClickTime = value;
}), allow_raw_ptrs{})

.function("get_MouseDoubleClickMaxDist", override([](ImGuiIO const* self){
    return self->MouseDoubleClickMaxDist;
}), allow_raw_ptrs{})
.function("set_MouseDoubleClickMaxDist", override([](ImGuiIO* self, float value){
    self->MouseDoubleClickMaxDist = value;
}), allow_raw_ptrs{})

.function("get_MouseDragThreshold", override([](ImGuiIO const* self){
    return self->MouseDragThreshold;
}), allow_raw_ptrs{})
.function("set_MouseDragThreshold", override([](ImGuiIO* self, float value){
    self->MouseDragThreshold = value;
}), allow_raw_ptrs{})

.function("get_KeyRepeatDelay", override([](ImGuiIO const* self){
    return self->KeyRepeatDelay;
}), allow_raw_ptrs{})
.function("set_KeyRepeatDelay", override([](ImGuiIO* self, float value){
    self->KeyRepeatDelay = value;
}), allow_raw_ptrs{})

.function("get_KeyRepeatRate", override([](ImGuiIO const* self){
    return self->KeyRepeatRate;
}), allow_raw_ptrs{})
.function("set_KeyRepeatRate", override([](ImGuiIO* self, float value){
    self->KeyRepeatRate = value;
}), allow_raw_ptrs{})

.function("get_ConfigErrorRecovery", override([](ImGuiIO const* self){
    return self->ConfigErrorRecovery;
}), allow_raw_ptrs{})
.function("set_ConfigErrorRecovery", override([](ImGuiIO* self, bool value){
    self->ConfigErrorRecovery = value;
}), allow_raw_ptrs{})

.function("get_ConfigErrorRecoveryEnableAssert", override([](ImGuiIO const* self){
    return self->ConfigErrorRecoveryEnableAssert;
}), allow_raw_ptrs{})
.function("set_ConfigErrorRecoveryEnableAssert", override([](ImGuiIO* self, bool value){
    self->ConfigErrorRecoveryEnableAssert = value;
}), allow_raw_ptrs{})

.function("get_ConfigErrorRecoveryEnableDebugLog", override([](ImGuiIO const* self){
    return self->ConfigErrorRecoveryEnableDebugLog;
}), allow_raw_ptrs{})
.function("set_ConfigErrorRecoveryEnableDebugLog", override([](ImGuiIO* self, bool value){
    self->ConfigErrorRecoveryEnableDebugLog = value;
}), allow_raw_ptrs{})

.function("get_ConfigErrorRecoveryEnableTooltip", override([](ImGuiIO const* self){
    return self->ConfigErrorRecoveryEnableTooltip;
}), allow_raw_ptrs{})
.function("set_ConfigErrorRecoveryEnableTooltip", override([](ImGuiIO* self, bool value){
    self->ConfigErrorRecoveryEnableTooltip = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugIsDebuggerPresent", override([](ImGuiIO const* self){
    return self->ConfigDebugIsDebuggerPresent;
}), allow_raw_ptrs{})
.function("set_ConfigDebugIsDebuggerPresent", override([](ImGuiIO* self, bool value){
    self->ConfigDebugIsDebuggerPresent = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugHighlightIdConflicts", override([](ImGuiIO const* self){
    return self->ConfigDebugHighlightIdConflicts;
}), allow_raw_ptrs{})
.function("set_ConfigDebugHighlightIdConflicts", override([](ImGuiIO* self, bool value){
    self->ConfigDebugHighlightIdConflicts = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugHighlightIdConflictsShowItemPicker", override([](ImGuiIO const* self){
    return self->ConfigDebugHighlightIdConflictsShowItemPicker;
}), allow_raw_ptrs{})
.function("set_ConfigDebugHighlightIdConflictsShowItemPicker", override([](ImGuiIO* self, bool value){
    self->ConfigDebugHighlightIdConflictsShowItemPicker = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugBeginReturnValueOnce", override([](ImGuiIO const* self){
    return self->ConfigDebugBeginReturnValueOnce;
}), allow_raw_ptrs{})
.function("set_ConfigDebugBeginReturnValueOnce", override([](ImGuiIO* self, bool value){
    self->ConfigDebugBeginReturnValueOnce = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugBeginReturnValueLoop", override([](ImGuiIO const* self){
    return self->ConfigDebugBeginReturnValueLoop;
}), allow_raw_ptrs{})
.function("set_ConfigDebugBeginReturnValueLoop", override([](ImGuiIO* self, bool value){
    self->ConfigDebugBeginReturnValueLoop = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugIgnoreFocusLoss", override([](ImGuiIO const* self){
    return self->ConfigDebugIgnoreFocusLoss;
}), allow_raw_ptrs{})
.function("set_ConfigDebugIgnoreFocusLoss", override([](ImGuiIO* self, bool value){
    self->ConfigDebugIgnoreFocusLoss = value;
}), allow_raw_ptrs{})

.function("get_ConfigDebugIniSettings", override([](ImGuiIO const* self){
    return self->ConfigDebugIniSettings;
}), allow_raw_ptrs{})
.function("set_ConfigDebugIniSettings", override([](ImGuiIO* self, bool value){
    self->ConfigDebugIniSettings = value;
}), allow_raw_ptrs{})

.function("get_BackendPlatformName", override([](ImGuiIO const* self){
    return self->BackendPlatformName;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_BackendPlatformName", override([](ImGuiIO* self, const char* value){
    self->BackendPlatformName = value;
}), allow_raw_ptrs{})

.function("get_BackendRendererName", override([](ImGuiIO const* self){
    return self->BackendRendererName;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_BackendRendererName", override([](ImGuiIO* self, const char* value){
    self->BackendRendererName = value;
}), allow_raw_ptrs{})

.function("get_BackendPlatformUserData", override([](ImGuiIO const* self){
    return self->BackendPlatformUserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_BackendPlatformUserData", override([](ImGuiIO* self, void* value){
    self->BackendPlatformUserData = value;
}), allow_raw_ptrs{})

.function("get_BackendRendererUserData", override([](ImGuiIO const* self){
    return self->BackendRendererUserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_BackendRendererUserData", override([](ImGuiIO* self, void* value){
    self->BackendRendererUserData = value;
}), allow_raw_ptrs{})

.function("get_BackendLanguageUserData", override([](ImGuiIO const* self){
    return self->BackendLanguageUserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_BackendLanguageUserData", override([](ImGuiIO* self, void* value){
    self->BackendLanguageUserData = value;
}), allow_raw_ptrs{})

.function("get_WantCaptureMouse", override([](ImGuiIO const* self){
    return self->WantCaptureMouse;
}), allow_raw_ptrs{})
.function("set_WantCaptureMouse", override([](ImGuiIO* self, bool value){
    self->WantCaptureMouse = value;
}), allow_raw_ptrs{})

.function("get_WantCaptureKeyboard", override([](ImGuiIO const* self){
    return self->WantCaptureKeyboard;
}), allow_raw_ptrs{})
.function("set_WantCaptureKeyboard", override([](ImGuiIO* self, bool value){
    self->WantCaptureKeyboard = value;
}), allow_raw_ptrs{})

.function("get_WantTextInput", override([](ImGuiIO const* self){
    return self->WantTextInput;
}), allow_raw_ptrs{})
.function("set_WantTextInput", override([](ImGuiIO* self, bool value){
    self->WantTextInput = value;
}), allow_raw_ptrs{})

.function("get_WantSetMousePos", override([](ImGuiIO const* self){
    return self->WantSetMousePos;
}), allow_raw_ptrs{})
.function("set_WantSetMousePos", override([](ImGuiIO* self, bool value){
    self->WantSetMousePos = value;
}), allow_raw_ptrs{})

.function("get_WantSaveIniSettings", override([](ImGuiIO const* self){
    return self->WantSaveIniSettings;
}), allow_raw_ptrs{})
.function("set_WantSaveIniSettings", override([](ImGuiIO* self, bool value){
    self->WantSaveIniSettings = value;
}), allow_raw_ptrs{})

.function("get_NavActive", override([](ImGuiIO const* self){
    return self->NavActive;
}), allow_raw_ptrs{})
.function("set_NavActive", override([](ImGuiIO* self, bool value){
    self->NavActive = value;
}), allow_raw_ptrs{})

.function("get_NavVisible", override([](ImGuiIO const* self){
    return self->NavVisible;
}), allow_raw_ptrs{})
.function("set_NavVisible", override([](ImGuiIO* self, bool value){
    self->NavVisible = value;
}), allow_raw_ptrs{})

.function("get_Framerate", override([](ImGuiIO const* self){
    return self->Framerate;
}), allow_raw_ptrs{})
.function("set_Framerate", override([](ImGuiIO* self, float value){
    self->Framerate = value;
}), allow_raw_ptrs{})

.function("get_MetricsRenderVertices", override([](ImGuiIO const* self){
    return self->MetricsRenderVertices;
}), allow_raw_ptrs{})
.function("set_MetricsRenderVertices", override([](ImGuiIO* self, int value){
    self->MetricsRenderVertices = value;
}), allow_raw_ptrs{})

.function("get_MetricsRenderIndices", override([](ImGuiIO const* self){
    return self->MetricsRenderIndices;
}), allow_raw_ptrs{})
.function("set_MetricsRenderIndices", override([](ImGuiIO* self, int value){
    self->MetricsRenderIndices = value;
}), allow_raw_ptrs{})

.function("get_MetricsRenderWindows", override([](ImGuiIO const* self){
    return self->MetricsRenderWindows;
}), allow_raw_ptrs{})
.function("set_MetricsRenderWindows", override([](ImGuiIO* self, int value){
    self->MetricsRenderWindows = value;
}), allow_raw_ptrs{})

.function("get_MetricsActiveWindows", override([](ImGuiIO const* self){
    return self->MetricsActiveWindows;
}), allow_raw_ptrs{})
.function("set_MetricsActiveWindows", override([](ImGuiIO* self, int value){
    self->MetricsActiveWindows = value;
}), allow_raw_ptrs{})

.function("get_MouseDelta", override([](ImGuiIO const* self){
    return self->MouseDelta;
}), allow_raw_ptrs{})
.function("set_MouseDelta", override([](ImGuiIO* self, ImVec2 value){
    self->MouseDelta = value;
}), allow_raw_ptrs{})

.function("get_Ctx", override([](ImGuiIO const* self){
    return self->Ctx;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Ctx", override([](ImGuiIO* self, ImGuiContext* value){
    self->Ctx = value;
}), allow_raw_ptrs{})

.function("get_MousePos", override([](ImGuiIO const* self){
    return self->MousePos;
}), allow_raw_ptrs{})
.function("set_MousePos", override([](ImGuiIO* self, ImVec2 value){
    self->MousePos = value;
}), allow_raw_ptrs{})

.function("get_MouseWheel", override([](ImGuiIO const* self){
    return self->MouseWheel;
}), allow_raw_ptrs{})
.function("set_MouseWheel", override([](ImGuiIO* self, float value){
    self->MouseWheel = value;
}), allow_raw_ptrs{})

.function("get_MouseWheelH", override([](ImGuiIO const* self){
    return self->MouseWheelH;
}), allow_raw_ptrs{})
.function("set_MouseWheelH", override([](ImGuiIO* self, float value){
    self->MouseWheelH = value;
}), allow_raw_ptrs{})

.function("get_MouseSource", override([](ImGuiIO const* self){
    return self->MouseSource;
}), allow_raw_ptrs{})
.function("set_MouseSource", override([](ImGuiIO* self, ImGuiMouseSource value){
    self->MouseSource = value;
}), allow_raw_ptrs{})

.function("get_MouseHoveredViewport", override([](ImGuiIO const* self){
    return self->MouseHoveredViewport;
}), allow_raw_ptrs{})
.function("set_MouseHoveredViewport", override([](ImGuiIO* self, ImGuiID value){
    self->MouseHoveredViewport = value;
}), allow_raw_ptrs{})

.function("get_KeyCtrl", override([](ImGuiIO const* self){
    return self->KeyCtrl;
}), allow_raw_ptrs{})
.function("set_KeyCtrl", override([](ImGuiIO* self, bool value){
    self->KeyCtrl = value;
}), allow_raw_ptrs{})

.function("get_KeyShift", override([](ImGuiIO const* self){
    return self->KeyShift;
}), allow_raw_ptrs{})
.function("set_KeyShift", override([](ImGuiIO* self, bool value){
    self->KeyShift = value;
}), allow_raw_ptrs{})

.function("get_KeyAlt", override([](ImGuiIO const* self){
    return self->KeyAlt;
}), allow_raw_ptrs{})
.function("set_KeyAlt", override([](ImGuiIO* self, bool value){
    self->KeyAlt = value;
}), allow_raw_ptrs{})

.function("get_KeySuper", override([](ImGuiIO const* self){
    return self->KeySuper;
}), allow_raw_ptrs{})
.function("set_KeySuper", override([](ImGuiIO* self, bool value){
    self->KeySuper = value;
}), allow_raw_ptrs{})

.function("get_KeyMods", override([](ImGuiIO const* self){
    return self->KeyMods;
}), allow_raw_ptrs{})
.function("set_KeyMods", override([](ImGuiIO* self, ImGuiKeyChord value){
    self->KeyMods = value;
}), allow_raw_ptrs{})

.function("get_WantCaptureMouseUnlessPopupClose", override([](ImGuiIO const* self){
    return self->WantCaptureMouseUnlessPopupClose;
}), allow_raw_ptrs{})
.function("set_WantCaptureMouseUnlessPopupClose", override([](ImGuiIO* self, bool value){
    self->WantCaptureMouseUnlessPopupClose = value;
}), allow_raw_ptrs{})

.function("get_MousePosPrev", override([](ImGuiIO const* self){
    return self->MousePosPrev;
}), allow_raw_ptrs{})
.function("set_MousePosPrev", override([](ImGuiIO* self, ImVec2 value){
    self->MousePosPrev = value;
}), allow_raw_ptrs{})

.function("get_MouseWheelRequestAxisSwap", override([](ImGuiIO const* self){
    return self->MouseWheelRequestAxisSwap;
}), allow_raw_ptrs{})
.function("set_MouseWheelRequestAxisSwap", override([](ImGuiIO* self, bool value){
    self->MouseWheelRequestAxisSwap = value;
}), allow_raw_ptrs{})

.function("get_MouseCtrlLeftAsRightClick", override([](ImGuiIO const* self){
    return self->MouseCtrlLeftAsRightClick;
}), allow_raw_ptrs{})
.function("set_MouseCtrlLeftAsRightClick", override([](ImGuiIO* self, bool value){
    self->MouseCtrlLeftAsRightClick = value;
}), allow_raw_ptrs{})

.function("get_PenPressure", override([](ImGuiIO const* self){
    return self->PenPressure;
}), allow_raw_ptrs{})
.function("set_PenPressure", override([](ImGuiIO* self, float value){
    self->PenPressure = value;
}), allow_raw_ptrs{})

.function("get_AppFocusLost", override([](ImGuiIO const* self){
    return self->AppFocusLost;
}), allow_raw_ptrs{})
.function("set_AppFocusLost", override([](ImGuiIO* self, bool value){
    self->AppFocusLost = value;
}), allow_raw_ptrs{})

.function("get_AppAcceptingEvents", override([](ImGuiIO const* self){
    return self->AppAcceptingEvents;
}), allow_raw_ptrs{})
.function("set_AppAcceptingEvents", override([](ImGuiIO* self, bool value){
    self->AppAcceptingEvents = value;
}), allow_raw_ptrs{})

.function("get_InputQueueSurrogate", override([](ImGuiIO const* self){
    return self->InputQueueSurrogate;
}), allow_raw_ptrs{})
.function("set_InputQueueSurrogate", override([](ImGuiIO* self, ImWchar16 value){
    self->InputQueueSurrogate = value;
}), allow_raw_ptrs{})

.function("ImGuiIO_AddKeyEvent", override([](ImGuiIO* self, ImGuiKey key, bool down) -> void {
    ImGuiIO_AddKeyEvent(self, key, down);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddKeyAnalogEvent", override([](ImGuiIO* self, ImGuiKey key, bool down, float v) -> void {
    ImGuiIO_AddKeyAnalogEvent(self, key, down, v);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddMousePosEvent", override([](ImGuiIO* self, float x, float y) -> void {
    ImGuiIO_AddMousePosEvent(self, x, y);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddMouseButtonEvent", override([](ImGuiIO* self, int button, bool down) -> void {
    ImGuiIO_AddMouseButtonEvent(self, button, down);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddMouseWheelEvent", override([](ImGuiIO* self, float wheel_x, float wheel_y) -> void {
    ImGuiIO_AddMouseWheelEvent(self, wheel_x, wheel_y);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddMouseSourceEvent", override([](ImGuiIO* self, ImGuiMouseSource source) -> void {
    ImGuiIO_AddMouseSourceEvent(self, source);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddMouseViewportEvent", override([](ImGuiIO* self, ImGuiID id) -> void {
    ImGuiIO_AddMouseViewportEvent(self, id);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddFocusEvent", override([](ImGuiIO* self, bool focused) -> void {
    ImGuiIO_AddFocusEvent(self, focused);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddInputCharacter", override([](ImGuiIO* self, unsigned int c) -> void {
    ImGuiIO_AddInputCharacter(self, c);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddInputCharacterUTF16", override([](ImGuiIO* self, ImWchar16 c) -> void {
    ImGuiIO_AddInputCharacterUTF16(self, c);
}), allow_raw_ptrs{})

.function("ImGuiIO_AddInputCharactersUTF8", override([](ImGuiIO* self, std::string str) -> void {
    ImGuiIO_AddInputCharactersUTF8(self, str.c_str());
}), allow_raw_ptrs{})

.function("ImGuiIO_SetKeyEventNativeData", override([](ImGuiIO* self, ImGuiKey key, int native_keycode, int native_scancode, int native_legacy_index) -> void {
    ImGuiIO_SetKeyEventNativeData(self, key, native_keycode, native_scancode, native_legacy_index);
}), allow_raw_ptrs{})

.function("ImGuiIO_SetAppAcceptingEvents", override([](ImGuiIO* self, bool accepting_events) -> void {
    ImGuiIO_SetAppAcceptingEvents(self, accepting_events);
}), allow_raw_ptrs{})

.function("ImGuiIO_ClearEventsQueue", override([](ImGuiIO* self) -> void {
    ImGuiIO_ClearEventsQueue(self);
}), allow_raw_ptrs{})

.function("ImGuiIO_ClearInputKeys", override([](ImGuiIO* self) -> void {
    ImGuiIO_ClearInputKeys(self);
}), allow_raw_ptrs{})

.function("ImGuiIO_ClearInputMouse", override([](ImGuiIO* self) -> void {
    ImGuiIO_ClearInputMouse(self);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiInputTextCallbackData>("ImGuiInputTextCallbackData")
.constructor<>()
.function("get_Ctx", override([](ImGuiInputTextCallbackData const* self){
    return self->Ctx;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Ctx", override([](ImGuiInputTextCallbackData* self, ImGuiContext* value){
    self->Ctx = value;
}), allow_raw_ptrs{})

.function("get_EventFlag", override([](ImGuiInputTextCallbackData const* self){
    return self->EventFlag;
}), allow_raw_ptrs{})
.function("set_EventFlag", override([](ImGuiInputTextCallbackData* self, ImGuiInputTextFlags value){
    self->EventFlag = value;
}), allow_raw_ptrs{})

.function("get_Flags", override([](ImGuiInputTextCallbackData const* self){
    return self->Flags;
}), allow_raw_ptrs{})
.function("set_Flags", override([](ImGuiInputTextCallbackData* self, ImGuiInputTextFlags value){
    self->Flags = value;
}), allow_raw_ptrs{})

.function("get_UserData", override([](ImGuiInputTextCallbackData const* self){
    return self->UserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_UserData", override([](ImGuiInputTextCallbackData* self, void* value){
    self->UserData = value;
}), allow_raw_ptrs{})

.function("get_ID", override([](ImGuiInputTextCallbackData const* self){
    return self->ID;
}), allow_raw_ptrs{})
.function("set_ID", override([](ImGuiInputTextCallbackData* self, ImGuiID value){
    self->ID = value;
}), allow_raw_ptrs{})

.function("get_EventKey", override([](ImGuiInputTextCallbackData const* self){
    return self->EventKey;
}), allow_raw_ptrs{})
.function("set_EventKey", override([](ImGuiInputTextCallbackData* self, ImGuiKey value){
    self->EventKey = value;
}), allow_raw_ptrs{})

.function("get_EventChar", override([](ImGuiInputTextCallbackData const* self){
    return self->EventChar;
}), allow_raw_ptrs{})
.function("set_EventChar", override([](ImGuiInputTextCallbackData* self, ImWchar value){
    self->EventChar = value;
}), allow_raw_ptrs{})

.function("get_EventActivated", override([](ImGuiInputTextCallbackData const* self){
    return self->EventActivated;
}), allow_raw_ptrs{})
.function("set_EventActivated", override([](ImGuiInputTextCallbackData* self, bool value){
    self->EventActivated = value;
}), allow_raw_ptrs{})

.function("get_BufDirty", override([](ImGuiInputTextCallbackData const* self){
    return self->BufDirty;
}), allow_raw_ptrs{})
.function("set_BufDirty", override([](ImGuiInputTextCallbackData* self, bool value){
    self->BufDirty = value;
}), allow_raw_ptrs{})

.function("get_Buf", override([](ImGuiInputTextCallbackData const* self){
    return self->Buf;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Buf", override([](ImGuiInputTextCallbackData* self, char* value){
    self->Buf = value;
}), allow_raw_ptrs{})

.function("get_BufTextLen", override([](ImGuiInputTextCallbackData const* self){
    return self->BufTextLen;
}), allow_raw_ptrs{})
.function("set_BufTextLen", override([](ImGuiInputTextCallbackData* self, int value){
    self->BufTextLen = value;
}), allow_raw_ptrs{})

.function("get_BufSize", override([](ImGuiInputTextCallbackData const* self){
    return self->BufSize;
}), allow_raw_ptrs{})
.function("set_BufSize", override([](ImGuiInputTextCallbackData* self, int value){
    self->BufSize = value;
}), allow_raw_ptrs{})

.function("get_CursorPos", override([](ImGuiInputTextCallbackData const* self){
    return self->CursorPos;
}), allow_raw_ptrs{})
.function("set_CursorPos", override([](ImGuiInputTextCallbackData* self, int value){
    self->CursorPos = value;
}), allow_raw_ptrs{})

.function("get_SelectionStart", override([](ImGuiInputTextCallbackData const* self){
    return self->SelectionStart;
}), allow_raw_ptrs{})
.function("set_SelectionStart", override([](ImGuiInputTextCallbackData* self, int value){
    self->SelectionStart = value;
}), allow_raw_ptrs{})

.function("get_SelectionEnd", override([](ImGuiInputTextCallbackData const* self){
    return self->SelectionEnd;
}), allow_raw_ptrs{})
.function("set_SelectionEnd", override([](ImGuiInputTextCallbackData* self, int value){
    self->SelectionEnd = value;
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_DeleteChars", override([](ImGuiInputTextCallbackData* self, int pos, int bytes_count) -> void {
    ImGuiInputTextCallbackData_DeleteChars(self, pos, bytes_count);
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_InsertChars", override([](ImGuiInputTextCallbackData* self, int pos, std::string text, std::string text_end) -> void {
    ImGuiInputTextCallbackData_InsertChars(self, pos, text.c_str(), text_end.c_str());
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_SelectAll", override([](ImGuiInputTextCallbackData* self) -> void {
    ImGuiInputTextCallbackData_SelectAll(self);
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_SetSelection", override([](ImGuiInputTextCallbackData* self, int s, int e) -> void {
    ImGuiInputTextCallbackData_SetSelection(self, s, e);
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_ClearSelection", override([](ImGuiInputTextCallbackData* self) -> void {
    ImGuiInputTextCallbackData_ClearSelection(self);
}), allow_raw_ptrs{})

.function("ImGuiInputTextCallbackData_HasSelection", override([](const ImGuiInputTextCallbackData* self) -> bool {
    return ImGuiInputTextCallbackData_HasSelection(self);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiSizeCallbackData>("ImGuiSizeCallbackData")
.constructor<>()
.function("get_UserData", override([](ImGuiSizeCallbackData const* self){
    return self->UserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_UserData", override([](ImGuiSizeCallbackData* self, void* value){
    self->UserData = value;
}), allow_raw_ptrs{})

.function("get_Pos", override([](ImGuiSizeCallbackData const* self){
    return self->Pos;
}), allow_raw_ptrs{})
.function("set_Pos", override([](ImGuiSizeCallbackData* self, ImVec2 value){
    self->Pos = value;
}), allow_raw_ptrs{})

.function("get_CurrentSize", override([](ImGuiSizeCallbackData const* self){
    return self->CurrentSize;
}), allow_raw_ptrs{})
.function("set_CurrentSize", override([](ImGuiSizeCallbackData* self, ImVec2 value){
    self->CurrentSize = value;
}), allow_raw_ptrs{})

.function("get_DesiredSize", override([](ImGuiSizeCallbackData const* self){
    return self->DesiredSize;
}), allow_raw_ptrs{})
.function("set_DesiredSize", override([](ImGuiSizeCallbackData* self, ImVec2 value){
    self->DesiredSize = value;
}), allow_raw_ptrs{})

;
bind_struct<ImGuiWindowClass>("ImGuiWindowClass")
.constructor<>()
.function("get_ClassId", override([](ImGuiWindowClass const* self){
    return self->ClassId;
}), allow_raw_ptrs{})
.function("set_ClassId", override([](ImGuiWindowClass* self, ImGuiID value){
    self->ClassId = value;
}), allow_raw_ptrs{})

.function("get_ParentViewportId", override([](ImGuiWindowClass const* self){
    return self->ParentViewportId;
}), allow_raw_ptrs{})
.function("set_ParentViewportId", override([](ImGuiWindowClass* self, ImGuiID value){
    self->ParentViewportId = value;
}), allow_raw_ptrs{})

.function("get_FocusRouteParentWindowId", override([](ImGuiWindowClass const* self){
    return self->FocusRouteParentWindowId;
}), allow_raw_ptrs{})
.function("set_FocusRouteParentWindowId", override([](ImGuiWindowClass* self, ImGuiID value){
    self->FocusRouteParentWindowId = value;
}), allow_raw_ptrs{})

.function("get_ViewportFlagsOverrideSet", override([](ImGuiWindowClass const* self){
    return self->ViewportFlagsOverrideSet;
}), allow_raw_ptrs{})
.function("set_ViewportFlagsOverrideSet", override([](ImGuiWindowClass* self, ImGuiViewportFlags value){
    self->ViewportFlagsOverrideSet = value;
}), allow_raw_ptrs{})

.function("get_ViewportFlagsOverrideClear", override([](ImGuiWindowClass const* self){
    return self->ViewportFlagsOverrideClear;
}), allow_raw_ptrs{})
.function("set_ViewportFlagsOverrideClear", override([](ImGuiWindowClass* self, ImGuiViewportFlags value){
    self->ViewportFlagsOverrideClear = value;
}), allow_raw_ptrs{})

.function("get_TabItemFlagsOverrideSet", override([](ImGuiWindowClass const* self){
    return self->TabItemFlagsOverrideSet;
}), allow_raw_ptrs{})
.function("set_TabItemFlagsOverrideSet", override([](ImGuiWindowClass* self, ImGuiTabItemFlags value){
    self->TabItemFlagsOverrideSet = value;
}), allow_raw_ptrs{})

.function("get_DockNodeFlagsOverrideSet", override([](ImGuiWindowClass const* self){
    return self->DockNodeFlagsOverrideSet;
}), allow_raw_ptrs{})
.function("set_DockNodeFlagsOverrideSet", override([](ImGuiWindowClass* self, ImGuiDockNodeFlags value){
    self->DockNodeFlagsOverrideSet = value;
}), allow_raw_ptrs{})

.function("get_DockingAlwaysTabBar", override([](ImGuiWindowClass const* self){
    return self->DockingAlwaysTabBar;
}), allow_raw_ptrs{})
.function("set_DockingAlwaysTabBar", override([](ImGuiWindowClass* self, bool value){
    self->DockingAlwaysTabBar = value;
}), allow_raw_ptrs{})

.function("get_DockingAllowUnclassed", override([](ImGuiWindowClass const* self){
    return self->DockingAllowUnclassed;
}), allow_raw_ptrs{})
.function("set_DockingAllowUnclassed", override([](ImGuiWindowClass* self, bool value){
    self->DockingAllowUnclassed = value;
}), allow_raw_ptrs{})

;
bind_struct<ImGuiPayload>("ImGuiPayload")
.constructor<>()
.function("get_Data", override([](const ImGuiPayload* self){ return std::string((char*)self->Data, self->DataSize); }), rvp_ref{}, allow_raw_ptrs{})
.function("get_DataSize", override([](const ImGuiPayload* self){ return self->DataSize; }), rvp_ref{}, allow_raw_ptrs{})
.function("ImGuiPayload_Clear", override([](ImGuiPayload* self) -> void {
    ImGuiPayload_Clear(self);
}), allow_raw_ptrs{})

.function("ImGuiPayload_IsDataType", override([](const ImGuiPayload* self, std::string type) -> bool {
    return ImGuiPayload_IsDataType(self, type.c_str());
}), allow_raw_ptrs{})

.function("ImGuiPayload_IsPreview", override([](const ImGuiPayload* self) -> bool {
    return ImGuiPayload_IsPreview(self);
}), allow_raw_ptrs{})

.function("ImGuiPayload_IsDelivery", override([](const ImGuiPayload* self) -> bool {
    return ImGuiPayload_IsDelivery(self);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiListClipper>("ImGuiListClipper")
.constructor<>()
.function("get_DisplayStart", override([](ImGuiListClipper const* self){
    return self->DisplayStart;
}), allow_raw_ptrs{})
.function("set_DisplayStart", override([](ImGuiListClipper* self, int value){
    self->DisplayStart = value;
}), allow_raw_ptrs{})

.function("get_DisplayEnd", override([](ImGuiListClipper const* self){
    return self->DisplayEnd;
}), allow_raw_ptrs{})
.function("set_DisplayEnd", override([](ImGuiListClipper* self, int value){
    self->DisplayEnd = value;
}), allow_raw_ptrs{})

.function("get_UserIndex", override([](ImGuiListClipper const* self){
    return self->UserIndex;
}), allow_raw_ptrs{})
.function("set_UserIndex", override([](ImGuiListClipper* self, int value){
    self->UserIndex = value;
}), allow_raw_ptrs{})

.function("get_ItemsCount", override([](ImGuiListClipper const* self){
    return self->ItemsCount;
}), allow_raw_ptrs{})
.function("set_ItemsCount", override([](ImGuiListClipper* self, int value){
    self->ItemsCount = value;
}), allow_raw_ptrs{})

.function("get_ItemsHeight", override([](ImGuiListClipper const* self){
    return self->ItemsHeight;
}), allow_raw_ptrs{})
.function("set_ItemsHeight", override([](ImGuiListClipper* self, float value){
    self->ItemsHeight = value;
}), allow_raw_ptrs{})

.function("get_Flags", override([](ImGuiListClipper const* self){
    return self->Flags;
}), allow_raw_ptrs{})
.function("set_Flags", override([](ImGuiListClipper* self, ImGuiListClipperFlags value){
    self->Flags = value;
}), allow_raw_ptrs{})

.function("get_StartPosY", override([](ImGuiListClipper const* self){
    return self->StartPosY;
}), allow_raw_ptrs{})
.function("set_StartPosY", override([](ImGuiListClipper* self, double value){
    self->StartPosY = value;
}), allow_raw_ptrs{})

.function("get_StartSeekOffsetY", override([](ImGuiListClipper const* self){
    return self->StartSeekOffsetY;
}), allow_raw_ptrs{})
.function("set_StartSeekOffsetY", override([](ImGuiListClipper* self, double value){
    self->StartSeekOffsetY = value;
}), allow_raw_ptrs{})

.function("get_Ctx", override([](ImGuiListClipper const* self){
    return self->Ctx;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Ctx", override([](ImGuiListClipper* self, ImGuiContext* value){
    self->Ctx = value;
}), allow_raw_ptrs{})

.function("get_TempData", override([](ImGuiListClipper const* self){
    return self->TempData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_TempData", override([](ImGuiListClipper* self, void* value){
    self->TempData = value;
}), allow_raw_ptrs{})

.function("ImGuiListClipper_Begin", override([](ImGuiListClipper* self, int items_count, float items_height) -> void {
    ImGuiListClipper_Begin(self, items_count, items_height);
}), allow_raw_ptrs{})

.function("ImGuiListClipper_End", override([](ImGuiListClipper* self) -> void {
    ImGuiListClipper_End(self);
}), allow_raw_ptrs{})

.function("ImGuiListClipper_Step", override([](ImGuiListClipper* self) -> bool {
    return ImGuiListClipper_Step(self);
}), allow_raw_ptrs{})

.function("ImGuiListClipper_IncludeItemByIndex", override([](ImGuiListClipper* self, int item_index) -> void {
    ImGuiListClipper_IncludeItemByIndex(self, item_index);
}), allow_raw_ptrs{})

.function("ImGuiListClipper_IncludeItemsByIndex", override([](ImGuiListClipper* self, int item_begin, int item_end) -> void {
    ImGuiListClipper_IncludeItemsByIndex(self, item_begin, item_end);
}), allow_raw_ptrs{})

.function("ImGuiListClipper_SeekCursorForItem", override([](ImGuiListClipper* self, int item_index) -> void {
    ImGuiListClipper_SeekCursorForItem(self, item_index);
}), allow_raw_ptrs{})

;
bind_struct<ImColor>("ImColor")
.constructor<>()
.function("get_Value", override([](ImColor const* self){
    return self->Value;
}), allow_raw_ptrs{})
.function("set_Value", override([](ImColor* self, ImVec4 value){
    self->Value = value;
}), allow_raw_ptrs{})

.function("ImColor_SetHSV", override([](ImColor* self, float h, float s, float v, float a) -> void {
    ImColor_SetHSV(self, h, s, v, a);
}), allow_raw_ptrs{})

.function("ImColor_HSV", override([](float h, float s, float v, float a) -> ImColor {
    return ImColor_HSV(h, s, v, a);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiMultiSelectIO>("ImGuiMultiSelectIO")
.constructor<>()
;
bind_struct<ImDrawCmd>("ImDrawCmd")
.constructor<>()
.function("get_ClipRect", override([](ImDrawCmd const* self){
    return self->ClipRect;
}), allow_raw_ptrs{})
.function("set_ClipRect", override([](ImDrawCmd* self, ImVec4 value){
    self->ClipRect = value;
}), allow_raw_ptrs{})

.function("get_TexRef", override([](ImDrawCmd const* self){
    return self->TexRef;
}), allow_raw_ptrs{})
.function("set_TexRef", override([](ImDrawCmd* self, ImTextureRef value){
    self->TexRef = value;
}), allow_raw_ptrs{})

.function("get_VtxOffset", override([](ImDrawCmd const* self){
    return self->VtxOffset;
}), allow_raw_ptrs{})
.function("set_VtxOffset", override([](ImDrawCmd* self, unsigned int value){
    self->VtxOffset = value;
}), allow_raw_ptrs{})

.function("get_IdxOffset", override([](ImDrawCmd const* self){
    return self->IdxOffset;
}), allow_raw_ptrs{})
.function("set_IdxOffset", override([](ImDrawCmd* self, unsigned int value){
    self->IdxOffset = value;
}), allow_raw_ptrs{})

.function("get_ElemCount", override([](ImDrawCmd const* self){
    return self->ElemCount;
}), allow_raw_ptrs{})
.function("set_ElemCount", override([](ImDrawCmd* self, unsigned int value){
    self->ElemCount = value;
}), allow_raw_ptrs{})

.function("get_UserCallback", override([](ImDrawCmd const* self){
    return self->UserCallback;
}), allow_raw_ptrs{})
.function("set_UserCallback", override([](ImDrawCmd* self, ImDrawCallback value){
    self->UserCallback = value;
}), allow_raw_ptrs{})

.function("get_UserCallbackData", override([](ImDrawCmd const* self){
    return self->UserCallbackData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_UserCallbackData", override([](ImDrawCmd* self, void* value){
    self->UserCallbackData = value;
}), allow_raw_ptrs{})

.function("get_UserCallbackDataSize", override([](ImDrawCmd const* self){
    return self->UserCallbackDataSize;
}), allow_raw_ptrs{})
.function("set_UserCallbackDataSize", override([](ImDrawCmd* self, int value){
    self->UserCallbackDataSize = value;
}), allow_raw_ptrs{})

.function("get_UserCallbackDataOffset", override([](ImDrawCmd const* self){
    return self->UserCallbackDataOffset;
}), allow_raw_ptrs{})
.function("set_UserCallbackDataOffset", override([](ImDrawCmd* self, int value){
    self->UserCallbackDataOffset = value;
}), allow_raw_ptrs{})

.function("ImDrawCmd_GetTexID", override([](const ImDrawCmd* self) -> ImTextureID {
    return ImDrawCmd_GetTexID(self);
}), allow_raw_ptrs{})

;
bind_struct<ImDrawList>("ImDrawList")
.constructor<>()
.function("get_Flags", override([](ImDrawList const* self){
    return self->Flags;
}), allow_raw_ptrs{})
.function("set_Flags", override([](ImDrawList* self, ImDrawListFlags value){
    self->Flags = value;
}), allow_raw_ptrs{})

.function("ImDrawList_PushClipRect", override([](ImDrawList* self, ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect) -> void {
    ImDrawList_PushClipRect(self, clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
}), allow_raw_ptrs{})

.function("ImDrawList_PushClipRectFullScreen", override([](ImDrawList* self) -> void {
    ImDrawList_PushClipRectFullScreen(self);
}), allow_raw_ptrs{})

.function("ImDrawList_PopClipRect", override([](ImDrawList* self) -> void {
    ImDrawList_PopClipRect(self);
}), allow_raw_ptrs{})

.function("ImDrawList_PushTexture", override([](ImDrawList* self, ImTextureRef tex_ref) -> void {
    ImDrawList_PushTexture(self, tex_ref);
}), allow_raw_ptrs{})

.function("ImDrawList_PopTexture", override([](ImDrawList* self) -> void {
    ImDrawList_PopTexture(self);
}), allow_raw_ptrs{})

.function("ImDrawList_GetClipRectMin", override([](const ImDrawList* self) -> ImVec2 {
    return ImDrawList_GetClipRectMin(self);
}), allow_raw_ptrs{})

.function("ImDrawList_GetClipRectMax", override([](const ImDrawList* self) -> ImVec2 {
    return ImDrawList_GetClipRectMax(self);
}), allow_raw_ptrs{})

.function("ImDrawList_AddLine", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImU32 col, float thickness) -> void {
    ImDrawList_AddLine(self, p1, p2, col, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddRect", override([](ImDrawList* self, ImVec2 p_min, ImVec2 p_max, ImU32 col, float rounding, ImDrawFlags flags, float thickness) -> void {
    ImDrawList_AddRect(self, p_min, p_max, col, rounding, flags, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddRectFilled", override([](ImDrawList* self, ImVec2 p_min, ImVec2 p_max, ImU32 col, float rounding, ImDrawFlags flags) -> void {
    ImDrawList_AddRectFilled(self, p_min, p_max, col, rounding, flags);
}), allow_raw_ptrs{})

.function("ImDrawList_AddRectFilledMultiColor", override([](ImDrawList* self, ImVec2 p_min, ImVec2 p_max, ImU32 col_upr_left, ImU32 col_upr_right, ImU32 col_bot_right, ImU32 col_bot_left) -> void {
    ImDrawList_AddRectFilledMultiColor(self, p_min, p_max, col_upr_left, col_upr_right, col_bot_right, col_bot_left);
}), allow_raw_ptrs{})

.function("ImDrawList_AddQuad", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImVec2 p4, ImU32 col, float thickness) -> void {
    ImDrawList_AddQuad(self, p1, p2, p3, p4, col, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddQuadFilled", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImVec2 p4, ImU32 col) -> void {
    ImDrawList_AddQuadFilled(self, p1, p2, p3, p4, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddTriangle", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImU32 col, float thickness) -> void {
    ImDrawList_AddTriangle(self, p1, p2, p3, col, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddTriangleFilled", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImU32 col) -> void {
    ImDrawList_AddTriangleFilled(self, p1, p2, p3, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddCircle", override([](ImDrawList* self, ImVec2 center, float radius, ImU32 col, int num_segments, float thickness) -> void {
    ImDrawList_AddCircle(self, center, radius, col, num_segments, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddCircleFilled", override([](ImDrawList* self, ImVec2 center, float radius, ImU32 col, int num_segments) -> void {
    ImDrawList_AddCircleFilled(self, center, radius, col, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_AddNgon", override([](ImDrawList* self, ImVec2 center, float radius, ImU32 col, int num_segments, float thickness) -> void {
    ImDrawList_AddNgon(self, center, radius, col, num_segments, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddNgonFilled", override([](ImDrawList* self, ImVec2 center, float radius, ImU32 col, int num_segments) -> void {
    ImDrawList_AddNgonFilled(self, center, radius, col, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_AddEllipse", override([](ImDrawList* self, ImVec2 center, ImVec2 radius, ImU32 col, float rot, int num_segments, float thickness) -> void {
    ImDrawList_AddEllipse(self, center, radius, col, rot, num_segments, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddEllipseFilled", override([](ImDrawList* self, ImVec2 center, ImVec2 radius, ImU32 col, float rot, int num_segments) -> void {
    ImDrawList_AddEllipseFilled(self, center, radius, col, rot, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_AddText", override([](ImDrawList* self, ImVec2 pos, ImU32 col, std::string text_begin, std::string text_end) -> void {
    ImDrawList_AddText(self, pos, col, text_begin.c_str(), text_end.c_str());
}), allow_raw_ptrs{})

.function("ImDrawList_AddTextImFontPtr", override([](ImDrawList* self, ImFont* font, float font_size, ImVec2 pos, ImU32 col, std::string text_begin, std::string text_end, float wrap_width, const ImVec4* cpu_fine_clip_rect) -> void {
    ImDrawList_AddTextImFontPtr(self, font, font_size, pos, col, text_begin.c_str(), text_end.c_str(), wrap_width, cpu_fine_clip_rect);
}), allow_raw_ptrs{})

.function("ImDrawList_AddBezierCubic", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImVec2 p4, ImU32 col, float thickness, int num_segments) -> void {
    ImDrawList_AddBezierCubic(self, p1, p2, p3, p4, col, thickness, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_AddBezierQuadratic", override([](ImDrawList* self, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImU32 col, float thickness, int num_segments) -> void {
    ImDrawList_AddBezierQuadratic(self, p1, p2, p3, col, thickness, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_AddPolyline", override([](ImDrawList* self, const ImVec2* points, int num_points, ImU32 col, ImDrawFlags flags, float thickness) -> void {
    ImDrawList_AddPolyline(self, points, num_points, col, flags, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_AddConvexPolyFilled", override([](ImDrawList* self, const ImVec2* points, int num_points, ImU32 col) -> void {
    ImDrawList_AddConvexPolyFilled(self, points, num_points, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddConcavePolyFilled", override([](ImDrawList* self, const ImVec2* points, int num_points, ImU32 col) -> void {
    ImDrawList_AddConcavePolyFilled(self, points, num_points, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddImage", override([](ImDrawList* self, ImTextureRef tex_ref, ImVec2 p_min, ImVec2 p_max, ImVec2 uv_min, ImVec2 uv_max, ImU32 col) -> void {
    ImDrawList_AddImage(self, tex_ref, p_min, p_max, uv_min, uv_max, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddImageQuad", override([](ImDrawList* self, ImTextureRef tex_ref, ImVec2 p1, ImVec2 p2, ImVec2 p3, ImVec2 p4, ImVec2 uv1, ImVec2 uv2, ImVec2 uv3, ImVec2 uv4, ImU32 col) -> void {
    ImDrawList_AddImageQuad(self, tex_ref, p1, p2, p3, p4, uv1, uv2, uv3, uv4, col);
}), allow_raw_ptrs{})

.function("ImDrawList_AddImageRounded", override([](ImDrawList* self, ImTextureRef tex_ref, ImVec2 p_min, ImVec2 p_max, ImVec2 uv_min, ImVec2 uv_max, ImU32 col, float rounding, ImDrawFlags flags) -> void {
    ImDrawList_AddImageRounded(self, tex_ref, p_min, p_max, uv_min, uv_max, col, rounding, flags);
}), allow_raw_ptrs{})

.function("ImDrawList_PathClear", override([](ImDrawList* self) -> void {
    ImDrawList_PathClear(self);
}), allow_raw_ptrs{})

.function("ImDrawList_PathLineTo", override([](ImDrawList* self, ImVec2 pos) -> void {
    ImDrawList_PathLineTo(self, pos);
}), allow_raw_ptrs{})

.function("ImDrawList_PathLineToMergeDuplicate", override([](ImDrawList* self, ImVec2 pos) -> void {
    ImDrawList_PathLineToMergeDuplicate(self, pos);
}), allow_raw_ptrs{})

.function("ImDrawList_PathFillConvex", override([](ImDrawList* self, ImU32 col) -> void {
    ImDrawList_PathFillConvex(self, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PathFillConcave", override([](ImDrawList* self, ImU32 col) -> void {
    ImDrawList_PathFillConcave(self, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PathStroke", override([](ImDrawList* self, ImU32 col, ImDrawFlags flags, float thickness) -> void {
    ImDrawList_PathStroke(self, col, flags, thickness);
}), allow_raw_ptrs{})

.function("ImDrawList_PathArcTo", override([](ImDrawList* self, ImVec2 center, float radius, float a_min, float a_max, int num_segments) -> void {
    ImDrawList_PathArcTo(self, center, radius, a_min, a_max, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_PathArcToFast", override([](ImDrawList* self, ImVec2 center, float radius, int a_min_of_12, int a_max_of_12) -> void {
    ImDrawList_PathArcToFast(self, center, radius, a_min_of_12, a_max_of_12);
}), allow_raw_ptrs{})

.function("ImDrawList_PathEllipticalArcTo", override([](ImDrawList* self, ImVec2 center, ImVec2 radius, float rot, float a_min, float a_max, int num_segments) -> void {
    ImDrawList_PathEllipticalArcTo(self, center, radius, rot, a_min, a_max, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_PathBezierCubicCurveTo", override([](ImDrawList* self, ImVec2 p2, ImVec2 p3, ImVec2 p4, int num_segments) -> void {
    ImDrawList_PathBezierCubicCurveTo(self, p2, p3, p4, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_PathBezierQuadraticCurveTo", override([](ImDrawList* self, ImVec2 p2, ImVec2 p3, int num_segments) -> void {
    ImDrawList_PathBezierQuadraticCurveTo(self, p2, p3, num_segments);
}), allow_raw_ptrs{})

.function("ImDrawList_PathRect", override([](ImDrawList* self, ImVec2 rect_min, ImVec2 rect_max, float rounding, ImDrawFlags flags) -> void {
    ImDrawList_PathRect(self, rect_min, rect_max, rounding, flags);
}), allow_raw_ptrs{})

.function("ImDrawList_AddCallback", override([](ImDrawList* self, ImDrawCallback callback, void* userdata, size_t userdata_size) -> void {
    ImDrawList_AddCallback(self, callback, userdata, userdata_size);
}), allow_raw_ptrs{})

.function("ImDrawList_AddDrawCmd", override([](ImDrawList* self) -> void {
    ImDrawList_AddDrawCmd(self);
}), allow_raw_ptrs{})

.function("ImDrawList_CloneOutput", override([](const ImDrawList* self) -> ImDrawList* {
    return ImDrawList_CloneOutput(self);
}), allow_raw_ptrs{})

.function("ImDrawList_ChannelsSplit", override([](ImDrawList* self, int count) -> void {
    ImDrawList_ChannelsSplit(self, count);
}), allow_raw_ptrs{})

.function("ImDrawList_ChannelsMerge", override([](ImDrawList* self) -> void {
    ImDrawList_ChannelsMerge(self);
}), allow_raw_ptrs{})

.function("ImDrawList_ChannelsSetCurrent", override([](ImDrawList* self, int n) -> void {
    ImDrawList_ChannelsSetCurrent(self, n);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimReserve", override([](ImDrawList* self, int idx_count, int vtx_count) -> void {
    ImDrawList_PrimReserve(self, idx_count, vtx_count);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimUnreserve", override([](ImDrawList* self, int idx_count, int vtx_count) -> void {
    ImDrawList_PrimUnreserve(self, idx_count, vtx_count);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimRect", override([](ImDrawList* self, ImVec2 a, ImVec2 b, ImU32 col) -> void {
    ImDrawList_PrimRect(self, a, b, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimRectUV", override([](ImDrawList* self, ImVec2 a, ImVec2 b, ImVec2 uv_a, ImVec2 uv_b, ImU32 col) -> void {
    ImDrawList_PrimRectUV(self, a, b, uv_a, uv_b, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimQuadUV", override([](ImDrawList* self, ImVec2 a, ImVec2 b, ImVec2 c, ImVec2 d, ImVec2 uv_a, ImVec2 uv_b, ImVec2 uv_c, ImVec2 uv_d, ImU32 col) -> void {
    ImDrawList_PrimQuadUV(self, a, b, c, d, uv_a, uv_b, uv_c, uv_d, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimWriteVtx", override([](ImDrawList* self, ImVec2 pos, ImVec2 uv, ImU32 col) -> void {
    ImDrawList_PrimWriteVtx(self, pos, uv, col);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimWriteIdx", override([](ImDrawList* self, ImDrawIdx idx) -> void {
    ImDrawList_PrimWriteIdx(self, idx);
}), allow_raw_ptrs{})

.function("ImDrawList_PrimVtx", override([](ImDrawList* self, ImVec2 pos, ImVec2 uv, ImU32 col) -> void {
    ImDrawList_PrimVtx(self, pos, uv, col);
}), allow_raw_ptrs{})

.function("ImDrawList__SetDrawListSharedData", override([](ImDrawList* self, ImDrawListSharedData* data) -> void {
    ImDrawList__SetDrawListSharedData(self, data);
}), allow_raw_ptrs{})

.function("ImDrawList__ResetForNewFrame", override([](ImDrawList* self) -> void {
    ImDrawList__ResetForNewFrame(self);
}), allow_raw_ptrs{})

.function("ImDrawList__ClearFreeMemory", override([](ImDrawList* self) -> void {
    ImDrawList__ClearFreeMemory(self);
}), allow_raw_ptrs{})

.function("ImDrawList__PopUnusedDrawCmd", override([](ImDrawList* self) -> void {
    ImDrawList__PopUnusedDrawCmd(self);
}), allow_raw_ptrs{})

.function("ImDrawList__TryMergeDrawCmds", override([](ImDrawList* self) -> void {
    ImDrawList__TryMergeDrawCmds(self);
}), allow_raw_ptrs{})

.function("ImDrawList__OnChangedClipRect", override([](ImDrawList* self) -> void {
    ImDrawList__OnChangedClipRect(self);
}), allow_raw_ptrs{})

.function("ImDrawList__OnChangedTexture", override([](ImDrawList* self) -> void {
    ImDrawList__OnChangedTexture(self);
}), allow_raw_ptrs{})

.function("ImDrawList__OnChangedVtxOffset", override([](ImDrawList* self) -> void {
    ImDrawList__OnChangedVtxOffset(self);
}), allow_raw_ptrs{})

.function("ImDrawList__SetTexture", override([](ImDrawList* self, ImTextureRef tex_ref) -> void {
    ImDrawList__SetTexture(self, tex_ref);
}), allow_raw_ptrs{})

.function("ImDrawList__CalcCircleAutoSegmentCount", override([](const ImDrawList* self, float radius) -> int {
    return ImDrawList__CalcCircleAutoSegmentCount(self, radius);
}), allow_raw_ptrs{})

.function("ImDrawList__PathArcToFastEx", override([](ImDrawList* self, ImVec2 center, float radius, int a_min_sample, int a_max_sample, int a_step) -> void {
    ImDrawList__PathArcToFastEx(self, center, radius, a_min_sample, a_max_sample, a_step);
}), allow_raw_ptrs{})

.function("ImDrawList__PathArcToN", override([](ImDrawList* self, ImVec2 center, float radius, float a_min, float a_max, int num_segments) -> void {
    ImDrawList__PathArcToN(self, center, radius, a_min, a_max, num_segments);
}), allow_raw_ptrs{})

;
bind_struct<ImDrawData>("ImDrawData")
.constructor<>()
;
bind_struct<ImFontConfig>("ImFontConfig")
.constructor<>()
.function("get_FontData", override([](ImFontConfig const* self){
    return self->FontData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_FontData", override([](ImFontConfig* self, void* value){
    self->FontData = value;
}), allow_raw_ptrs{})

.function("get_FontDataSize", override([](ImFontConfig const* self){
    return self->FontDataSize;
}), allow_raw_ptrs{})
.function("set_FontDataSize", override([](ImFontConfig* self, int value){
    self->FontDataSize = value;
}), allow_raw_ptrs{})

.function("get_FontDataOwnedByAtlas", override([](ImFontConfig const* self){
    return self->FontDataOwnedByAtlas;
}), allow_raw_ptrs{})
.function("set_FontDataOwnedByAtlas", override([](ImFontConfig* self, bool value){
    self->FontDataOwnedByAtlas = value;
}), allow_raw_ptrs{})

.function("get_MergeMode", override([](ImFontConfig const* self){
    return self->MergeMode;
}), allow_raw_ptrs{})
.function("set_MergeMode", override([](ImFontConfig* self, bool value){
    self->MergeMode = value;
}), allow_raw_ptrs{})

.function("get_PixelSnapH", override([](ImFontConfig const* self){
    return self->PixelSnapH;
}), allow_raw_ptrs{})
.function("set_PixelSnapH", override([](ImFontConfig* self, bool value){
    self->PixelSnapH = value;
}), allow_raw_ptrs{})

.function("get_OversampleH", override([](ImFontConfig const* self){
    return self->OversampleH;
}), allow_raw_ptrs{})
.function("set_OversampleH", override([](ImFontConfig* self, ImS8 value){
    self->OversampleH = value;
}), allow_raw_ptrs{})

.function("get_OversampleV", override([](ImFontConfig const* self){
    return self->OversampleV;
}), allow_raw_ptrs{})
.function("set_OversampleV", override([](ImFontConfig* self, ImS8 value){
    self->OversampleV = value;
}), allow_raw_ptrs{})

.function("get_EllipsisChar", override([](ImFontConfig const* self){
    return self->EllipsisChar;
}), allow_raw_ptrs{})
.function("set_EllipsisChar", override([](ImFontConfig* self, ImWchar value){
    self->EllipsisChar = value;
}), allow_raw_ptrs{})

.function("get_SizePixels", override([](ImFontConfig const* self){
    return self->SizePixels;
}), allow_raw_ptrs{})
.function("set_SizePixels", override([](ImFontConfig* self, float value){
    self->SizePixels = value;
}), allow_raw_ptrs{})

.function("get_GlyphRanges", override([](ImFontConfig const* self){
    return self->GlyphRanges;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_GlyphRanges", override([](ImFontConfig* self, const ImWchar* value){
    self->GlyphRanges = value;
}), allow_raw_ptrs{})

.function("get_GlyphExcludeRanges", override([](ImFontConfig const* self){
    return self->GlyphExcludeRanges;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_GlyphExcludeRanges", override([](ImFontConfig* self, const ImWchar* value){
    self->GlyphExcludeRanges = value;
}), allow_raw_ptrs{})

.function("get_GlyphOffset", override([](ImFontConfig const* self){
    return self->GlyphOffset;
}), allow_raw_ptrs{})
.function("set_GlyphOffset", override([](ImFontConfig* self, ImVec2 value){
    self->GlyphOffset = value;
}), allow_raw_ptrs{})

.function("get_GlyphMinAdvanceX", override([](ImFontConfig const* self){
    return self->GlyphMinAdvanceX;
}), allow_raw_ptrs{})
.function("set_GlyphMinAdvanceX", override([](ImFontConfig* self, float value){
    self->GlyphMinAdvanceX = value;
}), allow_raw_ptrs{})

.function("get_GlyphMaxAdvanceX", override([](ImFontConfig const* self){
    return self->GlyphMaxAdvanceX;
}), allow_raw_ptrs{})
.function("set_GlyphMaxAdvanceX", override([](ImFontConfig* self, float value){
    self->GlyphMaxAdvanceX = value;
}), allow_raw_ptrs{})

.function("get_GlyphExtraAdvanceX", override([](ImFontConfig const* self){
    return self->GlyphExtraAdvanceX;
}), allow_raw_ptrs{})
.function("set_GlyphExtraAdvanceX", override([](ImFontConfig* self, float value){
    self->GlyphExtraAdvanceX = value;
}), allow_raw_ptrs{})

.function("get_FontNo", override([](ImFontConfig const* self){
    return self->FontNo;
}), allow_raw_ptrs{})
.function("set_FontNo", override([](ImFontConfig* self, ImU32 value){
    self->FontNo = value;
}), allow_raw_ptrs{})

.function("get_FontLoaderFlags", override([](ImFontConfig const* self){
    return self->FontLoaderFlags;
}), allow_raw_ptrs{})
.function("set_FontLoaderFlags", override([](ImFontConfig* self, unsigned int value){
    self->FontLoaderFlags = value;
}), allow_raw_ptrs{})

.function("get_RasterizerMultiply", override([](ImFontConfig const* self){
    return self->RasterizerMultiply;
}), allow_raw_ptrs{})
.function("set_RasterizerMultiply", override([](ImFontConfig* self, float value){
    self->RasterizerMultiply = value;
}), allow_raw_ptrs{})

.function("get_RasterizerDensity", override([](ImFontConfig const* self){
    return self->RasterizerDensity;
}), allow_raw_ptrs{})
.function("set_RasterizerDensity", override([](ImFontConfig* self, float value){
    self->RasterizerDensity = value;
}), allow_raw_ptrs{})

.function("get_ExtraSizeScale", override([](ImFontConfig const* self){
    return self->ExtraSizeScale;
}), allow_raw_ptrs{})
.function("set_ExtraSizeScale", override([](ImFontConfig* self, float value){
    self->ExtraSizeScale = value;
}), allow_raw_ptrs{})

;
bind_struct<ImFontAtlasRect>("ImFontAtlasRect")
.constructor<>()
.function("get_x", override([](ImFontAtlasRect const* self){
    return self->x;
}), allow_raw_ptrs{})
.function("set_x", override([](ImFontAtlasRect* self, unsigned short value){
    self->x = value;
}), allow_raw_ptrs{})

.function("get_y", override([](ImFontAtlasRect const* self){
    return self->y;
}), allow_raw_ptrs{})
.function("set_y", override([](ImFontAtlasRect* self, unsigned short value){
    self->y = value;
}), allow_raw_ptrs{})

.function("get_w", override([](ImFontAtlasRect const* self){
    return self->w;
}), allow_raw_ptrs{})
.function("set_w", override([](ImFontAtlasRect* self, unsigned short value){
    self->w = value;
}), allow_raw_ptrs{})

.function("get_h", override([](ImFontAtlasRect const* self){
    return self->h;
}), allow_raw_ptrs{})
.function("set_h", override([](ImFontAtlasRect* self, unsigned short value){
    self->h = value;
}), allow_raw_ptrs{})

.function("get_uv0", override([](ImFontAtlasRect const* self){
    return self->uv0;
}), allow_raw_ptrs{})
.function("set_uv0", override([](ImFontAtlasRect* self, ImVec2 value){
    self->uv0 = value;
}), allow_raw_ptrs{})

.function("get_uv1", override([](ImFontAtlasRect const* self){
    return self->uv1;
}), allow_raw_ptrs{})
.function("set_uv1", override([](ImFontAtlasRect* self, ImVec2 value){
    self->uv1 = value;
}), allow_raw_ptrs{})

;
bind_struct<ImFontAtlas>("ImFontAtlas")
.constructor<>()
.function("get_Flags", override([](ImFontAtlas const* self){
    return self->Flags;
}), allow_raw_ptrs{})
.function("set_Flags", override([](ImFontAtlas* self, ImFontAtlasFlags value){
    self->Flags = value;
}), allow_raw_ptrs{})

.function("get_TexGlyphPadding", override([](ImFontAtlas const* self){
    return self->TexGlyphPadding;
}), allow_raw_ptrs{})
.function("set_TexGlyphPadding", override([](ImFontAtlas* self, int value){
    self->TexGlyphPadding = value;
}), allow_raw_ptrs{})

.function("get_TexMinWidth", override([](ImFontAtlas const* self){
    return self->TexMinWidth;
}), allow_raw_ptrs{})
.function("set_TexMinWidth", override([](ImFontAtlas* self, int value){
    self->TexMinWidth = value;
}), allow_raw_ptrs{})

.function("get_TexMinHeight", override([](ImFontAtlas const* self){
    return self->TexMinHeight;
}), allow_raw_ptrs{})
.function("set_TexMinHeight", override([](ImFontAtlas* self, int value){
    self->TexMinHeight = value;
}), allow_raw_ptrs{})

.function("get_TexMaxWidth", override([](ImFontAtlas const* self){
    return self->TexMaxWidth;
}), allow_raw_ptrs{})
.function("set_TexMaxWidth", override([](ImFontAtlas* self, int value){
    self->TexMaxWidth = value;
}), allow_raw_ptrs{})

.function("get_TexMaxHeight", override([](ImFontAtlas const* self){
    return self->TexMaxHeight;
}), allow_raw_ptrs{})
.function("set_TexMaxHeight", override([](ImFontAtlas* self, int value){
    self->TexMaxHeight = value;
}), allow_raw_ptrs{})

.function("get_UserData", override([](ImFontAtlas const* self){
    return self->UserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_UserData", override([](ImFontAtlas* self, void* value){
    self->UserData = value;
}), allow_raw_ptrs{})

.function("get_TexRef", override([](ImFontAtlas const* self){
    return self->TexRef;
}), allow_raw_ptrs{})
.function("set_TexRef", override([](ImFontAtlas* self, ImTextureRef value){
    self->TexRef = value;
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddFont", override([](ImFontAtlas* self, const ImFontConfig* font_cfg) -> ImFont* {
    return ImFontAtlas_AddFont(self, font_cfg);
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddFontDefault", override([](ImFontAtlas* self, const ImFontConfig* font_cfg) -> ImFont* {
    return ImFontAtlas_AddFontDefault(self, font_cfg);
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddFontDefaultVector", override([](ImFontAtlas* self, const ImFontConfig* font_cfg) -> ImFont* {
    return ImFontAtlas_AddFontDefaultVector(self, font_cfg);
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddFontDefaultBitmap", override([](ImFontAtlas* self, const ImFontConfig* font_cfg) -> ImFont* {
    return ImFontAtlas_AddFontDefaultBitmap(self, font_cfg);
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddFontFromFileTTF", override([](ImFontAtlas* self, std::string filename, float size_pixels, const ImFontConfig* font_cfg, js_val glyph_ranges) -> ImFont* {
    auto param_glyph_ranges = get_vector_param<ImWchar>(glyph_ranges);
    auto const ret = ImFontAtlas_AddFontFromFileTTF(self, filename.c_str(), size_pixels, font_cfg, param_glyph_ranges.ptr);
    write_back_vector_param(param_glyph_ranges, glyph_ranges);
    return ret;
}), rvp_ref{}, allow_raw_ptrs{})
.function("ImFontAtlas_RemoveFont", override([](ImFontAtlas* self, ImFont* font) -> void {
    ImFontAtlas_RemoveFont(self, font);
}), allow_raw_ptrs{})

.function("ImFontAtlas_Clear", override([](ImFontAtlas* self) -> void {
    ImFontAtlas_Clear(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_CompactCache", override([](ImFontAtlas* self) -> void {
    ImFontAtlas_CompactCache(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_SetFontLoader", override([](ImFontAtlas* self, const ImFontLoader* font_loader) -> void {
    ImFontAtlas_SetFontLoader(self, font_loader);
}), allow_raw_ptrs{})

.function("ImFontAtlas_ClearInputData", override([](ImFontAtlas* self) -> void {
    ImFontAtlas_ClearInputData(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_ClearFonts", override([](ImFontAtlas* self) -> void {
    ImFontAtlas_ClearFonts(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_ClearTexData", override([](ImFontAtlas* self) -> void {
    ImFontAtlas_ClearTexData(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_GetGlyphRangesDefault", override([](ImFontAtlas* self) -> const ImWchar* {
    return ImFontAtlas_GetGlyphRangesDefault(self);
}), allow_raw_ptrs{})

.function("ImFontAtlas_AddCustomRect", override([](ImFontAtlas* self, int width, int height, ImFontAtlasRect* out_r) -> ImFontAtlasRectId {
    return ImFontAtlas_AddCustomRect(self, width, height, out_r);
}), allow_raw_ptrs{})

.function("ImFontAtlas_RemoveCustomRect", override([](ImFontAtlas* self, ImFontAtlasRectId id) -> void {
    ImFontAtlas_RemoveCustomRect(self, id);
}), allow_raw_ptrs{})

.function("ImFontAtlas_GetCustomRect", override([](const ImFontAtlas* self, ImFontAtlasRectId id, ImFontAtlasRect* out_r) -> bool {
    return ImFontAtlas_GetCustomRect(self, id, out_r);
}), allow_raw_ptrs{})

;
bind_struct<ImFontBaked>("ImFontBaked")
.constructor<>()
;
bind_struct<ImFont>("ImFont")
.constructor<>()
;
bind_struct<ImGuiViewport>("ImGuiViewport")
.constructor<>()
.function("get_ID", override([](ImGuiViewport const* self){
    return self->ID;
}), allow_raw_ptrs{})
.function("set_ID", override([](ImGuiViewport* self, ImGuiID value){
    self->ID = value;
}), allow_raw_ptrs{})

.function("get_Flags", override([](ImGuiViewport const* self){
    return self->Flags;
}), allow_raw_ptrs{})
.function("set_Flags", override([](ImGuiViewport* self, ImGuiViewportFlags value){
    self->Flags = value;
}), allow_raw_ptrs{})

.function("get_Pos", override([](ImGuiViewport const* self){
    return self->Pos;
}), allow_raw_ptrs{})
.function("set_Pos", override([](ImGuiViewport* self, ImVec2 value){
    self->Pos = value;
}), allow_raw_ptrs{})

.function("get_Size", override([](ImGuiViewport const* self){
    return self->Size;
}), allow_raw_ptrs{})
.function("set_Size", override([](ImGuiViewport* self, ImVec2 value){
    self->Size = value;
}), allow_raw_ptrs{})

.function("get_FramebufferScale", override([](ImGuiViewport const* self){
    return self->FramebufferScale;
}), allow_raw_ptrs{})
.function("set_FramebufferScale", override([](ImGuiViewport* self, ImVec2 value){
    self->FramebufferScale = value;
}), allow_raw_ptrs{})

.function("get_WorkPos", override([](ImGuiViewport const* self){
    return self->WorkPos;
}), allow_raw_ptrs{})
.function("set_WorkPos", override([](ImGuiViewport* self, ImVec2 value){
    self->WorkPos = value;
}), allow_raw_ptrs{})

.function("get_WorkSize", override([](ImGuiViewport const* self){
    return self->WorkSize;
}), allow_raw_ptrs{})
.function("set_WorkSize", override([](ImGuiViewport* self, ImVec2 value){
    self->WorkSize = value;
}), allow_raw_ptrs{})

.function("get_DpiScale", override([](ImGuiViewport const* self){
    return self->DpiScale;
}), allow_raw_ptrs{})
.function("set_DpiScale", override([](ImGuiViewport* self, float value){
    self->DpiScale = value;
}), allow_raw_ptrs{})

.function("get_ParentViewportId", override([](ImGuiViewport const* self){
    return self->ParentViewportId;
}), allow_raw_ptrs{})
.function("set_ParentViewportId", override([](ImGuiViewport* self, ImGuiID value){
    self->ParentViewportId = value;
}), allow_raw_ptrs{})

.function("get_ParentViewport", override([](ImGuiViewport const* self){
    return self->ParentViewport;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_ParentViewport", override([](ImGuiViewport* self, ImGuiViewport* value){
    self->ParentViewport = value;
}), allow_raw_ptrs{})

.function("get_DrawData", override([](ImGuiViewport const* self){
    return self->DrawData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_DrawData", override([](ImGuiViewport* self, ImDrawData* value){
    self->DrawData = value;
}), allow_raw_ptrs{})

.function("get_RendererUserData", override([](ImGuiViewport const* self){
    return self->RendererUserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_RendererUserData", override([](ImGuiViewport* self, void* value){
    self->RendererUserData = value;
}), allow_raw_ptrs{})

.function("get_PlatformUserData", override([](ImGuiViewport const* self){
    return self->PlatformUserData;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PlatformUserData", override([](ImGuiViewport* self, void* value){
    self->PlatformUserData = value;
}), allow_raw_ptrs{})

.function("get_PlatformHandle", override([](ImGuiViewport const* self){
    return self->PlatformHandle;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PlatformHandle", override([](ImGuiViewport* self, void* value){
    self->PlatformHandle = value;
}), allow_raw_ptrs{})

.function("get_PlatformHandleRaw", override([](ImGuiViewport const* self){
    return self->PlatformHandleRaw;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PlatformHandleRaw", override([](ImGuiViewport* self, void* value){
    self->PlatformHandleRaw = value;
}), allow_raw_ptrs{})

.function("get_PlatformWindowCreated", override([](ImGuiViewport const* self){
    return self->PlatformWindowCreated;
}), allow_raw_ptrs{})
.function("set_PlatformWindowCreated", override([](ImGuiViewport* self, bool value){
    self->PlatformWindowCreated = value;
}), allow_raw_ptrs{})

.function("get_PlatformRequestMove", override([](ImGuiViewport const* self){
    return self->PlatformRequestMove;
}), allow_raw_ptrs{})
.function("set_PlatformRequestMove", override([](ImGuiViewport* self, bool value){
    self->PlatformRequestMove = value;
}), allow_raw_ptrs{})

.function("get_PlatformRequestResize", override([](ImGuiViewport const* self){
    return self->PlatformRequestResize;
}), allow_raw_ptrs{})
.function("set_PlatformRequestResize", override([](ImGuiViewport* self, bool value){
    self->PlatformRequestResize = value;
}), allow_raw_ptrs{})

.function("get_PlatformRequestClose", override([](ImGuiViewport const* self){
    return self->PlatformRequestClose;
}), allow_raw_ptrs{})
.function("set_PlatformRequestClose", override([](ImGuiViewport* self, bool value){
    self->PlatformRequestClose = value;
}), allow_raw_ptrs{})

.function("ImGuiViewport_GetCenter", override([](const ImGuiViewport* self) -> ImVec2 {
    return ImGuiViewport_GetCenter(self);
}), allow_raw_ptrs{})

.function("ImGuiViewport_GetWorkCenter", override([](const ImGuiViewport* self) -> ImVec2 {
    return ImGuiViewport_GetWorkCenter(self);
}), allow_raw_ptrs{})

.function("ImGuiViewport_GetDebugName", override([](const ImGuiViewport* self) -> std::string {
    return ImGuiViewport_GetDebugName(self);
}), allow_raw_ptrs{})

;
bind_struct<ImGuiPlatformIO>("ImGuiPlatformIO")
.constructor<>()
;

bind_fn("ImGui_CreateContext", [](ImFontAtlas* shared_font_atlas) -> ImGuiContext* {
    return ImGui_CreateContext(shared_font_atlas);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_DestroyContext", [](ImGuiContext* ctx) -> void {
    ImGui_DestroyContext(ctx);
}, allow_raw_ptrs{});

bind_fn("ImGui_GetCurrentContext", []() -> ImGuiContext* {
    return ImGui_GetCurrentContext();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_SetCurrentContext", [](ImGuiContext* ctx) -> void {
    ImGui_SetCurrentContext(ctx);
}, allow_raw_ptrs{});

bind_fn("ImGui_GetIO", []() -> ImGuiIO* {
    return ImGui_GetIO();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetPlatformIO", []() -> ImGuiPlatformIO* {
    return ImGui_GetPlatformIO();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetStyle", []() -> ImGuiStyle* {
    return ImGui_GetStyle();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_NewFrame", []() -> void {
    ImGui_NewFrame();
});

bind_fn("ImGui_EndFrame", []() -> void {
    ImGui_EndFrame();
});

bind_fn("ImGui_Render", []() -> void {
    ImGui_Render();
});

bind_fn("ImGui_GetDrawData", []() -> ImDrawData* {
    return ImGui_GetDrawData();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_ShowDemoWindow", [](js_val p_open) -> void {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    ImGui_ShowDemoWindow(param_p_open.ptr);
    write_back_array_param(param_p_open, p_open);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowMetricsWindow", [](js_val p_open) -> void {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    ImGui_ShowMetricsWindow(param_p_open.ptr);
    write_back_array_param(param_p_open, p_open);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowDebugLogWindow", [](js_val p_open) -> void {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    ImGui_ShowDebugLogWindow(param_p_open.ptr);
    write_back_array_param(param_p_open, p_open);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowIDStackToolWindow", [](js_val p_open) -> void {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    ImGui_ShowIDStackToolWindow(param_p_open.ptr);
    write_back_array_param(param_p_open, p_open);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowAboutWindow", [](js_val p_open) -> void {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    ImGui_ShowAboutWindow(param_p_open.ptr);
    write_back_array_param(param_p_open, p_open);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowStyleEditor", [](ImGuiStyle* ref) -> void {
    ImGui_ShowStyleEditor(ref);
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowStyleSelector", [](std::string label) -> bool {
    return ImGui_ShowStyleSelector(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowFontSelector", [](std::string label) -> void {
    ImGui_ShowFontSelector(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_ShowUserGuide", []() -> void {
    ImGui_ShowUserGuide();
});

bind_fn("ImGui_GetVersion", []() -> std::string {
    return ImGui_GetVersion();
});

bind_fn("ImGui_StyleColorsDark", [](ImGuiStyle* dst) -> void {
    ImGui_StyleColorsDark(dst);
}, allow_raw_ptrs{});

bind_fn("ImGui_StyleColorsLight", [](ImGuiStyle* dst) -> void {
    ImGui_StyleColorsLight(dst);
}, allow_raw_ptrs{});

bind_fn("ImGui_StyleColorsClassic", [](ImGuiStyle* dst) -> void {
    ImGui_StyleColorsClassic(dst);
}, allow_raw_ptrs{});

bind_fn("ImGui_Begin", [](std::string name, js_val p_open, ImGuiWindowFlags flags) -> bool {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    auto const ret = ImGui_Begin(name.c_str(), param_p_open.ptr, flags);
    write_back_array_param(param_p_open, p_open);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_End", []() -> void {
    ImGui_End();
});

bind_fn("ImGui_BeginChild", [](std::string str_id, ImVec2 size, ImGuiChildFlags child_flags, ImGuiWindowFlags window_flags) -> bool {
    return ImGui_BeginChild(str_id.c_str(), size, child_flags, window_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginChildID", [](ImGuiID id, ImVec2 size, ImGuiChildFlags child_flags, ImGuiWindowFlags window_flags) -> bool {
    return ImGui_BeginChildID(id, size, child_flags, window_flags);
});

bind_fn("ImGui_EndChild", []() -> void {
    ImGui_EndChild();
});

bind_fn("ImGui_IsWindowAppearing", []() -> bool {
    return ImGui_IsWindowAppearing();
});

bind_fn("ImGui_IsWindowCollapsed", []() -> bool {
    return ImGui_IsWindowCollapsed();
});

bind_fn("ImGui_IsWindowFocused", [](ImGuiFocusedFlags flags) -> bool {
    return ImGui_IsWindowFocused(flags);
});

bind_fn("ImGui_IsWindowHovered", [](ImGuiHoveredFlags flags) -> bool {
    return ImGui_IsWindowHovered(flags);
});

bind_fn("ImGui_GetWindowDrawList", []() -> ImDrawList* {
    return ImGui_GetWindowDrawList();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetWindowDpiScale", []() -> float {
    return ImGui_GetWindowDpiScale();
});

bind_fn("ImGui_GetWindowPos", []() -> ImVec2 {
    return ImGui_GetWindowPos();
});

bind_fn("ImGui_GetWindowSize", []() -> ImVec2 {
    return ImGui_GetWindowSize();
});

bind_fn("ImGui_GetWindowWidth", []() -> float {
    return ImGui_GetWindowWidth();
});

bind_fn("ImGui_GetWindowHeight", []() -> float {
    return ImGui_GetWindowHeight();
});

bind_fn("ImGui_GetWindowViewport", []() -> ImGuiViewport* {
    return ImGui_GetWindowViewport();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_SetNextWindowPos", [](ImVec2 pos, ImGuiCond cond, ImVec2 pivot) -> void {
    ImGui_SetNextWindowPos(pos, cond, pivot);
});

bind_fn("ImGui_SetNextWindowSize", [](ImVec2 size, ImGuiCond cond) -> void {
    ImGui_SetNextWindowSize(size, cond);
});

bind_fn("ImGui_SetNextWindowSizeConstraints", [](ImVec2 min, ImVec2 max){
    ImGui_SetNextWindowSizeConstraints(min, max, nullptr, nullptr);
});
bind_fn("ImGui_SetNextWindowContentSize", [](ImVec2 size) -> void {
    ImGui_SetNextWindowContentSize(size);
});

bind_fn("ImGui_SetNextWindowCollapsed", [](bool collapsed, ImGuiCond cond) -> void {
    ImGui_SetNextWindowCollapsed(collapsed, cond);
});

bind_fn("ImGui_SetNextWindowFocus", []() -> void {
    ImGui_SetNextWindowFocus();
});

bind_fn("ImGui_SetNextWindowScroll", [](ImVec2 scroll) -> void {
    ImGui_SetNextWindowScroll(scroll);
});

bind_fn("ImGui_SetNextWindowBgAlpha", [](float alpha) -> void {
    ImGui_SetNextWindowBgAlpha(alpha);
});

bind_fn("ImGui_SetNextWindowViewport", [](ImGuiID viewport_id) -> void {
    ImGui_SetNextWindowViewport(viewport_id);
});

bind_fn("ImGui_SetWindowPos", [](ImVec2 pos, ImGuiCond cond) -> void {
    ImGui_SetWindowPos(pos, cond);
});

bind_fn("ImGui_SetWindowSize", [](ImVec2 size, ImGuiCond cond) -> void {
    ImGui_SetWindowSize(size, cond);
});

bind_fn("ImGui_SetWindowCollapsed", [](bool collapsed, ImGuiCond cond) -> void {
    ImGui_SetWindowCollapsed(collapsed, cond);
});

bind_fn("ImGui_SetWindowFocus", []() -> void {
    ImGui_SetWindowFocus();
});

bind_fn("ImGui_SetWindowPosStr", [](std::string name, ImVec2 pos, ImGuiCond cond) -> void {
    ImGui_SetWindowPosStr(name.c_str(), pos, cond);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetWindowSizeStr", [](std::string name, ImVec2 size, ImGuiCond cond) -> void {
    ImGui_SetWindowSizeStr(name.c_str(), size, cond);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetWindowCollapsedStr", [](std::string name, bool collapsed, ImGuiCond cond) -> void {
    ImGui_SetWindowCollapsedStr(name.c_str(), collapsed, cond);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetWindowFocusStr", [](std::string name) -> void {
    ImGui_SetWindowFocusStr(name.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_GetScrollX", []() -> float {
    return ImGui_GetScrollX();
});

bind_fn("ImGui_GetScrollY", []() -> float {
    return ImGui_GetScrollY();
});

bind_fn("ImGui_SetScrollX", [](float scroll_x) -> void {
    ImGui_SetScrollX(scroll_x);
});

bind_fn("ImGui_SetScrollY", [](float scroll_y) -> void {
    ImGui_SetScrollY(scroll_y);
});

bind_fn("ImGui_GetScrollMaxX", []() -> float {
    return ImGui_GetScrollMaxX();
});

bind_fn("ImGui_GetScrollMaxY", []() -> float {
    return ImGui_GetScrollMaxY();
});

bind_fn("ImGui_SetScrollHereX", [](float center_x_ratio) -> void {
    ImGui_SetScrollHereX(center_x_ratio);
});

bind_fn("ImGui_SetScrollHereY", [](float center_y_ratio) -> void {
    ImGui_SetScrollHereY(center_y_ratio);
});

bind_fn("ImGui_SetScrollFromPosX", [](float local_x, float center_x_ratio) -> void {
    ImGui_SetScrollFromPosX(local_x, center_x_ratio);
});

bind_fn("ImGui_SetScrollFromPosY", [](float local_y, float center_y_ratio) -> void {
    ImGui_SetScrollFromPosY(local_y, center_y_ratio);
});

bind_fn("ImGui_PushFontFloat", [](ImFont* font, float font_size_base_unscaled) -> void {
    ImGui_PushFontFloat(font, font_size_base_unscaled);
}, allow_raw_ptrs{});

bind_fn("ImGui_PopFont", []() -> void {
    ImGui_PopFont();
});

bind_fn("ImGui_GetFont", []() -> ImFont* {
    return ImGui_GetFont();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetFontSize", []() -> float {
    return ImGui_GetFontSize();
});

bind_fn("ImGui_GetFontBaked", []() -> ImFontBaked* {
    return ImGui_GetFontBaked();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_PushStyleColor", [](ImGuiCol idx, ImU32 col) -> void {
    ImGui_PushStyleColor(idx, col);
});

bind_fn("ImGui_PushStyleColorImVec4", [](ImGuiCol idx, ImVec4 col) -> void {
    ImGui_PushStyleColorImVec4(idx, col);
});

bind_fn("ImGui_PopStyleColor", [](int count) -> void {
    ImGui_PopStyleColor(count);
});

bind_fn("ImGui_PushStyleVar", [](ImGuiStyleVar idx, float val) -> void {
    ImGui_PushStyleVar(idx, val);
});

bind_fn("ImGui_PushStyleVarImVec2", [](ImGuiStyleVar idx, ImVec2 val) -> void {
    ImGui_PushStyleVarImVec2(idx, val);
});

bind_fn("ImGui_PushStyleVarX", [](ImGuiStyleVar idx, float val_x) -> void {
    ImGui_PushStyleVarX(idx, val_x);
});

bind_fn("ImGui_PushStyleVarY", [](ImGuiStyleVar idx, float val_y) -> void {
    ImGui_PushStyleVarY(idx, val_y);
});

bind_fn("ImGui_PopStyleVar", [](int count) -> void {
    ImGui_PopStyleVar(count);
});

bind_fn("ImGui_PushItemFlag", [](ImGuiItemFlags option, bool enabled) -> void {
    ImGui_PushItemFlag(option, enabled);
});

bind_fn("ImGui_PopItemFlag", []() -> void {
    ImGui_PopItemFlag();
});

bind_fn("ImGui_PushItemWidth", [](float item_width) -> void {
    ImGui_PushItemWidth(item_width);
});

bind_fn("ImGui_PopItemWidth", []() -> void {
    ImGui_PopItemWidth();
});

bind_fn("ImGui_SetNextItemWidth", [](float item_width) -> void {
    ImGui_SetNextItemWidth(item_width);
});

bind_fn("ImGui_CalcItemWidth", []() -> float {
    return ImGui_CalcItemWidth();
});

bind_fn("ImGui_PushTextWrapPos", [](float wrap_local_pos_x) -> void {
    ImGui_PushTextWrapPos(wrap_local_pos_x);
});

bind_fn("ImGui_PopTextWrapPos", []() -> void {
    ImGui_PopTextWrapPos();
});

bind_fn("ImGui_GetFontTexUvWhitePixel", []() -> ImVec2 {
    return ImGui_GetFontTexUvWhitePixel();
});

bind_fn("ImGui_GetColorU32", [](ImGuiCol idx, float alpha_mul) -> ImU32 {
    return ImGui_GetColorU32(idx, alpha_mul);
});

bind_fn("ImGui_GetColorU32ImVec4", [](ImVec4 col) -> ImU32 {
    return ImGui_GetColorU32ImVec4(col);
});

bind_fn("ImGui_GetColorU32ImU32", [](ImU32 col, float alpha_mul) -> ImU32 {
    return ImGui_GetColorU32ImU32(col, alpha_mul);
});

bind_fn("ImGui_GetStyleColorVec4", [](ImGuiCol idx) -> const ImVec4* {
    return ImGui_GetStyleColorVec4(idx);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetCursorScreenPos", []() -> ImVec2 {
    return ImGui_GetCursorScreenPos();
});

bind_fn("ImGui_SetCursorScreenPos", [](ImVec2 pos) -> void {
    ImGui_SetCursorScreenPos(pos);
});

bind_fn("ImGui_GetContentRegionAvail", []() -> ImVec2 {
    return ImGui_GetContentRegionAvail();
});

bind_fn("ImGui_GetCursorPos", []() -> ImVec2 {
    return ImGui_GetCursorPos();
});

bind_fn("ImGui_GetCursorPosX", []() -> float {
    return ImGui_GetCursorPosX();
});

bind_fn("ImGui_GetCursorPosY", []() -> float {
    return ImGui_GetCursorPosY();
});

bind_fn("ImGui_SetCursorPos", [](ImVec2 local_pos) -> void {
    ImGui_SetCursorPos(local_pos);
});

bind_fn("ImGui_SetCursorPosX", [](float local_x) -> void {
    ImGui_SetCursorPosX(local_x);
});

bind_fn("ImGui_SetCursorPosY", [](float local_y) -> void {
    ImGui_SetCursorPosY(local_y);
});

bind_fn("ImGui_GetCursorStartPos", []() -> ImVec2 {
    return ImGui_GetCursorStartPos();
});

bind_fn("ImGui_Separator", []() -> void {
    ImGui_Separator();
});

bind_fn("ImGui_SameLine", [](float offset_from_start_x, float spacing) -> void {
    ImGui_SameLine(offset_from_start_x, spacing);
});

bind_fn("ImGui_NewLine", []() -> void {
    ImGui_NewLine();
});

bind_fn("ImGui_Spacing", []() -> void {
    ImGui_Spacing();
});

bind_fn("ImGui_Dummy", [](ImVec2 size) -> void {
    ImGui_Dummy(size);
});

bind_fn("ImGui_Indent", [](float indent_w) -> void {
    ImGui_Indent(indent_w);
});

bind_fn("ImGui_Unindent", [](float indent_w) -> void {
    ImGui_Unindent(indent_w);
});

bind_fn("ImGui_BeginGroup", []() -> void {
    ImGui_BeginGroup();
});

bind_fn("ImGui_EndGroup", []() -> void {
    ImGui_EndGroup();
});

bind_fn("ImGui_AlignTextToFramePadding", []() -> void {
    ImGui_AlignTextToFramePadding();
});

bind_fn("ImGui_GetTextLineHeight", []() -> float {
    return ImGui_GetTextLineHeight();
});

bind_fn("ImGui_GetTextLineHeightWithSpacing", []() -> float {
    return ImGui_GetTextLineHeightWithSpacing();
});

bind_fn("ImGui_GetFrameHeight", []() -> float {
    return ImGui_GetFrameHeight();
});

bind_fn("ImGui_GetFrameHeightWithSpacing", []() -> float {
    return ImGui_GetFrameHeightWithSpacing();
});

bind_fn("ImGui_PushID", [](std::string str_id) -> void {
    ImGui_PushID(str_id.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_PushIDInt", [](int int_id) -> void {
    ImGui_PushIDInt(int_id);
});

bind_fn("ImGui_PopID", []() -> void {
    ImGui_PopID();
});

bind_fn("ImGui_GetID", [](std::string str_id) -> ImGuiID {
    return ImGui_GetID(str_id.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_GetIDInt", [](int int_id) -> ImGuiID {
    return ImGui_GetIDInt(int_id);
});

bind_fn("ImGui_Text", [](std::string fmt){
    ImGui_TextUnformatted(fmt.c_str(), nullptr);
});
bind_fn("ImGui_TextColored", [](ImVec4 col, std::string fmt){
    ImGui_TextColored(col, "%s", fmt.c_str());
});
bind_fn("ImGui_TextDisabled", [](std::string fmt){
    ImGui_TextDisabled("%s", fmt.c_str());
});
bind_fn("ImGui_TextWrapped", [](std::string fmt){
    ImGui_TextWrapped("%s", fmt.c_str());
});
bind_fn("ImGui_LabelText", [](std::string label, std::string fmt){
    ImGui_LabelText(label.c_str(), "%s", fmt.c_str());
});
bind_fn("ImGui_BulletText", [](std::string fmt){
    ImGui_BulletText("%s", fmt.c_str());
});
bind_fn("ImGui_SeparatorText", [](std::string label) -> void {
    ImGui_SeparatorText(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_Button", [](std::string label, ImVec2 size) -> bool {
    return ImGui_Button(label.c_str(), size);
}, allow_raw_ptrs{});

bind_fn("ImGui_SmallButton", [](std::string label) -> bool {
    return ImGui_SmallButton(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_InvisibleButton", [](std::string str_id, ImVec2 size, ImGuiButtonFlags flags) -> bool {
    return ImGui_InvisibleButton(str_id.c_str(), size, flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_ArrowButton", [](std::string str_id, ImGuiDir dir) -> bool {
    return ImGui_ArrowButton(str_id.c_str(), dir);
}, allow_raw_ptrs{});

bind_fn("ImGui_Checkbox", [](std::string label, js_val v) -> bool {
    auto param_v = get_array_param<bool, 1>(v);
    auto const ret = ImGui_Checkbox(label.c_str(), param_v.ptr);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_CheckboxFlagsIntPtr", [](std::string label, js_val flags, int flags_value) -> bool {
    auto param_flags = get_array_param<int, 1>(flags);
    auto const ret = ImGui_CheckboxFlagsIntPtr(label.c_str(), param_flags.ptr, flags_value);
    write_back_array_param(param_flags, flags);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_CheckboxFlagsUintPtr", [](std::string label, js_val flags, unsigned int flags_value) -> bool {
    auto param_flags = get_array_param<unsigned int, 1>(flags);
    auto const ret = ImGui_CheckboxFlagsUintPtr(label.c_str(), param_flags.ptr, flags_value);
    write_back_array_param(param_flags, flags);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_RadioButton", [](std::string label, bool active) -> bool {
    return ImGui_RadioButton(label.c_str(), active);
}, allow_raw_ptrs{});

bind_fn("ImGui_RadioButtonIntPtr", [](std::string label, js_val v, int v_button) -> bool {
    auto param_v = get_array_param<int, 1>(v);
    auto const ret = ImGui_RadioButtonIntPtr(label.c_str(), param_v.ptr, v_button);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ProgressBar", [](float fraction, ImVec2 size_arg, std::string overlay) -> void {
    ImGui_ProgressBar(fraction, size_arg, overlay.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_Bullet", []() -> void {
    ImGui_Bullet();
});

bind_fn("ImGui_TextLink", [](std::string label) -> bool {
    return ImGui_TextLink(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_TextLinkOpenURL", [](std::string label, std::string url) -> bool {
    return ImGui_TextLinkOpenURL(label.c_str(), url.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_Image", [](ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1) -> void {
    ImGui_Image(tex_ref, image_size, uv0, uv1);
});

bind_fn("ImGui_ImageWithBg", [](ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col) -> void {
    ImGui_ImageWithBg(tex_ref, image_size, uv0, uv1, bg_col, tint_col);
});

bind_fn("ImGui_ImageButton", [](std::string str_id, ImTextureRef tex_ref, ImVec2 image_size, ImVec2 uv0, ImVec2 uv1, ImVec4 bg_col, ImVec4 tint_col) -> bool {
    return ImGui_ImageButton(str_id.c_str(), tex_ref, image_size, uv0, uv1, bg_col, tint_col);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginCombo", [](std::string label, std::string preview_value, ImGuiComboFlags flags) -> bool {
    return ImGui_BeginCombo(label.c_str(), preview_value.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_EndCombo", []() -> void {
    ImGui_EndCombo();
});

bind_fn("ImGui_Combo", [](std::string label, js_val current_item, std::string items_separated_by_zeros, int popup_max_height_in_items) -> bool {
    auto param_current_item = get_array_param<int, 1>(current_item);
    auto const ret = ImGui_Combo(label.c_str(), param_current_item.ptr, items_separated_by_zeros.c_str(), popup_max_height_in_items);
    write_back_array_param(param_current_item, current_item);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragFloat", [](std::string label, js_val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 1>(v);
    auto const ret = ImGui_DragFloat(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragFloat2", [](std::string label, js_val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 2>(v);
    auto const ret = ImGui_DragFloat2(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragFloat3", [](std::string label, js_val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 3>(v);
    auto const ret = ImGui_DragFloat3(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragFloat4", [](std::string label, js_val v, float v_speed, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 4>(v);
    auto const ret = ImGui_DragFloat4(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragFloatRange2", [](std::string label, js_val v_current_min, js_val v_current_max, float v_speed, float v_min, float v_max, std::string format, std::string format_max, ImGuiSliderFlags flags) -> bool {
    auto param_v_current_min = get_array_param<float, 1>(v_current_min);
    auto param_v_current_max = get_array_param<float, 1>(v_current_max);
    auto const ret = ImGui_DragFloatRange2(label.c_str(), param_v_current_min.ptr, param_v_current_max.ptr, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
    write_back_array_param(param_v_current_min, v_current_min);
    write_back_array_param(param_v_current_max, v_current_max);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragInt", [](std::string label, js_val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 1>(v);
    auto const ret = ImGui_DragInt(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragInt2", [](std::string label, js_val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 2>(v);
    auto const ret = ImGui_DragInt2(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragInt3", [](std::string label, js_val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 3>(v);
    auto const ret = ImGui_DragInt3(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragInt4", [](std::string label, js_val v, float v_speed, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 4>(v);
    auto const ret = ImGui_DragInt4(label.c_str(), param_v.ptr, v_speed, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DragIntRange2", [](std::string label, js_val v_current_min, js_val v_current_max, float v_speed, int v_min, int v_max, std::string format, std::string format_max, ImGuiSliderFlags flags) -> bool {
    auto param_v_current_min = get_array_param<int, 1>(v_current_min);
    auto param_v_current_max = get_array_param<int, 1>(v_current_max);
    auto const ret = ImGui_DragIntRange2(label.c_str(), param_v_current_min.ptr, param_v_current_max.ptr, v_speed, v_min, v_max, format.c_str(), format_max.c_str(), flags);
    write_back_array_param(param_v_current_min, v_current_min);
    write_back_array_param(param_v_current_max, v_current_max);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderFloat", [](std::string label, js_val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 1>(v);
    auto const ret = ImGui_SliderFloat(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderFloat2", [](std::string label, js_val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 2>(v);
    auto const ret = ImGui_SliderFloat2(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderFloat3", [](std::string label, js_val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 3>(v);
    auto const ret = ImGui_SliderFloat3(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderFloat4", [](std::string label, js_val v, float v_min, float v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<float, 4>(v);
    auto const ret = ImGui_SliderFloat4(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderAngle", [](std::string label, js_val v_rad, float v_degrees_min, float v_degrees_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v_rad = get_array_param<float, 1>(v_rad);
    auto const ret = ImGui_SliderAngle(label.c_str(), param_v_rad.ptr, v_degrees_min, v_degrees_max, format.c_str(), flags);
    write_back_array_param(param_v_rad, v_rad);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderInt", [](std::string label, js_val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 1>(v);
    auto const ret = ImGui_SliderInt(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderInt2", [](std::string label, js_val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 2>(v);
    auto const ret = ImGui_SliderInt2(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderInt3", [](std::string label, js_val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 3>(v);
    auto const ret = ImGui_SliderInt3(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SliderInt4", [](std::string label, js_val v, int v_min, int v_max, std::string format, ImGuiSliderFlags flags) -> bool {
    auto param_v = get_array_param<int, 4>(v);
    auto const ret = ImGui_SliderInt4(label.c_str(), param_v.ptr, v_min, v_max, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputText", [](std::string label, js_val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto _bind_buf = buf[0].as<std::string>();
    _bind_buf.reserve(buf_size);
    auto const ret = ImGui_InputText(label.c_str(), _bind_buf.data(), buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(_bind_buf.data()));
    return ret;
});
bind_fn("ImGui_InputTextMultiline", [](std::string label, js_val buf, size_t buf_size, ImVec2 size, ImGuiInputTextFlags flags){
    auto _bind_buf = buf[0].as<std::string>();
    _bind_buf.reserve(buf_size);
    auto const ret = ImGui_InputTextMultiline(label.c_str(), _bind_buf.data(), buf_size, size, flags, nullptr, nullptr);
    buf.set(0, std::string(_bind_buf.data()));
    return ret;
});
bind_fn("ImGui_InputTextWithHint", [](std::string label, std::string hint, js_val buf, size_t buf_size, ImGuiInputTextFlags flags){
    auto _bind_buf = buf[0].as<std::string>();
    _bind_buf.reserve(buf_size);
    auto const ret = ImGui_InputTextWithHint(label.c_str(), hint.c_str(), _bind_buf.data(), buf_size, flags, nullptr, nullptr);
    buf.set(0, std::string(_bind_buf.data()));
    return ret;
});
bind_fn("ImGui_InputFloat", [](std::string label, js_val v, float step, float step_fast, std::string format, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<float, 1>(v);
    auto const ret = ImGui_InputFloat(label.c_str(), param_v.ptr, step, step_fast, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputFloat2", [](std::string label, js_val v, std::string format, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<float, 2>(v);
    auto const ret = ImGui_InputFloat2(label.c_str(), param_v.ptr, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputFloat3", [](std::string label, js_val v, std::string format, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<float, 3>(v);
    auto const ret = ImGui_InputFloat3(label.c_str(), param_v.ptr, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputFloat4", [](std::string label, js_val v, std::string format, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<float, 4>(v);
    auto const ret = ImGui_InputFloat4(label.c_str(), param_v.ptr, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputInt", [](std::string label, js_val v, int step, int step_fast, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<int, 1>(v);
    auto const ret = ImGui_InputInt(label.c_str(), param_v.ptr, step, step_fast, flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputInt2", [](std::string label, js_val v, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<int, 2>(v);
    auto const ret = ImGui_InputInt2(label.c_str(), param_v.ptr, flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputInt3", [](std::string label, js_val v, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<int, 3>(v);
    auto const ret = ImGui_InputInt3(label.c_str(), param_v.ptr, flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputInt4", [](std::string label, js_val v, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<int, 4>(v);
    auto const ret = ImGui_InputInt4(label.c_str(), param_v.ptr, flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_InputDouble", [](std::string label, js_val v, double step, double step_fast, std::string format, ImGuiInputTextFlags flags) -> bool {
    auto param_v = get_array_param<double, 1>(v);
    auto const ret = ImGui_InputDouble(label.c_str(), param_v.ptr, step, step_fast, format.c_str(), flags);
    write_back_array_param(param_v, v);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorEdit3", [](std::string label, js_val col, ImGuiColorEditFlags flags) -> bool {
    auto param_col = get_array_param<float, 3>(col);
    auto const ret = ImGui_ColorEdit3(label.c_str(), param_col.ptr, flags);
    write_back_array_param(param_col, col);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorEdit4", [](std::string label, js_val col, ImGuiColorEditFlags flags) -> bool {
    auto param_col = get_array_param<float, 4>(col);
    auto const ret = ImGui_ColorEdit4(label.c_str(), param_col.ptr, flags);
    write_back_array_param(param_col, col);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorPicker3", [](std::string label, js_val col, ImGuiColorEditFlags flags) -> bool {
    auto param_col = get_array_param<float, 3>(col);
    auto const ret = ImGui_ColorPicker3(label.c_str(), param_col.ptr, flags);
    write_back_array_param(param_col, col);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorPicker4", [](std::string label, js_val col, ImGuiColorEditFlags flags, js_val ref_col) -> bool {
    auto param_col = get_array_param<float, 4>(col);
    auto param_ref_col = get_array_param<float, 1>(ref_col);
    auto const ret = ImGui_ColorPicker4(label.c_str(), param_col.ptr, flags, param_ref_col.ptr);
    write_back_array_param(param_col, col);
    write_back_array_param(param_ref_col, ref_col);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorButton", [](std::string desc_id, ImVec4 col, ImGuiColorEditFlags flags, ImVec2 size) -> bool {
    return ImGui_ColorButton(desc_id.c_str(), col, flags, size);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetColorEditOptions", [](ImGuiColorEditFlags flags) -> void {
    ImGui_SetColorEditOptions(flags);
});

bind_fn("ImGui_TreeNode", [](std::string label) -> bool {
    return ImGui_TreeNode(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_TreeNodeEx", [](std::string label, ImGuiTreeNodeFlags flags) -> bool {
    return ImGui_TreeNodeEx(label.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_TreePush", [](std::string str_id) -> void {
    ImGui_TreePush(str_id.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_TreePop", []() -> void {
    ImGui_TreePop();
});

bind_fn("ImGui_GetTreeNodeToLabelSpacing", []() -> float {
    return ImGui_GetTreeNodeToLabelSpacing();
});

bind_fn("ImGui_CollapsingHeader", [](std::string label, ImGuiTreeNodeFlags flags) -> bool {
    return ImGui_CollapsingHeader(label.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_CollapsingHeaderBoolPtr", [](std::string label, js_val p_visible, ImGuiTreeNodeFlags flags) -> bool {
    auto param_p_visible = get_array_param<bool, 1>(p_visible);
    auto const ret = ImGui_CollapsingHeaderBoolPtr(label.c_str(), param_p_visible.ptr, flags);
    write_back_array_param(param_p_visible, p_visible);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_SetNextItemOpen", [](bool is_open, ImGuiCond cond) -> void {
    ImGui_SetNextItemOpen(is_open, cond);
});

bind_fn("ImGui_SetNextItemStorageID", [](ImGuiID storage_id) -> void {
    ImGui_SetNextItemStorageID(storage_id);
});

bind_fn("ImGui_TreeNodeGetOpen", [](ImGuiID storage_id) -> bool {
    return ImGui_TreeNodeGetOpen(storage_id);
});

bind_fn("ImGui_Selectable", [](std::string label, bool selected, ImGuiSelectableFlags flags, ImVec2 size) -> bool {
    return ImGui_Selectable(label.c_str(), selected, flags, size);
}, allow_raw_ptrs{});

bind_fn("ImGui_SelectableBoolPtr", [](std::string label, js_val p_selected, ImGuiSelectableFlags flags, ImVec2 size) -> bool {
    auto param_p_selected = get_array_param<bool, 1>(p_selected);
    auto const ret = ImGui_SelectableBoolPtr(label.c_str(), param_p_selected.ptr, flags, size);
    write_back_array_param(param_p_selected, p_selected);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginMultiSelect", [](ImGuiMultiSelectFlags flags, int selection_size, int items_count) -> ImGuiMultiSelectIO* {
    return ImGui_BeginMultiSelect(flags, selection_size, items_count);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_EndMultiSelect", []() -> ImGuiMultiSelectIO* {
    return ImGui_EndMultiSelect();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_SetNextItemSelectionUserData", [](ImGuiSelectionUserData selection_user_data) -> void {
    ImGui_SetNextItemSelectionUserData(selection_user_data);
});

bind_fn("ImGui_IsItemToggledSelection", []() -> bool {
    return ImGui_IsItemToggledSelection();
});

bind_fn("ImGui_BeginListBox", [](std::string label, ImVec2 size) -> bool {
    return ImGui_BeginListBox(label.c_str(), size);
}, allow_raw_ptrs{});

bind_fn("ImGui_EndListBox", []() -> void {
    ImGui_EndListBox();
});

bind_fn("ImGui_PlotLines", [](std::string label, js_val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size, int stride) -> void {
    auto param_values = get_array_param<float, 1>(values);
    ImGui_PlotLines(label.c_str(), param_values.ptr, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, stride);
    write_back_array_param(param_values, values);
}, allow_raw_ptrs{});

bind_fn("ImGui_PlotHistogram", [](std::string label, js_val values, int values_count, int values_offset, std::string overlay_text, float scale_min, float scale_max, ImVec2 graph_size, int stride) -> void {
    auto param_values = get_array_param<float, 1>(values);
    ImGui_PlotHistogram(label.c_str(), param_values.ptr, values_count, values_offset, overlay_text.c_str(), scale_min, scale_max, graph_size, stride);
    write_back_array_param(param_values, values);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginMenuBar", []() -> bool {
    return ImGui_BeginMenuBar();
});

bind_fn("ImGui_EndMenuBar", []() -> void {
    ImGui_EndMenuBar();
});

bind_fn("ImGui_BeginMainMenuBar", []() -> bool {
    return ImGui_BeginMainMenuBar();
});

bind_fn("ImGui_EndMainMenuBar", []() -> void {
    ImGui_EndMainMenuBar();
});

bind_fn("ImGui_BeginMenu", [](std::string label, bool enabled) -> bool {
    return ImGui_BeginMenu(label.c_str(), enabled);
}, allow_raw_ptrs{});

bind_fn("ImGui_EndMenu", []() -> void {
    ImGui_EndMenu();
});

bind_fn("ImGui_MenuItem", [](std::string label, std::string shortcut, bool selected, bool enabled) -> bool {
    return ImGui_MenuItem(label.c_str(), shortcut.c_str(), selected, enabled);
}, allow_raw_ptrs{});

bind_fn("ImGui_MenuItemBoolPtr", [](std::string label, std::string shortcut, js_val p_selected, bool enabled) -> bool {
    auto param_p_selected = get_array_param<bool, 1>(p_selected);
    auto const ret = ImGui_MenuItemBoolPtr(label.c_str(), shortcut.c_str(), param_p_selected.ptr, enabled);
    write_back_array_param(param_p_selected, p_selected);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginTooltip", []() -> bool {
    return ImGui_BeginTooltip();
});

bind_fn("ImGui_EndTooltip", []() -> void {
    ImGui_EndTooltip();
});

bind_fn("ImGui_SetTooltip", [](std::string fmt){
    ImGui_SetTooltip("%s", fmt.c_str());
});
bind_fn("ImGui_BeginItemTooltip", []() -> bool {
    return ImGui_BeginItemTooltip();
});

bind_fn("ImGui_SetItemTooltip", [](std::string fmt){
    ImGui_SetItemTooltip("%s", fmt.c_str());
});
bind_fn("ImGui_BeginPopup", [](std::string str_id, ImGuiWindowFlags flags) -> bool {
    return ImGui_BeginPopup(str_id.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginPopupModal", [](std::string name, js_val p_open, ImGuiWindowFlags flags) -> bool {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    auto const ret = ImGui_BeginPopupModal(name.c_str(), param_p_open.ptr, flags);
    write_back_array_param(param_p_open, p_open);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_EndPopup", []() -> void {
    ImGui_EndPopup();
});

bind_fn("ImGui_OpenPopup", [](std::string str_id, ImGuiPopupFlags popup_flags) -> void {
    ImGui_OpenPopup(str_id.c_str(), popup_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_OpenPopupID", [](ImGuiID id, ImGuiPopupFlags popup_flags) -> void {
    ImGui_OpenPopupID(id, popup_flags);
});

bind_fn("ImGui_OpenPopupOnItemClick", [](std::string str_id, ImGuiPopupFlags popup_flags) -> void {
    ImGui_OpenPopupOnItemClick(str_id.c_str(), popup_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_CloseCurrentPopup", []() -> void {
    ImGui_CloseCurrentPopup();
});

bind_fn("ImGui_BeginPopupContextItem", [](std::string str_id, ImGuiPopupFlags popup_flags) -> bool {
    return ImGui_BeginPopupContextItem(str_id.c_str(), popup_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginPopupContextWindow", [](std::string str_id, ImGuiPopupFlags popup_flags) -> bool {
    return ImGui_BeginPopupContextWindow(str_id.c_str(), popup_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginPopupContextVoid", [](std::string str_id, ImGuiPopupFlags popup_flags) -> bool {
    return ImGui_BeginPopupContextVoid(str_id.c_str(), popup_flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_IsPopupOpen", [](std::string str_id, ImGuiPopupFlags flags) -> bool {
    return ImGui_IsPopupOpen(str_id.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_BeginTable", [](std::string str_id, int columns, ImGuiTableFlags flags, ImVec2 outer_size, float inner_width) -> bool {
    return ImGui_BeginTable(str_id.c_str(), columns, flags, outer_size, inner_width);
}, allow_raw_ptrs{});

bind_fn("ImGui_EndTable", []() -> void {
    ImGui_EndTable();
});

bind_fn("ImGui_TableNextRow", [](ImGuiTableRowFlags row_flags, float min_row_height) -> void {
    ImGui_TableNextRow(row_flags, min_row_height);
});

bind_fn("ImGui_TableNextColumn", []() -> bool {
    return ImGui_TableNextColumn();
});

bind_fn("ImGui_TableSetColumnIndex", [](int column_n) -> bool {
    return ImGui_TableSetColumnIndex(column_n);
});

bind_fn("ImGui_TableSetupColumn", [](std::string label, ImGuiTableColumnFlags flags, float init_width_or_weight, ImGuiID user_id) -> void {
    ImGui_TableSetupColumn(label.c_str(), flags, init_width_or_weight, user_id);
}, allow_raw_ptrs{});

bind_fn("ImGui_TableSetupScrollFreeze", [](int cols, int rows) -> void {
    ImGui_TableSetupScrollFreeze(cols, rows);
});

bind_fn("ImGui_TableHeader", [](std::string label) -> void {
    ImGui_TableHeader(label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_TableHeadersRow", []() -> void {
    ImGui_TableHeadersRow();
});

bind_fn("ImGui_TableAngledHeadersRow", []() -> void {
    ImGui_TableAngledHeadersRow();
});

bind_fn("ImGui_TableGetSortSpecs", []() -> ImGuiTableSortSpecs* {
    return ImGui_TableGetSortSpecs();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_TableGetColumnCount", []() -> int {
    return ImGui_TableGetColumnCount();
});

bind_fn("ImGui_TableGetColumnIndex", []() -> int {
    return ImGui_TableGetColumnIndex();
});

bind_fn("ImGui_TableGetRowIndex", []() -> int {
    return ImGui_TableGetRowIndex();
});

bind_fn("ImGui_TableGetColumnName", [](int column_n) -> std::string {
    return ImGui_TableGetColumnName(column_n);
});

bind_fn("ImGui_TableGetColumnFlags", [](int column_n) -> ImGuiTableColumnFlags {
    return ImGui_TableGetColumnFlags(column_n);
});

bind_fn("ImGui_TableSetColumnEnabled", [](int column_n, bool v) -> void {
    ImGui_TableSetColumnEnabled(column_n, v);
});

bind_fn("ImGui_TableGetHoveredColumn", []() -> int {
    return ImGui_TableGetHoveredColumn();
});

bind_fn("ImGui_TableSetBgColor", [](ImGuiTableBgTarget target, ImU32 color, int column_n) -> void {
    ImGui_TableSetBgColor(target, color, column_n);
});

bind_fn("ImGui_Columns", [](int count, std::string id, bool borders) -> void {
    ImGui_Columns(count, id.c_str(), borders);
}, allow_raw_ptrs{});

bind_fn("ImGui_NextColumn", []() -> void {
    ImGui_NextColumn();
});

bind_fn("ImGui_GetColumnIndex", []() -> int {
    return ImGui_GetColumnIndex();
});

bind_fn("ImGui_GetColumnWidth", [](int column_index) -> float {
    return ImGui_GetColumnWidth(column_index);
});

bind_fn("ImGui_SetColumnWidth", [](int column_index, float width) -> void {
    ImGui_SetColumnWidth(column_index, width);
});

bind_fn("ImGui_GetColumnOffset", [](int column_index) -> float {
    return ImGui_GetColumnOffset(column_index);
});

bind_fn("ImGui_SetColumnOffset", [](int column_index, float offset_x) -> void {
    ImGui_SetColumnOffset(column_index, offset_x);
});

bind_fn("ImGui_GetColumnsCount", []() -> int {
    return ImGui_GetColumnsCount();
});

bind_fn("ImGui_BeginTabBar", [](std::string str_id, ImGuiTabBarFlags flags) -> bool {
    return ImGui_BeginTabBar(str_id.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_EndTabBar", []() -> void {
    ImGui_EndTabBar();
});

bind_fn("ImGui_BeginTabItem", [](std::string label, js_val p_open, ImGuiTabItemFlags flags) -> bool {
    auto param_p_open = get_array_param<bool, 1>(p_open);
    auto const ret = ImGui_BeginTabItem(label.c_str(), param_p_open.ptr, flags);
    write_back_array_param(param_p_open, p_open);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_EndTabItem", []() -> void {
    ImGui_EndTabItem();
});

bind_fn("ImGui_TabItemButton", [](std::string label, ImGuiTabItemFlags flags) -> bool {
    return ImGui_TabItemButton(label.c_str(), flags);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetTabItemClosed", [](std::string tab_or_docked_window_label) -> void {
    ImGui_SetTabItemClosed(tab_or_docked_window_label.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_DockSpace", [](ImGuiID dockspace_id, ImVec2 size, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class) -> ImGuiID {
    return ImGui_DockSpace(dockspace_id, size, flags, window_class);
}, allow_raw_ptrs{});

bind_fn("ImGui_DockSpaceOverViewport", [](ImGuiID dockspace_id, const ImGuiViewport* viewport, ImGuiDockNodeFlags flags, const ImGuiWindowClass* window_class) -> ImGuiID {
    return ImGui_DockSpaceOverViewport(dockspace_id, viewport, flags, window_class);
}, allow_raw_ptrs{});

bind_fn("ImGui_SetNextWindowDockID", [](ImGuiID dock_id, ImGuiCond cond) -> void {
    ImGui_SetNextWindowDockID(dock_id, cond);
});

bind_fn("ImGui_SetNextWindowClass", [](const ImGuiWindowClass* window_class) -> void {
    ImGui_SetNextWindowClass(window_class);
}, allow_raw_ptrs{});

bind_fn("ImGui_GetWindowDockID", []() -> ImGuiID {
    return ImGui_GetWindowDockID();
});

bind_fn("ImGui_IsWindowDocked", []() -> bool {
    return ImGui_IsWindowDocked();
});

bind_fn("ImGui_LogToTTY", [](int auto_open_depth) -> void {
    ImGui_LogToTTY(auto_open_depth);
});

bind_fn("ImGui_LogToFile", [](int auto_open_depth, std::string filename) -> void {
    ImGui_LogToFile(auto_open_depth, filename.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_LogToClipboard", [](int auto_open_depth) -> void {
    ImGui_LogToClipboard(auto_open_depth);
});

bind_fn("ImGui_LogFinish", []() -> void {
    ImGui_LogFinish();
});

bind_fn("ImGui_LogButtons", []() -> void {
    ImGui_LogButtons();
});

bind_fn("ImGui_LogText", [](std::string fmt){
    ImGui_LogText("%s", fmt.c_str());
});
bind_fn("ImGui_BeginDragDropSource", [](ImGuiDragDropFlags flags) -> bool {
    return ImGui_BeginDragDropSource(flags);
});

bind_fn("ImGui_SetDragDropPayload", [](std::string type, std::string data, size_t sz, ImGuiCond cond){
    return ImGui_SetDragDropPayload(type.c_str(), data.data(), sz, cond);
});
bind_fn("ImGui_EndDragDropSource", []() -> void {
    ImGui_EndDragDropSource();
});

bind_fn("ImGui_BeginDragDropTarget", []() -> bool {
    return ImGui_BeginDragDropTarget();
});

bind_fn("ImGui_AcceptDragDropPayload", [](std::string type, ImGuiDragDropFlags flags) -> const ImGuiPayload* {
    return ImGui_AcceptDragDropPayload(type.c_str(), flags);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_EndDragDropTarget", []() -> void {
    ImGui_EndDragDropTarget();
});

bind_fn("ImGui_GetDragDropPayload", []() -> const ImGuiPayload* {
    return ImGui_GetDragDropPayload();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_BeginDisabled", [](bool disabled) -> void {
    ImGui_BeginDisabled(disabled);
});

bind_fn("ImGui_EndDisabled", []() -> void {
    ImGui_EndDisabled();
});

bind_fn("ImGui_PushClipRect", [](ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect) -> void {
    ImGui_PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
});

bind_fn("ImGui_PopClipRect", []() -> void {
    ImGui_PopClipRect();
});

bind_fn("ImGui_SetItemDefaultFocus", []() -> void {
    ImGui_SetItemDefaultFocus();
});

bind_fn("ImGui_SetKeyboardFocusHere", [](int offset) -> void {
    ImGui_SetKeyboardFocusHere(offset);
});

bind_fn("ImGui_SetNavCursorVisible", [](bool visible) -> void {
    ImGui_SetNavCursorVisible(visible);
});

bind_fn("ImGui_SetNextItemAllowOverlap", []() -> void {
    ImGui_SetNextItemAllowOverlap();
});

bind_fn("ImGui_IsItemHovered", [](ImGuiHoveredFlags flags) -> bool {
    return ImGui_IsItemHovered(flags);
});

bind_fn("ImGui_IsItemActive", []() -> bool {
    return ImGui_IsItemActive();
});

bind_fn("ImGui_IsItemFocused", []() -> bool {
    return ImGui_IsItemFocused();
});

bind_fn("ImGui_IsItemClicked", [](ImGuiMouseButton mouse_button) -> bool {
    return ImGui_IsItemClicked(mouse_button);
});

bind_fn("ImGui_IsItemVisible", []() -> bool {
    return ImGui_IsItemVisible();
});

bind_fn("ImGui_IsItemEdited", []() -> bool {
    return ImGui_IsItemEdited();
});

bind_fn("ImGui_IsItemActivated", []() -> bool {
    return ImGui_IsItemActivated();
});

bind_fn("ImGui_IsItemDeactivated", []() -> bool {
    return ImGui_IsItemDeactivated();
});

bind_fn("ImGui_IsItemDeactivatedAfterEdit", []() -> bool {
    return ImGui_IsItemDeactivatedAfterEdit();
});

bind_fn("ImGui_IsItemToggledOpen", []() -> bool {
    return ImGui_IsItemToggledOpen();
});

bind_fn("ImGui_IsAnyItemHovered", []() -> bool {
    return ImGui_IsAnyItemHovered();
});

bind_fn("ImGui_IsAnyItemActive", []() -> bool {
    return ImGui_IsAnyItemActive();
});

bind_fn("ImGui_IsAnyItemFocused", []() -> bool {
    return ImGui_IsAnyItemFocused();
});

bind_fn("ImGui_GetItemID", []() -> ImGuiID {
    return ImGui_GetItemID();
});

bind_fn("ImGui_GetItemRectMin", []() -> ImVec2 {
    return ImGui_GetItemRectMin();
});

bind_fn("ImGui_GetItemRectMax", []() -> ImVec2 {
    return ImGui_GetItemRectMax();
});

bind_fn("ImGui_GetItemRectSize", []() -> ImVec2 {
    return ImGui_GetItemRectSize();
});

bind_fn("ImGui_GetItemFlags", []() -> ImGuiItemFlags {
    return ImGui_GetItemFlags();
});

bind_fn("ImGui_GetMainViewport", []() -> ImGuiViewport* {
    return ImGui_GetMainViewport();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetBackgroundDrawList", [](ImGuiViewport* viewport) -> ImDrawList* {
    return ImGui_GetBackgroundDrawList(viewport);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetForegroundDrawList", [](ImGuiViewport* viewport) -> ImDrawList* {
    return ImGui_GetForegroundDrawList(viewport);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_IsRectVisibleBySize", [](ImVec2 size) -> bool {
    return ImGui_IsRectVisibleBySize(size);
});

bind_fn("ImGui_IsRectVisible", [](ImVec2 rect_min, ImVec2 rect_max) -> bool {
    return ImGui_IsRectVisible(rect_min, rect_max);
});

bind_fn("ImGui_GetTime", []() -> double {
    return ImGui_GetTime();
});

bind_fn("ImGui_GetFrameCount", []() -> int {
    return ImGui_GetFrameCount();
});

bind_fn("ImGui_GetDrawListSharedData", []() -> ImDrawListSharedData* {
    return ImGui_GetDrawListSharedData();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_GetStyleColorName", [](ImGuiCol idx) -> std::string {
    return ImGui_GetStyleColorName(idx);
});

bind_fn("ImGui_CalcTextSize", [](std::string text, std::string text_end, bool hide_text_after_double_hash, float wrap_width) -> ImVec2 {
    return ImGui_CalcTextSize(text.c_str(), text_end.c_str(), hide_text_after_double_hash, wrap_width);
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorConvertU32ToFloat4", [](ImU32 in) -> ImVec4 {
    return ImGui_ColorConvertU32ToFloat4(in);
});

bind_fn("ImGui_ColorConvertFloat4ToU32", [](ImVec4 in) -> ImU32 {
    return ImGui_ColorConvertFloat4ToU32(in);
});

bind_fn("ImGui_ColorConvertRGBtoHSV", [](float r, float g, float b, js_val out_h, js_val out_s, js_val out_v) -> void {
    auto param_out_h = get_array_param<float, 1>(out_h);
    auto param_out_s = get_array_param<float, 1>(out_s);
    auto param_out_v = get_array_param<float, 1>(out_v);
    ImGui_ColorConvertRGBtoHSV(r, g, b, param_out_h.ptr, param_out_s.ptr, param_out_v.ptr);
    write_back_array_param(param_out_h, out_h);
    write_back_array_param(param_out_s, out_s);
    write_back_array_param(param_out_v, out_v);
}, allow_raw_ptrs{});

bind_fn("ImGui_ColorConvertHSVtoRGB", [](float h, float s, float v, js_val out_r, js_val out_g, js_val out_b) -> void {
    auto param_out_r = get_array_param<float, 1>(out_r);
    auto param_out_g = get_array_param<float, 1>(out_g);
    auto param_out_b = get_array_param<float, 1>(out_b);
    ImGui_ColorConvertHSVtoRGB(h, s, v, param_out_r.ptr, param_out_g.ptr, param_out_b.ptr);
    write_back_array_param(param_out_r, out_r);
    write_back_array_param(param_out_g, out_g);
    write_back_array_param(param_out_b, out_b);
}, allow_raw_ptrs{});

bind_fn("ImGui_IsKeyDown", [](ImGuiKey key) -> bool {
    return ImGui_IsKeyDown(key);
});

bind_fn("ImGui_IsKeyPressed", [](ImGuiKey key, bool repeat) -> bool {
    return ImGui_IsKeyPressed(key, repeat);
});

bind_fn("ImGui_IsKeyReleased", [](ImGuiKey key) -> bool {
    return ImGui_IsKeyReleased(key);
});

bind_fn("ImGui_IsKeyChordPressed", [](ImGuiKeyChord key_chord) -> bool {
    return ImGui_IsKeyChordPressed(key_chord);
});

bind_fn("ImGui_GetKeyPressedAmount", [](ImGuiKey key, float repeat_delay, float rate) -> int {
    return ImGui_GetKeyPressedAmount(key, repeat_delay, rate);
});

bind_fn("ImGui_GetKeyName", [](ImGuiKey key) -> std::string {
    return ImGui_GetKeyName(key);
});

bind_fn("ImGui_SetNextFrameWantCaptureKeyboard", [](bool want_capture_keyboard) -> void {
    ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard);
});

bind_fn("ImGui_Shortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags) -> bool {
    return ImGui_Shortcut(key_chord, flags);
});

bind_fn("ImGui_SetNextItemShortcut", [](ImGuiKeyChord key_chord, ImGuiInputFlags flags) -> void {
    ImGui_SetNextItemShortcut(key_chord, flags);
});

bind_fn("ImGui_SetItemKeyOwner", [](ImGuiKey key) -> void {
    ImGui_SetItemKeyOwner(key);
});

bind_fn("ImGui_IsMouseDown", [](ImGuiMouseButton button) -> bool {
    return ImGui_IsMouseDown(button);
});

bind_fn("ImGui_IsMouseClicked", [](ImGuiMouseButton button, bool repeat) -> bool {
    return ImGui_IsMouseClicked(button, repeat);
});

bind_fn("ImGui_IsMouseReleased", [](ImGuiMouseButton button) -> bool {
    return ImGui_IsMouseReleased(button);
});

bind_fn("ImGui_IsMouseDoubleClicked", [](ImGuiMouseButton button) -> bool {
    return ImGui_IsMouseDoubleClicked(button);
});

bind_fn("ImGui_IsMouseReleasedWithDelay", [](ImGuiMouseButton button, float delay) -> bool {
    return ImGui_IsMouseReleasedWithDelay(button, delay);
});

bind_fn("ImGui_GetMouseClickedCount", [](ImGuiMouseButton button) -> int {
    return ImGui_GetMouseClickedCount(button);
});

bind_fn("ImGui_IsMouseHoveringRect", [](ImVec2 r_min, ImVec2 r_max, bool clip) -> bool {
    return ImGui_IsMouseHoveringRect(r_min, r_max, clip);
});

bind_fn("ImGui_IsMousePosValid", [](const ImVec2* mouse_pos) -> bool {
    return ImGui_IsMousePosValid(mouse_pos);
}, allow_raw_ptrs{});

bind_fn("ImGui_IsAnyMouseDown", []() -> bool {
    return ImGui_IsAnyMouseDown();
});

bind_fn("ImGui_GetMousePos", []() -> ImVec2 {
    return ImGui_GetMousePos();
});

bind_fn("ImGui_GetMousePosOnOpeningCurrentPopup", []() -> ImVec2 {
    return ImGui_GetMousePosOnOpeningCurrentPopup();
});

bind_fn("ImGui_IsMouseDragging", [](ImGuiMouseButton button, float lock_threshold) -> bool {
    return ImGui_IsMouseDragging(button, lock_threshold);
});

bind_fn("ImGui_GetMouseDragDelta", [](ImGuiMouseButton button, float lock_threshold) -> ImVec2 {
    return ImGui_GetMouseDragDelta(button, lock_threshold);
});

bind_fn("ImGui_ResetMouseDragDelta", [](ImGuiMouseButton button) -> void {
    ImGui_ResetMouseDragDelta(button);
});

bind_fn("ImGui_GetMouseCursor", []() -> ImGuiMouseCursor {
    return ImGui_GetMouseCursor();
});

bind_fn("ImGui_SetMouseCursor", [](ImGuiMouseCursor cursor_type) -> void {
    ImGui_SetMouseCursor(cursor_type);
});

bind_fn("ImGui_SetNextFrameWantCaptureMouse", [](bool want_capture_mouse) -> void {
    ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse);
});

bind_fn("ImGui_GetClipboardText", []() -> std::string {
    return ImGui_GetClipboardText();
});

bind_fn("ImGui_SetClipboardText", [](std::string text) -> void {
    ImGui_SetClipboardText(text.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_LoadIniSettingsFromMemory", [](std::string ini_data, size_t ini_size) -> void {
    ImGui_LoadIniSettingsFromMemory(ini_data.c_str(), ini_size);
}, allow_raw_ptrs{});

bind_fn("ImGui_SaveIniSettingsToMemory", [](js_val out_ini_size) -> std::string {
    auto param_out_ini_size = get_array_param<size_t, 1>(out_ini_size);
    auto const ret = ImGui_SaveIniSettingsToMemory(param_out_ini_size.ptr);
    write_back_array_param(param_out_ini_size, out_ini_size);
    return ret;
}, allow_raw_ptrs{});

bind_fn("ImGui_DebugTextEncoding", [](std::string text) -> void {
    ImGui_DebugTextEncoding(text.c_str());
}, allow_raw_ptrs{});

bind_fn("ImGui_DebugFlashStyleColor", [](ImGuiCol idx) -> void {
    ImGui_DebugFlashStyleColor(idx);
});

bind_fn("ImGui_DebugStartItemPicker", []() -> void {
    ImGui_DebugStartItemPicker();
});

bind_fn("ImGui_DebugCheckVersionAndDataLayout", [](std::string version_str, size_t sz_io, size_t sz_style, size_t sz_vec2, size_t sz_vec4, size_t sz_drawvert, size_t sz_drawidx) -> bool {
    return ImGui_DebugCheckVersionAndDataLayout(version_str.c_str(), sz_io, sz_style, sz_vec2, sz_vec4, sz_drawvert, sz_drawidx);
}, allow_raw_ptrs{});

bind_fn("ImGui_DebugLog", [](std::string fmt){
    ImGui_DebugLog("%s", fmt.c_str());
});
bind_fn("ImGui_UpdatePlatformWindows", []() -> void {
    ImGui_UpdatePlatformWindows();
});

bind_fn("ImGui_RenderPlatformWindowsDefault", [](void* platform_render_arg, void* renderer_render_arg) -> void {
    ImGui_RenderPlatformWindowsDefault(platform_render_arg, renderer_render_arg);
}, allow_raw_ptrs{});

bind_fn("ImGui_DestroyPlatformWindows", []() -> void {
    ImGui_DestroyPlatformWindows();
});

bind_fn("ImGui_FindViewportByID", [](ImGuiID viewport_id) -> ImGuiViewport* {
    return ImGui_FindViewportByID(viewport_id);
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImGui_FindViewportByPlatformHandle", [](void* platform_handle) -> ImGuiViewport* {
    return ImGui_FindViewportByPlatformHandle(platform_handle);
}, rvp_ref{}, allow_raw_ptrs{});

}

