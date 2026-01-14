import type { Column } from "@tanstack/react-table";
import React from "react";

interface ColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
}

/**
 * 列头组件,支持排序功能
 */
export function ColumnHeader<TData, TValue>({
	column,
	title,
}: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div>{title}</div>;
	}

	return (
		<button
			type="button"
			onClick={() => column.toggleSorting()}
			className="flex items-center gap-2 hover:text-gray-700 transition-colors"
		>
			<div>
				<span>{title}</span>
				<span className="text-gray-400">
					{column.getIsSorted() === "asc" ? (
						// 升序图标
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 15l7-7 7 7"
							/>
						</svg>
					) : column.getIsSorted() === "desc" ? (
						// 降序图标
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					) : (
						// 未排序图标
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
							/>
						</svg>
					)}
				</span>
			</div>
		</button>
	);
}
