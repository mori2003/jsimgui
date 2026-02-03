// @ts-nocheck
import { Mod, ReferenceStruct } from "./core.js";
import { ImVec2 } from "./imgui.js";

export type ImNodesCol = number;
export type ImNodesStyleVar = number;
export type ImNodesStyleFlags = number;
export type ImNodesPinShape = number;
export type ImNodesAttributeFlags = number;
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

    GetStyle(): ImNodesStyle {
        return ImNodesStyle.From(Mod.export.ImNodes_GetStyle());
    },

    StyleColorsDark(dest: ImNodesStyle | null = null): void {
        Mod.export.ImNodes_StyleColorsDark(dest?.ptr ?? null);
    },
    StyleColorsClassic(dest: ImNodesStyle | null = null): void {
        Mod.export.ImNodes_StyleColorsClassic(dest?.ptr ?? null);
    },
    StyleColorsLight(dest: ImNodesStyle | null = null): void {
        Mod.export.ImNodes_StyleColorsLight(dest?.ptr ?? null);
    },

    BeginNodeEditor(): void {
        Mod.export.ImNodes_BeginNodeEditor();
    },
    EndNodeEditor(): void {
        Mod.export.ImNodes_EndNodeEditor();
    },

    MiniMap(minimap_size_fraction: number = 0.2, location: ImNodesMiniMapLocation = 2): void {
        Mod.export.ImNodes_MiniMap(minimap_size_fraction, location);
    },

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

    BeginNode(id: number): void {
        Mod.export.ImNodes_BeginNode(id);
    },
    EndNode(): void {
        Mod.export.ImNodes_EndNode();
    },

    GetNodeDimensions(id: number): ImVec2 {
        return ImVec2.From(Mod.export.ImNodes_GetNodeDimensions(id));
    },

    BeginNodeTitleBar(): void {
        Mod.export.ImNodes_BeginNodeTitleBar();
    },
    EndNodeTitleBar(): void {
        Mod.export.ImNodes_EndNodeTitleBar();
    },

    BeginInputAttribute(id: number, shape: ImNodesPinShape = 1): void {
        Mod.export.ImNodes_BeginInputAttribute(id, shape);
    },
    EndInputAttribute(): void {
        Mod.export.ImNodes_EndInputAttribute();
    },

    BeginOutputAttribute(id: number, shape: ImNodesPinShape = 1): void {
        Mod.export.ImNodes_BeginOutputAttribute(id, shape);
    },
    EndOutputAttribute(): void {
        Mod.export.ImNodes_EndOutputAttribute();
    },

    BeginStaticAttribute(id: number): void {
        Mod.export.ImNodes_BeginStaticAttribute(id);
    },
    EndStaticAttribute(): void {
        Mod.export.ImNodes_EndStaticAttribute();
    },

    PushAttributeFlag(flag: ImNodesAttributeFlags): void {
        Mod.export.ImNodes_PushAttributeFlag(flag);
    },
    PopAttributeFlag(): void {
        Mod.export.ImNodes_PopAttributeFlag();
    },

    Link(id: number, start_attribute_id: number, end_attribute_id: number): void {
        Mod.export.ImNodes_Link(id, start_attribute_id, end_attribute_id);
    },

    SetNodeDraggable(node_id: number, draggable: boolean): void {
        Mod.export.ImNodes_SetNodeDraggable(node_id, draggable);
    },

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

    SnapNodeToGrid(node_id: number): void {
        Mod.export.ImNodes_SnapNodeToGrid(node_id);
    },

    IsEditorHovered(): boolean {
        return Mod.export.ImNodes_IsEditorHovered();
    },
    IsNodeHovered(node_id: [number]): boolean {
        return Mod.export.ImNodes_IsNodeHovered(node_id);
    },
    IsLinkHovered(link_id: [number]): boolean {
        return Mod.export.ImNodes_IsLinkHovered(link_id);
    },
    IsPinHovered(attribute_id: [number]): boolean {
        return Mod.export.ImNodes_IsPinHovered(attribute_id);
    },

    NumSelectedNodes(): number {
        return Mod.export.ImNodes_NumSelectedNodes();
    },
    NumSelectedLinks(): number {
        return Mod.export.ImNodes_NumSelectedLinks();
    },
    GetSelectedNodes(node_ids: number[]): void {
        Mod.export.ImNodes_GetSelectedNodes(node_ids);
    },
    GetSelectedLinks(link_ids: number[]): void {
        Mod.export.ImNodes_GetSelectedLinks(link_ids);
    },
    ClearNodeSelection(): void {
        Mod.export.ImNodes_ClearNodeSelection();
    },
    ClearLinkSelection(): void {
        Mod.export.ImNodes_ClearLinkSelection();
    },

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

    IsAttributeActive(): boolean {
        return Mod.export.ImNodes_IsAttributeActive();
    },
    IsAnyAttributeActive(attribute_id: [number] | null = null): boolean {
        return Mod.export.ImNodes_IsAnyAttributeActive(attribute_id);
    },

    IsLinkStarted(started_at_attribute_id: [number]): boolean {
        return Mod.export.ImNodes_IsLinkStarted(started_at_attribute_id);
    },

    IsLinkDropped(
        started_at_attribute_id: [number] | null = null,
        including_detached_links: boolean = true,
    ): boolean {
        return Mod.export.ImNodes_IsLinkDropped(started_at_attribute_id, including_detached_links);
    },
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

    IsLinkDestroyed(link_id: [number]): boolean {
        return Mod.export.ImNodes_IsLinkDestroyed(link_id);
    },

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
