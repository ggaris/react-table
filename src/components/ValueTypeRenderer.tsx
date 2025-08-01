import type React from 'react'

export type ValueType =
  | 'password'
  | 'money'
  | 'textarea'
  | 'date'
  | 'dateTime'
  | 'dateWeek'
  | 'dateMonth'
  | 'dateQuarter'
  | 'dateYear'
  | 'dateRange'
  | 'dateTimeRange'
  | 'time'
  | 'timeRange'
  | 'text'
  | 'select'
  | 'treeSelect'
  | 'checkbox'
  | 'rate'
  | 'radio'
  | 'radioButton'
  | 'progress'
  | 'percent'
  | 'digit'
  | 'second'
  | 'code'
  | 'image'
  | 'jsonCode'
  | 'divider'

interface ValueTypeRendererProps<T = unknown> {
  value: T
  valueType?: ValueType
  options?: Array<{ label: string; value: T }>
}

// 格式化日期 - 使用 unknown 类型因为日期值可能是 string、number 或 Date 对象
const formatDate = (value: unknown, format = 'YYYY-MM-DD') => {
  if (!value) return '-'
  // 类型守护确保传入的值是有效的日期值
  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 格式化金额 - 使用 unknown 类型因为金额值可能是 string 或 number
const formatMoney = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化百分比 - 使用 unknown 类型因为百分比值可能是 string 或 number
const formatPercent = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return `${(num * 100).toFixed(2)}%`
}

// 格式化秒数 - 使用 unknown 类型因为秒数值可能是 string 或 number
const formatSecond = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  const seconds = Number(value)
  if (Number.isNaN(seconds)) return '-'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

