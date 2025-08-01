import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingState,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import { type ValueType, ValueTypeRenderer } from './ValueTypeRenderer'

// 扩展 ColumnDef 类型，添加 valueType 支持 - 使用交集类型避免类型冲突
export interface ReactTableColumnDef<TData, TValue = unknown> {
  // TanStack Table 的核心字段 - 使用具体类型而非 any
  id?: string
  accessorKey?: keyof TData
  header?:
    | string
    | React.ReactNode
    | ((context: { column: { id: string } }) => React.ReactNode)
  cell?: (context: { getValue: () => unknown }) => React.ReactNode

  // 我们扩展的字段
  valueType?: ValueType
  valueTypeOptions?: Array<{ label: string; value: TValue }>
}

export interface ReactTableProps<TData> {
  data: TData[]
  columns: ReactTableColumnDef<TData, unknown>[]
  className?: string
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableColumnDragging?: boolean
  enableColumnResizing?: boolean
  enableAutoFitColumns?: boolean
  pageSize?: number
  onColumnOrderChange?: (columnOrder: string[]) => void
  onColumnSizingChange?: (columnSizing: ColumnSizingState) => void
}

// 可拖拽的表头单元格组件
function DraggableTableHeader<TData>({
  header,
  enableSorting,
  enableColumnResizing,
}: {
  header: import('@tanstack/react-table').Header<TData, unknown>
  enableSorting: boolean
  enableColumnResizing: boolean
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    })

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    transform: CSS.Translate.toString(transform),
    transition: 'transform 150ms ease',
    zIndex: isDragging ? 1 : 0,
    width: header.getSize(),
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50 relative"
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
                ? 'cursor-pointer select-none flex items-center flex-1'
                : 'flex items-center flex-1'
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
            {flexRender(header.column.columnDef.header, header.getContext())}
            {enableSorting && header.column.getCanSort() && (
              <span className="ml-2">
                {{
                  asc: '↑',
                  desc: '↓',
                }[header.column.getIsSorted() as string] ?? '↕'}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* 列宽调整手柄 */}
      {enableColumnResizing && header.column.getCanResize() && (
        <div
          {...{
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `resize-handle ${
              header.column.getIsResizing() ? 'is-resizing' : ''
            }`,
          }}
        />
      )}
    </th>
  )
}

// 普通表头单元格组件
function TableHeader<TData>({
  header,
  enableSorting,
  enableColumnResizing,
}: {
  header: import('@tanstack/react-table').Header<TData, unknown>
  enableSorting: boolean
  enableColumnResizing: boolean
}) {
  return (
    <th
      key={header.id}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 relative"
      style={{
        width: header.getSize(),
      }}
    >
      {header.isPlaceholder ? null : (
        <div
          className={
            header.column.getCanSort()
              ? 'cursor-pointer select-none flex items-center'
              : ''
          }
          onClick={header.column.getToggleSortingHandler()}
          onKeyDown={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {enableSorting && header.column.getCanSort() && (
            <span className="ml-2">
              {{
                asc: '↑',
                desc: '↓',
              }[header.column.getIsSorted() as string] ?? '↕'}
            </span>
          )}
        </div>
      )}
      {/* 列宽调整手柄 */}
      {enableColumnResizing && header.column.getCanResize() && (
        <div
          {...{
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `resize-handle ${
              header.column.getIsResizing() ? 'is-resizing' : ''
            }`,
          }}
        />
      )}
    </th>
  )
}

function ReactTable<TData>({
  data,
  columns,
  className = '',
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableColumnDragging = true,
  enableColumnResizing = true,
  enableAutoFitColumns = true,
  pageSize = 10,
  onColumnOrderChange,
  onColumnSizingChange,
}: ReactTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map((column) => column.id || (column.accessorKey as string) || '')
  )
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})

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
  )

  // 为每列计算基于内容的最小宽度
  const columnsWithMinSize = React.useMemo(() => {
    return (columns as ColumnDef<TData, unknown>[]).map((column) => {
      // 计算表头文本的最小宽度
      const headerText = column.header?.toString?.() || column.id || ''
      const minHeaderWidth = Math.max(headerText.length * 8 + 60, 100) // 更紧凑的计算

      return {
        ...column,
        minSize: minHeaderWidth,
        maxSize: 800,
        // 设置初始尺寸为最小尺寸，让内容决定实际宽度
        size: minHeaderWidth,
      }
    })
  }, [columns])

  const table = useReactTable<TData>({
    data,
    columns: columnsWithMinSize,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: 'onChange',
    // 设置默认列属性
    defaultColumn: {
      minSize: 80, // 更紧凑的最小宽度
      maxSize: 300, // 限制最大宽度，避免过宽
      size: 100, // 默认初始宽度
    },
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      pagination: enablePagination ? pagination : undefined,
      columnOrder: enableColumnDragging ? columnOrder : undefined,
      columnSizing: enableColumnResizing ? columnSizing : undefined,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    onColumnOrderChange: enableColumnDragging ? setColumnOrder : undefined,
    onColumnSizingChange: enableColumnResizing
      ? (updater) => {
          const newSizing =
            typeof updater === 'function' ? updater(columnSizing) : updater
          setColumnSizing(newSizing)
          onColumnSizingChange?.(newSizing)
        }
      : undefined,
  })

  // 处理列拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string)
      const newIndex = columnOrder.indexOf(over.id as string)
      const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex)

      setColumnOrder(newColumnOrder)
      onColumnOrderChange?.(newColumnOrder)
    }
  }

  // 一键自适应列宽 - 使用 TanStack Table 内置功能
  const handleAutoFitColumns = React.useCallback(() => {
    const newSizing: ColumnSizingState = {}
    const headers = table.getHeaderGroups()[0]?.headers || []

    for (const header of headers) {
      const columnId = header.column.id
      // 只对没有手动设置宽度的列进行自适应
      if (!columnSizing[columnId]) {
        // 设置为列定义中的最小尺寸，让表格自动调整到合适的宽度
        const columnDef = header.column.columnDef
        newSizing[columnId] = columnDef.minSize || columnDef.size || 100
      }
    }

    // 通过 TanStack Table 的状态管理系统更新列宽
    setColumnSizing((prev) => ({ ...prev, ...newSizing }))
    onColumnSizingChange?.({ ...columnSizing, ...newSizing })
  }, [table, columnSizing, onColumnSizingChange])

  const tableContent = (
    <div className={`paa-table-container ${className}`}>
      {/* 工具栏 */}
      {enableAutoFitColumns && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAutoFitColumns}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            自适应最小宽度
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm"
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
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
                        enableColumnResizing={enableColumnResizing}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  headerGroup.headers.map((header) => (
                    <TableHeader
                      key={header.id}
                      header={header}
                      enableSorting={enableSorting}
                      enableColumnResizing={enableColumnResizing}
                    />
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
                    .columnDef as ReactTableColumnDef<TData>
                  const cellValue = cell.getValue()

                  return (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {column.valueType ? (
                        <ValueTypeRenderer
                          value={cellValue}
                          valueType={column.valueType}
                          options={column.valueTypeOptions}
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  )
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
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              末页
            </button>
          </div>
          <div className="text-sm text-gray-700">
            第 {table.getState().pagination.pageIndex + 1} 页，共{' '}
            {table.getPageCount()} 页 | 总计{' '}
            {table.getFilteredRowModel().rows.length} 条记录
          </div>
        </div>
      )}
    </div>
  )

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
    )
  }

  return tableContent
}

export default ReactTable
