/**
 * Percent 渲染组件 - 百分比显示
 * 带视觉指示器和颜色渐变
 */

import type { PercentConfig } from "../../types/valueType";
import { getPercentageBgColor } from "../../styles/constants";
import { EmptyState, ErrorBadge, Centered } from "../ui";

interface PercentRenderProps {
	value: unknown;
	config?: PercentConfig;
}

export function PercentRender({ value, config = {} }: PercentRenderProps) {
	const { precision = 2, showSymbol = true, showProgressBar = false } = config;

	// 处理空值
	if (value === null || value === undefined) {
		return <EmptyState />;
	}

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return <ErrorBadge />;
	}

	const percentage = num * 100;
	const formatted = percentage.toFixed(precision);
	const { text: textColor, bg: bgColor } = getPercentageBgColor(percentage);

	// 进度条模式
	if (showProgressBar) {
		return (
			<Centered>
				<div className="flex justify-center items-center gap-2 min-w-40">
					{/* 进度条 */}
					<div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
						<div
							className={`h-full ${bgColor} transition-all duration-300 rounded-full`}
							style={{ width: `${Math.min(percentage, 100)}%` }}
						/>
					</div>

					{/* 百分比文字 */}
					<span
						className={`font-mono text-xs font-semibold tabular-nums ${textColor} min-w-10 text-right`}
					>
						{formatted}
						{showSymbol && <span className="ml-0.5">%</span>}
					</span>
				</div>
			</Centered>
		);
	}

	// 默认显示模式（指示器+文字）
	return (
		<Centered>
			<span className="flex justify-center gap-2">
				{/* 视觉指示器 */}
				<span className="relative flex justify-center">
					<span className={`w-1.5 h-1.5 rounded-full ${bgColor}`} />
					<span
						className={`absolute w-1.5 h-1.5 rounded-full ${bgColor} animate-ping opacity-75`}
					/>
				</span>

				{/* 百分比值 */}
				<span
					className={`font-mono text-sm font-semibold tabular-nums transition-colors duration-200 ${textColor}`}
				>
					{formatted}
					{showSymbol && <span className="text-xs ml-0.5">%</span>}
				</span>
			</span>
		</Centered>
	);
}
