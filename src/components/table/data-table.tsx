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
			<div className="overflow-x-auto border border-gray-200 rounded-lg">
				<table className="w-full border-collapse bg-white">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
								{/* 行选择列 */}
								{enableRowSelection && (
									<th className="px-4 py-3 w-12">
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
										className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
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
														className={`flex items-center gap-2 ${
															enableSorting && header.column.getCanSort()
																? "hover:text-gray-700 cursor-pointer"
																: ""
														}`}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{/* 排序图标 */}
														{enableSorting && header.column.getCanSort() && (
															<span className="text-gray-400">
																{header.column.getIsSorted() === "asc" ? (
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
									className="px-4 py-8 text-center"
								>
									{emptyState || (
										<div className="text-gray-500">
											<div className="text-4xl mb-2">📋</div>
											<div>暂无数据</div>
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
										border-b border-gray-200 last:border-b-0
										hover:bg-gray-50 transition-colors
										${enableRowSelection && row.getIsSelected() ? "bg-blue-50" : ""}
										${enableRowSelection || onRowClick ? "cursor-pointer" : ""}
									`}
								>
									{/* 行选择 Checkbox */}
									{enableRowSelection && (
										<td className="px-4 py-3 w-12">
											<Checkbox
												checked={row.getIsSelected()}
												onChange={row.getToggleSelectedHandler()}
											/>
										</td>
									)}

									{/* 数据单元格 */}
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* 分页控件 */}
			{enablePagination && !loading && data.length > 0 && (
				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-700">
							共 {table.getFilteredRowModel().rows.length} 条数据
							{Object.keys(rowSelection).length > 0 && (
								<span className="ml-2 text-blue-600">
									已选择 {Object.keys(rowSelection).length} 条
								</span>
							)}
						</span>
					</div>

					<div className="flex items-center gap-2">
						{/* 跳转首页 */}
						<button
							type="button"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
							className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{"<<"}
						</button>

						{/* 上一页 */}
						<button
							type="button"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{"<"}
						</button>

						{/* 页码显示 */}
						<span className="text-sm text-gray-700">
							第 {table.getState().pagination.pageIndex + 1} 页,共{" "}
							{table.getPageCount()} 页
						</span>

						{/* 下一页 */}
						<button
							type="button"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{">"}
						</button>

						{/* 跳转末页 */}
						<button
							type="button"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
							className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{">>"}
						</button>

						{/* 跳转到指定页 */}
						<span className="flex items-center gap-1 text-sm">
							跳至
							<input
								type="number"
								min="1"
								max={table.getPageCount()}
								defaultValue={table.getState().pagination.pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									table.setPageIndex(page);
								}}
								className="w-16 px-2 py-1 border border-gray-300 rounded"
							/>
							页
						</span>

						{/* 每页条数选择 */}
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="px-2 py-1 border border-gray-300 rounded"
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
