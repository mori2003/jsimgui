import type {
    DearBindingsConditional,
    DearBindingsData,
} from "../generator/provider/dear-bindings.ts";

interface FilterItem {
    is_internal: boolean;
    conditionals?: DearBindingsConditional[];
}

function isInternalItem(element: FilterItem): boolean {
    return element.is_internal;
}

function isObsoleteItem(element: FilterItem): boolean {
    if (!element.conditionals) {
        return false;
    }

    return element.conditionals.some(
        (cond: DearBindingsConditional) =>
            cond.condition === "ifndef" && cond.expression === "IMGUI_DISABLE_OBSOLETE_FUNCTIONS",
    );
}

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

export function filterData(
    data: DearBindingsData,
    internal: boolean,
    obsolete: boolean,
): DearBindingsData {
    let filteredJson = { ...data };

    filteredJson = internal ? filterElements(filteredJson, isInternalItem) : filteredJson;
    filteredJson = obsolete ? filterElements(filteredJson, isObsoleteItem) : filteredJson;

    return filteredJson;
}
