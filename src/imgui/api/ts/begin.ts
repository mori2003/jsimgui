/* @ts-self-types="./mod.d.ts" */

/** biome-ignore-all assist/source/organizeImports: . */
/** biome-ignore-all lint/correctness/noUnusedVariables: . */
/** biome-ignore-all lint/suspicious/noExplicitAny: . */

/**
 * Object wrapping the exported Emscripten module. Used to access any of the exported functions
 * or runtime methods.
 */
const Mod = {
    /**
     * The Emscripten module exports.
     */
    _export: null,

    /**
     * Initialize the Emscripten module by loading and instantiating it. Make it's exports
     * available through {@linkcode Mod.export}. Will be called by {@linkcode ImGuiImplWeb.Init}.
     * @throws {Error} Throws error if the module is already initialized.
     */
    async init(loaderPath: string, customLoaderPath: string | undefined) {
        if (Mod._export) {
            throw new Error("jsimgui: Emscripten module is already initialized.");
        }

        let MainExport: any;
        if (customLoaderPath) {
            MainExport = await import(`${customLoaderPath}`);
        } else {
            switch (loaderPath) {
                case "./jsimgui.em.js":
                    // @ts-expect-error
                    MainExport = await import("./jsimgui.em.js");
                    break;
                case "./jsimgui-freetype.em.js":
                    // @ts-expect-error
                    MainExport = await import("./jsimgui-freetype.em.js");
                    break;
            }
        }

        const module = await MainExport.default();
        Mod._export = module;
    },

    /**
     * Access to the Emscripten module exports.
     * @throws {Error} Throws error if the module hasn't been initialized by {@linkcode Mod.init}.
     */
    get export(): any {
        if (!Mod._export) {
            throw new Error(
                "jsimgui: Emscripten module is not initialized. Did you call ImGuiImplWeb.Init()?",
            );
        }

        return this._export;
    },
};

/**
 * Base class for value structs (passed by value, no native pointer).
 */
class ValueStruct {}

/**
 * Base class for reference structs (carry native pointer/reference).
 * These structs manage native memory and require explicit cleanup.
 */
class ReferenceStruct {
    /**
     * The native pointer to the struct.
     */
    ptr: any = null;

    /**
     * Construct a new JavaScript class instance and allocate native memory.
     */
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

const IM_COL32_WHITE = 0xffffffff;
