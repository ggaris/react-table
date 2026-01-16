import type { Table } from "@tanstack/react-table";
import React from "react";
import { ColumnVisibility } from "./column-visibility";
import { ToolbarButton, Dropdown, DropdownItem } from "../ui";
import { RefreshIcon, MenuIcon, CheckIcon } from "../ui/icons";

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

// 密度配置
const DENSITY_CONFIG: Record<DensityType, { label: string }> = {
	compact: { label: "紧凑" },
	default: { label: "默认" },
	comfortable: { label: "宽松" },
};

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

	return (
		<div className="flex items-center justify-end gap-2 mb-3">
			{/* 刷新按钮 */}
			{showRefresh && onRefresh && (
				<ToolbarButton
					icon={<RefreshIcon />}
					tooltip="刷新"
					aria-label="刷新数据"
					onClick={onRefresh}
				/>
			)}

			{/* 密度调整 */}
			{showDensity && onDensityChange && (
				<div className="relative">
					<ToolbarButton
						icon={<MenuIcon />}
						tooltip="密度"
						aria-label="调整表格密度"
						aria-expanded={densityOpen}
						onClick={() => setDensityOpen(!densityOpen)}
					/>

					{/* 密度选择弹窗 */}
					<Dropdown
						open={densityOpen}
						onClose={() => setDensityOpen(false)}
						className="p-2 min-w-35"
					>
						<div className="text-xs font-semibold text-gray-500 px-3 py-1.5">
							表格密度
						</div>
						{(Object.keys(DENSITY_CONFIG) as DensityType[]).map((key) => (
							<DropdownItem
								key={key}
								active={density === key}
								onClick={() => {
									onDensityChange(key);
									setDensityOpen(false);
								}}
							>
								<span>{DENSITY_CONFIG[key].label}</span>
								{density === key && <CheckIcon />}
							</DropdownItem>
						))}
					</Dropdown>
				</div>
			)}

			{/* 列管理 */}
			{showColumnVisibility && <ColumnVisibility table={table} />}
		</div>
	);
}
