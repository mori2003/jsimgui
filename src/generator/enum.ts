import { type CommentBinding, getJsDocComment } from "./comment.ts";
import type { GeneratorContext } from "./config.ts";

type EnumField = {
	name: string;
	value: number;
	comments?: CommentBinding;
};

export type EnumBinding = {
	name: string;
	fields: EnumField[];
	comments?: CommentBinding;
};

function trimFieldName(fieldName: string, enumName: string): string {
	return fieldName.startsWith(enumName) ? fieldName.slice(enumName.length) : fieldName;
}

export function getEnumCodeTs(context: GeneratorContext, enum_: EnumBinding): string {
	const config = context.config.enums?.[enum_.name];
	if (config?.exclude) return "";
	if (config?.override?.ts) return config.override.ts.join("");

	const comment = getJsDocComment(enum_.comments);
	const name = enum_.name.endsWith("_") ? enum_.name.slice(0, -1) : enum_.name;

	const fields = enum_.fields
		.map((field) => {
			const fieldComment = getJsDocComment(field.comments);
			const fieldName = trimFieldName(field.name, enum_.name);

			return `${fieldComment}${fieldName}: ${field.value},\n`;
		})
		.join("");

	return `${comment}export const ${name} = {\n${fields}\n} as const;\n`;
}
