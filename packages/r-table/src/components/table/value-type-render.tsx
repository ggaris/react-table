/**
 * ValueType 渲染器 - 主入口
 * 根据 valueType 渲染对应的 UI 组件
 */

import type React from "react";
import type {
	AvatarConfig,
	CodeConfig,
	DateConfig,
	DateTimeConfig,
	GetConfigByValueType,
	ImageConfig,
	MoneyConfig,
	PercentConfig,
	ProgressConfig,
	RatingConfig,
	SelectConfig,
	TagConfig,
	TimeConfig,
	ValueType,
	ValueTypeConfig,
} from "../../types/valueType";
import {
	AvatarRender,
	CodeRender,
	DateRender,
	DateTimeRender,
	DigitRender,
	ImageRender,
	JsonCodeRender,
	MoneyRender,
	PercentRender,
	ProgressRender,
	RatingRender,
	SelectRender,
	TagRender,
	TextRender,
	TimeRender,
} from "../value-types";

/**
 * 根据 valueType 获取对应的渲染组件 - 函数重载签名
 */
// money 类型
export function getValueTypeRender(
	valueType: "money",
	value: unknown,
	config?: GetConfigByValueType<"money">,
): React.ReactNode;
// percent 类型
export function getValueTypeRender(
	valueType: "percent",
	value: unknown,
	config?: GetConfigByValueType<"percent">,
): React.ReactNode;
// date 类型
export function getValueTypeRender(
	valueType: "date",
	value: unknown,
	config?: GetConfigByValueType<"date">,
): React.ReactNode;
// dateTime 类型
export function getValueTypeRender(
	valueType: "dateTime",
	value: unknown,
	config?: GetConfigByValueType<"dateTime">,
): React.ReactNode;
// time 类型
export function getValueTypeRender(
	valueType: "time",
	value: unknown,
	config?: GetConfigByValueType<"time">,
): React.ReactNode;
// select 类型
export function getValueTypeRender(
	valueType: "select",
	value: unknown,
	config?: GetConfigByValueType<"select">,
): React.ReactNode;
// progress 类型
export function getValueTypeRender(
	valueType: "progress",
	value: unknown,
	config?: GetConfigByValueType<"progress">,
): React.ReactNode;
// rating 类型
export function getValueTypeRender(
	valueType: "rating",
	value: unknown,
	config?: GetConfigByValueType<"rating">,
): React.ReactNode;
// avatar 类型
export function getValueTypeRender(
	valueType: "avatar",
	value: unknown,
	config?: GetConfigByValueType<"avatar">,
): React.ReactNode;
// image 类型
export function getValueTypeRender(
	valueType: "image",
	value: unknown,
	config?: GetConfigByValueType<"image">,
): React.ReactNode;
// code 类型
export function getValueTypeRender(
	valueType: "code",
	value: unknown,
	config?: GetConfigByValueType<"code">,
): React.ReactNode;
// tag 类型
export function getValueTypeRender(
	valueType: "tag",
	value: unknown,
	config?: GetConfigByValueType<"tag">,
): React.ReactNode;
// 其他不需要配置的类型
export function getValueTypeRender(
	valueType: "text" | "digit" | "jsonCode" | undefined,
	value: unknown,
	config?: undefined,
): React.ReactNode;
// 通用签名
export function getValueTypeRender(
	valueType: ValueType | undefined,
	value: unknown,
	config?: ValueTypeConfig,
): React.ReactNode;

/**
 * 根据 valueType 获取对应的渲染组件 - 实现
 * @param valueType 值类型
 * @param value 值
 * @param config 配置项
 * @returns 渲染的组件
 */
export function getValueTypeRender(
	valueType: ValueType | undefined,
	value: unknown,
	config?: ValueTypeConfig,
): React.ReactNode {
	if (!valueType) {
		return <TextRender value={value} />;
	}

	switch (valueType) {
		case "money":
			return <MoneyRender value={value} config={config as MoneyConfig} />;
		case "percent":
			return <PercentRender value={value} config={config as PercentConfig} />;
		case "date":
			return <DateRender value={value} config={config as DateConfig} />;
		case "dateTime":
			return <DateTimeRender value={value} config={config as DateTimeConfig} />;
		case "time":
			return <TimeRender value={value} config={config as TimeConfig} />;
		case "digit":
			return <DigitRender value={value} />;
		case "select":
			return <SelectRender value={value} config={config as SelectConfig} />;
		case "progress":
			return <ProgressRender value={value} config={config as ProgressConfig} />;
		case "rating":
			return <RatingRender value={value} config={config as RatingConfig} />;
		case "avatar":
			return <AvatarRender value={value} config={config as AvatarConfig} />;
		case "image":
			return <ImageRender value={value} config={config as ImageConfig} />;
		case "jsonCode":
			return <JsonCodeRender value={value} />;
		case "tag":
			return <TagRender value={value} config={config as TagConfig} />;
		case "text":
			return <TextRender value={value} />;
		default:
			return <TextRender value={value} />;
	}
}
