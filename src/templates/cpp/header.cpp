#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5_webgl.h>
#include <emscripten/html5_webgpu.h>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_impl_wgpu.h>
#include <dcimgui_internal.h>

#include <vector>
#include <string>
//#include <webgpu/webgpu.h>
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

/* -------------------------------------------------------------------------- */
/* WebGPU */
/* -------------------------------------------------------------------------- */

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

}
