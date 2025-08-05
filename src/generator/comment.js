export function formatComment(comment) {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
}
