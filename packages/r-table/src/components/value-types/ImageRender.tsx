/**
 * Image 渲染组件 - 图片显示
 * 带加载状态、错误处理和预览功能
 */

import React from "react";
import type { ImageConfig } from "../../types/valueType";
import { EmptyState, Centered, Skeleton } from "../ui";
import { ImageIcon, ZoomIcon } from "../ui/icons";

interface ImageRenderProps {
	value: unknown;
	config?: ImageConfig;
}

export function ImageRender({ value, config = {} }: ImageRenderProps) {
	const { width = 100, height } = config;
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [preview, setPreview] = React.useState(false);

	// 处理图片点击，阻止事件冒泡
	const handleImageClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // 阻止事件冒泡到表格行
		setPreview(true);
	};

	// 关闭预览
	const handleClosePreview = (e: React.MouseEvent) => {
		e.stopPropagation();
		setPreview(false);
	};

	// 处理空值
	if (!value) {
		return <EmptyState icon={<ImageIcon />} />;
	}

	// 处理错误状态
	if (error) {
		return (
			<Centered>
				<div
					className="inline-flex items-center justify-center bg-slate-100 border-2 border-slate-200 rounded-md overflow-hidden"
					style={{ width, height }}
				>
					<ImageIcon className="w-1/2 h-1/2 text-slate-400" title="加载失败" />
				</div>
			</Centered>
		);
	}

	return (
		<>
			<Centered>
				<div className="relative inline-block group">
					{/* 加载骨架屏 */}
					{loading && (
						<Skeleton width={width} height={height} />
					)}

					{/* 图片 */}
					<img
						src={String(value)}
						alt="image"
						onClick={handleImageClick}
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
						<div
							className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-md transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none"
						>
							<ZoomIcon className="w-6 h-6 text-white" />
						</div>
					)}
				</div>
			</Centered>

			{/* 图片预览模态框 */}
			{preview && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
					onClick={handleClosePreview}
				>
					<div className="relative max-w-7xl max-h-[90vh] p-4">
						<img
							src={String(value)}
							alt="preview"
							className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						/>
						{/* 关闭按钮 */}
						<button
							type="button"
							onClick={handleClosePreview}
							className="absolute top-6 right-6 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200"
							aria-label="关闭预览"
						>
							<svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<title>关闭</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</>
	);
}
