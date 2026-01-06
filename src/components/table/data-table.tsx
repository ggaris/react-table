import React from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { ColumnFilter } from "./column-filter";
import { TableSkeleton } from "./table-skeleton";
import { ColumnVisibility } from "./column-visibility";

/**
 * DataTable 组件的 Props 类型定义
 */
export interface DataTableProps<TData> {
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
	/** 是否启用筛选功能 */
	enableFiltering?: boolean;
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
}

/**
 * 通用的数据表格组件
 * 基于 @tanstack/react-table 封装,提供完整的表格功能
 */
export function DataTable<TData>({
	data,
	columns,
	storageKey,
	loading = false,
	enableRowSelection = false,
	enableSorting = true,
	enableFiltering = false,
	enablePagination = true,
	emptyState,
	onRowClick,
	onSelectionChange,
	initialPageSize = 10,
	pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData>) {
	// 排序状态
	const [sorting, setSorting] = React.useState<SortingState>([]);

	// 列筛选状态
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	// 列可见性状态 (从 localStorage 恢复)
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
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
				JSON.stringify(columnVisibility)
			);
		}
	}, [columnVisibility, storageKey]);

	// 创建表格实例
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
		enableRowSelection,
		enableSorting,
		enableColumnFilters: enableFiltering,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
	});

	// 当行选择变化时触发回调
	React.useEffect(() => {
		if (onSelectionChange) {
			const selectedRows = table
				.getSelectedRowModel()
				.rows.map((row) => row.original);
			onSelectionChange(selectedRows);
		}
	}, [rowSelection, onSelectionChange, table]);

	// 处理行点击 - 同时切换行选择状态
	const handleRowClick = (rowId: string, original: TData) => {
		if (enableRowSelection) {
			table.getRow(rowId).toggleSelected();
		}
		if (onRowClick) {
			onRowClick(original);
		}
	};

	return (
		<div className="w-full space-y-4">
			{/* 工具栏 */}
			{storageKey && (
				<div className="flex justify-end">
					<ColumnVisibility table={table} />
				</div>
			)}

			{/* 表格容器 - 支持水平滚动 */}
			<div className="relative overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
					<thead className="bg-gradient-to-b from-gray-50 to-gray-100">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b-2 border-gray-300">
								{/* 行选择列 */}
								{enableRowSelection && (
									<th className="px-6 py-4 w-16 text-center sticky left-0 bg-gradient-to-b from-gray-50 to-gray-100">
										<Checkbox
											checked={table.getIsAllRowsSelected()}
											indeterminate={table.getIsSomeRowsSelected()}
											onChange={table.getToggleAllRowsSelectedHandler()}
										/>
									</th>
								)}

								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										colSpan={header.colSpan}
										className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
									>
										<div className="flex items-center gap-2">
											{/* 列标题 */}
											<div className="flex-1">
												{header.isPlaceholder ? null : (
													<button
														type="button"
														onClick={() => {
															if (enableSorting && header.column.getCanSort()) {
																header.column.toggleSorting();
															}
														}}
														className={`flex items-center gap-2 transition-colors duration-150 ${
															enableSorting && header.column.getCanSort()
																? "hover:text-gray-900 cursor-pointer group"
																: ""
														}`}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{/* 排序图标 */}
														{enableSorting && header.column.getCanSort() && (
															<span
																className={`transition-all duration-200 ${
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

											{/* 筛选按钮 */}
											{enableFiltering && header.column.getCanFilter() && (
												<ColumnFilter column={header.column} />
											)}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{loading ? (
							// Loading 骨架屏
							<TableSkeleton
								rows={pagination.pageSize}
								columns={columns.length}
								hasSelection={enableRowSelection}
							/>
						) : data.length === 0 ? (
							// 空数据状态
							<tr>
								<td
									colSpan={columns.length + (enableRowSelection ? 1 : 0)}
									className="px-6 py-16 text-center"
								>
									{emptyState || (
										<div className="flex flex-col items-center justify-center">
											<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
												<svg
													className="w-8 h-8 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
											</div>
											<h3 className="text-base font-semibold text-gray-900 mb-1">
												暂无数据
											</h3>
											<p className="text-sm text-gray-500">
												当前表格中没有可显示的数据
											</p>
										</div>
									)}
								</td>
							</tr>
						) : (
							// 数据行
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									onClick={() => handleRowClick(row.id, row.original)}
									className={`
										border-b border-gray-100 last:border-b-0
										transition-all duration-150 ease-in-out
										${
											enableRowSelection && row.getIsSelected()
												? "bg-blue-50/80 hover:bg-blue-100/80 shadow-inner"
												: "bg-white hover:bg-gray-50/80 hover:shadow-sm"
										}
										${enableRowSelection || onRowClick ? "cursor-pointer active:scale-[0.995]" : ""}
									`}
								>
									{/* 行选择 Checkbox */}
									{enableRowSelection && (
										<td className="px-6 py-4 w-16 text-center sticky left-0 bg-inherit">
											<Checkbox
												checked={row.getIsSelected()}
												onChange={row.getToggleSelectedHandler()}
											/>
										</td>
									)}

									{/* 数据单元格 */}
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
					{/* 信息显示 */}
					<div className="flex items-center gap-4 text-sm">
						<span className="text-gray-600">
							共 <span className="font-semibold text-gray-900">{table.getFilteredRowModel().rows.length}</span> 条数据
						</span>
						{Object.keys(rowSelection).length > 0 && (
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
					<div className="flex flex-wrap items-center gap-2">
						{/* 分页按钮组 */}
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
								title="首页"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
								</svg>
							</button>

							<button
								type="button"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
								title="上一页"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>

							{/* 页码显示 */}
							<span className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md min-w-[100px] text-center">
								{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
							</span>

							<button
								type="button"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
								title="下一页"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>

							<button
								type="button"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
								className="px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-150"
								title="末页"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
								</svg>
							</button>
						</div>

						{/* 跳转页码 */}
						<div className="flex items-center gap-1.5 text-sm">
							<span className="text-gray-600">跳至</span>
							<input
								type="number"
								min="1"
								max={table.getPageCount()}
								defaultValue={table.getState().pagination.pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									table.setPageIndex(page);
								}}
								className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
							/>
							<span className="text-gray-600">页</span>
						</div>

						{/* 每页条数 */}
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-150 cursor-pointer"
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
