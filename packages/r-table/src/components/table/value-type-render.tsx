/**
 * ValueType 渲染器
 * 根据 valueType 渲染对应的 UI 组件
 */

import type React from "react";
import type {
	AvatarConfig,
	CodeConfig,
	DateConfig,
	DateTimeConfig,
	ImageConfig,
	MoneyConfig,
	PercentConfig,
	ProgressConfig,
	SelectConfig,
	TagConfig,
	TimeConfig,
	ValueType,
	ValueTypeConfig,
} from "../../types/valueType";

/**
 * 格式化金额
 */
export function MoneyRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: MoneyConfig;
}) {
	const { symbol = "¥", precision = 2, separator = true } = config;

	if (value === null || value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	const num = Number(value);
	if (Number.isNaN(num)) {
		return <span className="text-gray-400">-</span>;
	}

	const formatted = num.toFixed(precision);
	const parts = formatted.split(".");
	const integerPart = separator
		? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		: parts[0];
	const decimalPart = parts[1] ? `.${parts[1]}` : "";

	return (
		<span className="font-mono text-gray-900">
			{symbol}
			{integerPart}
			{decimalPart}
		</span>
	);
}

/**
 * 格式化百分比
 */
export function PercentRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: PercentConfig;
}) {
	const { precision = 2, showSymbol = true } = config;

	if (value === null || value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	const num = Number(value);
	if (Number.isNaN(num)) {
		return <span className="text-gray-400">-</span>;
	}

	const formatted = (num * 100).toFixed(precision);

	return (
		<span className="font-mono text-gray-900">
			{formatted}
			{showSymbol && "%"}
		</span>
	);
}

/**
 * 格式化日期
 */
export function DateRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: DateConfig;
}) {
	const { format = "YYYY-MM-DD" } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	try {
		const date = new Date(value as string | number | Date);
		if (Number.isNaN(date.getTime())) {
			return <span className="text-gray-400">-</span>;
		}

		// 简单的格式化实现
		const formatted = format
			.replace("YYYY", String(date.getFullYear()))
			.replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
			.replace("DD", String(date.getDate()).padStart(2, "0"));

		return <span className="text-gray-700">{formatted}</span>;
	} catch {
		return <span className="text-gray-400">-</span>;
	}
}

/**
 * 格式化日期时间
 */
export function DateTimeRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: DateTimeConfig;
}) {
	const { format = "YYYY-MM-DD HH:mm:ss" } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	try {
		const date = new Date(value as string | number | Date);
		if (Number.isNaN(date.getTime())) {
			return <span className="text-gray-400">-</span>;
		}

		// 简单的格式化实现
		const formatted = format
			.replace("YYYY", String(date.getFullYear()))
			.replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
			.replace("DD", String(date.getDate()).padStart(2, "0"))
			.replace("HH", String(date.getHours()).padStart(2, "0"))
			.replace("mm", String(date.getMinutes()).padStart(2, "0"))
			.replace("ss", String(date.getSeconds()).padStart(2, "0"));

		return <span className="text-gray-700">{formatted}</span>;
	} catch {
		return <span className="text-gray-400">-</span>;
	}
}

/**
 * 格式化时间
 */
export function TimeRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: TimeConfig;
}) {
	const { format = "HH:mm:ss" } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	try {
		const date = new Date(value as string | number | Date);
		if (Number.isNaN(date.getTime())) {
			return <span className="text-gray-400">-</span>;
		}

		// 简单的格式化实现
		const formatted = format
			.replace("HH", String(date.getHours()).padStart(2, "0"))
			.replace("mm", String(date.getMinutes()).padStart(2, "0"))
			.replace("ss", String(date.getSeconds()).padStart(2, "0"));

		return <span className="text-gray-700">{formatted}</span>;
	} catch {
		return <span className="text-gray-400">-</span>;
	}
}

/**
 * 数字渲染
 */
