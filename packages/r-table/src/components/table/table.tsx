import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import {
	COLUMN_BORDER,
	cn,
	DENSITY_HEADER_PADDING,
	DENSITY_PADDING,
	FIXED_COLUMN_BORDER_LEFT,
	FIXED_COLUMN_BORDER_RIGHT,
	FOCUS_RING,
	getAlignClass,
	getRowBgClasses,
	ROW_BG_COLORS,
	TABLE_CONTAINER,
	TRANSITION_BASE,
} from "../../styles/constants";
import { getDefaultAlign } from "../../types/valueType";
import type { ProColumnDef } from "../../utils/valueType";
import { processValueTypeColumns } from "../../utils/valueType";
import {
	CheckIcon,
	DocumentIcon,
	SortAscIcon,
	SortDescIcon,
	SortIcon,
} from "../ui/icons";
import { Checkbox } from "./checkbox";
import { Pagination } from "./pagination";
import { useTableConfig } from "./table-context";
import { TableSkeleton } from "./table-skeleton";
import { type DensityType, ToolBar } from "./toolbar";

/**
 * DataTable Ref 暴露的方法
 */
export interface DataTableRef<TData = unknown> {
	/** 刷新表格（调用 onRefresh 回调或重新执行 request） */
	refresh: () => void;
	/** 重置行选择 */
	resetSelection: () => void;
	/** 重置分页到第一页 */
	resetPagination: () => void;
	/** 获取当前选中的行数据 */
	getSelectedRows: () => TData[];
	/** 获取当前选中的行ID列表 */
	getSelectedRowIds: () => string[];
	/** 设置页码 */
	setPageIndex: (pageIndex: number) => void;
	/** 设置每页大小 */
	setPageSize: (pageSize: number) => void;
	/** 获取当前页码信息 */
	getPaginationState: () => { pageIndex: number; pageSize: number };
	/** 重新加载数据（request 模式） */
	reload: () => void;
}

/**
 * Request 函数的参数类型
 */
export interface RequestParams {
	/** 当前页码（从1开始） */
	current?: number;
	/** 每页大小 */
	size?: number;
	/** 额外的搜索/筛选参数 */
	[key: string]: any;
}

/**
 * Request 函数的返回结果类型
 */
export interface RequestResult<TData> {
	/** 当前页的数据 */
	data: TData[];
	/** 数据总数 */
	total: number;
	/** 是否成功（可选） */
	success?: boolean;
}

/**
 * DataTable 组件的 Props 类型定义
 */
export interface DataTableProps<TData> {
	/** 表格行的唯一标识字段名 */
	rowKey: keyof TData;
	/** 表格数据（与 request 二选一） */
	data?: TData[];
	/** 异步请求数据函数（与 data 二选一） */
	request?: (params: RequestParams) => Promise<RequestResult<TData>>;
	/** 传递给 request 的额外参数 */
	params?: Record<string, any>;
	/** 列定义 - 支持 valueType */
	columns: ProColumnDef<TData>[];
	/** localStorage 存储的 key,用于持久化列的显示/隐藏配置。如果提供，将自动启用列可见性控制 */
	storageKey?: string;
	/** 是否显示加载状态（data 模式使用） */
	loading?: boolean;
	/** 是否启用行选择功能 */
	enableRowSelection?: boolean;
	/** 是否启用排序功能 */
	enableSorting?: boolean;
	/** 是否启用分页功能 */
	enablePagination?: boolean;
	/** 自定义空数据状态组件 */
	emptyState?: React.ReactNode;
	/** 行点击回调 */
	onRowClick?: (row: TData) => void;
	/** 行选择变化回调 */
	onSelectionChange?: (selectedRows: TData[]) => void;
	/** 初始分页大小 */
	initialPageSize?: number;
	/** 分页大小选项 */
	pageSizeOptions?: number[];
	/** 是否显示工具栏 */
	showToolBar?: boolean;
	/** 刷新回调。如果提供，将自动在工具栏显示刷新按钮（data 模式使用） */
	onRefresh?: () => void;
	/** 是否启用隔行异色 */
	enableStripedRows?: boolean;
	/** 隔行异色的背景色配置 */
	stripedRowColors?: {
		/** 偶数行背景色 */
		even?: string;
		/** 奇数行背景色 */
		odd?: string;
	};
}

// ========== 子组件 ==========

// 排序图标组件
interface SortIndicatorProps {
	isSorted: false | "asc" | "desc";
	canSort: boolean;
}

