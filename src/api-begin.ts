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
                case "./jsimgui-webgl-tt.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl-tt.js");
                    break;
                case "./jsimgui-webgl-tt-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl-tt-demos.js");
                    break;
                case "./jsimgui-webgl-ft.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl-ft.js");
                    break;
                case "./jsimgui-webgl-ft-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl-ft-demos.js");
                    break;
                case "./jsimgui-webgl2-tt.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl2-tt.js");
                    break;
                case "./jsimgui-webgl2-tt-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl2-tt-demos.js");
                    break;
                case "./jsimgui-webgl2-ft.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl2-ft.js");
                    break;
                case "./jsimgui-webgl2-ft-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgl2-ft-demos.js");
                    break;
                case "./jsimgui-webgpu-tt.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgpu-tt.js");
                    break;
                case "./jsimgui-webgpu-tt-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgpu-tt-demos.js");
                    break;
                case "./jsimgui-webgpu-ft.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgpu-ft.js");
                    break;
                case "./jsimgui-webgpu-ft-demos.js":
                    // @ts-ignore
                    MainExport = await import("./jsimgui-webgpu-ft-demos.js");
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
 * Base class for all struct bindings (except for ImVec2, ImVec4 and ImTextureRef).
 */
class StructBinding {
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

/**
 * 2D vector used to store positions, sizes etc.
 */
export class ImVec2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static From(obj: { x: number; y: number }): ImVec2 {
        return new ImVec2(obj.x, obj.y);
    }
}

/**
 * 4D vector used to store clipping rectangles, colors etc.
 */
export class ImVec4 {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static From(obj: { x: number; y: number; z: number; w: number }): ImVec4 {
        return new ImVec4(obj.x, obj.y, obj.z, obj.w);
    }
}

/**
 * ImTextureRef = higher-level identifier for a texture.
 * The identifier is valid even before the texture has been uploaded to the GPU/graphics system.
 * This is what gets passed to functions such as ImGui::Image(), ImDrawList::AddImage().
 * This is what gets stored in draw commands (ImDrawCmd) to identify a texture during rendering.
 */
export class ImTextureRef {
    _TexID: ImTextureID;

    constructor(id: ImTextureID) {
        this._TexID = id;
    }

    static From(obj: { _TexID: ImTextureID }): ImTextureRef {
        return new ImTextureRef(obj._TexID);
    }
}

const IM_COL32_WHITE = 0xffffffff;
