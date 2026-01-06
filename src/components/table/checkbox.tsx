import React from "react";

interface CheckboxProps {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}

/**
 * Checkbox 组件
 */
export function Checkbox({
	checked,
	indeterminate = false,
	onChange,
	disabled = false,
}: CheckboxProps) {
	const ref = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (ref.current) {
			ref.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	return (
		<input
			ref={ref}
			type="checkbox"
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
			disabled={disabled}
			onClick={(e) => e.stopPropagation()}
			className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
		/>
	);
}
