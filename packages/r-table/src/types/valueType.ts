/**
 * ValueType 类型定义
 * 参考 Ant Design Pro Components 的 valueType 设计
 */

import type React from "react";

/**
 * 支持的 valueType 类型
 */
export type ValueType =
	| "text" // 文本
	| "digit" // 数字
	| "money" // 金额
	| "percent" // 百分比
	| "date" // 日期
	| "dateTime" // 日期时间
	| "time" // 时间
	| "dateRange" // 日期区间
	| "dateTimeRange" // 日期时间区间
	| "select" // 选择器
	| "progress" // 进度条
	| "avatar" // 头像
	| "image" // 图片
	| "code" // 代码块
	| "jsonCode" // JSON 代码
	| "tag" // 标签
	| "option"; // 操作列

/**
 * 金额配置
 */
export interface MoneyConfig {
	/** 货币符号，默认 ¥ */
	symbol?: string;
	/** 小数位数，默认 2 */
	precision?: number;
	/** 千分位分隔符，默认 true */
	separator?: boolean;
}

/**
 * 百分比配置
 */
export interface PercentConfig {
	/** 小数位数，默认 2 */
	precision?: number;
	/** 是否显示符号，默认 true */
	showSymbol?: boolean;
}

/**
 * 日期配置
 */
export interface DateConfig {
	/** 日期格式，默认 YYYY-MM-DD */
	format?: string;
}

/**
 * 日期时间配置
 */
export interface DateTimeConfig {
	/** 日期时间格式，默认 YYYY-MM-DD HH:mm:ss */
	format?: string;
}

/**
 * 时间配置
 */
export interface TimeConfig {
	/** 时间格式，默认 HH:mm:ss */
	format?: string;
}

/**
 * 选择器配置
 */
export interface SelectConfig {
	/** 选项映射 */
	valueEnum?: Record<
		string,
		{
			text: string;
			status?: "success" | "error" | "default" | "processing" | "warning";
		}
	>;
}

/**
 * 进度条配置
 */
export interface ProgressConfig {
	/** 进度条颜色 */
	color?: string;
	/** 是否显示文本 */
	showInfo?: boolean;
}

/**
 * 头像配置
 */
export interface AvatarConfig {
	/** 头像大小 */
	size?: "small" | "default" | "large" | number;
	/** 头像形状 */
	shape?: "circle" | "square";
}

/**
 * 图片配置
 */
export interface ImageConfig {
	/** 图片宽度 */
	width?: number;
	/** 图片高度 */
	height?: number;
}

/**
 * 代码块配置
 */
export interface CodeConfig {
	/** 语言类型 */
	language?: string;
}

/**
 * 标签配置
 */
export interface TagConfig {
	/** 标签颜色映射 */
	colorMap?: Record<string, string>;
}

/**
 * ValueType 配置联合类型
 */
export type ValueTypeConfig =
	| MoneyConfig
	| PercentConfig
	| DateConfig
	| DateTimeConfig
	| TimeConfig
	| SelectConfig
	| ProgressConfig
	| AvatarConfig
	| ImageConfig
	| CodeConfig
	| TagConfig;

/**
 * 列的 ValueType 配置
 */
export interface ColumnValueTypeConfig<TData = unknown> {
	/** ValueType 类型 */
	valueType?: ValueType;
	/** ValueType 配置，通过 fieldProps 传递 */
	fieldProps?: ValueTypeConfig;
	/** 自定义渲染函数（优先级高于 valueType） */
	render?: (value: unknown, record: TData, index: number) => React.ReactNode;
}
