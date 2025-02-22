import { formatComment } from "./comment.ts";
import type { ImGuiData, ImGuiEnum } from "./interface.js";

function trimFieldName(fieldName: string, enumName: string): string {
    return fieldName.startsWith(enumName) ? fieldName.slice(enumName.length) : fieldName;
}

function trimEnumName(enumName: string): string {
    const trimmed = enumName.endsWith("_") ? enumName.slice(0, -1) : enumName;
    return trimmed.startsWith("ImGui") ? trimmed.slice(5) : trimmed;
}

function getEnumCode(enumData: ImGuiEnum): string {
    const trimmedName = trimEnumName(enumData.name);
    const enumComment = formatComment(enumData.comments?.preceding?.[0]);

    const elementCode = enumData.elements.map((element) => {
        const fieldName = trimFieldName(element.name, enumData.name);
        const fieldComment = formatComment(element.comments?.attached);

        return [
            fieldComment ? `        /** ${fieldComment} */\n` : "",
            `        ${fieldName}: ${element.value},\n`,
        ].join("");
    });

    return [
        enumComment ? `    /** ${enumComment} */\n` : "",
        `    ${trimmedName}: {\n`,
        ...elementCode,
        "    },\n",
        "\n",
    ].join("");
}

/** Generates TypeScript code for the enums and flags in the ImGui data. */
export function generateEnumsTs(jsonData: ImGuiData): string {
    const enumCode = jsonData.enums.map((enumData) => getEnumCode(enumData)).join("");

    return ["    /* Enums/Flags */\n", "\n", ...enumCode].join("");
}
