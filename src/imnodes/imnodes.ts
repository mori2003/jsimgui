// @ts-nocheck

import { Mod, ReferenceStruct, ImVec2 } from "./imgui.js";

/** -> enum ImNodesCol_ */
export type ImNodesCol = number;
/** -> enum ImNodesStyleVar_ */
export type ImNodesStyleVar = number;
/** -> enum ImNodesStyleFlags_ */
export type ImNodesStyleFlags = number;
/** -> enum ImNodesPinShape_ */
export type ImNodesPinShape = number;
/** -> enum ImNodesAttributeFlags_ */
export type ImNodesAttributeFlags = number;
/** -> enum ImNodesMiniMapLocation_ */
export type ImNodesMiniMapLocation = number;

export class ImNodesContext extends ReferenceStruct {}
export class ImNodesEditorContext extends ReferenceStruct {}

export class ImNodesIO extends ReferenceStruct {
	get AltMouseButton(): number {
		return this.ptr.get_AltMouseButton();
	}
	set AltMouseButton(v: number) {
		this.ptr.set_AltMouseButton(v);
	}

	get AutoPanningSpeed(): number {
		return this.ptr.get_AutoPanningSpeed();
	}
	set AutoPanningSpeed(v: number) {
		this.ptr.set_AutoPanningSpeed(v);
	}
}

export class ImNodesStyle extends ReferenceStruct {
	get GridSpacing(): number {
		return this.ptr.get_GridSpacing();
	}
	set GridSpacing(v: number) {
		this.ptr.set_GridSpacing(v);
	}

	get NodeCornerRounding(): number {
		return this.ptr.get_NodeCornerRounding();
	}
	set NodeCornerRounding(v: number) {
		this.ptr.set_NodeCornerRounding(v);
	}

	get NodePadding(): ImVec2 {
		return ImVec2.From(this.ptr.get_NodePadding());
	}
	set NodePadding(v: ImVec2) {
		this.ptr.set_NodePadding(v);
	}

	get NodeBorderThickness(): number {
		return this.ptr.get_NodeBorderThickness();
	}
	set NodeBorderThickness(v: number) {
		this.ptr.set_NodeBorderThickness(v);
	}

	get LinkThickness(): number {
		return this.ptr.get_LinkThickness();
	}
	set LinkThickness(v: number) {
		this.ptr.set_LinkThickness(v);
	}

	get LinkLineSegmentsPerLength(): number {
		return this.ptr.get_LinkLineSegmentsPerLength();
	}
	set LinkLineSegmentsPerLength(v: number) {
		this.ptr.set_LinkLineSegmentsPerLength(v);
	}

	get LinkHoverDistance(): number {
		return this.ptr.get_LinkHoverDistance();
	}
	set LinkHoverDistance(v: number) {
		this.ptr.set_LinkHoverDistance(v);
	}

	get PinCircleRadius(): number {
		return this.ptr.get_PinCircleRadius();
	}
	set PinCircleRadius(v: number) {
		this.ptr.set_PinCircleRadius(v);
	}

	get PinQuadSideLength(): number {
		return this.ptr.get_PinQuadSideLength();
	}
	set PinQuadSideLength(v: number) {
		this.ptr.set_PinQuadSideLength(v);
	}

	get PinTriangleSideLength(): number {
		return this.ptr.get_PinTriangleSideLength();
	}
	set PinTriangleSideLength(v: number) {
		this.ptr.set_PinTriangleSideLength(v);
	}

	get PinLineThickness(): number {
		return this.ptr.get_PinLineThickness();
	}
	set PinLineThickness(v: number) {
		this.ptr.set_PinLineThickness(v);
	}

	get PinHoverRadius(): number {
		return this.ptr.get_PinHoverRadius();
	}
	set PinHoverRadius(v: number) {
		this.ptr.set_PinHoverRadius(v);
	}

	get PinOffset(): number {
		return this.ptr.get_PinOffset();
	}
	set PinOffset(v: number) {
		this.ptr.set_PinOffset(v);
	}

	get MiniMapPadding(): ImVec2 {
		return ImVec2.From(this.ptr.get_MiniMapPadding());
	}
	set MiniMapPadding(v: ImVec2) {
		this.ptr.set_MiniMapPadding(v);
	}

	get MiniMapOffset(): ImVec2 {
		return ImVec2.From(this.ptr.get_MiniMapOffset());
	}
	set MiniMapOffset(v: ImVec2) {
		this.ptr.set_MiniMapOffset(v);
	}

	get Flags(): ImNodesStyleFlags {
		return this.ptr.get_Flags();
	}
	set Flags(v: ImNodesStyleFlags) {
		this.ptr.set_Flags(v);
	}

