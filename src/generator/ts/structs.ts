import type { ImGuiStruct } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { generateJsDocComment } from "./comments.ts";
import { getArguments, getParameters } from "./functions.ts";

export const getTsType = (declaration: string) => {
    // TODO: Refactor!

    // biome-ignore format: ...
    const typeMap = {
        "int": "number",
        "float": "number",
        "double": "number",
        "unsigned int": "number",
        "bool": "boolean",
        "void*": "any",
        "char*": "string",
        "const char*": "string",
        "size_t": "number",
        "unsigned short": "number",

        "bool*": "[boolean]",
        "int*": "[number]",
        "size_t*": "[number]",
        "unsigned int*": "[number]",
        "float*": "[number]",
        "const float*": "number[]",
        "double*": "[number]",
        "float[2]": "[number, number]",
        "float[3]": "[number, number, number]",
        "float[4]": "[number, number, number, number]",
        "int[2]": "[number, number]",
        "int[3]": "[number, number, number]",
        "int[4]": "[number, number, number, number]",
        "double[2]": "[number, number]",
        "double[3]": "[number, number, number]",
        "double[4]": "[number, number, number, number]",
    }

    if (declaration in typeMap) {
        return typeMap[declaration as keyof typeof typeMap];
    }

    declaration = declaration.replace("const ", "");
    declaration = declaration.replace("*", "");

    return declaration;
};

export const isStructType = (type: string, ctx: GeneratorContext): boolean => {
    return ctx.data.structs.some((s) => s.name === type);
};

const generateMethods = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    const structMethods = ctx.data.functions.filter((f) => f.original_class === structData.name);

    for (const methodData of structMethods) {
        const config = ctx.config.bindings?.structs?.[structData.name];
        if (config?.methods?.[methodData.name]?.isExcluded) {
            continue;
        }

        const overrideImpl = config?.methods?.[methodData.name]?.overrideImpl;
        if (overrideImpl?.ts) {
            code += overrideImpl.ts.join("");
            continue;
        }

        const comment = generateJsDocComment(methodData);
        const name = methodData.name.slice(structData.name.length + 1);
        const type = getTsType(methodData.return_type.declaration);

        const parameters = getParameters(methodData, true);
        const args = getArguments(methodData, true);

        code += comment;
        code += `    ${name}(${parameters}): ${type} {\n`;

        if (methodData.return_type.declaration === "void") {
            code += `        this.ptr.${methodData.name}(${args});\n`;
        } else {
            code += `        return this.ptr.${methodData.name}(${args});\n`;
        }

        code += `    }\n`;
        code += "\n";
    }

    return code;
};

const generateFields = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    for (const field of structData.fields) {
        const config = ctx.config.bindings?.structs;
        if (config?.[structData.name]?.fields?.[field.name]?.isExcluded) {
            continue;
        }

        const comment = generateJsDocComment(field);
        const name = field.name;
        const type = getTsType(field.type.declaration);

        code += comment;
        code += `    get ${name}(): ${type} {\n`;

        if (isStructType(type, ctx)) {
            code += `        return ${type}.From(this.ptr.get_${name}());\n`;
        } else {
            code += `        return this.ptr.get_${name}();\n`;
        }

        code += `    }\n`;
        code += `    set ${name}(v: ${type}) {\n`;
        code += `        this.ptr.set_${name}(v);\n`;
        code += `    }\n`;
        code += "\n";
    }

    return code;
};

const generateBody = (structData: ImGuiStruct, ctx: GeneratorContext): string => {
    let code = "";

    code += generateFields(structData, ctx);
    code += generateMethods(structData, ctx);

    return code;
};

export const generateStructs = (ctx: GeneratorContext): string => {
    let code = "";

    for (const structData of ctx.data.structs) {
        const config = ctx.config.bindings?.structs;
        if (config?.[structData.name]?.isExcluded) {
            continue;
        }

        const comment = generateJsDocComment(structData);
        const name = structData.name;
        const structBody = config?.[structData.name]?.isOpaque
            ? "\n"
            : generateBody(structData, ctx);

        code += comment;
        code += `export class ${name} extends StructBinding {\n`;
        code += structBody;
        code += `}\n`;
        code += "\n";
    }

    return code;
};
