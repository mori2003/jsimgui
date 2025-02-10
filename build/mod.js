/**
 * @file
 * The JavaScript API for jsimgui. Gives access to the ImGui functions, structs and enums.
 * It is using the docking branch of Dear ImGui.
 *
 * @version 0.1.4
 * @author mori2003
 * @license MIT
 *
 * Index:
 * 1. Helpers
 * 2. Enums
 * 3. Typedefs
 * 4. Structs
 * 5. Functions
 * 6. Web Implementation
 *
 * Most of the API is auto-generated, but some implementations are manually overwritten.
 * The bindings are tagged:
 * [Manual] - Manually overwritten bindings.
 * [Auto] - Automatically generated bindings.
 *
 * For source code and more information:
 * @see {@link https://github.com/mori2003/jsimgui|jsimgui}
 */

import MainExport from "./jsimgui.js";

/* -------------------------------------------------------------------------- */
/* 1. Helpers */
/* -------------------------------------------------------------------------- */

/** A singleton class that handles the initialization of the exported main and demo modules. */
export class Mod {
    /** @type {Object | null} A reference to the main WASM module export. */
    static #main;

    /** Initializes and stores the WASM module export. */
    static async initMain() {
        if (this.#main) {
            throw new Error("Main module is already initialized.");
        }

        await MainExport().then((module) => (this.#main = module));
    }

    static get main() {
        if (!this.#main) {
            throw new Error("Main module is not initialized.");
        }

        return this.#main;
    }
}

/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    /** @type {Object | null} A reference to the constructed C++ object. */
    #ref;

    /**
     * Constructs a new C++ object from the WASM module export.
     * @param {string} name
     */
    constructor(name) {
        this.#ref = new Mod.main[name]();
    }

    /**
     * Wraps a reference to a C++ object with a new StructBinding instance.
     * @param {Object} ref
     * @returns {StructBinding}
     */
    static wrap(ref) {
        const wrap = Reflect.construct(this, []);
        wrap.#ref = ref;
        return wrap;
    }

    /**
     * Accesses the underlying C++ object.
     * @returns {Object}
     */
    unwrap() {
        return this.#ref;
    }
}

/* -------------------------------------------------------------------------- */
/* 2. Enums */
/* -------------------------------------------------------------------------- */

/** [Auto] Access to the ImGui enums & flags. */
export const ImEnum = Object.freeze({
    /** [Auto] Flags for ImGui::Begin() */
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

    /** [Auto] Flags for ImGui::BeginChild() */
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

    /** [Auto] Flags for ImGui::PushItemFlag() */
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

    /** [Auto] Flags for ImGui::InputText() */
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

    /** [Auto] Flags for ImGui::TreeNodeEx(), ImGui::CollapsingHeader*() */
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
        /** (WIP) Nav: left direction may move to this TreeNode() from any of its child (items submitted between TreeNode and TreePop) */
        NavLeftJumpsBackHere: 131072,
        CollapsingHeader: 26,
    },

    /** [Auto] Flags for OpenPopup*(), BeginPopupContext*(), IsPopupOpen() functions. */
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

    /** [Auto] Flags for ImGui::Selectable() */
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

    /** [Auto] Flags for ImGui::BeginCombo() */
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

    /** [Auto] Flags for ImGui::BeginTabBar() */
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

    /** [Auto] Flags for ImGui::BeginTabItem() */
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

    /** [Auto] Flags for ImGui::IsWindowFocused() */
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

    /** [Auto] Flags for ImGui::IsItemHovered(), ImGui::IsWindowHovered() */
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

    /** [Auto] Flags for ImGui::DockSpace(), shared\/inherited by child nodes. */
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

    /** [Auto] Flags for ImGui::BeginDragDropSource(), ImGui::AcceptDragDropPayload() */
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

    /** [Auto] A primary data type */
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

    /** [Auto] A cardinal direction */
    Dir: {
        _None: -1,
        _Left: 0,
        _Right: 1,
        _Up: 2,
        _Down: 3,
        _COUNT: 4,
    },

    /** [Auto] A sorting direction */
    SortDirection: {
        _None: 0,
        /** Ascending = 0->9, A->Z etc. */
        _Ascending: 1,
        /** Descending = 9->0, Z->A etc. */
        _Descending: 2,
    },

    /** [Auto] A key identifier (ImGuiKey_XXX or ImGuiMod_XXX value): can represent Keyboard, Mouse and Gamepad values. */
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
        /** Menu (Xbox)      + (Switch)   Start\/Options (PS) */
        _GamepadStart: 631,
        /** View (Xbox)      - (Switch)   Share (PS) */
        _GamepadBack: 632,
        /** X (Xbox)         Y (Switch)   Square (PS)        \/\/ Tap: Toggle Menu. Hold: Windowing mode (Focus\/Move\/Resize windows) */
        _GamepadFaceLeft: 633,
        /** B (Xbox)         A (Switch)   Circle (PS)        \/\/ Cancel \/ Close \/ Exit */
        _GamepadFaceRight: 634,
        /** Y (Xbox)         X (Switch)   Triangle (PS)      \/\/ Text Input \/ On-screen Keyboard */
        _GamepadFaceUp: 635,
        /** A (Xbox)         B (Switch)   Cross (PS)         \/\/ Activate \/ Open \/ Toggle \/ Tweak */
        _GamepadFaceDown: 636,
        /** D-pad Left                                       \/\/ Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadLeft: 637,
        /** D-pad Right                                      \/\/ Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadRight: 638,
        /** D-pad Up                                         \/\/ Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadUp: 639,
        /** D-pad Down                                       \/\/ Move \/ Tweak \/ Resize Window (in Windowing mode) */
        _GamepadDpadDown: 640,
        /** L Bumper (Xbox)  L (Switch)   L1 (PS)            \/\/ Tweak Slower \/ Focus Previous (in Windowing mode) */
        _GamepadL1: 641,
        /** R Bumper (Xbox)  R (Switch)   R1 (PS)            \/\/ Tweak Faster \/ Focus Next (in Windowing mode) */
        _GamepadR1: 642,
        /** L Trig. (Xbox)   ZL (Switch)  L2 (PS) [Analog] */
        _GamepadL2: 643,
        /** R Trig. (Xbox)   ZR (Switch)  R2 (PS) [Analog] */
        _GamepadR2: 644,
        /** L Stick (Xbox)   L3 (Switch)  L3 (PS) */
        _GamepadL3: 645,
        /** R Stick (Xbox)   R3 (Switch)  R3 (PS) */
        _GamepadR3: 646,
        /** [Analog]                                         \/\/ Move Window (in Windowing mode) */
        _GamepadLStickLeft: 647,
        /** [Analog]                                         \/\/ Move Window (in Windowing mode) */
        _GamepadLStickRight: 648,
        /** [Analog]                                         \/\/ Move Window (in Windowing mode) */
        _GamepadLStickUp: 649,
        /** [Analog]                                         \/\/ Move Window (in Windowing mode) */
        _GamepadLStickDown: 650,
        /** [Analog] */
        _GamepadRStickLeft: 651,
        /** [Analog] */
        _GamepadRStickRight: 652,
        /** [Analog] */
        _GamepadRStickUp: 653,
        /** [Analog] */
        _GamepadRStickDown: 654,
        _MouseLeft: 655,
        _MouseRight: 656,
        _MouseMiddle: 657,
        _MouseX1: 658,
        _MouseX2: 659,
        _MouseWheelX: 660,
        _MouseWheelY: 661,
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

    /** [Auto] Flags for Shortcut(), SetNextItemShortcut(), */
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

    /** [Auto] Configuration flags stored in io.ConfigFlags. Set by user\/application. */
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
        /** [BETA: Don't use] FIXME-DPI: Reposition and resize imgui windows when the DpiScale of a viewport changed (mostly useful for the main viewport hosting other window). Note that resizing the main window itself is up to your application. */
        DpiEnableScaleViewports: 16384,
        /** [BETA: Don't use] FIXME-DPI: Request bitmap-scaled fonts to match DpiScale. This is a very low-quality workaround. The correct way to handle DPI is _currently_ to replace the atlas and\/or fonts in the Platform_OnChangedViewport callback, but this is all early work in progress. */
        DpiEnableScaleFonts: 32768,
        /** Application is SRGB-aware. */
        IsSRGB: 1048576,
        /** Application is using a touch screen instead of a mouse. */
        IsTouchScreen: 2097152,
    },

    /** [Auto] Backend capabilities flags stored in io.BackendFlags. Set by imgui_impl_xxx or custom backend. */
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
        /** Backend Platform supports multiple viewports. */
        PlatformHasViewports: 1024,
        /** Backend Platform supports calling io.AddMouseViewportEvent() with the viewport under the mouse. IF POSSIBLE, ignore viewports with the ImGuiViewportFlags_NoInputs flag (Win32 backend, GLFW 3.30+ backend can do this, SDL backend cannot). If this cannot be done, Dear ImGui needs to use a flawed heuristic to find the viewport under. */
        HasMouseHoveredViewport: 2048,
        /** Backend Renderer supports multiple viewports. */
        RendererHasViewports: 4096,
    },

    /** [Auto] Enumeration for PushStyleColor() \/ PopStyleColor() */
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
        /** Tab background, when hovered */
        TabHovered: 33,
        /** Tab background, when tab-bar is focused & tab is unselected */
        Tab: 34,
        /** Tab background, when tab-bar is focused & tab is selected */
        TabSelected: 35,
        /** Tab horizontal overline, when tab-bar is focused & tab is selected */
        TabSelectedOverline: 36,
        /** Tab background, when tab-bar is unfocused & tab is unselected */
        TabDimmed: 37,
        /** Tab background, when tab-bar is unfocused & tab is selected */
        TabDimmedSelected: 38,
        /** .horizontal overline, when tab-bar is unfocused & tab is selected */
        TabDimmedSelectedOverline: 39,
        /** Preview overlay color when about to docking something */
        DockingPreview: 40,
        /** Background color for empty node (e.g. CentralNode with no window docked into it) */
        DockingEmptyBg: 41,
        PlotLines: 42,
        PlotLinesHovered: 43,
        PlotHistogram: 44,
        PlotHistogramHovered: 45,
        /** Table header background */
        TableHeaderBg: 46,
        /** Table outer and header borders (prefer using Alpha=1.0 here) */
        TableBorderStrong: 47,
        /** Table inner borders (prefer using Alpha=1.0 here) */
        TableBorderLight: 48,
        /** Table row background (even rows) */
        TableRowBg: 49,
        /** Table row background (odd rows) */
        TableRowBgAlt: 50,
        /** Hyperlink color */
        TextLink: 51,
        TextSelectedBg: 52,
        /** Rectangle highlighting a drop target */
        DragDropTarget: 53,
        /** Color of keyboard\/gamepad navigation cursor\/rectangle, when visible */
        NavCursor: 54,
        /** Highlight window when using CTRL+TAB */
        NavWindowingHighlight: 55,
        /** Darken\/colorize entire screen behind the CTRL+TAB window list, when active */
        NavWindowingDimBg: 56,
        /** Darken\/colorize entire screen behind a modal window, when one is active */
        ModalWindowDimBg: 57,
        COUNT: 58,
    },

    /** [Auto] Enumeration for PushStyleVar() \/ PopStyleVar() to temporarily modify the ImGuiStyle structure. */
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
        /** float     TabRounding */
        TabRounding: 22,
        /** float     TabBorderSize */
        TabBorderSize: 23,
        /** float     TabBarBorderSize */
        TabBarBorderSize: 24,
        /** float     TabBarOverlineSize */
        TabBarOverlineSize: 25,
        /** float     TableAngledHeadersAngle */
        TableAngledHeadersAngle: 26,
        /** ImVec2  TableAngledHeadersTextAlign */
        TableAngledHeadersTextAlign: 27,
        /** ImVec2    ButtonTextAlign */
        ButtonTextAlign: 28,
        /** ImVec2    SelectableTextAlign */
        SelectableTextAlign: 29,
        /** float     SeparatorTextBorderSize */
        SeparatorTextBorderSize: 30,
        /** ImVec2    SeparatorTextAlign */
        SeparatorTextAlign: 31,
        /** ImVec2    SeparatorTextPadding */
        SeparatorTextPadding: 32,
        /** float     DockingSeparatorSize */
        DockingSeparatorSize: 33,
        COUNT: 34,
    },

    /** [Auto] Flags for InvisibleButton() [extended in imgui_internal.h] */
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

    /** [Auto] Flags for ColorEdit3() \/ ColorEdit4() \/ ColorPicker3() \/ ColorPicker4() \/ ColorButton() */
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
        /**              \/\/ ColorEdit, ColorPicker: show vertical alpha bar\/gradient in picker. */
        AlphaBar: 65536,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: display preview as a transparent color over a checkerboard, instead of opaque. */
        AlphaPreview: 131072,
        /**              \/\/ ColorEdit, ColorPicker, ColorButton: display half opaque \/ half checkerboard, instead of opaque. */
        AlphaPreviewHalf: 262144,
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

    /** [Auto] Flags for DragFloat(), DragInt(), SliderFloat(), SliderInt() etc. */
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

    /** [Auto] Identify a mouse button. */
    MouseButton: {
        Left: 0,
        Right: 1,
        Middle: 2,
        COUNT: 5,
    },

    /** [Auto] Enumeration for GetMouseCursor() */
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
        /** When hovering something with disallowed interaction. Usually a crossed circle. */
        NotAllowed: 8,
        COUNT: 9,
    },

    /** [Auto] Enumeration for AddMouseSourceEvent() actual source of Mouse Input data. */
    MouseSource: {
        /** Input is coming from an actual mouse. */
        _Mouse: 0,
        /** Input is coming from a touch screen (no hovering prior to initial press, less precise initial press aiming, dual-axis wheeling possible). */
        _TouchScreen: 1,
        /** Input is coming from a pressure\/magnetic pen (often used in conjunction with high-sampling rates). */
        _Pen: 2,
        _COUNT: 3,
    },

    /** [Auto] Enumeration for ImGui::SetNextWindow***(), SetWindow***(), SetNextItem***() functions */
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

    /** [Auto] Flags for ImGui::BeginTable() */
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

    /** [Auto] Flags for ImGui::TableSetupColumn() */
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

    /** [Auto] Flags for ImGui::TableNextRow() */
    TableRowFlags: {
        None: 0,
        /** Identify header row (set default background color + width of its contents accounted differently for auto column width) */
        Headers: 1,
    },

    /** [Auto] Enum for ImGui::TableSetBgColor() */
    TableBgTarget: {
        None: 0,
        /** Set row background color 0 (generally used for background, automatically set when ImGuiTableFlags_RowBg is used) */
        RowBg0: 1,
        /** Set row background color 1 (generally used for selection marking) */
        RowBg1: 2,
        /** Set cell background color (top-most color) */
        CellBg: 3,
    },

    /** [Auto] Flags for BeginMultiSelect() */
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

    /** [Auto] Selection request type */
    SelectionRequestType: {
        _None: 0,
        /** Request app to clear selection (if Selected==false) or select all items (if Selected==true). We cannot set RangeFirstItem\/RangeLastItem as its contents is entirely up to user (not necessarily an index) */
        _SetAll: 1,
        /** Request app to select\/unselect [RangeFirstItem..RangeLastItem] items (inclusive) based on value of Selected. Only EndMultiSelect() request this, app code can read after BeginMultiSelect() and it will always be false. */
        _SetRange: 2,
    },

    /** [Auto] Flags for ImDrawList functions */
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

    /** [Auto] Flags for ImDrawList instance. Those are set automatically by ImGui:: functions from ImGuiIO settings, and generally not manipulated directly. */
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

    /** [Auto] Flags for ImFontAtlas build */
    ImFontAtlasFlags: {
        None: 0,
        /** Don't round the height to next power of two */
        NoPowerOfTwoHeight: 1,
        /** Don't build software mouse cursors into the atlas (save a little texture memory) */
        NoMouseCursors: 2,
        /** Don't build thick line textures into the atlas (save a little texture memory, allow support for point\/nearest filtering). The AntiAliasedLinesUseTex features uses them, otherwise they will be rendered using polygons (more expensive for CPU\/GPU). */
        NoBakedLines: 4,
    },

    /** [Auto] Flags stored in ImGuiViewport::Flags, giving indications to the platform backends. */
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

});

/* -------------------------------------------------------------------------- */
/* 3. Typedefs */
/* -------------------------------------------------------------------------- */
/** @typedef {number} ImGuiID [Auto] */
/** @typedef {number} ImS8 [Auto] */
/** @typedef {number} ImU8 [Auto] */
/** @typedef {number} ImS16 [Auto] */
/** @typedef {number} ImU16 [Auto] */
/** @typedef {number} ImS32 [Auto] */
/** @typedef {number} ImU32 [Auto] */
/** @typedef {BigInt} ImS64 [Auto] */
/** @typedef {BigInt} ImU64 [Auto] */
/** @typedef {number} ImGuiDir [Auto] */
/** @typedef {number} ImGuiKey [Auto] */
/** @typedef {number} ImGuiMouseSource [Auto] */
/** @typedef {number} ImGuiSortDirection [Auto] */
/** @typedef {number} ImGuiCol [Auto] */
/** @typedef {number} ImGuiCond [Auto] */
/** @typedef {number} ImGuiDataType [Auto] */
/** @typedef {number} ImGuiMouseButton [Auto] */
/** @typedef {number} ImGuiMouseCursor [Auto] */
/** @typedef {number} ImGuiStyleVar [Auto] */
/** @typedef {number} ImGuiTableBgTarget [Auto] */
/** @typedef {number} ImDrawFlags [Auto] */
/** @typedef {number} ImDrawListFlags [Auto] */
/** @typedef {number} ImFontAtlasFlags [Auto] */
/** @typedef {number} ImGuiBackendFlags [Auto] */
/** @typedef {number} ImGuiButtonFlags [Auto] */
/** @typedef {number} ImGuiChildFlags [Auto] */
/** @typedef {number} ImGuiColorEditFlags [Auto] */
/** @typedef {number} ImGuiConfigFlags [Auto] */
/** @typedef {number} ImGuiComboFlags [Auto] */
/** @typedef {number} ImGuiDockNodeFlags [Auto] */
/** @typedef {number} ImGuiDragDropFlags [Auto] */
/** @typedef {number} ImGuiFocusedFlags [Auto] */
/** @typedef {number} ImGuiHoveredFlags [Auto] */
/** @typedef {number} ImGuiInputFlags [Auto] */
/** @typedef {number} ImGuiInputTextFlags [Auto] */
/** @typedef {number} ImGuiItemFlags [Auto] */
/** @typedef {number} ImGuiKeyChord [Auto] */
/** @typedef {number} ImGuiPopupFlags [Auto] */
/** @typedef {number} ImGuiMultiSelectFlags [Auto] */
/** @typedef {number} ImGuiSelectableFlags [Auto] */
/** @typedef {number} ImGuiSliderFlags [Auto] */
/** @typedef {number} ImGuiTabBarFlags [Auto] */
/** @typedef {number} ImGuiTabItemFlags [Auto] */
/** @typedef {number} ImGuiTableFlags [Auto] */
/** @typedef {number} ImGuiTableColumnFlags [Auto] */
/** @typedef {number} ImGuiTableRowFlags [Auto] */
/** @typedef {number} ImGuiTreeNodeFlags [Auto] */
/** @typedef {number} ImGuiViewportFlags [Auto] */
/** @typedef {number} ImGuiWindowFlags [Auto] */
/** @typedef {BigInt} ImTextureID [Auto] */
/** @typedef {number} ImDrawIdx [Auto] */
/** @typedef {number} ImWchar32 [Auto] */
/** @typedef {number} ImWchar16 [Auto] */
/** @typedef {number} ImWchar [Auto] */
/** @typedef {number} ImWchar [Auto] */
/** @typedef {BigInt} ImGuiSelectionUserData [Auto] */

/* -------------------------------------------------------------------------- */
/* 4. Structs */
/* -------------------------------------------------------------------------- */

/** [Auto] Data shared among multiple draw lists (typically owned by parent ImGui context, but you may create one yourself) */
export class ImDrawListSharedData extends StructBinding {
    constructor() { super("ImDrawListSharedData"); }
}

/** [Auto] Dear ImGui context (opaque structure, unless including imgui_internal.h) */
export class ImGuiContext extends StructBinding {
    constructor() { super("ImGuiContext"); }
}

/** [Auto] ImVec2: 2D vector used to store positions, sizes etc. */
export class ImVec2 extends StructBinding {
    /** @param {number} x @param {number} y */
    constructor(x = 0, y = 0) {
        super("ImVec2");
        this.x = x;
        this.y = y;
    }

    /** @type {number}  */
    get x() { return this.unwrap().get_x(); }
    set x(v) { this.unwrap().set_x(v); }

    /** @type {number}  */
    get y() { return this.unwrap().get_y(); }
    set y(v) { this.unwrap().set_y(v); }

}

/** [Auto] ImVec4: 4D vector used to store clipping rectangles, colors etc. */
export class ImVec4 extends StructBinding {
    /** @param {number} x @param {number} y @param {number} z @param {number} w */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super("ImVec4");
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /** @type {number}  */
    get x() { return this.unwrap().get_x(); }
    set x(v) { this.unwrap().set_x(v); }

    /** @type {number}  */
    get y() { return this.unwrap().get_y(); }
    set y(v) { this.unwrap().set_y(v); }

    /** @type {number}  */
    get z() { return this.unwrap().get_z(); }
    set z(v) { this.unwrap().set_z(v); }

    /** @type {number}  */
    get w() { return this.unwrap().get_w(); }
    set w(v) { this.unwrap().set_w(v); }

}

/** [Auto] Sorting specifications for a table (often handling sort specs for a single column, occasionally more) */
export class ImGuiTableSortSpecs extends StructBinding {
    constructor() { super("ImGuiTableSortSpecs"); }
}

/** [Auto] Sorting specification for one column of a table (sizeof == 12 bytes) */
export class ImGuiTableColumnSortSpecs extends StructBinding {
    constructor() { super("ImGuiTableColumnSortSpecs"); }
}

/** [Auto] Runtime data for styling/colors. */
export class ImGuiStyle extends StructBinding {
    constructor() { super("ImGuiStyle"); }

    /** @type {number} Global alpha applies to everything in Dear ImGui. */
    get Alpha() { return this.unwrap().get_Alpha(); }
    set Alpha(v) { this.unwrap().set_Alpha(v); }

    /** @type {number} Additional alpha multiplier applied by BeginDisabled(). Multiply over current value of Alpha. */
    get DisabledAlpha() { return this.unwrap().get_DisabledAlpha(); }
    set DisabledAlpha(v) { this.unwrap().set_DisabledAlpha(v); }

    /** @type {ImVec2} Padding within a window. */
    get WindowPadding() { return ImVec2.wrap(this.unwrap().get_WindowPadding()); }
    set WindowPadding(v) { this.unwrap().set_WindowPadding(v.unwrap()); }

    /** @type {number} Radius of window corners rounding. Set to 0.0f to have rectangular windows. Large values tend to lead to variety of artifacts and are not recommended. */
    get WindowRounding() { return this.unwrap().get_WindowRounding(); }
    set WindowRounding(v) { this.unwrap().set_WindowRounding(v); }

    /** @type {number} Thickness of border around windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get WindowBorderSize() { return this.unwrap().get_WindowBorderSize(); }
    set WindowBorderSize(v) { this.unwrap().set_WindowBorderSize(v); }

    /** @type {ImVec2} Minimum window size. This is a global setting. If you want to constrain individual windows, use SetNextWindowSizeConstraints(). */
    get WindowMinSize() { return ImVec2.wrap(this.unwrap().get_WindowMinSize()); }
    set WindowMinSize(v) { this.unwrap().set_WindowMinSize(v.unwrap()); }

    /** @type {ImVec2} Alignment for title bar text. Defaults to (0.0f,0.5f) for left-aligned,vertically centered. */
    get WindowTitleAlign() { return ImVec2.wrap(this.unwrap().get_WindowTitleAlign()); }
    set WindowTitleAlign(v) { this.unwrap().set_WindowTitleAlign(v.unwrap()); }

    /** @type {ImGuiDir} Side of the collapsing\/docking button in the title bar (None\/Left\/Right). Defaults to ImGuiDir_Left. */
    get WindowMenuButtonPosition() { return this.unwrap().get_WindowMenuButtonPosition(); }
    set WindowMenuButtonPosition(v) { this.unwrap().set_WindowMenuButtonPosition(v); }

    /** @type {number} Radius of child window corners rounding. Set to 0.0f to have rectangular windows. */
    get ChildRounding() { return this.unwrap().get_ChildRounding(); }
    set ChildRounding(v) { this.unwrap().set_ChildRounding(v); }

    /** @type {number} Thickness of border around child windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get ChildBorderSize() { return this.unwrap().get_ChildBorderSize(); }
    set ChildBorderSize(v) { this.unwrap().set_ChildBorderSize(v); }

    /** @type {number} Radius of popup window corners rounding. (Note that tooltip windows use WindowRounding) */
    get PopupRounding() { return this.unwrap().get_PopupRounding(); }
    set PopupRounding(v) { this.unwrap().set_PopupRounding(v); }

    /** @type {number} Thickness of border around popup\/tooltip windows. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get PopupBorderSize() { return this.unwrap().get_PopupBorderSize(); }
    set PopupBorderSize(v) { this.unwrap().set_PopupBorderSize(v); }

    /** @type {ImVec2} Padding within a framed rectangle (used by most widgets). */
    get FramePadding() { return ImVec2.wrap(this.unwrap().get_FramePadding()); }
    set FramePadding(v) { this.unwrap().set_FramePadding(v.unwrap()); }

    /** @type {number} Radius of frame corners rounding. Set to 0.0f to have rectangular frame (used by most widgets). */
    get FrameRounding() { return this.unwrap().get_FrameRounding(); }
    set FrameRounding(v) { this.unwrap().set_FrameRounding(v); }

    /** @type {number} Thickness of border around frames. Generally set to 0.0f or 1.0f. (Other values are not well tested and more CPU\/GPU costly). */
    get FrameBorderSize() { return this.unwrap().get_FrameBorderSize(); }
    set FrameBorderSize(v) { this.unwrap().set_FrameBorderSize(v); }

    /** @type {ImVec2} Horizontal and vertical spacing between widgets\/lines. */
    get ItemSpacing() { return ImVec2.wrap(this.unwrap().get_ItemSpacing()); }
    set ItemSpacing(v) { this.unwrap().set_ItemSpacing(v.unwrap()); }

    /** @type {ImVec2} Horizontal and vertical spacing between within elements of a composed widget (e.g. a slider and its label). */
    get ItemInnerSpacing() { return ImVec2.wrap(this.unwrap().get_ItemInnerSpacing()); }
    set ItemInnerSpacing(v) { this.unwrap().set_ItemInnerSpacing(v.unwrap()); }

    /** @type {ImVec2} Padding within a table cell. Cellpadding.x is locked for entire table. CellPadding.y may be altered between different rows. */
    get CellPadding() { return ImVec2.wrap(this.unwrap().get_CellPadding()); }
    set CellPadding(v) { this.unwrap().set_CellPadding(v.unwrap()); }

    /** @type {ImVec2} Expand reactive bounding box for touch-based system where touch position is not accurate enough. Unfortunately we don't sort widgets so priority on overlap will always be given to the first widget. So don't grow this too much! */
    get TouchExtraPadding() { return ImVec2.wrap(this.unwrap().get_TouchExtraPadding()); }
    set TouchExtraPadding(v) { this.unwrap().set_TouchExtraPadding(v.unwrap()); }

    /** @type {number} Horizontal indentation when e.g. entering a tree node. Generally == (FontSize + FramePadding.x*2). */
    get IndentSpacing() { return this.unwrap().get_IndentSpacing(); }
    set IndentSpacing(v) { this.unwrap().set_IndentSpacing(v); }

    /** @type {number} Minimum horizontal spacing between two columns. Preferably > (FramePadding.x + 1). */
    get ColumnsMinSpacing() { return this.unwrap().get_ColumnsMinSpacing(); }
    set ColumnsMinSpacing(v) { this.unwrap().set_ColumnsMinSpacing(v); }

    /** @type {number} Width of the vertical scrollbar, Height of the horizontal scrollbar. */
    get ScrollbarSize() { return this.unwrap().get_ScrollbarSize(); }
    set ScrollbarSize(v) { this.unwrap().set_ScrollbarSize(v); }

    /** @type {number} Radius of grab corners for scrollbar. */
    get ScrollbarRounding() { return this.unwrap().get_ScrollbarRounding(); }
    set ScrollbarRounding(v) { this.unwrap().set_ScrollbarRounding(v); }

    /** @type {number} Minimum width\/height of a grab box for slider\/scrollbar. */
    get GrabMinSize() { return this.unwrap().get_GrabMinSize(); }
    set GrabMinSize(v) { this.unwrap().set_GrabMinSize(v); }

    /** @type {number} Radius of grabs corners rounding. Set to 0.0f to have rectangular slider grabs. */
    get GrabRounding() { return this.unwrap().get_GrabRounding(); }
    set GrabRounding(v) { this.unwrap().set_GrabRounding(v); }

    /** @type {number} The size in pixels of the dead-zone around zero on logarithmic sliders that cross zero. */
    get LogSliderDeadzone() { return this.unwrap().get_LogSliderDeadzone(); }
    set LogSliderDeadzone(v) { this.unwrap().set_LogSliderDeadzone(v); }

    /** @type {number} Radius of upper corners of a tab. Set to 0.0f to have rectangular tabs. */
    get TabRounding() { return this.unwrap().get_TabRounding(); }
    set TabRounding(v) { this.unwrap().set_TabRounding(v); }

    /** @type {number} Thickness of border around tabs. */
    get TabBorderSize() { return this.unwrap().get_TabBorderSize(); }
    set TabBorderSize(v) { this.unwrap().set_TabBorderSize(v); }

    /** @type {number} Minimum width for close button to appear on an unselected tab when hovered. Set to 0.0f to always show when hovering, set to FLT_MAX to never show close button unless selected. */
    get TabMinWidthForCloseButton() { return this.unwrap().get_TabMinWidthForCloseButton(); }
    set TabMinWidthForCloseButton(v) { this.unwrap().set_TabMinWidthForCloseButton(v); }

    /** @type {number} Thickness of tab-bar separator, which takes on the tab active color to denote focus. */
    get TabBarBorderSize() { return this.unwrap().get_TabBarBorderSize(); }
    set TabBarBorderSize(v) { this.unwrap().set_TabBarBorderSize(v); }

    /** @type {number} Thickness of tab-bar overline, which highlights the selected tab-bar. */
    get TabBarOverlineSize() { return this.unwrap().get_TabBarOverlineSize(); }
    set TabBarOverlineSize(v) { this.unwrap().set_TabBarOverlineSize(v); }

    /** @type {number} Angle of angled headers (supported values range from -50.0f degrees to +50.0f degrees). */
    get TableAngledHeadersAngle() { return this.unwrap().get_TableAngledHeadersAngle(); }
    set TableAngledHeadersAngle(v) { this.unwrap().set_TableAngledHeadersAngle(v); }

    /** @type {ImVec2} Alignment of angled headers within the cell */
    get TableAngledHeadersTextAlign() { return ImVec2.wrap(this.unwrap().get_TableAngledHeadersTextAlign()); }
    set TableAngledHeadersTextAlign(v) { this.unwrap().set_TableAngledHeadersTextAlign(v.unwrap()); }

    /** @type {ImGuiDir} Side of the color button in the ColorEdit4 widget (left\/right). Defaults to ImGuiDir_Right. */
    get ColorButtonPosition() { return this.unwrap().get_ColorButtonPosition(); }
    set ColorButtonPosition(v) { this.unwrap().set_ColorButtonPosition(v); }

    /** @type {ImVec2} Alignment of button text when button is larger than text. Defaults to (0.5f, 0.5f) (centered). */
    get ButtonTextAlign() { return ImVec2.wrap(this.unwrap().get_ButtonTextAlign()); }
    set ButtonTextAlign(v) { this.unwrap().set_ButtonTextAlign(v.unwrap()); }

    /** @type {ImVec2} Alignment of selectable text. Defaults to (0.0f, 0.0f) (top-left aligned). It's generally important to keep this left-aligned if you want to lay multiple items on a same line. */
    get SelectableTextAlign() { return ImVec2.wrap(this.unwrap().get_SelectableTextAlign()); }
    set SelectableTextAlign(v) { this.unwrap().set_SelectableTextAlign(v.unwrap()); }

    /** @type {number} Thickness of border in SeparatorText() */
    get SeparatorTextBorderSize() { return this.unwrap().get_SeparatorTextBorderSize(); }
    set SeparatorTextBorderSize(v) { this.unwrap().set_SeparatorTextBorderSize(v); }

    /** @type {ImVec2} Alignment of text within the separator. Defaults to (0.0f, 0.5f) (left aligned, center). */
    get SeparatorTextAlign() { return ImVec2.wrap(this.unwrap().get_SeparatorTextAlign()); }
    set SeparatorTextAlign(v) { this.unwrap().set_SeparatorTextAlign(v.unwrap()); }

    /** @type {ImVec2} Horizontal offset of text from each edge of the separator + spacing on other axis. Generally small values. .y is recommended to be == FramePadding.y. */
    get SeparatorTextPadding() { return ImVec2.wrap(this.unwrap().get_SeparatorTextPadding()); }
    set SeparatorTextPadding(v) { this.unwrap().set_SeparatorTextPadding(v.unwrap()); }

    /** @type {ImVec2} Apply to regular windows: amount which we enforce to keep visible when moving near edges of your screen. */
    get DisplayWindowPadding() { return ImVec2.wrap(this.unwrap().get_DisplayWindowPadding()); }
    set DisplayWindowPadding(v) { this.unwrap().set_DisplayWindowPadding(v.unwrap()); }

    /** @type {ImVec2} Apply to every windows, menus, popups, tooltips: amount where we avoid displaying contents. Adjust if you cannot see the edges of your screen (e.g. on a TV where scaling has not been configured). */
    get DisplaySafeAreaPadding() { return ImVec2.wrap(this.unwrap().get_DisplaySafeAreaPadding()); }
    set DisplaySafeAreaPadding(v) { this.unwrap().set_DisplaySafeAreaPadding(v.unwrap()); }

    /** @type {number} Thickness of resizing border between docked windows */
    get DockingSeparatorSize() { return this.unwrap().get_DockingSeparatorSize(); }
    set DockingSeparatorSize(v) { this.unwrap().set_DockingSeparatorSize(v); }

    /** @type {number} Scale software rendered mouse cursor (when io.MouseDrawCursor is enabled). We apply per-monitor DPI scaling over this scale. May be removed later. */
    get MouseCursorScale() { return this.unwrap().get_MouseCursorScale(); }
    set MouseCursorScale(v) { this.unwrap().set_MouseCursorScale(v); }

    /** @type {boolean} Enable anti-aliased lines\/borders. Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLines() { return this.unwrap().get_AntiAliasedLines(); }
    set AntiAliasedLines(v) { this.unwrap().set_AntiAliasedLines(v); }

    /** @type {boolean} Enable anti-aliased lines\/borders using textures where possible. Require backend to render with bilinear filtering (NOT point\/nearest filtering). Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedLinesUseTex() { return this.unwrap().get_AntiAliasedLinesUseTex(); }
    set AntiAliasedLinesUseTex(v) { this.unwrap().set_AntiAliasedLinesUseTex(v); }

    /** @type {boolean} Enable anti-aliased edges around filled shapes (rounded rectangles, circles, etc.). Disable if you are really tight on CPU\/GPU. Latched at the beginning of the frame (copied to ImDrawList). */
    get AntiAliasedFill() { return this.unwrap().get_AntiAliasedFill(); }
    set AntiAliasedFill(v) { this.unwrap().set_AntiAliasedFill(v); }

    /** @type {number} Tessellation tolerance when using PathBezierCurveTo() without a specific number of segments. Decrease for highly tessellated curves (higher quality, more polygons), increase to reduce quality. */
    get CurveTessellationTol() { return this.unwrap().get_CurveTessellationTol(); }
    set CurveTessellationTol(v) { this.unwrap().set_CurveTessellationTol(v); }

    /** @type {number} Maximum error (in pixels) allowed when using AddCircle()\/AddCircleFilled() or drawing rounded corner rectangles with no explicit segment count specified. Decrease for higher quality but more geometry. */
    get CircleTessellationMaxError() { return this.unwrap().get_CircleTessellationMaxError(); }
    set CircleTessellationMaxError(v) { this.unwrap().set_CircleTessellationMaxError(v); }

    /** @type {number} Delay for IsItemHovered(ImGuiHoveredFlags_Stationary). Time required to consider mouse stationary. */
    get HoverStationaryDelay() { return this.unwrap().get_HoverStationaryDelay(); }
    set HoverStationaryDelay(v) { this.unwrap().set_HoverStationaryDelay(v); }

    /** @type {number} Delay for IsItemHovered(ImGuiHoveredFlags_DelayShort). Usually used along with HoverStationaryDelay. */
    get HoverDelayShort() { return this.unwrap().get_HoverDelayShort(); }
    set HoverDelayShort(v) { this.unwrap().set_HoverDelayShort(v); }

    /** @type {number} Delay for IsItemHovered(ImGuiHoveredFlags_DelayNormal). " */
    get HoverDelayNormal() { return this.unwrap().get_HoverDelayNormal(); }
    set HoverDelayNormal(v) { this.unwrap().set_HoverDelayNormal(v); }

    /** @type {ImGuiHoveredFlags} Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using mouse. */
    get HoverFlagsForTooltipMouse() { return this.unwrap().get_HoverFlagsForTooltipMouse(); }
    set HoverFlagsForTooltipMouse(v) { this.unwrap().set_HoverFlagsForTooltipMouse(v); }

    /** @type {ImGuiHoveredFlags} Default flags when using IsItemHovered(ImGuiHoveredFlags_ForTooltip) or BeginItemTooltip()\/SetItemTooltip() while using keyboard\/gamepad. */
    get HoverFlagsForTooltipNav() { return this.unwrap().get_HoverFlagsForTooltipNav(); }
    set HoverFlagsForTooltipNav(v) { this.unwrap().set_HoverFlagsForTooltipNav(v); }

    /**
     * [Auto] 
     * @param {number} scale_factor
     * @returns {void}
     */
    ScaleAllSizes(scale_factor) { return this.unwrap().ImGuiStyle_ScaleAllSizes(scale_factor) }

}

/** [Auto] Main configuration and I/O between your application and ImGui. */
export class ImGuiIO extends StructBinding {
    constructor() { super("ImGuiIO"); }

    /** @type {ImGuiConfigFlags} = 0              \/\/ See ImGuiConfigFlags_ enum. Set by user\/application. Keyboard\/Gamepad navigation options, etc. */
    get ConfigFlags() { return this.unwrap().get_ConfigFlags(); }
    set ConfigFlags(v) { this.unwrap().set_ConfigFlags(v); }

    /** @type {ImGuiBackendFlags} = 0              \/\/ See ImGuiBackendFlags_ enum. Set by backend (imgui_impl_xxx files or custom backend) to communicate features supported by the backend. */
    get BackendFlags() { return this.unwrap().get_BackendFlags(); }
    set BackendFlags(v) { this.unwrap().set_BackendFlags(v); }

    /** @type {ImVec2} <unset>          \/\/ Main display size, in pixels (generally == GetMainViewport()->Size). May change every frame. */
    get DisplaySize() { return ImVec2.wrap(this.unwrap().get_DisplaySize()); }
    set DisplaySize(v) { this.unwrap().set_DisplaySize(v.unwrap()); }

