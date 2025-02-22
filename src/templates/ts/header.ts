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
import MainExport from "./jsimgui-em.js";

/* -------------------------------------------------------------------------- */
/* 1. Core Module */
/* -------------------------------------------------------------------------- */

export const Mod = {
    _export: null,

    /** Initialize the WASM module. */
    async init(): Promise<void> {
        if (Mod._export) {
            throw new Error("WASM module already initialized.");
        }

        // @ts-ignore
        await MainExport().then((module): void => {
            Mod._export = module;
        });
    },

    get export(): any {
        if (!Mod._export) {
            throw new Error("WASM module not initialized. Did you call ImGuiImplWeb.Init()?");
        }

        return this._export;
    },
};

/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    _ptr: any;

    constructor(name: string) {
        this._ptr = new Mod.export[name]();
    }

    static wrap(ptr: any): any {
        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        const wrap = Reflect.construct(this, []);
        wrap._ptr = ptr;
        return wrap;
    }
}
