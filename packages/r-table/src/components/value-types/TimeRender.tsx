/**
 * Time 渲染组件 - 时间显示
 * 统一的现代化时间显示风格
 */

import type { TimeConfig } from "../../types/valueType";

interface TimeRenderProps {
	value: unknown;
	config?: TimeConfig;
}

export function TimeRender({ value, config = {} }: TimeRenderProps) {
	const { format = "HH:mm:ss" } = config;

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
			.replace("HH", String(date.getHours()).padStart(2, "0"))
			.replace("mm", String(date.getMinutes()).padStart(2, "0"))
			.replace("ss", String(date.getSeconds()).padStart(2, "0"));

		return (
			<span className="inline-flex items-center gap-2 px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md border border-indigo-200 transition-colors duration-200 hover:bg-indigo-100">
				<svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>时间</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
