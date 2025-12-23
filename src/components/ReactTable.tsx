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
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingState,
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
} from '@tanstack/react-table'
import React from 'react'
import {
  ContextMenu,
  type ContextMenuItem,
  useContextMenu,
} from './ContextMenu'
import { EditableCell } from './EditableCell'
import { type ValueType, ValueTypeRenderer } from './ValueTypeRenderer'

// 编辑单元格的输入类型
export type EditInputType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'select'
  | 'textarea'
  | 'checkbox'

// 单元格编辑配置
export interface CellEditConfig<TValue = unknown> {
  // 是否可编辑
  editable?: boolean
  // 输入类型
  inputType?: EditInputType
  // 选择框选项（当 inputType 为 'select' 时使用）
  options?: Array<{ label: string; value: TValue }>
  // 自定义验证函数
  validate?: (value: TValue) => boolean | string
  // 输入提示文本
  placeholder?: string
}

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
  // 编辑配置
  editConfig?: CellEditConfig<TValue>
}

// 功能配置对象
export interface TableFeatures {
  sorting?: boolean
  filtering?: boolean
  pagination?: boolean
  columnDragging?: boolean
  columnResizing?: boolean
  autoFitColumns?: boolean
  contextMenu?: boolean
  rowSelection?: boolean
  rowEditing?: boolean // 行编辑功能
}

// 编辑模式类型
export type EditMode = 'cell' | 'row' // 单元格编辑 | 整行编辑

// 行编辑配置对象
export interface RowEditingConfig<TData = unknown> {
  enabled?: boolean
  // 编辑模式：cell - 单元格编辑（可以只编辑某些单元格），row - 整行编辑
  mode?: EditMode
  // 编辑完成回调 - 整行编辑
  onRowEdit?: (rowData: TData, rowIndex: number) => void | Promise<void>
  // 编辑取消回调
  onEditCancel?: (rowIndex?: number) => void
  // 是否在双击时进入编辑模式
  editOnDoubleClick?: boolean
  // 是否显示编辑按钮（在行上悬停时显示）
  showEditButton?: boolean
}

// 分页配置对象
export interface PaginationConfig {
  pageSize?: number
  // 未来可扩展其他分页配置
}

// 行选择配置对象
export interface RowSelectionConfig<TData = unknown> {
  enabled?: boolean
  multiple?: boolean
  // 行选择回调
  onSelectionChange?: (selectedRows: RowSelectionState) => void
  // 获取行的唯一标识，默认使用行索引
  getRowId?: (row: TData, index: number) => string
}

// 右键菜单配置
export interface ContextMenuConfig {
  header?: {
    enabled?: boolean
    showDefaultColumns?: boolean
    showAllColumns?: boolean
    autoFitColumns?: boolean
    columnVisibility?: boolean
  }
  row?: {
    enabled?: boolean
    items?: <T>(rowData: T, rowIndex: number) => ContextMenuItem[]
  }
}

// 事件回调配置对象
export interface TableCallbacks<TData = unknown> {
  onColumnOrderChange?: (columnOrder: string[]) => void
  onColumnSizingChange?: (columnSizing: ColumnSizingState) => void
  onColumnVisibilityChange?: (columnVisibility: VisibilityState) => void
  // 编辑相关回调
  onCellEdit?: (
    rowData: TData,
    columnId: string,
    newValue: unknown,
    rowIndex: number
  ) => void | Promise<void>
  onRowEditStart?: (rowIndex: number) => void
  onRowEditComplete?: (rowData: TData, rowIndex: number) => void | Promise<void>
  onRowEditCancel?: (rowIndex: number) => void
  // 未来可扩展其他回调函数
}

export interface ReactTableProps<TData> {
  data: TData[]
  columns: ReactTableColumnDef<TData, unknown>[]
  className?: string
  features?: TableFeatures
  pagination?: PaginationConfig
  callbacks?: TableCallbacks<TData>
  contextMenu?: ContextMenuConfig
  rowSelection?: RowSelectionConfig<TData>
  rowEditing?: RowEditingConfig<TData>
  defaultColumnVisibility?: VisibilityState
  // 新增属性：localStorage 的 key，用于保存列可见性状态
  storageKey?: string
  // 新增属性：默认显示的列的 key 数组，如果不传则显示所有列
  defaultVisibleColumns?: string[]
}

