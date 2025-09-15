import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tsGenerateEnums } from "./enum.ts";
import { filterSkippables } from "./filter.ts";
import { generateFunctionsCpp, generateFunctionsTs } from "./function.ts";
import type { ImGuiData } from "./interface.ts";
import { generateStructsCpp, generateStructsTs } from "./struct.ts";
import { generateTypedefs } from "./types.ts";

export interface GeneratorContext {
    data: ImGuiData;
    config: {};
    stats: {
        defines?: {
            total: number;
            bound: number;
        };
    };
}

export const runGenerator = () => {
    // Filters out internal & obsolete functions, structs, enums... which we don't need.
    const fileData = readFileSync("./third_party/dear_bindings/dcimgui.json", "utf-8");
    const data = filterSkippables(JSON.parse(fileData), true, true);

    const ctx: GeneratorContext = {
        data,
        config: {},
        stats: {},
    };

    // Generate the TS bindings.
    const tsCode = ((): string => {
        const typedefs = generateTypedefs(data);
        const structs = generateStructsTs(data);
        const enums = tsGenerateEnums(ctx);
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

        return [beforeGenerated, "\n", generatedCode, "\n", afterGenerated].join("");
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
};
