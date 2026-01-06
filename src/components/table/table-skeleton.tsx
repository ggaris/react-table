import React from "react";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	hasSelection?: boolean;
}

/**
 * 表格加载骨架屏组件
 */
export function TableSkeleton({
	rows = 5,
	columns = 4,
	hasSelection = false,
}: TableSkeletonProps) {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
					{/* 选择列骨架 */}
					{hasSelection && (
						<td className="px-4 py-3 w-12">
							<div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
						</td>
					)}

					{/* 数据列骨架 */}
					{Array.from({ length: columns }).map((_, colIndex) => (
						<td key={colIndex} className="px-4 py-3">
							<div
								className="h-4 bg-gray-200 rounded animate-pulse"
								style={{
									width: `${Math.random() * 40 + 60}%`,
								}}
							/>
						</td>
					))}
				</tr>
			))}
		</>
	);
}
