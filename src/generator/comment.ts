export type CommentBinding = {
    readonly preceding?: string[];
    readonly attached?: string;
};

function sanitize(text: string): string {
    // Replace all forward slashes with escaped forward slashes to not break
    // JsDoc comments. Also remove the leading "// " if it exists.
    const escaped = text.replaceAll("/", "\\/");
    return escaped.startsWith("//") ? escaped.slice(5) : escaped;
}

function toJsDocLine(text: string): string {
    return ` * ${sanitize(text.trim())}\n`;
}

function getBanner({ preceding, attached }: CommentBinding): string {
    if (!preceding?.length || !attached) return "";

    const banner = preceding.map((line) => `// ${sanitize(line.trim())}\n`).join("");
    return `\n${banner}\n`;
}

function getBody({ preceding, attached }: CommentBinding): string {
    if (attached) return toJsDocLine(attached);

    return preceding?.map(toJsDocLine).join("") ?? "";
}

export function getJsDocComment(comment?: CommentBinding): string {
    if (!comment?.attached && !comment?.preceding?.length) return "";

    return `${getBanner(comment)}/**\n${getBody(comment)} */\n`;
}
