export const Mod = {
  // biome-ignore lint/suspicious/noExplicitAny: _
  export: null as any,

  async init(enableFreeType: boolean, extensions: boolean, loaderPath?: string): Promise<void> {
    // biome-ignore lint/suspicious/noExplicitAny: _
    let MainExport: any;

    if (loaderPath) {
      MainExport = await import(loaderPath);
    } else if (enableFreeType) {
      MainExport = extensions
        ? // @ts-expect-error
          await import("./loader-freetype-extensions.js")
        : // @ts-expect-error
          await import("./loader-freetype.js");
    } else {
      MainExport = extensions
        ? // @ts-expect-error
          await import("./loader-extensions.js")
        : // @ts-expect-error
          await import("./loader.js");
    }

    Mod.export = await MainExport.default();
  },
};

/**
 * Base class for value structs (passed by value, no native pointer).
 */
export class ValueStruct {}

/**
 * Base class for reference structs (carry native pointer/reference).
 * These structs manage native memory and require explicit cleanup.
 */
export class ReferenceStruct {
  /**
   * The native pointer to the struct.
   */
  // biome-ignore lint/suspicious/noExplicitAny: _
  ptr: any = null;

  /**
   * Construct a new JavaScript class instance and allocate native memory.
   */
  // biome-ignore lint/suspicious/noExplicitAny: _
  static New(): any {
    // biome-ignore lint/complexity/noThisInStatic: ...
    const obj = new this();
    // biome-ignore lint/complexity/noThisInStatic: ...
    obj.ptr = new Mod.export[this.name]();
    return obj;
  }

  /**
   * Create a JavaScript class instance from a native pointer.
   */
  // biome-ignore lint/suspicious/noExplicitAny: _
  static From(ptr: any): any {
    // biome-ignore lint/complexity/noThisInStatic: ...
    const obj = new this();
    obj.ptr = ptr;
    return obj;
  }

  /**
   * Free the struct's native allocated memory.
   */
  Drop(): void {
    this.ptr?.delete();
  }
}

/**
 * \/\/ Default: 16-bit (for maximum compatibility with renderer backends)
 */
export type ImDrawIdx = number;

// \/\/ Scalar data types

/**
 * \/\/ A unique ID used by widgets (typically the result of hashing a stack of string)
 */
export type ImGuiID = number;
/**
 * \/\/ 8-bit signed integer
 */
export type ImS8 = number;
/**
 * \/\/ 8-bit unsigned integer
 */
export type ImU8 = number;
/**
 * \/\/ 16-bit signed integer
 */
export type ImS16 = number;
/**
 * \/\/ 16-bit unsigned integer
 */
export type ImU16 = number;
/**
 * \/\/ 32-bit signed integer == int
 */
export type ImS32 = number;
/**
 * \/\/ 32-bit unsigned integer (often used to store packed colors)
 */
export type ImU32 = number;
/**
 * \/\/ 64-bit signed integer
 */
export type ImS64 = bigint;
/**
 * \/\/ 64-bit unsigned integer
 */
export type ImU64 = bigint;

// \/\/ Enumerations
// \/\/ - We don't use strongly typed enums much because they add constraints (can't extend in private code, can't store typed in bit fields, extra casting on iteration)
// \/\/ - Tip: Use your programming IDE navigation facilities on the names in the _central column_ below to find the actual flags\/enum lists!
// \/\/   - In Visual Studio: Ctrl+Comma ("Edit.GoToAll") can follow symbols inside comments, whereas Ctrl+F12 ("Edit.GoToImplementation") cannot.
// \/\/   - In Visual Studio w\/ Visual Assist installed: Alt+G ("VAssistX.GoToImplementation") can also follow symbols inside comments.
// \/\/   - In VS Code, CLion, etc.: Ctrl+Click can follow symbols inside comments.

/**
 * \/\/ -> enum ImGuiDir              \/\/ Enum: A cardinal direction (Left, Right, Up, Down)
 */
export type ImGuiDir = number;
/**
 * \/\/ -> enum ImGuiKey              \/\/ Enum: A key identifier (ImGuiKey_XXX or ImGuiMod_XXX value)
 */
export type ImGuiKey = number;
/**
 * \/\/ -> enum ImGuiMouseSource      \/\/ Enum; A mouse input source identifier (Mouse, TouchScreen, Pen)
 */
export type ImGuiMouseSource = number;
/**
 * \/\/ -> enum ImGuiSortDirection    \/\/ Enum: A sorting direction (ascending or descending)
 */
export type ImGuiSortDirection = ImU8;
/**
 * \/\/ -> enum ImGuiCol_             \/\/ Enum: A color identifier for styling
 */
export type ImGuiCol = number;
/**
 * \/\/ -> enum ImGuiCond_            \/\/ Enum: A condition for many Set*() functions
 */
export type ImGuiCond = number;
/**
 * \/\/ -> enum ImGuiDataType_        \/\/ Enum: A primary data type
 */
export type ImGuiDataType = number;
/**
 * \/\/ -> enum ImGuiMouseButton_     \/\/ Enum: A mouse button identifier (0=left, 1=right, 2=middle)
 */
export type ImGuiMouseButton = number;
/**
 * \/\/ -> enum ImGuiMouseCursor_     \/\/ Enum: A mouse cursor shape
 */
export type ImGuiMouseCursor = number;
/**
 * \/\/ -> enum ImGuiStyleVar_        \/\/ Enum: A variable identifier for styling
 */
export type ImGuiStyleVar = number;
/**
 * \/\/ -> enum ImGuiTableBgTarget_   \/\/ Enum: A color target for TableSetBgColor()
 */
export type ImGuiTableBgTarget = number;

// \/\/ Flags (declared as int to allow using as flags without overhead, and to not pollute the top of this file)
// \/\/ - Tip: Use your programming IDE navigation facilities on the names in the _central column_ below to find the actual flags\/enum lists!
// \/\/   - In Visual Studio: Ctrl+Comma ("Edit.GoToAll") can follow symbols inside comments, whereas Ctrl+F12 ("Edit.GoToImplementation") cannot.
// \/\/   - In Visual Studio w\/ Visual Assist installed: Alt+G ("VAssistX.GoToImplementation") can also follow symbols inside comments.
// \/\/   - In VS Code, CLion, etc.: Ctrl+Click can follow symbols inside comments.

/**
 * \/\/ -> enum ImDrawFlags_          \/\/ Flags: for ImDrawList functions
 */
export type ImDrawFlags = number;
/**
 * \/\/ -> enum ImDrawListFlags_      \/\/ Flags: for ImDrawList instance
 */
export type ImDrawListFlags = number;
/**
 * \/\/ -> enum ImDrawTextFlags_      \/\/ Internal, do not use!
 */
export type ImDrawTextFlags = number;
/**
 * \/\/ -> enum ImFontFlags_          \/\/ Flags: for ImFont
 */
export type ImFontFlags = number;
/**
 * \/\/ -> enum ImFontAtlasFlags_     \/\/ Flags: for ImFontAtlas
 */
export type ImFontAtlasFlags = number;
/**
 * \/\/ -> enum ImGuiBackendFlags_    \/\/ Flags: for io.BackendFlags
 */
export type ImGuiBackendFlags = number;
/**
 * \/\/ -> enum ImGuiButtonFlags_     \/\/ Flags: for InvisibleButton()
 */
export type ImGuiButtonFlags = number;
/**
 * \/\/ -> enum ImGuiChildFlags_      \/\/ Flags: for BeginChild()
 */
export type ImGuiChildFlags = number;
/**
 * \/\/ -> enum ImGuiColorEditFlags_  \/\/ Flags: for ColorEdit4(), ColorPicker4() etc.
 */
export type ImGuiColorEditFlags = number;
/**
 * \/\/ -> enum ImGuiConfigFlags_     \/\/ Flags: for io.ConfigFlags
 */
export type ImGuiConfigFlags = number;
/**
 * \/\/ -> enum ImGuiComboFlags_      \/\/ Flags: for BeginCombo()
 */
export type ImGuiComboFlags = number;
/**
 * \/\/ -> enum ImGuiDockNodeFlags_   \/\/ Flags: for DockSpace()
 */
export type ImGuiDockNodeFlags = number;
/**
 * \/\/ -> enum ImGuiDragDropFlags_   \/\/ Flags: for BeginDragDropSource(), AcceptDragDropPayload()
 */
export type ImGuiDragDropFlags = number;
/**
 * \/\/ -> enum ImGuiFocusedFlags_    \/\/ Flags: for IsWindowFocused()
 */
export type ImGuiFocusedFlags = number;
/**
 * \/\/ -> enum ImGuiHoveredFlags_    \/\/ Flags: for IsItemHovered(), IsWindowHovered() etc.
 */
export type ImGuiHoveredFlags = number;
/**
 * \/\/ -> enum ImGuiInputFlags_      \/\/ Flags: for Shortcut(), SetNextItemShortcut()
 */
export type ImGuiInputFlags = number;
/**
 * \/\/ -> enum ImGuiInputTextFlags_  \/\/ Flags: for InputText(), InputTextMultiline()
 */
export type ImGuiInputTextFlags = number;
/**
 * \/\/ -> enum ImGuiItemFlags_       \/\/ Flags: for PushItemFlag(), shared by all items
 */
export type ImGuiItemFlags = number;
/**
 * \/\/ -> ImGuiKey | ImGuiMod_XXX    \/\/ Flags: for IsKeyChordPressed(), Shortcut() etc. an ImGuiKey optionally OR-ed with one or more ImGuiMod_XXX values.
 */
export type ImGuiKeyChord = number;
/**
 * \/\/ -> enum ImGuiListClipperFlags_\/\/ Flags: for ImGuiListClipper
 */
export type ImGuiListClipperFlags = number;
/**
 * \/\/ -> enum ImGuiPopupFlags_      \/\/ Flags: for OpenPopup*(), BeginPopupContext*(), IsPopupOpen()
 */
export type ImGuiPopupFlags = number;
/**
 * \/\/ -> enum ImGuiMultiSelectFlags_\/\/ Flags: for BeginMultiSelect()
 */
export type ImGuiMultiSelectFlags = number;
/**
 * \/\/ -> enum ImGuiSelectableFlags_ \/\/ Flags: for Selectable()
 */
export type ImGuiSelectableFlags = number;
/**
 * \/\/ -> enum ImGuiSliderFlags_     \/\/ Flags: for DragFloat(), DragInt(), SliderFloat(), SliderInt() etc.
 */
export type ImGuiSliderFlags = number;
/**
 * \/\/ -> enum ImGuiTabBarFlags_     \/\/ Flags: for BeginTabBar()
 */
export type ImGuiTabBarFlags = number;
/**
 * \/\/ -> enum ImGuiTabItemFlags_    \/\/ Flags: for BeginTabItem()
 */
export type ImGuiTabItemFlags = number;
/**
 * \/\/ -> enum ImGuiTableFlags_      \/\/ Flags: For BeginTable()
 */
export type ImGuiTableFlags = number;
/**
 * \/\/ -> enum ImGuiTableColumnFlags_\/\/ Flags: For TableSetupColumn()
 */
export type ImGuiTableColumnFlags = number;
/**
 * \/\/ -> enum ImGuiTableRowFlags_   \/\/ Flags: For TableNextRow()
 */
export type ImGuiTableRowFlags = number;
/**
 * \/\/ -> enum ImGuiTreeNodeFlags_   \/\/ Flags: for TreeNode(), TreeNodeEx(), CollapsingHeader()
 */
export type ImGuiTreeNodeFlags = number;
/**
 * \/\/ -> enum ImGuiViewportFlags_   \/\/ Flags: for ImGuiViewport
 */
export type ImGuiViewportFlags = number;
/**
 * \/\/ -> enum ImGuiWindowFlags_     \/\/ Flags: for Begin(), BeginChild()
 */
export type ImGuiWindowFlags = number;

// \/\/ Character types
// \/\/ (we generally use UTF-8 encoded string in the API. This is storage specifically for a decoded character used for keyboard input and display)

/**
 * \/\/ A single decoded U32 character\/code point. We encode them as multi bytes UTF-8 when used in strings.
 */
export type ImWchar32 = number;
/**
 * \/\/ A single decoded U16 character\/code point. We encode them as multi bytes UTF-8 when used in strings.
 */
export type ImWchar16 = number;
/**
 * \/\/ Multi-Selection item index or identifier when using BeginMultiSelect()
 * \/\/ - Used by SetNextItemSelectionUserData() + and inside ImGuiMultiSelectIO structure.
 * \/\/ - Most users are likely to use this store an item INDEX but this may be used to store a POINTER\/ID as well. Read comments near ImGuiMultiSelectIO for details.
 */
export type ImGuiSelectionUserData = ImS64;
export type ImGuiInputTextCallback = (data: ImGuiInputTextCallbackData) => number;
export type ImGuiSizeCallback = (data: ImGuiSizeCallbackData) => void;
/**
 * \/\/ Default: store up to 64-bits (any pointer or integer). A majority of backends are ok with that.
 */
export type ImTextureID = ImU64;
export type ImDrawCallback = (parent_list: ImDrawList, cmd: ImDrawCmd) => void;
/**
 * \/\/ An opaque identifier to a rectangle in the atlas. -1 when invalid.
 * \/\/ The rectangle may move and UV may be invalidated, use GetCustomRect() to retrieve it.
 */
export type ImFontAtlasRectId = number;
export type ImWchar = number;
const IM_COL32_WHITE = 0xffffffff;

export class ImVec2 extends ValueStruct {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
  static From(obj: { x: number; y: number }): ImVec2 {
    return new ImVec2(obj.x, obj.y);
  }
}
/**
 * ImVec4: 4D vector used to store clipping rectangles, colors etc. [Compile-time configurable type]
 */
export class ImVec4 extends ValueStruct {
  x: number;
  y: number;
  z: number;
  w: number;
  constructor(x: number, y: number, z: number, w: number) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  static From(obj: { x: number; y: number; z: number; w: number }): ImVec4 {
    return new ImVec4(obj.x, obj.y, obj.z, obj.w);
  }
}
export class ImTextureRef extends ValueStruct {
  _TexID: ImTextureID;
  constructor(_TexID: ImTextureID) {
    super();
    this._TexID = _TexID;
  }
  static From(obj: { _TexID: ImTextureID }): ImTextureRef {
    return new ImTextureRef(obj._TexID);
  }
} /**
 * \/\/ Data shared among multiple draw lists (typically owned by parent ImGui context, but you may create one yourself)
 */
export class ImDrawListSharedData extends ReferenceStruct {}
/**
 * \/\/ Opaque storage for building a ImFontAtlas
 */
export class ImFontAtlasBuilder extends ReferenceStruct {}
/**
 * \/\/ Opaque interface to a font loading backend (stb_truetype, FreeType etc.).
 */
export class ImFontLoader extends ReferenceStruct {}

// \/\/ Forward declarations: ImGui layer

/**
 * \/\/ Dear ImGui context (opaque structure, unless including imgui_internal.h)
 */
export class ImGuiContext extends ReferenceStruct {}
/**
 * \/\/ Sorting specifications for a table (often handling sort specs for a single column, occasionally more)
 * \/\/ Obtained by calling TableGetSortSpecs().
 * \/\/ When 'SpecsDirty == true' you can sort your data. It will be true with sorting specs have changed since last call, or the first time.
 * \/\/ Make sure to set 'SpecsDirty = false' after sorting, else you may wastefully sort your data every frame!
 */
export class ImGuiTableSortSpecs extends ReferenceStruct {
  /**
   * \/\/ Pointer to sort spec array.
   */
  get Specs(): ImGuiTableColumnSortSpecs {
    return ImGuiTableColumnSortSpecs.From(this.ptr.get_Specs());
  }
  set Specs(v: ImGuiTableColumnSortSpecs) {
    this.ptr.set_Specs(v);
  }
  /**
   * \/\/ Sort spec count. Most often 1. May be > 1 when ImGuiTableFlags_SortMulti is enabled. May be == 0 when ImGuiTableFlags_SortTristate is enabled.
   */
  get SpecsCount(): number {
    return this.ptr.get_SpecsCount();
  }
  set SpecsCount(v: number) {
    this.ptr.set_SpecsCount(v);
  }
  /**
   * \/\/ Set to true when specs have changed since last time! Use this to sort again, then clear the flag.
   */
  get SpecsDirty(): boolean {
    return this.ptr.get_SpecsDirty();
  }
  set SpecsDirty(v: boolean) {
    this.ptr.set_SpecsDirty(v);
  }
}
/**
 * \/\/ Sorting specification for one column of a table (sizeof == 12 bytes)
 */
export class ImGuiTableColumnSortSpecs extends ReferenceStruct {
  /**
   * \/\/ User id of the column (if specified by a TableSetupColumn() call)
   */
  get ColumnUserID(): ImGuiID {
    return this.ptr.get_ColumnUserID();
  }
  set ColumnUserID(v: ImGuiID) {
    this.ptr.set_ColumnUserID(v);
  }
  /**
   * \/\/ Index of the column
   */
  get ColumnIndex(): ImS16 {
    return this.ptr.get_ColumnIndex();
  }
  set ColumnIndex(v: ImS16) {
    this.ptr.set_ColumnIndex(v);
  }
  /**
   * \/\/ Index within parent ImGuiTableSortSpecs (always stored in order starting from 0, tables sorted on a single criteria will always have a 0 here)
   */
  get SortOrder(): ImS16 {
    return this.ptr.get_SortOrder();
  }
  set SortOrder(v: ImS16) {
    this.ptr.set_SortOrder(v);
  }
  /**
   * \/\/ ImGuiSortDirection_Ascending or ImGuiSortDirection_Descending
   */
  get SortDirection(): ImGuiSortDirection {
    return this.ptr.get_SortDirection();
  }
  set SortDirection(v: ImGuiSortDirection) {
    this.ptr.set_SortDirection(v);
  }
}
export class ImGuiStyle extends ReferenceStruct {
  // \/\/ Font scaling
  // \/\/ - recap: ImGui::GetFontSize() == FontSizeBase * (FontScaleMain * FontScaleDpi * other_scaling_factors)

  /**
   * \/\/ Current base font size before external global factors are applied. Use PushFont(NULL, size) to modify. Use ImGui::GetFontSize() to obtain scaled value.
   */
  get FontSizeBase(): number {
    return this.ptr.get_FontSizeBase();
  }
  set FontSizeBase(v: number) {
    this.ptr.set_FontSizeBase(v);
  }
  /**
   * \/\/ Main global scale factor. May be set by application once, or exposed to end-user.
   */
  get FontScaleMain(): number {
    return this.ptr.get_FontScaleMain();
  }
  set FontScaleMain(v: number) {
    this.ptr.set_FontScaleMain(v);
  }
  /**
   * \/\/ Additional global scale factor from viewport\/monitor contents scale. In docking branch: when io.ConfigDpiScaleFonts is enabled, this is automatically overwritten when changing monitor DPI.
   */
  get FontScaleDpi(): number {
    return this.ptr.get_FontScaleDpi();
  }
  set FontScaleDpi(v: number) {
    this.ptr.set_FontScaleDpi(v);
  }
  /**
   * \/\/ Global alpha applies to everything in Dear ImGui.
   */
  get Alpha(): number {
    return this.ptr.get_Alpha();
  }
  set Alpha(v: number) {
    this.ptr.set_Alpha(v);
  }
  /**
   * \/\/ Additional alpha multiplier applied by BeginDisabled(). Multiply over current value of Alpha.
   */
  get DisabledAlpha(): number {
    return this.ptr.get_DisabledAlpha();
  }
  set DisabledAlpha(v: number) {
    this.ptr.set_DisabledAlpha(v);
  }
  /**
   * \/\/ Padding within a window.
   */
  get WindowPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_WindowPadding());
  }
  set WindowPadding(v: ImVec2) {
    this.ptr.set_WindowPadding(v);
  }
  /**
   * \/\/ Radius of window corners rounding. Set to 0.0f to have rectangular windows. Large values tend to lead to variety of artifacts and are not recommended.
   */
  get WindowRounding(): number {
    return this.ptr.get_WindowRounding();
  }
  set WindowRounding(v: number) {
    this.ptr.set_WindowRounding(v);
  }
  /**
   * \/\/ Thickness of border around windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly).
   */
  get WindowBorderSize(): number {
    return this.ptr.get_WindowBorderSize();
  }
  set WindowBorderSize(v: number) {
    this.ptr.set_WindowBorderSize(v);
  }
  /**
   * \/\/ Hit-testing extent outside\/inside resizing border. Also extend determination of hovered window. Generally meaningfully larger than WindowBorderSize to make it easy to reach borders.
   */
  get WindowBorderHoverPadding(): number {
    return this.ptr.get_WindowBorderHoverPadding();
  }
  set WindowBorderHoverPadding(v: number) {
    this.ptr.set_WindowBorderHoverPadding(v);
  }
  /**
   * \/\/ Minimum window size. This is a global setting. If you want to constrain individual windows, use SetNextWindowSizeConstraints().
   */
  get WindowMinSize(): ImVec2 {
    return ImVec2.From(this.ptr.get_WindowMinSize());
  }
  set WindowMinSize(v: ImVec2) {
    this.ptr.set_WindowMinSize(v);
  }
  /**
   * \/\/ Alignment for title bar text. Defaults to (0.0f,0.5f) for left-aligned,vertically centered.
   */
  get WindowTitleAlign(): ImVec2 {
    return ImVec2.From(this.ptr.get_WindowTitleAlign());
  }
  set WindowTitleAlign(v: ImVec2) {
    this.ptr.set_WindowTitleAlign(v);
  }
  /**
   * \/\/ Side of the collapsing\/docking button in the title bar (None\/Left\/Right). Defaults to ImGuiDir_Left.
   */
  get WindowMenuButtonPosition(): ImGuiDir {
    return this.ptr.get_WindowMenuButtonPosition();
  }
  set WindowMenuButtonPosition(v: ImGuiDir) {
    this.ptr.set_WindowMenuButtonPosition(v);
  }
  /**
   * \/\/ Radius of child window corners rounding. Set to 0.0f to have rectangular windows.
   */
  get ChildRounding(): number {
    return this.ptr.get_ChildRounding();
  }
  set ChildRounding(v: number) {
    this.ptr.set_ChildRounding(v);
  }
  /**
   * \/\/ Thickness of border around child windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly).
   */
  get ChildBorderSize(): number {
    return this.ptr.get_ChildBorderSize();
  }
  set ChildBorderSize(v: number) {
    this.ptr.set_ChildBorderSize(v);
  }
  /**
   * \/\/ Radius of popup window corners rounding. (Note that tooltip windows use WindowRounding)
   */
  get PopupRounding(): number {
    return this.ptr.get_PopupRounding();
  }
  set PopupRounding(v: number) {
    this.ptr.set_PopupRounding(v);
  }
  /**
   * \/\/ Thickness of border around popup\/tooltip windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly).
   */
  get PopupBorderSize(): number {
    return this.ptr.get_PopupBorderSize();
  }
  set PopupBorderSize(v: number) {
    this.ptr.set_PopupBorderSize(v);
  }
  /**
   * \/\/ Padding within a framed rectangle (used by most widgets).
   */
  get FramePadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_FramePadding());
  }
  set FramePadding(v: ImVec2) {
    this.ptr.set_FramePadding(v);
  }
  /**
   * \/\/ Radius of frame corners rounding. Set to 0.0f to have rectangular frame (used by most widgets).
   */
  get FrameRounding(): number {
    return this.ptr.get_FrameRounding();
  }
  set FrameRounding(v: number) {
    this.ptr.set_FrameRounding(v);
  }
  /**
   * \/\/ Thickness of border around frames. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly).
   */
  get FrameBorderSize(): number {
    return this.ptr.get_FrameBorderSize();
  }
  set FrameBorderSize(v: number) {
    this.ptr.set_FrameBorderSize(v);
  }
  /**
   * \/\/ Horizontal and vertical spacing between widgets\/lines.
   */
  get ItemSpacing(): ImVec2 {
    return ImVec2.From(this.ptr.get_ItemSpacing());
  }
  set ItemSpacing(v: ImVec2) {
    this.ptr.set_ItemSpacing(v);
  }
  /**
   * \/\/ Horizontal and vertical spacing between within elements of a composed widget (e.g. a slider and its label).
   */
  get ItemInnerSpacing(): ImVec2 {
    return ImVec2.From(this.ptr.get_ItemInnerSpacing());
  }
  set ItemInnerSpacing(v: ImVec2) {
    this.ptr.set_ItemInnerSpacing(v);
  }
  /**
   * \/\/ Padding within a table cell. Cellpadding.x is locked for entire table. CellPadding.y may be altered between different rows.
   */
  get CellPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_CellPadding());
  }
  set CellPadding(v: ImVec2) {
    this.ptr.set_CellPadding(v);
  }
  /**
   * \/\/ Expand reactive bounding box for touch-based system where touch position is not accurate enough. Unfortunately we don't sort widgets so priority on overlap will always be given to the first widget. So don't grow this too much!
   */
  get TouchExtraPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_TouchExtraPadding());
  }
  set TouchExtraPadding(v: ImVec2) {
    this.ptr.set_TouchExtraPadding(v);
  }
  /**
   * \/\/ Horizontal indentation when e.g. entering a tree node. Generally == (FontSize + FramePadding.x*2).
   */
  get IndentSpacing(): number {
    return this.ptr.get_IndentSpacing();
  }
  set IndentSpacing(v: number) {
    this.ptr.set_IndentSpacing(v);
  }
  /**
   * \/\/ Minimum horizontal spacing between two columns. Preferably > (FramePadding.x + 1).
   */
  get ColumnsMinSpacing(): number {
    return this.ptr.get_ColumnsMinSpacing();
  }
  set ColumnsMinSpacing(v: number) {
    this.ptr.set_ColumnsMinSpacing(v);
  }
  /**
   * \/\/ Width of the vertical scrollbar, Height of the horizontal scrollbar.
   */
  get ScrollbarSize(): number {
    return this.ptr.get_ScrollbarSize();
  }
  set ScrollbarSize(v: number) {
    this.ptr.set_ScrollbarSize(v);
  }
  /**
   * \/\/ Radius of grab corners for scrollbar.
   */
  get ScrollbarRounding(): number {
    return this.ptr.get_ScrollbarRounding();
  }
  set ScrollbarRounding(v: number) {
    this.ptr.set_ScrollbarRounding(v);
  }
  /**
   * \/\/ Padding of scrollbar grab within its frame (same for both axes).
   */
  get ScrollbarPadding(): number {
    return this.ptr.get_ScrollbarPadding();
  }
  set ScrollbarPadding(v: number) {
    this.ptr.set_ScrollbarPadding(v);
  }
  /**
   * \/\/ Minimum width\/height of a grab box for slider\/scrollbar.
   */
  get GrabMinSize(): number {
    return this.ptr.get_GrabMinSize();
  }
  set GrabMinSize(v: number) {
    this.ptr.set_GrabMinSize(v);
  }
  /**
   * \/\/ Radius of grabs corners rounding. Set to 0.0f to have rectangular slider grabs.
   */
  get GrabRounding(): number {
    return this.ptr.get_GrabRounding();
  }
  set GrabRounding(v: number) {
    this.ptr.set_GrabRounding(v);
  }
  /**
   * \/\/ The size in pixels of the dead-zone around zero on logarithmic sliders that cross zero.
   */
  get LogSliderDeadzone(): number {
    return this.ptr.get_LogSliderDeadzone();
  }
  set LogSliderDeadzone(v: number) {
    this.ptr.set_LogSliderDeadzone(v);
  }
  /**
   * \/\/ Rounding of Image() calls.
   */
  get ImageRounding(): number {
    return this.ptr.get_ImageRounding();
  }
  set ImageRounding(v: number) {
    this.ptr.set_ImageRounding(v);
  }
  /**
   * \/\/ Thickness of border around Image() calls.
   */
  get ImageBorderSize(): number {
    return this.ptr.get_ImageBorderSize();
  }
  set ImageBorderSize(v: number) {
    this.ptr.set_ImageBorderSize(v);
  }
  /**
   * \/\/ Radius of upper corners of a tab. Set to 0.0f to have rectangular tabs.
   */
  get TabRounding(): number {
    return this.ptr.get_TabRounding();
  }
  set TabRounding(v: number) {
    this.ptr.set_TabRounding(v);
  }
  /**
   * \/\/ Thickness of border around tabs.
   */
  get TabBorderSize(): number {
    return this.ptr.get_TabBorderSize();
  }
  set TabBorderSize(v: number) {
    this.ptr.set_TabBorderSize(v);
  }
  /**
   * \/\/ Minimum tab width, to make tabs larger than their contents. TabBar buttons are not affected.
   */
  get TabMinWidthBase(): number {
    return this.ptr.get_TabMinWidthBase();
  }
  set TabMinWidthBase(v: number) {
    this.ptr.set_TabMinWidthBase(v);
  }
  /**
   * \/\/ Minimum tab width after shrinking, when using ImGuiTabBarFlags_FittingPolicyMixed policy.
   */
  get TabMinWidthShrink(): number {
    return this.ptr.get_TabMinWidthShrink();
  }
  set TabMinWidthShrink(v: number) {
    this.ptr.set_TabMinWidthShrink(v);
  }
  /**
   * \/\/ -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width.
   */
  get TabCloseButtonMinWidthSelected(): number {
    return this.ptr.get_TabCloseButtonMinWidthSelected();
  }
  set TabCloseButtonMinWidthSelected(v: number) {
    this.ptr.set_TabCloseButtonMinWidthSelected(v);
  }
  /**
   * \/\/ -1: always visible. 0.0f: visible when hovered. >0.0f: visible when hovered if minimum width. FLT_MAX: never show close button when unselected.
   */
  get TabCloseButtonMinWidthUnselected(): number {
    return this.ptr.get_TabCloseButtonMinWidthUnselected();
  }
  set TabCloseButtonMinWidthUnselected(v: number) {
    this.ptr.set_TabCloseButtonMinWidthUnselected(v);
  }
  /**
   * \/\/ Thickness of tab-bar separator, which takes on the tab active color to denote focus.
   */
  get TabBarBorderSize(): number {
    return this.ptr.get_TabBarBorderSize();
  }
  set TabBarBorderSize(v: number) {
    this.ptr.set_TabBarBorderSize(v);
  }
  /**
   * \/\/ Thickness of tab-bar overline, which highlights the selected tab-bar.
   */
  get TabBarOverlineSize(): number {
    return this.ptr.get_TabBarOverlineSize();
  }
  set TabBarOverlineSize(v: number) {
    this.ptr.set_TabBarOverlineSize(v);
  }
  /**
   * \/\/ Angle of angled headers (supported values range from -50.0f degrees to +50.0f degrees).
   */
  get TableAngledHeadersAngle(): number {
    return this.ptr.get_TableAngledHeadersAngle();
  }
  set TableAngledHeadersAngle(v: number) {
    this.ptr.set_TableAngledHeadersAngle(v);
  }
  /**
   * \/\/ Alignment of angled headers within the cell
   */
  get TableAngledHeadersTextAlign(): ImVec2 {
    return ImVec2.From(this.ptr.get_TableAngledHeadersTextAlign());
  }
  set TableAngledHeadersTextAlign(v: ImVec2) {
    this.ptr.set_TableAngledHeadersTextAlign(v);
  }
  /**
   * \/\/ Default way to draw lines connecting TreeNode hierarchy. ImGuiTreeNodeFlags_DrawLinesNone or ImGuiTreeNodeFlags_DrawLinesFull or ImGuiTreeNodeFlags_DrawLinesToNodes.
   */
  get TreeLinesFlags(): ImGuiTreeNodeFlags {
    return this.ptr.get_TreeLinesFlags();
  }
  set TreeLinesFlags(v: ImGuiTreeNodeFlags) {
    this.ptr.set_TreeLinesFlags(v);
  }
  /**
   * \/\/ Thickness of outlines when using ImGuiTreeNodeFlags_DrawLines.
   */
  get TreeLinesSize(): number {
    return this.ptr.get_TreeLinesSize();
  }
  set TreeLinesSize(v: number) {
    this.ptr.set_TreeLinesSize(v);
  }
  /**
   * \/\/ Radius of lines connecting child nodes to the vertical line.
   */
  get TreeLinesRounding(): number {
    return this.ptr.get_TreeLinesRounding();
  }
  set TreeLinesRounding(v: number) {
    this.ptr.set_TreeLinesRounding(v);
  }
  /**
   * \/\/ Radius of the drag and drop target frame.
   */
  get DragDropTargetRounding(): number {
    return this.ptr.get_DragDropTargetRounding();
  }
  set DragDropTargetRounding(v: number) {
    this.ptr.set_DragDropTargetRounding(v);
  }
  /**
   * \/\/ Thickness of the drag and drop target border.
   */
  get DragDropTargetBorderSize(): number {
    return this.ptr.get_DragDropTargetBorderSize();
  }
  set DragDropTargetBorderSize(v: number) {
    this.ptr.set_DragDropTargetBorderSize(v);
  }
  /**
   * \/\/ Size to expand the drag and drop target from actual target item size.
   */
  get DragDropTargetPadding(): number {
    return this.ptr.get_DragDropTargetPadding();
  }
  set DragDropTargetPadding(v: number) {
    this.ptr.set_DragDropTargetPadding(v);
  }
  /**
   * \/\/ Size of R\/G\/B\/A color markers for ColorEdit4() and for Drags\/Sliders when using ImGuiSliderFlags_ColorMarkers.
   */
  get ColorMarkerSize(): number {
    return this.ptr.get_ColorMarkerSize();
  }
  set ColorMarkerSize(v: number) {
    this.ptr.set_ColorMarkerSize(v);
  }
  /**
   * \/\/ Side of the color button in the ColorEdit4 widget (left\/right). Defaults to ImGuiDir_Right.
   */
  get ColorButtonPosition(): ImGuiDir {
    return this.ptr.get_ColorButtonPosition();
  }
  set ColorButtonPosition(v: ImGuiDir) {
    this.ptr.set_ColorButtonPosition(v);
  }
  /**
   * \/\/ Alignment of button text when button is larger than text. Defaults to (0.5f, 0.5f) (centered).
   */
  get ButtonTextAlign(): ImVec2 {
    return ImVec2.From(this.ptr.get_ButtonTextAlign());
  }
  set ButtonTextAlign(v: ImVec2) {
    this.ptr.set_ButtonTextAlign(v);
  }
  /**
   * \/\/ Alignment of selectable text. Defaults to (0.0f, 0.0f) (top-left aligned). It's generally important to keep this left-aligned if you want to lay multiple items on a same line.
   */
  get SelectableTextAlign(): ImVec2 {
    return ImVec2.From(this.ptr.get_SelectableTextAlign());
  }
  set SelectableTextAlign(v: ImVec2) {
    this.ptr.set_SelectableTextAlign(v);
  }
  /**
   * \/\/ Thickness of border in Separator()
   */
  get SeparatorSize(): number {
    return this.ptr.get_SeparatorSize();
  }
  set SeparatorSize(v: number) {
    this.ptr.set_SeparatorSize(v);
  }
  /**
   * \/\/ Thickness of border in SeparatorText()
   */
  get SeparatorTextBorderSize(): number {
    return this.ptr.get_SeparatorTextBorderSize();
  }
  set SeparatorTextBorderSize(v: number) {
    this.ptr.set_SeparatorTextBorderSize(v);
  }
  /**
   * \/\/ Alignment of text within the separator. Defaults to (0.0f, 0.5f) (left aligned, center).
   */
  get SeparatorTextAlign(): ImVec2 {
    return ImVec2.From(this.ptr.get_SeparatorTextAlign());
  }
  set SeparatorTextAlign(v: ImVec2) {
    this.ptr.set_SeparatorTextAlign(v);
  }
  /**
   * \/\/ Horizontal offset of text from each edge of the separator + spacing on other axis. Generally small values. .y is recommended to be == FramePadding.y.
   */
  get SeparatorTextPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_SeparatorTextPadding());
  }
  set SeparatorTextPadding(v: ImVec2) {
    this.ptr.set_SeparatorTextPadding(v);
  }
  /**
   * \/\/ Apply to regular windows: amount which we enforce to keep visible when moving near edges of your screen.
   */
  get DisplayWindowPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_DisplayWindowPadding());
  }
  set DisplayWindowPadding(v: ImVec2) {
    this.ptr.set_DisplayWindowPadding(v);
  }
  /**
   * \/\/ Apply to every windows, menus, popups, tooltips: amount where we avoid displaying contents. Adjust if you cannot see the edges of your screen (e.g. on a TV where scaling has not been configured).
   */
  get DisplaySafeAreaPadding(): ImVec2 {
    return ImVec2.From(this.ptr.get_DisplaySafeAreaPadding());
  }
  set DisplaySafeAreaPadding(v: ImVec2) {
    this.ptr.set_DisplaySafeAreaPadding(v);
  }
  /**
   * \/\/ Docking node has their own CloseButton() to close all docked windows.
   */
  get DockingNodeHasCloseButton(): boolean {
    return this.ptr.get_DockingNodeHasCloseButton();
  }
  set DockingNodeHasCloseButton(v: boolean) {
    this.ptr.set_DockingNodeHasCloseButton(v);
  }
  /**
   * \/\/ Thickness of resizing border between docked windows
   */
  get DockingSeparatorSize(): number {
    return this.ptr.get_DockingSeparatorSize();
  }
  set DockingSeparatorSize(v: number) {
    this.ptr.set_DockingSeparatorSize(v);
  }
  /**
   * \/\/ Scale software rendered mouse cursor (when io.MouseDrawCursor is enabled). We apply per-monitor DPI scaling over this scale. May be removed later.
   */
  get MouseCursorScale(): number {
    return this.ptr.get_MouseCursorScale();
  }
  set MouseCursorScale(v: number) {
    this.ptr.set_MouseCursorScale(v);
  }
  /**
   * \/\/ Enable anti-aliased lines\/borders. Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList).
   */
  get AntiAliasedLines(): boolean {
    return this.ptr.get_AntiAliasedLines();
  }
  set AntiAliasedLines(v: boolean) {
    this.ptr.set_AntiAliasedLines(v);
  }
  /**
   * \/\/ Enable anti-aliased lines\/borders using textures where possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). Latched at the beginning of the frame (copied to ImDrawList).
   */
  get AntiAliasedLinesUseTex(): boolean {
    return this.ptr.get_AntiAliasedLinesUseTex();
  }
  set AntiAliasedLinesUseTex(v: boolean) {
    this.ptr.set_AntiAliasedLinesUseTex(v);
  }
  /**
   * \/\/ Enable anti-aliased edges around filled shapes (rounded rectangles, circles, etc.). Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList).
   */
  get AntiAliasedFill(): boolean {
    return this.ptr.get_AntiAliasedFill();
  }
  set AntiAliasedFill(v: boolean) {
    this.ptr.set_AntiAliasedFill(v);
  }
  /**
   * \/\/ Tessellation tolerance when using PathBezierCurveTo() without a specific number of segments. Decrease for highly tessellated curves (higher quality, more polygons), increase to reduce quality.
   */
  get CurveTessellationTol(): number {
    return this.ptr.get_CurveTessellationTol();
  }
  set CurveTessellationTol(v: number) {
    this.ptr.set_CurveTessellationTol(v);
  }
  /**
   * \/\/ Maximum error (in pixels) allowed when using AddCircle()\/AddCircleFilled() or drawing rounded corner rectangles with no explicit segment count specified. Decrease for higher quality but more geometry.
   */
  get CircleTessellationMaxError(): number {
    return this.ptr.get_CircleTessellationMaxError();
  }
  set CircleTessellationMaxError(v: number) {
    this.ptr.set_CircleTessellationMaxError(v);
  }
  get Colors(): ImVec4[] {
    return this.ptr.get_Colors();
  }

  set Colors(v: ImVec4[]) {
    this.ptr.set_Colors(v);
  }

  // \/\/ Behaviors
  // \/\/ (It is possible to modify those fields mid-frame if specific behavior need it, unlike e.g. configuration fields in ImGuiIO)

  /**
   * \/\/ Delay for IsItemHovered(ImGuiHoveredFlags_Stationary). Time required to consider mouse stationary.
   */
  get HoverStationaryDelay(): number {
    return this.ptr.get_HoverStationaryDelay();
  }
  set HoverStationaryDelay(v: number) {
    this.ptr.set_HoverStationaryDelay(v);
  }
  /**
   * \/\/ Delay for IsItemHovered(ImGuiHoveredFlags_DelayShort). Usually used along with HoverStationaryDelay.
   */
  get HoverDelayShort(): number {
    return this.ptr.get_HoverDelayShort();
  }
  set HoverDelayShort(v: number) {
    this.ptr.set_HoverDelayShort(v);
  }
  /**
   * \/\/ Delay for IsItemHovered(ImGuiHoveredFlags_DelayNormal). "
   */
  get HoverDelayNormal(): number {
    return this.ptr.get_HoverDelayNormal();
  }
  set HoverDelayNormal(v: number) {
    this.ptr.set_HoverDelayNormal(v);
  }
  /**
   * \/\/ Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using mouse.
   */
  get HoverFlagsForTooltipMouse(): ImGuiHoveredFlags {
    return this.ptr.get_HoverFlagsForTooltipMouse();
  }
  set HoverFlagsForTooltipMouse(v: ImGuiHoveredFlags) {
    this.ptr.set_HoverFlagsForTooltipMouse(v);
  }
  /**
   * \/\/ Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using keyboard\/gamepad.
   */
  get HoverFlagsForTooltipNav(): ImGuiHoveredFlags {
    return this.ptr.get_HoverFlagsForTooltipNav();
  }
  set HoverFlagsForTooltipNav(v: ImGuiHoveredFlags) {
    this.ptr.set_HoverFlagsForTooltipNav(v);
  }

  /**
   * \/\/ Scale all spacing\/padding\/thickness values. Do not scale fonts.
   */
  ScaleAllSizes(scale_factor: number): void {
    this.ptr.ImGuiStyle_ScaleAllSizes(scale_factor);
  }
}
export class ImGuiIO extends ReferenceStruct {
  /**
   * \/\/ = 0              \/\/ See ImGuiConfigFlags_ enum. Set by user\/application. Keyboard\/Gamepad navigation options, etc.
   */
  get ConfigFlags(): ImGuiConfigFlags {
    return this.ptr.get_ConfigFlags();
  }
  set ConfigFlags(v: ImGuiConfigFlags) {
    this.ptr.set_ConfigFlags(v);
  }
  /**
   * \/\/ = 0              \/\/ See ImGuiBackendFlags_ enum. Set by backend (imgui_impl_xxx files or custom backend) to communicate features supported by the backend.
   */
  get BackendFlags(): ImGuiBackendFlags {
    return this.ptr.get_BackendFlags();
  }
  set BackendFlags(v: ImGuiBackendFlags) {
    this.ptr.set_BackendFlags(v);
  }
  /**
   * \/\/ <unset>          \/\/ Main display size, in pixels (== GetMainViewport()->Size). May change every frame.
   */
  get DisplaySize(): ImVec2 {
    return ImVec2.From(this.ptr.get_DisplaySize());
  }
  set DisplaySize(v: ImVec2) {
    this.ptr.set_DisplaySize(v);
  }
  /**
   * \/\/ = (1, 1)         \/\/ Main display density. For retina display where window coordinates are different from framebuffer coordinates. This will affect font density + will end up in ImDrawData::FramebufferScale.
   */
  get DisplayFramebufferScale(): ImVec2 {
    return ImVec2.From(this.ptr.get_DisplayFramebufferScale());
  }
  set DisplayFramebufferScale(v: ImVec2) {
    this.ptr.set_DisplayFramebufferScale(v);
  }
  /**
   * \/\/ = 1.0f\/60.0f     \/\/ Time elapsed since last frame, in seconds. May change every frame.
   */
  get DeltaTime(): number {
    return this.ptr.get_DeltaTime();
  }
  set DeltaTime(v: number) {
    this.ptr.set_DeltaTime(v);
  }
  /**
   * \/\/ = 5.0f           \/\/ Minimum time between saving positions\/sizes to .ini file, in seconds.
   */
  get IniSavingRate(): number {
    return this.ptr.get_IniSavingRate();
  }
  set IniSavingRate(v: number) {
    this.ptr.set_IniSavingRate(v);
  }
  /**
   * \/\/ = "imgui.ini"    \/\/ Path to .ini file (important: default "imgui.ini" is relative to current working dir!). Set NULL to disable automatic .ini loading\/saving or if you want to manually call LoadIniSettingsXXX() \/ SaveIniSettingsXXX() functions.
   */
  get IniFilename(): string {
    return this.ptr.get_IniFilename();
  }
  set IniFilename(v: string) {
    this.ptr.set_IniFilename(v);
  }
  /**
   * \/\/ = "imgui_log.txt"\/\/ Path to .log file (default parameter to ImGui::LogToFile when no file is specified).
   */
  get LogFilename(): string {
    return this.ptr.get_LogFilename();
  }
  set LogFilename(v: string) {
    this.ptr.set_LogFilename(v);
  }
  /**
   * \/\/ = NULL           \/\/ Store your own data.
   */
  get UserData(): any {
    return this.ptr.get_UserData();
  }
  set UserData(v: any) {
    this.ptr.set_UserData(v);
  }

  // \/\/ Font system

  /**
   * \/\/ <auto>           \/\/ Font atlas: load, rasterize and pack one or more fonts into a single texture.
   */
  get Fonts(): ImFontAtlas {
    return ImFontAtlas.From(this.ptr.get_Fonts());
  }
  set Fonts(v: ImFontAtlas) {
    this.ptr.set_Fonts(v);
  }
  /**
   * \/\/ = NULL           \/\/ Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0].
   */
  get FontDefault(): ImFont {
    return ImFont.From(this.ptr.get_FontDefault());
  }
  set FontDefault(v: ImFont) {
    this.ptr.set_FontDefault(v);
  }
  /**
   * \/\/ = false          \/\/ Allow user scaling text of individual window with Ctrl+Wheel.
   */
  get FontAllowUserScaling(): boolean {
    return this.ptr.get_FontAllowUserScaling();
  }
  set FontAllowUserScaling(v: boolean) {
    this.ptr.set_FontAllowUserScaling(v);
  }

  // \/\/ Keyboard\/Gamepad Navigation options

  /**
   * \/\/ = false          \/\/ Swap Activate<>Cancel (A<>B) buttons, matching typical "Nintendo\/Japanese style" gamepad layout.
   */
  get ConfigNavSwapGamepadButtons(): boolean {
    return this.ptr.get_ConfigNavSwapGamepadButtons();
  }
  set ConfigNavSwapGamepadButtons(v: boolean) {
    this.ptr.set_ConfigNavSwapGamepadButtons(v);
  }
  /**
   * \/\/ = false          \/\/ Directional\/tabbing navigation teleports the mouse cursor. May be useful on TV\/console systems where moving a virtual mouse is difficult. Will update io.MousePos and set io.WantSetMousePos=true.
   */
  get ConfigNavMoveSetMousePos(): boolean {
    return this.ptr.get_ConfigNavMoveSetMousePos();
  }
  set ConfigNavMoveSetMousePos(v: boolean) {
    this.ptr.set_ConfigNavMoveSetMousePos(v);
  }
  /**
   * \/\/ = true           \/\/ Sets io.WantCaptureKeyboard when io.NavActive is set.
   */
  get ConfigNavCaptureKeyboard(): boolean {
    return this.ptr.get_ConfigNavCaptureKeyboard();
  }
  set ConfigNavCaptureKeyboard(v: boolean) {
    this.ptr.set_ConfigNavCaptureKeyboard(v);
  }
  /**
   * \/\/ = true           \/\/ Pressing Escape can clear focused item + navigation id\/highlight. Set to false if you want to always keep highlight on.
   */
  get ConfigNavEscapeClearFocusItem(): boolean {
    return this.ptr.get_ConfigNavEscapeClearFocusItem();
  }
  set ConfigNavEscapeClearFocusItem(v: boolean) {
    this.ptr.set_ConfigNavEscapeClearFocusItem(v);
  }
  /**
   * \/\/ = false          \/\/ Pressing Escape can clear focused window as well (super set of io.ConfigNavEscapeClearFocusItem).
   */
  get ConfigNavEscapeClearFocusWindow(): boolean {
    return this.ptr.get_ConfigNavEscapeClearFocusWindow();
  }
  set ConfigNavEscapeClearFocusWindow(v: boolean) {
    this.ptr.set_ConfigNavEscapeClearFocusWindow(v);
  }
  /**
   * \/\/ = true           \/\/ Using directional navigation key makes the cursor visible. Mouse click hides the cursor.
   */
  get ConfigNavCursorVisibleAuto(): boolean {
    return this.ptr.get_ConfigNavCursorVisibleAuto();
  }
  set ConfigNavCursorVisibleAuto(v: boolean) {
    this.ptr.set_ConfigNavCursorVisibleAuto(v);
  }
  /**
   * \/\/ = false          \/\/ Navigation cursor is always visible.
   */
  get ConfigNavCursorVisibleAlways(): boolean {
    return this.ptr.get_ConfigNavCursorVisibleAlways();
  }
  set ConfigNavCursorVisibleAlways(v: boolean) {
    this.ptr.set_ConfigNavCursorVisibleAlways(v);
  }

  // \/\/ Docking options (when ImGuiConfigFlags_DockingEnable is set)

  /**
   * \/\/ = false          \/\/ Simplified docking mode: disable window splitting, so docking is limited to merging multiple windows together into tab-bars.
   */
  get ConfigDockingNoSplit(): boolean {
    return this.ptr.get_ConfigDockingNoSplit();
  }
  set ConfigDockingNoSplit(v: boolean) {
    this.ptr.set_ConfigDockingNoSplit(v);
  }
  /**
   * \/\/ = false          \/\/ Simplified docking mode: disable window merging into a same tab-bar, so docking is limited to splitting windows.
   */
  get ConfigDockingNoDockingOver(): boolean {
    return this.ptr.get_ConfigDockingNoDockingOver();
  }
  set ConfigDockingNoDockingOver(v: boolean) {
    this.ptr.set_ConfigDockingNoDockingOver(v);
  }
  /**
   * \/\/ = false          \/\/ Enable docking with holding Shift key (reduce visual noise, allows dropping in wider space)
   */
  get ConfigDockingWithShift(): boolean {
    return this.ptr.get_ConfigDockingWithShift();
  }
  set ConfigDockingWithShift(v: boolean) {
    this.ptr.set_ConfigDockingWithShift(v);
  }
  /**
   * \/\/ = false          \/\/ [BETA] [FIXME: This currently creates regression with auto-sizing and general overhead] Make every single floating window display within a docking node.
   */
  get ConfigDockingAlwaysTabBar(): boolean {
    return this.ptr.get_ConfigDockingAlwaysTabBar();
  }
  set ConfigDockingAlwaysTabBar(v: boolean) {
    this.ptr.set_ConfigDockingAlwaysTabBar(v);
  }
  /**
   * \/\/ = false          \/\/ [BETA] Make window or viewport transparent when docking and only display docking boxes on the target viewport. Useful if rendering of multiple viewport cannot be synced. Best used with ConfigViewportsNoAutoMerge.
   */
  get ConfigDockingTransparentPayload(): boolean {
    return this.ptr.get_ConfigDockingTransparentPayload();
  }
  set ConfigDockingTransparentPayload(v: boolean) {
    this.ptr.set_ConfigDockingTransparentPayload(v);
  }

  // \/\/ Viewport options (when ImGuiConfigFlags_ViewportsEnable is set)

  /**
   * \/\/ = false;         \/\/ Set to make all floating imgui windows always create their own viewport. Otherwise, they are merged into the main host viewports when overlapping it. May also set ImGuiViewportFlags_NoAutoMerge on individual viewport.
   */
  get ConfigViewportsNoAutoMerge(): boolean {
    return this.ptr.get_ConfigViewportsNoAutoMerge();
  }
  set ConfigViewportsNoAutoMerge(v: boolean) {
    this.ptr.set_ConfigViewportsNoAutoMerge(v);
  }
  /**
   * \/\/ = false          \/\/ Disable default OS task bar icon flag for secondary viewports. When a viewport doesn't want a task bar icon, ImGuiViewportFlags_NoTaskBarIcon will be set on it.
   */
  get ConfigViewportsNoTaskBarIcon(): boolean {
    return this.ptr.get_ConfigViewportsNoTaskBarIcon();
  }
  set ConfigViewportsNoTaskBarIcon(v: boolean) {
    this.ptr.set_ConfigViewportsNoTaskBarIcon(v);
  }
  /**
   * \/\/ = true           \/\/ Disable default OS window decoration flag for secondary viewports. When a viewport doesn't want window decorations, ImGuiViewportFlags_NoDecoration will be set on it. Enabling decoration can create subsequent issues at OS levels (e.g. minimum window size).
   */
  get ConfigViewportsNoDecoration(): boolean {
    return this.ptr.get_ConfigViewportsNoDecoration();
  }
  set ConfigViewportsNoDecoration(v: boolean) {
    this.ptr.set_ConfigViewportsNoDecoration(v);
  }
  /**
   * \/\/ = true           \/\/ When false: set secondary viewports' ParentViewportId to main viewport ID by default. Expects the platform backend to setup a parent\/child relationship between the OS windows based on this value. Some backend may ignore this. Set to true if you want viewports to automatically be parent of main viewport, otherwise all viewports will be top-level OS windows.
   */
  get ConfigViewportsNoDefaultParent(): boolean {
    return this.ptr.get_ConfigViewportsNoDefaultParent();
  }
  set ConfigViewportsNoDefaultParent(v: boolean) {
    this.ptr.set_ConfigViewportsNoDefaultParent(v);
  }
  /**
   * \/\/= true \/\/ When a platform window is focused (e.g. using Alt+Tab, clicking Platform Title Bar), apply corresponding focus on imgui windows (may clear focus\/active id from imgui windows location in other platform windows). In principle this is better enabled but we provide an opt-out, because some Linux window managers tend to eagerly focus windows (e.g. on mouse hover, or even a simple window pos\/size change).
   */
  get ConfigViewportsPlatformFocusSetsImGuiFocus(): boolean {
    return this.ptr.get_ConfigViewportsPlatformFocusSetsImGuiFocus();
  }
  set ConfigViewportsPlatformFocusSetsImGuiFocus(v: boolean) {
    this.ptr.set_ConfigViewportsPlatformFocusSetsImGuiFocus(v);
  }

  // \/\/ DPI\/Scaling options
  // \/\/ This may keep evolving during 1.92.x releases. Expect some turbulence.

  /**
   * \/\/ = false          \/\/ [EXPERIMENTAL] Automatically overwrite style.FontScaleDpi when Monitor DPI changes. This will scale fonts but _NOT_ scale sizes\/padding for now.
   */
  get ConfigDpiScaleFonts(): boolean {
    return this.ptr.get_ConfigDpiScaleFonts();
  }
  set ConfigDpiScaleFonts(v: boolean) {
    this.ptr.set_ConfigDpiScaleFonts(v);
  }
  /**
   * \/\/ = false          \/\/ [EXPERIMENTAL] Scale Dear ImGui and Platform Windows when Monitor DPI changes.
   */
  get ConfigDpiScaleViewports(): boolean {
    return this.ptr.get_ConfigDpiScaleViewports();
  }
  set ConfigDpiScaleViewports(v: boolean) {
    this.ptr.set_ConfigDpiScaleViewports(v);
  }

  // \/\/ Miscellaneous options
  // \/\/ (you can visualize and interact with all options in 'Demo->Configuration')

  /**
   * \/\/ = false          \/\/ Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor). Cannot be easily renamed to 'io.ConfigXXX' because this is frequently used by backend implementations.
   */
  get MouseDrawCursor(): boolean {
    return this.ptr.get_MouseDrawCursor();
  }
  set MouseDrawCursor(v: boolean) {
    this.ptr.set_MouseDrawCursor(v);
  }
  /**
   * \/\/ = defined(__APPLE__) \/\/ Swap Cmd<>Ctrl keys + OS X style text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd\/Super instead of Ctrl, Line\/Text Start and End using Cmd+Arrows instead of Home\/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd\/Super instead of Ctrl.
   */
  get ConfigMacOSXBehaviors(): boolean {
    return this.ptr.get_ConfigMacOSXBehaviors();
  }
  set ConfigMacOSXBehaviors(v: boolean) {
    this.ptr.set_ConfigMacOSXBehaviors(v);
  }
  /**
   * \/\/ = true           \/\/ Enable input queue trickling: some types of events submitted during the same frame (e.g. button down + up) will be spread over multiple frames, improving interactions with low framerates.
   */
  get ConfigInputTrickleEventQueue(): boolean {
    return this.ptr.get_ConfigInputTrickleEventQueue();
  }
  set ConfigInputTrickleEventQueue(v: boolean) {
    this.ptr.set_ConfigInputTrickleEventQueue(v);
  }
  /**
   * \/\/ = true           \/\/ Enable blinking cursor (optional as some users consider it to be distracting).
   */
  get ConfigInputTextCursorBlink(): boolean {
    return this.ptr.get_ConfigInputTextCursorBlink();
  }
  set ConfigInputTextCursorBlink(v: boolean) {
    this.ptr.set_ConfigInputTextCursorBlink(v);
  }
  /**
   * \/\/ = false          \/\/ [BETA] Pressing Enter will reactivate item and select all text (single-line only).
   */
  get ConfigInputTextEnterKeepActive(): boolean {
    return this.ptr.get_ConfigInputTextEnterKeepActive();
  }
  set ConfigInputTextEnterKeepActive(v: boolean) {
    this.ptr.set_ConfigInputTextEnterKeepActive(v);
  }
  /**
   * \/\/ = false          \/\/ [BETA] Enable turning DragXXX widgets into text input with a simple mouse click-release (without moving). Not desirable on devices without a keyboard.
   */
  get ConfigDragClickToInputText(): boolean {
    return this.ptr.get_ConfigDragClickToInputText();
  }
  set ConfigDragClickToInputText(v: boolean) {
    this.ptr.set_ConfigDragClickToInputText(v);
  }
  /**
   * \/\/ = true           \/\/ Enable resizing of windows from their edges and from the lower-left corner. This requires ImGuiBackendFlags_HasMouseCursors for better mouse cursor feedback. (This used to be a per-window ImGuiWindowFlags_ResizeFromAnySide flag)
   */
  get ConfigWindowsResizeFromEdges(): boolean {
    return this.ptr.get_ConfigWindowsResizeFromEdges();
  }
  set ConfigWindowsResizeFromEdges(v: boolean) {
    this.ptr.set_ConfigWindowsResizeFromEdges(v);
  }
  /**
   * \/\/ = false      \/\/ Enable allowing to move windows only when clicking on their title bar. Does not apply to windows without a title bar.
   */
  get ConfigWindowsMoveFromTitleBarOnly(): boolean {
    return this.ptr.get_ConfigWindowsMoveFromTitleBarOnly();
  }
  set ConfigWindowsMoveFromTitleBarOnly(v: boolean) {
    this.ptr.set_ConfigWindowsMoveFromTitleBarOnly(v);
  }
  /**
   * \/\/ = false      \/\/ [EXPERIMENTAL] Ctrl+C copy the contents of focused window into the clipboard. Experimental because: (1) has known issues with nested Begin\/End pairs (2) text output quality varies (3) text output is in submission order rather than spatial order.
   */
  get ConfigWindowsCopyContentsWithCtrlC(): boolean {
    return this.ptr.get_ConfigWindowsCopyContentsWithCtrlC();
  }
  set ConfigWindowsCopyContentsWithCtrlC(v: boolean) {
    this.ptr.set_ConfigWindowsCopyContentsWithCtrlC(v);
  }
  /**
   * \/\/ = true           \/\/ Enable scrolling page by page when clicking outside the scrollbar grab. When disabled, always scroll to clicked location. When enabled, Shift+Click scrolls to clicked location.
   */
  get ConfigScrollbarScrollByPage(): boolean {
    return this.ptr.get_ConfigScrollbarScrollByPage();
  }
  set ConfigScrollbarScrollByPage(v: boolean) {
    this.ptr.set_ConfigScrollbarScrollByPage(v);
  }
  /**
   * \/\/ = 60.0f          \/\/ Timer (in seconds) to free transient windows\/tables memory buffers when unused. Set to -1.0f to disable.
   */
  get ConfigMemoryCompactTimer(): number {
    return this.ptr.get_ConfigMemoryCompactTimer();
  }
  set ConfigMemoryCompactTimer(v: number) {
    this.ptr.set_ConfigMemoryCompactTimer(v);
  }

  // \/\/ Inputs Behaviors
  // \/\/ (other variables, ones which are expected to be tweaked within UI code, are exposed in ImGuiStyle)

  /**
   * \/\/ = 0.30f          \/\/ Time for a double-click, in seconds.
   */
  get MouseDoubleClickTime(): number {
    return this.ptr.get_MouseDoubleClickTime();
  }
  set MouseDoubleClickTime(v: number) {
    this.ptr.set_MouseDoubleClickTime(v);
  }
  /**
   * \/\/ = 6.0f           \/\/ Distance threshold to stay in to validate a double-click, in pixels.
   */
  get MouseDoubleClickMaxDist(): number {
    return this.ptr.get_MouseDoubleClickMaxDist();
  }
  set MouseDoubleClickMaxDist(v: number) {
    this.ptr.set_MouseDoubleClickMaxDist(v);
  }
  /**
   * \/\/ = 6.0f           \/\/ Distance threshold before considering we are dragging.
   */
  get MouseDragThreshold(): number {
    return this.ptr.get_MouseDragThreshold();
  }
  set MouseDragThreshold(v: number) {
    this.ptr.set_MouseDragThreshold(v);
  }
  /**
   * \/\/ = 0.275f         \/\/ When holding a key\/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.).
   */
  get KeyRepeatDelay(): number {
    return this.ptr.get_KeyRepeatDelay();
  }
  set KeyRepeatDelay(v: number) {
    this.ptr.set_KeyRepeatDelay(v);
  }
  /**
   * \/\/ = 0.050f         \/\/ When holding a key\/button, rate at which it repeats, in seconds.
   */
  get KeyRepeatRate(): number {
    return this.ptr.get_KeyRepeatRate();
  }
  set KeyRepeatRate(v: number) {
    this.ptr.set_KeyRepeatRate(v);
  }

  // \/\/ Options to configure Error Handling and how we handle recoverable errors [EXPERIMENTAL]
  // \/\/ - Error recovery is provided as a way to facilitate:
  // \/\/    - Recovery after a programming error (native code or scripting language - the latter tends to facilitate iterating on code while running).
  // \/\/    - Recovery after running an exception handler or any error processing which may skip code after an error has been detected.
  // \/\/ - Error recovery is not perfect nor guaranteed! It is a feature to ease development.
  // \/\/   You not are not supposed to rely on it in the course of a normal application run.
  // \/\/ - Functions that support error recovery are using IM_ASSERT_USER_ERROR() instead of IM_ASSERT().
  // \/\/ - By design, we do NOT allow error recovery to be 100% silent. One of the three options needs to be checked!
  // \/\/ - Always ensure that on programmers seats you have at minimum Asserts or Tooltips enabled when making direct imgui API calls!
  // \/\/   Otherwise it would severely hinder your ability to catch and correct mistakes!
  // \/\/ Read https:\/\/github.com\/ocornut\/imgui\/wiki\/Error-Handling for details.
  // \/\/ - Programmer seats: keep asserts (default), or disable asserts and keep error tooltips (new and nice!)
  // \/\/ - Non-programmer seats: maybe disable asserts, but make sure errors are resurfaced (tooltips, visible log entries, use callback etc.)
  // \/\/ - Recovery after error\/exception: record stack sizes with ErrorRecoveryStoreState(), disable assert, set log callback (to e.g. trigger high-level breakpoint), recover with ErrorRecoveryTryToRecoverState(), restore settings.

  /**
   * \/\/ = true       \/\/ Enable error recovery support. Some errors won't be detected and lead to direct crashes if recovery is disabled.
   */
  get ConfigErrorRecovery(): boolean {
    return this.ptr.get_ConfigErrorRecovery();
  }
  set ConfigErrorRecovery(v: boolean) {
    this.ptr.set_ConfigErrorRecovery(v);
  }
  /**
   * \/\/ = true       \/\/ Enable asserts on recoverable error. By default call IM_ASSERT() when returning from a failing IM_ASSERT_USER_ERROR()
   */
  get ConfigErrorRecoveryEnableAssert(): boolean {
    return this.ptr.get_ConfigErrorRecoveryEnableAssert();
  }
  set ConfigErrorRecoveryEnableAssert(v: boolean) {
    this.ptr.set_ConfigErrorRecoveryEnableAssert(v);
  }
  /**
   * \/\/ = true       \/\/ Enable debug log output on recoverable errors.
   */
  get ConfigErrorRecoveryEnableDebugLog(): boolean {
    return this.ptr.get_ConfigErrorRecoveryEnableDebugLog();
  }
  set ConfigErrorRecoveryEnableDebugLog(v: boolean) {
    this.ptr.set_ConfigErrorRecoveryEnableDebugLog(v);
  }
  /**
   * \/\/ = true       \/\/ Enable tooltip on recoverable errors. The tooltip include a way to enable asserts if they were disabled.
   */
  get ConfigErrorRecoveryEnableTooltip(): boolean {
    return this.ptr.get_ConfigErrorRecoveryEnableTooltip();
  }
  set ConfigErrorRecoveryEnableTooltip(v: boolean) {
    this.ptr.set_ConfigErrorRecoveryEnableTooltip(v);
  }

  // \/\/ Option to enable various debug tools showing buttons that will call the IM_DEBUG_BREAK() macro.
  // \/\/ - The Item Picker tool will be available regardless of this being enabled, in order to maximize its discoverability.
  // \/\/ - Requires a debugger being attached, otherwise IM_DEBUG_BREAK() options will appear to crash your application.
  // \/\/   e.g. io.ConfigDebugIsDebuggerPresent = ::IsDebuggerPresent() on Win32, or refer to ImOsIsDebuggerPresent() imgui_test_engine\/imgui_te_utils.cpp for a Unix compatible version.

  /**
   * \/\/ = false          \/\/ Enable various tools calling IM_DEBUG_BREAK().
   */
  get ConfigDebugIsDebuggerPresent(): boolean {
    return this.ptr.get_ConfigDebugIsDebuggerPresent();
  }
  set ConfigDebugIsDebuggerPresent(v: boolean) {
    this.ptr.set_ConfigDebugIsDebuggerPresent(v);
  }

  // \/\/ Tools to detect code submitting items with conflicting\/duplicate IDs
  // \/\/ - Code should use PushID()\/PopID() in loops, or append "##xx" to same-label identifiers.
  // \/\/ - Empty label e.g. Button("") == same ID as parent widget\/node. Use Button("##xx") instead!
  // \/\/ - See FAQ https:\/\/github.com\/ocornut\/imgui\/blob\/master\/docs\/FAQ.md#q-about-the-id-stack-system

  /**
   * \/\/ = true           \/\/ Highlight and show an error message popup when multiple items have conflicting identifiers.
   */
  get ConfigDebugHighlightIdConflicts(): boolean {
    return this.ptr.get_ConfigDebugHighlightIdConflicts();
  }
  set ConfigDebugHighlightIdConflicts(v: boolean) {
    this.ptr.set_ConfigDebugHighlightIdConflicts(v);
  }
  /**
   * \/\/=true \/\/ Show "Item Picker" button in aforementioned popup.
   */
  get ConfigDebugHighlightIdConflictsShowItemPicker(): boolean {
    return this.ptr.get_ConfigDebugHighlightIdConflictsShowItemPicker();
  }
  set ConfigDebugHighlightIdConflictsShowItemPicker(v: boolean) {
    this.ptr.set_ConfigDebugHighlightIdConflictsShowItemPicker(v);
  }

  // \/\/ Tools to test correct Begin\/End and BeginChild\/EndChild behaviors.
  // \/\/ - Presently Begin()\/End() and BeginChild()\/EndChild() needs to ALWAYS be called in tandem, regardless of return value of BeginXXX()
  // \/\/ - This is inconsistent with other BeginXXX functions and create confusion for many users.
  // \/\/ - We expect to update the API eventually. In the meanwhile we provide tools to facilitate checking user-code behavior.

  /**
   * \/\/ = false          \/\/ First-time calls to Begin()\/BeginChild() will return false. NEEDS TO BE SET AT APPLICATION BOOT TIME if you don't want to miss windows.
   */
  get ConfigDebugBeginReturnValueOnce(): boolean {
    return this.ptr.get_ConfigDebugBeginReturnValueOnce();
  }
  set ConfigDebugBeginReturnValueOnce(v: boolean) {
    this.ptr.set_ConfigDebugBeginReturnValueOnce(v);
  }
  /**
   * \/\/ = false          \/\/ Some calls to Begin()\/BeginChild() will return false. Will cycle through window depths then repeat. Suggested use: add "io.ConfigDebugBeginReturnValue = io.KeyShift" in your main loop then occasionally press SHIFT. Windows should be flickering while running.
   */
  get ConfigDebugBeginReturnValueLoop(): boolean {
    return this.ptr.get_ConfigDebugBeginReturnValueLoop();
  }
  set ConfigDebugBeginReturnValueLoop(v: boolean) {
    this.ptr.set_ConfigDebugBeginReturnValueLoop(v);
  }

  // \/\/ Option to deactivate io.AddFocusEvent(false) handling.
  // \/\/ - May facilitate interactions with a debugger when focus loss leads to clearing inputs data.
  // \/\/ - Backends may have other side-effects on focus loss, so this will reduce side-effects but not necessary remove all of them.

  /**
   * \/\/ = false          \/\/ Ignore io.AddFocusEvent(false), consequently not calling io.ClearInputKeys()\/io.ClearInputMouse() in input processing.
   */
  get ConfigDebugIgnoreFocusLoss(): boolean {
    return this.ptr.get_ConfigDebugIgnoreFocusLoss();
  }
  set ConfigDebugIgnoreFocusLoss(v: boolean) {
    this.ptr.set_ConfigDebugIgnoreFocusLoss(v);
  }

  // \/\/ Option to audit .ini data

  /**
   * \/\/ = false          \/\/ Save .ini data with extra comments (particularly helpful for Docking, but makes saving slower)
   */
  get ConfigDebugIniSettings(): boolean {
    return this.ptr.get_ConfigDebugIniSettings();
  }
  set ConfigDebugIniSettings(v: boolean) {
    this.ptr.set_ConfigDebugIniSettings(v);
  }

  // \/\/ Nowadays those would be stored in ImGuiPlatformIO but we are leaving them here for legacy reasons.
  // \/\/ Optional: Platform\/Renderer backend name (informational only! will be displayed in About Window) + User data for backend\/wrappers to store their own stuff.

  /**
   * \/\/ = NULL
   */
  get BackendPlatformName(): string {
    return this.ptr.get_BackendPlatformName();
  }
  set BackendPlatformName(v: string) {
    this.ptr.set_BackendPlatformName(v);
  }
  /**
   * \/\/ = NULL
   */
  get BackendRendererName(): string {
    return this.ptr.get_BackendRendererName();
  }
  set BackendRendererName(v: string) {
    this.ptr.set_BackendRendererName(v);
  }
  /**
   * \/\/ = NULL           \/\/ User data for platform backend
   */
  get BackendPlatformUserData(): any {
    return this.ptr.get_BackendPlatformUserData();
  }
  set BackendPlatformUserData(v: any) {
    this.ptr.set_BackendPlatformUserData(v);
  }
  /**
   * \/\/ = NULL           \/\/ User data for renderer backend
   */
  get BackendRendererUserData(): any {
    return this.ptr.get_BackendRendererUserData();
  }
  set BackendRendererUserData(v: any) {
    this.ptr.set_BackendRendererUserData(v);
  }
  /**
   * \/\/ = NULL           \/\/ User data for non C++ programming language backend
   */
  get BackendLanguageUserData(): any {
    return this.ptr.get_BackendLanguageUserData();
  }
  set BackendLanguageUserData(v: any) {
    this.ptr.set_BackendLanguageUserData(v);
  }
  /**
   * \/\/ Set when Dear ImGui will use mouse inputs, in this case do not dispatch them to your main game\/application (either way, always pass on mouse inputs to imgui). (e.g. unclicked mouse is hovering over an imgui window, widget is active, mouse was clicked over an imgui window, etc.).
   */
  get WantCaptureMouse(): boolean {
    return this.ptr.get_WantCaptureMouse();
  }
  set WantCaptureMouse(v: boolean) {
    this.ptr.set_WantCaptureMouse(v);
  }
  /**
   * \/\/ Set when Dear ImGui will use keyboard inputs, in this case do not dispatch them to your main game\/application (either way, always pass keyboard inputs to imgui). (e.g. InputText active, or an imgui window is focused and navigation is enabled, etc.).
   */
  get WantCaptureKeyboard(): boolean {
    return this.ptr.get_WantCaptureKeyboard();
  }
  set WantCaptureKeyboard(v: boolean) {
    this.ptr.set_WantCaptureKeyboard(v);
  }
  /**
   * \/\/ Mobile\/console: when set, you may display an on-screen keyboard. This is set by Dear ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active).
   */
  get WantTextInput(): boolean {
    return this.ptr.get_WantTextInput();
  }
  set WantTextInput(v: boolean) {
    this.ptr.set_WantTextInput(v);
  }
  /**
   * \/\/ MousePos has been altered, backend should reposition mouse on next frame. Rarely used! Set only when io.ConfigNavMoveSetMousePos is enabled.
   */
  get WantSetMousePos(): boolean {
    return this.ptr.get_WantSetMousePos();
  }
  set WantSetMousePos(v: boolean) {
    this.ptr.set_WantSetMousePos(v);
  }
  /**
   * \/\/ When manual .ini load\/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. Important: clear io.WantSaveIniSettings yourself after saving!
   */
  get WantSaveIniSettings(): boolean {
    return this.ptr.get_WantSaveIniSettings();
  }
  set WantSaveIniSettings(v: boolean) {
    this.ptr.set_WantSaveIniSettings(v);
  }
  /**
   * \/\/ Keyboard\/Gamepad navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag.
   */
  get NavActive(): boolean {
    return this.ptr.get_NavActive();
  }
  set NavActive(v: boolean) {
    this.ptr.set_NavActive(v);
  }
  /**
   * \/\/ Keyboard\/Gamepad navigation highlight is visible and allowed (will handle ImGuiKey_NavXXX events).
   */
  get NavVisible(): boolean {
    return this.ptr.get_NavVisible();
  }
  set NavVisible(v: boolean) {
    this.ptr.set_NavVisible(v);
  }
  /**
   * \/\/ Estimate of application framerate (rolling average over 60 frames, based on io.DeltaTime), in frame per second. Solely for convenience. Slow applications may not want to use a moving average or may want to reset underlying buffers occasionally.
   */
  get Framerate(): number {
    return this.ptr.get_Framerate();
  }
  set Framerate(v: number) {
    this.ptr.set_Framerate(v);
  }
  /**
   * \/\/ Vertices output during last call to Render()
   */
  get MetricsRenderVertices(): number {
    return this.ptr.get_MetricsRenderVertices();
  }
  set MetricsRenderVertices(v: number) {
    this.ptr.set_MetricsRenderVertices(v);
  }
  /**
   * \/\/ Indices output during last call to Render() = number of triangles * 3
   */
  get MetricsRenderIndices(): number {
    return this.ptr.get_MetricsRenderIndices();
  }
  set MetricsRenderIndices(v: number) {
    this.ptr.set_MetricsRenderIndices(v);
  }
  /**
   * \/\/ Number of visible windows
   */
  get MetricsRenderWindows(): number {
    return this.ptr.get_MetricsRenderWindows();
  }
  set MetricsRenderWindows(v: number) {
    this.ptr.set_MetricsRenderWindows(v);
  }
  /**
   * \/\/ Number of active windows
   */
  get MetricsActiveWindows(): number {
    return this.ptr.get_MetricsActiveWindows();
  }
  set MetricsActiveWindows(v: number) {
    this.ptr.set_MetricsActiveWindows(v);
  }
  /**
   * \/\/ Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing\/reappearing mouse won't have a huge delta.
   */
  get MouseDelta(): ImVec2 {
    return ImVec2.From(this.ptr.get_MouseDelta());
  }
  set MouseDelta(v: ImVec2) {
    this.ptr.set_MouseDelta(v);
  }
  /**
   * \/\/ Parent UI context (needs to be set explicitly by parent).
   */
  get Ctx(): ImGuiContext {
    return ImGuiContext.From(this.ptr.get_Ctx());
  }
  set Ctx(v: ImGuiContext) {
    this.ptr.set_Ctx(v);
  }

  // \/\/ Main Input State
  // \/\/ (this block used to be written by backend, since 1.87 it is best to NOT write to those directly, call the AddXXX functions above instead)
  // \/\/ (reading from those variables is fair game, as they are extremely unlikely to be moving anywhere)

  /**
   * \/\/ Mouse position, in pixels. Set to ImVec2(-FLT_MAX, -FLT_MAX) if mouse is unavailable (on another screen, etc.)
   */
  get MousePos(): ImVec2 {
    return ImVec2.From(this.ptr.get_MousePos());
  }
  set MousePos(v: ImVec2) {
    this.ptr.set_MousePos(v);
  }
  /**
   * \/\/ Mouse wheel Vertical: 1 unit scrolls about 5 lines text. >0 scrolls Up, <0 scrolls Down. Hold Shift to turn vertical scroll into horizontal scroll.
   */
  get MouseWheel(): number {
    return this.ptr.get_MouseWheel();
  }
  set MouseWheel(v: number) {
    this.ptr.set_MouseWheel(v);
  }
  /**
   * \/\/ Mouse wheel Horizontal. >0 scrolls Left, <0 scrolls Right. Most users don't have a mouse with a horizontal wheel, may not be filled by all backends.
   */
  get MouseWheelH(): number {
    return this.ptr.get_MouseWheelH();
  }
  set MouseWheelH(v: number) {
    this.ptr.set_MouseWheelH(v);
  }
  /**
   * \/\/ Mouse actual input peripheral (Mouse\/TouchScreen\/Pen).
   */
  get MouseSource(): ImGuiMouseSource {
    return this.ptr.get_MouseSource();
  }
  set MouseSource(v: ImGuiMouseSource) {
    this.ptr.set_MouseSource(v);
  }
  /**
   * \/\/ (Optional) Modify using io.AddMouseViewportEvent(). With multi-viewports: viewport the OS mouse is hovering. If possible _IGNORING_ viewports with the ImGuiViewportFlags_NoInputs flag is much better (few backends can handle that). Set io.BackendFlags |= ImGuiBackendFlags_HasMouseHoveredViewport if you can provide this info. If you don't imgui will infer the value using the rectangles and last focused time of the viewports it knows about (ignoring other OS windows).
   */
  get MouseHoveredViewport(): ImGuiID {
    return this.ptr.get_MouseHoveredViewport();
  }
  set MouseHoveredViewport(v: ImGuiID) {
    this.ptr.set_MouseHoveredViewport(v);
  }
  /**
   * \/\/ Keyboard modifier down: Ctrl (non-macOS), Cmd (macOS)
   */
  get KeyCtrl(): boolean {
    return this.ptr.get_KeyCtrl();
  }
  set KeyCtrl(v: boolean) {
    this.ptr.set_KeyCtrl(v);
  }
  /**
   * \/\/ Keyboard modifier down: Shift
   */
  get KeyShift(): boolean {
    return this.ptr.get_KeyShift();
  }
  set KeyShift(v: boolean) {
    this.ptr.set_KeyShift(v);
  }
  /**
   * \/\/ Keyboard modifier down: Alt
   */
  get KeyAlt(): boolean {
    return this.ptr.get_KeyAlt();
  }
  set KeyAlt(v: boolean) {
    this.ptr.set_KeyAlt(v);
  }
  /**
   * \/\/ Keyboard modifier down: Windows\/Super (non-macOS), Ctrl (macOS)
   */
  get KeySuper(): boolean {
    return this.ptr.get_KeySuper();
  }
  set KeySuper(v: boolean) {
    this.ptr.set_KeySuper(v);
  }

  // \/\/ Other state maintained from data above + IO function calls

  /**
   * \/\/ Key mods flags (any of ImGuiMod_Ctrl\/ImGuiMod_Shift\/ImGuiMod_Alt\/ImGuiMod_Super flags, same as io.KeyCtrl\/KeyShift\/KeyAlt\/KeySuper but merged into flags). Read-only, updated by NewFrame()
   */
  get KeyMods(): ImGuiKeyChord {
    return this.ptr.get_KeyMods();
  }
  set KeyMods(v: ImGuiKeyChord) {
    this.ptr.set_KeyMods(v);
  }
  /**
   * \/\/ Alternative to WantCaptureMouse: (WantCaptureMouse == true && WantCaptureMouseUnlessPopupClose == false) when a click over void is expected to close a popup.
   */
  get WantCaptureMouseUnlessPopupClose(): boolean {
    return this.ptr.get_WantCaptureMouseUnlessPopupClose();
  }
  set WantCaptureMouseUnlessPopupClose(v: boolean) {
    this.ptr.set_WantCaptureMouseUnlessPopupClose(v);
  }
  /**
   * \/\/ Previous mouse position (note that MouseDelta is not necessary == MousePos-MousePosPrev, in case either position is invalid)
   */
  get MousePosPrev(): ImVec2 {
    return ImVec2.From(this.ptr.get_MousePosPrev());
  }
  set MousePosPrev(v: ImVec2) {
    this.ptr.set_MousePosPrev(v);
  }
  /**
   * \/\/ On a non-Mac system, holding Shift requests WheelY to perform the equivalent of a WheelX event. On a Mac system this is already enforced by the system.
   */
  get MouseWheelRequestAxisSwap(): boolean {
    return this.ptr.get_MouseWheelRequestAxisSwap();
  }
  set MouseWheelRequestAxisSwap(v: boolean) {
    this.ptr.set_MouseWheelRequestAxisSwap(v);
  }
  /**
   * \/\/ (OSX) Set to true when the current click was a Ctrl+Click that spawned a simulated right click
   */
  get MouseCtrlLeftAsRightClick(): boolean {
    return this.ptr.get_MouseCtrlLeftAsRightClick();
  }
  set MouseCtrlLeftAsRightClick(v: boolean) {
    this.ptr.set_MouseCtrlLeftAsRightClick(v);
  }
  /**
   * \/\/ Touch\/Pen pressure (0.0f to 1.0f, should be >0.0f only when MouseDown[0] == true). Helper storage currently unused by Dear ImGui.
   */
  get PenPressure(): number {
    return this.ptr.get_PenPressure();
  }
  set PenPressure(v: number) {
    this.ptr.set_PenPressure(v);
  }
  /**
   * \/\/ Only modify via AddFocusEvent()
   */
  get AppFocusLost(): boolean {
    return this.ptr.get_AppFocusLost();
  }
  set AppFocusLost(v: boolean) {
    this.ptr.set_AppFocusLost(v);
  }
  /**
   * \/\/ Only modify via SetAppAcceptingEvents()
   */
  get AppAcceptingEvents(): boolean {
    return this.ptr.get_AppAcceptingEvents();
  }
  set AppAcceptingEvents(v: boolean) {
    this.ptr.set_AppAcceptingEvents(v);
  }
  /**
   * \/\/ For AddInputCharacterUTF16()
   */
  get InputQueueSurrogate(): ImWchar16 {
    return this.ptr.get_InputQueueSurrogate();
  }
  set InputQueueSurrogate(v: ImWchar16) {
    this.ptr.set_InputQueueSurrogate(v);
  }

  // \/\/ Input Functions

  /**
   * \/\/ Queue a new key down\/up event. Key should be "translated" (as in, generally ImGuiKey_A matches the key end-user would use to emit an 'A' character)
   */
  AddKeyEvent(key: ImGuiKey, down: boolean): void {
    this.ptr.ImGuiIO_AddKeyEvent(key, down);
  }
  /**
   * \/\/ Queue a new key down\/up event for analog values (e.g. ImGuiKey_Gamepad_ values). Dead-zones should be handled by the backend.
   */
  AddKeyAnalogEvent(key: ImGuiKey, down: boolean, v: number): void {
    this.ptr.ImGuiIO_AddKeyAnalogEvent(key, down, v);
  }
  /**
   * \/\/ Queue a mouse position update. Use -FLT_MAX,-FLT_MAX to signify no mouse (e.g. app not focused and not hovered)
   */
  AddMousePosEvent(x: number, y: number): void {
    this.ptr.ImGuiIO_AddMousePosEvent(x, y);
  }
  /**
   * \/\/ Queue a mouse button change
   */
  AddMouseButtonEvent(button: number, down: boolean): void {
    this.ptr.ImGuiIO_AddMouseButtonEvent(button, down);
  }
  /**
   * \/\/ Queue a mouse wheel update. wheel_y<0: scroll down, wheel_y>0: scroll up, wheel_x<0: scroll right, wheel_x>0: scroll left.
   */
  AddMouseWheelEvent(wheel_x: number, wheel_y: number): void {
    this.ptr.ImGuiIO_AddMouseWheelEvent(wheel_x, wheel_y);
  }
  /**
   * \/\/ Queue a mouse source change (Mouse\/TouchScreen\/Pen)
   */
  AddMouseSourceEvent(source: ImGuiMouseSource): void {
    this.ptr.ImGuiIO_AddMouseSourceEvent(source);
  }
  /**
   * \/\/ Queue a mouse hovered viewport. Requires backend to set ImGuiBackendFlags_HasMouseHoveredViewport to call this (for multi-viewport support).
   */
  AddMouseViewportEvent(id: ImGuiID): void {
    this.ptr.ImGuiIO_AddMouseViewportEvent(id);
  }
  /**
   * \/\/ Queue a gain\/loss of focus for the application (generally based on OS\/platform focus of your window)
   */
  AddFocusEvent(focused: boolean): void {
    this.ptr.ImGuiIO_AddFocusEvent(focused);
  }
  /**
   * \/\/ Queue a new character input
   */
  AddInputCharacter(c: number): void {
    this.ptr.ImGuiIO_AddInputCharacter(c);
  }
  /**
   * \/\/ Queue a new character input from a UTF-16 character, it can be a surrogate
   */
  AddInputCharacterUTF16(c: ImWchar16): void {
    this.ptr.ImGuiIO_AddInputCharacterUTF16(c);
  }
  /**
   * \/\/ Queue a new characters input from a UTF-8 string
   */
  AddInputCharactersUTF8(str: string): void {
    this.ptr.ImGuiIO_AddInputCharactersUTF8(str);
  }
  /**
   * \/\/ [Optional] Specify index for legacy <1.87 IsKeyXXX() functions with native indices + specify native keycode, scancode.
   */
  SetKeyEventNativeData(
    key: ImGuiKey,
    native_keycode: number,
    native_scancode: number,
    native_legacy_index: number = -1,
  ): void {
    this.ptr.ImGuiIO_SetKeyEventNativeData(
      key,
      native_keycode,
      native_scancode,
      native_legacy_index,
    );
  }
  /**
   * \/\/ Set master flag for accepting key\/mouse\/text events (default to true). Useful if you have native dialog boxes that are interrupting your application loop\/refresh, and you want to disable events being queued while your app is frozen.
   */
  SetAppAcceptingEvents(accepting_events: boolean): void {
    this.ptr.ImGuiIO_SetAppAcceptingEvents(accepting_events);
  }
  /**
   * \/\/ Clear all incoming events.
   */
  ClearEventsQueue(): void {
    this.ptr.ImGuiIO_ClearEventsQueue();
  }
  /**
   * \/\/ Clear current keyboard\/gamepad state + current frame text input buffer. Equivalent to releasing all keys\/buttons.
   */
  ClearInputKeys(): void {
    this.ptr.ImGuiIO_ClearInputKeys();
  }
  /**
   * \/\/ Clear current mouse state.
   */
  ClearInputMouse(): void {
    this.ptr.ImGuiIO_ClearInputMouse();
  }
}
/**
 * \/\/ Shared state of InputText(), passed as an argument to your callback when a ImGuiInputTextFlags_Callback* flag is used.
 * \/\/ The callback function should return 0 by default.
 * \/\/ Callbacks (follow a flag name and see comments in ImGuiInputTextFlags_ declarations for more details)
 * \/\/ - ImGuiInputTextFlags_CallbackEdit:        Callback on buffer edit. Note that InputText() already returns true on edit + you can always use IsItemEdited(). The callback is useful to manipulate the underlying buffer while focus is active.
 * \/\/ - ImGuiInputTextFlags_CallbackAlways:      Callback on each iteration
 * \/\/ - ImGuiInputTextFlags_CallbackCompletion:  Callback on pressing TAB
 * \/\/ - ImGuiInputTextFlags_CallbackHistory:     Callback on pressing Up\/Down arrows
 * \/\/ - ImGuiInputTextFlags_CallbackCharFilter:  Callback on character inputs to replace or discard them. Modify 'EventChar' to replace or discard, or return 1 in callback to discard.
 * \/\/ - ImGuiInputTextFlags_CallbackResize:      Callback on buffer capacity changes request (beyond 'buf_size' parameter value), allowing the string to grow.
 */
export class ImGuiInputTextCallbackData extends ReferenceStruct {
  /**
   * \/\/ Parent UI context
   */
  get Ctx(): ImGuiContext {
    return ImGuiContext.From(this.ptr.get_Ctx());
  }
  set Ctx(v: ImGuiContext) {
    this.ptr.set_Ctx(v);
  }
  /**
   * \/\/ One ImGuiInputTextFlags_Callback*    \/\/ Read-only
   */
  get EventFlag(): ImGuiInputTextFlags {
    return this.ptr.get_EventFlag();
  }
  set EventFlag(v: ImGuiInputTextFlags) {
    this.ptr.set_EventFlag(v);
  }
  /**
   * \/\/ What user passed to InputText()      \/\/ Read-only
   */
  get Flags(): ImGuiInputTextFlags {
    return this.ptr.get_Flags();
  }
  set Flags(v: ImGuiInputTextFlags) {
    this.ptr.set_Flags(v);
  }
  /**
   * \/\/ What user passed to InputText()      \/\/ Read-only
   */
  get UserData(): any {
    return this.ptr.get_UserData();
  }
  set UserData(v: any) {
    this.ptr.set_UserData(v);
  }
  /**
   * \/\/ Widget ID                             \/\/ Read-only
   */
  get ID(): ImGuiID {
    return this.ptr.get_ID();
  }
  set ID(v: ImGuiID) {
    this.ptr.set_ID(v);
  }

  // \/\/ Arguments for the different callback events
  // \/\/ - During Resize callback, Buf will be same as your input buffer.
  // \/\/ - However, during Completion\/History\/Always callback, Buf always points to our own internal data (it is not the same as your buffer)! Changes to it will be reflected into your own buffer shortly after the callback.
  // \/\/ - To modify the text buffer in a callback, prefer using the InsertChars() \/ DeleteChars() function. InsertChars() will take care of calling the resize callback if necessary.
  // \/\/ - If you know your edits are not going to resize the underlying buffer allocation, you may modify the contents of 'Buf[]' directly. You need to update 'BufTextLen' accordingly (0 <= BufTextLen < BufSize) and set 'BufDirty'' to true so InputText can update its internal state.

  /**
   * \/\/ Key pressed (Up\/Down\/TAB)            \/\/ Read-only    \/\/ [Completion,History]
   */
  get EventKey(): ImGuiKey {
    return this.ptr.get_EventKey();
  }
  set EventKey(v: ImGuiKey) {
    this.ptr.set_EventKey(v);
  }
  /**
   * \/\/ Character input                      \/\/ Read-write   \/\/ [CharFilter] Replace character with another one, or set to zero to drop. return 1 is equivalent to setting EventChar=0;
   */
  get EventChar(): ImWchar {
    return this.ptr.get_EventChar();
  }
  set EventChar(v: ImWchar) {
    this.ptr.set_EventChar(v);
  }
  /**
   * \/\/ Input field just got activated       \/\/ Read-only    \/\/ [Always]
   */
  get EventActivated(): boolean {
    return this.ptr.get_EventActivated();
  }
  set EventActivated(v: boolean) {
    this.ptr.set_EventActivated(v);
  }
  /**
   * \/\/ Set if you modify Buf\/BufTextLen!    \/\/ Write        \/\/ [Completion,History,Always]
   */
  get BufDirty(): boolean {
    return this.ptr.get_BufDirty();
  }
  set BufDirty(v: boolean) {
    this.ptr.set_BufDirty(v);
  }
  /**
   * \/\/ Text buffer                          \/\/ Read-write   \/\/ [Resize] Can replace pointer \/ [Completion,History,Always] Only write to pointed data, don't replace the actual pointer!
   */
  get Buf(): string {
    return this.ptr.get_Buf();
  }
  set Buf(v: string) {
    this.ptr.set_Buf(v);
  }
  /**
   * \/\/ Text length (in bytes)               \/\/ Read-write   \/\/ [Resize,Completion,History,Always] Exclude zero-terminator storage. In C land: == strlen(some_text), in C++ land: string.length()
   */
  get BufTextLen(): number {
    return this.ptr.get_BufTextLen();
  }
  set BufTextLen(v: number) {
    this.ptr.set_BufTextLen(v);
  }
  /**
   * \/\/ Buffer size (in bytes) = capacity+1  \/\/ Read-only    \/\/ [Resize,Completion,History,Always] Include zero-terminator storage. In C land: == ARRAYSIZE(my_char_array), in C++ land: string.capacity()+1
   */
  get BufSize(): number {
    return this.ptr.get_BufSize();
  }
  set BufSize(v: number) {
    this.ptr.set_BufSize(v);
  }
  /**
   * \/\/                                      \/\/ Read-write   \/\/ [Completion,History,Always]
   */
  get CursorPos(): number {
    return this.ptr.get_CursorPos();
  }
  set CursorPos(v: number) {
    this.ptr.set_CursorPos(v);
  }
  /**
   * \/\/                                      \/\/ Read-write   \/\/ [Completion,History,Always] == to SelectionEnd when no selection
   */
  get SelectionStart(): number {
    return this.ptr.get_SelectionStart();
  }
  set SelectionStart(v: number) {
    this.ptr.set_SelectionStart(v);
  }
  /**
   * \/\/                                      \/\/ Read-write   \/\/ [Completion,History,Always]
   */
  get SelectionEnd(): number {
    return this.ptr.get_SelectionEnd();
  }
  set SelectionEnd(v: number) {
    this.ptr.set_SelectionEnd(v);
  }

  DeleteChars(pos: number, bytes_count: number): void {
    this.ptr.ImGuiInputTextCallbackData_DeleteChars(pos, bytes_count);
  }
  InsertChars(pos: number, text: string, text_end: string = ""): void {
    this.ptr.ImGuiInputTextCallbackData_InsertChars(pos, text, text_end);
  }
  SelectAll(): void {
    this.ptr.ImGuiInputTextCallbackData_SelectAll();
  }
  SetSelection(s: number, e: number): void {
    this.ptr.ImGuiInputTextCallbackData_SetSelection(s, e);
  }
  ClearSelection(): void {
    this.ptr.ImGuiInputTextCallbackData_ClearSelection();
  }
  HasSelection(): boolean {
    return this.ptr.ImGuiInputTextCallbackData_HasSelection();
  }
}
/**
 * \/\/ Resizing callback data to apply custom constraint. As enabled by SetNextWindowSizeConstraints(). Callback is called during the next Begin().
 * \/\/ NB: For basic min\/max size constraint on each axis you don't need to use the callback! The SetNextWindowSizeConstraints() parameters are enough.
 */
export class ImGuiSizeCallbackData extends ReferenceStruct {
  /**
   * \/\/ Read-only.   What user passed to SetNextWindowSizeConstraints(). Generally store an integer or float in here (need reinterpret_cast<>).
   */
  get UserData(): any {
    return this.ptr.get_UserData();
  }
  set UserData(v: any) {
    this.ptr.set_UserData(v);
  }
  /**
   * \/\/ Read-only.   Window position, for reference.
   */
  get Pos(): ImVec2 {
    return ImVec2.From(this.ptr.get_Pos());
  }
  set Pos(v: ImVec2) {
    this.ptr.set_Pos(v);
  }
  /**
   * \/\/ Read-only.   Current window size.
   */
  get CurrentSize(): ImVec2 {
    return ImVec2.From(this.ptr.get_CurrentSize());
  }
  set CurrentSize(v: ImVec2) {
    this.ptr.set_CurrentSize(v);
  }
  /**
   * \/\/ Read-write.  Desired size, based on user's mouse position. Write to this field to restrain resizing.
   */
  get DesiredSize(): ImVec2 {
    return ImVec2.From(this.ptr.get_DesiredSize());
  }
  set DesiredSize(v: ImVec2) {
    this.ptr.set_DesiredSize(v);
  }
}
/**
 * \/\/ [ALPHA] Rarely used \/ very advanced uses only. Use with SetNextWindowClass() and DockSpace() functions.
 * \/\/ Important: the content of this class is still highly WIP and likely to change and be refactored
 * \/\/ before we stabilize Docking features. Please be mindful if using this.
 * \/\/ Provide hints:
 * \/\/ - To the platform backend via altered viewport flags (enable\/disable OS decoration, OS task bar icons, etc.)
 * \/\/ - To the platform backend for OS level parent\/child relationships of viewport.
 * \/\/ - To the docking system for various options and filtering.
 */
export class ImGuiWindowClass extends ReferenceStruct {
  /**
   * \/\/ User data. 0 = Default class (unclassed). Windows of different classes cannot be docked with each others.
   */
  get ClassId(): ImGuiID {
    return this.ptr.get_ClassId();
  }
  set ClassId(v: ImGuiID) {
    this.ptr.set_ClassId(v);
  }
  /**
   * \/\/ Hint for the platform backend. -1: use default. 0: request platform backend to not parent the platform. != 0: request platform backend to create a parent<>child relationship between the platform windows. Not conforming backends are free to e.g. parent every viewport to the main viewport or not.
   */
  get ParentViewportId(): ImGuiID {
    return this.ptr.get_ParentViewportId();
  }
  set ParentViewportId(v: ImGuiID) {
    this.ptr.set_ParentViewportId(v);
  }
  /**
   * \/\/ ID of parent window for shortcut focus route evaluation, e.g. Shortcut() call from Parent Window will succeed when this window is focused.
   */
  get FocusRouteParentWindowId(): ImGuiID {
    return this.ptr.get_FocusRouteParentWindowId();
  }
  set FocusRouteParentWindowId(v: ImGuiID) {
    this.ptr.set_FocusRouteParentWindowId(v);
  }
  /**
   * \/\/ Viewport flags to set when a window of this class owns a viewport. This allows you to enforce OS decoration or task bar icon, override the defaults on a per-window basis.
   */
  get ViewportFlagsOverrideSet(): ImGuiViewportFlags {
    return this.ptr.get_ViewportFlagsOverrideSet();
  }
  set ViewportFlagsOverrideSet(v: ImGuiViewportFlags) {
    this.ptr.set_ViewportFlagsOverrideSet(v);
  }
  /**
   * \/\/ Viewport flags to clear when a window of this class owns a viewport. This allows you to enforce OS decoration or task bar icon, override the defaults on a per-window basis.
   */
  get ViewportFlagsOverrideClear(): ImGuiViewportFlags {
    return this.ptr.get_ViewportFlagsOverrideClear();
  }
  set ViewportFlagsOverrideClear(v: ImGuiViewportFlags) {
    this.ptr.set_ViewportFlagsOverrideClear(v);
  }
  /**
   * \/\/ [EXPERIMENTAL] TabItem flags to set when a window of this class gets submitted into a dock node tab bar. May use with ImGuiTabItemFlags_Leading or ImGuiTabItemFlags_Trailing.
   */
  get TabItemFlagsOverrideSet(): ImGuiTabItemFlags {
    return this.ptr.get_TabItemFlagsOverrideSet();
  }
  set TabItemFlagsOverrideSet(v: ImGuiTabItemFlags) {
    this.ptr.set_TabItemFlagsOverrideSet(v);
  }
  /**
   * \/\/ [EXPERIMENTAL] Dock node flags to set when a window of this class is hosted by a dock node (it doesn't have to be selected!)
   */
  get DockNodeFlagsOverrideSet(): ImGuiDockNodeFlags {
    return this.ptr.get_DockNodeFlagsOverrideSet();
  }
  set DockNodeFlagsOverrideSet(v: ImGuiDockNodeFlags) {
    this.ptr.set_DockNodeFlagsOverrideSet(v);
  }
  /**
   * \/\/ Set to true to enforce single floating windows of this class always having their own docking node (equivalent of setting the global io.ConfigDockingAlwaysTabBar)
   */
  get DockingAlwaysTabBar(): boolean {
    return this.ptr.get_DockingAlwaysTabBar();
  }
  set DockingAlwaysTabBar(v: boolean) {
    this.ptr.set_DockingAlwaysTabBar(v);
  }
  /**
   * \/\/ Set to true to allow windows of this class to be docked\/merged with an unclassed window. \/\/ FIXME-DOCK: Move to DockNodeFlags override?
   */
  get DockingAllowUnclassed(): boolean {
    return this.ptr.get_DockingAllowUnclassed();
  }
  set DockingAllowUnclassed(v: boolean) {
    this.ptr.set_DockingAllowUnclassed(v);
  }
}
/**
 * \/\/ Data payload for Drag and Drop operations: AcceptDragDropPayload(), GetDragDropPayload()
 */
export class ImGuiPayload extends ReferenceStruct {
  get Data(): string {
    return this.ptr.get_Data();
  }
  get DataSize(): number {
    return this.ptr.get_DataSize();
  }

  Clear(): void {
    this.ptr.ImGuiPayload_Clear();
  }
  IsDataType(type: string): boolean {
    return this.ptr.ImGuiPayload_IsDataType(type);
  }
  IsPreview(): boolean {
    return this.ptr.ImGuiPayload_IsPreview();
  }
  IsDelivery(): boolean {
    return this.ptr.ImGuiPayload_IsDelivery();
  }
}
/**
 * \/\/ Helper: Manually clip large list of items.
 * \/\/ If you have lots evenly spaced items and you have random access to the list, you can perform coarse
 * \/\/ clipping based on visibility to only submit items that are in view.
 * \/\/ The clipper calculates the range of visible items and advance the cursor to compensate for the non-visible items we have skipped.
 * \/\/ (Dear ImGui already clip items based on their bounds but: it needs to first layout the item to do so, and generally
 * \/\/  fetching\/submitting your own data incurs additional cost. Coarse clipping using ImGuiListClipper allows you to easily
 * \/\/  scale using lists with tens of thousands of items without a problem)
 * \/\/ Usage:
 * \/\/   ImGuiListClipper clipper;
 * \/\/   clipper.Begin(1000);         \/\/ We have 1000 elements, evenly spaced.
 * \/\/   while (clipper.Step())
 * \/\/       for (int i = clipper.DisplayStart; i < clipper.DisplayEnd; i++)
 * \/\/           ImGui::Text("line number %d", i);
 * \/\/ Generally what happens is:
 * \/\/ - Clipper lets you process the first element (DisplayStart = 0, DisplayEnd = 1) regardless of it being visible or not.
 * \/\/ - User code submit that one element.
 * \/\/ - Clipper can measure the height of the first element
 * \/\/ - Clipper calculate the actual range of elements to display based on the current clipping rectangle, position the cursor before the first visible element.
 * \/\/ - User code submit visible elements.
 * \/\/ - The clipper also handles various subtleties related to keyboard\/gamepad navigation, wrapping etc.
 */
export class ImGuiListClipper extends ReferenceStruct {
  /**
   * \/\/ First item to display, updated by each call to Step()
   */
  get DisplayStart(): number {
    return this.ptr.get_DisplayStart();
  }
  set DisplayStart(v: number) {
    this.ptr.set_DisplayStart(v);
  }
  /**
   * \/\/ End of items to display (exclusive)
   */
  get DisplayEnd(): number {
    return this.ptr.get_DisplayEnd();
  }
  set DisplayEnd(v: number) {
    this.ptr.set_DisplayEnd(v);
  }
  /**
   * \/\/ Helper storage for user convenience\/code. Optional, and otherwise unused if you don't use it.
   */
  get UserIndex(): number {
    return this.ptr.get_UserIndex();
  }
  set UserIndex(v: number) {
    this.ptr.set_UserIndex(v);
  }
  /**
   * \/\/ [Internal] Number of items
   */
  get ItemsCount(): number {
    return this.ptr.get_ItemsCount();
  }
  set ItemsCount(v: number) {
    this.ptr.set_ItemsCount(v);
  }
  /**
   * \/\/ [Internal] Height of item after a first step and item submission can calculate it
   */
  get ItemsHeight(): number {
    return this.ptr.get_ItemsHeight();
  }
  set ItemsHeight(v: number) {
    this.ptr.set_ItemsHeight(v);
  }
  /**
   * \/\/ [Internal] Flags, currently not yet well exposed.
   */
  get Flags(): ImGuiListClipperFlags {
    return this.ptr.get_Flags();
  }
  set Flags(v: ImGuiListClipperFlags) {
    this.ptr.set_Flags(v);
  }
  /**
   * \/\/ [Internal] Cursor position at the time of Begin() or after table frozen rows are all processed
   */
  get StartPosY(): number {
    return this.ptr.get_StartPosY();
  }
  set StartPosY(v: number) {
    this.ptr.set_StartPosY(v);
  }
  /**
   * \/\/ [Internal] Account for frozen rows in a table and initial loss of precision in very large windows.
   */
  get StartSeekOffsetY(): number {
    return this.ptr.get_StartSeekOffsetY();
  }
  set StartSeekOffsetY(v: number) {
    this.ptr.set_StartSeekOffsetY(v);
  }
  /**
   * \/\/ [Internal] Parent UI context
   */
  get Ctx(): ImGuiContext {
    return ImGuiContext.From(this.ptr.get_Ctx());
  }
  set Ctx(v: ImGuiContext) {
    this.ptr.set_Ctx(v);
  }
  /**
   * \/\/ [Internal] Internal data
   */
  get TempData(): any {
    return this.ptr.get_TempData();
  }
  set TempData(v: any) {
    this.ptr.set_TempData(v);
  }

  Begin(items_count: number, items_height: number = -1.0): void {
    this.ptr.ImGuiListClipper_Begin(items_count, items_height);
  }
  /**
   * \/\/ Automatically called on the last call of Step() that returns false.
   */
  End(): void {
    this.ptr.ImGuiListClipper_End();
  }
  /**
   * \/\/ Call until it returns false. The DisplayStart\/DisplayEnd fields will be set and you can process\/draw those items.
   */
  Step(): boolean {
    return this.ptr.ImGuiListClipper_Step();
  }
  /**
   * \/\/ Call IncludeItemByIndex() or IncludeItemsByIndex() *BEFORE* first call to Step() if you need a range of items to not be clipped, regardless of their visibility.
   * \/\/ (Due to alignment \/ padding of certain items it is possible that an extra item may be included on either end of the display range).
   */
  IncludeItemByIndex(item_index: number): void {
    this.ptr.ImGuiListClipper_IncludeItemByIndex(item_index);
  }
  /**
   * \/\/ item_end is exclusive e.g. use (42, 42+1) to make item 42 never clipped.
   */
  IncludeItemsByIndex(item_begin: number, item_end: number): void {
    this.ptr.ImGuiListClipper_IncludeItemsByIndex(item_begin, item_end);
  }
  /**
   * \/\/ Seek cursor toward given item. This is automatically called while stepping.
   * \/\/ - The only reason to call this is: you can use ImGuiListClipper::Begin(INT_MAX) if you don't know item count ahead of time.
   * \/\/ - In this case, after all steps are done, you'll want to call SeekCursorForItem(item_count).
   */
  SeekCursorForItem(item_index: number): void {
    this.ptr.ImGuiListClipper_SeekCursorForItem(item_index);
  }
}
/**
 * \/\/ Helper: ImColor() implicitly converts colors to either ImU32 (packed 4x1 byte) or ImVec4 (4x1 float)
 * \/\/ Prefer using IM_COL32() macros if you want a guaranteed compile-time ImU32 for usage with ImDrawList API.
 * \/\/ **Avoid storing ImColor! Store either u32 of ImVec4. This is not a full-featured color class. MAY OBSOLETE.
 * \/\/ **None of the ImGui API are using ImColor directly but you can use it as a convenience to pass colors in either ImU32 or ImVec4 formats. Explicitly cast to ImU32 or ImVec4 if needed.
 */
export class ImColor extends ReferenceStruct {
  get Value(): ImVec4 {
    return ImVec4.From(this.ptr.get_Value());
  }
  set Value(v: ImVec4) {
    this.ptr.set_Value(v);
  }

  /**
   * \/\/ FIXME-OBSOLETE: May need to obsolete\/cleanup those helpers.
   */
  SetHSV(h: number, s: number, v: number, a: number = 1.0): void {
    this.ptr.ImColor_SetHSV(h, s, v, a);
  }
  HSV(h: number, s: number, v: number, a: number = 1.0): ImColor {
    return ImColor.From(this.ptr.ImColor_HSV(h, s, v, a));
  }
}
/**
 * \/\/ Main IO structure returned by BeginMultiSelect()\/EndMultiSelect().
 * \/\/ This mainly contains a list of selection requests.
 * \/\/ - Use 'Demo->Tools->Debug Log->Selection' to see requests as they happen.
 * \/\/ - Some fields are only useful if your list is dynamic and allows deletion (getting post-deletion focus\/state right is shown in the demo)
 * \/\/ - Below: who reads\/writes each fields? 'r'=read, 'w'=write, 'ms'=multi-select code, 'app'=application\/user code.
 */
export class ImGuiMultiSelectIO extends ReferenceStruct {
  // Opaque
}
/**
 * \/\/ Typically, 1 command = 1 GPU draw call (unless command is a callback)
 * \/\/ - VtxOffset: When 'io.BackendFlags & ImGuiBackendFlags_RendererHasVtxOffset' is enabled,
 * \/\/   this fields allow us to render meshes larger than 64K vertices while keeping 16-bit indices.
 * \/\/   Backends made for <1.71. will typically ignore the VtxOffset fields.
 * \/\/ - The ClipRect\/TexRef\/VtxOffset fields must be contiguous as we memcmp() them together (this is asserted for).
 */
export class ImDrawCmd extends ReferenceStruct {
  /**
   * \/\/ 4*4  \/\/ Clipping rectangle (x1, y1, x2, y2). Subtract ImDrawData->DisplayPos to get clipping rectangle in "viewport" coordinates
   */
  get ClipRect(): ImVec4 {
    return ImVec4.From(this.ptr.get_ClipRect());
  }
  set ClipRect(v: ImVec4) {
    this.ptr.set_ClipRect(v);
  }
  /**
   * \/\/ 16   \/\/ Reference to a font\/texture atlas (where backend called ImTextureData::SetTexID()) or to a user-provided texture ID (via e.g. ImGui::Image() calls). Both will lead to a ImTextureID value.
   */
  get TexRef(): ImTextureRef {
    return ImTextureRef.From(this.ptr.get_TexRef());
  }
  set TexRef(v: ImTextureRef) {
    this.ptr.set_TexRef(v);
  }
  /**
   * \/\/ 4    \/\/ Start offset in vertex buffer. ImGuiBackendFlags_RendererHasVtxOffset: always 0, otherwise may be >0 to support meshes larger than 64K vertices with 16-bit indices.
   */
  get VtxOffset(): number {
    return this.ptr.get_VtxOffset();
  }
  set VtxOffset(v: number) {
    this.ptr.set_VtxOffset(v);
  }
  /**
   * \/\/ 4    \/\/ Start offset in index buffer.
   */
  get IdxOffset(): number {
    return this.ptr.get_IdxOffset();
  }
  set IdxOffset(v: number) {
    this.ptr.set_IdxOffset(v);
  }
  /**
   * \/\/ 4    \/\/ Number of indices (multiple of 3) to be rendered as triangles. Vertices are stored in the callee ImDrawList's vtx_buffer[] array, indices in idx_buffer[].
   */
  get ElemCount(): number {
    return this.ptr.get_ElemCount();
  }
  set ElemCount(v: number) {
    this.ptr.set_ElemCount(v);
  }
  /**
   * \/\/ 4-8  \/\/ If != NULL, call the function instead of rendering the vertices. clip_rect and texture_id will be set normally.
   */
  get UserCallback(): ImDrawCallback {
    return this.ptr.get_UserCallback();
  }
  set UserCallback(v: ImDrawCallback) {
    this.ptr.set_UserCallback(v);
  }
  /**
   * \/\/ 4-8  \/\/ Callback user data (when UserCallback != NULL). If called AddCallback() with size == 0, this is a copy of the AddCallback() argument. If called AddCallback() with size > 0, this is pointing to a buffer where data is stored.
   */
  get UserCallbackData(): any {
    return this.ptr.get_UserCallbackData();
  }
  set UserCallbackData(v: any) {
    this.ptr.set_UserCallbackData(v);
  }
  /**
   * \/\/ 4 \/\/ Size of callback user data when using storage, otherwise 0.
   */
  get UserCallbackDataSize(): number {
    return this.ptr.get_UserCallbackDataSize();
  }
  set UserCallbackDataSize(v: number) {
    this.ptr.set_UserCallbackDataSize(v);
  }
  /**
   * \/\/ 4 \/\/ [Internal] Offset of callback user data when using storage, otherwise -1.
   */
  get UserCallbackDataOffset(): number {
    return this.ptr.get_UserCallbackDataOffset();
  }
  set UserCallbackDataOffset(v: number) {
    this.ptr.set_UserCallbackDataOffset(v);
  }

  // \/\/ Since 1.83: returns ImTextureID associated with this draw call. Warning: DO NOT assume this is always same as 'TextureId' (we will change this function for an upcoming feature)
  // \/\/ Since 1.92: removed ImDrawCmd::TextureId field, the getter function must be used!

  /**
   * \/\/ == (TexRef._TexData ? TexRef._TexData->TexID : TexRef._TexID)
   */
  GetTexID(): ImTextureID {
    return this.ptr.ImDrawCmd_GetTexID();
  }
}
/**
 * \/\/ Draw command list
 * \/\/ This is the low-level list of polygons that ImGui:: functions are filling. At the end of the frame,
 * \/\/ all command lists are passed to your ImGuiIO::RenderDrawListFn function for rendering.
 * \/\/ Each dear imgui window contains its own ImDrawList. You can use ImGui::GetWindowDrawList() to
 * \/\/ access the current window draw list and draw custom primitives.
 * \/\/ You can interleave normal ImGui:: calls and adding primitives to the current draw list.
 * \/\/ In single viewport mode, top-left is == GetMainViewport()->Pos (generally 0,0), bottom-right is == GetMainViewport()->Pos+Size (generally io.DisplaySize).
 * \/\/ You are totally free to apply whatever transformation matrix you want to the data (depending on the use of the transformation you may want to apply it to ClipRect as well!)
 * \/\/ Important: Primitives are always added to the list and not culled (culling is done at higher-level by ImGui:: functions), if you use this API a lot consider coarse culling your drawn objects.
 */
export class ImDrawList extends ReferenceStruct {
  /**
   * \/\/ Flags, you may poke into these to adjust anti-aliasing settings per-primitive.
   */
  get Flags(): ImDrawListFlags {
    return this.ptr.get_Flags();
  }
  set Flags(v: ImDrawListFlags) {
    this.ptr.set_Flags(v);
  }

  /**
   * \/\/ Render-level scissoring. This is passed down to your render function but not used for CPU-side coarse clipping. Prefer using higher-level ImGui::PushClipRect() to affect logic (hit-testing and widget culling)
   */
  PushClipRect(
    clip_rect_min: ImVec2,
    clip_rect_max: ImVec2,
    intersect_with_current_clip_rect: boolean = false,
  ): void {
    this.ptr.ImDrawList_PushClipRect(
      clip_rect_min,
      clip_rect_max,
      intersect_with_current_clip_rect,
    );
  }
  PushClipRectFullScreen(): void {
    this.ptr.ImDrawList_PushClipRectFullScreen();
  }
  PopClipRect(): void {
    this.ptr.ImDrawList_PopClipRect();
  }
  PushTexture(tex_ref: ImTextureRef): void {
    this.ptr.ImDrawList_PushTexture(tex_ref);
  }
  PopTexture(): void {
    this.ptr.ImDrawList_PopTexture();
  }
  GetClipRectMin(): ImVec2 {
    return ImVec2.From(this.ptr.ImDrawList_GetClipRectMin());
  }
  GetClipRectMax(): ImVec2 {
    return ImVec2.From(this.ptr.ImDrawList_GetClipRectMax());
  }
  /**
   * \/\/ Primitives
   * \/\/ - Filled shapes must always use clockwise winding order. The anti-aliasing fringe depends on it. Counter-clockwise shapes will have "inward" anti-aliasing.
   * \/\/ - For rectangular primitives, "p_min" and "p_max" represent the upper-left and lower-right corners.
   * \/\/ - For circle primitives, use "num_segments == 0" to automatically calculate tessellation (preferred).
   * \/\/   In older versions (until Dear ImGui 1.77) the AddCircle functions defaulted to num_segments == 12.
   * \/\/   In future versions we will use textures to provide cheaper and higher-quality circles.
   * \/\/   Use AddNgon() and AddNgonFilled() functions if you need to guarantee a specific number of sides.
   */
  AddLine(p1: ImVec2, p2: ImVec2, col: ImU32, thickness: number = 1.0): void {
    this.ptr.ImDrawList_AddLine(p1, p2, col, thickness);
  }
  /**
   * \/\/ a: upper-left, b: lower-right (== upper-left + size)
   */
  AddRect(
    p_min: ImVec2,
    p_max: ImVec2,
    col: ImU32,
    rounding: number = 0.0,
    flags: ImDrawFlags = 0,
    thickness: number = 1.0,
  ): void {
    this.ptr.ImDrawList_AddRect(p_min, p_max, col, rounding, flags, thickness);
  }
  /**
   * \/\/ a: upper-left, b: lower-right (== upper-left + size)
   */
  AddRectFilled(
    p_min: ImVec2,
    p_max: ImVec2,
    col: ImU32,
    rounding: number = 0.0,
    flags: ImDrawFlags = 0,
  ): void {
    this.ptr.ImDrawList_AddRectFilled(p_min, p_max, col, rounding, flags);
  }
  AddRectFilledMultiColor(
    p_min: ImVec2,
    p_max: ImVec2,
    col_upr_left: ImU32,
    col_upr_right: ImU32,
    col_bot_right: ImU32,
    col_bot_left: ImU32,
  ): void {
    this.ptr.ImDrawList_AddRectFilledMultiColor(
      p_min,
      p_max,
      col_upr_left,
      col_upr_right,
      col_bot_right,
      col_bot_left,
    );
  }
  AddQuad(
    p1: ImVec2,
    p2: ImVec2,
    p3: ImVec2,
    p4: ImVec2,
    col: ImU32,
    thickness: number = 1.0,
  ): void {
    this.ptr.ImDrawList_AddQuad(p1, p2, p3, p4, col, thickness);
  }
  AddQuadFilled(p1: ImVec2, p2: ImVec2, p3: ImVec2, p4: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_AddQuadFilled(p1, p2, p3, p4, col);
  }
  AddTriangle(p1: ImVec2, p2: ImVec2, p3: ImVec2, col: ImU32, thickness: number = 1.0): void {
    this.ptr.ImDrawList_AddTriangle(p1, p2, p3, col, thickness);
  }
  AddTriangleFilled(p1: ImVec2, p2: ImVec2, p3: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_AddTriangleFilled(p1, p2, p3, col);
  }
  AddCircle(
    center: ImVec2,
    radius: number,
    col: ImU32,
    num_segments: number = 0,
    thickness: number = 1.0,
  ): void {
    this.ptr.ImDrawList_AddCircle(center, radius, col, num_segments, thickness);
  }
  AddCircleFilled(center: ImVec2, radius: number, col: ImU32, num_segments: number = 0): void {
    this.ptr.ImDrawList_AddCircleFilled(center, radius, col, num_segments);
  }
  AddNgon(
    center: ImVec2,
    radius: number,
    col: ImU32,
    num_segments: number,
    thickness: number = 1.0,
  ): void {
    this.ptr.ImDrawList_AddNgon(center, radius, col, num_segments, thickness);
  }
  AddNgonFilled(center: ImVec2, radius: number, col: ImU32, num_segments: number): void {
    this.ptr.ImDrawList_AddNgonFilled(center, radius, col, num_segments);
  }
  AddEllipse(
    center: ImVec2,
    radius: ImVec2,
    col: ImU32,
    rot: number = 0.0,
    num_segments: number = 0,
    thickness: number = 1.0,
  ): void {
    this.ptr.ImDrawList_AddEllipse(center, radius, col, rot, num_segments, thickness);
  }
  AddEllipseFilled(
    center: ImVec2,
    radius: ImVec2,
    col: ImU32,
    rot: number = 0.0,
    num_segments: number = 0,
  ): void {
    this.ptr.ImDrawList_AddEllipseFilled(center, radius, col, rot, num_segments);
  }
  AddText(pos: ImVec2, col: ImU32, text_begin: string, text_end: string = ""): void {
    this.ptr.ImDrawList_AddText(pos, col, text_begin, text_end);
  }
  AddTextImFontPtr(
    font: ImFont,
    font_size: number,
    pos: ImVec2,
    col: ImU32,
    text_begin: string,
    text_end: string = "",
    wrap_width: number = 0.0,
    cpu_fine_clip_rect: ImVec4 | null = null,
  ): void {
    this.ptr.ImDrawList_AddTextImFontPtr(
      font?.ptr ?? null,
      font_size,
      pos,
      col,
      text_begin,
      text_end,
      wrap_width,
      cpu_fine_clip_rect,
    );
  }
  /**
   * \/\/ Cubic Bezier (4 control points)
   */
  AddBezierCubic(
    p1: ImVec2,
    p2: ImVec2,
    p3: ImVec2,
    p4: ImVec2,
    col: ImU32,
    thickness: number,
    num_segments: number = 0,
  ): void {
    this.ptr.ImDrawList_AddBezierCubic(p1, p2, p3, p4, col, thickness, num_segments);
  }
  /**
   * \/\/ Quadratic Bezier (3 control points)
   */
  AddBezierQuadratic(
    p1: ImVec2,
    p2: ImVec2,
    p3: ImVec2,
    col: ImU32,
    thickness: number,
    num_segments: number = 0,
  ): void {
    this.ptr.ImDrawList_AddBezierQuadratic(p1, p2, p3, col, thickness, num_segments);
  }
  /**
   * \/\/ General polygon
   * \/\/ - Only simple polygons are supported by filling functions (no self-intersections, no holes).
   * \/\/ - Concave polygon fill is more expensive than convex one: it has O(N^2) complexity. Provided as a convenience for the user but not used by the main library.
   */
  AddPolyline(
    points: ImVec2,
    num_points: number,
    col: ImU32,
    flags: ImDrawFlags,
    thickness: number,
  ): void {
    this.ptr.ImDrawList_AddPolyline(points, num_points, col, flags, thickness);
  }
  AddConvexPolyFilled(points: ImVec2, num_points: number, col: ImU32): void {
    this.ptr.ImDrawList_AddConvexPolyFilled(points, num_points, col);
  }
  AddConcavePolyFilled(points: ImVec2, num_points: number, col: ImU32): void {
    this.ptr.ImDrawList_AddConcavePolyFilled(points, num_points, col);
  }
  /**
   * \/\/ Image primitives
   * \/\/ - Read FAQ to understand what ImTextureID\/ImTextureRef are.
   * \/\/ - "p_min" and "p_max" represent the upper-left and lower-right corners of the rectangle.
   * \/\/ - "uv_min" and "uv_max" represent the normalized texture coordinates to use for those corners. Using (0,0)->(1,1) texture coordinates will generally display the entire texture.
   */
  AddImage(
    tex_ref: ImTextureRef,
    p_min: ImVec2,
    p_max: ImVec2,
    uv_min: ImVec2 = new ImVec2(0, 0),
    uv_max: ImVec2 = new ImVec2(1, 1),
    col: ImU32 = IM_COL32_WHITE,
  ): void {
    this.ptr.ImDrawList_AddImage(tex_ref, p_min, p_max, uv_min, uv_max, col);
  }
  AddImageQuad(
    tex_ref: ImTextureRef,
    p1: ImVec2,
    p2: ImVec2,
    p3: ImVec2,
    p4: ImVec2,
    uv1: ImVec2 = new ImVec2(0, 0),
    uv2: ImVec2 = new ImVec2(1, 0),
    uv3: ImVec2 = new ImVec2(1, 1),
    uv4: ImVec2 = new ImVec2(0, 1),
    col: ImU32 = IM_COL32_WHITE,
  ): void {
    this.ptr.ImDrawList_AddImageQuad(tex_ref, p1, p2, p3, p4, uv1, uv2, uv3, uv4, col);
  }
  AddImageRounded(
    tex_ref: ImTextureRef,
    p_min: ImVec2,
    p_max: ImVec2,
    uv_min: ImVec2,
    uv_max: ImVec2,
    col: ImU32,
    rounding: number,
    flags: ImDrawFlags = 0,
  ): void {
    this.ptr.ImDrawList_AddImageRounded(
      tex_ref,
      p_min,
      p_max,
      uv_min,
      uv_max,
      col,
      rounding,
      flags,
    );
  }
  /**
   * \/\/ Stateful path API, add points then finish with PathFillConvex() or PathStroke()
   * \/\/ - Important: filled shapes must always use clockwise winding order! The anti-aliasing fringe depends on it. Counter-clockwise shapes will have "inward" anti-aliasing.
   * \/\/   so e.g. 'PathArcTo(center, radius, PI * -0.5f, PI)' is ok, whereas 'PathArcTo(center, radius, PI, PI * -0.5f)' won't have correct anti-aliasing when followed by PathFillConvex().
   */
  PathClear(): void {
    this.ptr.ImDrawList_PathClear();
  }
  PathLineTo(pos: ImVec2): void {
    this.ptr.ImDrawList_PathLineTo(pos);
  }
  PathLineToMergeDuplicate(pos: ImVec2): void {
    this.ptr.ImDrawList_PathLineToMergeDuplicate(pos);
  }
  PathFillConvex(col: ImU32): void {
    this.ptr.ImDrawList_PathFillConvex(col);
  }
  PathFillConcave(col: ImU32): void {
    this.ptr.ImDrawList_PathFillConcave(col);
  }
  PathStroke(col: ImU32, flags: ImDrawFlags = 0, thickness: number = 1.0): void {
    this.ptr.ImDrawList_PathStroke(col, flags, thickness);
  }
  PathArcTo(
    center: ImVec2,
    radius: number,
    a_min: number,
    a_max: number,
    num_segments: number = 0,
  ): void {
    this.ptr.ImDrawList_PathArcTo(center, radius, a_min, a_max, num_segments);
  }
  /**
   * \/\/ Use precomputed angles for a 12 steps circle
   */
  PathArcToFast(center: ImVec2, radius: number, a_min_of_12: number, a_max_of_12: number): void {
    this.ptr.ImDrawList_PathArcToFast(center, radius, a_min_of_12, a_max_of_12);
  }
  /**
   * \/\/ Ellipse
   */
  PathEllipticalArcTo(
    center: ImVec2,
    radius: ImVec2,
    rot: number,
    a_min: number,
    a_max: number,
    num_segments: number = 0,
  ): void {
    this.ptr.ImDrawList_PathEllipticalArcTo(center, radius, rot, a_min, a_max, num_segments);
  }
  /**
   * \/\/ Cubic Bezier (4 control points)
   */
  PathBezierCubicCurveTo(p2: ImVec2, p3: ImVec2, p4: ImVec2, num_segments: number = 0): void {
    this.ptr.ImDrawList_PathBezierCubicCurveTo(p2, p3, p4, num_segments);
  }
  /**
   * \/\/ Quadratic Bezier (3 control points)
   */
  PathBezierQuadraticCurveTo(p2: ImVec2, p3: ImVec2, num_segments: number = 0): void {
    this.ptr.ImDrawList_PathBezierQuadraticCurveTo(p2, p3, num_segments);
  }
  PathRect(
    rect_min: ImVec2,
    rect_max: ImVec2,
    rounding: number = 0.0,
    flags: ImDrawFlags = 0,
  ): void {
    this.ptr.ImDrawList_PathRect(rect_min, rect_max, rounding, flags);
  }
  /**
   * \/\/ Advanced: Draw Callbacks
   * \/\/ - May be used to alter render state (change sampler, blending, current shader). May be used to emit custom rendering commands (difficult to do correctly, but possible).
   * \/\/ - Use special ImDrawCallback_ResetRenderState callback to instruct backend to reset its render state to the default.
   * \/\/ - Your rendering loop must check for 'UserCallback' in ImDrawCmd and call the function instead of rendering triangles. All standard backends are honoring this.
   * \/\/ - For some backends, the callback may access selected render-states exposed by the backend in a ImGui_ImplXXXX_RenderState structure pointed to by platform_io.Renderer_RenderState.
   * \/\/ - IMPORTANT: please be mindful of the different level of indirection between using size==0 (copying argument) and using size>0 (copying pointed data into a buffer).
   * \/\/   - If userdata_size == 0: we copy\/store the 'userdata' argument as-is. It will be available unmodified in ImDrawCmd::UserCallbackData during render.
   * \/\/   - If userdata_size > 0,  we copy\/store 'userdata_size' bytes pointed to by 'userdata'. We store them in a buffer stored inside the drawlist. ImDrawCmd::UserCallbackData will point inside that buffer so you have to retrieve data from there. Your callback may need to use ImDrawCmd::UserCallbackDataSize if you expect dynamically-sized data.
   * \/\/   - Support for userdata_size > 0 was added in v1.91.4, October 2024. So earlier code always only allowed to copy\/store a simple void*.
   */
  AddCallback(callback: ImDrawCallback, userdata: any, userdata_size: number = 0): void {
    this.ptr.ImDrawList_AddCallback(callback, userdata, userdata_size);
  }

  // \/\/ Advanced: Miscellaneous

  /**
   * \/\/ This is useful if you need to forcefully create a new draw call (to allow for dependent rendering \/ blending). Otherwise primitives are merged into the same draw-call as much as possible
   */
  AddDrawCmd(): void {
    this.ptr.ImDrawList_AddDrawCmd();
  }
  /**
   * \/\/ Create a clone of the CmdBuffer\/IdxBuffer\/VtxBuffer. For multi-threaded rendering, consider using `imgui_threaded_rendering` from https:\/\/github.com\/ocornut\/imgui_club instead.
   */
  CloneOutput(): ImDrawList {
    return ImDrawList.From(this.ptr.ImDrawList_CloneOutput());
  }
  /**
   * \/\/ Advanced: Channels
   * \/\/ - Use to split render into layers. By switching channels to can render out-of-order (e.g. submit FG primitives before BG primitives)
   * \/\/ - Use to minimize draw calls (e.g. if going back-and-forth between multiple clipping rectangles, prefer to append into separate channels then merge at the end)
   * \/\/ - This API shouldn't have been in ImDrawList in the first place!
   * \/\/   Prefer using your own persistent instance of ImDrawListSplitter as you can stack them.
   * \/\/   Using the ImDrawList::ChannelsXXXX you cannot stack a split over another.
   */
  ChannelsSplit(count: number): void {
    this.ptr.ImDrawList_ChannelsSplit(count);
  }
  ChannelsMerge(): void {
    this.ptr.ImDrawList_ChannelsMerge();
  }
  ChannelsSetCurrent(n: number): void {
    this.ptr.ImDrawList_ChannelsSetCurrent(n);
  }
  /**
   * \/\/ Advanced: Primitives allocations
   * \/\/ - We render triangles (three vertices)
   * \/\/ - All primitives needs to be reserved via PrimReserve() beforehand.
   */
  PrimReserve(idx_count: number, vtx_count: number): void {
    this.ptr.ImDrawList_PrimReserve(idx_count, vtx_count);
  }
  PrimUnreserve(idx_count: number, vtx_count: number): void {
    this.ptr.ImDrawList_PrimUnreserve(idx_count, vtx_count);
  }
  /**
   * \/\/ Axis aligned rectangle (composed of two triangles)
   */
  PrimRect(a: ImVec2, b: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_PrimRect(a, b, col);
  }
  PrimRectUV(a: ImVec2, b: ImVec2, uv_a: ImVec2, uv_b: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_PrimRectUV(a, b, uv_a, uv_b, col);
  }
  PrimQuadUV(
    a: ImVec2,
    b: ImVec2,
    c: ImVec2,
    d: ImVec2,
    uv_a: ImVec2,
    uv_b: ImVec2,
    uv_c: ImVec2,
    uv_d: ImVec2,
    col: ImU32,
  ): void {
    this.ptr.ImDrawList_PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col);
  }
  PrimWriteVtx(pos: ImVec2, uv: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_PrimWriteVtx(pos, uv, col);
  }
  PrimWriteIdx(idx: ImDrawIdx): void {
    this.ptr.ImDrawList_PrimWriteIdx(idx);
  }
  /**
   * \/\/ Write vertex with unique index
   */
  PrimVtx(pos: ImVec2, uv: ImVec2, col: ImU32): void {
    this.ptr.ImDrawList_PrimVtx(pos, uv, col);
  }
  /**
   * \/\/ [Internal helpers]
   */
  _SetDrawListSharedData(data: ImDrawListSharedData): void {
    this.ptr.ImDrawList__SetDrawListSharedData(data?.ptr ?? null);
  }
  _ResetForNewFrame(): void {
    this.ptr.ImDrawList__ResetForNewFrame();
  }
  _ClearFreeMemory(): void {
    this.ptr.ImDrawList__ClearFreeMemory();
  }
  _PopUnusedDrawCmd(): void {
    this.ptr.ImDrawList__PopUnusedDrawCmd();
  }
  _TryMergeDrawCmds(): void {
    this.ptr.ImDrawList__TryMergeDrawCmds();
  }
  _OnChangedClipRect(): void {
    this.ptr.ImDrawList__OnChangedClipRect();
  }
  _OnChangedTexture(): void {
    this.ptr.ImDrawList__OnChangedTexture();
  }
  _OnChangedVtxOffset(): void {
    this.ptr.ImDrawList__OnChangedVtxOffset();
  }
  _SetTexture(tex_ref: ImTextureRef): void {
    this.ptr.ImDrawList__SetTexture(tex_ref);
  }
  _CalcCircleAutoSegmentCount(radius: number): number {
    return this.ptr.ImDrawList__CalcCircleAutoSegmentCount(radius);
  }
  _PathArcToFastEx(
    center: ImVec2,
    radius: number,
    a_min_sample: number,
    a_max_sample: number,
    a_step: number,
  ): void {
    this.ptr.ImDrawList__PathArcToFastEx(center, radius, a_min_sample, a_max_sample, a_step);
  }
  _PathArcToN(
    center: ImVec2,
    radius: number,
    a_min: number,
    a_max: number,
    num_segments: number,
  ): void {
    this.ptr.ImDrawList__PathArcToN(center, radius, a_min, a_max, num_segments);
  }
}
/**
 * \/\/ All draw data to render a Dear ImGui frame
 * \/\/ (NB: the style and the naming convention here is a little inconsistent, we currently preserve them for backward compatibility purpose,
 * \/\/ as this is one of the oldest structure exposed by the library! Basically, ImDrawList == CmdList)
 */
export class ImDrawData extends ReferenceStruct {
  // Opaque
}
/**
 * \/\/ A font input\/source (we may rename this to ImFontSource in the future)
 */
export class ImFontConfig extends ReferenceStruct {
  /**
   * \/\/          \/\/ TTF\/OTF data
   */
  get FontData(): any {
    return this.ptr.get_FontData();
  }
  set FontData(v: any) {
    this.ptr.set_FontData(v);
  }
  /**
   * \/\/          \/\/ TTF\/OTF data size
   */
  get FontDataSize(): number {
    return this.ptr.get_FontDataSize();
  }
  set FontDataSize(v: number) {
    this.ptr.set_FontDataSize(v);
  }
  /**
   * \/\/ true     \/\/ TTF\/OTF data ownership taken by the owner ImFontAtlas (will delete memory itself). SINCE 1.92, THE DATA NEEDS TO PERSIST FOR WHOLE DURATION OF ATLAS.
   */
  get FontDataOwnedByAtlas(): boolean {
    return this.ptr.get_FontDataOwnedByAtlas();
  }
  set FontDataOwnedByAtlas(v: boolean) {
    this.ptr.set_FontDataOwnedByAtlas(v);
  }

  // \/\/ Options

  /**
   * \/\/ false    \/\/ Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
   */
  get MergeMode(): boolean {
    return this.ptr.get_MergeMode();
  }
  set MergeMode(v: boolean) {
    this.ptr.set_MergeMode(v);
  }
  /**
   * \/\/ false    \/\/ Align every glyph AdvanceX to pixel boundaries. Prevents fractional font size from working correctly! Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, OversampleH\/V will default to 1.
   */
  get PixelSnapH(): boolean {
    return this.ptr.get_PixelSnapH();
  }
  set PixelSnapH(v: boolean) {
    this.ptr.set_PixelSnapH(v);
  }
  /**
   * \/\/ 0 (2)    \/\/ Rasterize at higher quality for sub-pixel positioning. 0 == auto == 1 or 2 depending on size. Note the difference between 2 and 3 is minimal. You can reduce this to 1 for large glyphs save memory. Read https:\/\/github.com\/nothings\/stb\/blob\/master\/tests\/oversample\/README.md for details.
   */
  get OversampleH(): ImS8 {
    return this.ptr.get_OversampleH();
  }
  set OversampleH(v: ImS8) {
    this.ptr.set_OversampleH(v);
  }
  /**
   * \/\/ 0 (1)    \/\/ Rasterize at higher quality for sub-pixel positioning. 0 == auto == 1. This is not really useful as we don't use sub-pixel positions on the Y axis.
   */
  get OversampleV(): ImS8 {
    return this.ptr.get_OversampleV();
  }
  set OversampleV(v: ImS8) {
    this.ptr.set_OversampleV(v);
  }
  /**
   * \/\/ 0        \/\/ Explicitly specify Unicode codepoint of ellipsis character. When fonts are being merged first specified ellipsis will be used.
   */
  get EllipsisChar(): ImWchar {
    return this.ptr.get_EllipsisChar();
  }
  set EllipsisChar(v: ImWchar) {
    this.ptr.set_EllipsisChar(v);
  }
  /**
   * \/\/          \/\/ Output size in pixels for rasterizer (more or less maps to the resulting font height).
   */
  get SizePixels(): number {
    return this.ptr.get_SizePixels();
  }
  set SizePixels(v: number) {
    this.ptr.set_SizePixels(v);
  }
  /**
   * \/\/ NULL     \/\/ *LEGACY* THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE. Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list).
   */
  get GlyphRanges(): ImWchar {
    return this.ptr.get_GlyphRanges();
  }
  set GlyphRanges(v: ImWchar) {
    this.ptr.set_GlyphRanges(v);
  }
  /**
   * \/\/ NULL     \/\/ Pointer to a small user-provided list of Unicode ranges (2 value per range, values are inclusive, zero-terminated list). This is very close to GlyphRanges[] but designed to exclude ranges from a font source, when merging fonts with overlapping glyphs. Use "Input Glyphs Overlap Detection Tool" to find about your overlapping ranges.
   */
  get GlyphExcludeRanges(): ImWchar {
    return this.ptr.get_GlyphExcludeRanges();
  }
  set GlyphExcludeRanges(v: ImWchar) {
    this.ptr.set_GlyphExcludeRanges(v);
  }

  // \/\/ImVec2        GlyphExtraSpacing;      \/\/ 0, 0     \/\/ (REMOVED AT IT SEEMS LARGELY OBSOLETE. PLEASE REPORT IF YOU WERE USING THIS). Extra spacing (in pixels) between glyphs when rendered: essentially add to glyph->AdvanceX. Only X axis is supported for now.

  /**
   * \/\/ 0, 0     \/\/ Offset (in pixels) all glyphs from this font input. Absolute value for default size, other sizes will scale this value.
   */
  get GlyphOffset(): ImVec2 {
    return ImVec2.From(this.ptr.get_GlyphOffset());
  }
  set GlyphOffset(v: ImVec2) {
    this.ptr.set_GlyphOffset(v);
  }
  /**
   * \/\/ 0        \/\/ Minimum AdvanceX for glyphs, set Min to align font icons, set both Min\/Max to enforce mono-space font. Absolute value for default size, other sizes will scale this value.
   */
  get GlyphMinAdvanceX(): number {
    return this.ptr.get_GlyphMinAdvanceX();
  }
  set GlyphMinAdvanceX(v: number) {
    this.ptr.set_GlyphMinAdvanceX(v);
  }
  /**
   * \/\/ FLT_MAX  \/\/ Maximum AdvanceX for glyphs
   */
  get GlyphMaxAdvanceX(): number {
    return this.ptr.get_GlyphMaxAdvanceX();
  }
  set GlyphMaxAdvanceX(v: number) {
    this.ptr.set_GlyphMaxAdvanceX(v);
  }
  /**
   * \/\/ 0        \/\/ Extra spacing (in pixels) between glyphs. Please contact us if you are using this. \/\/ FIXME-NEWATLAS: Intentionally unscaled
   */
  get GlyphExtraAdvanceX(): number {
    return this.ptr.get_GlyphExtraAdvanceX();
  }
  set GlyphExtraAdvanceX(v: number) {
    this.ptr.set_GlyphExtraAdvanceX(v);
  }
  /**
   * \/\/ 0        \/\/ Index of font within TTF\/OTF file
   */
  get FontNo(): ImU32 {
    return this.ptr.get_FontNo();
  }
  set FontNo(v: ImU32) {
    this.ptr.set_FontNo(v);
  }
  /**
   * \/\/ 0        \/\/ Settings for custom font builder. THIS IS BUILDER IMPLEMENTATION DEPENDENT. Leave as zero if unsure.
   */
  get FontLoaderFlags(): number {
    return this.ptr.get_FontLoaderFlags();
  }
  set FontLoaderFlags(v: number) {
    this.ptr.set_FontLoaderFlags(v);
  }

  // \/\/unsigned int  FontBuilderFlags;       \/\/ --       \/\/ [Renamed in 1.92] Use FontLoaderFlags.

  /**
   * \/\/ 1.0f     \/\/ Linearly brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable. This is a silly thing we may remove in the future.
   */
  get RasterizerMultiply(): number {
    return this.ptr.get_RasterizerMultiply();
  }
  set RasterizerMultiply(v: number) {
    this.ptr.set_RasterizerMultiply(v);
  }
  /**
   * \/\/ 1.0f     \/\/ [LEGACY: this only makes sense when ImGuiBackendFlags_RendererHasTextures is not supported] DPI scale multiplier for rasterization. Not altering other font metrics: makes it easy to swap between e.g. a 100% and a 400% fonts for a zooming display, or handle Retina screen. IMPORTANT: If you change this it is expected that you increase\/decrease font scale roughly to the inverse of this, otherwise quality may look lowered.
   */
  get RasterizerDensity(): number {
    return this.ptr.get_RasterizerDensity();
  }
  set RasterizerDensity(v: number) {
    this.ptr.set_RasterizerDensity(v);
  }
  /**
   * \/\/ 1.0f     \/\/ Extra rasterizer scale over SizePixels.
   */
  get ExtraSizeScale(): number {
    return this.ptr.get_ExtraSizeScale();
  }
  set ExtraSizeScale(v: number) {
    this.ptr.set_ExtraSizeScale(v);
  }
}
/**
 * \/\/ Output of ImFontAtlas::GetCustomRect() when using custom rectangles.
 * \/\/ Those values may not be cached\/stored as they are only valid for the current value of atlas->TexRef
 * \/\/ (this is in theory derived from ImTextureRect but we use separate structures for reasons)
 */
export class ImFontAtlasRect extends ReferenceStruct {
  /**
   * \/\/ Position (in current texture)
   */
  get x(): number {
    return this.ptr.get_x();
  }
  set x(v: number) {
    this.ptr.set_x(v);
  }
  /**
   * \/\/ Position (in current texture)
   */
  get y(): number {
    return this.ptr.get_y();
  }
  set y(v: number) {
    this.ptr.set_y(v);
  }
  /**
   * \/\/ Size
   */
  get w(): number {
    return this.ptr.get_w();
  }
  set w(v: number) {
    this.ptr.set_w(v);
  }
  /**
   * \/\/ Size
   */
  get h(): number {
    return this.ptr.get_h();
  }
  set h(v: number) {
    this.ptr.set_h(v);
  }
  /**
   * \/\/ UV coordinates (in current texture)
   */
  get uv0(): ImVec2 {
    return ImVec2.From(this.ptr.get_uv0());
  }
  set uv0(v: ImVec2) {
    this.ptr.set_uv0(v);
  }
  /**
   * \/\/ UV coordinates (in current texture)
   */
  get uv1(): ImVec2 {
    return ImVec2.From(this.ptr.get_uv1());
  }
  set uv1(v: ImVec2) {
    this.ptr.set_uv1(v);
  }
}
/**
 * \/\/ Load and rasterize multiple TTF\/OTF fonts into a same texture. The font atlas will build a single texture holding:
 * \/\/  - One or more fonts.
 * \/\/  - Custom graphics data needed to render the shapes needed by Dear ImGui.
 * \/\/  - Mouse cursor shapes for software cursor rendering (unless setting 'Flags |= ImFontAtlasFlags_NoMouseCursors' in the font atlas).
 * \/\/  - If you don't call any AddFont*** functions, the default font embedded in the code will be loaded for you.
 * \/\/ It is the rendering backend responsibility to upload texture into your graphics API:
 * \/\/  - ImGui_ImplXXXX_RenderDrawData() functions generally iterate platform_io->Textures[] to create\/update\/destroy each ImTextureData instance.
 * \/\/  - Backend then set ImTextureData's TexID and BackendUserData.
 * \/\/  - Texture id are passed back to you during rendering to identify the texture. Read FAQ entry about ImTextureID\/ImTextureRef for more details.
 * \/\/ Legacy path:
 * \/\/  - Call Build() + GetTexDataAsAlpha8() or GetTexDataAsRGBA32() to build and retrieve pixels data.
 * \/\/  - Call SetTexID(my_tex_id); and pass the pointer\/identifier to your texture in a format natural to your graphics API.
 * \/\/ Common pitfalls:
 * \/\/ - If you pass a 'glyph_ranges' array to AddFont*** functions, you need to make sure that your array persists up until the
 * \/\/   atlas is build (when calling GetTexData*** or Build()). We only copy the pointer, not the data.
 * \/\/ - Important: By default, AddFontFromMemoryTTF() takes ownership of the data. Even though we are not writing to it, we will free the pointer on destruction.
 * \/\/   You can set font_cfg->FontDataOwnedByAtlas=false to keep ownership of your data and it won't be freed,
 * \/\/ - Even though many functions are suffixed with "TTF", OTF data is supported just as well.
 * \/\/ - This is an old API and it is currently awkward for those and various other reasons! We will address them in the future!
 */
export class ImFontAtlas extends ReferenceStruct {
  // \/\/ Input

  /**
   * \/\/ Build flags (see ImFontAtlasFlags_)
   */
  get Flags(): ImFontAtlasFlags {
    return this.ptr.get_Flags();
  }
  set Flags(v: ImFontAtlasFlags) {
    this.ptr.set_Flags(v);
  }
  /**
   * \/\/ FIXME: Should be called "TexPackPadding". Padding between glyphs within texture in pixels. Defaults to 1. If your rendering method doesn't rely on bilinear filtering you may set this to 0 (will also need to set AntiAliasedLinesUseTex = false).
   */
  get TexGlyphPadding(): number {
    return this.ptr.get_TexGlyphPadding();
  }
  set TexGlyphPadding(v: number) {
    this.ptr.set_TexGlyphPadding(v);
  }
  /**
   * \/\/ Minimum desired texture width. Must be a power of two. Default to 512.
   */
  get TexMinWidth(): number {
    return this.ptr.get_TexMinWidth();
  }
  set TexMinWidth(v: number) {
    this.ptr.set_TexMinWidth(v);
  }
  /**
   * \/\/ Minimum desired texture height. Must be a power of two. Default to 128.
   */
  get TexMinHeight(): number {
    return this.ptr.get_TexMinHeight();
  }
  set TexMinHeight(v: number) {
    this.ptr.set_TexMinHeight(v);
  }
  /**
   * \/\/ Maximum desired texture width. Must be a power of two. Default to 8192.
   */
  get TexMaxWidth(): number {
    return this.ptr.get_TexMaxWidth();
  }
  set TexMaxWidth(v: number) {
    this.ptr.set_TexMaxWidth(v);
  }
  /**
   * \/\/ Maximum desired texture height. Must be a power of two. Default to 8192.
   */
  get TexMaxHeight(): number {
    return this.ptr.get_TexMaxHeight();
  }
  set TexMaxHeight(v: number) {
    this.ptr.set_TexMaxHeight(v);
  }
  /**
   * \/\/ Store your own atlas related user-data (if e.g. you have multiple font atlas).
   */
  get UserData(): any {
    return this.ptr.get_UserData();
  }
  set UserData(v: any) {
    this.ptr.set_UserData(v);
  }
  /**
   * \/\/ Latest texture identifier == TexData->GetTexRef().
   */
  get TexRef(): ImTextureRef {
    return ImTextureRef.From(this.ptr.get_TexRef());
  }
  set TexRef(v: ImTextureRef) {
    this.ptr.set_TexRef(v);
  }

  AddFont(font_cfg: ImFontConfig): ImFont {
    return ImFont.From(this.ptr.ImFontAtlas_AddFont(font_cfg?.ptr ?? null));
  }
  /**
   * \/\/ Selects between AddFontDefaultVector() and AddFontDefaultBitmap().
   */
  AddFontDefault(font_cfg: ImFontConfig | null = null): ImFont {
    return ImFont.From(this.ptr.ImFontAtlas_AddFontDefault(font_cfg?.ptr ?? null));
  }
  /**
   * \/\/ Embedded scalable font. Recommended at any higher size.
   */
  AddFontDefaultVector(font_cfg: ImFontConfig | null = null): ImFont {
    return ImFont.From(this.ptr.ImFontAtlas_AddFontDefaultVector(font_cfg?.ptr ?? null));
  }
  /**
   * \/\/ Embedded classic pixel-clean font. Recommended at Size 13px with no scaling.
   */
  AddFontDefaultBitmap(font_cfg: ImFontConfig | null = null): ImFont {
    return ImFont.From(this.ptr.ImFontAtlas_AddFontDefaultBitmap(font_cfg?.ptr ?? null));
  }
  AddFontFromFileTTF(
    filename: string,
    size_pixels: number = 0.0,
    font_cfg: ImFontConfig | null = null,
    glyph_ranges: ImWchar[] | null = null,
  ): ImFont {
    return this.ptr.ImFontAtlas_AddFontFromFileTTF(
      filename,
      size_pixels,
      font_cfg?.ptr || null,
      glyph_ranges,
    );
  }
  RemoveFont(font: ImFont): void {
    this.ptr.ImFontAtlas_RemoveFont(font?.ptr ?? null);
  }
  /**
   * \/\/ Clear everything (input fonts, output glyphs\/textures).
   */
  Clear(): void {
    this.ptr.ImFontAtlas_Clear();
  }
  /**
   * \/\/ Compact cached glyphs and texture.
   */
  CompactCache(): void {
    this.ptr.ImFontAtlas_CompactCache();
  }
  /**
   * \/\/ Change font loader at runtime.
   */
  SetFontLoader(font_loader: ImFontLoader): void {
    this.ptr.ImFontAtlas_SetFontLoader(font_loader?.ptr ?? null);
  }

  // \/\/ As we are transitioning toward a new font system, we expect to obsolete those soon:

  /**
   * \/\/ [OBSOLETE] Clear input data (all ImFontConfig structures including sizes, TTF data, glyph ranges, etc.) = all the data used to build the texture and fonts.
   */
  ClearInputData(): void {
    this.ptr.ImFontAtlas_ClearInputData();
  }
  /**
   * \/\/ [OBSOLETE] Clear input+output font data (same as ClearInputData() + glyphs storage, UV coordinates).
   */
  ClearFonts(): void {
    this.ptr.ImFontAtlas_ClearFonts();
  }
  /**
   * \/\/ [OBSOLETE] Clear CPU-side copy of the texture data. Saves RAM once the texture has been copied to graphics memory.
   */
  ClearTexData(): void {
    this.ptr.ImFontAtlas_ClearTexData();
  }

  // \/\/ Since 1.92: specifying glyph ranges is only useful\/necessary if your backend doesn't support ImGuiBackendFlags_RendererHasTextures!

  /**
   * \/\/ Basic Latin, Extended Latin
   */
  GetGlyphRangesDefault(): ImWchar {
    return this.ptr.ImFontAtlas_GetGlyphRangesDefault();
  }

  // \/\/ Register and retrieve custom rectangles
  // \/\/ - You can request arbitrary rectangles to be packed into the atlas, for your own purpose.
  // \/\/ - Since 1.92.0, packing is done immediately in the function call (previously packing was done during the Build call)
  // \/\/ - You can render your pixels into the texture right after calling the AddCustomRect() functions.
  // \/\/ - VERY IMPORTANT:
  // \/\/   - Texture may be created\/resized at any time when calling ImGui or ImFontAtlas functions.
  // \/\/   - IT WILL INVALIDATE RECTANGLE DATA SUCH AS UV COORDINATES. Always use latest values from GetCustomRect().
  // \/\/   - UV coordinates are associated to the current texture identifier aka 'atlas->TexRef'. Both TexRef and UV coordinates are typically changed at the same time.
  // \/\/ - If you render colored output into your custom rectangles: set 'atlas->TexPixelsUseColors = true' as this may help some backends decide of preferred texture format.
  // \/\/ - Read docs\/FONTS.md for more details about using colorful icons.
  // \/\/ - Note: this API may be reworked further in order to facilitate supporting e.g. multi-monitor, varying DPI settings.
  // \/\/ - (Pre-1.92 names) ------------> (1.92 names)
  // \/\/   - GetCustomRectByIndex()   --> Use GetCustomRect()
  // \/\/   - CalcCustomRectUV()       --> Use GetCustomRect() and read uv0, uv1 fields.
  // \/\/   - AddCustomRectRegular()   --> Renamed to AddCustomRect()
  // \/\/   - AddCustomRectFontGlyph() --> Prefer using custom ImFontLoader inside ImFontConfig
  // \/\/   - ImFontAtlasCustomRect    --> Renamed to ImFontAtlasRect

  /**
   * \/\/ Register a rectangle. Return -1 (ImFontAtlasRectId_Invalid) on error.
   */
  AddCustomRect(
    width: number,
    height: number,
    out_r: ImFontAtlasRect | null = null,
  ): ImFontAtlasRectId {
    return this.ptr.ImFontAtlas_AddCustomRect(width, height, out_r?.ptr ?? null);
  }
  /**
   * \/\/ Unregister a rectangle. Existing pixels will stay in texture until resized \/ garbage collected.
   */
  RemoveCustomRect(id: ImFontAtlasRectId): void {
    this.ptr.ImFontAtlas_RemoveCustomRect(id);
  }
  /**
   * \/\/ Get rectangle coordinates for current texture. Valid immediately, never store this (read above)!
   */
  GetCustomRect(id: ImFontAtlasRectId, out_r: ImFontAtlasRect): boolean {
    return this.ptr.ImFontAtlas_GetCustomRect(id, out_r?.ptr ?? null);
  }
}
/**
 * \/\/ Font runtime data for a given size
 * \/\/ Important: pointers to ImFontBaked are only valid for the current frame.
 */
export class ImFontBaked extends ReferenceStruct {
  // Opaque
}
/**
 * \/\/ Font runtime data and rendering
 * \/\/ - ImFontAtlas automatically loads a default embedded font for you if you didn't load one manually.
 * \/\/ - Since 1.92.0 a font may be rendered as any size! Therefore a font doesn't have one specific size.
 * \/\/ - Use 'font->GetFontBaked(size)' to retrieve the ImFontBaked* corresponding to a given size.
 * \/\/ - If you used g.Font + g.FontSize (which is frequent from the ImGui layer), you can use g.FontBaked as a shortcut, as g.FontBaked == g.Font->GetFontBaked(g.FontSize).
 */
export class ImFont extends ReferenceStruct {
  // Opaque
}
/**
 * \/\/ - Currently represents the Platform Window created by the application which is hosting our Dear ImGui windows.
 * \/\/ - With multi-viewport enabled, we extend this concept to have multiple active viewports.
 * \/\/ - In the future we will extend this concept further to also represent Platform Monitor and support a "no main platform window" operation mode.
 * \/\/ - About Main Area vs Work Area:
 * \/\/   - Main Area = entire viewport.
 * \/\/   - Work Area = entire viewport minus sections used by main menu bars (for platform windows), or by task bar (for platform monitor).
 * \/\/   - Windows are generally trying to stay within the Work Area of their host viewport.
 */
export class ImGuiViewport extends ReferenceStruct {
  /**
   * \/\/ Unique identifier for the viewport
   */
  get ID(): ImGuiID {
    return this.ptr.get_ID();
  }
  set ID(v: ImGuiID) {
    this.ptr.set_ID(v);
  }
  /**
   * \/\/ See ImGuiViewportFlags_
   */
  get Flags(): ImGuiViewportFlags {
    return this.ptr.get_Flags();
  }
  set Flags(v: ImGuiViewportFlags) {
    this.ptr.set_Flags(v);
  }
  /**
   * \/\/ Main Area: Position of the viewport (Dear ImGui coordinates are the same as OS desktop\/native coordinates)
   */
  get Pos(): ImVec2 {
    return ImVec2.From(this.ptr.get_Pos());
  }
  set Pos(v: ImVec2) {
    this.ptr.set_Pos(v);
  }
  /**
   * \/\/ Main Area: Size of the viewport.
   */
  get Size(): ImVec2 {
    return ImVec2.From(this.ptr.get_Size());
  }
  set Size(v: ImVec2) {
    this.ptr.set_Size(v);
  }
  /**
   * \/\/ Density of the viewport for Retina display (always 1,1 on Windows, may be 2,2 etc on macOS\/iOS). This will affect font rasterizer density.
   */
  get FramebufferScale(): ImVec2 {
    return ImVec2.From(this.ptr.get_FramebufferScale());
  }
  set FramebufferScale(v: ImVec2) {
    this.ptr.set_FramebufferScale(v);
  }
  /**
   * \/\/ Work Area: Position of the viewport minus task bars, menus bars, status bars (>= Pos)
   */
  get WorkPos(): ImVec2 {
    return ImVec2.From(this.ptr.get_WorkPos());
  }
  set WorkPos(v: ImVec2) {
    this.ptr.set_WorkPos(v);
  }
  /**
   * \/\/ Work Area: Size of the viewport minus task bars, menu bars, status bars (<= Size)
   */
  get WorkSize(): ImVec2 {
    return ImVec2.From(this.ptr.get_WorkSize());
  }
  set WorkSize(v: ImVec2) {
    this.ptr.set_WorkSize(v);
  }
  /**
   * \/\/ 1.0f = 96 DPI = No extra scale.
   */
  get DpiScale(): number {
    return this.ptr.get_DpiScale();
  }
  set DpiScale(v: number) {
    this.ptr.set_DpiScale(v);
  }
  /**
   * \/\/ (Advanced) 0: no parent. Instruct the platform backend to setup a parent\/child relationship between platform windows.
   */
  get ParentViewportId(): ImGuiID {
    return this.ptr.get_ParentViewportId();
  }
  set ParentViewportId(v: ImGuiID) {
    this.ptr.set_ParentViewportId(v);
  }
  /**
   * \/\/ (Advanced) Direct shortcut to ImGui::FindViewportByID(ParentViewportId). NULL: no parent.
   */
  get ParentViewport(): ImGuiViewport {
    return ImGuiViewport.From(this.ptr.get_ParentViewport());
  }
  set ParentViewport(v: ImGuiViewport) {
    this.ptr.set_ParentViewport(v);
  }
  /**
   * \/\/ The ImDrawData corresponding to this viewport. Valid after Render() and until the next call to NewFrame().
   */
  get DrawData(): ImDrawData {
    return ImDrawData.From(this.ptr.get_DrawData());
  }
  set DrawData(v: ImDrawData) {
    this.ptr.set_DrawData(v);
  }

  // \/\/ Platform\/Backend Dependent Data
  // \/\/ Our design separate the Renderer and Platform backends to facilitate combining default backends with each others.
  // \/\/ When our create your own backend for a custom engine, it is possible that both Renderer and Platform will be handled
  // \/\/ by the same system and you may not need to use all the UserData\/Handle fields.
  // \/\/ The library never uses those fields, they are merely storage to facilitate backend implementation.

  /**
   * \/\/ void* to hold custom data structure for the renderer (e.g. swap chain, framebuffers etc.). generally set by your Renderer_CreateWindow function.
   */
  get RendererUserData(): any {
    return this.ptr.get_RendererUserData();
  }
  set RendererUserData(v: any) {
    this.ptr.set_RendererUserData(v);
  }
  /**
   * \/\/ void* to hold custom data structure for the OS \/ platform (e.g. windowing info, render context). generally set by your Platform_CreateWindow function.
   */
  get PlatformUserData(): any {
    return this.ptr.get_PlatformUserData();
  }
  set PlatformUserData(v: any) {
    this.ptr.set_PlatformUserData(v);
  }
  /**
   * \/\/ void* to hold higher-level, platform window handle (e.g. HWND for Win32 backend, Uint32 WindowID for SDL, GLFWWindow* for GLFW), for FindViewportByPlatformHandle().
   */
  get PlatformHandle(): any {
    return this.ptr.get_PlatformHandle();
  }
  set PlatformHandle(v: any) {
    this.ptr.set_PlatformHandle(v);
  }
  /**
   * \/\/ void* to hold lower-level, platform-native window handle (always HWND on Win32 platform, unused for other platforms).
   */
  get PlatformHandleRaw(): any {
    return this.ptr.get_PlatformHandleRaw();
  }
  set PlatformHandleRaw(v: any) {
    this.ptr.set_PlatformHandleRaw(v);
  }
  /**
   * \/\/ Platform window has been created (Platform_CreateWindow() has been called). This is false during the first frame where a viewport is being created.
   */
  get PlatformWindowCreated(): boolean {
    return this.ptr.get_PlatformWindowCreated();
  }
  set PlatformWindowCreated(v: boolean) {
    this.ptr.set_PlatformWindowCreated(v);
  }
  /**
   * \/\/ Platform window requested move (e.g. window was moved by the OS \/ host window manager, authoritative position will be OS window position)
   */
  get PlatformRequestMove(): boolean {
    return this.ptr.get_PlatformRequestMove();
  }
  set PlatformRequestMove(v: boolean) {
    this.ptr.set_PlatformRequestMove(v);
  }
  /**
   * \/\/ Platform window requested resize (e.g. window was resized by the OS \/ host window manager, authoritative size will be OS window size)
   */
  get PlatformRequestResize(): boolean {
    return this.ptr.get_PlatformRequestResize();
  }
  set PlatformRequestResize(v: boolean) {
    this.ptr.set_PlatformRequestResize(v);
  }
  /**
   * \/\/ Platform window requested closure (e.g. window was moved by the OS \/ host window manager, e.g. pressing ALT-F4)
   */
  get PlatformRequestClose(): boolean {
    return this.ptr.get_PlatformRequestClose();
  }
  set PlatformRequestClose(v: boolean) {
    this.ptr.set_PlatformRequestClose(v);
  }

  /**
   * \/\/ Helpers
   */
  GetCenter(): ImVec2 {
    return ImVec2.From(this.ptr.ImGuiViewport_GetCenter());
  }
  GetWorkCenter(): ImVec2 {
    return ImVec2.From(this.ptr.ImGuiViewport_GetWorkCenter());
  }
  GetDebugName(): string {
    return this.ptr.ImGuiViewport_GetDebugName();
  }
}
/**
 * \/\/ Access via ImGui::GetPlatformIO()
 */
export class ImGuiPlatformIO extends ReferenceStruct {
  // Opaque
}
export const ImGui = {
  /**
   * \/\/ Flags for ImGui::Begin()
   * \/\/ (Those are per-window flags. There are shared flags in ImGuiIO: io.ConfigWindowsResizeFromEdges and io.ConfigWindowsMoveFromTitleBarOnly)
   */
  WindowFlags: {
    None: 0,
    /**
     * \/\/ Disable title-bar
     */
    NoTitleBar: 1,
    /**
     * \/\/ Disable user resizing with the lower-right grip
     */
    NoResize: 2,
    /**
     * \/\/ Disable user moving the window
     */
    NoMove: 4,
    /**
     * \/\/ Disable scrollbars (window can still scroll with mouse or programmatically)
     */
    NoScrollbar: 8,
    /**
     * \/\/ Disable user vertically scrolling with mouse wheel. On child window, mouse wheel will be forwarded to the parent unless NoScrollbar is also set.
     */
    NoScrollWithMouse: 16,
    /**
     * \/\/ Disable user collapsing window by double-clicking on it. Also referred to as Window Menu Button (e.g. within a docking node).
     */
    NoCollapse: 32,
    /**
     * \/\/ Resize every window to its content every frame
     */
    AlwaysAutoResize: 64,
    /**
     * \/\/ Disable drawing background color (WindowBg, etc.) and outside border. Similar as using SetNextWindowBgAlpha(0.0f).
     */
    NoBackground: 128,
    /**
     * \/\/ Never load\/save settings in .ini file
     */
    NoSavedSettings: 256,
    /**
     * \/\/ Disable catching mouse, hovering test with pass through.
     */
    NoMouseInputs: 512,
    /**
     * \/\/ Has a menu-bar
     */
    MenuBar: 1024,
    /**
     * \/\/ Allow horizontal scrollbar to appear (off by default). You may use SetNextWindowContentSize(ImVec2(width,0.0f)); prior to calling Begin() to specify width. Read code in imgui_demo in the "Horizontal Scrolling" section.
     */
    HorizontalScrollbar: 2048,
    /**
     * \/\/ Disable taking focus when transitioning from hidden to visible state
     */
    NoFocusOnAppearing: 4096,
    /**
     * \/\/ Disable bringing window to front when taking focus (e.g. clicking on it or programmatically giving it focus)
     */
    NoBringToFrontOnFocus: 8192,
    /**
     * \/\/ Always show vertical scrollbar (even if ContentSize.y < Size.y)
     */
    AlwaysVerticalScrollbar: 16384,
    /**
     * \/\/ Always show horizontal scrollbar (even if ContentSize.x < Size.x)
     */
    AlwaysHorizontalScrollbar: 32768,
    /**
     * \/\/ No keyboard\/gamepad navigation within the window
     */
    NoNavInputs: 65536,
    /**
     * \/\/ No focusing toward this window with keyboard\/gamepad navigation (e.g. skipped by Ctrl+Tab)
     */
    NoNavFocus: 131072,
    /**
     * \/\/ Display a dot next to the title. When used in a tab\/docking context, tab is selected when clicking the X + closure is not assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar.
     */
    UnsavedDocument: 262144,
    /**
     * \/\/ Disable docking of this window
     */
    NoDocking: 524288,
    NoNav: 196608,
    NoDecoration: 43,
    NoInputs: 197120,
  },
  /**
   * \/\/ Flags for ImGui::BeginChild()
   * \/\/ (Legacy: bit 0 must always correspond to ImGuiChildFlags_Borders to be backward compatible with old API using 'bool border = false'.)
   * \/\/ About using AutoResizeX\/AutoResizeY flags:
   * \/\/ - May be combined with SetNextWindowSizeConstraints() to set a min\/max size for each axis (see "Demo->Child->Auto-resize with Constraints").
   * \/\/ - Size measurement for a given axis is only performed when the child window is within visible boundaries, or is just appearing.
   * \/\/   - This allows BeginChild() to return false when not within boundaries (e.g. when scrolling), which is more optimal. BUT it won't update its auto-size while clipped.
   * \/\/     While not perfect, it is a better default behavior as the always-on performance gain is more valuable than the occasional "resizing after becoming visible again" glitch.
   * \/\/   - You may also use ImGuiChildFlags_AlwaysAutoResize to force an update even when child window is not in view.
   * \/\/     HOWEVER PLEASE UNDERSTAND THAT DOING SO WILL PREVENT BeginChild() FROM EVER RETURNING FALSE, disabling benefits of coarse clipping.
   */
  ChildFlags: {
    None: 0,
    /**
     * \/\/ Show an outer border and enable WindowPadding. (IMPORTANT: this is always == 1 == true for legacy reason)
     */
    Borders: 1,
    /**
     * \/\/ Pad with style.WindowPadding even if no border are drawn (no padding by default for non-bordered child windows because it makes more sense)
     */
    AlwaysUseWindowPadding: 2,
    /**
     * \/\/ Allow resize from right border (layout direction). Enable .ini saving (unless ImGuiWindowFlags_NoSavedSettings passed to window flags)
     */
    ResizeX: 4,
    /**
     * \/\/ Allow resize from bottom border (layout direction). "
     */
    ResizeY: 8,
    /**
     * \/\/ Enable auto-resizing width. Read "IMPORTANT: Size measurement" details above.
     */
    AutoResizeX: 16,
    /**
     * \/\/ Enable auto-resizing height. Read "IMPORTANT: Size measurement" details above.
     */
    AutoResizeY: 32,
    /**
     * \/\/ Combined with AutoResizeX\/AutoResizeY. Always measure size even when child is hidden, always return true, always disable clipping optimization! NOT RECOMMENDED.
     */
    AlwaysAutoResize: 64,
    /**
     * \/\/ Style the child window like a framed item: use FrameBg, FrameRounding, FrameBorderSize, FramePadding instead of ChildBg, ChildRounding, ChildBorderSize, WindowPadding.
     */
    FrameStyle: 128,
    /**
     * \/\/ [BETA] Share focus scope, allow keyboard\/gamepad navigation to cross over parent border to this child or between sibling child windows.
     */
    NavFlattened: 256,
  },
  /**
   * \/\/ Flags for ImGui::PushItemFlag()
   * \/\/ (Those are shared by all submitted items)
   */
  ItemFlags: {
    /**
     * \/\/ (Default)
     */
    None: 0,
    /**
     * \/\/ false    \/\/ Disable keyboard tabbing. This is a "lighter" version of ImGuiItemFlags_NoNav.
     */
    NoTabStop: 1,
    /**
     * \/\/ false    \/\/ Disable any form of focusing (keyboard\/gamepad directional navigation and SetKeyboardFocusHere() calls).
     */
    NoNav: 2,
    /**
     * \/\/ false    \/\/ Disable item being a candidate for default focus (e.g. used by title bar items).
     */
    NoNavDefaultFocus: 4,
    /**
     * \/\/ false    \/\/ Any button-like behavior will have repeat mode enabled (based on io.KeyRepeatDelay and io.KeyRepeatRate values). Note that you can also call IsItemActive() after any button to tell if it is being held.
     */
    ButtonRepeat: 8,
    /**
     * \/\/ true     \/\/ MenuItem()\/Selectable() automatically close their parent popup window.
     */
    AutoClosePopups: 16,
    /**
     * \/\/ false    \/\/ Allow submitting an item with the same identifier as an item already submitted this frame without triggering a warning tooltip if io.ConfigDebugHighlightIdConflicts is set.
     */
    AllowDuplicateId: 32,
    /**
     * \/\/ false    \/\/ [Internal] Disable interactions. DOES NOT affect visuals. This is used by BeginDisabled()\/EndDisabled() and only provided here so you can read back via GetItemFlags().
     */
    Disabled: 64,
  },
  /**
   * \/\/ Flags for ImGui::InputText()
   * \/\/ (Those are per-item flags. There are shared flags in ImGuiIO: io.ConfigInputTextCursorBlink and io.ConfigInputTextEnterKeepActive)
   */
  InputTextFlags: {
    /**
     * \/\/ Basic filters (also see ImGuiInputTextFlags_CallbackCharFilter)
     */
    None: 0,
    /**
     * \/\/ Allow 0123456789.+-*\/
     */
    CharsDecimal: 1,
    /**
     * \/\/ Allow 0123456789ABCDEFabcdef
     */
    CharsHexadecimal: 2,
    /**
     * \/\/ Allow 0123456789.+-*\/eE (Scientific notation input)
     */
    CharsScientific: 4,
    /**
     * \/\/ Turn a..z into A..Z
     */
    CharsUppercase: 8,
    /**
     * \/\/ Filter out spaces, tabs
     */
    CharsNoBlank: 16,

    // \/\/ Inputs

    /**
     * \/\/ Pressing TAB input a '\t' character into the text field
     */
    AllowTabInput: 32,
    /**
     * \/\/ Return 'true' when Enter is pressed (as opposed to every time the value was modified). Consider using IsItemDeactivatedAfterEdit() instead!
     */
    EnterReturnsTrue: 64,
    /**
     * \/\/ Escape key clears content if not empty, and deactivate otherwise (contrast to default behavior of Escape to revert)
     */
    EscapeClearsAll: 128,
    /**
     * \/\/ In multi-line mode: validate with Enter, add new line with Ctrl+Enter (default is opposite: validate with Ctrl+Enter, add line with Enter). Note that Shift+Enter always enter a new line either way.
     */
    CtrlEnterForNewLine: 256,

    // \/\/ Other options

    /**
     * \/\/ Read-only mode
     */
    ReadOnly: 512,
    /**
     * \/\/ Password mode, display all characters as '*', disable copy
     */
    Password: 1024,
    /**
     * \/\/ Overwrite mode
     */
    AlwaysOverwrite: 2048,
    /**
     * \/\/ Select entire text when first taking mouse focus
     */
    AutoSelectAll: 4096,
    /**
     * \/\/ InputFloat(), InputInt(), InputScalar() etc. only: parse empty string as zero value.
     */
    ParseEmptyRefVal: 8192,
    /**
     * \/\/ InputFloat(), InputInt(), InputScalar() etc. only: when value is zero, do not display it. Generally used with ImGuiInputTextFlags_ParseEmptyRefVal.
     */
    DisplayEmptyRefVal: 16384,
    /**
     * \/\/ Disable following the cursor horizontally
     */
    NoHorizontalScroll: 32768,
    /**
     * \/\/ Disable undo\/redo. Note that input text owns the text data while active, if you want to provide your own undo\/redo stack you need e.g. to call ClearActiveID().
     */
    NoUndoRedo: 65536,

    // \/\/ Elide display \/ Alignment

    /**
     * \/\/ When text doesn't fit, elide left side to ensure right side stays visible. Useful for path\/filenames. Single-line only!
     */
    ElideLeft: 131072,

    // \/\/ Callback features

    /**
     * \/\/ Callback on pressing TAB (for completion handling)
     */
    CallbackCompletion: 262144,
    /**
     * \/\/ Callback on pressing Up\/Down arrows (for history handling)
     */
    CallbackHistory: 524288,
    /**
     * \/\/ Callback on each iteration. User code may query cursor position, modify text buffer.
     */
    CallbackAlways: 1048576,
    /**
     * \/\/ Callback on character inputs to replace or discard them. Modify 'EventChar' to replace or discard, or return 1 in callback to discard.
     */
    CallbackCharFilter: 2097152,
    /**
     * \/\/ Callback on buffer capacity changes request (beyond 'buf_size' parameter value), allowing the string to grow. Notify when the string wants to be resized (for string types which hold a cache of their Size). You will be provided a new BufSize in the callback and NEED to honor it. (see misc\/cpp\/imgui_stdlib.h for an example of using this)
     */
    CallbackResize: 4194304,
    /**
     * \/\/ Callback on any edit. Note that InputText() already returns true on edit + you can always use IsItemEdited(). The callback is useful to manipulate the underlying buffer while focus is active.
     */
    CallbackEdit: 8388608,

    // \/\/ Multi-line Word-Wrapping [BETA]
    // \/\/ - Not well tested yet. Please report any incorrect cursor movement, selection behavior etc. bug to https:\/\/github.com\/ocornut\/imgui\/issues\/3237.
    // \/\/ - Wrapping style is not ideal. Wrapping of long words\/sections (e.g. words larger than total available width) may be particularly unpleasing.
    // \/\/ - Wrapping width needs to always account for the possibility of a vertical scrollbar.
    // \/\/ - It is much slower than regular text fields.
    // \/\/   Ballpark estimate of cost on my 2019 desktop PC: for a 100 KB text buffer: +~0.3 ms (Optimized) \/ +~1.0 ms (Debug build).
    // \/\/   The CPU cost is very roughly proportional to text length, so a 10 KB buffer should cost about ten times less.

    /**
     * \/\/ InputTextMultiline(): word-wrap lines that are too long.
     */
    WordWrap: 16777216,
  },
  /**
   * \/\/ Flags for ImGui::TreeNodeEx(), ImGui::CollapsingHeader*()
   */
  TreeNodeFlags: {
    None: 0,
    /**
     * \/\/ Draw as selected
     */
    Selected: 1,
    /**
     * \/\/ Draw frame with background (e.g. for CollapsingHeader)
     */
    Framed: 2,
    /**
     * \/\/ Hit testing will allow subsequent widgets to overlap this one. Require previous frame HoveredId to match before being usable. Shortcut to calling SetNextItemAllowOverlap().
     */
    AllowOverlap: 4,
    /**
     * \/\/ Don't do a TreePush() when open (e.g. for CollapsingHeader) = no extra indent nor pushing on ID stack
     */
    NoTreePushOnOpen: 8,
    /**
     * \/\/ Don't automatically and temporarily open node when Logging is active (by default logging will automatically open tree nodes)
     */
    NoAutoOpenOnLog: 16,
    /**
     * \/\/ Default node to be open
     */
    DefaultOpen: 32,
    /**
     * \/\/ Open on double-click instead of simple click (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined.
     */
    OpenOnDoubleClick: 64,
    /**
     * \/\/ Open when clicking on the arrow part (default for multi-select unless any _OpenOnXXX behavior is set explicitly). Both behaviors may be combined.
     */
    OpenOnArrow: 128,
    /**
     * \/\/ No collapsing, no arrow (use as a convenience for leaf nodes). Note: will always open a tree\/id scope and return true. If you never use that scope, add ImGuiTreeNodeFlags_NoTreePushOnOpen.
     */
    Leaf: 256,
    /**
     * \/\/ Display a bullet instead of arrow. IMPORTANT: node can still be marked open\/close if you don't set the _Leaf flag!
     */
    Bullet: 512,
    /**
     * \/\/ Use FramePadding (even for an unframed text node) to vertically align text baseline to regular widget height. Equivalent to calling AlignTextToFramePadding() before the node.
     */
    FramePadding: 1024,
    /**
     * \/\/ Extend hit box to the right-most edge, even if not framed. This is not the default in order to allow adding other items on the same line without using AllowOverlap mode.
     */
    SpanAvailWidth: 2048,
    /**
     * \/\/ Extend hit box to the left-most and right-most edges (cover the indent area).
     */
    SpanFullWidth: 4096,
    /**
     * \/\/ Narrow hit box + narrow hovering highlight, will only cover the label text.
     */
    SpanLabelWidth: 8192,
    /**
     * \/\/ Frame will span all columns of its container table (label will still fit in current column)
     */
    SpanAllColumns: 16384,
    /**
     * \/\/ Label will span all columns of its container table
     */
    LabelSpanAllColumns: 32768,

    // \/\/ImGuiTreeNodeFlags_NoScrollOnOpen     = 1 << 16,  \/\/ FIXME: TODO: Disable automatic scroll on TreePop() if node got just open and contents is not visible

    /**
     * \/\/ Nav: left arrow moves back to parent. This is processed in TreePop() when there's an unfulfilled Left nav request remaining.
     */
    NavLeftJumpsToParent: 131072,
    CollapsingHeader: 26,

    // \/\/ [EXPERIMENTAL] Draw lines connecting TreeNode hierarchy. Discuss in GitHub issue #2920.
    // \/\/ Default value is pulled from style.TreeLinesFlags. May be overridden in TreeNode calls.

    /**
     * \/\/ No lines drawn
     */
    DrawLinesNone: 262144,
    /**
     * \/\/ Horizontal lines to child nodes. Vertical line drawn down to TreePop() position: cover full contents. Faster (for large trees).
     */
    DrawLinesFull: 524288,
    /**
     * \/\/ Horizontal lines to child nodes. Vertical line drawn down to bottom-most child node. Slower (for large trees).
     */
    DrawLinesToNodes: 1048576,
  },
  /**
   * \/\/ Flags for OpenPopup*(), BeginPopupContext*(), IsPopupOpen() functions.
   * \/\/ - IMPORTANT: If you ever used the left mouse button with BeginPopupContextXXX() helpers before 1.92.6: Read "API BREAKING CHANGES" 2026\/01\/07 (1.92.6) entry in imgui.cpp or GitHub topic #9157.
   * \/\/ - Multiple buttons currently cannot be combined\/or-ed in those functions (we could allow it later).
   */
  PopupFlags: {
    None: 0,
    /**
     * \/\/ For BeginPopupContext*(): open on Left Mouse release. Only one button allowed!
     */
    MouseButtonLeft: 4,
    /**
     * \/\/ For BeginPopupContext*(): open on Right Mouse release. Only one button allowed! (default)
     */
    MouseButtonRight: 8,
    /**
     * \/\/ For BeginPopupContext*(): open on Middle Mouse release. Only one button allowed!
     */
    MouseButtonMiddle: 12,
    /**
     * \/\/ For OpenPopup*(), BeginPopupContext*(): don't reopen same popup if already open (won't reposition, won't reinitialize navigation)
     */
    NoReopen: 32,

    // \/\/ImGuiPopupFlags_NoReopenAlwaysNavInit = 1 << 6,   \/\/ For OpenPopup*(), BeginPopupContext*(): focus and initialize navigation even when not reopening.

    /**
     * \/\/ For OpenPopup*(), BeginPopupContext*(): don't open if there's already a popup at the same level of the popup stack
     */
    NoOpenOverExistingPopup: 128,
    /**
     * \/\/ For BeginPopupContextWindow(): don't return true when hovering items, only when hovering empty space
     */
    NoOpenOverItems: 256,
    /**
     * \/\/ For IsPopupOpen(): ignore the ImGuiID parameter and test for any popup.
     */
    AnyPopupId: 1024,
    /**
     * \/\/ For IsPopupOpen(): search\/test at any level of the popup stack (default test in the current level)
     */
    AnyPopupLevel: 2048,
    AnyPopup: 3072,
  },
  /**
   * \/\/ Flags for ImGui::Selectable()
   */
  SelectableFlags: {
    None: 0,
    /**
     * \/\/ Clicking this doesn't close parent popup window (overrides ImGuiItemFlags_AutoClosePopups)
     */
    NoAutoClosePopups: 1,
    /**
     * \/\/ Frame will span all columns of its container table (text will still fit in current column)
     */
    SpanAllColumns: 2,
    /**
     * \/\/ Generate press events on double clicks too
     */
    AllowDoubleClick: 4,
    /**
     * \/\/ Cannot be selected, display grayed out text
     */
    Disabled: 8,
    /**
     * \/\/ Hit testing will allow subsequent widgets to overlap this one. Require previous frame HoveredId to match before being usable. Shortcut to calling SetNextItemAllowOverlap().
     */
    AllowOverlap: 16,
    /**
     * \/\/ Make the item be displayed as if it is hovered
     */
    Highlight: 32,
    /**
     * \/\/ Auto-select when moved into, unless Ctrl is held. Automatic when in a BeginMultiSelect() block.
     */
    SelectOnNav: 64,
  },
  /**
   * \/\/ Flags for ImGui::BeginCombo()
   */
  ComboFlags: {
    None: 0,
    /**
     * \/\/ Align the popup toward the left by default
     */
    PopupAlignLeft: 1,
    /**
     * \/\/ Max ~4 items visible. Tip: If you want your combo popup to be a specific size you can use SetNextWindowSizeConstraints() prior to calling BeginCombo()
     */
    HeightSmall: 2,
    /**
     * \/\/ Max ~8 items visible (default)
     */
    HeightRegular: 4,
    /**
     * \/\/ Max ~20 items visible
     */
    HeightLarge: 8,
    /**
     * \/\/ As many fitting items as possible
     */
    HeightLargest: 16,
    /**
     * \/\/ Display on the preview box without the square arrow button
     */
    NoArrowButton: 32,
    /**
     * \/\/ Display only a square arrow button
     */
    NoPreview: 64,
    /**
     * \/\/ Width dynamically calculated from preview contents
     */
    WidthFitPreview: 128,
  },
  /**
   * \/\/ Flags for ImGui::BeginTabBar()
   */
  TabBarFlags: {
    None: 0,
    /**
     * \/\/ Allow manually dragging tabs to re-order them + New tabs are appended at the end of list
     */
    Reorderable: 1,
    /**
     * \/\/ Automatically select new tabs when they appear
     */
    AutoSelectNewTabs: 2,
    /**
     * \/\/ Disable buttons to open the tab list popup
     */
    TabListPopupButton: 4,
    /**
     * \/\/ Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false.
     */
    NoCloseWithMiddleMouseButton: 8,
    /**
     * \/\/ Disable scrolling buttons (apply when fitting policy is ImGuiTabBarFlags_FittingPolicyScroll)
     */
    NoTabListScrollingButtons: 16,
    /**
     * \/\/ Disable tooltips when hovering a tab
     */
    NoTooltip: 32,
    /**
     * \/\/ Draw selected overline markers over selected tab
     */
    DrawSelectedOverline: 64,

    // \/\/ Fitting\/Resize policy

    /**
     * \/\/ Shrink down tabs when they don't fit, until width is style.TabMinWidthShrink, then enable scrolling buttons.
     */
    FittingPolicyMixed: 128,
    /**
     * \/\/ Shrink down tabs when they don't fit
     */
    FittingPolicyShrink: 256,
    /**
     * \/\/ Enable scrolling buttons when tabs don't fit
     */
    FittingPolicyScroll: 512,
  },
  /**
   * \/\/ Flags for ImGui::BeginTabItem()
   */
  TabItemFlags: {
    None: 0,
    /**
     * \/\/ Display a dot next to the title + set ImGuiTabItemFlags_NoAssumedClosure.
     */
    UnsavedDocument: 1,
    /**
     * \/\/ Trigger flag to programmatically make the tab selected when calling BeginTabItem()
     */
    SetSelected: 2,
    /**
     * \/\/ Disable behavior of closing tabs (that are submitted with p_open != NULL) with middle mouse button. You may handle this behavior manually on user's side with if (IsItemHovered() && IsMouseClicked(2)) *p_open = false.
     */
    NoCloseWithMiddleMouseButton: 4,
    /**
     * \/\/ Don't call PushID()\/PopID() on BeginTabItem()\/EndTabItem()
     */
    NoPushId: 8,
    /**
     * \/\/ Disable tooltip for the given tab
     */
    NoTooltip: 16,
    /**
     * \/\/ Disable reordering this tab or having another tab cross over this tab
     */
    NoReorder: 32,
    /**
     * \/\/ Enforce the tab position to the left of the tab bar (after the tab list popup button)
     */
    Leading: 64,
    /**
     * \/\/ Enforce the tab position to the right of the tab bar (before the scrolling buttons)
     */
    Trailing: 128,
    /**
     * \/\/ Tab is selected when trying to close + closure is not immediately assumed (will wait for user to stop submitting the tab). Otherwise closure is assumed when pressing the X, so if you keep submitting the tab may reappear at end of tab bar.
     */
    NoAssumedClosure: 256,
  },
  /**
   * \/\/ Flags for ImGui::IsWindowFocused()
   */
  FocusedFlags: {
    None: 0,
    /**
     * \/\/ Return true if any children of the window is focused
     */
    ChildWindows: 1,
    /**
     * \/\/ Test from root window (top most parent of the current hierarchy)
     */
    RootWindow: 2,
    /**
     * \/\/ Return true if any window is focused. Important: If you are trying to tell how to dispatch your low-level inputs, do NOT use this. Use 'io.WantCaptureMouse' instead! Please read the FAQ!
     */
    AnyWindow: 4,
    /**
     * \/\/ Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow)
     */
    NoPopupHierarchy: 8,
    /**
     * \/\/ Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow)
     */
    DockHierarchy: 16,
    RootAndChildWindows: 3,
  },
  /**
   * \/\/ Flags for ImGui::IsItemHovered(), ImGui::IsWindowHovered()
   * \/\/ Note: if you are trying to check whether your mouse should be dispatched to Dear ImGui or to your app, you should use 'io.WantCaptureMouse' instead! Please read the FAQ!
   * \/\/ Note: windows with the ImGuiWindowFlags_NoInputs flag are ignored by IsWindowHovered() calls.
   */
  HoveredFlags: {
    /**
     * \/\/ Return true if directly over the item\/window, not obstructed by another window, not obstructed by an active popup or modal blocking inputs under them.
     */
    None: 0,
    /**
     * \/\/ IsWindowHovered() only: Return true if any children of the window is hovered
     */
    ChildWindows: 1,
    /**
     * \/\/ IsWindowHovered() only: Test from root window (top most parent of the current hierarchy)
     */
    RootWindow: 2,
    /**
     * \/\/ IsWindowHovered() only: Return true if any window is hovered
     */
    AnyWindow: 4,
    /**
     * \/\/ IsWindowHovered() only: Do not consider popup hierarchy (do not treat popup emitter as parent of popup) (when used with _ChildWindows or _RootWindow)
     */
    NoPopupHierarchy: 8,
    /**
     * \/\/ IsWindowHovered() only: Consider docking hierarchy (treat dockspace host as parent of docked window) (when used with _ChildWindows or _RootWindow)
     */
    DockHierarchy: 16,
    /**
     * \/\/ Return true even if a popup window is normally blocking access to this item\/window
     */
    AllowWhenBlockedByPopup: 32,

    // \/\/ImGuiHoveredFlags_AllowWhenBlockedByModal     = 1 << 6,   \/\/ Return true even if a modal popup window is normally blocking access to this item\/window. FIXME-TODO: Unavailable yet.

    /**
     * \/\/ Return true even if an active item is blocking access to this item\/window. Useful for Drag and Drop patterns.
     */
    AllowWhenBlockedByActiveItem: 128,
    /**
     * \/\/ IsItemHovered() only: Return true even if the item uses AllowOverlap mode and is overlapped by another hoverable item.
     */
    AllowWhenOverlappedByItem: 256,
    /**
     * \/\/ IsItemHovered() only: Return true even if the position is obstructed or overlapped by another window.
     */
    AllowWhenOverlappedByWindow: 512,
    /**
     * \/\/ IsItemHovered() only: Return true even if the item is disabled
     */
    AllowWhenDisabled: 1024,
    /**
     * \/\/ IsItemHovered() only: Disable using keyboard\/gamepad navigation state when active, always query mouse
     */
    NoNavOverride: 2048,
    AllowWhenOverlapped: 768,
    RectOnly: 928,
    RootAndChildWindows: 3,

    // \/\/ Tooltips mode
    // \/\/ - typically used in IsItemHovered() + SetTooltip() sequence.
    // \/\/ - this is a shortcut to pull flags from 'style.HoverFlagsForTooltipMouse' or 'style.HoverFlagsForTooltipNav' where you can reconfigure desired behavior.
    // \/\/   e.g. 'HoverFlagsForTooltipMouse' defaults to 'ImGuiHoveredFlags_Stationary | ImGuiHoveredFlags_DelayShort | ImGuiHoveredFlags_AllowWhenDisabled'.
    // \/\/ - for frequently actioned or hovered items providing a tooltip, you want may to use ImGuiHoveredFlags_ForTooltip (stationary + delay) so the tooltip doesn't show too often.
    // \/\/ - for items which main purpose is to be hovered, or items with low affordance, or in less consistent apps, prefer no delay or shorter delay.

    /**
     * \/\/ Shortcut for standard flags when using IsItemHovered() + SetTooltip() sequence.
     */
    ForTooltip: 4096,

    // \/\/ (Advanced) Mouse Hovering delays.
    // \/\/ - generally you can use ImGuiHoveredFlags_ForTooltip to use application-standardized flags.
    // \/\/ - use those if you need specific overrides.

    /**
     * \/\/ Require mouse to be stationary for style.HoverStationaryDelay (~0.15 sec) _at least one time_. After this, can move on same item\/window. Using the stationary test tends to reduces the need for a long delay.
     */
    Stationary: 8192,
    /**
     * \/\/ IsItemHovered() only: Return true immediately (default). As this is the default you generally ignore this.
     */
    DelayNone: 16384,
    /**
     * \/\/ IsItemHovered() only: Return true after style.HoverDelayShort elapsed (~0.15 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item).
     */
    DelayShort: 32768,
    /**
     * \/\/ IsItemHovered() only: Return true after style.HoverDelayNormal elapsed (~0.40 sec) (shared between items) + requires mouse to be stationary for style.HoverStationaryDelay (once per item).
     */
    DelayNormal: 65536,
    /**
     * \/\/ IsItemHovered() only: Disable shared delay system where moving from one item to the next keeps the previous timer for a short time (standard for tooltips with long delays)
     */
    NoSharedDelay: 131072,
  },
  /**
   * \/\/ Flags for ImGui::DockSpace(), shared\/inherited by child nodes.
   * \/\/ (Some flags can be applied to individual nodes directly)
   * \/\/ FIXME-DOCK: Also see ImGuiDockNodeFlagsPrivate_ which may involve using the WIP and internal DockBuilder api.
   */
  DockNodeFlags: {
    None: 0,
    /**
     * \/\/       \/\/ Don't display the dockspace node but keep it alive. Windows docked into this dockspace node won't be undocked.
     */
    KeepAliveOnly: 1,

    // \/\/ImGuiDockNodeFlags_NoCentralNode              = 1 << 1,   \/\/       \/\/ Disable Central Node (the node which can stay empty)

    /**
     * \/\/       \/\/ Disable docking over the Central Node, which will be always kept empty.
     */
    NoDockingOverCentralNode: 4,
    /**
     * \/\/       \/\/ Enable passthru dockspace: 1) DockSpace() will render a ImGuiCol_WindowBg background covering everything excepted the Central Node when empty. Meaning the host window should probably use SetNextWindowBgAlpha(0.0f) prior to Begin() when using this. 2) When Central Node is empty: let inputs pass-through + won't display a DockingEmptyBg background. See demo for details.
     */
    PassthruCentralNode: 8,
    /**
     * \/\/       \/\/ Disable other windows\/nodes from splitting this node.
     */
    NoDockingSplit: 16,
    /**
     * \/\/ Saved \/\/ Disable resizing node using the splitter\/separators. Useful with programmatically setup dockspaces.
     */
    NoResize: 32,
    /**
     * \/\/       \/\/ Tab bar will automatically hide when there is a single window in the dock node.
     */
    AutoHideTabBar: 64,
    /**
     * \/\/       \/\/ Disable undocking this node.
     */
    NoUndocking: 128,
  },
  /**
   * \/\/ Flags for ImGui::BeginDragDropSource(), ImGui::AcceptDragDropPayload()
   */
  DragDropFlags: {
    None: 0,

    // \/\/ BeginDragDropSource() flags

    /**
     * \/\/ Disable preview tooltip. By default, a successful call to BeginDragDropSource opens a tooltip so you can display a preview or description of the source contents. This flag disables this behavior.
     */
    SourceNoPreviewTooltip: 1,
    /**
     * \/\/ By default, when dragging we clear data so that IsItemHovered() will return false, to avoid subsequent user code submitting tooltips. This flag disables this behavior so you can still call IsItemHovered() on the source item.
     */
    SourceNoDisableHover: 2,
    /**
     * \/\/ Disable the behavior that allows to open tree nodes and collapsing header by holding over them while dragging a source item.
     */
    SourceNoHoldToOpenOthers: 4,
    /**
     * \/\/ Allow items such as Text(), Image() that have no unique identifier to be used as drag source, by manufacturing a temporary identifier based on their window-relative position. This is extremely unusual within the dear imgui ecosystem and so we made it explicit.
     */
    SourceAllowNullID: 8,
    /**
     * \/\/ External source (from outside of dear imgui), won't attempt to read current item\/window info. Will always return true. Only one Extern source can be active simultaneously.
     */
    SourceExtern: 16,
    /**
     * \/\/ Automatically expire the payload if the source cease to be submitted (otherwise payloads are persisting while being dragged)
     */
    PayloadAutoExpire: 32,
    /**
     * \/\/ Hint to specify that the payload may not be copied outside current dear imgui context.
     */
    PayloadNoCrossContext: 64,
    /**
     * \/\/ Hint to specify that the payload may not be copied outside current process.
     */
    PayloadNoCrossProcess: 128,

    // \/\/ AcceptDragDropPayload() flags

    /**
     * \/\/ AcceptDragDropPayload() will returns true even before the mouse button is released. You can then call IsDelivery() to test if the payload needs to be delivered.
     */
    AcceptBeforeDelivery: 1024,
    /**
     * \/\/ Do not draw the default highlight rectangle when hovering over target.
     */
    AcceptNoDrawDefaultRect: 2048,
    /**
     * \/\/ Request hiding the BeginDragDropSource tooltip from the BeginDragDropTarget site.
     */
    AcceptNoPreviewTooltip: 4096,
    /**
     * \/\/ Accepting item will render as if hovered. Useful for e.g. a Button() used as a drop target.
     */
    AcceptDrawAsHovered: 8192,
    /**
     * \/\/ For peeking ahead and inspecting the payload before delivery.
     */
    AcceptPeekOnly: 3072,
  },
  /**
   * \/\/ A primary data type
   */
  DataType: {
    /**
     * \/\/ signed char \/ char (with sensible compilers)
     */
    S8: 0,
    /**
     * \/\/ unsigned char
     */
    U8: 1,
    /**
     * \/\/ short
     */
    S16: 2,
    /**
     * \/\/ unsigned short
     */
    U16: 3,
    /**
     * \/\/ int
     */
    S32: 4,
    /**
     * \/\/ unsigned int
     */
    U32: 5,
    /**
     * \/\/ long long \/ __int64
     */
    S64: 6,
    /**
     * \/\/ unsigned long long \/ unsigned __int64
     */
    U64: 7,
    /**
     * \/\/ float
     */
    Float: 8,
    /**
     * \/\/ double
     */
    Double: 9,
    /**
     * \/\/ bool (provided for user convenience, not supported by scalar widgets)
     */
    Bool: 10,
    /**
     * \/\/ char* (provided for user convenience, not supported by scalar widgets)
     */
    String: 11,
    COUNT: 12,
  },

  // \/\/ A cardinal direction

  /**
   * \/\/ Forward declared enum type ImGuiDir
   */
  Dir: {
    _None: -1,
    _Left: 0,
    _Right: 1,
    _Up: 2,
    _Down: 3,
    _COUNT: 4,
  },

  // \/\/ A sorting direction

  /**
   * \/\/ Forward declared enum type ImGuiSortDirection
   */
  SortDirection: {
    _None: 0,
    /**
     * \/\/ Ascending = 0->9, A->Z etc.
     */
    _Ascending: 1,
    /**
     * \/\/ Descending = 9->0, Z->A etc.
     */
    _Descending: 2,
  },

  // \/\/ A key identifier (ImGuiKey_XXX or ImGuiMod_XXX value): can represent Keyboard, Mouse and Gamepad values.
  // \/\/ All our named keys are >= 512. Keys value 0 to 511 are left unused and were legacy native\/opaque key values (< 1.87).
  // \/\/ Support for legacy keys was completely removed in 1.91.5.
  // \/\/ Read details about the 1.87+ transition : https:\/\/github.com\/ocornut\/imgui\/issues\/4921
  // \/\/ Note that "Keys" related to physical keys and are not the same concept as input "Characters", the latter are submitted via io.AddInputCharacter().
  // \/\/ The keyboard key enum values are named after the keys on a standard US keyboard, and on other keyboard types the keys reported may not match the keycaps.

  /**
   * \/\/ Forward declared enum type ImGuiKey
   */
  Key: {
    /**
     * \/\/ Keyboard
     */
    _None: 0,
    /**
     * \/\/ First valid key value (other than 0)
     */
    _NamedKey_BEGIN: 512,
    /**
     * \/\/ == ImGuiKey_NamedKey_BEGIN
     */
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
    /**
     * \/\/ Also see ImGuiMod_Ctrl, ImGuiMod_Shift, ImGuiMod_Alt, ImGuiMod_Super below!
     */
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
    /**
     * \/\/ '
     */
    _Apostrophe: 596,
    /**
     * \/\/ ,
     */
    _Comma: 597,
    /**
     * \/\/ -
     */
    _Minus: 598,
    /**
     * \/\/ .
     */
    _Period: 599,
    /**
     * \/\/ \/
     */
    _Slash: 600,
    /**
     * \/\/ ;
     */
    _Semicolon: 601,
    /**
     * \/\/ =
     */
    _Equal: 602,
    /**
     * \/\/ [
     */
    _LeftBracket: 603,
    /**
     * \/\/ \ (this text inhibit multiline comment caused by backslash)
     */
    _Backslash: 604,
    /**
     * \/\/ ]
     */
    _RightBracket: 605,
    /**
     * \/\/ `
     */
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
    /**
     * \/\/ Available on some keyboard\/mouses. Often referred as "Browser Back"
     */
    _AppBack: 629,
    _AppForward: 630,
    /**
     * \/\/ Non-US backslash.
     */
    _Oem102: 631,

    // \/\/ Gamepad
    // \/\/ (analog values are 0.0f to 1.0f)
    // \/\/ (download controller mapping PNG\/PSD at http:\/\/dearimgui.com\/controls_sheets)
    // \/\/                              \/\/ XBOX        | SWITCH  | PLAYSTA. | -> ACTION

    /**
     * \/\/ Menu        | +       | Options  |
     */
    _GamepadStart: 632,
    /**
     * \/\/ View        | -       | Share    |
     */
    _GamepadBack: 633,
    /**
     * \/\/ X           | Y       | Square   | Toggle Menu. Hold for Windowing mode (Focus\/Move\/Resize windows)
     */
    _GamepadFaceLeft: 634,
    /**
     * \/\/ B           | A       | Circle   | Cancel \/ Close \/ Exit
     */
    _GamepadFaceRight: 635,
    /**
     * \/\/ Y           | X       | Triangle | Open Context Menu
     */
    _GamepadFaceUp: 636,
    /**
     * \/\/ A           | B       | Cross    | Activate \/ Open \/ Toggle. Hold for 0.60f to Activate in Text Input mode (e.g. wired to an on-screen keyboard).
     */
    _GamepadFaceDown: 637,
    /**
     * \/\/ D-pad Left  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode)
     */
    _GamepadDpadLeft: 638,
    /**
     * \/\/ D-pad Right | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode)
     */
    _GamepadDpadRight: 639,
    /**
     * \/\/ D-pad Up    | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode)
     */
    _GamepadDpadUp: 640,
    /**
     * \/\/ D-pad Down  | "       | "        | Move \/ Tweak \/ Resize Window (in Windowing mode)
     */
    _GamepadDpadDown: 641,
    /**
     * \/\/ L Bumper    | L       | L1       | Tweak Slower \/ Focus Previous (in Windowing mode)
     */
    _GamepadL1: 642,
    /**
     * \/\/ R Bumper    | R       | R1       | Tweak Faster \/ Focus Next (in Windowing mode)
     */
    _GamepadR1: 643,
    /**
     * \/\/ L Trigger   | ZL      | L2       | [Analog]
     */
    _GamepadL2: 644,
    /**
     * \/\/ R Trigger   | ZR      | R2       | [Analog]
     */
    _GamepadR2: 645,
    /**
     * \/\/ L Stick     | L3      | L3       |
     */
    _GamepadL3: 646,
    /**
     * \/\/ R Stick     | R3      | R3       |
     */
    _GamepadR3: 647,
    /**
     * \/\/             |         |          | [Analog] Move Window (in Windowing mode)
     */
    _GamepadLStickLeft: 648,
    /**
     * \/\/             |         |          | [Analog] Move Window (in Windowing mode)
     */
    _GamepadLStickRight: 649,
    /**
     * \/\/             |         |          | [Analog] Move Window (in Windowing mode)
     */
    _GamepadLStickUp: 650,
    /**
     * \/\/             |         |          | [Analog] Move Window (in Windowing mode)
     */
    _GamepadLStickDown: 651,
    /**
     * \/\/             |         |          | [Analog]
     */
    _GamepadRStickLeft: 652,
    /**
     * \/\/             |         |          | [Analog]
     */
    _GamepadRStickRight: 653,
    /**
     * \/\/             |         |          | [Analog]
     */
    _GamepadRStickUp: 654,
    /**
     * \/\/             |         |          | [Analog]
     */
    _GamepadRStickDown: 655,
    /**
     * \/\/ Aliases: Mouse Buttons (auto-submitted from AddMouseButtonEvent() calls)
     * \/\/ - This is mirroring the data also written to io.MouseDown[], io.MouseWheel, in a format allowing them to be accessed via standard key API.
     */
    _MouseLeft: 656,
    _MouseRight: 657,
    _MouseMiddle: 658,
    _MouseX1: 659,
    _MouseX2: 660,
    _MouseWheelX: 661,
    _MouseWheelY: 662,
    /**
     * \/\/ Keyboard Modifiers (explicitly submitted by backend via AddKeyEvent() calls)
     * \/\/ - Any functions taking a ImGuiKeyChord parameter can binary-or those with regular keys, e.g. Shortcut(ImGuiMod_Ctrl | ImGuiKey_S).
     * \/\/ - Those are written back into io.KeyCtrl, io.KeyShift, io.KeyAlt, io.KeySuper for convenience,
     * \/\/   but may be accessed via standard key API such as IsKeyPressed(), IsKeyReleased(), querying duration etc.
     * \/\/ - Code polling every key (e.g. an interface to detect a key press for input mapping) might want to ignore those
     * \/\/   and prefer using the real keys (e.g. ImGuiKey_LeftCtrl, ImGuiKey_RightCtrl instead of ImGuiMod_Ctrl).
     * \/\/ - In theory the value of keyboard modifiers should be roughly equivalent to a logical or of the equivalent left\/right keys.
     * \/\/   In practice: it's complicated; mods are often provided from different sources. Keyboard layout, IME, sticky keys and
     * \/\/   backends tend to interfere and break that equivalence. The safer decision is to relay that ambiguity down to the end-user...
     * \/\/ - On macOS, we swap Cmd(Super) and Ctrl keys at the time of the io.AddKeyEvent() call.
     */
    ImGuiMod_None: 0,
    /**
     * \/\/ Ctrl (non-macOS), Cmd (macOS)
     */
    ImGuiMod_Ctrl: 4096,
    /**
     * \/\/ Shift
     */
    ImGuiMod_Shift: 8192,
    /**
     * \/\/ Option\/Menu
     */
    ImGuiMod_Alt: 16384,
    /**
     * \/\/ Windows\/Super (non-macOS), Ctrl (macOS)
     */
    ImGuiMod_Super: 32768,
  },
  /**
   * \/\/ Flags for Shortcut(), SetNextItemShortcut(),
   * \/\/ (and for upcoming extended versions of IsKeyPressed(), IsMouseClicked(), Shortcut(), SetKeyOwner(), SetItemKeyOwner() that are still in imgui_internal.h)
   * \/\/ Don't mistake with ImGuiInputTextFlags! (which is for ImGui::InputText() function)
   */
  InputFlags: {
    None: 0,
    /**
     * \/\/ Enable repeat. Return true on successive repeats. Default for legacy IsKeyPressed(). NOT Default for legacy IsMouseClicked(). MUST BE == 1.
     */
    Repeat: 1,

    // \/\/ Flags for Shortcut(), SetNextItemShortcut()
    // \/\/ - Routing policies: RouteGlobal+OverActive >> RouteActive or RouteFocused (if owner is active item) >> RouteGlobal+OverFocused >> RouteFocused (if in focused window stack) >> RouteGlobal.
    // \/\/ - Default policy is RouteFocused. Can select only 1 policy among all available.

    /**
     * \/\/ Route to active item only.
     */
    RouteActive: 1024,
    /**
     * \/\/ Route to windows in the focus stack (DEFAULT). Deep-most focused window takes inputs. Active item takes inputs over deep-most focused window.
     */
    RouteFocused: 2048,
    /**
     * \/\/ Global route (unless a focused window or active item registered the route).
     */
    RouteGlobal: 4096,
    /**
     * \/\/ Do not register route, poll keys directly.
     */
    RouteAlways: 8192,

    // \/\/ - Routing options

    /**
     * \/\/ Option: global route: higher priority than focused route (unless active item in focused route).
     */
    RouteOverFocused: 16384,
    /**
     * \/\/ Option: global route: higher priority than active item. Unlikely you need to use that: will interfere with every active items, e.g. Ctrl+A registered by InputText will be overridden by this. May not be fully honored as user\/internal code is likely to always assume they can access keys when active.
     */
    RouteOverActive: 32768,
    /**
     * \/\/ Option: global route: will not be applied if underlying background\/void is focused (== no Dear ImGui windows are focused). Useful for overlay applications.
     */
    RouteUnlessBgFocused: 65536,
    /**
     * \/\/ Option: route evaluated from the point of view of root window rather than current window.
     */
    RouteFromRootWindow: 131072,

    // \/\/ Flags for SetNextItemShortcut()

    /**
     * \/\/ Automatically display a tooltip when hovering item [BETA] Unsure of right api (opt-in\/opt-out)
     */
    Tooltip: 262144,
  },
  /**
   * \/\/ Configuration flags stored in io.ConfigFlags. Set by user\/application.
   * \/\/ Note that nowadays most of our configuration options are in other ImGuiIO fields, e.g. io.ConfigWindowsMoveFromTitleBarOnly.
   */
  ConfigFlags: {
    None: 0,
    /**
     * \/\/ Master keyboard navigation enable flag. Enable full Tabbing + directional arrows + Space\/Enter to activate. Note: some features such as basic Tabbing and CtrL+Tab are enabled by regardless of this flag (and may be disabled via other means, see #4828, #9218).
     */
    NavEnableKeyboard: 1,
    /**
     * \/\/ Master gamepad navigation enable flag. Backend also needs to set ImGuiBackendFlags_HasGamepad.
     */
    NavEnableGamepad: 2,
    /**
     * \/\/ Instruct dear imgui to disable mouse inputs and interactions.
     */
    NoMouse: 16,
    /**
     * \/\/ Instruct backend to not alter mouse cursor shape and visibility. Use if the backend cursor changes are interfering with yours and you don't want to use SetMouseCursor() to change mouse cursor. You may want to honor requests from imgui by reading GetMouseCursor() yourself instead.
     */
    NoMouseCursorChange: 32,
    /**
     * \/\/ Instruct dear imgui to disable keyboard inputs and interactions. This is done by ignoring keyboard events and clearing existing states.
     */
    NoKeyboard: 64,

    // \/\/ [BETA] Docking

    /**
     * \/\/ Docking enable flags.
     */
    DockingEnable: 128,

    // \/\/ [BETA] Viewports
    // \/\/ When using viewports it is recommended that your default value for ImGuiCol_WindowBg is opaque (Alpha=1.0) so transition to a viewport won't be noticeable.

    /**
     * \/\/ Viewport enable flags (require both ImGuiBackendFlags_PlatformHasViewports + ImGuiBackendFlags_RendererHasViewports set by the respective backends)
     */
    ViewportsEnable: 1024,

    // \/\/ [Unused] User storage (to allow your backend\/engine to communicate to code that may be shared between multiple projects. Those flags are NOT used by core Dear ImGui)

    /**
     * \/\/ Application is SRGB-aware.
     */
    IsSRGB: 1048576,
    /**
     * \/\/ Application is using a touch screen instead of a mouse.
     */
    IsTouchScreen: 2097152,
  },
  /**
   * \/\/ Backend capabilities flags stored in io.BackendFlags. Set by imgui_impl_xxx or custom backend.
   */
  BackendFlags: {
    None: 0,
    /**
     * \/\/ Backend Platform supports gamepad and currently has one connected.
     */
    HasGamepad: 1,
    /**
     * \/\/ Backend Platform supports honoring GetMouseCursor() value to change the OS cursor shape.
     */
    HasMouseCursors: 2,
    /**
     * \/\/ Backend Platform supports io.WantSetMousePos requests to reposition the OS mouse position (only used if io.ConfigNavMoveSetMousePos is set).
     */
    HasSetMousePos: 4,
    /**
     * \/\/ Backend Renderer supports ImDrawCmd::VtxOffset. This enables output of large meshes (64K+ vertices) while still using 16-bit indices.
     */
    RendererHasVtxOffset: 8,
    /**
     * \/\/ Backend Renderer supports ImTextureData requests to create\/update\/destroy textures. This enables incremental texture updates and texture reloads. See https:\/\/github.com\/ocornut\/imgui\/blob\/master\/docs\/BACKENDS.md for instructions on how to upgrade your custom backend.
     */
    RendererHasTextures: 16,

    // \/\/ [BETA] Multi-Viewports

    /**
     * \/\/ Backend Renderer supports multiple viewports.
     */
    RendererHasViewports: 1024,
    /**
     * \/\/ Backend Platform supports multiple viewports.
     */
    PlatformHasViewports: 2048,
    /**
     * \/\/ Backend Platform supports calling io.AddMouseViewportEvent() with the viewport under the mouse. IF POSSIBLE, ignore viewports with the ImGuiViewportFlags_NoInputs flag (Win32 backend, GLFW 3.30+ backend can do this, SDL backend cannot). If this cannot be done, Dear ImGui needs to use a flawed heuristic to find the viewport under.
     */
    HasMouseHoveredViewport: 4096,
    /**
     * \/\/ Backend Platform supports honoring viewport->ParentViewport\/ParentViewportId value, by applying the corresponding parent\/child relation at the Platform level.
     */
    HasParentViewport: 8192,
  },
  /**
   * \/\/ Enumeration for PushStyleColor() \/ PopStyleColor()
   */
  Col: {
    Text: 0,
    TextDisabled: 1,
    /**
     * \/\/ Background of normal windows
     */
    WindowBg: 2,
    /**
     * \/\/ Background of child windows
     */
    ChildBg: 3,
    /**
     * \/\/ Background of popups, menus, tooltips windows
     */
    PopupBg: 4,
    Border: 5,
    BorderShadow: 6,
    /**
     * \/\/ Background of checkbox, radio button, plot, slider, text input
     */
    FrameBg: 7,
    FrameBgHovered: 8,
    FrameBgActive: 9,
    /**
     * \/\/ Title bar
     */
    TitleBg: 10,
    /**
     * \/\/ Title bar when focused
     */
    TitleBgActive: 11,
    /**
     * \/\/ Title bar when collapsed
     */
    TitleBgCollapsed: 12,
    MenuBarBg: 13,
    ScrollbarBg: 14,
    ScrollbarGrab: 15,
    ScrollbarGrabHovered: 16,
    ScrollbarGrabActive: 17,
    /**
     * \/\/ Checkbox tick and RadioButton circle
     */
    CheckMark: 18,
    SliderGrab: 19,
    SliderGrabActive: 20,
    Button: 21,
    ButtonHovered: 22,
    ButtonActive: 23,
    /**
     * \/\/ Header* colors are used for CollapsingHeader, TreeNode, Selectable, MenuItem
     */
    Header: 24,
    HeaderHovered: 25,
    HeaderActive: 26,
    Separator: 27,
    SeparatorHovered: 28,
    SeparatorActive: 29,
    /**
     * \/\/ Resize grip in lower-right and lower-left corners of windows.
     */
    ResizeGrip: 30,
    ResizeGripHovered: 31,
    ResizeGripActive: 32,
    /**
     * \/\/ InputText cursor\/caret
     */
    InputTextCursor: 33,
    /**
     * \/\/ Tab background, when hovered
     */
    TabHovered: 34,
    /**
     * \/\/ Tab background, when tab-bar is focused & tab is unselected
     */
    Tab: 35,
    /**
     * \/\/ Tab background, when tab-bar is focused & tab is selected
     */
    TabSelected: 36,
    /**
     * \/\/ Tab horizontal overline, when tab-bar is focused & tab is selected
     */
    TabSelectedOverline: 37,
    /**
     * \/\/ Tab background, when tab-bar is unfocused & tab is unselected
     */
    TabDimmed: 38,
    /**
     * \/\/ Tab background, when tab-bar is unfocused & tab is selected
     */
    TabDimmedSelected: 39,
    /**
     * \/\/..horizontal overline, when tab-bar is unfocused & tab is selected
     */
    TabDimmedSelectedOverline: 40,
    /**
     * \/\/ Preview overlay color when about to docking something
     */
    DockingPreview: 41,
    /**
     * \/\/ Background color for empty node (e.g. CentralNode with no window docked into it)
     */
    DockingEmptyBg: 42,
    PlotLines: 43,
    PlotLinesHovered: 44,
    PlotHistogram: 45,
    PlotHistogramHovered: 46,
    /**
     * \/\/ Table header background
     */
    TableHeaderBg: 47,
    /**
     * \/\/ Table outer and header borders (prefer using Alpha=1.0 here)
     */
    TableBorderStrong: 48,
    /**
     * \/\/ Table inner borders (prefer using Alpha=1.0 here)
     */
    TableBorderLight: 49,
    /**
     * \/\/ Table row background (even rows)
     */
    TableRowBg: 50,
    /**
     * \/\/ Table row background (odd rows)
     */
    TableRowBgAlt: 51,
    /**
     * \/\/ Hyperlink color
     */
    TextLink: 52,
    /**
     * \/\/ Selected text inside an InputText
     */
    TextSelectedBg: 53,
    /**
     * \/\/ Tree node hierarchy outlines when using ImGuiTreeNodeFlags_DrawLines
     */
    TreeLines: 54,
    /**
     * \/\/ Rectangle border highlighting a drop target
     */
    DragDropTarget: 55,
    /**
     * \/\/ Rectangle background highlighting a drop target
     */
    DragDropTargetBg: 56,
    /**
     * \/\/ Unsaved Document marker (in window title and tabs)
     */
    UnsavedMarker: 57,
    /**
     * \/\/ Color of keyboard\/gamepad navigation cursor\/rectangle, when visible
     */
    NavCursor: 58,
    /**
     * \/\/ Highlight window when using Ctrl+Tab
     */
    NavWindowingHighlight: 59,
    /**
     * \/\/ Darken\/colorize entire screen behind the Ctrl+Tab window list, when active
     */
    NavWindowingDimBg: 60,
    /**
     * \/\/ Darken\/colorize entire screen behind a modal window, when one is active
     */
    ModalWindowDimBg: 61,
    COUNT: 62,
  },
  /**
   * \/\/ Enumeration for PushStyleVar() \/ PopStyleVar() to temporarily modify the ImGuiStyle structure.
   * \/\/ - The enum only refers to fields of ImGuiStyle which makes sense to be pushed\/popped inside UI code.
   * \/\/   During initialization or between frames, feel free to just poke into ImGuiStyle directly.
   * \/\/ - Tip: Use your programming IDE navigation facilities on the names in the _second column_ below to find the actual members and their description.
   * \/\/   - In Visual Studio: Ctrl+Comma ("Edit.GoToAll") can follow symbols inside comments, whereas Ctrl+F12 ("Edit.GoToImplementation") cannot.
   * \/\/   - In Visual Studio w\/ Visual Assist installed: Alt+G ("VAssistX.GoToImplementation") can also follow symbols inside comments.
   * \/\/   - In VS Code, CLion, etc.: Ctrl+Click can follow symbols inside comments.
   * \/\/ - When changing this enum, you need to update the associated internal table GStyleVarInfo[] accordingly. This is where we link enum values to members offset\/type.
   */
  StyleVar: {
    // \/\/ Enum name -------------------------- \/\/ Member in ImGuiStyle structure (see ImGuiStyle for descriptions)

    /**
     * \/\/ float     Alpha
     */
    Alpha: 0,
    /**
     * \/\/ float     DisabledAlpha
     */
    DisabledAlpha: 1,
    /**
     * \/\/ ImVec2    WindowPadding
     */
    WindowPadding: 2,
    /**
     * \/\/ float     WindowRounding
     */
    WindowRounding: 3,
    /**
     * \/\/ float     WindowBorderSize
     */
    WindowBorderSize: 4,
    /**
     * \/\/ ImVec2    WindowMinSize
     */
    WindowMinSize: 5,
    /**
     * \/\/ ImVec2    WindowTitleAlign
     */
    WindowTitleAlign: 6,
    /**
     * \/\/ float     ChildRounding
     */
    ChildRounding: 7,
    /**
     * \/\/ float     ChildBorderSize
     */
    ChildBorderSize: 8,
    /**
     * \/\/ float     PopupRounding
     */
    PopupRounding: 9,
    /**
     * \/\/ float     PopupBorderSize
     */
    PopupBorderSize: 10,
    /**
     * \/\/ ImVec2    FramePadding
     */
    FramePadding: 11,
    /**
     * \/\/ float     FrameRounding
     */
    FrameRounding: 12,
    /**
     * \/\/ float     FrameBorderSize
     */
    FrameBorderSize: 13,
    /**
     * \/\/ ImVec2    ItemSpacing
     */
    ItemSpacing: 14,
    /**
     * \/\/ ImVec2    ItemInnerSpacing
     */
    ItemInnerSpacing: 15,
    /**
     * \/\/ float     IndentSpacing
     */
    IndentSpacing: 16,
    /**
     * \/\/ ImVec2    CellPadding
     */
    CellPadding: 17,
    /**
     * \/\/ float     ScrollbarSize
     */
    ScrollbarSize: 18,
    /**
     * \/\/ float     ScrollbarRounding
     */
    ScrollbarRounding: 19,
    /**
     * \/\/ float     ScrollbarPadding
     */
    ScrollbarPadding: 20,
    /**
     * \/\/ float     GrabMinSize
     */
    GrabMinSize: 21,
    /**
     * \/\/ float     GrabRounding
     */
    GrabRounding: 22,
    /**
     * \/\/ float     ImageRounding
     */
    ImageRounding: 23,
    /**
     * \/\/ float     ImageBorderSize
     */
    ImageBorderSize: 24,
    /**
     * \/\/ float     TabRounding
     */
    TabRounding: 25,
    /**
     * \/\/ float     TabBorderSize
     */
    TabBorderSize: 26,
    /**
     * \/\/ float     TabMinWidthBase
     */
    TabMinWidthBase: 27,
    /**
     * \/\/ float     TabMinWidthShrink
     */
    TabMinWidthShrink: 28,
    /**
     * \/\/ float     TabBarBorderSize
     */
    TabBarBorderSize: 29,
    /**
     * \/\/ float     TabBarOverlineSize
     */
    TabBarOverlineSize: 30,
    /**
     * \/\/ float     TableAngledHeadersAngle
     */
    TableAngledHeadersAngle: 31,
    /**
     * \/\/ ImVec2  TableAngledHeadersTextAlign
     */
    TableAngledHeadersTextAlign: 32,
    /**
     * \/\/ float     TreeLinesSize
     */
    TreeLinesSize: 33,
    /**
     * \/\/ float     TreeLinesRounding
     */
    TreeLinesRounding: 34,
    /**
     * \/\/ ImVec2    ButtonTextAlign
     */
    ButtonTextAlign: 35,
    /**
     * \/\/ ImVec2    SelectableTextAlign
     */
    SelectableTextAlign: 36,
    /**
     * \/\/ float     SeparatorSize
     */
    SeparatorSize: 37,
    /**
     * \/\/ float     SeparatorTextBorderSize
     */
    SeparatorTextBorderSize: 38,
    /**
     * \/\/ ImVec2    SeparatorTextAlign
     */
    SeparatorTextAlign: 39,
    /**
     * \/\/ ImVec2    SeparatorTextPadding
     */
    SeparatorTextPadding: 40,
    /**
     * \/\/ float     DockingSeparatorSize
     */
    DockingSeparatorSize: 41,
    COUNT: 42,
  },
  /**
   * \/\/ Flags for InvisibleButton() [extended in imgui_internal.h]
   */
  ButtonFlags: {
    None: 0,
    /**
     * \/\/ React on left mouse button (default)
     */
    MouseButtonLeft: 1,
    /**
     * \/\/ React on right mouse button
     */
    MouseButtonRight: 2,
    /**
     * \/\/ React on center mouse button
     */
    MouseButtonMiddle: 4,
    /**
     * \/\/ InvisibleButton(): do not disable navigation\/tabbing. Otherwise disabled by default.
     */
    EnableNav: 8,
    /**
     * \/\/ Hit testing will allow subsequent widgets to overlap this one. Require previous frame HoveredId to match before being usable. Shortcut to calling SetNextItemAllowOverlap().
     */
    AllowOverlap: 4096,
  },
  /**
   * \/\/ Flags for ColorEdit3() \/ ColorEdit4() \/ ColorPicker3() \/ ColorPicker4() \/ ColorButton()
   */
  ColorEditFlags: {
    None: 0,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker, ColorButton: ignore Alpha component (will only read 3 components from the input pointer).
     */
    NoAlpha: 2,
    /**
     * \/\/              \/\/ ColorEdit: disable picker when clicking on color square.
     */
    NoPicker: 4,
    /**
     * \/\/              \/\/ ColorEdit: disable toggling options menu when right-clicking on inputs\/small preview.
     */
    NoOptions: 8,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker: disable color square preview next to the inputs. (e.g. to show only the inputs)
     */
    NoSmallPreview: 16,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker: disable inputs sliders\/text widgets (e.g. to show only the small preview color square).
     */
    NoInputs: 32,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker, ColorButton: disable tooltip when hovering the preview.
     */
    NoTooltip: 64,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker: disable display of inline text label (the label is still forwarded to the tooltip and picker).
     */
    NoLabel: 128,
    /**
     * \/\/              \/\/ ColorPicker: disable bigger color preview on right side of the picker, use small color square preview instead.
     */
    NoSidePreview: 256,
    /**
     * \/\/              \/\/ ColorEdit: disable drag and drop target\/source. ColorButton: disable drag and drop source.
     */
    NoDragDrop: 512,
    /**
     * \/\/              \/\/ ColorButton: disable border (which is enforced by default)
     */
    NoBorder: 1024,
    /**
     * \/\/              \/\/ ColorEdit: disable rendering R\/G\/B\/A color marker. May also be disabled globally by setting style.ColorMarkerSize = 0.
     */
    NoColorMarkers: 2048,

    // \/\/ Alpha preview
    // \/\/ - Prior to 1.91.8 (2025\/01\/21): alpha was made opaque in the preview by default using old name ImGuiColorEditFlags_AlphaPreview.
    // \/\/ - We now display the preview as transparent by default. You can use ImGuiColorEditFlags_AlphaOpaque to use old behavior.
    // \/\/ - The new flags may be combined better and allow finer controls.

    /**
     * \/\/              \/\/ ColorEdit, ColorPicker, ColorButton: disable alpha in the preview,. Contrary to _NoAlpha it may still be edited when calling ColorEdit4()\/ColorPicker4(). For ColorButton() this does the same as _NoAlpha.
     */
    AlphaOpaque: 4096,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker, ColorButton: disable rendering a checkerboard background behind transparent color.
     */
    AlphaNoBg: 8192,
    /**
     * \/\/              \/\/ ColorEdit, ColorPicker, ColorButton: display half opaque \/ half transparent preview.
     */
    AlphaPreviewHalf: 16384,

    // \/\/ User Options (right-click on widget to change some of them).

    /**
     * \/\/              \/\/ ColorEdit, ColorPicker: show vertical alpha bar\/gradient in picker.
     */
    AlphaBar: 262144,
    /**
     * \/\/              \/\/ (WIP) ColorEdit: Currently only disable 0.0f..1.0f limits in RGBA edition (note: you probably want to use ImGuiColorEditFlags_Float flag as well).
     */
    HDR: 524288,
    /**
     * \/\/ [Display]    \/\/ ColorEdit: override _display_ type among RGB\/HSV\/Hex. ColorPicker: select any combination using one or more of RGB\/HSV\/Hex.
     */
    DisplayRGB: 1048576,
    /**
     * \/\/ [Display]    \/\/ "
     */
    DisplayHSV: 2097152,
    /**
     * \/\/ [Display]    \/\/ "
     */
    DisplayHex: 4194304,
    /**
     * \/\/ [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0..255.
     */
    Uint8: 8388608,
    /**
     * \/\/ [DataType]   \/\/ ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0.0f..1.0f floats instead of 0..255 integers. No round-trip of value via integers.
     */
    Float: 16777216,
    /**
     * \/\/ [Picker]     \/\/ ColorPicker: bar for Hue, rectangle for Sat\/Value.
     */
    PickerHueBar: 33554432,
    /**
     * \/\/ [Picker]     \/\/ ColorPicker: wheel for Hue, triangle for Sat\/Value.
     */
    PickerHueWheel: 67108864,
    /**
     * \/\/ [Input]      \/\/ ColorEdit, ColorPicker: input and output data in RGB format.
     */
    InputRGB: 134217728,
    /**
     * \/\/ [Input]      \/\/ ColorEdit, ColorPicker: input and output data in HSV format.
     */
    InputHSV: 268435456,
  },
  /**
   * \/\/ Flags for DragFloat(), DragInt(), SliderFloat(), SliderInt() etc.
   * \/\/ We use the same sets of flags for DragXXX() and SliderXXX() functions as the features are the same and it makes it easier to swap them.
   * \/\/ (Those are per-item flags. There is shared behavior flag too: ImGuiIO: io.ConfigDragClickToInputText)
   */
  SliderFlags: {
    None: 0,
    /**
     * \/\/ Make the widget logarithmic (linear otherwise). Consider using ImGuiSliderFlags_NoRoundToFormat with this if using a format-string with small amount of digits.
     */
    Logarithmic: 32,
    /**
     * \/\/ Disable rounding underlying value to match precision of the display format string (e.g. %.3f values are rounded to those 3 digits).
     */
    NoRoundToFormat: 64,
    /**
     * \/\/ Disable Ctrl+Click or Enter key allowing to input text directly into the widget.
     */
    NoInput: 128,
    /**
     * \/\/ Enable wrapping around from max to min and from min to max. Only supported by DragXXX() functions for now.
     */
    WrapAround: 256,
    /**
     * \/\/ Clamp value to min\/max bounds when input manually with Ctrl+Click. By default Ctrl+Click allows going out of bounds.
     */
    ClampOnInput: 512,
    /**
     * \/\/ Clamp even if min==max==0.0f. Otherwise due to legacy reason DragXXX functions don't clamp with those values. When your clamping limits are dynamic you almost always want to use it.
     */
    ClampZeroRange: 1024,
    /**
     * \/\/ Disable keyboard modifiers altering tweak speed. Useful if you want to alter tweak speed yourself based on your own logic.
     */
    NoSpeedTweaks: 2048,
    /**
     * \/\/ DragScalarN(), SliderScalarN(): Draw R\/G\/B\/A color markers on each component.
     */
    ColorMarkers: 4096,
    AlwaysClamp: 1536,
  },
  /**
   * \/\/ Identify a mouse button.
   * \/\/ Those values are guaranteed to be stable and we frequently use 0\/1 directly. Named enums provided for convenience.
   */
  MouseButton: {
    Left: 0,
    Right: 1,
    Middle: 2,
    COUNT: 5,
  },
  /**
   * \/\/ Enumeration for GetMouseCursor()
   * \/\/ User code may request backend to display given cursor by calling SetMouseCursor(), which is why we have some cursors that are marked unused here
   */
  MouseCursor: {
    None: -1,
    Arrow: 0,
    /**
     * \/\/ When hovering over InputText, etc.
     */
    TextInput: 1,
    /**
     * \/\/ (Unused by Dear ImGui functions)
     */
    ResizeAll: 2,
    /**
     * \/\/ When hovering over a horizontal border
     */
    ResizeNS: 3,
    /**
     * \/\/ When hovering over a vertical border or a column
     */
    ResizeEW: 4,
    /**
     * \/\/ When hovering over the bottom-left corner of a window
     */
    ResizeNESW: 5,
    /**
     * \/\/ When hovering over the bottom-right corner of a window
     */
    ResizeNWSE: 6,
    /**
     * \/\/ (Unused by Dear ImGui functions. Use for e.g. hyperlinks)
     */
    Hand: 7,
    /**
     * \/\/ When waiting for something to process\/load.
     */
    Wait: 8,
    /**
     * \/\/ When waiting for something to process\/load, but application is still interactive.
     */
    Progress: 9,
    /**
     * \/\/ When hovering something with disallowed interaction. Usually a crossed circle.
     */
    NotAllowed: 10,
    COUNT: 11,
  },

  // \/\/ Enumeration for AddMouseSourceEvent() actual source of Mouse Input data.
  // \/\/ Historically we use "Mouse" terminology everywhere to indicate pointer data, e.g. MousePos, IsMousePressed(), io.AddMousePosEvent()
  // \/\/ But that "Mouse" data can come from different source which occasionally may be useful for application to know about.
  // \/\/ You can submit a change of pointer type using io.AddMouseSourceEvent().

  /**
   * \/\/ Forward declared enum type ImGuiMouseSource
   */
  MouseSource: {
    /**
     * \/\/ Input is coming from an actual mouse.
     */
    _Mouse: 0,
    /**
     * \/\/ Input is coming from a touch screen (no hovering prior to initial press, less precise initial press aiming, dual-axis wheeling possible).
     */
    _TouchScreen: 1,
    /**
     * \/\/ Input is coming from a pressure\/magnetic pen (often used in conjunction with high-sampling rates).
     */
    _Pen: 2,
    _COUNT: 3,
  },
  /**
   * \/\/ Enumeration for ImGui::SetNextWindow***(), SetWindow***(), SetNextItem***() functions
   * \/\/ Represent a condition.
   * \/\/ Important: Treat as a regular enum! Do NOT combine multiple values using binary operators! All the functions above treat 0 as a shortcut to ImGuiCond_Always.
   */
  Cond: {
    /**
     * \/\/ No condition (always set the variable), same as _Always
     */
    None: 0,
    /**
     * \/\/ No condition (always set the variable), same as _None
     */
    Always: 1,
    /**
     * \/\/ Set the variable once per runtime session (only the first call will succeed)
     */
    Once: 2,
    /**
     * \/\/ Set the variable if the object\/window has no persistently saved data (no entry in .ini file)
     */
    FirstUseEver: 4,
    /**
     * \/\/ Set the variable if the object\/window is appearing after being hidden\/inactive (or the first time)
     */
    Appearing: 8,
  },
  /**
   * \/\/ Flags for ImGui::BeginTable()
   * \/\/ - Important! Sizing policies have complex and subtle side effects, much more so than you would expect.
   * \/\/   Read comments\/demos carefully + experiment with live demos to get acquainted with them.
   * \/\/ - The DEFAULT sizing policies are:
   * \/\/    - Default to ImGuiTableFlags_SizingFixedFit    if ScrollX is on, or if host window has ImGuiWindowFlags_AlwaysAutoResize.
   * \/\/    - Default to ImGuiTableFlags_SizingStretchSame if ScrollX is off.
   * \/\/ - When ScrollX is off:
   * \/\/    - Table defaults to ImGuiTableFlags_SizingStretchSame -> all Columns defaults to ImGuiTableColumnFlags_WidthStretch with same weight.
   * \/\/    - Columns sizing policy allowed: Stretch (default), Fixed\/Auto.
   * \/\/    - Fixed Columns (if any) will generally obtain their requested width (unless the table cannot fit them all).
   * \/\/    - Stretch Columns will share the remaining width according to their respective weight.
   * \/\/    - Mixed Fixed\/Stretch columns is possible but has various side-effects on resizing behaviors.
   * \/\/      The typical use of mixing sizing policies is: any number of LEADING Fixed columns, followed by one or two TRAILING Stretch columns.
   * \/\/      (this is because the visible order of columns have subtle but necessary effects on how they react to manual resizing).
   * \/\/ - When ScrollX is on:
   * \/\/    - Table defaults to ImGuiTableFlags_SizingFixedFit -> all Columns defaults to ImGuiTableColumnFlags_WidthFixed
   * \/\/    - Columns sizing policy allowed: Fixed\/Auto mostly.
   * \/\/    - Fixed Columns can be enlarged as needed. Table will show a horizontal scrollbar if needed.
   * \/\/    - When using auto-resizing (non-resizable) fixed columns, querying the content width to use item right-alignment e.g. SetNextItemWidth(-FLT_MIN) doesn't make sense, would create a feedback loop.
   * \/\/    - Using Stretch columns OFTEN DOES NOT MAKE SENSE if ScrollX is on, UNLESS you have specified a value for 'inner_width' in BeginTable().
   * \/\/      If you specify a value for 'inner_width' then effectively the scrolling space is known and Stretch or mixed Fixed\/Stretch columns become meaningful again.
   * \/\/ - Read on documentation at the top of imgui_tables.cpp for details.
   */
  TableFlags: {
    /**
     * \/\/ Features
     */
    None: 0,
    /**
     * \/\/ Enable resizing columns.
     */
    Resizable: 1,
    /**
     * \/\/ Enable reordering columns in header row. (Need calling TableSetupColumn() + TableHeadersRow() to display headers, or using ImGuiTableFlags_ContextMenuInBody to access context-menu without headers).
     */
    Reorderable: 2,
    /**
     * \/\/ Enable hiding\/disabling columns in context menu.
     */
    Hideable: 4,
    /**
     * \/\/ Enable sorting. Call TableGetSortSpecs() to obtain sort specs. Also see ImGuiTableFlags_SortMulti and ImGuiTableFlags_SortTristate.
     */
    Sortable: 8,
    /**
     * \/\/ Disable persisting columns order, width, visibility and sort settings in the .ini file.
     */
    NoSavedSettings: 16,
    /**
     * \/\/ Right-click on columns body\/contents will also display table context menu. By default it is available in TableHeadersRow().
     */
    ContextMenuInBody: 32,

    // \/\/ Decorations

    /**
     * \/\/ Set each RowBg color with ImGuiCol_TableRowBg or ImGuiCol_TableRowBgAlt (equivalent of calling TableSetBgColor with ImGuiTableBgFlags_RowBg0 on each row manually)
     */
    RowBg: 64,
    /**
     * \/\/ Draw horizontal borders between rows.
     */
    BordersInnerH: 128,
    /**
     * \/\/ Draw horizontal borders at the top and bottom.
     */
    BordersOuterH: 256,
    /**
     * \/\/ Draw vertical borders between columns.
     */
    BordersInnerV: 512,
    /**
     * \/\/ Draw vertical borders on the left and right sides.
     */
    BordersOuterV: 1024,
    /**
     * \/\/ Draw horizontal borders.
     */
    BordersH: 384,
    /**
     * \/\/ Draw vertical borders.
     */
    BordersV: 1536,
    /**
     * \/\/ Draw inner borders.
     */
    BordersInner: 640,
    /**
     * \/\/ Draw outer borders.
     */
    BordersOuter: 1280,
    /**
     * \/\/ Draw all borders.
     */
    Borders: 1920,
    /**
     * \/\/ [ALPHA] Disable vertical borders in columns Body (borders will always appear in Headers). -> May move to style
     */
    NoBordersInBody: 2048,
    /**
     * \/\/ [ALPHA] Disable vertical borders in columns Body until hovered for resize (borders will always appear in Headers). -> May move to style
     */
    NoBordersInBodyUntilResize: 4096,

    // \/\/ Sizing Policy (read above for defaults)

    /**
     * \/\/ Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching contents width.
     */
    SizingFixedFit: 8192,
    /**
     * \/\/ Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable), matching the maximum contents width of all columns. Implicitly enable ImGuiTableFlags_NoKeepColumnsVisible.
     */
    SizingFixedSame: 16384,
    /**
     * \/\/ Columns default to _WidthStretch with default weights proportional to each columns contents widths.
     */
    SizingStretchProp: 24576,
    /**
     * \/\/ Columns default to _WidthStretch with default weights all equal, unless overridden by TableSetupColumn().
     */
    SizingStretchSame: 32768,

    // \/\/ Sizing Extra Options

    /**
     * \/\/ Make outer width auto-fit to columns, overriding outer_size.x value. Only available when ScrollX\/ScrollY are disabled and Stretch columns are not used.
     */
    NoHostExtendX: 65536,
    /**
     * \/\/ Make outer height stop exactly at outer_size.y (prevent auto-extending table past the limit). Only available when ScrollX\/ScrollY are disabled. Data below the limit will be clipped and not visible.
     */
    NoHostExtendY: 131072,
    /**
     * \/\/ Disable keeping column always minimally visible when ScrollX is off and table gets too small. Not recommended if columns are resizable.
     */
    NoKeepColumnsVisible: 262144,
    /**
     * \/\/ Disable distributing remainder width to stretched columns (width allocation on a 100-wide table with 3 columns: Without this flag: 33,33,34. With this flag: 33,33,33). With larger number of columns, resizing will appear to be less smooth.
     */
    PreciseWidths: 524288,

    // \/\/ Clipping

    /**
     * \/\/ Disable clipping rectangle for every individual columns (reduce draw command count, items will be able to overflow into other columns). Generally incompatible with TableSetupScrollFreeze().
     */
    NoClip: 1048576,

    // \/\/ Padding

    /**
     * \/\/ Default if BordersOuterV is on. Enable outermost padding. Generally desirable if you have headers.
     */
    PadOuterX: 2097152,
    /**
     * \/\/ Default if BordersOuterV is off. Disable outermost padding.
     */
    NoPadOuterX: 4194304,
    /**
     * \/\/ Disable inner padding between columns (double inner padding if BordersOuterV is on, single inner padding if BordersOuterV is off).
     */
    NoPadInnerX: 8388608,

    // \/\/ Scrolling

    /**
     * \/\/ Enable horizontal scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size. Changes default sizing policy. Because this creates a child window, ScrollY is currently generally recommended when using ScrollX.
     */
    ScrollX: 16777216,
    /**
     * \/\/ Enable vertical scrolling. Require 'outer_size' parameter of BeginTable() to specify the container size.
     */
    ScrollY: 33554432,

    // \/\/ Sorting

    /**
     * \/\/ Hold shift when clicking headers to sort on multiple column. TableGetSortSpecs() may return specs where (SpecsCount > 1).
     */
    SortMulti: 67108864,
    /**
     * \/\/ Allow no sorting, disable default sorting. TableGetSortSpecs() may return specs where (SpecsCount == 0).
     */
    SortTristate: 134217728,

    // \/\/ Miscellaneous

    /**
     * \/\/ Highlight column headers when hovered (may evolve into a fuller highlight)
     */
    HighlightHoveredColumn: 268435456,
  },
  /**
   * \/\/ Flags for ImGui::TableSetupColumn()
   */
  TableColumnFlags: {
    /**
     * \/\/ Input configuration flags
     */
    None: 0,
    /**
     * \/\/ Overriding\/master disable flag: hide column, won't show in context menu (unlike calling TableSetColumnEnabled() which manipulates the user accessible state)
     */
    Disabled: 1,
    /**
     * \/\/ Default as a hidden\/disabled column.
     */
    DefaultHide: 2,
    /**
     * \/\/ Default as a sorting column.
     */
    DefaultSort: 4,
    /**
     * \/\/ Column will stretch. Preferable with horizontal scrolling disabled (default if table sizing policy is _SizingStretchSame or _SizingStretchProp).
     */
    WidthStretch: 8,
    /**
     * \/\/ Column will not stretch. Preferable with horizontal scrolling enabled (default if table sizing policy is _SizingFixedFit and table is resizable).
     */
    WidthFixed: 16,
    /**
     * \/\/ Disable manual resizing.
     */
    NoResize: 32,
    /**
     * \/\/ Disable manual reordering this column, this will also prevent other columns from crossing over this column.
     */
    NoReorder: 64,
    /**
     * \/\/ Disable ability to hide\/disable this column.
     */
    NoHide: 128,
    /**
     * \/\/ Disable clipping for this column (all NoClip columns will render in a same draw command).
     */
    NoClip: 256,
    /**
     * \/\/ Disable ability to sort on this field (even if ImGuiTableFlags_Sortable is set on the table).
     */
    NoSort: 512,
    /**
     * \/\/ Disable ability to sort in the ascending direction.
     */
    NoSortAscending: 1024,
    /**
     * \/\/ Disable ability to sort in the descending direction.
     */
    NoSortDescending: 2048,
    /**
     * \/\/ TableHeadersRow() will submit an empty label for this column. Convenient for some small columns. Name will still appear in context menu or in angled headers. You may append into this cell by calling TableSetColumnIndex() right after the TableHeadersRow() call.
     */
    NoHeaderLabel: 4096,
    /**
     * \/\/ Disable header text width contribution to automatic column width.
     */
    NoHeaderWidth: 8192,
    /**
     * \/\/ Make the initial sort direction Ascending when first sorting on this column (default).
     */
    PreferSortAscending: 16384,
    /**
     * \/\/ Make the initial sort direction Descending when first sorting on this column.
     */
    PreferSortDescending: 32768,
    /**
     * \/\/ Use current Indent value when entering cell (default for column 0).
     */
    IndentEnable: 65536,
    /**
     * \/\/ Ignore current Indent value when entering cell (default for columns > 0). Indentation changes _within_ the cell will still be honored.
     */
    IndentDisable: 131072,
    /**
     * \/\/ TableHeadersRow() will submit an angled header row for this column. Note this will add an extra row.
     */
    AngledHeader: 262144,

    // \/\/ Output status flags, read-only via TableGetColumnFlags()

    /**
     * \/\/ Status: is enabled == not hidden by user\/api (referred to as "Hide" in _DefaultHide and _NoHide) flags.
     */
    IsEnabled: 16777216,
    /**
     * \/\/ Status: is visible == is enabled AND not clipped by scrolling.
     */
    IsVisible: 33554432,
    /**
     * \/\/ Status: is currently part of the sort specs
     */
    IsSorted: 67108864,
    /**
     * \/\/ Status: is hovered by mouse
     */
    IsHovered: 134217728,
  },
  /**
   * \/\/ Flags for ImGui::TableNextRow()
   */
  TableRowFlags: {
    None: 0,
    /**
     * \/\/ Identify header row (set default background color + width of its contents accounted differently for auto column width)
     */
    Headers: 1,
  },
  /**
   * \/\/ Enum for ImGui::TableSetBgColor()
   * \/\/ Background colors are rendering in 3 layers:
   * \/\/  - Layer 0: draw with RowBg0 color if set, otherwise draw with ColumnBg0 if set.
   * \/\/  - Layer 1: draw with RowBg1 color if set, otherwise draw with ColumnBg1 if set.
   * \/\/  - Layer 2: draw with CellBg color if set.
   * \/\/ The purpose of the two row\/columns layers is to let you decide if a background color change should override or blend with the existing color.
   * \/\/ When using ImGuiTableFlags_RowBg on the table, each row has the RowBg0 color automatically set for odd\/even rows.
   * \/\/ If you set the color of RowBg0 target, your color will override the existing RowBg0 color.
   * \/\/ If you set the color of RowBg1 or ColumnBg1 target, your color will blend over the RowBg0 color.
   */
  TableBgTarget: {
    None: 0,
    /**
     * \/\/ Set row background color 0 (generally used for background, automatically set when ImGuiTableFlags_RowBg is used)
     */
    RowBg0: 1,
    /**
     * \/\/ Set row background color 1 (generally used for selection marking)
     */
    RowBg1: 2,
    /**
     * \/\/ Set cell background color (top-most color)
     */
    CellBg: 3,
  },
  /**
   * \/\/ Flags for ImGuiListClipper (currently not fully exposed in function calls: a future refactor will likely add this to ImGuiListClipper::Begin function equivalent)
   */
  ListClipperFlags: {
    None: 0,
    /**
     * \/\/ [Internal] Disabled modifying table row counters. Avoid assumption that 1 clipper item == 1 table row.
     */
    NoSetTableRowCounters: 1,
  },
  /**
   * \/\/ Flags for BeginMultiSelect()
   */
  MultiSelectFlags: {
    None: 0,
    /**
     * \/\/ Disable selecting more than one item. This is available to allow single-selection code to share same code\/logic if desired. It essentially disables the main purpose of BeginMultiSelect() tho!
     */
    SingleSelect: 1,
    /**
     * \/\/ Disable Ctrl+A shortcut to select all.
     */
    NoSelectAll: 2,
    /**
     * \/\/ Disable Shift+selection mouse\/keyboard support (useful for unordered 2D selection). With BoxSelect is also ensure contiguous SetRange requests are not combined into one. This allows not handling interpolation in SetRange requests.
     */
    NoRangeSelect: 4,
    /**
     * \/\/ Disable selecting items when navigating (useful for e.g. supporting range-select in a list of checkboxes).
     */
    NoAutoSelect: 8,
    /**
     * \/\/ Disable clearing selection when navigating or selecting another one (generally used with ImGuiMultiSelectFlags_NoAutoSelect. useful for e.g. supporting range-select in a list of checkboxes).
     */
    NoAutoClear: 16,
    /**
     * \/\/ Disable clearing selection when clicking\/selecting an already selected item.
     */
    NoAutoClearOnReselect: 32,
    /**
     * \/\/ Enable box-selection with same width and same x pos items (e.g. full row Selectable()). Box-selection works better with little bit of spacing between items hit-box in order to be able to aim at empty space.
     */
    BoxSelect1d: 64,
    /**
     * \/\/ Enable box-selection with varying width or varying x pos items support (e.g. different width labels, or 2D layout\/grid). This is slower: alters clipping logic so that e.g. horizontal movements will update selection of normally clipped items.
     */
    BoxSelect2d: 128,
    /**
     * \/\/ Disable scrolling when box-selecting and moving mouse near edges of scope.
     */
    BoxSelectNoScroll: 256,
    /**
     * \/\/ Clear selection when pressing Escape while scope is focused.
     */
    ClearOnEscape: 512,
    /**
     * \/\/ Clear selection when clicking on empty location within scope.
     */
    ClearOnClickVoid: 1024,
    /**
     * \/\/ Scope for _BoxSelect and _ClearOnClickVoid is whole window (Default). Use if BeginMultiSelect() covers a whole window or used a single time in same window.
     */
    ScopeWindow: 2048,
    /**
     * \/\/ Scope for _BoxSelect and _ClearOnClickVoid is rectangle encompassing BeginMultiSelect()\/EndMultiSelect(). Use if BeginMultiSelect() is called multiple times in same window.
     */
    ScopeRect: 4096,
    /**
     * \/\/ Apply selection on mouse down when clicking on unselected item, on mouse up when clicking on selected item. (Default)
     */
    SelectOnAuto: 8192,
    /**
     * \/\/ Apply selection on mouse down when clicking on any items. Prevents Drag and Drop from being used on multiple-selection, but allows e.g. BoxSelect to always reselect even when clicking inside an existing selection. (Excel style behavior)
     */
    SelectOnClickAlways: 16384,
    /**
     * \/\/ Apply selection on mouse release when clicking an unselected item. Allow dragging an unselected item without altering selection.
     */
    SelectOnClickRelease: 32768,

    // \/\/ImGuiMultiSelectFlags_RangeSelect2d       = 1 << 15,  \/\/ Shift+Selection uses 2d geometry instead of linear sequence, so possible to use Shift+up\/down to select vertically in grid. Analogous to what BoxSelect does.

    /**
     * \/\/ [Temporary] Enable navigation wrapping on X axis. Provided as a convenience because we don't have a design for the general Nav API for this yet. When the more general feature be public we may obsolete this flag in favor of new one.
     */
    NavWrapX: 65536,
    /**
     * \/\/ Disable default right-click processing, which selects item on mouse down, and is designed for context-menus.
     */
    NoSelectOnRightClick: 131072,
  },
  /**
   * \/\/ Selection request type
   */
  SelectionRequestType: {
    _None: 0,
    /**
     * \/\/ Request app to clear selection (if Selected==false) or select all items (if Selected==true). We cannot set RangeFirstItem\/RangeLastItem as its contents is entirely up to user (not necessarily an index)
     */
    _SetAll: 1,
    /**
     * \/\/ Request app to select\/unselect [RangeFirstItem..RangeLastItem] items (inclusive) based on value of Selected. Only EndMultiSelect() request this, app code can read after BeginMultiSelect() and it will always be false.
     */
    _SetRange: 2,
  },
  /**
   * \/\/ Flags for ImDrawList functions
   * \/\/ (Legacy: bit 0 must always correspond to ImDrawFlags_Closed to be backward compatible with old API using a bool. Bits 1..3 must be unused)
   */
  ImDrawFlags: {
    None: 0,
    /**
     * \/\/ PathStroke(), AddPolyline(): specify that shape should be closed (Important: this is always == 1 for legacy reason)
     */
    Closed: 1,
    /**
     * \/\/ AddRect(), AddRectFilled(), PathRect(): enable rounding top-left corner only (when rounding > 0.0f, we default to all corners). Was 0x01.
     */
    RoundCornersTopLeft: 16,
    /**
     * \/\/ AddRect(), AddRectFilled(), PathRect(): enable rounding top-right corner only (when rounding > 0.0f, we default to all corners). Was 0x02.
     */
    RoundCornersTopRight: 32,
    /**
     * \/\/ AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-left corner only (when rounding > 0.0f, we default to all corners). Was 0x04.
     */
    RoundCornersBottomLeft: 64,
    /**
     * \/\/ AddRect(), AddRectFilled(), PathRect(): enable rounding bottom-right corner only (when rounding > 0.0f, we default to all corners). Wax 0x08.
     */
    RoundCornersBottomRight: 128,
    /**
     * \/\/ AddRect(), AddRectFilled(), PathRect(): disable rounding on all corners (when rounding > 0.0f). This is NOT zero, NOT an implicit flag!
     */
    RoundCornersNone: 256,
    RoundCornersTop: 48,
    RoundCornersBottom: 192,
    RoundCornersLeft: 80,
    RoundCornersRight: 160,
    RoundCornersAll: 240,
  },
  /**
   * \/\/ Flags for ImDrawList instance. Those are set automatically by ImGui:: functions from ImGuiIO settings, and generally not manipulated directly.
   * \/\/ It is however possible to temporarily alter flags between calls to ImDrawList:: functions.
   */
  ImDrawListFlags: {
    None: 0,
    /**
     * \/\/ Enable anti-aliased lines\/borders (*2 the number of triangles for 1.0f wide line or lines thin enough to be drawn using textures, otherwise *3 the number of triangles)
     */
    AntiAliasedLines: 1,
    /**
     * \/\/ Enable anti-aliased lines\/borders using textures when possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering).
     */
    AntiAliasedLinesUseTex: 2,
    /**
     * \/\/ Enable anti-aliased edge around filled shapes (rounded rectangles, circles).
     */
    AntiAliasedFill: 4,
    /**
     * \/\/ Can emit 'VtxOffset > 0' to allow large meshes. Set when 'ImGuiBackendFlags_RendererHasVtxOffset' is enabled.
     */
    AllowVtxOffset: 8,
  },
  /**
   * \/\/ Most standard backends only support RGBA32 but we provide a single channel option for low-resource\/embedded systems.
   */
  ImTextureFormat: {
    /**
     * \/\/ 4 components per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight * 4
     */
    _RGBA32: 0,
    /**
     * \/\/ 1 component per pixel, each is unsigned 8-bit. Total size = TexWidth * TexHeight
     */
    _Alpha8: 1,
  },
  /**
   * \/\/ Status of a texture to communicate with Renderer Backend.
   */
  ImTextureStatus: {
    _OK: 0,
    /**
     * \/\/ Backend destroyed the texture.
     */
    _Destroyed: 1,
    /**
     * \/\/ Requesting backend to create the texture. Set status OK when done.
     */
    _WantCreate: 2,
    /**
     * \/\/ Requesting backend to update specific blocks of pixels (write to texture portions which have never been used before). Set status OK when done.
     */
    _WantUpdates: 3,
    /**
     * \/\/ Requesting backend to destroy the texture. Set status to Destroyed when done.
     */
    _WantDestroy: 4,
  },
  /**
   * \/\/ Flags for ImFontAtlas build
   */
  ImFontAtlasFlags: {
    None: 0,
    /**
     * \/\/ Don't round the height to next power of two
     */
    NoPowerOfTwoHeight: 1,
    /**
     * \/\/ Don't build software mouse cursors into the atlas (save a little texture memory)
     */
    NoMouseCursors: 2,
    /**
     * \/\/ Don't build thick line textures into the atlas (save a little texture memory, allow support for point\/nearest filtering). The AntiAliasedLinesUseTex features uses them, otherwise they will be rendered using polygons (more expensive for CPU\/GPU).
     */
    NoBakedLines: 4,
  },
  /**
   * \/\/ Font flags
   * \/\/ (in future versions as we redesign font loading API, this will become more important and better documented. for now please consider this as internal\/advanced use)
   */
  ImFontFlags: {
    None: 0,
    /**
     * \/\/ Disable throwing an error\/assert when calling AddFontXXX() with missing file\/data. Calling code is expected to check AddFontXXX() return value.
     */
    NoLoadError: 2,
    /**
     * \/\/ [Internal] Disable loading new glyphs.
     */
    NoLoadGlyphs: 4,
    /**
     * \/\/ [Internal] Disable loading new baked sizes, disable garbage collecting current ones. e.g. if you want to lock a font to a single size. Important: if you use this to preload given sizes, consider the possibility of multiple font density used on Retina display.
     */
    LockBakedSizes: 8,
  },
  /**
   * \/\/ Flags stored in ImGuiViewport::Flags, giving indications to the platform backends.
   */
  ViewportFlags: {
    None: 0,
    /**
     * \/\/ Represent a Platform Window
     */
    IsPlatformWindow: 1,
    /**
     * \/\/ Represent a Platform Monitor (unused yet)
     */
    IsPlatformMonitor: 2,
    /**
     * \/\/ Platform Window: Is created\/managed by the user application? (rather than our backend)
     */
    OwnedByApp: 4,
    /**
     * \/\/ Platform Window: Disable platform decorations: title bar, borders, etc. (generally set all windows, but if ImGuiConfigFlags_ViewportsDecoration is set we only set this on popups\/tooltips)
     */
    NoDecoration: 8,
    /**
     * \/\/ Platform Window: Disable platform task bar icon (generally set on popups\/tooltips, or all windows if ImGuiConfigFlags_ViewportsNoTaskBarIcon is set)
     */
    NoTaskBarIcon: 16,
    /**
     * \/\/ Platform Window: Don't take focus when created.
     */
    NoFocusOnAppearing: 32,
    /**
     * \/\/ Platform Window: Don't take focus when clicked on.
     */
    NoFocusOnClick: 64,
    /**
     * \/\/ Platform Window: Make mouse pass through so we can drag this window while peaking behind it.
     */
    NoInputs: 128,
    /**
     * \/\/ Platform Window: Renderer doesn't need to clear the framebuffer ahead (because we will fill it entirely).
     */
    NoRendererClear: 256,
    /**
     * \/\/ Platform Window: Avoid merging this window into another host window. This can only be set via ImGuiWindowClass viewport flags override (because we need to now ahead if we are going to create a viewport in the first place!).
     */
    NoAutoMerge: 512,
    /**
     * \/\/ Platform Window: Display on top (for tooltips only).
     */
    TopMost: 1024,
    /**
     * \/\/ Viewport can host multiple imgui windows (secondary viewports are associated to a single window). \/\/ FIXME: In practice there's still probably code making the assumption that this is always and only on the MainViewport. Will fix once we add support for "no main viewport".
     */
    CanHostOtherWindows: 2048,

    // \/\/ Output status flags (from Platform)

    /**
     * \/\/ Platform Window: Window is minimized, can skip render. When minimized we tend to avoid using the viewport pos\/size for clipping window or testing if they are contained in the viewport.
     */
    IsMinimized: 4096,
    /**
     * \/\/ Platform Window: Window is focused (last call to Platform_GetWindowFocus() returned true)
     */
    IsFocused: 8192,
  },
  FreeTypeLoaderFlags: {
    NoHinting: 1,
    NoAutoHint: 2,
    ForceAutoHint: 4,
    LightHinting: 8,
    MonoHinting: 16,
    Bold: 32,
    Oblique: 64,
    Monochrome: 128,
    LoadColor: 256,
    Bitmap: 512,
  },
  /**
   * \/\/ Context creation and access
   * \/\/ - Each context create its own ImFontAtlas by default. You may instance one yourself and pass it to CreateContext() to share a font atlas between contexts.
   * \/\/ - DLL users: heaps and globals are not shared across DLL boundaries! You will need to call SetCurrentContext() + SetAllocatorFunctions()
   * \/\/   for each static\/DLL boundary you are calling from. Read "Context and Memory Allocators" section of imgui.cpp for details.
   */
  CreateContext(shared_font_atlas: ImFontAtlas | null = null): ImGuiContext {
    return ImGuiContext.From(Mod.export.ImGui_CreateContext(shared_font_atlas?.ptr ?? null));
  },
  /**
   * \/\/ NULL = destroy current context
   */
  DestroyContext(ctx: ImGuiContext | null = null): void {
    Mod.export.ImGui_DestroyContext(ctx?.ptr ?? null);
  },
  GetCurrentContext(): ImGuiContext {
    return ImGuiContext.From(Mod.export.ImGui_GetCurrentContext());
  },
  SetCurrentContext(ctx: ImGuiContext): void {
    Mod.export.ImGui_SetCurrentContext(ctx?.ptr ?? null);
  },

  // \/\/ Main

  /**
   * \/\/ access the ImGuiIO structure (mouse\/keyboard\/gamepad inputs, time, various configuration options\/flags)
   */
  GetIO(): ImGuiIO {
    return ImGuiIO.From(Mod.export.ImGui_GetIO());
  },
  /**
   * \/\/ access the ImGuiPlatformIO structure (mostly hooks\/functions to connect to platform\/renderer and OS Clipboard, IME etc.)
   */
  GetPlatformIO(): ImGuiPlatformIO {
    return ImGuiPlatformIO.From(Mod.export.ImGui_GetPlatformIO());
  },
  /**
   * \/\/ access the Style structure (colors, sizes). Always use PushStyleColor(), PushStyleVar() to modify style mid-frame!
   */
  GetStyle(): ImGuiStyle {
    return ImGuiStyle.From(Mod.export.ImGui_GetStyle());
  },
  /**
   * \/\/ start a new Dear ImGui frame, you can submit any command from this point until Render()\/EndFrame().
   */
  NewFrame(): void {
    Mod.export.ImGui_NewFrame();
  },
  /**
   * \/\/ ends the Dear ImGui frame. automatically called by Render(). If you don't need to render data (skipping rendering) you may call EndFrame() without Render()... but you'll have wasted CPU already! If you don't need to render, better to not create any windows and not call NewFrame() at all!
   */
  EndFrame(): void {
    Mod.export.ImGui_EndFrame();
  },
  /**
   * \/\/ ends the Dear ImGui frame, finalize the draw data. You can then get call GetDrawData().
   */
  Render(): void {
    Mod.export.ImGui_Render();
  },
  /**
   * \/\/ valid after Render() and until the next call to NewFrame(). Call ImGui_ImplXXXX_RenderDrawData() function in your Renderer Backend to render.
   */
  GetDrawData(): ImDrawData {
    return ImDrawData.From(Mod.export.ImGui_GetDrawData());
  },

  // \/\/ Demo, Debug, Information

  /**
   * \/\/ create Demo window. demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application!
   */
  ShowDemoWindow(p_open: [boolean] | null = null): void {
    Mod.export.ImGui_ShowDemoWindow(p_open);
  },
  /**
   * \/\/ create Metrics\/Debugger window. display Dear ImGui internals: windows, draw commands, various internal state, etc.
   */
  ShowMetricsWindow(p_open: [boolean] | null = null): void {
    Mod.export.ImGui_ShowMetricsWindow(p_open);
  },
  /**
   * \/\/ create Debug Log window. display a simplified log of important dear imgui events.
   */
  ShowDebugLogWindow(p_open: [boolean] | null = null): void {
    Mod.export.ImGui_ShowDebugLogWindow(p_open);
  },
  /**
   * \/\/ create Stack Tool window. hover items with mouse to query information about the source of their unique ID.
   */
  ShowIDStackToolWindow(p_open: [boolean] | null = null): void {
    Mod.export.ImGui_ShowIDStackToolWindow(p_open);
  },
  /**
   * \/\/ create About window. display Dear ImGui version, credits and build\/system information.
   */
  ShowAboutWindow(p_open: [boolean] | null = null): void {
    Mod.export.ImGui_ShowAboutWindow(p_open);
  },
  /**
   * \/\/ add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style)
   */
  ShowStyleEditor(ref: ImGuiStyle | null = null): void {
    Mod.export.ImGui_ShowStyleEditor(ref?.ptr ?? null);
  },
  /**
   * \/\/ add style selector block (not a window), essentially a combo listing the default styles.
   */
  ShowStyleSelector(label: string): boolean {
    return Mod.export.ImGui_ShowStyleSelector(label);
  },
  /**
   * \/\/ add font selector block (not a window), essentially a combo listing the loaded fonts.
   */
  ShowFontSelector(label: string): void {
    Mod.export.ImGui_ShowFontSelector(label);
  },
  /**
   * \/\/ add basic help\/info block (not a window): how to manipulate ImGui as an end-user (mouse\/keyboard controls).
   */
  ShowUserGuide(): void {
    Mod.export.ImGui_ShowUserGuide();
  },
  /**
   * \/\/ get the compiled version string e.g. "1.80 WIP" (essentially the value for IMGUI_VERSION from the compiled version of imgui.cpp)
   */
  GetVersion(): string {
    return Mod.export.ImGui_GetVersion();
  },

  // \/\/ Styles

  /**
   * \/\/ new, recommended style (default)
   */
  StyleColorsDark(dst: ImGuiStyle | null = null): void {
    Mod.export.ImGui_StyleColorsDark(dst?.ptr ?? null);
  },
  /**
   * \/\/ best used with borders and a custom, thicker font
   */
  StyleColorsLight(dst: ImGuiStyle | null = null): void {
    Mod.export.ImGui_StyleColorsLight(dst?.ptr ?? null);
  },
  /**
   * \/\/ classic imgui style
   */
  StyleColorsClassic(dst: ImGuiStyle | null = null): void {
    Mod.export.ImGui_StyleColorsClassic(dst?.ptr ?? null);
  },
  /**
   * \/\/ Windows
   * \/\/ - Begin() = push window to the stack and start appending to it. End() = pop window from the stack.
   * \/\/ - Passing 'bool* p_open != NULL' shows a window-closing widget in the upper-right corner of the window,
   * \/\/   which clicking will set the boolean to false when clicked.
   * \/\/ - You may append multiple times to the same window during the same frame by calling Begin()\/End() pairs multiple times.
   * \/\/   Some information such as 'flags' or 'p_open' will only be considered by the first call to Begin().
   * \/\/ - Begin() return false to indicate the window is collapsed or fully clipped, so you may early out and omit submitting
   * \/\/   anything to the window. Always call a matching End() for each Begin() call, regardless of its return value!
   * \/\/   [Important: due to legacy reason, Begin\/End and BeginChild\/EndChild are inconsistent with all other functions
   * \/\/    such as BeginMenu\/EndMenu, BeginPopup\/EndPopup, etc. where the EndXXX call should only be called if the corresponding
   * \/\/    BeginXXX function returned true. Begin and BeginChild are the only odd ones out. Will be fixed in a future update.]
   * \/\/ - Note that the bottom of window stack always contains a window called "Debug".
   */
  Begin(name: string, p_open: [boolean] | null = null, flags: ImGuiWindowFlags = 0): boolean {
    return Mod.export.ImGui_Begin(name, p_open, flags);
  },
  End(): void {
    Mod.export.ImGui_End();
  },
  /**
   * \/\/ Child Windows
   * \/\/ - Use child windows to begin into a self-contained independent scrolling\/clipping regions within a host window. Child windows can embed their own child.
   * \/\/ - Before 1.90 (November 2023), the "ImGuiChildFlags child_flags = 0" parameter was "bool border = false".
   * \/\/   This API is backward compatible with old code, as we guarantee that ImGuiChildFlags_Borders == true.
   * \/\/   Consider updating your old code:
   * \/\/      BeginChild("Name", size, false)   -> Begin("Name", size, 0); or Begin("Name", size, ImGuiChildFlags_None);
   * \/\/      BeginChild("Name", size, true)    -> Begin("Name", size, ImGuiChildFlags_Borders);
   * \/\/ - Manual sizing (each axis can use a different setting e.g. ImVec2(0.0f, 400.0f)):
   * \/\/     == 0.0f: use remaining parent window size for this axis.
   * \/\/      > 0.0f: use specified size for this axis.
   * \/\/      < 0.0f: right\/bottom-align to specified distance from available content boundaries.
   * \/\/ - Specifying ImGuiChildFlags_AutoResizeX or ImGuiChildFlags_AutoResizeY makes the sizing automatic based on child contents.
   * \/\/   Combining both ImGuiChildFlags_AutoResizeX _and_ ImGuiChildFlags_AutoResizeY defeats purpose of a scrolling region and is NOT recommended.
   * \/\/ - BeginChild() returns false to indicate the window is collapsed or fully clipped, so you may early out and omit submitting
   * \/\/   anything to the window. Always call a matching EndChild() for each BeginChild() call, regardless of its return value.
   * \/\/   [Important: due to legacy reason, Begin\/End and BeginChild\/EndChild are inconsistent with all other functions
   * \/\/    such as BeginMenu\/EndMenu, BeginPopup\/EndPopup, etc. where the EndXXX call should only be called if the corresponding
   * \/\/    BeginXXX function returned true. Begin and BeginChild are the only odd ones out. Will be fixed in a future update.]
   */
  BeginChild(
    str_id: string,
    size: ImVec2 = new ImVec2(0, 0),
    child_flags: ImGuiChildFlags = 0,
    window_flags: ImGuiWindowFlags = 0,
  ): boolean {
    return Mod.export.ImGui_BeginChild(str_id, size, child_flags, window_flags);
  },
  BeginChildID(
    id: ImGuiID,
    size: ImVec2 = new ImVec2(0, 0),
    child_flags: ImGuiChildFlags = 0,
    window_flags: ImGuiWindowFlags = 0,
  ): boolean {
    return Mod.export.ImGui_BeginChildID(id, size, child_flags, window_flags);
  },
  EndChild(): void {
    Mod.export.ImGui_EndChild();
  },
  /**
   * \/\/ Windows Utilities
   * \/\/ - 'current window' = the window we are appending into while inside a Begin()\/End() block. 'next window' = next window we will Begin() into.
   */
  IsWindowAppearing(): boolean {
    return Mod.export.ImGui_IsWindowAppearing();
  },
  IsWindowCollapsed(): boolean {
    return Mod.export.ImGui_IsWindowCollapsed();
  },
  /**
   * \/\/ is current window focused? or its root\/child, depending on flags. see flags for options.
   */
  IsWindowFocused(flags: ImGuiFocusedFlags = 0): boolean {
    return Mod.export.ImGui_IsWindowFocused(flags);
  },
  /**
   * \/\/ is current window hovered and hoverable (e.g. not blocked by a popup\/modal)? See ImGuiHoveredFlags_ for options. IMPORTANT: If you are trying to check whether your mouse should be dispatched to Dear ImGui or to your underlying app, you should not use this function! Use the 'io.WantCaptureMouse' boolean for that! Refer to FAQ entry "How can I tell whether to dispatch mouse\/keyboard to Dear ImGui or my application?" for details.
   */
  IsWindowHovered(flags: ImGuiHoveredFlags = 0): boolean {
    return Mod.export.ImGui_IsWindowHovered(flags);
  },
  /**
   * \/\/ get draw list associated to the current window, to append your own drawing primitives
   */
  GetWindowDrawList(): ImDrawList {
    return ImDrawList.From(Mod.export.ImGui_GetWindowDrawList());
  },
  /**
   * \/\/ get DPI scale currently associated to the current window's viewport.
   */
  GetWindowDpiScale(): number {
    return Mod.export.ImGui_GetWindowDpiScale();
  },
  /**
   * \/\/ get current window position in screen space (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead)
   */
  GetWindowPos(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetWindowPos());
  },
  /**
   * \/\/ get current window size (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead)
   */
  GetWindowSize(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetWindowSize());
  },
  /**
   * \/\/ get current window width (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().x.
   */
  GetWindowWidth(): number {
    return Mod.export.ImGui_GetWindowWidth();
  },
  /**
   * \/\/ get current window height (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().y.
   */
  GetWindowHeight(): number {
    return Mod.export.ImGui_GetWindowHeight();
  },
  /**
   * \/\/ get viewport currently associated to the current window.
   */
  GetWindowViewport(): ImGuiViewport {
    return ImGuiViewport.From(Mod.export.ImGui_GetWindowViewport());
  },

  // \/\/ Window manipulation
  // \/\/ - Prefer using SetNextXXX functions (before Begin) rather that SetXXX functions (after Begin).

  /**
   * \/\/ set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc.
   */
  SetNextWindowPos(pos: ImVec2, cond: ImGuiCond = 0, pivot: ImVec2 = new ImVec2(0, 0)): void {
    Mod.export.ImGui_SetNextWindowPos(pos, cond, pivot);
  },
  /**
   * \/\/ set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin()
   */
  SetNextWindowSize(size: ImVec2, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetNextWindowSize(size, cond);
  },
  SetNextWindowSizeConstraints(min: ImVec2, max: ImVec2): void {
    Mod.export.ImGui_SetNextWindowSizeConstraints(min, max);
  },
  /**
   * \/\/ set next window content size (~ scrollable client area, which enforce the range of scrollbars). Not including window decorations (title bar, menu bar, etc.) nor WindowPadding. set an axis to 0.0f to leave it automatic. call before Begin()
   */
  SetNextWindowContentSize(size: ImVec2): void {
    Mod.export.ImGui_SetNextWindowContentSize(size);
  },
  /**
   * \/\/ set next window collapsed state. call before Begin()
   */
  SetNextWindowCollapsed(collapsed: boolean, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetNextWindowCollapsed(collapsed, cond);
  },
  /**
   * \/\/ set next window to be focused \/ top-most. call before Begin()
   */
  SetNextWindowFocus(): void {
    Mod.export.ImGui_SetNextWindowFocus();
  },
  /**
   * \/\/ set next window scrolling value (use < 0.0f to not affect a given axis).
   */
  SetNextWindowScroll(scroll: ImVec2): void {
    Mod.export.ImGui_SetNextWindowScroll(scroll);
  },
  /**
   * \/\/ set next window background color alpha. helper to easily override the Alpha component of ImGuiCol_WindowBg\/ChildBg\/PopupBg. you may also use ImGuiWindowFlags_NoBackground.
   */
  SetNextWindowBgAlpha(alpha: number): void {
    Mod.export.ImGui_SetNextWindowBgAlpha(alpha);
  },
  /**
   * \/\/ set next window viewport
   */
  SetNextWindowViewport(viewport_id: ImGuiID): void {
    Mod.export.ImGui_SetNextWindowViewport(viewport_id);
  },
  /**
   * \/\/ (not recommended) set current window position - call within Begin()\/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects.
   */
  SetWindowPos(pos: ImVec2, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowPos(pos, cond);
  },
  /**
   * \/\/ (not recommended) set current window size - call within Begin()\/End(). set to ImVec2(0, 0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects.
   */
  SetWindowSize(size: ImVec2, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowSize(size, cond);
  },
  /**
   * \/\/ (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed().
   */
  SetWindowCollapsed(collapsed: boolean, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowCollapsed(collapsed, cond);
  },
  /**
   * \/\/ (not recommended) set current window to be focused \/ top-most. prefer using SetNextWindowFocus().
   */
  SetWindowFocus(): void {
    Mod.export.ImGui_SetWindowFocus();
  },
  /**
   * \/\/ set named window position.
   */
  SetWindowPosStr(name: string, pos: ImVec2, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowPosStr(name, pos, cond);
  },
  /**
   * \/\/ set named window size. set axis to 0.0f to force an auto-fit on this axis.
   */
  SetWindowSizeStr(name: string, size: ImVec2, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowSizeStr(name, size, cond);
  },
  /**
   * \/\/ set named window collapsed state
   */
  SetWindowCollapsedStr(name: string, collapsed: boolean, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetWindowCollapsedStr(name, collapsed, cond);
  },
  /**
   * \/\/ set named window to be focused \/ top-most. use NULL to remove focus.
   */
  SetWindowFocusStr(name: string): void {
    Mod.export.ImGui_SetWindowFocusStr(name);
  },

  // \/\/ Windows Scrolling
  // \/\/ - Any change of Scroll will be applied at the beginning of next frame in the first call to Begin().
  // \/\/ - You may instead use SetNextWindowScroll() prior to calling Begin() to avoid this delay, as an alternative to using SetScrollX()\/SetScrollY().

  /**
   * \/\/ get scrolling amount [0 .. GetScrollMaxX()]
   */
  GetScrollX(): number {
    return Mod.export.ImGui_GetScrollX();
  },
  /**
   * \/\/ get scrolling amount [0 .. GetScrollMaxY()]
   */
  GetScrollY(): number {
    return Mod.export.ImGui_GetScrollY();
  },
  /**
   * \/\/ set scrolling amount [0 .. GetScrollMaxX()]
   */
  SetScrollX(scroll_x: number): void {
    Mod.export.ImGui_SetScrollX(scroll_x);
  },
  /**
   * \/\/ set scrolling amount [0 .. GetScrollMaxY()]
   */
  SetScrollY(scroll_y: number): void {
    Mod.export.ImGui_SetScrollY(scroll_y);
  },
  /**
   * \/\/ get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x
   */
  GetScrollMaxX(): number {
    return Mod.export.ImGui_GetScrollMaxX();
  },
  /**
   * \/\/ get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y
   */
  GetScrollMaxY(): number {
    return Mod.export.ImGui_GetScrollMaxY();
  },
  /**
   * \/\/ adjust scrolling amount to make current cursor position visible. center_x_ratio=0.0: left, 0.5: center, 1.0: right. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead.
   */
  SetScrollHereX(center_x_ratio: number = 0.5): void {
    Mod.export.ImGui_SetScrollHereX(center_x_ratio);
  },
  /**
   * \/\/ adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead.
   */
  SetScrollHereY(center_y_ratio: number = 0.5): void {
    Mod.export.ImGui_SetScrollHereY(center_y_ratio);
  },
  /**
   * \/\/ adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
   */
  SetScrollFromPosX(local_x: number, center_x_ratio: number = 0.5): void {
    Mod.export.ImGui_SetScrollFromPosX(local_x, center_x_ratio);
  },
  /**
   * \/\/ adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
   */
  SetScrollFromPosY(local_y: number, center_y_ratio: number = 0.5): void {
    Mod.export.ImGui_SetScrollFromPosY(local_y, center_y_ratio);
  },

  // \/\/ Parameters stacks (font)
  // \/\/  - PushFont(font, 0.0f)                       \/\/ Change font and keep current size
  // \/\/  - PushFont(NULL, 20.0f)                      \/\/ Keep font and change current size
  // \/\/  - PushFont(font, 20.0f)                      \/\/ Change font and set size to 20.0f
  // \/\/  - PushFont(font, style.FontSizeBase * 2.0f)  \/\/ Change font and set size to be twice bigger than current size.
  // \/\/  - PushFont(font, font->LegacySize)           \/\/ Change font and set size to size passed to AddFontXXX() function. Same as pre-1.92 behavior.
  // \/\/ *IMPORTANT* before 1.92, fonts had a single size. They can now be dynamically be adjusted.
  // \/\/  - In 1.92 we have REMOVED the single parameter version of PushFont() because it seems like the easiest way to provide an error-proof transition.
  // \/\/  - PushFont(font) before 1.92 = PushFont(font, font->LegacySize) after 1.92          \/\/ Use default font size as passed to AddFontXXX() function.
  // \/\/ *IMPORTANT* global scale factors are applied over the provided size.
  // \/\/  - Global scale factors are: 'style.FontScaleMain', 'style.FontScaleDpi' and maybe more.
  // \/\/ -  If you want to apply a factor to the _current_ font size:
  // \/\/  - CORRECT:   PushFont(NULL, style.FontSizeBase)         \/\/ use current unscaled size    == does nothing
  // \/\/  - CORRECT:   PushFont(NULL, style.FontSizeBase * 2.0f)  \/\/ use current unscaled size x2 == make text twice bigger
  // \/\/  - INCORRECT: PushFont(NULL, GetFontSize())              \/\/ INCORRECT! using size after global factors already applied == GLOBAL SCALING FACTORS WILL APPLY TWICE!
  // \/\/  - INCORRECT: PushFont(NULL, GetFontSize() * 2.0f)       \/\/ INCORRECT! using size after global factors already applied == GLOBAL SCALING FACTORS WILL APPLY TWICE!

  /**
   * \/\/ Use NULL as a shortcut to keep current font. Use 0.0f to keep current size.
   */
  PushFontFloat(font: ImFont, font_size_base_unscaled: number): void {
    Mod.export.ImGui_PushFontFloat(font?.ptr ?? null, font_size_base_unscaled);
  },
  PopFont(): void {
    Mod.export.ImGui_PopFont();
  },
  /**
   * \/\/ get current font
   */
  GetFont(): ImFont {
    return ImFont.From(Mod.export.ImGui_GetFont());
  },
  /**
   * \/\/ get current scaled font size (= height in pixels). AFTER global scale factors applied. *IMPORTANT* DO NOT PASS THIS VALUE TO PushFont()! Use ImGui::GetStyle().FontSizeBase to get value before global scale factors.
   */
  GetFontSize(): number {
    return Mod.export.ImGui_GetFontSize();
  },
  /**
   * \/\/ get current font bound at current size \/\/ == GetFont()->GetFontBaked(GetFontSize())
   */
  GetFontBaked(): ImFontBaked {
    return ImFontBaked.From(Mod.export.ImGui_GetFontBaked());
  },

  // \/\/ Parameters stacks (shared)

  /**
   * \/\/ modify a style color. always use this if you modify the style after NewFrame().
   */
  PushStyleColor(idx: ImGuiCol, col: ImU32): void {
    Mod.export.ImGui_PushStyleColor(idx, col);
  },
  PushStyleColorImVec4(idx: ImGuiCol, col: ImVec4): void {
    Mod.export.ImGui_PushStyleColorImVec4(idx, col);
  },
  PopStyleColor(count: number = 1): void {
    Mod.export.ImGui_PopStyleColor(count);
  },
  /**
   * \/\/ modify a style float variable. always use this if you modify the style after NewFrame()!
   */
  PushStyleVar(idx: ImGuiStyleVar, val: number): void {
    Mod.export.ImGui_PushStyleVar(idx, val);
  },
  /**
   * \/\/ modify a style ImVec2 variable. "
   */
  PushStyleVarImVec2(idx: ImGuiStyleVar, val: ImVec2): void {
    Mod.export.ImGui_PushStyleVarImVec2(idx, val);
  },
  /**
   * \/\/ modify X component of a style ImVec2 variable. "
   */
  PushStyleVarX(idx: ImGuiStyleVar, val_x: number): void {
    Mod.export.ImGui_PushStyleVarX(idx, val_x);
  },
  /**
   * \/\/ modify Y component of a style ImVec2 variable. "
   */
  PushStyleVarY(idx: ImGuiStyleVar, val_y: number): void {
    Mod.export.ImGui_PushStyleVarY(idx, val_y);
  },
  PopStyleVar(count: number = 1): void {
    Mod.export.ImGui_PopStyleVar(count);
  },
  /**
   * \/\/ modify specified shared item flag, e.g. PushItemFlag(ImGuiItemFlags_NoTabStop, true)
   */
  PushItemFlag(option: ImGuiItemFlags, enabled: boolean): void {
    Mod.export.ImGui_PushItemFlag(option, enabled);
  },
  PopItemFlag(): void {
    Mod.export.ImGui_PopItemFlag();
  },

  // \/\/ Parameters stacks (current window)

  /**
   * \/\/ push width of items for common large "item+label" widgets. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side).
   */
  PushItemWidth(item_width: number): void {
    Mod.export.ImGui_PushItemWidth(item_width);
  },
  PopItemWidth(): void {
    Mod.export.ImGui_PopItemWidth();
  },
  /**
   * \/\/ set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side)
   */
  SetNextItemWidth(item_width: number): void {
    Mod.export.ImGui_SetNextItemWidth(item_width);
  },
  /**
   * \/\/ width of item given pushed settings and current cursor position. NOT necessarily the width of last item unlike most 'Item' functions.
   */
  CalcItemWidth(): number {
    return Mod.export.ImGui_CalcItemWidth();
  },
  /**
   * \/\/ push word-wrapping position for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space
   */
  PushTextWrapPos(wrap_local_pos_x: number = 0.0): void {
    Mod.export.ImGui_PushTextWrapPos(wrap_local_pos_x);
  },
  PopTextWrapPos(): void {
    Mod.export.ImGui_PopTextWrapPos();
  },

  // \/\/ Style read access
  // \/\/ - Use the ShowStyleEditor() function to interactively see\/edit the colors.

  /**
   * \/\/ get UV coordinate for a white pixel, useful to draw custom shapes via the ImDrawList API
   */
  GetFontTexUvWhitePixel(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetFontTexUvWhitePixel());
  },
  /**
   * \/\/ retrieve given style color with style alpha applied and optional extra alpha multiplier, packed as a 32-bit value suitable for ImDrawList
   */
  GetColorU32(idx: ImGuiCol, alpha_mul: number = 1.0): ImU32 {
    return Mod.export.ImGui_GetColorU32(idx, alpha_mul);
  },
  /**
   * \/\/ retrieve given color with style alpha applied, packed as a 32-bit value suitable for ImDrawList
   */
  GetColorU32ImVec4(col: ImVec4): ImU32 {
    return Mod.export.ImGui_GetColorU32ImVec4(col);
  },
  /**
   * \/\/ retrieve given color with style alpha applied, packed as a 32-bit value suitable for ImDrawList
   */
  GetColorU32ImU32(col: ImU32, alpha_mul: number = 1.0): ImU32 {
    return Mod.export.ImGui_GetColorU32ImU32(col, alpha_mul);
  },
  /**
   * \/\/ retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwise use GetColorU32() to get style color with style alpha baked in.
   */
  GetStyleColorVec4(idx: ImGuiCol): ImVec4 {
    return ImVec4.From(Mod.export.ImGui_GetStyleColorVec4(idx));
  },

  // \/\/ Layout cursor positioning
  // \/\/ - By "cursor" we mean the current output position.
  // \/\/ - The typical widget behavior is to output themselves at the current cursor position, then move the cursor one line down.
  // \/\/ - You can call SameLine() between widgets to undo the last carriage return and output at the right of the preceding widget.
  // \/\/ - YOU CAN DO 99% OF WHAT YOU NEED WITH ONLY GetCursorScreenPos() and GetContentRegionAvail().
  // \/\/ - Attention! We currently have inconsistencies between window-local and absolute positions we will aim to fix with future API:
  // \/\/    - Absolute coordinate:        GetCursorScreenPos(), SetCursorScreenPos(), all ImDrawList:: functions. -> this is the preferred way forward.
  // \/\/    - Window-local coordinates:   SameLine(offset), GetCursorPos(), SetCursorPos(), GetCursorStartPos(), PushTextWrapPos()
  // \/\/    - Window-local coordinates:   GetContentRegionMax(), GetWindowContentRegionMin(), GetWindowContentRegionMax() --> all obsoleted. YOU DON'T NEED THEM.
  // \/\/ - GetCursorScreenPos() = GetCursorPos() + GetWindowPos(). GetWindowPos() is almost only ever useful to convert from window-local to absolute coordinates. Try not to use it.

  /**
   * \/\/ cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND (prefer using this rather than GetCursorPos(), also more useful to work with ImDrawList API).
   */
  GetCursorScreenPos(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetCursorScreenPos());
  },
  /**
   * \/\/ cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND.
   */
  SetCursorScreenPos(pos: ImVec2): void {
    Mod.export.ImGui_SetCursorScreenPos(pos);
  },
  /**
   * \/\/ available space from current position. THIS IS YOUR BEST FRIEND.
   */
  GetContentRegionAvail(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetContentRegionAvail());
  },
  /**
   * \/\/ [window-local] cursor position in window-local coordinates. This is not your best friend.
   */
  GetCursorPos(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetCursorPos());
  },
  /**
   * \/\/ [window-local] "
   */
  GetCursorPosX(): number {
    return Mod.export.ImGui_GetCursorPosX();
  },
  /**
   * \/\/ [window-local] "
   */
  GetCursorPosY(): number {
    return Mod.export.ImGui_GetCursorPosY();
  },
  /**
   * \/\/ [window-local] "
   */
  SetCursorPos(local_pos: ImVec2): void {
    Mod.export.ImGui_SetCursorPos(local_pos);
  },
  /**
   * \/\/ [window-local] "
   */
  SetCursorPosX(local_x: number): void {
    Mod.export.ImGui_SetCursorPosX(local_x);
  },
  /**
   * \/\/ [window-local] "
   */
  SetCursorPosY(local_y: number): void {
    Mod.export.ImGui_SetCursorPosY(local_y);
  },
  /**
   * \/\/ [window-local] initial cursor position, in window-local coordinates. Call GetCursorScreenPos() after Begin() to get the absolute coordinates version.
   */
  GetCursorStartPos(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetCursorStartPos());
  },

  // \/\/ Other layout functions

  /**
   * \/\/ separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator.
   */
  Separator(): void {
    Mod.export.ImGui_Separator();
  },
  /**
   * \/\/ call between widgets or groups to layout them horizontally. X position given in window coordinates.
   */
  SameLine(offset_from_start_x: number = 0.0, spacing: number = -1.0): void {
    Mod.export.ImGui_SameLine(offset_from_start_x, spacing);
  },
  /**
   * \/\/ undo a SameLine() or force a new line when in a horizontal-layout context.
   */
  NewLine(): void {
    Mod.export.ImGui_NewLine();
  },
  /**
   * \/\/ add vertical spacing.
   */
  Spacing(): void {
    Mod.export.ImGui_Spacing();
  },
  /**
   * \/\/ add a dummy item of given size. unlike InvisibleButton(), Dummy() won't take the mouse click or be navigable into.
   */
  Dummy(size: ImVec2): void {
    Mod.export.ImGui_Dummy(size);
  },
  /**
   * \/\/ move content position toward the right, by indent_w, or style.IndentSpacing if indent_w <= 0
   */
  Indent(indent_w: number = 0.0): void {
    Mod.export.ImGui_Indent(indent_w);
  },
  /**
   * \/\/ move content position back to the left, by indent_w, or style.IndentSpacing if indent_w <= 0
   */
  Unindent(indent_w: number = 0.0): void {
    Mod.export.ImGui_Unindent(indent_w);
  },
  /**
   * \/\/ lock horizontal starting position
   */
  BeginGroup(): void {
    Mod.export.ImGui_BeginGroup();
  },
  /**
   * \/\/ unlock horizontal starting position + capture the whole group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.)
   */
  EndGroup(): void {
    Mod.export.ImGui_EndGroup();
  },
  /**
   * \/\/ vertically align upcoming text baseline to FramePadding.y so that it will align properly to regularly framed items (call if you have text on a line before a framed item)
   */
  AlignTextToFramePadding(): void {
    Mod.export.ImGui_AlignTextToFramePadding();
  },
  /**
   * \/\/ ~ FontSize
   */
  GetTextLineHeight(): number {
    return Mod.export.ImGui_GetTextLineHeight();
  },
  /**
   * \/\/ ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text)
   */
  GetTextLineHeightWithSpacing(): number {
    return Mod.export.ImGui_GetTextLineHeightWithSpacing();
  },
  /**
   * \/\/ ~ FontSize + style.FramePadding.y * 2
   */
  GetFrameHeight(): number {
    return Mod.export.ImGui_GetFrameHeight();
  },
  /**
   * \/\/ ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets)
   */
  GetFrameHeightWithSpacing(): number {
    return Mod.export.ImGui_GetFrameHeightWithSpacing();
  },

  // \/\/ ID stack\/scopes
  // \/\/ Read the FAQ (docs\/FAQ.md or http:\/\/dearimgui.com\/faq) for more details about how ID are handled in dear imgui.
  // \/\/ - Those questions are answered and impacted by understanding of the ID stack system:
  // \/\/   - "Q: Why is my widget not reacting when I click on it?"
  // \/\/   - "Q: How can I have widgets with an empty label?"
  // \/\/   - "Q: How can I have multiple widgets with the same label?"
  // \/\/ - Short version: ID are hashes of the entire ID stack. If you are creating widgets in a loop you most likely
  // \/\/   want to push a unique identifier (e.g. object pointer, loop index) to uniquely differentiate them.
  // \/\/ - You can also use the "Label##foobar" syntax within widget label to distinguish them from each others.
  // \/\/ - In this header file we use the "label"\/"name" terminology to denote a string that will be displayed + used as an ID,
  // \/\/   whereas "str_id" denote a string that is only used as an ID and not normally displayed.

  /**
   * \/\/ push string into the ID stack (will hash string).
   */
  PushID(str_id: string): void {
    Mod.export.ImGui_PushID(str_id);
  },
  /**
   * \/\/ push integer into the ID stack (will hash integer).
   */
  PushIDInt(int_id: number): void {
    Mod.export.ImGui_PushIDInt(int_id);
  },
  /**
   * \/\/ pop from the ID stack.
   */
  PopID(): void {
    Mod.export.ImGui_PopID();
  },
  /**
   * \/\/ calculate unique ID (hash of whole ID stack + given parameter). e.g. if you want to query into ImGuiStorage yourself
   */
  GetID(str_id: string): ImGuiID {
    return Mod.export.ImGui_GetID(str_id);
  },
  GetIDInt(int_id: number): ImGuiID {
    return Mod.export.ImGui_GetIDInt(int_id);
  },
  Text(fmt: string): void {
    Mod.export.ImGui_Text(fmt);
  },
  TextColored(col: ImVec4, fmt: string): void {
    Mod.export.ImGui_TextColored(col, fmt);
  },
  TextDisabled(fmt: string): void {
    Mod.export.ImGui_TextDisabled(fmt);
  },
  TextWrapped(fmt: string): void {
    Mod.export.ImGui_TextWrapped(fmt);
  },
  LabelText(label: string, fmt: string): void {
    Mod.export.ImGui_LabelText(label, fmt);
  },
  BulletText(fmt: string): void {
    Mod.export.ImGui_BulletText(fmt);
  },
  /**
   * \/\/ currently: formatted text with a horizontal line
   */
  SeparatorText(label: string): void {
    Mod.export.ImGui_SeparatorText(label);
  },

  // \/\/ Widgets: Main
  // \/\/ - Most widgets return true when the value has been changed or when pressed\/selected
  // \/\/ - You may also use one of the many IsItemXXX functions (e.g. IsItemActive, IsItemHovered, etc.) to query widget state.

  /**
   * \/\/ button
   */
  Button(label: string, size: ImVec2 = new ImVec2(0, 0)): boolean {
    return Mod.export.ImGui_Button(label, size);
  },
  /**
   * \/\/ button with (FramePadding.y == 0) to easily embed within text
   */
  SmallButton(label: string): boolean {
    return Mod.export.ImGui_SmallButton(label);
  },
  /**
   * \/\/ flexible button behavior without the visuals, frequently useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.)
   */
  InvisibleButton(str_id: string, size: ImVec2, flags: ImGuiButtonFlags = 0): boolean {
    return Mod.export.ImGui_InvisibleButton(str_id, size, flags);
  },
  /**
   * \/\/ square button with an arrow shape
   */
  ArrowButton(str_id: string, dir: ImGuiDir): boolean {
    return Mod.export.ImGui_ArrowButton(str_id, dir);
  },
  Checkbox(label: string, v: [boolean]): boolean {
    return Mod.export.ImGui_Checkbox(label, v);
  },
  CheckboxFlagsIntPtr(label: string, flags: [number], flags_value: number): boolean {
    return Mod.export.ImGui_CheckboxFlagsIntPtr(label, flags, flags_value);
  },
  CheckboxFlagsUintPtr(label: string, flags: [number], flags_value: number): boolean {
    return Mod.export.ImGui_CheckboxFlagsUintPtr(label, flags, flags_value);
  },
  /**
   * \/\/ use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; }
   */
  RadioButton(label: string, active: boolean): boolean {
    return Mod.export.ImGui_RadioButton(label, active);
  },
  /**
   * \/\/ shortcut to handle the above pattern when value is an integer
   */
  RadioButtonIntPtr(label: string, v: [number], v_button: number): boolean {
    return Mod.export.ImGui_RadioButtonIntPtr(label, v, v_button);
  },
  ProgressBar(
    fraction: number,
    size_arg: ImVec2 = new ImVec2(-Number.MIN_VALUE, 0),
    overlay: string = "",
  ): void {
    Mod.export.ImGui_ProgressBar(fraction, size_arg, overlay);
  },
  /**
   * \/\/ draw a small circle + keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses
   */
  Bullet(): void {
    Mod.export.ImGui_Bullet();
  },
  /**
   * \/\/ hyperlink text button, return true when clicked
   */
  TextLink(label: string): boolean {
    return Mod.export.ImGui_TextLink(label);
  },
  /**
   * \/\/ hyperlink text button, automatically open file\/url when clicked
   */
  TextLinkOpenURL(label: string, url: string = ""): boolean {
    return Mod.export.ImGui_TextLinkOpenURL(label, url);
  },
  /**
   * \/\/ Widgets: Images
   * \/\/ - Read about ImTextureID\/ImTextureRef  here: https:\/\/github.com\/ocornut\/imgui\/wiki\/Image-Loading-and-Displaying-Examples
   * \/\/ - 'uv0' and 'uv1' are texture coordinates. Read about them from the same link above.
   * \/\/ - Image() pads adds style.ImageBorderSize on each side, ImageButton() adds style.FramePadding on each side.
   * \/\/ - ImageButton() draws a background based on regular Button() color + optionally an inner background if specified.
   * \/\/ - An obsolete version of Image(), before 1.91.9 (March 2025), had a 'tint_col' parameter which is now supported by the ImageWithBg() function.
   */
  Image(
    tex_ref: ImTextureRef,
    image_size: ImVec2,
    uv0: ImVec2 = new ImVec2(0, 0),
    uv1: ImVec2 = new ImVec2(1, 1),
  ): void {
    Mod.export.ImGui_Image(tex_ref, image_size, uv0, uv1);
  },
  ImageWithBg(
    tex_ref: ImTextureRef,
    image_size: ImVec2,
    uv0: ImVec2 = new ImVec2(0, 0),
    uv1: ImVec2 = new ImVec2(1, 1),
    bg_col: ImVec4 = new ImVec4(0, 0, 0, 0),
    tint_col: ImVec4 = new ImVec4(1, 1, 1, 1),
  ): void {
    Mod.export.ImGui_ImageWithBg(tex_ref, image_size, uv0, uv1, bg_col, tint_col);
  },
  ImageButton(
    str_id: string,
    tex_ref: ImTextureRef,
    image_size: ImVec2,
    uv0: ImVec2 = new ImVec2(0, 0),
    uv1: ImVec2 = new ImVec2(1, 1),
    bg_col: ImVec4 = new ImVec4(0, 0, 0, 0),
    tint_col: ImVec4 = new ImVec4(1, 1, 1, 1),
  ): boolean {
    return Mod.export.ImGui_ImageButton(str_id, tex_ref, image_size, uv0, uv1, bg_col, tint_col);
  },
  /**
   * \/\/ Widgets: Combo Box (Dropdown)
   * \/\/ - The BeginCombo()\/EndCombo() api allows you to manage your contents and selection state however you want it, by creating e.g. Selectable() items.
   * \/\/ - The old Combo() api are helpers over BeginCombo()\/EndCombo() which are kept available for convenience purpose. This is analogous to how ListBox are created.
   */
  BeginCombo(label: string, preview_value: string, flags: ImGuiComboFlags = 0): boolean {
    return Mod.export.ImGui_BeginCombo(label, preview_value, flags);
  },
  /**
   * \/\/ only call EndCombo() if BeginCombo() returns true!
   */
  EndCombo(): void {
    Mod.export.ImGui_EndCombo();
  },
  /**
   * \/\/ Separate items with \0 within a string, end item-list with \0\0. e.g. "One\0Two\0Three\0"
   */
  Combo(
    label: string,
    current_item: [number],
    items_separated_by_zeros: string,
    popup_max_height_in_items: number = -1,
  ): boolean {
    return Mod.export.ImGui_Combo(
      label,
      current_item,
      items_separated_by_zeros,
      popup_max_height_in_items,
    );
  },

  // \/\/ Widgets: Drag Sliders
  // \/\/ - Ctrl+Click on any drag box to turn them into an input box. Manually input values aren't clamped by default and can go off-bounds. Use ImGuiSliderFlags_AlwaysClamp to always clamp.
  // \/\/ - For all the Float2\/Float3\/Float4\/Int2\/Int3\/Int4 versions of every function, note that a 'float v[X]' function argument is the same as 'float* v',
  // \/\/   the array syntax is just a way to document the number of elements that are expected to be accessible. You can pass address of your first element out of a contiguous set, e.g. &myvector.x
  // \/\/ - Adjust format string to decorate the value with a prefix, a suffix, or adapt the editing and display precision e.g. "%.3f" -> 1.234; "%5.2f secs" -> 01.23 secs; "Biscuit: %.0f" -> Biscuit: 1; etc.
  // \/\/ - Format string may also be set to NULL or use the default format ("%f" or "%d").
  // \/\/ - Speed are per-pixel of mouse movement (v_speed=0.2f: mouse needs to move by 5 pixels to increase value by 1). For keyboard\/gamepad navigation, minimum speed is Max(v_speed, minimum_step_at_given_precision).
  // \/\/ - Use v_min < v_max to clamp edits to given limits. Note that Ctrl+Click manual input can override those limits if ImGuiSliderFlags_AlwaysClamp is not used.
  // \/\/ - Use v_max = FLT_MAX \/ INT_MAX etc to avoid clamping to a maximum, same with v_min = -FLT_MAX \/ INT_MIN to avoid clamping to a minimum.
  // \/\/ - We use the same sets of flags for DragXXX() and SliderXXX() functions as the features are the same and it makes it easier to swap them.
  // \/\/ - Legacy: Pre-1.78 there are DragXXX() function signatures that take a final `float power=1.0f' argument instead of the `ImGuiSliderFlags flags=0' argument.
  // \/\/   If you get a warning converting a float to ImGuiSliderFlags, read https:\/\/github.com\/ocornut\/imgui\/issues\/3361

  /**
   * \/\/ If v_min >= v_max we have no bound
   */
  DragFloat(
    label: string,
    v: [number],
    v_speed: number = 1.0,
    v_min: number = 0.0,
    v_max: number = 0.0,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragFloat(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragFloat2(
    label: string,
    v: [number, number],
    v_speed: number = 1.0,
    v_min: number = 0.0,
    v_max: number = 0.0,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragFloat2(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragFloat3(
    label: string,
    v: [number, number, number],
    v_speed: number = 1.0,
    v_min: number = 0.0,
    v_max: number = 0.0,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragFloat3(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragFloat4(
    label: string,
    v: [number, number, number, number],
    v_speed: number = 1.0,
    v_min: number = 0.0,
    v_max: number = 0.0,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragFloat4(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragFloatRange2(
    label: string,
    v_current_min: [number],
    v_current_max: [number],
    v_speed: number = 1.0,
    v_min: number = 0.0,
    v_max: number = 0.0,
    format: string = "%.3f",
    format_max: string = "",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
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
  /**
   * \/\/ If v_min >= v_max we have no bound
   */
  DragInt(
    label: string,
    v: [number],
    v_speed: number = 1.0,
    v_min: number = 0,
    v_max: number = 0,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragInt(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragInt2(
    label: string,
    v: [number, number],
    v_speed: number = 1.0,
    v_min: number = 0,
    v_max: number = 0,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragInt2(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragInt3(
    label: string,
    v: [number, number, number],
    v_speed: number = 1.0,
    v_min: number = 0,
    v_max: number = 0,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragInt3(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragInt4(
    label: string,
    v: [number, number, number, number],
    v_speed: number = 1.0,
    v_min: number = 0,
    v_max: number = 0,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_DragInt4(label, v, v_speed, v_min, v_max, format, flags);
  },
  DragIntRange2(
    label: string,
    v_current_min: [number],
    v_current_max: [number],
    v_speed: number = 1.0,
    v_min: number = 0,
    v_max: number = 0,
    format: string = "%d",
    format_max: string = "",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
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

  // \/\/ Widgets: Regular Sliders
  // \/\/ - Ctrl+Click on any slider to turn them into an input box. Manually input values aren't clamped by default and can go off-bounds. Use ImGuiSliderFlags_AlwaysClamp to always clamp.
  // \/\/ - Adjust format string to decorate the value with a prefix, a suffix, or adapt the editing and display precision e.g. "%.3f" -> 1.234; "%5.2f secs" -> 01.23 secs; "Biscuit: %.0f" -> Biscuit: 1; etc.
  // \/\/ - Format string may also be set to NULL or use the default format ("%f" or "%d").
  // \/\/ - Legacy: Pre-1.78 there are SliderXXX() function signatures that take a final `float power=1.0f' argument instead of the `ImGuiSliderFlags flags=0' argument.
  // \/\/   If you get a warning converting a float to ImGuiSliderFlags, read https:\/\/github.com\/ocornut\/imgui\/issues\/3361

  /**
   * \/\/ adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display.
   */
  SliderFloat(
    label: string,
    v: [number],
    v_min: number,
    v_max: number,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderFloat(label, v, v_min, v_max, format, flags);
  },
  SliderFloat2(
    label: string,
    v: [number, number],
    v_min: number,
    v_max: number,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderFloat2(label, v, v_min, v_max, format, flags);
  },
  SliderFloat3(
    label: string,
    v: [number, number, number],
    v_min: number,
    v_max: number,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderFloat3(label, v, v_min, v_max, format, flags);
  },
  SliderFloat4(
    label: string,
    v: [number, number, number, number],
    v_min: number,
    v_max: number,
    format: string = "%.3f",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderFloat4(label, v, v_min, v_max, format, flags);
  },
  SliderAngle(
    label: string,
    v_rad: [number],
    v_degrees_min: number = -360.0,
    v_degrees_max: number = +360.0,
    format: string = "%.0f deg",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderAngle(label, v_rad, v_degrees_min, v_degrees_max, format, flags);
  },
  SliderInt(
    label: string,
    v: [number],
    v_min: number,
    v_max: number,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderInt(label, v, v_min, v_max, format, flags);
  },
  SliderInt2(
    label: string,
    v: [number, number],
    v_min: number,
    v_max: number,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderInt2(label, v, v_min, v_max, format, flags);
  },
  SliderInt3(
    label: string,
    v: [number, number, number],
    v_min: number,
    v_max: number,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderInt3(label, v, v_min, v_max, format, flags);
  },
  SliderInt4(
    label: string,
    v: [number, number, number, number],
    v_min: number,
    v_max: number,
    format: string = "%d",
    flags: ImGuiSliderFlags = 0,
  ): boolean {
    return Mod.export.ImGui_SliderInt4(label, v, v_min, v_max, format, flags);
  },
  InputText(
    label: string,
    buf: [string],
    buf_size: number,
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputText(label, buf, buf_size, flags);
  },
  InputTextMultiline(
    label: string,
    buf: [string],
    buf_size: number,
    size: ImVec2 = new ImVec2(0, 0),
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputTextMultiline(label, buf, buf_size, size, flags);
  },
  InputTextWithHint(
    label: string,
    hint: string,
    buf: [string],
    buf_size: number,
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputTextWithHint(label, hint, buf, buf_size, flags);
  },
  InputFloat(
    label: string,
    v: [number],
    step: number = 0.0,
    step_fast: number = 0.0,
    format: string = "%.3f",
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputFloat(label, v, step, step_fast, format, flags);
  },
  InputFloat2(
    label: string,
    v: [number, number],
    format: string = "%.3f",
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputFloat2(label, v, format, flags);
  },
  InputFloat3(
    label: string,
    v: [number, number, number],
    format: string = "%.3f",
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputFloat3(label, v, format, flags);
  },
  InputFloat4(
    label: string,
    v: [number, number, number, number],
    format: string = "%.3f",
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputFloat4(label, v, format, flags);
  },
  InputInt(
    label: string,
    v: [number],
    step: number = 1,
    step_fast: number = 100,
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputInt(label, v, step, step_fast, flags);
  },
  InputInt2(label: string, v: [number, number], flags: ImGuiInputTextFlags = 0): boolean {
    return Mod.export.ImGui_InputInt2(label, v, flags);
  },
  InputInt3(label: string, v: [number, number, number], flags: ImGuiInputTextFlags = 0): boolean {
    return Mod.export.ImGui_InputInt3(label, v, flags);
  },
  InputInt4(
    label: string,
    v: [number, number, number, number],
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputInt4(label, v, flags);
  },
  InputDouble(
    label: string,
    v: [number],
    step: number = 0.0,
    step_fast: number = 0.0,
    format: string = "%.6f",
    flags: ImGuiInputTextFlags = 0,
  ): boolean {
    return Mod.export.ImGui_InputDouble(label, v, step, step_fast, format, flags);
  },
  /**
   * \/\/ Widgets: Color Editor\/Picker (tip: the ColorEdit* functions have a little color square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
   * \/\/ - Note that in C++ a 'float v[X]' function argument is the _same_ as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible.
   * \/\/ - You can pass the address of a first float element out of a contiguous structure, e.g. &myvector.x
   */
  ColorEdit3(
    label: string,
    col: [number, number, number],
    flags: ImGuiColorEditFlags = 0,
  ): boolean {
    return Mod.export.ImGui_ColorEdit3(label, col, flags);
  },
  ColorEdit4(
    label: string,
    col: [number, number, number, number],
    flags: ImGuiColorEditFlags = 0,
  ): boolean {
    return Mod.export.ImGui_ColorEdit4(label, col, flags);
  },
  ColorPicker3(
    label: string,
    col: [number, number, number],
    flags: ImGuiColorEditFlags = 0,
  ): boolean {
    return Mod.export.ImGui_ColorPicker3(label, col, flags);
  },
  ColorPicker4(
    label: string,
    col: [number, number, number, number],
    flags: ImGuiColorEditFlags = 0,
    ref_col: number[] | null = null,
  ): boolean {
    return Mod.export.ImGui_ColorPicker4(label, col, flags, ref_col);
  },
  /**
   * \/\/ display a color square\/button, hover for details, return true when pressed.
   */
  ColorButton(
    desc_id: string,
    col: ImVec4,
    flags: ImGuiColorEditFlags = 0,
    size: ImVec2 = new ImVec2(0, 0),
  ): boolean {
    return Mod.export.ImGui_ColorButton(desc_id, col, flags, size);
  },
  /**
   * \/\/ initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls.
   */
  SetColorEditOptions(flags: ImGuiColorEditFlags): void {
    Mod.export.ImGui_SetColorEditOptions(flags);
  },
  /**
   * \/\/ Widgets: Trees
   * \/\/ - TreeNode functions return true when the node is open, in which case you need to also call TreePop() when you are finished displaying the tree node contents.
   */
  TreeNode(label: string): boolean {
    return Mod.export.ImGui_TreeNode(label);
  },
  TreeNodeEx(label: string, flags: ImGuiTreeNodeFlags = 0): boolean {
    return Mod.export.ImGui_TreeNodeEx(label, flags);
  },
  /**
   * \/\/ ~ Indent()+PushID(). Already called by TreeNode() when returning true, but you can call TreePush\/TreePop yourself if desired.
   */
  TreePush(str_id: string): void {
    Mod.export.ImGui_TreePush(str_id);
  },
  /**
   * \/\/ ~ Unindent()+PopID()
   */
  TreePop(): void {
    Mod.export.ImGui_TreePop();
  },
  /**
   * \/\/ horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode
   */
  GetTreeNodeToLabelSpacing(): number {
    return Mod.export.ImGui_GetTreeNodeToLabelSpacing();
  },
  /**
   * \/\/ if returning 'true' the header is open. doesn't indent nor push on ID stack. user doesn't have to call TreePop().
   */
  CollapsingHeader(label: string, flags: ImGuiTreeNodeFlags = 0): boolean {
    return Mod.export.ImGui_CollapsingHeader(label, flags);
  },
  /**
   * \/\/ when 'p_visible != NULL': if '*p_visible==true' display an additional small close button on upper right of the header which will set the bool to false when clicked, if '*p_visible==false' don't display the header.
   */
  CollapsingHeaderBoolPtr(
    label: string,
    p_visible: [boolean],
    flags: ImGuiTreeNodeFlags = 0,
  ): boolean {
    return Mod.export.ImGui_CollapsingHeaderBoolPtr(label, p_visible, flags);
  },
  /**
   * \/\/ set next TreeNode\/CollapsingHeader open state.
   */
  SetNextItemOpen(is_open: boolean, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetNextItemOpen(is_open, cond);
  },
  /**
   * \/\/ set id to use for open\/close storage (default to same as item id).
   */
  SetNextItemStorageID(storage_id: ImGuiID): void {
    Mod.export.ImGui_SetNextItemStorageID(storage_id);
  },
  /**
   * \/\/ retrieve tree node open\/close state.
   */
  TreeNodeGetOpen(storage_id: ImGuiID): boolean {
    return Mod.export.ImGui_TreeNodeGetOpen(storage_id);
  },

  // \/\/ Widgets: Selectables
  // \/\/ - A selectable highlights when hovered, and can display another color when selected.
  // \/\/ - Neighbors selectable extend their highlight bounds in order to leave no gap between them. This is so a series of selected Selectable appear contiguous.

  /**
   * \/\/ "bool selected" carry the selection state (read-only). Selectable() is clicked is returns true so you can modify your selection state. size.x==0.0: use remaining width, size.x>0.0: specify width. size.y==0.0: use label height, size.y>0.0: specify height
   */
  Selectable(
    label: string,
    selected: boolean = false,
    flags: ImGuiSelectableFlags = 0,
    size: ImVec2 = new ImVec2(0, 0),
  ): boolean {
    return Mod.export.ImGui_Selectable(label, selected, flags, size);
  },
  /**
   * \/\/ "bool* p_selected" point to the selection state (read-write), as a convenient helper.
   */
  SelectableBoolPtr(
    label: string,
    p_selected: [boolean],
    flags: ImGuiSelectableFlags = 0,
    size: ImVec2 = new ImVec2(0, 0),
  ): boolean {
    return Mod.export.ImGui_SelectableBoolPtr(label, p_selected, flags, size);
  },
  /**
   * \/\/ Multi-selection system for Selectable(), Checkbox(), TreeNode() functions [BETA]
   * \/\/ - This enables standard multi-selection\/range-selection idioms (Ctrl+Mouse\/Keyboard, Shift+Mouse\/Keyboard, etc.) in a way that also allow a clipper to be used.
   * \/\/ - ImGuiSelectionUserData is often used to store your item index within the current view (but may store something else).
   * \/\/ - Read comments near ImGuiMultiSelectIO for instructions\/details and see 'Demo->Widgets->Selection State & Multi-Select' for demo.
   * \/\/ - TreeNode() is technically supported but... using this correctly is more complicated. You need some sort of linear\/random access to your tree,
   * \/\/   which is suited to advanced trees setups already implementing filters and clipper. We will work simplifying the current demo.
   * \/\/ - 'selection_size' and 'items_count' parameters are optional and used by a few features. If they are costly for you to compute, you may avoid them.
   */
  BeginMultiSelect(
    flags: ImGuiMultiSelectFlags,
    selection_size: number = -1,
    items_count: number = -1,
  ): ImGuiMultiSelectIO {
    return ImGuiMultiSelectIO.From(
      Mod.export.ImGui_BeginMultiSelect(flags, selection_size, items_count),
    );
  },
  EndMultiSelect(): ImGuiMultiSelectIO {
    return ImGuiMultiSelectIO.From(Mod.export.ImGui_EndMultiSelect());
  },
  SetNextItemSelectionUserData(selection_user_data: ImGuiSelectionUserData): void {
    Mod.export.ImGui_SetNextItemSelectionUserData(selection_user_data);
  },
  /**
   * \/\/ Was the last item selection state toggled? Useful if you need the per-item information _before_ reaching EndMultiSelect(). We only returns toggle _event_ in order to handle clipping correctly.
   */
  IsItemToggledSelection(): boolean {
    return Mod.export.ImGui_IsItemToggledSelection();
  },

  // \/\/ Widgets: List Boxes
  // \/\/ - This is essentially a thin wrapper to using BeginChild\/EndChild with the ImGuiChildFlags_FrameStyle flag for stylistic changes + displaying a label.
  // \/\/ - If you don't need a label you can probably simply use BeginChild() with the ImGuiChildFlags_FrameStyle flag for the same result.
  // \/\/ - You can submit contents and manage your selection state however you want it, by creating e.g. Selectable() or any other items.
  // \/\/ - The simplified\/old ListBox() api are helpers over BeginListBox()\/EndListBox() which are kept available for convenience purpose. This is analogous to how Combos are created.
  // \/\/ - Choose frame width:   size.x > 0.0f: custom  \/  size.x < 0.0f or -FLT_MIN: right-align   \/  size.x = 0.0f (default): use current ItemWidth
  // \/\/ - Choose frame height:  size.y > 0.0f: custom  \/  size.y < 0.0f or -FLT_MIN: bottom-align  \/  size.y = 0.0f (default): arbitrary default height which can fit ~7 items

  /**
   * \/\/ open a framed scrolling region
   */
  BeginListBox(label: string, size: ImVec2 = new ImVec2(0, 0)): boolean {
    return Mod.export.ImGui_BeginListBox(label, size);
  },
  /**
   * \/\/ only call EndListBox() if BeginListBox() returned true!
   */
  EndListBox(): void {
    Mod.export.ImGui_EndListBox();
  },
  /**
   * \/\/ Widgets: Data Plotting
   * \/\/ - Consider using ImPlot (https:\/\/github.com\/epezent\/implot) which is much better!
   */
  PlotLines(
    label: string,
    values: number[],
    values_count: number,
    values_offset: number = 0,
    overlay_text: string = "",
    scale_min: number = Number.MAX_VALUE,
    scale_max: number = Number.MAX_VALUE,
    graph_size: ImVec2 = new ImVec2(0, 0),
    stride: number = 4,
  ): void {
    Mod.export.ImGui_PlotLines(
      label,
      values,
      values_count,
      values_offset,
      overlay_text,
      scale_min,
      scale_max,
      graph_size,
      stride,
    );
  },
  PlotHistogram(
    label: string,
    values: number[],
    values_count: number,
    values_offset: number = 0,
    overlay_text: string = "",
    scale_min: number = Number.MAX_VALUE,
    scale_max: number = Number.MAX_VALUE,
    graph_size: ImVec2 = new ImVec2(0, 0),
    stride: number = 4,
  ): void {
    Mod.export.ImGui_PlotHistogram(
      label,
      values,
      values_count,
      values_offset,
      overlay_text,
      scale_min,
      scale_max,
      graph_size,
      stride,
    );
  },

  // \/\/ Widgets: Menus
  // \/\/ - Use BeginMenuBar() on a window ImGuiWindowFlags_MenuBar to append to its menu bar.
  // \/\/ - Use BeginMainMenuBar() to create a menu bar at the top of the screen and append to it.
  // \/\/ - Use BeginMenu() to create a menu. You can call BeginMenu() multiple time with the same identifier to append more items to it.
  // \/\/ - Not that MenuItem() keyboardshortcuts are displayed as a convenience but _not processed_ by Dear ImGui at the moment.

  /**
   * \/\/ append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window).
   */
  BeginMenuBar(): boolean {
    return Mod.export.ImGui_BeginMenuBar();
  },
  /**
   * \/\/ only call EndMenuBar() if BeginMenuBar() returns true!
   */
  EndMenuBar(): void {
    Mod.export.ImGui_EndMenuBar();
  },
  /**
   * \/\/ create and append to a full screen menu-bar.
   */
  BeginMainMenuBar(): boolean {
    return Mod.export.ImGui_BeginMainMenuBar();
  },
  /**
   * \/\/ only call EndMainMenuBar() if BeginMainMenuBar() returns true!
   */
  EndMainMenuBar(): void {
    Mod.export.ImGui_EndMainMenuBar();
  },
  /**
   * \/\/ create a sub-menu entry. only call EndMenu() if this returns true!
   */
  BeginMenu(label: string, enabled: boolean = true): boolean {
    return Mod.export.ImGui_BeginMenu(label, enabled);
  },
  /**
   * \/\/ only call EndMenu() if BeginMenu() returns true!
   */
  EndMenu(): void {
    Mod.export.ImGui_EndMenu();
  },
  /**
   * \/\/ return true when activated.
   */
  MenuItem(
    label: string,
    shortcut: string = "",
    selected: boolean = false,
    enabled: boolean = true,
  ): boolean {
    return Mod.export.ImGui_MenuItem(label, shortcut, selected, enabled);
  },
  /**
   * \/\/ return true when activated + toggle (*p_selected) if p_selected != NULL
   */
  MenuItemBoolPtr(
    label: string,
    shortcut: string,
    p_selected: [boolean],
    enabled: boolean = true,
  ): boolean {
    return Mod.export.ImGui_MenuItemBoolPtr(label, shortcut, p_selected, enabled);
  },

  // \/\/ Tooltips
  // \/\/ - Tooltips are windows following the mouse. They do not take focus away.
  // \/\/ - A tooltip window can contain items of any types.
  // \/\/ - SetTooltip() is more or less a shortcut for the 'if (BeginTooltip()) { Text(...); EndTooltip(); }' idiom (with a subtlety that it discard any previously submitted tooltip)

  /**
   * \/\/ begin\/append a tooltip window.
   */
  BeginTooltip(): boolean {
    return Mod.export.ImGui_BeginTooltip();
  },
  /**
   * \/\/ only call EndTooltip() if BeginTooltip()\/BeginItemTooltip() returns true!
   */
  EndTooltip(): void {
    Mod.export.ImGui_EndTooltip();
  },
  SetTooltip(fmt: string): void {
    Mod.export.ImGui_SetTooltip(fmt);
  },

  // \/\/ Tooltips: helpers for showing a tooltip when hovering an item
  // \/\/ - BeginItemTooltip() is a shortcut for the 'if (IsItemHovered(ImGuiHoveredFlags_ForTooltip) && BeginTooltip())' idiom.
  // \/\/ - SetItemTooltip() is a shortcut for the 'if (IsItemHovered(ImGuiHoveredFlags_ForTooltip)) { SetTooltip(...); }' idiom.
  // \/\/ - Where 'ImGuiHoveredFlags_ForTooltip' itself is a shortcut to use 'style.HoverFlagsForTooltipMouse' or 'style.HoverFlagsForTooltipNav' depending on active input type. For mouse it defaults to 'ImGuiHoveredFlags_Stationary | ImGuiHoveredFlags_DelayShort'.

  /**
   * \/\/ begin\/append a tooltip window if preceding item was hovered.
   */
  BeginItemTooltip(): boolean {
    return Mod.export.ImGui_BeginItemTooltip();
  },
  SetItemTooltip(fmt: string): void {
    Mod.export.ImGui_SetItemTooltip(fmt);
  },

  // \/\/ Popups, Modals
  // \/\/  - They block normal mouse hovering detection (and therefore most mouse interactions) behind them.
  // \/\/  - If not modal: they can be closed by clicking anywhere outside them, or by pressing ESCAPE.
  // \/\/  - Their visibility state (~bool) is held internally instead of being held by the programmer as we are used to with regular Begin*() calls.
  // \/\/  - The 3 properties above are related: we need to retain popup visibility state in the library because popups may be closed as any time.
  // \/\/  - You can bypass the hovering restriction by using ImGuiHoveredFlags_AllowWhenBlockedByPopup when calling IsItemHovered() or IsWindowHovered().
  // \/\/  - IMPORTANT: Popup identifiers are relative to the current ID stack, so OpenPopup and BeginPopup generally needs to be at the same level of the stack.
  // \/\/    This is sometimes leading to confusing mistakes. May rework this in the future.
  // \/\/  - BeginPopup(): query popup state, if open start appending into the window. Call EndPopup() afterwards if returned true. ImGuiWindowFlags are forwarded to the window.
  // \/\/  - BeginPopupModal(): block every interaction behind the window, cannot be closed by user, add a dimming background, has a title bar.

  /**
   * \/\/ return true if the popup is open, and you can start outputting to it.
   */
  BeginPopup(str_id: string, flags: ImGuiWindowFlags = 0): boolean {
    return Mod.export.ImGui_BeginPopup(str_id, flags);
  },
  /**
   * \/\/ return true if the modal is open, and you can start outputting to it.
   */
  BeginPopupModal(
    name: string,
    p_open: [boolean] | null = null,
    flags: ImGuiWindowFlags = 0,
  ): boolean {
    return Mod.export.ImGui_BeginPopupModal(name, p_open, flags);
  },
  /**
   * \/\/ only call EndPopup() if BeginPopupXXX() returns true!
   */
  EndPopup(): void {
    Mod.export.ImGui_EndPopup();
  },

  // \/\/ Popups: open\/close functions
  // \/\/  - OpenPopup(): set popup state to open. ImGuiPopupFlags are available for opening options.
  // \/\/  - If not modal: they can be closed by clicking anywhere outside them, or by pressing ESCAPE.
  // \/\/  - CloseCurrentPopup(): use inside the BeginPopup()\/EndPopup() scope to close manually.
  // \/\/  - CloseCurrentPopup() is called by default by Selectable()\/MenuItem() when activated (FIXME: need some options).
  // \/\/  - Use ImGuiPopupFlags_NoOpenOverExistingPopup to avoid opening a popup if there's already one at the same level. This is equivalent to e.g. testing for !IsAnyPopupOpen() prior to OpenPopup().
  // \/\/  - Use IsWindowAppearing() after BeginPopup() to tell if a window just opened.

  /**
   * \/\/ call to mark popup as open (don't call every frame!).
   */
  OpenPopup(str_id: string, popup_flags: ImGuiPopupFlags = 0): void {
    Mod.export.ImGui_OpenPopup(str_id, popup_flags);
  },
  /**
   * \/\/ id overload to facilitate calling from nested stacks
   */
  OpenPopupID(id: ImGuiID, popup_flags: ImGuiPopupFlags = 0): void {
    Mod.export.ImGui_OpenPopupID(id, popup_flags);
  },
  /**
   * \/\/ helper to open popup when clicked on last item. Default to ImGuiPopupFlags_MouseButtonRight == 1. (note: actually triggers on the mouse _released_ event to be consistent with popup behaviors)
   */
  OpenPopupOnItemClick(str_id: string = "", popup_flags: ImGuiPopupFlags = 0): void {
    Mod.export.ImGui_OpenPopupOnItemClick(str_id, popup_flags);
  },
  /**
   * \/\/ manually close the popup we have begin-ed into.
   */
  CloseCurrentPopup(): void {
    Mod.export.ImGui_CloseCurrentPopup();
  },

  // \/\/ Popups: Open+Begin popup combined functions helpers to create context menus.
  // \/\/  - Helpers to do OpenPopup+BeginPopup where the Open action is triggered by e.g. hovering an item and right-clicking.
  // \/\/  - IMPORTANT: Notice that BeginPopupContextXXX takes ImGuiPopupFlags just like OpenPopup() and unlike BeginPopup(). For full consistency, we may add ImGuiWindowFlags to the BeginPopupContextXXX functions in the future.
  // \/\/  - IMPORTANT: If you ever used the left mouse button with BeginPopupContextXXX() helpers before 1.92.6:
  // \/\/    - Before this version, OpenPopupOnItemClick(), BeginPopupContextItem(), BeginPopupContextWindow(), BeginPopupContextVoid() had 'a ImGuiPopupFlags popup_flags = 1' default value in their function signature.
  // \/\/    - Before: Explicitly passing a literal 0 meant ImGuiPopupFlags_MouseButtonLeft. The default = 1 meant ImGuiPopupFlags_MouseButtonRight.
  // \/\/    - After: The default = 0 means ImGuiPopupFlags_MouseButtonRight. Explicitly passing a literal 1 also means ImGuiPopupFlags_MouseButtonRight (if legacy behavior are enabled) or will assert (if legacy behavior are disabled).
  // \/\/    - TL;DR: if you don't want to use right mouse button for popups, always specify it explicitly using a named ImGuiPopupFlags_MouseButtonXXXX value.
  // \/\/    - Read "API BREAKING CHANGES" 2026\/01\/07 (1.92.6) entry in imgui.cpp or GitHub topic #9157 for all details.

  /**
   * \/\/ open+begin popup when clicked on last item. Use str_id==NULL to associate the popup to previous item. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp!
   */
  BeginPopupContextItem(str_id: string = "", popup_flags: ImGuiPopupFlags = 0): boolean {
    return Mod.export.ImGui_BeginPopupContextItem(str_id, popup_flags);
  },
  /**
   * \/\/ open+begin popup when clicked on current window.
   */
  BeginPopupContextWindow(str_id: string = "", popup_flags: ImGuiPopupFlags = 0): boolean {
    return Mod.export.ImGui_BeginPopupContextWindow(str_id, popup_flags);
  },
  /**
   * \/\/ open+begin popup when clicked in void (where there are no windows).
   */
  BeginPopupContextVoid(str_id: string = "", popup_flags: ImGuiPopupFlags = 0): boolean {
    return Mod.export.ImGui_BeginPopupContextVoid(str_id, popup_flags);
  },

  // \/\/ Popups: query functions
  // \/\/  - IsPopupOpen(): return true if the popup is open at the current BeginPopup() level of the popup stack.
  // \/\/  - IsPopupOpen() with ImGuiPopupFlags_AnyPopupId: return true if any popup is open at the current BeginPopup() level of the popup stack.
  // \/\/  - IsPopupOpen() with ImGuiPopupFlags_AnyPopupId + ImGuiPopupFlags_AnyPopupLevel: return true if any popup is open.

  /**
   * \/\/ return true if the popup is open.
   */
  IsPopupOpen(str_id: string, flags: ImGuiPopupFlags = 0): boolean {
    return Mod.export.ImGui_IsPopupOpen(str_id, flags);
  },
  /**
   * \/\/ Tables
   * \/\/ - Full-featured replacement for old Columns API.
   * \/\/ - See Demo->Tables for demo code. See top of imgui_tables.cpp for general commentary.
   * \/\/ - See ImGuiTableFlags_ and ImGuiTableColumnFlags_ enums for a description of available flags.
   * \/\/ The typical call flow is:
   * \/\/ - 1. Call BeginTable(), early out if returning false.
   * \/\/ - 2. Optionally call TableSetupColumn() to submit column name\/flags\/defaults.
   * \/\/ - 3. Optionally call TableSetupScrollFreeze() to request scroll freezing of columns\/rows.
   * \/\/ - 4. Optionally call TableHeadersRow() to submit a header row. Names are pulled from TableSetupColumn() data.
   * \/\/ - 5. Populate contents:
   * \/\/    - In most situations you can use TableNextRow() + TableSetColumnIndex(N) to start appending into a column.
   * \/\/    - If you are using tables as a sort of grid, where every column is holding the same type of contents,
   * \/\/      you may prefer using TableNextColumn() instead of TableNextRow() + TableSetColumnIndex().
   * \/\/      TableNextColumn() will automatically wrap-around into the next row if needed.
   * \/\/    - IMPORTANT: Comparatively to the old Columns() API, we need to call TableNextColumn() for the first column!
   * \/\/    - Summary of possible call flow:
   * \/\/        - TableNextRow() -> TableSetColumnIndex(0) -> Text("Hello 0") -> TableSetColumnIndex(1) -> Text("Hello 1")  \/\/ OK
   * \/\/        - TableNextRow() -> TableNextColumn()      -> Text("Hello 0") -> TableNextColumn()      -> Text("Hello 1")  \/\/ OK
   * \/\/        -                   TableNextColumn()      -> Text("Hello 0") -> TableNextColumn()      -> Text("Hello 1")  \/\/ OK: TableNextColumn() automatically gets to next row!
   * \/\/        - TableNextRow()                           -> Text("Hello 0")                                               \/\/ Not OK! Missing TableSetColumnIndex() or TableNextColumn()! Text will not appear!
   * \/\/ - 5. Call EndTable()
   */
  BeginTable(
    str_id: string,
    columns: number,
    flags: ImGuiTableFlags = 0,
    outer_size: ImVec2 = new ImVec2(0.0, 0.0),
    inner_width: number = 0.0,
  ): boolean {
    return Mod.export.ImGui_BeginTable(str_id, columns, flags, outer_size, inner_width);
  },
  /**
   * \/\/ only call EndTable() if BeginTable() returns true!
   */
  EndTable(): void {
    Mod.export.ImGui_EndTable();
  },
  /**
   * \/\/ append into the first cell of a new row. 'min_row_height' include the minimum top and bottom padding aka CellPadding.y * 2.0f.
   */
  TableNextRow(row_flags: ImGuiTableRowFlags = 0, min_row_height: number = 0.0): void {
    Mod.export.ImGui_TableNextRow(row_flags, min_row_height);
  },
  /**
   * \/\/ append into the next column (or first column of next row if currently in last column). Return true when column is visible.
   */
  TableNextColumn(): boolean {
    return Mod.export.ImGui_TableNextColumn();
  },
  /**
   * \/\/ append into the specified column. Return true when column is visible.
   */
  TableSetColumnIndex(column_n: number): boolean {
    return Mod.export.ImGui_TableSetColumnIndex(column_n);
  },
  /**
   * \/\/ Tables: Headers & Columns declaration
   * \/\/ - Use TableSetupColumn() to specify label, resizing policy, default width\/weight, id, various other flags etc.
   * \/\/ - Use TableHeadersRow() to create a header row and automatically submit a TableHeader() for each column.
   * \/\/   Headers are required to perform: reordering, sorting, and opening the context menu.
   * \/\/   The context menu can also be made available in columns body using ImGuiTableFlags_ContextMenuInBody.
   * \/\/ - You may manually submit headers using TableNextRow() + TableHeader() calls, but this is only useful in
   * \/\/   some advanced use cases (e.g. adding custom widgets in header row).
   * \/\/ - Use TableSetupScrollFreeze() to lock columns\/rows so they stay visible when scrolled. When freezing columns you would usually also use ImGuiTableColumnFlags_NoHide on them.
   */
  TableSetupColumn(
    label: string,
    flags: ImGuiTableColumnFlags = 0,
    init_width_or_weight: number = 0.0,
    user_id: ImGuiID = 0,
  ): void {
    Mod.export.ImGui_TableSetupColumn(label, flags, init_width_or_weight, user_id);
  },
  /**
   * \/\/ lock columns\/rows so they stay visible when scrolled.
   */
  TableSetupScrollFreeze(cols: number, rows: number): void {
    Mod.export.ImGui_TableSetupScrollFreeze(cols, rows);
  },
  /**
   * \/\/ submit one header cell manually (rarely used)
   */
  TableHeader(label: string): void {
    Mod.export.ImGui_TableHeader(label);
  },
  /**
   * \/\/ submit a row with headers cells based on data provided to TableSetupColumn() + submit context menu
   */
  TableHeadersRow(): void {
    Mod.export.ImGui_TableHeadersRow();
  },
  /**
   * \/\/ submit a row with angled headers for every column with the ImGuiTableColumnFlags_AngledHeader flag. MUST BE FIRST ROW.
   */
  TableAngledHeadersRow(): void {
    Mod.export.ImGui_TableAngledHeadersRow();
  },

  // \/\/ Tables: Sorting & Miscellaneous functions
  // \/\/ - Sorting: call TableGetSortSpecs() to retrieve latest sort specs for the table. NULL when not sorting.
  // \/\/   When 'sort_specs->SpecsDirty == true' you should sort your data. It will be true when sorting specs have
  // \/\/   changed since last call, or the first time. Make sure to set 'SpecsDirty = false' after sorting,
  // \/\/   else you may wastefully sort your data every frame!
  // \/\/ - Functions args 'int column_n' treat the default value of -1 as the same as passing the current column index.

  /**
   * \/\/ get latest sort specs for the table (NULL if not sorting).  Lifetime: don't hold on this pointer over multiple frames or past any subsequent call to BeginTable().
   */
  TableGetSortSpecs(): ImGuiTableSortSpecs {
    return ImGuiTableSortSpecs.From(Mod.export.ImGui_TableGetSortSpecs());
  },
  /**
   * \/\/ return number of columns (value passed to BeginTable)
   */
  TableGetColumnCount(): number {
    return Mod.export.ImGui_TableGetColumnCount();
  },
  /**
   * \/\/ return current column index.
   */
  TableGetColumnIndex(): number {
    return Mod.export.ImGui_TableGetColumnIndex();
  },
  /**
   * \/\/ return current row index (header rows are accounted for)
   */
  TableGetRowIndex(): number {
    return Mod.export.ImGui_TableGetRowIndex();
  },
  /**
   * \/\/ return "" if column didn't have a name declared by TableSetupColumn(). Pass -1 to use current column.
   */
  TableGetColumnName(column_n: number = -1): string {
    return Mod.export.ImGui_TableGetColumnName(column_n);
  },
  /**
   * \/\/ return column flags so you can query their Enabled\/Visible\/Sorted\/Hovered status flags. Pass -1 to use current column.
   */
  TableGetColumnFlags(column_n: number = -1): ImGuiTableColumnFlags {
    return Mod.export.ImGui_TableGetColumnFlags(column_n);
  },
  /**
   * \/\/ change user accessible enabled\/disabled state of a column. Set to false to hide the column. User can use the context menu to change this themselves (right-click in headers, or right-click in columns body with ImGuiTableFlags_ContextMenuInBody)
   */
  TableSetColumnEnabled(column_n: number, v: boolean): void {
    Mod.export.ImGui_TableSetColumnEnabled(column_n, v);
  },
  /**
   * \/\/ return hovered column. return -1 when table is not hovered. return columns_count if the unused space at the right of visible columns is hovered. Can also use (TableGetColumnFlags() & ImGuiTableColumnFlags_IsHovered) instead.
   */
  TableGetHoveredColumn(): number {
    return Mod.export.ImGui_TableGetHoveredColumn();
  },
  /**
   * \/\/ change the color of a cell, row, or column. See ImGuiTableBgTarget_ flags for details.
   */
  TableSetBgColor(target: ImGuiTableBgTarget, color: ImU32, column_n: number = -1): void {
    Mod.export.ImGui_TableSetBgColor(target, color, column_n);
  },
  /**
   * \/\/ Legacy Columns API (prefer using Tables!)
   * \/\/ - You can also use SameLine(pos_x) to mimic simplified columns.
   */
  Columns(count: number = 1, id: string = "", borders: boolean = true): void {
    Mod.export.ImGui_Columns(count, id, borders);
  },
  /**
   * \/\/ next column, defaults to current row or next row if the current row is finished
   */
  NextColumn(): void {
    Mod.export.ImGui_NextColumn();
  },
  /**
   * \/\/ get current column index
   */
  GetColumnIndex(): number {
    return Mod.export.ImGui_GetColumnIndex();
  },
  /**
   * \/\/ get column width (in pixels). pass -1 to use current column
   */
  GetColumnWidth(column_index: number = -1): number {
    return Mod.export.ImGui_GetColumnWidth(column_index);
  },
  /**
   * \/\/ set column width (in pixels). pass -1 to use current column
   */
  SetColumnWidth(column_index: number, width: number): void {
    Mod.export.ImGui_SetColumnWidth(column_index, width);
  },
  /**
   * \/\/ get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f
   */
  GetColumnOffset(column_index: number = -1): number {
    return Mod.export.ImGui_GetColumnOffset(column_index);
  },
  /**
   * \/\/ set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column
   */
  SetColumnOffset(column_index: number, offset_x: number): void {
    Mod.export.ImGui_SetColumnOffset(column_index, offset_x);
  },
  GetColumnsCount(): number {
    return Mod.export.ImGui_GetColumnsCount();
  },

  // \/\/ Tab Bars, Tabs
  // \/\/ - Note: Tabs are automatically created by the docking system (when in 'docking' branch). Use this to create tab bars\/tabs yourself.

  /**
   * \/\/ create and append into a TabBar
   */
  BeginTabBar(str_id: string, flags: ImGuiTabBarFlags = 0): boolean {
    return Mod.export.ImGui_BeginTabBar(str_id, flags);
  },
  /**
   * \/\/ only call EndTabBar() if BeginTabBar() returns true!
   */
  EndTabBar(): void {
    Mod.export.ImGui_EndTabBar();
  },
  /**
   * \/\/ create a Tab. Returns true if the Tab is selected.
   */
  BeginTabItem(
    label: string,
    p_open: [boolean] | null = null,
    flags: ImGuiTabItemFlags = 0,
  ): boolean {
    return Mod.export.ImGui_BeginTabItem(label, p_open, flags);
  },
  /**
   * \/\/ only call EndTabItem() if BeginTabItem() returns true!
   */
  EndTabItem(): void {
    Mod.export.ImGui_EndTabItem();
  },
  /**
   * \/\/ create a Tab behaving like a button. return true when clicked. cannot be selected in the tab bar.
   */
  TabItemButton(label: string, flags: ImGuiTabItemFlags = 0): boolean {
    return Mod.export.ImGui_TabItemButton(label, flags);
  },
  /**
   * \/\/ notify TabBar or Docking system of a closed tab\/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name.
   */
  SetTabItemClosed(tab_or_docked_window_label: string): void {
    Mod.export.ImGui_SetTabItemClosed(tab_or_docked_window_label);
  },
  /**
   * \/\/ Docking
   * \/\/ - Read https:\/\/github.com\/ocornut\/imgui\/wiki\/Docking for details.
   * \/\/ - Enable with io.ConfigFlags |= ImGuiConfigFlags_DockingEnable.
   * \/\/ - You can use many Docking facilities without calling any API.
   * \/\/   - Drag from window title bar or their tab to dock\/undock. Hold SHIFT to disable docking.
   * \/\/   - Drag from window menu button (upper-left button) to undock an entire node (all windows).
   * \/\/   - When io.ConfigDockingWithShift == true, you instead need to hold SHIFT to enable docking.
   * \/\/ - DockSpaceOverViewport:
   * \/\/   - This is a helper to create an invisible window covering a viewport, then submit a DockSpace() into it.
   * \/\/   - Most applications can simply call DockSpaceOverViewport() once to allow docking windows into e.g. the edge of your screen.
   * \/\/     e.g. ImGui::NewFrame(); ImGui::DockSpaceOverViewport();                                                   \/\/ Create a dockspace in main viewport.
   * \/\/      or: ImGui::NewFrame(); ImGui::DockSpaceOverViewport(0, nullptr, ImGuiDockNodeFlags_PassthruCentralNode); \/\/ Create a dockspace in main viewport, central node is transparent.
   * \/\/ - Dockspaces:
   * \/\/   - A dockspace is an explicit dock node within an existing window.
   * \/\/   - IMPORTANT: Dockspaces need to be submitted _before_ any window they can host. Submit them early in your frame!
   * \/\/   - IMPORTANT: Dockspaces need to be kept alive if hidden, otherwise windows docked into it will be undocked.
   * \/\/     If you have e.g. multiple tabs with a dockspace inside each tab: submit the non-visible dockspaces with ImGuiDockNodeFlags_KeepAliveOnly.
   * \/\/   - See 'Demo->Examples->Dockspace' or 'Demo->Examples->Documents' for more detailed demos.
   * \/\/ - Programmatic docking:
   * \/\/   - There is no public API yet other than the very limited SetNextWindowDockID() function. Sorry for that!
   * \/\/   - Read https:\/\/github.com\/ocornut\/imgui\/wiki\/Docking for examples of how to use current internal API.
   */
  DockSpace(
    dockspace_id: ImGuiID,
    size: ImVec2 = new ImVec2(0, 0),
    flags: ImGuiDockNodeFlags = 0,
    window_class: ImGuiWindowClass | null = null,
  ): ImGuiID {
    return Mod.export.ImGui_DockSpace(dockspace_id, size, flags, window_class?.ptr ?? null);
  },
  DockSpaceOverViewport(
    dockspace_id: ImGuiID = 0,
    viewport: ImGuiViewport | null = null,
    flags: ImGuiDockNodeFlags = 0,
    window_class: ImGuiWindowClass | null = null,
  ): ImGuiID {
    return Mod.export.ImGui_DockSpaceOverViewport(
      dockspace_id,
      viewport?.ptr ?? null,
      flags,
      window_class?.ptr ?? null,
    );
  },
  /**
   * \/\/ set next window dock id
   */
  SetNextWindowDockID(dock_id: ImGuiID, cond: ImGuiCond = 0): void {
    Mod.export.ImGui_SetNextWindowDockID(dock_id, cond);
  },
  /**
   * \/\/ set next window class (control docking compatibility + provide hints to platform backend via custom viewport flags and platform parent\/child relationship)
   */
  SetNextWindowClass(window_class: ImGuiWindowClass): void {
    Mod.export.ImGui_SetNextWindowClass(window_class?.ptr ?? null);
  },
  /**
   * \/\/ get dock id of current window, or 0 if not associated to any docking node.
   */
  GetWindowDockID(): ImGuiID {
    return Mod.export.ImGui_GetWindowDockID();
  },
  /**
   * \/\/ is current window docked into another window?
   */
  IsWindowDocked(): boolean {
    return Mod.export.ImGui_IsWindowDocked();
  },

  // \/\/ Logging\/Capture
  // \/\/ - All text output from the interface can be captured into tty\/file\/clipboard. By default, tree nodes are automatically opened during logging.

  /**
   * \/\/ start logging to tty (stdout)
   */
  LogToTTY(auto_open_depth: number = -1): void {
    Mod.export.ImGui_LogToTTY(auto_open_depth);
  },
  /**
   * \/\/ start logging to file
   */
  LogToFile(auto_open_depth: number = -1, filename: string = ""): void {
    Mod.export.ImGui_LogToFile(auto_open_depth, filename);
  },
  /**
   * \/\/ start logging to OS clipboard
   */
  LogToClipboard(auto_open_depth: number = -1): void {
    Mod.export.ImGui_LogToClipboard(auto_open_depth);
  },
  /**
   * \/\/ stop logging (close file, etc.)
   */
  LogFinish(): void {
    Mod.export.ImGui_LogFinish();
  },
  /**
   * \/\/ helper to display buttons for logging to tty\/file\/clipboard
   */
  LogButtons(): void {
    Mod.export.ImGui_LogButtons();
  },
  LogText(fmt: string): void {
    Mod.export.ImGui_LogText(fmt);
  },

  // \/\/ Drag and Drop
  // \/\/ - On source items, call BeginDragDropSource(), if it returns true also call SetDragDropPayload() + EndDragDropSource().
  // \/\/ - On target candidates, call BeginDragDropTarget(), if it returns true also call AcceptDragDropPayload() + EndDragDropTarget().
  // \/\/ - If you stop calling BeginDragDropSource() the payload is preserved however it won't have a preview tooltip (we currently display a fallback "..." tooltip, see #1725)
  // \/\/ - An item can be both drag source and drop target.

  /**
   * \/\/ call after submitting an item which may be dragged. when this return true, you can call SetDragDropPayload() + EndDragDropSource()
   */
  BeginDragDropSource(flags: ImGuiDragDropFlags = 0): boolean {
    return Mod.export.ImGui_BeginDragDropSource(flags);
  },
  SetDragDropPayload(type: string, data: string, sz: number, cond: ImGuiCond): boolean {
    return Mod.export.ImGui_SetDragDropPayload(type, data, sz, cond);
  },
  /**
   * \/\/ only call EndDragDropSource() if BeginDragDropSource() returns true!
   */
  EndDragDropSource(): void {
    Mod.export.ImGui_EndDragDropSource();
  },
  /**
   * \/\/ call after submitting an item that may receive a payload. If this returns true, you can call AcceptDragDropPayload() + EndDragDropTarget()
   */
  BeginDragDropTarget(): boolean {
    return Mod.export.ImGui_BeginDragDropTarget();
  },
  /**
   * \/\/ accept contents of a given type. If ImGuiDragDropFlags_AcceptBeforeDelivery is set you can peek into the payload before the mouse button is released.
   */
  AcceptDragDropPayload(type: string, flags: ImGuiDragDropFlags = 0): ImGuiPayload {
    return ImGuiPayload.From(Mod.export.ImGui_AcceptDragDropPayload(type, flags));
  },
  /**
   * \/\/ only call EndDragDropTarget() if BeginDragDropTarget() returns true!
   */
  EndDragDropTarget(): void {
    Mod.export.ImGui_EndDragDropTarget();
  },
  /**
   * \/\/ peek directly into the current payload from anywhere. returns NULL when drag and drop is finished or inactive. use ImGuiPayload::IsDataType() to test for the payload type.
   */
  GetDragDropPayload(): ImGuiPayload {
    return ImGuiPayload.From(Mod.export.ImGui_GetDragDropPayload());
  },
  /**
   * \/\/ Disabling [BETA API]
   * \/\/ - Disable all user interactions and dim items visuals (applying style.DisabledAlpha over current colors)
   * \/\/ - Those can be nested but it cannot be used to enable an already disabled section (a single BeginDisabled(true) in the stack is enough to keep everything disabled)
   * \/\/ - Tooltips windows are automatically opted out of disabling. Note that IsItemHovered() by default returns false on disabled items, unless using ImGuiHoveredFlags_AllowWhenDisabled.
   * \/\/ - BeginDisabled(false)\/EndDisabled() essentially does nothing but is provided to facilitate use of boolean expressions (as a micro-optimization: if you have tens of thousands of BeginDisabled(false)\/EndDisabled() pairs, you might want to reformulate your code to avoid making those calls)
   */
  BeginDisabled(disabled: boolean = true): void {
    Mod.export.ImGui_BeginDisabled(disabled);
  },
  EndDisabled(): void {
    Mod.export.ImGui_EndDisabled();
  },
  /**
   * \/\/ Clipping
   * \/\/ - Mouse hovering is affected by ImGui::PushClipRect() calls, unlike direct calls to ImDrawList::PushClipRect() which are render only.
   */
  PushClipRect(
    clip_rect_min: ImVec2,
    clip_rect_max: ImVec2,
    intersect_with_current_clip_rect: boolean,
  ): void {
    Mod.export.ImGui_PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
  },
  PopClipRect(): void {
    Mod.export.ImGui_PopClipRect();
  },

  // \/\/ Focus, Activation

  /**
   * \/\/ make last item the default focused item of a newly appearing window.
   */
  SetItemDefaultFocus(): void {
    Mod.export.ImGui_SetItemDefaultFocus();
  },
  /**
   * \/\/ focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget.
   */
  SetKeyboardFocusHere(offset: number = 0): void {
    Mod.export.ImGui_SetKeyboardFocusHere(offset);
  },

  // \/\/ Keyboard\/Gamepad Navigation

  /**
   * \/\/ alter visibility of keyboard\/gamepad cursor. by default: show when using an arrow key, hide when clicking with mouse.
   */
  SetNavCursorVisible(visible: boolean): void {
    Mod.export.ImGui_SetNavCursorVisible(visible);
  },

  // \/\/ Overlapping mode

  /**
   * \/\/ allow next item to be overlapped by a subsequent item. Typically useful with InvisibleButton(), Selectable(), TreeNode() covering an area where subsequent items may need to be added. Note that both Selectable() and TreeNode() have dedicated flags doing this.
   */
  SetNextItemAllowOverlap(): void {
    Mod.export.ImGui_SetNextItemAllowOverlap();
  },

  // \/\/ Item\/Widgets Utilities and Query Functions
  // \/\/ - Most of the functions are referring to the previous Item that has been submitted.
  // \/\/ - See Demo Window under "Widgets->Querying Status" for an interactive visualization of most of those functions.

  /**
   * \/\/ is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options.
   */
  IsItemHovered(flags: ImGuiHoveredFlags = 0): boolean {
    return Mod.export.ImGui_IsItemHovered(flags);
  },
  /**
   * \/\/ is the last item active? (e.g. button being held, text field being edited. This will continuously return true while holding mouse button on an item. Items that don't interact will always return false)
   */
  IsItemActive(): boolean {
    return Mod.export.ImGui_IsItemActive();
  },
  /**
   * \/\/ is the last item focused for keyboard\/gamepad navigation?
   */
  IsItemFocused(): boolean {
    return Mod.export.ImGui_IsItemFocused();
  },
  /**
   * \/\/ is the last item hovered and mouse clicked on? (**)  == IsMouseClicked(mouse_button) && IsItemHovered()Important. (**) this is NOT equivalent to the behavior of e.g. Button(). Read comments in function definition.
   */
  IsItemClicked(mouse_button: ImGuiMouseButton = 0): boolean {
    return Mod.export.ImGui_IsItemClicked(mouse_button);
  },
  /**
   * \/\/ is the last item visible? (items may be out of sight because of clipping\/scrolling)
   */
  IsItemVisible(): boolean {
    return Mod.export.ImGui_IsItemVisible();
  },
  /**
   * \/\/ did the last item modify its underlying value this frame? or was pressed? This is generally the same as the "bool" return value of many widgets.
   */
  IsItemEdited(): boolean {
    return Mod.export.ImGui_IsItemEdited();
  },
  /**
   * \/\/ was the last item just made active (item was previously inactive).
   */
  IsItemActivated(): boolean {
    return Mod.export.ImGui_IsItemActivated();
  },
  /**
   * \/\/ was the last item just made inactive (item was previously active). Useful for Undo\/Redo patterns with widgets that require continuous editing.
   */
  IsItemDeactivated(): boolean {
    return Mod.export.ImGui_IsItemDeactivated();
  },
  /**
   * \/\/ was the last item just made inactive and made a value change when it was active? (e.g. Slider\/Drag moved). Useful for Undo\/Redo patterns with widgets that require continuous editing. Note that you may get false positives (some widgets such as Combo()\/ListBox()\/Selectable() will return true even when clicking an already selected item).
   */
  IsItemDeactivatedAfterEdit(): boolean {
    return Mod.export.ImGui_IsItemDeactivatedAfterEdit();
  },
  /**
   * \/\/ was the last item open state toggled? set by TreeNode().
   */
  IsItemToggledOpen(): boolean {
    return Mod.export.ImGui_IsItemToggledOpen();
  },
  /**
   * \/\/ is any item hovered?
   */
  IsAnyItemHovered(): boolean {
    return Mod.export.ImGui_IsAnyItemHovered();
  },
  /**
   * \/\/ is any item active?
   */
  IsAnyItemActive(): boolean {
    return Mod.export.ImGui_IsAnyItemActive();
  },
  /**
   * \/\/ is any item focused?
   */
  IsAnyItemFocused(): boolean {
    return Mod.export.ImGui_IsAnyItemFocused();
  },
  /**
   * \/\/ get ID of last item (~~ often same ImGui::GetID(label) beforehand)
   */
  GetItemID(): ImGuiID {
    return Mod.export.ImGui_GetItemID();
  },
  /**
   * \/\/ get upper-left bounding rectangle of the last item (screen space)
   */
  GetItemRectMin(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetItemRectMin());
  },
  /**
   * \/\/ get lower-right bounding rectangle of the last item (screen space)
   */
  GetItemRectMax(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetItemRectMax());
  },
  /**
   * \/\/ get size of last item
   */
  GetItemRectSize(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetItemRectSize());
  },
  /**
   * \/\/ get generic flags of last item
   */
  GetItemFlags(): ImGuiItemFlags {
    return Mod.export.ImGui_GetItemFlags();
  },

  // \/\/ Viewports
  // \/\/ - Currently represents the Platform Window created by the application which is hosting our Dear ImGui windows.
  // \/\/ - In 'docking' branch with multi-viewport enabled, we extend this concept to have multiple active viewports.
  // \/\/ - In the future we will extend this concept further to also represent Platform Monitor and support a "no main platform window" operation mode.

  /**
   * \/\/ return primary\/default viewport. This can never be NULL.
   */
  GetMainViewport(): ImGuiViewport {
    return ImGuiViewport.From(Mod.export.ImGui_GetMainViewport());
  },

  // \/\/ Background\/Foreground Draw Lists

  /**
   * \/\/ get background draw list for the given viewport or viewport associated to the current window. this draw list will be the first rendering one. Useful to quickly draw shapes\/text behind dear imgui contents.
   */
  GetBackgroundDrawList(viewport: ImGuiViewport | null = null): ImDrawList {
    return ImDrawList.From(Mod.export.ImGui_GetBackgroundDrawList(viewport?.ptr ?? null));
  },
  /**
   * \/\/ get foreground draw list for the given viewport or viewport associated to the current window. this draw list will be the top-most rendered one. Useful to quickly draw shapes\/text over dear imgui contents.
   */
  GetForegroundDrawList(viewport: ImGuiViewport | null = null): ImDrawList {
    return ImDrawList.From(Mod.export.ImGui_GetForegroundDrawList(viewport?.ptr ?? null));
  },

  // \/\/ Miscellaneous Utilities

  /**
   * \/\/ test if rectangle (of given size, starting from cursor position) is visible \/ not clipped.
   */
  IsRectVisibleBySize(size: ImVec2): boolean {
    return Mod.export.ImGui_IsRectVisibleBySize(size);
  },
  /**
   * \/\/ test if rectangle (in screen space) is visible \/ not clipped. to perform coarse clipping on user's side.
   */
  IsRectVisible(rect_min: ImVec2, rect_max: ImVec2): boolean {
    return Mod.export.ImGui_IsRectVisible(rect_min, rect_max);
  },
  /**
   * \/\/ get global imgui time. incremented by io.DeltaTime every frame.
   */
  GetTime(): number {
    return Mod.export.ImGui_GetTime();
  },
  /**
   * \/\/ get global imgui frame count. incremented by 1 every frame.
   */
  GetFrameCount(): number {
    return Mod.export.ImGui_GetFrameCount();
  },
  /**
   * \/\/ you may use this when creating your own ImDrawList instances.
   */
  GetDrawListSharedData(): ImDrawListSharedData {
    return ImDrawListSharedData.From(Mod.export.ImGui_GetDrawListSharedData());
  },
  /**
   * \/\/ get a string corresponding to the enum value (for display, saving, etc.).
   */
  GetStyleColorName(idx: ImGuiCol): string {
    return Mod.export.ImGui_GetStyleColorName(idx);
  },
  /**
   * \/\/ Text Utilities
   */
  CalcTextSize(
    text: string,
    text_end: string = "",
    hide_text_after_double_hash: boolean = false,
    wrap_width: number = -1.0,
  ): ImVec2 {
    return ImVec2.From(
      Mod.export.ImGui_CalcTextSize(text, text_end, hide_text_after_double_hash, wrap_width),
    );
  },
  /**
   * \/\/ Color Utilities
   */
  ColorConvertU32ToFloat4(in_: ImU32): ImVec4 {
    return ImVec4.From(Mod.export.ImGui_ColorConvertU32ToFloat4(in_));
  },
  ColorConvertFloat4ToU32(in_: ImVec4): ImU32 {
    return Mod.export.ImGui_ColorConvertFloat4ToU32(in_);
  },
  ColorConvertRGBtoHSV(
    r: number,
    g: number,
    b: number,
    out_h: [number],
    out_s: [number],
    out_v: [number],
  ): void {
    Mod.export.ImGui_ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v);
  },
  ColorConvertHSVtoRGB(
    h: number,
    s: number,
    v: number,
    out_r: [number],
    out_g: [number],
    out_b: [number],
  ): void {
    Mod.export.ImGui_ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b);
  },

  // \/\/ Inputs Utilities: Raw Keyboard\/Mouse\/Gamepad Access
  // \/\/ - Consider using the Shortcut() function instead of IsKeyPressed()\/IsKeyChordPressed()! Shortcut() is easier to use and better featured (can do focus routing check).
  // \/\/ - the ImGuiKey enum contains all possible keyboard, mouse and gamepad inputs (e.g. ImGuiKey_A, ImGuiKey_MouseLeft, ImGuiKey_GamepadDpadUp...).
  // \/\/ - (legacy: before v1.87 (2022-02), we used ImGuiKey < 512 values to carry native\/user indices as defined by each backends. This was obsoleted in 1.87 (2022-02) and completely removed in 1.91.5 (2024-11). See https:\/\/github.com\/ocornut\/imgui\/issues\/4921)

  /**
   * \/\/ is key being held.
   */
  IsKeyDown(key: ImGuiKey): boolean {
    return Mod.export.ImGui_IsKeyDown(key);
  },
  /**
   * \/\/ was key pressed (went from !Down to Down)? Repeat rate uses io.KeyRepeatDelay \/ KeyRepeatRate.
   */
  IsKeyPressed(key: ImGuiKey, repeat: boolean = true): boolean {
    return Mod.export.ImGui_IsKeyPressed(key, repeat);
  },
  /**
   * \/\/ was key released (went from Down to !Down)?
   */
  IsKeyReleased(key: ImGuiKey): boolean {
    return Mod.export.ImGui_IsKeyReleased(key);
  },
  /**
   * \/\/ was key chord (mods + key) pressed, e.g. you can pass 'ImGuiMod_Ctrl | ImGuiKey_S' as a key-chord. This doesn't do any routing or focus check, please consider using Shortcut() function instead.
   */
  IsKeyChordPressed(key_chord: ImGuiKeyChord): boolean {
    return Mod.export.ImGui_IsKeyChordPressed(key_chord);
  },
  /**
   * \/\/ uses provided repeat rate\/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate
   */
  GetKeyPressedAmount(key: ImGuiKey, repeat_delay: number, rate: number): number {
    return Mod.export.ImGui_GetKeyPressedAmount(key, repeat_delay, rate);
  },
  /**
   * \/\/ [DEBUG] returns English name of the key. Those names are provided for debugging purpose and are not meant to be saved persistently nor compared.
   */
  GetKeyName(key: ImGuiKey): string {
    return Mod.export.ImGui_GetKeyName(key);
  },
  /**
   * \/\/ Override io.WantCaptureKeyboard flag next frame (said flag is left for your application to handle, typically when true it instructs your app to ignore inputs). e.g. force capture keyboard when your widget is being hovered. This is equivalent to setting "io.WantCaptureKeyboard = want_capture_keyboard"; after the next NewFrame() call.
   */
  SetNextFrameWantCaptureKeyboard(want_capture_keyboard: boolean): void {
    Mod.export.ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard);
  },
  /**
   * \/\/ Inputs Utilities: Shortcut Testing & Routing
   * \/\/ - Typical use is e.g.: 'if (ImGui::Shortcut(ImGuiMod_Ctrl | ImGuiKey_S)) { ... }'.
   * \/\/ - Flags: Default route use ImGuiInputFlags_RouteFocused, but see ImGuiInputFlags_RouteGlobal and other options in ImGuiInputFlags_!
   * \/\/ - Flags: Use ImGuiInputFlags_Repeat to support repeat.
   * \/\/ - ImGuiKeyChord = a ImGuiKey + optional ImGuiMod_Alt\/ImGuiMod_Ctrl\/ImGuiMod_Shift\/ImGuiMod_Super.
   * \/\/       ImGuiKey_C                          \/\/ Accepted by functions taking ImGuiKey or ImGuiKeyChord arguments
   * \/\/       ImGuiMod_Ctrl | ImGuiKey_C          \/\/ Accepted by functions taking ImGuiKeyChord arguments
   * \/\/   only ImGuiMod_XXX values are legal to combine with an ImGuiKey. You CANNOT combine two ImGuiKey values.
   * \/\/ - The general idea is that several callers may register interest in a shortcut, and only one owner gets it.
   * \/\/      Parent   -> call Shortcut(Ctrl+S)    \/\/ When Parent is focused, Parent gets the shortcut.
   * \/\/        Child1 -> call Shortcut(Ctrl+S)    \/\/ When Child1 is focused, Child1 gets the shortcut (Child1 overrides Parent shortcuts)
   * \/\/        Child2 -> no call                  \/\/ When Child2 is focused, Parent gets the shortcut.
   * \/\/   The whole system is order independent, so if Child1 makes its calls before Parent, results will be identical.
   * \/\/   This is an important property as it facilitate working with foreign code or larger codebase.
   * \/\/ - To understand the difference:
   * \/\/   - IsKeyChordPressed() compares mods and call IsKeyPressed()
   * \/\/     -> the function has no side-effect.
   * \/\/   - Shortcut() submits a route, routes are resolved, if it currently can be routed it calls IsKeyChordPressed()
   * \/\/     -> the function has (desirable) side-effects as it can prevents another call from getting the route.
   * \/\/ - Visualize registered routes in 'Metrics\/Debugger->Inputs'.
   */
  Shortcut(key_chord: ImGuiKeyChord, flags: ImGuiInputFlags = 0): boolean {
    return Mod.export.ImGui_Shortcut(key_chord, flags);
  },
  SetNextItemShortcut(key_chord: ImGuiKeyChord, flags: ImGuiInputFlags = 0): void {
    Mod.export.ImGui_SetNextItemShortcut(key_chord, flags);
  },

  // \/\/ Inputs Utilities: Key\/Input Ownership [BETA]
  // \/\/ - One common use case would be to allow your items to disable standard inputs behaviors such
  // \/\/   as Tab or Alt key handling, Mouse Wheel scrolling, etc.
  // \/\/   e.g. Button(...); SetItemKeyOwner(ImGuiKey_MouseWheelY); to make hovering\/activating a button disable wheel for scrolling.
  // \/\/ - Reminder ImGuiKey enum include access to mouse buttons and gamepad, so key ownership can apply to them.
  // \/\/ - Many related features are still in imgui_internal.h. For instance, most IsKeyXXX()\/IsMouseXXX() functions have an owner-id-aware version.

  /**
   * \/\/ Set key owner to last item ID if it is hovered or active. Equivalent to 'if (IsItemHovered() || IsItemActive()) { SetKeyOwner(key, GetItemID());'.
   */
  SetItemKeyOwner(key: ImGuiKey): void {
    Mod.export.ImGui_SetItemKeyOwner(key);
  },

  // \/\/ Inputs Utilities: Mouse
  // \/\/ - To refer to a mouse button, you may use named enums in your code e.g. ImGuiMouseButton_Left, ImGuiMouseButton_Right.
  // \/\/ - You can also use regular integer: it is forever guaranteed that 0=Left, 1=Right, 2=Middle.
  // \/\/ - Dragging operations are only reported after mouse has moved a certain distance away from the initial clicking position (see 'lock_threshold' and 'io.MouseDraggingThreshold')

  /**
   * \/\/ is mouse button held?
   */
  IsMouseDown(button: ImGuiMouseButton): boolean {
    return Mod.export.ImGui_IsMouseDown(button);
  },
  /**
   * \/\/ did mouse button clicked? (went from !Down to Down). Same as GetMouseClickedCount() == 1.
   */
  IsMouseClicked(button: ImGuiMouseButton, repeat: boolean = false): boolean {
    return Mod.export.ImGui_IsMouseClicked(button, repeat);
  },
  /**
   * \/\/ did mouse button released? (went from Down to !Down)
   */
  IsMouseReleased(button: ImGuiMouseButton): boolean {
    return Mod.export.ImGui_IsMouseReleased(button);
  },
  /**
   * \/\/ did mouse button double-clicked? Same as GetMouseClickedCount() == 2. (note that a double-click will also report IsMouseClicked() == true)
   */
  IsMouseDoubleClicked(button: ImGuiMouseButton): boolean {
    return Mod.export.ImGui_IsMouseDoubleClicked(button);
  },
  /**
   * \/\/ delayed mouse release (use very sparingly!). Generally used with 'delay >= io.MouseDoubleClickTime' + combined with a 'io.MouseClickedLastCount==1' test. This is a very rarely used UI idiom, but some apps use this: e.g. MS Explorer single click on an icon to rename.
   */
  IsMouseReleasedWithDelay(button: ImGuiMouseButton, delay: number): boolean {
    return Mod.export.ImGui_IsMouseReleasedWithDelay(button, delay);
  },
  /**
   * \/\/ return the number of successive mouse-clicks at the time where a click happen (otherwise 0).
   */
  GetMouseClickedCount(button: ImGuiMouseButton): number {
    return Mod.export.ImGui_GetMouseClickedCount(button);
  },
  /**
   * \/\/ is mouse hovering given bounding rect (in screen space). clipped by current clipping settings, but disregarding of other consideration of focus\/window ordering\/popup-block.
   */
  IsMouseHoveringRect(r_min: ImVec2, r_max: ImVec2, clip: boolean = true): boolean {
    return Mod.export.ImGui_IsMouseHoveringRect(r_min, r_max, clip);
  },
  /**
   * \/\/ by convention we use (-FLT_MAX,-FLT_MAX) to denote that there is no mouse available
   */
  IsMousePosValid(mouse_pos: ImVec2 | null = null): boolean {
    return Mod.export.ImGui_IsMousePosValid(mouse_pos);
  },
  /**
   * \/\/ [WILL OBSOLETE] is any mouse button held? This was designed for backends, but prefer having backend maintain a mask of held mouse buttons, because upcoming input queue system will make this invalid.
   */
  IsAnyMouseDown(): boolean {
    return Mod.export.ImGui_IsAnyMouseDown();
  },
  /**
   * \/\/ shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls
   */
  GetMousePos(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetMousePos());
  },
  /**
   * \/\/ retrieve mouse position at the time of opening popup we have BeginPopup() into (helper to avoid user backing that value themselves)
   */
  GetMousePosOnOpeningCurrentPopup(): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetMousePosOnOpeningCurrentPopup());
  },
  /**
   * \/\/ is mouse dragging? (uses io.MouseDraggingThreshold if lock_threshold < 0.0f)
   */
  IsMouseDragging(button: ImGuiMouseButton, lock_threshold: number = -1.0): boolean {
    return Mod.export.ImGui_IsMouseDragging(button, lock_threshold);
  },
  /**
   * \/\/ return the delta from the initial clicking position while the mouse button is pressed or was just released. This is locked and return 0.0f until the mouse moves past a distance threshold at least once (uses io.MouseDraggingThreshold if lock_threshold < 0.0f)
   */
  GetMouseDragDelta(button: ImGuiMouseButton = 0, lock_threshold: number = -1.0): ImVec2 {
    return ImVec2.From(Mod.export.ImGui_GetMouseDragDelta(button, lock_threshold));
  },
  /**
   * \/\/
   */
  ResetMouseDragDelta(button: ImGuiMouseButton = 0): void {
    Mod.export.ImGui_ResetMouseDragDelta(button);
  },
  /**
   * \/\/ get desired mouse cursor shape. Important: reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you
   */
  GetMouseCursor(): ImGuiMouseCursor {
    return Mod.export.ImGui_GetMouseCursor();
  },
  /**
   * \/\/ set desired mouse cursor shape
   */
  SetMouseCursor(cursor_type: ImGuiMouseCursor): void {
    Mod.export.ImGui_SetMouseCursor(cursor_type);
  },
  /**
   * \/\/ Override io.WantCaptureMouse flag next frame (said flag is left for your application to handle, typical when true it instructs your app to ignore inputs). This is equivalent to setting "io.WantCaptureMouse = want_capture_mouse;" after the next NewFrame() call.
   */
  SetNextFrameWantCaptureMouse(want_capture_mouse: boolean): void {
    Mod.export.ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse);
  },
  /**
   * \/\/ Clipboard Utilities
   * \/\/ - Also see the LogToClipboard() function to capture GUI into clipboard, or easily output text data to the clipboard.
   */
  GetClipboardText(): string {
    return Mod.export.ImGui_GetClipboardText();
  },
  SetClipboardText(text: string): void {
    Mod.export.ImGui_SetClipboardText(text);
  },
  /**
   * \/\/ call after CreateContext() and before the first call to NewFrame() to provide .ini data from your own data source.
   */
  LoadIniSettingsFromMemory(ini_data: string, ini_size: number = 0): void {
    Mod.export.ImGui_LoadIniSettingsFromMemory(ini_data, ini_size);
  },
  /**
   * \/\/ return a zero-terminated string with the .ini data which you can save by your own mean. call when io.WantSaveIniSettings is set, then save data by your own mean and clear io.WantSaveIniSettings.
   */
  SaveIniSettingsToMemory(out_ini_size: [number] | null = null): string {
    return Mod.export.ImGui_SaveIniSettingsToMemory(out_ini_size);
  },
  /**
   * \/\/ Debug Utilities
   * \/\/ - Your main debugging friend is the ShowMetricsWindow() function.
   * \/\/ - Interactive tools are all accessible from the 'Dear ImGui Demo->Tools' menu.
   * \/\/ - Read https:\/\/github.com\/ocornut\/imgui\/wiki\/Debug-Tools for a description of all available debug tools.
   */
  DebugTextEncoding(text: string): void {
    Mod.export.ImGui_DebugTextEncoding(text);
  },
  DebugFlashStyleColor(idx: ImGuiCol): void {
    Mod.export.ImGui_DebugFlashStyleColor(idx);
  },
  DebugStartItemPicker(): void {
    Mod.export.ImGui_DebugStartItemPicker();
  },
  /**
   * \/\/ This is called by IMGUI_CHECKVERSION() macro.
   */
  DebugCheckVersionAndDataLayout(
    version_str: string,
    sz_io: number,
    sz_style: number,
    sz_vec2: number,
    sz_vec4: number,
    sz_drawvert: number,
    sz_drawidx: number,
  ): boolean {
    return Mod.export.ImGui_DebugCheckVersionAndDataLayout(
      version_str,
      sz_io,
      sz_style,
      sz_vec2,
      sz_vec4,
      sz_drawvert,
      sz_drawidx,
    );
  },
  DebugLog(fmt: string): void {
    Mod.export.ImGui_DebugLog(fmt);
  },

  // \/\/ (Optional) Platform\/OS interface for multi-viewport support
  // \/\/ Read comments around the ImGuiPlatformIO structure for more details.
  // \/\/ Note: You may use GetWindowViewport() to get the current viewport of the current window.

  /**
   * \/\/ call in main loop. will call CreateWindow\/ResizeWindow\/etc. platform functions for each secondary viewport, and DestroyWindow for each inactive viewport.
   */
  UpdatePlatformWindows(): void {
    Mod.export.ImGui_UpdatePlatformWindows();
  },
  /**
   * \/\/ call in main loop. will call RenderWindow\/SwapBuffers platform functions for each secondary viewport which doesn't have the ImGuiViewportFlags_Minimized flag set. May be reimplemented by user for custom rendering needs.
   */
  RenderPlatformWindowsDefault(
    platform_render_arg: any | null = null,
    renderer_render_arg: any | null = null,
  ): void {
    Mod.export.ImGui_RenderPlatformWindowsDefault(platform_render_arg, renderer_render_arg);
  },
  /**
   * \/\/ call DestroyWindow platform functions for all viewports. call from backend Shutdown() if you need to close platform windows before imgui shutdown. otherwise will be called by DestroyContext().
   */
  DestroyPlatformWindows(): void {
    Mod.export.ImGui_DestroyPlatformWindows();
  },
  /**
   * \/\/ this is a helper for backends.
   */
  FindViewportByID(viewport_id: ImGuiID): ImGuiViewport {
    return ImGuiViewport.From(Mod.export.ImGui_FindViewportByID(viewport_id));
  },
  /**
   * \/\/ this is a helper for backends. the type platform_handle is decided by the backend (e.g. HWND, MyWindow*, GLFWwindow* etc.)
   */
  FindViewportByPlatformHandle(platform_handle: any): ImGuiViewport {
    return ImGuiViewport.From(Mod.export.ImGui_FindViewportByPlatformHandle(platform_handle));
  },
};

export const ImGuiImplOpenGL3 = {
  Init(): boolean {
    return Mod.export.cImGui_ImplOpenGL3_Init();
  },

  Shutdown(): void {
    Mod.export.cImGui_ImplOpenGL3_Shutdown();
  },

  NewFrame(): void {
    Mod.export.cImGui_ImplOpenGL3_NewFrame();
  },

  RenderDrawData(draw_data: ImDrawData): void {
    Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data.ptr);
  },
};

export function loadTextureWebGL(
  glContext: WebGLRenderingContext | WebGL2RenderingContext,
  data?: HTMLImageElement | Uint8Array,
  options: TextureOptions = {},
): ImTextureRef {
  const gl = glContext;

  const processTexture = () => {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (!data) {
      const data = new Uint8Array([0, 0, 0, 0]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }

    if (data instanceof HTMLImageElement) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }

    if (data instanceof Uint8Array) {
      const width = options.width ?? 1;
      const height = options.height ?? 1;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }

    return texture;
  };

  const texture = options.processFn
    ? (options.processFn(data, options) as WebGLTexture)
    : processTexture();

  const id = Mod.export.GL.getNewId(Mod.export.GL.textures);
  Mod.export.GL.textures[id] = texture;

  if (options.ref) {
    options.ref._TexID = id;
    return options.ref;
  }

  return new ImTextureRef(id);
}

export const ImGuiImplWGPU = {
  Init(device: GPUDevice): boolean {
    const handle = Mod.export.WebGPU.importJsDevice(device);
    return Mod.export.cImGui_ImplWGPU_Init(handle);
  },

  Shutdown(): void {
    Mod.export.cImGui_ImplWGPU_Shutdown();
  },

  NewFrame(): void {
    Mod.export.cImGui_ImplWGPU_NewFrame();
  },

  RenderDrawData(draw_data: ImDrawData, pass_encoder: GPURenderPassEncoder): void {
    const handle = Mod.export.WebGPU.importJsRenderPassEncoder(pass_encoder);
    Mod.export.cImGui_ImplWGPU_RenderDrawData(draw_data.ptr, handle);
  },
};

export function loadTextureWebGPU(
  device: GPUDevice,
  data?: HTMLImageElement | Uint8Array,
  options: TextureOptions = {},
): ImTextureRef {
  const width = data instanceof HTMLImageElement ? data.width : (options.width ?? 1);
  const height = data instanceof HTMLImageElement ? data.height : (options.height ?? 1);

  const processTexture = () => {
    const texture = device.createTexture({
      usage: 0x02 | 0x04 | 0x10,
      dimension: "2d",
      size: { width, height, depthOrArrayLayers: 1 },
      format: "rgba8unorm",
      mipLevelCount: 1,
      sampleCount: 1,
    });

    if (!data) {
      const data = new Uint8Array([0, 0, 0, 0]);
      device.queue.writeTexture(
        { texture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 }, aspect: "all" },
        data,
        {},
        { width, height, depthOrArrayLayers: 1 },
      );
    }

    if (data instanceof HTMLImageElement) {
      device.queue.copyExternalImageToTexture(
        { source: data },
        { texture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 }, aspect: "all" },
        { width: data.width, height: data.height, depthOrArrayLayers: 1 },
      );
    }

    if (data instanceof Uint8Array) {
      device.queue.writeTexture(
        { texture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 }, aspect: "all" },
        data.buffer,
        {},
        { width, height, depthOrArrayLayers: 1 },
      );
    }

    const textureView = texture.createView({
      format: "rgba8unorm",
      dimension: "2d",
      baseMipLevel: 0,
      mipLevelCount: 1,
      baseArrayLayer: 0,
      arrayLayerCount: 1,
      aspect: "all",
    });

    return [texture, textureView];
  };

  const [texture, textureView] = options.processFn
    ? (options.processFn(data, options) as [GPUTexture, GPUTextureView])
    : processTexture();

  Mod.export.WebGPU.importJsTexture(texture);
  const id = Mod.export.WebGPU.importJsTextureView(textureView);

  if (options.ref) {
    options.ref._TexID = id;
    return options.ref;
  }

  return new ImTextureRef(id);
}

/**
 * Map of browser mouse button values to ImGui mouse button enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}.
 */
const MOUSE_BUTTON_MAP = {
  0: ImGui.MouseButton.Left,
  1: ImGui.MouseButton.Middle,
  2: ImGui.MouseButton.Right,
} as const;

/**
 * Map of ImGui mouse cursor enums to CSS cursor styles.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor}.
 */
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
} as const;

/**
 * Map of browser keyboard key values to ImGui key enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MAP = {
  "0": ImGui.Key._0,
  "1": ImGui.Key._1,
  "2": ImGui.Key._2,
  "3": ImGui.Key._3,
  "4": ImGui.Key._4,
  "5": ImGui.Key._5,
  "6": ImGui.Key._6,
  "7": ImGui.Key._7,
  "8": ImGui.Key._8,
  "9": ImGui.Key._9,

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
  Meta: ImGui.Key._LeftSuper,
} as const;

/**
 * Map of browser keyboard modifier key values to ImGui key modifier enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MODIFIER_MAP = {
  Control: ImGui.Key.ImGuiMod_Ctrl,
  Shift: ImGui.Key.ImGuiMod_Shift,
  Alt: ImGui.Key.ImGuiMod_Alt,
  Super: ImGui.Key.ImGuiMod_Super,
  Meta: ImGui.Key.ImGuiMod_Super,
} as const;

const metaKeyInfo = {
  isDown: false,
};

/**
 * Forwards keyboard events to Dear ImGui. This is both used for normal keyboard events as well as
 * for the virtual keyboard, see {@linkcode setupKeyboardIO} and {@linkcode setupTouchIO}.
 *
 * @param event The keyboard event to handle.
 * @param keyDown Whether the key is being pressed or released.
 * @param io The {@linkcode ImGuiIO} object to forward the event to.
 */
const handleKeyboardEvent = (event: KeyboardEvent, keyDown: boolean, io: ImGuiIO) => {
  if (!Object.hasOwn(KEYBOARD_MAP, event.key)) {
    return;
  }

  if (event.key === "Meta") {
    metaKeyInfo.isDown = keyDown;
  }

  io.AddKeyEvent(KEYBOARD_MAP[event.key as keyof typeof KEYBOARD_MAP], keyDown);

  // NOTE: We lift the key when the meta key is pressed, because on macOS the browsers
  // 'keyup' events are not fired for other keys when meta key is held down.
  // see: https://stackoverflow.com/q/11818637.
  if (metaKeyInfo.isDown) {
    io.AddKeyEvent(KEYBOARD_MAP[event.key as keyof typeof KEYBOARD_MAP], false);
  }

  const modifier = KEYBOARD_MODIFIER_MAP[event.key as keyof typeof KEYBOARD_MODIFIER_MAP];
  if (modifier) {
    io.AddKeyEvent(modifier, keyDown);
  }

  if (event.key.length === 1 && keyDown) {
    io.AddInputCharactersUTF8(event.key);
  }
};

const setDisplayProperties = (canvas: HTMLCanvasElement) => {
  const io = ImGui.GetIO();
  const width = Math.floor(canvas.clientWidth);
  const height = Math.floor(canvas.clientHeight);
  io.DisplaySize = new ImVec2(width, height);
};

/**
 * Handles mouse button events.
 *
 * @param event The mouse event to handle.
 * @param isDown Whether the button is being pressed or released.
 * @param io The {@linkcode ImGuiIO} object to forward the event to.
 */
const handleMouseButtonEvent = (event: MouseEvent, isDown: boolean, io: ImGuiIO) => {
  if (!Object.hasOwn(MOUSE_BUTTON_MAP, event.button)) {
    return;
  }

  io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[event.button as keyof typeof MOUSE_BUTTON_MAP], isDown);
};

/**
 * Sets up mouse key, wheel input and movement. Also handles cursor style changes.
 *
 * @param canvas The canvas element to set up.
 */
const setupMouseIO = (canvas: HTMLCanvasElement) => {
  const io = ImGui.GetIO();
  const scrollSpeed = 0.01;

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    io.AddMousePosEvent(e.clientX - rect.left, e.clientY - rect.top);

    canvas.style.cursor = MOUSE_CURSOR_MAP[ImGui.GetMouseCursor()];
  });

  canvas.addEventListener("pointerdown", (e) => handleMouseButtonEvent(e, true, io));
  canvas.addEventListener("pointerup", (e) => handleMouseButtonEvent(e, false, io));
  canvas.addEventListener("wheel", (e) =>
    io.AddMouseWheelEvent(-e.deltaX * scrollSpeed, -e.deltaY * scrollSpeed),
  );
};

/**
 * Sets up keyboard input handling. Browser keyboard events are handled by
 * {@linkcode handleKeyboardEvent}.
 *
 * @param canvas The canvas element to set up.
 */
const setupKeyboardIO = (canvas: HTMLCanvasElement) => {
  const io = ImGui.GetIO();

  // Swap super and ctrl keys on macOS.
  if (navigator.userAgent.includes("Mac")) {
    io.ConfigMacOSXBehaviors = true;
  }

  // TODO: Fix too fast repeated inputs (Backspace, Delete...).
  canvas.addEventListener("keydown", (e) => handleKeyboardEvent(e, true, io));
  canvas.addEventListener("keyup", (e) => handleKeyboardEvent(e, false, io));
};

/**
 * Sets up touch input handling as well as showing the virtual keyboard. Note the following:
 *
 * - Single-finger touches are treated as mouse left clicks.
 * - Two-finger touches are treated as mouse scrolls.
 *
 * @param canvas The canvas element to set up.
 */
const setupTouchIO = (canvas: HTMLCanvasElement) => {
  const io = ImGui.GetIO();
  const scrollSpeed = 0.02;
  let lastPos = { x: 0, y: 0 };

  const handleTouchEvent = (event: TouchEvent, isButtonDown?: boolean) => {
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

  const keyDownHandler = (e: KeyboardEvent) => handleKeyboardEvent(e, true, io);
  const keyUpHandler = (e: KeyboardEvent) => handleKeyboardEvent(e, false, io);
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
};

/**
 * Sets up the clipboard functionality to work between the browser and Dear ImGui.
 */
const setupClipboardIO = () => {
  const getClipboard = (): string => {
    return State.clipboardData;
  };

  const setClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    State.clipboardData = text;
  };

  Mod.export.SetupClipboardFunctions(getClipboard, setClipboard);

  document.addEventListener("paste", (e) => {
    State.clipboardData = e.clipboardData?.getData("text/plain") ?? "";
  });
};

/**
 * Sets up Dear ImGui for the browser. This includes:
 * - Setting up the canvas and resize events.
 * - Setting up mouse input, movement and cursor handling.
 * - Setting up keyboard input handling.
 * - Setting up touch input handling.
 *
 * This function is called by {@linkcode ImGuiImplWeb.Init}.
 *
 * @param canvas The canvas element to set up.
 */
const setupBrowserIO = (canvas: HTMLCanvasElement) => {
  const io = ImGui.GetIO();
  io.BackendFlags = ImGui.BackendFlags.HasMouseCursors;

  canvas.tabIndex = 1;
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("focus", () => io.AddFocusEvent(true));
  canvas.addEventListener("blur", () => io.AddFocusEvent(false));

  setDisplayProperties(canvas);

  setupMouseIO(canvas);
  setupKeyboardIO(canvas);
  setupTouchIO(canvas);
  setupClipboardIO();

  Mod.export.SetupIniSettings();
};

/**
 * Object containing some state information for jsimgui. Users most likely don't need to worry
 * about this.
 */
export const State = {
  canvas: null as HTMLCanvasElement | null,
  device: null as GPUDevice | null,
  backend: null as "webgl" | "webgl2" | "webgpu" | null,

  beginRenderFn: null as (() => void) | null,
  endRenderFn: null as ((passEncoder?: GPURenderPassEncoder) => void) | null,

  clipboardData: "" as string,

  saveIniSettingsFn: null as ((iniData: string) => void) | null,
  loadIniSettingsFn: null as (() => string) | null,
};

/**
 * Options for loading a texture.
 */
export interface TextureOptions {
  /**
   * The texture reference to update. Only required if you want to update an existing texture.
   */
  ref?: ImTextureRef;

  /**
   * The width of the texture. This needs to be specified if the texture is loaded
   * from a `Uint8Array`.
   */
  width?: number;

  /**
   * The height of the texture. This needs to be specified if the texture is loaded
   * from a `Uint8Array`.
   */
  height?: number;

  /**
   * Custom load function to use for loading the texture/image. You can use this if you require
   * additional processing. Note that you will need to write backend-specific code for this.
   *
   * @param data The image data to load.
   * @param options The options for loading the texture.
   * @returns The ImTextureID of the loaded image.
   */
  processFn?: (
    data?: HTMLImageElement | Uint8Array,
    options?: TextureOptions,
  ) => WebGLTexture | [GPUTexture, GPUTextureView];
}

/**
 * Object containing memory information of the WASM heap, mallinfo and stack.
 */
interface MemoryInfo {
  heap: {
    size: number;
    max: number;
    sbrk_ptr: number;
  };
  mall: {
    arena: number;
    ordblks: number;
    smblks: number;
    hblks: number;
    hblkhd: number;
    usmblks: number;
    fsmblks: number;
    uordblks: number;
    fordblks: number;
    keepcost: number;
  };
  stack: {
    base: number;
    end: number;
    current: number;
    free: number;
  };
}

/**
 * Initialization options for jsimgui used in {@linkcode ImGuiImplWeb.Init}.
 */
export interface InitOptions {
  /**
   * The canvas element to render Dear ImGui on.
   */
  canvas: HTMLCanvasElement;

  /**
   * The WebGPU device used for rendering. This is only required when using the WebGPU backend.
   */
  device?: GPUDevice;

  /**
   * Specify the rendering backend to use. If not specified, will be inferred from the canvas or
   * from {@linkcode device}.
   */
  backend?: "webgl" | "webgl2" | "webgpu";

  /**
   * The font loader and rasterizer to use for loading fonts. Can be one of the following:
   *
   * - `truetype` (stb_truetype) is the default option.
   * - `freetype` (FreeType) is an alternative option which supports more features than `truetype`
   * but this also loads an increased WASM file (+500kb).
   *
   * Default is `truetype`.
   */
  fontLoader?: "truetype" | "freetype";

  /**
   * Whether to enable Dear ImGui extensions (imnodes, implot, ...).
   */
  extensions?: boolean;

  /**
   * Custom path to the emscripten loader script. If not provided, will be constructed
   * automatically. If you use jsimgui via a package manager or CDN, you will most likely not
   * need to worry about this.
   */
  loaderPath?: string;
}

/**
 * This infers the backend to use for the given configuration.
 *
 * @param canvas The canvas element to infer the backend from.
 * @param device The WebGPU device to use. This overrides the backend to WebGPU.
 * @param backend The backend to use. This will explicitly use this backend.
 * @returns The backend to use.
 */
const getUsedBackend = (
  canvas: HTMLCanvasElement,
  device?: GPUDevice,
  backend?: "webgl" | "webgl2" | "webgpu",
): "webgl" | "webgl2" | "webgpu" => {
  if (backend) return backend;
  if (device) return "webgpu";

  const ctx =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("webgpu") ||
    canvas.getContext("2d") ||
    canvas.getContext("bitmaprenderer");

  if (ctx instanceof WebGLRenderingContext) return "webgl";
  if (ctx instanceof WebGL2RenderingContext) return "webgl2";
  if (ctx instanceof GPUCanvasContext) return "webgpu";

  if (ctx instanceof CanvasRenderingContext2D) {
    throw new Error("jsimgui: 2D canvas context is not supported.");
  }
  if (ctx instanceof ImageBitmapRenderingContext) {
    throw new Error("jsimgui: ImageBitmapRenderingContext is not supported.");
  }

  return "webgl2";
};

/**
 * This initializes the WebGL/WebGL2 backend.
 *
 * @param canvas The canvas element to initialize the WebGL/WebGL2 backend on.
 */
const initWebGL = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!ctx) {
    throw new Error("jsimgui: Could not create WebGL/WebGL2 context.");
  }

  const handle = Mod.export.GL.registerContext(
    ctx,
    ctx.getContextAttributes() as WebGLContextAttributes,
  ) as number;

  Mod.export.GL.makeContextCurrent(handle);
  ImGuiImplOpenGL3.Init();

  State.beginRenderFn = () => {
    ImGuiImplOpenGL3.NewFrame();
  };

  State.endRenderFn = () => {
    ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
  };

  State.canvas = canvas;
};

/**
 * This initializes the WebGPU backend.
 *
 * @param canvas The canvas element to initialize the WebGPU backend on.
 * @param device The WebGPU device to use.
 */
const initWebGPU = (canvas: HTMLCanvasElement, device: GPUDevice | undefined) => {
  if (!device) {
    throw new Error("jsimgui: WebGPU device is not provided.");
  }

  ImGuiImplWGPU.Init(device);

  State.beginRenderFn = () => {
    ImGuiImplWGPU.NewFrame();
  };

  State.endRenderFn = (passEncoder?: GPURenderPassEncoder) => {
    ImGuiImplWGPU.RenderDrawData(ImGui.GetDrawData(), passEncoder as GPURenderPassEncoder);
  };

  State.canvas = canvas;
  State.device = device;
};

/**
 * Object providing easy to use functions for initializing jsimgui as well as other things like
 * loading images and fonts (TODO).
 */
export const ImGuiImplWeb = {
  /**
   * Returns the exports and runtime methods of the emscripten module.
   *
   * @returns The emscripten exports object.
   */

  // biome-ignore lint/suspicious/noExplicitAny: _
  GetEmscriptenExports(): any {
    return Mod.export;
  },

  /**
   * Returns memory information of the WASM heap, mallinfo and stack.
   *
   * @returns Object containing the memory information.
   */
  GetMemoryInfo(): MemoryInfo {
    return {
      heap: Mod.export.get_wasm_heap_info(),
      mall: Mod.export.get_wasm_mall_info(),
      stack: Mod.export.get_wasm_stack_info(),
    };
  },

  /**
   * Set the callback for saving the Dear ImGui ini settings. The ini settings will be passed as
   * string to the callback.
   *
   * @param fn The function to save the ImGui ini settings.
   */
  SetSaveIniSettingsFn(fn: (iniData: string) => void) {
    State.saveIniSettingsFn = fn;
  },

  /**
   * Set the callback for loading the Dear ImGui ini settings. The callback should return a string
   * of the ini settings. This callback will be called in the {@linkcode ImGuiImplWeb.Init}
   * function.
   *
   * @param fn The function to load the ImGui ini settings.
   */
  SetLoadIniSettingsFn(fn: () => string) {
    State.loadIniSettingsFn = fn;
  },

  /**
   * Load a texture/image for the current backend.
   *
   * @param data The image or image data to load.
   * @param options The options for loading the texture.
   * @returns The ImTextureRef of the loaded texture.
   */
  LoadTexture(data?: HTMLImageElement | Uint8Array, options: TextureOptions = {}): ImTextureRef {
    return State.backend === "webgpu"
      ? loadTextureWebGPU(State.device as GPUDevice, data, options)
      : loadTextureWebGL(
          State.canvas?.getContext(State.backend as "webgl" | "webgl2") as
            | WebGLRenderingContext
            | WebGL2RenderingContext,
          data,
          options,
        );
  },

  /**
   * Load a font file to the filesystem for the current backend. Add it then using
   * `ImGui.GetIO().Fonts.AddFontFromFileTTF(filename);`
   * @param filename The filename of the font to load.
   * @param fontData The font data to load.
   */
  LoadFont(filename: string, fontData: Uint8Array): void {
    Mod.export.FS.writeFile(filename, fontData);
  },

  /**
   * Begins a new ImGui frame. Call this at the beginning of your render loop.
   */
  BeginRender() {
    setDisplayProperties(State.canvas as HTMLCanvasElement);

    if (ImGui.GetIO().WantSaveIniSettings) {
      State.saveIniSettingsFn?.(ImGui.SaveIniSettingsToMemory());
      ImGui.GetIO().WantSaveIniSettings = false;
    }

    State.beginRenderFn?.();
    ImGui.NewFrame();
  },

  /**
   * Ends the current ImGui frame. Call this at the end of your render loop. The `passEncoder`
   * is only required when using the WebGPU backend.
   *
   * @param passEncoder The WebGPU render pass encoder to use.
   */
  EndRender(passEncoder?: GPURenderPassEncoder) {
    ImGui.Render();
    State.endRenderFn?.(passEncoder);
  },

  /**
   * Initialize Dear ImGui with the specified configuration. This is asynchronous because it
   * waits for the WASM file to be loaded.
   *
   * @param options The initialization options: {@linkcode InitOptions}.
   */
  async Init(options: InitOptions): Promise<void> {
    const {
      canvas,
      device,
      backend,
      fontLoader = "truetype",
      loaderPath,
      extensions = false,
    } = options;

    const usedBackend = getUsedBackend(canvas, device, backend);
    State.backend = usedBackend;

    await Mod.init(fontLoader === "freetype", extensions, loaderPath);

    Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

    ImGui.CreateContext();
    setupBrowserIO(canvas);

    if (State.loadIniSettingsFn) {
      const iniData = State.loadIniSettingsFn() || "";
      ImGui.LoadIniSettingsFromMemory(iniData, iniData.length);
    }

    if (usedBackend === "webgl" || usedBackend === "webgl2") {
      initWebGL(canvas);
      return;
    }

    if (usedBackend === "webgpu") {
      initWebGPU(canvas, device);
      return;
    }
  },
};
