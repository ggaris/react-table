import React from 'react'

// 用户选择的操作类型
export type EditAction = 'save' | 'discard' | 'cancel'

// 对话框的 Props
interface EditConfirmDialogProps {
  isOpen: boolean
  onConfirm: (action: EditAction, remember: boolean) => void
}

// 编辑确认对话框组件
export function EditConfirmDialog({
  isOpen,
  onConfirm,
}: EditConfirmDialogProps) {
  const [remember, setRemember] = React.useState(false)

  // 重置记住选择状态
  React.useEffect(() => {
    if (isOpen) {
      setRemember(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* 对话框内容 */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* 标题 */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">
            未保存的编辑
          </h3>
        </div>

        {/* 提示信息 */}
        <p className="text-sm text-gray-600 mb-6">
          您有未保存的编辑内容。是否要保存这些更改?
        </p>

        {/* 记住选择复选框 */}
        <div className="mb-6">
          <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            />
            <span>记住我的选择,以后不再询问</span>
          </label>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => onConfirm('cancel', remember)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm('discard', remember)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            放弃更改
          </button>
          <button
            type="button"
            onClick={() => onConfirm('save', remember)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            保存更改
          </button>
        </div>
      </div>
    </div>
  )
}
