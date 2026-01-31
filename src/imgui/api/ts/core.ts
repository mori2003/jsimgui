export const Mod = {
    // biome-ignore lint/suspicious/noExplicitAny: _
    export: null as any,

    async init(enableFreeType: boolean, loaderPath?: string): Promise<void> {
        // biome-ignore lint/suspicious/noExplicitAny: _
        let MainExport: any;

        if (loaderPath) {
            MainExport = await import(loaderPath);
        } else if (enableFreeType) {
            // @ts-expect-error
            MainExport = await import("./wasm/loader-freetype.em.js");
        } else {
            // @ts-expect-error
            MainExport = await import("./wasm/loader.em.js");
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
