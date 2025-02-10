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
