#include "util.hpp"

#include <dcimgui.h>
#include <dcimgui_impl_wgpu.h>

#include <emscripten/bind.h>
#include <webgpu/webgpu.h>
#include <webgpu/webgpu_cpp.h>

#include <cstdint>

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
