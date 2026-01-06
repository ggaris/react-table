import React from "react";
import type { DensityType } from "./toolbar";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	hasSelection?: boolean;
	density?: DensityType;
}

/**
 * 表格加载骨架屏组件 - 优化的加载动画
 */
export function TableSkeleton({
	rows = 5,
	columns = 4,
	hasSelection = false,
	density = "default",
}: TableSkeletonProps) {
	const densityPadding = {
		compact: "px-4 py-2",
		default: "px-6 py-4",
		comfortable: "px-8 py-6",
	};

	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<tr
					key={rowIndex}
					className="border-b border-gray-100 last:border-b-0 animate-pulse"
					style={{
						animationDelay: `${rowIndex * 50}ms`,
					}}
				>
					{/* 选择列骨架 */}
					{hasSelection && (
						<td className={`${densityPadding[density]} w-16 text-center`}>
							<div className="inline-block w-4 h-4 bg-gray-200 rounded" />
						</td>
					)}

					{/* 数据列骨架 */}
					{Array.from({ length: columns }).map((_, colIndex) => (
						<td key={colIndex} className={densityPadding[density]}>
							<div className="flex items-center">
								<div
									className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
									style={{
										width: `${Math.random() * 30 + 50}%`,
										backgroundSize: "200% 100%",
										animation: "shimmer 1.5s infinite",
									}}
								/>
							</div>
						</td>
					))}
				</tr>
			))}
			<style>{`
				@keyframes shimmer {
					0% {
						background-position: -200% 0;
					}
					100% {
						background-position: 200% 0;
					}
				}
			`}</style>
		</>
	);
}