export function DigitRender({ value }: { value: unknown }) {
	if (value === null || value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	const num = Number(value);
	if (Number.isNaN(num)) {
		return <span className="text-gray-400">-</span>;
	}

	return (
		<span className="font-mono text-gray-900">{num.toLocaleString()}</span>
	);
}

/**
 * 选择器渲染（带状态标签）
 */
export function SelectRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: SelectConfig;
}) {
	const { valueEnum = {} } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	const enumConfig = valueEnum[String(value)];
	if (!enumConfig) {
		return <span className="text-gray-700">{String(value)}</span>;
	}

	const statusColors = {
		success: "bg-green-100 text-green-800",
		error: "bg-red-100 text-red-800",
		warning: "bg-yellow-100 text-yellow-800",
		processing: "bg-blue-100 text-blue-800",
		default: "bg-gray-100 text-gray-800",
	};

	const colorClass =
		statusColors[enumConfig.status || "default"] || statusColors.default;

	return (
		<span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
			{enumConfig.text}
		</span>
	);
}

/**
 * 进度条渲染
 */
export function ProgressRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: ProgressConfig;
}) {
	const { color = "bg-blue-500", showInfo = true } = config;

	if (value === null || value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	const num = Number(value);
	if (Number.isNaN(num)) {
		return <span className="text-gray-400">-</span>;
	}

	const progress = Math.max(0, Math.min(100, num));

	return (
		<div className="flex items-center gap-2">
			<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
				<div
					className={`h-full ${color} transition-all`}
					style={{ width: `${progress}%` }}
				/>
			</div>
			{showInfo && (
				<span className="text-xs text-gray-600 w-10">{progress}%</span>
			)}
		</div>
	);
}

/**
 * 头像渲染
 */
export function AvatarRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: AvatarConfig;
}) {
	const { size = "default", shape = "circle" } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	const sizeMap = {
		small: "w-6 h-6",
		default: "w-8 h-8",
		large: "w-12 h-12",
	};

	const sizeClass =
		typeof size === "number" ? "" : sizeMap[size] || sizeMap.default;
	const style = typeof size === "number" ? { width: size, height: size } : {};
	const shapeClass = shape === "circle" ? "rounded-full" : "rounded";

	return (
		<img
			src={String(value)}
			alt="avatar"
			className={`${sizeClass} ${shapeClass} object-cover`}
			style={style}
		/>
	);
}

/**
 * 图片渲染
 */
export function ImageRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: ImageConfig;
}) {
	const { width = 100, height } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	return (
		<img
			src={String(value)}
			alt="image"
			className="rounded object-cover"
			style={{ width, height }}
		/>
	);
}

/**
 * 代码块渲染
 */
export function CodeRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: CodeConfig;
}) {
	const { language = "" } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	return (
		<pre className="bg-gray-900 text-gray-100 px-3 py-2 rounded text-xs overflow-x-auto max-w-md">
			<code data-language={language}>{String(value)}</code>
		</pre>
	);
}

/**
 * JSON 代码渲染
 */
export function JsonCodeRender({ value }: { value: unknown }) {
	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	try {
		const formatted =
			typeof value === "string" ? value : JSON.stringify(value, null, 2);

		return (
			<pre className="bg-gray-900 text-gray-100 px-3 py-2 rounded text-xs overflow-x-auto max-w-md">
				<code>{formatted}</code>
			</pre>
		);
	} catch {
		return <span className="text-gray-400">-</span>;
	}
}

/**
 * 标签渲染
 */
export function TagRender({
	value,
	config = {},
}: {
	value: unknown;
	config?: TagConfig;
}) {
	const { colorMap = {} } = config;

	if (!value) {
		return <span className="text-gray-400">-</span>;
	}

	const valueStr = String(value);
	const color = colorMap[valueStr] || "bg-blue-100 text-blue-800";

	return (
		<span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
			{valueStr}
		</span>
	);
}

/**
 * 文本渲染（默认）
 */
export function TextRender({ value }: { value: unknown }) {
	if (value === null || value === undefined) {
		return <span className="text-gray-400">-</span>;
	}

	return <span className="text-gray-900">{String(value)}</span>;
}

/**
 * 根据 valueType 获取对应的渲染组件
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
		case "avatar":
			return <AvatarRender value={value} config={config as AvatarConfig} />;
		case "image":
			return <ImageRender value={value} config={config as ImageConfig} />;
		case "code":
			return <CodeRender value={value} config={config as CodeConfig} />;
		case "jsonCode":
			return <JsonCodeRender value={value} />;
		case "tag":
			return <TagRender value={value} config={config as TagConfig} />;
		case "text":
		default:
			return <TextRender value={value} />;
	}
}
