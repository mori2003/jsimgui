/**
 * The TypeScript/JavaScript API for jsimgui.
 * Gives access to the exported ImGui functions, structs and enums.
 * It is using the docking branch of Dear ImGui.
 *
 * Index:
 * 1. Core Module
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
export declare const Mod: {
    _export: null;
    /** Initialize the WASM module. */
    Init(): Promise<void>;
    readonly export: any;
};
/** Web implementation of Jsimgui. */
export declare const ImGuiImplWeb: {
    /** Initialize Dear ImGui on the given canvas. Only WebGL2 is supported. */
    Init(canvas: HTMLCanvasElement): Promise<void>;
};
