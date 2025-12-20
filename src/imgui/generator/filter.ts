import type { ImGuiConditional, ImGuiData } from "./interface.ts";

function isInternalElement(element: any): boolean {
    return element.is_internal;
}

function isObsoleteElement(element: any): boolean {
    if (!element.conditionals) {
        return false;
    }

    return element.conditionals.some(
        (cond: ImGuiConditional): boolean =>
            cond.condition === "ifndef" && cond.expression === "IMGUI_DISABLE_OBSOLETE_FUNCTIONS",
    );
}

/**
 * Filters out elements and subelements from the given data based on the filter function.
 * Used to filter out internal and obsolete elements.
 */
function filterElements(data: any, filterFunction: (element: any) => boolean): any {
    if (Array.isArray(data)) {
        return data
            .map((item) => filterElements(item, filterFunction))
            .filter((item) => item !== null);
    }

    if (data !== null && typeof data === "object") {
        if (filterFunction(data)) {
            return null;
        }

        const newObj = {};

        for (const [key, value] of Object.entries(data)) {
            const filteredValue = filterElements(value, filterFunction);

            if (filteredValue !== null) {
                newObj[key] = filteredValue;
            }
        }
        return newObj;
    }

    return data;
}

/** Filters out internal and obsolete elements from the given ImGui data. */
export function filterSkippables(data: ImGuiData, internal: boolean, obsolete: boolean): ImGuiData {
    let filteredJson = { ...data };

    filteredJson = internal ? filterElements(filteredJson, isInternalElement) : filteredJson;
    filteredJson = obsolete ? filterElements(filteredJson, isObsoleteElement) : filteredJson;

    return filteredJson;
}
