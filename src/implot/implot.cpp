#include <util.hpp>

#include <implot.h>
#include <implot_internal.h>


EMSCRIPTEN_BINDINGS(implot) {

bind_struct<ImPlotContext>("ImPlotContext").constructor<>();

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
	return ImPlot::BeginSubplots(title_id.c_str(), rows, cols, size, flags);
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

// bind_fn("ImPlot_SetupAxisLinks", [](ImAxis axis, double* link_min, double* link_max) {
// 	ImPlot::SetupAxisLinks(axis, link_min, link_max);
// });

bind_fn("ImPlot_SetupAxisFormat", [](ImAxis axis, std::string fmt) {
	ImPlot::SetupAxisFormat(axis, fmt.c_str());
});

bind_fn("ImPlot_SetupFinish", []() {
	ImPlot::SetupFinish();
});

bind_fn("ImPlot_PlotLine", [](std::string label_id, js_val values, int count, double xscale, double xstart) {
	auto param_values = get_vector_param<double>(values);
	ImPlot::PlotLine(label_id.c_str(), param_values.ptr, count, xscale, xstart);
	write_back_vector_param(param_values, values);
});



// IMPLOT_API void SetNextAxisLimits(ImAxis axis, double v_min, double v_max, ImPlotCond cond = ImPlotCond_Once);
// // Links an upcoming axis range limits to external values. Set to nullptr for no linkage. The pointer data must remain valid until EndPlot!
// IMPLOT_API void SetNextAxisLinks(ImAxis axis, double* link_min, double* link_max);
// // Set an upcoming axis to auto fit to its data.
// IMPLOT_API void SetNextAxisToFit(ImAxis axis);

// // Sets the upcoming primary X and Y axes range limits. If ImPlotCond_Always is used, the axes limits will be locked (shorthand for two calls to SetupAxisLimits).
// IMPLOT_API void SetNextAxesLimits(double x_min, double x_max, double y_min, double y_max, ImPlotCond cond = ImPlotCond_Once);
// // Sets all upcoming axes to auto fit to their data.
// IMPLOT_API void SetNextAxesToFit();











// IMPLOT_API ImPlotColormap AddColormap(const char* name, const ImVec4* cols, int size, bool qual=true);
// IMPLOT_API ImPlotColormap AddColormap(const char* name, const ImU32*  cols, int size, bool qual=true);

// // Returns the number of available colormaps (i.e. the built-in + user-added count).
// IMPLOT_API int GetColormapCount();
// // Returns a null terminated string name for a colormap given an index. Returns nullptr if index is invalid.
// IMPLOT_API const char* GetColormapName(ImPlotColormap cmap);
// // Returns an index number for a colormap given a valid string name. Returns -1 if name is invalid.
// IMPLOT_API ImPlotColormap GetColormapIndex(const char* name);

// // Temporarily switch to one of the built-in (i.e. ImPlotColormap_XXX) or user-added colormaps (i.e. a return value of AddColormap). Don't forget to call PopColormap!
// IMPLOT_API void PushColormap(ImPlotColormap cmap);
// // Push a colormap by string name. Use built-in names such as "Default", "Deep", "Jet", etc. or a string you provided to AddColormap. Don't forget to call PopColormap!
// IMPLOT_API void PushColormap(const char* name);
// // Undo temporary colormap modification(s). Undo multiple pushes at once by increasing count.
// IMPLOT_API void PopColormap(int count = 1);

// // Returns the next color from the current colormap and advances the colormap for the current plot.
// // Can also be used with no return value to skip colors if desired. You need to call this between Begin/EndPlot!
// IMPLOT_API ImVec4 NextColormapColor();



// // Returns the size of a colormap.
// IMPLOT_API int GetColormapSize(ImPlotColormap cmap = IMPLOT_AUTO);
// // Returns a color from a colormap given an index >= 0 (modulo will be performed).
// IMPLOT_API ImVec4 GetColormapColor(int idx, ImPlotColormap cmap = IMPLOT_AUTO);
// // Sample a color from the current colormap given t between 0 and 1.
// IMPLOT_API ImVec4 SampleColormap(float t, ImPlotColormap cmap = IMPLOT_AUTO);



// // Shows a vertical color scale with linear spaced ticks using the specified color map. Use double hashes to hide label (e.g. "##NoLabel"). If scale_min > scale_max, the scale to color mapping will be reversed.
// IMPLOT_API void ColormapScale(const char* label, double scale_min, double scale_max, const ImVec2& size = ImVec2(0,0), const char* format = "%g", ImPlotColormapScaleFlags flags = 0, ImPlotColormap cmap = IMPLOT_AUTO);
// // Shows a horizontal slider with a colormap gradient background. Optionally returns the color sampled at t in [0 1].
// IMPLOT_API bool ColormapSlider(const char* label, float* t, ImVec4* out = nullptr, const char* format = "", ImPlotColormap cmap = IMPLOT_AUTO);
// // Shows a button with a colormap gradient background.
// IMPLOT_API bool ColormapButton(const char* label, const ImVec2& size = ImVec2(0,0), ImPlotColormap cmap = IMPLOT_AUTO);
// IMPLOT_API void BustColorCache(const char* plot_title_id = nullptr);



// IMPLOT_API ImPlotInputMap& GetInputMap();
// // Default input mapping: pan = LMB drag, box select = RMB drag, fit = LMB double click, context menu = RMB click, zoom = scroll.
// IMPLOT_API void MapInputDefault(ImPlotInputMap* dst = nullptr);
// // Reverse input mapping: pan = RMB drag, box select = LMB drag, fit = LMB double click, context menu = RMB click, zoom = scroll.
// IMPLOT_API void MapInputReverse(ImPlotInputMap* dst = nullptr);



// IMPLOT_API void ItemIcon(const ImVec4& col);
// IMPLOT_API void ItemIcon(ImU32 col);
// IMPLOT_API void ColormapIcon(ImPlotColormap cmap);



// // Get the plot draw list for custom rendering to the current plot area. Call between Begin/EndPlot.
// IMPLOT_API ImDrawList* GetPlotDrawList();
// // Push clip rect for rendering to current plot area. The rect can be expanded or contracted by #expand pixels. Call between Begin/EndPlot.
// IMPLOT_API void PushPlotClipRect(float expand=0);
// // Pop plot clip rect. Call between Begin/EndPlot.
// IMPLOT_API void PopPlotClipRect();



// // Shows ImPlot style selector dropdown menu.
// IMPLOT_API bool ShowStyleSelector(const char* label);
// // Shows ImPlot colormap selector dropdown menu.
// IMPLOT_API bool ShowColormapSelector(const char* label);
// // Shows ImPlot input map selector dropdown menu.
// IMPLOT_API bool ShowInputMapSelector(const char* label);
// // Shows ImPlot style editor block (not a window).
// IMPLOT_API void ShowStyleEditor(ImPlotStyle* ref = nullptr);
// // Add basic help/info block for end users (not a window).
// IMPLOT_API void ShowUserGuide();
// // Shows ImPlot metrics/debug information window.
// IMPLOT_API void ShowMetricsWindow(bool* p_popen = nullptr);



bind_fn("ImPlot_ShowDemoWindow", [](js_val p_open) {
	auto param_p_open = get_array_param<bool, 1>(p_open);
	ImPlot::ShowDemoWindow(param_p_open.ptr);
	write_back_array_param(param_p_open, p_open);
});

}