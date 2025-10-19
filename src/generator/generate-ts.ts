import { readFileSync } from "node:fs";
import type { GeneratorContext } from "./main.ts";
import { generateEnums } from "./ts/enums";
import { generateFunctions } from "./ts/functions";
import { generateStructs } from "./ts/structs";
import { generateTypedefs } from "./ts/typedefs.ts";

export const generateTypeScriptBindings = (ctx: GeneratorContext): string => {
    const templateBegin = readFileSync("./src/api-begin.ts", "utf-8");
    const templateEnd = readFileSync("./src/api-end.ts", "utf-8");

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
