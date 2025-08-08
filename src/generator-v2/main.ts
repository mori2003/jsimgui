import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { type BindingConfig, GeneratorContext } from "./context.ts";
import { defineBinding } from "./define.ts";
import { filterRecursive, isInternal, isObsolete } from "./util.ts";

const PATH_IMGUI_DATA = "./third_party/dear_bindings/dcimgui.json";
const PATH_BINDINGS_CONFIG = "./src/bindings-config.json";

const PATH_OUTPUT_TS = "./bindgen/mod-v2.ts";
const PATH_OUTPUT_CPP = "./bindgen/bindings-v2.cpp";

/**
 * Main entry point for the generator.
 */
export const runGenerator = () => {
    const rawData = JSON.parse(readFileSync(PATH_IMGUI_DATA, "utf-8"));
    const config = JSON.parse(readFileSync(PATH_BINDINGS_CONFIG, "utf-8"));
    
    // We filter out internal and obsolete (deprecated) items in order to reduce file size.
    const filteredData = [isInternal, isObsolete]
        .reduce((data, filter) => filterRecursive(data, (item) => !filter(item)), rawData);
    
    // const [ts, cpp] = [
    //     defineBinding(),
    //     defineBinding(),
    // ];
    
    // Write output files
    mkdirSync("./bindgen", { recursive: true });
    writeFileSync(PATH_OUTPUT_TS, ts);

};

// Also run the generator when the file is executed directly.
if (import.meta.main) {
    runGenerator();
}
