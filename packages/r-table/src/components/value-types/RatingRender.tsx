/**
 * Rating 渲染组件 - 星星评分显示
 * 支持半星和自定义颜色
 */

import type { RatingConfig } from "../../types/valueType";
import { EmptyState, ErrorBadge, Centered } from "../ui";

interface RatingRenderProps {
	value: unknown;
	config?: RatingConfig;
}

// 星星 SVG 路径
const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.995.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

// 星星组件
interface StarProps {
	type: "full" | "half" | "empty";
	color: string;
	index: number;
}

function Star({ type, color, index }: StarProps) {
	const titles = { full: "星星", half: "半星", empty: "空星" };

	if (type === "half") {
		return (
			<svg
				className={`w-4 h-4 ${color} transition-all duration-200`}
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<title>{titles[type]}</title>
				<defs>
					<clipPath id={`half-star-${index}`}>
						<rect x="0" y="0" width="10" height="20" />
					</clipPath>
				</defs>
				<path d={STAR_PATH} opacity={0.3} />
				<path d={STAR_PATH} clipPath={`url(#half-star-${index})`} />
			</svg>
		);
	}

	return (
		<svg
			className={`w-4 h-4 ${color} ${type === "empty" ? "opacity-30" : ""} transition-all duration-200`}
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<title>{titles[type]}</title>
			<path d={STAR_PATH} />
		</svg>
	);
}

export function RatingRender({ value, config = {} }: RatingRenderProps) {
	const { max = 5, showValue = true, color = "text-yellow-400" } = config;

	// 处理空值
	if (value === null || value === undefined) {
		return <EmptyState />;
	}

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return <ErrorBadge />;
	}

	// 确保评分在有效范围内
	const rating = Math.max(0, Math.min(num, max));
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<Centered>
			<div className="inline-flex items-center gap-2">
				{/* 星星容器 */}
				<div className="inline-flex items-center gap-0.5">
					{/* 填充星星 */}
					{Array.from({ length: fullStars }).map((_, i) => (
						<Star key={`full-${i}`} type="full" color={color} index={i} />
					))}

					{/* 半星 */}
					{hasHalfStar && (
						<Star type="half" color={color} index={fullStars} />
					)}

					{/* 空星星 */}
					{Array.from({ length: emptyStars }).map((_, i) => (
						<Star key={`empty-${i}`} type="empty" color={color} index={fullStars + (hasHalfStar ? 1 : 0) + i} />
					))}
				</div>

				{/* 数值显示 */}
				{showValue && (
					<span className="text-xs font-medium text-slate-600 tabular-nums">
						{rating.toFixed(1)}
					</span>
				)}
			</div>
		</Centered>
	);
}
