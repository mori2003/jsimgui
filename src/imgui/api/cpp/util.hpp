#pragma once

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten/wire.h>

#include <type_traits>
#include <utility>

using JsVal = emscripten::val;
using AllowRawPtrs = emscripten::allow_raw_pointers;
using ReturnRef = emscripten::return_value_policy::reference;

template <typename... Ts>
consteval auto UNUSED(Ts&&...) -> void {};

template <typename T>
concept InitFn = std::is_invocable_v<T> && std::is_same_v<std::invoke_result_t<T>, void>;

template <InitFn Fn>
struct Bindings : emscripten::internal::InitFunc {
    explicit Bindings(Fn&& fn) : InitFunc(std::forward<Fn>(fn)) {
    } // NOLINT
};

template <typename Fn>
constexpr auto override(Fn&& fn) {
    return emscripten::optional_override(std::forward<Fn>(fn));
}

template <typename Fn, typename... Policies>
constexpr auto bind_fn(const char* name, Fn&& fn, Policies&&... policies) -> void {
    return emscripten::function(
        name,
        emscripten::optional_override(std::forward<Fn>(fn)),
        std::forward<Policies>(policies)...
    );
}

template <typename T>
constexpr auto bind_struct(const char* name) -> emscripten::class_<T> {
    return emscripten::class_<T>(name);
}
