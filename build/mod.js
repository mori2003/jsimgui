/* @ts-self-types="./mod.d.ts" */
/**
 * The TypeScript/JavaScript API for jsimgui.
 * Gives access to the exported ImGui functions, structs and enums.
 * It is using the docking branch of Dear ImGui.
 *
 * Index:
 * 1. Core Module
 * 2. Typedefs
 * 3. Structs
 * 4. ImGui Object - Enums/Flags & Functions
 * 5. Web Implementation
 *
 * For source code and more information:
 * @see {@link https://github.com/mori2003/jsimgui|jsimgui}
 */
// @ts-ignore: MainExport will be imported when compiled in the build directory.
import MainExport from "./jsimgui-em.js";
/* -------------------------------------------------------------------------- */
/* 1. Core Module */
/* -------------------------------------------------------------------------- */
/** The main WASM module. */
export const Mod = {
    /** The WASM module exports. */
    _export: null,
    /** Initialize the WASM module. */
    async init() {
        if (Mod._export) {
            throw new Error("WASM module already initialized.");
        }
        // @ts-ignore
        await MainExport().then((module) => {
            Mod._export = module;
        });
    },
    /** Access to the WASM exports. */
    get export() {
        if (!Mod._export) {
            throw new Error("WASM module not initialized. Did you call ImGuiImplWeb.Init()?");
        }
        return this._export;
    },
};
/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    /** The reference to the underlying C++ struct. */
    _ptr;
    constructor(name) {
        this._ptr = new Mod.export[name]();
    }
    /** Wrap a new C++ struct into a JS wrapper */
    static wrap(ptr) {
        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        const wrap = Reflect.construct(this, []);
        wrap._ptr = ptr;
        return wrap;
    }
}
/* -------------------------------------------------------------------------- */
/* 3. Structs */
/* -------------------------------------------------------------------------- */
/** Data shared among multiple draw lists (typically owned by parent ImGui context, but you may create one yourself) */
export class ImDrawListSharedData extends StructBinding {
    constructor() {
        super("ImDrawListSharedData");
    }
}
/** Dear ImGui context (opaque structure, unless including imgui_internal.h) */
export class ImGuiContext extends StructBinding {
    constructor() {
        super("ImGuiContext");
    }
}
/** 2D vector used to store positions, sizes etc. */
export class ImVec2 extends StructBinding {
    constructor(x = 0, y = 0) {
        super("ImVec2");
        this.x = x;
        this.y = y;
    }
    get x() {
        return this._ptr.get_x();
    }
    set x(v) {
        this._ptr.set_x(v);
    }
    get y() {
        return this._ptr.get_y();
    }
    set y(v) {
        this._ptr.set_y(v);
    }
}
/** 4D vector used to store clipping rectangles, colors etc. */
export class ImVec4 extends StructBinding {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super("ImVec4");
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    get x() {
        return this._ptr.get_x();
    }
    set x(v) {
        this._ptr.set_x(v);
    }
    get y() {
        return this._ptr.get_y();
    }
    set y(v) {
        this._ptr.set_y(v);
    }
    get z() {
        return this._ptr.get_z();
    }
    set z(v) {
        this._ptr.set_z(v);
    }
    get w() {
        return this._ptr.get_w();
    }
    set w(v) {
        this._ptr.set_w(v);
    }
}
/** ImTextureRef = higher-level identifier for a texture. */
export class ImTextureRef extends StructBinding {
    constructor(id) {
        super("ImTextureRef");
        this._TexID = id;
    }
    /** _OR_ Low-level backend texture identifier, if already uploaded or created by user\/app. Generally provided to e.g. ImGui::Image() calls. */
    get _TexID() {
        return this._ptr.get__TexID();
    }
    set _TexID(v) {
        this._ptr.set__TexID(v);
    }
    /** == (_TexData ? _TexData->TexID : _TexID) \/\/ Implemented below in the file. */
    GetTexID() {
        return this._ptr.ImTextureRef_GetTexID();
    }
}
/** Sorting specifications for a table (often handling sort specs for a single column, occasionally more) */
export class ImGuiTableSortSpecs extends StructBinding {
    constructor() {
        super("ImGuiTableSortSpecs");
    }
}
/** Sorting specification for one column of a table (sizeof == 12 bytes) */
export class ImGuiTableColumnSortSpecs extends StructBinding {
    constructor() {
        super("ImGuiTableColumnSortSpecs");
    }
}
/** Runtime data for styling/colors. */
export class ImGuiStyle extends StructBinding {
    constructor() {
        super("ImGuiStyle");
    }
    /** Current base font size before external global factors are applied. Use PushFont(NULL, size) to modify. Use ImGui::GetFontSize() to obtain scaled value. */
    get FontSizeBase() {
        return this._ptr.get_FontSizeBase();
    }
    set FontSizeBase(v) {
        this._ptr.set_FontSizeBase(v);
    }
    /** Main global scale factor. May be set by application once, or exposed to end-user. */
    get FontScaleMain() {
        return this._ptr.get_FontScaleMain();
    }
    set FontScaleMain(v) {
        this._ptr.set_FontScaleMain(v);
    }
    /** Additional global scale factor from viewport\/monitor contents scale. When io.ConfigDpiScaleFonts is enabled, this is automatically overwritten when changing monitor DPI. */
    get FontScaleDpi() {
        return this._ptr.get_FontScaleDpi();
    }
    set FontScaleDpi(v) {
        this._ptr.set_FontScaleDpi(v);
    }
    /** Global alpha applies to everything in Dear ImGui. */
    get Alpha() {
        return this._ptr.get_Alpha();
    }
    set Alpha(v) {
        this._ptr.set_Alpha(v);
    }
    /** Additional alpha multiplier applied by BeginDisabled(). Multiply over current value of Alpha. */
    get DisabledAlpha() {
        return this._ptr.get_DisabledAlpha();
    }
    set DisabledAlpha(v) {
        this._ptr.set_DisabledAlpha(v);
    }
    /** Padding within a window. */
    get WindowPadding() {
        return ImVec2.wrap(this._ptr.get_WindowPadding());
    }
    set WindowPadding(v) {
        this._ptr.set_WindowPadding(v._ptr);
    }
    /** Radius of window corners rounding. Set to 0.0f to have rectangular windows. Large values tend to lead to variety of artifacts and are not recommended. */
    get WindowRounding() {
        return this._ptr.get_WindowRounding();
    }
    set WindowRounding(v) {
        this._ptr.set_WindowRounding(v);
    }
    /** Thickness of border around windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get WindowBorderSize() {
        return this._ptr.get_WindowBorderSize();
    }
    set WindowBorderSize(v) {
        this._ptr.set_WindowBorderSize(v);
    }
    /** Hit-testing extent outside\/inside resizing border. Also extend determination of hovered window. Generally meaningfully larger than WindowBorderSize to make it easy to reach borders. */
    get WindowBorderHoverPadding() {
        return this._ptr.get_WindowBorderHoverPadding();
    }
    set WindowBorderHoverPadding(v) {
        this._ptr.set_WindowBorderHoverPadding(v);
    }
    /** Minimum window size. This is a global setting. If you want to constrain individual windows, use SetNextWindowSizeConstraints(). */
    get WindowMinSize() {
        return ImVec2.wrap(this._ptr.get_WindowMinSize());
    }
    set WindowMinSize(v) {
        this._ptr.set_WindowMinSize(v._ptr);
    }
    /** Alignment for title bar text. Defaults to (0.0f,0.5f) for left-aligned,vertically centered. */
    get WindowTitleAlign() {
        return ImVec2.wrap(this._ptr.get_WindowTitleAlign());
    }
    set WindowTitleAlign(v) {
        this._ptr.set_WindowTitleAlign(v._ptr);
    }
    /** Side of the collapsing\/docking button in the title bar (None\/Left\/Right). Defaults to ImGuiDir_Left. */
    get WindowMenuButtonPosition() {
        return this._ptr.get_WindowMenuButtonPosition();
    }
    set WindowMenuButtonPosition(v) {
        this._ptr.set_WindowMenuButtonPosition(v);
    }
    /** Radius of child window corners rounding. Set to 0.0f to have rectangular windows. */
    get ChildRounding() {
        return this._ptr.get_ChildRounding();
    }
    set ChildRounding(v) {
        this._ptr.set_ChildRounding(v);
    }
    /** Thickness of border around child windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get ChildBorderSize() {
        return this._ptr.get_ChildBorderSize();
    }
    set ChildBorderSize(v) {
        this._ptr.set_ChildBorderSize(v);
    }
    /** Radius of popup window corners rounding. (Note that tooltip windows use WindowRounding) */
    get PopupRounding() {
        return this._ptr.get_PopupRounding();
    }
    set PopupRounding(v) {
        this._ptr.set_PopupRounding(v);
    }
    /** Thickness of border around popup\/tooltip windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get PopupBorderSize() {
        return this._ptr.get_PopupBorderSize();
    }
    set PopupBorderSize(v) {
        this._ptr.set_PopupBorderSize(v);
    }
    /** Padding within a framed rectangle (used by most widgets). */
    get FramePadding() {
        return ImVec2.wrap(this._ptr.get_FramePadding());
    }
    set FramePadding(v) {
        this._ptr.set_FramePadding(v._ptr);
    }
    /** Radius of frame corners rounding. Set to 0.0f to have rectangular frame (used by most widgets). */
    get FrameRounding() {
        return this._ptr.get_FrameRounding();
    }
    set FrameRounding(v) {
        this._ptr.set_FrameRounding(v);
    }
    /** Thickness of border around frames. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get FrameBorderSize() {
        return this._ptr.get_FrameBorderSize();
    }
    set FrameBorderSize(v) {
        this._ptr.set_FrameBorderSize(v);
    }
    /** Horizontal and vertical spacing between widgets\/lines. */
    get ItemSpacing() {
        return ImVec2.wrap(this._ptr.get_ItemSpacing());
    }
    set ItemSpacing(v) {
        this._ptr.set_ItemSpacing(v._ptr);
    }
    /** Horizontal and vertical spacing between within elements of a composed widget (e.g. a slider and its label). */
    get ItemInnerSpacing() {
        return ImVec2.wrap(this._ptr.get_ItemInnerSpacing());
    }
    set ItemInnerSpacing(v) {
        this._ptr.set_ItemInnerSpacing(v._ptr);
    }
    /** Padding within a table cell. Cellpadding.x is locked for entire table. CellPadding.y may be altered between different rows. */
    get CellPadding() {
        return ImVec2.wrap(this._ptr.get_CellPadding());
    }
    set CellPadding(v) {
        this._ptr.set_CellPadding(v._ptr);
    }
    /** Expand reactive bounding box for touch-based system where touch position is not accurate enough. Unfortunately we don't sort widgets so priority on overlap will always be given to the first widget. So don't grow this too much! */
    get TouchExtraPadding() {
        return ImVec2.wrap(this._ptr.get_TouchExtraPadding());
    }
    set TouchExtraPadding(v) {
        this._ptr.set_TouchExtraPadding(v._ptr);
    }
    /** Horizontal indentation when e.g. entering a tree node. Generally == (FontSize + FramePadding.x*2). */
    get IndentSpacing() {
        return this._ptr.get_IndentSpacing();
    }
    set IndentSpacing(v) {
        this._ptr.set_IndentSpacing(v);
    }
    /** Minimum horizontal spacing between two columns. Preferably > (FramePadding.x + 1). */
    get ColumnsMinSpacing() {
        return this._ptr.get_ColumnsMinSpacing();
    }
    set ColumnsMinSpacing(v) {
        this._ptr.set_ColumnsMinSpacing(v);
    }
    /** Width of the vertical scrollbar, Height of the horizontal scrollbar. */
    get ScrollbarSize() {
        return this._ptr.get_ScrollbarSize();
    }
    set ScrollbarSize(v) {
        this._ptr.set_ScrollbarSize(v);
    }
    /** Radius of grab corners for scrollbar. */
    get ScrollbarRounding() {
        return this._ptr.get_ScrollbarRounding();
    }
    set ScrollbarRounding(v) {
        this._ptr.set_ScrollbarRounding(v);
    }
    /** Minimum width\/height of a grab box for slider\/scrollbar. */
    get GrabMinSize() {
        return this._ptr.get_GrabMinSize();
    }
    set GrabMinSize(v) {
        this._ptr.set_GrabMinSize(v);
    }
    /** Radius of grabs corners rounding. Set to 0.0f to have rectangular slider grabs. */
    get GrabRounding() {
        return this._ptr.get_GrabRounding();
    }
    set GrabRounding(v) {
        this._ptr.set_GrabRounding(v);
    }
    /** The size in pixels of the dead-zone around zero on logarithmic sliders that cross zero. */
    get LogSliderDeadzone() {
        return this._ptr.get_LogSliderDeadzone();
    }
    set LogSliderDeadzone(v) {
        this._ptr.set_LogSliderDeadzone(v);
    }
    /** Thickness of border around Image() calls. */
    get ImageBorderSize() {
        return this._ptr.get_ImageBorderSize();
    }
    set ImageBorderSize(v) {
        this._ptr.set_ImageBorderSize(v);
    }
    /** Radius of upper corners of a tab. Set to 0.0f to have rectangular tabs. */
    get TabRounding() {
        return this._ptr.get_TabRounding();
    }
    set TabRounding(v) {
        this._ptr.set_TabRounding(v);
    }
    /** Thickness of border around tabs. */
    get TabBorderSize() {
        return this._ptr.get_TabBorderSize();
    }
    set TabBorderSize(v) {
        this._ptr.set_TabBorderSize(v);
    }
    /** -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width. */
    get TabCloseButtonMinWidthSelected() {
        return this._ptr.get_TabCloseButtonMinWidthSelected();
    }
    set TabCloseButtonMinWidthSelected(v) {
        this._ptr.set_TabCloseButtonMinWidthSelected(v);
    }
    /** -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width. FLT_MAX: never show close button when unselected. */
    get TabCloseButtonMinWidthUnselected() {
        return this._ptr.get_TabCloseButtonMinWidthUnselected();
    }
    set TabCloseButtonMinWidthUnselected(v) {
        this._ptr.set_TabCloseButtonMinWidthUnselected(v);
    }
    /** Thickness of tab-bar separator, which takes on the tab active color to denote focus. */
    get TabBarBorderSize() {
        return this._ptr.get_TabBarBorderSize();
    }
    set TabBarBorderSize(v) {
        this._ptr.set_TabBarBorderSize(v);
    }
    /** Thickness of tab-bar overline, which highlights the selected tab-bar. */
    get TabBarOverlineSize() {
        return this._ptr.get_TabBarOverlineSize();
    }
    set TabBarOverlineSize(v) {
        this._ptr.set_TabBarOverlineSize(v);
    }
    /** Angle of angled headers (supported values range from -50.0f degrees to +50.0f degrees). */
    get TableAngledHeadersAngle() {
        return this._ptr.get_TableAngledHeadersAngle();
    }
    set TableAngledHeadersAngle(v) {
        this._ptr.set_TableAngledHeadersAngle(v);
    }
    /** Alignment of angled headers within the cell */
    get TableAngledHeadersTextAlign() {
        return ImVec2.wrap(this._ptr.get_TableAngledHeadersTextAlign());
    }
    set TableAngledHeadersTextAlign(v) {
        this._ptr.set_TableAngledHeadersTextAlign(v._ptr);
    }
    /** Default way to draw lines connecting TreeNode hierarchy. ImGuiTreeNodeFlags_DrawLinesNone or ImGuiTreeNodeFlags_DrawLinesFull or ImGuiTreeNodeFlags_DrawLinesToNodes. */
    get TreeLinesFlags() {
        return this._ptr.get_TreeLinesFlags();
    }
    set TreeLinesFlags(v) {
        this._ptr.set_TreeLinesFlags(v);
    }
    /** Thickness of outlines when using ImGuiTreeNodeFlags_DrawLines. */
    get TreeLinesSize() {
        return this._ptr.get_TreeLinesSize();
    }
    set TreeLinesSize(v) {
        this._ptr.set_TreeLinesSize(v);
    }
    /** Radius of lines connecting child nodes to the vertical line. */
    get TreeLinesRounding() {
        return this._ptr.get_TreeLinesRounding();
    }
    set TreeLinesRounding(v) {
        this._ptr.set_TreeLinesRounding(v);
    }
    /** Side of the color button in the ColorEdit4 widget (left\/right). Defaults to ImGuiDir_Right. */
    get ColorButtonPosition() {
        return this._ptr.get_ColorButtonPosition();
    }
    set ColorButtonPosition(v) {
        this._ptr.set_ColorButtonPosition(v);
    }
    /** Alignment of button text when button is larger than text. Defaults to (0.5f, 0.5f) (centered). */
    get ButtonTextAlign() {
        return ImVec2.wrap(this._ptr.get_ButtonTextAlign());
    }
    set ButtonTextAlign(v) {
        this._ptr.set_ButtonTextAlign(v._ptr);
    }
    /** Alignment of selectable text. Defaults to (0.0f, 0.0f) (top-left aligned). It's generally important to keep this left-aligned if you want to lay multiple items on a same line. */
    get SelectableTextAlign() {
        return ImVec2.wrap(this._ptr.get_SelectableTextAlign());
    }
    set SelectableTextAlign(v) {
        this._ptr.set_SelectableTextAlign(v._ptr);
    }
    /** Thickness of border in SeparatorText() */
    get SeparatorTextBorderSize() {
        return this._ptr.get_SeparatorTextBorderSize();
    }
    set SeparatorTextBorderSize(v) {
        this._ptr.set_SeparatorTextBorderSize(v);
    }
    /** Alignment of text within the separator. Defaults to (0.0f, 0.5f) (left aligned, center). */
    get SeparatorTextAlign() {
        return ImVec2.wrap(this._ptr.get_SeparatorTextAlign());
    }
    set SeparatorTextAlign(v) {
        this._ptr.set_SeparatorTextAlign(v._ptr);
    }
    /** Horizontal offset of text from each edge of the separator + spacing on other axis. Generally small values. .y is recommended to be == FramePadding.y. */
    get SeparatorTextPadding() {
        return ImVec2.wrap(this._ptr.get_SeparatorTextPadding());
    }
    set SeparatorTextPadding(v) {
        this._ptr.set_SeparatorTextPadding(v._ptr);
    }
    /** Apply to regular windows: amount which we enforce to keep visible when moving near edges of your screen. */
    get DisplayWindowPadding() {
        return ImVec2.wrap(this._ptr.get_DisplayWindowPadding());
    }
    set DisplayWindowPadding(v) {
        this._ptr.set_DisplayWindowPadding(v._ptr);
    }
    /** Apply to every windows, menus, popups, tooltips: amount where we avoid displaying contents. Adjust if you cannot see the edges of your screen (e.g. on a TV where scaling has not been configured). */
    get DisplaySafeAreaPadding() {
        return ImVec2.wrap(this._ptr.get_DisplaySafeAreaPadding());
    }
    set DisplaySafeAreaPadding(v) {
        this._ptr.set_DisplaySafeAreaPadding(v._ptr);
    }
    /** Thickness of resizing border between docked windows */
    get DockingSeparatorSize() {
        return this._ptr.get_DockingSeparatorSize();
    }
    set DockingSeparatorSize(v) {
        this._ptr.set_DockingSeparatorSize(v);
    }
    /** Scale software rendered mouse cursor (when io.MouseDrawCursor is enabled). We apply per-monitor DPI scaling over this scale. May be removed later. */
    get MouseCursorScale() {
        return this._ptr.get_MouseCursorScale();
    }
    set MouseCursorScale(v) {
        this._ptr.set_MouseCursorScale(v);
    }
    /** Enable anti-aliased lines\/borders. Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLines() {
        return this._ptr.get_AntiAliasedLines();
    }
    set AntiAliasedLines(v) {
        this._ptr.set_AntiAliasedLines(v);
    }
    /** Enable anti-aliased lines\/borders using textures where possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLinesUseTex() {
        return this._ptr.get_AntiAliasedLinesUseTex();
    }
    set AntiAliasedLinesUseTex(v) {
        this._ptr.set_AntiAliasedLinesUseTex(v);
    }
    /** Enable anti-aliased edges around filled shapes (rounded rectangles, circles, etc.). Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedFill() {
        return this._ptr.get_AntiAliasedFill();
    }
    set AntiAliasedFill(v) {
        this._ptr.set_AntiAliasedFill(v);
    }
    /** Tessellation tolerance when using PathBezierCurveTo() without a specific number of segments. Decrease for highly tessellated curves (higher quality, more polygons), increase to reduce quality. */
    get CurveTessellationTol() {
        return this._ptr.get_CurveTessellationTol();
    }
    set CurveTessellationTol(v) {
        this._ptr.set_CurveTessellationTol(v);
    }
    /** Maximum error (in pixels) allowed when using AddCircle()\/AddCircleFilled() or drawing rounded corner rectangles with no explicit segment count specified. Decrease for higher quality but more geometry. */
    get CircleTessellationMaxError() {
        return this._ptr.get_CircleTessellationMaxError();
    }
    set CircleTessellationMaxError(v) {
        this._ptr.set_CircleTessellationMaxError(v);
    }
    /** Delay for IsItemHovered(ImGuiHoveredFlags_Stationary). Time required to consider mouse stationary. */
    get HoverStationaryDelay() {
        return this._ptr.get_HoverStationaryDelay();
    }
    set HoverStationaryDelay(v) {
        this._ptr.set_HoverStationaryDelay(v);
    }
    /** Delay for IsItemHovered(ImGuiHoveredFlags_DelayShort). Usually used along with HoverStationaryDelay. */
    get HoverDelayShort() {
        return this._ptr.get_HoverDelayShort();
    }
    set HoverDelayShort(v) {
        this._ptr.set_HoverDelayShort(v);
    }
    /** Delay for IsItemHovered(ImGuiHoveredFlags_DelayNormal). " */
    get HoverDelayNormal() {
        return this._ptr.get_HoverDelayNormal();
    }
    set HoverDelayNormal(v) {
        this._ptr.set_HoverDelayNormal(v);
    }
    /** Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using mouse. */
    get HoverFlagsForTooltipMouse() {
        return this._ptr.get_HoverFlagsForTooltipMouse();
    }
    set HoverFlagsForTooltipMouse(v) {
        this._ptr.set_HoverFlagsForTooltipMouse(v);
    }
    /** Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using keyboard\/gamepad. */
    get HoverFlagsForTooltipNav() {
        return this._ptr.get_HoverFlagsForTooltipNav();
    }
    set HoverFlagsForTooltipNav(v) {
        this._ptr.set_HoverFlagsForTooltipNav(v);
    }
    /** Scale all spacing\/padding\/thickness values. Do not scale fonts. */
    ScaleAllSizes(scale_factor) {
        return this._ptr.ImGuiStyle_ScaleAllSizes(scale_factor);
    }
}
/** Main configuration and I/O between your application and ImGui. */
export class ImGuiIO extends StructBinding {
    constructor() {
        super("ImGuiIO");
    }
    /** = 0              \/\/ See ImGuiConfigFlags_ enum. Set by user\/application. Keyboard\/Gamepad navigation options, etc. */
    get ConfigFlags() {
        return this._ptr.get_ConfigFlags();
    }
    set ConfigFlags(v) {
        this._ptr.set_ConfigFlags(v);
    }
    /** = 0              \/\/ See ImGuiBackendFlags_ enum. Set by backend (imgui_impl_xxx files or custom backend) to communicate features supported by the backend. */
    get BackendFlags() {
        return this._ptr.get_BackendFlags();
    }
    set BackendFlags(v) {
        this._ptr.set_BackendFlags(v);
    }
    /** <unset>          \/\/ Main display size, in pixels (== GetMainViewport()->Size). May change every frame. */
    get DisplaySize() {
        return ImVec2.wrap(this._ptr.get_DisplaySize());
    }
    set DisplaySize(v) {
        this._ptr.set_DisplaySize(v._ptr);
    }
    /** = (1, 1)         \/\/ Main display density. For retina display where window coordinates are different from framebuffer coordinates. This will affect font density + will end up in ImDrawData::FramebufferScale. */
    get DisplayFramebufferScale() {
        return ImVec2.wrap(this._ptr.get_DisplayFramebufferScale());
    }
    set DisplayFramebufferScale(v) {
        this._ptr.set_DisplayFramebufferScale(v._ptr);
    }
    /** = 1.0f\/60.0f     \/\/ Time elapsed since last frame, in seconds. May change every frame. */
    get DeltaTime() {
        return this._ptr.get_DeltaTime();
    }
    set DeltaTime(v) {
        this._ptr.set_DeltaTime(v);
    }
    /** = 5.0f           \/\/ Minimum time between saving positions\/sizes to .ini file, in seconds. */
    get IniSavingRate() {
        return this._ptr.get_IniSavingRate();
    }
    set IniSavingRate(v) {
        this._ptr.set_IniSavingRate(v);
    }
    /** <auto>           \/\/ Font atlas: load, rasterize and pack one or more fonts into a single texture. */
    get Fonts() {
        return ImFontAtlas.wrap(this._ptr.get_Fonts());
    }
    set Fonts(v) {
        this._ptr.set_Fonts(v._ptr);
    }
    /** = NULL           \/\/ Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0]. */
    get FontDefault() {
        return ImFont.wrap(this._ptr.get_FontDefault());
    }
    set FontDefault(v) {
        this._ptr.set_FontDefault(v._ptr);
    }
    /** = false          \/\/ [OBSOLETE] Allow user scaling text of individual window with CTRL+Wheel. */
    get FontAllowUserScaling() {
        return this._ptr.get_FontAllowUserScaling();
    }
    set FontAllowUserScaling(v) {
        this._ptr.set_FontAllowUserScaling(v);
    }
    /** = false          \/\/ Swap Activate<>Cancel (A<>B) buttons, matching typical "Nintendo\/Japanese style" gamepad layout. */
    get ConfigNavSwapGamepadButtons() {
        return this._ptr.get_ConfigNavSwapGamepadButtons();
    }
    set ConfigNavSwapGamepadButtons(v) {
        this._ptr.set_ConfigNavSwapGamepadButtons(v);
    }
    /** = false          \/\/ Directional\/tabbing navigation teleports the mouse cursor. May be useful on TV\/console systems where moving a virtual mouse is difficult. Will update io.MousePos and set io.WantSetMousePos=true. */
    get ConfigNavMoveSetMousePos() {
        return this._ptr.get_ConfigNavMoveSetMousePos();
    }
    set ConfigNavMoveSetMousePos(v) {
        this._ptr.set_ConfigNavMoveSetMousePos(v);
    }
    /** = true           \/\/ Sets io.WantCaptureKeyboard when io.NavActive is set. */
    get ConfigNavCaptureKeyboard() {
        return this._ptr.get_ConfigNavCaptureKeyboard();
    }
    set ConfigNavCaptureKeyboard(v) {
        this._ptr.set_ConfigNavCaptureKeyboard(v);
    }
    /** = true           \/\/ Pressing Escape can clear focused item + navigation id\/highlight. Set to false if you want to always keep highlight on. */
    get ConfigNavEscapeClearFocusItem() {
        return this._ptr.get_ConfigNavEscapeClearFocusItem();
    }
    set ConfigNavEscapeClearFocusItem(v) {
        this._ptr.set_ConfigNavEscapeClearFocusItem(v);
    }
    /** = false          \/\/ Pressing Escape can clear focused window as well (super set of io.ConfigNavEscapeClearFocusItem). */
    get ConfigNavEscapeClearFocusWindow() {
        return this._ptr.get_ConfigNavEscapeClearFocusWindow();
    }
    set ConfigNavEscapeClearFocusWindow(v) {
        this._ptr.set_ConfigNavEscapeClearFocusWindow(v);
    }
    /** = true           \/\/ Using directional navigation key makes the cursor visible. Mouse click hides the cursor. */
    get ConfigNavCursorVisibleAuto() {
        return this._ptr.get_ConfigNavCursorVisibleAuto();
    }
    set ConfigNavCursorVisibleAuto(v) {
        this._ptr.set_ConfigNavCursorVisibleAuto(v);
    }
    /** = false          \/\/ Navigation cursor is always visible. */
    get ConfigNavCursorVisibleAlways() {
        return this._ptr.get_ConfigNavCursorVisibleAlways();
    }
    set ConfigNavCursorVisibleAlways(v) {
        this._ptr.set_ConfigNavCursorVisibleAlways(v);
    }
    /** = false          \/\/ Simplified docking mode: disable window splitting, so docking is limited to merging multiple windows together into tab-bars. */
    get ConfigDockingNoSplit() {
        return this._ptr.get_ConfigDockingNoSplit();
    }
    set ConfigDockingNoSplit(v) {
        this._ptr.set_ConfigDockingNoSplit(v);
    }
    /** = false          \/\/ Enable docking with holding Shift key (reduce visual noise, allows dropping in wider space) */
    get ConfigDockingWithShift() {
        return this._ptr.get_ConfigDockingWithShift();
    }
    set ConfigDockingWithShift(v) {
        this._ptr.set_ConfigDockingWithShift(v);
    }
    /** = false          \/\/ [BETA] [FIXME: This currently creates regression with auto-sizing and general overhead] Make every single floating window display within a docking node. */
    get ConfigDockingAlwaysTabBar() {
        return this._ptr.get_ConfigDockingAlwaysTabBar();
    }
    set ConfigDockingAlwaysTabBar(v) {
        this._ptr.set_ConfigDockingAlwaysTabBar(v);
    }
    /** = false          \/\/ [BETA] Make window or viewport transparent when docking and only display docking boxes on the target viewport. Useful if rendering of multiple viewport cannot be synced. Best used with ConfigViewportsNoAutoMerge. */
    get ConfigDockingTransparentPayload() {
        return this._ptr.get_ConfigDockingTransparentPayload();
    }
    set ConfigDockingTransparentPayload(v) {
        this._ptr.set_ConfigDockingTransparentPayload(v);
    }
    /** = false;         \/\/ Set to make all floating imgui windows always create their own viewport. Otherwise, they are merged into the main host viewports when overlapping it. May also set ImGuiViewportFlags_NoAutoMerge on individual viewport. */
    get ConfigViewportsNoAutoMerge() {
        return this._ptr.get_ConfigViewportsNoAutoMerge();
    }
    set ConfigViewportsNoAutoMerge(v) {
        this._ptr.set_ConfigViewportsNoAutoMerge(v);
    }
    /** = false          \/\/ Disable default OS task bar icon flag for secondary viewports. When a viewport doesn't want a task bar icon, ImGuiViewportFlags_NoTaskBarIcon will be set on it. */
    get ConfigViewportsNoTaskBarIcon() {
        return this._ptr.get_ConfigViewportsNoTaskBarIcon();
    }
    set ConfigViewportsNoTaskBarIcon(v) {
        this._ptr.set_ConfigViewportsNoTaskBarIcon(v);
    }
    /** = true           \/\/ Disable default OS window decoration flag for secondary viewports. When a viewport doesn't want window decorations, ImGuiViewportFlags_NoDecoration will be set on it. Enabling decoration can create subsequent issues at OS levels (e.g. minimum window size). */
    get ConfigViewportsNoDecoration() {
        return this._ptr.get_ConfigViewportsNoDecoration();
    }
    set ConfigViewportsNoDecoration(v) {
        this._ptr.set_ConfigViewportsNoDecoration(v);
    }
    /** = false          \/\/ Disable default OS parenting to main viewport for secondary viewports. By default, viewports are marked with ParentViewportId = <main_viewport>, expecting the platform backend to setup a parent\/child relationship between the OS windows (some backend may ignore this). Set to true if you want the default to be 0, then all viewports will be top-level OS windows. */
    get ConfigViewportsNoDefaultParent() {
        return this._ptr.get_ConfigViewportsNoDefaultParent();
    }
    set ConfigViewportsNoDefaultParent(v) {
        this._ptr.set_ConfigViewportsNoDefaultParent(v);
    }
    /** = false          \/\/ [EXPERIMENTAL] Automatically overwrite style.FontScaleDpi when Monitor DPI changes. This will scale fonts but _NOT_ scale sizes\/padding for now. */
    get ConfigDpiScaleFonts() {
        return this._ptr.get_ConfigDpiScaleFonts();
    }
    set ConfigDpiScaleFonts(v) {
        this._ptr.set_ConfigDpiScaleFonts(v);
    }
    /** = false          \/\/ [EXPERIMENTAL] Scale Dear ImGui and Platform Windows when Monitor DPI changes. */
    get ConfigDpiScaleViewports() {
        return this._ptr.get_ConfigDpiScaleViewports();
    }
    set ConfigDpiScaleViewports(v) {
        this._ptr.set_ConfigDpiScaleViewports(v);
    }
    /** = false          \/\/ Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor). Cannot be easily renamed to 'io.ConfigXXX' because this is frequently used by backend implementations. */
    get MouseDrawCursor() {
        return this._ptr.get_MouseDrawCursor();
    }
    set MouseDrawCursor(v) {
        this._ptr.set_MouseDrawCursor(v);
    }
    /** = defined(__APPLE__) \/\/ Swap Cmd<>Ctrl keys + OS X style text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd\/Super instead of Ctrl, Line\/Text Start and End using Cmd+Arrows instead of Home\/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd\/Super instead of Ctrl. */
    get ConfigMacOSXBehaviors() {
        return this._ptr.get_ConfigMacOSXBehaviors();
    }
    set ConfigMacOSXBehaviors(v) {
        this._ptr.set_ConfigMacOSXBehaviors(v);
    }
    /** = true           \/\/ Enable input queue trickling: some types of events submitted during the same frame (e.g. button down + up) will be spread over multiple frames, improving interactions with low framerates. */
    get ConfigInputTrickleEventQueue() {
        return this._ptr.get_ConfigInputTrickleEventQueue();
    }
    set ConfigInputTrickleEventQueue(v) {
        this._ptr.set_ConfigInputTrickleEventQueue(v);
    }
    /** = true           \/\/ Enable blinking cursor (optional as some users consider it to be distracting). */
    get ConfigInputTextCursorBlink() {
        return this._ptr.get_ConfigInputTextCursorBlink();
    }
    set ConfigInputTextCursorBlink(v) {
        this._ptr.set_ConfigInputTextCursorBlink(v);
    }
    /** = false          \/\/ [BETA] Pressing Enter will keep item active and select contents (single-line only). */
    get ConfigInputTextEnterKeepActive() {
        return this._ptr.get_ConfigInputTextEnterKeepActive();
    }
    set ConfigInputTextEnterKeepActive(v) {
        this._ptr.set_ConfigInputTextEnterKeepActive(v);
    }
    /** = false          \/\/ [BETA] Enable turning DragXXX widgets into text input with a simple mouse click-release (without moving). Not desirable on devices without a keyboard. */
    get ConfigDragClickToInputText() {
        return this._ptr.get_ConfigDragClickToInputText();
    }
    set ConfigDragClickToInputText(v) {
        this._ptr.set_ConfigDragClickToInputText(v);
    }
    /** = true           \/\/ Enable resizing of windows from their edges and from the lower-left corner. This requires ImGuiBackendFlags_HasMouseCursors for better mouse cursor feedback. (This used to be a per-window ImGuiWindowFlags_ResizeFromAnySide flag) */
    get ConfigWindowsResizeFromEdges() {
        return this._ptr.get_ConfigWindowsResizeFromEdges();
    }
    set ConfigWindowsResizeFromEdges(v) {
        this._ptr.set_ConfigWindowsResizeFromEdges(v);
    }
    /** = false      \/\/ Enable allowing to move windows only when clicking on their title bar. Does not apply to windows without a title bar. */
    get ConfigWindowsMoveFromTitleBarOnly() {
        return this._ptr.get_ConfigWindowsMoveFromTitleBarOnly();
    }
    set ConfigWindowsMoveFromTitleBarOnly(v) {
        this._ptr.set_ConfigWindowsMoveFromTitleBarOnly(v);
    }
    /** = false      \/\/ [EXPERIMENTAL] CTRL+C copy the contents of focused window into the clipboard. Experimental because: (1) has known issues with nested Begin\/End pairs (2) text output quality varies (3) text output is in submission order rather than spatial order. */
    get ConfigWindowsCopyContentsWithCtrlC() {
        return this._ptr.get_ConfigWindowsCopyContentsWithCtrlC();
    }
    set ConfigWindowsCopyContentsWithCtrlC(v) {
        this._ptr.set_ConfigWindowsCopyContentsWithCtrlC(v);
    }
    /** = true           \/\/ Enable scrolling page by page when clicking outside the scrollbar grab. When disabled, always scroll to clicked location. When enabled, Shift+Click scrolls to clicked location. */
    get ConfigScrollbarScrollByPage() {
        return this._ptr.get_ConfigScrollbarScrollByPage();
    }
    set ConfigScrollbarScrollByPage(v) {
        this._ptr.set_ConfigScrollbarScrollByPage(v);
    }
    /** = 60.0f          \/\/ Timer (in seconds) to free transient windows\/tables memory buffers when unused. Set to -1.0f to disable. */
    get ConfigMemoryCompactTimer() {
        return this._ptr.get_ConfigMemoryCompactTimer();
    }
    set ConfigMemoryCompactTimer(v) {
        this._ptr.set_ConfigMemoryCompactTimer(v);
    }
    /** = 0.30f          \/\/ Time for a double-click, in seconds. */
    get MouseDoubleClickTime() {
        return this._ptr.get_MouseDoubleClickTime();
    }
    set MouseDoubleClickTime(v) {
        this._ptr.set_MouseDoubleClickTime(v);
    }
    /** = 6.0f           \/\/ Distance threshold to stay in to validate a double-click, in pixels. */
    get MouseDoubleClickMaxDist() {
        return this._ptr.get_MouseDoubleClickMaxDist();
    }
    set MouseDoubleClickMaxDist(v) {
        this._ptr.set_MouseDoubleClickMaxDist(v);
    }
    /** = 6.0f           \/\/ Distance threshold before considering we are dragging. */
    get MouseDragThreshold() {
        return this._ptr.get_MouseDragThreshold();
    }
    set MouseDragThreshold(v) {
        this._ptr.set_MouseDragThreshold(v);
    }
    /** = 0.275f         \/\/ When holding a key\/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.). */
    get KeyRepeatDelay() {
        return this._ptr.get_KeyRepeatDelay();
    }
    set KeyRepeatDelay(v) {
        this._ptr.set_KeyRepeatDelay(v);
    }
    /** = 0.050f         \/\/ When holding a key\/button, rate at which it repeats, in seconds. */
    get KeyRepeatRate() {
        return this._ptr.get_KeyRepeatRate();
    }
    set KeyRepeatRate(v) {
        this._ptr.set_KeyRepeatRate(v);
    }
    /** = true       \/\/ Enable error recovery support. Some errors won't be detected and lead to direct crashes if recovery is disabled. */
    get ConfigErrorRecovery() {
        return this._ptr.get_ConfigErrorRecovery();
    }
    set ConfigErrorRecovery(v) {
        this._ptr.set_ConfigErrorRecovery(v);
    }
    /** = true       \/\/ Enable asserts on recoverable error. By default call IM_ASSERT() when returning from a failing IM_ASSERT_USER_ERROR() */
    get ConfigErrorRecoveryEnableAssert() {
        return this._ptr.get_ConfigErrorRecoveryEnableAssert();
    }
    set ConfigErrorRecoveryEnableAssert(v) {
        this._ptr.set_ConfigErrorRecoveryEnableAssert(v);
    }
    /** = true       \/\/ Enable debug log output on recoverable errors. */
    get ConfigErrorRecoveryEnableDebugLog() {
        return this._ptr.get_ConfigErrorRecoveryEnableDebugLog();
    }
    set ConfigErrorRecoveryEnableDebugLog(v) {
        this._ptr.set_ConfigErrorRecoveryEnableDebugLog(v);
    }
    /** = true       \/\/ Enable tooltip on recoverable errors. The tooltip include a way to enable asserts if they were disabled. */
    get ConfigErrorRecoveryEnableTooltip() {
        return this._ptr.get_ConfigErrorRecoveryEnableTooltip();
    }
    set ConfigErrorRecoveryEnableTooltip(v) {
        this._ptr.set_ConfigErrorRecoveryEnableTooltip(v);
    }
    /** = false          \/\/ Enable various tools calling IM_DEBUG_BREAK(). */
    get ConfigDebugIsDebuggerPresent() {
        return this._ptr.get_ConfigDebugIsDebuggerPresent();
    }
    set ConfigDebugIsDebuggerPresent(v) {
        this._ptr.set_ConfigDebugIsDebuggerPresent(v);
    }
    /** = true           \/\/ Highlight and show an error message popup when multiple items have conflicting identifiers. */
    get ConfigDebugHighlightIdConflicts() {
        return this._ptr.get_ConfigDebugHighlightIdConflicts();
    }
    set ConfigDebugHighlightIdConflicts(v) {
        this._ptr.set_ConfigDebugHighlightIdConflicts(v);
    }
    /** true \/\/ Show "Item Picker" button in aforementioned popup. */
    get ConfigDebugHighlightIdConflictsShowItemPicker() {
        return this._ptr.get_ConfigDebugHighlightIdConflictsShowItemPicker();
    }
    set ConfigDebugHighlightIdConflictsShowItemPicker(v) {
        this._ptr.set_ConfigDebugHighlightIdConflictsShowItemPicker(v);
    }
    /** = false          \/\/ First-time calls to Begin()\/BeginChild() will return false. NEEDS TO BE SET AT APPLICATION BOOT TIME if you don't want to miss windows. */
    get ConfigDebugBeginReturnValueOnce() {
        return this._ptr.get_ConfigDebugBeginReturnValueOnce();
    }
    set ConfigDebugBeginReturnValueOnce(v) {
        this._ptr.set_ConfigDebugBeginReturnValueOnce(v);
    }
    /** = false          \/\/ Some calls to Begin()\/BeginChild() will return false. Will cycle through window depths then repeat. Suggested use: add "io.ConfigDebugBeginReturnValue = io.KeyShift" in your main loop then occasionally press SHIFT. Windows should be flickering while running. */
    get ConfigDebugBeginReturnValueLoop() {
        return this._ptr.get_ConfigDebugBeginReturnValueLoop();
    }
    set ConfigDebugBeginReturnValueLoop(v) {
        this._ptr.set_ConfigDebugBeginReturnValueLoop(v);
    }
    /** = false          \/\/ Ignore io.AddFocusEvent(false), consequently not calling io.ClearInputKeys()\/io.ClearInputMouse() in input processing. */
    get ConfigDebugIgnoreFocusLoss() {
        return this._ptr.get_ConfigDebugIgnoreFocusLoss();
    }
    set ConfigDebugIgnoreFocusLoss(v) {
        this._ptr.set_ConfigDebugIgnoreFocusLoss(v);
    }
    /** = false          \/\/ Save .ini data with extra comments (particularly helpful for Docking, but makes saving slower) */
    get ConfigDebugIniSettings() {
        return this._ptr.get_ConfigDebugIniSettings();
    }
    set ConfigDebugIniSettings(v) {
        this._ptr.set_ConfigDebugIniSettings(v);
    }
    /** Set when Dear ImGui will use mouse inputs, in this case do not dispatch them to your main game\/application (either way, always pass on mouse inputs to imgui). (e.g. unclicked mouse is hovering over an imgui window, widget is active, mouse was clicked over an imgui window, etc.). */
    get WantCaptureMouse() {
        return this._ptr.get_WantCaptureMouse();
    }
    set WantCaptureMouse(v) {
        this._ptr.set_WantCaptureMouse(v);
    }
    /** Set when Dear ImGui will use keyboard inputs, in this case do not dispatch them to your main game\/application (either way, always pass keyboard inputs to imgui). (e.g. InputText active, or an imgui window is focused and navigation is enabled, etc.). */
    get WantCaptureKeyboard() {
        return this._ptr.get_WantCaptureKeyboard();
    }
    set WantCaptureKeyboard(v) {
        this._ptr.set_WantCaptureKeyboard(v);
    }
    /** Mobile\/console: when set, you may display an on-screen keyboard. This is set by Dear ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active). */
    get WantTextInput() {
        return this._ptr.get_WantTextInput();
    }
    set WantTextInput(v) {
        this._ptr.set_WantTextInput(v);
    }
    /** MousePos has been altered, backend should reposition mouse on next frame. Rarely used! Set only when io.ConfigNavMoveSetMousePos is enabled. */
    get WantSetMousePos() {
        return this._ptr.get_WantSetMousePos();
    }
    set WantSetMousePos(v) {
        this._ptr.set_WantSetMousePos(v);
    }
    /** When manual .ini load\/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. Important: clear io.WantSaveIniSettings yourself after saving! */
    get WantSaveIniSettings() {
        return this._ptr.get_WantSaveIniSettings();
    }
    set WantSaveIniSettings(v) {
        this._ptr.set_WantSaveIniSettings(v);
    }
    /** Keyboard\/Gamepad navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag. */
    get NavActive() {
        return this._ptr.get_NavActive();
    }
    set NavActive(v) {
        this._ptr.set_NavActive(v);
    }
    /** Keyboard\/Gamepad navigation highlight is visible and allowed (will handle ImGuiKey_NavXXX events). */
    get NavVisible() {
        return this._ptr.get_NavVisible();
    }
    set NavVisible(v) {
        this._ptr.set_NavVisible(v);
    }
    /** Estimate of application framerate (rolling average over 60 frames, based on io.DeltaTime), in frame per second. Solely for convenience. Slow applications may not want to use a moving average or may want to reset underlying buffers occasionally. */
    get Framerate() {
        return this._ptr.get_Framerate();
    }
    set Framerate(v) {
        this._ptr.set_Framerate(v);
    }
    /** Vertices output during last call to Render() */
    get MetricsRenderVertices() {
        return this._ptr.get_MetricsRenderVertices();
    }
    set MetricsRenderVertices(v) {
        this._ptr.set_MetricsRenderVertices(v);
    }
    /** Indices output during last call to Render() = number of triangles * 3 */
    get MetricsRenderIndices() {
        return this._ptr.get_MetricsRenderIndices();
    }
    set MetricsRenderIndices(v) {
        this._ptr.set_MetricsRenderIndices(v);
    }
    /** Number of visible windows */
    get MetricsRenderWindows() {
        return this._ptr.get_MetricsRenderWindows();
    }
    set MetricsRenderWindows(v) {
        this._ptr.set_MetricsRenderWindows(v);
    }
    /** Number of active windows */
    get MetricsActiveWindows() {
        return this._ptr.get_MetricsActiveWindows();
    }
    set MetricsActiveWindows(v) {
        this._ptr.set_MetricsActiveWindows(v);
    }
    /** Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing\/reappearing mouse won't have a huge delta. */
    get MouseDelta() {
        return ImVec2.wrap(this._ptr.get_MouseDelta());
    }
    set MouseDelta(v) {
        this._ptr.set_MouseDelta(v._ptr);
    }
    /** Parent UI context (needs to be set explicitly by parent). */
    get Ctx() {
        return ImGuiContext.wrap(this._ptr.get_Ctx());
    }
    set Ctx(v) {
        this._ptr.set_Ctx(v._ptr);
    }
    /** Mouse position, in pixels. Set to ImVec2(-FLT_MAX, -FLT_MAX) if mouse is unavailable (on another screen, etc.) */
    get MousePos() {
        return ImVec2.wrap(this._ptr.get_MousePos());
    }
    set MousePos(v) {
        this._ptr.set_MousePos(v._ptr);
    }
    /** Mouse wheel Vertical: 1 unit scrolls about 5 lines text. >0 scrolls Up, <0 scrolls Down. Hold SHIFT to turn vertical scroll into horizontal scroll. */
    get MouseWheel() {
        return this._ptr.get_MouseWheel();
    }
    set MouseWheel(v) {
        this._ptr.set_MouseWheel(v);
    }
    /** Mouse wheel Horizontal. >0 scrolls Left, <0 scrolls Right. Most users don't have a mouse with a horizontal wheel, may not be filled by all backends. */
    get MouseWheelH() {
        return this._ptr.get_MouseWheelH();
    }
    set MouseWheelH(v) {
        this._ptr.set_MouseWheelH(v);
    }
    /** Mouse actual input peripheral (Mouse\/TouchScreen\/Pen). */
    get MouseSource() {
        return this._ptr.get_MouseSource();
    }
    set MouseSource(v) {
        this._ptr.set_MouseSource(v);
    }
    /** (Optional) Modify using io.AddMouseViewportEvent(). With multi-viewports: viewport the OS mouse is hovering. If possible _IGNORING_ viewports with the ImGuiViewportFlags_NoInputs flag is much better (few backends can handle that). Set io.BackendFlags |= ImGuiBackendFlags_HasMouseHoveredViewport if you can provide this info. If you don't imgui will infer the value using the rectangles and last focused time of the viewports it knows about (ignoring other OS windows). */
    get MouseHoveredViewport() {
        return this._ptr.get_MouseHoveredViewport();
    }
    set MouseHoveredViewport(v) {
        this._ptr.set_MouseHoveredViewport(v);
    }
    /** Keyboard modifier down: Control */
    get KeyCtrl() {
        return this._ptr.get_KeyCtrl();
    }
    set KeyCtrl(v) {
        this._ptr.set_KeyCtrl(v);
    }
    /** Keyboard modifier down: Shift */
    get KeyShift() {
        return this._ptr.get_KeyShift();
    }
    set KeyShift(v) {
        this._ptr.set_KeyShift(v);
    }
    /** Keyboard modifier down: Alt */
    get KeyAlt() {
        return this._ptr.get_KeyAlt();
    }
    set KeyAlt(v) {
        this._ptr.set_KeyAlt(v);
    }
    /** Keyboard modifier down: Cmd\/Super\/Windows */
    get KeySuper() {
        return this._ptr.get_KeySuper();
    }
    set KeySuper(v) {
        this._ptr.set_KeySuper(v);
    }
    /** Key mods flags (any of ImGuiMod_Ctrl\/ImGuiMod_Shift\/ImGuiMod_Alt\/ImGuiMod_Super flags, same as io.KeyCtrl\/KeyShift\/KeyAlt\/KeySuper but merged into flags. Read-only, updated by NewFrame() */
    get KeyMods() {
        return this._ptr.get_KeyMods();
    }
    set KeyMods(v) {
        this._ptr.set_KeyMods(v);
    }
    /** Alternative to WantCaptureMouse: (WantCaptureMouse == true && WantCaptureMouseUnlessPopupClose == false) when a click over void is expected to close a popup. */
    get WantCaptureMouseUnlessPopupClose() {
        return this._ptr.get_WantCaptureMouseUnlessPopupClose();
    }
    set WantCaptureMouseUnlessPopupClose(v) {
        this._ptr.set_WantCaptureMouseUnlessPopupClose(v);
    }
    /** Previous mouse position (note that MouseDelta is not necessary == MousePos-MousePosPrev, in case either position is invalid) */
    get MousePosPrev() {
        return ImVec2.wrap(this._ptr.get_MousePosPrev());
    }
    set MousePosPrev(v) {
        this._ptr.set_MousePosPrev(v._ptr);
    }
    /** Queue a new key down\/up event. Key should be "translated" (as in, generally ImGuiKey_A matches the key end-user would use to emit an 'A' character) */
    AddKeyEvent(key, down) {
        return this._ptr.ImGuiIO_AddKeyEvent(key, down);
    }
    /** Queue a new key down\/up event for analog values (e.g. ImGuiKey_Gamepad_ values). Dead-zones should be handled by the backend. */
    AddKeyAnalogEvent(key, down, v) {
        return this._ptr.ImGuiIO_AddKeyAnalogEvent(key, down, v);
    }
    /** Queue a mouse position update. Use -FLT_MAX,-FLT_MAX to signify no mouse (e.g. app not focused and not hovered) */
    AddMousePosEvent(x, y) {
        return this._ptr.ImGuiIO_AddMousePosEvent(x, y);
    }
    /** Queue a mouse button change */
    AddMouseButtonEvent(button, down) {
        return this._ptr.ImGuiIO_AddMouseButtonEvent(button, down);
    }
    /** Queue a mouse wheel update. wheel_y<0: scroll down, wheel_y>0: scroll up, wheel_x<0: scroll right, wheel_x>0: scroll left. */
    AddMouseWheelEvent(wheel_x, wheel_y) {
        return this._ptr.ImGuiIO_AddMouseWheelEvent(wheel_x, wheel_y);
    }
    /** Queue a mouse source change (Mouse\/TouchScreen\/Pen) */
    AddMouseSourceEvent(source) {
        return this._ptr.ImGuiIO_AddMouseSourceEvent(source);
    }
    /** Queue a mouse hovered viewport. Requires backend to set ImGuiBackendFlags_HasMouseHoveredViewport to call this (for multi-viewport support). */
    AddMouseViewportEvent(id) {
        return this._ptr.ImGuiIO_AddMouseViewportEvent(id);
    }
    /** Queue a gain\/loss of focus for the application (generally based on OS\/platform focus of your window) */
    AddFocusEvent(focused) {
        return this._ptr.ImGuiIO_AddFocusEvent(focused);
    }
    /** Queue a new character input */
    AddInputCharacter(c) {
        return this._ptr.ImGuiIO_AddInputCharacter(c);
    }
    /** Queue a new character input from a UTF-16 character, it can be a surrogate */
    AddInputCharacterUTF16(c) {
        return this._ptr.ImGuiIO_AddInputCharacterUTF16(c);
    }
    /** Queue a new characters input from a UTF-8 string */
    AddInputCharactersUTF8(str) {
        return this._ptr.ImGuiIO_AddInputCharactersUTF8(str);
    }
    /** Set master flag for accepting key\/mouse\/text events (default to true). Useful if you have native dialog boxes that are interrupting your application loop\/refresh, and you want to disable events being queued while your app is frozen. */
    SetAppAcceptingEvents(accepting_events) {
        return this._ptr.ImGuiIO_SetAppAcceptingEvents(accepting_events);
    }
    /** Clear all incoming events. */
    ClearEventsQueue() {
        return this._ptr.ImGuiIO_ClearEventsQueue();
    }
    /** Clear current keyboard\/gamepad state + current frame text input buffer. Equivalent to releasing all keys\/buttons. */
    ClearInputKeys() {
        return this._ptr.ImGuiIO_ClearInputKeys();
    }
    /** Clear current mouse state. */
    ClearInputMouse() {
        return this._ptr.ImGuiIO_ClearInputMouse();
    }
}
/** Main IO structure returned by BeginMultiSelect()\/EndMultiSelect(). */
export class ImGuiMultiSelectIO extends StructBinding {
    constructor() {
        super("ImGuiMultiSelectIO");
    }
}
/** Draw command list */
export class ImDrawList extends StructBinding {
    constructor() {
        super("ImDrawList");
    }
}
/** All draw data to render a Dear ImGui frame */
export class ImDrawData extends StructBinding {
    constructor() {
        super("ImDrawData");
    }
}
/** A font input\/source (we may rename this to ImFontSource in the future) */
export class ImFontConfig extends StructBinding {
    constructor() {
        super("ImFontConfig");
    }
}
/** Load and rasterize multiple TTF\/OTF fonts into a same texture. The font atlas will build a single texture holding: */
export class ImFontAtlas extends StructBinding {
    constructor() {
        super("ImFontAtlas");
    }
}
/** Font runtime data for a given size */
export class ImFontBaked extends StructBinding {
    constructor() {
        super("ImFontBaked");
    }
}
/** Font runtime data and rendering */
export class ImFont extends StructBinding {
    constructor() {
        super("ImFont");
    }
}
/* -------------------------------------------------------------------------- */
/* 4. ImGui Object - Enums/Flags & Functions */
/* -------------------------------------------------------------------------- */
export const ImGui = Object.freeze({
    /* Enums/Flags */
    /** Flags for ImGui::Begin() */
    WindowFlags: {
        None: 0,
        /** Disable title-bar */
        NoTitleBar: 1,
        /** Disable user resizing with the lower-right grip */
        NoResize: 2,
        /** Disable user moving the window */
        NoMove: 4,
        /** Disable scrollbars (window can still scroll with mouse or programmatically) */
        NoScrollbar: 8,
        /** Disable user vertically scrolling with mouse wheel. On child window, mouse wheel will be forwarded to the parent unless NoScrollbar is also set. */
        NoScrollWithMouse: 16,
        /** Disable user collapsing window by double-clicking on it. Also referred to as Window Menu Button (e.g. within a docking node). */
        NoCollapse: 32,
        /** Resize every window to its content every frame */
        AlwaysAutoResize: 64,
        /** Disable drawing background color (WindowBg, etc.) and outside border. Similar as using SetNextWindowBgAlpha(0.0f). */
        NoBackground: 128,
        /** Never load\/save settings in .ini file */
        NoSavedSettings: 256,
        /** Disable catching mouse, hovering test with pass through. */
        NoMouseInputs: 512,
        /** Has a menu-bar */
        MenuBar: 1024,
        /** Allow horizontal scrollbar to appear (off by default). You may use SetNextWindowContentSize(ImVec2(width,0.0f)); prior to calling Begin() to specify width. Read code in imgui_demo in the "Horizontal Scrolling" section. */
        HorizontalScrollbar: 2048,
        /** Disable taking focus when transitioning from hidden to visible state */
        NoFocusOnAppearing: 4096,
        /** Disable bringing window to front when taking focus (e.g. clicking on it or programmatically giving it focus) */
        NoBringToFrontOnFocus: 8192,
        /** Always show vertical scrollbar (even if ContentSize.y < Size.y) */
        AlwaysVerticalScrollbar: 16384,
        /** Always show horizontal scrollbar (even if ContentSize.x < Size.x) */
        AlwaysHorizontalScrollbar: 32768,
        /** No keyboard\/gamepad navigation within the window */
        NoNavInputs: 65536,
        /** No focusing toward this window with keyboard\/gamepad navigation (e.g. skipped by CTRL+TAB) */
        NoNavFocus: 131072,
        /** Display a dot next to the title. When used in a tab\/docking context, tab is selected when clicking the X + closure is not assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar. */
        UnsavedDocument: 262144,
        /** Disable docking of this window */
        NoDocking: 524288,
        NoNav: 196608,
        NoDecoration: 43,
        NoInputs: 197120,
    },
    /** Flags for ImGui::BeginChild() */
    ChildFlags: {
        None: 0,
        /** Show an outer border and enable WindowPadding. (IMPORTANT: this is always == 1 == true for legacy reason) */
        Borders: 1,
        /** Pad with style.WindowPadding even if no border are drawn (no padding by default for non-bordered child windows because it makes more sense) */
        AlwaysUseWindowPadding: 2,
        /** Allow resize from right border (layout direction). Enable .ini saving (unless ImGuiWindowFlags_NoSavedSettings passed to window flags) */
        ResizeX: 4,
        /** Allow resize from bottom border (layout direction). " */
        ResizeY: 8,
        /** Enable auto-resizing width. Read "IMPORTANT: Size measurement" details above. */
        AutoResizeX: 16,
        /** Enable auto-resizing height. Read "IMPORTANT: Size measurement" details above. */
        AutoResizeY: 32,
        /** Combined with AutoResizeX\/AutoResizeY. Always measure size even when child is hidden, always return true, always disable clipping optimization! NOT RECOMMENDED. */
        AlwaysAutoResize: 64,
        /** Style the child window like a framed item: use FrameBg, FrameRounding, FrameBorderSize, FramePadding instead of ChildBg, ChildRounding, ChildBorderSize, WindowPadding. */
        FrameStyle: 128,
        /** [BETA] Share focus scope, allow keyboard\/gamepad navigation to cross over parent border to this child or between sibling child windows. */
        NavFlattened: 256,
    },
    /** Flags for ImGui::PushItemFlag() */
    ItemFlags: {
        /** (Default) */
        None: 0,
        /** false    \/\/ Disable keyboard tabbing. This is a "lighter" version of ImGuiItemFlags_NoNav. */
        NoTabStop: 1,
        /** false    \/\/ Disable any form of focusing (keyboard\/gamepad directional navigation and SetKeyboardFocusHere() calls). */
        NoNav: 2,
        /** false    \/\/ Disable item being a candidate for default focus (e.g. used by title bar items). */
        NoNavDefaultFocus: 4,
        /** false    \/\/ Any button-like behavior will have repeat mode enabled (based on io.KeyRepeatDelay and io.KeyRepeatRate values). Note that you can also call IsItemActive() after any button to tell if it is being held. */
        ButtonRepeat: 8,
        /** true     \/\/ MenuItem()\/Selectable() automatically close their parent popup window. */
        AutoClosePopups: 16,
        /** false    \/\/ Allow submitting an item with the same identifier as an item already submitted this frame without triggering a warning tooltip if io.ConfigDebugHighlightIdConflicts is set. */
        AllowDuplicateId: 32,
    },
    /** Flags for ImGui::InputText() */
    InputTextFlags: {
        None: 0,
        /** Allow 0123456789.+-*\/ */
        CharsDecimal: 1,
        /** Allow 0123456789ABCDEFabcdef */
        CharsHexadecimal: 2,
        /** Allow 0123456789.+-*\/eE (Scientific notation input) */
        CharsScientific: 4,
        /** Turn a..z into A..Z */
        CharsUppercase: 8,
        /** Filter out spaces, tabs */
        CharsNoBlank: 16,
        /** Pressing TAB input a '\t' character into the text field */
        AllowTabInput: 32,
        /** Return 'true' when Enter is pressed (as opposed to every time the value was modified). Consider using IsItemDeactivatedAfterEdit() instead! */
        EnterReturnsTrue: 64,
        /** Escape key clears content if not empty, and deactivate otherwise (contrast to default behavior of Escape to revert) */
        EscapeClearsAll: 128,
        /** In multi-line mode, validate with Enter, add new line with Ctrl+Enter (default is opposite: validate with Ctrl+Enter, add line with Enter). */
        CtrlEnterForNewLine: 256,
        /** Read-only mode */
        ReadOnly: 512,
        /** Password mode, display all characters as '*', disable copy */
        Password: 1024,
        /** Overwrite mode */
        AlwaysOverwrite: 2048,
        /** Select entire text when first taking mouse focus */
        AutoSelectAll: 4096,
        /** InputFloat(), InputInt(), InputScalar() etc. only: parse empty string as zero value. */
        ParseEmptyRefVal: 8192,
        /** InputFloat(), InputInt(), InputScalar() etc. only: when value is zero, do not display it. Generally used with ImGuiInputTextFlags_ParseEmptyRefVal. */
        DisplayEmptyRefVal: 16384,
        /** Disable following the cursor horizontally */
        NoHorizontalScroll: 32768,
        /** Disable undo\/redo. Note that input text owns the text data while active, if you want to provide your own undo\/redo stack you need e.g. to call ClearActiveID(). */
        NoUndoRedo: 65536,
        /** When text doesn't fit, elide left side to ensure right side stays visible. Useful for path\/filenames. Single-line only! */
        ElideLeft: 131072,
        /** Callback on pressing TAB (for completion handling) */
        CallbackCompletion: 262144,
        /** Callback on pressing Up\/Down arrows (for history handling) */
        CallbackHistory: 524288,
        /** Callback on each iteration. User code may query cursor position, modify text buffer. */
        CallbackAlways: 1048576,
        /** Callback on character inputs to replace or discard them. Modify 'EventChar' to replace or discard, or return 1 in callback to discard. */
        CallbackCharFilter: 2097152,
        /** Callback on buffer capacity changes request (beyond 'buf_size' parameter value), allowing the string to grow. Notify when the string wants to be resized (for string types which hold a cache of their Size). You will be provided a new BufSize in the callback and NEED to honor it. (see misc\/cpp\/imgui_stdlib.h for an example of using this) */
        CallbackResize: 4194304,
        /** Callback on any edit. Note that InputText() already returns true on edit + you can always use IsItemEdited(). The callback is useful to manipulate the underlying buffer while focus is active. */
        CallbackEdit: 8388608,
    },
    /** Flags for ImGui::TreeNodeEx(), ImGui::CollapsingHeader*() */
    TreeNodeFlags: {
        None: 0,
        /** Draw as selected */
        Selected: 1,
        /** Draw frame with background (e.g. for CollapsingHeader) */
        Framed: 2,
        /** Hit testing to allow subsequent widgets to overlap this one */
        AllowOverlap: 4,
        /** Don't do a TreePush() when open (e.g. for CollapsingHeader) = no extra indent nor pushing on ID stack */
        NoTreePushOnOpen: 8,
        /** Don't automatically and temporarily open node when Logging is active (by default logging will automatically open tree nodes) */
        NoAutoOpenOnLog: 16,
        /** Default node to be open */
        DefaultOpen: 32,
        /** Open on double-click instead of simple click (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined. */
        OpenOnDoubleClick: 64,
        /** Open when clicking on the arrow part (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined. */
        OpenOnArrow: 128,
        /** No collapsing, no arrow (use as a convenience for leaf nodes). */
        Leaf: 256,
        /** Display a bullet instead of arrow. IMPORTANT: node can still be marked open\/close if you don't set the _Leaf flag! */
        Bullet: 512,
        /** Use FramePadding (even for an unframed text node) to vertically align text baseline to regular widget height. Equivalent to calling AlignTextToFramePadding() before the node. */
        FramePadding: 1024,
        /** Extend hit box to the right-most edge, even if not framed. This is not the default in order to allow adding other items on the same line without using AllowOverlap mode. */
        SpanAvailWidth: 2048,
        /** Extend hit box to the left-most and right-most edges (cover the indent area). */
        SpanFullWidth: 4096,
        /** Narrow hit box + narrow hovering highlight, will only cover the label text. */
        SpanLabelWidth: 8192,
        /** Frame will span all columns of its container table (label will still fit in current column) */
        SpanAllColumns: 16384,
        /** Label will span all columns of its container table */
        LabelSpanAllColumns: 32768,
        /** Nav: left arrow moves back to parent. This is processed in TreePop() when there's an unfullfilled Left nav request remaining. */
        NavLeftJumpsToParent: 131072,
        CollapsingHeader: 26,
        /** No lines drawn */
        DrawLinesNone: 262144,
        /** Horizontal lines to child nodes. Vertical line drawn down to TreePop() position: cover full contents. Faster (for large trees). */
        DrawLinesFull: 524288,
        /** Horizontal lines to child nodes. Vertical line drawn down to bottom-most child node. Slower (for large trees). */
        DrawLinesToNodes: 1048576,
    },
    /** Flags for OpenPopup*(), BeginPopupContext*(), IsPopupOpen() functions. */
    PopupFlags: {
        None: 0,
        /** For BeginPopupContext*(): open on Left Mouse release. Guaranteed to always be == 0 (same as ImGuiMouseButton_Left) */
        MouseButtonLeft: 0,
        /** For BeginPopupContext*(): open on Right Mouse release. Guaranteed to always be == 1 (same as ImGuiMouseButton_Right) */
        MouseButtonRight: 1,
        /** For BeginPopupContext*(): open on Middle Mouse release. Guaranteed to always be == 2 (same as ImGuiMouseButton_Middle) */
        MouseButtonMiddle: 2,
        /** For OpenPopup*(), BeginPopupContext*(): don't reopen same popup if already open (won't reposition, won't reinitialize navigation) */
        NoReopen: 32,
        /** For OpenPopup*(), BeginPopupContext*(): don't open if there's already a popup at the same level of the popup stack */
        NoOpenOverExistingPopup: 128,
        /** For BeginPopupContextWindow(): don't return true when hovering items, only when hovering empty space */
        NoOpenOverItems: 256,
        /** For IsPopupOpen(): ignore the ImGuiID parameter and test for any popup. */
        AnyPopupId: 1024,
        /** For IsPopupOpen(): search\/test at any level of the popup stack (default test in the current level) */
        AnyPopupLevel: 2048,
        AnyPopup: 3072,
    },
    /** Flags for ImGui::Selectable() */
    SelectableFlags: {
        None: 0,
        /** Clicking this doesn't close parent popup window (overrides ImGuiItemFlags_AutoClosePopups) */
        NoAutoClosePopups: 1,
        /** Frame will span all columns of its container table (text will still fit in current column) */
        SpanAllColumns: 2,
        /** Generate press events on double clicks too */
        AllowDoubleClick: 4,
        /** Cannot be selected, display grayed out text */
        Disabled: 8,
        /** (WIP) Hit testing to allow subsequent widgets to overlap this one */
        AllowOverlap: 16,
        /** Make the item be displayed as if it is hovered */
        Highlight: 32,
    },
    /** Flags for ImGui::BeginCombo() */
    ComboFlags: {
        None: 0,
        /** Align the popup toward the left by default */
        PopupAlignLeft: 1,
        /** Max ~4 items visible. Tip: If you want your combo popup to be a specific size you can use SetNextWindowSizeConstraints() prior to calling BeginCombo() */
        HeightSmall: 2,
        /** Max ~8 items visible (default) */
        HeightRegular: 4,
        /** Max ~20 items visible */
        HeightLarge: 8,
        /** As many fitting items as possible */
        HeightLargest: 16,
        /** Display on the preview box without the square arrow button */
        NoArrowButton: 32,
        /** Display only a square arrow button */
        NoPreview: 64,
        /** Width dynamically calculated from preview contents */
        WidthFitPreview: 128,
    },
    /** Flags for ImGui::BeginTabBar() */
    TabBarFlags: {
        None: 0,
        /** Allow manually dragging tabs to re-order them + New tabs are appended at the end of list */
        Reorderable: 1,
        /** Automatically select new tabs when they appear */
        AutoSelectNewTabs: 2,
        /** Disable buttons to open the tab list popup */
        TabListPopupButton: 4,
        /** Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false. */
        NoCloseWithMiddleMouseButton: 8,
        /** Disable scrolling buttons (apply when fitting policy is ImGuiTabBarFlags_FittingPolicyScroll) */
        NoTabListScrollingButtons: 16,
        /** Disable tooltips when hovering a tab */
        NoTooltip: 32,
        /** Draw selected overline markers over selected tab */
        DrawSelectedOverline: 64,
        /** Resize tabs when they don't fit */
        FittingPolicyResizeDown: 128,
        /** Add scroll buttons when tabs don't fit */
        FittingPolicyScroll: 256,
    },
    /** Flags for ImGui::BeginTabItem() */
    TabItemFlags: {
        None: 0,
        /** Display a dot next to the title + set ImGuiTabItemFlags_NoAssumedClosure. */
        UnsavedDocument: 1,
        /** Trigger flag to programmatically make the tab selected when calling BeginTabItem() */
        SetSelected: 2,
        /** Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false. */
        NoCloseWithMiddleMouseButton: 4,
        /** Don't call PushID()\/PopID() on BeginTabItem()\/EndTabItem() */
        NoPushId: 8,
        /** Disable tooltip for the given tab */
        NoTooltip: 16,
        /** Disable reordering this tab or having another tab cross over this tab */
        NoReorder: 32,
        /** Enforce the tab position to the left of the tab bar (after the tab list popup button) */
        Leading: 64,
        /** Enforce the tab position to the right of the tab bar (before the scrolling buttons) */
        Trailing: 128,
        /** Tab is selected when trying to close + closure is not immediately assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar. */
        NoAssumedClosure: 256,
    },
    /** Flags for ImGui::IsWindowFocused() */
    FocusedFlags: {
        None: 0,
        /** Return true if any children of the window is focused */
        ChildWindows: 1,
        /** Test from root window (top most parent of the current hierarchy) */
        RootWindow: 2,
        /** Return true if any window is focused. Important: If you are trying to tell how to dispatch your low-level inputs, do NOT use this. Use 'io.WantCaptureMouse' instead! Please read the FAQ! */
        AnyWindow: 4,
        /** Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow) */
        NoPopupHierarchy: 8,
        /** Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow) */
        DockHierarchy: 16,
        RootAndChildWindows: 3,
    },
    /** Flags for ImGui::IsItemHovered(), ImGui::IsWindowHovered() */
    HoveredFlags: {
        /** Return true if directly over the item\/window, not obstructed by another window, not obstructed by an active popup or modal blocking inputs under them. */
        None: 0,
        /** IsWindowHovered() only: Return true if any children of the window is hovered */
        ChildWindows: 1,
        /** IsWindowHovered() only: Test from root window (top most parent of the current hierarchy) */
        RootWindow: 2,
        /** IsWindowHovered() only: Return true if any window is hovered */
        AnyWindow: 4,
        /** IsWindowHovered() only: Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow) */
        NoPopupHierarchy: 8,
        /** IsWindowHovered() only: Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow) */
        DockHierarchy: 16,
        /** Return true even if a popup window is normally blocking access to this item\/window */
        AllowWhenBlockedByPopup: 32,
        /** Return true even if an active item is blocking access to this item\/window. Useful for Drag and Drop patterns. */
        AllowWhenBlockedByActiveItem: 128,
        /** IsItemHovered() only: Return true even if the item uses AllowOverlap mode and is overlapped by another hoverable item. */
        AllowWhenOverlappedByItem: 256,
        /** IsItemHovered() only: Return true even if the position is obstructed or overlapped by another window. */
        AllowWhenOverlappedByWindow: 512,
        /** IsItemHovered() only: Return true even if the item is disabled */
        AllowWhenDisabled: 1024,
        /** IsItemHovered() only: Disable using keyboard\/gamepad navigation state when active, always query mouse */
        NoNavOverride: 2048,
        AllowWhenOverlapped: 768,
        RectOnly: 928,
        RootAndChildWindows: 3,
        /** Shortcut for standard flags when using IsItemHovered() + SetTooltip() sequence. */
        ForTooltip: 4096,
        /** Require mouse to be stationary for style.HoverStationaryDelay (~0.15 sec) _at least one time_. After this, can move on same item\/window. Using the stationary test tends to reduces the need for a long delay. */
        Stationary: 8192,
        /** IsItemHovered() only: Return true immediately (default). As this is the default you generally ignore this. */
        DelayNone: 16384,
        /** IsItemHovered() only: Return true after style.HoverDelayShort elapsed (~0.15 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item). */
        DelayShort: 32768,
        /** IsItemHovered() only: Return true after style.HoverDelayNormal elapsed (~0.40 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item). */
        DelayNormal: 65536,
        /** IsItemHovered() only: Disable shared delay system where moving from one item to the next keeps the previous timer for a short time (standard for tooltips with long delays) */
        NoSharedDelay: 131072,
    },
    /** Flags for ImGui::DockSpace(), shared\/inherited by child nodes. */
    DockNodeFlags: {
        None: 0,
        /**       \/\/ Don't display the dockspace node but keep it alive. Windows docked into this dockspace node won't be undocked. */
        KeepAliveOnly: 1,
        /**       \/\/ Disable docking over the Central Node, which will be always kept empty. */
        NoDockingOverCentralNode: 4,
        /**       \/\/ Enable passthru dockspace: 1) DockSpace() will render a ImGuiCol_WindowBg background covering everything excepted the Central Node when empty. Meaning the host window should probably use SetNextWindowBgAlpha(0.0f) prior to Begin() when using this. 2) When Central Node is empty: let inputs pass-through + won't display a DockingEmptyBg background. See demo for details. */
        PassthruCentralNode: 8,
        /**       \/\/ Disable other windows\/nodes from splitting this node. */
        NoDockingSplit: 16,
        /** Saved \/\/ Disable resizing node using the splitter\/separators. Useful with programmatically setup dockspaces. */
        NoResize: 32,
        /**       \/\/ Tab bar will automatically hide when there is a single window in the dock node. */
        AutoHideTabBar: 64,
        /**       \/\/ Disable undocking this node. */
        NoUndocking: 128,
    },
    /** Flags for ImGui::BeginDragDropSource(), ImGui::AcceptDragDropPayload() */
    DragDropFlags: {
        None: 0,
        /** Disable preview tooltip. By default, a successful call to BeginDragDropSource opens a tooltip so you can display a preview or description of the source contents. This flag disables this behavior. */
        SourceNoPreviewTooltip: 1,
        /** By default, when dragging we clear data so that IsItemHovered() will return false, to avoid subsequent user code submitting tooltips. This flag disables this behavior so you can still call IsItemHovered() on the source item. */
        SourceNoDisableHover: 2,
        /** Disable the behavior that allows to open tree nodes and collapsing header by holding over them while dragging a source item. */
        SourceNoHoldToOpenOthers: 4,
        /** Allow items such as Text(), Image() that have no unique identifier to be used as drag source, by manufacturing a temporary identifier based on their window-relative position. This is extremely unusual within the dear imgui ecosystem and so we made it explicit. */
        SourceAllowNullID: 8,
        /** External source (from outside of dear imgui), won't attempt to read current item\/window info. Will always return true. Only one Extern source can be active simultaneously. */
        SourceExtern: 16,
        /** Automatically expire the payload if the source cease to be submitted (otherwise payloads are persisting while being dragged) */
        PayloadAutoExpire: 32,
        /** Hint to specify that the payload may not be copied outside current dear imgui context. */
        PayloadNoCrossContext: 64,
        /** Hint to specify that the payload may not be copied outside current process. */
        PayloadNoCrossProcess: 128,
        /** AcceptDragDropPayload() will returns true even before the mouse button is released. You can then call IsDelivery() to test if the payload needs to be delivered. */
        AcceptBeforeDelivery: 1024,
        /** Do not draw the default highlight rectangle when hovering over target. */
        AcceptNoDrawDefaultRect: 2048,
        /** Request hiding the BeginDragDropSource tooltip from the BeginDragDropTarget site. */
        AcceptNoPreviewTooltip: 4096,
        /** For peeking ahead and inspecting the payload before delivery. */
        AcceptPeekOnly: 3072,
    },
    /** A primary data type */
    DataType: {
        /** signed char \/ char (with sensible compilers) */
        S8: 0,
        /** unsigned char */
        U8: 1,
        /** short */
        S16: 2,
        /** unsigned short */
        U16: 3,
        /** int */
        S32: 4,
        /** unsigned int */
        U32: 5,
        /** long long \/ __int64 */
        S64: 6,
        /** unsigned long long \/ unsigned __int64 */
        U64: 7,
        /** float */
        Float: 8,
        /** double */
        Double: 9,
        /** bool (provided for user convenience, not supported by scalar widgets) */
        Bool: 10,
        /** char* (provided for user convenience, not supported by scalar widgets) */
        String: 11,
        COUNT: 12,
    },
    /** A cardinal direction */
    Dir: {
        _None: -1,
        _Left: 0,
        _Right: 1,
        _Up: 2,
        _Down: 3,
        _COUNT: 4,
    },
    /** A sorting direction */
    SortDirection: {
        _None: 0,
        /** Ascending = 0->9, A->Z etc. */
        _Ascending: 1,
        /** Descending = 9->0, Z->A etc. */
        _Descending: 2,
    },
    /** A key identifier (ImGuiKey_XXX or ImGuiMod_XXX value): can represent Keyboard, Mouse and Gamepad values. */
    Key: {
        _None: 0,
        /** First valid key value (other than 0) */
        _NamedKey_BEGIN: 512,
        /** == ImGuiKey_NamedKey_BEGIN */
        _Tab: 512,
        _LeftArrow: 513,
        _RightArrow: 514,
        _UpArrow: 515,
        _DownArrow: 516,
        _PageUp: 517,
        _PageDown: 518,
        _Home: 519,
        _End: 520,
        _Insert: 521,
        _Delete: 522,
        _Backspace: 523,
        _Space: 524,
        _Enter: 525,
        _Escape: 526,
        _LeftCtrl: 527,
        _LeftShift: 528,
        _LeftAlt: 529,
        /** Also see ImGuiMod_Ctrl, ImGuiMod_Shift, ImGuiMod_Alt, ImGuiMod_Super below! */
        _LeftSuper: 530,
        _RightCtrl: 531,
        _RightShift: 532,
        _RightAlt: 533,
        _RightSuper: 534,
        _Menu: 535,
        _0: 536,
        _1: 537,
        _2: 538,
        _3: 539,
        _4: 540,
        _5: 541,
        _6: 542,
        _7: 543,
        _8: 544,
        _9: 545,
        _A: 546,
        _B: 547,
        _C: 548,
        _D: 549,
        _E: 550,
        _F: 551,
        _G: 552,
        _H: 553,
        _I: 554,
        _J: 555,
        _K: 556,
        _L: 557,
        _M: 558,
        _N: 559,
        _O: 560,
        _P: 561,
        _Q: 562,
        _R: 563,
        _S: 564,
        _T: 565,
        _U: 566,
        _V: 567,
        _W: 568,
        _X: 569,
        _Y: 570,
        _Z: 571,
        _F1: 572,
        _F2: 573,
        _F3: 574,
        _F4: 575,
        _F5: 576,
        _F6: 577,
        _F7: 578,
        _F8: 579,
        _F9: 580,
        _F10: 581,
        _F11: 582,
        _F12: 583,
        _F13: 584,
        _F14: 585,
        _F15: 586,
        _F16: 587,
        _F17: 588,
        _F18: 589,
        _F19: 590,
        _F20: 591,
        _F21: 592,
        _F22: 593,
        _F23: 594,
        _F24: 595,
        /** ' */
        _Apostrophe: 596,
        /** , */
        _Comma: 597,
        /** - */
        _Minus: 598,
        /** . */
        _Period: 599,
        /** \/ */
        _Slash: 600,
        /** ; */
        _Semicolon: 601,
        /** = */
        _Equal: 602,
        /** [ */
        _LeftBracket: 603,
        /** \ (this text inhibit multiline comment caused by backslash) */
        _Backslash: 604,
        /** ] */
        _RightBracket: 605,
        /** ` */
        _GraveAccent: 606,
        _CapsLock: 607,
        _ScrollLock: 608,
        _NumLock: 609,
        _PrintScreen: 610,
        _Pause: 611,
        _Keypad0: 612,
        _Keypad1: 613,
        _Keypad2: 614,
        _Keypad3: 615,
        _Keypad4: 616,
        _Keypad5: 617,
        _Keypad6: 618,
        _Keypad7: 619,
        _Keypad8: 620,
        _Keypad9: 621,
        _KeypadDecimal: 622,
        _KeypadDivide: 623,
        _KeypadMultiply: 624,
        _KeypadSubtract: 625,
        _KeypadAdd: 626,
        _KeypadEnter: 627,
        _KeypadEqual: 628,
        /** Available on some keyboard\/mouses. Often referred as "Browser Back" */
        _AppBack: 629,
        _AppForward: 630,
        /** Non-US backslash. */
        _Oem102: 631,
        /** Menu        | +       | Options  | */
        _GamepadStart: 632,
        /** View        | -       | Share    | */
        _GamepadBack: 633,
        /** X           | Y       | Square   | Tap: Toggle Menu. Hold: Windowing mode (Focus\/Move\/Resize windows) */
        _GamepadFaceLeft: 634,
        /** B           | A       | Circle   | Cancel \/ Close \/ Exit */
        _GamepadFaceRight: 635,
        /** Y           | X       | Triangle | Text Input \/ On-screen Keyboard */
        _GamepadFaceUp: 636,
        /** A           | B       | Cross    | Activate \/ Open \/ Toggle \/ Tweak */
        _GamepadFaceDown: 637,
        /** D-pad Left  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadLeft: 638,
        /** D-pad Right | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadRight: 639,
        /** D-pad Up    | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadUp: 640,
        /** D-pad Down  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadDown: 641,
        /** L Bumper    | L       | L1       | Tweak Slower \/ Focus Previous (in Windowing mode) */
        _GamepadL1: 642,
        /** R Bumper    | R       | R1       | Tweak Faster \/ Focus Next (in Windowing mode) */
        _GamepadR1: 643,
        /** L Trigger   | ZL      | L2       | [Analog] */
        _GamepadL2: 644,
        /** R Trigger   | ZR      | R2       | [Analog] */
        _GamepadR2: 645,
        /** L Stick     | L3      | L3       | */
        _GamepadL3: 646,
        /** R Stick     | R3      | R3       | */
        _GamepadR3: 647,
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickLeft: 648,
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickRight: 649,
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickUp: 650,
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickDown: 651,
        /**             |         |          | [Analog] */
        _GamepadRStickLeft: 652,
        /**             |         |          | [Analog] */
        _GamepadRStickRight: 653,
        /**             |         |          | [Analog] */
        _GamepadRStickUp: 654,
        /**             |         |          | [Analog] */
        _GamepadRStickDown: 655,
        _MouseLeft: 656,
        _MouseRight: 657,
        _MouseMiddle: 658,
        _MouseX1: 659,
        _MouseX2: 660,
        _MouseWheelX: 661,
        _MouseWheelY: 662,
        ImGuiMod_None: 0,
        /** Ctrl (non-macOS), Cmd (macOS) */
        ImGuiMod_Ctrl: 4096,
        /** Shift */
        ImGuiMod_Shift: 8192,
        /** Option\/Menu */
        ImGuiMod_Alt: 16384,
        /** Windows\/Super (non-macOS), Ctrl (macOS) */
        ImGuiMod_Super: 32768,
    },
    /** Flags for Shortcut(), SetNextItemShortcut(), */
    InputFlags: {
        None: 0,
        /** Enable repeat. Return true on successive repeats. Default for legacy IsKeyPressed(). NOT Default for legacy IsMouseClicked(). MUST BE == 1. */
        Repeat: 1,
        /** Route to active item only. */
        RouteActive: 1024,
        /** Route to windows in the focus stack (DEFAULT). Deep-most focused window takes inputs. Active item takes inputs over deep-most focused window. */
        RouteFocused: 2048,
        /** Global route (unless a focused window or active item registered the route). */
        RouteGlobal: 4096,
        /** Do not register route, poll keys directly. */
        RouteAlways: 8192,
        /** Option: global route: higher priority than focused route (unless active item in focused route). */
        RouteOverFocused: 16384,
        /** Option: global route: higher priority than active item. Unlikely you need to use that: will interfere with every active items, e.g. CTRL+A registered by InputText will be overridden by this. May not be fully honored as user\/internal code is likely to always assume they can access keys when active. */
        RouteOverActive: 32768,
        /** Option: global route: will not be applied if underlying background\/void is focused (== no Dear ImGui windows are focused). Useful for overlay applications. */
        RouteUnlessBgFocused: 65536,
        /** Option: route evaluated from the point of view of root window rather than current window. */
        RouteFromRootWindow: 131072,
        /** Automatically display a tooltip when hovering item [BETA] Unsure of right api (opt-in\/opt-out) */
        Tooltip: 262144,
    },
    /** Configuration flags stored in io.ConfigFlags. Set by user\/application. */
    ConfigFlags: {
        None: 0,
        /** Master keyboard navigation enable flag. Enable full Tabbing + directional arrows + space\/enter to activate. */
        NavEnableKeyboard: 1,
        /** Master gamepad navigation enable flag. Backend also needs to set ImGuiBackendFlags_HasGamepad. */
        NavEnableGamepad: 2,
        /** Instruct dear imgui to disable mouse inputs and interactions. */
        NoMouse: 16,
        /** Instruct backend to not alter mouse cursor shape and visibility. Use if the backend cursor changes are interfering with yours and you don't want to use SetMouseCursor() to change mouse cursor. You may want to honor requests from imgui by reading GetMouseCursor() yourself instead. */
        NoMouseCursorChange: 32,
        /** Instruct dear imgui to disable keyboard inputs and interactions. This is done by ignoring keyboard events and clearing existing states. */
        NoKeyboard: 64,
        /** Docking enable flags. */
        DockingEnable: 128,
        /** Viewport enable flags (require both ImGuiBackendFlags_PlatformHasViewports + ImGuiBackendFlags_RendererHasViewports set by the respective backends) */
        ViewportsEnable: 1024,
        /** Application is SRGB-aware. */
        IsSRGB: 1048576,
        /** Application is using a touch screen instead of a mouse. */
        IsTouchScreen: 2097152,
    },
    /** Backend capabilities flags stored in io.BackendFlags. Set by imgui_impl_xxx or custom backend. */
    BackendFlags: {
        None: 0,
        /** Backend Platform supports gamepad and currently has one connected. */
        HasGamepad: 1,
        /** Backend Platform supports honoring GetMouseCursor() value to change the OS cursor shape. */
        HasMouseCursors: 2,
        /** Backend Platform supports io.WantSetMousePos requests to reposition the OS mouse position (only used if io.ConfigNavMoveSetMousePos is set). */
        HasSetMousePos: 4,
        /** Backend Renderer supports ImDrawCmd::VtxOffset. This enables output of large meshes (64K+ vertices) while still using 16-bit indices. */
        RendererHasVtxOffset: 8,
        /** Backend Renderer supports ImTextureData requests to create\/update\/destroy textures. This enables incremental texture updates and texture reloads. */
        RendererHasTextures: 16,
        /** Backend Platform supports multiple viewports. */
        PlatformHasViewports: 1024,
        /** Backend Platform supports calling io.AddMouseViewportEvent() with the viewport under the mouse. IF POSSIBLE, ignore viewports with the ImGuiViewportFlags_NoInputs flag (Win32 backend, GLFW 3.30+ backend can do this, SDL backend cannot). If this cannot be done, Dear ImGui needs to use a flawed heuristic to find the viewport under. */
        HasMouseHoveredViewport: 2048,
        /** Backend Renderer supports multiple viewports. */
        RendererHasViewports: 4096,
    },
    /** Enumeration for PushStyleColor() \/ PopStyleColor() */
    Col: {
        Text: 0,
        TextDisabled: 1,
        /** Background of normal windows */
        WindowBg: 2,
        /** Background of child windows */
        ChildBg: 3,
        /** Background of popups, menus, tooltips windows */
        PopupBg: 4,
        Border: 5,
        BorderShadow: 6,
        /** Background of checkbox, radio button, plot, slider, text input */
        FrameBg: 7,
        FrameBgHovered: 8,
        FrameBgActive: 9,
        /** Title bar */
        TitleBg: 10,
        /** Title bar when focused */
        TitleBgActive: 11,
        /** Title bar when collapsed */
        TitleBgCollapsed: 12,
        MenuBarBg: 13,
        ScrollbarBg: 14,
        ScrollbarGrab: 15,
        ScrollbarGrabHovered: 16,
        ScrollbarGrabActive: 17,
        /** Checkbox tick and RadioButton circle */
        CheckMark: 18,
        SliderGrab: 19,
        SliderGrabActive: 20,
        Button: 21,
        ButtonHovered: 22,
        ButtonActive: 23,
        /** Header* colors are used for CollapsingHeader, TreeNode, Selectable, MenuItem */
        Header: 24,
        HeaderHovered: 25,
        HeaderActive: 26,
        Separator: 27,
        SeparatorHovered: 28,
        SeparatorActive: 29,
        /** Resize grip in lower-right and lower-left corners of windows. */
        ResizeGrip: 30,
        ResizeGripHovered: 31,
        ResizeGripActive: 32,
        /** InputText cursor\/caret */
        InputTextCursor: 33,
        /** Tab background, when hovered */
        TabHovered: 34,
        /** Tab background, when tab-bar is focused & tab is unselected */
        Tab: 35,
        /** Tab background, when tab-bar is focused & tab is selected */
        TabSelected: 36,
        /** Tab horizontal overline, when tab-bar is focused & tab is selected */
        TabSelectedOverline: 37,
        /** Tab background, when tab-bar is unfocused & tab is unselected */
        TabDimmed: 38,
        /** Tab background, when tab-bar is unfocused & tab is selected */
        TabDimmedSelected: 39,
        /** .horizontal overline, when tab-bar is unfocused & tab is selected */
        TabDimmedSelectedOverline: 40,
        /** Preview overlay color when about to docking something */
        DockingPreview: 41,
        /** Background color for empty node (e.g. CentralNode with no window docked into it) */
        DockingEmptyBg: 42,
        PlotLines: 43,
        PlotLinesHovered: 44,
        PlotHistogram: 45,
        PlotHistogramHovered: 46,
        /** Table header background */
        TableHeaderBg: 47,
        /** Table outer and header borders (prefer using Alpha=1.0 here) */
        TableBorderStrong: 48,
        /** Table inner borders (prefer using Alpha=1.0 here) */
        TableBorderLight: 49,
        /** Table row background (even rows) */
        TableRowBg: 50,
        /** Table row background (odd rows) */
        TableRowBgAlt: 51,
        /** Hyperlink color */
        TextLink: 52,
        /** Selected text inside an InputText */
        TextSelectedBg: 53,
        /** Tree node hierarchy outlines when using ImGuiTreeNodeFlags_DrawLines */
        TreeLines: 54,
        /** Rectangle highlighting a drop target */
        DragDropTarget: 55,
        /** Color of keyboard\/gamepad navigation cursor\/rectangle, when visible */
        NavCursor: 56,
        /** Highlight window when using CTRL+TAB */
        NavWindowingHighlight: 57,
        /** Darken\/colorize entire screen behind the CTRL+TAB window list, when active */
        NavWindowingDimBg: 58,
        /** Darken\/colorize entire screen behind a modal window, when one is active */
        ModalWindowDimBg: 59,
        COUNT: 60,
    },
    /** Enumeration for PushStyleVar() \/ PopStyleVar() to temporarily modify the ImGuiStyle structure. */
    StyleVar: {
        /** float     Alpha */
        Alpha: 0,
        /** float     DisabledAlpha */
        DisabledAlpha: 1,
        /** ImVec2    WindowPadding */
        WindowPadding: 2,
        /** float     WindowRounding */
        WindowRounding: 3,
        /** float     WindowBorderSize */
        WindowBorderSize: 4,
        /** ImVec2    WindowMinSize */
        WindowMinSize: 5,
        /** ImVec2    WindowTitleAlign */
        WindowTitleAlign: 6,
        /** float     ChildRounding */
        ChildRounding: 7,
        /** float     ChildBorderSize */
        ChildBorderSize: 8,
        /** float     PopupRounding */
        PopupRounding: 9,
        /** float     PopupBorderSize */
        PopupBorderSize: 10,
        /** ImVec2    FramePadding */
        FramePadding: 11,
        /** float     FrameRounding */
        FrameRounding: 12,
        /** float     FrameBorderSize */
        FrameBorderSize: 13,
        /** ImVec2    ItemSpacing */
        ItemSpacing: 14,
        /** ImVec2    ItemInnerSpacing */
        ItemInnerSpacing: 15,
        /** float     IndentSpacing */
        IndentSpacing: 16,
        /** ImVec2    CellPadding */
        CellPadding: 17,
        /** float     ScrollbarSize */
        ScrollbarSize: 18,
        /** float     ScrollbarRounding */
        ScrollbarRounding: 19,
        /** float     GrabMinSize */
        GrabMinSize: 20,
        /** float     GrabRounding */
        GrabRounding: 21,
        /** float     ImageBorderSize */
        ImageBorderSize: 22,
        /** float     TabRounding */
        TabRounding: 23,
        /** float     TabBorderSize */
        TabBorderSize: 24,
        /** float     TabBarBorderSize */
        TabBarBorderSize: 25,
        /** float     TabBarOverlineSize */
        TabBarOverlineSize: 26,
        /** float     TableAngledHeadersAngle */
        TableAngledHeadersAngle: 27,
        /** ImVec2  TableAngledHeadersTextAlign */
        TableAngledHeadersTextAlign: 28,
        /** float     TreeLinesSize */
        TreeLinesSize: 29,
        /** float     TreeLinesRounding */
        TreeLinesRounding: 30,
        /** ImVec2    ButtonTextAlign */
        ButtonTextAlign: 31,
        /** ImVec2    SelectableTextAlign */
        SelectableTextAlign: 32,
        /** float     SeparatorTextBorderSize */
        SeparatorTextBorderSize: 33,
        /** ImVec2    SeparatorTextAlign */
        SeparatorTextAlign: 34,
        /** ImVec2    SeparatorTextPadding */
        SeparatorTextPadding: 35,
        /** float     DockingSeparatorSize */
        DockingSeparatorSize: 36,
        COUNT: 37,
    },
    /** Flags for InvisibleButton() [extended in imgui_internal.h] */
    ButtonFlags: {
        None: 0,
        /** React on left mouse button (default) */
        MouseButtonLeft: 1,
        /** React on right mouse button */
        MouseButtonRight: 2,
        /** React on center mouse button */
        MouseButtonMiddle: 4,
        /** InvisibleButton(): do not disable navigation\/tabbing. Otherwise disabled by default. */
        EnableNav: 8,
    },
    /** Flags for ColorEdit3() \/ ColorEdit4() \/ ColorPicker3() \/ ColorPicker4() \/ ColorButton() */
    ColorEditFlags: {
        None: 0,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: ignore Alpha component (will only read 3 components from the input pointer). */
        NoAlpha: 2,
        /**              \/\/ ColorEdit: disable picker when clicking on color square. */
        NoPicker: 4,
        /**              \/\/ ColorEdit: disable toggling options menu when right-clicking on inputs\/small preview. */
        NoOptions: 8,
        /**              \/\/ ColorEdit, ColorPicker: disable color square preview next to the inputs. (e.g. to show only the inputs) */
        NoSmallPreview: 16,
        /**              \/\/ ColorEdit, ColorPicker: disable inputs sliders\/text widgets (e.g. to show only the small preview color square). */
        NoInputs: 32,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable tooltip when hovering the preview. */
        NoTooltip: 64,
        /**              \/\/ ColorEdit, ColorPicker: disable display of inline text label (the label is still forwarded to the tooltip and picker). */
        NoLabel: 128,
        /**              \/\/ ColorPicker: disable bigger color preview on right side of the picker, use small color square preview instead. */
        NoSidePreview: 256,
        /**              \/\/ ColorEdit: disable drag and drop target. ColorButton: disable drag and drop source. */
        NoDragDrop: 512,
        /**              \/\/ ColorButton: disable border (which is enforced by default) */
        NoBorder: 1024,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable alpha in the preview,. Contrary to _NoAlpha it may still be edited when calling ColorEdit4()\/ColorPicker4(). For ColorButton() this does the same as _NoAlpha. */
        AlphaOpaque: 2048,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable rendering a checkerboard background behind transparent color. */
        AlphaNoBg: 4096,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: display half opaque \/ half transparent preview. */
        AlphaPreviewHalf: 8192,
        /**              \/\/ ColorEdit, ColorPicker: show vertical alpha bar\/gradient in picker. */
        AlphaBar: 65536,
        /**              \/\/ (WIP) ColorEdit: Currently only disable 0.0f..1.0f limits in RGBA edition (note: you probably want to use ImGuiColorEditFlags_Float flag as well). */
        HDR: 524288,
        /** [Display]    \/\/ ColorEdit: override _display_ type among RGB\/HSV\/Hex. ColorPicker: select any combination using one or more of RGB\/HSV\/Hex. */
        DisplayRGB: 1048576,
        /** [Display]    \/\/ " */
        DisplayHSV: 2097152,
        /** [Display]    \/\/ " */
        DisplayHex: 4194304,
        /** [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0..255. */
        Uint8: 8388608,
        /** [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0.0f..1.0f floats instead of 0..255 integers. No round-trip of value via integers. */
        Float: 16777216,
        /** [Picker]     \/\/ ColorPicker: bar for Hue, rectangle for Sat\/Value. */
        PickerHueBar: 33554432,
        /** [Picker]     \/\/ ColorPicker: wheel for Hue, triangle for Sat\/Value. */
        PickerHueWheel: 67108864,
        /** [Input]      \/\/ ColorEdit, ColorPicker: input and output data in RGB format. */
        InputRGB: 134217728,
        /** [Input]      \/\/ ColorEdit, ColorPicker: input and output data in HSV format. */
        InputHSV: 268435456,
    },
    /** Flags for DragFloat(), DragInt(), SliderFloat(), SliderInt() etc. */
    SliderFlags: {
        None: 0,
        /** Make the widget logarithmic (linear otherwise). Consider using ImGuiSliderFlags_NoRoundToFormat with this if using a format-string with small amount of digits. */
        Logarithmic: 32,
        /** Disable rounding underlying value to match precision of the display format string (e.g. %.3f values are rounded to those 3 digits). */
        NoRoundToFormat: 64,
        /** Disable CTRL+Click or Enter key allowing to input text directly into the widget. */
        NoInput: 128,
        /** Enable wrapping around from max to min and from min to max. Only supported by DragXXX() functions for now. */
        WrapAround: 256,
        /** Clamp value to min\/max bounds when input manually with CTRL+Click. By default CTRL+Click allows going out of bounds. */
        ClampOnInput: 512,
        /** Clamp even if min==max==0.0f. Otherwise due to legacy reason DragXXX functions don't clamp with those values. When your clamping limits are dynamic you almost always want to use it. */
        ClampZeroRange: 1024,
        /** Disable keyboard modifiers altering tweak speed. Useful if you want to alter tweak speed yourself based on your own logic. */
        NoSpeedTweaks: 2048,
        AlwaysClamp: 1536,
    },
    /** Identify a mouse button. */
    MouseButton: {
        Left: 0,
        Right: 1,
        Middle: 2,
        COUNT: 5,
    },
    /** Enumeration for GetMouseCursor() */
    MouseCursor: {
        None: -1,
        Arrow: 0,
        /** When hovering over InputText, etc. */
        TextInput: 1,
        /** (Unused by Dear ImGui functions) */
        ResizeAll: 2,
        /** When hovering over a horizontal border */
        ResizeNS: 3,
        /** When hovering over a vertical border or a column */
        ResizeEW: 4,
        /** When hovering over the bottom-left corner of a window */
        ResizeNESW: 5,
        /** When hovering over the bottom-right corner of a window */
        ResizeNWSE: 6,
        /** (Unused by Dear ImGui functions. Use for e.g. hyperlinks) */
        Hand: 7,
        /** When waiting for something to process\/load. */
        Wait: 8,
        /** When waiting for something to process\/load, but application is still interactive. */
        Progress: 9,
        /** When hovering something with disallowed interaction. Usually a crossed circle. */
        NotAllowed: 10,
        COUNT: 11,
    },
    /** Enumeration for AddMouseSourceEvent() actual source of Mouse Input data. */
    MouseSource: {
        /** Input is coming from an actual mouse. */
        _Mouse: 0,
        /** Input is coming from a touch screen (no hovering prior to initial press, less precise initial press aiming, dual-axis wheeling possible). */
        _TouchScreen: 1,
        /** Input is coming from a pressure\/magnetic pen (often used in conjunction with high-sampling rates). */
        _Pen: 2,
        _COUNT: 3,
    },
    /** Enumeration for ImGui::SetNextWindow***(), SetWindow***(), SetNextItem***() functions */
    Cond: {
        /** No condition (always set the variable), same as _Always */
        None: 0,
        /** No condition (always set the variable), same as _None */
        Always: 1,
        /** Set the variable once per runtime session (only the first call will succeed) */
        Once: 2,
        /** Set the variable if the object\/window has no persistently saved data (no entry in .ini file) */
        FirstUseEver: 4,
        /** Set the variable if the object\/window is appearing after being hidden\/inactive (or the first time) */
        Appearing: 8,
    },
    /** Flags for ImGui::BeginTable() */
    TableFlags: {
        None: 0,
        /** Enable resizing columns. */
        Resizable: 1,
        /** Enable reordering columns in header row (need calling TableSetupColumn() + TableHeadersRow() to display headers) */
        Reorderable: 2,
        /** Enable hiding\/disabling columns in context menu. */
        Hideable: 4,
        /** Enable sorting. Call TableGetSortSpecs() to obtain sort specs. Also see ImGuiTableFlags_SortMulti and ImGuiTableFlags_SortTristate. */
        Sortable: 8,
        /** Disable persisting columns order, width and sort settings in the .ini file. */
        NoSavedSettings: 16,
        /** Right-click on columns body\/contents will display table context menu. By default it is available in TableHeadersRow(). */
        ContextMenuInBody: 32,
        /** Set each RowBg color with ImGuiCol_TableRowBg or ImGuiCol_TableRowBgAlt (equivalent of calling TableSetBgColor with ImGuiTableBgFlags_RowBg0 on each row manually) */
        RowBg: 64,
        /** Draw horizontal borders between rows. */
        BordersInnerH: 128,
        /** Draw horizontal borders at the top and bottom. */
        BordersOuterH: 256,
        /** Draw vertical borders between columns. */
        BordersInnerV: 512,
        /** Draw vertical borders on the left and right sides. */
        BordersOuterV: 1024,
        /** Draw horizontal borders. */
        BordersH: 384,
        /** Draw vertical borders. */
        BordersV: 1536,
        /** Draw inner borders. */
        BordersInner: 640,
        /** Draw outer borders. */
        BordersOuter: 1280,
        /** Draw all borders. */
        Borders: 1920,
        /** [ALPHA] Disable vertical borders in columns Body (borders will always appear in Headers). -> May move to style */
        NoBordersInBody: 2048,
        /** [ALPHA] Disable vertical borders in columns Body until hovered for resize (borders will always appear in Headers). -> May move to style */
        NoBordersInBodyUntilResize: 4096,
        /** Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching contents width. */
        SizingFixedFit: 8192,
        /** Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching the maximum contents width of all columns. Implicitly enable ImGuiTableFlags_NoKeepColumnsVisible. */
        SizingFixedSame: 16384,
        /** Columns default to _WidthStretch with default weights proportional to each columns contents widths. */
        SizingStretchProp: 24576,
        /** Columns default to _WidthStretch with default weights all equal, unless overridden by TableSetupColumn(). */
        SizingStretchSame: 32768,
        /** Make outer width auto-fit to columns, overriding outer_size.x value. Only available when ScrollX\/ScrollY are disabled and Stretch columns are not used. */
        NoHostExtendX: 65536,
        /** Make outer height stop exactly at outer_size.y (prevent auto-extending table past the limit). Only available when ScrollX\/ScrollY are disabled. Data below the limit will be clipped and not visible. */
        NoHostExtendY: 131072,
        /** Disable keeping column always minimally visible when ScrollX is off and table gets too small. Not recommended if columns are resizable. */
        NoKeepColumnsVisible: 262144,
        /** Disable distributing remainder width to stretched columns (width allocation on a 100-wide table with 3 columns: Without this flag: 33,33,34. With this flag: 33,33,33). With larger number of columns, resizing will appear to be less smooth. */
        PreciseWidths: 524288,
        /** Disable clipping rectangle for every individual columns (reduce draw command count, items will be able to overflow into other columns). Generally incompatible with TableSetupScrollFreeze(). */
        NoClip: 1048576,
        /** Default if BordersOuterV is on. Enable outermost padding. Generally desirable if you have headers. */
        PadOuterX: 2097152,
        /** Default if BordersOuterV is off. Disable outermost padding. */
        NoPadOuterX: 4194304,
        /** Disable inner padding between columns (double inner padding if BordersOuterV is on, single inner padding if BordersOuterV is off). */
        NoPadInnerX: 8388608,
        /** Enable horizontal scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size. Changes default sizing policy. Because this creates a child window, ScrollY is currently generally recommended when using ScrollX. */
        ScrollX: 16777216,
        /** Enable vertical scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size. */
        ScrollY: 33554432,
        /** Hold shift when clicking headers to sort on multiple column. TableGetSortSpecs() may return specs where (SpecsCount > 1). */
        SortMulti: 67108864,
        /** Allow no sorting, disable default sorting. TableGetSortSpecs() may return specs where (SpecsCount == 0). */
        SortTristate: 134217728,
        /** Highlight column headers when hovered (may evolve into a fuller highlight) */
        HighlightHoveredColumn: 268435456,
    },
    /** Flags for ImGui::TableSetupColumn() */
    TableColumnFlags: {
        None: 0,
        /** Overriding\/master disable flag: hide column, won't show in context menu (unlike calling TableSetColumnEnabled() which manipulates the user accessible state) */
        Disabled: 1,
        /** Default as a hidden\/disabled column. */
        DefaultHide: 2,
        /** Default as a sorting column. */
        DefaultSort: 4,
        /** Column will stretch. Preferable with horizontal scrolling disabled (default if table sizing policy is _SizingStretchSame or _SizingStretchProp). */
        WidthStretch: 8,
        /** Column will not stretch. Preferable with horizontal scrolling enabled (default if table sizing policy is _SizingFixedFit and table is resizable). */
        WidthFixed: 16,
        /** Disable manual resizing. */
        NoResize: 32,
        /** Disable manual reordering this column, this will also prevent other columns from crossing over this column. */
        NoReorder: 64,
        /** Disable ability to hide\/disable this column. */
        NoHide: 128,
        /** Disable clipping for this column (all NoClip columns will render in a same draw command). */
        NoClip: 256,
        /** Disable ability to sort on this field (even if ImGuiTableFlags_Sortable is set on the table). */
        NoSort: 512,
        /** Disable ability to sort in the ascending direction. */
        NoSortAscending: 1024,
        /** Disable ability to sort in the descending direction. */
        NoSortDescending: 2048,
        /** TableHeadersRow() will submit an empty label for this column. Convenient for some small columns. Name will still appear in context menu or in angled headers. You may append into this cell by calling TableSetColumnIndex() right after the TableHeadersRow() call. */
        NoHeaderLabel: 4096,
        /** Disable header text width contribution to automatic column width. */
        NoHeaderWidth: 8192,
        /** Make the initial sort direction Ascending when first sorting on this column (default). */
        PreferSortAscending: 16384,
        /** Make the initial sort direction Descending when first sorting on this column. */
        PreferSortDescending: 32768,
        /** Use current Indent value when entering cell (default for column 0). */
        IndentEnable: 65536,
        /** Ignore current Indent value when entering cell (default for columns > 0). Indentation changes _within_ the cell will still be honored. */
        IndentDisable: 131072,
        /** TableHeadersRow() will submit an angled header row for this column. Note this will add an extra row. */
        AngledHeader: 262144,
        /** Status: is enabled == not hidden by user\/api (referred to as "Hide" in _DefaultHide and _NoHide) flags. */
        IsEnabled: 16777216,
        /** Status: is visible == is enabled AND not clipped by scrolling. */
        IsVisible: 33554432,
        /** Status: is currently part of the sort specs */
        IsSorted: 67108864,
        /** Status: is hovered by mouse */
        IsHovered: 134217728,
    },
    /** Flags for ImGui::TableNextRow() */
    TableRowFlags: {
        None: 0,
        /** Identify header row (set default background color + width of its contents accounted differently for auto column width) */
        Headers: 1,
    },
    /** Enum for ImGui::TableSetBgColor() */
    TableBgTarget: {
        None: 0,
        /** Set row background color 0 (generally used for background, automatically set when ImGuiTableFlags_RowBg is used) */
        RowBg0: 1,
        /** Set row background color 1 (generally used for selection marking) */
        RowBg1: 2,
        /** Set cell background color (top-most color) */
        CellBg: 3,
    },
    /** Flags for BeginMultiSelect() */
    MultiSelectFlags: {
        None: 0,
        /** Disable selecting more than one item. This is available to allow single-selection code to share same code\/logic if desired. It essentially disables the main purpose of BeginMultiSelect() tho! */
        SingleSelect: 1,
        /** Disable CTRL+A shortcut to select all. */
        NoSelectAll: 2,
        /** Disable Shift+selection mouse\/keyboard support (useful for unordered 2D selection). With BoxSelect is also ensure contiguous SetRange requests are not combined into one. This allows not handling interpolation in SetRange requests. */
        NoRangeSelect: 4,
        /** Disable selecting items when navigating (useful for e.g. supporting range-select in a list of checkboxes). */
        NoAutoSelect: 8,
        /** Disable clearing selection when navigating or selecting another one (generally used with ImGuiMultiSelectFlags_NoAutoSelect. useful for e.g. supporting range-select in a list of checkboxes). */
        NoAutoClear: 16,
        /** Disable clearing selection when clicking\/selecting an already selected item. */
        NoAutoClearOnReselect: 32,
        /** Enable box-selection with same width and same x pos items (e.g. full row Selectable()). Box-selection works better with little bit of spacing between items hit-box in order to be able to aim at empty space. */
        BoxSelect1d: 64,
        /** Enable box-selection with varying width or varying x pos items support (e.g. different width labels, or 2D layout\/grid). This is slower: alters clipping logic so that e.g. horizontal movements will update selection of normally clipped items. */
        BoxSelect2d: 128,
        /** Disable scrolling when box-selecting near edges of scope. */
        BoxSelectNoScroll: 256,
        /** Clear selection when pressing Escape while scope is focused. */
        ClearOnEscape: 512,
        /** Clear selection when clicking on empty location within scope. */
        ClearOnClickVoid: 1024,
        /** Scope for _BoxSelect and _ClearOnClickVoid is whole window (Default). Use if BeginMultiSelect() covers a whole window or used a single time in same window. */
        ScopeWindow: 2048,
        /** Scope for _BoxSelect and _ClearOnClickVoid is rectangle encompassing BeginMultiSelect()\/EndMultiSelect(). Use if BeginMultiSelect() is called multiple times in same window. */
        ScopeRect: 4096,
        /** Apply selection on mouse down when clicking on unselected item. (Default) */
        SelectOnClick: 8192,
        /** Apply selection on mouse release when clicking an unselected item. Allow dragging an unselected item without altering selection. */
        SelectOnClickRelease: 16384,
        /** [Temporary] Enable navigation wrapping on X axis. Provided as a convenience because we don't have a design for the general Nav API for this yet. When the more general feature be public we may obsolete this flag in favor of new one. */
        NavWrapX: 65536,
    },
    /** Selection request type */
    SelectionRequestType: {
        _None: 0,
        /** Request app to clear selection (if Selected==false) or select all items (if Selected==true). We cannot set RangeFirstItem\/RangeLastItem as its contents is entirely up to user (not necessarily an index) */
        _SetAll: 1,
        /** Request app to select\/unselect [RangeFirstItem..RangeLastItem] items (inclusive) based on value of Selected. Only EndMultiSelect() request this, app code can read after BeginMultiSelect() and it will always be false. */
        _SetRange: 2,
    },
    /** Flags for ImDrawList functions */
    ImDrawFlags: {
        None: 0,
        /** PathStroke(), AddPolyline(): specify that shape should be closed (Important: this is always == 1 for legacy reason) */
        Closed: 1,
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding top-left corner only (when rounding > 0.0f, we default to all corners). Was 0x01. */
        RoundCornersTopLeft: 16,
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding top-right corner only (when rounding > 0.0f, we default to all corners). Was 0x02. */
        RoundCornersTopRight: 32,
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-left corner only (when rounding > 0.0f, we default to all corners). Was 0x04. */
        RoundCornersBottomLeft: 64,
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-right corner only (when rounding > 0.0f, we default to all corners). Wax 0x08. */
        RoundCornersBottomRight: 128,
        /** AddRect(), AddRectFilled(), PathRect(): disable rounding on all corners (when rounding > 0.0f). This is NOT zero, NOT an implicit flag! */
        RoundCornersNone: 256,
        RoundCornersTop: 48,
        RoundCornersBottom: 192,
        RoundCornersLeft: 80,
        RoundCornersRight: 160,
        RoundCornersAll: 240,
    },
    /** Flags for ImDrawList instance. Those are set automatically by ImGui:: functions from ImGuiIO settings, and generally not manipulated directly. */
    ImDrawListFlags: {
        None: 0,
        /** Enable anti-aliased lines\/borders (*2 the number of triangles for 1.0f wide line or lines thin enough to be drawn using textures, otherwise *3 the number of triangles) */
        AntiAliasedLines: 1,
        /** Enable anti-aliased lines\/borders using textures when possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). */
        AntiAliasedLinesUseTex: 2,
        /** Enable anti-aliased edge around filled shapes (rounded rectangles, circles). */
        AntiAliasedFill: 4,
        /** Can emit 'VtxOffset > 0' to allow large meshes. Set when 'ImGuiBackendFlags_RendererHasVtxOffset' is enabled. */
        AllowVtxOffset: 8,
    },
    /** We intentionally support a limited amount of texture formats to limit burden on CPU-side code and extension. */
    ImTextureFormat: {
        /** 4 components per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight * 4 */
        _RGBA32: 0,
        /** 1 component per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight */
        _Alpha8: 1,
    },
    /** Status of a texture to communicate with Renderer Backend. */
    ImTextureStatus: {
        _OK: 0,
        /** Backend destroyed the texture. */
        _Destroyed: 1,
        /** Requesting backend to create the texture. Set status OK when done. */
        _WantCreate: 2,
        /** Requesting backend to update specific blocks of pixels (write to texture portions which have never been used before). Set status OK when done. */
        _WantUpdates: 3,
        /** Requesting backend to destroy the texture. Set status to Destroyed when done. */
        _WantDestroy: 4,
    },
    /** Flags for ImFontAtlas build */
    ImFontAtlasFlags: {
        None: 0,
        /** Don't round the height to next power of two */
        NoPowerOfTwoHeight: 1,
        /** Don't build software mouse cursors into the atlas (save a little texture memory) */
        NoMouseCursors: 2,
        /** Don't build thick line textures into the atlas (save a little texture memory, allow support for point\/nearest filtering). The AntiAliasedLinesUseTex features uses them, otherwise they will be rendered using polygons (more expensive for CPU\/GPU). */
        NoBakedLines: 4,
    },
    /** Font flags */
    ImFontFlags: {
        None: 0,
        /** Disable throwing an error\/assert when calling AddFontXXX() with missing file\/data. Calling code is expected to check AddFontXXX() return value. */
        NoLoadError: 2,
        /** [Internal] Disable loading new glyphs. */
        NoLoadGlyphs: 4,
        /** [Internal] Disable loading new baked sizes, disable garbage collecting current ones. e.g. if you want to lock a font to a single size. Important: if you use this to preload given sizes, consider the possibility of multiple font density used on Retina display. */
        LockBakedSizes: 8,
    },
    /** Flags stored in ImGuiViewport::Flags, giving indications to the platform backends. */
    ViewportFlags: {
        None: 0,
        /** Represent a Platform Window */
        IsPlatformWindow: 1,
        /** Represent a Platform Monitor (unused yet) */
        IsPlatformMonitor: 2,
        /** Platform Window: Is created\/managed by the user application? (rather than our backend) */
        OwnedByApp: 4,
        /** Platform Window: Disable platform decorations: title bar, borders, etc. (generally set all windows, but if ImGuiConfigFlags_ViewportsDecoration is set we only set this on popups\/tooltips) */
        NoDecoration: 8,
        /** Platform Window: Disable platform task bar icon (generally set on popups\/tooltips, or all windows if ImGuiConfigFlags_ViewportsNoTaskBarIcon is set) */
        NoTaskBarIcon: 16,
        /** Platform Window: Don't take focus when created. */
        NoFocusOnAppearing: 32,
        /** Platform Window: Don't take focus when clicked on. */
        NoFocusOnClick: 64,
        /** Platform Window: Make mouse pass through so we can drag this window while peaking behind it. */
        NoInputs: 128,
        /** Platform Window: Renderer doesn't need to clear the framebuffer ahead (because we will fill it entirely). */
        NoRendererClear: 256,
        /** Platform Window: Avoid merging this window into another host window. This can only be set via ImGuiWindowClass viewport flags override (because we need to now ahead if we are going to create a viewport in the first place!). */
        NoAutoMerge: 512,
        /** Platform Window: Display on top (for tooltips only). */
        TopMost: 1024,
        /** Viewport can host multiple imgui windows (secondary viewports are associated to a single window). \/\/ FIXME: In practice there's still probably code making the assumption that this is always and only on the MainViewport. Will fix once we add support for "no main viewport". */
        CanHostOtherWindows: 2048,
        /** Platform Window: Window is minimized, can skip render. When minimized we tend to avoid using the viewport pos\/size for clipping window or testing if they are contained in the viewport. */
        IsMinimized: 4096,
        /** Platform Window: Window is focused (last call to Platform_GetWindowFocus() returned true) */
        IsFocused: 8192,
    },
    /* Functions */
    /** Context creation and access */
    CreateContext(shared_font_atlas) {
        return ImGuiContext.wrap(Mod.export.ImGui_CreateContext(shared_font_atlas?._ptr || null));
    },
    /** NULL = destroy current context */
    DestroyContext(ctx) {
        return Mod.export.ImGui_DestroyContext(ctx?._ptr || null);
    },
    GetCurrentContext() {
        return ImGuiContext.wrap(Mod.export.ImGui_GetCurrentContext());
    },
    SetCurrentContext(ctx) {
        return Mod.export.ImGui_SetCurrentContext(ctx?._ptr || null);
    },
    /** access the ImGuiIO structure (mouse\/keyboard\/gamepad inputs, time, various configuration options\/flags) */
    GetIO() {
        return ImGuiIO.wrap(Mod.export.ImGui_GetIO());
    },
    /** access the Style structure (colors, sizes). Always use PushStyleColor(), PushStyleVar() to modify style mid-frame! */
    GetStyle() {
        return ImGuiStyle.wrap(Mod.export.ImGui_GetStyle());
    },
    /** start a new Dear ImGui frame, you can submit any command from this point until Render()\/EndFrame(). */
    NewFrame() {
        return Mod.export.ImGui_NewFrame();
    },
    /** ends the Dear ImGui frame. automatically called by Render(). If you don't need to render data (skipping rendering) you may call EndFrame() without Render()... but you'll have wasted CPU already! If you don't need to render, better to not create any windows and not call NewFrame() at all! */
    EndFrame() {
        return Mod.export.ImGui_EndFrame();
    },
    /** ends the Dear ImGui frame, finalize the draw data. You can then get call GetDrawData(). */
    Render() {
        return Mod.export.ImGui_Render();
    },
    /** valid after Render() and until the next call to NewFrame(). Call ImGui_ImplXXXX_RenderDrawData() function in your Renderer Backend to render. */
    GetDrawData() {
        return ImDrawData.wrap(Mod.export.ImGui_GetDrawData());
    },
    /** create Demo window. demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application! */
    ShowDemoWindow(p_open) {
        return Mod.export.ImGui_ShowDemoWindow(p_open);
    },
    /** create Metrics\/Debugger window. display Dear ImGui internals: windows, draw commands, various internal state, etc. */
    ShowMetricsWindow(p_open) {
        return Mod.export.ImGui_ShowMetricsWindow(p_open);
    },
    /** create Debug Log window. display a simplified log of important dear imgui events. */
    ShowDebugLogWindow(p_open) {
        return Mod.export.ImGui_ShowDebugLogWindow(p_open);
    },
    /** create Stack Tool window. hover items with mouse to query information about the source of their unique ID. */
    ShowIDStackToolWindow(p_open) {
        return Mod.export.ImGui_ShowIDStackToolWindow(p_open);
    },
    /** create About window. display Dear ImGui version, credits and build\/system information. */
    ShowAboutWindow(p_open) {
        return Mod.export.ImGui_ShowAboutWindow(p_open);
    },
    /** add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style) */
    ShowStyleEditor(ref) {
        return Mod.export.ImGui_ShowStyleEditor(ref?._ptr || null);
    },
    /** add style selector block (not a window), essentially a combo listing the default styles. */
    ShowStyleSelector(label) {
        return Mod.export.ImGui_ShowStyleSelector(label);
    },
    /** add font selector block (not a window), essentially a combo listing the loaded fonts. */
    ShowFontSelector(label) {
        return Mod.export.ImGui_ShowFontSelector(label);
    },
    /** add basic help\/info block (not a window): how to manipulate ImGui as an end-user (mouse\/keyboard controls). */
    ShowUserGuide() {
        return Mod.export.ImGui_ShowUserGuide();
    },
    /** get the compiled version string e.g. "1.80 WIP" (essentially the value for IMGUI_VERSION from the compiled version of imgui.cpp) */
    GetVersion() {
        return Mod.export.ImGui_GetVersion();
    },
    /** new, recommended style (default) */
    StyleColorsDark(dst) {
        return Mod.export.ImGui_StyleColorsDark(dst?._ptr || null);
    },
    /** best used with borders and a custom, thicker font */
    StyleColorsLight(dst) {
        return Mod.export.ImGui_StyleColorsLight(dst?._ptr || null);
    },
    /** classic imgui style */
    StyleColorsClassic(dst) {
        return Mod.export.ImGui_StyleColorsClassic(dst?._ptr || null);
    },
    /** Windows */
    Begin(name, p_open, flags = 0) {
        return Mod.export.ImGui_Begin(name, p_open, flags);
    },
    End() {
        return Mod.export.ImGui_End();
    },
    /** Child Windows */
    BeginChild(str_id, size = new ImVec2(0, 0), child_flags = 0, window_flags = 0) {
        return Mod.export.ImGui_BeginChild(str_id, size?._ptr || null, child_flags, window_flags);
    },
    EndChild() {
        return Mod.export.ImGui_EndChild();
    },
    /** Windows Utilities */
    IsWindowAppearing() {
        return Mod.export.ImGui_IsWindowAppearing();
    },
    IsWindowCollapsed() {
        return Mod.export.ImGui_IsWindowCollapsed();
    },
    /** is current window focused? or its root\/child, depending on flags. see flags for options. */
    IsWindowFocused(flags = 0) {
        return Mod.export.ImGui_IsWindowFocused(flags);
    },
    /** is current window hovered and hoverable (e.g. not blocked by a popup\/modal)? See ImGuiHoveredFlags_ for options. IMPORTANT: If you are trying to check whether your mouse should be dispatched to Dear ImGui or to your underlying app, you should not use this function! Use the 'io.WantCaptureMouse' boolean for that! Refer to FAQ entry "How can I tell whether to dispatch mouse\/keyboard to Dear ImGui or my application?" for details. */
    IsWindowHovered(flags = 0) {
        return Mod.export.ImGui_IsWindowHovered(flags);
    },
    /** get draw list associated to the current window, to append your own drawing primitives */
    GetWindowDrawList() {
        return ImDrawList.wrap(Mod.export.ImGui_GetWindowDrawList());
    },
    /** get DPI scale currently associated to the current window's viewport. */
    GetWindowDpiScale() {
        return Mod.export.ImGui_GetWindowDpiScale();
    },
    /** get current window position in screen space (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead) */
    GetWindowPos() {
        return ImVec2.wrap(Mod.export.ImGui_GetWindowPos());
    },
    /** get current window size (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead) */
    GetWindowSize() {
        return ImVec2.wrap(Mod.export.ImGui_GetWindowSize());
    },
    /** get current window width (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().x. */
    GetWindowWidth() {
        return Mod.export.ImGui_GetWindowWidth();
    },
    /** get current window height (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().y. */
    GetWindowHeight() {
        return Mod.export.ImGui_GetWindowHeight();
    },
    /** set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc. */
    SetNextWindowPos(pos, cond = 0, pivot = new ImVec2(0, 0)) {
        return Mod.export.ImGui_SetNextWindowPos(pos?._ptr || null, cond, pivot?._ptr || null);
    },
    /** set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin() */
    SetNextWindowSize(size, cond = 0) {
        return Mod.export.ImGui_SetNextWindowSize(size?._ptr || null, cond);
    },
    /** set next window content size (~ scrollable client area, which enforce the range of scrollbars). Not including window decorations (title bar, menu bar, etc.) nor WindowPadding. set an axis to 0.0f to leave it automatic. call before Begin() */
    SetNextWindowContentSize(size) {
        return Mod.export.ImGui_SetNextWindowContentSize(size?._ptr || null);
    },
    /** set next window collapsed state. call before Begin() */
    SetNextWindowCollapsed(collapsed, cond = 0) {
        return Mod.export.ImGui_SetNextWindowCollapsed(collapsed, cond);
    },
    /** set next window to be focused \/ top-most. call before Begin() */
    SetNextWindowFocus() {
        return Mod.export.ImGui_SetNextWindowFocus();
    },
    /** set next window scrolling value (use < 0.0f to not affect a given axis). */
    SetNextWindowScroll(scroll) {
        return Mod.export.ImGui_SetNextWindowScroll(scroll?._ptr || null);
    },
    /** set next window background color alpha. helper to easily override the Alpha component of ImGuiCol_WindowBg\/ChildBg\/PopupBg. you may also use ImGuiWindowFlags_NoBackground. */
    SetNextWindowBgAlpha(alpha) {
        return Mod.export.ImGui_SetNextWindowBgAlpha(alpha);
    },
    /** set next window viewport */
    SetNextWindowViewport(viewport_id) {
        return Mod.export.ImGui_SetNextWindowViewport(viewport_id);
    },
    /** (not recommended) set current window position - call within Begin()\/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects. */
    SetWindowPos(pos, cond = 0) {
        return Mod.export.ImGui_SetWindowPos(pos?._ptr || null, cond);
    },
    /** (not recommended) set current window size - call within Begin()\/End(). set to ImVec2(0, 0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects. */
    SetWindowSize(size, cond = 0) {
        return Mod.export.ImGui_SetWindowSize(size?._ptr || null, cond);
    },
    /** (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed(). */
    SetWindowCollapsed(collapsed, cond = 0) {
        return Mod.export.ImGui_SetWindowCollapsed(collapsed, cond);
    },
    /** (not recommended) set current window to be focused \/ top-most. prefer using SetNextWindowFocus(). */
    SetWindowFocus() {
        return Mod.export.ImGui_SetWindowFocus();
    },
    /** get scrolling amount [0 .. GetScrollMaxX()] */
    GetScrollX() {
        return Mod.export.ImGui_GetScrollX();
    },
    /** get scrolling amount [0 .. GetScrollMaxY()] */
    GetScrollY() {
        return Mod.export.ImGui_GetScrollY();
    },
    /** set scrolling amount [0 .. GetScrollMaxX()] */
    SetScrollX(scroll_x) {
        return Mod.export.ImGui_SetScrollX(scroll_x);
    },
    /** set scrolling amount [0 .. GetScrollMaxY()] */
    SetScrollY(scroll_y) {
        return Mod.export.ImGui_SetScrollY(scroll_y);
    },
    /** get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x */
    GetScrollMaxX() {
        return Mod.export.ImGui_GetScrollMaxX();
    },
    /** get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y */
    GetScrollMaxY() {
        return Mod.export.ImGui_GetScrollMaxY();
    },
    /** adjust scrolling amount to make current cursor position visible. center_x_ratio=0.0: left, 0.5: center, 1.0: right. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead. */
    SetScrollHereX(center_x_ratio = 0.5) {
        return Mod.export.ImGui_SetScrollHereX(center_x_ratio);
    },
    /** adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead. */
    SetScrollHereY(center_y_ratio = 0.5) {
        return Mod.export.ImGui_SetScrollHereY(center_y_ratio);
    },
    /** adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position. */
    SetScrollFromPosX(local_x, center_x_ratio = 0.5) {
        return Mod.export.ImGui_SetScrollFromPosX(local_x, center_x_ratio);
    },
    /** adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position. */
    SetScrollFromPosY(local_y, center_y_ratio = 0.5) {
        return Mod.export.ImGui_SetScrollFromPosY(local_y, center_y_ratio);
    },
    /** Use NULL as a shortcut to keep current font. Use 0.0f to keep current size. */
    PushFontFloat(font, font_size_base_unscaled) {
        return Mod.export.ImGui_PushFontFloat(font?._ptr || null, font_size_base_unscaled);
    },
    PopFont() {
        return Mod.export.ImGui_PopFont();
    },
    /** get current font */
    GetFont() {
        return ImFont.wrap(Mod.export.ImGui_GetFont());
    },
    /** get current scaled font size (= height in pixels). AFTER global scale factors applied. *IMPORTANT* DO NOT PASS THIS VALUE TO PushFont()! Use ImGui::GetStyle().FontSizeBase to get value before global scale factors. */
    GetFontSize() {
        return Mod.export.ImGui_GetFontSize();
    },
    /** get current font bound at current size \/\/ == GetFont()->GetFontBaked(GetFontSize()) */
    GetFontBaked() {
        return ImFontBaked.wrap(Mod.export.ImGui_GetFontBaked());
    },
    /** modify a style color. always use this if you modify the style after NewFrame(). */
    PushStyleColor(idx, col) {
        return Mod.export.ImGui_PushStyleColor(idx, col);
    },
    PopStyleColor(count = 1) {
        return Mod.export.ImGui_PopStyleColor(count);
    },
    /** modify a style float variable. always use this if you modify the style after NewFrame()! */
    PushStyleVar(idx, val) {
        return Mod.export.ImGui_PushStyleVar(idx, val);
    },
    /** modify X component of a style ImVec2 variable. " */
    PushStyleVarX(idx, val_x) {
        return Mod.export.ImGui_PushStyleVarX(idx, val_x);
    },
    /** modify Y component of a style ImVec2 variable. " */
    PushStyleVarY(idx, val_y) {
        return Mod.export.ImGui_PushStyleVarY(idx, val_y);
    },
    PopStyleVar(count = 1) {
        return Mod.export.ImGui_PopStyleVar(count);
    },
    /** modify specified shared item flag, e.g. PushItemFlag(ImGuiItemFlags_NoTabStop, true) */
    PushItemFlag(option, enabled) {
        return Mod.export.ImGui_PushItemFlag(option, enabled);
    },
    PopItemFlag() {
        return Mod.export.ImGui_PopItemFlag();
    },
    /** push width of items for common large "item+label" widgets. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side). */
    PushItemWidth(item_width) {
        return Mod.export.ImGui_PushItemWidth(item_width);
    },
    PopItemWidth() {
        return Mod.export.ImGui_PopItemWidth();
    },
    /** set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side) */
    SetNextItemWidth(item_width) {
        return Mod.export.ImGui_SetNextItemWidth(item_width);
    },
    /** width of item given pushed settings and current cursor position. NOT necessarily the width of last item unlike most 'Item' functions. */
    CalcItemWidth() {
        return Mod.export.ImGui_CalcItemWidth();
    },
    /** push word-wrapping position for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space */
    PushTextWrapPos(wrap_local_pos_x = 0.0) {
        return Mod.export.ImGui_PushTextWrapPos(wrap_local_pos_x);
    },
    PopTextWrapPos() {
        return Mod.export.ImGui_PopTextWrapPos();
    },
    /** get UV coordinate for a white pixel, useful to draw custom shapes via the ImDrawList API */
    GetFontTexUvWhitePixel() {
        return ImVec2.wrap(Mod.export.ImGui_GetFontTexUvWhitePixel());
    },
    /** retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwise use GetColorU32() to get style color with style alpha baked in. */
    GetStyleColorVec4(idx) {
        return ImVec4.wrap(Mod.export.ImGui_GetStyleColorVec4(idx));
    },
    /** cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND (prefer using this rather than GetCursorPos(), also more useful to work with ImDrawList API). */
    GetCursorScreenPos() {
        return ImVec2.wrap(Mod.export.ImGui_GetCursorScreenPos());
    },
    /** cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND. */
    SetCursorScreenPos(pos) {
        return Mod.export.ImGui_SetCursorScreenPos(pos?._ptr || null);
    },
    /** available space from current position. THIS IS YOUR BEST FRIEND. */
    GetContentRegionAvail() {
        return ImVec2.wrap(Mod.export.ImGui_GetContentRegionAvail());
    },
    /** [window-local] cursor position in window-local coordinates. This is not your best friend. */
    GetCursorPos() {
        return ImVec2.wrap(Mod.export.ImGui_GetCursorPos());
    },
    /** [window-local] " */
    GetCursorPosX() {
        return Mod.export.ImGui_GetCursorPosX();
    },
    /** [window-local] " */
    GetCursorPosY() {
        return Mod.export.ImGui_GetCursorPosY();
    },
    /** [window-local] " */
    SetCursorPos(local_pos) {
        return Mod.export.ImGui_SetCursorPos(local_pos?._ptr || null);
    },
    /** [window-local] " */
    SetCursorPosX(local_x) {
        return Mod.export.ImGui_SetCursorPosX(local_x);
    },
    /** [window-local] " */
    SetCursorPosY(local_y) {
        return Mod.export.ImGui_SetCursorPosY(local_y);
    },
    /** [window-local] initial cursor position, in window-local coordinates. Call GetCursorScreenPos() after Begin() to get the absolute coordinates version. */
    GetCursorStartPos() {
        return ImVec2.wrap(Mod.export.ImGui_GetCursorStartPos());
    },
    /** separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator. */
    Separator() {
        return Mod.export.ImGui_Separator();
    },
    /** call between widgets or groups to layout them horizontally. X position given in window coordinates. */
    SameLine(offset_from_start_x = 0.0, spacing = -1.0) {
        return Mod.export.ImGui_SameLine(offset_from_start_x, spacing);
    },
    /** undo a SameLine() or force a new line when in a horizontal-layout context. */
    NewLine() {
        return Mod.export.ImGui_NewLine();
    },
    /** add vertical spacing. */
    Spacing() {
        return Mod.export.ImGui_Spacing();
    },
    /** add a dummy item of given size. unlike InvisibleButton(), Dummy() won't take the mouse click or be navigable into. */
    Dummy(size) {
        return Mod.export.ImGui_Dummy(size?._ptr || null);
    },
    /** move content position toward the right, by indent_w, or style.IndentSpacing if indent_w <= 0 */
    Indent(indent_w = 0.0) {
        return Mod.export.ImGui_Indent(indent_w);
    },
    /** move content position back to the left, by indent_w, or style.IndentSpacing if indent_w <= 0 */
    Unindent(indent_w = 0.0) {
        return Mod.export.ImGui_Unindent(indent_w);
    },
    /** lock horizontal starting position */
    BeginGroup() {
        return Mod.export.ImGui_BeginGroup();
    },
    /** unlock horizontal starting position + capture the whole group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.) */
    EndGroup() {
        return Mod.export.ImGui_EndGroup();
    },
    /** vertically align upcoming text baseline to FramePadding.y so that it will align properly to regularly framed items (call if you have text on a line before a framed item) */
    AlignTextToFramePadding() {
        return Mod.export.ImGui_AlignTextToFramePadding();
    },
    /** ~ FontSize */
    GetTextLineHeight() {
        return Mod.export.ImGui_GetTextLineHeight();
    },
    /** ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text) */
    GetTextLineHeightWithSpacing() {
        return Mod.export.ImGui_GetTextLineHeightWithSpacing();
    },
    /** ~ FontSize + style.FramePadding.y * 2 */
    GetFrameHeight() {
        return Mod.export.ImGui_GetFrameHeight();
    },
    /** ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets) */
    GetFrameHeightWithSpacing() {
        return Mod.export.ImGui_GetFrameHeightWithSpacing();
    },
    /** push integer into the ID stack (will hash integer). */
    PushIDInt(int_id) {
        return Mod.export.ImGui_PushIDInt(int_id);
    },
    GetIDInt(int_id) {
        return Mod.export.ImGui_GetIDInt(int_id);
    },
    /** formatted text */
    Text(fmt) {
        return Mod.export.ImGui_Text(fmt);
    },
    /** shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor(); */
    TextColored(col, fmt) {
        return Mod.export.ImGui_TextColored(col?._ptr, fmt);
    },
    /** shortcut for PushStyleColor(ImGuiCol_TextDisabled); Text(fmt, ...); PopStyleColor(); */
    TextDisabled(fmt) {
        return Mod.export.ImGui_TextDisabled(fmt);
    },
    /** shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize(). */
    TextWrapped(fmt) {
        return Mod.export.ImGui_TextWrapped(fmt);
    },
    /** display text+label aligned the same way as value+label widgets */
    LabelText(label, fmt) {
        return Mod.export.ImGui_LabelText(label, fmt);
    },
    /** shortcut for Bullet()+Text() */
    BulletText(fmt) {
        return Mod.export.ImGui_BulletText(fmt);
    },
    /** currently: formatted text with a horizontal line */
    SeparatorText(label) {
        return Mod.export.ImGui_SeparatorText(label);
    },
    /** button */
    Button(label, size = new ImVec2(0, 0)) {
        return Mod.export.ImGui_Button(label, size?._ptr || null);
    },
    /** button with (FramePadding.y == 0) to easily embed within text */
    SmallButton(label) {
        return Mod.export.ImGui_SmallButton(label);
    },
    /** flexible button behavior without the visuals, frequently useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.) */
    InvisibleButton(str_id, size, flags = 0) {
        return Mod.export.ImGui_InvisibleButton(str_id, size?._ptr || null, flags);
    },
    /** square button with an arrow shape */
    ArrowButton(str_id, dir) {
        return Mod.export.ImGui_ArrowButton(str_id, dir);
    },
    Checkbox(label, v) {
        return Mod.export.ImGui_Checkbox(label, v);
    },
    /** use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; } */
    RadioButton(label, active) {
        return Mod.export.ImGui_RadioButton(label, active);
    },
    ProgressBar(fraction, size_arg = new ImVec2(-Number.MIN_VALUE, 0), overlay) {
        return Mod.export.ImGui_ProgressBar(fraction, size_arg?._ptr || null, overlay);
    },
    /** draw a small circle + keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses */
    Bullet() {
        return Mod.export.ImGui_Bullet();
    },
    /** hyperlink text button, return true when clicked */
    TextLink(label) {
        return Mod.export.ImGui_TextLink(label);
    },
    /** hyperlink text button, automatically open file\/url when clicked */
    TextLinkOpenURL(label, url) {
        return Mod.export.ImGui_TextLinkOpenURL(label, url);
    },
    /** Widgets: Images */
    Image(tex_ref, image_size, uv0 = new ImVec2(0, 0), uv1 = new ImVec2(1, 1)) {
        return Mod.export.ImGui_Image(
            tex_ref?._ptr || null,
            image_size?._ptr || null,
            uv0?._ptr || null,
            uv1?._ptr || null,
        );
    },
    ImageWithBg(
        tex_ref,
        image_size,
        uv0 = new ImVec2(0, 0),
        uv1 = new ImVec2(1, 1),
        bg_col = new ImVec4(0, 0, 0, 0),
        tint_col = new ImVec4(1, 1, 1, 1),
    ) {
        return Mod.export.ImGui_ImageWithBg(
            tex_ref?._ptr || null,
            image_size?._ptr || null,
            uv0?._ptr || null,
            uv1?._ptr || null,
            bg_col?._ptr || null,
            tint_col?._ptr || null,
        );
    },
    ImageButton(
        str_id,
        tex_ref,
        image_size,
        uv0 = new ImVec2(0, 0),
        uv1 = new ImVec2(1, 1),
        bg_col = new ImVec4(0, 0, 0, 0),
        tint_col = new ImVec4(1, 1, 1, 1),
    ) {
        return Mod.export.ImGui_ImageButton(
            str_id,
            tex_ref?._ptr || null,
            image_size?._ptr || null,
            uv0?._ptr || null,
            uv1?._ptr || null,
            bg_col?._ptr || null,
            tint_col?._ptr || null,
        );
    },
    /** Widgets: Combo Box (Dropdown) */
    BeginCombo(label, preview_value, flags = 0) {
        return Mod.export.ImGui_BeginCombo(label, preview_value, flags);
    },
    /** only call EndCombo() if BeginCombo() returns true! */
    EndCombo() {
        return Mod.export.ImGui_EndCombo();
    },
    /** If v_min >= v_max we have no bound */
    DragFloat(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_DragFloat(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragFloat2(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_DragFloat2(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragFloat3(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_DragFloat3(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragFloat4(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_DragFloat4(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragFloatRange2(
        label,
        v_current_min,
        v_current_max,
        v_speed = 1.0,
        v_min = 0.0,
        v_max = 0.0,
        format = "%.3f",
        format_max,
        flags = 0,
    ) {
        return Mod.export.ImGui_DragFloatRange2(
            label,
            v_current_min,
            v_current_max,
            v_speed,
            v_min,
            v_max,
            format,
            format_max,
            flags,
        );
    },
    /** If v_min >= v_max we have no bound */
    DragInt(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
        return Mod.export.ImGui_DragInt(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragInt2(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
        return Mod.export.ImGui_DragInt2(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragInt3(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
        return Mod.export.ImGui_DragInt3(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragInt4(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
        return Mod.export.ImGui_DragInt4(label, v, v_speed, v_min, v_max, format, flags);
    },
    DragIntRange2(
        label,
        v_current_min,
        v_current_max,
        v_speed = 1.0,
        v_min = 0,
        v_max = 0,
        format = "%d",
        format_max,
        flags = 0,
    ) {
        return Mod.export.ImGui_DragIntRange2(
            label,
            v_current_min,
            v_current_max,
            v_speed,
            v_min,
            v_max,
            format,
            format_max,
            flags,
        );
    },
    /** adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display. */
    SliderFloat(label, v, v_min, v_max, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_SliderFloat(label, v, v_min, v_max, format, flags);
    },
    SliderFloat2(label, v, v_min, v_max, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_SliderFloat2(label, v, v_min, v_max, format, flags);
    },
    SliderFloat3(label, v, v_min, v_max, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_SliderFloat3(label, v, v_min, v_max, format, flags);
    },
    SliderFloat4(label, v, v_min, v_max, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_SliderFloat4(label, v, v_min, v_max, format, flags);
    },
    SliderAngle(
        label,
        v_rad,
        v_degrees_min = -360.0,
        v_degrees_max = +360.0,
        format = "%.0f deg",
        flags = 0,
    ) {
        return Mod.export.ImGui_SliderAngle(
            label,
            v_rad,
            v_degrees_min,
            v_degrees_max,
            format,
            flags,
        );
    },
    SliderInt(label, v, v_min, v_max, format = "%d", flags = 0) {
        return Mod.export.ImGui_SliderInt(label, v, v_min, v_max, format, flags);
    },
    SliderInt2(label, v, v_min, v_max, format = "%d", flags = 0) {
        return Mod.export.ImGui_SliderInt2(label, v, v_min, v_max, format, flags);
    },
    SliderInt3(label, v, v_min, v_max, format = "%d", flags = 0) {
        return Mod.export.ImGui_SliderInt3(label, v, v_min, v_max, format, flags);
    },
    SliderInt4(label, v, v_min, v_max, format = "%d", flags = 0) {
        return Mod.export.ImGui_SliderInt4(label, v, v_min, v_max, format, flags);
    },
    VSliderFloat(label, size, v, v_min, v_max, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_VSliderFloat(
            label,
            size?._ptr || null,
            v,
            v_min,
            v_max,
            format,
            flags,
        );
    },
    VSliderInt(label, size, v, v_min, v_max, format = "%d", flags = 0) {
        return Mod.export.ImGui_VSliderInt(
            label,
            size?._ptr || null,
            v,
            v_min,
            v_max,
            format,
            flags,
        );
    },
    InputText(label, buf, buf_size, flags = 0) {
        return Mod.export.ImGui_InputText(label, buf, buf_size, flags);
    },
    InputTextMultiline(label, buf, buf_size, size = new ImVec2(0, 0), flags = 0) {
        return Mod.export.ImGui_InputTextMultiline(label, buf, buf_size, size?._ptr, flags);
    },
    InputTextWithHint(label, hint, buf, buf_size, flags = 0) {
        return Mod.export.ImGui_InputTextWithHint(label, hint, buf, buf_size, flags);
    },
    InputFloat(label, v, step = 0.0, step_fast = 0.0, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_InputFloat(label, v, step, step_fast, format, flags);
    },
    InputFloat2(label, v, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_InputFloat2(label, v, format, flags);
    },
    InputFloat3(label, v, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_InputFloat3(label, v, format, flags);
    },
    InputFloat4(label, v, format = "%.3f", flags = 0) {
        return Mod.export.ImGui_InputFloat4(label, v, format, flags);
    },
    InputInt(label, v, step = 1, step_fast = 100, flags = 0) {
        return Mod.export.ImGui_InputInt(label, v, step, step_fast, flags);
    },
    InputInt2(label, v, flags = 0) {
        return Mod.export.ImGui_InputInt2(label, v, flags);
    },
    InputInt3(label, v, flags = 0) {
        return Mod.export.ImGui_InputInt3(label, v, flags);
    },
    InputInt4(label, v, flags = 0) {
        return Mod.export.ImGui_InputInt4(label, v, flags);
    },
    InputDouble(label, v, step = 0.0, step_fast = 0.0, format = "%.6f", flags = 0) {
        return Mod.export.ImGui_InputDouble(label, v, step, step_fast, format, flags);
    },
    /** Widgets: Color Editor\/Picker (tip: the ColorEdit* functions have a little color square that can be left-clicked to open a picker, and right-clicked to open an option menu.) */
    ColorEdit3(label, col, flags = 0) {
        return Mod.export.ImGui_ColorEdit3(label, col, flags);
    },
    ColorEdit4(label, col, flags = 0) {
        return Mod.export.ImGui_ColorEdit4(label, col, flags);
    },
    ColorPicker3(label, col, flags = 0) {
        return Mod.export.ImGui_ColorPicker3(label, col, flags);
    },
    ColorPicker4(label, col, flags = 0, ref_col) {
        return Mod.export.ImGui_ColorPicker4(label, col, flags, ref_col);
    },
    /** display a color square\/button, hover for details, return true when pressed. */
    ColorButton(desc_id, col, flags = 0, size = new ImVec2(0, 0)) {
        return Mod.export.ImGui_ColorButton(desc_id, col?._ptr || null, flags, size?._ptr || null);
    },
    /** initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls. */
    SetColorEditOptions(flags) {
        return Mod.export.ImGui_SetColorEditOptions(flags);
    },
    /** Widgets: Trees */
    TreeNode(label) {
        return Mod.export.ImGui_TreeNode(label);
    },
    TreeNodeEx(label, flags = 0) {
        return Mod.export.ImGui_TreeNodeEx(label, flags);
    },
    /** ~ Indent()+PushID(). Already called by TreeNode() when returning true, but you can call TreePush\/TreePop yourself if desired. */
    TreePush(str_id) {
        return Mod.export.ImGui_TreePush(str_id);
    },
    /** ~ Unindent()+PopID() */
    TreePop() {
        return Mod.export.ImGui_TreePop();
    },
    /** horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode */
    GetTreeNodeToLabelSpacing() {
        return Mod.export.ImGui_GetTreeNodeToLabelSpacing();
    },
    /** if returning 'true' the header is open. doesn't indent nor push on ID stack. user doesn't have to call TreePop(). */
    CollapsingHeader(label, flags = 0) {
        return Mod.export.ImGui_CollapsingHeader(label, flags);
    },
    /** set next TreeNode\/CollapsingHeader open state. */
    SetNextItemOpen(is_open, cond = 0) {
        return Mod.export.ImGui_SetNextItemOpen(is_open, cond);
    },
    /** "bool selected" carry the selection state (read-only). Selectable() is clicked is returns true so you can modify your selection state. size.x==0.0: use remaining width, size.x>0.0: specify width. size.y==0.0: use label height, size.y>0.0: specify height */
    Selectable(label, selected = false, flags = 0, size = new ImVec2(0, 0)) {
        return Mod.export.ImGui_Selectable(label, selected, flags, size?._ptr || null);
    },
    /** Multi-selection system for Selectable(), Checkbox(), TreeNode() functions [BETA] */
    BeginMultiSelect(flags, selection_size = -1, items_count = -1) {
        return ImGuiMultiSelectIO.wrap(
            Mod.export.ImGui_BeginMultiSelect(flags, selection_size, items_count),
        );
    },
    EndMultiSelect() {
        return ImGuiMultiSelectIO.wrap(Mod.export.ImGui_EndMultiSelect());
    },
    SetNextItemSelectionUserData(selection_user_data) {
        return Mod.export.ImGui_SetNextItemSelectionUserData(selection_user_data);
    },
    /** Was the last item selection state toggled? Useful if you need the per-item information _before_ reaching EndMultiSelect(). We only returns toggle _event_ in order to handle clipping correctly. */
    IsItemToggledSelection() {
        return Mod.export.ImGui_IsItemToggledSelection();
    },
    /** open a framed scrolling region */
    BeginListBox(label, size = new ImVec2(0, 0)) {
        return Mod.export.ImGui_BeginListBox(label, size?._ptr || null);
    },
    /** only call EndListBox() if BeginListBox() returned true! */
    EndListBox() {
        return Mod.export.ImGui_EndListBox();
    },
    PlotLines(
        label,
        values,
        values_count,
        values_offset = 0,
        overlay_text = "",
        scale_min = Number.MAX_VALUE,
        scale_max = Number.MAX_VALUE,
        graph_size = new ImVec2(0, 0),
    ) {
        return Mod.export.ImGui_PlotLines(
            label,
            values,
            values_count,
            values_offset,
            overlay_text,
            scale_min,
            scale_max,
            graph_size?._ptr,
        );
    },
    PlotHistogram(
        label,
        values,
        values_count,
        values_offset = 0,
        overlay_text = "",
        scale_min = Number.MAX_VALUE,
        scale_max = Number.MAX_VALUE,
        graph_size = new ImVec2(0, 0),
    ) {
        return Mod.export.ImGui_PlotHistogram(
            label,
            values,
            values_count,
            values_offset,
            overlay_text,
            scale_min,
            scale_max,
            graph_size?._ptr,
        );
    },
    /** append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window). */
    BeginMenuBar() {
        return Mod.export.ImGui_BeginMenuBar();
    },
    /** only call EndMenuBar() if BeginMenuBar() returns true! */
    EndMenuBar() {
        return Mod.export.ImGui_EndMenuBar();
    },
    /** create and append to a full screen menu-bar. */
    BeginMainMenuBar() {
        return Mod.export.ImGui_BeginMainMenuBar();
    },
    /** only call EndMainMenuBar() if BeginMainMenuBar() returns true! */
    EndMainMenuBar() {
        return Mod.export.ImGui_EndMainMenuBar();
    },
    /** create a sub-menu entry. only call EndMenu() if this returns true! */
    BeginMenu(label, enabled = true) {
        return Mod.export.ImGui_BeginMenu(label, enabled);
    },
    /** only call EndMenu() if BeginMenu() returns true! */
    EndMenu() {
        return Mod.export.ImGui_EndMenu();
    },
    /** return true when activated. */
    MenuItem(label, shortcut, selected = false, enabled = true) {
        return Mod.export.ImGui_MenuItem(label, shortcut, selected, enabled);
    },
    /** begin\/append a tooltip window. */
    BeginTooltip() {
        return Mod.export.ImGui_BeginTooltip();
    },
    /** only call EndTooltip() if BeginTooltip()\/BeginItemTooltip() returns true! */
    EndTooltip() {
        return Mod.export.ImGui_EndTooltip();
    },
    /** set a text-only tooltip. Often used after a ImGui::IsItemHovered() check. */
    SetTooltip(fmt) {
        return Mod.export.ImGui_SetTooltip(fmt);
    },
    /** begin\/append a tooltip window if preceding item was hovered. */
    BeginItemTooltip() {
        return Mod.export.ImGui_BeginItemTooltip();
    },
    /** set a text-only tooltip if preceding item was hovered. override any previous call to SetTooltip(). */
    SetItemTooltip(fmt) {
        return Mod.export.ImGui_SetItemTooltip(fmt);
    },
    /** return true if the popup is open, and you can start outputting to it. */
    BeginPopup(str_id, flags = 0) {
        return Mod.export.ImGui_BeginPopup(str_id, flags);
    },
    /** return true if the modal is open, and you can start outputting to it. */
    BeginPopupModal(name, p_open, flags = 0) {
        return Mod.export.ImGui_BeginPopupModal(name, p_open, flags);
    },
    /** only call EndPopup() if BeginPopupXXX() returns true! */
    EndPopup() {
        return Mod.export.ImGui_EndPopup();
    },
    /** call to mark popup as open (don't call every frame!). */
    OpenPopup(str_id, popup_flags = 0) {
        return Mod.export.ImGui_OpenPopup(str_id, popup_flags);
    },
    /** helper to open popup when clicked on last item. Default to ImGuiPopupFlags_MouseButtonRight == 1. (note: actually triggers on the mouse _released_ event to be consistent with popup behaviors) */
    OpenPopupOnItemClick(str_id, popup_flags = 1) {
        return Mod.export.ImGui_OpenPopupOnItemClick(str_id, popup_flags);
    },
    /** manually close the popup we have begin-ed into. */
    CloseCurrentPopup() {
        return Mod.export.ImGui_CloseCurrentPopup();
    },
    /** open+begin popup when clicked on last item. Use str_id==NULL to associate the popup to previous item. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp! */
    BeginPopupContextItem(str_id, popup_flags = 1) {
        return Mod.export.ImGui_BeginPopupContextItem(str_id, popup_flags);
    },
    /** open+begin popup when clicked on current window. */
    BeginPopupContextWindow(str_id, popup_flags = 1) {
        return Mod.export.ImGui_BeginPopupContextWindow(str_id, popup_flags);
    },
    /** open+begin popup when clicked in void (where there are no windows). */
    BeginPopupContextVoid(str_id, popup_flags = 1) {
        return Mod.export.ImGui_BeginPopupContextVoid(str_id, popup_flags);
    },
    /** return true if the popup is open. */
    IsPopupOpen(str_id, flags = 0) {
        return Mod.export.ImGui_IsPopupOpen(str_id, flags);
    },
    /** Tables */
    BeginTable(str_id, columns, flags = 0, outer_size = new ImVec2(0.0, 0.0), inner_width = 0.0) {
        return Mod.export.ImGui_BeginTable(
            str_id,
            columns,
            flags,
            outer_size?._ptr || null,
            inner_width,
        );
    },
    /** only call EndTable() if BeginTable() returns true! */
    EndTable() {
        return Mod.export.ImGui_EndTable();
    },
    /** append into the first cell of a new row. */
    TableNextRow(row_flags = 0, min_row_height = 0.0) {
        return Mod.export.ImGui_TableNextRow(row_flags, min_row_height);
    },
    /** append into the next column (or first column of next row if currently in last column). Return true when column is visible. */
    TableNextColumn() {
        return Mod.export.ImGui_TableNextColumn();
    },
    /** append into the specified column. Return true when column is visible. */
    TableSetColumnIndex(column_n) {
        return Mod.export.ImGui_TableSetColumnIndex(column_n);
    },
    /** Tables: Headers & Columns declaration */
    TableSetupColumn(label, flags = 0, init_width_or_weight = 0.0, user_id = 0) {
        return Mod.export.ImGui_TableSetupColumn(label, flags, init_width_or_weight, user_id);
    },
    /** lock columns\/rows so they stay visible when scrolled. */
    TableSetupScrollFreeze(cols, rows) {
        return Mod.export.ImGui_TableSetupScrollFreeze(cols, rows);
    },
    /** submit one header cell manually (rarely used) */
    TableHeader(label) {
        return Mod.export.ImGui_TableHeader(label);
    },
    /** submit a row with headers cells based on data provided to TableSetupColumn() + submit context menu */
    TableHeadersRow() {
        return Mod.export.ImGui_TableHeadersRow();
    },
    /** submit a row with angled headers for every column with the ImGuiTableColumnFlags_AngledHeader flag. MUST BE FIRST ROW. */
    TableAngledHeadersRow() {
        return Mod.export.ImGui_TableAngledHeadersRow();
    },
    /** get latest sort specs for the table (NULL if not sorting).  Lifetime: don't hold on this pointer over multiple frames or past any subsequent call to BeginTable(). */
    TableGetSortSpecs() {
        return ImGuiTableSortSpecs.wrap(Mod.export.ImGui_TableGetSortSpecs());
    },
    /** return number of columns (value passed to BeginTable) */
    TableGetColumnCount() {
        return Mod.export.ImGui_TableGetColumnCount();
    },
    /** return current column index. */
    TableGetColumnIndex() {
        return Mod.export.ImGui_TableGetColumnIndex();
    },
    /** return current row index. */
    TableGetRowIndex() {
        return Mod.export.ImGui_TableGetRowIndex();
    },
    /** return "" if column didn't have a name declared by TableSetupColumn(). Pass -1 to use current column. */
    TableGetColumnName(column_n = -1) {
        return Mod.export.ImGui_TableGetColumnName(column_n);
    },
    /** return column flags so you can query their Enabled\/Visible\/Sorted\/Hovered status flags. Pass -1 to use current column. */
    TableGetColumnFlags(column_n = -1) {
        return Mod.export.ImGui_TableGetColumnFlags(column_n);
    },
    /** change user accessible enabled\/disabled state of a column. Set to false to hide the column. User can use the context menu to change this themselves (right-click in headers, or right-click in columns body with ImGuiTableFlags_ContextMenuInBody) */
    TableSetColumnEnabled(column_n, v) {
        return Mod.export.ImGui_TableSetColumnEnabled(column_n, v);
    },
    /** return hovered column. return -1 when table is not hovered. return columns_count if the unused space at the right of visible columns is hovered. Can also use (TableGetColumnFlags() & ImGuiTableColumnFlags_IsHovered) instead. */
    TableGetHoveredColumn() {
        return Mod.export.ImGui_TableGetHoveredColumn();
    },
    /** change the color of a cell, row, or column. See ImGuiTableBgTarget_ flags for details. */
    TableSetBgColor(target, color, column_n = -1) {
        return Mod.export.ImGui_TableSetBgColor(target, color, column_n);
    },
    /** Legacy Columns API (prefer using Tables!) */
    Columns(count = 1, id, borders = true) {
        return Mod.export.ImGui_Columns(count, id, borders);
    },
    /** next column, defaults to current row or next row if the current row is finished */
    NextColumn() {
        return Mod.export.ImGui_NextColumn();
    },
    /** get current column index */
    GetColumnIndex() {
        return Mod.export.ImGui_GetColumnIndex();
    },
    /** get column width (in pixels). pass -1 to use current column */
    GetColumnWidth(column_index = -1) {
        return Mod.export.ImGui_GetColumnWidth(column_index);
    },
    /** set column width (in pixels). pass -1 to use current column */
    SetColumnWidth(column_index, width) {
        return Mod.export.ImGui_SetColumnWidth(column_index, width);
    },
    /** get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f */
    GetColumnOffset(column_index = -1) {
        return Mod.export.ImGui_GetColumnOffset(column_index);
    },
    /** set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column */
    SetColumnOffset(column_index, offset_x) {
        return Mod.export.ImGui_SetColumnOffset(column_index, offset_x);
    },
    GetColumnsCount() {
        return Mod.export.ImGui_GetColumnsCount();
    },
    /** create and append into a TabBar */
    BeginTabBar(str_id, flags = 0) {
        return Mod.export.ImGui_BeginTabBar(str_id, flags);
    },
    /** only call EndTabBar() if BeginTabBar() returns true! */
    EndTabBar() {
        return Mod.export.ImGui_EndTabBar();
    },
    /** create a Tab. Returns true if the Tab is selected. */
    BeginTabItem(label, p_open, flags = 0) {
        return Mod.export.ImGui_BeginTabItem(label, p_open, flags);
    },
    /** only call EndTabItem() if BeginTabItem() returns true! */
    EndTabItem() {
        return Mod.export.ImGui_EndTabItem();
    },
    /** create a Tab behaving like a button. return true when clicked. cannot be selected in the tab bar. */
    TabItemButton(label, flags = 0) {
        return Mod.export.ImGui_TabItemButton(label, flags);
    },
    /** notify TabBar or Docking system of a closed tab\/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name. */
    SetTabItemClosed(tab_or_docked_window_label) {
        return Mod.export.ImGui_SetTabItemClosed(tab_or_docked_window_label);
    },
    /** is current window docked into another window? */
    IsWindowDocked() {
        return Mod.export.ImGui_IsWindowDocked();
    },
    /** Disabling [BETA API] */
    BeginDisabled(disabled = true) {
        return Mod.export.ImGui_BeginDisabled(disabled);
    },
    EndDisabled() {
        return Mod.export.ImGui_EndDisabled();
    },
    /** Clipping */
    PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) {
        return Mod.export.ImGui_PushClipRect(
            clip_rect_min?._ptr || null,
            clip_rect_max?._ptr || null,
            intersect_with_current_clip_rect,
        );
    },
    PopClipRect() {
        return Mod.export.ImGui_PopClipRect();
    },
    /** make last item the default focused item of a newly appearing window. */
    SetItemDefaultFocus() {
        return Mod.export.ImGui_SetItemDefaultFocus();
    },
    /** focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget. */
    SetKeyboardFocusHere(offset = 0) {
        return Mod.export.ImGui_SetKeyboardFocusHere(offset);
    },
    /** alter visibility of keyboard\/gamepad cursor. by default: show when using an arrow key, hide when clicking with mouse. */
    SetNavCursorVisible(visible) {
        return Mod.export.ImGui_SetNavCursorVisible(visible);
    },
    /** allow next item to be overlapped by a subsequent item. Useful with invisible buttons, selectable, treenode covering an area where subsequent items may need to be added. Note that both Selectable() and TreeNode() have dedicated flags doing this. */
    SetNextItemAllowOverlap() {
        return Mod.export.ImGui_SetNextItemAllowOverlap();
    },
    /** is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options. */
    IsItemHovered(flags = 0) {
        return Mod.export.ImGui_IsItemHovered(flags);
    },
    /** is the last item active? (e.g. button being held, text field being edited. This will continuously return true while holding mouse button on an item. Items that don't interact will always return false) */
    IsItemActive() {
        return Mod.export.ImGui_IsItemActive();
    },
    /** is the last item focused for keyboard\/gamepad navigation? */
    IsItemFocused() {
        return Mod.export.ImGui_IsItemFocused();
    },
    /** is the last item hovered and mouse clicked on? (**)  == IsMouseClicked(mouse_button) && IsItemHovered()Important. (**) this is NOT equivalent to the behavior of e.g. Button(). Read comments in function definition. */
    IsItemClicked(mouse_button = 0) {
        return Mod.export.ImGui_IsItemClicked(mouse_button);
    },
    /** is the last item visible? (items may be out of sight because of clipping\/scrolling) */
    IsItemVisible() {
        return Mod.export.ImGui_IsItemVisible();
    },
    /** did the last item modify its underlying value this frame? or was pressed? This is generally the same as the "bool" return value of many widgets. */
    IsItemEdited() {
        return Mod.export.ImGui_IsItemEdited();
    },
    /** was the last item just made active (item was previously inactive). */
    IsItemActivated() {
        return Mod.export.ImGui_IsItemActivated();
    },
    /** was the last item just made inactive (item was previously active). Useful for Undo\/Redo patterns with widgets that require continuous editing. */
    IsItemDeactivated() {
        return Mod.export.ImGui_IsItemDeactivated();
    },
    /** was the last item just made inactive and made a value change when it was active? (e.g. Slider\/Drag moved). Useful for Undo\/Redo patterns with widgets that require continuous editing. Note that you may get false positives (some widgets such as Combo()\/ListBox()\/Selectable() will return true even when clicking an already selected item). */
    IsItemDeactivatedAfterEdit() {
        return Mod.export.ImGui_IsItemDeactivatedAfterEdit();
    },
    /** was the last item open state toggled? set by TreeNode(). */
    IsItemToggledOpen() {
        return Mod.export.ImGui_IsItemToggledOpen();
    },
    /** is any item hovered? */
    IsAnyItemHovered() {
        return Mod.export.ImGui_IsAnyItemHovered();
    },
    /** is any item active? */
    IsAnyItemActive() {
        return Mod.export.ImGui_IsAnyItemActive();
    },
    /** is any item focused? */
    IsAnyItemFocused() {
        return Mod.export.ImGui_IsAnyItemFocused();
    },
    /** get upper-left bounding rectangle of the last item (screen space) */
    GetItemRectMin() {
        return ImVec2.wrap(Mod.export.ImGui_GetItemRectMin());
    },
    /** get lower-right bounding rectangle of the last item (screen space) */
    GetItemRectMax() {
        return ImVec2.wrap(Mod.export.ImGui_GetItemRectMax());
    },
    /** get size of last item */
    GetItemRectSize() {
        return ImVec2.wrap(Mod.export.ImGui_GetItemRectSize());
    },
    /** test if rectangle (of given size, starting from cursor position) is visible \/ not clipped. */
    IsRectVisibleBySize(size) {
        return Mod.export.ImGui_IsRectVisibleBySize(size?._ptr || null);
    },
    /** test if rectangle (in screen space) is visible \/ not clipped. to perform coarse clipping on user's side. */
    IsRectVisible(rect_min, rect_max) {
        return Mod.export.ImGui_IsRectVisible(rect_min?._ptr || null, rect_max?._ptr || null);
    },
    /** get global imgui time. incremented by io.DeltaTime every frame. */
    GetTime() {
        return Mod.export.ImGui_GetTime();
    },
    /** get global imgui frame count. incremented by 1 every frame. */
    GetFrameCount() {
        return Mod.export.ImGui_GetFrameCount();
    },
    /** you may use this when creating your own ImDrawList instances. */
    GetDrawListSharedData() {
        return ImDrawListSharedData.wrap(Mod.export.ImGui_GetDrawListSharedData());
    },
    /** get a string corresponding to the enum value (for display, saving, etc.). */
    GetStyleColorName(idx) {
        return Mod.export.ImGui_GetStyleColorName(idx);
    },
    /** Text Utilities */
    CalcTextSize(text, text_end, hide_text_after_double_hash = false, wrap_width = -1.0) {
        return ImVec2.wrap(
            Mod.export.ImGui_CalcTextSize(text, text_end, hide_text_after_double_hash, wrap_width),
        );
    },
    /** is key being held. */
    IsKeyDown(key) {
        return Mod.export.ImGui_IsKeyDown(key);
    },
    /** was key pressed (went from !Down to Down)? if repeat=true, uses io.KeyRepeatDelay \/ KeyRepeatRate */
    IsKeyPressed(key, repeat = true) {
        return Mod.export.ImGui_IsKeyPressed(key, repeat);
    },
    /** was key released (went from Down to !Down)? */
    IsKeyReleased(key) {
        return Mod.export.ImGui_IsKeyReleased(key);
    },
    /** was key chord (mods + key) pressed, e.g. you can pass 'ImGuiMod_Ctrl | ImGuiKey_S' as a key-chord. This doesn't do any routing or focus check, please consider using Shortcut() function instead. */
    IsKeyChordPressed(key_chord) {
        return Mod.export.ImGui_IsKeyChordPressed(key_chord);
    },
    /** uses provided repeat rate\/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate */
    GetKeyPressedAmount(key, repeat_delay, rate) {
        return Mod.export.ImGui_GetKeyPressedAmount(key, repeat_delay, rate);
    },
    /** [DEBUG] returns English name of the key. Those names are provided for debugging purpose and are not meant to be saved persistently nor compared. */
    GetKeyName(key) {
        return Mod.export.ImGui_GetKeyName(key);
    },
    /** Override io.WantCaptureKeyboard flag next frame (said flag is left for your application to handle, typically when true it instructs your app to ignore inputs). e.g. force capture keyboard when your widget is being hovered. This is equivalent to setting "io.WantCaptureKeyboard = want_capture_keyboard"; after the next NewFrame() call. */
    SetNextFrameWantCaptureKeyboard(want_capture_keyboard) {
        return Mod.export.ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard);
    },
    /** Inputs Utilities: Shortcut Testing & Routing [BETA] */
    Shortcut(key_chord, flags = 0) {
        return Mod.export.ImGui_Shortcut(key_chord, flags);
    },
    SetNextItemShortcut(key_chord, flags = 0) {
        return Mod.export.ImGui_SetNextItemShortcut(key_chord, flags);
    },
    /** Set key owner to last item ID if it is hovered or active. Equivalent to 'if (IsItemHovered() || IsItemActive()) { SetKeyOwner(key, GetItemID());'. */
    SetItemKeyOwner(key) {
        return Mod.export.ImGui_SetItemKeyOwner(key);
    },
    /** is mouse button held? */
    IsMouseDown(button) {
        return Mod.export.ImGui_IsMouseDown(button);
    },
    /** did mouse button clicked? (went from !Down to Down). Same as GetMouseClickedCount() == 1. */
    IsMouseClicked(button, repeat = false) {
        return Mod.export.ImGui_IsMouseClicked(button, repeat);
    },
    /** did mouse button released? (went from Down to !Down) */
    IsMouseReleased(button) {
        return Mod.export.ImGui_IsMouseReleased(button);
    },
    /** did mouse button double-clicked? Same as GetMouseClickedCount() == 2. (note that a double-click will also report IsMouseClicked() == true) */
    IsMouseDoubleClicked(button) {
        return Mod.export.ImGui_IsMouseDoubleClicked(button);
    },
    /** delayed mouse release (use very sparingly!). Generally used with 'delay >= io.MouseDoubleClickTime' + combined with a 'io.MouseClickedLastCount==1' test. This is a very rarely used UI idiom, but some apps use this: e.g. MS Explorer single click on an icon to rename. */
    IsMouseReleasedWithDelay(button, delay) {
        return Mod.export.ImGui_IsMouseReleasedWithDelay(button, delay);
    },
    /** return the number of successive mouse-clicks at the time where a click happen (otherwise 0). */
    GetMouseClickedCount(button) {
        return Mod.export.ImGui_GetMouseClickedCount(button);
    },
    /** is mouse hovering given bounding rect (in screen space). clipped by current clipping settings, but disregarding of other consideration of focus\/window ordering\/popup-block. */
    IsMouseHoveringRect(r_min, r_max, clip = true) {
        return Mod.export.ImGui_IsMouseHoveringRect(r_min?._ptr || null, r_max?._ptr || null, clip);
    },
    /** by convention we use (-FLT_MAX,-FLT_MAX) to denote that there is no mouse available */
    IsMousePosValid(mouse_pos) {
        return Mod.export.ImGui_IsMousePosValid(mouse_pos?._ptr || null);
    },
    /** [WILL OBSOLETE] is any mouse button held? This was designed for backends, but prefer having backend maintain a mask of held mouse buttons, because upcoming input queue system will make this invalid. */
    IsAnyMouseDown() {
        return Mod.export.ImGui_IsAnyMouseDown();
    },
    /** shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls */
    GetMousePos() {
        return ImVec2.wrap(Mod.export.ImGui_GetMousePos());
    },
    /** retrieve mouse position at the time of opening popup we have BeginPopup() into (helper to avoid user backing that value themselves) */
    GetMousePosOnOpeningCurrentPopup() {
        return ImVec2.wrap(Mod.export.ImGui_GetMousePosOnOpeningCurrentPopup());
    },
    /** is mouse dragging? (uses io.MouseDraggingThreshold if lock_threshold < 0.0f) */
    IsMouseDragging(button, lock_threshold = -1.0) {
        return Mod.export.ImGui_IsMouseDragging(button, lock_threshold);
    },
    /** return the delta from the initial clicking position while the mouse button is pressed or was just released. This is locked and return 0.0f until the mouse moves past a distance threshold at least once (uses io.MouseDraggingThreshold if lock_threshold < 0.0f) */
    GetMouseDragDelta(button = 0, lock_threshold = -1.0) {
        return ImVec2.wrap(Mod.export.ImGui_GetMouseDragDelta(button, lock_threshold));
    },
    ResetMouseDragDelta(button = 0) {
        return Mod.export.ImGui_ResetMouseDragDelta(button);
    },
    /** get desired mouse cursor shape. Important: reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you */
    GetMouseCursor() {
        return Mod.export.ImGui_GetMouseCursor();
    },
    /** set desired mouse cursor shape */
    SetMouseCursor(cursor_type) {
        return Mod.export.ImGui_SetMouseCursor(cursor_type);
    },
    /** Override io.WantCaptureMouse flag next frame (said flag is left for your application to handle, typical when true it instructs your app to ignore inputs). This is equivalent to setting "io.WantCaptureMouse = want_capture_mouse;" after the next NewFrame() call. */
    SetNextFrameWantCaptureMouse(want_capture_mouse) {
        return Mod.export.ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse);
    },
    /** Clipboard Utilities */
    GetClipboardText() {
        return Mod.export.ImGui_GetClipboardText();
    },
    SetClipboardText(text) {
        return Mod.export.ImGui_SetClipboardText(text);
    },
    /** call in main loop. will call CreateWindow\/ResizeWindow\/etc. platform functions for each secondary viewport, and DestroyWindow for each inactive viewport. */
    UpdatePlatformWindows() {
        return Mod.export.ImGui_UpdatePlatformWindows();
    },
});
/* -------------------------------------------------------------------------- */
/* 5. Web Implementation */
/* -------------------------------------------------------------------------- */
export const ImGuiImplOpenGL3 = {
    /** Initializes the OpenGL3 backend. */
    Init() {
        return Mod.export.cImGui_ImplOpenGL3_Init();
    },
    /** Shuts down the OpenGL3 backend. */
    Shutdown() {
        return Mod.export.cImGui_ImplOpenGL3_Shutdown();
    },
    /** Starts a new OpenGL3 frame. */
    NewFrame() {
        return Mod.export.cImGui_ImplOpenGL3_NewFrame();
    },
    /** Renders the OpenGL3 frame. */
    RenderDrawData(draw_data) {
        return Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data._ptr);
    },
};
export const ImGuiImplWGPU = {
    /** Initializes the WebGPU backend. */
    Init() {
        return Mod.export.cImGui_ImplWGPU_Init();
    },
    /** Shuts down the WebGPU backend. */
    Shutdown() {
        return Mod.export.cImGui_ImplWGPU_Shutdown();
    },
    /** Starts a new WebGPU frame. */
    NewFrame() {
        return Mod.export.cImGui_ImplWGPU_NewFrame();
    },
    /** Renders the WebGPU frame. */
    RenderDrawData(draw_data, pass_encoder) {
        const handle = Mod.export.JsValStore.add(pass_encoder);
        return Mod.export.cImGui_ImplWGPU_RenderDrawData(draw_data._ptr, handle);
    },
};
const MOUSE_BUTTON_MAP = {
    0: ImGui.MouseButton.Left,
    1: ImGui.MouseButton.Middle,
    2: ImGui.MouseButton.Right,
};
const MOUSE_CURSOR_MAP = {
    [ImGui.MouseCursor.None]: "none",
    [ImGui.MouseCursor.Arrow]: "default",
    [ImGui.MouseCursor.TextInput]: "text",
    [ImGui.MouseCursor.Hand]: "pointer",
    [ImGui.MouseCursor.ResizeAll]: "all-scroll",
    [ImGui.MouseCursor.ResizeNS]: "ns-resize",
    [ImGui.MouseCursor.ResizeEW]: "ew-resize",
    [ImGui.MouseCursor.ResizeNESW]: "nesw-resize",
    [ImGui.MouseCursor.ResizeNWSE]: "nwse-resize",
    [ImGui.MouseCursor.NotAllowed]: "not-allowed",
};
const KEYBOARD_MAP = {
    0: ImGui.Key._0,
    1: ImGui.Key._1,
    2: ImGui.Key._2,
    3: ImGui.Key._3,
    4: ImGui.Key._4,
    5: ImGui.Key._5,
    6: ImGui.Key._6,
    7: ImGui.Key._7,
    8: ImGui.Key._8,
    9: ImGui.Key._9,
    Numpad0: ImGui.Key._Keypad0,
    Numpad1: ImGui.Key._Keypad1,
    Numpad2: ImGui.Key._Keypad2,
    Numpad3: ImGui.Key._Keypad3,
    Numpad4: ImGui.Key._Keypad4,
    Numpad5: ImGui.Key._Keypad5,
    Numpad6: ImGui.Key._Keypad6,
    Numpad7: ImGui.Key._Keypad7,
    Numpad8: ImGui.Key._Keypad8,
    Numpad9: ImGui.Key._Keypad9,
    NumpadDecimal: ImGui.Key._KeypadDecimal,
    NumpadDivide: ImGui.Key._KeypadDivide,
    NumpadMultiply: ImGui.Key._KeypadMultiply,
    NumpadSubtract: ImGui.Key._KeypadSubtract,
    NumpadAdd: ImGui.Key._KeypadAdd,
    NumpadEnter: ImGui.Key._KeypadEnter,
    NumpadEqual: ImGui.Key._KeypadEqual,
    F1: ImGui.Key._F1,
    F2: ImGui.Key._F2,
    F3: ImGui.Key._F3,
    F4: ImGui.Key._F4,
    F5: ImGui.Key._F5,
    F6: ImGui.Key._F6,
    F7: ImGui.Key._F7,
    F8: ImGui.Key._F8,
    F9: ImGui.Key._F9,
    F10: ImGui.Key._F10,
    F11: ImGui.Key._F11,
    F12: ImGui.Key._F12,
    F13: ImGui.Key._F13,
    F14: ImGui.Key._F14,
    F15: ImGui.Key._F15,
    F16: ImGui.Key._F16,
    F17: ImGui.Key._F17,
    F18: ImGui.Key._F18,
    F19: ImGui.Key._F19,
    F20: ImGui.Key._F20,
    F21: ImGui.Key._F21,
    F22: ImGui.Key._F22,
    F23: ImGui.Key._F23,
    F24: ImGui.Key._F24,
    a: ImGui.Key._A,
    b: ImGui.Key._B,
    c: ImGui.Key._C,
    d: ImGui.Key._D,
    e: ImGui.Key._E,
    f: ImGui.Key._F,
    g: ImGui.Key._G,
    h: ImGui.Key._H,
    i: ImGui.Key._I,
    j: ImGui.Key._J,
    k: ImGui.Key._K,
    l: ImGui.Key._L,
    m: ImGui.Key._M,
    n: ImGui.Key._N,
    o: ImGui.Key._O,
    p: ImGui.Key._P,
    q: ImGui.Key._Q,
    r: ImGui.Key._R,
    s: ImGui.Key._S,
    t: ImGui.Key._T,
    u: ImGui.Key._U,
    v: ImGui.Key._V,
    w: ImGui.Key._W,
    x: ImGui.Key._X,
    y: ImGui.Key._Y,
    z: ImGui.Key._Z,
    A: ImGui.Key._A,
    B: ImGui.Key._B,
    C: ImGui.Key._C,
    D: ImGui.Key._D,
    E: ImGui.Key._E,
    F: ImGui.Key._F,
    G: ImGui.Key._G,
    H: ImGui.Key._H,
    I: ImGui.Key._I,
    J: ImGui.Key._J,
    K: ImGui.Key._K,
    L: ImGui.Key._L,
    M: ImGui.Key._M,
    N: ImGui.Key._N,
    O: ImGui.Key._O,
    P: ImGui.Key._P,
    Q: ImGui.Key._Q,
    R: ImGui.Key._R,
    S: ImGui.Key._S,
    T: ImGui.Key._T,
    U: ImGui.Key._U,
    V: ImGui.Key._V,
    W: ImGui.Key._W,
    X: ImGui.Key._X,
    Y: ImGui.Key._Y,
    Z: ImGui.Key._Z,
    "'": ImGui.Key._Apostrophe,
    ",": ImGui.Key._Comma,
    "-": ImGui.Key._Minus,
    ".": ImGui.Key._Period,
    "/": ImGui.Key._Slash,
    ";": ImGui.Key._Semicolon,
    "=": ImGui.Key._Equal,
    "[": ImGui.Key._LeftBracket,
    "\\": ImGui.Key._Backslash,
    "]": ImGui.Key._RightBracket,
    "`": ImGui.Key._GraveAccent,
    CapsLock: ImGui.Key._CapsLock,
    ScrollLock: ImGui.Key._ScrollLock,
    NumLock: ImGui.Key._NumLock,
    PrintScreen: ImGui.Key._PrintScreen,
    Pause: ImGui.Key._Pause,
    Tab: ImGui.Key._Tab,
    ArrowLeft: ImGui.Key._LeftArrow,
    ArrowRight: ImGui.Key._RightArrow,
    ArrowUp: ImGui.Key._UpArrow,
    ArrowDown: ImGui.Key._DownArrow,
    PageUp: ImGui.Key._PageUp,
    PageDown: ImGui.Key._PageDown,
    Home: ImGui.Key._Home,
    End: ImGui.Key._End,
    Insert: ImGui.Key._Insert,
    Delete: ImGui.Key._Delete,
    Backspace: ImGui.Key._Backspace,
    " ": ImGui.Key._Space,
    Enter: ImGui.Key._Enter,
    Escape: ImGui.Key._Escape,
    Control: ImGui.Key._LeftCtrl,
    Shift: ImGui.Key._LeftShift,
    Alt: ImGui.Key._LeftAlt,
    Super: ImGui.Key._LeftSuper,
};
const KEYBOARD_MODIFIER_MAP = {
    Control: ImGui.Key.ImGuiMod_Ctrl,
    Shift: ImGui.Key.ImGuiMod_Shift,
    Alt: ImGui.Key.ImGuiMod_Alt,
    Super: ImGui.Key.ImGuiMod_Super,
};
const handleKeyboardEvent = (event, keyDown, io) => {
    io.AddKeyEvent(KEYBOARD_MAP[event.key], keyDown);
    const modifier = KEYBOARD_MODIFIER_MAP[event.key];
    if (modifier) {
        io.AddKeyEvent(modifier, keyDown);
    }
    if (event.key.length === 1 && keyDown) {
        io.AddInputCharactersUTF8(event.key);
    }
};
/**
 * Sets up canvas size and resize handling.
 */
function setupCanvasIO(canvas) {
    const io = ImGui.GetIO();
    const setDisplayProperties = () => {
        const displayWidth = Math.floor(canvas.clientWidth);
        const displayHeight = Math.floor(canvas.clientHeight);
        const dpr = globalThis.devicePixelRatio || 1;
        const bufferWidth = Math.max(1, Math.round(displayWidth * dpr));
        const bufferHeight = Math.max(1, Math.round(displayHeight * dpr));
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
        io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        io.DisplayFramebufferScale = new ImVec2(dpr, dpr);
    };
    setDisplayProperties();
    globalThis.addEventListener("resize", setDisplayProperties);
}
/**
 * Sets up mouse input, movement and cursor handling.
 */
function setupMouseIO(canvas) {
    const io = ImGui.GetIO();
    const scrollSpeed = 0.01;
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        io.AddMousePosEvent(e.clientX - rect.left, e.clientY - rect.top);
        canvas.style.cursor = MOUSE_CURSOR_MAP[ImGui.GetMouseCursor()];
    });
    canvas.addEventListener("mousedown", (e) => {
        io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[e.button], true);
    });
    canvas.addEventListener("mouseup", (e) => {
        io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[e.button], false);
    });
    canvas.addEventListener("wheel", (e) => {
        io.AddMouseWheelEvent(-e.deltaX * scrollSpeed, -e.deltaY * scrollSpeed);
    });
}
/**
 * Sets up keyboard input handling.
 */
function setupKeyboardIO(canvas) {
    const io = ImGui.GetIO();
    // TODO: Fix too fast repeated inputs (Backspace, Delete...).
    canvas.addEventListener("keydown", (e) => handleKeyboardEvent(e, true, io));
    canvas.addEventListener("keyup", (e) => handleKeyboardEvent(e, false, io));
}
/**
 * Sets up touch input handling.
 * Single-finger touches are treated as mouse left clicks.
 * Two-finger touches are treated as mouse scrolls.
 */
function setupTouchIO(canvas) {
    const io = ImGui.GetIO();
    const scrollSpeed = 0.02;
    let lastPos = { x: 0, y: 0 };
    const handleTouchEvent = (event, isButtonDown) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentPos = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2,
            };
            if (lastPos.x > 0 && lastPos.y > 0) {
                const deltaX = (lastPos.x - currentPos.x) * scrollSpeed;
                const deltaY = (lastPos.y - currentPos.y) * scrollSpeed;
                io.AddMouseWheelEvent(-deltaX, -deltaY);
            }
            lastPos = currentPos;
            return;
        }
        lastPos = { x: 0, y: 0 };
        const touch = event.touches[0];
        if (touch) {
            io.AddMousePosEvent(touch.clientX - rect.left, touch.clientY - rect.top);
        }
        if (typeof isButtonDown === "boolean") {
            io.AddMouseButtonEvent(ImGui.MouseButton.Left, isButtonDown);
        }
    };
    // Since the Virtual Keyboard API isn't widely supported yet, we use an invisible
    // <input> element to show the on-screen keyboard and handle the text input.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    const keyDownHandler = (e) => handleKeyboardEvent(e, true, io);
    const keyUpHandler = (e) => handleKeyboardEvent(e, false, io);
    const blurHandler = () => {
        input.removeEventListener("keydown", keyDownHandler);
        input.removeEventListener("keyup", keyUpHandler);
        input.remove();
    };
    const handleTextInput = () => {
        if (io.WantTextInput) {
            document.body.appendChild(input);
            input.focus();
            input.addEventListener("blur", blurHandler);
            input.addEventListener("keydown", keyDownHandler);
            input.addEventListener("keyup", (e) => {
                keyUpHandler(e);
                // Exits single-line input fields when pressing Enter.
                if (!io.WantTextInput) {
                    blurHandler();
                }
            });
        } else {
            blurHandler();
        }
    };
    canvas.addEventListener("touchstart", (e) => handleTouchEvent(e, true));
    canvas.addEventListener("touchmove", (e) => handleTouchEvent(e));
    canvas.addEventListener("touchend", (e) => {
        lastPos = { x: 0, y: 0 };
        handleTouchEvent(e, false);
        handleTextInput();
    });
    canvas.addEventListener("touchcancel", (e) => {
        lastPos = { x: 0, y: 0 };
        handleTouchEvent(e, false);
    });
}
/**
 * Setup Browser inputs (mouse, keyboard, and touch).
 */
function setupBrowserIO(canvas) {
    const io = ImGui.GetIO();
    io.BackendFlags = ImGui.BackendFlags.HasMouseCursors;
    canvas.tabIndex = 1;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("focus", () => io.AddFocusEvent(true));
    canvas.addEventListener("blur", () => io.AddFocusEvent(false));
    setupCanvasIO(canvas);
    setupMouseIO(canvas);
    setupKeyboardIO(canvas);
    setupTouchIO(canvas);
}
/** Web implementation of Jsimgui. */
export const ImGuiImplWeb = {
    /** Initialize Dear ImGui with WebGL2 Backend on the given canvas. */
    async InitWebGL(canvas) {
        await Mod.init();
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");
        const canvasContext = canvas.getContext("webgl2");
        if (!canvasContext) {
            throw new Error("Failed to create WebGL2 context.");
        }
        ImGui.CreateContext();
        setupBrowserIO(canvas);
        const handle = Mod.export.GL.registerContext(
            canvasContext,
            canvasContext.getContextAttributes(),
        );
        Mod.export.GL.makeContextCurrent(handle);
        ImGuiImplOpenGL3.Init();
    },
    /** Initialize Dear ImGui with WebGPU Backend on the given canvas. */
    async InitWebGPU(canvas, device) {
        await Mod.init();
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");
        ImGui.CreateContext();
        setupBrowserIO(canvas);
        Mod.export.preinitializedWebGPUDevice = device;
        ImGuiImplWGPU.Init();
    },
    /** Begin a new ImGui WebGL frame. Call this at the beginning of your render loop. */
    BeginRenderWebGL() {
        ImGuiImplOpenGL3.NewFrame();
        ImGui.NewFrame();
    },
    /** Begin a new ImGui WebGPU frame. Call this at the beginning of your render loop. */
    BeginRenderWebGPU() {
        ImGuiImplWGPU.NewFrame();
        ImGui.NewFrame();
    },
    /** End the current ImGui WebGL frame. Call this at the end of your render loop. */
    EndRenderWebGL() {
        ImGui.Render();
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    },
    /** End the current ImGui WebGPU frame. Call this before passEncoder.end(). */
    EndRenderWebGPU(passEncoder) {
        ImGui.Render();
        ImGuiImplWGPU.RenderDrawData(ImGui.GetDrawData(), passEncoder);
    },
    /** Load an image to be used on a WebGL canvas. Returns the texture id. */
    LoadImageWebGL(canvas, image) {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const gl = canvas.getContext("webgl2");
                if (!gl) {
                    throw new Error("Failed to create WebGL2 context.");
                }
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                const id = Mod.export.GL.getNewId(Mod.export.GL.textures);
                Mod.export.GL.textures[id] = texture;
                resolve(id);
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    },
    /** Load an image to be used on a WebGPU canvas. Returns the texture id. */
    LoadImageWebGPU(device, image) {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const textureDescriptor = {
                    usage:
                        GPUTextureUsage.COPY_DST |
                        GPUTextureUsage.TEXTURE_BINDING |
                        GPUTextureUsage.RENDER_ATTACHMENT,
                    dimension: "2d",
                    size: {
                        width: image.width,
                        height: image.height,
                        depthOrArrayLayers: 1,
                    },
                    format: "rgba8unorm",
                    mipLevelCount: 1,
                    sampleCount: 1,
                };
                const texture = device.createTexture(textureDescriptor);
                const textureDestination = {
                    texture: texture,
                    mipLevel: 0,
                    origin: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    aspect: "all",
                };
                const copySize = {
                    width: image.width,
                    height: image.height,
                    depthOrArrayLayers: 1,
                };
                device.queue.copyExternalImageToTexture(
                    { source: image },
                    textureDestination,
                    copySize,
                );
                const textureViewDescriptor = {
                    format: "rgba8unorm",
                    dimension: "2d",
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    baseArrayLayer: 0,
                    arrayLayerCount: 1,
                    aspect: "all",
                };
                const textureView = texture.createView(textureViewDescriptor);
                Mod.export.WebGPU.mgrTexture.create(texture);
                const id = Mod.export.WebGPU.mgrTextureView.create(textureView);
                resolve(id);
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    },
};
