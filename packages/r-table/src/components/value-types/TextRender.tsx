/**
 * Text 渲染组件 - 默认文本显示
 */

import { EmptyState } from "../ui";

interface TextRenderProps {
	value: unknown;
}

export function TextRender({ value }: TextRenderProps) {
	if (value === null || value === undefined) {
		return <EmptyState align="left" />;
	}

	return (
		<span className="text-slate-900 text-sm transition-colors duration-200">
			{String(value)}
		</span>
	);
}
