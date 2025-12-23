export interface ImGuiData {
    defines: ImGuiDefine[];
    enums: ImGuiEnum[];
    typedefs: ImGuiTypedef[];
    structs: ImGuiStruct[];
    functions: ImGuiFunction[];
}

export interface ImGuiDefine {
    name: string;
    content?: string;
    is_internal: boolean;
    comments?: ImGuiComment;
    conditionals?: ImGuiConditional[];
}

export interface ImGuiEnum {
    name: string;
    original_fully_qualified_name: string;
    is_flags_enum: boolean;
    elements: EnumElement[];
    is_internal: boolean;
    comments?: ImGuiComment;
}

export interface EnumElement {
    name: string;
    value_expression?: string;
    value: number;
    is_count: boolean;
    is_internal: boolean;
    comments?: ImGuiComment;
    conditionals?: ImGuiConditional[];
}

export interface ImGuiTypedef {
    name: string;
    type: TypeDescription;
    comments?: ImGuiComment;
    is_internal: boolean;
    conditionals?: ImGuiConditional[];
}

export interface TypeDescription {
    declaration: string;
    description: {
        kind: string;
        builtin_type?: string;
        name?: string;
        inner_type?: {
            kind: string;
            name: string;
        };
    };
}

export interface ImGuiStruct {
    name: string;
    original_fully_qualified_name: string;
    by_value: boolean;
    forward_declaration: boolean;
    fields: StructField[];
    comments?: ImGuiComment;
    is_internal: boolean;
    conditionals?: ImGuiConditional[];
}

export interface StructField {
    name: string;
    type: TypeDescription;
    comments?: ImGuiComment;
    is_internal: boolean;
    conditionals?: ImGuiConditional[];
}

export interface ImGuiFunction {
    name: string;
    original_fully_qualified_name: string;
    return_type: TypeDescription;
    comments?: ImGuiComment;
    arguments: ImGuiArgument[];
    original_class: string;
}

export interface ImGuiArgument {
    name: string;
    type: TypeDescription;
    default_value?: string;
}

export interface ImGuiComment {
    preceding?: string[];
    attached?: string;
}

export interface ImGuiConditional {
    condition: string;
    expression: string;
}
