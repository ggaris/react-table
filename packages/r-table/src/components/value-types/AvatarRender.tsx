/**
 * Avatar 渲染组件 - 头像显示
 * 带加载状态和错误处理
 */

import React from "react";
import type { AvatarConfig } from "../../types/valueType";
import { EmptyState, Centered, Skeleton } from "../ui";
import { UserIcon } from "../ui/icons";
import { cn } from "../../styles/constants";

interface AvatarRenderProps {
	value: unknown;
	config?: AvatarConfig;
}

// 尺寸映射
const SIZE_MAP = {
	small: "w-6 h-6",
	default: "w-8 h-8",
	large: "w-12 h-12",
} as const;

export function AvatarRender({ value, config = {} }: AvatarRenderProps) {
	const { size = "default", shape = "circle" } = config;
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);

	// 处理空值
	if (!value) {
		return <EmptyState icon={<UserIcon />} />;
	}

	const sizeClass = typeof size === "number" ? "" : SIZE_MAP[size] || SIZE_MAP.default;
	const style = typeof size === "number" ? { width: size, height: size } : {};
	const shapeClass = shape === "circle" ? "rounded-full" : "rounded-md";

	// 处理错误状态
	if (error) {
		return (
			<Centered>
				<div
					className={cn(sizeClass, shapeClass, "bg-slate-100 border-2 border-slate-200 flex items-center justify-center")}
					style={style}
				>
					<UserIcon className="w-1/2 h-1/2 text-slate-400" title="加载失败" />
				</div>
			</Centered>
		);
	}

	return (
		<Centered>
			<div className="relative inline-block">
				{/* 加载骨架屏 */}
				{loading && (
					<Skeleton
						width={typeof size === "number" ? size : undefined}
						height={typeof size === "number" ? size : undefined}
						className={cn(sizeClass)}
						rounded={shape === "circle" ? "full" : "md"}
					/>
				)}

				{/* 图片 */}
				<img
					src={String(value)}
					alt="avatar"
					className={cn(
						sizeClass,
						shapeClass,
						"object-cover border-2 border-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg",
						loading ? "opacity-0 absolute" : "opacity-100"
					)}
					style={style}
					onLoad={() => setLoading(false)}
					onError={() => {
						setLoading(false);
						setError(true);
					}}
				/>
			</div>
		</Centered>
	);
}
