#include <util.hpp>

#include <imnodes_internal.h>

#include <imnodes.h>

#include <string>

// clang-format off
static auto const IMNODES = bindings([]() {

emscripten::value_object<ImVec2>("ImVec2")
    .field("x", &ImVec2::x)
    .field("y", &ImVec2::y)
    ;

bind_struct<ImNodesContext>("ImNodesContext").constructor<>();
bind_struct<ImNodesEditorContext>("ImNodesEditorContext").constructor<>();

bind_struct<ImNodesIO>("ImNodesIO").constructor<>()
.function("get_AltMouseButton", override([](ImNodesIO const* self) {
    return self->AltMouseButton;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_AltMouseButton", override([](ImNodesIO* self, int value) {
    self->AltMouseButton = value;
}), allow_raw_ptrs{})
.function("get_AutoPanningSpeed", override([](ImNodesIO const* self) {
    return self->AutoPanningSpeed;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_AutoPanningSpeed", override([](ImNodesIO* self, float value) {
    self->AutoPanningSpeed = value;
}), allow_raw_ptrs{})
;

bind_struct<ImNodesStyle>("ImNodesStyle").constructor<>()
.function("get_GridSpacing", override([](ImNodesStyle const* self) {
    return self->GridSpacing;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_GridSpacing", override([](ImNodesStyle* self, float value) {
    self->GridSpacing = value;
}), allow_raw_ptrs{})
.function("get_NodeCornerRounding", override([](ImNodesStyle const* self) {
    return self->NodeCornerRounding;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_NodeCornerRounding", override([](ImNodesStyle* self, float value) {
    self->NodeCornerRounding = value;
}), allow_raw_ptrs{})
.function("get_NodePadding", override([](ImNodesStyle const* self) {
    return self->NodePadding;
}), allow_raw_ptrs{})
.function("set_NodePadding", override([](ImNodesStyle* self, ImVec2 value) {
    self->NodePadding = value;
}), allow_raw_ptrs{})
.function("get_NodeBorderThickness", override([](ImNodesStyle const* self) {
    return self->NodeBorderThickness;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_NodeBorderThickness", override([](ImNodesStyle* self, float value) {
    self->NodeBorderThickness = value;
}), allow_raw_ptrs{})
.function("get_LinkThickness", override([](ImNodesStyle const* self) {
    return self->LinkThickness;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_LinkThickness", override([](ImNodesStyle* self, float value) {
    self->LinkThickness = value;
}), allow_raw_ptrs{})
.function("get_LinkLineSegmentsPerLength", override([](ImNodesStyle const* self) {
    return self->LinkLineSegmentsPerLength;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_LinkLineSegmentsPerLength", override([](ImNodesStyle* self, float value) {
    self->LinkLineSegmentsPerLength = value;
}), allow_raw_ptrs{})
.function("get_LinkHoverDistance", override([](ImNodesStyle const* self) {
    return self->LinkHoverDistance;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_LinkHoverDistance", override([](ImNodesStyle* self, float value) {
    self->LinkHoverDistance = value;
}), allow_raw_ptrs{})
.function("get_PinCircleRadius", override([](ImNodesStyle const* self) {
    return self->PinCircleRadius;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinCircleRadius", override([](ImNodesStyle* self, float value) {
    self->PinCircleRadius = value;
}), allow_raw_ptrs{})
.function("get_PinQuadSideLength", override([](ImNodesStyle const* self) {
    return self->PinQuadSideLength;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinQuadSideLength", override([](ImNodesStyle* self, float value) {
    self->PinQuadSideLength = value;
}), allow_raw_ptrs{})
.function("get_PinTriangleSideLength", override([](ImNodesStyle const* self) {
    return self->PinTriangleSideLength;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinTriangleSideLength", override([](ImNodesStyle* self, float value) {
    self->PinTriangleSideLength = value;
}), allow_raw_ptrs{})
.function("get_PinLineThickness", override([](ImNodesStyle const* self) {
    return self->PinLineThickness;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinLineThickness", override([](ImNodesStyle* self, float value) {
    self->PinLineThickness = value;
}), allow_raw_ptrs{})
.function("get_PinHoverRadius", override([](ImNodesStyle const* self) {
    return self->PinHoverRadius;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinHoverRadius", override([](ImNodesStyle* self, float value) {
    self->PinHoverRadius = value;
}), allow_raw_ptrs{})
.function("get_PinOffset", override([](ImNodesStyle const* self) {
    return self->PinOffset;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_PinOffset", override([](ImNodesStyle* self, float value) {
    self->PinOffset = value;
}), allow_raw_ptrs{})
.function("get_MiniMapPadding", override([](ImNodesStyle const* self) {
    return self->MiniMapPadding;
}), allow_raw_ptrs{})
.function("set_MiniMapPadding", override([](ImNodesStyle* self, ImVec2 value) {
    self->MiniMapPadding = value;
}), allow_raw_ptrs{})
.function("get_MiniMapOffset", override([](ImNodesStyle const* self) {
    return self->MiniMapOffset;
}), allow_raw_ptrs{})
.function("set_MiniMapOffset", override([](ImNodesStyle* self, ImVec2 value) {
    self->MiniMapOffset = value;
}), allow_raw_ptrs{})
.function("get_Flags", override([](ImNodesStyle const* self) {
    return self->Flags;
}), rvp_ref{}, allow_raw_ptrs{})
.function("set_Flags", override([](ImNodesStyle* self, ImNodesStyleFlags value) {
    self->Flags = value;
}), allow_raw_ptrs{})
.function("get_Colors", override([](ImNodesStyle const* self) {
    auto obj = emscripten::val::array();
    for (auto i = 0; i < ImNodesCol_COUNT; i++) {
        obj.set(i, self->Colors[i]);
    };
    return obj;
}), allow_raw_ptrs{})
.function("set_Colors", override([](ImNodesStyle* self, js_val value) {
    for (auto i = 0; i < ImNodesCol_COUNT; i++) {
        self->Colors[i] = value[i].as<unsigned int>();
    };
}), allow_raw_ptrs{})
;

bind_fn("ImNodes_CreateContext", []() {
    return ImNodes::CreateContext();
}, rvp_ref{});
bind_fn("ImNodes_DestroyContext", [](ImNodesContext* ctx) {
    ImNodes::DestroyContext(ctx);
}, allow_raw_ptrs{});
bind_fn("ImNodes_GetCurrentContext", []() {
    return ImNodes::GetCurrentContext();
}, rvp_ref{});
bind_fn("ImNodes_SetCurrentContext", [](ImNodesContext* ctx) {
    ImNodes::SetCurrentContext(ctx);
}, allow_raw_ptrs{});


bind_fn("ImNodes_EditorContextCreate", []() {
    return ImNodes::EditorContextCreate();
}, rvp_ref{});
bind_fn("ImNodes_EditorContextFree", [](ImNodesEditorContext* ctx) {
    ImNodes::EditorContextFree(ctx);
}, allow_raw_ptrs{});
bind_fn("ImNodes_EditorContextSet", [](ImNodesEditorContext* ctx) {
    ImNodes::EditorContextSet(ctx);
}, allow_raw_ptrs{});
bind_fn("ImNodes_EditorContextGetPanning", []() {
    return ImNodes::EditorContextGetPanning();
});
bind_fn("ImNodes_EditorContextResetPanning", [](const ImVec2& pos) {
    ImNodes::EditorContextResetPanning(pos);
});
bind_fn("ImNodes_EditorContextMoveToNode", [](const int node_id) {
    ImNodes::EditorContextMoveToNode(node_id);
});

bind_fn("ImNodes_GetIO", []() -> ImNodesIO* {
    return &ImNodes::GetIO();
}, rvp_ref{});
bind_fn("ImNodes_GetStyle", []() -> ImNodesStyle* {
    return &ImNodes::GetStyle();
}, rvp_ref{});

bind_fn("ImNodes_StyleColorsDark", [](ImNodesStyle* dest) {
    ImNodes::StyleColorsDark(dest);
}, allow_raw_ptrs{});
bind_fn("ImNodes_StyleColorsClassic", [](ImNodesStyle* dest) {
    ImNodes::StyleColorsClassic(dest);
}, allow_raw_ptrs{});
bind_fn("ImNodes_StyleColorsLight", [](ImNodesStyle* dest) {
    ImNodes::StyleColorsLight(dest);
}, allow_raw_ptrs{});

bind_fn("ImNodes_BeginNodeEditor", []() {
    ImNodes::BeginNodeEditor();
});
bind_fn("ImNodes_EndNodeEditor", []() {
    ImNodes::EndNodeEditor();
});

// TODO: Add callback support
bind_fn("ImNodes_MiniMap", [](
    const float minimap_size_fraction,
    const ImNodesMiniMapLocation location
) {
    ImNodes::MiniMap(minimap_size_fraction, location);
});


bind_fn("ImNodes_PushColorStyle", [](ImNodesCol item, unsigned int color) {
    ImNodes::PushColorStyle(item, color);
});
bind_fn("ImNodes_PopColorStyle", []() {
    ImNodes::PopColorStyle();
});
bind_fn("ImNodes_PushStyleVar", [](ImNodesStyleVar style_item, float value) {
    ImNodes::PushStyleVar(style_item, value);
});
bind_fn("ImNodes_PushStyleVarImVec2", [](ImNodesStyleVar style_item, const ImVec2& value) {
    ImNodes::PushStyleVar(style_item, value);
});
bind_fn("ImNodes_PopStyleVar", [](int count) {
    ImNodes::PopStyleVar(count);
});


bind_fn("ImNodes_BeginNode", [](int id) {
    ImNodes::BeginNode(id);
});

bind_fn("ImNodes_EndNode", []() {
    ImNodes::EndNode();
});


bind_fn("ImNodes_GetNodeDimensions", [](int id) {
    return ImNodes::GetNodeDimensions(id);
}, rvp_ref{});


bind_fn("ImNodes_BeginNodeTitleBar", []() {
    ImNodes::BeginNodeTitleBar();
});
bind_fn("ImNodes_EndNodeTitleBar", []() {
    ImNodes::EndNodeTitleBar();
});


bind_fn("ImNodes_BeginInputAttribute", [](int id, ImNodesPinShape shape) {
    ImNodes::BeginInputAttribute(id, shape);
});
bind_fn("ImNodes_EndInputAttribute", []() {
    ImNodes::EndInputAttribute();
});

bind_fn("ImNodes_BeginOutputAttribute", [](int id, ImNodesPinShape shape) {
    ImNodes::BeginOutputAttribute(id, shape);
});
bind_fn("ImNodes_EndOutputAttribute", []() {
    ImNodes::EndOutputAttribute();
});

bind_fn("ImNodes_BeginStaticAttribute", [](int id) {
    ImNodes::BeginStaticAttribute(id);
});
bind_fn("ImNodes_EndStaticAttribute", []() {
    ImNodes::EndStaticAttribute();
});

bind_fn("ImNodes_PushAttributeFlag", [](ImNodesAttributeFlags flag) {
    ImNodes::PushAttributeFlag(flag);
});
bind_fn("ImNodes_PopAttributeFlag", []() {
    ImNodes::PopAttributeFlag();
});

bind_fn("ImNodes_Link", [](int id, int start_attribute_id, int end_attribute_id) {
    ImNodes::Link(id, start_attribute_id, end_attribute_id);
});

bind_fn("ImNodes_SetNodeDraggable", [](int node_id, bool draggable) {
    ImNodes::SetNodeDraggable(node_id, draggable);
});

bind_fn("ImNodes_SetNodeScreenSpacePos", [](int node_id, ImVec2 pos) {
    ImNodes::SetNodeScreenSpacePos(node_id, pos);
});

bind_fn("ImNodes_SetNodeEditorSpacePos", [](int node_id, ImVec2 pos) {
    ImNodes::SetNodeEditorSpacePos(node_id, pos);
});

bind_fn("ImNodes_SetNodeGridSpacePos", [](int node_id, ImVec2 pos) {
    ImNodes::SetNodeGridSpacePos(node_id, pos);
});

bind_fn("ImNodes_GetNodeScreenSpacePos", [](int node_id) {
    return ImNodes::GetNodeScreenSpacePos(node_id);
});
bind_fn("ImNodes_GetNodeEditorSpacePos", [](int node_id) {
    return ImNodes::GetNodeEditorSpacePos(node_id);
});
bind_fn("ImNodes_GetNodeGridSpacePos", [](int node_id) {
    return ImNodes::GetNodeGridSpacePos(node_id);
});

bind_fn("ImNodes_SnapNodeToGrid", [](int node_id) {
    ImNodes::SnapNodeToGrid(node_id);
});

bind_fn("ImNodes_IsEditorHovered", []() {
    return ImNodes::IsEditorHovered();
});
bind_fn("ImNodes_IsNodeHovered", [](js_val node_id) {
    auto param_node_id = get_array_param<int, 1>(node_id);
    auto const ret =  ImNodes::IsNodeHovered(param_node_id.ptr);
    write_back_array_param(param_node_id, node_id);
    return ret;
});
bind_fn("ImNodes_IsLinkHovered", [](js_val link_id) {
    auto param_link_id = get_array_param<int, 1>(link_id);
    auto const ret =  ImNodes::IsLinkHovered(param_link_id.ptr);
    write_back_array_param(param_link_id, link_id);
    return ret;
});
bind_fn("ImNodes_IsPinHovered", [](js_val attribute_id) {
    auto param_attribute_id = get_array_param<int, 1>(attribute_id);
    auto const ret =  ImNodes::IsPinHovered(param_attribute_id.ptr);
    write_back_array_param(param_attribute_id, attribute_id);
    return ret;
});

bind_fn("ImNodes_NumSelectedNodes", []() {
    return ImNodes::NumSelectedNodes();
});
bind_fn("ImNodes_NumSelectedLinks", []() {
    return ImNodes::NumSelectedLinks();
});

bind_fn("ImNodes_GetSelectedNodes", [](js_val node_ids) {
    auto param_node_ids = get_vector_param<int>(node_ids);
    ImNodes::GetSelectedNodes(param_node_ids.ptr);
    write_back_vector_param(param_node_ids, node_ids);
});
bind_fn("ImNodes_GetSelectedLinks", [](js_val link_ids) {
    auto param_link_ids = get_vector_param<int>(link_ids);
    ImNodes::GetSelectedLinks(param_link_ids.ptr);
    write_back_vector_param(param_link_ids, link_ids);
});

bind_fn("ImNodes_ClearNodeSelection", []() {
    ImNodes::ClearNodeSelection();
});
bind_fn("ImNodes_ClearLinkSelection", []() {
    ImNodes::ClearLinkSelection();
});

bind_fn("ImNodes_SelectNode", [](int node_id) {
    ImNodes::SelectNode(node_id);
});
bind_fn("ImNodes_ClearNodeSelectionID", [](int node_id) {
    ImNodes::ClearNodeSelection(node_id);
});
bind_fn("ImNodes_IsNodeSelected", [](int node_id) {
    return ImNodes::IsNodeSelected(node_id);
});
bind_fn("ImNodes_SelectLink", [](int link_id) {
    ImNodes::SelectLink(link_id);
});
bind_fn("ImNodes_ClearLinkSelectionID", [](int link_id) {
    ImNodes::ClearLinkSelection(link_id);
});
bind_fn("ImNodes_IsLinkSelected", [](int link_id) {
    return ImNodes::IsLinkSelected(link_id);
});

bind_fn("ImNodes_IsAttributeActive", []() {
    return ImNodes::IsAttributeActive();
});
bind_fn("ImNodes_IsAnyAttributeActive", [](js_val attribute_id) {
    auto param_attribute_id = get_array_param<int, 1>(attribute_id);
    auto const ret =  ImNodes::IsAnyAttributeActive(param_attribute_id.ptr);
    write_back_array_param(param_attribute_id, attribute_id);
    return ret;
});

bind_fn("ImNodes_IsLinkStarted", [](js_val started_at_attribute_id) {
    auto param_started_at_attribute_id = get_array_param<int, 1>(started_at_attribute_id);
    auto const ret =  ImNodes::IsLinkStarted(param_started_at_attribute_id.ptr);
    write_back_array_param(param_started_at_attribute_id, started_at_attribute_id);
    return ret;
});
bind_fn("ImNodes_IsLinkDropped", [](js_val started_at_attribute_id, bool including_detached_links) {
    auto param_started_at_attribute_id = get_array_param<int, 1>(started_at_attribute_id);
    auto const ret =  ImNodes::IsLinkDropped(param_started_at_attribute_id.ptr, including_detached_links);
    write_back_array_param(param_started_at_attribute_id, started_at_attribute_id);
    return ret;
});

bind_fn("ImNodes_IsLinkCreated", [](js_val started_at_attribute_id, js_val ended_at_attribute_id, js_val created_from_snap) {
    auto param_started_at_attribute_id = get_array_param<int, 1>(started_at_attribute_id);
    auto param_ended_at_attribute_id = get_array_param<int, 1>(ended_at_attribute_id);
    auto param_created_from_snap = get_array_param<bool, 1>(created_from_snap);
    auto const ret = ImNodes::IsLinkCreated(param_started_at_attribute_id.ptr, param_ended_at_attribute_id.ptr, param_created_from_snap.ptr);
    write_back_array_param(param_started_at_attribute_id, started_at_attribute_id);
    write_back_array_param(param_ended_at_attribute_id, ended_at_attribute_id);
    write_back_array_param(param_created_from_snap, created_from_snap);
    return ret;
});

bind_fn("ImNodes_IsLinkCreatedEx", [](js_val started_at_node_id, js_val started_at_attribute_id, js_val ended_at_node_id, js_val ended_at_attribute_id, js_val created_from_snap) {
    auto param_started_at_node_id = get_array_param<int, 1>(started_at_node_id);
    auto param_started_at_attribute_id = get_array_param<int, 1>(started_at_attribute_id);
    auto param_ended_at_node_id = get_array_param<int, 1>(ended_at_node_id);
    auto param_ended_at_attribute_id = get_array_param<int, 1>(ended_at_attribute_id);
    auto param_created_from_snap = get_array_param<bool, 1>(created_from_snap);
    auto const ret = ImNodes::IsLinkCreated(param_started_at_node_id.ptr, param_started_at_attribute_id.ptr, param_ended_at_node_id.ptr, param_ended_at_attribute_id.ptr, param_created_from_snap.ptr);
    write_back_array_param(param_started_at_node_id, started_at_node_id);
    write_back_array_param(param_started_at_attribute_id, started_at_attribute_id);
    write_back_array_param(param_ended_at_node_id, ended_at_node_id);
    write_back_array_param(param_ended_at_attribute_id, ended_at_attribute_id);
    write_back_array_param(param_created_from_snap, created_from_snap);
    return ret;
});


bind_fn("ImNodes_IsLinkDestroyed", [](js_val link_id) {
    auto param_link_id = get_array_param<int, 1>(link_id);
    auto const ret =  ImNodes::IsLinkDestroyed(param_link_id.ptr);
    write_back_array_param(param_link_id, link_id);
    return ret;
});

bind_fn("ImNodes_SaveCurrentEditorStateToIniString", []() {
    return std::string(ImNodes::SaveCurrentEditorStateToIniString());
});

bind_fn("ImNodes_SaveEditorStateToIniString", [](ImNodesEditorContext* editor) {
    return std::string(ImNodes::SaveEditorStateToIniString(editor));
}, allow_raw_ptrs{});

bind_fn("ImNodes_LoadCurrentEditorStateFromIniString", [](std::string data) {
    ImNodes::LoadCurrentEditorStateFromIniString(data.c_str(), data.size());
});

bind_fn("ImNodes_LoadEditorStateFromIniString", [](ImNodesEditorContext* editor, std::string data) {
    ImNodes::LoadEditorStateFromIniString(editor, data.c_str(), data.size());
}, allow_raw_ptrs{});

});
// clang-format on
