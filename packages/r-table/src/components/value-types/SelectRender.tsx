/**
 * Select 渲染组件 - 状态标签显示
 * 现代化设计，带图标和动画效果
 */

import type { SelectConfig } from "../../types/valueType";
import { STATUS_BADGE_STYLES, VALUE_TYPE_CONTAINER } from "../../styles/constants";
import { EmptyState, Centered } from "../ui";
import {
	SuccessCircleIcon,
	ErrorCircleIcon,
	WarningIcon,
	RefreshIcon,
	InfoCircleIcon,
} from "../ui/icons";

interface SelectRenderProps {
	value: unknown;
	config?: SelectConfig;
}

// 状态图标配置
const STATUS_ICONS = {
	success: { Icon: SuccessCircleIcon, iconClass: "text-emerald-500" },
	error: { Icon: ErrorCircleIcon, iconClass: "text-red-500" },
	warning: { Icon: WarningIcon, iconClass: "text-amber-500" },
	processing: { Icon: RefreshIcon, iconClass: "text-blue-500 animate-spin" },
	default: { Icon: InfoCircleIcon, iconClass: "text-slate-500" },
} as const;

export function SelectRender({ value, config = {} }: SelectRenderProps) {
	const { valueEnum = {} } = config;

	// 处理空值
	if (!value) {
		return <EmptyState />;
	}

	const enumConfig = valueEnum[String(value)];

	// 没有配置的值，显示原始值
	if (!enumConfig) {
		return (
			<Centered>
				<span className={`${VALUE_TYPE_CONTAINER} bg-slate-100 text-slate-700 text-xs font-medium border-slate-200`}>
					{String(value)}
				</span>
			</Centered>
		);
	}

	// 获取状态样式
	const statusKey = enumConfig.status || "default";
	const containerClass = STATUS_BADGE_STYLES[statusKey] || STATUS_BADGE_STYLES.default;
	const iconConfig = STATUS_ICONS[statusKey] || STATUS_ICONS.default;
	const { Icon, iconClass } = iconConfig;

	return (
		<Centered>
			<span
				className={`${VALUE_TYPE_CONTAINER} text-xs font-semibold cursor-default ${containerClass}`}
			>
				<Icon className={`w-3.5 h-3.5 ${iconClass}`} title={enumConfig.text} />
				<span>{enumConfig.text}</span>
			</span>
		</Centered>
	);
}
