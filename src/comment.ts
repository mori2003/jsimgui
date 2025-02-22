/**
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

export function docComment(comment?: string): string {
    if (!comment) {
        return "";
    }

    return `/** ${comment} */\n`;
}
