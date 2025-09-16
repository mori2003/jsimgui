interface ExcludeElement {
    is_internal?: boolean;
    conditionals?: {
        condition: string;
        expression: string;
    }[];
}

/**
 * Checks if the given element is an Dear ImGui internal element.
 * @param element - The element to check.
 * @returns True if the element is internal, false otherwise.
 */
export const isInternal = (element: ExcludeElement): boolean => {
    return element.is_internal ?? false;
};

/**
 * Checks if the given element is an obsolete element. We exclude those
 * since we compile the library with `IMGUI_DISABLE_OBSOLETE_FUNCTIONS` defined.
 * @param element - The element to check.
 * @returns True if the element is obsolete, false otherwise.
 */
export const isObsolete = (element: ExcludeElement): boolean => {
    if (!element.conditionals) {
        return false;
    }

    return element.conditionals.some(
        (conditional) =>
            conditional.condition === "ifndef" &&
            conditional.expression === "IMGUI_DISABLE_OBSOLETE_FUNCTIONS",
    );
};

/**
 * Recursively filters an object and its subobjects using a filter function.
 * @param data - The object or array to filter.
 * @param filterFn - A function that returns true if the item should be kept, false if it should be removed.
 * @returns A new object or array with the filtered items.
 */
export const filterRecursive = <T>(data: T, filterFn: (item: ExcludeElement) => boolean): T => {
    if (Array.isArray(data)) {
        return data.filter(filterFn).map((item) => filterRecursive(item, filterFn)) as T;
    }

    if (data && typeof data === "object" && data !== null) {
        if (!filterFn(data)) {
            return null as T;
        }

        return Object.fromEntries(
            Object.entries(data)
                .map(([key, value]) => [key, filterRecursive(value, filterFn)])
                .filter(([_, value]) => value !== null),
        ) as T;
    }

    return data;
};
