// [EXPERIMENTAL | INCOMPLETE]
// Manually written bindings for implot:
// https://github.com/epezent/implot using version `v1.0`

#include <util.hpp>

#include <implot.h>
#include <implot_internal.h>


EMSCRIPTEN_BINDINGS(implot) {

bind_struct<ImPlotContext>("ImPlotContext").constructor<>();
bind_struct<ImPlotStyle>("ImPlotStyle").constructor<>();
bind_struct<ImPlotInputMap>("ImPlotInputMap").constructor<>();

emscripten::value_object<ImPlotPoint>("ImPlotPoint")
.field("x", &ImPlotPoint::x)
.field("y", &ImPlotPoint::y)
;

emscripten::value_object<ImPlotRange>("ImPlotRange")
.field("Min", &ImPlotRange::Min)
.field("Max", &ImPlotRange::Max)
;

emscripten::value_object<ImPlotRect>("ImPlotRect")
.field("X", &ImPlotRect::X)
.field("Y", &ImPlotRect::Y)
;

bind_fn("ImPlot_CreateContext", []() {
	return ImPlot::CreateContext();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImPlot_DestroyContext", [](ImPlotContext* ctx) {
	ImPlot::DestroyContext(ctx);
}, allow_raw_ptrs{});

bind_fn("ImPlot_GetCurrentContext", []() {
	return ImPlot::GetCurrentContext();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImPlot_SetCurrentContext", [](ImPlotContext* ctx) {
	ImPlot::SetCurrentContext(ctx);
}, allow_raw_ptrs{});



bind_fn("ImPlot_BeginPlot", [](std::string title_id, ImVec2 size, ImPlotFlags flags) {
	return ImPlot::BeginPlot(title_id.c_str(), size, flags);
});

bind_fn("ImPlot_EndPlot", []() {
	ImPlot::EndPlot();
});



bind_fn("ImPlot_BeginSubplots", [](std::string title_id, int rows, int cols, ImVec2 size, ImPlotFlags flags, js_val row_ratios, js_val col_ratios) {
	auto param_row_ratios = get_vector_param<float>(row_ratios);
	auto param_col_ratios = get_vector_param<float>(col_ratios);
	auto const ret = ImPlot::BeginSubplots(title_id.c_str(), rows, cols, size, flags, param_row_ratios.ptr, param_col_ratios.ptr);
	write_back_vector_param(param_row_ratios, row_ratios);
	write_back_vector_param(param_col_ratios, col_ratios);
	return ret;
});

bind_fn("ImPlot_EndSubplots", []() {
	ImPlot::EndSubplots();
});

bind_fn("ImPlot_SetupAxis", [](ImAxis axis, std::string label, ImPlotAxisFlags flags) {
	ImPlot::SetupAxis(axis, label.c_str(), flags);
});

bind_fn("ImPlot_SetupAxisLimits", [](ImAxis axis, double v_min, double v_max, ImPlotCond cond) {
	ImPlot::SetupAxisLimits(axis, v_min, v_max, cond);
});

bind_fn("ImPlot_SetupAxisLinks", [](ImAxis axis, js_val link_min, js_val link_max) {
	auto param_link_min = get_vector_param<double>(link_min);
	auto param_link_max = get_vector_param<double>(link_max);
	ImPlot::SetupAxisLinks(axis, param_link_min.ptr, param_link_max.ptr);
	write_back_vector_param(param_link_min, link_min);
	write_back_vector_param(param_link_max, link_max);
});

bind_fn("ImPlot_SetupAxisFormat", [](ImAxis axis, std::string fmt) {
	ImPlot::SetupAxisFormat(axis, fmt.c_str());
});

bind_fn("ImPlot_SetupAxisTicks", [](ImAxis axis, js_val values, int n_ticks, js_val labels, bool keep_default) {
	// auto param_values = get_vector_param<double>(values);
	// auto param_labels = get_vector_param<std::string>(labels);
	// ImPlot::SetupAxisTicks(axis, param_values.ptr, n_ticks, param_labels.ptr, keep_default);
	// write_back_vector_param(param_values, values);
	// write_back_vector_param(param_labels, labels);
});

bind_fn("ImPlot_SetupAxisScale", [](ImAxis axis, ImPlotScale scale) {
	ImPlot::SetupAxisScale(axis, scale);
});

bind_fn("ImPlot_SetupAxisLimitsConstraints", [](ImAxis axis, double v_min, double v_max) {
	ImPlot::SetupAxisLimitsConstraints(axis, v_min, v_max);
});

bind_fn("ImPlot_SetupAxisZoomConstraints", [](ImAxis axis, double z_min, double z_max) {
	ImPlot::SetupAxisZoomConstraints(axis, z_min, z_max);
});


bind_fn("ImPlot_SetupAxes", [](std::string x_label, std::string y_label, ImPlotAxisFlags x_flags, ImPlotAxisFlags y_flags) {
	ImPlot::SetupAxes(x_label.c_str(), y_label.c_str(), x_flags, y_flags);
});

bind_fn("ImPlot_SetupAxesLimits", [](double x_min, double x_max, double y_min, double y_max, ImPlotCond cond) {
	ImPlot::SetupAxesLimits(x_min, x_max, y_min, y_max, cond);
});

bind_fn("ImPlot_SetupLegend", [](ImPlotLocation location, ImPlotLegendFlags flags) {
	ImPlot::SetupLegend(location, flags);
});

bind_fn("ImPlot_SetupMouseText", [](ImPlotLocation location, ImPlotMouseTextFlags flags) {
	ImPlot::SetupMouseText(location, flags);
});

bind_fn("ImPlot_SetupFinish", []() {
	ImPlot::SetupFinish();
});


bind_fn("ImPlot_SetNextAxisLimits", [](ImAxis axis, double v_min, double v_max, ImPlotCond cond) {
	ImPlot::SetNextAxisLimits(axis, v_min, v_max, cond);
});

bind_fn("ImPlot_SetNextAxisLinks", [](ImAxis axis, js_val link_min, js_val link_max) {
	auto param_link_min = get_vector_param<double>(link_min);
	auto param_link_max = get_vector_param<double>(link_max);
	ImPlot::SetNextAxisLinks(axis, param_link_min.ptr, param_link_max.ptr);
	write_back_vector_param(param_link_min, link_min);
	write_back_vector_param(param_link_max, link_max);
});

bind_fn("ImPlot_SetNextAxisToFit", [](ImAxis axis) {
	ImPlot::SetNextAxisToFit(axis);
});

bind_fn("ImPlot_SetNextAxesLimits", [](double x_min, double x_max, double y_min, double y_max, ImPlotCond cond) {
	ImPlot::SetNextAxesLimits(x_min, x_max, y_min, y_max, cond);
});

bind_fn("ImPlot_SetNextAxesToFit", []() {
	ImPlot::SetNextAxesToFit();
});



bind_fn("ImPlot_PlotLine", [](std::string label_id, js_val values, int count, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotLine(label_id.c_str(), param_values.ptr, count, xscale, xstart);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotScatter", [](std::string label_id, js_val values, int count, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotScatter(label_id.c_str(), param_values.ptr, count, xscale, xstart);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotBubbles", [](std::string label_id, js_val values, js_val szs, int count, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	auto param_szs = get_vector_param<double>(szs);
	ImPlot::PlotBubbles(label_id.c_str(), param_values.ptr, param_szs.ptr, count, xscale, xstart);
	write_back_vector_param(param_values, values);
	write_back_vector_param(param_szs, szs);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotPolygon", [](std::string label_id, js_val xs, js_val ys, int count) {
	auto param_xs = get_vector_param<double>(xs);
	auto param_ys = get_vector_param<double>(ys);
	ImPlot::PlotPolygon(label_id.c_str(), param_xs.ptr, param_ys.ptr, count);
	write_back_vector_param(param_xs, xs);
	write_back_vector_param(param_ys, ys);
});

bind_fn("ImPlot_PlotStairs", [](std::string label_id, js_val values, int count, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotStairs(label_id.c_str(), param_values.ptr, count, xscale, xstart);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotShaded", [](std::string label_id, js_val values, int count, double yref, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotShaded(label_id.c_str(), param_values.ptr, count, yref, xscale, xstart);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotBars", [](std::string label_id, js_val values, int count, double bar_size, double shift) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotBars(label_id.c_str(), param_values.ptr, count, bar_size, shift);
	write_back_vector_param(param_values, values);
});

// bind_fn("ImPlot_PlotBarGroups", [](std::string label_id, js_val values, int item_count, int group_count, double group_size, double shift) {
// 	auto param_values = get_vector_param<double>(values);
// 	ImPlot::PlotBarGroups(label_id.c_str(), param_values.ptr, item_count, group_count, group_size, shift);
// 	write_back_vector_param(param_values, values);
// });

bind_fn("ImPlot_PlotErrorBars", [](std::string label_id, js_val xs, js_val ys, js_val err, int count) {
	auto param_xs = get_vector_param<double>(xs);
	auto param_ys = get_vector_param<double>(ys);
	auto param_err = get_vector_param<double>(err);
	ImPlot::PlotErrorBars(label_id.c_str(), param_xs.ptr, param_ys.ptr, param_err.ptr, count);
	write_back_vector_param(param_xs, xs);
	write_back_vector_param(param_ys, ys);
	write_back_vector_param(param_err, err);
});

bind_fn("ImPlot_PlotStems", [](std::string label_id, js_val values, int count, double ref, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotStems(label_id.c_str(), param_values.ptr, count, ref, xscale, xstart);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotInfLines", [](std::string label_id, js_val values, int count) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotInfLines(label_id.c_str(), param_values.ptr, count);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotHeatmap", [](std::string label_id, js_val values, int rows, int cols, double scale_min, double scale_max, std::string label_fmt, ImPlotPoint bounds_min, ImPlotPoint bounds_max) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotHeatmap(
					label_id.c_str(),
					param_values.ptr,
					rows,
					cols,
					scale_min,
					scale_max,
					label_fmt.c_str(),
					bounds_min,
					bounds_max
	);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotHistogram", [](std::string label_id, js_val values, int count, int bins, double bar_scale, ImPlotRange range) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotHistogram(label_id.c_str(), param_values.ptr, count, bins, bar_scale, range);
	write_back_vector_param(param_values, values);
});

bind_fn("ImPlot_PlotHistogram2D", [](std::string label_id, js_val xs, js_val ys, int count, int x_bins, int y_bins, ImPlotRect range) {
	auto param_xs = get_vector_param<double>(xs);
	auto param_ys = get_vector_param<double>(ys);
	ImPlot::PlotHistogram2D(label_id.c_str(), param_xs.ptr, param_ys.ptr, count, x_bins, y_bins, range);
	write_back_vector_param(param_xs, xs);
	write_back_vector_param(param_ys, ys);
});

bind_fn("ImPlot_PlotDigital", [](std::string label_id, js_val xs, js_val ys, int count) {
	auto param_xs = get_vector_param<double>(xs);
	auto param_ys = get_vector_param<double>(ys);
	ImPlot::PlotDigital(label_id.c_str(), param_xs.ptr, param_ys.ptr, count);
	write_back_vector_param(param_xs, xs);
	write_back_vector_param(param_ys, ys);
});

bind_fn("ImPlot_PlotImage", [](std::string label_id, ImTextureRef tex_ref, ImPlotPoint bounds_min, ImPlotPoint bounds_max, ImVec2 uv0, ImVec2 uv1, ImVec4 tint_col) {
	ImPlot::PlotImage(label_id.c_str(), tex_ref, bounds_min, bounds_max, uv0, uv1, tint_col);
});

bind_fn("ImPlot_PlotText", [](std::string text, double x, double y, ImVec2 pix_offset) {
	ImPlot::PlotText(text.c_str(), x, y, pix_offset);
});

bind_fn("ImPlot_PlotDummy", [](std::string label_id) {
	ImPlot::PlotDummy(label_id.c_str());
});

bind_fn("ImPlot_Annotation", [](double x, double y, ImVec4 col, ImVec2 pix_offset, bool clamp, bool round) {
	ImPlot::Annotation(x, y, col, pix_offset, clamp, round);
});

bind_fn("ImPlot_TagX", [](double x, ImVec4 col, bool round) {
	ImPlot::TagX(x, col, round);
});

bind_fn("ImPlot_TagY", [](double y, ImVec4 col, bool round) {
	ImPlot::TagY(y, col, round);
});

bind_fn("ImPlot_SetAxis", [](ImAxis axis) {
	ImPlot::SetAxis(axis);
});

bind_fn("ImPlot_SetAxes", [](ImAxis x_axis, ImAxis y_axis) {
	ImPlot::SetAxes(x_axis, y_axis);
});

bind_fn("ImPlot_PixelsToPlotImVec2", [](ImVec2 pix, ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::PixelsToPlot(pix, x_axis, y_axis);
});

bind_fn("ImPlot_PixelsToPlot", [](double x, double y, ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::PixelsToPlot(x, y, x_axis, y_axis);
});

bind_fn("ImPlot_PlotToPixelsImVec2", [](ImVec2 pix, ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::PlotToPixels(pix, x_axis, y_axis);
});

bind_fn("ImPlot_PlotToPixels", [](double x, double y, ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::PlotToPixels(x, y, x_axis, y_axis);
});

bind_fn("ImPlot_GetPlotPos", []() {
	return ImPlot::GetPlotPos();
});

bind_fn("ImPlot_GetPlotSize", []() {
	return ImPlot::GetPlotSize();
});

bind_fn("ImPlot_GetPlotMousePos", [](ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::GetPlotMousePos(x_axis, y_axis);
});

bind_fn("ImPlot_GetPlotLimits", [](ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::GetPlotLimits(x_axis, y_axis);
});

bind_fn("ImPlot_IsPlotHovered", []() {
	return ImPlot::IsPlotHovered();
});

bind_fn("ImPlot_IsAxisHovered", [](ImAxis axis) {
	return ImPlot::IsAxisHovered(axis);
});

bind_fn("ImPlot_IsSubplotsHovered", []() {
	return ImPlot::IsSubplotsHovered();
});

bind_fn("ImPlot_IsPlotSelected", []() {
	return ImPlot::IsPlotSelected();
});

bind_fn("ImPlot_GetPlotSelection", [](ImAxis x_axis, ImAxis y_axis) {
	return ImPlot::GetPlotSelection(x_axis, y_axis);
});

bind_fn("ImPlot_CancelPlotSelection", []() {
	ImPlot::CancelPlotSelection();
});

bind_fn("ImPlot_HideNextItem", [](bool hidden, ImPlotCond cond) {
	ImPlot::HideNextItem(hidden, cond);
});

bind_fn("ImPlot_BeginAlignedPlots", [](std::string group_id, bool vertical) {
	return ImPlot::BeginAlignedPlots(group_id.c_str(), vertical);
});

bind_fn("ImPlot_EndAlignedPlots", []() {
	ImPlot::EndAlignedPlots();
});

bind_fn("ImPlot_BeginLegendPopup", [](std::string label_id, ImGuiMouseButton mouse_button) {
	return ImPlot::BeginLegendPopup(label_id.c_str(), mouse_button);
});

bind_fn("ImPlot_EndLegendPopup", []() {
	ImPlot::EndLegendPopup();
});

bind_fn("ImPlot_IsLegendEntryHovered", [](std::string label_id) {
	return ImPlot::IsLegendEntryHovered(label_id.c_str());
});

bind_fn("ImPlot_BeginDragDropTargetPlot", []() {
	return ImPlot::BeginDragDropTargetPlot();
});

bind_fn("ImPlot_BeginDragDropTargetAxis", [](ImAxis axis) {
	return ImPlot::BeginDragDropTargetAxis(axis);
});

bind_fn("ImPlot_BeginDragDropTargetLegend", []() {
	return ImPlot::BeginDragDropTargetLegend();
});

bind_fn("ImPlot_EndDragDropTarget", []() {
	ImPlot::EndDragDropTarget();
});

bind_fn("ImPlot_BeginDragDropSourcePlot", [](ImGuiDragDropFlags flags) {
	return ImPlot::BeginDragDropSourcePlot(flags);
});

bind_fn("ImPlot_BeginDragDropSourceAxis", [](ImAxis axis, ImGuiDragDropFlags flags) {
	return ImPlot::BeginDragDropSourceAxis(axis, flags);
});

bind_fn("ImPlot_BeginDragDropSourceItem", [](std::string label_id, ImGuiDragDropFlags flags) {
	return ImPlot::BeginDragDropSourceItem(label_id.c_str(), flags);
});

bind_fn("ImPlot_EndDragDropSource", []() {
	ImPlot::EndDragDropSource();
});

bind_fn("ImPlot_GetStyle", []() {
	return &ImPlot::GetStyle();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImPlot_StyleColorsAuto", [](ImPlotStyle* dst) {
	ImPlot::StyleColorsAuto(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_StyleColorsClassic", [](ImPlotStyle* dst) {
	ImPlot::StyleColorsClassic(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_StyleColorsDark", [](ImPlotStyle* dst) {
	ImPlot::StyleColorsDark(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_StyleColorsLight", [](ImPlotStyle* dst) {
	ImPlot::StyleColorsLight(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_PushStyleColor", [](ImPlotCol idx, ImU32 col) {
	ImPlot::PushStyleColor(idx, col);
});

bind_fn("ImPlot_PushStyleColorImVec4", [](ImPlotCol idx, ImVec4 col) {
	ImPlot::PushStyleColor(idx, col);
});

bind_fn("ImPlot_PopStyleColor", [](int count) {
	ImPlot::PopStyleColor(count);
});

bind_fn("ImPlot_PushStyleVar", [](ImPlotStyleVar idx, float val) {
	ImPlot::PushStyleVar(idx, val);
});

bind_fn("ImPlot_PushStyleVarInt", [](ImPlotStyleVar idx, int val) {
	ImPlot::PushStyleVar(idx, val);
});

bind_fn("ImPlot_PushStyleVarImVec2", [](ImPlotStyleVar idx, ImVec2 val) {
	ImPlot::PushStyleVar(idx, val);
});

bind_fn("ImPlot_PopStyleVar", [](int count) {
	ImPlot::PopStyleVar(count);
});

bind_fn("ImPlot_GetLastItemColor", []() {
	return ImPlot::GetLastItemColor();
});

bind_fn("ImPlot_GetStyleColorName", [](ImPlotCol idx) {
	return std::string{ImPlot::GetStyleColorName(idx)};
});

bind_fn("ImPlot_GetMarkerName", [](ImPlotMarker idx) {
	return std::string{ImPlot::GetMarkerName(idx)};
});

bind_fn("ImPlot_NextMarker", []() {
	return ImPlot::NextMarker();
});



bind_fn("ImPlot_GetColormapCount", []() {
	return ImPlot::GetColormapCount();
});

bind_fn("ImPlot_GetColormapName", [](ImPlotColormap cmap) {
	return std::string{ImPlot::GetColormapName(cmap)};
});

bind_fn("ImPlot_GetColormapIndex", [](std::string name) {
	return ImPlot::GetColormapIndex(name.c_str());
});

bind_fn("ImPlot_PushColormap", [](int cmap) {
	ImPlot::PushColormap(cmap);
});

bind_fn("ImPlot_PushColormapStr", [](std::string name) {
	ImPlot::PushColormap(name.c_str());
});

bind_fn("ImPlot_PopColormap", [](int count) {
	ImPlot::PopColormap(count);
});

bind_fn("ImPlot_NextColormapColor", []() {
	return ImPlot::NextColormapColor();
});

bind_fn("ImPlot_GetColormapSize", [](ImPlotColormap cmap) {
	return ImPlot::GetColormapSize(cmap);
});

bind_fn("ImPlot_GetColormapColor", [](int idx, ImPlotColormap cmap) {
	return ImPlot::GetColormapColor(idx, cmap);
});

bind_fn("ImPlot_SampleColormap", [](float t, ImPlotColormap cmap) {
	return ImPlot::SampleColormap(t, cmap);
});

bind_fn("ImPlot_ColormapButton", [](std::string label, ImVec2 size, ImPlotColormap cmap) {
	return ImPlot::ColormapButton(label.c_str(), size, cmap);
});

bind_fn("ImPlot_BustColorCache", [](std::string plot_title_id) {
	ImPlot::BustColorCache(plot_title_id.c_str());
});

bind_fn("ImPlot_GetInputMap", []() {
	return &ImPlot::GetInputMap();
}, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImPlot_MapInputDefault", [](ImPlotInputMap* dst) {
	ImPlot::MapInputDefault(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_MapInputReverse", [](ImPlotInputMap* dst) {
	ImPlot::MapInputReverse(dst);
}, allow_raw_ptrs{});

bind_fn("ImPlot_ItemIcon", [](ImVec4 col) {
	ImPlot::ItemIcon(col);
});

bind_fn("ImPlot_ItemIconImU32", [](ImU32 col) {
	ImPlot::ItemIcon(col);
});

bind_fn("ImPlot_ColormapIcon", [](ImPlotColormap cmap) {
	ImPlot::ColormapIcon(cmap);
});

// bind_fn("ImPlot_GetPlotDrawList", []() {
// 	return ImPlot::GetPlotDrawList();
// }, rvp_ref{}, allow_raw_ptrs{});

bind_fn("ImPlot_PushPlotClipRect", [](float expand) {
	ImPlot::PushPlotClipRect(expand);
});

bind_fn("ImPlot_PopPlotClipRect", []() {
	ImPlot::PopPlotClipRect();
});

bind_fn("ImPlot_ShowStyleSelector", [](std::string label) {
	return ImPlot::ShowStyleSelector(label.c_str());
});

bind_fn("ImPlot_ShowColormapSelector", [](std::string label) {
	return ImPlot::ShowColormapSelector(label.c_str());
});

bind_fn("ImPlot_ShowInputMapSelector", [](std::string label) {
	return ImPlot::ShowInputMapSelector(label.c_str());
});

bind_fn("ImPlot_ShowStyleEditor", [](ImPlotStyle* ref) {
	ImPlot::ShowStyleEditor(ref);
}, allow_raw_ptrs{});

bind_fn("ImPlot_ShowUserGuide", []() {
	ImPlot::ShowUserGuide();
});

bind_fn("ImPlot_ShowMetricsWindow", [](js_val p_popen) {
	auto param_p_popen = get_array_param<bool, 1>(p_popen);
	ImPlot::ShowMetricsWindow(param_p_popen.ptr);
	write_back_array_param(param_p_popen, p_popen);
});

bind_fn("ImPlot_ShowDemoWindow", [](js_val p_open) {
	auto param_p_open = get_array_param<bool, 1>(p_open);
	ImPlot::ShowDemoWindow(param_p_open.ptr);
	write_back_array_param(param_p_open, p_open);
});

}