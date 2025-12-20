#include "util.hpp"

#include <dcimgui.h>

#include <emscripten/bind.h>
#include <emscripten/heap.h>
#include <emscripten/stack.h>

#include <malloc.h>

#include <string>
#include <utility>

static auto get_clipboard_fn = JsVal::null();
static auto set_clipboard_fn = JsVal::null();

static auto get_clipboard_text(ImGuiContext* ctx) -> const char* {
    UNUSED(ctx);

    static auto text = std::string();
    text = get_clipboard_fn().as<std::string>();
    return text.c_str();
};

static auto set_clipboard_text(ImGuiContext* ctx, const char* text) -> void {
    UNUSED(ctx);

    set_clipboard_fn(std::string(text));
};

static auto const WEB = Bindings([]() {
    bind_fn("SetupIniSettings", []() -> void {
        auto const& io = ImGui_GetIO();
        io->IniFilename = nullptr;
    });

    bind_fn("SetupClipboardFunctions", [](JsVal get_fn, JsVal set_fn) -> void {
        auto const& platform_io = ImGui_GetPlatformIO();

        get_clipboard_fn = std::move(get_fn);
        set_clipboard_fn = std::move(set_fn);

        platform_io->Platform_GetClipboardTextFn = get_clipboard_text;
        platform_io->Platform_SetClipboardTextFn = set_clipboard_text;
    });

    bind_fn("get_wasm_heap_info", []() -> JsVal {
        auto obj = JsVal::object();

        obj.set("size", JsVal(emscripten_get_heap_size()));
        obj.set("max", JsVal(emscripten_get_heap_max()));
        obj.set("sbrk_ptr", JsVal(*emscripten_get_sbrk_ptr()));

        return obj;
    });

    bind_fn("get_wasm_stack_info", []() -> JsVal {
        auto obj = JsVal::object();

        obj.set("base", JsVal(emscripten_stack_get_base()));
        obj.set("end", JsVal(emscripten_stack_get_end()));
        obj.set("current", JsVal(emscripten_stack_get_current()));
        obj.set("free", JsVal(emscripten_stack_get_free()));

        return obj;
    });

    bind_fn("get_wasm_mall_info", []() -> JsVal {
        auto const& info = mallinfo();
        auto obj = JsVal::object();

        obj.set("arena", JsVal(info.arena));
        obj.set("ordblks", JsVal(info.ordblks));
        obj.set("smblks", JsVal(info.smblks));
        obj.set("hblks", JsVal(info.hblks));
        obj.set("hblkhd", JsVal(info.hblkhd));
        obj.set("usmblks", JsVal(info.usmblks));
        obj.set("fsmblks", JsVal(info.fsmblks));
        obj.set("uordblks", JsVal(info.uordblks));
        obj.set("fordblks", JsVal(info.fordblks));
        obj.set("keepcost", JsVal(info.keepcost));

        return obj;
    });
});
