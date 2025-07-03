/** The main WASM module. */
export declare const Mod: {
    /** The WASM module exports. */
    _export: null;
    /** Initialize the WASM module. */
    init(): Promise<void>;
    /** Access to the WASM exports. */
    readonly export: any;
};
/** A class that wraps a reference to an ImGui struct. */
declare class StructBinding {
    /** The reference to the underlying C++ struct. */
    _ptr: any;
    constructor(name: string);
    /** Wrap a new C++ struct into a JS wrapper */
    static wrap(ptr: any): any;
}
/** TODO: Add comment */
export type ImDrawIdx = number;
/** TODO: Add comment */
export type ImGuiID = number;
/** TODO: Add comment */
export type ImS8 = number;
/** TODO: Add comment */
export type ImU8 = number;
/** TODO: Add comment */
export type ImS16 = number;
/** TODO: Add comment */
export type ImU16 = number;
/** TODO: Add comment */
export type ImS32 = number;
/** TODO: Add comment */
export type ImU32 = number;
/** TODO: Add comment */
export type ImS64 = BigInt;
/** TODO: Add comment */
export type ImU64 = BigInt;
/** TODO: Add comment */
export type ImGuiDir = number;
/** TODO: Add comment */
export type ImGuiKey = number;
/** TODO: Add comment */
export type ImGuiMouseSource = number;
/** TODO: Add comment */
export type ImGuiSortDirection = number;
/** TODO: Add comment */
export type ImGuiCol = number;
/** TODO: Add comment */
export type ImGuiCond = number;
/** TODO: Add comment */
export type ImGuiDataType = number;
/** TODO: Add comment */
export type ImGuiMouseButton = number;
/** TODO: Add comment */
export type ImGuiMouseCursor = number;
/** TODO: Add comment */
export type ImGuiStyleVar = number;
/** TODO: Add comment */
export type ImGuiTableBgTarget = number;
/** TODO: Add comment */
export type ImDrawFlags = number;
/** TODO: Add comment */
export type ImDrawListFlags = number;
/** TODO: Add comment */
export type ImFontFlags = number;
/** TODO: Add comment */
export type ImFontAtlasFlags = number;
/** TODO: Add comment */
export type ImGuiBackendFlags = number;
/** TODO: Add comment */
export type ImGuiButtonFlags = number;
/** TODO: Add comment */
export type ImGuiChildFlags = number;
/** TODO: Add comment */
export type ImGuiColorEditFlags = number;
/** TODO: Add comment */
export type ImGuiConfigFlags = number;
/** TODO: Add comment */
export type ImGuiComboFlags = number;
/** TODO: Add comment */
export type ImGuiDockNodeFlags = number;
/** TODO: Add comment */
export type ImGuiDragDropFlags = number;
/** TODO: Add comment */
export type ImGuiFocusedFlags = number;
/** TODO: Add comment */
export type ImGuiHoveredFlags = number;
/** TODO: Add comment */
export type ImGuiInputFlags = number;
/** TODO: Add comment */
export type ImGuiInputTextFlags = number;
/** TODO: Add comment */
export type ImGuiItemFlags = number;
/** TODO: Add comment */
export type ImGuiKeyChord = number;
/** TODO: Add comment */
export type ImGuiPopupFlags = number;
/** TODO: Add comment */
export type ImGuiMultiSelectFlags = number;
/** TODO: Add comment */
export type ImGuiSelectableFlags = number;
/** TODO: Add comment */
export type ImGuiSliderFlags = number;
/** TODO: Add comment */
export type ImGuiTabBarFlags = number;
/** TODO: Add comment */
export type ImGuiTabItemFlags = number;
/** TODO: Add comment */
export type ImGuiTableFlags = number;
/** TODO: Add comment */
export type ImGuiTableColumnFlags = number;
/** TODO: Add comment */
export type ImGuiTableRowFlags = number;
/** TODO: Add comment */
export type ImGuiTreeNodeFlags = number;
/** TODO: Add comment */
export type ImGuiViewportFlags = number;
/** TODO: Add comment */
export type ImGuiWindowFlags = number;
/** TODO: Add comment */
export type ImWchar32 = number;
/** TODO: Add comment */
export type ImWchar16 = number;
/** TODO: Add comment */
export type ImWchar = number;
/** TODO: Add comment */
export type ImGuiSelectionUserData = BigInt;
/** TODO: Add comment */
export type ImTextureID = BigInt;
/** TODO: Add comment */
export type ImFontAtlasRectId = number;
/** Data shared among multiple draw lists (typically owned by parent ImGui context, but you may create one yourself) */
export declare class ImDrawListSharedData extends StructBinding {
    constructor();
}
/** Dear ImGui context (opaque structure, unless including imgui_internal.h) */
export declare class ImGuiContext extends StructBinding {
    constructor();
}
/** 2D vector used to store positions, sizes etc. */
export declare class ImVec2 extends StructBinding {
    constructor(x?: number, y?: number);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
}
/** 4D vector used to store clipping rectangles, colors etc. */
export declare class ImVec4 extends StructBinding {
    constructor(x?: number, y?: number, z?: number, w?: number);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get z(): number;
    set z(v: number);
    get w(): number;
    set w(v: number);
}
/** ImTextureRef = higher-level identifier for a texture. */
export declare class ImTextureRef extends StructBinding {
    constructor(id: ImTextureID);
    /** _OR_ Low-level backend texture identifier, if already uploaded or created by user\/app. Generally provided to e.g. ImGui::Image() calls. */
    get _TexID(): ImTextureID;
    set _TexID(v: ImTextureID);
    /** == (_TexData ? _TexData->TexID : _TexID) \/\/ Implemented below in the file. */
    GetTexID(): ImTextureID;
}
/** Sorting specifications for a table (often handling sort specs for a single column, occasionally more) */
export declare class ImGuiTableSortSpecs extends StructBinding {
    constructor();
}
/** Sorting specification for one column of a table (sizeof == 12 bytes) */
export declare class ImGuiTableColumnSortSpecs extends StructBinding {
    constructor();
}
/** Runtime data for styling/colors. */
export declare class ImGuiStyle extends StructBinding {
    constructor();
    /** Current base font size before external global factors are applied. Use PushFont(NULL, size) to modify. Use ImGui::GetFontSize() to obtain scaled value. */
    get FontSizeBase(): number;
    set FontSizeBase(v: number);
    /** Main global scale factor. May be set by application once, or exposed to end-user. */
    get FontScaleMain(): number;
    set FontScaleMain(v: number);
    /** Additional global scale factor from viewport\/monitor contents scale. When io.ConfigDpiScaleFonts is enabled, this is automatically overwritten when changing monitor DPI. */
    get FontScaleDpi(): number;
    set FontScaleDpi(v: number);
    /** Global alpha applies to everything in Dear ImGui. */
    get Alpha(): number;
    set Alpha(v: number);
    /** Additional alpha multiplier applied by BeginDisabled(). Multiply over current value of Alpha. */
    get DisabledAlpha(): number;
    set DisabledAlpha(v: number);
    /** Padding within a window. */
    get WindowPadding(): ImVec2;
    set WindowPadding(v: ImVec2);
    /** Radius of window corners rounding. Set to 0.0f to have rectangular windows. Large values tend to lead to variety of artifacts and are not recommended. */
    get WindowRounding(): number;
    set WindowRounding(v: number);
    /** Thickness of border around windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get WindowBorderSize(): number;
    set WindowBorderSize(v: number);
    /** Hit-testing extent outside\/inside resizing border. Also extend determination of hovered window. Generally meaningfully larger than WindowBorderSize to make it easy to reach borders. */
    get WindowBorderHoverPadding(): number;
    set WindowBorderHoverPadding(v: number);
    /** Minimum window size. This is a global setting. If you want to constrain individual windows, use SetNextWindowSizeConstraints(). */
    get WindowMinSize(): ImVec2;
    set WindowMinSize(v: ImVec2);
    /** Alignment for title bar text. Defaults to (0.0f,0.5f) for left-aligned,vertically centered. */
    get WindowTitleAlign(): ImVec2;
    set WindowTitleAlign(v: ImVec2);
    /** Side of the collapsing\/docking button in the title bar (None\/Left\/Right). Defaults to ImGuiDir_Left. */
    get WindowMenuButtonPosition(): ImGuiDir;
    set WindowMenuButtonPosition(v: ImGuiDir);
    /** Radius of child window corners rounding. Set to 0.0f to have rectangular windows. */
    get ChildRounding(): number;
    set ChildRounding(v: number);
    /** Thickness of border around child windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get ChildBorderSize(): number;
    set ChildBorderSize(v: number);
    /** Radius of popup window corners rounding. (Note that tooltip windows use WindowRounding) */
    get PopupRounding(): number;
    set PopupRounding(v: number);
    /** Thickness of border around popup\/tooltip windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get PopupBorderSize(): number;
    set PopupBorderSize(v: number);
    /** Padding within a framed rectangle (used by most widgets). */
    get FramePadding(): ImVec2;
    set FramePadding(v: ImVec2);
    /** Radius of frame corners rounding. Set to 0.0f to have rectangular frame (used by most widgets). */
    get FrameRounding(): number;
    set FrameRounding(v: number);
    /** Thickness of border around frames. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get FrameBorderSize(): number;
    set FrameBorderSize(v: number);
    /** Horizontal and vertical spacing between widgets\/lines. */
    get ItemSpacing(): ImVec2;
    set ItemSpacing(v: ImVec2);
    /** Horizontal and vertical spacing between within elements of a composed widget (e.g. a slider and its label). */
    get ItemInnerSpacing(): ImVec2;
    set ItemInnerSpacing(v: ImVec2);
    /** Padding within a table cell. Cellpadding.x is locked for entire table. CellPadding.y may be altered between different rows. */
    get CellPadding(): ImVec2;
    set CellPadding(v: ImVec2);
    /** Expand reactive bounding box for touch-based system where touch position is not accurate enough. Unfortunately we don't sort widgets so priority on overlap will always be given to the first widget. So don't grow this too much! */
    get TouchExtraPadding(): ImVec2;
    set TouchExtraPadding(v: ImVec2);
    /** Horizontal indentation when e.g. entering a tree node. Generally == (FontSize + FramePadding.x*2). */
    get IndentSpacing(): number;
    set IndentSpacing(v: number);
    /** Minimum horizontal spacing between two columns. Preferably > (FramePadding.x + 1). */
    get ColumnsMinSpacing(): number;
    set ColumnsMinSpacing(v: number);
    /** Width of the vertical scrollbar, Height of the horizontal scrollbar. */
    get ScrollbarSize(): number;
    set ScrollbarSize(v: number);
    /** Radius of grab corners for scrollbar. */
    get ScrollbarRounding(): number;
    set ScrollbarRounding(v: number);
    /** Minimum width\/height of a grab box for slider\/scrollbar. */
    get GrabMinSize(): number;
    set GrabMinSize(v: number);
    /** Radius of grabs corners rounding. Set to 0.0f to have rectangular slider grabs. */
    get GrabRounding(): number;
    set GrabRounding(v: number);
    /** The size in pixels of the dead-zone around zero on logarithmic sliders that cross zero. */
    get LogSliderDeadzone(): number;
    set LogSliderDeadzone(v: number);
    /** Thickness of border around Image() calls. */
    get ImageBorderSize(): number;
    set ImageBorderSize(v: number);
    /** Radius of upper corners of a tab. Set to 0.0f to have rectangular tabs. */
    get TabRounding(): number;
    set TabRounding(v: number);
    /** Thickness of border around tabs. */
    get TabBorderSize(): number;
    set TabBorderSize(v: number);
    /** -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width. */
    get TabCloseButtonMinWidthSelected(): number;
    set TabCloseButtonMinWidthSelected(v: number);
    /** -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width. FLT_MAX: never show close button when unselected. */
    get TabCloseButtonMinWidthUnselected(): number;
    set TabCloseButtonMinWidthUnselected(v: number);
    /** Thickness of tab-bar separator, which takes on the tab active color to denote focus. */
    get TabBarBorderSize(): number;
    set TabBarBorderSize(v: number);
    /** Thickness of tab-bar overline, which highlights the selected tab-bar. */
    get TabBarOverlineSize(): number;
    set TabBarOverlineSize(v: number);
    /** Angle of angled headers (supported values range from -50.0f degrees to +50.0f degrees). */
    get TableAngledHeadersAngle(): number;
    set TableAngledHeadersAngle(v: number);
    /** Alignment of angled headers within the cell */
    get TableAngledHeadersTextAlign(): ImVec2;
    set TableAngledHeadersTextAlign(v: ImVec2);
    /** Default way to draw lines connecting TreeNode hierarchy. ImGuiTreeNodeFlags_DrawLinesNone or ImGuiTreeNodeFlags_DrawLinesFull or ImGuiTreeNodeFlags_DrawLinesToNodes. */
    get TreeLinesFlags(): ImGuiTreeNodeFlags;
    set TreeLinesFlags(v: ImGuiTreeNodeFlags);
    /** Thickness of outlines when using ImGuiTreeNodeFlags_DrawLines. */
    get TreeLinesSize(): number;
    set TreeLinesSize(v: number);
    /** Radius of lines connecting child nodes to the vertical line. */
    get TreeLinesRounding(): number;
    set TreeLinesRounding(v: number);
    /** Side of the color button in the ColorEdit4 widget (left\/right). Defaults to ImGuiDir_Right. */
    get ColorButtonPosition(): ImGuiDir;
    set ColorButtonPosition(v: ImGuiDir);
    /** Alignment of button text when button is larger than text. Defaults to (0.5f, 0.5f) (centered). */
    get ButtonTextAlign(): ImVec2;
    set ButtonTextAlign(v: ImVec2);
    /** Alignment of selectable text. Defaults to (0.0f, 0.0f) (top-left aligned). It's generally important to keep this left-aligned if you want to lay multiple items on a same line. */
    get SelectableTextAlign(): ImVec2;
    set SelectableTextAlign(v: ImVec2);
    /** Thickness of border in SeparatorText() */
    get SeparatorTextBorderSize(): number;
    set SeparatorTextBorderSize(v: number);
    /** Alignment of text within the separator. Defaults to (0.0f, 0.5f) (left aligned, center). */
    get SeparatorTextAlign(): ImVec2;
    set SeparatorTextAlign(v: ImVec2);
    /** Horizontal offset of text from each edge of the separator + spacing on other axis. Generally small values. .y is recommended to be == FramePadding.y. */
    get SeparatorTextPadding(): ImVec2;
    set SeparatorTextPadding(v: ImVec2);
    /** Apply to regular windows: amount which we enforce to keep visible when moving near edges of your screen. */
    get DisplayWindowPadding(): ImVec2;
    set DisplayWindowPadding(v: ImVec2);
    /** Apply to every windows, menus, popups, tooltips: amount where we avoid displaying contents. Adjust if you cannot see the edges of your screen (e.g. on a TV where scaling has not been configured). */
    get DisplaySafeAreaPadding(): ImVec2;
    set DisplaySafeAreaPadding(v: ImVec2);
    /** Thickness of resizing border between docked windows */
    get DockingSeparatorSize(): number;
    set DockingSeparatorSize(v: number);
    /** Scale software rendered mouse cursor (when io.MouseDrawCursor is enabled). We apply per-monitor DPI scaling over this scale. May be removed later. */
    get MouseCursorScale(): number;
    set MouseCursorScale(v: number);
    /** Enable anti-aliased lines\/borders. Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLines(): boolean;
    set AntiAliasedLines(v: boolean);
    /** Enable anti-aliased lines\/borders using textures where possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLinesUseTex(): boolean;
    set AntiAliasedLinesUseTex(v: boolean);
    /** Enable anti-aliased edges around filled shapes (rounded rectangles, circles, etc.). Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedFill(): boolean;
    set AntiAliasedFill(v: boolean);
    /** Tessellation tolerance when using PathBezierCurveTo() without a specific number of segments. Decrease for highly tessellated curves (higher quality, more polygons), increase to reduce quality. */
    get CurveTessellationTol(): number;
    set CurveTessellationTol(v: number);
    /** Maximum error (in pixels) allowed when using AddCircle()\/AddCircleFilled() or drawing rounded corner rectangles with no explicit segment count specified. Decrease for higher quality but more geometry. */
    get CircleTessellationMaxError(): number;
    set CircleTessellationMaxError(v: number);
    /** Delay for IsItemHovered(ImGuiHoveredFlags_Stationary). Time required to consider mouse stationary. */
    get HoverStationaryDelay(): number;
    set HoverStationaryDelay(v: number);
    /** Delay for IsItemHovered(ImGuiHoveredFlags_DelayShort). Usually used along with HoverStationaryDelay. */
    get HoverDelayShort(): number;
    set HoverDelayShort(v: number);
    /** Delay for IsItemHovered(ImGuiHoveredFlags_DelayNormal). " */
    get HoverDelayNormal(): number;
    set HoverDelayNormal(v: number);
    /** Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using mouse. */
    get HoverFlagsForTooltipMouse(): ImGuiHoveredFlags;
    set HoverFlagsForTooltipMouse(v: ImGuiHoveredFlags);
    /** Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using keyboard\/gamepad. */
    get HoverFlagsForTooltipNav(): ImGuiHoveredFlags;
    set HoverFlagsForTooltipNav(v: ImGuiHoveredFlags);
    /** Scale all spacing\/padding\/thickness values. Do not scale fonts. */
    ScaleAllSizes(scale_factor: number): void;
}
/** Main configuration and I/O between your application and ImGui. */
export declare class ImGuiIO extends StructBinding {
    constructor();
    /** = 0              \/\/ See ImGuiConfigFlags_ enum. Set by user\/application. Keyboard\/Gamepad navigation options, etc. */
    get ConfigFlags(): ImGuiConfigFlags;
    set ConfigFlags(v: ImGuiConfigFlags);
    /** = 0              \/\/ See ImGuiBackendFlags_ enum. Set by backend (imgui_impl_xxx files or custom backend) to communicate features supported by the backend. */
    get BackendFlags(): ImGuiBackendFlags;
    set BackendFlags(v: ImGuiBackendFlags);
    /** <unset>          \/\/ Main display size, in pixels (== GetMainViewport()->Size). May change every frame. */
    get DisplaySize(): ImVec2;
    set DisplaySize(v: ImVec2);
    /** = (1, 1)         \/\/ Main display density. For retina display where window coordinates are different from framebuffer coordinates. This will affect font density + will end up in ImDrawData::FramebufferScale. */
    get DisplayFramebufferScale(): ImVec2;
    set DisplayFramebufferScale(v: ImVec2);
    /** = 1.0f\/60.0f     \/\/ Time elapsed since last frame, in seconds. May change every frame. */
    get DeltaTime(): number;
    set DeltaTime(v: number);
    /** = 5.0f           \/\/ Minimum time between saving positions\/sizes to .ini file, in seconds. */
    get IniSavingRate(): number;
    set IniSavingRate(v: number);
    /** <auto>           \/\/ Font atlas: load, rasterize and pack one or more fonts into a single texture. */
    get Fonts(): ImFontAtlas;
    set Fonts(v: ImFontAtlas);
    /** = NULL           \/\/ Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0]. */
    get FontDefault(): ImFont;
    set FontDefault(v: ImFont);
    /** = false          \/\/ [OBSOLETE] Allow user scaling text of individual window with CTRL+Wheel. */
    get FontAllowUserScaling(): boolean;
    set FontAllowUserScaling(v: boolean);
    /** = false          \/\/ Swap Activate<>Cancel (A<>B) buttons, matching typical "Nintendo\/Japanese style" gamepad layout. */
    get ConfigNavSwapGamepadButtons(): boolean;
    set ConfigNavSwapGamepadButtons(v: boolean);
    /** = false          \/\/ Directional\/tabbing navigation teleports the mouse cursor. May be useful on TV\/console systems where moving a virtual mouse is difficult. Will update io.MousePos and set io.WantSetMousePos=true. */
    get ConfigNavMoveSetMousePos(): boolean;
    set ConfigNavMoveSetMousePos(v: boolean);
    /** = true           \/\/ Sets io.WantCaptureKeyboard when io.NavActive is set. */
    get ConfigNavCaptureKeyboard(): boolean;
    set ConfigNavCaptureKeyboard(v: boolean);
    /** = true           \/\/ Pressing Escape can clear focused item + navigation id\/highlight. Set to false if you want to always keep highlight on. */
    get ConfigNavEscapeClearFocusItem(): boolean;
    set ConfigNavEscapeClearFocusItem(v: boolean);
    /** = false          \/\/ Pressing Escape can clear focused window as well (super set of io.ConfigNavEscapeClearFocusItem). */
    get ConfigNavEscapeClearFocusWindow(): boolean;
    set ConfigNavEscapeClearFocusWindow(v: boolean);
    /** = true           \/\/ Using directional navigation key makes the cursor visible. Mouse click hides the cursor. */
    get ConfigNavCursorVisibleAuto(): boolean;
    set ConfigNavCursorVisibleAuto(v: boolean);
    /** = false          \/\/ Navigation cursor is always visible. */
    get ConfigNavCursorVisibleAlways(): boolean;
    set ConfigNavCursorVisibleAlways(v: boolean);
    /** = false          \/\/ Simplified docking mode: disable window splitting, so docking is limited to merging multiple windows together into tab-bars. */
    get ConfigDockingNoSplit(): boolean;
    set ConfigDockingNoSplit(v: boolean);
    /** = false          \/\/ Enable docking with holding Shift key (reduce visual noise, allows dropping in wider space) */
    get ConfigDockingWithShift(): boolean;
    set ConfigDockingWithShift(v: boolean);
    /** = false          \/\/ [BETA] [FIXME: This currently creates regression with auto-sizing and general overhead] Make every single floating window display within a docking node. */
    get ConfigDockingAlwaysTabBar(): boolean;
    set ConfigDockingAlwaysTabBar(v: boolean);
    /** = false          \/\/ [BETA] Make window or viewport transparent when docking and only display docking boxes on the target viewport. Useful if rendering of multiple viewport cannot be synced. Best used with ConfigViewportsNoAutoMerge. */
    get ConfigDockingTransparentPayload(): boolean;
    set ConfigDockingTransparentPayload(v: boolean);
    /** = false;         \/\/ Set to make all floating imgui windows always create their own viewport. Otherwise, they are merged into the main host viewports when overlapping it. May also set ImGuiViewportFlags_NoAutoMerge on individual viewport. */
    get ConfigViewportsNoAutoMerge(): boolean;
    set ConfigViewportsNoAutoMerge(v: boolean);
    /** = false          \/\/ Disable default OS task bar icon flag for secondary viewports. When a viewport doesn't want a task bar icon, ImGuiViewportFlags_NoTaskBarIcon will be set on it. */
    get ConfigViewportsNoTaskBarIcon(): boolean;
    set ConfigViewportsNoTaskBarIcon(v: boolean);
    /** = true           \/\/ Disable default OS window decoration flag for secondary viewports. When a viewport doesn't want window decorations, ImGuiViewportFlags_NoDecoration will be set on it. Enabling decoration can create subsequent issues at OS levels (e.g. minimum window size). */
    get ConfigViewportsNoDecoration(): boolean;
    set ConfigViewportsNoDecoration(v: boolean);
    /** = false          \/\/ Disable default OS parenting to main viewport for secondary viewports. By default, viewports are marked with ParentViewportId = <main_viewport>, expecting the platform backend to setup a parent\/child relationship between the OS windows (some backend may ignore this). Set to true if you want the default to be 0, then all viewports will be top-level OS windows. */
    get ConfigViewportsNoDefaultParent(): boolean;
    set ConfigViewportsNoDefaultParent(v: boolean);
    /** = false          \/\/ [EXPERIMENTAL] Automatically overwrite style.FontScaleDpi when Monitor DPI changes. This will scale fonts but _NOT_ scale sizes\/padding for now. */
    get ConfigDpiScaleFonts(): boolean;
    set ConfigDpiScaleFonts(v: boolean);
    /** = false          \/\/ [EXPERIMENTAL] Scale Dear ImGui and Platform Windows when Monitor DPI changes. */
    get ConfigDpiScaleViewports(): boolean;
    set ConfigDpiScaleViewports(v: boolean);
    /** = false          \/\/ Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor). Cannot be easily renamed to 'io.ConfigXXX' because this is frequently used by backend implementations. */
    get MouseDrawCursor(): boolean;
    set MouseDrawCursor(v: boolean);
    /** = defined(__APPLE__) \/\/ Swap Cmd<>Ctrl keys + OS X style text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd\/Super instead of Ctrl, Line\/Text Start and End using Cmd+Arrows instead of Home\/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd\/Super instead of Ctrl. */
    get ConfigMacOSXBehaviors(): boolean;
    set ConfigMacOSXBehaviors(v: boolean);
    /** = true           \/\/ Enable input queue trickling: some types of events submitted during the same frame (e.g. button down + up) will be spread over multiple frames, improving interactions with low framerates. */
    get ConfigInputTrickleEventQueue(): boolean;
    set ConfigInputTrickleEventQueue(v: boolean);
    /** = true           \/\/ Enable blinking cursor (optional as some users consider it to be distracting). */
    get ConfigInputTextCursorBlink(): boolean;
    set ConfigInputTextCursorBlink(v: boolean);
    /** = false          \/\/ [BETA] Pressing Enter will keep item active and select contents (single-line only). */
    get ConfigInputTextEnterKeepActive(): boolean;
    set ConfigInputTextEnterKeepActive(v: boolean);
    /** = false          \/\/ [BETA] Enable turning DragXXX widgets into text input with a simple mouse click-release (without moving). Not desirable on devices without a keyboard. */
    get ConfigDragClickToInputText(): boolean;
    set ConfigDragClickToInputText(v: boolean);
    /** = true           \/\/ Enable resizing of windows from their edges and from the lower-left corner. This requires ImGuiBackendFlags_HasMouseCursors for better mouse cursor feedback. (This used to be a per-window ImGuiWindowFlags_ResizeFromAnySide flag) */
    get ConfigWindowsResizeFromEdges(): boolean;
    set ConfigWindowsResizeFromEdges(v: boolean);
    /** = false      \/\/ Enable allowing to move windows only when clicking on their title bar. Does not apply to windows without a title bar. */
    get ConfigWindowsMoveFromTitleBarOnly(): boolean;
    set ConfigWindowsMoveFromTitleBarOnly(v: boolean);
    /** = false      \/\/ [EXPERIMENTAL] CTRL+C copy the contents of focused window into the clipboard. Experimental because: (1) has known issues with nested Begin\/End pairs (2) text output quality varies (3) text output is in submission order rather than spatial order. */
    get ConfigWindowsCopyContentsWithCtrlC(): boolean;
    set ConfigWindowsCopyContentsWithCtrlC(v: boolean);
    /** = true           \/\/ Enable scrolling page by page when clicking outside the scrollbar grab. When disabled, always scroll to clicked location. When enabled, Shift+Click scrolls to clicked location. */
    get ConfigScrollbarScrollByPage(): boolean;
    set ConfigScrollbarScrollByPage(v: boolean);
    /** = 60.0f          \/\/ Timer (in seconds) to free transient windows\/tables memory buffers when unused. Set to -1.0f to disable. */
    get ConfigMemoryCompactTimer(): number;
    set ConfigMemoryCompactTimer(v: number);
    /** = 0.30f          \/\/ Time for a double-click, in seconds. */
    get MouseDoubleClickTime(): number;
    set MouseDoubleClickTime(v: number);
    /** = 6.0f           \/\/ Distance threshold to stay in to validate a double-click, in pixels. */
    get MouseDoubleClickMaxDist(): number;
    set MouseDoubleClickMaxDist(v: number);
    /** = 6.0f           \/\/ Distance threshold before considering we are dragging. */
    get MouseDragThreshold(): number;
    set MouseDragThreshold(v: number);
    /** = 0.275f         \/\/ When holding a key\/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.). */
    get KeyRepeatDelay(): number;
    set KeyRepeatDelay(v: number);
    /** = 0.050f         \/\/ When holding a key\/button, rate at which it repeats, in seconds. */
    get KeyRepeatRate(): number;
    set KeyRepeatRate(v: number);
    /** = true       \/\/ Enable error recovery support. Some errors won't be detected and lead to direct crashes if recovery is disabled. */
    get ConfigErrorRecovery(): boolean;
    set ConfigErrorRecovery(v: boolean);
    /** = true       \/\/ Enable asserts on recoverable error. By default call IM_ASSERT() when returning from a failing IM_ASSERT_USER_ERROR() */
    get ConfigErrorRecoveryEnableAssert(): boolean;
    set ConfigErrorRecoveryEnableAssert(v: boolean);
    /** = true       \/\/ Enable debug log output on recoverable errors. */
    get ConfigErrorRecoveryEnableDebugLog(): boolean;
    set ConfigErrorRecoveryEnableDebugLog(v: boolean);
    /** = true       \/\/ Enable tooltip on recoverable errors. The tooltip include a way to enable asserts if they were disabled. */
    get ConfigErrorRecoveryEnableTooltip(): boolean;
    set ConfigErrorRecoveryEnableTooltip(v: boolean);
    /** = false          \/\/ Enable various tools calling IM_DEBUG_BREAK(). */
    get ConfigDebugIsDebuggerPresent(): boolean;
    set ConfigDebugIsDebuggerPresent(v: boolean);
    /** = true           \/\/ Highlight and show an error message popup when multiple items have conflicting identifiers. */
    get ConfigDebugHighlightIdConflicts(): boolean;
    set ConfigDebugHighlightIdConflicts(v: boolean);
    /** true \/\/ Show "Item Picker" button in aforementioned popup. */
    get ConfigDebugHighlightIdConflictsShowItemPicker(): boolean;
    set ConfigDebugHighlightIdConflictsShowItemPicker(v: boolean);
    /** = false          \/\/ First-time calls to Begin()\/BeginChild() will return false. NEEDS TO BE SET AT APPLICATION BOOT TIME if you don't want to miss windows. */
    get ConfigDebugBeginReturnValueOnce(): boolean;
    set ConfigDebugBeginReturnValueOnce(v: boolean);
    /** = false          \/\/ Some calls to Begin()\/BeginChild() will return false. Will cycle through window depths then repeat. Suggested use: add "io.ConfigDebugBeginReturnValue = io.KeyShift" in your main loop then occasionally press SHIFT. Windows should be flickering while running. */
    get ConfigDebugBeginReturnValueLoop(): boolean;
    set ConfigDebugBeginReturnValueLoop(v: boolean);
    /** = false          \/\/ Ignore io.AddFocusEvent(false), consequently not calling io.ClearInputKeys()\/io.ClearInputMouse() in input processing. */
    get ConfigDebugIgnoreFocusLoss(): boolean;
    set ConfigDebugIgnoreFocusLoss(v: boolean);
    /** = false          \/\/ Save .ini data with extra comments (particularly helpful for Docking, but makes saving slower) */
    get ConfigDebugIniSettings(): boolean;
    set ConfigDebugIniSettings(v: boolean);
    /** Set when Dear ImGui will use mouse inputs, in this case do not dispatch them to your main game\/application (either way, always pass on mouse inputs to imgui). (e.g. unclicked mouse is hovering over an imgui window, widget is active, mouse was clicked over an imgui window, etc.). */
    get WantCaptureMouse(): boolean;
    set WantCaptureMouse(v: boolean);
    /** Set when Dear ImGui will use keyboard inputs, in this case do not dispatch them to your main game\/application (either way, always pass keyboard inputs to imgui). (e.g. InputText active, or an imgui window is focused and navigation is enabled, etc.). */
    get WantCaptureKeyboard(): boolean;
    set WantCaptureKeyboard(v: boolean);
    /** Mobile\/console: when set, you may display an on-screen keyboard. This is set by Dear ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active). */
    get WantTextInput(): boolean;
    set WantTextInput(v: boolean);
    /** MousePos has been altered, backend should reposition mouse on next frame. Rarely used! Set only when io.ConfigNavMoveSetMousePos is enabled. */
    get WantSetMousePos(): boolean;
    set WantSetMousePos(v: boolean);
    /** When manual .ini load\/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. Important: clear io.WantSaveIniSettings yourself after saving! */
    get WantSaveIniSettings(): boolean;
    set WantSaveIniSettings(v: boolean);
    /** Keyboard\/Gamepad navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag. */
    get NavActive(): boolean;
    set NavActive(v: boolean);
    /** Keyboard\/Gamepad navigation highlight is visible and allowed (will handle ImGuiKey_NavXXX events). */
    get NavVisible(): boolean;
    set NavVisible(v: boolean);
    /** Estimate of application framerate (rolling average over 60 frames, based on io.DeltaTime), in frame per second. Solely for convenience. Slow applications may not want to use a moving average or may want to reset underlying buffers occasionally. */
    get Framerate(): number;
    set Framerate(v: number);
    /** Vertices output during last call to Render() */
    get MetricsRenderVertices(): number;
    set MetricsRenderVertices(v: number);
    /** Indices output during last call to Render() = number of triangles * 3 */
    get MetricsRenderIndices(): number;
    set MetricsRenderIndices(v: number);
    /** Number of visible windows */
    get MetricsRenderWindows(): number;
    set MetricsRenderWindows(v: number);
    /** Number of active windows */
    get MetricsActiveWindows(): number;
    set MetricsActiveWindows(v: number);
    /** Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing\/reappearing mouse won't have a huge delta. */
    get MouseDelta(): ImVec2;
    set MouseDelta(v: ImVec2);
    /** Parent UI context (needs to be set explicitly by parent). */
    get Ctx(): ImGuiContext;
    set Ctx(v: ImGuiContext);
    /** Mouse position, in pixels. Set to ImVec2(-FLT_MAX, -FLT_MAX) if mouse is unavailable (on another screen, etc.) */
    get MousePos(): ImVec2;
    set MousePos(v: ImVec2);
    /** Mouse wheel Vertical: 1 unit scrolls about 5 lines text. >0 scrolls Up, <0 scrolls Down. Hold SHIFT to turn vertical scroll into horizontal scroll. */
    get MouseWheel(): number;
    set MouseWheel(v: number);
    /** Mouse wheel Horizontal. >0 scrolls Left, <0 scrolls Right. Most users don't have a mouse with a horizontal wheel, may not be filled by all backends. */
    get MouseWheelH(): number;
    set MouseWheelH(v: number);
    /** Mouse actual input peripheral (Mouse\/TouchScreen\/Pen). */
    get MouseSource(): ImGuiMouseSource;
    set MouseSource(v: ImGuiMouseSource);
    /** (Optional) Modify using io.AddMouseViewportEvent(). With multi-viewports: viewport the OS mouse is hovering. If possible _IGNORING_ viewports with the ImGuiViewportFlags_NoInputs flag is much better (few backends can handle that). Set io.BackendFlags |= ImGuiBackendFlags_HasMouseHoveredViewport if you can provide this info. If you don't imgui will infer the value using the rectangles and last focused time of the viewports it knows about (ignoring other OS windows). */
    get MouseHoveredViewport(): ImGuiID;
    set MouseHoveredViewport(v: ImGuiID);
    /** Keyboard modifier down: Control */
    get KeyCtrl(): boolean;
    set KeyCtrl(v: boolean);
    /** Keyboard modifier down: Shift */
    get KeyShift(): boolean;
    set KeyShift(v: boolean);
    /** Keyboard modifier down: Alt */
    get KeyAlt(): boolean;
    set KeyAlt(v: boolean);
    /** Keyboard modifier down: Cmd\/Super\/Windows */
    get KeySuper(): boolean;
    set KeySuper(v: boolean);
    /** Key mods flags (any of ImGuiMod_Ctrl\/ImGuiMod_Shift\/ImGuiMod_Alt\/ImGuiMod_Super flags, same as io.KeyCtrl\/KeyShift\/KeyAlt\/KeySuper but merged into flags. Read-only, updated by NewFrame() */
    get KeyMods(): ImGuiKeyChord;
    set KeyMods(v: ImGuiKeyChord);
    /** Alternative to WantCaptureMouse: (WantCaptureMouse == true && WantCaptureMouseUnlessPopupClose == false) when a click over void is expected to close a popup. */
    get WantCaptureMouseUnlessPopupClose(): boolean;
    set WantCaptureMouseUnlessPopupClose(v: boolean);
    /** Previous mouse position (note that MouseDelta is not necessary == MousePos-MousePosPrev, in case either position is invalid) */
    get MousePosPrev(): ImVec2;
    set MousePosPrev(v: ImVec2);
    /** Queue a new key down\/up event. Key should be "translated" (as in, generally ImGuiKey_A matches the key end-user would use to emit an 'A' character) */
    AddKeyEvent(key: ImGuiKey, down: boolean): void;
    /** Queue a new key down\/up event for analog values (e.g. ImGuiKey_Gamepad_ values). Dead-zones should be handled by the backend. */
    AddKeyAnalogEvent(key: ImGuiKey, down: boolean, v: number): void;
    /** Queue a mouse position update. Use -FLT_MAX,-FLT_MAX to signify no mouse (e.g. app not focused and not hovered) */
    AddMousePosEvent(x: number, y: number): void;
    /** Queue a mouse button change */
    AddMouseButtonEvent(button: number, down: boolean): void;
    /** Queue a mouse wheel update. wheel_y<0: scroll down, wheel_y>0: scroll up, wheel_x<0: scroll right, wheel_x>0: scroll left. */
    AddMouseWheelEvent(wheel_x: number, wheel_y: number): void;
    /** Queue a mouse source change (Mouse\/TouchScreen\/Pen) */
    AddMouseSourceEvent(source: ImGuiMouseSource): void;
    /** Queue a mouse hovered viewport. Requires backend to set ImGuiBackendFlags_HasMouseHoveredViewport to call this (for multi-viewport support). */
    AddMouseViewportEvent(id: ImGuiID): void;
    /** Queue a gain\/loss of focus for the application (generally based on OS\/platform focus of your window) */
    AddFocusEvent(focused: boolean): void;
    /** Queue a new character input */
    AddInputCharacter(c: number): void;
    /** Queue a new character input from a UTF-16 character, it can be a surrogate */
    AddInputCharacterUTF16(c: ImWchar16): void;
    /** Queue a new characters input from a UTF-8 string */
    AddInputCharactersUTF8(str: string): void;
    /** Set master flag for accepting key\/mouse\/text events (default to true). Useful if you have native dialog boxes that are interrupting your application loop\/refresh, and you want to disable events being queued while your app is frozen. */
    SetAppAcceptingEvents(accepting_events: boolean): void;
    /** Clear all incoming events. */
    ClearEventsQueue(): void;
    /** Clear current keyboard\/gamepad state + current frame text input buffer. Equivalent to releasing all keys\/buttons. */
    ClearInputKeys(): void;
    /** Clear current mouse state. */
    ClearInputMouse(): void;
}
/** Main IO structure returned by BeginMultiSelect()\/EndMultiSelect(). */
export declare class ImGuiMultiSelectIO extends StructBinding {
    constructor();
}
/** Draw command list */
export declare class ImDrawList extends StructBinding {
    constructor();
}
/** All draw data to render a Dear ImGui frame */
export declare class ImDrawData extends StructBinding {
    constructor();
}
/** A font input\/source (we may rename this to ImFontSource in the future) */
export declare class ImFontConfig extends StructBinding {
    constructor();
}
/** Load and rasterize multiple TTF\/OTF fonts into a same texture. The font atlas will build a single texture holding: */
export declare class ImFontAtlas extends StructBinding {
    constructor();
}
/** Font runtime data for a given size */
export declare class ImFontBaked extends StructBinding {
    constructor();
}
/** Font runtime data and rendering */
export declare class ImFont extends StructBinding {
    constructor();
}
export declare const ImGui: Readonly<{
    /** Flags for ImGui::Begin() */
    WindowFlags: {
        None: number;
        /** Disable title-bar */
        NoTitleBar: number;
        /** Disable user resizing with the lower-right grip */
        NoResize: number;
        /** Disable user moving the window */
        NoMove: number;
        /** Disable scrollbars (window can still scroll with mouse or programmatically) */
        NoScrollbar: number;
        /** Disable user vertically scrolling with mouse wheel. On child window, mouse wheel will be forwarded to the parent unless NoScrollbar is also set. */
        NoScrollWithMouse: number;
        /** Disable user collapsing window by double-clicking on it. Also referred to as Window Menu Button (e.g. within a docking node). */
        NoCollapse: number;
        /** Resize every window to its content every frame */
        AlwaysAutoResize: number;
        /** Disable drawing background color (WindowBg, etc.) and outside border. Similar as using SetNextWindowBgAlpha(0.0f). */
        NoBackground: number;
        /** Never load\/save settings in .ini file */
        NoSavedSettings: number;
        /** Disable catching mouse, hovering test with pass through. */
        NoMouseInputs: number;
        /** Has a menu-bar */
        MenuBar: number;
        /** Allow horizontal scrollbar to appear (off by default). You may use SetNextWindowContentSize(ImVec2(width,0.0f)); prior to calling Begin() to specify width. Read code in imgui_demo in the "Horizontal Scrolling" section. */
        HorizontalScrollbar: number;
        /** Disable taking focus when transitioning from hidden to visible state */
        NoFocusOnAppearing: number;
        /** Disable bringing window to front when taking focus (e.g. clicking on it or programmatically giving it focus) */
        NoBringToFrontOnFocus: number;
        /** Always show vertical scrollbar (even if ContentSize.y < Size.y) */
        AlwaysVerticalScrollbar: number;
        /** Always show horizontal scrollbar (even if ContentSize.x < Size.x) */
        AlwaysHorizontalScrollbar: number;
        /** No keyboard\/gamepad navigation within the window */
        NoNavInputs: number;
        /** No focusing toward this window with keyboard\/gamepad navigation (e.g. skipped by CTRL+TAB) */
        NoNavFocus: number;
        /** Display a dot next to the title. When used in a tab\/docking context, tab is selected when clicking the X + closure is not assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar. */
        UnsavedDocument: number;
        /** Disable docking of this window */
        NoDocking: number;
        NoNav: number;
        NoDecoration: number;
        NoInputs: number;
    };
    /** Flags for ImGui::BeginChild() */
    ChildFlags: {
        None: number;
        /** Show an outer border and enable WindowPadding. (IMPORTANT: this is always == 1 == true for legacy reason) */
        Borders: number;
        /** Pad with style.WindowPadding even if no border are drawn (no padding by default for non-bordered child windows because it makes more sense) */
        AlwaysUseWindowPadding: number;
        /** Allow resize from right border (layout direction). Enable .ini saving (unless ImGuiWindowFlags_NoSavedSettings passed to window flags) */
        ResizeX: number;
        /** Allow resize from bottom border (layout direction). " */
        ResizeY: number;
        /** Enable auto-resizing width. Read "IMPORTANT: Size measurement" details above. */
        AutoResizeX: number;
        /** Enable auto-resizing height. Read "IMPORTANT: Size measurement" details above. */
        AutoResizeY: number;
        /** Combined with AutoResizeX\/AutoResizeY. Always measure size even when child is hidden, always return true, always disable clipping optimization! NOT RECOMMENDED. */
        AlwaysAutoResize: number;
        /** Style the child window like a framed item: use FrameBg, FrameRounding, FrameBorderSize, FramePadding instead of ChildBg, ChildRounding, ChildBorderSize, WindowPadding. */
        FrameStyle: number;
        /** [BETA] Share focus scope, allow keyboard\/gamepad navigation to cross over parent border to this child or between sibling child windows. */
        NavFlattened: number;
    };
    /** Flags for ImGui::PushItemFlag() */
    ItemFlags: {
        /** (Default) */
        None: number;
        /** false    \/\/ Disable keyboard tabbing. This is a "lighter" version of ImGuiItemFlags_NoNav. */
        NoTabStop: number;
        /** false    \/\/ Disable any form of focusing (keyboard\/gamepad directional navigation and SetKeyboardFocusHere() calls). */
        NoNav: number;
        /** false    \/\/ Disable item being a candidate for default focus (e.g. used by title bar items). */
        NoNavDefaultFocus: number;
        /** false    \/\/ Any button-like behavior will have repeat mode enabled (based on io.KeyRepeatDelay and io.KeyRepeatRate values). Note that you can also call IsItemActive() after any button to tell if it is being held. */
        ButtonRepeat: number;
        /** true     \/\/ MenuItem()\/Selectable() automatically close their parent popup window. */
        AutoClosePopups: number;
        /** false    \/\/ Allow submitting an item with the same identifier as an item already submitted this frame without triggering a warning tooltip if io.ConfigDebugHighlightIdConflicts is set. */
        AllowDuplicateId: number;
    };
    /** Flags for ImGui::InputText() */
    InputTextFlags: {
        None: number;
        /** Allow 0123456789.+-*\/ */
        CharsDecimal: number;
        /** Allow 0123456789ABCDEFabcdef */
        CharsHexadecimal: number;
        /** Allow 0123456789.+-*\/eE (Scientific notation input) */
        CharsScientific: number;
        /** Turn a..z into A..Z */
        CharsUppercase: number;
        /** Filter out spaces, tabs */
        CharsNoBlank: number;
        /** Pressing TAB input a '\t' character into the text field */
        AllowTabInput: number;
        /** Return 'true' when Enter is pressed (as opposed to every time the value was modified). Consider using IsItemDeactivatedAfterEdit() instead! */
        EnterReturnsTrue: number;
        /** Escape key clears content if not empty, and deactivate otherwise (contrast to default behavior of Escape to revert) */
        EscapeClearsAll: number;
        /** In multi-line mode, validate with Enter, add new line with Ctrl+Enter (default is opposite: validate with Ctrl+Enter, add line with Enter). */
        CtrlEnterForNewLine: number;
        /** Read-only mode */
        ReadOnly: number;
        /** Password mode, display all characters as '*', disable copy */
        Password: number;
        /** Overwrite mode */
        AlwaysOverwrite: number;
        /** Select entire text when first taking mouse focus */
        AutoSelectAll: number;
        /** InputFloat(), InputInt(), InputScalar() etc. only: parse empty string as zero value. */
        ParseEmptyRefVal: number;
        /** InputFloat(), InputInt(), InputScalar() etc. only: when value is zero, do not display it. Generally used with ImGuiInputTextFlags_ParseEmptyRefVal. */
        DisplayEmptyRefVal: number;
        /** Disable following the cursor horizontally */
        NoHorizontalScroll: number;
        /** Disable undo\/redo. Note that input text owns the text data while active, if you want to provide your own undo\/redo stack you need e.g. to call ClearActiveID(). */
        NoUndoRedo: number;
        /** When text doesn't fit, elide left side to ensure right side stays visible. Useful for path\/filenames. Single-line only! */
        ElideLeft: number;
        /** Callback on pressing TAB (for completion handling) */
        CallbackCompletion: number;
        /** Callback on pressing Up\/Down arrows (for history handling) */
        CallbackHistory: number;
        /** Callback on each iteration. User code may query cursor position, modify text buffer. */
        CallbackAlways: number;
        /** Callback on character inputs to replace or discard them. Modify 'EventChar' to replace or discard, or return 1 in callback to discard. */
        CallbackCharFilter: number;
        /** Callback on buffer capacity changes request (beyond 'buf_size' parameter value), allowing the string to grow. Notify when the string wants to be resized (for string types which hold a cache of their Size). You will be provided a new BufSize in the callback and NEED to honor it. (see misc\/cpp\/imgui_stdlib.h for an example of using this) */
        CallbackResize: number;
        /** Callback on any edit. Note that InputText() already returns true on edit + you can always use IsItemEdited(). The callback is useful to manipulate the underlying buffer while focus is active. */
        CallbackEdit: number;
    };
    /** Flags for ImGui::TreeNodeEx(), ImGui::CollapsingHeader*() */
    TreeNodeFlags: {
        None: number;
        /** Draw as selected */
        Selected: number;
        /** Draw frame with background (e.g. for CollapsingHeader) */
        Framed: number;
        /** Hit testing to allow subsequent widgets to overlap this one */
        AllowOverlap: number;
        /** Don't do a TreePush() when open (e.g. for CollapsingHeader) = no extra indent nor pushing on ID stack */
        NoTreePushOnOpen: number;
        /** Don't automatically and temporarily open node when Logging is active (by default logging will automatically open tree nodes) */
        NoAutoOpenOnLog: number;
        /** Default node to be open */
        DefaultOpen: number;
        /** Open on double-click instead of simple click (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined. */
        OpenOnDoubleClick: number;
        /** Open when clicking on the arrow part (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined. */
        OpenOnArrow: number;
        /** No collapsing, no arrow (use as a convenience for leaf nodes). */
        Leaf: number;
        /** Display a bullet instead of arrow. IMPORTANT: node can still be marked open\/close if you don't set the _Leaf flag! */
        Bullet: number;
        /** Use FramePadding (even for an unframed text node) to vertically align text baseline to regular widget height. Equivalent to calling AlignTextToFramePadding() before the node. */
        FramePadding: number;
        /** Extend hit box to the right-most edge, even if not framed. This is not the default in order to allow adding other items on the same line without using AllowOverlap mode. */
        SpanAvailWidth: number;
        /** Extend hit box to the left-most and right-most edges (cover the indent area). */
        SpanFullWidth: number;
        /** Narrow hit box + narrow hovering highlight, will only cover the label text. */
        SpanLabelWidth: number;
        /** Frame will span all columns of its container table (label will still fit in current column) */
        SpanAllColumns: number;
        /** Label will span all columns of its container table */
        LabelSpanAllColumns: number;
        /** Nav: left arrow moves back to parent. This is processed in TreePop() when there's an unfullfilled Left nav request remaining. */
        NavLeftJumpsToParent: number;
        CollapsingHeader: number;
        /** No lines drawn */
        DrawLinesNone: number;
        /** Horizontal lines to child nodes. Vertical line drawn down to TreePop() position: cover full contents. Faster (for large trees). */
        DrawLinesFull: number;
        /** Horizontal lines to child nodes. Vertical line drawn down to bottom-most child node. Slower (for large trees). */
        DrawLinesToNodes: number;
    };
    /** Flags for OpenPopup*(), BeginPopupContext*(), IsPopupOpen() functions. */
    PopupFlags: {
        None: number;
        /** For BeginPopupContext*(): open on Left Mouse release. Guaranteed to always be == 0 (same as ImGuiMouseButton_Left) */
        MouseButtonLeft: number;
        /** For BeginPopupContext*(): open on Right Mouse release. Guaranteed to always be == 1 (same as ImGuiMouseButton_Right) */
        MouseButtonRight: number;
        /** For BeginPopupContext*(): open on Middle Mouse release. Guaranteed to always be == 2 (same as ImGuiMouseButton_Middle) */
        MouseButtonMiddle: number;
        /** For OpenPopup*(), BeginPopupContext*(): don't reopen same popup if already open (won't reposition, won't reinitialize navigation) */
        NoReopen: number;
        /** For OpenPopup*(), BeginPopupContext*(): don't open if there's already a popup at the same level of the popup stack */
        NoOpenOverExistingPopup: number;
        /** For BeginPopupContextWindow(): don't return true when hovering items, only when hovering empty space */
        NoOpenOverItems: number;
        /** For IsPopupOpen(): ignore the ImGuiID parameter and test for any popup. */
        AnyPopupId: number;
        /** For IsPopupOpen(): search\/test at any level of the popup stack (default test in the current level) */
        AnyPopupLevel: number;
        AnyPopup: number;
    };
    /** Flags for ImGui::Selectable() */
    SelectableFlags: {
        None: number;
        /** Clicking this doesn't close parent popup window (overrides ImGuiItemFlags_AutoClosePopups) */
        NoAutoClosePopups: number;
        /** Frame will span all columns of its container table (text will still fit in current column) */
        SpanAllColumns: number;
        /** Generate press events on double clicks too */
        AllowDoubleClick: number;
        /** Cannot be selected, display grayed out text */
        Disabled: number;
        /** (WIP) Hit testing to allow subsequent widgets to overlap this one */
        AllowOverlap: number;
        /** Make the item be displayed as if it is hovered */
        Highlight: number;
    };
    /** Flags for ImGui::BeginCombo() */
    ComboFlags: {
        None: number;
        /** Align the popup toward the left by default */
        PopupAlignLeft: number;
        /** Max ~4 items visible. Tip: If you want your combo popup to be a specific size you can use SetNextWindowSizeConstraints() prior to calling BeginCombo() */
        HeightSmall: number;
        /** Max ~8 items visible (default) */
        HeightRegular: number;
        /** Max ~20 items visible */
        HeightLarge: number;
        /** As many fitting items as possible */
        HeightLargest: number;
        /** Display on the preview box without the square arrow button */
        NoArrowButton: number;
        /** Display only a square arrow button */
        NoPreview: number;
        /** Width dynamically calculated from preview contents */
        WidthFitPreview: number;
    };
    /** Flags for ImGui::BeginTabBar() */
    TabBarFlags: {
        None: number;
        /** Allow manually dragging tabs to re-order them + New tabs are appended at the end of list */
        Reorderable: number;
        /** Automatically select new tabs when they appear */
        AutoSelectNewTabs: number;
        /** Disable buttons to open the tab list popup */
        TabListPopupButton: number;
        /** Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false. */
        NoCloseWithMiddleMouseButton: number;
        /** Disable scrolling buttons (apply when fitting policy is ImGuiTabBarFlags_FittingPolicyScroll) */
        NoTabListScrollingButtons: number;
        /** Disable tooltips when hovering a tab */
        NoTooltip: number;
        /** Draw selected overline markers over selected tab */
        DrawSelectedOverline: number;
        /** Resize tabs when they don't fit */
        FittingPolicyResizeDown: number;
        /** Add scroll buttons when tabs don't fit */
        FittingPolicyScroll: number;
    };
    /** Flags for ImGui::BeginTabItem() */
    TabItemFlags: {
        None: number;
        /** Display a dot next to the title + set ImGuiTabItemFlags_NoAssumedClosure. */
        UnsavedDocument: number;
        /** Trigger flag to programmatically make the tab selected when calling BeginTabItem() */
        SetSelected: number;
        /** Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false. */
        NoCloseWithMiddleMouseButton: number;
        /** Don't call PushID()\/PopID() on BeginTabItem()\/EndTabItem() */
        NoPushId: number;
        /** Disable tooltip for the given tab */
        NoTooltip: number;
        /** Disable reordering this tab or having another tab cross over this tab */
        NoReorder: number;
        /** Enforce the tab position to the left of the tab bar (after the tab list popup button) */
        Leading: number;
        /** Enforce the tab position to the right of the tab bar (before the scrolling buttons) */
        Trailing: number;
        /** Tab is selected when trying to close + closure is not immediately assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar. */
        NoAssumedClosure: number;
    };
    /** Flags for ImGui::IsWindowFocused() */
    FocusedFlags: {
        None: number;
        /** Return true if any children of the window is focused */
        ChildWindows: number;
        /** Test from root window (top most parent of the current hierarchy) */
        RootWindow: number;
        /** Return true if any window is focused. Important: If you are trying to tell how to dispatch your low-level inputs, do NOT use this. Use 'io.WantCaptureMouse' instead! Please read the FAQ! */
        AnyWindow: number;
        /** Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow) */
        NoPopupHierarchy: number;
        /** Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow) */
        DockHierarchy: number;
        RootAndChildWindows: number;
    };
    /** Flags for ImGui::IsItemHovered(), ImGui::IsWindowHovered() */
    HoveredFlags: {
        /** Return true if directly over the item\/window, not obstructed by another window, not obstructed by an active popup or modal blocking inputs under them. */
        None: number;
        /** IsWindowHovered() only: Return true if any children of the window is hovered */
        ChildWindows: number;
        /** IsWindowHovered() only: Test from root window (top most parent of the current hierarchy) */
        RootWindow: number;
        /** IsWindowHovered() only: Return true if any window is hovered */
        AnyWindow: number;
        /** IsWindowHovered() only: Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow) */
        NoPopupHierarchy: number;
        /** IsWindowHovered() only: Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow) */
        DockHierarchy: number;
        /** Return true even if a popup window is normally blocking access to this item\/window */
        AllowWhenBlockedByPopup: number;
        /** Return true even if an active item is blocking access to this item\/window. Useful for Drag and Drop patterns. */
        AllowWhenBlockedByActiveItem: number;
        /** IsItemHovered() only: Return true even if the item uses AllowOverlap mode and is overlapped by another hoverable item. */
        AllowWhenOverlappedByItem: number;
        /** IsItemHovered() only: Return true even if the position is obstructed or overlapped by another window. */
        AllowWhenOverlappedByWindow: number;
        /** IsItemHovered() only: Return true even if the item is disabled */
        AllowWhenDisabled: number;
        /** IsItemHovered() only: Disable using keyboard\/gamepad navigation state when active, always query mouse */
        NoNavOverride: number;
        AllowWhenOverlapped: number;
        RectOnly: number;
        RootAndChildWindows: number;
        /** Shortcut for standard flags when using IsItemHovered() + SetTooltip() sequence. */
        ForTooltip: number;
        /** Require mouse to be stationary for style.HoverStationaryDelay (~0.15 sec) _at least one time_. After this, can move on same item\/window. Using the stationary test tends to reduces the need for a long delay. */
        Stationary: number;
        /** IsItemHovered() only: Return true immediately (default). As this is the default you generally ignore this. */
        DelayNone: number;
        /** IsItemHovered() only: Return true after style.HoverDelayShort elapsed (~0.15 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item). */
        DelayShort: number;
        /** IsItemHovered() only: Return true after style.HoverDelayNormal elapsed (~0.40 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item). */
        DelayNormal: number;
        /** IsItemHovered() only: Disable shared delay system where moving from one item to the next keeps the previous timer for a short time (standard for tooltips with long delays) */
        NoSharedDelay: number;
    };
    /** Flags for ImGui::DockSpace(), shared\/inherited by child nodes. */
    DockNodeFlags: {
        None: number;
        /**       \/\/ Don't display the dockspace node but keep it alive. Windows docked into this dockspace node won't be undocked. */
        KeepAliveOnly: number;
        /**       \/\/ Disable docking over the Central Node, which will be always kept empty. */
        NoDockingOverCentralNode: number;
        /**       \/\/ Enable passthru dockspace: 1) DockSpace() will render a ImGuiCol_WindowBg background covering everything excepted the Central Node when empty. Meaning the host window should probably use SetNextWindowBgAlpha(0.0f) prior to Begin() when using this. 2) When Central Node is empty: let inputs pass-through + won't display a DockingEmptyBg background. See demo for details. */
        PassthruCentralNode: number;
        /**       \/\/ Disable other windows\/nodes from splitting this node. */
        NoDockingSplit: number;
        /** Saved \/\/ Disable resizing node using the splitter\/separators. Useful with programmatically setup dockspaces. */
        NoResize: number;
        /**       \/\/ Tab bar will automatically hide when there is a single window in the dock node. */
        AutoHideTabBar: number;
        /**       \/\/ Disable undocking this node. */
        NoUndocking: number;
    };
    /** Flags for ImGui::BeginDragDropSource(), ImGui::AcceptDragDropPayload() */
    DragDropFlags: {
        None: number;
        /** Disable preview tooltip. By default, a successful call to BeginDragDropSource opens a tooltip so you can display a preview or description of the source contents. This flag disables this behavior. */
        SourceNoPreviewTooltip: number;
        /** By default, when dragging we clear data so that IsItemHovered() will return false, to avoid subsequent user code submitting tooltips. This flag disables this behavior so you can still call IsItemHovered() on the source item. */
        SourceNoDisableHover: number;
        /** Disable the behavior that allows to open tree nodes and collapsing header by holding over them while dragging a source item. */
        SourceNoHoldToOpenOthers: number;
        /** Allow items such as Text(), Image() that have no unique identifier to be used as drag source, by manufacturing a temporary identifier based on their window-relative position. This is extremely unusual within the dear imgui ecosystem and so we made it explicit. */
        SourceAllowNullID: number;
        /** External source (from outside of dear imgui), won't attempt to read current item\/window info. Will always return true. Only one Extern source can be active simultaneously. */
        SourceExtern: number;
        /** Automatically expire the payload if the source cease to be submitted (otherwise payloads are persisting while being dragged) */
        PayloadAutoExpire: number;
        /** Hint to specify that the payload may not be copied outside current dear imgui context. */
        PayloadNoCrossContext: number;
        /** Hint to specify that the payload may not be copied outside current process. */
        PayloadNoCrossProcess: number;
        /** AcceptDragDropPayload() will returns true even before the mouse button is released. You can then call IsDelivery() to test if the payload needs to be delivered. */
        AcceptBeforeDelivery: number;
        /** Do not draw the default highlight rectangle when hovering over target. */
        AcceptNoDrawDefaultRect: number;
        /** Request hiding the BeginDragDropSource tooltip from the BeginDragDropTarget site. */
        AcceptNoPreviewTooltip: number;
        /** For peeking ahead and inspecting the payload before delivery. */
        AcceptPeekOnly: number;
    };
    /** A primary data type */
    DataType: {
        /** signed char \/ char (with sensible compilers) */
        S8: number;
        /** unsigned char */
        U8: number;
        /** short */
        S16: number;
        /** unsigned short */
        U16: number;
        /** int */
        S32: number;
        /** unsigned int */
        U32: number;
        /** long long \/ __int64 */
        S64: number;
        /** unsigned long long \/ unsigned __int64 */
        U64: number;
        /** float */
        Float: number;
        /** double */
        Double: number;
        /** bool (provided for user convenience, not supported by scalar widgets) */
        Bool: number;
        /** char* (provided for user convenience, not supported by scalar widgets) */
        String: number;
        COUNT: number;
    };
    /** A cardinal direction */
    Dir: {
        _None: number;
        _Left: number;
        _Right: number;
        _Up: number;
        _Down: number;
        _COUNT: number;
    };
    /** A sorting direction */
    SortDirection: {
        _None: number;
        /** Ascending = 0->9, A->Z etc. */
        _Ascending: number;
        /** Descending = 9->0, Z->A etc. */
        _Descending: number;
    };
    /** A key identifier (ImGuiKey_XXX or ImGuiMod_XXX value): can represent Keyboard, Mouse and Gamepad values. */
    Key: {
        _None: number;
        /** First valid key value (other than 0) */
        _NamedKey_BEGIN: number;
        /** == ImGuiKey_NamedKey_BEGIN */
        _Tab: number;
        _LeftArrow: number;
        _RightArrow: number;
        _UpArrow: number;
        _DownArrow: number;
        _PageUp: number;
        _PageDown: number;
        _Home: number;
        _End: number;
        _Insert: number;
        _Delete: number;
        _Backspace: number;
        _Space: number;
        _Enter: number;
        _Escape: number;
        _LeftCtrl: number;
        _LeftShift: number;
        _LeftAlt: number;
        /** Also see ImGuiMod_Ctrl, ImGuiMod_Shift, ImGuiMod_Alt, ImGuiMod_Super below! */
        _LeftSuper: number;
        _RightCtrl: number;
        _RightShift: number;
        _RightAlt: number;
        _RightSuper: number;
        _Menu: number;
        _0: number;
        _1: number;
        _2: number;
        _3: number;
        _4: number;
        _5: number;
        _6: number;
        _7: number;
        _8: number;
        _9: number;
        _A: number;
        _B: number;
        _C: number;
        _D: number;
        _E: number;
        _F: number;
        _G: number;
        _H: number;
        _I: number;
        _J: number;
        _K: number;
        _L: number;
        _M: number;
        _N: number;
        _O: number;
        _P: number;
        _Q: number;
        _R: number;
        _S: number;
        _T: number;
        _U: number;
        _V: number;
        _W: number;
        _X: number;
        _Y: number;
        _Z: number;
        _F1: number;
        _F2: number;
        _F3: number;
        _F4: number;
        _F5: number;
        _F6: number;
        _F7: number;
        _F8: number;
        _F9: number;
        _F10: number;
        _F11: number;
        _F12: number;
        _F13: number;
        _F14: number;
        _F15: number;
        _F16: number;
        _F17: number;
        _F18: number;
        _F19: number;
        _F20: number;
        _F21: number;
        _F22: number;
        _F23: number;
        _F24: number;
        /** ' */
        _Apostrophe: number;
        /** , */
        _Comma: number;
        /** - */
        _Minus: number;
        /** . */
        _Period: number;
        /** \/ */
        _Slash: number;
        /** ; */
        _Semicolon: number;
        /** = */
        _Equal: number;
        /** [ */
        _LeftBracket: number;
        /** \ (this text inhibit multiline comment caused by backslash) */
        _Backslash: number;
        /** ] */
        _RightBracket: number;
        /** ` */
        _GraveAccent: number;
        _CapsLock: number;
        _ScrollLock: number;
        _NumLock: number;
        _PrintScreen: number;
        _Pause: number;
        _Keypad0: number;
        _Keypad1: number;
        _Keypad2: number;
        _Keypad3: number;
        _Keypad4: number;
        _Keypad5: number;
        _Keypad6: number;
        _Keypad7: number;
        _Keypad8: number;
        _Keypad9: number;
        _KeypadDecimal: number;
        _KeypadDivide: number;
        _KeypadMultiply: number;
        _KeypadSubtract: number;
        _KeypadAdd: number;
        _KeypadEnter: number;
        _KeypadEqual: number;
        /** Available on some keyboard\/mouses. Often referred as "Browser Back" */
        _AppBack: number;
        _AppForward: number;
        /** Non-US backslash. */
        _Oem102: number;
        /** Menu        | +       | Options  | */
        _GamepadStart: number;
        /** View        | -       | Share    | */
        _GamepadBack: number;
        /** X           | Y       | Square   | Tap: Toggle Menu. Hold: Windowing mode (Focus\/Move\/Resize windows) */
        _GamepadFaceLeft: number;
        /** B           | A       | Circle   | Cancel \/ Close \/ Exit */
        _GamepadFaceRight: number;
        /** Y           | X       | Triangle | Text Input \/ On-screen Keyboard */
        _GamepadFaceUp: number;
        /** A           | B       | Cross    | Activate \/ Open \/ Toggle \/ Tweak */
        _GamepadFaceDown: number;
        /** D-pad Left  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadLeft: number;
        /** D-pad Right | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadRight: number;
        /** D-pad Up    | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadUp: number;
        /** D-pad Down  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadDown: number;
        /** L Bumper    | L       | L1       | Tweak Slower \/ Focus Previous (in Windowing mode) */
        _GamepadL1: number;
        /** R Bumper    | R       | R1       | Tweak Faster \/ Focus Next (in Windowing mode) */
        _GamepadR1: number;
        /** L Trigger   | ZL      | L2       | [Analog] */
        _GamepadL2: number;
        /** R Trigger   | ZR      | R2       | [Analog] */
        _GamepadR2: number;
        /** L Stick     | L3      | L3       | */
        _GamepadL3: number;
        /** R Stick     | R3      | R3       | */
        _GamepadR3: number;
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickLeft: number;
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickRight: number;
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickUp: number;
        /**             |         |          | [Analog] Move Window (in Windowing mode) */
        _GamepadLStickDown: number;
        /**             |         |          | [Analog] */
        _GamepadRStickLeft: number;
        /**             |         |          | [Analog] */
        _GamepadRStickRight: number;
        /**             |         |          | [Analog] */
        _GamepadRStickUp: number;
        /**             |         |          | [Analog] */
        _GamepadRStickDown: number;
        _MouseLeft: number;
        _MouseRight: number;
        _MouseMiddle: number;
        _MouseX1: number;
        _MouseX2: number;
        _MouseWheelX: number;
        _MouseWheelY: number;
        ImGuiMod_None: number;
        /** Ctrl (non-macOS), Cmd (macOS) */
        ImGuiMod_Ctrl: number;
        /** Shift */
        ImGuiMod_Shift: number;
        /** Option\/Menu */
        ImGuiMod_Alt: number;
        /** Windows\/Super (non-macOS), Ctrl (macOS) */
        ImGuiMod_Super: number;
    };
    /** Flags for Shortcut(), SetNextItemShortcut(), */
    InputFlags: {
        None: number;
        /** Enable repeat. Return true on successive repeats. Default for legacy IsKeyPressed(). NOT Default for legacy IsMouseClicked(). MUST BE == 1. */
        Repeat: number;
        /** Route to active item only. */
        RouteActive: number;
        /** Route to windows in the focus stack (DEFAULT). Deep-most focused window takes inputs. Active item takes inputs over deep-most focused window. */
        RouteFocused: number;
        /** Global route (unless a focused window or active item registered the route). */
        RouteGlobal: number;
        /** Do not register route, poll keys directly. */
        RouteAlways: number;
        /** Option: global route: higher priority than focused route (unless active item in focused route). */
        RouteOverFocused: number;
        /** Option: global route: higher priority than active item. Unlikely you need to use that: will interfere with every active items, e.g. CTRL+A registered by InputText will be overridden by this. May not be fully honored as user\/internal code is likely to always assume they can access keys when active. */
        RouteOverActive: number;
        /** Option: global route: will not be applied if underlying background\/void is focused (== no Dear ImGui windows are focused). Useful for overlay applications. */
        RouteUnlessBgFocused: number;
        /** Option: route evaluated from the point of view of root window rather than current window. */
        RouteFromRootWindow: number;
        /** Automatically display a tooltip when hovering item [BETA] Unsure of right api (opt-in\/opt-out) */
        Tooltip: number;
    };
    /** Configuration flags stored in io.ConfigFlags. Set by user\/application. */
    ConfigFlags: {
        None: number;
        /** Master keyboard navigation enable flag. Enable full Tabbing + directional arrows + space\/enter to activate. */
        NavEnableKeyboard: number;
        /** Master gamepad navigation enable flag. Backend also needs to set ImGuiBackendFlags_HasGamepad. */
        NavEnableGamepad: number;
        /** Instruct dear imgui to disable mouse inputs and interactions. */
        NoMouse: number;
        /** Instruct backend to not alter mouse cursor shape and visibility. Use if the backend cursor changes are interfering with yours and you don't want to use SetMouseCursor() to change mouse cursor. You may want to honor requests from imgui by reading GetMouseCursor() yourself instead. */
        NoMouseCursorChange: number;
        /** Instruct dear imgui to disable keyboard inputs and interactions. This is done by ignoring keyboard events and clearing existing states. */
        NoKeyboard: number;
        /** Docking enable flags. */
        DockingEnable: number;
        /** Viewport enable flags (require both ImGuiBackendFlags_PlatformHasViewports + ImGuiBackendFlags_RendererHasViewports set by the respective backends) */
        ViewportsEnable: number;
        /** Application is SRGB-aware. */
        IsSRGB: number;
        /** Application is using a touch screen instead of a mouse. */
        IsTouchScreen: number;
    };
    /** Backend capabilities flags stored in io.BackendFlags. Set by imgui_impl_xxx or custom backend. */
    BackendFlags: {
        None: number;
        /** Backend Platform supports gamepad and currently has one connected. */
        HasGamepad: number;
        /** Backend Platform supports honoring GetMouseCursor() value to change the OS cursor shape. */
        HasMouseCursors: number;
        /** Backend Platform supports io.WantSetMousePos requests to reposition the OS mouse position (only used if io.ConfigNavMoveSetMousePos is set). */
        HasSetMousePos: number;
        /** Backend Renderer supports ImDrawCmd::VtxOffset. This enables output of large meshes (64K+ vertices) while still using 16-bit indices. */
        RendererHasVtxOffset: number;
        /** Backend Renderer supports ImTextureData requests to create\/update\/destroy textures. This enables incremental texture updates and texture reloads. */
        RendererHasTextures: number;
        /** Backend Platform supports multiple viewports. */
        PlatformHasViewports: number;
        /** Backend Platform supports calling io.AddMouseViewportEvent() with the viewport under the mouse. IF POSSIBLE, ignore viewports with the ImGuiViewportFlags_NoInputs flag (Win32 backend, GLFW 3.30+ backend can do this, SDL backend cannot). If this cannot be done, Dear ImGui needs to use a flawed heuristic to find the viewport under. */
        HasMouseHoveredViewport: number;
        /** Backend Renderer supports multiple viewports. */
        RendererHasViewports: number;
    };
    /** Enumeration for PushStyleColor() \/ PopStyleColor() */
    Col: {
        Text: number;
        TextDisabled: number;
        /** Background of normal windows */
        WindowBg: number;
        /** Background of child windows */
        ChildBg: number;
        /** Background of popups, menus, tooltips windows */
        PopupBg: number;
        Border: number;
        BorderShadow: number;
        /** Background of checkbox, radio button, plot, slider, text input */
        FrameBg: number;
        FrameBgHovered: number;
        FrameBgActive: number;
        /** Title bar */
        TitleBg: number;
        /** Title bar when focused */
        TitleBgActive: number;
        /** Title bar when collapsed */
        TitleBgCollapsed: number;
        MenuBarBg: number;
        ScrollbarBg: number;
        ScrollbarGrab: number;
        ScrollbarGrabHovered: number;
        ScrollbarGrabActive: number;
        /** Checkbox tick and RadioButton circle */
        CheckMark: number;
        SliderGrab: number;
        SliderGrabActive: number;
        Button: number;
        ButtonHovered: number;
        ButtonActive: number;
        /** Header* colors are used for CollapsingHeader, TreeNode, Selectable, MenuItem */
        Header: number;
        HeaderHovered: number;
        HeaderActive: number;
        Separator: number;
        SeparatorHovered: number;
        SeparatorActive: number;
        /** Resize grip in lower-right and lower-left corners of windows. */
        ResizeGrip: number;
        ResizeGripHovered: number;
        ResizeGripActive: number;
        /** InputText cursor\/caret */
        InputTextCursor: number;
        /** Tab background, when hovered */
        TabHovered: number;
        /** Tab background, when tab-bar is focused & tab is unselected */
        Tab: number;
        /** Tab background, when tab-bar is focused & tab is selected */
        TabSelected: number;
        /** Tab horizontal overline, when tab-bar is focused & tab is selected */
        TabSelectedOverline: number;
        /** Tab background, when tab-bar is unfocused & tab is unselected */
        TabDimmed: number;
        /** Tab background, when tab-bar is unfocused & tab is selected */
        TabDimmedSelected: number;
        /** .horizontal overline, when tab-bar is unfocused & tab is selected */
        TabDimmedSelectedOverline: number;
        /** Preview overlay color when about to docking something */
        DockingPreview: number;
        /** Background color for empty node (e.g. CentralNode with no window docked into it) */
        DockingEmptyBg: number;
        PlotLines: number;
        PlotLinesHovered: number;
        PlotHistogram: number;
        PlotHistogramHovered: number;
        /** Table header background */
        TableHeaderBg: number;
        /** Table outer and header borders (prefer using Alpha=1.0 here) */
        TableBorderStrong: number;
        /** Table inner borders (prefer using Alpha=1.0 here) */
        TableBorderLight: number;
        /** Table row background (even rows) */
        TableRowBg: number;
        /** Table row background (odd rows) */
        TableRowBgAlt: number;
        /** Hyperlink color */
        TextLink: number;
        /** Selected text inside an InputText */
        TextSelectedBg: number;
        /** Tree node hierarchy outlines when using ImGuiTreeNodeFlags_DrawLines */
        TreeLines: number;
        /** Rectangle highlighting a drop target */
        DragDropTarget: number;
        /** Color of keyboard\/gamepad navigation cursor\/rectangle, when visible */
        NavCursor: number;
        /** Highlight window when using CTRL+TAB */
        NavWindowingHighlight: number;
        /** Darken\/colorize entire screen behind the CTRL+TAB window list, when active */
        NavWindowingDimBg: number;
        /** Darken\/colorize entire screen behind a modal window, when one is active */
        ModalWindowDimBg: number;
        COUNT: number;
    };
    /** Enumeration for PushStyleVar() \/ PopStyleVar() to temporarily modify the ImGuiStyle structure. */
    StyleVar: {
        /** float     Alpha */
        Alpha: number;
        /** float     DisabledAlpha */
        DisabledAlpha: number;
        /** ImVec2    WindowPadding */
        WindowPadding: number;
        /** float     WindowRounding */
        WindowRounding: number;
        /** float     WindowBorderSize */
        WindowBorderSize: number;
        /** ImVec2    WindowMinSize */
        WindowMinSize: number;
        /** ImVec2    WindowTitleAlign */
        WindowTitleAlign: number;
        /** float     ChildRounding */
        ChildRounding: number;
        /** float     ChildBorderSize */
        ChildBorderSize: number;
        /** float     PopupRounding */
        PopupRounding: number;
        /** float     PopupBorderSize */
        PopupBorderSize: number;
        /** ImVec2    FramePadding */
        FramePadding: number;
        /** float     FrameRounding */
        FrameRounding: number;
        /** float     FrameBorderSize */
        FrameBorderSize: number;
        /** ImVec2    ItemSpacing */
        ItemSpacing: number;
        /** ImVec2    ItemInnerSpacing */
        ItemInnerSpacing: number;
        /** float     IndentSpacing */
        IndentSpacing: number;
        /** ImVec2    CellPadding */
        CellPadding: number;
        /** float     ScrollbarSize */
        ScrollbarSize: number;
        /** float     ScrollbarRounding */
        ScrollbarRounding: number;
        /** float     GrabMinSize */
        GrabMinSize: number;
        /** float     GrabRounding */
        GrabRounding: number;
        /** float     ImageBorderSize */
        ImageBorderSize: number;
        /** float     TabRounding */
        TabRounding: number;
        /** float     TabBorderSize */
        TabBorderSize: number;
        /** float     TabBarBorderSize */
        TabBarBorderSize: number;
        /** float     TabBarOverlineSize */
        TabBarOverlineSize: number;
        /** float     TableAngledHeadersAngle */
        TableAngledHeadersAngle: number;
        /** ImVec2  TableAngledHeadersTextAlign */
        TableAngledHeadersTextAlign: number;
        /** float     TreeLinesSize */
        TreeLinesSize: number;
        /** float     TreeLinesRounding */
        TreeLinesRounding: number;
        /** ImVec2    ButtonTextAlign */
        ButtonTextAlign: number;
        /** ImVec2    SelectableTextAlign */
        SelectableTextAlign: number;
        /** float     SeparatorTextBorderSize */
        SeparatorTextBorderSize: number;
        /** ImVec2    SeparatorTextAlign */
        SeparatorTextAlign: number;
        /** ImVec2    SeparatorTextPadding */
        SeparatorTextPadding: number;
        /** float     DockingSeparatorSize */
        DockingSeparatorSize: number;
        COUNT: number;
    };
    /** Flags for InvisibleButton() [extended in imgui_internal.h] */
    ButtonFlags: {
        None: number;
        /** React on left mouse button (default) */
        MouseButtonLeft: number;
        /** React on right mouse button */
        MouseButtonRight: number;
        /** React on center mouse button */
        MouseButtonMiddle: number;
        /** InvisibleButton(): do not disable navigation\/tabbing. Otherwise disabled by default. */
        EnableNav: number;
    };
    /** Flags for ColorEdit3() \/ ColorEdit4() \/ ColorPicker3() \/ ColorPicker4() \/ ColorButton() */
    ColorEditFlags: {
        None: number;
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: ignore Alpha component (will only read 3 components from the input pointer). */
        NoAlpha: number;
        /**              \/\/ ColorEdit: disable picker when clicking on color square. */
        NoPicker: number;
        /**              \/\/ ColorEdit: disable toggling options menu when right-clicking on inputs\/small preview. */
        NoOptions: number;
        /**              \/\/ ColorEdit, ColorPicker: disable color square preview next to the inputs. (e.g. to show only the inputs) */
        NoSmallPreview: number;
        /**              \/\/ ColorEdit, ColorPicker: disable inputs sliders\/text widgets (e.g. to show only the small preview color square). */
        NoInputs: number;
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable tooltip when hovering the preview. */
        NoTooltip: number;
        /**              \/\/ ColorEdit, ColorPicker: disable display of inline text label (the label is still forwarded to the tooltip and picker). */
        NoLabel: number;
        /**              \/\/ ColorPicker: disable bigger color preview on right side of the picker, use small color square preview instead. */
        NoSidePreview: number;
        /**              \/\/ ColorEdit: disable drag and drop target. ColorButton: disable drag and drop source. */
        NoDragDrop: number;
        /**              \/\/ ColorButton: disable border (which is enforced by default) */
        NoBorder: number;
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable alpha in the preview,. Contrary to _NoAlpha it may still be edited when calling ColorEdit4()\/ColorPicker4(). For ColorButton() this does the same as _NoAlpha. */
        AlphaOpaque: number;
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: disable rendering a checkerboard background behind transparent color. */
        AlphaNoBg: number;
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: display half opaque \/ half transparent preview. */
        AlphaPreviewHalf: number;
        /**              \/\/ ColorEdit, ColorPicker: show vertical alpha bar\/gradient in picker. */
        AlphaBar: number;
        /**              \/\/ (WIP) ColorEdit: Currently only disable 0.0f..1.0f limits in RGBA edition (note: you probably want to use ImGuiColorEditFlags_Float flag as well). */
        HDR: number;
        /** [Display]    \/\/ ColorEdit: override _display_ type among RGB\/HSV\/Hex. ColorPicker: select any combination using one or more of RGB\/HSV\/Hex. */
        DisplayRGB: number;
        /** [Display]    \/\/ " */
        DisplayHSV: number;
        /** [Display]    \/\/ " */
        DisplayHex: number;
        /** [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0..255. */
        Uint8: number;
        /** [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0.0f..1.0f floats instead of 0..255 integers. No round-trip of value via integers. */
        Float: number;
        /** [Picker]     \/\/ ColorPicker: bar for Hue, rectangle for Sat\/Value. */
        PickerHueBar: number;
        /** [Picker]     \/\/ ColorPicker: wheel for Hue, triangle for Sat\/Value. */
        PickerHueWheel: number;
        /** [Input]      \/\/ ColorEdit, ColorPicker: input and output data in RGB format. */
        InputRGB: number;
        /** [Input]      \/\/ ColorEdit, ColorPicker: input and output data in HSV format. */
        InputHSV: number;
    };
    /** Flags for DragFloat(), DragInt(), SliderFloat(), SliderInt() etc. */
    SliderFlags: {
        None: number;
        /** Make the widget logarithmic (linear otherwise). Consider using ImGuiSliderFlags_NoRoundToFormat with this if using a format-string with small amount of digits. */
        Logarithmic: number;
        /** Disable rounding underlying value to match precision of the display format string (e.g. %.3f values are rounded to those 3 digits). */
        NoRoundToFormat: number;
        /** Disable CTRL+Click or Enter key allowing to input text directly into the widget. */
        NoInput: number;
        /** Enable wrapping around from max to min and from min to max. Only supported by DragXXX() functions for now. */
        WrapAround: number;
        /** Clamp value to min\/max bounds when input manually with CTRL+Click. By default CTRL+Click allows going out of bounds. */
        ClampOnInput: number;
        /** Clamp even if min==max==0.0f. Otherwise due to legacy reason DragXXX functions don't clamp with those values. When your clamping limits are dynamic you almost always want to use it. */
        ClampZeroRange: number;
        /** Disable keyboard modifiers altering tweak speed. Useful if you want to alter tweak speed yourself based on your own logic. */
        NoSpeedTweaks: number;
        AlwaysClamp: number;
    };
    /** Identify a mouse button. */
    MouseButton: {
        Left: number;
        Right: number;
        Middle: number;
        COUNT: number;
    };
    /** Enumeration for GetMouseCursor() */
    MouseCursor: {
        None: number;
        Arrow: number;
        /** When hovering over InputText, etc. */
        TextInput: number;
        /** (Unused by Dear ImGui functions) */
        ResizeAll: number;
        /** When hovering over a horizontal border */
        ResizeNS: number;
        /** When hovering over a vertical border or a column */
        ResizeEW: number;
        /** When hovering over the bottom-left corner of a window */
        ResizeNESW: number;
        /** When hovering over the bottom-right corner of a window */
        ResizeNWSE: number;
        /** (Unused by Dear ImGui functions. Use for e.g. hyperlinks) */
        Hand: number;
        /** When waiting for something to process\/load. */
        Wait: number;
        /** When waiting for something to process\/load, but application is still interactive. */
        Progress: number;
        /** When hovering something with disallowed interaction. Usually a crossed circle. */
        NotAllowed: number;
        COUNT: number;
    };
    /** Enumeration for AddMouseSourceEvent() actual source of Mouse Input data. */
    MouseSource: {
        /** Input is coming from an actual mouse. */
        _Mouse: number;
        /** Input is coming from a touch screen (no hovering prior to initial press, less precise initial press aiming, dual-axis wheeling possible). */
        _TouchScreen: number;
        /** Input is coming from a pressure\/magnetic pen (often used in conjunction with high-sampling rates). */
        _Pen: number;
        _COUNT: number;
    };
    /** Enumeration for ImGui::SetNextWindow***(), SetWindow***(), SetNextItem***() functions */
    Cond: {
        /** No condition (always set the variable), same as _Always */
        None: number;
        /** No condition (always set the variable), same as _None */
        Always: number;
        /** Set the variable once per runtime session (only the first call will succeed) */
        Once: number;
        /** Set the variable if the object\/window has no persistently saved data (no entry in .ini file) */
        FirstUseEver: number;
        /** Set the variable if the object\/window is appearing after being hidden\/inactive (or the first time) */
        Appearing: number;
    };
    /** Flags for ImGui::BeginTable() */
    TableFlags: {
        None: number;
        /** Enable resizing columns. */
        Resizable: number;
        /** Enable reordering columns in header row (need calling TableSetupColumn() + TableHeadersRow() to display headers) */
        Reorderable: number;
        /** Enable hiding\/disabling columns in context menu. */
        Hideable: number;
        /** Enable sorting. Call TableGetSortSpecs() to obtain sort specs. Also see ImGuiTableFlags_SortMulti and ImGuiTableFlags_SortTristate. */
        Sortable: number;
        /** Disable persisting columns order, width and sort settings in the .ini file. */
        NoSavedSettings: number;
        /** Right-click on columns body\/contents will display table context menu. By default it is available in TableHeadersRow(). */
        ContextMenuInBody: number;
        /** Set each RowBg color with ImGuiCol_TableRowBg or ImGuiCol_TableRowBgAlt (equivalent of calling TableSetBgColor with ImGuiTableBgFlags_RowBg0 on each row manually) */
        RowBg: number;
        /** Draw horizontal borders between rows. */
        BordersInnerH: number;
        /** Draw horizontal borders at the top and bottom. */
        BordersOuterH: number;
        /** Draw vertical borders between columns. */
        BordersInnerV: number;
        /** Draw vertical borders on the left and right sides. */
        BordersOuterV: number;
        /** Draw horizontal borders. */
        BordersH: number;
        /** Draw vertical borders. */
        BordersV: number;
        /** Draw inner borders. */
        BordersInner: number;
        /** Draw outer borders. */
        BordersOuter: number;
        /** Draw all borders. */
        Borders: number;
        /** [ALPHA] Disable vertical borders in columns Body (borders will always appear in Headers). -> May move to style */
        NoBordersInBody: number;
        /** [ALPHA] Disable vertical borders in columns Body until hovered for resize (borders will always appear in Headers). -> May move to style */
        NoBordersInBodyUntilResize: number;
        /** Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching contents width. */
        SizingFixedFit: number;
        /** Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching the maximum contents width of all columns. Implicitly enable ImGuiTableFlags_NoKeepColumnsVisible. */
        SizingFixedSame: number;
        /** Columns default to _WidthStretch with default weights proportional to each columns contents widths. */
        SizingStretchProp: number;
        /** Columns default to _WidthStretch with default weights all equal, unless overridden by TableSetupColumn(). */
        SizingStretchSame: number;
        /** Make outer width auto-fit to columns, overriding outer_size.x value. Only available when ScrollX\/ScrollY are disabled and Stretch columns are not used. */
        NoHostExtendX: number;
        /** Make outer height stop exactly at outer_size.y (prevent auto-extending table past the limit). Only available when ScrollX\/ScrollY are disabled. Data below the limit will be clipped and not visible. */
        NoHostExtendY: number;
        /** Disable keeping column always minimally visible when ScrollX is off and table gets too small. Not recommended if columns are resizable. */
        NoKeepColumnsVisible: number;
        /** Disable distributing remainder width to stretched columns (width allocation on a 100-wide table with 3 columns: Without this flag: 33,33,34. With this flag: 33,33,33). With larger number of columns, resizing will appear to be less smooth. */
        PreciseWidths: number;
        /** Disable clipping rectangle for every individual columns (reduce draw command count, items will be able to overflow into other columns). Generally incompatible with TableSetupScrollFreeze(). */
        NoClip: number;
        /** Default if BordersOuterV is on. Enable outermost padding. Generally desirable if you have headers. */
        PadOuterX: number;
        /** Default if BordersOuterV is off. Disable outermost padding. */
        NoPadOuterX: number;
        /** Disable inner padding between columns (double inner padding if BordersOuterV is on, single inner padding if BordersOuterV is off). */
        NoPadInnerX: number;
        /** Enable horizontal scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size. Changes default sizing policy. Because this creates a child window, ScrollY is currently generally recommended when using ScrollX. */
        ScrollX: number;
        /** Enable vertical scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size. */
        ScrollY: number;
        /** Hold shift when clicking headers to sort on multiple column. TableGetSortSpecs() may return specs where (SpecsCount > 1). */
        SortMulti: number;
        /** Allow no sorting, disable default sorting. TableGetSortSpecs() may return specs where (SpecsCount == 0). */
        SortTristate: number;
        /** Highlight column headers when hovered (may evolve into a fuller highlight) */
        HighlightHoveredColumn: number;
    };
    /** Flags for ImGui::TableSetupColumn() */
    TableColumnFlags: {
        None: number;
        /** Overriding\/master disable flag: hide column, won't show in context menu (unlike calling TableSetColumnEnabled() which manipulates the user accessible state) */
        Disabled: number;
        /** Default as a hidden\/disabled column. */
        DefaultHide: number;
        /** Default as a sorting column. */
        DefaultSort: number;
        /** Column will stretch. Preferable with horizontal scrolling disabled (default if table sizing policy is _SizingStretchSame or _SizingStretchProp). */
        WidthStretch: number;
        /** Column will not stretch. Preferable with horizontal scrolling enabled (default if table sizing policy is _SizingFixedFit and table is resizable). */
        WidthFixed: number;
        /** Disable manual resizing. */
        NoResize: number;
        /** Disable manual reordering this column, this will also prevent other columns from crossing over this column. */
        NoReorder: number;
        /** Disable ability to hide\/disable this column. */
        NoHide: number;
        /** Disable clipping for this column (all NoClip columns will render in a same draw command). */
        NoClip: number;
        /** Disable ability to sort on this field (even if ImGuiTableFlags_Sortable is set on the table). */
        NoSort: number;
        /** Disable ability to sort in the ascending direction. */
        NoSortAscending: number;
        /** Disable ability to sort in the descending direction. */
        NoSortDescending: number;
        /** TableHeadersRow() will submit an empty label for this column. Convenient for some small columns. Name will still appear in context menu or in angled headers. You may append into this cell by calling TableSetColumnIndex() right after the TableHeadersRow() call. */
        NoHeaderLabel: number;
        /** Disable header text width contribution to automatic column width. */
        NoHeaderWidth: number;
        /** Make the initial sort direction Ascending when first sorting on this column (default). */
        PreferSortAscending: number;
        /** Make the initial sort direction Descending when first sorting on this column. */
        PreferSortDescending: number;
        /** Use current Indent value when entering cell (default for column 0). */
        IndentEnable: number;
        /** Ignore current Indent value when entering cell (default for columns > 0). Indentation changes _within_ the cell will still be honored. */
        IndentDisable: number;
        /** TableHeadersRow() will submit an angled header row for this column. Note this will add an extra row. */
        AngledHeader: number;
        /** Status: is enabled == not hidden by user\/api (referred to as "Hide" in _DefaultHide and _NoHide) flags. */
        IsEnabled: number;
        /** Status: is visible == is enabled AND not clipped by scrolling. */
        IsVisible: number;
        /** Status: is currently part of the sort specs */
        IsSorted: number;
        /** Status: is hovered by mouse */
        IsHovered: number;
    };
    /** Flags for ImGui::TableNextRow() */
    TableRowFlags: {
        None: number;
        /** Identify header row (set default background color + width of its contents accounted differently for auto column width) */
        Headers: number;
    };
    /** Enum for ImGui::TableSetBgColor() */
    TableBgTarget: {
        None: number;
        /** Set row background color 0 (generally used for background, automatically set when ImGuiTableFlags_RowBg is used) */
        RowBg0: number;
        /** Set row background color 1 (generally used for selection marking) */
        RowBg1: number;
        /** Set cell background color (top-most color) */
        CellBg: number;
    };
    /** Flags for BeginMultiSelect() */
    MultiSelectFlags: {
        None: number;
        /** Disable selecting more than one item. This is available to allow single-selection code to share same code\/logic if desired. It essentially disables the main purpose of BeginMultiSelect() tho! */
        SingleSelect: number;
        /** Disable CTRL+A shortcut to select all. */
        NoSelectAll: number;
        /** Disable Shift+selection mouse\/keyboard support (useful for unordered 2D selection). With BoxSelect is also ensure contiguous SetRange requests are not combined into one. This allows not handling interpolation in SetRange requests. */
        NoRangeSelect: number;
        /** Disable selecting items when navigating (useful for e.g. supporting range-select in a list of checkboxes). */
        NoAutoSelect: number;
        /** Disable clearing selection when navigating or selecting another one (generally used with ImGuiMultiSelectFlags_NoAutoSelect. useful for e.g. supporting range-select in a list of checkboxes). */
        NoAutoClear: number;
        /** Disable clearing selection when clicking\/selecting an already selected item. */
        NoAutoClearOnReselect: number;
        /** Enable box-selection with same width and same x pos items (e.g. full row Selectable()). Box-selection works better with little bit of spacing between items hit-box in order to be able to aim at empty space. */
        BoxSelect1d: number;
        /** Enable box-selection with varying width or varying x pos items support (e.g. different width labels, or 2D layout\/grid). This is slower: alters clipping logic so that e.g. horizontal movements will update selection of normally clipped items. */
        BoxSelect2d: number;
        /** Disable scrolling when box-selecting near edges of scope. */
        BoxSelectNoScroll: number;
        /** Clear selection when pressing Escape while scope is focused. */
        ClearOnEscape: number;
        /** Clear selection when clicking on empty location within scope. */
        ClearOnClickVoid: number;
        /** Scope for _BoxSelect and _ClearOnClickVoid is whole window (Default). Use if BeginMultiSelect() covers a whole window or used a single time in same window. */
        ScopeWindow: number;
        /** Scope for _BoxSelect and _ClearOnClickVoid is rectangle encompassing BeginMultiSelect()\/EndMultiSelect(). Use if BeginMultiSelect() is called multiple times in same window. */
        ScopeRect: number;
        /** Apply selection on mouse down when clicking on unselected item. (Default) */
        SelectOnClick: number;
        /** Apply selection on mouse release when clicking an unselected item. Allow dragging an unselected item without altering selection. */
        SelectOnClickRelease: number;
        /** [Temporary] Enable navigation wrapping on X axis. Provided as a convenience because we don't have a design for the general Nav API for this yet. When the more general feature be public we may obsolete this flag in favor of new one. */
        NavWrapX: number;
    };
    /** Selection request type */
    SelectionRequestType: {
        _None: number;
        /** Request app to clear selection (if Selected==false) or select all items (if Selected==true). We cannot set RangeFirstItem\/RangeLastItem as its contents is entirely up to user (not necessarily an index) */
        _SetAll: number;
        /** Request app to select\/unselect [RangeFirstItem..RangeLastItem] items (inclusive) based on value of Selected. Only EndMultiSelect() request this, app code can read after BeginMultiSelect() and it will always be false. */
        _SetRange: number;
    };
    /** Flags for ImDrawList functions */
    ImDrawFlags: {
        None: number;
        /** PathStroke(), AddPolyline(): specify that shape should be closed (Important: this is always == 1 for legacy reason) */
        Closed: number;
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding top-left corner only (when rounding > 0.0f, we default to all corners). Was 0x01. */
        RoundCornersTopLeft: number;
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding top-right corner only (when rounding > 0.0f, we default to all corners). Was 0x02. */
        RoundCornersTopRight: number;
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-left corner only (when rounding > 0.0f, we default to all corners). Was 0x04. */
        RoundCornersBottomLeft: number;
        /** AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-right corner only (when rounding > 0.0f, we default to all corners). Wax 0x08. */
        RoundCornersBottomRight: number;
        /** AddRect(), AddRectFilled(), PathRect(): disable rounding on all corners (when rounding > 0.0f). This is NOT zero, NOT an implicit flag! */
        RoundCornersNone: number;
        RoundCornersTop: number;
        RoundCornersBottom: number;
        RoundCornersLeft: number;
        RoundCornersRight: number;
        RoundCornersAll: number;
    };
    /** Flags for ImDrawList instance. Those are set automatically by ImGui:: functions from ImGuiIO settings, and generally not manipulated directly. */
    ImDrawListFlags: {
        None: number;
        /** Enable anti-aliased lines\/borders (*2 the number of triangles for 1.0f wide line or lines thin enough to be drawn using textures, otherwise *3 the number of triangles) */
        AntiAliasedLines: number;
        /** Enable anti-aliased lines\/borders using textures when possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). */
        AntiAliasedLinesUseTex: number;
        /** Enable anti-aliased edge around filled shapes (rounded rectangles, circles). */
        AntiAliasedFill: number;
        /** Can emit 'VtxOffset > 0' to allow large meshes. Set when 'ImGuiBackendFlags_RendererHasVtxOffset' is enabled. */
        AllowVtxOffset: number;
    };
    /** We intentionally support a limited amount of texture formats to limit burden on CPU-side code and extension. */
    ImTextureFormat: {
        /** 4 components per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight * 4 */
        _RGBA32: number;
        /** 1 component per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight */
        _Alpha8: number;
    };
    /** Status of a texture to communicate with Renderer Backend. */
    ImTextureStatus: {
        _OK: number;
        /** Backend destroyed the texture. */
        _Destroyed: number;
        /** Requesting backend to create the texture. Set status OK when done. */
        _WantCreate: number;
        /** Requesting backend to update specific blocks of pixels (write to texture portions which have never been used before). Set status OK when done. */
        _WantUpdates: number;
        /** Requesting backend to destroy the texture. Set status to Destroyed when done. */
        _WantDestroy: number;
    };
    /** Flags for ImFontAtlas build */
    ImFontAtlasFlags: {
        None: number;
        /** Don't round the height to next power of two */
        NoPowerOfTwoHeight: number;
        /** Don't build software mouse cursors into the atlas (save a little texture memory) */
        NoMouseCursors: number;
        /** Don't build thick line textures into the atlas (save a little texture memory, allow support for point\/nearest filtering). The AntiAliasedLinesUseTex features uses them, otherwise they will be rendered using polygons (more expensive for CPU\/GPU). */
        NoBakedLines: number;
    };
    /** Font flags */
    ImFontFlags: {
        None: number;
        /** Disable throwing an error\/assert when calling AddFontXXX() with missing file\/data. Calling code is expected to check AddFontXXX() return value. */
        NoLoadError: number;
        /** [Internal] Disable loading new glyphs. */
        NoLoadGlyphs: number;
        /** [Internal] Disable loading new baked sizes, disable garbage collecting current ones. e.g. if you want to lock a font to a single size. Important: if you use this to preload given sizes, consider the possibility of multiple font density used on Retina display. */
        LockBakedSizes: number;
    };
    /** Flags stored in ImGuiViewport::Flags, giving indications to the platform backends. */
    ViewportFlags: {
        None: number;
        /** Represent a Platform Window */
        IsPlatformWindow: number;
        /** Represent a Platform Monitor (unused yet) */
        IsPlatformMonitor: number;
        /** Platform Window: Is created\/managed by the user application? (rather than our backend) */
        OwnedByApp: number;
        /** Platform Window: Disable platform decorations: title bar, borders, etc. (generally set all windows, but if ImGuiConfigFlags_ViewportsDecoration is set we only set this on popups\/tooltips) */
        NoDecoration: number;
        /** Platform Window: Disable platform task bar icon (generally set on popups\/tooltips, or all windows if ImGuiConfigFlags_ViewportsNoTaskBarIcon is set) */
        NoTaskBarIcon: number;
        /** Platform Window: Don't take focus when created. */
        NoFocusOnAppearing: number;
        /** Platform Window: Don't take focus when clicked on. */
        NoFocusOnClick: number;
        /** Platform Window: Make mouse pass through so we can drag this window while peaking behind it. */
        NoInputs: number;
        /** Platform Window: Renderer doesn't need to clear the framebuffer ahead (because we will fill it entirely). */
        NoRendererClear: number;
        /** Platform Window: Avoid merging this window into another host window. This can only be set via ImGuiWindowClass viewport flags override (because we need to now ahead if we are going to create a viewport in the first place!). */
        NoAutoMerge: number;
        /** Platform Window: Display on top (for tooltips only). */
        TopMost: number;
        /** Viewport can host multiple imgui windows (secondary viewports are associated to a single window). \/\/ FIXME: In practice there's still probably code making the assumption that this is always and only on the MainViewport. Will fix once we add support for "no main viewport". */
        CanHostOtherWindows: number;
        /** Platform Window: Window is minimized, can skip render. When minimized we tend to avoid using the viewport pos\/size for clipping window or testing if they are contained in the viewport. */
        IsMinimized: number;
        /** Platform Window: Window is focused (last call to Platform_GetWindowFocus() returned true) */
        IsFocused: number;
    };
    /** Context creation and access */
    CreateContext(shared_font_atlas?: ImFontAtlas): ImGuiContext;
    /** NULL = destroy current context */
    DestroyContext(ctx?: ImGuiContext): void;
    GetCurrentContext(): ImGuiContext;
    SetCurrentContext(ctx: ImGuiContext): void;
    /** access the ImGuiIO structure (mouse\/keyboard\/gamepad inputs, time, various configuration options\/flags) */
    GetIO(): ImGuiIO;
    /** access the Style structure (colors, sizes). Always use PushStyleColor(), PushStyleVar() to modify style mid-frame! */
    GetStyle(): ImGuiStyle;
    /** start a new Dear ImGui frame, you can submit any command from this point until Render()\/EndFrame(). */
    NewFrame(): void;
    /** ends the Dear ImGui frame. automatically called by Render(). If you don't need to render data (skipping rendering) you may call EndFrame() without Render()... but you'll have wasted CPU already! If you don't need to render, better to not create any windows and not call NewFrame() at all! */
    EndFrame(): void;
    /** ends the Dear ImGui frame, finalize the draw data. You can then get call GetDrawData(). */
    Render(): void;
    /** valid after Render() and until the next call to NewFrame(). Call ImGui_ImplXXXX_RenderDrawData() function in your Renderer Backend to render. */
    GetDrawData(): ImDrawData;
    /** create Demo window. demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application! */
    ShowDemoWindow(p_open?: boolean[]): void;
    /** create Metrics\/Debugger window. display Dear ImGui internals: windows, draw commands, various internal state, etc. */
    ShowMetricsWindow(p_open?: boolean[]): void;
    /** create Debug Log window. display a simplified log of important dear imgui events. */
    ShowDebugLogWindow(p_open?: boolean[]): void;
    /** create Stack Tool window. hover items with mouse to query information about the source of their unique ID. */
    ShowIDStackToolWindow(p_open?: boolean[]): void;
    /** create About window. display Dear ImGui version, credits and build\/system information. */
    ShowAboutWindow(p_open?: boolean[]): void;
    /** add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style) */
    ShowStyleEditor(ref?: ImGuiStyle): void;
    /** add style selector block (not a window), essentially a combo listing the default styles. */
    ShowStyleSelector(label: string): boolean;
    /** add font selector block (not a window), essentially a combo listing the loaded fonts. */
    ShowFontSelector(label: string): void;
    /** add basic help\/info block (not a window): how to manipulate ImGui as an end-user (mouse\/keyboard controls). */
    ShowUserGuide(): void;
    /** get the compiled version string e.g. "1.80 WIP" (essentially the value for IMGUI_VERSION from the compiled version of imgui.cpp) */
    GetVersion(): string;
    /** new, recommended style (default) */
    StyleColorsDark(dst?: ImGuiStyle): void;
    /** best used with borders and a custom, thicker font */
    StyleColorsLight(dst?: ImGuiStyle): void;
    /** classic imgui style */
    StyleColorsClassic(dst?: ImGuiStyle): void;
    /** Windows */
    Begin(name: string, p_open?: boolean[], flags?: ImGuiWindowFlags): boolean;
    End(): void;
    /** Child Windows */
    BeginChild(str_id: string, size?: ImVec2, child_flags?: ImGuiChildFlags, window_flags?: ImGuiWindowFlags): boolean;
    EndChild(): void;
    /** Windows Utilities */
    IsWindowAppearing(): boolean;
    IsWindowCollapsed(): boolean;
    /** is current window focused? or its root\/child, depending on flags. see flags for options. */
    IsWindowFocused(flags?: ImGuiFocusedFlags): boolean;
    /** is current window hovered and hoverable (e.g. not blocked by a popup\/modal)? See ImGuiHoveredFlags_ for options. IMPORTANT: If you are trying to check whether your mouse should be dispatched to Dear ImGui or to your underlying app, you should not use this function! Use the 'io.WantCaptureMouse' boolean for that! Refer to FAQ entry "How can I tell whether to dispatch mouse\/keyboard to Dear ImGui or my application?" for details. */
    IsWindowHovered(flags?: ImGuiHoveredFlags): boolean;
    /** get draw list associated to the current window, to append your own drawing primitives */
    GetWindowDrawList(): ImDrawList;
    /** get DPI scale currently associated to the current window's viewport. */
    GetWindowDpiScale(): number;
    /** get current window position in screen space (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead) */
    GetWindowPos(): ImVec2;
    /** get current window size (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead) */
    GetWindowSize(): ImVec2;
    /** get current window width (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().x. */
    GetWindowWidth(): number;
    /** get current window height (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().y. */
    GetWindowHeight(): number;
    /** set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc. */
    SetNextWindowPos(pos: ImVec2, cond?: ImGuiCond, pivot?: ImVec2): void;
    /** set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin() */
    SetNextWindowSize(size: ImVec2, cond?: ImGuiCond): void;
    /** set next window content size (~ scrollable client area, which enforce the range of scrollbars). Not including window decorations (title bar, menu bar, etc.) nor WindowPadding. set an axis to 0.0f to leave it automatic. call before Begin() */
    SetNextWindowContentSize(size: ImVec2): void;
    /** set next window collapsed state. call before Begin() */
    SetNextWindowCollapsed(collapsed: boolean, cond?: ImGuiCond): void;
    /** set next window to be focused \/ top-most. call before Begin() */
    SetNextWindowFocus(): void;
    /** set next window scrolling value (use < 0.0f to not affect a given axis). */
    SetNextWindowScroll(scroll: ImVec2): void;
    /** set next window background color alpha. helper to easily override the Alpha component of ImGuiCol_WindowBg\/ChildBg\/PopupBg. you may also use ImGuiWindowFlags_NoBackground. */
    SetNextWindowBgAlpha(alpha: number): void;
    /** set next window viewport */
    SetNextWindowViewport(viewport_id: ImGuiID): void;
    /** (not recommended) set current window position - call within Begin()\/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects. */
    SetWindowPos(pos: ImVec2, cond?: ImGuiCond): void;
    /** (not recommended) set current window size - call within Begin()\/End(). set to ImVec2(0, 0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects. */
    SetWindowSize(size: ImVec2, cond?: ImGuiCond): void;
    /** (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed(). */
    SetWindowCollapsed(collapsed: boolean, cond?: ImGuiCond): void;
    /** (not recommended) set current window to be focused \/ top-most. prefer using SetNextWindowFocus(). */
    SetWindowFocus(): void;
    /** get scrolling amount [0 .. GetScrollMaxX()] */
    GetScrollX(): number;
    /** get scrolling amount [0 .. GetScrollMaxY()] */
    GetScrollY(): number;
    /** set scrolling amount [0 .. GetScrollMaxX()] */
    SetScrollX(scroll_x: number): void;
    /** set scrolling amount [0 .. GetScrollMaxY()] */
    SetScrollY(scroll_y: number): void;
    /** get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x */
    GetScrollMaxX(): number;
    /** get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y */
    GetScrollMaxY(): number;
    /** adjust scrolling amount to make current cursor position visible. center_x_ratio=0.0: left, 0.5: center, 1.0: right. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead. */
    SetScrollHereX(center_x_ratio?: number): void;
    /** adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead. */
    SetScrollHereY(center_y_ratio?: number): void;
    /** adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position. */
    SetScrollFromPosX(local_x: number, center_x_ratio?: number): void;
    /** adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position. */
    SetScrollFromPosY(local_y: number, center_y_ratio?: number): void;
    /** Use NULL as a shortcut to keep current font. Use 0.0f to keep current size. */
    PushFontFloat(font: ImFont, font_size_base_unscaled: number): void;
    PopFont(): void;
    /** get current font */
    GetFont(): ImFont;
    /** get current scaled font size (= height in pixels). AFTER global scale factors applied. *IMPORTANT* DO NOT PASS THIS VALUE TO PushFont()! Use ImGui::GetStyle().FontSizeBase to get value before global scale factors. */
    GetFontSize(): number;
    /** get current font bound at current size \/\/ == GetFont()->GetFontBaked(GetFontSize()) */
    GetFontBaked(): ImFontBaked;
    /** modify a style color. always use this if you modify the style after NewFrame(). */
    PushStyleColor(idx: ImGuiCol, col: ImU32): void;
    PopStyleColor(count?: number): void;
    /** modify a style float variable. always use this if you modify the style after NewFrame()! */
    PushStyleVar(idx: ImGuiStyleVar, val: number): void;
    /** modify X component of a style ImVec2 variable. " */
    PushStyleVarX(idx: ImGuiStyleVar, val_x: number): void;
    /** modify Y component of a style ImVec2 variable. " */
    PushStyleVarY(idx: ImGuiStyleVar, val_y: number): void;
    PopStyleVar(count?: number): void;
    /** modify specified shared item flag, e.g. PushItemFlag(ImGuiItemFlags_NoTabStop, true) */
    PushItemFlag(option: ImGuiItemFlags, enabled: boolean): void;
    PopItemFlag(): void;
    /** push width of items for common large "item+label" widgets. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side). */
    PushItemWidth(item_width: number): void;
    PopItemWidth(): void;
    /** set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side) */
    SetNextItemWidth(item_width: number): void;
    /** width of item given pushed settings and current cursor position. NOT necessarily the width of last item unlike most 'Item' functions. */
    CalcItemWidth(): number;
    /** push word-wrapping position for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space */
    PushTextWrapPos(wrap_local_pos_x?: number): void;
    PopTextWrapPos(): void;
    /** get UV coordinate for a white pixel, useful to draw custom shapes via the ImDrawList API */
    GetFontTexUvWhitePixel(): ImVec2;
    /** retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwise use GetColorU32() to get style color with style alpha baked in. */
    GetStyleColorVec4(idx: ImGuiCol): ImVec4;
    /** cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND (prefer using this rather than GetCursorPos(), also more useful to work with ImDrawList API). */
    GetCursorScreenPos(): ImVec2;
    /** cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND. */
    SetCursorScreenPos(pos: ImVec2): void;
    /** available space from current position. THIS IS YOUR BEST FRIEND. */
    GetContentRegionAvail(): ImVec2;
    /** [window-local] cursor position in window-local coordinates. This is not your best friend. */
    GetCursorPos(): ImVec2;
    /** [window-local] " */
    GetCursorPosX(): number;
    /** [window-local] " */
    GetCursorPosY(): number;
    /** [window-local] " */
    SetCursorPos(local_pos: ImVec2): void;
    /** [window-local] " */
    SetCursorPosX(local_x: number): void;
    /** [window-local] " */
    SetCursorPosY(local_y: number): void;
    /** [window-local] initial cursor position, in window-local coordinates. Call GetCursorScreenPos() after Begin() to get the absolute coordinates version. */
    GetCursorStartPos(): ImVec2;
    /** separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator. */
    Separator(): void;
    /** call between widgets or groups to layout them horizontally. X position given in window coordinates. */
    SameLine(offset_from_start_x?: number, spacing?: number): void;
    /** undo a SameLine() or force a new line when in a horizontal-layout context. */
    NewLine(): void;
    /** add vertical spacing. */
    Spacing(): void;
    /** add a dummy item of given size. unlike InvisibleButton(), Dummy() won't take the mouse click or be navigable into. */
    Dummy(size: ImVec2): void;
    /** move content position toward the right, by indent_w, or style.IndentSpacing if indent_w <= 0 */
    Indent(indent_w?: number): void;
    /** move content position back to the left, by indent_w, or style.IndentSpacing if indent_w <= 0 */
    Unindent(indent_w?: number): void;
    /** lock horizontal starting position */
    BeginGroup(): void;
    /** unlock horizontal starting position + capture the whole group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.) */
    EndGroup(): void;
    /** vertically align upcoming text baseline to FramePadding.y so that it will align properly to regularly framed items (call if you have text on a line before a framed item) */
    AlignTextToFramePadding(): void;
    /** ~ FontSize */
    GetTextLineHeight(): number;
    /** ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text) */
    GetTextLineHeightWithSpacing(): number;
    /** ~ FontSize + style.FramePadding.y * 2 */
    GetFrameHeight(): number;
    /** ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets) */
    GetFrameHeightWithSpacing(): number;
    /** push integer into the ID stack (will hash integer). */
    PushIDInt(int_id: number): void;
    GetIDInt(int_id: number): ImGuiID;
    /** formatted text */
    Text(fmt: string): void;
    /** shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor(); */
    TextColored(col: ImVec4, fmt: string): void;
    /** shortcut for PushStyleColor(ImGuiCol_TextDisabled); Text(fmt, ...); PopStyleColor(); */
    TextDisabled(fmt: string): void;
    /** shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize(). */
    TextWrapped(fmt: string): void;
    /** display text+label aligned the same way as value+label widgets */
    LabelText(label: string, fmt: string): void;
    /** shortcut for Bullet()+Text() */
    BulletText(fmt: string): void;
    /** currently: formatted text with a horizontal line */
    SeparatorText(label: string): void;
    /** button */
    Button(label: string, size?: ImVec2): boolean;
    /** button with (FramePadding.y == 0) to easily embed within text */
    SmallButton(label: string): boolean;
    /** flexible button behavior without the visuals, frequently useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.) */
    InvisibleButton(str_id: string, size: ImVec2, flags?: ImGuiButtonFlags): boolean;
    /** square button with an arrow shape */
    ArrowButton(str_id: string, dir: ImGuiDir): boolean;
    Checkbox(label: string, v: boolean[]): boolean;
    /** use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; } */
    RadioButton(label: string, active: boolean): boolean;
    ProgressBar(fraction: number, size_arg?: ImVec2, overlay?: string): void;
    /** draw a small circle + keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses */
    Bullet(): void;
    /** hyperlink text button, return true when clicked */
    TextLink(label: string): boolean;
    /** hyperlink text button, automatically open file\/url when clicked */
    TextLinkOpenURL(label: string, url?: string): boolean;
    /** Widgets: Images */
    Image(tex_ref: ImTextureRef, image_size: ImVec2, uv0?: ImVec2, uv1?: ImVec2): void;
    ImageWithBg(tex_ref: ImTextureRef, image_size: ImVec2, uv0?: ImVec2, uv1?: ImVec2, bg_col?: ImVec4, tint_col?: ImVec4): void;
    ImageButton(str_id: string, tex_ref: ImTextureRef, image_size: ImVec2, uv0?: ImVec2, uv1?: ImVec2, bg_col?: ImVec4, tint_col?: ImVec4): boolean;
    /** Widgets: Combo Box (Dropdown) */
    BeginCombo(label: string, preview_value: string, flags?: ImGuiComboFlags): boolean;
    /** only call EndCombo() if BeginCombo() returns true! */
    EndCombo(): void;
    /** If v_min >= v_max we have no bound */
    DragFloat(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragFloat2(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragFloat3(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragFloat4(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragFloatRange2(label: string, v_current_min: number[], v_current_max: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, format_max?: string, flags?: ImGuiSliderFlags): boolean;
    /** If v_min >= v_max we have no bound */
    DragInt(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragInt2(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragInt3(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragInt4(label: string, v: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    DragIntRange2(label: string, v_current_min: number[], v_current_max: number[], v_speed?: number, v_min?: number, v_max?: number, format?: string, format_max?: string, flags?: ImGuiSliderFlags): boolean;
    /** adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display. */
    SliderFloat(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderFloat2(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderFloat3(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderFloat4(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderAngle(label: string, v_rad: number[], v_degrees_min?: number, v_degrees_max?: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderInt(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderInt2(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderInt3(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    SliderInt4(label: string, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    VSliderFloat(label: string, size: ImVec2, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    VSliderInt(label: string, size: ImVec2, v: number[], v_min: number, v_max: number, format?: string, flags?: ImGuiSliderFlags): boolean;
    InputText(label: string, buf: string[], buf_size: number, flags?: ImGuiInputTextFlags): boolean;
    InputTextMultiline(label: string, buf: string[], buf_size: number, size?: ImVec2, flags?: ImGuiInputTextFlags): boolean;
    InputTextWithHint(label: string, hint: string, buf: string[], buf_size: number, flags?: ImGuiInputTextFlags): boolean;
    InputFloat(label: string, v: number[], step?: number, step_fast?: number, format?: string, flags?: ImGuiInputTextFlags): boolean;
    InputFloat2(label: string, v: number[], format?: string, flags?: ImGuiInputTextFlags): boolean;
    InputFloat3(label: string, v: number[], format?: string, flags?: ImGuiInputTextFlags): boolean;
    InputFloat4(label: string, v: number[], format?: string, flags?: ImGuiInputTextFlags): boolean;
    InputInt(label: string, v: number[], step?: number, step_fast?: number, flags?: ImGuiInputTextFlags): boolean;
    InputInt2(label: string, v: number[], flags?: ImGuiInputTextFlags): boolean;
    InputInt3(label: string, v: number[], flags?: ImGuiInputTextFlags): boolean;
    InputInt4(label: string, v: number[], flags?: ImGuiInputTextFlags): boolean;
    InputDouble(label: string, v: number[], step?: number, step_fast?: number, format?: string, flags?: ImGuiInputTextFlags): boolean;
    /** Widgets: Color Editor\/Picker (tip: the ColorEdit* functions have a little color square that can be left-clicked to open a picker, and right-clicked to open an option menu.) */
    ColorEdit3(label: string, col: number[], flags?: ImGuiColorEditFlags): boolean;
    ColorEdit4(label: string, col: number[], flags?: ImGuiColorEditFlags): boolean;
    ColorPicker3(label: string, col: number[], flags?: ImGuiColorEditFlags): boolean;
    ColorPicker4(label: string, col: number[], flags?: ImGuiColorEditFlags, ref_col?: number[]): boolean;
    /** display a color square\/button, hover for details, return true when pressed. */
    ColorButton(desc_id: string, col: ImVec4, flags?: ImGuiColorEditFlags, size?: ImVec2): boolean;
    /** initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls. */
    SetColorEditOptions(flags: ImGuiColorEditFlags): void;
    /** Widgets: Trees */
    TreeNode(label: string): boolean;
    TreeNodeEx(label: string, flags?: ImGuiTreeNodeFlags): boolean;
    /** ~ Indent()+PushID(). Already called by TreeNode() when returning true, but you can call TreePush\/TreePop yourself if desired. */
    TreePush(str_id: string): void;
    /** ~ Unindent()+PopID() */
    TreePop(): void;
    /** horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode */
    GetTreeNodeToLabelSpacing(): number;
    /** if returning 'true' the header is open. doesn't indent nor push on ID stack. user doesn't have to call TreePop(). */
    CollapsingHeader(label: string, flags?: ImGuiTreeNodeFlags): boolean;
    /** set next TreeNode\/CollapsingHeader open state. */
    SetNextItemOpen(is_open: boolean, cond?: ImGuiCond): void;
    /** "bool selected" carry the selection state (read-only). Selectable() is clicked is returns true so you can modify your selection state. size.x==0.0: use remaining width, size.x>0.0: specify width. size.y==0.0: use label height, size.y>0.0: specify height */
    Selectable(label: string, selected?: boolean, flags?: ImGuiSelectableFlags, size?: ImVec2): boolean;
    /** Multi-selection system for Selectable(), Checkbox(), TreeNode() functions [BETA] */
    BeginMultiSelect(flags: ImGuiMultiSelectFlags, selection_size?: number, items_count?: number): ImGuiMultiSelectIO;
    EndMultiSelect(): ImGuiMultiSelectIO;
    SetNextItemSelectionUserData(selection_user_data: ImGuiSelectionUserData): void;
    /** Was the last item selection state toggled? Useful if you need the per-item information _before_ reaching EndMultiSelect(). We only returns toggle _event_ in order to handle clipping correctly. */
    IsItemToggledSelection(): boolean;
    /** open a framed scrolling region */
    BeginListBox(label: string, size?: ImVec2): boolean;
    /** only call EndListBox() if BeginListBox() returned true! */
    EndListBox(): void;
    PlotLines(label: string, values: number[], values_count: number, values_offset?: number, overlay_text?: string, scale_min?: number, scale_max?: number, graph_size?: ImVec2): void;
    PlotHistogram(label: string, values: number[], values_count: number, values_offset?: number, overlay_text?: string, scale_min?: number, scale_max?: number, graph_size?: ImVec2): void;
    /** append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window). */
    BeginMenuBar(): boolean;
    /** only call EndMenuBar() if BeginMenuBar() returns true! */
    EndMenuBar(): void;
    /** create and append to a full screen menu-bar. */
    BeginMainMenuBar(): boolean;
    /** only call EndMainMenuBar() if BeginMainMenuBar() returns true! */
    EndMainMenuBar(): void;
    /** create a sub-menu entry. only call EndMenu() if this returns true! */
    BeginMenu(label: string, enabled?: boolean): boolean;
    /** only call EndMenu() if BeginMenu() returns true! */
    EndMenu(): void;
    /** return true when activated. */
    MenuItem(label: string, shortcut?: string, selected?: boolean, enabled?: boolean): boolean;
    /** begin\/append a tooltip window. */
    BeginTooltip(): boolean;
    /** only call EndTooltip() if BeginTooltip()\/BeginItemTooltip() returns true! */
    EndTooltip(): void;
    /** set a text-only tooltip. Often used after a ImGui::IsItemHovered() check. */
    SetTooltip(fmt: string): void;
    /** begin\/append a tooltip window if preceding item was hovered. */
    BeginItemTooltip(): boolean;
    /** set a text-only tooltip if preceding item was hovered. override any previous call to SetTooltip(). */
    SetItemTooltip(fmt: string): void;
    /** return true if the popup is open, and you can start outputting to it. */
    BeginPopup(str_id: string, flags?: ImGuiWindowFlags): boolean;
    /** return true if the modal is open, and you can start outputting to it. */
    BeginPopupModal(name: string, p_open?: boolean[], flags?: ImGuiWindowFlags): boolean;
    /** only call EndPopup() if BeginPopupXXX() returns true! */
    EndPopup(): void;
    /** call to mark popup as open (don't call every frame!). */
    OpenPopup(str_id: string, popup_flags?: ImGuiPopupFlags): void;
    /** helper to open popup when clicked on last item. Default to ImGuiPopupFlags_MouseButtonRight == 1. (note: actually triggers on the mouse _released_ event to be consistent with popup behaviors) */
    OpenPopupOnItemClick(str_id?: string, popup_flags?: ImGuiPopupFlags): void;
    /** manually close the popup we have begin-ed into. */
    CloseCurrentPopup(): void;
    /** open+begin popup when clicked on last item. Use str_id==NULL to associate the popup to previous item. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp! */
    BeginPopupContextItem(str_id?: string, popup_flags?: ImGuiPopupFlags): boolean;
    /** open+begin popup when clicked on current window. */
    BeginPopupContextWindow(str_id?: string, popup_flags?: ImGuiPopupFlags): boolean;
    /** open+begin popup when clicked in void (where there are no windows). */
    BeginPopupContextVoid(str_id?: string, popup_flags?: ImGuiPopupFlags): boolean;
    /** return true if the popup is open. */
    IsPopupOpen(str_id: string, flags?: ImGuiPopupFlags): boolean;
    /** Tables */
    BeginTable(str_id: string, columns: number, flags?: ImGuiTableFlags, outer_size?: ImVec2, inner_width?: number): boolean;
    /** only call EndTable() if BeginTable() returns true! */
    EndTable(): void;
    /** append into the first cell of a new row. */
    TableNextRow(row_flags?: ImGuiTableRowFlags, min_row_height?: number): void;
    /** append into the next column (or first column of next row if currently in last column). Return true when column is visible. */
    TableNextColumn(): boolean;
    /** append into the specified column. Return true when column is visible. */
    TableSetColumnIndex(column_n: number): boolean;
    /** Tables: Headers & Columns declaration */
    TableSetupColumn(label: string, flags?: ImGuiTableColumnFlags, init_width_or_weight?: number, user_id?: ImGuiID): void;
    /** lock columns\/rows so they stay visible when scrolled. */
    TableSetupScrollFreeze(cols: number, rows: number): void;
    /** submit one header cell manually (rarely used) */
    TableHeader(label: string): void;
    /** submit a row with headers cells based on data provided to TableSetupColumn() + submit context menu */
    TableHeadersRow(): void;
    /** submit a row with angled headers for every column with the ImGuiTableColumnFlags_AngledHeader flag. MUST BE FIRST ROW. */
    TableAngledHeadersRow(): void;
    /** get latest sort specs for the table (NULL if not sorting).  Lifetime: don't hold on this pointer over multiple frames or past any subsequent call to BeginTable(). */
    TableGetSortSpecs(): ImGuiTableSortSpecs;
    /** return number of columns (value passed to BeginTable) */
    TableGetColumnCount(): number;
    /** return current column index. */
    TableGetColumnIndex(): number;
    /** return current row index. */
    TableGetRowIndex(): number;
    /** return "" if column didn't have a name declared by TableSetupColumn(). Pass -1 to use current column. */
    TableGetColumnName(column_n?: number): string;
    /** return column flags so you can query their Enabled\/Visible\/Sorted\/Hovered status flags. Pass -1 to use current column. */
    TableGetColumnFlags(column_n?: number): ImGuiTableColumnFlags;
    /** change user accessible enabled\/disabled state of a column. Set to false to hide the column. User can use the context menu to change this themselves (right-click in headers, or right-click in columns body with ImGuiTableFlags_ContextMenuInBody) */
    TableSetColumnEnabled(column_n: number, v: boolean): void;
    /** return hovered column. return -1 when table is not hovered. return columns_count if the unused space at the right of visible columns is hovered. Can also use (TableGetColumnFlags() & ImGuiTableColumnFlags_IsHovered) instead. */
    TableGetHoveredColumn(): number;
    /** change the color of a cell, row, or column. See ImGuiTableBgTarget_ flags for details. */
    TableSetBgColor(target: ImGuiTableBgTarget, color: ImU32, column_n?: number): void;
    /** Legacy Columns API (prefer using Tables!) */
    Columns(count?: number, id?: string, borders?: boolean): void;
    /** next column, defaults to current row or next row if the current row is finished */
    NextColumn(): void;
    /** get current column index */
    GetColumnIndex(): number;
    /** get column width (in pixels). pass -1 to use current column */
    GetColumnWidth(column_index?: number): number;
    /** set column width (in pixels). pass -1 to use current column */
    SetColumnWidth(column_index: number, width: number): void;
    /** get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f */
    GetColumnOffset(column_index?: number): number;
    /** set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column */
    SetColumnOffset(column_index: number, offset_x: number): void;
    GetColumnsCount(): number;
    /** create and append into a TabBar */
    BeginTabBar(str_id: string, flags?: ImGuiTabBarFlags): boolean;
    /** only call EndTabBar() if BeginTabBar() returns true! */
    EndTabBar(): void;
    /** create a Tab. Returns true if the Tab is selected. */
    BeginTabItem(label: string, p_open?: boolean[], flags?: ImGuiTabItemFlags): boolean;
    /** only call EndTabItem() if BeginTabItem() returns true! */
    EndTabItem(): void;
    /** create a Tab behaving like a button. return true when clicked. cannot be selected in the tab bar. */
    TabItemButton(label: string, flags?: ImGuiTabItemFlags): boolean;
    /** notify TabBar or Docking system of a closed tab\/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name. */
    SetTabItemClosed(tab_or_docked_window_label: string): void;
    /** is current window docked into another window? */
    IsWindowDocked(): boolean;
    /** Disabling [BETA API] */
    BeginDisabled(disabled?: boolean): void;
    EndDisabled(): void;
    /** Clipping */
    PushClipRect(clip_rect_min: ImVec2, clip_rect_max: ImVec2, intersect_with_current_clip_rect: boolean): void;
    PopClipRect(): void;
    /** make last item the default focused item of a newly appearing window. */
    SetItemDefaultFocus(): void;
    /** focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget. */
    SetKeyboardFocusHere(offset?: number): void;
    /** alter visibility of keyboard\/gamepad cursor. by default: show when using an arrow key, hide when clicking with mouse. */
    SetNavCursorVisible(visible: boolean): void;
    /** allow next item to be overlapped by a subsequent item. Useful with invisible buttons, selectable, treenode covering an area where subsequent items may need to be added. Note that both Selectable() and TreeNode() have dedicated flags doing this. */
    SetNextItemAllowOverlap(): void;
    /** is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options. */
    IsItemHovered(flags?: ImGuiHoveredFlags): boolean;
    /** is the last item active? (e.g. button being held, text field being edited. This will continuously return true while holding mouse button on an item. Items that don't interact will always return false) */
    IsItemActive(): boolean;
    /** is the last item focused for keyboard\/gamepad navigation? */
    IsItemFocused(): boolean;
    /** is the last item hovered and mouse clicked on? (**)  == IsMouseClicked(mouse_button) && IsItemHovered()Important. (**) this is NOT equivalent to the behavior of e.g. Button(). Read comments in function definition. */
    IsItemClicked(mouse_button?: ImGuiMouseButton): boolean;
    /** is the last item visible? (items may be out of sight because of clipping\/scrolling) */
    IsItemVisible(): boolean;
    /** did the last item modify its underlying value this frame? or was pressed? This is generally the same as the "bool" return value of many widgets. */
    IsItemEdited(): boolean;
    /** was the last item just made active (item was previously inactive). */
    IsItemActivated(): boolean;
    /** was the last item just made inactive (item was previously active). Useful for Undo\/Redo patterns with widgets that require continuous editing. */
    IsItemDeactivated(): boolean;
    /** was the last item just made inactive and made a value change when it was active? (e.g. Slider\/Drag moved). Useful for Undo\/Redo patterns with widgets that require continuous editing. Note that you may get false positives (some widgets such as Combo()\/ListBox()\/Selectable() will return true even when clicking an already selected item). */
    IsItemDeactivatedAfterEdit(): boolean;
    /** was the last item open state toggled? set by TreeNode(). */
    IsItemToggledOpen(): boolean;
    /** is any item hovered? */
    IsAnyItemHovered(): boolean;
    /** is any item active? */
    IsAnyItemActive(): boolean;
    /** is any item focused? */
    IsAnyItemFocused(): boolean;
    /** get upper-left bounding rectangle of the last item (screen space) */
    GetItemRectMin(): ImVec2;
    /** get lower-right bounding rectangle of the last item (screen space) */
    GetItemRectMax(): ImVec2;
    /** get size of last item */
    GetItemRectSize(): ImVec2;
    /** test if rectangle (of given size, starting from cursor position) is visible \/ not clipped. */
    IsRectVisibleBySize(size: ImVec2): boolean;
    /** test if rectangle (in screen space) is visible \/ not clipped. to perform coarse clipping on user's side. */
    IsRectVisible(rect_min: ImVec2, rect_max: ImVec2): boolean;
    /** get global imgui time. incremented by io.DeltaTime every frame. */
    GetTime(): number;
    /** get global imgui frame count. incremented by 1 every frame. */
    GetFrameCount(): number;
    /** you may use this when creating your own ImDrawList instances. */
    GetDrawListSharedData(): ImDrawListSharedData;
    /** get a string corresponding to the enum value (for display, saving, etc.). */
    GetStyleColorName(idx: ImGuiCol): string;
    /** Text Utilities */
    CalcTextSize(text: string, text_end?: string, hide_text_after_double_hash?: boolean, wrap_width?: number): ImVec2;
    /** is key being held. */
    IsKeyDown(key: ImGuiKey): boolean;
    /** was key pressed (went from !Down to Down)? if repeat=true, uses io.KeyRepeatDelay \/ KeyRepeatRate */
    IsKeyPressed(key: ImGuiKey, repeat?: boolean): boolean;
    /** was key released (went from Down to !Down)? */
    IsKeyReleased(key: ImGuiKey): boolean;
    /** was key chord (mods + key) pressed, e.g. you can pass 'ImGuiMod_Ctrl | ImGuiKey_S' as a key-chord. This doesn't do any routing or focus check, please consider using Shortcut() function instead. */
    IsKeyChordPressed(key_chord: ImGuiKeyChord): boolean;
    /** uses provided repeat rate\/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate */
    GetKeyPressedAmount(key: ImGuiKey, repeat_delay: number, rate: number): number;
    /** [DEBUG] returns English name of the key. Those names are provided for debugging purpose and are not meant to be saved persistently nor compared. */
    GetKeyName(key: ImGuiKey): string;
    /** Override io.WantCaptureKeyboard flag next frame (said flag is left for your application to handle, typically when true it instructs your app to ignore inputs). e.g. force capture keyboard when your widget is being hovered. This is equivalent to setting "io.WantCaptureKeyboard = want_capture_keyboard"; after the next NewFrame() call. */
    SetNextFrameWantCaptureKeyboard(want_capture_keyboard: boolean): void;
    /** Inputs Utilities: Shortcut Testing & Routing [BETA] */
    Shortcut(key_chord: ImGuiKeyChord, flags?: ImGuiInputFlags): boolean;
    SetNextItemShortcut(key_chord: ImGuiKeyChord, flags?: ImGuiInputFlags): void;
    /** Set key owner to last item ID if it is hovered or active. Equivalent to 'if (IsItemHovered() || IsItemActive()) { SetKeyOwner(key, GetItemID());'. */
    SetItemKeyOwner(key: ImGuiKey): void;
    /** is mouse button held? */
    IsMouseDown(button: ImGuiMouseButton): boolean;
    /** did mouse button clicked? (went from !Down to Down). Same as GetMouseClickedCount() == 1. */
    IsMouseClicked(button: ImGuiMouseButton, repeat?: boolean): boolean;
    /** did mouse button released? (went from Down to !Down) */
    IsMouseReleased(button: ImGuiMouseButton): boolean;
    /** did mouse button double-clicked? Same as GetMouseClickedCount() == 2. (note that a double-click will also report IsMouseClicked() == true) */
    IsMouseDoubleClicked(button: ImGuiMouseButton): boolean;
    /** delayed mouse release (use very sparingly!). Generally used with 'delay >= io.MouseDoubleClickTime' + combined with a 'io.MouseClickedLastCount==1' test. This is a very rarely used UI idiom, but some apps use this: e.g. MS Explorer single click on an icon to rename. */
    IsMouseReleasedWithDelay(button: ImGuiMouseButton, delay: number): boolean;
    /** return the number of successive mouse-clicks at the time where a click happen (otherwise 0). */
    GetMouseClickedCount(button: ImGuiMouseButton): number;
    /** is mouse hovering given bounding rect (in screen space). clipped by current clipping settings, but disregarding of other consideration of focus\/window ordering\/popup-block. */
    IsMouseHoveringRect(r_min: ImVec2, r_max: ImVec2, clip?: boolean): boolean;
    /** by convention we use (-FLT_MAX,-FLT_MAX) to denote that there is no mouse available */
    IsMousePosValid(mouse_pos?: ImVec2): boolean;
    /** [WILL OBSOLETE] is any mouse button held? This was designed for backends, but prefer having backend maintain a mask of held mouse buttons, because upcoming input queue system will make this invalid. */
    IsAnyMouseDown(): boolean;
    /** shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls */
    GetMousePos(): ImVec2;
    /** retrieve mouse position at the time of opening popup we have BeginPopup() into (helper to avoid user backing that value themselves) */
    GetMousePosOnOpeningCurrentPopup(): ImVec2;
    /** is mouse dragging? (uses io.MouseDraggingThreshold if lock_threshold < 0.0f) */
    IsMouseDragging(button: ImGuiMouseButton, lock_threshold?: number): boolean;
    /** return the delta from the initial clicking position while the mouse button is pressed or was just released. This is locked and return 0.0f until the mouse moves past a distance threshold at least once (uses io.MouseDraggingThreshold if lock_threshold < 0.0f) */
    GetMouseDragDelta(button?: ImGuiMouseButton, lock_threshold?: number): ImVec2;
    ResetMouseDragDelta(button?: ImGuiMouseButton): void;
    /** get desired mouse cursor shape. Important: reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you */
    GetMouseCursor(): ImGuiMouseCursor;
    /** set desired mouse cursor shape */
    SetMouseCursor(cursor_type: ImGuiMouseCursor): void;
    /** Override io.WantCaptureMouse flag next frame (said flag is left for your application to handle, typical when true it instructs your app to ignore inputs). This is equivalent to setting "io.WantCaptureMouse = want_capture_mouse;" after the next NewFrame() call. */
    SetNextFrameWantCaptureMouse(want_capture_mouse: boolean): void;
    /** Clipboard Utilities */
    GetClipboardText(): string;
    SetClipboardText(text: string): void;
    /** call in main loop. will call CreateWindow\/ResizeWindow\/etc. platform functions for each secondary viewport, and DestroyWindow for each inactive viewport. */
    UpdatePlatformWindows(): void;
}>;
export declare const ImGuiImplOpenGL3: {
    /** Initializes the OpenGL3 backend. */
    Init(): boolean;
    /** Shuts down the OpenGL3 backend. */
    Shutdown(): void;
    /** Starts a new OpenGL3 frame. */
    NewFrame(): void;
    /** Renders the OpenGL3 frame. */
    RenderDrawData(draw_data: ImDrawData): void;
};
export declare const ImGuiImplWGPU: {
    /** Initializes the WebGPU backend. */
    Init(): boolean;
    /** Shuts down the WebGPU backend. */
    Shutdown(): void;
    /** Starts a new WebGPU frame. */
    NewFrame(): void;
    /** Renders the WebGPU frame. */
    RenderDrawData(draw_data: ImDrawData, pass_encoder: GPURenderPassEncoder): void;
};
/** Web implementation of Jsimgui. */
export declare const ImGuiImplWeb: {
    /** Initialize Dear ImGui with WebGL2 Backend on the given canvas. */
    InitWebGL(canvas: HTMLCanvasElement): Promise<void>;
    /** Initialize Dear ImGui with WebGPU Backend on the given canvas. */
    InitWebGPU(canvas: HTMLCanvasElement, device: GPUDevice): Promise<void>;
    /** Begin a new ImGui WebGL frame. Call this at the beginning of your render loop. */
    BeginRenderWebGL(): void;
    /** Begin a new ImGui WebGPU frame. Call this at the beginning of your render loop. */
    BeginRenderWebGPU(): void;
    /** End the current ImGui WebGL frame. Call this at the end of your render loop. */
    EndRenderWebGL(): void;
    /** End the current ImGui WebGPU frame. Call this before passEncoder.end(). */
    EndRenderWebGPU(passEncoder: GPURenderPassEncoder): void;
    /** Load an image to be used on a WebGL canvas. Returns the texture id. */
    LoadImageWebGL(canvas: HTMLCanvasElement, image: HTMLImageElement): Promise<ImTextureID>;
    /** Load an image to be used on a WebGPU canvas. Returns the texture id. */
    LoadImageWebGPU(device: GPUDevice, image: HTMLImageElement): Promise<ImTextureID>;
};
export {};
