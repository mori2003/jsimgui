#include "util.hpp"

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>

#include <emscripten/bind.h>

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
