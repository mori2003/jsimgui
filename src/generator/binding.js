/**
 * @file Binding generation for C++ & JavaScript.
 *
 * This file generates the C++ & JavaScript bindings and writes them to the output files.
 */

import { filterSkippables } from "./filter.js";
import { generateTypedefs } from "./typedef.js";
import { generateEnums } from "./enum.js";
import { generateStructsCpp, generateStructsJs } from "./struct.js";
import { generateFunctionsCpp, generateFunctionsJs } from "./function.js";

/** Generates the C++ & JavaScript bindings and writes them to the output files.
 * @param {string} fileData
 * @param {string} outCppPath
 * @param {string} outJsPath
 */
export function generateBindings(
    fileData,
    outCppPath,
    outJsPath,
) {
    const data = JSON.parse(fileData);
    const jsonData = filterSkippables(data, true, true); // Filters out internal, obsolete functions, structs which we don't need.

    const jsCode = (() => {
        const enums = generateEnums(jsonData);
        const typedefs = generateTypedefs(jsonData);
        const structs = generateStructsJs(jsonData);
        const functions = generateFunctionsJs(jsonData);

        return [
            Deno.readTextFileSync("./src/templates/tmpl-header.js"),
            "/* -------------------------------------------------------------------------- */",
            "/* 2. Enums */",
            "/* -------------------------------------------------------------------------- */",
            enums,
            "/* -------------------------------------------------------------------------- */",
            "/* 3. Typedefs */",
            "/* -------------------------------------------------------------------------- */",
            typedefs,
            "/* -------------------------------------------------------------------------- */",
            "/* 4. Structs */",
            "/* -------------------------------------------------------------------------- */",
            structs,
            "/* -------------------------------------------------------------------------- */",
            "/* 5. Functions */",
            "/* -------------------------------------------------------------------------- */",
            functions,
            "/* -------------------------------------------------------------------------- */",
            "/* 6. Web Implementation */",
            "/* -------------------------------------------------------------------------- */",
            Deno.readTextFileSync("./src/templates/tmpl-impl.js"),
        ].join("\n");
    })();

    const cppCode = (() => {
        const structs = generateStructsCpp(jsonData);
        const functions = generateFunctionsCpp(jsonData);

        return [
            Deno.readTextFileSync("./src/templates/tmpl-jsimgui.cpp"),
            "/* -------------------------------------------------------------------------- */",
            "/* AUTO-GENERATED BINDINGS */",
            "/* -------------------------------------------------------------------------- */",
            "",
            "EMSCRIPTEN_BINDINGS(jsimgui) {",
            "/* -------------------------------------------------------------------------- */",
            "/* STRUCTS */",
            "/* -------------------------------------------------------------------------- */",
            structs,
            "/* -------------------------------------------------------------------------- */",
            "/* FUNCTIONS */",
            "/* -------------------------------------------------------------------------- */",
            functions,
            "}",
        ].join("\n");
    })();

    Deno.writeTextFileSync(outCppPath, cppCode);
    Deno.writeTextFileSync(outJsPath, jsCode);
}
