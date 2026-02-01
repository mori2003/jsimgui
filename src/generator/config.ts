export interface TypedefConfig {
    exclude?: boolean;
    override?: {
        ts?: string[];
    };
}

export interface MethodConfig {
    exclude?: boolean;
    override?: {
        ts?: string[];
        cpp?: string[];
    };
}

export interface StructConfig {
    exclude?: boolean;
    opaque?: boolean;
    override?: {
        ts?: string[];
    };
    fields?: Record<
        string,
        {
            name: string;
            exclude: boolean;
            override?: {
                ts?: string[];
                cpp?: string[];
            };
        }
    >;
    methods?: Record<string, MethodConfig>;
}

export interface EnumConfig {
    exclude?: boolean;
    override?: {
        ts?: string[];
    };
}

export interface FunctionConfig {
    exclude?: boolean;
    override?: {
        ts?: string[];
        cpp?: string[];
    };
}

export interface GeneratorConfig {
    typedefs?: Record<string, TypedefConfig>;
    structs?: Record<string, StructConfig>;
    enums?: Record<string, EnumConfig>;
    functions?: Record<string, FunctionConfig>;
}

export interface GeneratorContext {
    config: GeneratorConfig;
}
