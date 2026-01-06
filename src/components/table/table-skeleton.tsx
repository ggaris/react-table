import React from "react";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	hasSelection?: boolean;
}

/**
 * 表格加载骨架屏组件 - 优化的加载动画
 */
export function TableSkeleton({
	rows = 5,
	columns = 4,
	hasSelection = false,
}: TableSkeletonProps) {
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
						<td className="px-6 py-4 w-16 text-center">
							<div className="inline-block w-4 h-4 bg-gray-200 rounded" />
						</td>
					)}

					{/* 数据列骨架 */}
					{Array.from({ length: columns }).map((_, colIndex) => (
						<td key={colIndex} className="px-6 py-4">
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