// 星级组件
const RateDisplay: React.FC<{ value: number; max?: number }> = ({
  value,
  max = 5,
}) => {
  const rate = Number(value) || 0
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: 索引代表星级位置，是稳定的标识符
          key={i}
          className={`text-lg ${
            i < rate ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rate})</span>
    </div>
  )
}

// 进度条组件
const ProgressDisplay: React.FC<{ value: number }> = ({ value }) => {
  const progress = Math.min(Math.max(Number(value) || 0, 0), 100)
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-12">{progress}%</span>
    </div>
  )
}

// 图片显示组件
const ImageDisplay: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-gray-400">-</span>

  return (
    <img
      src={value}
      alt="图片"
      className="h-12 w-12 object-cover rounded border"
      onError={(e) => {
        e.currentTarget.src =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMxOS41ODE3IDMyIDE2IDI4LjQxODMgMTYgMjRDMTYgMTkuNTgxNyAxOS41ODE3IDE2IDI0IDE2QzI4LjQxODMgMTYgMzIgMTkuNTgxNyAzMiAyNEMzMiAyOC40MTgzIDI4LjQxODMgMzIgMjQgMzJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='
      }}
    />
  )
}

// 代码显示组件 - 移除未使用的 language 参数
const CodeDisplay: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-gray-400">-</span>

  return (
    <div className="bg-gray-900 text-gray-100 p-2 rounded text-sm font-mono max-w-xs overflow-x-auto">
      <pre className="whitespace-pre-wrap">{value}</pre>
    </div>
  )
}

// JSON代码显示组件 - 使用 unknown 类型因为 JSON 值可能是任意类型
const JsonCodeDisplay: React.FC<{ value: unknown }> = ({ value }) => {
  if (!value) return <span className="text-gray-400">-</span>

  let formattedJson: string
  try {
    formattedJson =
      typeof value === 'string'
        ? JSON.stringify(JSON.parse(value), null, 2)
        : JSON.stringify(value, null, 2)
  } catch {
    formattedJson = String(value)
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-2 rounded text-sm font-mono max-w-xs overflow-x-auto">
      <pre className="whitespace-pre-wrap">{formattedJson}</pre>
    </div>
  )
}

// 分割线组件
const DividerDisplay: React.FC = () => (
  <div className="w-full border-t border-gray-300" />
)

// 处理日期相关类型的渲染
const renderDateTypes = (value: unknown, valueType: ValueType) => {
  switch (valueType) {
    case 'date':
      return <span>{formatDate(value, 'YYYY-MM-DD')}</span>
    case 'dateTime':
      return <span>{formatDate(value, 'YYYY-MM-DD HH:mm:ss')}</span>
    case 'dateWeek':
      return <span>{formatDate(value, 'YYYY年第WW周')}</span>
    case 'dateMonth':
      return <span>{formatDate(value, 'YYYY-MM')}</span>
    case 'dateQuarter': {
      const date = new Date(value as string | number | Date)
      const quarter = Math.floor(date.getMonth() / 3) + 1
      return (
        <span>
          {date.getFullYear()}年第{quarter}季度
        </span>
      )
    }
    case 'dateYear':
      return <span>{formatDate(value, 'YYYY')}</span>
    case 'dateRange':
    case 'dateTimeRange':
      if (Array.isArray(value) && value.length === 2) {
        const format =
          valueType === 'dateRange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
        return (
          <span>
            {formatDate(value[0], format)} ~ {formatDate(value[1], format)}
          </span>
        )
      }
      return <span>{String(value)}</span>
    case 'time':
      return <span>{formatDate(value, 'HH:mm:ss')}</span>
    case 'timeRange':
      if (Array.isArray(value) && value.length === 2) {
        return (
          <span>
            {formatDate(value[0], 'HH:mm:ss')} ~{' '}
            {formatDate(value[1], 'HH:mm:ss')}
          </span>
        )
      }
      return <span>{String(value)}</span>
    default:
      return null
  }
}

// 处理选择相关类型的渲染
const renderSelectTypes = (
  value: unknown,
  valueType: ValueType,
  options: Array<{ label: string; value: unknown }>
) => {
  switch (valueType) {
    case 'select': {
      const selectedOption = options.find((opt) => opt.value === value)
      return <span>{selectedOption?.label || String(value)}</span>
    }
    case 'checkbox':
      if (Array.isArray(value)) {
        const selectedLabels = value.map((v) => {
          const option = options.find((opt) => opt.value === v)
          return option?.label || String(v)
        })
        return (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label) => (
              <span
                key={`checkbox-${label}`}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {label}
              </span>
            ))}
          </div>
        )
      }
      return <span>{String(value)}</span>
    case 'radio':
    case 'radioButton': {
      const radioOption = options.find((opt) => opt.value === value)
      return (
        <span
          className={
            valueType === 'radioButton'
              ? 'px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded'
              : ''
          }
        >
          {radioOption?.label || String(value)}
        </span>
      )
    }
    default:
      return null
  }
}

export const ValueTypeRenderer: React.FC<ValueTypeRendererProps<unknown>> = ({
  value,
  valueType = 'text',
  options = [],
}) => {
  // 处理空值
  if (value === null || value === undefined) {
    if (valueType === 'divider') return <DividerDisplay />
    return <span className="text-gray-400">-</span>
  }

  // 处理日期相关类型
  const dateTypes = [
    'date',
    'dateTime',
    'dateWeek',
    'dateMonth',
    'dateQuarter',
    'dateYear',
    'dateRange',
    'dateTimeRange',
    'time',
    'timeRange',
  ]
  if (dateTypes.includes(valueType)) {
    return renderDateTypes(value, valueType)
  }

  // 处理选择相关类型
  const selectTypes = ['select', 'checkbox', 'radio', 'radioButton']
  if (selectTypes.includes(valueType)) {
    return renderSelectTypes(value, valueType, options)
  }

  // 处理其他类型
  switch (valueType) {
    case 'password':
      return <span className="text-gray-400">{'*'.repeat(8)}</span>

    case 'money':
      return (
        <span className="font-medium text-green-600">{formatMoney(value)}</span>
      )

    case 'textarea':
      return (
        <div className="max-w-xs">
          <p className="text-sm line-clamp-3 whitespace-pre-wrap">
            {String(value)}
          </p>
        </div>
      )

    case 'rate':
      return <RateDisplay value={Number(value)} />

    case 'progress':
      return <ProgressDisplay value={Number(value)} />

    case 'percent':
      return <span className="text-blue-600">{formatPercent(value)}</span>

    case 'digit': {
      const num = Number(value)
      return (
        <span className="font-mono">
          {Number.isNaN(num) ? '-' : num.toLocaleString()}
        </span>
      )
    }

    case 'second':
      return <span className="font-mono">{formatSecond(value)}</span>

    case 'code':
      return <CodeDisplay value={String(value)} />

    case 'image':
      return <ImageDisplay value={String(value)} />

    case 'jsonCode':
      return <JsonCodeDisplay value={value} />

    case 'divider':
      return <DividerDisplay />

    default:
      return <span>{String(value)}</span>
  }
}
