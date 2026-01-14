/**
 * Text 渲染组件 - 默认文本显示
 */

interface TextRenderProps {
	value: unknown;
}

export function TextRender({ value }: TextRenderProps) {
	if (value === null || value === undefined) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	return (
		<span className="text-slate-900 text-sm transition-colors duration-200">
			{String(value)}
		</span>
	);
}
