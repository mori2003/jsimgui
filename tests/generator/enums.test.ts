import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getEnumsCode, trimEnumName, trimFieldName } from "../../src/imgui/generator/ts/enums.ts";

describe(`${trimFieldName.name}`, () => {
    it("trims the enum name prefix from the field name", () => {
        const actual = trimFieldName("ImGuiWindowFlags_NoTitleBar", "ImGuiWindowFlags_");
        const expected = "NoTitleBar";
        assert.strictEqual(actual, expected);
    });
});

describe(`${trimEnumName.name}`, () => {
    it("trims the 'ImGui' prefix and '_' suffix from the enum name", () => {
        const actual = trimEnumName("ImGuiWindowFlags_");
        const expected = "WindowFlags";
        assert.strictEqual(actual, expected);
    });
});

describe(`${getEnumsCode.name}`, () => {
    it("doesn't generate excluded enums", () => {
        const ctx = {
            config: {
                bindings: {
                    enums: {
                        ImGuiWindowFlags_: {
                            isExcluded: true,
                        },
                    },
                },
            },
            data: {
                enums: [
                    {
                        name: "ImGuiWindowFlags_",
                        original_fully_qualified_name: "ImGuiWindowFlags_",
                        is_flags_enum: true,
                        elements: [
                            {
                                name: "ImGuiWindowFlags_None",
                                value_expression: "0",
                                value: 0,
                                is_count: false,
                                is_internal: false,
                                source_location: {
                                    filename: "imgui.h",
                                    line: 1181,
                                },
                            },
                        ],
                        is_internal: false,
                    },
                ],
                functions: [],
                defines: [],
                structs: [],
                typedefs: [],
            },
        };

        const actual = getEnumsCode(ctx);
        const expected = "";
        assert.strictEqual(actual, expected);
    });

    it("generates enum code", () => {
        const ctx = {
            config: {},
            data: {
                enums: [
                    {
                        name: "ImGuiWindowFlags_",
                        original_fully_qualified_name: "ImGuiWindowFlags_",
                        is_flags_enum: true,
                        elements: [
                            {
                                name: "ImGuiWindowFlags_None",
                                value_expression: "0",
                                value: 0,
                                is_count: false,
                                is_internal: false,
                                source_location: {
                                    filename: "imgui.h",
                                    line: 1181,
                                },
                            },
                        ],
                        is_internal: false,
                    },
                ],
                functions: [],
                defines: [],
                structs: [],
                typedefs: [],
            },
        };

        const actual = getEnumsCode(ctx);
        const expected = "WindowFlags: {\nNone: 0,\n},\n";
        assert.strictEqual(actual, expected);
    });
});
