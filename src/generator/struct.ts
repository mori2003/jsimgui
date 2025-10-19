import { structBindings } from "./bindings.ts";
import { formatComment, generateJsDocComment } from "./bindings/comment.ts";
import { getMethodCodeCpp, getMethodCodeTs } from "./function.ts";
import type { ImGuiData, ImGuiFunction, ImGuiStruct } from "./interface.ts";
import { toTsType } from "./bindings/typedef.ts";

export function isStructBound(structDeclaration: string): boolean {
    return structDeclaration in structBindings;
}

/** Generates TypeScript code for a struct. */
function getStructCodeTs(structData: ImGuiStruct, functions: ImGuiFunction[]): string {
    // const structComment =
    //     structBindings[structData.name]?.override?.comment ??
    //     formatComment(structData.comments?.attached ?? structData.comments?.preceding?.[0]);
    const comment = generateJsDocComment(structData);

    const ctor =
        structBindings[structData.name]?.override?.ctor ??
        `    constructor() { super("${structData.name}"); }\n`;

    let fields = [""];
    if (!structBindings[structData.name]?.opaque) {
        fields = structData.fields.map((field) => {
            if (structBindings[structData.name]?.exclude?.fields?.includes(field.name)) {
                return "";
            }

            const fieldComment = generateJsDocComment(field);
            const type = toTsType(field.type.declaration);

            return [
                fieldComment,
                `    get ${field.name}(): ${type} {`,
                type in structBindings
                    ? ` return ${type}.wrap(this._ptr.get_${field.name}()); `
                    : ` return this._ptr.get_${field.name}(); `,
                "}\n",
                `    set ${field.name}(v: ${type}) {`,
                type in structBindings
                    ? ` this._ptr.set_${field.name}(v._ptr); `
                    : ` this._ptr.set_${field.name}(v); `,
                "}\n",
                "\n",
            ].join("");
        });
    }

    const structMethods = functions.filter((func) => func.original_class === structData.name);

    let methods = [""];
    if (!structBindings[structData.name]?.opaque) {
        methods = structMethods.map((method) => {
            return getMethodCodeTs(method);
        });
    }

    return [
        comment,
        `export class ${structData.name} extends StructBinding {\n`,
        ctor,
        ...fields,
        ...methods,
        "}\n",
        "\n",
    ].join("");
}

/** Generates TypeScript code for the structs in the ImGui data. */
export function generateStructsTs(jsonData: ImGuiData): string {
    const structs = jsonData.structs.filter((struct) => struct.name in structBindings);

    return structs.map((struct) => getStructCodeTs(struct, jsonData.functions)).join("");
}

/** Generates C++ code for a struct. */
function getStructCodeCpp(structData: ImGuiStruct, functions: ImGuiFunction[]): string {
    let fields = [""];
    if (!structBindings[structData.name]?.opaque) {
        fields = structData.fields.map((field) => {
            if (structBindings[structData.name]?.exclude?.fields?.includes(field.name)) {
                return "";
            }

            return [
                `.function("get_${field.name}", override([](const ${structData.name}& self){ return self.${field.name}; }), rvp_ref(), allow_ptr())\n`,
                `.function("set_${field.name}", override([](${structData.name}& self, ${field.type.declaration} value){ self.${field.name} = value; }), allow_ptr())\n`,
            ].join("");
        });
    }

    const structMethods = functions.filter((func) => func.original_class === structData.name);

    let methods = [""];
    if (!structBindings[structData.name]?.opaque) {
        methods = structMethods.map((method) => {
            return getMethodCodeCpp(method);
        });
    }

    return [
        `bind_struct<${structData.name}>("${structData.name}")\n`,
        ".constructor<>()\n",
        ...fields,
        ...methods,
        ";\n",
        "\n",
    ].join("");
}

/** Generates C++ code for the structs in the ImGui data. */
export function generateStructsCpp(jsonData: ImGuiData): string {
    const structs = jsonData.structs.filter((struct) => struct.name in structBindings);

    return structs.map((struct) => getStructCodeCpp(struct, jsonData.functions)).join("");
}
