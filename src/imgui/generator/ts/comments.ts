interface CommentItem {
    comments?: {
        preceding?: string[];
        attached?: string;
    };
}

/**
 * Removes the leading "// " from a comment and escapes slashes so they don't break JsDoc comments.
 */
export function fixCommentforJsDoc(comment: string): string {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
}

/**
 * Creates a comment banner if the item has preceding and attached comments.
 */
function getBanner(item: CommentItem): string {
    if (!item.comments?.preceding || !item.comments?.attached) {
        return "";
    }

    const lines = item.comments.preceding
        .map((line) => {
            return `// ${fixCommentforJsDoc(line.trim())}\n`;
        })
        .join("");

    // biome-ignore format: _
    return (
        "\n" +
        lines +
        "\n"
    );
}

/**
 * Creates a comment body from an item.
 */
function getCommentBody(item: CommentItem): string {
    if (item.comments?.attached) {
        return ` * ${fixCommentforJsDoc(item.comments.attached.trim())}\n`;
    }

    if (item.comments?.preceding) {
        const lines = item.comments.preceding
            .map((line) => {
                return ` * ${fixCommentforJsDoc(line.trim())}\n`;
            })
            .join("");

        return lines;
    }

    return "";
}

/**
 * Creates a JsDoc comment for an item.
 */
export function getJsDocComment(item: CommentItem): string {
    if (!item.comments?.attached && !item.comments?.preceding) {
        return "";
    }

    // biome-ignore format: _
    return (
        getBanner(item) +
        "/**\n" +
        getCommentBody(item) +
        " */\n"
    );
}
