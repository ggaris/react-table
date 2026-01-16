import type { Key } from "react";
import type { DensityType } from "./toolbar";
import type { ProColumnDef } from "../../utils/valueType";
import type { ValueType, ValueTypeConfig } from "../../types/valueType";

interface TableSkeletonProps<TData> {
	rowKey: keyof TData;
	rows?: number;
	columns?: number;
	hasSelection?: boolean;
	density?: DensityType;
	columnDefs?: ProColumnDef<TData>[]; // 列定义,用于推断骨架高度
}

/**
 * 根据 valueType 和配置推断骨架屏高度
 * 返回 Tailwind CSS 高度类名
 */
function getSkeletonHeightByValueType(
	valueType?: ValueType,
	fieldProps?: ValueTypeConfig,
): string {
	if (!valueType) return "h-4"; // 默认文本高度 16px

	switch (valueType) {
		case "avatar": {
			// 头像高度根据 size 配置
			const avatarConfig = fieldProps as any;
			const size = avatarConfig?.size || "default";
			if (size === "small") return "h-6"; // 24px
			if (size === "large") return "h-12"; // 48px
			if (typeof size === "number") {
				// 自定义数字大小,需要返回内联样式
				return `h-[${size}px]`;
			}
			return "h-8"; // default: 32px
		}
		case "image": {
			// 图片高度根据配置,默认 80px
			const imageConfig = fieldProps as any;
			const height = imageConfig?.height || 80;
			if (height === 80) return "h-20"; // 默认 80px
			return `h-[${height}px]`; // 自定义高度
		}
		case "code":
		case "jsonCode":
			// 代码块通常较高,估算为 64px
			return "h-16";
		case "progress":
		case "rating":
			// 进度条和评分组件约 24px
			return "h-6";
		case "digit":
		case "money":
		case "percent":
		case "text":
		case "date":
		case "dateTime":
		case "time":
		case "dateRange":
		case "dateTimeRange":
		case "select":
		case "tag":
		case "option":
		default:
			// 标准文本类型 16px
			return "h-4";
	}
}

/**
 * 表格加载骨架屏组件 - 优化的加载动画
 */
export const TableSkeleton = <TData,>({
	rowKey,
	rows = 5,
	columns = 4,
	hasSelection = false,
	density = "default",
	columnDefs,
}: TableSkeletonProps<TData>) => {
	const densityPadding = {
		compact: "px-4 py-2",
		default: "px-6 py-4",
		comfortable: "px-8 py-6",
	};

	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<tr
					key={`${String(rowKey)}-skeleton-${rowIndex}`}
					className="border-b border-gray-100 last:border-b-0 animate-pulse"
					style={{
						animationDelay: `${rowIndex * 50}ms`,
					}}
				>
					{/* 选择列骨架 */}
					{hasSelection && (
						<td className={`${densityPadding[density]} w-16 text-center`}>
							<div className="inline-block w-4 h-4 bg-gray-200 rounded" />
						</td>
					)}

					{/* 数据列骨架 */}
					{Array.from({ length: columns }).map((_, colIndex) => {
						// 如果提供了列定义,根据 valueType 推断高度
						const columnDef = columnDefs?.[colIndex];
						const heightClass = columnDef
							? getSkeletonHeightByValueType(
									columnDef.valueType,
									columnDef.fieldProps,
							  )
							: "h-4"; // 未提供列定义时使用默认高度

						return (
							<td
								key={`${String(rowKey)}-skeleton-col-${colIndex}`}
								className={densityPadding[density]}
							>
								<div className="flex items-center">
									<div
										className={`${heightClass} bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded`}
										style={{
											width: `${Math.random() * 30 + 50}%`,
											backgroundSize: "200% 100%",
											animation: "shimmer 1.5s infinite",
										}}
									/>
								</div>
							</td>
						);
					})}
				</tr>
			))}
			<style>{`
				@keyframes shimmer {
					0% {
						background-position: -200% 0;
					}
					100% {
						background-position: 200% 0;
					}
				}
			`}</style>
		</>
	);
};
