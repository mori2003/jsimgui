/**
 * @file Filter functions for the generator.
 */

/** Checks if the element is internal. */
function isInternalElement(element) {
    return element.is_internal === true;
}

/** Checks if the element is obsolete. */
function isObsoleteElement(element) {
    if (!element.conditionals) {
        return false;
    }

    return element.conditionals.some((cond) =>
        cond.condition === "ifndef" &&
        cond.expression === "IMGUI_DISABLE_OBSOLETE_FUNCTIONS"
    );
}

/** Filters the elements of the given data. */
function filterElements(
    data,
    filterFunction,
) {
    if (Array.isArray(data)) {
        return data.map((item) => filterElements(item, filterFunction)).filter((
            item,
        ) => item !== null);
    } else if (data !== null && typeof data === "object") {
        if (filterFunction(data)) {
            return null;
        }

        /** @type {{[key: string]: Object}} */
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

/** Filters the skippables of the given data. */
export function filterSkippables(
    jsonData,
    internal,
    obsolete,
) {
    let filteredJson = { ...jsonData };

    filteredJson = internal
        ? filterElements(filteredJson, isInternalElement)
        : filteredJson;
    filteredJson = obsolete
        ? filterElements(filteredJson, isObsoleteElement)
        : filteredJson;

    return filteredJson;
}
