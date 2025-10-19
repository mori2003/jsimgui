import { readFileSync } from "node:fs";

export interface TypedefConfig {
    name: string;
    isExcluded: boolean;
}

export interface EnumConfig {
    name: string;
    isExcluded: boolean;
}

export interface GeneratorConfig {
    outputPathTs?: string;
    outputPathCpp?: string;
    outputPathInfo?: string;
    bindings?: {
        typedefs?: EnumConfig[];
        enums?: EnumConfig[];
    };
}

export const loadGeneratorConfig = (path: string): GeneratorConfig => {
    return JSON.parse(readFileSync(path, "utf-8"));
};
