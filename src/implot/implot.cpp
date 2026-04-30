#include <util.hpp>

#include <implot.h>

EMSCRIPTEN_BINDINGS(implot) {

bind_fn("ImPlot_CreateContext", []() {
        ImPlot::CreateContext();
});

bind_fn("ImPlot_DestroyContext", []() {
        ImPlot::DestroyContext();
});

bind_fn("ImPlot_ShowDemoWindow", []() {
    ImPlot::ShowDemoWindow(nullptr);
});

}