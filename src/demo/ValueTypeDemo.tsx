import React from 'react'
import type { ReactTableColumnDef } from '../components/ReactTable'
import ReactTable from '../components/ReactTable'

// 扩展数据类型来支持各种 valueType 示例
type DemoData = {
  id: number
  name: string
  password: string
  salary: number
  description: string
  birthDate: string
  lastLogin: string
  workHours: number
  avatar: string
  rating: number
  progress: number
  completion: number
  status: string
  tags: string[]
  isActive: boolean
  jsonData: object
  code: string
  divider?: string
}

const statusOptions = [
  { label: '在职', value: 'active' },
  { label: '离职', value: 'inactive' },
  { label: '试用期', value: 'trial' },
]

const tagOptions = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Node.js', value: 'node' },
]

const columns: ReactTableColumnDef<DemoData, unknown>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    valueType: 'digit',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: '姓名',
    valueType: 'text',
  },
  {
    id: 'password',
    accessorKey: 'password',
    header: '密码',
    valueType: 'password',
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: '薪资',
    valueType: 'money',
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: '描述',
    valueType: 'textarea',
  },
  {
    id: 'birthDate',
    accessorKey: 'birthDate',
    header: '出生日期',
    valueType: 'date',
  },
  {
    id: 'lastLogin',
    accessorKey: 'lastLogin',
    header: '最后登录',
    valueType: 'dateTime',
  },
  {
    id: 'workHours',
    accessorKey: 'workHours',
    header: '工作时长',
    valueType: 'second',
  },
  {
    id: 'avatar',
    accessorKey: 'avatar',
    header: '头像',
    valueType: 'image',
  },
  {
    id: 'rating',
    accessorKey: 'rating',
    header: '评分',
    valueType: 'rate',
  },
  {
    id: 'progress',
    accessorKey: 'progress',
    header: '进度',
    valueType: 'progress',
  },
  {
    id: 'completion',
    accessorKey: 'completion',
    header: '完成度',
    valueType: 'percent',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '状态',
    valueType: 'select',
    valueTypeOptions: statusOptions,
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    header: '技能标签',
    valueType: 'checkbox',
    valueTypeOptions: tagOptions,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: '代码片段',
    valueType: 'code',
  },
  {
    id: 'jsonData',
    accessorKey: 'jsonData',
    header: 'JSON数据',
    valueType: 'jsonCode',
  },
]

const generateMockData = (count: number): DemoData[] => {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const descriptions = [
    '负责前端开发工作，熟悉React和Vue框架',
    '后端开发工程师，精通Java和Python',
    '全栈开发，具有丰富的项目经验',
    'UI/UX设计师，注重用户体验设计',
  ]

  const avatars = [
    'https://picsum.photos/48/48?random=1',
    'https://picsum.photos/48/48?random=2',
    'https://picsum.photos/48/48?random=3',
    'https://picsum.photos/48/48?random=4',
  ]

  const codeSnippets = [
    'const hello = () => {\n  console.log("Hello World");\n}',
    'function add(a, b) {\n  return a + b;\n}',
    'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i > 7 ? Math.floor(i / 8) : ''),
    password: 'password123',
    salary: 8000 + Math.floor(Math.random() * 50000),
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    birthDate: new Date(
      1980 + Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    lastLogin: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    workHours: 3600 + Math.floor(Math.random() * 28800), // 1-8小时的秒数
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    rating: Math.floor(Math.random() * 5) + 1,
    progress: Math.floor(Math.random() * 100),
    completion: Math.random(),
    status:
      statusOptions[Math.floor(Math.random() * statusOptions.length)].value,
    tags: tagOptions
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((tag) => tag.value),
    isActive: Math.random() > 0.5,
    code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
    jsonData: {
      userId: i + 1,
      preferences: {
        theme: 'dark',
        language: 'zh-CN',
      },
      lastUpdated: new Date().toISOString(),
    },
  }))
}

function ValueTypeDemo() {
  const [data] = React.useState(() => generateMockData(20))

  const basicColumns: ReactTableColumnDef<DemoData, unknown>[] = [
    { id: 'name', accessorKey: 'name', header: '姓名', valueType: 'text' },
    {
      id: 'salary',
      accessorKey: 'salary',
      header: '薪资',
      valueType: 'money',
    },
    {
      id: 'rating',
      accessorKey: 'rating',
      header: '评分',
      valueType: 'rate',
    },
    {
      id: 'progress',
      accessorKey: 'progress',
      header: '进度',
      valueType: 'progress',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: '状态',
      valueType: 'select',
      valueTypeOptions: statusOptions,
    },
  ]

  const advancedColumns: ReactTableColumnDef<DemoData, unknown>[] = [
    {
      id: 'avatar',
      accessorKey: 'avatar',
      header: '头像',
      valueType: 'image',
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: '描述',
      valueType: 'textarea',
    },
    {
      id: 'birthDate',
      accessorKey: 'birthDate',
      header: '出生日期',
      valueType: 'date',
    },
    {
      id: 'completion',
      accessorKey: 'completion',
      header: '完成度',
      valueType: 'percent',
    },
    {
      id: 'tags',
      accessorKey: 'tags',
      header: '技能',
      valueType: 'checkbox',
      valueTypeOptions: tagOptions,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ValueType 功能演示
          </h1>
          <p className="text-gray-600">
            展示 PaaTable 支持的各种数据格式化类型
          </p>
        </div>

        <div className="space-y-8">
          {/* 基础数据类型 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">基础数据类型</h2>
            <div className="mb-4 text-sm text-gray-600">
              展示文本、金额、评分、进度条、下拉选择等基础类型
            </div>
            <ReactTable
              data={data}
              columns={basicColumns}
              pagination={{ pageSize: 5 }}
            />
          </div>

          {/* 高级数据类型 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">高级数据类型</h2>
            <div className="mb-4 text-sm text-gray-600">
              展示图片、文本域、日期、百分比、多选标签等高级类型
            </div>
            <ReactTable
              data={data}
              columns={advancedColumns}
              pagination={{ pageSize: 5 }}
            />
          </div>

          {/* 完整功能演示 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">完整功能演示</h2>
            <div className="mb-4 text-sm text-gray-600">
              展示所有支持的 valueType
              类型（注意：此表格列较多，建议横向滚动查看）
            </div>
            <ReactTable
              data={data}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          </div>

          {/* 功能说明 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              支持的 ValueType 类型
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">基础类型</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• text - 文本</li>
                  <li>• password - 密码（隐藏显示）</li>
                  <li>• textarea - 多行文本</li>
                  <li>• digit - 数字</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">格式化类型</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• money - 金额</li>
                  <li>• percent - 百分比</li>
                  <li>• second - 时长</li>
                  <li>• progress - 进度条</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">日期时间</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• date - 日期</li>
                  <li>• dateTime - 日期时间</li>
                  <li>• time - 时间</li>
                  <li>• dateRange - 日期区间</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">选择类型</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• select - 下拉选择</li>
                  <li>• checkbox - 多选</li>
                  <li>• radio - 单选</li>
                  <li>• rate - 星级评分</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">媒体类型</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• image - 图片</li>
                  <li>• code - 代码</li>
                  <li>• jsonCode - JSON代码</li>
                  <li>• divider - 分割线</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValueTypeDemo
