import React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
	type PaginationState,
	type ColumnOrderState,
} from "@tanstack/react-table";
import {
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	closestCenter,
	type DragEndEvent,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	useSortable,
	type SortableTransition,
	type Transform,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ValueTypeRenderer, type ValueType } from "./ValueTypeRenderer";

// 扩展 ColumnDef 类型，添加 valueType 支持
export interface PaaColumnDef<TData, TValue = unknown>
	extends ColumnDef<TData, TValue> {
	valueType?: ValueType;
	valueTypeOptions?: Array<{ label: string; value: any }>;
}

export interface PaaTableProps<TData> {
	data: TData[];
	columns: PaaColumnDef<TData>[];
	className?: string;
	enableSorting?: boolean;
	enableFiltering?: boolean;
	enablePagination?: boolean;
	enableColumnDragging?: boolean;
	pageSize?: number;
	onColumnOrderChange?: (columnOrder: string[]) => void;
}

// 可拖拽的表头单元格组件
function DraggableTableHeader({
	header,
	enableSorting,
}: {
	header: any;
	enableSorting: boolean;
}) {
	const { attributes, isDragging, listeners, setNodeRef, transform } =
		useSortable({
			id: header.column.id,
		});

	const style = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative" as const,
		transform: CSS.Translate.toString(transform),
		transition: "transform 150ms ease",
		zIndex: isDragging ? 1 : 0,
	};

	return (
		<th
			ref={setNodeRef}
			style={style}
			className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50"
			{...attributes}
		>
			<div className="flex items-center">
				<div className="flex items-center flex-1" {...listeners}>
					<span className="mr-2 cursor-grab active:cursor-grabbing text-gray-400">
						⋮⋮
					</span>
					<div
						className={
							header.column.getCanSort() && enableSorting
								? "cursor-pointer select-none flex items-center flex-1"
								: "flex items-center flex-1"
						}
						onClick={
							enableSorting
								? header.column.getToggleSortingHandler()
								: undefined
						}
						onKeyDown={
							enableSorting
								? header.column.getToggleSortingHandler()
								: undefined
						}
					>
						{flexRender(
							header.column.columnDef.header,
							header.getContext()
						)}
						{enableSorting && header.column.getCanSort() && (
							<span className="ml-2">
								{{
									asc: "↑",
									desc: "↓",
								}[header.column.getIsSorted() as string] ?? "↕"}
							</span>
						)}
					</div>
				</div>
			</div>
		</th>
	);
}

function PaaTable<TData>({
	data,
	columns,
	className = "",
	enableSorting = true,
	enableFiltering = true,
	enablePagination = true,
	enableColumnDragging = true,
	pageSize = 10,
	onColumnOrderChange,
}: PaaTableProps<TData>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize,
	});
	const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
		columns.map(
			(column) => (column as any).id || (column as any).accessorKey
		)
	);

	// 配置拖拽传感器
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		getFilteredRowModel: enableFiltering
			? getFilteredRowModel()
			: undefined,
		getPaginationRowModel: enablePagination
			? getPaginationRowModel()
			: undefined,
		state: {
			sorting: enableSorting ? sorting : undefined,
			columnFilters: enableFiltering ? columnFilters : undefined,
			pagination: enablePagination ? pagination : undefined,
			columnOrder: enableColumnDragging ? columnOrder : undefined,
		},
		onSortingChange: enableSorting ? setSorting : undefined,
		onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
		onPaginationChange: enablePagination ? setPagination : undefined,
		onColumnOrderChange: enableColumnDragging ? setColumnOrder : undefined,
	});

	// 处理列拖拽结束事件
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = columnOrder.indexOf(active.id as string);
			const newIndex = columnOrder.indexOf(over.id as string);
			const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex);

			setColumnOrder(newColumnOrder);
			onColumnOrderChange?.(newColumnOrder);
		}
	};

	const tableContent = (
		<div className={`paa-table-container ${className}`}>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
					<thead className="bg-gray-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{enableColumnDragging ? (
									<SortableContext
										items={columnOrder}
										strategy={horizontalListSortingStrategy}
									>
										{headerGroup.headers.map((header) => (
											<DraggableTableHeader
												key={header.id}
												header={header}
												enableSorting={enableSorting}
											/>
										))}
									</SortableContext>
								) : (
									headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
										>
											{header.isPlaceholder ? null : (
												<div
													className={
														header.column.getCanSort()
															? "cursor-pointer select-none flex items-center"
															: ""
													}
													onClick={header.column.getToggleSortingHandler()}
													onKeyDown={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
													{enableSorting &&
														header.column.getCanSort() && (
															<span className="ml-2">
																{{
																	asc: "↑",
																	desc: "↓",
																}[
																	header.column.getIsSorted() as string
																] ?? "↕"}
															</span>
														)}
												</div>
											)}
										</th>
									))
								)}
							</tr>
						))}
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="hover:bg-gray-50">
								{row.getVisibleCells().map((cell) => {
									const column = cell.column
										.columnDef as PaaColumnDef<TData>;
									const cellValue = cell.getValue();

									return (
										<td
											key={cell.id}
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{column.valueType ? (
												<ValueTypeRenderer
													value={cellValue}
													valueType={column.valueType}
													options={
														column.valueTypeOptions
													}
												/>
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{enablePagination && (
				<div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
					<div className="flex items-center space-x-2">
						<button
							type="button"
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							首页
						</button>
						<button
							type="button"
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							上一页
						</button>
						<button
							type="button"
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							下一页
						</button>
						<button
							type="button"
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}
							disabled={!table.getCanNextPage()}
						>
							末页
						</button>
					</div>
					<div className="text-sm text-gray-700">
						第 {table.getState().pagination.pageIndex + 1} 页，共{" "}
						{table.getPageCount()} 页 | 总计{" "}
						{table.getFilteredRowModel().rows.length} 条记录
					</div>
				</div>
			)}
		</div>
	);

	// 如果启用列拖拽，用 DndContext 包装
	if (enableColumnDragging) {
		return (
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				{tableContent}
			</DndContext>
		);
	}

	return tableContent;
}

export default PaaTable;
