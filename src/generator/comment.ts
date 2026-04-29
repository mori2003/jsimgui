export type CommentBinding = {
  readonly preceding?: string[];
  readonly attached?: string;
};

function sanitize(text: string): string {
  const escaped = text.replaceAll("*/", "* /");
  return escaped.slice(3);
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
