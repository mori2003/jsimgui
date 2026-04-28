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
 requires std::is_invocable_v<Fn> && std::is_same_v<std::invoke_result_t<Fn>, void>
struct bindings : emscripten::internal::InitFunc {
    explicit bindings(Fn&& fn) : InitFunc(std::forward<Fn>(std::move(fn))) {}
};

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

static auto const WEB = bindings([]() {
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
});

static auto const WEBGL = bindings([]() {
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
});

static auto const WEBGPU = bindings([]() {
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
});

// MARKER: Generated ImGui bindings will be inserted here.
