/**
 * DateTime 渲染组件 - 日期时间显示
 * 统一的现代化日期时间显示风格
 */

import type { DateTimeConfig } from "../../types/valueType";
import { EmptyState, ErrorBadge, Centered } from "../ui";
import { ClockIcon } from "../ui/icons";

interface DateTimeRenderProps {
	value: unknown;
	config?: DateTimeConfig;
}

export function DateTimeRender({ value, config = {} }: DateTimeRenderProps) {
	const { format = "YYYY-MM-DD HH:mm:ss" } = config;

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
			.replace("YYYY", String(date.getFullYear()))
			.replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
			.replace("DD", String(date.getDate()).padStart(2, "0"))
			.replace("HH", String(date.getHours()).padStart(2, "0"))
			.replace("mm", String(date.getMinutes()).padStart(2, "0"))
			.replace("ss", String(date.getSeconds()).padStart(2, "0"));

		return (
			<Centered>
				<span className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200 transition-colors duration-200 hover:bg-blue-100">
					<ClockIcon className="w-3.5 h-3.5 text-blue-500" title="日期时间" />
					<span className="font-mono text-xs tabular-nums">{formatted}</span>
				</span>
			</Centered>
		);
	} catch {
		return <ErrorBadge />;
	}
}
