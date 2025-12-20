export interface TypedefConfig {
    isExcluded?: boolean;
    overrideImpl?: {
        ts?: string[];
    };
}

export interface MethodConfig {
    isExcluded?: boolean;
    overrideImpl?: {
        ts?: string[];
        cpp?: string[];
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
            overrideImpl?: {
                ts?: string[];
                cpp?: string[];
            };
        }
    >;
    methods?: Record<string, MethodConfig>;
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
    inputPathJson?: string;
    outputPathTs?: string;
    outputPathCpp?: string;
    outputPathInfo?: string;
    bindings?: {
        typedefs?: Record<string, TypedefConfig>;
        structs?: Record<string, StructConfig>;
        enums?: Record<string, EnumConfig>;
        functions?: Record<string, FunctionConfig>;
    };
}
