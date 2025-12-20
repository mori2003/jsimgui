#include "util.hpp"

#include <dcimgui.h>
#include <dcimgui_impl_wgpu.h>

#include <emscripten/bind.h>
#include <emscripten/html5_webgpu.h>
#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

#include <cstdint>

static auto const WEBGPU = Bindings([]() {
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
        [](ImDrawData* draw_data, int handle) -> void {
            auto pass_encoder = wgpu::RenderPassEncoder::Acquire(
                emscripten_webgpu_import_render_pass_encoder(handle)
            );

            cImGui_ImplWGPU_RenderDrawData(draw_data, pass_encoder.MoveToCHandle());
        },
        AllowRawPtrs{}
    );
});
