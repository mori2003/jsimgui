// @ts-nocheck

// [EXPERIMENTAL | INCOMPLETE]
// Manually written bindings for implot:
// https://github.com/epezent/implot using version `v1.0`

import { Mod, ReferenceStruct, ImVec2, ImVec4 } from "./imgui.js";

/** Indicates variable should deduced automatically. */
const IMPLOT_AUTO = -1;
/** Special color used to indicate that a color should be deduced automatically. */
//const IMPLOT_AUTO_COL = new ImVec4(0, 0, 0, -1);

//-----------------------------------------------------------------------------
// [SECTION] Enums and Types
//-----------------------------------------------------------------------------

export type ImAxis = number;
export type ImPlotProp = number;
export type ImPlotFlags = number;
export type ImPlotAxisFlags = number;
export type ImPlotSubplotFlags = number;
export type ImPlotLegendFlags = number;
export type ImPlotMouseTextFlags = number;
export type ImPlotDragToolFlags = number;
export type ImPlotColormapScaleFlags = number;

export type ImPlotItemFlags = number;
export type ImPlotLineFlags = number;
export type ImPlotScatterFlags = number;
export type ImPlotBubblesFlags = number;
export type ImPlotPolygonFlags = number;
export type ImPlotStairsFlags = number;
export type ImPlotShadedFlags = number;
export type ImPlotBarsFlags = number;
export type ImPlotBarGroupsFlags = number;
export type ImPlotErrorBarsFlags = number;
export type ImPlotStemsFlags = number;
export type ImPlotInfLinesFlags = number;
export type ImPlotPieChartFlags = number;
export type ImPlotHeatmapFlags = number;
export type ImPlotHistogramFlags = number;
export type ImPlotDigitalFlags = number;
export type ImPlotImageFlags = number;
export type ImPlotTextFlags = number;
export type ImPlotDummyFlags = number;

export type ImPlotCond = number;
export type ImPlotCol = number;
export type ImPlotStyleVar = number;
export type ImPlotScale = number;
export type ImPlotMarker = number;
export type ImPlotColormap = number;
export type ImPlotLocation = number;
export type ImPlotBin = number;

/**
 * Axis indices. The values assigned may change; NEVER hardcode these.
 */
export const ImAxis = {
	// horizontal axes
	X1: 0, // enabled by default
	X2: 1, // disabled by default
	X3: 2, // disabled by default
	// vertical axes
	Y1: 3, // enabled by default
	Y2: 4, // disabled by default
	Y3: 5, // disabled by default
	// bookkeeping
	COUNT: 6,
} as const;

export class ImPlotPoint {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static From(obj: { x: number; y: number }): ImPlotPoint {
		return new ImPlotPoint(obj.x, obj.y);
	}
}

export class ImPlotRange {
	Min: number;
	Max: number;

	constructor(_min: number, _max: number) {
		this.Min = _min;
		this.Max = _max;
	}
}

export class ImPlotContextPtr extends ReferenceStruct {}
export class ImPlotStylePtr extends ReferenceStruct {}
export class ImPlotInputMapPtr extends ReferenceStruct {}

export class ImPlot {
	/**
	 * Creates a new ImPlot context. Call this after ImGui::CreateContext.
	 */
	static CreateContext(): ImPlotContextPtr {
		return ImPlotContextPtr.From(Mod.export.ImPlot_CreateContext());
	}

	/**
	 * Destroys an ImPlot context. Call this before ImGui::DestroyContext. nullptr = destroy current context.
	 */
	static DestroyContext(ctx: ImPlotContextPtr | null = null): void {
		Mod.export.ImPlot_DestroyContext(ctx?.ptr ?? null);
	}

	/**
	 * Returns the current ImPlot context. nullptr if no context has ben set.
	 */
	static GetCurrentContext(): ImPlotContextPtr {
		return ImPlotContextPtr.From(Mod.export.ImPlot_GetCurrentContext());
	}

