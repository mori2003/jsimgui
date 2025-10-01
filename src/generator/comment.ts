/**
 * @deprecated
 * Formats and fixes the comment for JSDoc by removing the leading "//" and
 * replacing "/" with "\/".
 */
export function formatComment(comment?: string): string {
    if (!comment) {
        return "";
    }

    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
}

interface CommentItem {
    comments?: {
        preceding?: string[];
        attached?: string;
    };
}

/**
 * Removes forward slashes from the comment and escapes additional slashes for JSDoc.
 * @param comment - The comment to fix.
 * @returns The fixed comment.
 */
const fixCommentforJsDoc = (comment: string): string => {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
};

/**
 * Creates a comment banner for the given item if it has a preceding and attached comment.
 * @param item - The item to create a comment banner for.
 * @returns A comment banner for the item.
 */
const createBanner = (item: CommentItem): string => {
    if (!item.comments?.preceding || !item.comments?.attached) {
        return "";
    }

    const lines = item.comments.preceding
        .map((line: string) => `// ${fixCommentforJsDoc(line.trim())}\n`)
        .join("");

    return `\n${lines}\n`;
};

/**
 * Creates a comment for the given item. It will either use the attached comment or the preceding
 * comment. If both are provided, the attached comment will be used and the preceding comment will
 * be displayed as a banner before the attached comment, see {@linkcode createBanner}.
 * @param item - The item to create a comment for.
 * @returns A comment for the item.
 */
const createComment = (item: CommentItem): string => {
    if (item.comments?.attached) {
        return ` * ${fixCommentforJsDoc(item.comments.attached.trim())}\n`;
    }

    if (item.comments?.preceding) {
        return item.comments.preceding
            .map((line: string) => ` * ${fixCommentforJsDoc(line.trim())}\n`)
            .join("");
    }

    return "";
};

/**
 * Generates a JSDoc comment for the given comment and item. If both a preceding and attached
 * comment are provided, the preceding comment will be displayed as a banner before the attached
 * comment.
 * @param item - The item to generate a JSDoc comment for.
 * @returns A generated JSDoc comment string for the item.
 */
export const generateJsDocComment = (item: CommentItem): string => {
    if (!item.comments?.attached && !item.comments?.preceding) {
        return "";
    }

    const banner = createBanner(item);
    const comment = createComment(item);

    return [banner, "/**\n", comment, " */\n"].join("");
};
