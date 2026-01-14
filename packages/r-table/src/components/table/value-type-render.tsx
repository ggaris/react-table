/**
 * ValueType 渲染器 - 主入口
 * 根据 valueType 渲染对应的 UI 组件
 */

import type React from "react";
import type { ValueType, ValueTypeConfig } from "../../types/valueType";
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
	SelectRender,
	TagRender,
	TextRender,
	TimeRender,
} from "../value-types";

/**
 * 根据 valueType 获取对应的渲染组件
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
			return <MoneyRender value={value} config={config} />;
		case "percent":
			return <PercentRender value={value} config={config} />;
		case "date":
			return <DateRender value={value} config={config} />;
		case "dateTime":
			return <DateTimeRender value={value} config={config} />;
		case "time":
			return <TimeRender value={value} config={config} />;
		case "digit":
			return <DigitRender value={value} />;
		case "select":
			return <SelectRender value={value} config={config} />;
		case "progress":
			return <ProgressRender value={value} config={config} />;
		case "avatar":
			return <AvatarRender value={value} config={config} />;
		case "image":
			return <ImageRender value={value} config={config} />;
		case "code":
			return <CodeRender value={value} config={config} />;
		case "jsonCode":
			return <JsonCodeRender value={value} />;
		case "tag":
			return <TagRender value={value} config={config} />;
		case "text":
		default:
			return <TextRender value={value} />;
	}
}
