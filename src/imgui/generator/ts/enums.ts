import type { ImGuiEnum } from "../interface.ts";
import type { GeneratorContext } from "../main.ts";
import { getMappedCode } from "../util.ts";
import { getJsDocComment } from "./comments.ts";

/**
 * Trims the enum name prefix from the field name.
 * Example: "ImGuiWindowFlags_NoTitleBar" -> "NoTitleBar"
 */
function trimFieldName(field: string, enumName: string): string {
    return field.startsWith(enumName) ? field.slice(enumName.length) : field;
}

/**
 * Trims the "ImGui" prefix and "_" suffix from the enum name.
 * Example: "ImGuiWindowFlags_" -> "WindowFlags"
 */
function trimEnumName(enumName: string): string {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith("ImGui") ? trimmed.slice(5) : trimmed;
}

/**
 * Generates the TypeScript bindings code for the enums.
 */
export function getEnumsCode(context: GeneratorContext): string {
    const enums = context.data.enums;
    const config = context.config.bindings?.enums;

    const fn = (enum_: ImGuiEnum) => {
        const comment = getJsDocComment(enum_);
        const name = trimEnumName(enum_.name);

        const body = enum_.elements
            .map((field) => {
                const fieldComment = getJsDocComment(field);
                const fieldName = trimFieldName(field.name, enum_.name);

                // biome-ignore format: _
                return (
                    fieldComment +
                    `${fieldName}: ${field.value},\n`
                );
            })
            .join("");

        // biome-ignore format: _
        return (
            comment +
            `${name}: {\n` +
            body +
            "},\n" +
            "\n"
        );
    };

    const code = getMappedCode(enums, config, fn, "ts");

    return (
        code +
        // NOTE: Extra FreeTypeLoaderFlags added manually since they are not in dear_bindings data.
        // See: https://github.com/ocornut/imgui/blob/master/misc/freetype/imgui_freetype.h#L29

        "/**\n" +
        " * Hinting greatly impacts visuals (and glyph sizes).\n" +
        " * - By default, hinting is enabled and the font's native hinter is preferred over the auto-hinter.\n" +
        " * - When disabled, FreeType generates blurrier glyphs, more or less matches the stb_truetype.h\n" +
        " * - The Default hinting mode usually looks good, but may distort glyphs in an unusual way.\n" +
        " * - The Light hinting mode generates fuzzier glyphs but better matches Microsoft's rasterizer.\n" +
        " * You can set those flags globally in ImFontAtlas::FontLoaderFlags\n" +
        " * You can set those flags on a per font basis in ImFontConfig::FontLoaderFlags\n" +
        " */\n" +
        "FreeTypeLoaderFlags: {\n" +
        "/**\n" +
        " * Disable hinting. This generally generates 'blurrier' bitmap glyphs when the glyph are rendered in any of the anti-aliased modes.\n" +
        " */\n" +
        "NoHinting: 1,\n" +
        "/**\n" +
        " * Disable auto-hinter.\n" +
        " */\n" +
        "NoAutoHint: 2,\n" +
        "/**\n" +
        " * Indicates that the auto-hinter is preferred over the font's native hinter.\n" +
        " */\n" +
        "ForceAutoHint: 4,\n" +
        "/**\n" +
        " * A lighter hinting algorithm for gray-level modes. Many generated glyphs are fuzzier but better resemble their original shape. This is achieved by snapping glyphs to the pixel grid only vertically (Y-axis), as is done by Microsoft's ClearType and Adobe's proprietary font renderer. This preserves inter-glyph spacing in horizontal text.\n" +
        " */\n" +
        "LightHinting: 8,\n" +
        "/**\n" +
        " * Strong hinting algorithm that should only be used for monochrome output.\n" +
        " */\n" +
        "MonoHinting: 16,\n" +
        "/**\n" +
        " * Styling: Should we artificially embolden the font?\n" +
        " */\n" +
        "Bold: 32,\n" +
        "/**\n" +
        " * Styling: Should we slant the font, emulating italic style?\n" +
        " */\n" +
        "Oblique: 64,\n" +
        "/**\n" +
        " * Disable anti-aliasing. Combine this with MonoHinting for best results!\n" +
        " */\n" +
        "Monochrome: 128,\n" +
        "/**\n" +
        " * Enable FreeType color-layered glyphs\n" +
        " */\n" +
        "LoadColor: 256,\n" +
        "/**\n" +
        " * Enable FreeType bitmap glyphs\n" +
        " */\n" +
        "Bitmap: 512,\n" +
        "},\n"
    );
}
