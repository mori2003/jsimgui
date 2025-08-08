import { context } from "./context.ts";

/**
 * Fixes the comment for JSDoc by replacing "/" with "\/".
 */
const getFixedComment = (comment: string): string => {
    return comment.replace(/\//g, "\\/");
};

/**
 * Generates a JSDoc comment for the given comment and item.
 * @param comment - The comment to generate a JSDoc comment for.
 * @param item - The item to generate a JSDoc comment for.
 * @returns A JSDoc comment for the given comment and item.
 */
export const getJsDocComment = (comment: string, item: any): string => {
    const url = context.config.sourceLocationUrl ?? "";
    const line = item.source_location?.line ?? 0;
    const sourceLocationUrl = `${url}#L${item.source_location.line}`;

    const sourceLocationComment = line <= 1 ? "" : ` * source location; `
    
    return "";
};
