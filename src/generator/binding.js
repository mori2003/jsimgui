import { filterSkippables } from "./filter.js";
import { generateTypedefs } from "./typedef.js";
import { generateEnums } from "./enum.js";
import { generateFunctions } from "./function.js";
import { generateStructs } from "./struct.js";

function writeOutputFile(content, outPath) {
    try {
        Deno.writeTextFileSync(outPath, content);
    } catch (_error) {
        throw new Error(`Failed to write to file: ${outPath}`);
    }
}

function readTemplateFile(templatePath) {
    try {
        return Deno.readTextFileSync(templatePath);
    } catch (_error) {
        throw new Error(`Failed to read template file: ${templatePath}`);
    }
}

export function generateBindings(fileContent, outCppPath, outJsPath) {
    const data = JSON.parse(fileContent);
    const jsonData = filterSkippables(data, true, true); // Filters out internal, obsolete functions, structs, etc.

    const cppContent = (() => {
        const [_structs_js, structs] = generateStructs(jsonData);
        const [_functions_js, functions] = generateFunctions(jsonData);

        return [
            readTemplateFile("./src/templates/tmpl-jsimgui.cpp"),
            "/* -------------------------------------------------------------------------- */",
            "/* AUTO-GENERATED BINDINGS */",
            "/* -------------------------------------------------------------------------- */",
            "",
            "EMSCRIPTEN_BINDINGS(generated) {",
            structs,
            functions,
            "}",
        ].join('\n');
    })();

    const jsContent = (() => {
        const typedefs = generateTypedefs(jsonData);
        const [structs, _structs_cpp] = generateStructs(jsonData);
        const [functions, _functions_cpp] = generateFunctions(jsonData);
        const enums = generateEnums(jsonData);

        return [
            readTemplateFile("./src/templates/tmpl-header.js"),
            "/* -------------------------------------------------------------------------- */",
            "/* 2. Typedefs */",
            "/* -------------------------------------------------------------------------- */",
            typedefs,
            "/* -------------------------------------------------------------------------- */",
            "/* 3. Structs */",
            "/* -------------------------------------------------------------------------- */",
            readTemplateFile("./src/templates/tmpl-structs.js"),
            structs,
            "/* -------------------------------------------------------------------------- */",
            "/* 4. Functions */",
            "/* -------------------------------------------------------------------------- */",
            readTemplateFile("./src/templates/tmpl-functions.js"),
            functions,
            "/* -------------------------------------------------------------------------- */",
            "/* 5. Enums */",
            "/* -------------------------------------------------------------------------- */",
            enums,
            "/* -------------------------------------------------------------------------- */",
            "/* 6. Web Implementation */",
            "/* -------------------------------------------------------------------------- */",
            readTemplateFile("./src/templates/tmpl-impl.js")
        ].join("\n");
    })();

    writeOutputFile(cppContent, outCppPath);
    writeOutputFile(jsContent, outJsPath);
}
