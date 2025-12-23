import React from 'react'
import type { CellEditConfig, EditInputType } from './ReactTable'

// 可编辑单元格的 Props
interface EditableCellProps<TValue = unknown> {
  value: TValue
  columnId: string
  rowIndex: number
  isEditing: boolean
  editConfig?: CellEditConfig<TValue>
  onValueChange: (
    columnId: string,
    value: TValue,
    rowIndex: number
  ) => void | Promise<void>
  onEditComplete?: () => void
  onEditCancel?: () => void
}

// 可编辑单元格组件
export function EditableCell<TValue = unknown>({
  value,
  columnId,
  rowIndex,
  isEditing,
  editConfig,
  onValueChange,
  onEditComplete,
  onEditCancel,
}: EditableCellProps<TValue>) {
  const [editValue, setEditValue] = React.useState<TValue>(value)
  const [validationError, setValidationError] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // 当进入编辑模式时，聚焦输入框
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // 如果是文本输入，选中所有文本
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  // 当 value prop 变化时，更新 editValue
  React.useEffect(() => {
    setEditValue(value)
  }, [value])

  // 验证输入值
  const validateValue = (val: TValue): boolean => {
    if (editConfig?.validate) {
      const result = editConfig.validate(val)
      if (typeof result === 'string') {
        setValidationError(result)
        return false
      }
      if (!result) {
        setValidationError('验证失败')
        return false
      }
    }
    setValidationError('')
    return true
  }

  // 处理值变化
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value

    setEditValue(newValue as TValue)
    setValidationError('') // 清除验证错误
  }

  // 保存编辑
  const handleSave = async () => {
    if (!validateValue(editValue)) {
      return
    }

    try {
      await onValueChange(columnId, editValue, rowIndex)
      onEditComplete?.()
    } catch (error) {
      console.error('保存失败:', error)
      setValidationError('保存失败')
    }
  }

  // 取消编辑
  const handleCancel = () => {
    setEditValue(value) // 恢复原值
    setValidationError('')
    onEditCancel?.()
  }

  // 处理键盘事件
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  // 如果不是编辑模式,直接显示值
  if (!isEditing) {
    return (
      <div>
        {value === null || value === undefined
          ? ''
          : typeof value === 'boolean'
            ? value
              ? '✓'
              : '✗'
            : String(value)}
      </div>
    )
  }

  // 获取输入类型
  const inputType: EditInputType = editConfig?.inputType || 'text'
  const placeholder = editConfig?.placeholder || '请输入...'

  // 根据输入类型渲染不同的输入控件
  const renderInput = () => {
    // 使用 outline 而不是 border,不影响盒模型和行高
    // focus:outline-blue-500 让聚焦时边框更明显
    const baseClasses =
      'w-full text-sm bg-transparent outline outline-2 outline-blue-400 focus:outline-blue-500 rounded px-1 -mx-1'
    const errorClasses = validationError ? 'outline-red-500 focus:outline-red-500' : ''

    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={String(editValue ?? '')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses} resize-none`}
            rows={1}
          />
        )

      case 'select':
        return (
          <select
            value={String(editValue ?? '')}
            onChange={handleChange}
            className={`${baseClasses} ${errorClasses}`}
          >
            <option value="">请选择...</option>
            {editConfig?.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={Boolean(editValue)}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        )

      case 'number':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={
              editValue !== undefined && editValue !== null
                ? String(editValue)
                : ''
            }
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        )
      case 'email':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="email"
            value={String(editValue ?? '')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        )
      case 'date':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={String(editValue ?? '')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        )
      case 'text':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={String(editValue ?? '')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        )
      default:
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={inputType}
            value={String(editValue ?? '')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        )
    }
  }

  return (
    <div className="relative">
      {renderInput()}
      {validationError && (
        <div className="absolute z-10 mt-1 px-2 py-1 text-xs text-white bg-red-500 rounded shadow-lg whitespace-nowrap">
          {validationError}
        </div>
      )}
    </div>
  )
}
