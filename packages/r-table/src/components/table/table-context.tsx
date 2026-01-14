import React from "react";
import type { DensityType } from "./toolbar";

/**
 * 表格全局配置类型
 */
export interface TableConfig {
	/** 分页字段映射配置 */
	paginationKeys?: {
		/** 当前页码字段名（默认：'current'） */
		current?: string;
		/** 每页大小字段名（默认：'size'） */
		size?: string;
		/** 数据数组字段名（默认：'data'） */
		data?: string;
		/** 总数字段名（默认：'total'） */
		total?: string;
	};
	/** 默认功能开关 */
	defaultFeatures?: {
		/** 默认是否启用行选择（默认：false） */
		enableRowSelection?: boolean;
		/** 默认是否启用排序（默认：true） */
		enableSorting?: boolean;
		/** 默认是否启用分页（默认：true） */
		enablePagination?: boolean;
		/** 默认是否显示工具栏（默认：true） */
		showToolBar?: boolean;
	};
	/** 默认 UI 配置 */
	defaultUI?: {
		/** 默认密度（默认：'default'） */
		density?: DensityType;
		/** 默认每页条数（默认：10） */
		pageSize?: number;
		/** 分页大小选项（默认：[10, 20, 30, 40, 50]） */
		pageSizeOptions?: number[];
	};
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<TableConfig> = {
	paginationKeys: {
		current: "current",
		size: "size",
		data: "data",
		total: "total",
	},
	defaultFeatures: {
		enableRowSelection: false,
		enableSorting: true,
		enablePagination: true,
		showToolBar: true,
	},
	defaultUI: {
		density: "default",
		pageSize: 10,
		pageSizeOptions: [10, 20, 30, 40, 50],
	},
};

/**
 * 合并用户配置与默认配置
 */
function mergeConfig(userConfig?: TableConfig): Required<TableConfig> {
	return {
		paginationKeys: {
			...DEFAULT_CONFIG.paginationKeys,
			...userConfig?.paginationKeys,
		},
		defaultFeatures: {
			...DEFAULT_CONFIG.defaultFeatures,
			...userConfig?.defaultFeatures,
		},
		defaultUI: {
			...DEFAULT_CONFIG.defaultUI,
			...userConfig?.defaultUI,
		},
	};
}

/**
 * 表格配置 Context
 */
const TableConfigContext = React.createContext<Required<TableConfig>>(
	DEFAULT_CONFIG,
);

/**
 * TableProvider Props
 */
export interface TableProviderProps {
	/** 子组件 */
	children: React.ReactNode;
	/** 用户自定义配置 */
	config?: TableConfig;
}

/**
 * 表格配置 Provider 组件
 * 用于在应用顶层提供全局表格配置
 *
 * @example
 * ```tsx
 * <TableProvider config={{
 *   paginationKeys: {
 *     current: 'pageNum',
 *     size: 'pageSize'
 *   },
 *   defaultFeatures: {
 *     enableRowSelection: true
 *   },
 *   defaultUI: {
 *     density: 'compact',
 *     pageSize: 20
 *   }
 * }}>
 *   <App />
 * </TableProvider>
 * ```
 */
export function TableProvider({ children, config }: TableProviderProps) {
	const mergedConfig = React.useMemo(() => mergeConfig(config), [config]);

	return (
		<TableConfigContext.Provider value={mergedConfig}>
			{children}
		</TableConfigContext.Provider>
	);
}

/**
 * 使用表格配置的 Hook
 * 在表格组件内部使用，获取全局配置
 * 如果没有 Provider，将返回默认配置
 *
 * @example
 * ```tsx
 * const config = useTableConfig();
 * const pageSize = config.defaultUI.pageSize;
 * ```
 */
export function useTableConfig(): Required<TableConfig> {
	const context = React.useContext(TableConfigContext);
	// 向后兼容：如果没有 Provider，返回默认配置
	return context || DEFAULT_CONFIG;
}
