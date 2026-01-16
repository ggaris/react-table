/**
 * Digit 渲染组件 - 数字显示
 * 使用等宽字体和千分位分隔符
 */

import { EmptyState, ErrorBadge } from "../ui";

interface DigitRenderProps {
	value: unknown;
}

export function DigitRender({ value }: DigitRenderProps) {
	// 处理空值
	if (value === null || value === undefined) {
		return <EmptyState align="right" />;
	}

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return <ErrorBadge align="right" />;
	}

	// 格式化数字，添加千分位分隔符
	const formatted = num.toLocaleString("zh-CN", {
		maximumFractionDigits: 2,
	});

	// 判断大小以应用不同样式
	const magnitude = Math.abs(num);
	const isMega = magnitude >= 1000000;
	const isKilo = magnitude >= 1000;

	return (
		<div className="flex justify-end">
			<span className="inline-flex items-baseline gap-1">
				<span className="font-mono text-sm font-medium text-slate-900 tabular-nums transition-colors duration-200">
					{formatted}
				</span>
				{isMega && (
					<span className="text-xs text-slate-500 font-medium">M</span>
				)}
				{isKilo && !isMega && (
					<span className="text-xs text-slate-500 font-medium">K</span>
				)}
			</span>
		</div>
	);
}
