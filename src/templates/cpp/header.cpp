#include <emscripten.h>
#include <emscripten/bind.h>

#include <dcimgui.h>
#include <dcimgui_impl_opengl3.h>
#include <dcimgui_internal.h>

#include <vector>
#include <string>

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

EMSCRIPTEN_BINDINGS(impl) {

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
        cImGui_ImplOpenGL3_RenderDrawData(draw_data);
    }, allow_ptr());

}
