#include <cstddef>
#include <cstdint>
#include <malloc.h>
#include <string>
#include <utility>
#include <vector>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_impl_wgpu.h>
#include <dcimgui_internal.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include <emscripten/heap.h>
#include <emscripten/stack.h>

#include <emscripten/html5_webgl.h>
#include <emscripten/html5_webgpu.h>
#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

using JsVal = emscripten::val;

namespace {

constexpr auto allow_ptr() -> emscripten::allow_raw_pointers {
    return {};
}

constexpr auto rvp_ref() -> emscripten::return_value_policy::reference {
    return {};
}

template <typename Fn>
constexpr auto override(Fn&& fn) {
    return emscripten::optional_override(std::forward<Fn>(fn));
}

template <typename Fn, typename... Policies>
constexpr auto bind_fn(const char* name, Fn&& func, Policies&&... policies) -> void {
    return emscripten::function(
        name,
        emscripten::optional_override(std::forward<Fn>(func)),
        std::forward<Policies>(policies)...
    );
}

template <typename T>
constexpr auto bind_struct(const char* name) -> emscripten::class_<T> {
    return emscripten::class_<T>(name);
}

template <typename T>
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

template <>
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

auto get_imvec2(JsVal const& val) -> ImVec2_t {
    return ImVec2_t{
        .x = val["x"].as<float>(),
        .y = val["y"].as<float>(),
    };
}

auto wrap_imvec2(ImVec2_t const& val) -> JsVal {
    auto obj = JsVal::object();
    obj.set("x", val.x);
    obj.set("y", val.y);
    return obj;
}

auto get_imvec4(JsVal const& val) -> ImVec4_t {
    return ImVec4_t{
        .x = val["x"].as<float>(),
        .y = val["y"].as<float>(),
        .z = val["z"].as<float>(),
        .w = val["w"].as<float>(),
    };
}

auto wrap_imvec4(ImVec4_t const& val) -> JsVal {
    auto obj = JsVal::object();
    obj.set("x", val.x);
    obj.set("y", val.y);
    obj.set("z", val.z);
    obj.set("w", val.w);
    return obj;
}

auto get_imtexture_ref(JsVal const& val) -> ImTextureRef {
    return ImTextureRef{
        ._TexID = val["_TexID"].as<ImTextureID>(),
    };
}

auto wrap_imtexture_ref(ImTextureRef const& val) -> JsVal {
    auto obj = JsVal::object();
    obj.set("_TexID", val._TexID);
    return obj;
}

auto get_clipboard_fn = emscripten::val::null();
auto set_clipboard_fn = emscripten::val::null();

auto get_clipboard_text(ImGuiContext* /*ctx*/) -> const char* {
    static auto text = std::string();
    text = get_clipboard_fn().as<std::string>();
    return text.c_str();
};

auto set_clipboard_text(ImGuiContext* /*ctx*/, const char* text) -> void {
    set_clipboard_fn(std::string(text));
};

} // namespace

/* -------------------------------------------------------------------------- */
/* Manual Backend Bindings - WebGL and WebGPU */
/* -------------------------------------------------------------------------- */

EMSCRIPTEN_BINDINGS(impl) {

    bind_fn("SetupIniSettings", []() -> void {
        auto const& io = ImGui_GetIO();
        io->IniFilename = nullptr;
    });

    bind_fn("SetupClipboardFunctions", [](emscripten::val get_fn, emscripten::val set_fn) -> void {
        auto const& platform_io = ImGui_GetPlatformIO();

        get_clipboard_fn = std::move(get_fn);
        set_clipboard_fn = std::move(set_fn);

        platform_io->Platform_GetClipboardTextFn = get_clipboard_text;
        platform_io->Platform_SetClipboardTextFn = set_clipboard_text;
    });

    bind_fn("get_wasm_heap_info", []() -> emscripten::val {
        auto obj = emscripten::val::object();

        obj.set("size", emscripten::val(emscripten_get_heap_size()));
        obj.set("max", emscripten::val(emscripten_get_heap_max()));
        obj.set("sbrk_ptr", emscripten::val(*emscripten_get_sbrk_ptr()));

        return obj;
    });

    bind_fn("get_wasm_stack_info", []() -> emscripten::val {
        auto obj = emscripten::val::object();

        obj.set("base", emscripten::val(emscripten_stack_get_base()));
        obj.set("end", emscripten::val(emscripten_stack_get_end()));
        obj.set("current", emscripten::val(emscripten_stack_get_current()));
        obj.set("free", emscripten::val(emscripten_stack_get_free()));

        return obj;
    });

    bind_fn("get_wasm_mall_info", []() -> emscripten::val {
        auto const& info = mallinfo();
        auto obj = emscripten::val::object();

        obj.set("arena", emscripten::val(info.arena));
        obj.set("ordblks", emscripten::val(info.ordblks));
        obj.set("smblks", emscripten::val(info.smblks));
        obj.set("hblks", emscripten::val(info.hblks));
        obj.set("hblkhd", emscripten::val(info.hblkhd));
        obj.set("usmblks", emscripten::val(info.usmblks));
        obj.set("fsmblks", emscripten::val(info.fsmblks));
        obj.set("uordblks", emscripten::val(info.uordblks));
        obj.set("fordblks", emscripten::val(info.fordblks));
        obj.set("keepcost", emscripten::val(info.keepcost));

        return obj;
    });

/* -------------------------------------------------------------------------- */
/* WebGL */
/* -------------------------------------------------------------------------- */
#ifdef JSIMGUI_BACKEND_WEBGL

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
        allow_ptr()
    );

#endif
/* -------------------------------------------------------------------------- */
/* WebGPU */
/* -------------------------------------------------------------------------- */
#ifdef JSIMGUI_BACKEND_WEBGPU

    bind_fn("cImGui_ImplWGPU_Init", []() -> bool {
        auto device = wgpu::Device::Acquire(emscripten_webgpu_get_device());

        auto init_info = ImGui_ImplWGPU_InitInfo{
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

    bind_fn("cImGui_ImplWGPU_Shutdown", []() -> void {
        cImGui_ImplWGPU_Shutdown();
    });

    bind_fn("cImGui_ImplWGPU_NewFrame", []() -> void {
        cImGui_ImplWGPU_NewFrame();
    });

    bind_fn(
        "cImGui_ImplWGPU_RenderDrawData",
        [](ImDrawData* draw_data, int pass_encoder_handle) -> void {
            auto pass_encoder = wgpu::RenderPassEncoder::Acquire(
                emscripten_webgpu_import_render_pass_encoder(pass_encoder_handle)
            );

            cImGui_ImplWGPU_RenderDrawData(draw_data, pass_encoder.MoveToCHandle());
        },
        allow_ptr()
    );
#endif
}
