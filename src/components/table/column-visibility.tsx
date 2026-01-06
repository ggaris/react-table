import React from "react";
import type { Table } from "@tanstack/react-table";

interface ColumnVisibilityProps<TData> {
	table: Table<TData>;
}

/**
 * 列可见性配置组件
 */
export function ColumnVisibility<TData>({ table }: ColumnVisibilityProps<TData>) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div className="relative inline-block">
			{/* 列配置按钮 */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
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
				列配置
			</button>

			{/* 列配置弹出框 */}
			{isOpen && (
				<>
					{/* 遮罩层 */}
					<div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

					{/* 配置面板 */}
					<div className="absolute top-full right-0 mt-2 z-20 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[200px]">
						<div className="text-sm font-semibold text-gray-900 mb-3">
							显示列
						</div>

						<div className="space-y-2 max-h-[300px] overflow-y-auto">
							{table
								.getAllLeafColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<label
											key={column.id}
											className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
										>
											<input
												type="checkbox"
												checked={column.getIsVisible()}
												onChange={column.getToggleVisibilityHandler()}
												className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700">
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
								className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
							>
								全选
							</button>
							<button
								type="button"
								onClick={() => table.toggleAllColumnsVisible(false)}
								className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
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
