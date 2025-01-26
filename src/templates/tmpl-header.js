/**
 * jsimgui - JavaScript bindings for Dear ImGui.
 *
 * @module jsimgui
 * @version 0.1.0
 * @author mori2003
 * @license MIT
 *
 * @file
 * The JavaScript API for exported ImGui functions, structs and enums.
 *
 * Index:
 * 1. Helpers
 * 2. Typedefs
 * 3. Structs
 * 4. Functions
 * 5. Enums
 * 6. Web Implementation
 *
 * The bindings are tagged:
 * [Manual] - Manually written bindings.
 * [Auto] - Auto-generated bindings.
 *
 * For source code and more information:
 * @see {@link https://github.com/mori2003/jsimgui|jsimgui}
 */

import MainExport from "./jsimgui.js";

/* -------------------------------------------------------------------------- */
/* 1. Helpers */
/* -------------------------------------------------------------------------- */

/** A singleton class that handles the initialization of the exported main and demo modules. */
class Mod {
    static #main;

    static async initMain() {
        if (this.#main) throw new Error("Main module is already initialized.");

        await MainExport().then((module) => (this.#main = module));
    }

    static get main() {
        if (!this.#main) throw new Error("Main module is not initialized.");
        return this.#main;
    }
}

/** A class that wraps a reference to an ImGui struct. */
class StructBinding {
    #ref;

    constructor(name) {
        this.#ref = new Mod.main[name]();
    }

    static wrap(ref) {
        const wrap = new this;
        wrap.#ref = ref;
        return wrap;
    }

    unwrap() {
        return this.#ref;
    }
}
