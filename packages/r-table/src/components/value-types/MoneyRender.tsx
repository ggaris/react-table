/**
 * Money 渲染组件 - 金额显示
 * 优化的现代化设计，使用 Fira Code 字体和高对比度
 */

import type { MoneyConfig } from "../../types/valueType";

interface MoneyRenderProps {
	value: unknown;
	config?: MoneyConfig;
}

export function MoneyRender({ value, config = {} }: MoneyRenderProps) {
	const { symbol = "¥", precision = 2, separator = true } = config;

	// 处理空值
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

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
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

	// 格式化金额
	const formatted = num.toFixed(precision);
	const parts = formatted.split(".");
	const integerPart = separator
		? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		: parts[0];
	const decimalPart = parts[1] ? `.${parts[1]}` : "";

	// 判断正负数以应用不同颜色
	const isNegative = num < 0;
	const isPositive = num > 0;

	return (
		<span
			className={`inline-flex items-baseline gap-0.5 font-mono text-sm font-medium tracking-tight transition-colors duration-200 ${
				isNegative
					? "text-red-600"
					: isPositive
						? "text-slate-900"
						: "text-slate-600"
			}`}
		>
			<span className="text-xs opacity-75">{symbol}</span>
			<span className="tabular-nums">
				{integerPart}
				{decimalPart && (
					<span className="text-xs opacity-60">{decimalPart}</span>
				)}
			</span>
		</span>
	);
}
