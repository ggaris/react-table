/**
 * Digit 渲染组件 - 数字显示
 * 使用等宽字体和千分位分隔符
 */

interface DigitRenderProps {
	value: unknown;
}

export function DigitRender({ value }: DigitRenderProps) {
	// 处理空值
	if (value === null || value === undefined) {
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

	// 处理非数字值
	const num = Number(value);
	if (Number.isNaN(num)) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<title>错误</title>
					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
				</svg>
				<span>无效</span>
			</span>
		);
	}

	// 格式化数字，添加千分位分隔符
	const formatted = num.toLocaleString("zh-CN", {
		maximumFractionDigits: 2,
	});

	// 判断大小以应用不同样式
	const magnitude = Math.abs(num);
	const isMega = magnitude >= 1000000;
	const isKilo = magnitude >= 1000;

	return (
		<span className="inline-flex items-baseline gap-1">
			<span className="font-mono text-sm font-medium text-slate-900 tabular-nums transition-colors duration-200">
				{formatted}
			</span>
			{isMega && (
				<span className="text-xs text-slate-500 font-medium">M</span>
			)}
			{isKilo && !isMega && (
				<span className="text-xs text-slate-500 font-medium">K</span>
			)}
		</span>
	);
}
