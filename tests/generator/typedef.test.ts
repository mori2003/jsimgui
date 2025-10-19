import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tsGenerateTypedefs } from "../../src/generator/bindings/typedef.ts";

describe("tsGenerateTypedefs", () => {
    it("doesn't generate excluded typedefs", () => {
        const ctx = {
            config: {
                bindings: {
                    typedefs: [
                        {
                            name: "ImGuiID",
                            isExcluded: true,
                        },
                    ],
                },
            },
            data: {
                typedefs: [
                    {
                        name: "ImGuiID",
                        type: {
                            declaration: "unsigned int",
                            description: {
                                kind: "Builtin",
                                builtin_type: "unsigned_int",
                            },
                        },
                        comments: {
                            preceding: ["// Scalar data types"],
                            attached:
                                "// A unique ID used by widgets (typically the result of hashing a stack of string)",
                        },
                        is_internal: false,
                        source_location: {
                            filename: "imgui.h",
                        },
                    },
                ],
                enums: [],
                functions: [],
                defines: [],
                structs: [],
            },
        };

        const actual = tsGenerateTypedefs(ctx);
        const expected = "";
        assert.strictEqual(actual, expected);
    });

    it("generates typedef code", () => {
        const ctx = {
            config: {},
            data: {
                typedefs: [
                    {
                        name: "ImGuiID",
                        type: {
                            declaration: "unsigned int",
                            description: {
                                kind: "Builtin",
                                builtin_type: "unsigned_int",
                            },
                        },
                        comments: {
                            preceding: ["// Scalar data types"],
                            attached:
                                "// A unique ID used by widgets (typically the result of hashing a stack of string)",
                        },
                        is_internal: false,
                        source_location: {
                            filename: "imgui.h",
                        },
                    },
                ],
                enums: [],
                functions: [],
                defines: [],
                structs: [],
            },
        };

        const actual = tsGenerateTypedefs(ctx);
        const expected =
            "\n// Scalar data types\n\n/**\n * A unique ID used by widgets (typically the result of hashing a stack of string)\n */\nexport type ImGuiID = number;\n";
        assert.strictEqual(actual, expected);
    });
});
