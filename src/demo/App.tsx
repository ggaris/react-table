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
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: '姓名',
    cell: (info) => String(info.getValue()),
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '年龄',
    cell: (info) => String(info.getValue()),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: '邮箱',
    cell: (info) => String(info.getValue()),
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: '部门',
    cell: (info) => String(info.getValue()),
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: '薪资',
    cell: (info) => `¥${(info.getValue() as number).toLocaleString()}`,
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
  const [data] = React.useState(() => generateMockData(50))
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [currentDemo, setCurrentDemo] = React.useState<'basic' | 'valueType'>(
    'basic'
  )

  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder)
    console.log('列顺序已更新:', newOrder)
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
                图标来重新排列列的顺序
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
              callbacks={{ onColumnOrderChange: handleColumnOrderChange }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">禁用列拖拽的表格</h2>
            <ReactTable
              data={data.slice(0, 5)}
              columns={columns}
              features={{
                pagination: false,
                columnDragging: false,
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">禁用排序但支持列拖拽</h2>
            <ReactTable
              data={data.slice(0, 8)}
              columns={columns}
              features={{ sorting: false }}
              pagination={{ pageSize: 8 }}
              callbacks={{
                onColumnOrderChange: (order) =>
                  console.log('排序禁用表格列顺序:', order),
              }}
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
                    <li>• 响应式设计</li>
                    <li>• 可配置的功能开关</li>
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