    /** @type {number} = 1.0f\/60.0f     \/\/ Time elapsed since last frame, in seconds. May change every frame. */
    get DeltaTime() { return this.unwrap().get_DeltaTime(); }
    set DeltaTime(v) { this.unwrap().set_DeltaTime(v); }

    /** @type {number} = 5.0f           \/\/ Minimum time between saving positions\/sizes to .ini file, in seconds. */
    get IniSavingRate() { return this.unwrap().get_IniSavingRate(); }
    set IniSavingRate(v) { this.unwrap().set_IniSavingRate(v); }

    /** @type {ImFontAtlas} <auto>           \/\/ Font atlas: load, rasterize and pack one or more fonts into a single texture. */
    get Fonts() { return ImFontAtlas.wrap(this.unwrap().get_Fonts()); }
    set Fonts(v) { this.unwrap().set_Fonts(v.unwrap()); }

    /** @type {number} = 1.0f           \/\/ Global scale all fonts */
    get FontGlobalScale() { return this.unwrap().get_FontGlobalScale(); }
    set FontGlobalScale(v) { this.unwrap().set_FontGlobalScale(v); }

    /** @type {boolean} = false          \/\/ [OBSOLETE] Allow user scaling text of individual window with CTRL+Wheel. */
    get FontAllowUserScaling() { return this.unwrap().get_FontAllowUserScaling(); }
    set FontAllowUserScaling(v) { this.unwrap().set_FontAllowUserScaling(v); }

    /** @type {ImFont} = NULL           \/\/ Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0]. */
    get FontDefault() { return ImFont.wrap(this.unwrap().get_FontDefault()); }
    set FontDefault(v) { this.unwrap().set_FontDefault(v.unwrap()); }

    /** @type {ImVec2} = (1, 1)         \/\/ For retina display or other situations where window coordinates are different from framebuffer coordinates. This generally ends up in ImDrawData::FramebufferScale. */
    get DisplayFramebufferScale() { return ImVec2.wrap(this.unwrap().get_DisplayFramebufferScale()); }
    set DisplayFramebufferScale(v) { this.unwrap().set_DisplayFramebufferScale(v.unwrap()); }

    /** @type {boolean} = false          \/\/ Swap Activate<>Cancel (A<>B) buttons, matching typical "Nintendo\/Japanese style" gamepad layout. */
    get ConfigNavSwapGamepadButtons() { return this.unwrap().get_ConfigNavSwapGamepadButtons(); }
    set ConfigNavSwapGamepadButtons(v) { this.unwrap().set_ConfigNavSwapGamepadButtons(v); }

    /** @type {boolean} = false          \/\/ Directional\/tabbing navigation teleports the mouse cursor. May be useful on TV\/console systems where moving a virtual mouse is difficult. Will update io.MousePos and set io.WantSetMousePos=true. */
    get ConfigNavMoveSetMousePos() { return this.unwrap().get_ConfigNavMoveSetMousePos(); }
    set ConfigNavMoveSetMousePos(v) { this.unwrap().set_ConfigNavMoveSetMousePos(v); }

    /** @type {boolean} = true           \/\/ Sets io.WantCaptureKeyboard when io.NavActive is set. */
    get ConfigNavCaptureKeyboard() { return this.unwrap().get_ConfigNavCaptureKeyboard(); }
    set ConfigNavCaptureKeyboard(v) { this.unwrap().set_ConfigNavCaptureKeyboard(v); }

    /** @type {boolean} = true           \/\/ Pressing Escape can clear focused item + navigation id\/highlight. Set to false if you want to always keep highlight on. */
    get ConfigNavEscapeClearFocusItem() { return this.unwrap().get_ConfigNavEscapeClearFocusItem(); }
    set ConfigNavEscapeClearFocusItem(v) { this.unwrap().set_ConfigNavEscapeClearFocusItem(v); }

    /** @type {boolean} = false          \/\/ Pressing Escape can clear focused window as well (super set of io.ConfigNavEscapeClearFocusItem). */
    get ConfigNavEscapeClearFocusWindow() { return this.unwrap().get_ConfigNavEscapeClearFocusWindow(); }
    set ConfigNavEscapeClearFocusWindow(v) { this.unwrap().set_ConfigNavEscapeClearFocusWindow(v); }

    /** @type {boolean} = true           \/\/ Using directional navigation key makes the cursor visible. Mouse click hides the cursor. */
    get ConfigNavCursorVisibleAuto() { return this.unwrap().get_ConfigNavCursorVisibleAuto(); }
    set ConfigNavCursorVisibleAuto(v) { this.unwrap().set_ConfigNavCursorVisibleAuto(v); }

    /** @type {boolean} = false          \/\/ Navigation cursor is always visible. */
    get ConfigNavCursorVisibleAlways() { return this.unwrap().get_ConfigNavCursorVisibleAlways(); }
    set ConfigNavCursorVisibleAlways(v) { this.unwrap().set_ConfigNavCursorVisibleAlways(v); }

    /** @type {boolean} = false          \/\/ Simplified docking mode: disable window splitting, so docking is limited to merging multiple windows together into tab-bars. */
    get ConfigDockingNoSplit() { return this.unwrap().get_ConfigDockingNoSplit(); }
    set ConfigDockingNoSplit(v) { this.unwrap().set_ConfigDockingNoSplit(v); }

    /** @type {boolean} = false          \/\/ Enable docking with holding Shift key (reduce visual noise, allows dropping in wider space) */
    get ConfigDockingWithShift() { return this.unwrap().get_ConfigDockingWithShift(); }
    set ConfigDockingWithShift(v) { this.unwrap().set_ConfigDockingWithShift(v); }

    /** @type {boolean} = false          \/\/ [BETA] [FIXME: This currently creates regression with auto-sizing and general overhead] Make every single floating window display within a docking node. */
    get ConfigDockingAlwaysTabBar() { return this.unwrap().get_ConfigDockingAlwaysTabBar(); }
    set ConfigDockingAlwaysTabBar(v) { this.unwrap().set_ConfigDockingAlwaysTabBar(v); }

    /** @type {boolean} = false          \/\/ [BETA] Make window or viewport transparent when docking and only display docking boxes on the target viewport. Useful if rendering of multiple viewport cannot be synced. Best used with ConfigViewportsNoAutoMerge. */
    get ConfigDockingTransparentPayload() { return this.unwrap().get_ConfigDockingTransparentPayload(); }
    set ConfigDockingTransparentPayload(v) { this.unwrap().set_ConfigDockingTransparentPayload(v); }

    /** @type {boolean} = false;         \/\/ Set to make all floating imgui windows always create their own viewport. Otherwise, they are merged into the main host viewports when overlapping it. May also set ImGuiViewportFlags_NoAutoMerge on individual viewport. */
    get ConfigViewportsNoAutoMerge() { return this.unwrap().get_ConfigViewportsNoAutoMerge(); }
    set ConfigViewportsNoAutoMerge(v) { this.unwrap().set_ConfigViewportsNoAutoMerge(v); }

    /** @type {boolean} = false          \/\/ Disable default OS task bar icon flag for secondary viewports. When a viewport doesn't want a task bar icon, ImGuiViewportFlags_NoTaskBarIcon will be set on it. */
    get ConfigViewportsNoTaskBarIcon() { return this.unwrap().get_ConfigViewportsNoTaskBarIcon(); }
    set ConfigViewportsNoTaskBarIcon(v) { this.unwrap().set_ConfigViewportsNoTaskBarIcon(v); }

    /** @type {boolean} = true           \/\/ Disable default OS window decoration flag for secondary viewports. When a viewport doesn't want window decorations, ImGuiViewportFlags_NoDecoration will be set on it. Enabling decoration can create subsequent issues at OS levels (e.g. minimum window size). */
    get ConfigViewportsNoDecoration() { return this.unwrap().get_ConfigViewportsNoDecoration(); }
    set ConfigViewportsNoDecoration(v) { this.unwrap().set_ConfigViewportsNoDecoration(v); }

    /** @type {boolean} = false          \/\/ Disable default OS parenting to main viewport for secondary viewports. By default, viewports are marked with ParentViewportId = <main_viewport>, expecting the platform backend to setup a parent\/child relationship between the OS windows (some backend may ignore this). Set to true if you want the default to be 0, then all viewports will be top-level OS windows. */
    get ConfigViewportsNoDefaultParent() { return this.unwrap().get_ConfigViewportsNoDefaultParent(); }
    set ConfigViewportsNoDefaultParent(v) { this.unwrap().set_ConfigViewportsNoDefaultParent(v); }

    /** @type {boolean} = false          \/\/ Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor). Cannot be easily renamed to 'io.ConfigXXX' because this is frequently used by backend implementations. */
    get MouseDrawCursor() { return this.unwrap().get_MouseDrawCursor(); }
    set MouseDrawCursor(v) { this.unwrap().set_MouseDrawCursor(v); }

    /** @type {boolean} = defined(__APPLE__) \/\/ Swap Cmd<>Ctrl keys + OS X style text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd\/Super instead of Ctrl, Line\/Text Start and End using Cmd+Arrows instead of Home\/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd\/Super instead of Ctrl. */
    get ConfigMacOSXBehaviors() { return this.unwrap().get_ConfigMacOSXBehaviors(); }
    set ConfigMacOSXBehaviors(v) { this.unwrap().set_ConfigMacOSXBehaviors(v); }

    /** @type {boolean} = true           \/\/ Enable input queue trickling: some types of events submitted during the same frame (e.g. button down + up) will be spread over multiple frames, improving interactions with low framerates. */
    get ConfigInputTrickleEventQueue() { return this.unwrap().get_ConfigInputTrickleEventQueue(); }
    set ConfigInputTrickleEventQueue(v) { this.unwrap().set_ConfigInputTrickleEventQueue(v); }

    /** @type {boolean} = true           \/\/ Enable blinking cursor (optional as some users consider it to be distracting). */
    get ConfigInputTextCursorBlink() { return this.unwrap().get_ConfigInputTextCursorBlink(); }
    set ConfigInputTextCursorBlink(v) { this.unwrap().set_ConfigInputTextCursorBlink(v); }

    /** @type {boolean} = false          \/\/ [BETA] Pressing Enter will keep item active and select contents (single-line only). */
    get ConfigInputTextEnterKeepActive() { return this.unwrap().get_ConfigInputTextEnterKeepActive(); }
    set ConfigInputTextEnterKeepActive(v) { this.unwrap().set_ConfigInputTextEnterKeepActive(v); }

    /** @type {boolean} = false          \/\/ [BETA] Enable turning DragXXX widgets into text input with a simple mouse click-release (without moving). Not desirable on devices without a keyboard. */
    get ConfigDragClickToInputText() { return this.unwrap().get_ConfigDragClickToInputText(); }
    set ConfigDragClickToInputText(v) { this.unwrap().set_ConfigDragClickToInputText(v); }

    /** @type {boolean} = true           \/\/ Enable resizing of windows from their edges and from the lower-left corner. This requires ImGuiBackendFlags_HasMouseCursors for better mouse cursor feedback. (This used to be a per-window ImGuiWindowFlags_ResizeFromAnySide flag) */
    get ConfigWindowsResizeFromEdges() { return this.unwrap().get_ConfigWindowsResizeFromEdges(); }
    set ConfigWindowsResizeFromEdges(v) { this.unwrap().set_ConfigWindowsResizeFromEdges(v); }

    /** @type {boolean} = false      \/\/ Enable allowing to move windows only when clicking on their title bar. Does not apply to windows without a title bar. */
    get ConfigWindowsMoveFromTitleBarOnly() { return this.unwrap().get_ConfigWindowsMoveFromTitleBarOnly(); }
    set ConfigWindowsMoveFromTitleBarOnly(v) { this.unwrap().set_ConfigWindowsMoveFromTitleBarOnly(v); }

    /** @type {boolean} = false      \/\/ [EXPERIMENTAL] CTRL+C copy the contents of focused window into the clipboard. Experimental because: (1) has known issues with nested Begin\/End pairs (2) text output quality varies (3) text output is in submission order rather than spatial order. */
    get ConfigWindowsCopyContentsWithCtrlC() { return this.unwrap().get_ConfigWindowsCopyContentsWithCtrlC(); }
    set ConfigWindowsCopyContentsWithCtrlC(v) { this.unwrap().set_ConfigWindowsCopyContentsWithCtrlC(v); }

    /** @type {boolean} = true           \/\/ Enable scrolling page by page when clicking outside the scrollbar grab. When disabled, always scroll to clicked location. When enabled, Shift+Click scrolls to clicked location. */
    get ConfigScrollbarScrollByPage() { return this.unwrap().get_ConfigScrollbarScrollByPage(); }
    set ConfigScrollbarScrollByPage(v) { this.unwrap().set_ConfigScrollbarScrollByPage(v); }

    /** @type {number} = 60.0f          \/\/ Timer (in seconds) to free transient windows\/tables memory buffers when unused. Set to -1.0f to disable. */
    get ConfigMemoryCompactTimer() { return this.unwrap().get_ConfigMemoryCompactTimer(); }
    set ConfigMemoryCompactTimer(v) { this.unwrap().set_ConfigMemoryCompactTimer(v); }

    /** @type {number} = 0.30f          \/\/ Time for a double-click, in seconds. */
    get MouseDoubleClickTime() { return this.unwrap().get_MouseDoubleClickTime(); }
    set MouseDoubleClickTime(v) { this.unwrap().set_MouseDoubleClickTime(v); }

    /** @type {number} = 6.0f           \/\/ Distance threshold to stay in to validate a double-click, in pixels. */
    get MouseDoubleClickMaxDist() { return this.unwrap().get_MouseDoubleClickMaxDist(); }
    set MouseDoubleClickMaxDist(v) { this.unwrap().set_MouseDoubleClickMaxDist(v); }

    /** @type {number} = 6.0f           \/\/ Distance threshold before considering we are dragging. */
    get MouseDragThreshold() { return this.unwrap().get_MouseDragThreshold(); }
    set MouseDragThreshold(v) { this.unwrap().set_MouseDragThreshold(v); }

    /** @type {number} = 0.275f         \/\/ When holding a key\/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.). */
    get KeyRepeatDelay() { return this.unwrap().get_KeyRepeatDelay(); }
    set KeyRepeatDelay(v) { this.unwrap().set_KeyRepeatDelay(v); }

    /** @type {number} = 0.050f         \/\/ When holding a key\/button, rate at which it repeats, in seconds. */
    get KeyRepeatRate() { return this.unwrap().get_KeyRepeatRate(); }
    set KeyRepeatRate(v) { this.unwrap().set_KeyRepeatRate(v); }

    /** @type {boolean} = true       \/\/ Enable error recovery support. Some errors won't be detected and lead to direct crashes if recovery is disabled. */
    get ConfigErrorRecovery() { return this.unwrap().get_ConfigErrorRecovery(); }
    set ConfigErrorRecovery(v) { this.unwrap().set_ConfigErrorRecovery(v); }

    /** @type {boolean} = true       \/\/ Enable asserts on recoverable error. By default call IM_ASSERT() when returning from a failing IM_ASSERT_USER_ERROR() */
    get ConfigErrorRecoveryEnableAssert() { return this.unwrap().get_ConfigErrorRecoveryEnableAssert(); }
    set ConfigErrorRecoveryEnableAssert(v) { this.unwrap().set_ConfigErrorRecoveryEnableAssert(v); }

    /** @type {boolean} = true       \/\/ Enable debug log output on recoverable errors. */
    get ConfigErrorRecoveryEnableDebugLog() { return this.unwrap().get_ConfigErrorRecoveryEnableDebugLog(); }
    set ConfigErrorRecoveryEnableDebugLog(v) { this.unwrap().set_ConfigErrorRecoveryEnableDebugLog(v); }

    /** @type {boolean} = true       \/\/ Enable tooltip on recoverable errors. The tooltip include a way to enable asserts if they were disabled. */
    get ConfigErrorRecoveryEnableTooltip() { return this.unwrap().get_ConfigErrorRecoveryEnableTooltip(); }
    set ConfigErrorRecoveryEnableTooltip(v) { this.unwrap().set_ConfigErrorRecoveryEnableTooltip(v); }

    /** @type {boolean} = false          \/\/ Enable various tools calling IM_DEBUG_BREAK(). */
    get ConfigDebugIsDebuggerPresent() { return this.unwrap().get_ConfigDebugIsDebuggerPresent(); }
    set ConfigDebugIsDebuggerPresent(v) { this.unwrap().set_ConfigDebugIsDebuggerPresent(v); }

    /** @type {boolean} = true           \/\/ Highlight and show an error message when multiple items have conflicting identifiers. */
    get ConfigDebugHighlightIdConflicts() { return this.unwrap().get_ConfigDebugHighlightIdConflicts(); }
    set ConfigDebugHighlightIdConflicts(v) { this.unwrap().set_ConfigDebugHighlightIdConflicts(v); }

    /** @type {boolean} = false          \/\/ First-time calls to Begin()\/BeginChild() will return false. NEEDS TO BE SET AT APPLICATION BOOT TIME if you don't want to miss windows. */
    get ConfigDebugBeginReturnValueOnce() { return this.unwrap().get_ConfigDebugBeginReturnValueOnce(); }
    set ConfigDebugBeginReturnValueOnce(v) { this.unwrap().set_ConfigDebugBeginReturnValueOnce(v); }

    /** @type {boolean} = false          \/\/ Some calls to Begin()\/BeginChild() will return false. Will cycle through window depths then repeat. Suggested use: add "io.ConfigDebugBeginReturnValue = io.KeyShift" in your main loop then occasionally press SHIFT. Windows should be flickering while running. */
    get ConfigDebugBeginReturnValueLoop() { return this.unwrap().get_ConfigDebugBeginReturnValueLoop(); }
    set ConfigDebugBeginReturnValueLoop(v) { this.unwrap().set_ConfigDebugBeginReturnValueLoop(v); }

    /** @type {boolean} = false          \/\/ Ignore io.AddFocusEvent(false), consequently not calling io.ClearInputKeys()\/io.ClearInputMouse() in input processing. */
    get ConfigDebugIgnoreFocusLoss() { return this.unwrap().get_ConfigDebugIgnoreFocusLoss(); }
    set ConfigDebugIgnoreFocusLoss(v) { this.unwrap().set_ConfigDebugIgnoreFocusLoss(v); }

    /** @type {boolean} = false          \/\/ Save .ini data with extra comments (particularly helpful for Docking, but makes saving slower) */
    get ConfigDebugIniSettings() { return this.unwrap().get_ConfigDebugIniSettings(); }
    set ConfigDebugIniSettings(v) { this.unwrap().set_ConfigDebugIniSettings(v); }

    /** @type {boolean} Set when Dear ImGui will use mouse inputs, in this case do not dispatch them to your main game\/application (either way, always pass on mouse inputs to imgui). (e.g. unclicked mouse is hovering over an imgui window, widget is active, mouse was clicked over an imgui window, etc.). */
    get WantCaptureMouse() { return this.unwrap().get_WantCaptureMouse(); }
    set WantCaptureMouse(v) { this.unwrap().set_WantCaptureMouse(v); }

    /** @type {boolean} Set when Dear ImGui will use keyboard inputs, in this case do not dispatch them to your main game\/application (either way, always pass keyboard inputs to imgui). (e.g. InputText active, or an imgui window is focused and navigation is enabled, etc.). */
    get WantCaptureKeyboard() { return this.unwrap().get_WantCaptureKeyboard(); }
    set WantCaptureKeyboard(v) { this.unwrap().set_WantCaptureKeyboard(v); }

    /** @type {boolean} Mobile\/console: when set, you may display an on-screen keyboard. This is set by Dear ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active). */
    get WantTextInput() { return this.unwrap().get_WantTextInput(); }
    set WantTextInput(v) { this.unwrap().set_WantTextInput(v); }

    /** @type {boolean} MousePos has been altered, backend should reposition mouse on next frame. Rarely used! Set only when io.ConfigNavMoveSetMousePos is enabled. */
    get WantSetMousePos() { return this.unwrap().get_WantSetMousePos(); }
    set WantSetMousePos(v) { this.unwrap().set_WantSetMousePos(v); }

