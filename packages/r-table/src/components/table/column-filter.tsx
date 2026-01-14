import type { Column } from "@tanstack/react-table";
import React from "react";

interface ColumnFilterProps<TData, TValue> {
	column: Column<TData, TValue>;
}

/**
 * 列筛选组件 - 优化的企业级筛选交互
 */
export function ColumnFilter<TData, TValue>({
	column,
}: ColumnFilterProps<TData, TValue>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const filterValue = (column.getFilterValue() ?? "") as string;
	const inputRef = React.useRef<HTMLInputElement>(null);

	// 打开时自动聚焦输入框
	React.useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

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
				className={`p-1.5 rounded-md transition-all duration-150 ${
					filterValue
						? "text-blue-600 bg-blue-50 hover:bg-blue-100"
						: "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
				{filterValue && (
					<span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
				)}
			</button>

			{/* 筛选弹出框 */}
			{isOpen && (
				<>
					{/* 遮罩层,点击关闭 */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setIsOpen(false);
							}
						}}
					/>

					{/* 筛选输入框 */}
					<div className="absolute top-full right-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-55 animate-in fade-in duration-150">
						<div className="space-y-2">
							<label className="block text-xs font-semibold text-gray-700 mb-1">
								筛选条件
							</label>
							<input
								ref={inputRef}
								type="text"
								value={filterValue}
								onChange={(e) => column.setFilterValue(e.target.value)}
								placeholder="输入关键词..."
								className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => {
									e.stopPropagation();
									if (e.key === "Escape") {
										setIsOpen(false);
									}
								}}
							/>
							{filterValue && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										column.setFilterValue("");
										setIsOpen(false);
									}}
									className="w-full px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-150"
								>
									清除筛选
								</button>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
