/**
 * Date 渲染组件 - 日期显示
 * 统一的现代化日期显示风格
 */

import type { DateConfig } from "../../types/valueType";

interface DateRenderProps {
	value: unknown;
	config?: DateConfig;
}

export function DateRender({ value, config = {} }: DateRenderProps) {
	const { format = "YYYY-MM-DD" } = config;

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	try {
		const date = new Date(value as string | number | Date);
		if (Number.isNaN(date.getTime())) {
			return (
				<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
					<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<title>错误</title>
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
					</svg>
					<span>无效</span>
				</span>
			);
		}

		// 简单的格式化实现
		const formatted = format
			.replace("YYYY", String(date.getFullYear()))
			.replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
			.replace("DD", String(date.getDate()).padStart(2, "0"));

		return (
			<span className="inline-flex items-center gap-2 px-2 py-1 bg-slate-50 text-slate-700 text-sm rounded-md border border-slate-200 transition-colors duration-200 hover:bg-slate-100">
				<svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>日期</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<span className="font-mono text-xs tabular-nums">{formatted}</span>
			</span>
		);
	} catch {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<title>错误</title>
					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
				</svg>
				<span>无效</span>
			</span>
		);
	}
}