    /** @type {boolean} When manual .ini load\/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. Important: clear io.WantSaveIniSettings yourself after saving! */
    get WantSaveIniSettings() { return this.unwrap().get_WantSaveIniSettings(); }
    set WantSaveIniSettings(v) { this.unwrap().set_WantSaveIniSettings(v); }

    /** @type {boolean} Keyboard\/Gamepad navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag. */
    get NavActive() { return this.unwrap().get_NavActive(); }
    set NavActive(v) { this.unwrap().set_NavActive(v); }

    /** @type {boolean} Keyboard\/Gamepad navigation highlight is visible and allowed (will handle ImGuiKey_NavXXX events). */
    get NavVisible() { return this.unwrap().get_NavVisible(); }
    set NavVisible(v) { this.unwrap().set_NavVisible(v); }

    /** @type {number} Estimate of application framerate (rolling average over 60 frames, based on io.DeltaTime), in frame per second. Solely for convenience. Slow applications may not want to use a moving average or may want to reset underlying buffers occasionally. */
    get Framerate() { return this.unwrap().get_Framerate(); }
    set Framerate(v) { this.unwrap().set_Framerate(v); }

    /** @type {number} Vertices output during last call to Render() */
    get MetricsRenderVertices() { return this.unwrap().get_MetricsRenderVertices(); }
    set MetricsRenderVertices(v) { this.unwrap().set_MetricsRenderVertices(v); }

    /** @type {number} Indices output during last call to Render() = number of triangles * 3 */
    get MetricsRenderIndices() { return this.unwrap().get_MetricsRenderIndices(); }
    set MetricsRenderIndices(v) { this.unwrap().set_MetricsRenderIndices(v); }

    /** @type {number} Number of visible windows */
    get MetricsRenderWindows() { return this.unwrap().get_MetricsRenderWindows(); }
    set MetricsRenderWindows(v) { this.unwrap().set_MetricsRenderWindows(v); }

    /** @type {number} Number of active windows */
    get MetricsActiveWindows() { return this.unwrap().get_MetricsActiveWindows(); }
    set MetricsActiveWindows(v) { this.unwrap().set_MetricsActiveWindows(v); }

    /** @type {ImVec2} Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing\/reappearing mouse won't have a huge delta. */
    get MouseDelta() { return ImVec2.wrap(this.unwrap().get_MouseDelta()); }
    set MouseDelta(v) { this.unwrap().set_MouseDelta(v.unwrap()); }

    /** @type {ImGuiContext} Parent UI context (needs to be set explicitly by parent). */
    get Ctx() { return ImGuiContext.wrap(this.unwrap().get_Ctx()); }
    set Ctx(v) { this.unwrap().set_Ctx(v.unwrap()); }

    /** @type {ImVec2} Mouse position, in pixels. Set to ImVec2(-FLT_MAX, -FLT_MAX) if mouse is unavailable (on another screen, etc.) */
    get MousePos() { return ImVec2.wrap(this.unwrap().get_MousePos()); }
    set MousePos(v) { this.unwrap().set_MousePos(v.unwrap()); }

    /** @type {number} Mouse wheel Vertical: 1 unit scrolls about 5 lines text. >0 scrolls Up, <0 scrolls Down. Hold SHIFT to turn vertical scroll into horizontal scroll. */
    get MouseWheel() { return this.unwrap().get_MouseWheel(); }
    set MouseWheel(v) { this.unwrap().set_MouseWheel(v); }

    /** @type {number} Mouse wheel Horizontal. >0 scrolls Left, <0 scrolls Right. Most users don't have a mouse with a horizontal wheel, may not be filled by all backends. */
    get MouseWheelH() { return this.unwrap().get_MouseWheelH(); }
    set MouseWheelH(v) { this.unwrap().set_MouseWheelH(v); }

    /** @type {ImGuiMouseSource} Mouse actual input peripheral (Mouse\/TouchScreen\/Pen). */
    get MouseSource() { return this.unwrap().get_MouseSource(); }
    set MouseSource(v) { this.unwrap().set_MouseSource(v); }

    /** @type {ImGuiID} (Optional) Modify using io.AddMouseViewportEvent(). With multi-viewports: viewport the OS mouse is hovering. If possible _IGNORING_ viewports with the ImGuiViewportFlags_NoInputs flag is much better (few backends can handle that). Set io.BackendFlags |= ImGuiBackendFlags_HasMouseHoveredViewport if you can provide this info. If you don't imgui will infer the value using the rectangles and last focused time of the viewports it knows about (ignoring other OS windows). */
    get MouseHoveredViewport() { return this.unwrap().get_MouseHoveredViewport(); }
    set MouseHoveredViewport(v) { this.unwrap().set_MouseHoveredViewport(v); }

    /** @type {boolean} Keyboard modifier down: Control */
    get KeyCtrl() { return this.unwrap().get_KeyCtrl(); }
    set KeyCtrl(v) { this.unwrap().set_KeyCtrl(v); }

    /** @type {boolean} Keyboard modifier down: Shift */
    get KeyShift() { return this.unwrap().get_KeyShift(); }
    set KeyShift(v) { this.unwrap().set_KeyShift(v); }

    /** @type {boolean} Keyboard modifier down: Alt */
    get KeyAlt() { return this.unwrap().get_KeyAlt(); }
    set KeyAlt(v) { this.unwrap().set_KeyAlt(v); }

    /** @type {boolean} Keyboard modifier down: Cmd\/Super\/Windows */
    get KeySuper() { return this.unwrap().get_KeySuper(); }
    set KeySuper(v) { this.unwrap().set_KeySuper(v); }

    /** @type {ImGuiKeyChord} Key mods flags (any of ImGuiMod_Ctrl\/ImGuiMod_Shift\/ImGuiMod_Alt\/ImGuiMod_Super flags, same as io.KeyCtrl\/KeyShift\/KeyAlt\/KeySuper but merged into flags. Read-only, updated by NewFrame() */
    get KeyMods() { return this.unwrap().get_KeyMods(); }
    set KeyMods(v) { this.unwrap().set_KeyMods(v); }

    /** @type {boolean} Alternative to WantCaptureMouse: (WantCaptureMouse == true && WantCaptureMouseUnlessPopupClose == false) when a click over void is expected to close a popup. */
    get WantCaptureMouseUnlessPopupClose() { return this.unwrap().get_WantCaptureMouseUnlessPopupClose(); }
    set WantCaptureMouseUnlessPopupClose(v) { this.unwrap().set_WantCaptureMouseUnlessPopupClose(v); }

    /** @type {ImVec2} Previous mouse position (note that MouseDelta is not necessary == MousePos-MousePosPrev, in case either position is invalid) */
    get MousePosPrev() { return ImVec2.wrap(this.unwrap().get_MousePosPrev()); }
    set MousePosPrev(v) { this.unwrap().set_MousePosPrev(v.unwrap()); }

    /**
     * [Auto] Queue a new key down\/up event. Key should be "translated" (as in, generally ImGuiKey_A matches the key end-user would use to emit an 'A' character)
     * @param {ImGuiKey} key
     * @param {boolean} down
     * @returns {void}
     */
    AddKeyEvent(key, down) { return this.unwrap().ImGuiIO_AddKeyEvent(key, down) }

    /**
     * [Auto] Queue a new key down\/up event for analog values (e.g. ImGuiKey_Gamepad_ values). Dead-zones should be handled by the backend.
     * @param {ImGuiKey} key
     * @param {boolean} down
     * @param {number} v
     * @returns {void}
     */
    AddKeyAnalogEvent(key, down, v) { return this.unwrap().ImGuiIO_AddKeyAnalogEvent(key, down, v) }

    /**
     * [Auto] Queue a mouse position update. Use -FLT_MAX,-FLT_MAX to signify no mouse (e.g. app not focused and not hovered)
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    AddMousePosEvent(x, y) { return this.unwrap().ImGuiIO_AddMousePosEvent(x, y) }

    /**
     * [Auto] Queue a mouse button change
     * @param {number} button
     * @param {boolean} down
     * @returns {void}
     */
    AddMouseButtonEvent(button, down) { return this.unwrap().ImGuiIO_AddMouseButtonEvent(button, down) }

    /**
     * [Auto] Queue a mouse wheel update. wheel_y<0: scroll down, wheel_y>0: scroll up, wheel_x<0: scroll right, wheel_x>0: scroll left.
     * @param {number} wheel_x
     * @param {number} wheel_y
     * @returns {void}
     */
    AddMouseWheelEvent(wheel_x, wheel_y) { return this.unwrap().ImGuiIO_AddMouseWheelEvent(wheel_x, wheel_y) }

    /**
     * [Auto] Queue a mouse source change (Mouse\/TouchScreen\/Pen)
     * @param {ImGuiMouseSource} source
     * @returns {void}
     */
    AddMouseSourceEvent(source) { return this.unwrap().ImGuiIO_AddMouseSourceEvent(source) }

    /**
     * [Auto] Queue a mouse hovered viewport. Requires backend to set ImGuiBackendFlags_HasMouseHoveredViewport to call this (for multi-viewport support).
     * @param {ImGuiID} id
     * @returns {void}
     */
    AddMouseViewportEvent(id) { return this.unwrap().ImGuiIO_AddMouseViewportEvent(id) }

    /**
     * [Auto] Queue a gain\/loss of focus for the application (generally based on OS\/platform focus of your window)
     * @param {boolean} focused
     * @returns {void}
     */
    AddFocusEvent(focused) { return this.unwrap().ImGuiIO_AddFocusEvent(focused) }

    /**
     * [Auto] Queue a new character input
     * @param {number} c
     * @returns {void}
     */
    AddInputCharacter(c) { return this.unwrap().ImGuiIO_AddInputCharacter(c) }

    /**
     * [Auto] Queue a new character input from a UTF-16 character, it can be a surrogate
     * @param {ImWchar16} c
     * @returns {void}
     */
    AddInputCharacterUTF16(c) { return this.unwrap().ImGuiIO_AddInputCharacterUTF16(c) }

    /**
     * [Auto] Queue a new characters input from a UTF-8 string
     * @param {string} str
     * @returns {void}
     */
    AddInputCharactersUTF8(str) { return this.unwrap().ImGuiIO_AddInputCharactersUTF8(str) }

    /**
     * [Auto] Implied native_legacy_index = -1
     * @param {ImGuiKey} key
     * @param {number} native_keycode
     * @param {number} native_scancode
     * @returns {void}
     */
    SetKeyEventNativeData(key, native_keycode, native_scancode) { return this.unwrap().ImGuiIO_SetKeyEventNativeData(key, native_keycode, native_scancode) }


    /**
     * [Auto] Set master flag for accepting key\/mouse\/text events (default to true). Useful if you have native dialog boxes that are interrupting your application loop\/refresh, and you want to disable events being queued while your app is frozen.
     * @param {boolean} accepting_events
     * @returns {void}
     */
    SetAppAcceptingEvents(accepting_events) { return this.unwrap().ImGuiIO_SetAppAcceptingEvents(accepting_events) }

    /**
     * [Auto] Clear all incoming events.
     * @returns {void}
     */
    ClearEventsQueue() { return this.unwrap().ImGuiIO_ClearEventsQueue() }

    /**
     * [Auto] Clear current keyboard\/gamepad state + current frame text input buffer. Equivalent to releasing all keys\/buttons.
     * @returns {void}
     */
    ClearInputKeys() { return this.unwrap().ImGuiIO_ClearInputKeys() }

    /**
     * [Auto] Clear current mouse state.
     * @returns {void}
     */
    ClearInputMouse() { return this.unwrap().ImGuiIO_ClearInputMouse() }

}

/** [Auto] Main IO structure returned by BeginMultiSelect()\/EndMultiSelect(). */
export class ImGuiMultiSelectIO extends StructBinding {
    constructor() { super("ImGuiMultiSelectIO"); }
}

/** [Auto] Draw command list */
export class ImDrawList extends StructBinding {
    constructor() { super("ImDrawList"); }
}

/** [Auto] All draw data to render a Dear ImGui frame */
export class ImDrawData extends StructBinding {
    constructor() { super("ImDrawData"); }
}

/** [Auto]  */
export class ImFontConfig extends StructBinding {
    constructor() { super("ImFontConfig"); }
}

/** [Auto] Load and rasterize multiple TTF\/OTF fonts into a same texture. The font atlas will build a single texture holding: */
export class ImFontAtlas extends StructBinding {
    constructor() { super("ImFontAtlas"); }
}

/** [Auto] Font runtime data and rendering */
export class ImFont extends StructBinding {
    constructor() { super("ImFont"); }
}


/* -------------------------------------------------------------------------- */
/* 5. Functions */
/* -------------------------------------------------------------------------- */

/**
 * Access to the ImGui functions.
 * @namespace
 */
