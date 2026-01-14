/**
 * Tag 渲染组件 - 标签显示
 * 现代化设计，支持自定义颜色
 */

import type { TagConfig } from "../../types/valueType";

interface TagRenderProps {
	value: unknown;
	config?: TagConfig;
}

export function TagRender({ value, config = {} }: TagRenderProps) {
	const { colorMap = {} } = config;

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	const valueStr = String(value);
	const colorClass = colorMap[valueStr] || "bg-blue-50 text-blue-700";

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent transition-all duration-200 cursor-default hover:scale-105 ${colorClass}`}
		>
			<svg
				className="w-3 h-3 opacity-70"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<title>标签</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
				/>
			</svg>
			<span>{valueStr}</span>
		</span>
	);
}
