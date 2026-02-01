import type { EnumBinding } from "../enum.ts";
import type { FunctionBinding } from "../function.ts";
import type { StructBinding } from "../struct.ts";
import type { TypedefBinding } from "../typedef.ts";

interface DearBindingsComment {
    preceding?: string[];
    attached?: string;
}

export interface DearBindingsConditional {
    condition: string;
    expression: string;
}

export interface DearBindingsEnum {
    name: string;
    original_fully_qualified_name: string;
    is_flags_enum: boolean;
    elements: {
        name: string;
        value_expression?: string;
        value: number;
        is_count: boolean;
        is_internal: boolean;
        comments?: DearBindingsComment;
        conditionals?: DearBindingsConditional[];
    }[];
    is_internal: boolean;
    comments?: DearBindingsComment;
}

export interface DearBindingsTypedef {
    name: string;
    type: {
        declaration: string;
    };
    comments?: DearBindingsComment;
}

export interface DearBindingsFunction {
    name: string;
    original_fully_qualified_name: string;
    return_type: {
        declaration: string;
    };
    comments?: DearBindingsComment;
    arguments: {
        name: string;
        type: {
            declaration: string;
        };
        default_value: string;
        array_bounds: number;
    }[];
    original_class: string;
}

export interface DearBindingsStruct {
    name: string;
    original_fully_qualified_name: string;
    by_value: boolean;
    forward_declaration: boolean;
    fields: {
        name: string;
        type: {
            declaration: string;
        };
        comments?: DearBindingsComment;
    }[];
    comments?: DearBindingsComment;
    is_internal: boolean;
    conditionals?: DearBindingsConditional[];
}

export interface DearBindingsData {
    typedefs: DearBindingsTypedef[];
    structs: DearBindingsStruct[];
    enums: DearBindingsEnum[];
    functions: DearBindingsFunction[];
}

export function mapTypedefs(typedefs: DearBindingsTypedef[]): TypedefBinding[] {
    return typedefs.map((typedef) => ({
        name: typedef.name,
        declaration: typedef.type.declaration,
        comments: typedef.comments,
    }));
}

export function mapEnums(enums: DearBindingsEnum[]): EnumBinding[] {
    return enums.map((enum_) => ({
        name: enum_.name,
        fields: enum_.elements.map((field) => ({
            name: field.name,
            value: field.value,
            comments: field.comments,
        })),
        comments: enum_.comments,
    }));
}
export function mapStructs(
    structs: DearBindingsStruct[],
    functions: DearBindingsFunction[],
): StructBinding[] {
    return structs.map((struct) => ({
        name: struct.name,
        //valueType: struct.by_value,
        methods: mapFunctions(
            functions.filter((function_) => function_.name.startsWith(`${struct.name}_`)),
        ),
        fields: struct.fields.map((field) => ({
            name: field.name,
            type: field.type.declaration,
            comments: field.comments,
        })),
        comments: struct.comments,
    }));
}

export function mapFunctions(functions: DearBindingsFunction[]): FunctionBinding[] {
    return functions.map((function_) => ({
        name: function_.name,
        returnType: function_.return_type.declaration,
        arguments: function_.arguments.map((argument) => ({
            name: argument.name,
            type: argument.type?.declaration ?? argument.type ?? "UNKNOWN",
            defaultValue: argument.default_value,
            arrayBounds: argument.array_bounds,
        })),
        comments: function_.comments,
    }));
}
