import { context } from "./main.ts";

/**
 * Fixes the comment for JSDoc by replacing "/" with "\/".
 */
const getFixedComment = (comment: string): string => {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
};

/**
 * Generates a JSDoc comment for the given comment and item.
 * @param comment - The comment to generate a JSDoc comment for.
 * @param item - The item to generate a JSDoc comment for.
 * @returns A JSDoc comment for the given comment and item.
 */
export const getJsDocComment = (comment: string | undefined, item: any): string => {
    const url = context.config.sourceLocationUrl ?? "";
    const line = item.source_location?.line ?? 0;
    const filename = item.source_location?.filename ?? "";

    const sourceLocationUrl = `${url}#L${line}`;
    const sourceLocationComment = line <= 1 ? "" : ` * source location: `;
    const fixedComment = comment ? ` * ${getFixedComment(comment)}\n *\n` : "";

    const docComment = [
        `/**\n`,
        fixedComment,
        `${sourceLocationComment} {@link ${sourceLocationUrl} | ${filename}:${line}}\n`,
        ` */\n`,
    ].join("");

    return docComment;
};
