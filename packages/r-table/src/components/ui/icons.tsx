/**
 * 共享图标组件
 * 将重复使用的 SVG 图标提取为组件，便于统一管理
 */

import type { SVGProps } from "react";

// 基础图标属性
interface IconProps extends SVGProps<SVGSVGElement> {
	title?: string;
}

// 默认图标样式
const defaultIconProps: Partial<IconProps> = {
	fill: "none",
	stroke: "currentColor",
	viewBox: "0 0 24 24",
};

/**
 * 空数据图标 - 横线
 */
export function EmptyLineIcon({ title = "无数据", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
		</svg>
	);
}

/**
 * 日历图标
 */
export function CalendarIcon({ title = "日期", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		</svg>
	);
}

/**
 * 时钟图标
 */
export function ClockIcon({ title = "时间", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

/**
 * 图片图标
 */
export function ImageIcon({ title = "图片", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		</svg>
	);
}

/**
 * 用户/头像图标
 */
export function UserIcon({ title = "用户", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
			/>
		</svg>
	);
}

/**
 * 标签图标
 */
export function TagIcon({ title = "标签", className = "w-3 h-3", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
			/>
		</svg>
	);
}

/**
 * 文档图标
 */
export function DocumentIcon({ title = "文档", className = "w-10 h-10", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} aria-hidden="true" {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
	);
}

/**
 * 刷新图标
 */
export function RefreshIcon({ title = "刷新", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
			/>
		</svg>
	);
}

/**
 * 密度/菜单图标
 */
export function MenuIcon({ title = "菜单", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	);
}

/**
 * 勾选图标（填充）
 */
export function CheckIcon({ title = "已选中", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} fill="currentColor" viewBox="0 0 20 20" {...props}>
			<title>{title}</title>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

/**
 * 升序排序图标
 */
export function SortAscIcon({ title = "升序排序", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
		</svg>
	);
}

/**
 * 降序排序图标
 */
export function SortDescIcon({ title = "降序排序", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
		</svg>
	);
}

/**
 * 可排序图标
 */
export function SortIcon({ title = "可排序", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
			/>
		</svg>
	);
}

/**
 * 首页图标（双箭头左）
 */
export function FirstPageIcon({ title = "首页", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
		</svg>
	);
}

/**
 * 上一页图标（箭头左）
 */
export function PrevPageIcon({ title = "上一页", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
		</svg>
	);
}

/**
 * 下一页图标（箭头右）
 */
export function NextPageIcon({ title = "下一页", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
		</svg>
	);
}

/**
 * 末页图标（双箭头右）
 */
export function LastPageIcon({ title = "末页", className = "w-4 h-4", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
		</svg>
	);
}

/**
 * 错误/警告图标（填充）
 */
export function ErrorIcon({ title = "错误", className = "w-3 h-3", ...props }: IconProps) {
	return (
		<svg className={className} fill="currentColor" viewBox="0 0 20 20" {...props}>
			<title>{title}</title>
			<path
				fillRule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

/**
 * 成功图标（勾选圆圈）
 */
export function SuccessCircleIcon({ title = "成功", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

/**
 * 错误圆圈图标
 */
export function ErrorCircleIcon({ title = "错误", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

/**
 * 警告三角图标
 */
export function WarningIcon({ title = "警告", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
	);
}

/**
 * 信息圆圈图标
 */
export function InfoCircleIcon({ title = "信息", className = "w-3.5 h-3.5", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

/**
 * 放大镜图标
 */
export function ZoomIcon({ title = "查看", className = "w-6 h-6", ...props }: IconProps) {
	return (
		<svg className={className} {...defaultIconProps} {...props}>
			<title>{title}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
			/>
		</svg>
	);
}