export const ImGui = {
    /**
     * [Auto] Context creation and access
     * @param {ImFontAtlas} shared_font_atlas
     * @returns {ImGuiContext}
     */
    CreateContext: (shared_font_atlas = null) => { return ImGuiContext.wrap(Mod.main.ImGui_CreateContext(shared_font_atlas?.unwrap() || null)); },

    /**
     * [Auto] NULL = destroy current context
     * @param {ImGuiContext} ctx
     * @returns {void}
     */
    DestroyContext: (ctx = null) => { return Mod.main.ImGui_DestroyContext(ctx?.unwrap() || null); },

    /**
     * [Auto] 
     * @returns {ImGuiContext}
     */
    GetCurrentContext: () => { return ImGuiContext.wrap(Mod.main.ImGui_GetCurrentContext()); },

    /**
     * [Auto] 
     * @param {ImGuiContext} ctx
     * @returns {void}
     */
    SetCurrentContext: (ctx) => { return Mod.main.ImGui_SetCurrentContext(ctx?.unwrap() || null); },

    /**
     * [Auto] access the ImGuiIO structure (mouse\/keyboard\/gamepad inputs, time, various configuration options\/flags)
     * @returns {ImGuiIO}
     */
    GetIO: () => { return ImGuiIO.wrap(Mod.main.ImGui_GetIO()); },

    /**
     * [Auto] access the ImGuiPlatformIO structure (mostly hooks\/functions to connect to platform\/renderer and OS Clipboard, IME etc.)
     * @returns {ImGuiPlatformIO}
     */
    GetPlatformIO: () => { return Mod.main.ImGui_GetPlatformIO(); },

    /**
     * [Auto] access the Style structure (colors, sizes). Always use PushStyleColor(), PushStyleVar() to modify style mid-frame!
     * @returns {ImGuiStyle}
     */
    GetStyle: () => { return ImGuiStyle.wrap(Mod.main.ImGui_GetStyle()); },

    /**
     * [Auto] start a new Dear ImGui frame, you can submit any command from this point until Render()\/EndFrame().
     * @returns {void}
     */
    NewFrame: () => { return Mod.main.ImGui_NewFrame(); },

    /**
     * [Auto] ends the Dear ImGui frame. automatically called by Render(). If you don't need to render data (skipping rendering) you may call EndFrame() without Render()... but you'll have wasted CPU already! If you don't need to render, better to not create any windows and not call NewFrame() at all!
     * @returns {void}
     */
    EndFrame: () => { return Mod.main.ImGui_EndFrame(); },

    /**
     * [Auto] ends the Dear ImGui frame, finalize the draw data. You can then get call GetDrawData().
     * @returns {void}
     */
    Render: () => { return Mod.main.ImGui_Render(); },

    /**
     * [Auto] valid after Render() and until the next call to NewFrame(). this is what you have to render.
     * @returns {ImDrawData}
     */
    GetDrawData: () => { return ImDrawData.wrap(Mod.main.ImGui_GetDrawData()); },

    /**
     * [Auto] create Demo window. demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application!
     * @param {bool} p_open
     * @returns {void}
     */
    ShowDemoWindow: (p_open = null) => { return Mod.main.ImGui_ShowDemoWindow(p_open); },

    /**
     * [Auto] create Metrics\/Debugger window. display Dear ImGui internals: windows, draw commands, various internal state, etc.
     * @param {bool} p_open
     * @returns {void}
     */
    ShowMetricsWindow: (p_open = null) => { return Mod.main.ImGui_ShowMetricsWindow(p_open); },

    /**
     * [Auto] create Debug Log window. display a simplified log of important dear imgui events.
     * @param {bool} p_open
     * @returns {void}
     */
    ShowDebugLogWindow: (p_open = null) => { return Mod.main.ImGui_ShowDebugLogWindow(p_open); },

    /**
     * [Auto] create Stack Tool window. hover items with mouse to query information about the source of their unique ID.
     * @param {bool} p_open
     * @returns {void}
     */
    ShowIDStackToolWindow: (p_open = null) => { return Mod.main.ImGui_ShowIDStackToolWindowEx(p_open); },

    /**
     * [Auto] create About window. display Dear ImGui version, credits and build\/system information.
     * @param {bool} p_open
     * @returns {void}
     */
    ShowAboutWindow: (p_open = null) => { return Mod.main.ImGui_ShowAboutWindow(p_open); },

    /**
     * [Auto] add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style)
     * @param {ImGuiStyle} ref
     * @returns {void}
     */
    ShowStyleEditor: (ref = null) => { return Mod.main.ImGui_ShowStyleEditor(ref?.unwrap() || null); },

    /**
     * [Auto] add style selector block (not a window), essentially a combo listing the default styles.
     * @param {string} label
     * @returns {boolean}
     */
    ShowStyleSelector: (label) => { return Mod.main.ImGui_ShowStyleSelector(label); },

    /**
     * [Auto] add font selector block (not a window), essentially a combo listing the loaded fonts.
     * @param {string} label
     * @returns {void}
     */
    ShowFontSelector: (label) => { return Mod.main.ImGui_ShowFontSelector(label); },

    /**
     * [Auto] add basic help\/info block (not a window): how to manipulate ImGui as an end-user (mouse\/keyboard controls).
     * @returns {void}
     */
    ShowUserGuide: () => { return Mod.main.ImGui_ShowUserGuide(); },

    /**
     * [Auto] get the compiled version string e.g. "1.80 WIP" (essentially the value for IMGUI_VERSION from the compiled version of imgui.cpp)
     * @returns {string}
     */
    GetVersion: () => { return Mod.main.ImGui_GetVersion(); },

    /**
     * [Auto] new, recommended style (default)
     * @param {ImGuiStyle} dst
     * @returns {void}
     */
    StyleColorsDark: (dst = null) => { return Mod.main.ImGui_StyleColorsDark(dst?.unwrap() || null); },

    /**
     * [Auto] best used with borders and a custom, thicker font
     * @param {ImGuiStyle} dst
     * @returns {void}
     */
    StyleColorsLight: (dst = null) => { return Mod.main.ImGui_StyleColorsLight(dst?.unwrap() || null); },

    /**
     * [Auto] classic imgui style
     * @param {ImGuiStyle} dst
     * @returns {void}
     */
    StyleColorsClassic: (dst = null) => { return Mod.main.ImGui_StyleColorsClassic(dst?.unwrap() || null); },

    /**
     * [Auto] Windows
     * @param {string} name
     * @param {bool} p_open
     * @param {ImGuiWindowFlags} flags
     * @returns {boolean}
     */
    Begin: (name, p_open = null, flags = 0) => { return Mod.main.ImGui_Begin(name, p_open, flags); },

    /**
     * [Auto] 
     * @returns {void}
     */
    End: () => { return Mod.main.ImGui_End(); },

    /**
     * [Auto] Child Windows
     * @param {string} str_id
     * @param {ImVec2} size
     * @param {ImGuiChildFlags} child_flags
     * @param {ImGuiWindowFlags} window_flags
     * @returns {boolean}
     */
    BeginChild: (str_id, size = new ImVec2(0, 0), child_flags = 0, window_flags = 0) => { return Mod.main.ImGui_BeginChild(str_id, size?.unwrap() || null, child_flags, window_flags); },

    /**
     * [Auto] 
     * @returns {void}
     */
    EndChild: () => { return Mod.main.ImGui_EndChild(); },

    /**
     * [Auto] Windows Utilities
     * @returns {boolean}
     */
    IsWindowAppearing: () => { return Mod.main.ImGui_IsWindowAppearing(); },

    /**
     * [Auto] 
     * @returns {boolean}
     */
    IsWindowCollapsed: () => { return Mod.main.ImGui_IsWindowCollapsed(); },

    /**
     * [Auto] is current window focused? or its root\/child, depending on flags. see flags for options.
     * @param {ImGuiFocusedFlags} flags
     * @returns {boolean}
     */
    IsWindowFocused: (flags = 0) => { return Mod.main.ImGui_IsWindowFocused(flags); },

    /**
     * [Auto] is current window hovered and hoverable (e.g. not blocked by a popup\/modal)? See ImGuiHoveredFlags_ for options. IMPORTANT: If you are trying to check whether your mouse should be dispatched to Dear ImGui or to your underlying app, you should not use this function! Use the 'io.WantCaptureMouse' boolean for that! Refer to FAQ entry "How can I tell whether to dispatch mouse\/keyboard to Dear ImGui or my application?" for details.
     * @param {ImGuiHoveredFlags} flags
     * @returns {boolean}
     */
    IsWindowHovered: (flags = 0) => { return Mod.main.ImGui_IsWindowHovered(flags); },

    /**
     * [Auto] get draw list associated to the current window, to append your own drawing primitives
     * @returns {ImDrawList}
     */
    GetWindowDrawList: () => { return ImDrawList.wrap(Mod.main.ImGui_GetWindowDrawList()); },

    /**
     * [Auto] get DPI scale currently associated to the current window's viewport.
     * @returns {number}
     */
    GetWindowDpiScale: () => { return Mod.main.ImGui_GetWindowDpiScale(); },

    /**
     * [Auto] get current window position in screen space (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead)
     * @returns {ImVec2}
     */
    GetWindowPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetWindowPos()); },

    /**
     * [Auto] get current window size (IT IS UNLIKELY YOU EVER NEED TO USE THIS. Consider always using GetCursorScreenPos() and GetContentRegionAvail() instead)
     * @returns {ImVec2}
     */
    GetWindowSize: () => { return ImVec2.wrap(Mod.main.ImGui_GetWindowSize()); },

    /**
     * [Auto] get current window width (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().x.
     * @returns {number}
     */
    GetWindowWidth: () => { return Mod.main.ImGui_GetWindowWidth(); },

    /**
     * [Auto] get current window height (IT IS UNLIKELY YOU EVER NEED TO USE THIS). Shortcut for GetWindowSize().y.
     * @returns {number}
     */
    GetWindowHeight: () => { return Mod.main.ImGui_GetWindowHeight(); },

    /**
     * [Auto] get viewport currently associated to the current window.
     * @returns {ImGuiViewport}
     */
    GetWindowViewport: () => { return Mod.main.ImGui_GetWindowViewport(); },

    /**
     * [Auto] set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc.
     * @param {ImVec2} pos
     * @param {ImGuiCond} cond
     * @param {ImVec2} pivot
     * @returns {void}
     */
    SetNextWindowPos: (pos, cond = 0, pivot = new ImVec2(0, 0)) => { return Mod.main.ImGui_SetNextWindowPosEx(pos?.unwrap() || null, cond, pivot?.unwrap() || null); },

    /**
     * [Auto] set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin()
     * @param {ImVec2} size
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetNextWindowSize: (size, cond = 0) => { return Mod.main.ImGui_SetNextWindowSize(size?.unwrap() || null, cond); },

    /**
     * [Auto] set next window content size (~ scrollable client area, which enforce the range of scrollbars). Not including window decorations (title bar, menu bar, etc.) nor WindowPadding. set an axis to 0.0f to leave it automatic. call before Begin()
     * @param {ImVec2} size
     * @returns {void}
     */
    SetNextWindowContentSize: (size) => { return Mod.main.ImGui_SetNextWindowContentSize(size?.unwrap() || null); },

    /**
     * [Auto] set next window collapsed state. call before Begin()
     * @param {boolean} collapsed
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetNextWindowCollapsed: (collapsed, cond = 0) => { return Mod.main.ImGui_SetNextWindowCollapsed(collapsed, cond); },

    /**
     * [Auto] set next window to be focused \/ top-most. call before Begin()
     * @returns {void}
     */
    SetNextWindowFocus: () => { return Mod.main.ImGui_SetNextWindowFocus(); },

    /**
     * [Auto] set next window scrolling value (use < 0.0f to not affect a given axis).
     * @param {ImVec2} scroll
     * @returns {void}
     */
    SetNextWindowScroll: (scroll) => { return Mod.main.ImGui_SetNextWindowScroll(scroll?.unwrap() || null); },

    /**
     * [Auto] set next window background color alpha. helper to easily override the Alpha component of ImGuiCol_WindowBg\/ChildBg\/PopupBg. you may also use ImGuiWindowFlags_NoBackground.
     * @param {number} alpha
     * @returns {void}
     */
    SetNextWindowBgAlpha: (alpha) => { return Mod.main.ImGui_SetNextWindowBgAlpha(alpha); },

    /**
     * [Auto] set next window viewport
     * @param {ImGuiID} viewport_id
     * @returns {void}
     */
    SetNextWindowViewport: (viewport_id) => { return Mod.main.ImGui_SetNextWindowViewport(viewport_id); },

    /**
     * [Auto] (not recommended) set current window position - call within Begin()\/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects.
     * @param {ImVec2} pos
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetWindowPos: (pos, cond = 0) => { return Mod.main.ImGui_SetWindowPos(pos?.unwrap() || null, cond); },

    /**
     * [Auto] (not recommended) set current window size - call within Begin()\/End(). set to ImVec2(0, 0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects.
     * @param {ImVec2} size
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetWindowSize: (size, cond = 0) => { return Mod.main.ImGui_SetWindowSize(size?.unwrap() || null, cond); },

    /**
     * [Auto] (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed().
     * @param {boolean} collapsed
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetWindowCollapsed: (collapsed, cond = 0) => { return Mod.main.ImGui_SetWindowCollapsed(collapsed, cond); },

    /**
     * [Auto] (not recommended) set current window to be focused \/ top-most. prefer using SetNextWindowFocus().
     * @returns {void}
     */
    SetWindowFocus: () => { return Mod.main.ImGui_SetWindowFocus(); },

    /**
     * [Auto] [OBSOLETE] set font scale. Adjust IO.FontGlobalScale if you want to scale all windows. This is an old API! For correct scaling, prefer to reload font + rebuild ImFontAtlas + call style.ScaleAllSizes().
     * @param {number} scale
     * @returns {void}
     */
    SetWindowFontScale: (scale) => { return Mod.main.ImGui_SetWindowFontScale(scale); },

    /**
     * [Auto] get scrolling amount [0 .. GetScrollMaxX()]
     * @returns {number}
     */
    GetScrollX: () => { return Mod.main.ImGui_GetScrollX(); },

    /**
     * [Auto] get scrolling amount [0 .. GetScrollMaxY()]
     * @returns {number}
     */
    GetScrollY: () => { return Mod.main.ImGui_GetScrollY(); },

    /**
     * [Auto] set scrolling amount [0 .. GetScrollMaxX()]
     * @param {number} scroll_x
     * @returns {void}
     */
    SetScrollX: (scroll_x) => { return Mod.main.ImGui_SetScrollX(scroll_x); },

    /**
     * [Auto] set scrolling amount [0 .. GetScrollMaxY()]
     * @param {number} scroll_y
     * @returns {void}
     */
    SetScrollY: (scroll_y) => { return Mod.main.ImGui_SetScrollY(scroll_y); },

    /**
     * [Auto] get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x
     * @returns {number}
     */
    GetScrollMaxX: () => { return Mod.main.ImGui_GetScrollMaxX(); },

    /**
     * [Auto] get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y
     * @returns {number}
     */
    GetScrollMaxY: () => { return Mod.main.ImGui_GetScrollMaxY(); },

    /**
     * [Auto] adjust scrolling amount to make current cursor position visible. center_x_ratio=0.0: left, 0.5: center, 1.0: right. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead.
     * @param {number} center_x_ratio
     * @returns {void}
     */
    SetScrollHereX: (center_x_ratio = 0.5) => { return Mod.main.ImGui_SetScrollHereX(center_x_ratio); },

    /**
     * [Auto] adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default\/current item" visible, consider using SetItemDefaultFocus() instead.
     * @param {number} center_y_ratio
     * @returns {void}
     */
    SetScrollHereY: (center_y_ratio = 0.5) => { return Mod.main.ImGui_SetScrollHereY(center_y_ratio); },

    /**
     * [Auto] adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
     * @param {number} local_x
     * @param {number} center_x_ratio
     * @returns {void}
     */
    SetScrollFromPosX: (local_x, center_x_ratio = 0.5) => { return Mod.main.ImGui_SetScrollFromPosX(local_x, center_x_ratio); },

    /**
     * [Auto] adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
     * @param {number} local_y
     * @param {number} center_y_ratio
     * @returns {void}
     */
    SetScrollFromPosY: (local_y, center_y_ratio = 0.5) => { return Mod.main.ImGui_SetScrollFromPosY(local_y, center_y_ratio); },

    /**
     * [Auto] use NULL as a shortcut to push default font
     * @param {ImFont} font
     * @returns {void}
     */
    PushFont: (font) => { return Mod.main.ImGui_PushFont(font?.unwrap() || null); },

    /**
     * [Auto] 
     * @returns {void}
     */
    PopFont: () => { return Mod.main.ImGui_PopFont(); },

    /**
     * [Auto] modify a style color. always use this if you modify the style after NewFrame().
     * @param {ImGuiCol} idx
     * @param {ImU32} col
     * @returns {void}
     */
    PushStyleColor: (idx, col) => { return Mod.main.ImGui_PushStyleColor(idx, col); },

    /**
     * [Auto] 
     * @param {number} count
     * @returns {void}
     */
    PopStyleColor: (count = 1) => { return Mod.main.ImGui_PopStyleColorEx(count); },

    /**
     * [Auto] modify a style float variable. always use this if you modify the style after NewFrame()!
     * @param {ImGuiStyleVar} idx
     * @param {number} val
     * @returns {void}
     */
    PushStyleVar: (idx, val) => { return Mod.main.ImGui_PushStyleVar(idx, val); },

    /**
     * [Auto] modify X component of a style ImVec2 variable. "
     * @param {ImGuiStyleVar} idx
     * @param {number} val_x
     * @returns {void}
     */
    PushStyleVarX: (idx, val_x) => { return Mod.main.ImGui_PushStyleVarX(idx, val_x); },

    /**
     * [Auto] modify Y component of a style ImVec2 variable. "
     * @param {ImGuiStyleVar} idx
     * @param {number} val_y
     * @returns {void}
     */
    PushStyleVarY: (idx, val_y) => { return Mod.main.ImGui_PushStyleVarY(idx, val_y); },

    /**
     * [Auto] 
     * @param {number} count
     * @returns {void}
     */
    PopStyleVar: (count = 1) => { return Mod.main.ImGui_PopStyleVarEx(count); },

    /**
     * [Auto] modify specified shared item flag, e.g. PushItemFlag(ImGuiItemFlags_NoTabStop, true)
     * @param {ImGuiItemFlags} option
     * @param {boolean} enabled
     * @returns {void}
     */
    PushItemFlag: (option, enabled) => { return Mod.main.ImGui_PushItemFlag(option, enabled); },

    /**
     * [Auto] 
     * @returns {void}
     */
    PopItemFlag: () => { return Mod.main.ImGui_PopItemFlag(); },

    /**
     * [Auto] push width of items for common large "item+label" widgets. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side).
     * @param {number} item_width
     * @returns {void}
     */
    PushItemWidth: (item_width) => { return Mod.main.ImGui_PushItemWidth(item_width); },

    /**
     * [Auto] 
     * @returns {void}
     */
    PopItemWidth: () => { return Mod.main.ImGui_PopItemWidth(); },

    /**
     * [Auto] set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side)
     * @param {number} item_width
     * @returns {void}
     */
    SetNextItemWidth: (item_width) => { return Mod.main.ImGui_SetNextItemWidth(item_width); },

    /**
     * [Auto] width of item given pushed settings and current cursor position. NOT necessarily the width of last item unlike most 'Item' functions.
     * @returns {number}
     */
    CalcItemWidth: () => { return Mod.main.ImGui_CalcItemWidth(); },

    /**
     * [Auto] push word-wrapping position for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space
     * @param {number} wrap_local_pos_x
     * @returns {void}
     */
    PushTextWrapPos: (wrap_local_pos_x = 0.0) => { return Mod.main.ImGui_PushTextWrapPos(wrap_local_pos_x); },

    /**
     * [Auto] 
     * @returns {void}
     */
    PopTextWrapPos: () => { return Mod.main.ImGui_PopTextWrapPos(); },

    /**
     * [Auto] get current font
     * @returns {ImFont}
     */
    GetFont: () => { return ImFont.wrap(Mod.main.ImGui_GetFont()); },

    /**
     * [Auto] get current font size (= height in pixels) of current font with current scale applied
     * @returns {number}
     */
    GetFontSize: () => { return Mod.main.ImGui_GetFontSize(); },

    /**
     * [Auto] get UV coordinate for a white pixel, useful to draw custom shapes via the ImDrawList API
     * @returns {ImVec2}
     */
    GetFontTexUvWhitePixel: () => { return ImVec2.wrap(Mod.main.ImGui_GetFontTexUvWhitePixel()); },

    /**
     * [Auto] retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwise use GetColorU32() to get style color with style alpha baked in.
     * @param {ImGuiCol} idx
     * @returns {ImVec4}
     */
    GetStyleColorVec4: (idx) => { return ImVec4.wrap(Mod.main.ImGui_GetStyleColorVec4(idx)); },

    /**
     * [Auto] cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND (prefer using this rather than GetCursorPos(), also more useful to work with ImDrawList API).
     * @returns {ImVec2}
     */
    GetCursorScreenPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorScreenPos()); },

    /**
     * [Auto] cursor position, absolute coordinates. THIS IS YOUR BEST FRIEND.
     * @param {ImVec2} pos
     * @returns {void}
     */
    SetCursorScreenPos: (pos) => { return Mod.main.ImGui_SetCursorScreenPos(pos?.unwrap() || null); },

    /**
     * [Auto] available space from current position. THIS IS YOUR BEST FRIEND.
     * @returns {ImVec2}
     */
    GetContentRegionAvail: () => { return ImVec2.wrap(Mod.main.ImGui_GetContentRegionAvail()); },

    /**
     * [Auto] [window-local] cursor position in window-local coordinates. This is not your best friend.
     * @returns {ImVec2}
     */
    GetCursorPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorPos()); },

    /**
     * [Auto] [window-local] "
     * @returns {number}
     */
    GetCursorPosX: () => { return Mod.main.ImGui_GetCursorPosX(); },

    /**
     * [Auto] [window-local] "
     * @returns {number}
     */
    GetCursorPosY: () => { return Mod.main.ImGui_GetCursorPosY(); },

    /**
     * [Auto] [window-local] "
     * @param {ImVec2} local_pos
     * @returns {void}
     */
    SetCursorPos: (local_pos) => { return Mod.main.ImGui_SetCursorPos(local_pos?.unwrap() || null); },

    /**
     * [Auto] [window-local] "
     * @param {number} local_x
     * @returns {void}
     */
    SetCursorPosX: (local_x) => { return Mod.main.ImGui_SetCursorPosX(local_x); },

    /**
     * [Auto] [window-local] "
     * @param {number} local_y
     * @returns {void}
     */
    SetCursorPosY: (local_y) => { return Mod.main.ImGui_SetCursorPosY(local_y); },

    /**
     * [Auto] [window-local] initial cursor position, in window-local coordinates. Call GetCursorScreenPos() after Begin() to get the absolute coordinates version.
     * @returns {ImVec2}
     */
    GetCursorStartPos: () => { return ImVec2.wrap(Mod.main.ImGui_GetCursorStartPos()); },

    /**
     * [Auto] separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator.
     * @returns {void}
     */
    Separator: () => { return Mod.main.ImGui_Separator(); },

    /**
     * [Auto] call between widgets or groups to layout them horizontally. X position given in window coordinates.
     * @param {number} offset_from_start_x
     * @param {number} spacing
     * @returns {void}
     */
    SameLine: (offset_from_start_x = 0.0, spacing = -1.0) => { return Mod.main.ImGui_SameLineEx(offset_from_start_x, spacing); },

    /**
     * [Auto] undo a SameLine() or force a new line when in a horizontal-layout context.
     * @returns {void}
     */
    NewLine: () => { return Mod.main.ImGui_NewLine(); },

    /**
     * [Auto] add vertical spacing.
     * @returns {void}
     */
    Spacing: () => { return Mod.main.ImGui_Spacing(); },

    /**
     * [Auto] add a dummy item of given size. unlike InvisibleButton(), Dummy() won't take the mouse click or be navigable into.
     * @param {ImVec2} size
     * @returns {void}
     */
    Dummy: (size) => { return Mod.main.ImGui_Dummy(size?.unwrap() || null); },

    /**
     * [Auto] move content position toward the right, by indent_w, or style.IndentSpacing if indent_w <= 0
     * @param {number} indent_w
     * @returns {void}
     */
    Indent: (indent_w = 0.0) => { return Mod.main.ImGui_IndentEx(indent_w); },

    /**
     * [Auto] move content position back to the left, by indent_w, or style.IndentSpacing if indent_w <= 0
     * @param {number} indent_w
     * @returns {void}
     */
    Unindent: (indent_w = 0.0) => { return Mod.main.ImGui_UnindentEx(indent_w); },

    /**
     * [Auto] lock horizontal starting position
     * @returns {void}
     */
    BeginGroup: () => { return Mod.main.ImGui_BeginGroup(); },

    /**
     * [Auto] unlock horizontal starting position + capture the whole group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.)
     * @returns {void}
     */
    EndGroup: () => { return Mod.main.ImGui_EndGroup(); },

    /**
     * [Auto] vertically align upcoming text baseline to FramePadding.y so that it will align properly to regularly framed items (call if you have text on a line before a framed item)
     * @returns {void}
     */
    AlignTextToFramePadding: () => { return Mod.main.ImGui_AlignTextToFramePadding(); },

    /**
     * [Auto] ~ FontSize
     * @returns {number}
     */
    GetTextLineHeight: () => { return Mod.main.ImGui_GetTextLineHeight(); },

    /**
     * [Auto] ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text)
     * @returns {number}
     */
    GetTextLineHeightWithSpacing: () => { return Mod.main.ImGui_GetTextLineHeightWithSpacing(); },

    /**
     * [Auto] ~ FontSize + style.FramePadding.y * 2
     * @returns {number}
     */
    GetFrameHeight: () => { return Mod.main.ImGui_GetFrameHeight(); },

    /**
     * [Auto] ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets)
     * @returns {number}
     */
    GetFrameHeightWithSpacing: () => { return Mod.main.ImGui_GetFrameHeightWithSpacing(); },

    /**
     * [Auto] push string into the ID stack (will hash string).
     * @param {string} str_id
     * @returns {void}
     */
    PushID: (str_id) => { return Mod.main.ImGui_PushID(str_id); },

    /**
     * [Auto] pop from the ID stack.
     * @returns {void}
     */
    PopID: () => { return Mod.main.ImGui_PopID(); },

    /**
     * [Auto] calculate unique ID (hash of whole ID stack + given parameter). e.g. if you want to query into ImGuiStorage yourself
     * @param {string} str_id
     * @returns {ImGuiID}
     */
    GetID: (str_id) => { return Mod.main.ImGui_GetID(str_id); },

    /** [Manual] formatted text
     * @param {string} fmt
     * @returns {void}
     */
    Text: (fmt) => { return Mod.main.ImGui_Text(fmt); },

    /** [Manual] shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor();
     * @param {ImVec4} col
     * @param {string} fmt
     * @returns {void}
     */
    TextColored: (col, fmt) => { return Mod.main.ImGui_TextColored(col?.unwrap() || null, fmt); },

    /** [Manual] shortcut for PushStyleColor(ImGuiCol_TextDisabled); Text(fmt, ...); PopStyleColor();
     * @param {string} fmt
     * @returns {void}
     */
    TextDisabled: (fmt) => { return Mod.main.ImGui_TextDisabled(fmt); },

    /** [Manual] shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize().
     * @param {string} fmt
     * @returns {void}
     */
    TextWrapped: (fmt) => { return Mod.main.ImGui_TextWrapped(fmt); },

    /** [Manual] display text+label aligned the same way as value+label widgets
     * @param {string} label
     * @param {string} fmt
     * @returns {void}
     */
    LabelText: (label, fmt) => { return Mod.main.ImGui_LabelText(label, fmt); },

    /** [Manual] shortcut for Bullet()+Text()
     * @param {string} fmt
     * @returns {void}
     */
    BulletText: (fmt) => { return Mod.main.ImGui_BulletText(fmt); },

    /**
     * [Auto] currently: formatted text with an horizontal line
     * @param {string} label
     * @returns {void}
     */
    SeparatorText: (label) => { return Mod.main.ImGui_SeparatorText(label); },

    /**
     * [Auto] button
     * @param {string} label
     * @param {ImVec2} size
     * @returns {boolean}
     */
    Button: (label, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_ButtonEx(label, size?.unwrap() || null); },

    /**
     * [Auto] button with (FramePadding.y == 0) to easily embed within text
     * @param {string} label
     * @returns {boolean}
     */
    SmallButton: (label) => { return Mod.main.ImGui_SmallButton(label); },

    /**
     * [Auto] flexible button behavior without the visuals, frequently useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.)
     * @param {string} str_id
     * @param {ImVec2} size
     * @param {ImGuiButtonFlags} flags
     * @returns {boolean}
     */
    InvisibleButton: (str_id, size, flags = 0) => { return Mod.main.ImGui_InvisibleButton(str_id, size?.unwrap() || null, flags); },

    /**
     * [Auto] square button with an arrow shape
     * @param {string} str_id
     * @param {ImGuiDir} dir
     * @returns {boolean}
     */
    ArrowButton: (str_id, dir) => { return Mod.main.ImGui_ArrowButton(str_id, dir); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {bool} v
     * @returns {boolean}
     */
    Checkbox: (label, v) => { return Mod.main.ImGui_Checkbox(label, v); },

    /**
     * [Auto] use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; }
     * @param {string} label
     * @param {boolean} active
     * @returns {boolean}
     */
    RadioButton: (label, active) => { return Mod.main.ImGui_RadioButton(label, active); },

    /**
     * [Auto] 
     * @param {number} fraction
     * @param {ImVec2} size_arg
     * @param {string} overlay
     * @returns {void}
     */
    ProgressBar: (fraction, size_arg = new ImVec2(-Number.MIN_VALUE, 0), overlay = null) => { return Mod.main.ImGui_ProgressBar(fraction, size_arg?.unwrap() || null, overlay); },

    /**
     * [Auto] draw a small circle + keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses
     * @returns {void}
     */
    Bullet: () => { return Mod.main.ImGui_Bullet(); },

    /**
     * [Auto] hyperlink text button, return true when clicked
     * @param {string} label
     * @returns {boolean}
     */
    TextLink: (label) => { return Mod.main.ImGui_TextLink(label); },

    /**
     * [Auto] hyperlink text button, automatically open file\/url when clicked
     * @param {string} label
     * @param {string} url
     * @returns {void}
     */
    TextLinkOpenURL: (label, url = null) => { return Mod.main.ImGui_TextLinkOpenURLEx(label, url); },

    /**
     * [Auto] Widgets: Combo Box (Dropdown)
     * @param {string} label
     * @param {string} preview_value
     * @param {ImGuiComboFlags} flags
     * @returns {boolean}
     */
    BeginCombo: (label, preview_value, flags = 0) => { return Mod.main.ImGui_BeginCombo(label, preview_value, flags); },

    /**
     * [Auto] only call EndCombo() if BeginCombo() returns true!
     * @returns {void}
     */
    EndCombo: () => { return Mod.main.ImGui_EndCombo(); },

    /**
     * [Auto] If v_min >= v_max we have no bound
     * @param {string} label
     * @param {float} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragFloat: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloatEx(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[2]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragFloat2: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat2Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[3]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragFloat3: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat3Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[4]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragFloat4: (label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_DragFloat4Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float} v_current_min
     * @param {float} v_current_max
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {string} format_max
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragFloatRange2: (label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0.0, v_max = 0.0, format = "%.3f", format_max = null, flags = 0) => { return Mod.main.ImGui_DragFloatRange2Ex(label, v_current_min, v_current_max, v_speed, v_min, v_max, format, format_max, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[2]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragInt2: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt2Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[3]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragInt3: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt3Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[4]} v
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragInt4: (label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) => { return Mod.main.ImGui_DragInt4Ex(label, v, v_speed, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int} v_current_min
     * @param {int} v_current_max
     * @param {number} v_speed
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {string} format_max
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    DragIntRange2: (label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", format_max = null, flags = 0) => { return Mod.main.ImGui_DragIntRange2Ex(label, v_current_min, v_current_max, v_speed, v_min, v_max, format, format_max, flags); },

    /**
     * [Auto] adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display.
     * @param {string} label
     * @param {float} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderFloat: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloatEx(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[2]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderFloat2: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat2Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[3]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderFloat3: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat3Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[4]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderFloat4: (label, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_SliderFloat4Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float} v_rad
     * @param {number} v_degrees_min
     * @param {number} v_degrees_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderAngle: (label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0, format = "%.0f deg", flags = 0) => { return Mod.main.ImGui_SliderAngleEx(label, v_rad, v_degrees_min, v_degrees_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[2]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderInt2: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt2Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[3]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderInt3: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt3Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[4]} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    SliderInt4: (label, v, v_min, v_max, format = "%d", flags = 0) => { return Mod.main.ImGui_SliderInt4Ex(label, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {ImVec2} size
     * @param {float} v
     * @param {number} v_min
     * @param {number} v_max
     * @param {string} format
     * @param {ImGuiSliderFlags} flags
     * @returns {boolean}
     */
    VSliderFloat: (label, size, v, v_min, v_max, format = "%.3f", flags = 0) => { return Mod.main.ImGui_VSliderFloatEx(label, size?.unwrap() || null, v, v_min, v_max, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {char} buf
     * @param {size_t} buf_size
     * @param {ImGuiInputTextFlags} flags
     * @param {ImGuiInputTextCallback} callback
     * @param {void} user_data
     * @returns {boolean}
     */
    InputText: (label, buf, buf_size, flags = 0, callback = null, user_data = null) => { return Mod.main.ImGui_InputTextEx(label, buf, buf_size, flags, callback, user_data); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {char} buf
     * @param {size_t} buf_size
     * @param {ImVec2} size
     * @param {ImGuiInputTextFlags} flags
     * @param {ImGuiInputTextCallback} callback
     * @param {void} user_data
     * @returns {boolean}
     */
    InputTextMultiline: (label, buf, buf_size, size = new ImVec2(0, 0), flags = 0, callback = null, user_data = null) => { return Mod.main.ImGui_InputTextMultilineEx(label, buf, buf_size, size?.unwrap() || null, flags, callback, user_data); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {string} hint
     * @param {char} buf
     * @param {size_t} buf_size
     * @param {ImGuiInputTextFlags} flags
     * @param {ImGuiInputTextCallback} callback
     * @param {void} user_data
     * @returns {boolean}
     */
    InputTextWithHint: (label, hint, buf, buf_size, flags = 0, callback = null, user_data = null) => { return Mod.main.ImGui_InputTextWithHintEx(label, hint, buf, buf_size, flags, callback, user_data); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float} v
     * @param {number} step
     * @param {number} step_fast
     * @param {string} format
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputFloat: (label, v, step = 0.0, step_fast = 0.0, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloatEx(label, v, step, step_fast, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[2]} v
     * @param {string} format
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputFloat2: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat2Ex(label, v, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[3]} v
     * @param {string} format
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputFloat3: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat3Ex(label, v, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[4]} v
     * @param {string} format
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputFloat4: (label, v, format = "%.3f", flags = 0) => { return Mod.main.ImGui_InputFloat4Ex(label, v, format, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[2]} v
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputInt2: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt2(label, v, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[3]} v
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputInt3: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt3(label, v, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {int[4]} v
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputInt4: (label, v, flags = 0) => { return Mod.main.ImGui_InputInt4(label, v, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {double} v
     * @param {number} step
     * @param {number} step_fast
     * @param {string} format
     * @param {ImGuiInputTextFlags} flags
     * @returns {boolean}
     */
    InputDouble: (label, v, step = 0.0, step_fast = 0.0, format = "%.6f", flags = 0) => { return Mod.main.ImGui_InputDoubleEx(label, v, step, step_fast, format, flags); },

    /**
     * [Auto] Widgets: Color Editor\/Picker (tip: the ColorEdit* functions have a little color square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
     * @param {string} label
     * @param {float[3]} col
     * @param {ImGuiColorEditFlags} flags
     * @returns {boolean}
     */
    ColorEdit3: (label, col, flags = 0) => { return Mod.main.ImGui_ColorEdit3(label, col, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[4]} col
     * @param {ImGuiColorEditFlags} flags
     * @returns {boolean}
     */
    ColorEdit4: (label, col, flags = 0) => { return Mod.main.ImGui_ColorEdit4(label, col, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[3]} col
     * @param {ImGuiColorEditFlags} flags
     * @returns {boolean}
     */
    ColorPicker3: (label, col, flags = 0) => { return Mod.main.ImGui_ColorPicker3(label, col, flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {float[4]} col
     * @param {ImGuiColorEditFlags} flags
     * @param {float} ref_col
     * @returns {boolean}
     */
    ColorPicker4: (label, col, flags = 0, ref_col = null) => { return Mod.main.ImGui_ColorPicker4(label, col, flags, ref_col); },

    /**
     * [Auto] display a color square\/button, hover for details, return true when pressed.
     * @param {string} desc_id
     * @param {ImVec4} col
     * @param {ImGuiColorEditFlags} flags
     * @param {ImVec2} size
     * @returns {boolean}
     */
    ColorButton: (desc_id, col, flags = 0, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_ColorButtonEx(desc_id, col?.unwrap() || null, flags, size?.unwrap() || null); },

    /**
     * [Auto] initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls.
     * @param {ImGuiColorEditFlags} flags
     * @returns {void}
     */
    SetColorEditOptions: (flags) => { return Mod.main.ImGui_SetColorEditOptions(flags); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {ImGuiTreeNodeFlags} flags
     * @returns {boolean}
     */
    TreeNode: (label, flags = 0) => { return Mod.main.ImGui_TreeNodeEx(label, flags); },

    /**
     * [Auto] ~ Indent()+PushID(). Already called by TreeNode() when returning true, but you can call TreePush\/TreePop yourself if desired.
     * @param {string} str_id
     * @returns {void}
     */
    TreePush: (str_id) => { return Mod.main.ImGui_TreePush(str_id); },

    /**
     * [Auto] ~ Unindent()+PopID()
     * @returns {void}
     */
    TreePop: () => { return Mod.main.ImGui_TreePop(); },

    /**
     * [Auto] horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode
     * @returns {number}
     */
    GetTreeNodeToLabelSpacing: () => { return Mod.main.ImGui_GetTreeNodeToLabelSpacing(); },

    /**
     * [Auto] if returning 'true' the header is open. doesn't indent nor push on ID stack. user doesn't have to call TreePop().
     * @param {string} label
     * @param {ImGuiTreeNodeFlags} flags
     * @returns {boolean}
     */
    CollapsingHeader: (label, flags = 0) => { return Mod.main.ImGui_CollapsingHeader(label, flags); },

    /**
     * [Auto] set next TreeNode\/CollapsingHeader open state.
     * @param {boolean} is_open
     * @param {ImGuiCond} cond
     * @returns {void}
     */
    SetNextItemOpen: (is_open, cond = 0) => { return Mod.main.ImGui_SetNextItemOpen(is_open, cond); },

    /**
     * [Auto] "bool selected" carry the selection state (read-only). Selectable() is clicked is returns true so you can modify your selection state. size.x==0.0: use remaining width, size.x>0.0: specify width. size.y==0.0: use label height, size.y>0.0: specify height
     * @param {string} label
     * @param {boolean} selected
     * @param {ImGuiSelectableFlags} flags
     * @param {ImVec2} size
     * @returns {boolean}
     */
    Selectable: (label, selected = false, flags = 0, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_SelectableEx(label, selected, flags, size?.unwrap() || null); },

    /**
     * [Auto] 
     * @param {ImGuiMultiSelectFlags} flags
     * @param {number} selection_size
     * @param {number} items_count
     * @returns {ImGuiMultiSelectIO}
     */
    BeginMultiSelect: (flags, selection_size = -1, items_count = -1) => { return ImGuiMultiSelectIO.wrap(Mod.main.ImGui_BeginMultiSelectEx(flags, selection_size, items_count)); },

    /**
     * [Auto] 
     * @returns {ImGuiMultiSelectIO}
     */
    EndMultiSelect: () => { return ImGuiMultiSelectIO.wrap(Mod.main.ImGui_EndMultiSelect()); },

    /**
     * [Auto] 
     * @param {ImGuiSelectionUserData} selection_user_data
     * @returns {void}
     */
    SetNextItemSelectionUserData: (selection_user_data) => { return Mod.main.ImGui_SetNextItemSelectionUserData(selection_user_data); },

    /**
     * [Auto] Was the last item selection state toggled? Useful if you need the per-item information _before_ reaching EndMultiSelect(). We only returns toggle _event_ in order to handle clipping correctly.
     * @returns {boolean}
     */
    IsItemToggledSelection: () => { return Mod.main.ImGui_IsItemToggledSelection(); },

    /**
     * [Auto] open a framed scrolling region
     * @param {string} label
     * @param {ImVec2} size
     * @returns {boolean}
     */
    BeginListBox: (label, size = new ImVec2(0, 0)) => { return Mod.main.ImGui_BeginListBox(label, size?.unwrap() || null); },

    /**
     * [Auto] only call EndListBox() if BeginListBox() returned true!
     * @returns {void}
     */
    EndListBox: () => { return Mod.main.ImGui_EndListBox(); },

    /** [Manual]
     * @param {string} label
     * @param {float} values
     * @param {number} values_count
     * @param {number} values_offset
     * @param {string} overlay_text
     * @param {number} scale_min
     * @param {number} scale_max
     * @param {ImVec2} graph_size
     * @returns {void}
     */
    PlotLines: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotLinesEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?.unwrap() || null); },

    /** [Manual]
     * @param {string} label
     * @param {float} values
     * @param {number} values_count
     * @param {number} values_offset
     * @param {string} overlay_text
     * @param {number} scale_min
     * @param {number} scale_max
     * @param {ImVec2} graph_size
     * @returns {void}
     */
    PlotHistogram: (label, values, values_count, values_offset = 0, overlay_text = "", scale_min = Number.MAX_VALUE, scale_max = Number.MAX_VALUE, graph_size = new ImVec2(0, 0)) => { return Mod.main.ImGui_PlotHistogramEx(label, values, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size?.unwrap() || null); },

    /**
     * [Auto] append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window).
     * @returns {boolean}
     */
    BeginMenuBar: () => { return Mod.main.ImGui_BeginMenuBar(); },

    /**
     * [Auto] only call EndMenuBar() if BeginMenuBar() returns true!
     * @returns {void}
     */
    EndMenuBar: () => { return Mod.main.ImGui_EndMenuBar(); },

    /**
     * [Auto] create and append to a full screen menu-bar.
     * @returns {boolean}
     */
    BeginMainMenuBar: () => { return Mod.main.ImGui_BeginMainMenuBar(); },

    /**
     * [Auto] only call EndMainMenuBar() if BeginMainMenuBar() returns true!
     * @returns {void}
     */
    EndMainMenuBar: () => { return Mod.main.ImGui_EndMainMenuBar(); },

    /**
     * [Auto] create a sub-menu entry. only call EndMenu() if this returns true!
     * @param {string} label
     * @param {boolean} enabled
     * @returns {boolean}
     */
    BeginMenu: (label, enabled = true) => { return Mod.main.ImGui_BeginMenuEx(label, enabled); },

    /**
     * [Auto] only call EndMenu() if BeginMenu() returns true!
     * @returns {void}
     */
    EndMenu: () => { return Mod.main.ImGui_EndMenu(); },

    /**
     * [Auto] return true when activated.
     * @param {string} label
     * @param {string} shortcut
     * @param {boolean} selected
     * @param {boolean} enabled
     * @returns {boolean}
     */
    MenuItem: (label, shortcut = null, selected = false, enabled = true) => { return Mod.main.ImGui_MenuItemEx(label, shortcut, selected, enabled); },

    /**
     * [Auto] begin\/append a tooltip window.
     * @returns {boolean}
     */
    BeginTooltip: () => { return Mod.main.ImGui_BeginTooltip(); },

    /**
     * [Auto] only call EndTooltip() if BeginTooltip()\/BeginItemTooltip() returns true!
     * @returns {void}
     */
    EndTooltip: () => { return Mod.main.ImGui_EndTooltip(); },

    /** [Manual] set a text-only tooltip. Often used after a ImGui::IsItemHovered() check. Override any previous call to SetTooltip().
     * @param {string} fmt
     * @returns {void}
     */
    SetTooltip: (fmt) => { return Mod.main.ImGui_SetTooltip(fmt); },

    /**
     * [Auto] begin\/append a tooltip window if preceding item was hovered.
     * @returns {boolean}
     */
    BeginItemTooltip: () => { return Mod.main.ImGui_BeginItemTooltip(); },

    /** [Manual] set a text-only tooltip if preceding item was hovered. override any previous call to SetTooltip().
     * @param {string} fmt
     * @returns {void}
     */
    SetItemTooltip: (fmt) => { return Mod.main.ImGui_SetItemTooltip(fmt); },

    /**
     * [Auto] return true if the popup is open, and you can start outputting to it.
     * @param {string} str_id
     * @param {ImGuiWindowFlags} flags
     * @returns {boolean}
     */
    BeginPopup: (str_id, flags = 0) => { return Mod.main.ImGui_BeginPopup(str_id, flags); },

    /**
     * [Auto] return true if the modal is open, and you can start outputting to it.
     * @param {string} name
     * @param {bool} p_open
     * @param {ImGuiWindowFlags} flags
     * @returns {boolean}
     */
    BeginPopupModal: (name, p_open = null, flags = 0) => { return Mod.main.ImGui_BeginPopupModal(name, p_open, flags); },

    /**
     * [Auto] only call EndPopup() if BeginPopupXXX() returns true!
     * @returns {void}
     */
    EndPopup: () => { return Mod.main.ImGui_EndPopup(); },

    /**
     * [Auto] call to mark popup as open (don't call every frame!).
     * @param {string} str_id
     * @param {ImGuiPopupFlags} popup_flags
     * @returns {void}
     */
    OpenPopup: (str_id, popup_flags = 0) => { return Mod.main.ImGui_OpenPopup(str_id, popup_flags); },

    /**
     * [Auto] helper to open popup when clicked on last item. Default to ImGuiPopupFlags_MouseButtonRight == 1. (note: actually triggers on the mouse _released_ event to be consistent with popup behaviors)
     * @param {string} str_id
     * @param {ImGuiPopupFlags} popup_flags
     * @returns {void}
     */
    OpenPopupOnItemClick: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_OpenPopupOnItemClick(str_id, popup_flags); },

    /**
     * [Auto] manually close the popup we have begin-ed into.
     * @returns {void}
     */
    CloseCurrentPopup: () => { return Mod.main.ImGui_CloseCurrentPopup(); },

    /**
     * [Auto] open+begin popup when clicked on last item. Use str_id==NULL to associate the popup to previous item. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp!
     * @param {string} str_id
     * @param {ImGuiPopupFlags} popup_flags
     * @returns {boolean}
     */
    BeginPopupContextItem: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextItemEx(str_id, popup_flags); },

    /**
     * [Auto] open+begin popup when clicked on current window.
     * @param {string} str_id
     * @param {ImGuiPopupFlags} popup_flags
     * @returns {boolean}
     */
    BeginPopupContextWindow: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextWindowEx(str_id, popup_flags); },

    /**
     * [Auto] open+begin popup when clicked in void (where there are no windows).
     * @param {string} str_id
     * @param {ImGuiPopupFlags} popup_flags
     * @returns {boolean}
     */
    BeginPopupContextVoid: (str_id = null, popup_flags = 1) => { return Mod.main.ImGui_BeginPopupContextVoidEx(str_id, popup_flags); },

    /**
     * [Auto] return true if the popup is open.
     * @param {string} str_id
     * @param {ImGuiPopupFlags} flags
     * @returns {boolean}
     */
    IsPopupOpen: (str_id, flags = 0) => { return Mod.main.ImGui_IsPopupOpen(str_id, flags); },

    /**
     * [Auto] 
     * @param {string} str_id
     * @param {number} columns
     * @param {ImGuiTableFlags} flags
     * @param {ImVec2} outer_size
     * @param {number} inner_width
     * @returns {boolean}
     */
    BeginTable: (str_id, columns, flags = 0, outer_size = new ImVec2(0.0, 0.0), inner_width = 0.0) => { return Mod.main.ImGui_BeginTableEx(str_id, columns, flags, outer_size?.unwrap() || null, inner_width); },

    /**
     * [Auto] only call EndTable() if BeginTable() returns true!
     * @returns {void}
     */
    EndTable: () => { return Mod.main.ImGui_EndTable(); },

    /**
     * [Auto] append into the first cell of a new row.
     * @param {ImGuiTableRowFlags} row_flags
     * @param {number} min_row_height
     * @returns {void}
     */
    TableNextRow: (row_flags = 0, min_row_height = 0.0) => { return Mod.main.ImGui_TableNextRowEx(row_flags, min_row_height); },

    /**
     * [Auto] append into the next column (or first column of next row if currently in last column). Return true when column is visible.
     * @returns {boolean}
     */
    TableNextColumn: () => { return Mod.main.ImGui_TableNextColumn(); },

    /**
     * [Auto] append into the specified column. Return true when column is visible.
     * @param {number} column_n
     * @returns {boolean}
     */
    TableSetColumnIndex: (column_n) => { return Mod.main.ImGui_TableSetColumnIndex(column_n); },

    /**
     * [Auto] 
     * @param {string} label
     * @param {ImGuiTableColumnFlags} flags
     * @param {number} init_width_or_weight
     * @param {ImGuiID} user_id
     * @returns {void}
     */
    TableSetupColumn: (label, flags = 0, init_width_or_weight = 0.0, user_id = 0) => { return Mod.main.ImGui_TableSetupColumnEx(label, flags, init_width_or_weight, user_id); },

    /**
     * [Auto] lock columns\/rows so they stay visible when scrolled.
     * @param {number} cols
     * @param {number} rows
     * @returns {void}
     */
    TableSetupScrollFreeze: (cols, rows) => { return Mod.main.ImGui_TableSetupScrollFreeze(cols, rows); },

    /**
     * [Auto] submit one header cell manually (rarely used)
     * @param {string} label
     * @returns {void}
     */
    TableHeader: (label) => { return Mod.main.ImGui_TableHeader(label); },

    /**
     * [Auto] submit a row with headers cells based on data provided to TableSetupColumn() + submit context menu
     * @returns {void}
     */
    TableHeadersRow: () => { return Mod.main.ImGui_TableHeadersRow(); },

    /**
     * [Auto] submit a row with angled headers for every column with the ImGuiTableColumnFlags_AngledHeader flag. MUST BE FIRST ROW.
     * @returns {void}
     */
    TableAngledHeadersRow: () => { return Mod.main.ImGui_TableAngledHeadersRow(); },

    /**
     * [Auto] get latest sort specs for the table (NULL if not sorting).  Lifetime: don't hold on this pointer over multiple frames or past any subsequent call to BeginTable().
     * @returns {ImGuiTableSortSpecs}
     */
    TableGetSortSpecs: () => { return ImGuiTableSortSpecs.wrap(Mod.main.ImGui_TableGetSortSpecs()); },

    /**
     * [Auto] return number of columns (value passed to BeginTable)
     * @returns {number}
     */
    TableGetColumnCount: () => { return Mod.main.ImGui_TableGetColumnCount(); },

    /**
     * [Auto] return current column index.
     * @returns {number}
     */
    TableGetColumnIndex: () => { return Mod.main.ImGui_TableGetColumnIndex(); },

    /**
     * [Auto] return current row index.
     * @returns {number}
     */
    TableGetRowIndex: () => { return Mod.main.ImGui_TableGetRowIndex(); },

    /**
     * [Auto] return "" if column didn't have a name declared by TableSetupColumn(). Pass -1 to use current column.
     * @param {number} column_n
     * @returns {string}
     */
    TableGetColumnName: (column_n = -1) => { return Mod.main.ImGui_TableGetColumnName(column_n); },

    /**
     * [Auto] return column flags so you can query their Enabled\/Visible\/Sorted\/Hovered status flags. Pass -1 to use current column.
     * @param {number} column_n
     * @returns {ImGuiTableColumnFlags}
     */
    TableGetColumnFlags: (column_n = -1) => { return Mod.main.ImGui_TableGetColumnFlags(column_n); },

    /**
     * [Auto] change user accessible enabled\/disabled state of a column. Set to false to hide the column. User can use the context menu to change this themselves (right-click in headers, or right-click in columns body with ImGuiTableFlags_ContextMenuInBody)
     * @param {number} column_n
     * @param {boolean} v
     * @returns {void}
     */
    TableSetColumnEnabled: (column_n, v) => { return Mod.main.ImGui_TableSetColumnEnabled(column_n, v); },

    /**
     * [Auto] return hovered column. return -1 when table is not hovered. return columns_count if the unused space at the right of visible columns is hovered. Can also use (TableGetColumnFlags() & ImGuiTableColumnFlags_IsHovered) instead.
     * @returns {number}
     */
    TableGetHoveredColumn: () => { return Mod.main.ImGui_TableGetHoveredColumn(); },

    /**
     * [Auto] change the color of a cell, row, or column. See ImGuiTableBgTarget_ flags for details.
     * @param {ImGuiTableBgTarget} target
     * @param {ImU32} color
     * @param {number} column_n
     * @returns {void}
     */
    TableSetBgColor: (target, color, column_n = -1) => { return Mod.main.ImGui_TableSetBgColor(target, color, column_n); },

    /**
     * [Auto] 
     * @param {number} count
     * @param {string} id
     * @param {boolean} borders
     * @returns {void}
     */
    Columns: (count = 1, id = null, borders = true) => { return Mod.main.ImGui_ColumnsEx(count, id, borders); },

    /**
     * [Auto] next column, defaults to current row or next row if the current row is finished
     * @returns {void}
     */
    NextColumn: () => { return Mod.main.ImGui_NextColumn(); },

    /**
     * [Auto] get current column index
     * @returns {number}
     */
    GetColumnIndex: () => { return Mod.main.ImGui_GetColumnIndex(); },

    /**
     * [Auto] get column width (in pixels). pass -1 to use current column
     * @param {number} column_index
     * @returns {number}
     */
    GetColumnWidth: (column_index = -1) => { return Mod.main.ImGui_GetColumnWidth(column_index); },

    /**
     * [Auto] set column width (in pixels). pass -1 to use current column
     * @param {number} column_index
     * @param {number} width
     * @returns {void}
     */
    SetColumnWidth: (column_index, width) => { return Mod.main.ImGui_SetColumnWidth(column_index, width); },

    /**
     * [Auto] get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f
     * @param {number} column_index
     * @returns {number}
     */
    GetColumnOffset: (column_index = -1) => { return Mod.main.ImGui_GetColumnOffset(column_index); },

    /**
     * [Auto] set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column
     * @param {number} column_index
     * @param {number} offset_x
     * @returns {void}
     */
    SetColumnOffset: (column_index, offset_x) => { return Mod.main.ImGui_SetColumnOffset(column_index, offset_x); },

    /**
     * [Auto] 
     * @returns {number}
     */
    GetColumnsCount: () => { return Mod.main.ImGui_GetColumnsCount(); },

    /**
     * [Auto] create and append into a TabBar
     * @param {string} str_id
     * @param {ImGuiTabBarFlags} flags
     * @returns {boolean}
     */
    BeginTabBar: (str_id, flags = 0) => { return Mod.main.ImGui_BeginTabBar(str_id, flags); },

    /**
     * [Auto] only call EndTabBar() if BeginTabBar() returns true!
     * @returns {void}
     */
    EndTabBar: () => { return Mod.main.ImGui_EndTabBar(); },

    /**
     * [Auto] create a Tab. Returns true if the Tab is selected.
     * @param {string} label
     * @param {bool} p_open
     * @param {ImGuiTabItemFlags} flags
     * @returns {boolean}
     */
    BeginTabItem: (label, p_open = null, flags = 0) => { return Mod.main.ImGui_BeginTabItem(label, p_open, flags); },

    /**
     * [Auto] only call EndTabItem() if BeginTabItem() returns true!
     * @returns {void}
     */
    EndTabItem: () => { return Mod.main.ImGui_EndTabItem(); },

    /**
     * [Auto] create a Tab behaving like a button. return true when clicked. cannot be selected in the tab bar.
     * @param {string} label
     * @param {ImGuiTabItemFlags} flags
     * @returns {boolean}
     */
    TabItemButton: (label, flags = 0) => { return Mod.main.ImGui_TabItemButton(label, flags); },

    /**
     * [Auto] notify TabBar or Docking system of a closed tab\/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name.
     * @param {string} tab_or_docked_window_label
     * @returns {void}
     */
    SetTabItemClosed: (tab_or_docked_window_label) => { return Mod.main.ImGui_SetTabItemClosed(tab_or_docked_window_label); },

    /**
     * [Auto] 
     * @param {ImGuiID} dockspace_id
     * @param {ImVec2} size
     * @param {ImGuiDockNodeFlags} flags
     * @param {ImGuiWindowClass} window_class
     * @returns {ImGuiID}
     */
    DockSpace: (dockspace_id, size = new ImVec2(0, 0), flags = 0, window_class = null) => { return Mod.main.ImGui_DockSpaceEx(dockspace_id, size?.unwrap() || null, flags, window_class); },

    /**
     * [Auto] 
     * @param {ImGuiID} dockspace_id
     * @param {ImGuiViewport} viewport
     * @param {ImGuiDockNodeFlags} flags
     * @param {ImGuiWindowClass} window_class
     * @returns {ImGuiID}
     */
    DockSpaceOverViewport: (dockspace_id = 0, viewport = null, flags = 0, window_class = null) => { return Mod.main.ImGui_DockSpaceOverViewportEx(dockspace_id, viewport, flags, window_class); },

    /**
     * [Auto] set next window class (control docking compatibility + provide hints to platform backend via custom viewport flags and platform parent\/child relationship)
     * @param {ImGuiWindowClass} window_class
     * @returns {void}
     */
    SetNextWindowClass: (window_class) => { return Mod.main.ImGui_SetNextWindowClass(window_class); },

    /**
     * [Auto] is current window docked into another window?
     * @returns {boolean}
     */
    IsWindowDocked: () => { return Mod.main.ImGui_IsWindowDocked(); },

    /**
     * [Auto] Disabling [BETA API]
     * @param {boolean} disabled
     * @returns {void}
     */
    BeginDisabled: (disabled = true) => { return Mod.main.ImGui_BeginDisabled(disabled); },

    /**
     * [Auto] 
     * @returns {void}
     */
    EndDisabled: () => { return Mod.main.ImGui_EndDisabled(); },

    /**
     * [Auto] Clipping
     * @param {ImVec2} clip_rect_min
     * @param {ImVec2} clip_rect_max
     * @param {boolean} intersect_with_current_clip_rect
     * @returns {void}
     */
    PushClipRect: (clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) => { return Mod.main.ImGui_PushClipRect(clip_rect_min?.unwrap() || null, clip_rect_max?.unwrap() || null, intersect_with_current_clip_rect); },

    /**
     * [Auto] 
     * @returns {void}
     */
    PopClipRect: () => { return Mod.main.ImGui_PopClipRect(); },

    /**
     * [Auto] make last item the default focused item of of a newly appearing window.
     * @returns {void}
     */
    SetItemDefaultFocus: () => { return Mod.main.ImGui_SetItemDefaultFocus(); },

    /**
     * [Auto] focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget.
     * @param {number} offset
     * @returns {void}
     */
    SetKeyboardFocusHere: (offset = 0) => { return Mod.main.ImGui_SetKeyboardFocusHereEx(offset); },

    /**
     * [Auto] alter visibility of keyboard\/gamepad cursor. by default: show when using an arrow key, hide when clicking with mouse.
     * @param {boolean} visible
     * @returns {void}
     */
    SetNavCursorVisible: (visible) => { return Mod.main.ImGui_SetNavCursorVisible(visible); },

    /**
     * [Auto] allow next item to be overlapped by a subsequent item. Useful with invisible buttons, selectable, treenode covering an area where subsequent items may need to be added. Note that both Selectable() and TreeNode() have dedicated flags doing this.
     * @returns {void}
     */
    SetNextItemAllowOverlap: () => { return Mod.main.ImGui_SetNextItemAllowOverlap(); },

    /**
     * [Auto] is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options.
     * @param {ImGuiHoveredFlags} flags
     * @returns {boolean}
     */
    IsItemHovered: (flags = 0) => { return Mod.main.ImGui_IsItemHovered(flags); },

    /**
     * [Auto] is the last item active? (e.g. button being held, text field being edited. This will continuously return true while holding mouse button on an item. Items that don't interact will always return false)
     * @returns {boolean}
     */
    IsItemActive: () => { return Mod.main.ImGui_IsItemActive(); },

    /**
     * [Auto] is the last item focused for keyboard\/gamepad navigation?
     * @returns {boolean}
     */
    IsItemFocused: () => { return Mod.main.ImGui_IsItemFocused(); },

    /**
     * [Auto] is the last item hovered and mouse clicked on? (**)  == IsMouseClicked(mouse_button) && IsItemHovered()Important. (**) this is NOT equivalent to the behavior of e.g. Button(). Read comments in function definition.
     * @param {ImGuiMouseButton} mouse_button
     * @returns {boolean}
     */
    IsItemClicked: (mouse_button = 0) => { return Mod.main.ImGui_IsItemClickedEx(mouse_button); },

    /**
     * [Auto] is the last item visible? (items may be out of sight because of clipping\/scrolling)
     * @returns {boolean}
     */
    IsItemVisible: () => { return Mod.main.ImGui_IsItemVisible(); },

    /**
     * [Auto] did the last item modify its underlying value this frame? or was pressed? This is generally the same as the "bool" return value of many widgets.
     * @returns {boolean}
     */
    IsItemEdited: () => { return Mod.main.ImGui_IsItemEdited(); },

    /**
     * [Auto] was the last item just made active (item was previously inactive).
     * @returns {boolean}
     */
    IsItemActivated: () => { return Mod.main.ImGui_IsItemActivated(); },

    /**
     * [Auto] was the last item just made inactive (item was previously active). Useful for Undo\/Redo patterns with widgets that require continuous editing.
     * @returns {boolean}
     */
    IsItemDeactivated: () => { return Mod.main.ImGui_IsItemDeactivated(); },

    /**
     * [Auto] was the last item just made inactive and made a value change when it was active? (e.g. Slider\/Drag moved). Useful for Undo\/Redo patterns with widgets that require continuous editing. Note that you may get false positives (some widgets such as Combo()\/ListBox()\/Selectable() will return true even when clicking an already selected item).
     * @returns {boolean}
     */
    IsItemDeactivatedAfterEdit: () => { return Mod.main.ImGui_IsItemDeactivatedAfterEdit(); },

    /**
     * [Auto] was the last item open state toggled? set by TreeNode().
     * @returns {boolean}
     */
    IsItemToggledOpen: () => { return Mod.main.ImGui_IsItemToggledOpen(); },

    /**
     * [Auto] is any item hovered?
     * @returns {boolean}
     */
    IsAnyItemHovered: () => { return Mod.main.ImGui_IsAnyItemHovered(); },

    /**
     * [Auto] is any item active?
     * @returns {boolean}
     */
    IsAnyItemActive: () => { return Mod.main.ImGui_IsAnyItemActive(); },

    /**
     * [Auto] is any item focused?
     * @returns {boolean}
     */
    IsAnyItemFocused: () => { return Mod.main.ImGui_IsAnyItemFocused(); },

    /**
     * [Auto] get upper-left bounding rectangle of the last item (screen space)
     * @returns {ImVec2}
     */
    GetItemRectMin: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectMin()); },

    /**
     * [Auto] get lower-right bounding rectangle of the last item (screen space)
     * @returns {ImVec2}
     */
    GetItemRectMax: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectMax()); },

    /**
     * [Auto] get size of last item
     * @returns {ImVec2}
     */
    GetItemRectSize: () => { return ImVec2.wrap(Mod.main.ImGui_GetItemRectSize()); },

    /**
     * [Auto] return primary\/default viewport. This can never be NULL.
     * @returns {ImGuiViewport}
     */
    GetMainViewport: () => { return Mod.main.ImGui_GetMainViewport(); },

    /**
     * [Auto] get background draw list for the given viewport or viewport associated to the current window. this draw list will be the first rendering one. Useful to quickly draw shapes\/text behind dear imgui contents.
     * @param {ImGuiViewport} viewport
     * @returns {ImDrawList}
     */
    GetBackgroundDrawList: (viewport = null) => { return ImDrawList.wrap(Mod.main.ImGui_GetBackgroundDrawListEx(viewport)); },

    /**
     * [Auto] get foreground draw list for the given viewport or viewport associated to the current window. this draw list will be the top-most rendered one. Useful to quickly draw shapes\/text over dear imgui contents.
     * @param {ImGuiViewport} viewport
     * @returns {ImDrawList}
     */
    GetForegroundDrawList: (viewport = null) => { return ImDrawList.wrap(Mod.main.ImGui_GetForegroundDrawListEx(viewport)); },

    /**
     * [Auto] test if rectangle (of given size, starting from cursor position) is visible \/ not clipped.
     * @param {ImVec2} size
     * @returns {boolean}
     */
    IsRectVisibleBySize: (size) => { return Mod.main.ImGui_IsRectVisibleBySize(size?.unwrap() || null); },

    /**
     * [Auto] test if rectangle (in screen space) is visible \/ not clipped. to perform coarse clipping on user's side.
     * @param {ImVec2} rect_min
     * @param {ImVec2} rect_max
     * @returns {boolean}
     */
    IsRectVisible: (rect_min, rect_max) => { return Mod.main.ImGui_IsRectVisible(rect_min?.unwrap() || null, rect_max?.unwrap() || null); },

    /**
     * [Auto] get global imgui time. incremented by io.DeltaTime every frame.
     * @returns {number}
     */
    GetTime: () => { return Mod.main.ImGui_GetTime(); },

    /**
     * [Auto] get global imgui frame count. incremented by 1 every frame.
     * @returns {number}
     */
    GetFrameCount: () => { return Mod.main.ImGui_GetFrameCount(); },

    /**
     * [Auto] you may use this when creating your own ImDrawList instances.
     * @returns {ImDrawListSharedData}
     */
    GetDrawListSharedData: () => { return ImDrawListSharedData.wrap(Mod.main.ImGui_GetDrawListSharedData()); },

    /**
     * [Auto] get a string corresponding to the enum value (for display, saving, etc.).
     * @param {ImGuiCol} idx
     * @returns {string}
     */
    GetStyleColorName: (idx) => { return Mod.main.ImGui_GetStyleColorName(idx); },

    /**
     * [Auto] replace current window storage with our own (if you want to manipulate it yourself, typically clear subsection of it)
     * @param {ImGuiStorage} storage
     * @returns {void}
     */
    SetStateStorage: (storage) => { return Mod.main.ImGui_SetStateStorage(storage); },

    /**
     * [Auto] 
     * @returns {ImGuiStorage}
     */
    GetStateStorage: () => { return Mod.main.ImGui_GetStateStorage(); },

    /**
     * [Auto] 
     * @param {string} text
     * @param {string} text_end
     * @param {boolean} hide_text_after_double_hash
     * @param {number} wrap_width
     * @returns {ImVec2}
     */
    CalcTextSize: (text, text_end = null, hide_text_after_double_hash = false, wrap_width = -1.0) => { return ImVec2.wrap(Mod.main.ImGui_CalcTextSizeEx(text, text_end, hide_text_after_double_hash, wrap_width)); },

    /**
     * [Auto] is key being held.
     * @param {ImGuiKey} key
     * @returns {boolean}
     */
    IsKeyDown: (key) => { return Mod.main.ImGui_IsKeyDown(key); },

    /**
     * [Auto] was key pressed (went from !Down to Down)? if repeat=true, uses io.KeyRepeatDelay \/ KeyRepeatRate
     * @param {ImGuiKey} key
     * @param {boolean} repeat
     * @returns {boolean}
     */
    IsKeyPressed: (key, repeat = true) => { return Mod.main.ImGui_IsKeyPressedEx(key, repeat); },

    /**
     * [Auto] was key released (went from Down to !Down)?
     * @param {ImGuiKey} key
     * @returns {boolean}
     */
    IsKeyReleased: (key) => { return Mod.main.ImGui_IsKeyReleased(key); },

    /**
     * [Auto] was key chord (mods + key) pressed, e.g. you can pass 'ImGuiMod_Ctrl | ImGuiKey_S' as a key-chord. This doesn't do any routing or focus check, please consider using Shortcut() function instead.
     * @param {ImGuiKeyChord} key_chord
     * @returns {boolean}
     */
    IsKeyChordPressed: (key_chord) => { return Mod.main.ImGui_IsKeyChordPressed(key_chord); },

    /**
     * [Auto] uses provided repeat rate\/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate
     * @param {ImGuiKey} key
     * @param {number} repeat_delay
     * @param {number} rate
     * @returns {number}
     */
    GetKeyPressedAmount: (key, repeat_delay, rate) => { return Mod.main.ImGui_GetKeyPressedAmount(key, repeat_delay, rate); },

    /**
     * [Auto] [DEBUG] returns English name of the key. Those names a provided for debugging purpose and are not meant to be saved persistently not compared.
     * @param {ImGuiKey} key
     * @returns {string}
     */
    GetKeyName: (key) => { return Mod.main.ImGui_GetKeyName(key); },

    /**
     * [Auto] Override io.WantCaptureKeyboard flag next frame (said flag is left for your application to handle, typically when true it instructs your app to ignore inputs). e.g. force capture keyboard when your widget is being hovered. This is equivalent to setting "io.WantCaptureKeyboard = want_capture_keyboard"; after the next NewFrame() call.
     * @param {boolean} want_capture_keyboard
     * @returns {void}
     */
    SetNextFrameWantCaptureKeyboard: (want_capture_keyboard) => { return Mod.main.ImGui_SetNextFrameWantCaptureKeyboard(want_capture_keyboard); },

    /**
     * [Auto] Inputs Utilities: Shortcut Testing & Routing [BETA]
     * @param {ImGuiKeyChord} key_chord
     * @param {ImGuiInputFlags} flags
     * @returns {boolean}
     */
    Shortcut: (key_chord, flags = 0) => { return Mod.main.ImGui_Shortcut(key_chord, flags); },

    /**
     * [Auto] 
     * @param {ImGuiKeyChord} key_chord
     * @param {ImGuiInputFlags} flags
     * @returns {void}
     */
    SetNextItemShortcut: (key_chord, flags = 0) => { return Mod.main.ImGui_SetNextItemShortcut(key_chord, flags); },

    /**
     * [Auto] Set key owner to last item ID if it is hovered or active. Equivalent to 'if (IsItemHovered() || IsItemActive()) { SetKeyOwner(key, GetItemID());'.
     * @param {ImGuiKey} key
     * @returns {void}
     */
    SetItemKeyOwner: (key) => { return Mod.main.ImGui_SetItemKeyOwner(key); },

    /**
     * [Auto] is mouse button held?
     * @param {ImGuiMouseButton} button
     * @returns {boolean}
     */
    IsMouseDown: (button) => { return Mod.main.ImGui_IsMouseDown(button); },

    /**
     * [Auto] did mouse button clicked? (went from !Down to Down). Same as GetMouseClickedCount() == 1.
     * @param {ImGuiMouseButton} button
     * @param {boolean} repeat
     * @returns {boolean}
     */
    IsMouseClicked: (button, repeat = false) => { return Mod.main.ImGui_IsMouseClickedEx(button, repeat); },

    /**
     * [Auto] did mouse button released? (went from Down to !Down)
     * @param {ImGuiMouseButton} button
     * @returns {boolean}
     */
    IsMouseReleased: (button) => { return Mod.main.ImGui_IsMouseReleased(button); },

    /**
     * [Auto] did mouse button double-clicked? Same as GetMouseClickedCount() == 2. (note that a double-click will also report IsMouseClicked() == true)
     * @param {ImGuiMouseButton} button
     * @returns {boolean}
     */
    IsMouseDoubleClicked: (button) => { return Mod.main.ImGui_IsMouseDoubleClicked(button); },

    /**
     * [Auto] return the number of successive mouse-clicks at the time where a click happen (otherwise 0).
     * @param {ImGuiMouseButton} button
     * @returns {number}
     */
    GetMouseClickedCount: (button) => { return Mod.main.ImGui_GetMouseClickedCount(button); },

    /**
     * [Auto] is mouse hovering given bounding rect (in screen space). clipped by current clipping settings, but disregarding of other consideration of focus\/window ordering\/popup-block.
     * @param {ImVec2} r_min
     * @param {ImVec2} r_max
     * @param {boolean} clip
     * @returns {boolean}
     */
    IsMouseHoveringRect: (r_min, r_max, clip = true) => { return Mod.main.ImGui_IsMouseHoveringRectEx(r_min?.unwrap() || null, r_max?.unwrap() || null, clip); },

    /**
     * [Auto] by convention we use (-FLT_MAX,-FLT_MAX) to denote that there is no mouse available
     * @param {ImVec2} mouse_pos
     * @returns {boolean}
     */
    IsMousePosValid: (mouse_pos = null) => { return Mod.main.ImGui_IsMousePosValid(mouse_pos?.unwrap() || null); },

    /**
     * [Auto] [WILL OBSOLETE] is any mouse button held? This was designed for backends, but prefer having backend maintain a mask of held mouse buttons, because upcoming input queue system will make this invalid.
     * @returns {boolean}
     */
    IsAnyMouseDown: () => { return Mod.main.ImGui_IsAnyMouseDown(); },

    /**
     * [Auto] shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls
     * @returns {ImVec2}
     */
    GetMousePos: () => { return ImVec2.wrap(Mod.main.ImGui_GetMousePos()); },

    /**
     * [Auto] retrieve mouse position at the time of opening popup we have BeginPopup() into (helper to avoid user backing that value themselves)
     * @returns {ImVec2}
     */
    GetMousePosOnOpeningCurrentPopup: () => { return ImVec2.wrap(Mod.main.ImGui_GetMousePosOnOpeningCurrentPopup()); },

    /**
     * [Auto] is mouse dragging? (uses io.MouseDraggingThreshold if lock_threshold < 0.0f)
     * @param {ImGuiMouseButton} button
     * @param {number} lock_threshold
     * @returns {boolean}
     */
    IsMouseDragging: (button, lock_threshold = -1.0) => { return Mod.main.ImGui_IsMouseDragging(button, lock_threshold); },

    /**
     * [Auto] return the delta from the initial clicking position while the mouse button is pressed or was just released. This is locked and return 0.0f until the mouse moves past a distance threshold at least once (uses io.MouseDraggingThreshold if lock_threshold < 0.0f)
     * @param {ImGuiMouseButton} button
     * @param {number} lock_threshold
     * @returns {ImVec2}
     */
    GetMouseDragDelta: (button = 0, lock_threshold = -1.0) => { return ImVec2.wrap(Mod.main.ImGui_GetMouseDragDelta(button, lock_threshold)); },

    /**
     * [Auto] 
     * @param {ImGuiMouseButton} button
     * @returns {void}
     */
    ResetMouseDragDelta: (button = 0) => { return Mod.main.ImGui_ResetMouseDragDeltaEx(button); },

    /**
     * [Auto] get desired mouse cursor shape. Important: reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you
     * @returns {ImGuiMouseCursor}
     */
    GetMouseCursor: () => { return Mod.main.ImGui_GetMouseCursor(); },

    /**
     * [Auto] set desired mouse cursor shape
     * @param {ImGuiMouseCursor} cursor_type
     * @returns {void}
     */
    SetMouseCursor: (cursor_type) => { return Mod.main.ImGui_SetMouseCursor(cursor_type); },

    /**
     * [Auto] Override io.WantCaptureMouse flag next frame (said flag is left for your application to handle, typical when true it instucts your app to ignore inputs). This is equivalent to setting "io.WantCaptureMouse = want_capture_mouse;" after the next NewFrame() call.
     * @param {boolean} want_capture_mouse
     * @returns {void}
     */
    SetNextFrameWantCaptureMouse: (want_capture_mouse) => { return Mod.main.ImGui_SetNextFrameWantCaptureMouse(want_capture_mouse); },

    /**
     * [Auto] Clipboard Utilities
     * @returns {string}
     */
    GetClipboardText: () => { return Mod.main.ImGui_GetClipboardText(); },

    /**
     * [Auto] 
     * @param {string} text
     * @returns {void}
     */
    SetClipboardText: (text) => { return Mod.main.ImGui_SetClipboardText(text); },

    /**
     * [Auto] call in main loop. will call CreateWindow\/ResizeWindow\/etc. platform functions for each secondary viewport, and DestroyWindow for each inactive viewport.
     * @returns {void}
     */
    UpdatePlatformWindows: () => { return Mod.main.ImGui_UpdatePlatformWindows(); },

};

/* -------------------------------------------------------------------------- */
/* 6. Web Implementation */
/* -------------------------------------------------------------------------- */

/**
 * Namespace that provides access to the OpenGL3 backend functions.
 * @namespace {ImGuiImplOpenGL3}
 */
export const ImGuiImplOpenGL3 = {
    /** [Manual] Initializes the OpenGL3 backend. @returns {boolean} */
    Init: () => {
        return Mod.main.cImGui_ImplOpenGL3_Init();
    },

    /** [Manual] Shuts down the OpenGL3 backend. @returns {void} */
    Shutdown: () => {
        return Mod.main.cImGui_ImplOpenGL3_Shutdown();
    },

    /** [Manual] Starts a new OpenGL3 frame. @returns {void} */
    NewFrame: () => {
        return Mod.main.cImGui_ImplOpenGL3_NewFrame();
    },

    /** [Manual] Renders the OpenGL3 frame. @param {ImDrawData} draw_data @returns {void} */
    RenderDrawData: (draw_data) => {
        return Mod.main.cImGui_ImplOpenGL3_RenderDrawData(draw_data.unwrap());
    },
};

/**
 * Namespace for the Web implementation of jsimgui.
 * @namespace {ImGuiImplWeb}
 */
export const ImGuiImplWeb = {
    /**
     * Initializes the ImGuiImplWeb module.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    Init: async (canvas) => {
        await Mod.initMain();
        Mod.main.FS.mount(Mod.main.MEMFS, { root: '.' }, '.');

        const context = canvas.getContext("webgl2") || canvas.getContext("webgpu");

        if (!context) {
            throw new Error("Failed to get WebGL2 or WebGPU context.");
        }

        ImGui.CreateContext(null);
        ImGuiImplWeb.SetupIO(canvas);

        if (context instanceof WebGL2RenderingContext) {
            const handle = Mod.main.GL.registerContext(context, context.getContextAttributes());
            Mod.main.GL.makeContextCurrent(handle);

            ImGuiImplOpenGL3.Init();
        }
    },

    /**
     * Sets up the IO for the canvas.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    SetupIO: (canvas) => {
        canvas.tabIndex = 1;

        // Prevent right click context menu.
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        const io = ImGui.GetIO();
        io.BackendFlags = ImEnum.BackendFlags.HasMouseCursors;

        const updateCanvasSize = () => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            const dpr = globalThis.devicePixelRatio || 1;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        };
        updateCanvasSize();

        globalThis.addEventListener("resize", updateCanvasSize);

        const keyMap = {
            "Tab": ImEnum.Key._Tab,
            "ArrowLeft": ImEnum.Key._LeftArrow,
            "ArrowRight": ImEnum.Key._RightArrow,
            "ArrowUp": ImEnum.Key._UpArrow,
            "ArrowDown": ImEnum.Key._DownArrow,
            "PageUp": ImEnum.Key._PageUp,
            "PageDown": ImEnum.Key._PageDown,
            "Home": ImEnum.Key._Home,
            "End": ImEnum.Key._End,
            "Insert": ImEnum.Key._Insert,
            "Delete": ImEnum.Key._Delete,
            "Backspace": ImEnum.Key._Backspace,
            "Space": ImEnum.Key._Space,
            "Enter": ImEnum.Key._Enter,
            "Escape": ImEnum.Key._Escape,

            "Control": ImEnum.Key._LeftCtrl,
            "Shift": ImEnum.Key._LeftShift,
            "Alt": ImEnum.Key._LeftAlt,
            "Super": ImEnum.Key._LeftSuper,

            "0": ImEnum.Key._0,
            "1": ImEnum.Key._1,
            "2": ImEnum.Key._2,
            "3": ImEnum.Key._3,
            "4": ImEnum.Key._4,
            "5": ImEnum.Key._5,
            "6": ImEnum.Key._6,
            "7": ImEnum.Key._7,
            "8": ImEnum.Key._8,
            "9": ImEnum.Key._9,

            "A": ImEnum.Key._A,
            "a": ImEnum.Key._A,
            "B": ImEnum.Key._B,
            "b": ImEnum.Key._B,
            "C": ImEnum.Key._C,
            "c": ImEnum.Key._C,
            "D": ImEnum.Key._D,
            "d": ImEnum.Key._D,
            "E": ImEnum.Key._E,
            "e": ImEnum.Key._E,
            "F": ImEnum.Key._F,
            "f": ImEnum.Key._F,
            "G": ImEnum.Key._G,
            "g": ImEnum.Key._G,
            "H": ImEnum.Key._H,
            "h": ImEnum.Key._H,
            "I": ImEnum.Key._I,
            "i": ImEnum.Key._I,
            "J": ImEnum.Key._J,
            "j": ImEnum.Key._J,
            "K": ImEnum.Key._K,
            "k": ImEnum.Key._K,
            "L": ImEnum.Key._L,
            "l": ImEnum.Key._L,
            "M": ImEnum.Key._M,
            "m": ImEnum.Key._M,
            "N": ImEnum.Key._N,
            "n": ImEnum.Key._N,
            "O": ImEnum.Key._O,
            "o": ImEnum.Key._O,
            "P": ImEnum.Key._P,
            "p": ImEnum.Key._P,
            "Q": ImEnum.Key._Q,
            "q": ImEnum.Key._Q,
            "R": ImEnum.Key._R,
            "r": ImEnum.Key._R,
            "S": ImEnum.Key._S,
            "s": ImEnum.Key._S,
            "T": ImEnum.Key._T,
            "t": ImEnum.Key._T,
            "U": ImEnum.Key._U,
            "u": ImEnum.Key._U,
            "V": ImEnum.Key._V,
            "v": ImEnum.Key._V,
            "W": ImEnum.Key._W,
            "w": ImEnum.Key._W,
            "X": ImEnum.Key._X,
            "x": ImEnum.Key._X,
            "Y": ImEnum.Key._Y,
            "y": ImEnum.Key._Y,
            "Z": ImEnum.Key._Z,
            "z": ImEnum.Key._Z,
        };

        canvas.addEventListener("keydown", (event) => {
            io.AddKeyEvent(keyMap[event.key], true);

            if (event.key.length === 1) {
                io.AddInputCharactersUTF8(event.key);
            }
        });

        canvas.addEventListener("keyup", (event) => {
            io.AddKeyEvent(keyMap[event.key], false);
        });

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            io.AddMousePosEvent(event.clientX - rect.left, event.clientY - rect.top);

            const cursorStyle = ImGui.GetMouseCursor();
            switch (cursorStyle) {
                case ImEnum.MouseCursor.None:
                    canvas.style.cursor = "none";
                    break;
                case ImEnum.MouseCursor.Arrow:
                    canvas.style.cursor = "default";
                    break;
                case ImEnum.MouseCursor.TextInput:
                    canvas.style.cursor = "text";
                    break;
                case ImEnum.MouseCursor.Hand:
                    canvas.style.cursor = "pointer";
                    break;
                case ImEnum.MouseCursor.ResizeAll:
                    canvas.style.cursor = "all-scroll";
                    break;
                case ImEnum.MouseCursor.ResizeNS:
                    canvas.style.cursor = "ns-resize";
                    break;
                case ImEnum.MouseCursor.ResizeEW:
                    canvas.style.cursor = "ew-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNESW:
                    canvas.style.cursor = "nesw-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNWSE:
                    canvas.style.cursor = "nwse-resize";
                    break;
                case ImEnum.MouseCursor.NotAllowed:
                    canvas.style.cursor = "not-allowed";
                    break;
                default:
                    canvas.style.cursor = "default";
                    break;
            }
        });

        const mouseMap = {
            0: 0,
            1: 2,
            2: 1,
        };

        canvas.addEventListener(
            "mousedown",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], true);
            },
        );

        canvas.addEventListener(
            "mouseup",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], false);
            },
        );

        canvas.addEventListener(
            "wheel",
            (event) => {
                io.AddMouseWheelEvent(-event.deltaX * 0.01, -event.deltaY * 0.01);
            },
        );

        canvas.addEventListener("focus", () => {
            io.AddFocusEvent(true);
        });

        canvas.addEventListener("blur", () => {
            io.AddFocusEvent(false);
        });
    },

    BeginRender: () => {
        ImGuiImplOpenGL3.NewFrame();
        ImGui.NewFrame();
    },

    EndRender: () => {
        ImGui.Render();
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    },

    /**
     * Loads a font from a URL and writes it to the filesystem.
     * @param {string} font - The URL of the font.
     */
    LoadFont: async (font) => {
        let font_data = await fetch(font).then(res => res.arrayBuffer());
        font_data = new Uint8Array(font_data);
        Mod.main.FS.writeFile(font, font_data);
    },

    /**
     * Loads an image into a WebGL texture and returns the ImGui texture ID.
     * @param {HTMLImageElement} image - The image element.
     * @returns {ImTextureID} - The ImGui texture ID.
     */
    LoadImage: (image) => {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const gl = document.querySelector("canvas").getContext("webgl2");
                const texture = gl.createTexture();

                gl.bindTexture(gl.TEXTURE_2D, texture);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                const id = Mod.main.GL.getNewId(Mod.main.GL.textures);
                texture.name = id;
                Mod.main.GL.textures[id] = texture;

                resolve(id);
            };

            image.onerror = (error) => {
                reject(error);
            };
        });
    },

};
