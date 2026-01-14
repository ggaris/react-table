/**
 * ValueType 列定义辅助函数
 * 扩展 TanStack Table 的 ColumnDef，支持 valueType 配置
 */

import type { ColumnDef } from "@tanstack/react-table";
import type {
	ColumnValueTypeConfig,
	ValueType,
	ValueTypeConfig,
} from "../types/valueType";
import { getValueTypeRender } from "../components/table/value-type-render";

/**
 * 扩展的列定义类型，支持 valueType
 */
export type ProColumnDef<TData> = ColumnDef<TData> &
	ColumnValueTypeConfig<TData>;

/**
 * 将带有 valueType 的列定义转换为标准的 ColumnDef
 * @param column 带有 valueType 的列定义
 * @returns 标准的 TanStack Table ColumnDef
 */
export function processValueTypeColumn<TData>(
	column: ProColumnDef<TData>,
): ColumnDef<TData> {
	const { valueType, fieldProps, render, ...restColumn } = column;

	// 如果已经定义了 cell，则不处理 valueType
	if (column.cell) {
		return column as ColumnDef<TData>;
	}

	// 如果定义了 render，使用 render（优先级最高）
	if (render) {
		return {
			...restColumn,
			cell: (info) => {
				const value = info.getValue();
				const record = info.row.original;
				const index = info.row.index;
				return render(value, record, index);
			},
		} as ColumnDef<TData>;
	}

	// 如果定义了 valueType，使用 valueType 渲染
	if (valueType) {
		return {
			...restColumn,
			cell: (info) => {
				const value = info.getValue();
				return getValueTypeRender(valueType, value, fieldProps);
			},
		} as ColumnDef<TData>;
	}

	// 否则返回原始列定义
	return restColumn as ColumnDef<TData>;
}

/**
 * 批量处理带有 valueType 的列定义数组
 * @param columns 带有 valueType 的列定义数组
 * @returns 标准的 TanStack Table ColumnDef 数组
 */
export function processValueTypeColumns<TData>(
	columns: ProColumnDef<TData>[],
): ColumnDef<TData>[] {
	return columns.map((column) => processValueTypeColumn(column));
}

/**
 * 创建一个带有 valueType 的列定义辅助函数
 * 提供更好的类型提示
 */
export function defineColumn<TData>(
	column: ProColumnDef<TData>,
): ProColumnDef<TData> {
	return column;
}

/**
 * 创建带有 valueType 的列定义数组辅助函数
 * 提供更好的类型提示
 */
export function defineColumns<TData>(
	columns: ProColumnDef<TData>[],
): ProColumnDef<TData>[] {
	return columns;
}