// 可拖拽的表头单元格组件
function DraggableTableHeader<TData>({
  header,
  enableSorting,
  enableColumnResizing,
  onContextMenu,
}: {
  header: import('@tanstack/react-table').Header<TData, unknown>
  enableSorting: boolean
  enableColumnResizing: boolean
  onContextMenu?: (
    event: React.MouseEvent,
    headerColumn: Column<TData, unknown>
  ) => void
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
      onContextMenu={(e) => onContextMenu?.(e, header.column)}
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
                  asc: '⬆️',
                  desc: '⬇️',
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
  onContextMenu,
}: {
  header: import('@tanstack/react-table').Header<TData, unknown>
  enableSorting: boolean
  enableColumnResizing: boolean
  onContextMenu?: (
    event: React.MouseEvent,
    headerColumn: Column<TData, unknown>
  ) => void
}) {
  return (
    <th
      key={header.id}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 relative"
      style={{
        width: header.getSize(),
      }}
      onContextMenu={(e) => onContextMenu?.(e, header.column)}
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
  features = {},
  pagination: paginationConfig = {},
  callbacks = {},
  contextMenu: contextMenuConfig = {},
  rowSelection: rowSelectionConfig = {},
  rowEditing: rowEditingConfig = {},
  defaultColumnVisibility = {},
  storageKey,
  defaultVisibleColumns,
}: ReactTableProps<TData>) {
  // 从配置对象中解构参数，设置默认值
  const {
    sorting: enableSorting = true,
    filtering: enableFiltering = true,
    pagination: enablePagination = true,
    columnDragging: enableColumnDragging = true,
    columnResizing: enableColumnResizing = true,
    autoFitColumns: enableAutoFitColumns = true,
    contextMenu: enableContextMenu = true,
    rowSelection: enableRowSelection = false,
    rowEditing: enableRowEditing = false,
  } = features

  const { pageSize = 10 } = paginationConfig
  const {
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onCellEdit,
    onRowEditStart,
    onRowEditComplete,
    onRowEditCancel,
  } = callbacks

  // 行选择配置
  const {
    enabled: rowSelectionEnabled = enableRowSelection,
    multiple: allowMultipleSelection = true,
    onSelectionChange,
    getRowId,
  } = rowSelectionConfig

  // 行编辑配置
  const {
    enabled: rowEditingEnabled = enableRowEditing,
    mode: editMode = 'row',
    onRowEdit,
    onEditCancel,
    editOnDoubleClick = true,
    showEditButton = true,
  } = rowEditingConfig

  // 右键菜单配置
  const {
    header: headerContextMenu = {
      enabled: true,
      showDefaultColumns: true,
      showAllColumns: true,
      autoFitColumns: true,
      columnVisibility: true,
    },
    row: rowContextMenu = { enabled: true },
  } = contextMenuConfig

  // 初始化列可见性状态：从 localStorage 或默认配置取值
  const initializeColumnVisibility = React.useCallback((): VisibilityState => {
    // 如果有 localStorage key，先尝试从本地存储获取
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`paa-table-columns-${storageKey}`)
        if (stored) {
          const parsedVisibility = JSON.parse(stored) as VisibilityState
          return parsedVisibility
        }
      } catch (error) {
        console.warn('读取 localStorage 失败:', error)
      }
    }

    // 如果没有本地存储或读取失败，使用默认配置
    if (defaultVisibleColumns && defaultVisibleColumns.length > 0) {
      const visibility: VisibilityState = {}
      // 获取所有列的 ID
      const allColumnIds = columns.map(
        (column) => column.id || (column.accessorKey as string) || ''
      )

      // 设置所有列为隐藏，只显示指定的列
      for (const columnId of allColumnIds) {
        visibility[columnId] = defaultVisibleColumns.includes(columnId)
      }
      return visibility
    }

    // 如果都没有，使用 defaultColumnVisibility 或默认显示所有列
    return defaultColumnVisibility
  }, [columns, defaultColumnVisibility, defaultVisibleColumns, storageKey])
  // 右键菜单 Hook
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu()
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
  // 使用初始化函数设置列可见性状态
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => initializeColumnVisibility())

  // 行选择状态
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  // 用于记录最后点击的行索引，支持 Shift 范围选择
  const [lastClickedRowIndex, setLastClickedRowIndex] =
    React.useState<number>(-1)

  // 编辑状态
  const [editingRowIndex, setEditingRowIndex] = React.useState<number>(-1)
  const [editingCellKey, setEditingCellKey] = React.useState<string>('') // 格式: "rowIndex-columnId"
  const [editedData, setEditedData] = React.useState<TData[]>(data)

  // 当 data prop 变化时，更新 editedData
  React.useEffect(() => {
    setEditedData(data)
  }, [data])

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
    const baseColumns = (columns as ColumnDef<TData, unknown>[]).map(
      (column) => {
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
      }
    )

    // 如果启用行选择，在最前面添加选择框列
    if (rowSelectionEnabled) {
      const selectionColumn: ColumnDef<TData, unknown> = {
        id: 'select',
        header: allowMultipleSelection
          ? ({ table }) => (
              <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                ref={(el) => {
                  if (el) el.indeterminate = table.getIsSomeRowsSelected()
                }}
              />
            )
          : '',
        cell: ({ row }) => (
          <input
            type={allowMultipleSelection ? 'checkbox' : 'radio'}
            checked={row.getIsSelected()}
            onChange={(e) => {
              // 阻止事件冒泡，避免与行点击事件冲突
              e.stopPropagation()
              row.getToggleSelectedHandler()(e)
            }}
            onClick={(e) => {
              // 阻止点击复选框时触发行的点击事件
              e.stopPropagation()
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      }

      return [selectionColumn, ...baseColumns]
    }

    return baseColumns
  }, [columns, rowSelectionEnabled, allowMultipleSelection])

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
    // 行选择配置
    enableRowSelection: rowSelectionEnabled,
    enableMultiRowSelection: allowMultipleSelection,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
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
      columnVisibility,
      rowSelection: rowSelectionEnabled ? rowSelection : undefined,
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
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === 'function' ? updater(columnVisibility) : updater
      setColumnVisibility(newVisibility)
      onColumnVisibilityChange?.(newVisibility)

      // 如果有 localStorage key，保存到本地存储
      if (storageKey) {
        try {
          localStorage.setItem(
            `paa-table-columns-${storageKey}`,
            JSON.stringify(newVisibility)
          )
        } catch (error) {
          console.warn('保存到 localStorage 失败:', error)
        }
      }
    },
    onRowSelectionChange: rowSelectionEnabled
      ? (updater) => {
          const newSelection =
            typeof updater === 'function' ? updater(rowSelection) : updater
          setRowSelection(newSelection)
          onSelectionChange?.(newSelection)
        }
      : undefined,
  })

  // 处理行点击事件，支持 Shift 和 Alt 修饰键
  const handleRowClick = React.useCallback(
    (
      event: React.MouseEvent,
      row: import('@tanstack/react-table').Row<TData>,
      rowIndex: number
    ) => {
      if (!rowSelectionEnabled) return

      // Ctrl + 左键（Windows）或 Cmd + 左键（Mac）：直接选中当前行
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        const rowId = row.id

        if (!allowMultipleSelection) {
          // 单选模式：直接选中当前行
          table.setRowSelection({ [rowId]: true })
        } else {
          // 多选模式：切换当前行的选中状态
          const currentSelection = table.getState().rowSelection || {}
          const isSelected = currentSelection[rowId]
          table.setRowSelection({
            ...currentSelection,
            [rowId]: !isSelected,
          })
        }
        setLastClickedRowIndex(rowIndex)
        return
      }

      // Shift + 左键：范围选择
      if (
        event.shiftKey &&
        allowMultipleSelection &&
        lastClickedRowIndex >= 0
      ) {
        event.preventDefault()
        const currentSelection = table.getState().rowSelection || {}
        const newSelection = { ...currentSelection }

        const startIndex = Math.min(lastClickedRowIndex, rowIndex)
        const endIndex = Math.max(lastClickedRowIndex, rowIndex)

        // 获取当前页面的所有行
        const rows = table.getRowModel().rows

        // 选择范围内的所有行
        for (let i = startIndex; i <= endIndex; i++) {
          if (i < rows.length) {
            const targetRow = rows[i]
            newSelection[targetRow.id] = true
          }
        }

        table.setRowSelection(newSelection)
        return
      }

      // 普通点击：更新最后点击的行索引
      setLastClickedRowIndex(rowIndex)
    },
    [rowSelectionEnabled, allowMultipleSelection, lastClickedRowIndex, table]
  )

  // 处理键盘事件，支持行选择的键盘操作
  const handleRowKeyDown = React.useCallback(
    (
      event: React.KeyboardEvent,
      row: import('@tanstack/react-table').Row<TData>,
      rowIndex: number
    ) => {
      if (!rowSelectionEnabled) return

      // Enter 或 Space 键：模拟点击行为
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()

        // 创建一个模拟的鼠标事件
        const syntheticMouseEvent = {
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          preventDefault: event.preventDefault.bind(event),
        } as React.MouseEvent

        handleRowClick(syntheticMouseEvent, row, rowIndex)
      }
    },
    [rowSelectionEnabled, handleRowClick]
  )

  // 开始编辑行或单元格
  const startEditing = React.useCallback(
    (rowIndex: number, columnId?: string) => {
      if (!rowEditingEnabled) return

      setEditingRowIndex(rowIndex)
      onRowEditStart?.(rowIndex)

      // 如果是单元格编辑模式且提供了列ID
      if (editMode === 'cell' && columnId) {
        setEditingCellKey(`${rowIndex}-${columnId}`)
      } else {
        // 整行编辑模式
        setEditingCellKey('')
      }
    },
    [rowEditingEnabled, editMode, onRowEditStart]
  )

  // 取消编辑
  const cancelEditing = React.useCallback(() => {
    setEditingRowIndex(-1)
    setEditingCellKey('')
    setEditedData(data) // 恢复原始数据
    onEditCancel?.()
    onRowEditCancel?.(editingRowIndex)
  }, [data, editingRowIndex, onEditCancel, onRowEditCancel])

  // 处理单元格值变化
  const handleCellValueChange = React.useCallback(
    async (columnId: string, value: unknown, rowIndex: number) => {
      // 更新 editedData
      setEditedData((prev) => {
        const newData = [...prev]
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnId]: value,
        }
        return newData
      })

      // 调用单元格编辑回调
      await onCellEdit?.(editedData[rowIndex], columnId, value, rowIndex)
    },
    [editedData, onCellEdit]
  )

  // 完成编辑
  const completeEditing = React.useCallback(async () => {
    if (editingRowIndex < 0) return

    try {
      const rowData = editedData[editingRowIndex]
      await onRowEdit?.(rowData, editingRowIndex)
      await onRowEditComplete?.(rowData, editingRowIndex)

      // 清除编辑状态
      setEditingRowIndex(-1)
      setEditingCellKey('')
    } catch (error) {
      console.error('保存编辑失败:', error)
    }
  }, [editingRowIndex, editedData, onRowEdit, onRowEditComplete])

  // 处理行双击事件
  const handleRowDoubleClick = React.useCallback(
    (rowIndex: number) => {
      if (rowEditingEnabled && editOnDoubleClick) {
        startEditing(rowIndex)
      }
    },
    [rowEditingEnabled, editOnDoubleClick, startEditing]
  )

  // 处理单元格双击事件
  const handleCellDoubleClick = React.useCallback(
    (rowIndex: number, columnId: string) => {
      if (rowEditingEnabled && editOnDoubleClick && editMode === 'cell') {
        startEditing(rowIndex, columnId)
      }
    },
    [rowEditingEnabled, editOnDoubleClick, editMode, startEditing]
  )

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

  // 显示默认列
  const showDefaultColumns = React.useCallback(() => {
    const defaultVisibility: VisibilityState = {}

    // 如果有指定默认显示列，优先使用
    if (defaultVisibleColumns && defaultVisibleColumns.length > 0) {
      // 获取所有列的 ID
      const allColumnIds = table.getAllColumns().map((column) => column.id)

      // 设置所有列为隐藏，只显示指定的列
      for (const columnId of allColumnIds) {
        defaultVisibility[columnId] = defaultVisibleColumns.includes(columnId)
      }
    } else {
      // 否则使用初始的 defaultColumnVisibility 或显示所有列
      for (const column of table.getAllColumns()) {
        defaultVisibility[column.id] =
          defaultColumnVisibility[column.id] ?? true
      }
    }

    table.setColumnVisibility(defaultVisibility)
  }, [table, defaultColumnVisibility, defaultVisibleColumns])

  // 显示所有列
  const showAllColumns = React.useCallback(() => {
    const allVisible: VisibilityState = {}
    for (const column of table.getAllColumns()) {
      allVisible[column.id] = true
    }
    table.setColumnVisibility(allVisible)
  }, [table])

  // 切换列可见性
  const toggleColumnVisibility = React.useCallback(
    (columnId: string) => {
      table.getColumn(columnId)?.toggleVisibility()
    },
    [table]
  )

  // 一键自适应列宽 - 基于实际内容计算最小宽度
  const handleAutoFitColumns = React.useCallback(() => {
    const newSizing: ColumnSizingState = {}
    const headers = table.getHeaderGroups()[0]?.headers || []

    // 创建临时测量元素
    const measureElement = document.createElement('div')
    measureElement.style.position = 'absolute'
    measureElement.style.visibility = 'hidden'
    measureElement.style.height = 'auto'
    measureElement.style.width = 'auto'
    measureElement.style.whiteSpace = 'nowrap'
    measureElement.style.padding = '1.5rem' // 对应 px-6 py-4
    measureElement.style.fontSize = '0.875rem' // 对应 text-sm
    document.body.appendChild(measureElement)

    for (const header of headers) {
      const columnId = header.column.id
      let maxWidth = 0

      // 计算表头宽度
      const headerText = String(header.column.columnDef.header || columnId)
      measureElement.textContent = headerText
      const headerWidth = measureElement.offsetWidth + 40 // 额外空间给排序图标等

      maxWidth = Math.max(maxWidth, headerWidth)

      // 遍历所有行数据，计算每个单元格的内容宽度
      const rows = table.getRowModel().rows
      for (const row of rows) {
        const cell = row.getVisibleCells().find((c) => c.column.id === columnId)
        if (cell) {
          const cellValue = cell.getValue()
          let displayText = ''

          // 处理不同类型的值
          if (cellValue === null || cellValue === undefined) {
            displayText = ''
          } else if (typeof cellValue === 'object') {
            displayText = JSON.stringify(cellValue)
          } else {
            displayText = String(cellValue)
          }

          measureElement.textContent = displayText
          const cellWidth = measureElement.offsetWidth
          maxWidth = Math.max(maxWidth, cellWidth)
        }
      }

      // 设置最小宽度，确保内容完整显示
      newSizing[columnId] = Math.max(maxWidth, 80) // 最小80px
    }

    // 清理测量元素
    document.body.removeChild(measureElement)

    // 通过 TanStack Table 的状态管理系统更新列宽
    setColumnSizing(newSizing)
    onColumnSizingChange?.(newSizing)
  }, [table, onColumnSizingChange])

  // 创建表头右键菜单项
  const createHeaderContextMenuItems = React.useCallback(
    (headerColumn?: Column<TData, unknown>): ContextMenuItem[] => {
      const items: ContextMenuItem[] = []

      if (headerContextMenu.enabled && enableContextMenu) {
        if (headerContextMenu.showDefaultColumns) {
          items.push({
            key: 'show-default-columns',
            label: '显示默认列',
            icon: '🏠',
            onClick: showDefaultColumns,
          })
        }

        if (headerContextMenu.showAllColumns) {
          items.push({
            key: 'show-all-columns',
            label: '显示所有列',
            icon: '👁️',
            onClick: showAllColumns,
          })
        }

        if (headerContextMenu.autoFitColumns && enableAutoFitColumns) {
          items.push({
            key: 'auto-fit-columns',
            label: '自适应列宽',
            icon: '📏',
            onClick: handleAutoFitColumns,
          })
        }

        // 如果有具体的列，添加列可见性控制
        if (headerContextMenu.columnVisibility && headerColumn) {
          if (items.length > 0) {
            items.push({
              key: 'divider-1',
              label: '——————————',
              disabled: true,
            })
          }

          // 添加所有列的显隐控制
          for (const column of table.getAllColumns()) {
            const columnDef = column.columnDef as ReactTableColumnDef<TData>
            const isVisible = column.getIsVisible()
            const columnLabel =
              typeof columnDef.header === 'string'
                ? columnDef.header
                : column.id

            items.push({
              key: `toggle-${column.id}`,
              label: `${isVisible ? '隐藏' : '显示'} ${columnLabel}`,
              icon: isVisible ? '👁️' : '🙈',
              onClick: () => toggleColumnVisibility(column.id),
            })
          }
        }
      }

      return items
    },
    [
      headerContextMenu,
      enableContextMenu,
      enableAutoFitColumns,
      showDefaultColumns,
      showAllColumns,
      handleAutoFitColumns,
      table,
      toggleColumnVisibility,
    ]
  )

  // 创建数据行右键菜单项
  const createRowContextMenuItems = React.useCallback(
    (rowData: TData, rowIndex: number): ContextMenuItem[] => {
      if (!rowContextMenu.enabled || !enableContextMenu) {
        return []
      }

      if (rowContextMenu.items) {
        return rowContextMenu.items(rowData, rowIndex)
      }

      // 默认行菜单项
      return [
        {
          key: 'view',
          label: '查看',
          icon: '👁️',
          onClick: () => console.log('查看行数据:', rowData),
        },
        {
          key: 'edit',
          label: '编辑',
          icon: '✏️',
          onClick: () => console.log('编辑行数据:', rowData),
        },
        {
          key: 'delete',
          label: '删除',
          icon: '🗑️',
          onClick: () => console.log('删除行数据:', rowData),
        },
      ]
    },
    [rowContextMenu, enableContextMenu]
  )

  // 处理表头右键菜单
  const handleHeaderContextMenu = React.useCallback(
    (event: React.MouseEvent, headerColumn?: Column<TData, unknown>) => {
      if (!enableContextMenu || !headerContextMenu.enabled) {
        return
      }
      const items = createHeaderContextMenuItems(headerColumn)
      if (items.length > 0) {
        showContextMenu(event, items)
      }
    },
    [
      enableContextMenu,
      headerContextMenu,
      createHeaderContextMenuItems,
      showContextMenu,
    ]
  )

  // 处理数据行右键菜单
  const handleRowContextMenu = React.useCallback(
    (event: React.MouseEvent, rowData: TData, rowIndex: number) => {
      if (!enableContextMenu || !rowContextMenu.enabled) {
        return
      }
      const items = createRowContextMenuItems(rowData, rowIndex)
      if (items.length > 0) {
        showContextMenu(event, items)
      }
    },
    [
      enableContextMenu,
      rowContextMenu,
      createRowContextMenuItems,
      showContextMenu,
    ]
  )

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
            自适应内容宽度
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
                        onContextMenu={handleHeaderContextMenu}
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
                      onContextMenu={handleHeaderContextMenu}
                    />
                  ))
                )}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, rowIndex) => {
              const isEditing = editingRowIndex === rowIndex

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    rowSelectionEnabled && row.getIsSelected()
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  } ${isEditing ? 'bg-yellow-50 border-yellow-200' : ''} ${
                    rowSelectionEnabled ? 'cursor-pointer select-none' : ''
                  } group relative`}
                  onClick={(e) => handleRowClick(e, row, rowIndex)}
                  onDoubleClick={() => handleRowDoubleClick(rowIndex)}
                  onKeyDown={(e) => handleRowKeyDown(e, row, rowIndex)}
                  onContextMenu={(e) =>
                    handleRowContextMenu(e, row.original, row.index)
                  }
                  tabIndex={rowSelectionEnabled ? 0 : undefined}
                  role={rowSelectionEnabled ? 'button' : undefined}
                  aria-selected={
                    rowSelectionEnabled ? row.getIsSelected() : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column
                      .columnDef as ReactTableColumnDef<TData>
                    const cellValue = cell.getValue()
                    const columnId = cell.column.id
                    const cellKey = `${rowIndex}-${columnId}`

                    // 判断单元格是否可编辑
                    const isCellEditable =
                      rowEditingEnabled &&
                      column.editConfig?.editable !== false &&
                      ((editMode === 'row' && isEditing) ||
                        (editMode === 'cell' && editingCellKey === cellKey))

                    return (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                        }}
                        onDoubleClick={(e) => {
                          if (editMode === 'cell') {
                            e.stopPropagation()
                            handleCellDoubleClick(rowIndex, columnId)
                          }
                        }}
                      >
                        {isCellEditable && column.editConfig ? (
                          <EditableCell
                            value={cellValue}
                            columnId={columnId}
                            rowIndex={rowIndex}
                            isEditing={true}
                            editConfig={column.editConfig}
                            onValueChange={handleCellValueChange}
                            onEditComplete={completeEditing}
                            onEditCancel={cancelEditing}
                          />
                        ) : column.valueType ? (
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
                  {/* 编辑按钮列 - 编辑和操作按钮都放在同一列 */}
                  {rowEditingEnabled && (
                    <td className="px-2 py-2 whitespace-nowrap text-sm w-32">
                      {!isEditing && showEditButton && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(rowIndex)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="编辑"
                        >
                          ✏️ 编辑
                        </button>
                      )}
                      {isEditing && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              completeEditing()
                            }}
                            className="px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                            title="保存"
                          >
                            ✓ 保存
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEditing()
                            }}
                            className="px-2 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-600"
                            title="取消"
                          >
                            ✗ 取消
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
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

      {/* 右键菜单 */}
      {enableContextMenu && (
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={hideContextMenu}
        />
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
