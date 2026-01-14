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
	| "rating" // 评分
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
	/** 是否显示进度条，默认 false */
	showProgressBar?: boolean;
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
 * 评分配置
 */
export interface RatingConfig {
	/** 最大评分，默认 5 */
	max?: number;
	/** 是否显示数值，默认 true */
	showValue?: boolean;
	/** 星星颜色，默认 text-yellow-400 */
	color?: string;
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
	| RatingConfig
	| AvatarConfig
	| ImageConfig
	| CodeConfig
	| TagConfig;

/**
 * ValueType 到配置类型的映射
 */
export interface ValueTypeConfigMap {
	text: never;
	digit: never;
	money: MoneyConfig;
	percent: PercentConfig;
	date: DateConfig;
	dateTime: DateTimeConfig;
	time: TimeConfig;
	dateRange: never;
	dateTimeRange: never;
	select: SelectConfig;
	progress: ProgressConfig;
	rating: RatingConfig;
	avatar: AvatarConfig;
	image: ImageConfig;
	code: CodeConfig;
	jsonCode: never;
	tag: TagConfig;
	option: never;
}

/**
 * 根据 ValueType 获取对应的配置类型
 */
export type GetConfigByValueType<T extends ValueType> =
	ValueTypeConfigMap[T] extends never ? undefined : ValueTypeConfigMap[T];

/**
 * 列的 ValueType 配置（无泛型版本）
 */
export interface ColumnValueTypeConfig<TData = unknown> {
	/** ValueType 类型 */
	valueType?: ValueType;
	/** ValueType 配置，通过 fieldProps 传递 */
	fieldProps?: ValueTypeConfig;
	/** 文本对齐方式，优先级高于 valueType 默认对齐 */
	align?: "left" | "center" | "right";
	/** 列固定位置 */
	fixed?: "left" | "right";
	/** 自定义渲染函数（优先级高于 valueType） */
	render?: (value: unknown, record: TData, index: number) => React.ReactNode;
}

/**
 * 列的 ValueType 配置（带类型约束的版本）
 * 根据 valueType 自动约束 fieldProps 类型
 */
export type TypedColumnValueTypeConfig<
	TData = unknown,
	T extends ValueType = ValueType,
> = {
	/** ValueType 类型 */
	valueType?: T;
	/** ValueType 配置，根据 valueType 自动推断类型 */
	fieldProps?: GetConfigByValueType<T>;
	/** 文本对齐方式，优先级高于 valueType 默认对齐 */
	align?: "left" | "center" | "right";
	/** 列固定位置 */
	fixed?: "left" | "right";
	/** 自定义渲染函数（优先级高于 valueType） */
	render?: (value: unknown, record: TData, index: number) => React.ReactNode;
};

/**
 * 创建类型安全的列配置辅助类型
 * 用于确保 valueType 和 fieldProps 类型匹配
 */
export type CreateColumnConfig<TData = unknown> =
	| TypedColumnValueTypeConfig<TData, "money">
	| TypedColumnValueTypeConfig<TData, "percent">
	| TypedColumnValueTypeConfig<TData, "date">
	| TypedColumnValueTypeConfig<TData, "dateTime">
	| TypedColumnValueTypeConfig<TData, "time">
	| TypedColumnValueTypeConfig<TData, "select">
	| TypedColumnValueTypeConfig<TData, "progress">
	| TypedColumnValueTypeConfig<TData, "rating">
	| TypedColumnValueTypeConfig<TData, "avatar">
	| TypedColumnValueTypeConfig<TData, "image">
	| TypedColumnValueTypeConfig<TData, "code">
	| TypedColumnValueTypeConfig<TData, "tag">
	| TypedColumnValueTypeConfig<TData, "text">
	| TypedColumnValueTypeConfig<TData, "digit">
	| TypedColumnValueTypeConfig<TData, "jsonCode">;

/**
 * 根据 ValueType 获取默认的文本对齐方式
 */
export function getDefaultAlign(
	valueType?: ValueType,
): "left" | "center" | "right" {
	if (!valueType) return "left";

	// 数字类型：右对齐
	if (
		["digit", "money", "percent", "progress", "rating"].includes(valueType)
	) {
		return "right";
	}

	// 时间、状态和图片类型：居中
	if (
		["date", "dateTime", "time", "tag", "select", "image", "avatar"].includes(
			valueType,
		)
	) {
		return "center";
	}

	// 文本类型：左对齐（默认）
	return "left";
}
