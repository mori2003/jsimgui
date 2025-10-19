interface CommentItem {
    comments?: {
        preceding?: string[];
        attached?: string;
    };
}

const fixCommentforJsDoc = (comment: string): string => {
    const newComment = comment.replace(/\//g, "\\/");
    return comment.startsWith("//") ? newComment.slice(5) : newComment;
};

const createBanner = (item: CommentItem): string => {
    if (!item.comments?.preceding || !item.comments?.attached) {
        return "";
    }

    let lines = "";
    lines += "\n";

    for (const line of item.comments.preceding) {
        lines += `// ${fixCommentforJsDoc(line.trim())}\n`;
    }

    lines += "\n";
    return lines;
};

const createComment = (item: CommentItem): string => {
    if (item.comments?.attached) {
        return ` * ${fixCommentforJsDoc(item.comments.attached.trim())}\n`;
    }

    if (item.comments?.preceding) {
        let lines = "";
        for (const line of item.comments.preceding) {
            lines += ` * ${fixCommentforJsDoc(line.trim())}\n`;
        }
        return lines;
    }

    return "";
};

export const generateJsDocComment = (item: CommentItem): string => {
    if (!item.comments?.attached && !item.comments?.preceding) {
        return "";
    }

    let lines = "";
    lines += createBanner(item);
    lines += "/**\n";
    lines += createComment(item);
    lines += " */\n";
    return lines;
};
