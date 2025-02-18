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
// @ts-ignore: MainExport will be imported when compiled in the build directory.
import MainExport from "./jsimgui.js";
/* -------------------------------------------------------------------------- */
/* 1. Core Module */
/* -------------------------------------------------------------------------- */
export const Mod = {
    _export: null,
    /** Initialize the WASM module. */
    async Init() {
        if (Mod._export) {
            throw new Error("WASM module already initialized.");
        }
        // @ts-ignore
        await MainExport().then((module) => {
            Mod._export = module;
        });
    },
    get export() {
        if (!Mod._export) {
            throw new Error("WASM module not initialized. Did you call ImGuiImplWeb.Init()?");
        }
        return this._export;
    },
};
/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    _ptr;
    constructor(name) {
        this._ptr = new Mod.export[name]();
    }
    static wrap(ptr) {
        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        const wrap = Reflect.construct(this, []);
        wrap._ptr = ptr;
        return wrap;
    }
}
/* -------------------------------------------------------------------------- */
/* 2. Enums */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 3. Typedefs */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 4. Structs */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 5. Functions */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 6. Web Implementation */
/* -------------------------------------------------------------------------- */
/** Web implementation of Jsimgui. */
export const ImGuiImplWeb = {
    /** Initialize Dear ImGui on the given canvas. Only WebGL2 is supported. */
    async Init(canvas) {
        const canvasContext = canvas.getContext("webgl2");
        if (!(canvasContext && canvasContext instanceof WebGL2RenderingContext)) {
            throw new Error("Failed to get WebGL2 context.");
        }
        await Mod.Init();
        //ImGui.CreateContext(null);
        //ImGuiImplWeb.SetupIO(canvas);
    },
};
