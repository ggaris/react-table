/**
 * Select 渲染组件 - 状态标签显示
 * 现代化设计，带图标和动画效果
 */

import type { SelectConfig } from "../../types/valueType";

interface SelectRenderProps {
	value: unknown;
	config?: SelectConfig;
}

export function SelectRender({ value, config = {} }: SelectRenderProps) {
	const { valueEnum = {} } = config;

	// 处理空值
	if (!value) {
		return (
			<span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<title>无数据</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
				</svg>
				<span>-</span>
			</span>
		);
	}

	const enumConfig = valueEnum[String(value)];

	// 没有配置的值，显示原始值
	if (!enumConfig) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">
				{String(value)}
			</span>
		);
	}

	// 根据状态类型确定样式
	const getStatusStyles = () => {
		switch (enumConfig.status) {
			case "success":
				return {
					container: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
					icon: "text-emerald-500",
					iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // check circle
				};
			case "error":
				return {
					container: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
					icon: "text-red-500",
					iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", // x circle
				};
			case "warning":
				return {
					container: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
					icon: "text-amber-500",
					iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", // exclamation triangle
				};
			case "processing":
				return {
					container: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
					icon: "text-blue-500 animate-spin",
					iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", // refresh
				};
			case "default":
			default:
				return {
					container: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
					icon: "text-slate-500",
					iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // information circle
				};
		}
	};

	const styles = getStatusStyles();

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all duration-200 cursor-default ${styles.container}`}
		>
			<svg
				className={`w-3.5 h-3.5 ${styles.icon}`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<title>{enumConfig.text}</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d={styles.iconPath}
				/>
			</svg>
			<span>{enumConfig.text}</span>
		</span>
	);
}
