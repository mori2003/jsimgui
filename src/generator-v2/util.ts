interface Exclude {
    is_internal?: boolean;
    conditionals?: {
        condition: string;
        expression: string;
    }[];
}

export const isInternal = (element: Exclude): boolean => {
    return element.is_internal ?? false;
};

export const isObsolete = (element: Exclude): boolean => {
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
export const filterRecursive = <T>(data: T, filterFn: (item: Exclude) => boolean): T => {
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
