#pragma once

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten/wire.h>

#include <array>
#include <cstddef>
#include <ranges>
#include <type_traits>
#include <utility>
#include <vector>

using js_val = emscripten::val;
using allow_raw_ptrs = emscripten::allow_raw_pointers;
using rvp_ref = emscripten::return_value_policy::reference;

template <typename... Ts>
consteval auto unused(Ts&&...) -> void {};

template <typename Fn>
 requires std::is_invocable_v<Fn> && std::is_same_v<std::invoke_result_t<Fn>, void>
struct bindings : emscripten::internal::InitFunc {
    explicit bindings(Fn&& fn) : InitFunc(std::forward<Fn>(std::move(fn))) {}
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

template <typename T, size_t N>
struct array_param {
    std::array<T, N> arr = {};
    T* ptr = nullptr;
};

template <typename T, size_t N>
inline auto get_array_param(js_val const& v) -> array_param<T, N> {
    array_param<T, N> out{};

    if (v.isNull() || v.isUndefined() || !v.isArray())
        return out;

    auto const len = v["length"].as<size_t>();
    if (len <= 0 || len > N)
        return out;

    for (auto const i : std::views::iota(0uz, len)) {
        out.arr[i] = v[i].as<T>();
    }

    out.ptr = out.arr.data();
    return out;
}

template <typename T, size_t N>
inline auto write_back_array_param(array_param<T, N> const& out, js_val& v) -> void {
    if (!out.ptr)
        return;

    for (auto const i : std::views::iota(0uz, N)) {
        v.set(i, out.arr[i]);
    }
}

template <typename T>
struct vector_param {
    std::vector<T> vec = {};
    T* ptr = nullptr;
};

template <typename T>
inline auto get_vector_param(js_val const& v) -> vector_param<T> {
    vector_param<T> out{};

    if (v.isNull() || v.isUndefined() || !v.isArray())
        return out;

    auto const len = v["length"].as<size_t>();
    if (len <= 0)
        return out;

    out.vec.reserve(len);
    for (auto const i : std::views::iota(0uz, len)) {
        out.vec.emplace_back(v[i].as<T>());
    }

    out.ptr = out.vec.data();
    return out;
}

template <typename T>
inline auto write_back_vector_param(vector_param<T> const& out, js_val& v) -> void {
    if (!out.ptr)
        return;

    for (auto const i : std::views::iota(0uz, out.vec.size())) {
        v.set(i, out.vec[i]);
    }
}
