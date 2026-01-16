/**
 * Money 渲染组件 - 金额显示
 * 优化的现代化设计，使用 Fira Code 字体和高对比度
 */

import type { MoneyConfig } from "../../types/valueType";
import { EmptyState, ErrorBadge } from "../ui";

interface MoneyRenderProps {
	value: unknown;
	config?: MoneyConfig;
}

export function MoneyRender({ value, config = {} }: MoneyRenderProps) {
	const { symbol = "¥", precision = 3, separator = true } = config;

	// 处理空值
	if (value === null || value === undefined) {
		return <EmptyState align="right" />;
	}

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return <ErrorBadge align="right" />;
	}

	// 格式化金额
	const formatted = num.toFixed(precision);
	const parts = formatted.split(".");
	const integerPart = separator
		? (parts[0] ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		: (parts[0] ?? "0");
	const decimalPart = parts[1] ? `.${parts[1]}` : "";

	// 判断正负数以应用不同颜色
	const isNegative = num < 0;
	const isPositive = num > 0;

	const colorClass = isNegative
		? "text-red-600"
		: isPositive
			? "text-slate-900"
			: "text-slate-600";

	return (
		<div className="flex justify-end">
			<span
				className={`inline-flex items-baseline gap-0.5 font-mono text-sm font-medium tracking-tight transition-colors duration-200 ${colorClass}`}
			>
				<span className="text-xs opacity-75">{symbol}</span>
				<span className="tabular-nums">
					{integerPart}
					{decimalPart && <span className="opacity-70">{decimalPart}</span>}
				</span>
			</span>
		</div>
	);
}
