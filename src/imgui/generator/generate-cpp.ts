import { readFileSync } from "node:fs";
import { generateFunctions } from "./cpp/functions.ts";
import { generateStructs } from "./cpp/structs.ts";
import type { GeneratorContext } from "./main.ts";

export const generateCppBindings = (ctx: GeneratorContext): string => {
    let code = "";

    code += "#include <util.hpp>\n";
    code += "#include <wrappers.hpp>\n";
    code += "#include <dcimgui.h>\n";
    code += "#include <dcimgui_internal.h>\n";
    code += "#include <emscripten/bind.h>\n";

    code += "static auto const IMGUI = Bindings([]() {\n";
    code += generateStructs(ctx);
    code += generateFunctions(ctx);
    code += "});\n";

    return code;
};
