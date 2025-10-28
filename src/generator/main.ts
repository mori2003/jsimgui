import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { GeneratorConfig } from "./config.ts";
import { filterSkippables } from "./filter.ts";
import { generateCppBindings } from "./generate-cpp.ts";
import { generateTypeScriptBindings } from "./generate-ts.ts";
import type { ImGuiData } from "./interface.ts";

export interface GeneratorContext {
    config: GeneratorConfig;
    data: ImGuiData;
    stats?: {
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
        config: JSON.parse(readFileSync("./src/gen-config.json", "utf-8")),
        data,
        stats: {},
    };

    console.log(ctx.data.functions.length);

    const tsCode = generateTypeScriptBindings(ctx);
    const cppCode = generateCppBindings(ctx);

    mkdirSync("./bindgen", { recursive: true });
    writeFileSync("./bindgen/mod.ts", tsCode);
    writeFileSync("./bindgen/jsimgui.cpp", cppCode);
};
