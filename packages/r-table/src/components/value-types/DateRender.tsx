/**
 * Date 渲染组件 - 日期显示
 * 统一的现代化日期显示风格
 */

import type { DateConfig } from "../../types/valueType";
import { VALUE_TYPE_CONTAINER } from "../../styles/constants";
import { EmptyState, ErrorBadge } from "../ui";
import { CalendarIcon } from "../ui/icons";

interface DateRenderProps {
	value: unknown;
	config?: DateConfig;
}

export function DateRender({ value, config = {} }: DateRenderProps) {
	const { format = "YYYY-MM-DD" } = config;

	// 处理空值
	if (!value) {
		return <EmptyState icon={<CalendarIcon />} align="left" />;
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
			.replace("DD", String(date.getDate()).padStart(2, "0"));

		return (
			<span className={`${VALUE_TYPE_CONTAINER} justify-center bg-slate-50 text-slate-700 text-sm border-slate-200 hover:bg-slate-100`}>
				<CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
				<span className="font-mono text-xs tabular-nums">{formatted}</span>
			</span>
		);
	} catch {
		return <ErrorBadge />;
	}
}
