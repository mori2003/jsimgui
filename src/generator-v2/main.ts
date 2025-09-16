import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { generateDefines } from "./define.ts";
import { generateEnums } from "./enum.ts";
import type { BindingConfig, ImGuiData } from "./interface.ts";
import { filterRecursive, isInternal, isObsolete } from "./util.ts";

const PATH_IMGUI_DATA = "./third_party/dear_bindings/dcimgui.json";
const PATH_BINDINGS_CONFIG = "./src/bindings-config.json";
const PATH_OUTPUT_TS = "./bindgen/mod-v2.ts";
const PATH_OUTPUT_CPP = "./bindgen/bindings-v2.cpp";

/** Output container for a generator. Generators can emit TypeScript and/or C++ code. */
export interface CodeOutput {
    /** TypeScript code emitted by the generator. Empty string when nothing is generated. */
    readonly ts: string;
    /** C++ code emitted by the generator. Empty string when nothing is generated. */
    readonly cpp: string;
}

export interface GeneratorContext {
    data: ImGuiData;
    config: BindingConfig;
}

/**
 * Global context for the generator.
 */
export const context = {
    data: {},
    config: {},
} as GeneratorContext;

/**
 * Main entry point for the generator.
 */
export const runGenerator = () => {
    const rawData = JSON.parse(readFileSync(PATH_IMGUI_DATA, "utf-8"));
    const config = JSON.parse(readFileSync(PATH_BINDINGS_CONFIG, "utf-8"));

    // We filter out internal and obsolete (deprecated) items in order to reduce file size.
    const filteredData = [isInternal, isObsolete].reduce(
        (data, filter) => filterRecursive(data, (item) => !filter(item)),
        rawData,
    );

    context.data = filteredData;
    context.config = config;

    const codeGenerators = [
        generateDefines,
        () => ({ ts: "export const ImGui = Object.freeze({\n", cpp: "" }),
        generateEnums,
        () => ({ ts: "});\n", cpp: "" }),
    ];

    const { ts, cpp } = codeGenerators.reduce(
        (acc: { ts: string; cpp: string }, curr: () => CodeOutput) => {
            const { ts, cpp } = curr();
            acc.ts += ts;
            acc.cpp += cpp;
            return acc;
        },
        { ts: "", cpp: "" },
    );

    console.log(ts);

    mkdirSync("./bindgen", { recursive: true });
    writeFileSync(PATH_OUTPUT_TS, ts);
    writeFileSync(PATH_OUTPUT_CPP, cpp);
};

if (import.meta.main) {
    runGenerator();
}
