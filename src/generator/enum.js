/**
 * @file Enum generation for JavaScript only.
 *
 * Enum names are trimmed for easy access in JavaScript e.g.
 * C++ - ImGuiWindowFlags_NoTitleBar
 * JS - ImEnum.WindowFlags.NoTitleBar
 */

import { formatComment } from "./comment.js";

/**
 * Trims the enum prefix from the given field name like "WindowFlags_NoTitleBar" -> "NoTitleBar".
 * @param {string} fieldName
 * @param {string} enumName
 * @returns {string}
 */
function trimFieldName(fieldName, enumName) {
    return fieldName.startsWith(enumName)
        ? fieldName.slice(enumName.length)
        : fieldName;
}

/**
 * Returns a trimmed enum name by removing the "ImGui" prefix and "_" suffix if present.
 * @param {string} enumName
 * @returns {string}
 */
function trimEnumName(enumName) {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith("ImGui") ? trimmed.slice(5) : trimmed;
}

/**
 * Generates the JavaScript code for a single enum.
 * @param {Object} enumData
 * @returns {string}
 */
function getEnumCode(enumData) {
    const normalizedName = trimEnumName(enumData.name);
    const enumComment = formatComment(enumData.comments?.preceding[0] ?? "");

    let code = "";
    code += `    /** [Auto] ${enumComment} */\n`;
    code += `    ${normalizedName}: {\n`;

    for (const element of enumData.elements) {
        const fieldName = trimFieldName(element.name, enumData.name);

        if (element.comments?.attached) {
            code += `        /** ${
                formatComment(element.comments.attached)
            } */\n`;
        }

        code += `        ${fieldName}: ${element.value},\n`;
    }

    code += "    },\n\n";
    return code;
}

/**
 * Generates the full JavaScript enum code from the given JSON data.
 * @param {Object} jsonData
 * @returns {string}
 */
export function generateEnums(jsonData) {
    let code = "\n";
    code += `/** [Auto] Access to the ImGui enums & flags. */\n`;
    code += `export const ImEnum = Object.freeze({\n`;

    for (const enumData of jsonData.enums) {
        code += getEnumCode(enumData);
    }

    code += "});\n";

    return code;
}
