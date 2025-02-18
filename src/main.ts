/**
 * Bindings generator tool for jsimgui. It generates the C++ bindings and the TypeScript API
 * using the dear_bindings json data files.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { filterSkippables } from "./filter.ts";

/** Main entry point for the generator. Gets called by the build script. */
export function main(): void {
    const fileData = readFileSync("./third_party/dear_bindings/dcimgui.json", "utf-8");
    generateBindings(fileData);
}

/** Generates the bindings from the given file data and writes them to the output files. */
function generateBindings(fileData: string): void {
    // Filters out internal & obsolete functions, structs, enums... which we don't need.
    const data = filterSkippables(JSON.parse(fileData), true, true);

    // Generate the TS bindings.
    const tsCode = ((): string => {
        // const enums = generateEnums(jsonData);
        // const typedefs = generateTypedefs(jsonData);
        // const structs = generateStructsJs(jsonData);
        // const functions = generateFunctionsJs(jsonData);

        return [
            readFileSync("./src/templates/ts/header.ts", "utf-8"),
            "/* -------------------------------------------------------------------------- */",
            "/* 2. Enums */",
            "/* -------------------------------------------------------------------------- */",
            //enums,
            "/* -------------------------------------------------------------------------- */",
            "/* 3. Typedefs */",
            "/* -------------------------------------------------------------------------- */",
            //typedefs,
            "/* -------------------------------------------------------------------------- */",
            "/* 4. Structs */",
            "/* -------------------------------------------------------------------------- */",
            //structs,
            "/* -------------------------------------------------------------------------- */",
            "/* 5. Functions */",
            "/* -------------------------------------------------------------------------- */",
            //functions,
            "/* -------------------------------------------------------------------------- */",
            "/* 6. Web Implementation */",
            "/* -------------------------------------------------------------------------- */",
            readFileSync("./src/templates/ts/impl.ts", "utf-8"),
        ].join("\n");
    })();

    writeFileSync("./bindgen/mod.ts", tsCode);
}
