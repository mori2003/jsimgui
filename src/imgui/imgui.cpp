#include <util.hpp>

#include <dcimgui.h>
#include <dcimgui_internal.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_impl_wgpu.h>

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

// MARKER: Generated ImGui bindings will be inserted here.
