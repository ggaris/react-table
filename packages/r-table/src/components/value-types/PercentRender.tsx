/**
 * Percent 渲染组件 - 百分比显示
 * 带视觉指示器和颜色渐变
 */

import type { PercentConfig } from "../../types/valueType";

interface PercentRenderProps {
	value: unknown;
	config?: PercentConfig;
}

export function PercentRender({ value, config = {} }: PercentRenderProps) {
	const { precision = 2, showSymbol = true, showProgressBar = false } = config;

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

	const percentage = num * 100;
	const formatted = percentage.toFixed(precision);

	// 根据百分比值确定颜色
	const getColor = () => {
		if (percentage >= 80) return "text-emerald-600";
		if (percentage >= 60) return "text-blue-600";
		if (percentage >= 40) return "text-amber-600";
		if (percentage >= 20) return "text-orange-600";
		return "text-red-600";
	};

	// 获取指示器颜色
	const getIndicatorColor = () => {
		if (percentage >= 80) return "bg-emerald-500";
		if (percentage >= 60) return "bg-blue-500";
		if (percentage >= 40) return "bg-amber-500";
		if (percentage >= 20) return "bg-orange-500";
		return "bg-red-500";
	};

	// 获取进度条颜色
	const getProgressBarColor = () => {
		if (percentage >= 80) return "bg-emerald-500";
		if (percentage >= 60) return "bg-blue-500";
		if (percentage >= 40) return "bg-amber-500";
		if (percentage >= 20) return "bg-orange-500";
		return "bg-red-500";
	};

	// 如果显示进度条模式
	if (showProgressBar) {
		return (
			<div className="inline-flex items-center gap-2 min-w-[160px]">
				{/* 进度条 */}
				<div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
					<div
						className={`h-full ${getProgressBarColor()} transition-all duration-300 rounded-full`}
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>

				{/* 百分比文字 */}
				<span className={`font-mono text-xs font-semibold tabular-nums ${getColor()} min-w-[40px] text-right`}>
					{formatted}
					{showSymbol && <span className="ml-0.5">%</span>}
				</span>
			</div>
		);
	}

	// 默认显示模式（指示器+文字）
	return (
		<span className="inline-flex items-center gap-2">
			{/* 视觉指示器 */}
			<span className="relative flex items-center">
				<span className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor()}`} />
				<span className={`absolute w-1.5 h-1.5 rounded-full ${getIndicatorColor()} animate-ping opacity-75`} />
			</span>

			{/* 百分比值 */}
			<span className={`font-mono text-sm font-semibold tabular-nums transition-colors duration-200 ${getColor()}`}>
				{formatted}
				{showSymbol && <span className="text-xs ml-0.5">%</span>}
			</span>
		</span>
	);
}
