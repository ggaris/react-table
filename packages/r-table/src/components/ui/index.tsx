/**
 * 可复用的 UI 组件
 * 将重复使用的 UI 模式提取为组件
 */

import type React from "react";
import {
	cn,
	EMPTY_STATE_ICON,
	EMPTY_STATE_TEXT,
	ERROR_BADGE,
	TOOLBAR_BUTTON,
} from "../../styles/constants";
import { EmptyLineIcon, ErrorIcon } from "./icons";

// ========== 空状态组件 ==========

interface EmptyStateProps {
	/** 图标组件 */
	icon?: React.ReactNode;
	/** 显示文本，默认为 "-" */
	text?: string;
	/** 对齐方式 */
	align?: "left" | "center" | "right";
	/** 自定义类名 */
	className?: string;
}

/**
 * 空状态显示组件
 * 用于在数据为空时显示统一的占位符
 */
export function EmptyState({
	icon,
	text = "-",
	align = "center",
	className,
}: EmptyStateProps) {
	const alignClass =
		align === "left"
			? "justify-start"
			: align === "right"
				? "justify-end"
				: "justify-center";

	return (
		<div className={cn(`flex ${alignClass}`, className)}>
			<span className={EMPTY_STATE_TEXT}>
				{icon || <EmptyLineIcon className={EMPTY_STATE_ICON} />}
				<span>{text}</span>
			</span>
		</div>
	);
}

// ========== 错误状态组件 ==========

interface ErrorBadgeProps {
	/** 显示文本，默认为 "无效" */
	text?: string;
	/** 对齐方式 */
	align?: "left" | "center" | "right";
	/** 自定义类名 */
	className?: string;
}

/**
 * 错误/无效数据显示组件
 */
export function ErrorBadge({
	text = "无效",
	align = "center",
	className,
}: ErrorBadgeProps) {
	const alignClass =
		align === "left"
			? "justify-start"
			: align === "right"
				? "justify-end"
				: "justify-center";

	return (
		<div className={cn(`flex ${alignClass}`, className)}>
			<span className={ERROR_BADGE}>
				<ErrorIcon />
				<span>{text}</span>
			</span>
		</div>
	);
}

// ========== 工具栏按钮组件 ==========

interface ToolbarButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 按钮图标 */
	icon: React.ReactNode;
	/** 按钮提示文字 */
	tooltip?: string;
}

/**
 * 工具栏图标按钮组件
 */
export function ToolbarButton({
	icon,
	tooltip,
	className,
	...props
}: ToolbarButtonProps) {
	return (
		<button
			type="button"
			className={cn(TOOLBAR_BUTTON, className)}
			title={tooltip}
			{...props}
		>
			{icon}
		</button>
	);
}

// ========== 居中容器组件 ==========

interface CenteredProps {
	children: React.ReactNode;
	/** 对齐方式 */
	align?: "left" | "center" | "right";
	/** 自定义类名 */
	className?: string;
}

/**
 * 居中容器组件
 */
export function Centered({
	children,
	align = "center",
	className,
}: CenteredProps) {
	const alignClass =
		align === "left"
			? "justify-start"
			: align === "right"
				? "justify-end"
				: "justify-center";
	return <div className={cn(`flex ${alignClass}`, className)}>{children}</div>;
}

// ========== 下拉菜单组件 ==========

interface DropdownProps {
	/** 是否打开 */
	open: boolean;
	/** 关闭回调 */
	onClose: () => void;
	/** 子元素 */
	children: React.ReactNode;
	/** 自定义类名 */
	className?: string;
}

/**
 * 下拉菜单容器组件
 * 包含遮罩层和下拉面板
 */
export function Dropdown({
	open,
	onClose,
	children,
	className,
}: DropdownProps) {
	if (!open) return null;

	return (
		<>
			{/* 遮罩层 */}
			<div
				className="fixed inset-0 z-10"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						onClose();
					}
				}}
			/>
			{/* 下拉面板 */}
			<div
				className={cn(
					"absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in duration-150",
					className,
				)}
			>
				{children}
			</div>
		</>
	);
}

// ========== 下拉菜单项组件 ==========

interface DropdownItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 是否选中 */
	active?: boolean;
	/** 子元素 */
	children: React.ReactNode;
}

/**
 * 下拉菜单项组件
 */
export function DropdownItem({
	active,
	children,
	className,
	...props
}: DropdownItemProps) {
	return (
		<button
			type="button"
			className={cn(
				"w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 motion-reduce:transition-none flex items-center justify-between",
				active
					? "bg-blue-50 text-blue-600 font-medium"
					: "text-gray-700 hover:bg-gray-50",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

// ========== 加载骨架屏组件 ==========

interface SkeletonProps {
	/** 宽度 */
	width?: string | number;
	/** 高度 */
	height?: string | number;
	/** 圆角类型 */
	rounded?: "none" | "sm" | "md" | "lg" | "full";
	/** 自定义类名 */
	className?: string;
}

/**
 * 加载骨架屏组件
 */
export function Skeleton({
	width,
	height,
	rounded = "md",
	className,
}: SkeletonProps) {
	const roundedClass = {
		none: "",
		sm: "rounded-sm",
		md: "rounded-md",
		lg: "rounded-lg",
		full: "rounded-full",
	}[rounded];

	return (
		<div
			className={cn("bg-slate-200 animate-pulse", roundedClass, className)}
			style={{ width, height }}
		/>
	);
}
