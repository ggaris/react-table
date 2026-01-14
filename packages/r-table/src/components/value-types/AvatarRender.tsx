/**
 * Avatar 渲染组件 - 头像显示
 * 带加载状态和错误处理
 */

import React from "react";
import type { AvatarConfig } from "../../types/valueType";

interface AvatarRenderProps {
	value: unknown;
	config?: AvatarConfig;
}

export function AvatarRender({ value, config = {} }: AvatarRenderProps) {
	const { size = "default", shape = "circle" } = config;
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	const sizeMap = {
		small: "w-6 h-6",
		default: "w-8 h-8",
		large: "w-12 h-12",
	};

	const sizeClass =
		typeof size === "number" ? "" : sizeMap[size] || sizeMap.default;
	const style = typeof size === "number" ? { width: size, height: size } : {};
	const shapeClass = shape === "circle" ? "rounded-full" : "rounded-md";

	// 处理加载和错误状态
	if (error) {
		return (
			<div
				className={`${sizeClass} ${shapeClass} bg-slate-100 border-2 border-slate-200 flex items-center justify-center`}
				style={style}
			>
				<svg
					className="w-1/2 h-1/2 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>加载失败</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			</div>
		);
	}

	return (
		<div className="relative inline-block">
			{/* 加载骨架屏 */}
			{loading && (
				<div
					className={`${sizeClass} ${shapeClass} bg-slate-200 animate-pulse`}
					style={style}
				/>
			)}

			{/* 图片 */}
			<img
				src={String(value)}
				alt="avatar"
				className={`${sizeClass} ${shapeClass} object-cover border-2 border-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${
					loading ? "opacity-0 absolute" : "opacity-100"
				}`}
				style={style}
				onLoad={() => setLoading(false)}
				onError={() => {
					setLoading(false);
					setError(true);
				}}
			/>
		</div>
	);
}
