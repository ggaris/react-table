/**
 * Rating 渲染组件 - 星星评分显示
 * 支持半星和自定义颜色
 */

import type { RatingConfig } from "../../types/valueType";

interface RatingRenderProps {
	value: unknown;
	config?: RatingConfig;
}

export function RatingRender({ value, config = {} }: RatingRenderProps) {
	const { max = 5, showValue = true, color = "text-yellow-400" } = config;

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

	// 确保评分在有效范围内
	const rating = Math.max(0, Math.min(num, max));
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

	// 星星 SVG 路径
	const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.995.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

	return (
		<div className="inline-flex items-center gap-2">
			{/* 星星容器 */}
			<div className="inline-flex items-center gap-0.5">
				{/* 填充星星 */}
				{Array.from({ length: fullStars }).map((_, i) => (
					<svg
						key={`full-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						className={`w-4 h-4 ${color} transition-all duration-200`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<title>星星</title>
						<path d={starPath} />
					</svg>
				))}

				{/* 半星 */}
				{hasHalfStar && (
					<svg
						className={`w-4 h-4 ${color} transition-all duration-200`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<title>半星</title>
						<defs>
							<clipPath id="half-star">
								<rect x="0" y="0" width="10" height="20" />
							</clipPath>
						</defs>
						<path d={starPath} opacity={0.3} />
						<path d={starPath} clipPath="url(#half-star)" />
					</svg>
				)}

				{/* 空星星 */}
				{Array.from({ length: emptyStars }).map((_, i) => (
					<svg
						key={`empty-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						className={`w-4 h-4 ${color} opacity-30 transition-all duration-200`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<title>空星</title>
						<path d={starPath} />
					</svg>
				))}
			</div>

			{/* 数值显示 */}
			{showValue && (
				<span className="text-xs font-medium text-slate-600 tabular-nums">
					{rating.toFixed(1)}
				</span>
			)}
		</div>
	);
}
