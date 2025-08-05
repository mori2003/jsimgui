/**
 * Bindings generator tool for jsimgui. It generates the C++ bindings and the TypeScript API
 * using the dear_bindings json data files.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { filterSkippables } from "./filter.ts";
import { generateEnumsTs } from "./enum.ts";
import { generateFunctionsCpp, generateFunctionsTs } from "./function.ts";
import { generateStructsCpp, generateStructsTs } from "./struct.ts";
import { generateTypedefs } from "./types.ts";

/** Main entry point for the generator. Gets called by the build script. */
export function main(): void {
    const fileData = readFileSync("./third_party/dear_bindings/dcimgui.json", "utf-8");
    generateBindings(fileData);
}

/** Generates the bindings from the given metadata and writes them to the output files. */
function generateBindings(fileData: string): void {
    // Filters out internal & obsolete functions, structs, enums... which we don't need.
    const data = filterSkippables(JSON.parse(fileData), true, true);

    // Generate the TS bindings.
    const tsCode = ((): string => {
        const typedefs = generateTypedefs(data);
        const structs = generateStructsTs(data);
        const enums = generateEnumsTs(data);
        const functions = generateFunctionsTs(data);

        const headerTemplate = readFileSync("./src/api.ts", "utf-8");

        const generatedCode = [
            "/* -------------------------------------------------------------------------- */\n",
            "/* 2. Typedefs */\n",
            "/* -------------------------------------------------------------------------- */\n",
            "\n",
            typedefs,
            "\n",
            "/* -------------------------------------------------------------------------- */\n",
            "/* 3. Structs */\n",
            "/* -------------------------------------------------------------------------- */\n",
            "\n",
            structs,
            "/* -------------------------------------------------------------------------- */\n",
            "/* 4. ImGui Object - Enums/Flags and Functions */\n",
            "/* -------------------------------------------------------------------------- */\n",
            "export const ImGui = Object.freeze({\n",
            "\n",
            enums,
            functions,
            "});\n",
        ].join("");

        const beginMarker = "[BEGIN GENERATED CODE]";
        const endMarker = "[END GENERATED CODE]";

        const beginIndex = headerTemplate.indexOf(beginMarker);
        const endIndex = headerTemplate.indexOf(endMarker);

        // TODO: Remove magic numbers.
        const beforeGenerated = headerTemplate.substring(0, beginIndex + beginMarker.length + 102);
        const afterGenerated = headerTemplate.substring(endIndex - endMarker.length - 84);

        return [
            beforeGenerated,
            "\n",
            generatedCode,
            "\n",
            afterGenerated,
        ].join("");
    })();

    // Generate the C++ bindings.
    const cppCode = ((): string => {
        const structs = generateStructsCpp(data);
        const functions = generateFunctionsCpp(data);

        return [
            readFileSync("./src/bindings.cpp", "utf-8"),
            "/* -------------------------------------------------------------------------- */\n",
            "/* AUTO-GENERATED BINDINGS */\n",
            "/* -------------------------------------------------------------------------- */\n",
            "\n",
            "EMSCRIPTEN_BINDINGS(jsimgui) {\n",
            "/* -------------------------------------------------------------------------- */\n",
            "/* STRUCTS */\n",
            "/* -------------------------------------------------------------------------- */\n",
            "\n",
            structs,
            "/* -------------------------------------------------------------------------- */\n",
            "/* FUNCTIONS */\n",
            "/* -------------------------------------------------------------------------- */\n",
            functions,
            "}\n",
        ].join("");
    })();

    mkdirSync("./bindgen", { recursive: true });
    writeFileSync("./bindgen/mod.ts", tsCode);
    writeFileSync("./bindgen/jsimgui.cpp", cppCode);
}
