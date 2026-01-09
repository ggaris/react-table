import {
	type ColumnDef,
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
import { Checkbox } from "./checkbox";
import { TableSkeleton } from "./table-skeleton";
import { type DensityType, ToolBar } from "./toolbar";

/**
 * DataTable 组件的 Props 类型定义
 */
export interface DataTableProps<TData> {
	/** 表格行的唯一标识字段名 */
	rowKey: keyof TData;
	/** 表格数据 */
	data: TData[];
	/** 列定义 */
	columns: ColumnDef<TData>[];
	/** localStorage 存储的 key,用于持久化列的显示/隐藏配置 */
	storageKey?: string;
	/** 是否显示加载状态 */
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
	/** 刷新回调 */
	onRefresh?: () => void;
}

/**
 * 通用的数据表格组件
 * 基于 @tanstack/react-table 封装,提供完整的表格功能
 */
export function DataTable<TData>({
	rowKey,
	data,
	columns,
	storageKey,
	loading = false,
	enableRowSelection = false,
	enableSorting = true,
	enablePagination = true,
	emptyState,
	onRowClick,
	onSelectionChange,
	initialPageSize = 10,
	pageSizeOptions = [10, 20, 30, 40, 50],
	showToolBar = true,
	onRefresh,
}: DataTableProps<TData>) {
	// 密度状态
	const [density, setDensity] = React.useState<DensityType>("default");

	// 根据密度计算内边距
	const densityPadding = {
		compact: "px-4 py-2",
		default: "px-6 py-4",
		comfortable: "px-8 py-6",
	};

	const densityHeaderPadding = {
		compact: "px-4 py-2",
		default: "px-6 py-4",
		comfortable: "px-8 py-5",
	};
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
		pageSize: initialPageSize,
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

	// 创建表格实例
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			pagination,
		},
		enableRowSelection,
		enableSorting,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		getPaginationRowModel: enablePagination
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

	// 处理行点击 - 同时切换行选择状态
	const handleRowClick = (rowId: string, original: TData) => {
		if (enableRowSelection) {
			table.getRow(rowId).toggleSelected();
		}
		if (onRowClick) {
			onRowClick(original);
		}
	};

	// 处理键盘事件 - 支持 Enter 和 Space 键激活行
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
			{showToolBar && (
				<ToolBar
					table={table}
					showColumnVisibility={!!storageKey}
					showDensity
					showRefresh={!!onRefresh}
					density={density}
					onDensityChange={setDensity}
					onRefresh={onRefresh}
				/>
			)}

			{/* 表格容器 - 支持水平滚动 */}
			<div className="relative overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead className="bg-linear-to-b from-gray-100 to-gray-50/80">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="border-b border-gray-300">
									{/* 行选择列 */}
									{enableRowSelection && (
										<th
											className={`${densityHeaderPadding[density]} w-16 text-center sticky left-0 bg-linear-to-b from-gray-100 to-gray-50/80 z-10`}
										>
											<Checkbox
												checked={table.getIsAllRowsSelected()}
												indeterminate={table.getIsSomeRowsSelected()}
												onChange={(checked) =>
													table.toggleAllRowsSelected(checked)
												}
												ariaLabel="全选"
											/>
										</th>
									)}

									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className={`${densityHeaderPadding[density]} text-left text-xs font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-300`}
										>
											<div className="flex items-center gap-2">
												{/* 列标题 */}
												<div className="flex-1">
													{header.isPlaceholder ? null : (
														<button
															type="button"
															onClick={() => {
																if (
																	enableSorting &&
																	header.column.getCanSort()
																) {
																	header.column.toggleSorting();
																}
															}}
															className={`flex items-center gap-2 transition-colors duration-150 motion-reduce:transition-none ${
																enableSorting && header.column.getCanSort()
																	? "hover:text-gray-900 cursor-pointer group"
																	: ""
															}`}
														>
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
															{/* 排序图标 */}
															{enableSorting && header.column.getCanSort() && (
																<span
																	className={`transition-all duration-200 motion-reduce:transition-none ${
																		header.column.getIsSorted()
																			? "text-blue-600"
																			: "text-gray-400 group-hover:text-gray-600"
																	}`}
																>
																	{header.column.getIsSorted() === "asc" ? (
																		<svg
																			className="w-4 h-4"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<title>升序排序</title>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M5 15l7-7 7 7"
																			/>
																		</svg>
																	) : header.column.getIsSorted() === "desc" ? (
																		<svg
																			className="w-4 h-4"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<title>降序排序</title>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M19 9l-7 7-7-7"
																			/>
																		</svg>
																	) : (
																		<svg
																			className="w-4 h-4"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<title>可排序</title>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
																			/>
																		</svg>
																	)}
																</span>
															)}
														</button>
													)}
												</div>
											</div>
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{loading ? (
								// Loading 骨架屏
								<TableSkeleton<TData>
									rowKey={rowKey}
									rows={pagination.pageSize}
									columns={columns.length}
									hasSelection={enableRowSelection}
									density={density}
								/>
							) : data.length === 0 ? (
								// 空数据状态
								<tr>
									<td
										colSpan={columns.length + (enableRowSelection ? 1 : 0)}
										className="px-6 py-20 text-center"
									>
										{emptyState || (
											<div className="flex flex-col items-center justify-center">
												<div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-1 ring-gray-200/50">
													<svg
														className="w-10 h-10 text-gray-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={1.5}
															d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
												</div>
												<h3 className="text-base font-semibold text-gray-900 mb-2">
													暂无数据
												</h3>
												<p className="text-sm text-gray-500 max-w-sm">
													当前表格中没有可显示的数据,请稍后再试或调整筛选条件
												</p>
											</div>
										)}
									</td>
								</tr>
							) : (
								// 数据行
								table
									.getRowModel()
									.rows.map((row) => (
										<tr
											key={row.id}
											onClick={() => handleRowClick(row.id, row.original)}
											onKeyDown={(e) =>
												handleRowKeyDown(e, row.id, row.original)
											}
											tabIndex={
												enableRowSelection || onRowClick ? 0 : undefined
											}
											role={
												enableRowSelection || onRowClick ? "button" : undefined
											}
											aria-selected={
												enableRowSelection ? row.getIsSelected() : undefined
											}
											className={`
										border-b border-gray-100 last:border-b-0
										transition-all duration-200 motion-reduce:transition-none
										focus:outline-none
										${
											enableRowSelection && row.getIsSelected()
												? "bg-blue-50/80 hover:bg-blue-100/80"
												: "bg-white hover:bg-gray-50"
										}
										${enableRowSelection || onRowClick ? "cursor-pointer" : ""}
									`}
										>
											{/* 行选择 Checkbox */}
											{enableRowSelection && (
												<td
													className={`${densityPadding[density]} w-16 text-center sticky left-0 bg-inherit`}
												>
													<Checkbox
														checked={row.getIsSelected()}
														onChange={(checked) => row.toggleSelected(checked)}
														ariaLabel={`选择第 ${row.index + 1} 行`}
													/>
												</td>
											)}

											{/* 数据单元格 */}
											{row.getVisibleCells().map((cell) => (
												<td
													key={cell.id}
													className={`${densityPadding[density]} text-sm text-gray-900`}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* 分页控件 */}
			{enablePagination && !loading && data.length > 0 && (
				<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
					{/* 信息显示 */}
					<div className="flex flex-wrap items-center gap-3 text-sm">
						<span className="text-gray-600">
							共{" "}
							<span className="font-semibold text-gray-900">
								{table.getFilteredRowModel().rows.length}
							</span>{" "}
							条数据
						</span>
						{Object.keys(rowSelection).length > 0 && (
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								已选 {Object.keys(rowSelection).length} 条
							</span>
						)}
					</div>

					{/* 分页控制 */}
					<div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
						{/* 分页按钮组 */}
						<div className="flex items-center gap-1 order-1">
							<button
								type="button"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 "
								title="首页"
								aria-label="第一页"
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
										d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
									/>
								</svg>
							</button>

							<button
								type="button"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2"
								title="上一页"
								aria-label="上一页"
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
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>

							{/* 页码显示 */}
							<span className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md min-w-25 text-center">
								{table.getState().pagination.pageIndex + 1} /{" "}
								{table.getPageCount()}
							</span>

							<button
								type="button"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 "
								title="下一页"
								aria-label="下一页"
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
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>

							<button
								type="button"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2"
								title="末页"
								aria-label="最后一页"
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
										d="M13 5l7 7-7 7M5 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>

						{/* 跳转页码 */}
						<div className="flex items-center gap-1.5 text-sm order-2 lg:order-3">
							<span className="text-gray-600 hidden sm:inline">跳至</span>
							<input
								type="number"
								min="1"
								max={table.getPageCount()}
								defaultValue={table.getState().pagination.pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									table.setPageIndex(page);
								}}
								className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150 motion-reduce:transition-none"
								aria-label="跳转到指定页码"
							/>
							<span className="text-gray-600 hidden sm:inline">页</span>
						</div>

						{/* 每页条数 */}
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-150 motion-reduce:transition-none cursor-pointer order-3 lg:order-2"
							aria-label="选择每页显示条数"
						>
							{pageSizeOptions.map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize} 条/页
								</option>
							))}
						</select>
					</div>
				</div>
			)}
		</div>
	);
}
