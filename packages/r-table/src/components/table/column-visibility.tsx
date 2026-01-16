import type { Table } from "@tanstack/react-table";
import React from "react";
import { SettingSvg } from "../svg/setting";
import { ToolbarButton, Dropdown } from "../ui";
import {
	CHECKBOX_BASE,
	TRANSITION_COLORS,
	cn,
} from "../../styles/constants";

interface ColumnVisibilityProps<TData> {
	table: Table<TData>;
}

/**
 * 列可见性配置组件 - 优化的企业级列管理
 */
export function ColumnVisibility<TData>({
	table,
}: ColumnVisibilityProps<TData>) {
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
			<ToolbarButton
				icon={<SettingSvg />}
				tooltip="列设置"
				aria-label="管理列可见性"
				aria-expanded={isOpen}
				onClick={() => setIsOpen(!isOpen)}
			/>

			{/* 列配置弹出框 */}
			<Dropdown open={isOpen} onClose={() => setIsOpen(false)} className="p-4 min-w-60">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-bold text-gray-900">显示列</h3>
					<span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
						{visibleCount} / {totalCount}
					</span>
				</div>

				<div className="space-y-1 max-h-75 overflow-y-auto custom-scrollbar">
					{table
						.getAllLeafColumns()
						.filter((column) => column.getCanHide())
						.map((column) => {
							const headerText = typeof column.columnDef.header === "string"
								? column.columnDef.header
								: column.id;

							return (
								<label
									key={column.id}
									className={cn(
										"flex items-center gap-2.5 cursor-pointer hover:bg-blue-50/50 px-3 py-2 rounded-md group",
										TRANSITION_COLORS
									)}
								>
									<input
										type="checkbox"
										checked={column.getIsVisible()}
										onChange={column.getToggleVisibilityHandler()}
										className={CHECKBOX_BASE}
										aria-label={`切换 ${headerText} 列的可见性`}
									/>
									<span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
										{headerText}
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
						className={cn(
							"flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md",
							TRANSITION_COLORS,
							"focus:outline-none focus:ring-2 focus:ring-blue-500"
						)}
						aria-label="全选所有列"
					>
						全选
					</button>
					<button
						type="button"
						onClick={() => table.toggleAllColumnsVisible(false)}
						className={cn(
							"flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md",
							TRANSITION_COLORS,
							"focus:outline-none focus:ring-2 focus:ring-blue-500"
						)}
						aria-label="取消选择所有列"
					>
						全不选
					</button>
				</div>
			</Dropdown>
		</div>
	);
}