	get Colors(): number[] {
		return this.ptr.get_Colors();
	}
	set Colors(v: number[]) {
		this.ptr.set_Colors(v);
	}
}

export const ImNodes = {
	Col: {
		NodeBackground: 0,
		NodeBackgroundHovered: 1,
		NodeBackgroundSelected: 2,
		NodeOutline: 3,
		TitleBar: 4,
		TitleBarHovered: 5,
		TitleBarSelected: 6,
		Link: 7,
		LinkHovered: 8,
		LinkSelected: 9,
		Pin: 10,
		PinHovered: 11,
		BoxSelector: 12,
		BoxSelectorOutline: 13,
		GridBackground: 14,
		GridLine: 15,
		GridLinePrimary: 16,
		MiniMapBackground: 17,
		MiniMapBackgroundHovered: 18,
		MiniMapOutline: 19,
		MiniMapOutlineHovered: 20,
		MiniMapNodeBackground: 21,
		MiniMapNodeBackgroundHovered: 22,
		MiniMapNodeBackgroundSelected: 23,
		MiniMapNodeOutline: 24,
		MiniMapLink: 25,
		MiniMapLinkSelected: 26,
		MiniMapCanvas: 27,
		MiniMapCanvasOutline: 28,
		COUNT: 29,
	},

	StyleVar: {
		GridSpacing: 0,
		NodeCornerRounding: 1,
		NodePadding: 2,
		NodeBorderThickness: 3,
		LinkThickness: 4,
		LinkLineSegmentsPerLength: 5,
		LinkHoverDistance: 6,
		PinCircleRadius: 7,
		PinQuadSideLength: 8,
		PinTriangleSideLength: 9,
		PinLineThickness: 10,
		PinHoverRadius: 11,
		PinOffset: 12,
		MiniMapPadding: 13,
		MiniMapOffset: 14,
		COUNT: 15,
	},

	StyleFlags: {
		None: 0,
		NodeOutline: 1 << 0,
		GridLines: 1 << 2,
		GridLinesPrimary: 1 << 3,
		GridSnapping: 1 << 4,
	},

	PinShape: {
		Circle: 0,
		CircleFilled: 1,
		Triangle: 2,
		TriangleFilled: 3,
		Quad: 4,
		QuadFilled: 5,
	},

	AttributeFlags: {
		None: 0,
		EnableLinkDetachWithDragClick: 1 << 0,
		EnableLinkCreationOnSnap: 1 << 1,
	},

	MiniMapLocation: {
		BottomLeft: 0,
		BottomRight: 1,
		TopLeft: 2,
		TopRight: 3,
	},

	CreateContext(): ImNodesContext {
		return ImNodesContext.From(Mod.export.ImNodes_CreateContext());
	},
	DestroyContext(ctx: ImNodesContext | null = null): void {
		Mod.export.ImNodes_DestroyContext(ctx?.ptr ?? null);
	},
	GetCurrentContext(): ImNodesContext {
		return ImNodesContext.From(Mod.export.ImNodes_GetCurrentContext());
	},
	SetCurrentContext(ctx: ImNodesContext): void {
		Mod.export.ImNodes_SetCurrentContext(ctx);
	},

	EditorContextCreate(): ImNodesEditorContext {
		return ImNodesEditorContext.From(Mod.export.ImNodes_EditorContextCreate());
	},
	EditorContextFree(ctx: ImNodesEditorContext): void {
		Mod.export.ImNodes_EditorContextFree(ctx);
	},
	EditorContextSet(ctx: ImNodesEditorContext): void {
		Mod.export.ImNodes_EditorContextSet(ctx);
	},
	EditorContextGetPanning(): ImVec2 {
		return ImVec2.From(Mod.export.ImNodes_EditorContextGetPanning());
	},
	EditorContextResetPanning(pos: ImVec2): void {
		Mod.export.ImNodes_EditorContextResetPanning(pos);
	},
	EditorContextMoveToNode(node_id: number): void {
		Mod.export.ImNodes_EditorContextMoveToNode(node_id);
	},

	GetIO(): ImNodesIO {
		return ImNodesIO.From(Mod.export.ImNodes_GetIO());
	},

	/**
	 * Returns the global style struct. See the struct declaration for default values.
	 */
	GetStyle(): ImNodesStyle {
		return ImNodesStyle.From(Mod.export.ImNodes_GetStyle());
	},

	/**
	 * Style presets matching the dear imgui styles of the same name. If dest is NULL, the active
	 * context's ImNodesStyle instance will be used as the destination.
	 */
	StyleColorsDark(dest: ImNodesStyle | null = null): void {
		Mod.export.ImNodes_StyleColorsDark(dest?.ptr ?? null);
	},
	StyleColorsClassic(dest: ImNodesStyle | null = null): void {
		Mod.export.ImNodes_StyleColorsClassic(dest?.ptr ?? null);
	},
	StyleColorsLight(dest: ImNodesStyle | null = null): void {
		Mod.export.ImNodes_StyleColorsLight(dest?.ptr ?? null);
	},

	/**
	 * The top-level function call. Call this before calling BeginNode/EndNode. Calling this function
	 * will result the node editor grid workspace being rendered.
	 */
	BeginNodeEditor(): void {
		Mod.export.ImNodes_BeginNodeEditor();
	},
	EndNodeEditor(): void {
		Mod.export.ImNodes_EndNodeEditor();
	},

	/**
	 * Add a navigable minimap to the editor; call before EndNodeEditor after all
	 * nodes and links have been specified
	 */
	MiniMap(minimap_size_fraction: number = 0.2, location: ImNodesMiniMapLocation = 2): void {
		Mod.export.ImNodes_MiniMap(minimap_size_fraction, location);
	},

	/**
	 * Use PushColorStyle and PopColorStyle to modify ImNodesStyle::Colors mid-frame.
	 */
	PushColorStyle(item: ImNodesCol, color: number): void {
		Mod.export.ImNodes_PushColorStyle(item, color);
	},
	PopColorStyle(): void {
		Mod.export.ImNodes_PopColorStyle();
	},
	PushStyleVar(style_item: ImNodesStyleVar, value: number): void {
		Mod.export.ImNodes_PushStyleVar(style_item, value);
	},
	PushStyleVarImVec2(style_item: ImNodesStyleVar, value: ImVec2): void {
		Mod.export.ImNodes_PushStyleVarImVec2(style_item, value);
	},
	PopStyleVar(count: number = 1): void {
		Mod.export.ImNodes_PopStyleVar(count);
	},

	/**
	 * id can be any positive or negative integer, but INT_MIN is currently reserved for internal use.
	 */
	BeginNode(id: number): void {
		Mod.export.ImNodes_BeginNode(id);
	},
	EndNode(): void {
		Mod.export.ImNodes_EndNode();
	},

	GetNodeDimensions(id: number): ImVec2 {
		return ImVec2.From(Mod.export.ImNodes_GetNodeDimensions(id));
	},

	/**
	 * Place your node title bar content (such as the node title, using ImGui::Text) between the
	 * following function calls. These functions have to be called before adding any attributes, or the
	 * layout of the node will be incorrect.
	 */
	BeginNodeTitleBar(): void {
		Mod.export.ImNodes_BeginNodeTitleBar();
	},
	EndNodeTitleBar(): void {
		Mod.export.ImNodes_EndNodeTitleBar();
	},

	// Attributes are ImGui UI elements embedded within the node. Attributes can have pin shapes
	// rendered next to them. Links are created between pins.
	//
	// The activity status of an attribute can be checked via the IsAttributeActive() and
	// IsAnyAttributeActive() function calls. This is one easy way of checking for any changes made to
	// an attribute's drag float UI, for instance.
	//
	// Each attribute id must be unique.

	/**
	 * Create an input attribute block. The pin is rendered on left side.
	 */
	BeginInputAttribute(id: number, shape: ImNodesPinShape = 1): void {
		Mod.export.ImNodes_BeginInputAttribute(id, shape);
	},
	EndInputAttribute(): void {
		Mod.export.ImNodes_EndInputAttribute();
	},

	/**
	 * Create an output attribute block. The pin is rendered on the right side.
	 */
	BeginOutputAttribute(id: number, shape: ImNodesPinShape = 1): void {
		Mod.export.ImNodes_BeginOutputAttribute(id, shape);
	},
	EndOutputAttribute(): void {
		Mod.export.ImNodes_EndOutputAttribute();
	},

	/**
	 * Create a static attribute block. A static attribute has no pin, and therefore can't be linked to
	 * anything. However, you can still use IsAttributeActive() and IsAnyAttributeActive() to check for
	 * attribute activity.
	 */
	BeginStaticAttribute(id: number): void {
		Mod.export.ImNodes_BeginStaticAttribute(id);
	},
	EndStaticAttribute(): void {
		Mod.export.ImNodes_EndStaticAttribute();
	},

	/**
	 * Push a single AttributeFlags value. By default, only AttributeFlags_None is set.
	 */
	PushAttributeFlag(flag: ImNodesAttributeFlags): void {
		Mod.export.ImNodes_PushAttributeFlag(flag);
	},
	PopAttributeFlag(): void {
		Mod.export.ImNodes_PopAttributeFlag();
	},

	/**
	 * Render a link between attributes.
	 * The attributes ids used here must match the ids used in Begin(Input|Output)Attribute function
	 * calls. The order of start_attr and end_attr doesn't make a difference for rendering the link.
	 */
	Link(id: number, start_attribute_id: number, end_attribute_id: number): void {
		Mod.export.ImNodes_Link(id, start_attribute_id, end_attribute_id);
	},

	/**
	 * Enable or disable the ability to click and drag a specific node.
	 */
	SetNodeDraggable(node_id: number, draggable: boolean): void {
		Mod.export.ImNodes_SetNodeDraggable(node_id, draggable);
	},

	// The node's position can be expressed in three coordinate systems:
	// * screen space coordinates, -- the origin is the upper left corner of the window.
	// * editor space coordinates -- the origin is the upper left corner of the node editor window
	// * grid space coordinates, -- the origin is the upper left corner of the node editor window,
	// translated by the current editor panning vector (see EditorContextGetPanning() and
	// EditorContextResetPanning())

	// Use the following functions to get and set the node's coordinates in these coordinate systems.

	SetNodeScreenSpacePos(node_id: number, screen_space_pos: ImVec2): void {
		Mod.export.ImNodes_SetNodeScreenSpacePos(node_id, screen_space_pos);
	},
	SetNodeEditorSpacePos(node_id: number, editor_space_pos: ImVec2): void {
		Mod.export.ImNodes_SetNodeEditorSpacePos(node_id, editor_space_pos);
	},
	SetNodeGridSpacePos(node_id: number, grid_space_pos: ImVec2): void {
		Mod.export.ImNodes_SetNodeGridSpacePos(node_id, grid_space_pos);
	},

	GetNodeScreenSpacePos(node_id: number): ImVec2 {
		return ImVec2.From(Mod.export.ImNodes_GetNodeScreenSpacePos(node_id));
	},
	GetNodeEditorSpacePos(node_id: number): ImVec2 {
		return ImVec2.From(Mod.export.ImNodes_GetNodeEditorSpacePos(node_id));
	},
	GetNodeGridSpacePos(node_id: number): ImVec2 {
		return ImVec2.From(Mod.export.ImNodes_GetNodeGridSpacePos(node_id));
	},

	/**
	 * If ImNodesStyleFlags_GridSnapping is enabled, snap the specified node's origin to the grid.
	 */
	SnapNodeToGrid(node_id: number): void {
		Mod.export.ImNodes_SnapNodeToGrid(node_id);
	},

	/**
	 * Returns true if the current node editor canvas is being hovered over by the mouse, and is not
	 * blocked by any other windows.
	 */
	IsEditorHovered(): boolean {
		return Mod.export.ImNodes_IsEditorHovered();
	},

	// The following functions return true if a UI element is being hovered over by the mouse cursor.
	// Assigns the id of the UI element being hovered over to the function argument. Use these functions
	// after EndNodeEditor() has been called.

	IsNodeHovered(node_id: [number]): boolean {
		return Mod.export.ImNodes_IsNodeHovered(node_id);
	},
	IsLinkHovered(link_id: [number]): boolean {
		return Mod.export.ImNodes_IsLinkHovered(link_id);
	},
	IsPinHovered(attribute_id: [number]): boolean {
		return Mod.export.ImNodes_IsPinHovered(attribute_id);
	},

	// Use The following two functions to query the number of selected nodes or links in the current
	// editor. Use after calling EndNodeEditor().

	NumSelectedNodes(): number {
		return Mod.export.ImNodes_NumSelectedNodes();
	},
	NumSelectedLinks(): number {
		return Mod.export.ImNodes_NumSelectedLinks();
	},

	// Get the selected node/link ids. The pointer argument should point to an integer array with at
	// least as many elements as the respective NumSelectedNodes/NumSelectedLinks function call
	// returned.

	GetSelectedNodes(node_ids: number[]): void {
		Mod.export.ImNodes_GetSelectedNodes(node_ids);
	},
	GetSelectedLinks(link_ids: number[]): void {
		Mod.export.ImNodes_GetSelectedLinks(link_ids);
	},

	// Clears the list of selected nodes/links. Useful if you want to delete a selected node or link.

	ClearNodeSelection(): void {
		Mod.export.ImNodes_ClearNodeSelection();
	},
	ClearLinkSelection(): void {
		Mod.export.ImNodes_ClearLinkSelection();
	},

	// Use the following functions to add or remove individual nodes or links from the current editors
	// selection. Note that all functions require the id to be an existing valid id for this editor.
	// Select-functions has the precondition that the object is currently considered unselected.
	// Clear-functions has the precondition that the object is currently considered selected.
	// Preconditions listed above can be checked via IsNodeSelected/IsLinkSelected if not already
	// known.

	SelectNode(node_id: number): void {
		Mod.export.ImNodes_SelectNode(node_id);
	},
	ClearNodeSelectionID(node_id: number): void {
		Mod.export.ImNodes_ClearNodeSelectionID(node_id);
	},
	IsNodeSelected(node_id: number): boolean {
		return Mod.export.ImNodes_IsNodeSelected(node_id);
	},
	SelectLink(link_id: number): void {
		Mod.export.ImNodes_SelectLink(link_id);
	},
	ClearLinkSelectionID(link_id: number): void {
		Mod.export.ImNodes_ClearLinkSelectionID(link_id);
	},
	IsLinkSelected(link_id: number): boolean {
		return Mod.export.ImNodes_IsLinkSelected(link_id);
	},

	/**
	 * Was the previous attribute active? This will continuously return true while the left mouse button
	 * is being pressed over the UI content of the attribute.
	 */
	IsAttributeActive(): boolean {
		return Mod.export.ImNodes_IsAttributeActive();
	},
	/**
	 * Was any attribute active? If so, sets the active attribute id to the output function argument.
	 */
	IsAnyAttributeActive(attribute_id: [number] | null = null): boolean {
		return Mod.export.ImNodes_IsAnyAttributeActive(attribute_id);
	},

	// Use the following functions to query a change of state for an existing link, or new link. Call
	// these after EndNodeEditor().

	/**
	 * Did the user start dragging a new link from a pin?
	 */
	IsLinkStarted(started_at_attribute_id: [number]): boolean {
		return Mod.export.ImNodes_IsLinkStarted(started_at_attribute_id);
	},

	/**
	 * Did the user drop the dragged link before attaching it to a pin?
	 * There are two different kinds of situations to consider when handling this event:
	 * 1) a link which is created at a pin and then dropped
	 * 2) an existing link which is detached from a pin and then dropped
	 * Use the including_detached_links flag to control whether this function triggers when the user
	 * detaches a link and drops it.
	 */
	IsLinkDropped(
		started_at_attribute_id: [number] | null = null,
		including_detached_links: boolean = true,
	): boolean {
		return Mod.export.ImNodes_IsLinkDropped(started_at_attribute_id, including_detached_links);
	},
	/**
	 * Did the user finish creating a new link?
	 */
	IsLinkCreated(
		started_at_attribute_id: [number] | null = null,
		ended_at_attribute_id: [number] | null = null,
		created_from_snap: [boolean] | null = null,
	): boolean {
		return Mod.export.ImNodes_IsLinkCreated(
			started_at_attribute_id,
			ended_at_attribute_id,
			created_from_snap,
		);
	},
	IsLinkCreatedEx(
		started_at_node_id: [number] | null = null,
		started_at_attribute_id: [number] | null = null,
		ended_at_node_id: [number] | null = null,
		ended_at_attribute_id: [number] | null = null,
		created_from_snap: [boolean] | null = null,
	): boolean {
		return Mod.export.ImNodes_IsLinkCreatedEx(
			started_at_node_id,
			started_at_attribute_id,
			ended_at_node_id,
			ended_at_attribute_id,
			created_from_snap,
		);
	},

	/**
	 * Was an existing link detached from a pin by the user? The detached link's id is assigned to the
	 * output argument link_id.
	 */
	IsLinkDestroyed(link_id: [number]): boolean {
		return Mod.export.ImNodes_IsLinkDestroyed(link_id);
	},

	// Use the following functions to write the editor context's state to a string, or directly to a
	// file. The editor context is serialized in the INI file format.

	SaveCurrentEditorStateToIniString(): string {
		return Mod.export.ImNodes_SaveCurrentEditorStateToIniString();
	},
	SaveEditorStateToIniString(editor: ImNodesEditorContext): string {
		return Mod.export.ImNodes_SaveEditorStateToIniString(editor?.ptr ?? null);
	},

	LoadCurrentEditorStateFromIniString(data: string): void {
		Mod.export.ImNodes_LoadCurrentEditorStateFromIniString(data);
	},
	LoadEditorStateFromIniString(editor: ImNodesEditorContext, data: string): void {
		Mod.export.ImNodes_LoadEditorStateFromIniString(editor?.ptr ?? null, data);
	},
};
