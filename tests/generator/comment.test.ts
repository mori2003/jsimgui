import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fixCommentforJsDoc, generateJsDocComment } from "../../src/generator/bindings/comment.ts";

describe("fixCommentforJsDoc", () => {
    it("returns empty string", () => {
        const actual = fixCommentforJsDoc("");
        const expected = "";
        assert.strictEqual(actual, expected);
    });

    it("removes comment slashes", () => {
        const actual = fixCommentforJsDoc("// Instantiation of ImVector<ImDrawCmd>");
        const expected = "Instantiation of ImVector<ImDrawCmd>";
        assert.strictEqual(actual, expected);
    });

    it("escapes slashes", () => {
        const actual = fixCommentforJsDoc("// Allow 0123456789.+-*/");
        const expected = "Allow 0123456789.+-*\\/";
        assert.strictEqual(actual, expected);
    });
});

describe("generateJsDocComment", () => {
    it("returns empty string", () => {
        const item = {};

        const actual = generateJsDocComment(item);
        const expected = "";

        assert.strictEqual(actual, expected);
    });

    it("generates preceding comment", () => {
        const item = {
            comments: {
                preceding: ["// Flags for ImGui::Selectable()"],
            },
        };

        const actual = generateJsDocComment(item);
        const expected = "/**\n * Flags for ImGui::Selectable()\n */\n";

        assert.strictEqual(actual, expected);
    });

    it("generates multiline preceding comment", () => {
        const item = {
            comments: {
                preceding: [
                    "// Tooltips mode",
                    "// - typically used in IsItemHovered() + SetTooltip() sequence.",
                ],
            },
        };

        const actual = generateJsDocComment(item);
        const expected = [
            "/**\n",
            " * Tooltips mode\n",
            " * - typically used in IsItemHovered() + SetTooltip() sequence.\n",
            " */\n",
        ].join("");

        assert.strictEqual(actual, expected);
    });

    it("generates attached comment", () => {
        const item = {
            comments: {
                attached: "// Pressing TAB input a '\\t' character into the text field",
            },
        };

        const actual = generateJsDocComment(item);
        const expected = "/**\n * Pressing TAB input a '\\t' character into the text field\n */\n";

        assert.strictEqual(actual, expected);
    });

    it("generates preceding and attached comment", () => {
        const item = {
            comments: {
                preceding: ["// Inputs"],
                attached: "// Pressing TAB input a '\\t' character into the text field",
            },
        };

        const actual = generateJsDocComment(item);
        const expected = [
            "\n",
            "// Inputs\n",
            "\n",
            "/**\n",
            " * Pressing TAB input a '\\t' character into the text field\n",
            " */\n",
        ].join("");

        assert.strictEqual(actual, expected);
    });

    it("generates multiline preceding and attached comment", () => {
        const item = {
            comments: {
                preceding: [
                    "// (Advanced) Mouse Hovering delays.",
                    "// - generally you can use ImGuiHoveredFlags_ForTooltip to use application-standardized flags.",
                    "// - use those if you need specific overrides.",
                ],
                attached:
                    "// Require mouse to be stationary for style.HoverStationaryDelay (~0.15 sec) _at least one time_. After this, can move on same item/window. Using the stationary test tends to reduces the need for a long delay.",
            },
        };

        const actual = generateJsDocComment(item);
        const expected = [
            "\n",
            "// (Advanced) Mouse Hovering delays.\n",
            "// - generally you can use ImGuiHoveredFlags_ForTooltip to use application-standardized flags.\n",
            "// - use those if you need specific overrides.\n",
            "\n",
            "/**\n",
            " * Require mouse to be stationary for style.HoverStationaryDelay (~0.15 sec) _at least one time_. After this, can move on same item\\/window. Using the stationary test tends to reduces the need for a long delay.\n",
            " */\n",
        ].join("");

        assert.strictEqual(actual, expected);
    });
});
