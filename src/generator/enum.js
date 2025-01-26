function trimEnumPrefix(fieldName, enumName) {
    return fieldName.startsWith(enumName) ? fieldName.slice(enumName.length) : fieldName;
}

function normalizeEnumName(name) {
    const normalized = name.endsWith("_") ? name.slice(0, -1) : name;
    return normalized.startsWith("ImGui") ? normalized.slice(5) : normalized;
}

function getEnumCode(enumData) {
    const normalizedName = normalizeEnumName(enumData.name);
    const valueDefinitions = enumData.elements.map((element) => {
        const fieldName = trimEnumPrefix(element.name, enumData.name);
        return `        ${fieldName}: ${element.value}`;
    }).join(",\n");

    return [
        "    /** [Auto] */",
        `    ${normalizedName}: {`,
        valueDefinitions,
        "    },\n",
    ].join("\n");
}

export function generateEnums(jsonData) {
    const enumDefinitions = jsonData.enums.map(getEnumCode).join("");

    return [
        "",
        "/**",
        " * Namespace that provides access to the Enums.",
        " * @namespace {ImEnum}",
        " */",
        "export const ImEnum = {",
        enumDefinitions,
        "};",
        "",
    ].join("\n");
}
