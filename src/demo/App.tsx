import type { RowSelectionState } from '@tanstack/react-table'
import React from 'react'
import ReactTable, { type ReactTableColumnDef } from '../components/ReactTable'
import ValueTypeDemo from './ValueTypeDemo'

type Person = {
  id: number
  name: string
  age: number
  email: string
  department: string
  salary: number
}

// 将 TanStack Table 的 columns 转换为 ReactTableColumnDef 类型
const columns: ReactTableColumnDef<Person, unknown>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => String(info.getValue()),
    // ID 列不可编辑
    editConfig: {
      editable: false,
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: '姓名',
    cell: (info) => String(info.getValue()),
    editConfig: {
      editable: true,
      inputType: 'text',
      placeholder: '请输入姓名',
      validate: (value) => {
        const name = String(value || '')
        if (name.length < 2) return '姓名至少2个字符'
        return true
      },
    },
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '年龄',
    cell: (info) => String(info.getValue()),
    editConfig: {
      editable: true,
      inputType: 'number',
      placeholder: '请输入年龄',
      validate: (value) => {
        const age = Number(value)
        if (age < 18 || age > 65) return '年龄必须在18-65之间'
        return true
      },
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: '邮箱',
    cell: (info) => String(info.getValue()),
    editConfig: {
      editable: true,
      inputType: 'email',
      placeholder: '请输入邮箱',
      validate: (value) => {
        const email = String(value || '')
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return '邮箱格式不正确'
        return true
      },
    },
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: '部门',
    cell: (info) => String(info.getValue()),
    editConfig: {
      editable: true,
      inputType: 'select',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '市场部', value: '市场部' },
        { label: '销售部', value: '销售部' },
        { label: '人事部', value: '人事部' },
        { label: '财务部', value: '财务部' },
      ],
    },
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: '薪资',
    cell: (info) => `¥${(info.getValue() as number).toLocaleString()}`,
    editConfig: {
      editable: true,
      inputType: 'number',
      placeholder: '请输入薪资',
      validate: (value) => {
        const salary = Number(value)
        if (salary < 5000) return '薪资不能低于5000'
        return true
      },
    },
  },
]

