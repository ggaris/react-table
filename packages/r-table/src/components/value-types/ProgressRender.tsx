/**
 * Progress 渲染组件 - 进度条显示
 * 带平滑动画和渐变效果
 */

import type { ProgressConfig } from "../../types/valueType";

interface ProgressRenderProps {
	value: unknown;
	config?: ProgressConfig;
}

export function ProgressRender({ value, config = {} }: ProgressRenderProps) {
	const { color = "bg-blue-500", showInfo = true } = config;

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

	const progress = Math.max(0, Math.min(100, num));

	// 根据进度值确定颜色
	const getProgressColor = () => {
		if (progress >= 80) return "from-emerald-500 to-emerald-400";
		if (progress >= 60) return "from-blue-500 to-blue-400";
		if (progress >= 40) return "from-amber-500 to-amber-400";
		if (progress >= 20) return "from-orange-500 to-orange-400";
		return "from-red-500 to-red-400";
	};

	const getTextColor = () => {
		if (progress >= 80) return "text-emerald-600";
		if (progress >= 60) return "text-blue-600";
		if (progress >= 40) return "text-amber-600";
		if (progress >= 20) return "text-orange-600";
		return "text-red-600";
	};

	return (
		<div className="flex items-center gap-3 w-full max-w-xs">
			{/* 进度条 */}
			<div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
				<div
					className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
					style={{ width: `${progress}%` }}
				>
					{/* 闪光效果 */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
				</div>
			</div>

			{/* 百分比显示 */}
			{showInfo && (
				<span className={`font-mono text-xs font-semibold tabular-nums min-w-[2.5rem] text-right transition-colors duration-200 ${getTextColor()}`}>
					{progress.toFixed(0)}%
				</span>
			)}

			<style>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}
				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
}