	/**
	 * Sets the current ImPlot context.
	 */
	static SetCurrentContext(ctx: ImPlotContextPtr | null = null): void {
		Mod.export.ImPlot_SetCurrentContext(ctx?.ptr ?? null);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Begin/End Plot
	//-----------------------------------------------------------------------------

	/** Starts a 2D plotting context. If this function returns true, EndPlot() MUST
	 * be called! You are encouraged to use the following convention:
	 *
	 * if (BeginPlot(...)) {
	 *     PlotLine(...);
	 *     ...
	 *     EndPlot();
	 * }
	 *
	 * Important notes:
	 *
	 * - #title_id must be unique to the current ImGui ID scope. If you need to avoid ID
	 *   collisions or don't want to display a title in the plot, use double hashes
	 *   (e.g. "MyPlot##HiddenIdText" or "##NoTitle").
	 * - #size is the **frame** size of the plot widget, not the plot area. The default
	 *   size of plots (i.e. when ImVec2(0,0)) can be modified in your ImPlotStyle.
	 */
	static BeginPlot(
		title_id: string,
		size: ImVec2 = new ImVec2(-1, 0),
		flags: ImPlotFlags = 0,
	): boolean {
		return Mod.export.ImPlot_BeginPlot(title_id, size, flags);
	}

	/**
	 * Only call EndPlot() if BeginPlot() returns true!
	 * Typically called at the end of an if statement conditioned on BeginPlot().
	 * See example above.
	 */
	static EndPlot(): void {
		Mod.export.ImPlot_EndPlot();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Begin/End Subplots
	//-----------------------------------------------------------------------------

	/**
	 * Starts a subdivided plotting context. If the function returns true,
	 * EndSubplots() MUST be called! Call BeginPlot/EndPlot AT MOST [rows*cols]
	 * times in  between the beginning and end of the subplot context. Plots are
	 * added in row major order.
	 *
	 * Example:
	 *
	 * if (BeginSubplots("My Subplot",2,3,ImVec2(800,400)) {
	 *     for (int i = 0; i < 6; ++i) {
	 *         if (BeginPlot(...)) {
	 *             ImPlot::PlotLine(...);
	 *             ...
	 *             EndPlot();
	 *         }
	 *     }
	 *     EndSubplots();
	 * }
	 *
	 * Produces:
	 *
	 * [0] | [1] | [2]
	 * ----|-----|----
	 * [3] | [4] | [5]
	 *
	 * Important notes:
	 *
	 * - #title_id must be unique to the current ImGui ID scope. If you need to avoid ID
	 *   collisions or don't want to display a title in the plot, use double hashes
	 *   (e.g. "MySubplot##HiddenIdText" or "##NoTitle").
	 * - #rows and #cols must be greater than 0.
	 * - #size is the size of the entire grid of subplots, not the individual plots
	 * - #row_ratios and #col_ratios must have AT LEAST #rows and #cols elements,
	 *   respectively. These are the sizes of the rows and columns expressed in ratios.
	 *   If the user adjusts the dimensions, the arrays are updated with new ratios.
	 *
	 * Important notes regarding BeginPlot from inside of BeginSubplots:
	 *
	 * - The #title_id parameter of _BeginPlot_ (see above) does NOT have to be
	 *   unique when called inside of a subplot context. Subplot IDs are hashed
	 *   for your convenience so you don't have call PushID or generate unique title
	 *   strings. Simply pass an empty string to BeginPlot unless you want to title
	 *   each subplot.
	 * - The #size parameter of _BeginPlot_ (see above) is ignored when inside of a
	 *   subplot context. The actual size of the subplot will be based on the
	 *   #size value you pass to _BeginSubplots_ and #row/#col_ratios if provided.
	 */
	static BeginSubplots(
		title_id: string,
		rows: number,
		cols: number,
		size: ImVec2,
		flags: ImPlotSubplotFlags = 0,
		row_ratios: number[] = null,
		col_ratios: number[] = null,
	): boolean {
		return Mod.export.ImPlot_BeginSubplots(
			title_id,
			rows,
			cols,
			size,
			flags,
			row_ratios,
			col_ratios,
		);
	}

	/**
	 * Only call EndSubplots() if BeginSubplots() returns true! Typically called at the end
	 * of an if statement conditioned on BeginSubplots(). See example above.
	 */
	static EndSubplots(): void {
		Mod.export.ImPlot_EndSubplots();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Setup
	//-----------------------------------------------------------------------------

	/**
	 * Enables an axis or sets the label and/or flags for an existing axis. Leave #label = nullptr for no label.
	 */
	static SetupAxis(axis: ImAxis, label: string, flags: ImPlotAxisFlags = 0): void {
		Mod.export.ImPlot_SetupAxis(axis, label, flags);
	}

	// Sets an axis range limits. If ImPlotCond_Always is used, the axes limits will be locked. Inversion with v_min > v_max is not supported; use SetupAxisLimits instead.
	static SetupAxisLimits(
		axis: ImAxis,
		v_min: number,
		v_max: number,
		cond: ImPlotCond = ImPlotCond.Once,
	): void {
		Mod.export.ImPlot_SetupAxisLimits(axis, v_min, v_max, cond);
	}

	/**
	 * Links an axis range limits to external values. Set to nullptr for no linkage. The pointer data must remain valid until EndPlot.
	 */
	static SetupAxisLinks(axis: ImAxis, link_min: number[], link_max: number[]): void {
		Mod.export.ImPlot_SetupAxisLinks(axis, link_min, link_max);
	}

	/**
	 * Sets the format of numeric axis labels via formatter specifier (default="%g"). Formatted values will be double (i.e. use %f).
	 */
	static SetupAxisFormat(axis: ImAxis, fmt: string): void {
		Mod.export.ImPlot_SetupAxisFormat(axis, fmt);
	}

	/**
	 * Sets an axis' ticks and optionally the labels. To keep the default ticks, set #keep_default=true.
	 */
	static SetupAxisTicks(
		axis: ImAxis,
		values: number[],
		n_ticks: number,
		labels: string[] = null,
		keep_default: boolean = false,
	): void {
		Mod.export.ImPlot_SetupAxisTicks(axis, values, n_ticks, labels, keep_default);
	}

	/**
	 * Sets an axis' scale using built-in options.
	 */
	static SetupAxisScale(axis: ImAxis, scale: ImPlotScale): void {
		Mod.export.ImPlot_SetupAxisScale(axis, scale);
	}

	/**
	 * Sets an axis' limits constraints.
	 */
	static SetupAxisLimitsConstraints(axis: ImAxis, v_min: number, v_max: number): void {
		Mod.export.ImPlot_SetupAxisLimitsConstraints(axis, v_min, v_max);
	}

	/**
	 * Sets an axis' zoom constraints.
	 */
	static SetupAxisZoomConstraints(axis: ImAxis, z_min: number, z_max: number): void {
		Mod.export.ImPlot_SetupAxisZoomConstraints(axis, z_min, z_max);
	}

	/**
	 * Sets the label and/or flags for primary X and Y axes (shorthand for two calls to SetupAxis).
	 */
	static SetupAxes(
		x_label: string,
		y_label: string,
		x_flags: ImPlotAxisFlags = 0,
		y_flags: ImPlotAxisFlags = 0,
	): void {
		Mod.export.ImPlot_SetupAxes(x_label, y_label, x_flags, y_flags);
	}

	/**
	 * Sets the primary X and Y axes range limits. If ImPlotCond_Always is used, the axes limits will be locked (shorthand for two calls to SetupAxisLimits).
	 */
	static SetupAxesLimits(
		x_min: number,
		x_max: number,
		y_min: number,
		y_max: number,
		cond: ImPlotCond = ImPlotCond.Once,
	): void {
		Mod.export.ImPlot_SetupAxesLimits(x_min, x_max, y_min, y_max, cond);
	}

	/**
	 * Sets up the plot legend. This can also be called immediately after BeginSubplots when using ImPlotSubplotFlags_ShareItems.
	 */
	static SetupLegend(location: ImPlotLocation, flags: ImPlotLegendFlags = 0): void {
		Mod.export.ImPlot_SetupLegend(location, flags);
	}

	/**
	 * Set the location of the current plot's mouse position text (default = South|East).
	 */
	static SetupMouseText(location: ImPlotLocation, flags: ImPlotMouseTextFlags = 0): void {
		Mod.export.ImPlot_SetupMouseText(location, flags);
	}

	/**
	 * Explicitly finalize plot setup. Once you call this, you cannot make anymore Setup calls for the current plot!
	 * Note that calling this function is OPTIONAL; it will be called by the first subsequent setup-locking API call.
	 */
	static SetupFinish(): void {
		Mod.export.ImPlot_SetupFinish();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] SetNext
	//-----------------------------------------------------------------------------

	// Though you should default to the `Setup` API above, there are some scenarios
	// where (re)configuring a plot or axis before `BeginPlot` is needed (e.g. if
	// using a preceding button or slider widget to change the plot limits). In
	// this case, you can use the `SetNext` API below. While this is not as feature
	// rich as the Setup API, most common needs are provided. These functions can be
	// called anywhere except for inside of `Begin/EndPlot`. For example:

	// if (ImGui::Button("Center Plot"))
	//     ImPlot::SetNextPlotLimits(-1,1,-1,1);
	// if (ImPlot::BeginPlot(...)) {
	//     ...
	//     ImPlot::EndPlot();
	// }
	//
	// Important notes:
	//
	// - You must still enable non-default axes with SetupAxis for these functions
	//   to work properly.

	/**
	 * Sets an upcoming axis range limits. If ImPlotCond_Always is used, the axes limits will be locked.
	 */
	static SetNextAxisLimits(
		axis: ImAxis,
		v_min: number,
		v_max: number,
		cond: ImPlotCond = ImPlotCond.Once,
	): void {
		Mod.export.ImPlot_SetNextAxisLimits(axis, v_min, v_max, cond);
	}

	/**
	 * Links an upcoming axis range limits to external values. Set to nullptr for no linkage. The pointer data must remain valid until EndPlot!
	 */
	static SetNextAxisLinks(axis: ImAxis, link_min: number[], link_max: number[]): void {
		Mod.export.ImPlot_SetNextAxisLinks(axis, link_min, link_max);
	}

	/**
	 * Set an upcoming axis to auto fit to its data.
	 */
	static SetNextAxisToFit(axis: ImAxis): void {
		Mod.export.ImPlot_SetNextAxisToFit(axis);
	}

	/**
	 * Sets the upcoming primary X and Y axes range limits. If ImPlotCond_Always is used, the axes limits will be locked (shorthand for two calls to SetupAxisLimits).
	 */
	static SetNextAxesLimits(
		x_min: number,
		x_max: number,
		y_min: number,
		y_max: number,
		cond: ImPlotCond = ImPlotCond.Once,
	): void {
		Mod.export.ImPlot_SetNextAxesLimits(x_min, x_max, y_min, y_max, cond);
	}

	/**
	 * Sets all upcoming axes to auto fit to their data.
	 */
	static SetNextAxesToFit(): void {
		Mod.export.ImPlot_SetNextAxesToFit();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Plot Items
	//-----------------------------------------------------------------------------

	// The main plotting API is provided below. Call these functions between
	// Begin/EndPlot and after any Setup API calls. Each plots data on the current
	// x and y axes, which can be changed with `SetAxis/Axes`.
	//
	// The templated functions are explicitly instantiated in implot_items.cpp.
	// They are not intended to be used generically with custom types. You will get
	// a linker error if you try! All functions support the following scalar types:
	//
	// float, double, ImS8, ImU8, ImS16, ImU16, ImS32, ImU32, ImS64, ImU64
	//
	//
	// If you need to plot custom or non-homogenous data you have a few options:
	//
	// 1. If your data is a simple struct/class (e.g. Vector2f), you can use striding in your ImPlotSpec.
	//    This is the most performant option if applicable.
	//
	//    struct Vector2f { float X, Y; };
	//    ...
	//    Vector2f data[42];
	//    ImPlot::PlotLine("line", &data[0].x, &data[0].y, 42, {ImPlotProp_Stride, sizeof(Vector2f});
	//
	// 2. Write a custom getter C function or C++ lambda and pass it and optionally your data to
	//    an ImPlot function post-fixed with a G (e.g. PlotScatterG). This has a slight performance
	//    cost, but probably not enough to worry about unless your data is very large. Examples:
	//
	//    ImPlotPoint MyDataGetter(int idx, void* data) {
	//        MyData* my_data = (MyData*)data;
	//        ImPlotPoint p;
	//        p.x = my_data->GetTime(idx);
	//        p.y = my_data->GetValue(idx);
	//        return p
	//    }
	//    ...
	//    auto my_lambda = [](int idx, void*) {
	//        double t = idx / 999.0;
	//        return ImPlotPoint(t, 0.5+0.5*std::sin(2*PI*10*t));
	//    };
	//    ...
	//    if (ImPlot::BeginPlot("MyPlot")) {
	//        MyData my_data;
	//        ImPlot::PlotScatterG("scatter", MyDataGetter, &my_data, my_data.Size());
	//        ImPlot::PlotLineG("line", my_lambda, nullptr, 1000);
	//        ImPlot::EndPlot();
	//    }
	//
	// NB: All types are converted to double before plotting. You may lose information
	// if you try plotting extremely large 64-bit integral types. Proceed with caution!

	/**
	 * Plots a standard 2D line plot.
	 */
	static PlotLine(
		label_id: string,
		values: number[],
		count: number,
		xscale: number,
		xstart: number,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotLine(label_id, values, count, xscale, xstart);
	}

	/**
	 * Plots a standard 2D scatter plot. Default marker is ImPlotMarker_Circle.
	 */
	static PlotScatter(
		label_id: string,
		values: number[],
		count: number,
		xscale: number = 1,
		xstart: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotScatter(label_id, values, count, xscale, xstart);
	}

	/**
	 * Plots a bubble graph. #szs are the radius of each bubble in plot units.
	 */
	static PlotBubbles(
		label_id: string,
		values: number[],
		szs: number[],
		count: number,
		xscale: number = 1,
		xstart: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotBubbles(label_id, values, szs, count, xscale, xstart);
	}

	/**
	 * Plots a polygon. Points are specified in counter-clockwise order. If concave, make sure to set the Concave flag.
	 */
	static PlotPolygon(
		label_id: string,
		xs: number[],
		ys: number[],
		count: number,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotPolygon(label_id, xs, ys, count);
	}

	/**
	 * Plots a a stairstep graph. The y value is continued constantly to the right from every x position, i.e. the interval [x[i], x[i+1]) has the value y[i]
	 */
	static PlotStairs(
		label_id: string,
		values: number[],
		count: number,
		xscale: number = 1,
		xstart: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotStairs(label_id, values, count, xscale, xstart);
	}

	/**
	 * Plots a shaded (filled) region between two lines, or a line and a horizontal reference. Set yref to +/-INFINITY for infinite fill extents.
	 */
	static PlotShaded(
		label_id: string,
		values: number[],
		count: number,
		yref: number = 0,
		xscale: number = 1,
		xstart: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotShaded(label_id, values, count, yref, xscale, xstart);
	}

	/**
	 * Plots a bar graph. Vertical by default. #bar_size and #shift are in plot units.
	 */
	static PlotBars(
		label_id: string,
		values: number[],
		count: number,
		bar_size: number = 0.67,
		shift: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotBars(label_id, values, count, bar_size, shift);
	}

	/**
	 * Plots a group of bars. #values is a row-major matrix with #item_count rows and #group_count cols. #label_ids should have #item_count elements.
	 */
	static PlotBarGroups(
		label_ids: string[],
		values: number[],
		item_count: number,
		group_count: number,
		group_size: number = 0.67,
		shift: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotBarGroups(label_ids, values, item_count, group_count, group_size, shift);
	}

	/**
	 * Plots vertical error bar. The label_id should be the same as the label_id of the associated line or bar plot.
	 */
	static PlotErrorBars(
		label_id: string,
		xs: number[],
		ys: number[],
		err: number[],
		count: number,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotErrorBars(label_id, xs, ys, err, count);
	}

	/**
	 * Plots stems. Vertical by default.
	 */
	static PlotStems(
		label_id: string,
		values: number[],
		count: number,
		ref: number = 0,
		scale: number = 1,
		start: number = 0,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotStems(label_id, values, count, ref, scale, start);
	}

	/**
	 * Plots infinite vertical or horizontal lines (e.g. for references or asymptotes).
	 */
	static PlotInfLines(
		label_id: string,
		values: number[],
		count: number,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotInfLines(label_id, values, count);
	}

	// /**
	//  * Plots a pie chart. Center and radius are in plot units. #label_fmt can be set to nullptr for no labels.
	//  */
	// static PlotPieChart(
	// 	label_ids: string[],
	// 	values: number[],
	// 	count: number,
	// 	x: number,
	// 	y: number,
	// 	radius: number,
	// 	fmt: ImPlotFormatter,
	// 	// fmt_data: void | null = null,
	// 	angle0: number = 90,
	// 	// spec: ImPlotSpec = new ImPlotSpec(),
	// ): void {
	// 	Mod.export.ImPlot_PlotPieChart(label_ids, values, count, x, y, radius, fmt, angle0);
	// }

	/**
	 * Plots a 2D heatmap chart. Values are expected to be in row-major order by default. Leave #scale_min and scale_max both at 0 for automatic color scaling, or set them to a predefined range. #label_fmt can be set to nullptr for no labels.
	 */
	static PlotHeatmap(
		label_id: string,
		values: number[],
		rows: number,
		cols: number,
		scale_min: number = 0,
		scale_max: number = 0,
		label_fmt: string = "%.1f",
		bounds_min: ImPlotPoint = new ImPlotPoint(0, 0),
		bounds_max: ImPlotPoint = new ImPlotPoint(1, 1),
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotHeatmap(
			label_id,
			values,
			rows,
			cols,
			scale_min,
			scale_max,
			label_fmt,
			bounds_min,
			bounds_max,
		);
	}

	/**
	 * Plots a horizontal histogram. #bins can be a positive integer or an ImPlotBin_ method. If #range is left unspecified, the min/max of #values will be used as the range.
	 * Otherwise, outlier values outside of the range are not binned. The largest bin count or density is returned.
	 */
	static PlotHistogram(
		label_id: string,
		values: number[],
		count: number,
		bins: number = ImPlotBin.Sturges,
		bar_scale: number = 1.0,
		range: ImPlotRange = new ImPlotRange(),
		// spec: ImPlotSpec = new ImPlotSpec(),
	): number {
		return Mod.export.ImPlot_PlotHistogram(label_id, values, count, bins, bar_scale, range);
	}

	/**
	 * Plots two dimensional, bivariate histogram as a heatmap. #x_bins and #y_bins can be a positive integer or an ImPlotBin. If #range is left unspecified, the min/max of
	 * #xs an #ys will be used as the ranges. Otherwise, outlier values outside of range are not binned. The largest bin count or density is returned.
	 */
	static PlotHistogram2D(
		label_id: string,
		xs: number[],
		ys: number[],
		count: number,
		x_bins: number = ImPlotBin.Sturges,
		y_bins: number = ImPlotBin.Sturges,
		range: ImPlotRect = new ImPlotRect(),
		// spec: ImPlotSpec = new ImPlotSpec(),
	): number {
		return Mod.export.ImPlot_PlotHistogram2D(label_id, xs, ys, count, x_bins, y_bins, range);
	}

	/**
	 * Plots digital data. Digital plots do not respond to y drag or zoom, and are always referenced to the bottom of the plot.
	 */
	static PlotDigital(
		label_id: string,
		xs: number[],
		ys: number[],
		count: number,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotDigital(label_id, xs, ys, count, spec);
	}

	/**
	 * Plots an axis-aligned image. #bounds_min/bounds_max are in plot coordinates (y-up) and #uv0/uv1 are in texture coordinates (y-down).
	 */
	static PlotImage(
		label_id: string,
		tex_ref: ImTextureRef,
		bounds_min: ImPlotPoint,
		bounds_max: ImPlotPoint,
		uv0: ImVec2 = new ImVec2(0, 0),
		uv1: ImVec2 = new ImVec2(1, 1),
		tint_col: ImVec4 = new ImVec4(1, 1, 1, 1),
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotImage(label_id, tex_ref, bounds_min, bounds_max, uv0, uv1, tint_col);
	}

	/**
	 * Plots a centered text label at point x,y with an optional pixel offset. Text color can be changed with ImPlot::PushStyleColor(ImPlotCol_InlayText, ...).
	 */
	static PlotText(
		text: string,
		x: number,
		y: number,
		pix_offset: ImVec2 = new ImVec2(0, 0),
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotText(text, x, y, pix_offset);
	}

	/**
	 * Plots a dummy item (i.e. adds a legend entry colored by ImPlotCol_Line)
	 */
	static PlotDummy(
		label_id: string,
		// spec: ImPlotSpec = new ImPlotSpec(),
	): void {
		Mod.export.ImPlot_PlotDummy(label_id, spec);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Plot Tools
	//-----------------------------------------------------------------------------

	// The following can be used to render interactive elements and/or annotations.
	// Like the item plotting functions above, they apply to the current x and y
	// axes, which can be changed with `SetAxis/SetAxes`. These functions return true
	// when user interaction causes the provided coordinates to change. Additional
	// user interactions can be retrieved through the optional output parameters.

	// 	// Shows a draggable point at x,y. #col defaults to ImGuiCol_Text.
	// IMPLOT_API bool DragPoint(int id, double* x, double* y, const ImVec4& col, float size = 4, ImPlotDragToolFlags flags = 0, bool* out_clicked = nullptr, bool* out_hovered = nullptr, bool* out_held = nullptr);
	// // Shows a draggable vertical guide line at an x-value. #col defaults to ImGuiCol_Text.
	// IMPLOT_API bool DragLineX(int id, double* x, const ImVec4& col, float thickness = 1, ImPlotDragToolFlags flags = 0, bool* out_clicked = nullptr, bool* out_hovered = nullptr, bool* out_held = nullptr);
	// // Shows a draggable horizontal guide line at a y-value. #col defaults to ImGuiCol_Text.
	// IMPLOT_API bool DragLineY(int id, double* y, const ImVec4& col, float thickness = 1, ImPlotDragToolFlags flags = 0, bool* out_clicked = nullptr, bool* out_hovered = nullptr, bool* out_held = nullptr);

	// /**
	//  * Shows a draggable and resizeable rectangle.
	//  */
	// static DragRect(
	// 	id: number,
	// 	x1: number,
	// 	y1: number,
	// 	x2: number,
	// 	y2: number,
	// 	col: ImVec4,
	// 	flags: ImPlotDragToolFlags = 0,
	// 	out_clicked: [boolean] | null = null,
	// 	out_hovered: [boolean] | null = null,
	// 	out_held: [boolean] | null = null,
	// ): boolean {
	// 	return Mod.export.ImPlot_DragRect(
	// 		id,
	// 		x1,
	// 		y1,
	// 		x2,
	// 		y2,
	// 		col,
	// 		flags,
	// 		out_clicked,
	// 		out_hovered,
	// 		out_held,
	// 	);
	// }

	/**
	 * Shows an annotation callout at a chosen point. Clamping keeps annotations in the plot area. Annotations are always rendered on top.
	 */
	static Annotation(
		x: number,
		y: number,
		col: ImVec4,
		pix_offset: ImVec2,
		clamp: boolean,
		round: boolean = false,
	): void {
		Mod.export.ImPlot_Annotation(x, y, col, pix_offset, clamp, round);
	}

	/**
	 * Shows a x-axis tag at the specified coordinate value.
	 */
	static TagX(x: number, col: ImVec4, round: boolean = false): void {
		Mod.export.ImPlot_TagX(x, col, round);
	}

	/**
	 * Shows a y-axis tag at the specified coordinate value.
	 */
	static TagY(y: number, col: ImVec4, round: boolean = false): void {
		Mod.export.ImPlot_TagY(y, col, round);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Plot Utils
	//-----------------------------------------------------------------------------

	/**
	 * Select which axis/axes will be used for subsequent plot elements.
	 */
	static SetAxis(axis: ImAxis): void {
		Mod.export.ImPlot_SetAxis(axis);
	}

	/**
	 * Select which axis/axes will be used for subsequent plot elements.
	 */
	static SetAxes(x_axis: ImAxis, y_axis: ImAxis): void {
		Mod.export.ImPlot_SetAxes(x_axis, y_axis);
	}

	/**
	 * Convert pixels to a position in the current plot's coordinate system. Passing IMPLOT_AUTO uses the current axes.
	 */
	static PixelsToPlotImVec2(
		pix: ImVec2,
		x_axis: ImAxis = IMPLOT_AUTO,
		y_axis: ImAxis = IMPLOT_AUTO,
	): ImPlotPoint {
		return ImPlotPoint.From(Mod.export.ImPlot_PixelsToPlot(pix, x_axis, y_axis));
	}

	/**
	 * Convert pixels to a position in the current plot's coordinate system. Passing IMPLOT_AUTO uses the current axes.
	 */
	static PixelsToPlot(
		x: number,
		y: number,
		x_axis: ImAxis = IMPLOT_AUTO,
		y_axis: ImAxis = IMPLOT_AUTO,
	): ImPlotPoint {
		return ImPlotPoint.From(Mod.export.ImPlot_PixelsToPlot(x, y, x_axis, y_axis));
	}

	/**
	 * Convert a position in the current plot's coordinate system to pixels. Passing IMPLOT_AUTO uses the current axes.
	 */
	static PlotToPixelsImVec2(
		pix: ImVec2,
		x_axis: ImAxis = IMPLOT_AUTO,
		y_axis: ImAxis = IMPLOT_AUTO,
	): ImVec2 {
		return ImVec2.From(Mod.export.ImPlot_PlotToPixels(pix, x_axis, y_axis));
	}

	/**
	 * Convert a position in the current plot's coordinate system to pixels. Passing IMPLOT_AUTO uses the current axes.
	 */
	static PlotToPixels(
		x: number,
		y: number,
		x_axis: ImAxis = IMPLOT_AUTO,
		y_axis: ImAxis = IMPLOT_AUTO,
	): ImVec2 {
		return ImVec2.From(Mod.export.ImPlot_PlotToPixels(x, y, x_axis, y_axis));
	}

	/**
	 * Get the current Plot position (top-left) in pixels.
	 */
	static GetPlotPos(): ImVec2 {
		return ImVec2.From(Mod.export.ImPlot_GetPlotPos());
	}

	/**
	 * Get the current Plot size in pixels.
	 */
	static GetPlotSize(): ImVec2 {
		return ImVec2.From(Mod.export.ImPlot_GetPlotSize());
	}

	/**
	 * Returns the mouse position in x,y coordinates of the current plot. Passing IMPLOT_AUTO uses the current axes.
	 */
	static GetPlotMousePos(x_axis: ImAxis = IMPLOT_AUTO, y_axis: ImAxis = IMPLOT_AUTO): ImPlotPoint {
		return ImPlotPoint.From(Mod.export.ImPlot_GetPlotMousePos(x_axis, y_axis));
	}

	/**
	 * Returns the current plot axis range.
	 */
	static GetPlotLimits(x_axis: ImAxis = IMPLOT_AUTO, y_axis: ImAxis = IMPLOT_AUTO): ImPlotRect {
		return ImPlotRect.From(Mod.export.ImPlot_GetPlotLimits(x_axis, y_axis));
	}

	/**
	 * Returns true if the plot area in the current plot is hovered.
	 */
	static IsPlotHovered(): boolean {
		return Mod.export.ImPlot_IsPlotHovered();
	}

	/**
	 * Returns true if the axis label area in the current plot is hovered.
	 */
	static IsAxisHovered(axis: ImAxis): boolean {
		return Mod.export.ImPlot_IsAxisHovered(axis);
	}

	/**
	 * Returns true if the bounding frame of a subplot is hovered.
	 */
	static IsSubplotsHovered(): boolean {
		return Mod.export.ImPlot_IsSubplotsHovered();
	}

	/**
	 * Returns true if the current plot is being box selected.
	 */
	static IsPlotSelected(): boolean {
		return Mod.export.ImPlot_IsPlotSelected();
	}
	/**
	 * Returns the current plot box selection bounds. Passing IMPLOT_AUTO uses the current axes.
	 */
	static GetPlotSelection(x_axis: ImAxis = IMPLOT_AUTO, y_axis: ImAxis = IMPLOT_AUTO): ImPlotRect {
		return ImPlotRect.From(Mod.export.ImPlot_GetPlotSelection(x_axis, y_axis));
	}

	/**
	 * Cancels a the current plot box selection.
	 */
	static CancelPlotSelection(): void {
		Mod.export.ImPlot_CancelPlotSelection();
	}

	/**
	 * Hides or shows the next plot item (i.e. as if it were toggled from the legend).
	 * Use ImPlotCond_Always if you need to forcefully set this every frame.
	 */
	static HideNextItem(hidden: boolean = true, cond: ImPlotCond = ImPlotCond.Once): void {
		Mod.export.ImPlot_HideNextItem(hidden, cond);
	}

	// Use the following around calls to Begin/EndPlot to align l/r/t/b padding.
	// Consider using Begin/EndSubplots first. They are more feature rich and
	// accomplish the same behaviour by default. The functions below offer lower
	// level control of plot alignment.

	/**
	 * Align axis padding over multiple plots in a single row or column. #group_id must
	 * be unique. If this function returns true, EndAlignedPlots() must be called.
	 */
	static BeginAlignedPlots(group_id: string, vertical: boolean = true): boolean {
		return Mod.export.ImPlot_BeginAlignedPlots(group_id, vertical);
	}

	/**
	 * Only call EndAlignedPlots() if BeginAlignedPlots() returns true!
	 */
	static EndAlignedPlots(): void {
		Mod.export.ImPlot_EndAlignedPlots();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Legend Utils
	//-----------------------------------------------------------------------------

	/**
	 * Begin a popup for a legend entry.
	 */
	static BeginLegendPopup(label_id: string, mouse_button: ImGuiMouseButton = 1): boolean {
		return Mod.export.ImPlot_BeginLegendPopup(label_id, mouse_button);
	}

	/**
	 * End a popup for a legend entry.
	 */
	static EndLegendPopup(): void {
		Mod.export.ImPlot_EndLegendPopup();
	}

	/**
	 * Returns true if a plot item legend entry is hovered.
	 */
	static IsLegendEntryHovered(label_id: string): boolean {
		return Mod.export.ImPlot_IsLegendEntryHovered(label_id);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Drag and Drop
	//-----------------------------------------------------------------------------

	/**
	 * Turns the current plot's plotting area into a drag and drop target. Don't forget to call EndDragDropTarget!
	 */
	static BeginDragDropTargetPlot(): boolean {
		return Mod.export.ImPlot_BeginDragDropTargetPlot();
	}

	/**
	 * Turns the current plot's X-axis into a drag and drop target. Don't forget to call EndDragDropTarget!
	 */
	static BeginDragDropTargetAxis(axis: ImAxis): boolean {
		return Mod.export.ImPlot_BeginDragDropTargetAxis(axis);
	}

	/**
	 * Turns the current plot's legend into a drag and drop target. Don't forget to call EndDragDropTarget!
	 */
	static BeginDragDropTargetLegend(): boolean {
		return Mod.export.ImPlot_BeginDragDropTargetLegend();
	}

	/**
	 * Ends a drag and drop target (currently just an alias for ImGui::EndDragDropTarget).
	 */
	static EndDragDropTarget(): void {
		Mod.export.ImPlot_EndDragDropTarget();
	}

	// NB: By default, plot and axes drag and drop *sources* require holding the Ctrl modifier to initiate the drag.
	// You can change the modifier if desired. If ImGuiMod_None is provided, the axes will be locked from panning.

	/**
	 * Turns the current plot's plotting area into a drag and drop source. You must hold Ctrl. Don't forget to call EndDragDropSource!
	 */
	static BeginDragDropSourcePlot(flags: ImGuiDragDropFlags = 0): boolean {
		return Mod.export.ImPlot_BeginDragDropSourcePlot(flags);
	}

	/**
	 * Turns the current plot's X-axis into a drag and drop source. You must hold Ctrl. Don't forget to call EndDragDropSource!
	 */
	static BeginDragDropSourceAxis(axis: ImAxis, flags: ImGuiDragDropFlags = 0): boolean {
		return Mod.export.ImPlot_BeginDragDropSourceAxis(axis, flags);
	}

	/**
	 * Turns an item in the current plot's legend into drag and drop source. Don't forget to call EndDragDropSource!
	 */
	static BeginDragDropSourceItem(label_id: string, flags: ImGuiDragDropFlags = 0): boolean {
		return Mod.export.ImPlot_BeginDragDropSourceItem(label_id, flags);
	}

	/**
	 * Ends a drag and drop source (currently just an alias for ImGui::EndDragDropSource).
	 */
	static EndDragDropSource(): void {
		Mod.export.ImPlot_EndDragDropSource();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Styling
	//-----------------------------------------------------------------------------

	// Styling colors in ImPlot works similarly to styling colors in ImGui, but
	// with one important difference. Like ImGui, all style colors are stored in an
	// indexable array in ImPlotStyle. You can permanently modify these values through
	// GetStyle().Colors, or temporarily modify them with Push/Pop functions below.
	// However, by default all style colors in ImPlot default to a special color
	// IMPLOT_AUTO_COL. IMPLOT_AUTO_COL tells ImPlot to set that color from color data
	// in your **ImGuiStyle**. The ImGuiCol_ that these style colors default to are
	// detailed above, and in general have been mapped to produce plots visually
	// consistent with your current ImGui style. Of course, you are free to
	// manually set these colors to whatever you like, and further can Push/Pop
	// them around individual plots for plot-specific styling (e.g. coloring axes)

	/**
	 * Provides access to plot style structure for permanent modifications to colors, sizes, etc.
	 */
	static GetStyle(): ImPlotStylePtr {
		return ImPlotStylePtr.From(Mod.export.ImPlot_GetStyle());
	}

	/**
	 * Style plot colors for current ImGui style (default).
	 */
	static StyleColorsAuto(dst: ImPlotStylePtr | null = null): void {
		Mod.export.ImPlot_StyleColorsAuto(dst?.ptr ?? null);
	}

	/**
	 * Style plot colors for ImGui "Classic".
	 */
	static StyleColorsClassic(dst: ImPlotStylePtr | null = null): void {
		Mod.export.ImPlot_StyleColorsClassic(dst?.ptr ?? null);
	}

	/**
	 * Style plot colors for ImGui "Dark".
	 */
	static StyleColorsDark(dst: ImPlotStylePtr | null = null): void {
		Mod.export.ImPlot_StyleColorsDark(dst?.ptr ?? null);
	}

	/**
	 * Style plot colors for ImGui "Light".
	 */
	static StyleColorsLight(dst: ImPlotStylePtr | null = null): void {
		Mod.export.ImPlot_StyleColorsLight(dst?.ptr ?? null);
	}

	// Use PushStyleX to temporarily modify your ImPlotStyle. The modification
	// will last until the matching call to PopStyleX. You MUST call a pop for
	// every push, otherwise you will leak memory! This behaves just like ImGui.

	/**
	 * Temporarily modify a style color. Don't forget to call PopStyleColor!
	 */
	static PushStyleColor(idx: ImPlotCol, col: ImU32): void {
		Mod.export.ImPlot_PushStyleColor(idx, col);
	}
	/**
	 * Temporarily modify a style color. Don't forget to call PopStyleColor!
	 */
	static PushStyleColorImVec4(idx: ImPlotCol, col: ImVec4): void {
		Mod.export.ImPlot_PushStyleColorImVec4(idx, col);
	}

	/**
	 * Undo temporary style color modification(s). Undo multiple pushes at once by increasing count.
	 */
	static PopStyleColor(count: number = 1): void {
		Mod.export.ImPlot_PopStyleColor(count);
	}

	/**
	 * Temporarily modify a style variable of float type. Don't forget to call PopStyleVar!
	 */
	static PushStyleVar(idx: ImPlotStyleVar, val: number): void {
		Mod.export.ImPlot_PushStyleVar(idx, val);
	}

	/**
	 * Temporarily modify a style variable of int type. Don't forget to call PopStyleVar!
	 */
	static PushStyleVarInt(idx: ImPlotStyleVar, val: number): void {
		Mod.export.ImPlot_PushStyleVarInt(idx, val);
	}

	/**
	 * Temporarily modify a style variable of ImVec2 type. Don't forget to call PopStyleVar!
	 */
	static PushStyleVarImVec2(idx: ImPlotStyleVar, val: ImVec2): void {
		Mod.export.ImPlot_PushStyleVarImVec2(idx, val);
	}

	/**
	 * Undo temporary style variable modification(s). Undo multiple pushes at once by increasing count.
	 */
	static PopStyleVar(count: number = 1): void {
		Mod.export.ImPlot_PopStyleVar(count);
	}

	/**
	 * Gets the last item primary color (i.e. its legend icon color)
	 */
	static GetLastItemColor(): ImVec4 {
		return ImVec4.From(Mod.export.ImPlot_GetLastItemColor());
	}

	/**
	 * Returns the null terminated string name for an ImPlotCol.
	 */
	static GetStyleColorName(idx: ImPlotCol): string {
		return Mod.export.ImPlot_GetStyleColorName(idx);
	}

	/**
	 * Returns the null terminated string name for an ImPlotMarker.
	 */
	static GetMarkerName(idx: ImPlotMarker): string {
		return Mod.export.ImPlot_GetMarkerName(idx);
	}

	/**
	 * Returns the next marker and advances the marker for the current plot. You need to call this between Begin/EndPlot!
	 */
	static NextMarker(): ImPlotMarker {
		return Mod.export.ImPlot_NextMarker();
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Colormaps
	//-----------------------------------------------------------------------------

	// Item styling is based on colormaps when the relevant ImPlotCol_XXX is set to
	// IMPLOT_AUTO_COL (default). Several built-in colormaps are available. You can
	// add and then push/pop your own colormaps as well. To permanently set a colormap,
	// modify the Colormap index member of your ImPlotStyle.

	// Colormap data will be ignored and a custom color will be used if you have done one of the following:
	//     1) Modified an item style color in your ImPlotStyle to anything other than IMPLOT_AUTO_COL.
	//     2) Pushed an item style color using PushStyleColor().
	//     3) Set the next item style with a SetNextXXXStyle function.

	// /**
	//  * Add a new colormap. The color data will be copied. The colormap can be used by pushing either the returned index or the
	//  * string name with PushColormap. The colormap name must be unique and the size must be greater than 1. You will receive
	//  * an assert otherwise! By default colormaps are considered to be qualitative (i.e. discrete). If you want to create a
	//  * continuous colormap, set #qual=false. This will treat the colors you provide as keys, and ImPlot will build a linearly
	//  * interpolated lookup table. The memory footprint of this table will be exactly ((size-1)*255+1)*4 bytes.
	//  */
	// static AddColormap(
	// 	name: string,
	// 	cols: ImVec4[],
	// 	size: number,
	// 	qual: boolean = true,
	// ): ImPlotColormap {
	// 	return Mod.export.ImPlot_AddColormap(name, cols, size, qual);
	// }

	// static AddColormapImU32(
	// 	name: string,
	// 	cols: ImU32[],
	// 	size: number,
	// 	qual: boolean = true,
	// ): ImPlotColormap {
	// 	return Mod.export.ImPlot_AddColormap(name, cols, size, qual);
	// }

	/**
	 * Returns the number of available colormaps (i.e. the built-in + user-added count).
	 */
	static GetColormapCount(): number {
		return Mod.export.ImPlot_GetColormapCount();
	}

	/**
	 * Returns a null terminated string name for a colormap given an index. Returns nullptr if index is invalid.
	 */
	static GetColormapName(cmap: ImPlotColormap): string {
		return Mod.export.ImPlot_GetColormapName(cmap);
	}

	/**
	 * Returns an index number for a colormap given a valid string name. Returns -1 if name is invalid.
	 */
	static GetColormapIndex(name: string): ImPlotColormap {
		return Mod.export.ImPlot_GetColormapIndex(name);
	}

	/**
	 * Temporarily switch to one of the built-in (i.e. ImPlotColormap_XXX) or user-added colormaps (i.e. a return value of AddColormap). Don't forget to call PopColormap!
	 */
	static PushColormap(cmap: ImPlotColormap): void {
		Mod.export.ImPlot_PushColormap(cmap);
	}

	/**
	 * Push a colormap by string name. Use built-in names such as "Default", "Deep", "Jet", etc. or a string you provided to AddColormap. Don't forget to call PopColormap!
	 */
	static PushColormapStr(name: string): void {
		Mod.export.ImPlot_PushColormapStr(name);
	}

	/**
	 * Undo temporary colormap modification(s). Undo multiple pushes at once by increasing count.
	 */
	static PopColormap(count: number = 1): void {
		Mod.export.ImPlot_PopColormap(count);
	}

	/**
	 * Returns the next color from the current colormap and advances the colormap for the current plot.
	 * Can also be used with no return value to skip colors if desired. You need to call this between Begin/EndPlot!
	 */
	static NextColormapColor(): ImVec4 {
		return ImVec4.From(Mod.export.ImPlot_NextColormapColor());
	}

	// Colormap utils. If cmap = IMPLOT_AUTO (default), the current colormap is assumed.
	// Pass an explicit colormap index (built-in or user-added) to specify otherwise.

	/**
	 * Returns the size of a colormap.
	 */
	static GetColormapSize(cmap: ImPlotColormap = IMPLOT_AUTO): number {
		return Mod.export.ImPlot_GetColormapSize(cmap);
	}

	/**
	 * Returns a color from a colormap given an index >= 0 (modulo will be performed).
	 */
	static GetColormapColor(idx: number, cmap: ImPlotColormap = IMPLOT_AUTO): ImVec4 {
		return ImVec4.From(Mod.export.ImPlot_GetColormapColor(idx, cmap));
	}

	/**
	 * Sample a color from the current colormap given t between 0 and 1.
	 */
	static SampleColormap(t: number, cmap: ImPlotColormap = IMPLOT_AUTO): ImVec4 {
		return ImVec4.From(Mod.export.ImPlot_SampleColormap(t, cmap));
	}

	//   // Shows a vertical color scale with linear spaced ticks using the specified color map. Use double hashes to hide label (e.g. "##NoLabel"). If scale_min > scale_max, the scale to color mapping will be reversed.
	// IMPLOT_API void ColormapScale(const char* label, double scale_min, double scale_max, const ImVec2& size = ImVec2(0,0), const char* format = "%g", ImPlotColormapScaleFlags flags = 0, ImPlotColormap cmap = IMPLOT_AUTO);
	// // Shows a horizontal slider with a colormap gradient background. Optionally returns the color sampled at t in [0 1].
	// IMPLOT_API bool ColormapSlider(const char* label, float* t, ImVec4* out = nullptr, const char* format = "", ImPlotColormap cmap = IMPLOT_AUTO);

	/**
	 * Shows a button with a colormap gradient background.
	 */
	static ColormapButton(
		label: string,
		size: ImVec2 = new ImVec2(0, 0),
		cmap: ImPlotColormap = IMPLOT_AUTO,
	): boolean {
		return Mod.export.ImPlot_ColormapButton(label, size, cmap);
	}

	/**
	 * When items in a plot sample their color from a colormap, the color is cached and does not change
	 * unless explicitly overridden. Therefore, if you change the colormap after the item has already been plotted,
	 * item colors will NOT update. If you need item colors to resample the new colormap, use this
	 * function to bust the cached colors. If `plot_title_id` is `null`, every item in EVERY existing plot will be cache busted.
	 * Otherwise, only the plot specified by `plot_title_id` will be busted. For the latter, this function must be
	 * called in the same ImGui ID scope that the plot is in. You should rarely, if ever, need this function,
	 * but it is available for applications that require runtime colormap swaps (e.g. Heatmaps demo).
	 */
	static BustColorCache(plot_title_id: string = ""): void {
		Mod.export.ImPlot_BustColorCache(plot_title_id);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Input Mapping
	//-----------------------------------------------------------------------------

	/**
	 * Provides access to input mapping structure for permanent modifications to controls for pan, select, etc.
	 */
	static GetInputMap(): ImPlotInputMapPtr {
		return ImPlotInputMapPtr.From(Mod.export.ImPlot_GetInputMap());
	}

	/**
	 * Default input mapping: pan = LMB drag, box select = RMB drag, fit = LMB double click, context menu = RMB click, zoom = scroll.
	 */
	static MapInputDefault(dst: ImPlotInputMapPtr | null = null): void {
		Mod.export.ImPlot_MapInputDefault(dst?.ptr ?? null);
	}

	/**
	 * Reverse input mapping: pan = RMB drag, box select = LMB drag, fit = LMB double click, context menu = RMB click, zoom = scroll.
	 */
	static MapInputReverse(dst: ImPlotInputMapPtr | null = null): void {
		Mod.export.ImPlot_MapInputReverse(dst?.ptr ?? null);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Miscellaneous
	//-----------------------------------------------------------------------------

	/**
	 * Render icons similar to those that appear in legends (nifty for data lists).
	 */
	static ItemIcon(col: ImVec4): void {
		Mod.export.ImPlot_ItemIcon(col);
	}

	/**
	 * Render icons similar to those that appear in legends (nifty for data lists).
	 */
	static ItemIconImU32(col: ImU32): void {
		Mod.export.ImPlot_ItemIconImU32(col);
	}

	/**
	 * Render icons similar to those that appear in legends (nifty for data lists).
	 */
	static ColormapIcon(cmap: ImPlotColormap): void {
		Mod.export.ImPlot_ColormapIcon(cmap);
	}

	// /**
	//  * Get the plot draw list for custom rendering to the current plot area. Call between Begin/EndPlot.
	//  */
	// static GetPlotDrawList(): ImDrawListPtr {
	// 	return ImDrawListPtr.From(Mod.export.ImPlot_GetPlotDrawList());
	// }

	/**
	 * Push clip rect for rendering to current plot area. The rect can be expanded or contracted by #expand pixels. Call between Begin/EndPlot.
	 */
	static PushPlotClipRect(expand: number = 0): void {
		Mod.export.ImPlot_PushPlotClipRect(expand);
	}

	/**
	 * Pop plot clip rect. Call between Begin/EndPlot.
	 */
	static PopPlotClipRect(): void {
		Mod.export.ImPlot_PopPlotClipRect();
	}

	/**
	 * Shows ImPlot style selector dropdown menu.
	 */
	static ShowStyleSelector(label: string): boolean {
		return Mod.export.ImPlot_ShowStyleSelector(label);
	}

	/**
	 * Shows ImPlot colormap selector dropdown menu.
	 */
	static ShowColormapSelector(label: string): boolean {
		return Mod.export.ImPlot_ShowColormapSelector(label);
	}

	/**
	 * Shows ImPlot input map selector dropdown menu.
	 */
	static ShowInputMapSelector(label: string): boolean {
		return Mod.export.ImPlot_ShowInputMapSelector(label);
	}

	/**
	 * Shows ImPlot style editor block (not a window).
	 */
	static ShowStyleEditor(ref: ImPlotStylePtr | null = null): void {
		Mod.export.ImPlot_ShowStyleEditor(ref?.ptr ?? null);
	}

	/**
	 * Add basic help/info block for end users (not a window).
	 */
	static ShowUserGuide(): void {
		Mod.export.ImPlot_ShowUserGuide();
	}

	/**
	 * Shows ImPlot metrics/debug information window.
	 */
	static ShowMetricsWindow(p_popen: [boolean] | null = null): void {
		Mod.export.ImPlot_ShowMetricsWindow(p_popen);
	}

	//-----------------------------------------------------------------------------
	// [SECTION] Demo
	//-----------------------------------------------------------------------------

	/**
	 * Shows the ImPlot demo window (add implot_demo.cpp to your sources!)
	 */
	static ShowDemoWindow(p_open: [boolean] | null = null): void {
		Mod.export.ImPlot_ShowDemoWindow(p_open);
	}
}
