import React from "react";
import type { Table } from "@tanstack/react-table";

interface ColumnVisibilityProps<TData> {
	table: Table<TData>;
}

/**
 * 列可见性配置组件 - 优化的企业级列管理
 */
export function ColumnVisibility<TData>({ table }: ColumnVisibilityProps<TData>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const visibleCount = table
		.getAllLeafColumns()
		.filter((column) => column.getCanHide() && column.getIsVisible()).length;

	const totalCount = table
		.getAllLeafColumns()
		.filter((column) => column.getCanHide()).length;

	return (
		<div className="relative inline-block">
			{/* 列配置按钮 */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 transition-all duration-150 shadow-sm"
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
						d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
					/>
				</svg>
				<span>列配置</span>
				<span className="text-xs text-gray-500">
					({visibleCount}/{totalCount})
				</span>
			</button>

			{/* 列配置弹出框 */}
			{isOpen && (
				<>
					{/* 遮罩层 */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setIsOpen(false);
							}
						}}
					/>

					{/* 配置面板 */}
					<div className="absolute top-full right-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[240px] animate-in fade-in duration-150">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-bold text-gray-900">显示列</h3>
							<span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
								{visibleCount} / {totalCount}
							</span>
						</div>

						<div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
							{table
								.getAllLeafColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<label
											key={column.id}
											className="flex items-center gap-2.5 cursor-pointer hover:bg-blue-50/50 px-3 py-2 rounded-md transition-colors duration-150 group"
										>
											<input
												type="checkbox"
												checked={column.getIsVisible()}
												onChange={column.getToggleVisibilityHandler()}
												className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded transition-all duration-150 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-blue-500 checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
											/>
											<span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
												{typeof column.columnDef.header === "string"
													? column.columnDef.header
													: column.id}
											</span>
										</label>
									);
								})}
						</div>

						{/* 操作按钮 */}
						<div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
							<button
								type="button"
								onClick={() => table.toggleAllColumnsVisible(true)}
								className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-150"
							>
								全选
							</button>
							<button
								type="button"
								onClick={() => table.toggleAllColumnsVisible(false)}
								className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-150"
							>
								全不选
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