const generateMockData = (count: number): Person[] => {
  const departments = ['技术部', '市场部', '销售部', '人事部', '财务部']
  const names = [
    '张三',
    '李四33333333333',
    '王五',
    '赵六',
    '钱七',
    '孙八',
    '周九',
    '吴十',
    '郑十一',
    '王十二',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i > 9 ? Math.floor(i / 10) : ''),
    age: 22 + Math.floor(Math.random() * 40),
    email: `user${i + 1}@example.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: 8000 + Math.floor(Math.random() * 50000),
  }))
}

function App() {
  const [data, setData] = React.useState(() => generateMockData(50))
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [currentDemo, setCurrentDemo] = React.useState<'basic' | 'valueType'>(
    'basic'
  )
  const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({})

  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder)
    console.log('列顺序已更新:', newOrder)
  }

  const handleSelectionChange = (selection: RowSelectionState) => {
    setSelectedRows(selection)
    console.log('行选择已更新:', selection)
  }

  // 单行编辑回调
  const handleRowEdit = (rowData: Person, rowIndex: number) => {
    console.log('单行编辑完成:', rowData, rowIndex)
    // 更新数据
    setData((prev) => {
      const newData = [...prev]
      newData[rowIndex] = rowData
      return newData
    })
  }

  // 单元格编辑回调
  const handleCellEdit = (
    rowData: Person,
    columnId: string,
    newValue: unknown,
    rowIndex: number
  ) => {
    console.log('单元格编辑:', { rowData, columnId, newValue, rowIndex })
  }

  if (currentDemo === 'valueType') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-50">
          <button
            type="button"
            onClick={() => setCurrentDemo('basic')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            返回基础演示
          </button>
        </div>
        <ValueTypeDemo />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ReactTable 组件演示
          </h1>
          <p className="text-gray-600">
            基于 TanStack Table 的 React 表格组件，支持列拖拽重排
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setCurrentDemo('valueType')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              查看 ValueType 功能演示
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">支持列拖拽的表格</h2>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                <strong>提示：</strong>点击并拖拽表头中的 ⋮⋮
                图标来重新排列列的顺序，右键表头可显示隐藏列
              </p>
              {columnOrder.length > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  当前列顺序: {columnOrder.join(' → ')}
                </p>
              )}
            </div>
            <ReactTable
              data={data}
              columns={columns}
              pagination={{ pageSize: 10 }}
              callbacks={{
                onColumnOrderChange: handleColumnOrderChange,
              }}
              storageKey="demo-table" // 使用 localStorage 保存列状态
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">默认显示指定列的表格</h2>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-700">
                <strong>提示：</strong>此表默认只显示
                ID、姓名、部门列，右键表头可切换其他列
              </p>
            </div>
            <ReactTable
              data={data.slice(0, 8)}
              columns={columns}
              features={{
                pagination: false,
                columnDragging: false,
              }}
              defaultVisibleColumns={['id', 'name', 'department']} // 只显示这三列
              storageKey="limited-table" // 使用独立的 localStorage key
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              显示所有列的表格（无 localStorage）
            </h2>
            <ReactTable
              data={data.slice(0, 5)}
              columns={columns}
              features={{
                pagination: false,
                columnDragging: false,
              }}
              // 不设置 storageKey，不保存到本地存储
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">支持行选择的表格</h2>
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-700">
                <strong>行选择功能：</strong>
              </p>
              <ul className="text-sm text-purple-600 mt-2 space-y-1">
                <li>• 普通点击：使用复选框进行多选</li>
                <li>
                  •{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Ctrl
                  </kbd>{' '}
                  (Windows) 或{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Cmd
                  </kbd>{' '}
                  (Mac) + 点击行：直接选中/取消选中当前行
                </li>
                <li>
                  •{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Shift
                  </kbd>{' '}
                  + 点击行：选中范围内的所有行
                </li>
              </ul>
              {Object.keys(selectedRows).length > 0 && (
                <p className="text-sm text-purple-600 mt-2">
                  已选择 {Object.keys(selectedRows).length} 行: [
                  {Object.keys(selectedRows).join(', ')}]
                </p>
              )}
            </div>
            <ReactTable
              data={data}
              columns={columns}
              features={{
                rowSelection: true, // 启用行选择
              }}
              pagination={{ pageSize: 10 }}
              rowSelection={{
                enabled: true,
                multiple: true,
                onSelectionChange: handleSelectionChange,
              }}
              storageKey="row-selection-table"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">单选模式表格</h2>
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
              <p className="text-sm text-orange-700">
                <strong>提示：</strong>此表格只允许单选，使用单选按钮
              </p>
            </div>
            <ReactTable
              data={data.slice(0, 8)}
              columns={columns}
              features={{
                rowSelection: true,
                pagination: false,
              }}
              rowSelection={{
                enabled: true,
                multiple: false, // 单选模式
                onSelectionChange: (selection) =>
                  console.log('单选表格选择:', selection),
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              整行编辑模式 - 双击行进入编辑
            </h2>
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded">
              <p className="text-sm text-teal-700">
                <strong>整行编辑功能：</strong>
              </p>
              <ul className="text-sm text-teal-600 mt-2 space-y-1">
                <li>• 双击行进入编辑模式</li>
                <li>• 鼠标悬停时显示编辑按钮</li>
                <li>• 同时编辑整行的所有可编辑列</li>
                <li>• 支持输入验证（姓名、年龄、邮箱等）</li>
                <li>• 按 Enter 保存，按 Esc 取消</li>
                <li>• 操作按钮在行内，行高不变</li>
                <li>• ID 列不可编辑，部门列使用下拉选择</li>
              </ul>
            </div>
            <ReactTable
              data={data.slice(0, 10)}
              columns={columns}
              features={{
                rowEditing: true,
                pagination: false,
              }}
              rowEditing={{
                enabled: true,
                mode: 'row',
                editOnDoubleClick: true,
                showEditButton: true,
                onRowEdit: handleRowEdit,
              }}
              callbacks={{
                onCellEdit: handleCellEdit,
                onRowEditStart: (rowIndex) =>
                  console.log('开始编辑行:', rowIndex),
                onRowEditComplete: (rowData, rowIndex) =>
                  console.log('编辑完成:', rowData, rowIndex),
                onRowEditCancel: (rowIndex) =>
                  console.log('取消编辑行:', rowIndex),
              }}
              storageKey="row-edit-table"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              单元格编辑模式 - 双击单元格编辑
            </h2>
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded">
              <p className="text-sm text-indigo-700">
                <strong>单元格编辑功能：</strong>
              </p>
              <ul className="text-sm text-indigo-600 mt-2 space-y-1">
                <li>• 双击单元格进入编辑模式</li>
                <li>• 只编辑当前单元格</li>
                <li>• 可以单独编辑某一列的某一行</li>
                <li>• 灵活的块编辑 - 想编辑哪个就编辑哪个</li>
                <li>• 支持快速的单字段修改</li>
                <li>• 操作按钮在行尾统一位置</li>
              </ul>
            </div>
            <ReactTable
              data={data.slice(0, 15)}
              columns={columns}
              features={{
                rowEditing: true,
                pagination: false,
              }}
              rowEditing={{
                enabled: true,
                mode: 'cell',
                editOnDoubleClick: true,
                showEditButton: false,
                onRowEdit: handleRowEdit,
              }}
              callbacks={{
                onCellEdit: handleCellEdit,
              }}
              storageKey="cell-edit-table"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">功能特性说明</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    列拖拽功能
                  </h3>
                  <ul className="space-y-1">
                    <li>• 支持鼠标拖拽列重排</li>
                    <li>• 支持触摸设备拖拽</li>
                    <li>• 支持键盘操作</li>
                    <li>• 平滑的拖拽动画效果</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    数据格式化
                  </h3>
                  <ul className="space-y-1">
                    <li>• 支持25+种数据类型</li>
                    <li>• 金额、日期、进度条等</li>
                    <li>• 图片、代码、JSON显示</li>
                    <li>• 自定义选项配置</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">表格功能</h3>
                  <ul className="space-y-1">
                    <li>• 列排序（点击表头）</li>
                    <li>• 分页导航</li>
                    <li>• 行选择（单选/多选）</li>
                    <li>• 响应式设计</li>
                    <li>• 可配置的功能开关</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    行选择功能
                  </h3>
                  <ul className="space-y-1">
                    <li>• 支持单选/多选模式</li>
                    <li>• Shift+点击范围选择</li>
                    <li>• Ctrl/Cmd+点击直接选择</li>
                    <li>• 全选/取消全选</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    行编辑功能 ✨
                  </h3>
                  <ul className="space-y-1">
                    <li>• 整行编辑模式</li>
                    <li>• 单元格编辑模式（块编辑）</li>
                    <li>• 多种输入类型支持</li>
                    <li>• 自定义验证规则</li>
                    <li>• 双击触发编辑</li>
                    <li>• 行高保持不变</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">技术特性</h3>
                  <ul className="space-y-1">
                    <li>• TypeScript 完整类型支持</li>
                    <li>• TailwindCSS 样式系统</li>
                    <li>• TanStack Table 核心</li>
                    <li>• DnD Kit 拖拽实现</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
