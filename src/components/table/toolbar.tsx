import React from "react";
import type { Table } from "@tanstack/react-table";
import { ColumnVisibility } from "./column-visibility";

export type DensityType = "compact" | "default" | "comfortable";

interface ToolBarProps<TData> {
	table: Table<TData>;
	/** 是否显示列管理 */
	showColumnVisibility?: boolean;
	/** 是否显示密度调整 */
	showDensity?: boolean;
	/** 是否显示刷新按钮 */
	showRefresh?: boolean;
	/** 当前密度 */
	density?: DensityType;
	/** 密度变化回调 */
	onDensityChange?: (density: DensityType) => void;
	/** 刷新回调 */
	onRefresh?: () => void;
}

/**
 * 表格工具栏组件 - 参考 Ant Design ProTable
 */
export function ToolBar<TData>({
	table,
	showColumnVisibility = true,
	showDensity = true,
	showRefresh = true,
	density = "default",
	onDensityChange,
	onRefresh,
}: ToolBarProps<TData>) {
	const [densityOpen, setDensityOpen] = React.useState(false);

	const densityConfig = {
		compact: { label: "紧凑", icon: "compact" },
		default: { label: "默认", icon: "default" },
		comfortable: { label: "宽松", icon: "comfortable" },
	};

	return (
		<div className="flex items-center justify-end gap-2 mb-3">
			{/* 刷新按钮 */}
			{showRefresh && onRefresh && (
				<button
					type="button"
					onClick={onRefresh}
					className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-blue-500"
					title="刷新"
					aria-label="刷新数据"
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</button>
			)}

			{/* 密度调整 */}
			{showDensity && onDensityChange && (
				<div className="relative">
					<button
						type="button"
						onClick={() => setDensityOpen(!densityOpen)}
						className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						title="密度"
						aria-label="调整表格密度"
						aria-expanded={densityOpen}
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
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>

					{/* 密度选择弹窗 */}
					{densityOpen && (
						<>
							<div
								className="fixed inset-0 z-10"
								onClick={() => setDensityOpen(false)}
							/>
							<div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[140px] animate-in fade-in duration-150">
								<div className="text-xs font-semibold text-gray-500 px-3 py-1.5">
									表格密度
								</div>
								{(Object.keys(densityConfig) as DensityType[]).map((key) => (
									<button
										key={key}
										type="button"
										onClick={() => {
											onDensityChange(key);
											setDensityOpen(false);
										}}
										className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 motion-reduce:transition-none flex items-center justify-between ${
											density === key
												? "bg-blue-50 text-blue-600 font-medium"
												: "text-gray-700 hover:bg-gray-50"
										}`}
									>
										<span>{densityConfig[key].label}</span>
										{density === key && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</button>
								))}
							</div>
						</>
					)}
				</div>
			)}

			{/* 列管理 */}
			{showColumnVisibility && <ColumnVisibility table={table} />}
		</div>
	);
}
