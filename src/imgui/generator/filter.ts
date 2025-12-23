import type { ImGuiConditional, ImGuiData } from "./interface.ts";

interface FilterItem {
    is_internal: boolean;
    conditionals?: ImGuiConditional[];
}

/**
 * Checks wether the item is internal. These items should ideally not be exposed to the end user,
 * So they can be excluded to reduce file size.
 */
function isInternalItem(element: FilterItem): boolean {
    return element.is_internal;
}

/**
 * Checks wether the item is obsolete. Some ImGui functions are marked as obsolete in the code.
 * Ideally we exclude them to reduce file size.
 */
function isObsoleteItem(element: FilterItem): boolean {
    if (!element.conditionals) {
        return false;
    }

    return element.conditionals.some(
        (cond: ImGuiConditional) =>
            cond.condition === "ifndef" && cond.expression === "IMGUI_DISABLE_OBSOLETE_FUNCTIONS",
    );
}

/**
 * Filters out elements and subelements from the given data based on .
 * Used to filter out internal and obsolete elements.
 */
// biome-ignore lint/suspicious/noExplicitAny: _
function filterElements(data: any, predicate: (element: any) => boolean): any {
    if (Array.isArray(data)) {
        return data.map((item) => filterElements(item, predicate)).filter((item) => item !== null);
    }

    if (data !== null && typeof data === "object") {
        if (predicate(data)) {
            return null;
        }

        const newObj = {};

        for (const [key, value] of Object.entries(data)) {
            const filteredValue = filterElements(value, predicate);

            if (filteredValue !== null) {
                (newObj as Record<string, unknown>)[key] = filteredValue;
            }
        }
        return newObj;
    }

    return data;
}

/**
 * Filters out internal and obsolete items from the ImGui data. We exclude these to reduce
 * file size.
 */
export function filterData(data: ImGuiData, internal: boolean, obsolete: boolean): ImGuiData {
    let filteredJson = { ...data };

    filteredJson = internal ? filterElements(filteredJson, isInternalItem) : filteredJson;
    filteredJson = obsolete ? filterElements(filteredJson, isObsoleteItem) : filteredJson;

    return filteredJson;
}
