import { readFileSync } from "node:fs";
import type { GeneratorContext } from "./main.ts";
import { generateEnums } from "./ts/enums.ts";
import { generateFunctions } from "./ts/functions.ts";
import { generateStructs } from "./ts/structs.ts";
import { generateTypedefs } from "./ts/typedefs.ts";

export const generateTypeScriptBindings = (ctx: GeneratorContext): string => {
    const templateBegin = readFileSync("./src/imgui/api/ts/begin.ts", "utf-8");
    const templateEnd = readFileSync("./src/imgui/api/ts/end.ts", "utf-8");

    let code = "";
    code += templateBegin;
    code += generateTypedefs(ctx);
    code += generateStructs(ctx);
    code += "\n";
    code += "export const ImGui = {\n";
    code += generateEnums(ctx);
    code += generateFunctions(ctx);
    code += "};\n";
    code += templateEnd;

    return code;
};
