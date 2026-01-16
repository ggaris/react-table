/**
 * Time 渲染组件 - 时间显示
 * 统一的现代化时间显示风格
 */

import type { TimeConfig } from "../../types/valueType";
import { EmptyState, ErrorBadge, Centered } from "../ui";
import { ClockIcon } from "../ui/icons";

interface TimeRenderProps {
	value: unknown;
	config?: TimeConfig;
}

export function TimeRender({ value, config = {} }: TimeRenderProps) {
	const { format = "HH:mm:ss" } = config;

	// 处理空值
	if (!value) {
		return <EmptyState icon={<ClockIcon />} />;
	}

	try {
		const date = new Date(value as string | number | Date);
		if (Number.isNaN(date.getTime())) {
			return <ErrorBadge />;
		}

		// 简单的格式化实现
		const formatted = format
			.replace("HH", String(date.getHours()).padStart(2, "0"))
			.replace("mm", String(date.getMinutes()).padStart(2, "0"))
			.replace("ss", String(date.getSeconds()).padStart(2, "0"));

		return (
			<Centered>
				<span className="inline-flex items-center gap-2 px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md border border-indigo-200 transition-colors duration-200 hover:bg-indigo-100">
					<ClockIcon className="w-3.5 h-3.5 text-indigo-500" />
					<span className="font-mono text-xs tabular-nums">{formatted}</span>
				</span>
			</Centered>
		);
	} catch {
		return <ErrorBadge />;
	}
}
