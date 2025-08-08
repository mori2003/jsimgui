import { readFileSync } from "node:fs";
import { getJsDocComment } from "./comment.ts";
import { getContext } from "./context.ts";
import type { CodeOutput } from "./core.ts";

const typescript = (): string => {
    return getContext().data.defines
        .map((define: any) => {
            if (getContext().config.defines?.exclude?.includes(define.name)) {
                return "";
            }

            const comment = getJsDocComment(define.comments?.attached, define);

            return `${comment}\nexport const ${define.name} = ${define.content};`;
        })
        .join("\n");
};

export const generateDefines = (): CodeOutput => {
    return {
        ts: typescript(),
        cpp: "",
    };
};
