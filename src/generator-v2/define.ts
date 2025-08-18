import { getJsDocComment } from "./comment.ts";
import type { ImGuiDefine } from "./interface.ts";
import { type CodeOutput, context } from "./main.ts";

const ts = (): string => {
    return context.data.defines
        .map((define: ImGuiDefine) => {
            if (context.config.defines?.exclude?.includes(define.name)) {
                return "";
            }

            const comment = getJsDocComment(define.comments?.attached, define);
            return `${comment}export const ${define.name} = ${define.content};\n`;
        })
        .join("");
};

export const generateDefines = (): CodeOutput => {
    return {
        ts: ts(),
        cpp: "",
    };
};
