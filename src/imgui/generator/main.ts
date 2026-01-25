import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { GeneratorConfig } from "./config.ts";
import { getFunctionsCode as getFunctionsCodeCpp } from "./cpp/functions.ts";
import { getStructsCode as getStructsCodeCpp } from "./cpp/structs.ts";
import { filterData } from "./filter.ts";
import type { ImGuiData } from "./interface.ts";
import { getEnumsCode as getEnumsCodeTs, getFreeTypeLoaderEnum } from "./ts/enums.ts";
import { getFunctionsCode as getFunctionsCodeTs } from "./ts/functions.ts";
import { getStructsCode as getStructsCodeTs } from "./ts/structs.ts";
import { getExtraTypedefs, getTypedefsCode as getTypedefsCodeTs } from "./ts/typedefs.ts";

const PATHS = {
    CONFIG: "./src/imgui/config.json",
    DATA: "./third_party/dear_bindings/dcimgui.json",
    OUTPUT_MOD: "./bindgen/mod.ts",
    OUTPUT_CPP: "./bindgen/jsimgui.cpp",
    BEGIN_TS: "./src/imgui/api/ts/begin.ts",
    END_TS: "./src/imgui/api/ts/end.ts",
};

export interface GeneratorContext {
    config: GeneratorConfig;
    data: ImGuiData;
}

/**
 * Generates the TypeScript and C++ bindings code.
 */
function getBindings(context: GeneratorContext): [string, string] {
    const begin = readFileSync(PATHS.BEGIN_TS, "utf-8");
    const end = readFileSync(PATHS.END_TS, "utf-8");
    const ts =
        begin +
        getTypedefsCodeTs(context) +
        getExtraTypedefs() +
        getStructsCodeTs(context) +
        "\n" +
        "export const ImGui = {\n" +
        getEnumsCodeTs(context) +
        getFreeTypeLoaderEnum() +
        getFunctionsCodeTs(context) +
        "};\n" +
        end;

    const cpp =
        "#include <util.hpp>\n" +
        "\n" +
        "#include <dcimgui.h>\n" +
        "#include <dcimgui_internal.h>\n" +
        "\n" +
        "#include <emscripten/bind.h>\n" +
        "\n" +
        "static auto const IMGUI = bindings([]() {\n" +
        getStructsCodeCpp(context) +
        getFunctionsCodeCpp(context) +
        "});\n";

    return [ts, cpp];
}

/**
 * Main entry point for the bindings generator.
 */
export function runGenerator(): void {
    const configFile = readFileSync(PATHS.CONFIG, "utf-8");
    const dataFile = readFileSync(PATHS.DATA, "utf-8");

    const config = JSON.parse(configFile) as GeneratorConfig;
    const data = filterData(JSON.parse(dataFile), true, true) as ImGuiData;

    const context: GeneratorContext = { config, data };
    const [ts, cpp] = getBindings(context);

    mkdirSync("./bindgen", { recursive: true });
    writeFileSync(PATHS.OUTPUT_MOD, ts);
    writeFileSync(PATHS.OUTPUT_CPP, cpp);
}
