import type { GeneratorContext } from "./main.ts";

interface ConfigItem {
    isExcluded?: boolean;
    overrideImpl?: {
        ts?: string[];
        cpp?: string[];
    };
}

/**
 * Maps the items to code while handling the configuration exclusion and override implementation.
 */
export function getMappedCode<T extends { name: string }>(
    items: T[],
    configMap: Record<string, ConfigItem> | undefined,
    fn: (data: T) => string,
    language: "ts" | "cpp",
) {
    return items
        .map((item) => {
            const itemName = item.name;
            const config = configMap?.[itemName];

            if (config?.isExcluded) {
                return "";
            }

            if (config?.overrideImpl?.[language]) {
                return config.overrideImpl[language].join("");
            }

            return fn(item);
        })
        .join("");
}

/**
 * Checks wether the given declaration is a struct type.
 */
export function isStructType(context: GeneratorContext, declaration: string): boolean {
    return context.data.structs.some((s) => s.name === declaration);
}

/**
 * Converts the given declaration to a TypeScript type.
 */
export function getTsType(declaration: string): string {
    // biome-ignore format: _
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
}
