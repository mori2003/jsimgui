export interface TypedefConfig {
    isExcluded?: boolean;
    overrideImpl?: {
        ts?: string[];
    };
}

export interface StructConfig {
    isExcluded?: boolean;
    isOpaque?: boolean;
    fields?: Record<
        string,
        {
            name: string;
            isExcluded: boolean;
        }
    >;
}

export interface EnumConfig {
    isExcluded?: boolean;
}

export interface FunctionConfig {
    isExcluded?: boolean;
    overrideImpl?: {
        ts?: string[];
        cpp?: string[];
    };
}

export interface GeneratorConfig {
    bindings?: {
        typedefs?: Record<string, TypedefConfig>;
        structs?: Record<string, StructConfig>;
        enums?: Record<string, EnumConfig>;
        functions?: Record<string, FunctionConfig>;
    };
}