function SortIndicator({ isSorted, canSort }: SortIndicatorProps) {
	if (!canSort) return null;

	const baseClass = "transition-all duration-200 motion-reduce:transition-none";
	const activeClass = isSorted
		? "text-blue-600"
		: "text-gray-400 group-hover:text-gray-600";

	return (
		<span className={cn(baseClass, activeClass)}>
			{isSorted === "asc" && <SortAscIcon />}
			{isSorted === "desc" && <SortDescIcon />}
			{!isSorted && <SortIcon />}
		</span>
	);
}

// 空状态组件
function EmptyTableState() {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-1 ring-gray-200">
				<DocumentIcon className="w-10 h-10 text-gray-400" />
			</div>
			<h3 className="text-base font-semibold text-gray-900 mb-2">暂无数据</h3>
			<p className="text-sm text-gray-500 max-w-sm">
				当前表格中没有可显示的数据,请稍后再试或调整筛选条件
			</p>
		</div>
	);
}

/**
 * 通用的数据表格组件
 * 基于 @tanstack/react-table 封装,提供完整的表格功能
 */
function DataTableInner<TData>(
	{
		rowKey,
		data: externalData,
		request,
		params,
		columns,
		storageKey,
		loading: externalLoading = false,
		enableRowSelection,
		enableSorting,
		enablePagination,
		emptyState,
		onRowClick,
		onSelectionChange,
		initialPageSize,
		pageSizeOptions,
		showToolBar,
		onRefresh,
		enableStripedRows = false,
		stripedRowColors = { even: ROW_BG_COLORS.even, odd: ROW_BG_COLORS.odd },
	}: DataTableProps<TData>,
	ref: React.Ref<DataTableRef<TData>>,
) {
	// 获取全局配置
	const config = useTableConfig();

	// 使用配置的默认值（优先使用 props，其次使用全局配置）
	const finalEnableRowSelection =
		enableRowSelection ?? config.defaultFeatures.enableRowSelection ?? false;
	const finalEnableSorting =
		enableSorting ?? config.defaultFeatures.enableSorting;
	const finalEnablePagination =
		enablePagination ?? config.defaultFeatures.enablePagination;
	const finalShowToolBar = showToolBar ?? config.defaultFeatures.showToolBar;
	const finalInitialPageSize =
		initialPageSize ?? config.defaultUI.pageSize ?? 10;
	const finalPageSizeOptions = pageSizeOptions ??
		config.defaultUI.pageSizeOptions ?? [10, 20, 30, 40, 50];

	// request 模式的状态
	const [requestData, setRequestData] = React.useState<TData[]>([]);
	const [requestTotal, setRequestTotal] = React.useState(0);
	const [requestLoading, setRequestLoading] = React.useState(false);

	// 处理带有 valueType 的列定义
	const processedColumns = React.useMemo<ProColumnDef<TData>[]>(
		() => processValueTypeColumns(columns),
		[columns],
	);

	// 判断使用哪种模式
	const isRequestMode = !!request;
	const data = isRequestMode ? requestData : externalData || [];
	const loading = isRequestMode ? requestLoading : externalLoading;
	const total = isRequestMode ? requestTotal : data.length;

	// 密度状态
	const [density, setDensity] = React.useState<DensityType>(
		config.defaultUI.density || "default",
	);

	// 排序状态
	const [sorting, setSorting] = React.useState<SortingState>([]);

	// 列可见性状态 (从 localStorage 恢复)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(() => {
			if (storageKey) {
				const saved = localStorage.getItem(`${storageKey}-column-visibility`);
				if (saved) {
					try {
						return JSON.parse(saved);
					} catch (e) {
						console.error("解析列可见性配置失败:", e);
					}
				}
			}
			return {};
		});

	// 行选择状态
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

	// 分页状态
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: finalInitialPageSize,
	});

	// 持久化列可见性到 localStorage
	React.useEffect(() => {
		if (storageKey) {
			localStorage.setItem(
				`${storageKey}-column-visibility`,
				JSON.stringify(columnVisibility),
			);
		}
	}, [columnVisibility, storageKey]);

	// request 模式下的数据获取函数
	const fetchData = React.useCallback(async () => {
		if (!request) return;

		try {
			setRequestLoading(true);
			const paginationKeys = config.paginationKeys;
			const result = await request({
				[paginationKeys.current || "current"]: pagination.pageIndex + 1,
				[paginationKeys.size || "size"]: pagination.pageSize,
				...params,
			});

			if (result.success === false) {
				console.error("数据请求失败");
				setRequestData([]);
				setRequestTotal(0);
			} else {
				const resultData =
					result[paginationKeys.data as keyof typeof result] || result.data;
				const resultTotal =
					result[paginationKeys.total as keyof typeof result] || result.total;
				setRequestData(resultData as TData[]);
				setRequestTotal(resultTotal as number);
			}
		} catch (error) {
			console.error("数据请求异常:", error);
			setRequestData([]);
			setRequestTotal(0);
		} finally {
			setRequestLoading(false);
		}
	}, [
		request,
		pagination.pageIndex,
		pagination.pageSize,
		params,
		config.paginationKeys,
	]);

	// request 模式下，当分页或参数变化时自动加载数据
	React.useEffect(() => {
		if (isRequestMode) {
			fetchData();
		}
	}, [isRequestMode, fetchData]);

	// 创建表格实例
	const table = useReactTable<TData>({
		data,
		columns: processedColumns,
		state: { sorting, columnVisibility, rowSelection, pagination },
		enableRowSelection: finalEnableRowSelection,
		enableSorting: finalEnableSorting,
		getRowId: (row) => String(row[rowKey]),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: finalEnableSorting ? getSortedRowModel() : undefined,
		manualPagination: isRequestMode,
		pageCount: isRequestMode
			? Math.ceil(total / pagination.pageSize)
			: undefined,
		getPaginationRowModel:
			finalEnablePagination && !isRequestMode
				? getPaginationRowModel()
				: undefined,
	});

	// 当行选择变化时触发回调
	React.useEffect(() => {
		if (onSelectionChange) {
			const selectedRows = table
				.getSelectedRowModel()
				.rows.map((row) => row.original);
			onSelectionChange(selectedRows);
		}
	}, [onSelectionChange, table]);

	// 暴露方法给父组件
	React.useImperativeHandle(
		ref,
		() => ({
			refresh: () => {
				if (isRequestMode) {
					fetchData();
				} else if (onRefresh) {
					onRefresh();
				}
			},
			reload: () => {
				if (isRequestMode) {
					fetchData();
				}
			},
			resetSelection: () => setRowSelection({}),
			resetPagination: () =>
				setPagination({ pageIndex: 0, pageSize: finalInitialPageSize }),
			getSelectedRows: () =>
				table.getSelectedRowModel().rows.map((row) => row.original),
			getSelectedRowIds: () => Object.keys(rowSelection),
			setPageIndex: (pageIndex: number) => table.setPageIndex(pageIndex),
			setPageSize: (pageSize: number) => table.setPageSize(pageSize),
			getPaginationState: () => pagination,
		}),
		[
			isRequestMode,
			fetchData,
			onRefresh,
			table,
			rowSelection,
			pagination,
			finalInitialPageSize,
		],
	);

	// 计算固定列的偏移量
	const fixedColumnsInfo = React.useMemo(() => {
		const info = new Map<
			string,
			{ left?: number; right?: number; isFixed: boolean }
		>();
		const checkboxWidth = 64;
		const defaultColumnWidth = 120;

		let leftOffset = finalEnableRowSelection ? checkboxWidth : 0;
		for (const col of processedColumns) {
			const columnDef = col as ProColumnDef<TData>;
			const columnId = (columnDef.id || (columnDef as any).accessorKey) as
				| string
				| undefined;

			if (columnId && columnVisibility[columnId] === false) continue;

			if (columnDef.fixed === "left" && columnId) {
				info.set(columnId, { left: leftOffset, isFixed: true });
				leftOffset += defaultColumnWidth;
			}
		}

		let rightOffset = 0;
		for (let i = processedColumns.length - 1; i >= 0; i--) {
			const columnDef = processedColumns[i] as ProColumnDef<TData>;
			const columnId = (columnDef.id || (columnDef as any).accessorKey) as
				| string
				| undefined;

			if (columnId && columnVisibility[columnId] === false) continue;

			if (columnDef.fixed === "right" && columnId) {
				info.set(columnId, { right: rightOffset, isFixed: true });
				rightOffset += defaultColumnWidth;
			}
		}

		return info;
	}, [processedColumns, finalEnableRowSelection, columnVisibility]);

	// 获取固定列的样式
	const getFixedStyle = React.useCallback(
		(columnId: string | undefined): React.CSSProperties => {
			if (!columnId) return {};
			const fixedInfo = fixedColumnsInfo.get(columnId);
			if (!fixedInfo?.isFixed) return {};

			const style: React.CSSProperties = { position: "sticky", zIndex: 20 };
			if (fixedInfo.left !== undefined) style.left = `${fixedInfo.left}px`;
			if (fixedInfo.right !== undefined) style.right = `${fixedInfo.right}px`;
			return style;
		},
		[fixedColumnsInfo],
	);

	// 获取列的边框类名
	const getColumnBorderClass = React.useCallback(
		(columnId: string | undefined, isLast: boolean): string => {
			if (!columnId || isLast) return "";

			const fixedInfo = fixedColumnsInfo.get(columnId);
			if (fixedInfo?.isFixed) {
				if (fixedInfo.left !== undefined) return FIXED_COLUMN_BORDER_LEFT;
				if (fixedInfo.right !== undefined) return FIXED_COLUMN_BORDER_RIGHT;
			}
			return COLUMN_BORDER;
		},
		[fixedColumnsInfo],
	);

	// 获取行的背景色类名
	const getRowBackgroundClass = React.useCallback(
		(rowIndex: number, isSelected: boolean): string => {
			return getRowBgClasses(isSelected, enableStripedRows, rowIndex);
		},
		[enableStripedRows],
	);

	// 获取单元格背景色
	const getCellBackground = React.useCallback(
		(rowIndex: number, isSelected: boolean): string => {
			if (isSelected) return ROW_BG_COLORS.selected;
			if (enableStripedRows) {
				return rowIndex % 2 === 0
					? stripedRowColors.even || ""
					: stripedRowColors.odd || "";
			}
			return ROW_BG_COLORS.default;
		},
		[enableStripedRows, stripedRowColors],
	);

	// 处理行点击
	const handleRowClick = (rowId: string, original: TData) => {
		if (finalEnableRowSelection) {
			table.getRow(rowId).toggleSelected();
		}
		if (onRowClick) {
			onRowClick(original);
		}
	};

	// 处理键盘事件
	const handleRowKeyDown = (
		e: React.KeyboardEvent,
		rowId: string,
		original: TData,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleRowClick(rowId, original);
		}
	};

	return (
		<div className="w-full space-y-4">
			{/* 工具栏 */}
			{finalShowToolBar && (
				<ToolBar
					table={table}
					showColumnVisibility={!!storageKey}
					showDensity
					showRefresh={isRequestMode || !!onRefresh}
					density={density}
					onDensityChange={setDensity}
					onRefresh={isRequestMode ? fetchData : onRefresh}
				/>
			)}

			{/* 表格容器 */}
			<div className={TABLE_CONTAINER}>
				<div className="overflow-x-auto">
					<table
						className="min-w-full border-collapse table-fixed"
						style={{ width: "max-content" }}
					>
						<thead className="bg-linear-to-b from-gray-100 to-gray-50">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="border-b border-gray-300">
									{/* 行选择列 */}
									{finalEnableRowSelection && (
										<th
											className={cn(
												DENSITY_HEADER_PADDING[density],
												"w-16 text-center sticky left-0 bg-linear-to-b from-gray-100 to-gray-50 bg-white z-10",
												FIXED_COLUMN_BORDER_LEFT.replace(
													"after:bg-gray-300",
													"after:bg-gray-300",
												),
											)}
										>
											<Checkbox
												checked={table.getIsAllPageRowsSelected()}
												indeterminate={
													table.getIsSomePageRowsSelected() &&
													!table.getIsAllPageRowsSelected()
												}
												onChange={(checked) =>
													table.toggleAllPageRowsSelected(checked)
												}
												ariaLabel="全选当前页"
											/>
										</th>
									)}

									{headerGroup.headers.map((header, headerIndex) => {
										const columnDef = header.column
											.columnDef as ProColumnDef<TData>;
										const align =
											columnDef.align || getDefaultAlign(columnDef.valueType);
										const columnId = (columnDef.id ||
											(columnDef as any).accessorKey) as string;
										const fixedStyle = getFixedStyle(columnId);
										const isLast =
											headerIndex === headerGroup.headers.length - 1;
										const borderClass = getColumnBorderClass(columnId, isLast);
										const canSort =
											finalEnableSorting && header.column.getCanSort();

										return (
											<th
												key={header.id}
												colSpan={header.colSpan}
												className={cn(
													DENSITY_HEADER_PADDING[density],
													getAlignClass(align),
													"text-xs font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-200 bg-gray-50 relative",
													borderClass,
												)}
												style={{
													minWidth: "120px",
													backgroundColor: "#f9fafb",
													...fixedStyle,
												}}
											>
												<div className="flex items-center gap-2">
													<div className="flex items-center justify-center flex-1">
														{header.isPlaceholder ? null : (
															<button
																type="button"
																onClick={() =>
																	canSort && header.column.toggleSorting()
																}
																className={cn(
																	"flex items-center gap-2",
																	TRANSITION_BASE,
																	canSort &&
																		"hover:text-gray-900 cursor-pointer group",
																)}
															>
																{flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
																<SortIndicator
																	isSorted={header.column.getIsSorted()}
																	canSort={canSort || false}
																/>
															</button>
														)}
													</div>
												</div>
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{loading ? (
								<TableSkeleton<TData>
									rowKey={rowKey}
									rows={pagination.pageSize}
									columns={columns.length}
									hasSelection={finalEnableRowSelection}
									density={density}
									columnDefs={columns}
								/>
							) : data.length === 0 ? (
								<tr>
									<td
										colSpan={columns.length + (finalEnableRowSelection ? 1 : 0)}
										className="px-10 py-20 text-center"
									>
										{emptyState || <EmptyTableState />}
									</td>
								</tr>
							) : (
								table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										onClick={() => handleRowClick(row.id, row.original)}
										onKeyDown={(e) => handleRowKeyDown(e, row.id, row.original)}
										tabIndex={
											finalEnableRowSelection || onRowClick ? 0 : undefined
										}
										role={
											finalEnableRowSelection || onRowClick
												? "button"
												: undefined
										}
										aria-selected={
											finalEnableRowSelection ? row.getIsSelected() : undefined
										}
										className={cn(
											"border-b border-gray-100 last:border-b-0",
											TRANSITION_BASE,
											"focus:outline-none",
											getRowBackgroundClass(
												row.index,
												finalEnableRowSelection && row.getIsSelected(),
											),
											(finalEnableRowSelection || onRowClick) &&
												"cursor-pointer",
										)}
									>
										{/* 行选择 Checkbox */}
										{finalEnableRowSelection && (
											<td
												className={cn(
													DENSITY_PADDING[density],
													"w-16 text-center sticky left-0 z-10",
													FIXED_COLUMN_BORDER_LEFT.replace(
														"after:bg-gray-300",
														"after:bg-gray-300",
													),
													getCellBackground(row.index, row.getIsSelected()),
												)}
											>
												<Checkbox
													checked={row.getIsSelected()}
													onChange={(checked) => row.toggleSelected(checked)}
													ariaLabel={`选择第 ${row.index + 1} 行`}
												/>
											</td>
										)}

										{/* 数据单元格 */}
										{row.getVisibleCells().map((cell, cellIndex) => {
											const columnDef = cell.column
												.columnDef as ProColumnDef<TData>;
											const align =
												columnDef.align || getDefaultAlign(columnDef.valueType);
											const columnId = (columnDef.id ||
												(columnDef as any).accessorKey) as string;
											const fixedStyle = getFixedStyle(columnId);
											const isLast =
												cellIndex === row.getVisibleCells().length - 1;
											const borderClass = getColumnBorderClass(
												columnId,
												isLast,
											);

											return (
												<td
													key={cell.id}
													className={cn(
														DENSITY_PADDING[density],
														getAlignClass(align),
														"text-sm text-gray-900 relative",
														getCellBackground(row.index, row.getIsSelected()),
														borderClass,
													)}
													style={{
														...fixedStyle,
														minWidth: "120px",
														paddingLeft: "8px",
														paddingRight: "8px",
													}}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											);
										})}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* 分页控件 */}
			{finalEnablePagination && (data.length > 0 || loading) && (
				<Pagination
					table={table}
					total={total}
					selectedCount={Object.keys(rowSelection).length}
					loading={loading}
					pageSizeOptions={finalPageSizeOptions}
				/>
			)}
		</div>
	);
}

// 导出带有泛型支持的组件
export const DataTable = React.forwardRef(DataTableInner) as unknown as <TData>(
	props: DataTableProps<TData> & { ref?: React.Ref<DataTableRef<TData>> },
) => React.ReactElement;
