import { readFileSync } from "node:fs";
import { generateFunctions } from "./cpp/functions.ts";
import { generateStructs } from "./cpp/structs.ts";
import type { GeneratorContext } from "./main.ts";

export const generateCppBindings = (ctx: GeneratorContext): string => {
    const templateBegin = readFileSync("./src/bindings.cpp", "utf-8");

    let code = "";
    code += templateBegin;
    code += "EMSCRIPTEN_BINDINGS(jsimgui) {\n";
    code += generateStructs(ctx);
    code += generateFunctions(ctx);
    code += "}\n";

    return code;
};
