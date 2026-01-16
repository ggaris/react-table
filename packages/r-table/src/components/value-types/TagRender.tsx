/**
 * Tag 渲染组件 - 标签显示
 * 现代化设计，支持自定义颜色
 */

import type { TagConfig } from "../../types/valueType";
import { VALUE_TYPE_CONTAINER } from "../../styles/constants";
import { EmptyState, Centered } from "../ui";
import { TagIcon } from "../ui/icons";

interface TagRenderProps {
	value: unknown;
	config?: TagConfig;
}

export function TagRender({ value, config = {} }: TagRenderProps) {
	const { colorMap = {} } = config;

	// 处理空值
	if (!value) {
		return <EmptyState icon={<TagIcon className="w-3.5 h-3.5" title="无数据" />} />;
	}

	const valueStr = String(value);
	const colorClass = colorMap[valueStr] || "bg-blue-50 text-blue-700";

	return (
		<Centered>
			<span
				className={`${VALUE_TYPE_CONTAINER} text-xs font-medium border-transparent hover:scale-105 ${colorClass}`}
			>
				<TagIcon className="w-3 h-3 opacity-70" />
				<span>{valueStr}</span>
			</span>
		</Centered>
	);
}
