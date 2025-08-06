import type React from 'react'
import { useEffect, useRef, useState } from 'react'

// 菜单项接口
export interface ContextMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

// 右键菜单组件属性
export interface ContextMenuProps {
  visible: boolean
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
  className?: string
}

// 右键菜单组件
export function ContextMenu({
  visible,
  x,
  y,
  items,
  onClose,
  className = '',
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y })

  // 调整菜单位置，避免超出视窗
  useEffect(() => {
    if (visible && menuRef.current) {
      const menu = menuRef.current
      const menuRect = menu.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      // 检查右边界
      if (x + menuRect.width > windowWidth) {
        adjustedX = windowWidth - menuRect.width - 10
      }

      // 检查下边界
      if (y + menuRect.height > windowHeight) {
        adjustedY = windowHeight - menuRect.height - 10
      }

      // 检查左边界
      if (adjustedX < 10) {
        adjustedX = 10
      }

      // 检查上边界
      if (adjustedY < 10) {
        adjustedY = 10
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY })
    }
  }, [visible, x, y])

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [visible, onClose])

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div
        ref={menuRef}
        className={`absolute bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-40 ${className}`}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${
              item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700'
            }`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.()
                onClose()
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
                e.preventDefault()
                item.onClick?.()
                onClose()
              }
            }}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
          >
            {item.icon && (
              <span className="mr-2 flex-shrink-0">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 使用右键菜单的 Hook
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    items: ContextMenuItem[]
  }>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  })

  const showContextMenu = (
    event: React.MouseEvent,
    items: ContextMenuItem[]
  ) => {
    event.preventDefault()
    event.stopPropagation()

    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      items,
    })
  }

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  }
}
