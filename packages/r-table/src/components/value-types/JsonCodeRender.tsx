/**
 * JsonCode 渲染组件 - JSON 代码显示
 * 带复制功能和格式化显示
 */

import React from "react";

interface JsonCodeRenderProps {
	value: unknown;
}

export function JsonCodeRender({ value }: JsonCodeRenderProps) {
	const [copied, setCopied] = React.useState(false);

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	try {
		const formatted =
			typeof value === "string" ? value : JSON.stringify(value, null, 2);

		// 复制到剪贴板
		const handleCopy = async () => {
			try {
				await navigator.clipboard.writeText(formatted);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy:", err);
			}
		};

		return (
			<div className="relative group max-w-2xl">
				<pre className="bg-slate-900 text-slate-100 px-4 py-3 rounded-lg text-xs overflow-x-auto max-h-64 border border-slate-700 shadow-md">
					<code className="font-mono">{formatted}</code>
				</pre>

				{/* 复制按钮 */}
				<button
					type="button"
					onClick={handleCopy}
					className="absolute top-2 right-2 p-1.5 bg-slate-700/80 hover:bg-slate-600 text-slate-300 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
					title={copied ? "已复制!" : "复制 JSON"}
				>
					{copied ? (
						<svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<title>已复制</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					) : (
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<title>复制</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					)}
				</button>

				{/* JSON 标签 */}
				<div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600/80 text-white text-xs rounded font-mono font-semibold">
					JSON
				</div>
			</div>
		);
	} catch {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<title>错误</title>
					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
				</svg>
				<span>无效 JSON</span>
			</span>
		);
	}
}
