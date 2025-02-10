/**
 * @file Comment functions for the generator.
 */

/** Formats and fixes the comment for JSDoc by removing the leading "//" and
 *  replacing "/" with "\/".
 * @param {string} comment
 * @returns {string}
 */
export function formatComment(comment) {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
}
