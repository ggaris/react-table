/**
 * Progress 渲染组件 - 进度条显示
 * 带平滑动画和渐变效果
 */

import type { ProgressConfig } from "../../types/valueType";
import { getProgressGradient } from "../../styles/constants";
import { EmptyState, ErrorBadge, Centered } from "../ui";

interface ProgressRenderProps {
	value: unknown;
	config?: ProgressConfig;
}

export function ProgressRender({ value, config = {} }: ProgressRenderProps) {
	const { showInfo = true, reverseColor = false, gradientThresholds } = config;

	// 处理空值
	if (value === null || value === undefined) {
		return <EmptyState />;
	}

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return <ErrorBadge />;
	}

	const progress = Math.max(0, Math.min(100, num));

	// 获取颜色配置
	let gradient: string;
	let textColor: string;

	if (gradientThresholds && gradientThresholds.length > 0) {
		// 使用自定义渐变色阈值
		const sorted = [...gradientThresholds].sort((a, b) => b.threshold - a.threshold);
		const match = sorted.find(t => progress >= t.threshold);
		if (match) {
			gradient = match.gradient;
			textColor = match.textColor;
		} else if (sorted.length > 0) {
			// 如果没有匹配，使用最后一个（最低阈值）
			const last = sorted[sorted.length - 1]!;
			gradient = last.gradient;
			textColor = last.textColor;
		} else {
			// 降级到默认颜色
			const colors = getProgressGradient(progress, reverseColor);
			gradient = colors.gradient;
			textColor = colors.text;
		}
	} else {
		// 使用默认颜色或反转颜色
		const colors = getProgressGradient(progress, reverseColor);
		gradient = colors.gradient;
		textColor = colors.text;
	}

	return (
		<Centered className="w-full">
			<div className="flex items-center gap-3 w-full max-w-xs">
				{/* 进度条 */}
				<div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
					<div
						className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
						style={{ width: `${progress}%` }}
					>
						{/* 闪光效果 */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
					</div>
				</div>

				{/* 百分比显示 */}
				{showInfo && (
					<span className={`font-mono text-xs font-semibold tabular-nums min-w-[2.5rem] text-right transition-colors duration-200 ${textColor}`}>
						{progress.toFixed(0)}%
					</span>
				)}

				<style>{`
					@keyframes shimmer {
						0% { transform: translateX(-100%); }
						100% { transform: translateX(100%); }
					}
					.animate-shimmer {
						animation: shimmer 2s infinite;
					}
				`}</style>
			</div>
		</Centered>
	);
}
