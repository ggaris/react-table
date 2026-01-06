import React from "react";
import type { Column } from "@tanstack/react-table";

interface ColumnFilterProps<TData, TValue> {
	column: Column<TData, TValue>;
}

/**
 * 列筛选组件,支持文本输入筛选
 */
export function ColumnFilter<TData, TValue>({
	column,
}: ColumnFilterProps<TData, TValue>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const filterValue = (column.getFilterValue() ?? "") as string;

	if (!column.getCanFilter()) {
		return null;
	}

	return (
		<div className="relative inline-block">
			{/* 筛选图标按钮 */}
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className={`p-1 rounded hover:bg-gray-200 transition-colors ${
					filterValue ? "text-blue-600" : "text-gray-400"
				}`}
				title="筛选"
			>
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
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
					/>
				</svg>
			</button>

			{/* 筛选弹出框 */}
			{isOpen && (
				<>
					{/* 遮罩层,点击关闭 */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>

					{/* 筛选输入框 */}
					<div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[200px]">
						<input
							type="text"
							value={filterValue}
							onChange={(e) => column.setFilterValue(e.target.value)}
							placeholder="输入关键词筛选..."
							className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
							onClick={(e) => e.stopPropagation()}
						/>
						{filterValue && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									column.setFilterValue("");
								}}
								className="mt-2 w-full px-2 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
							>
								清除筛选
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
}
