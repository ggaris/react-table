/**
 * Image 渲染组件 - 图片显示
 * 带加载状态、错误处理和预览功能
 */

import React from "react";
import type { ImageConfig } from "../../types/valueType";

interface ImageRenderProps {
	value: unknown;
	config?: ImageConfig;
}

export function ImageRender({ value, config = {} }: ImageRenderProps) {
	const { width = 100, height } = config;
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);

	// 处理空值
	if (!value) {
		return (
			<div className="flex justify-center">
				<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<title>无数据</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<span>-</span>
				</span>
			</div>
		);
	}

	// 处理错误状态
	if (error) {
		return (
			<div className="flex justify-center">
				<div
					className="inline-flex items-center justify-center bg-slate-100 border-2 border-slate-200 rounded-md overflow-hidden"
					style={{ width, height }}
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
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<div className="relative inline-block group">
				{/* 加载骨架屏 */}
				{loading && (
					<div
						className="bg-slate-200 animate-pulse rounded-md"
						style={{ width, height }}
					/>
				)}

				{/* 图片 */}
				<img
					src={String(value)}
					alt="image"
					className={`rounded-md object-cover border border-slate-200 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02] ${
						loading ? "opacity-0 absolute" : "opacity-100"
					}`}
					style={{ width, height }}
					onLoad={() => setLoading(false)}
					onError={() => {
						setLoading(false);
						setError(true);
					}}
				/>

				{/* 悬停时的放大镜图标 */}
				{!loading && !error && (
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-md transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>查看</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
							/>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
}
