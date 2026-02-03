import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { GeneratorConfig, GeneratorContext } from "../generator/config.ts";
import { getEnumCodeTs } from "../generator/enum.ts";
import { getFunctionCodeTs } from "../generator/function.ts";
import { getFunctionCodeCpp } from "../generator/function-cpp.ts";
import {
    type DearBindingsData,
    mapEnums,
    mapFunctions,
    mapStructs,
    mapTypedefs,
} from "../generator/provider/dear-bindings.ts";
import { getStructCodeTs } from "../generator/struct.ts";
import { getStructCodeCpp } from "../generator/struct-cpp.ts";
import { getTypedefCodeTs } from "../generator/typedef.ts";
import { filterData } from "./filter.ts";

function getFreeTypeEnumTs(): string {
    return (
        // NOTE: Extra FreeTypeLoaderFlags added manually since they are not in dear_bindings data.
        // See: https://github.com/ocornut/imgui/blob/master/misc/freetype/imgui_freetype.h#L29
        "FreeTypeLoaderFlags: {\n" +
        "NoHinting: 1,\n" +
        "NoAutoHint: 2,\n" +
        "ForceAutoHint: 4,\n" +
        "LightHinting: 8,\n" +
        "MonoHinting: 16,\n" +
        "Bold: 32,\n" +
        "Oblique: 64,\n" +
        "Monochrome: 128,\n" +
        "LoadColor: 256,\n" +
        "Bitmap: 512,\n" +
        "},\n"
    );
}

function getValueStructsTs(): string {
    return [
        "export class ImVec2 extends ValueStruct {",
        "x: number;",
        "y: number;",
        "constructor(x: number, y: number) {",
        "    super();",
        "    this.x = x;",
        "    this.y = y;",
        "}",
        "static From(obj: { x: number; y: number; }): ImVec2 {",
        "    return new ImVec2(obj.x, obj.y);",
        "}",
        "}",
        "/**",
        " * ImVec4: 4D vector used to store clipping rectangles, colors etc. [Compile-time configurable type]",
        " */",
        "export class ImVec4 extends ValueStruct {",
        "x: number;",
        "y: number;",
        "z: number;",
        "w: number;",
        "constructor(x: number, y: number, z: number, w: number) {",
        "    super();",
        "    this.x = x;",
        "    this.y = y;",
        "    this.z = z;",
        "    this.w = w;",
        "}",
        "static From(obj: { x: number; y: number; z: number; w: number; }): ImVec4 {",
        "    return new ImVec4(obj.x, obj.y, obj.z, obj.w);",
        "}",
        "}",
        "export class ImTextureRef extends ValueStruct {",
        "_TexID: ImTextureID;",
        "constructor(_TexID: ImTextureID) {",
        "    super();",
        "    this._TexID = _TexID;",
        "}",
        "static From(obj: { _TexID: ImTextureID; }): ImTextureRef {",
        "    return new ImTextureRef(obj._TexID);",
        "}",
        "}",
    ].join("\n");
}

function getValueStructsCpp(): string {
    return [
        `emscripten::value_object<ImVec2>("ImVec2")`,
        `.field("x", &ImVec2::x)`,
        `.field("y", &ImVec2::y)`,
        `;`,
        `emscripten::value_object<ImVec4>("ImVec4")`,
        `.field("x", &ImVec4::x)`,
        `.field("y", &ImVec4::y)`,
        `.field("z", &ImVec4::z)`,
        `.field("w", &ImVec4::w)`,
        `;`,
        `emscripten::value_object<ImTextureRef>("ImTextureRef")`,
        `.field("_TexID", &ImTextureRef::_TexID)`,
        `;`,
    ].join("\n");
}

export function generateImGuiBindings(): void {
    const configFile = readFileSync("./src/imgui/config.json", "utf-8");
    const dataFile = readFileSync("./third_party/dear_bindings/dcimgui.json", "utf-8");

    const config = JSON.parse(configFile) as GeneratorConfig;
    const data = filterData(JSON.parse(dataFile), true, true) as DearBindingsData;

    const context: GeneratorContext = { config };

    const typedefs = mapTypedefs(data.typedefs);
    const enums = mapEnums(data.enums);
    const structs = mapStructs(data.structs, data.functions);
    const functions = mapFunctions(data.functions);

    const typedefCodeTs = typedefs.map((typedef) => getTypedefCodeTs(context, typedef)).join("");
    const enumsCodeTs = enums.map((enum_) => getEnumCodeTs(context, enum_, "ImGui")).join("");
    const structsCodeTs = structs.map((struct) => getStructCodeTs(context, struct)).join("");
    const functionsCodeTs = functions
        .filter((function_) => function_.name.startsWith("ImGui_"))
        .map((function_) => getFunctionCodeTs(context, function_, "ImGui_", false))
        .join("");

    const ts = [
        "import { Mod, ValueStruct, ReferenceStruct } from './core.js';\n",
        typedefCodeTs,
        "export type ImWchar = number;\n",
        "const IM_COL32_WHITE = 0xFFFFFFFF;\n",
        "\n",
        getValueStructsTs(),
        structsCodeTs,
        "export const ImGui = {\n",
        enumsCodeTs,
        getFreeTypeEnumTs(),
        functionsCodeTs,
        "};\n",
    ].join("");

    const structsCodeCpp = structs.map((struct) => getStructCodeCpp(context, struct)).join("");
    const functionsCodeCpp = functions
        .filter((function_) => function_.name.startsWith("ImGui_"))
        .map((function_) => getFunctionCodeCpp(context, function_, false))
        .join("");

    const cpp = [
        "#include <util.hpp>\n",
        "\n",
        "#include <dcimgui.h>\n",
        "#include <dcimgui_internal.h>\n",
        "\n",
        "static auto const IMGUI = bindings([]() {\n",
        getValueStructsCpp(),
        "\n",
        structsCodeCpp,
        "\n",
        functionsCodeCpp,
        "});\n",
        "\n",
    ].join("");

    cpSync("./src/imgui/api/ts", "./bindgen/ts", { recursive: true });
    cpSync("./src/imnodes/imnodes.ts", "./bindgen/ts/imnodes.ts");
    mkdirSync("./bindgen/ts", { recursive: true });
    mkdirSync("./bindgen/cpp", { recursive: true });
    writeFileSync("./bindgen/ts/imgui.ts", ts);
    writeFileSync("./bindgen/cpp/imgui.cpp", cpp);
}
