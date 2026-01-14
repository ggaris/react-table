/**
 * Code 渲染组件 - 代码块显示
 * 带复制功能和语法高亮
 */

import React from "react";
import type { CodeConfig } from "../../types/valueType";

interface CodeRenderProps {
	value: unknown;
	config?: CodeConfig;
}

export function CodeRender({ value, config = {} }: CodeRenderProps) {
	const { language = "" } = config;
	const [copied, setCopied] = React.useState(false);

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	const codeString = String(value);

	// 复制到剪贴板
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeString);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className="relative group max-w-2xl">
			<pre className="bg-slate-900 text-slate-100 px-4 py-3 rounded-lg text-xs overflow-x-auto border border-slate-700 shadow-md">
				<code data-language={language} className="font-mono">
					{codeString}
				</code>
			</pre>

			{/* 复制按钮 */}
			<button
				type="button"
				onClick={handleCopy}
				className="absolute top-2 right-2 p-1.5 bg-slate-700/80 hover:bg-slate-600 text-slate-300 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
				title={copied ? "已复制!" : "复制代码"}
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

			{/* 语言标签 */}
			{language && (
				<div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-700/80 text-slate-300 text-xs rounded font-mono">
					{language}
				</div>
			)}
		</div>
	);
}
