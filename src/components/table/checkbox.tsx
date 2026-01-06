import React from "react";

interface CheckboxProps {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	ariaLabel?: string;
}

/**
 * Checkbox 组件 - 优化的企业级复选框
 */
export function Checkbox({
	checked,
	indeterminate = false,
	onChange,
	disabled = false,
	ariaLabel,
}: CheckboxProps) {
	const ref = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (ref.current) {
			ref.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	return (
		<label className="inline-flex items-center justify-center cursor-pointer">
			<input
				ref={ref}
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				onClick={(e) => e.stopPropagation()}
				aria-label={ariaLabel}
				className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded transition-all duration-150 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-blue-500 checked:bg-blue-600 checked:border-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer motion-reduce:transition-none"
			/>
		</label>
	);
}
