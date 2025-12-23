#pragma once

#include "util.hpp"

#include <dcimgui.h>

#include <emscripten/val.h>

#include <ranges>
#include <utility>
#include <vector>

inline auto is_valid_array(JsVal const& val) -> bool {
    return !val.isNull() && !val.isUndefined() && val.isArray();
}

template <typename T>
struct ArrayParam {
    JsVal val;
    std::vector<T> vec;

    explicit ArrayParam(JsVal& val) : val(val) {
        if (!is_valid_array(val))
            return;

        auto const length = val["length"].as<int>();
        vec.reserve(length);

        for (int i = 0; i < length; i++) {
            vec.push_back(val[i].as<T>());
        }
    }

    ~ArrayParam() {
        if (!is_valid_array(val))
            return;

        for (size_t i = 0; i < vec.size(); i++) {
            val.set(i, vec[i]);
        }
    }

    ArrayParam(ArrayParam const&) = delete;
    ArrayParam(ArrayParam&&) = delete;
    auto operator=(ArrayParam const&) -> ArrayParam& = delete;
    auto operator=(ArrayParam&&) -> ArrayParam& = delete;

    auto operator&() -> T* {
        return (!is_valid_array(val)) ? nullptr : vec.data();
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
