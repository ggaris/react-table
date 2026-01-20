/**
 * 共享样式常量
 * 将重复使用的 Tailwind CSS 类提取为常量，便于统一管理和维护
 */

// ========== 背景色配置 ==========
/** 主背景色配置 */
export const BG_COLORS = {
	/** 纯白背景 */
	white: "bg-white",
	/** 浅灰背景（表头、条纹行等） */
	gray50: "bg-gray-50",
	/** 中灰背景（hover次要状态） */
	gray100: "bg-gray-100",
	/** 浅蓝背景（选中、活跃状态） */
	blue50: "bg-blue-50",
	/** 深蓝背景（选中hover） */
	blue100: "bg-blue-100",
	/** 浅板岩背景（中性/默认状态） */
	slate50: "bg-slate-50",
	/** 中板岩背景（骨架屏、占位符） */
	slate100: "bg-slate-100",
	/** 深板岩背景（代码块背景） */
	slate900: "bg-slate-900",
} as const;

/** 状态背景色配置 */
export const STATE_BG_COLORS = {
	/** 成功/正常状态背景 */
	success: {
		light: "bg-emerald-50",
		base: "bg-emerald-500",
		hover: "bg-emerald-100",
	},
	/** 错误/失败状态背景 */
	error: {
		light: "bg-red-50",
		base: "bg-red-500",
		hover: "bg-red-100",
	},
	/** 警告状态背景 */
	warning: {
		light: "bg-amber-50",
		base: "bg-amber-500",
		hover: "bg-amber-100",
	},
	/** 信息状态背景 */
	info: {
		light: "bg-blue-50",
		base: "bg-blue-500",
		hover: "bg-blue-100",
	},
	/** 默认/中性状态背景 */
	default: {
		light: "bg-slate-100",
		base: "bg-slate-500",
		hover: "bg-slate-200",
	},
	/** 低优先级状态背景 */
	low: {
		light: "bg-orange-50",
		base: "bg-orange-500",
		hover: "bg-orange-100",
	},
	/** 特殊/靛蓝主题背景 */
	indigo: {
		light: "bg-indigo-50",
		base: "bg-indigo-500",
		hover: "bg-indigo-100",
	},
} as const;

/** Hover 状态背景色配置 */
export const HOVER_BG_COLORS = {
	/** 白色背景的hover */
	white: "hover:bg-gray-50",
	/** 灰色背景的hover */
	gray: "hover:bg-gray-100",
	/** 蓝色背景的hover */
	blue: "hover:bg-blue-100",
	/** 工具栏按钮hover */
	toolbar: "hover:bg-gray-100",
} as const;

/** 表格行背景色配置 */
export const ROW_BG_COLORS = {
	/** 默认行背景 */
	default: BG_COLORS.white,
	/** 偶数行背景（用于条纹） */
	even: BG_COLORS.gray50,
	/** 奇数行背景（用于条纹） */
	odd: BG_COLORS.white,
	/** 选中行背景 */
	selected: BG_COLORS.blue50,
	/** 选中行hover背景 */
	selectedHover: BG_COLORS.blue100,
} as const;

// ========== 基础过渡动画 ==========
export const TRANSITION_BASE =
	"transition-all duration-150 motion-reduce:transition-none";
export const TRANSITION_COLORS =
	"transition-colors duration-150 motion-reduce:transition-none";
export const TRANSITION_FAST =
	"transition-all duration-100 motion-reduce:transition-none";
export const TRANSITION_SLOW =
	"transition-all duration-200 motion-reduce:transition-none";

// ========== 焦点环样式 ==========
export const FOCUS_RING = "focus:outline-none focus:ring-2 focus:ring-blue-500";
export const FOCUS_RING_OFFSET =
	"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";

// ========== 工具栏按钮样式 ==========
export const TOOLBAR_BUTTON = `p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md ${TRANSITION_BASE} ${FOCUS_RING}`;

// ========== 分页按钮样式 ==========
export const PAGINATION_BUTTON = `px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 ${TRANSITION_BASE} ${FOCUS_RING}`;

// ========== 下拉菜单项样式 ==========
export const DROPDOWN_ITEM_BASE = `w-full text-left px-3 py-2 text-sm rounded-md ${TRANSITION_COLORS} flex items-center justify-between`;
export const DROPDOWN_ITEM_ACTIVE = "bg-blue-50 text-blue-600 font-medium";
export const DROPDOWN_ITEM_INACTIVE = "text-gray-700 hover:bg-gray-50";

// ========== 弹窗/下拉面板样式 ==========
export const DROPDOWN_PANEL =
	"absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in duration-150";
export const OVERLAY_BACKDROP = "fixed inset-0 z-10";

// ========== 表单输入样式 ==========
export const INPUT_BASE = `px-2 py-1.5 text-sm border border-gray-300 rounded-md ${FOCUS_RING} focus:border-transparent ${TRANSITION_BASE}`;
export const SELECT_BASE = `px-3 py-1.5 text-sm border border-gray-300 rounded-md ${FOCUS_RING} focus:border-transparent bg-white hover:bg-gray-50 ${TRANSITION_BASE} cursor-pointer`;
export const CHECKBOX_BASE = `w-4 h-4 text-blue-600 border-2 border-gray-300 rounded ${TRANSITION_BASE} ${FOCUS_RING_OFFSET} hover:border-blue-500 checked:bg-blue-600 checked:border-blue-600 cursor-pointer`;

// ========== 徽章/标签样式 ==========
export const BADGE_BASE =
	"inline-flex items-center gap-1.5 text-xs font-medium rounded-md border";
export const BADGE_SUCCESS = `${STATE_BG_COLORS.success.light} text-emerald-700 border-emerald-200`;
export const BADGE_ERROR = `${STATE_BG_COLORS.error.light} text-red-600 border-red-200`;
export const BADGE_WARNING = `${STATE_BG_COLORS.warning.light} text-amber-700 border-amber-200`;
export const BADGE_INFO = `${STATE_BG_COLORS.info.light} text-blue-700 border-blue-200`;
export const BADGE_DEFAULT = `${STATE_BG_COLORS.default.light} text-slate-700 border-slate-200`;

/** 状态徽章完整样式配置（包含 hover） */
export const STATUS_BADGE_STYLES = {
	success: `${STATE_BG_COLORS.success.light} text-emerald-700 border-emerald-200 ${STATE_BG_COLORS.success.hover}`,
	error: `${STATE_BG_COLORS.error.light} text-red-700 border-red-200 ${STATE_BG_COLORS.error.hover}`,
	warning: `${STATE_BG_COLORS.warning.light} text-amber-700 border-amber-200 ${STATE_BG_COLORS.warning.hover}`,
	info: `${STATE_BG_COLORS.info.light} text-blue-700 border-blue-200 ${STATE_BG_COLORS.info.hover}`,
	processing: `${STATE_BG_COLORS.info.light} text-blue-700 border-blue-200 ${STATE_BG_COLORS.info.hover}`,
	default: `${STATE_BG_COLORS.default.light} text-slate-700 border-slate-200 ${STATE_BG_COLORS.default.hover}`,
} as const;

// ========== 空状态样式 ==========
export const EMPTY_STATE_TEXT =
	"inline-flex items-center gap-1.5 text-slate-400 text-sm";
export const EMPTY_STATE_ICON = "w-3.5 h-3.5";

// ========== 错误状态样式 ==========
export const ERROR_BADGE =
	"inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-200";

// ========== ValueType 容器样式 ==========
/** 值类型容器内边距（统一 select、tag、rating、date、time、dateTime 等） */
export const VALUE_TYPE_PADDING = "px-8 py-1.5";
/** 值类型容器基础样式 */
export const VALUE_TYPE_CONTAINER = `inline-flex items-center gap-1.5 ${VALUE_TYPE_PADDING} rounded-md border transition-all duration-200`;

// ========== 表格相关样式 ==========
export const TABLE_HEADER_CELL =
	"text-xs font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-200 bg-gray-50 relative";
export const TABLE_BODY_CELL = "text-sm text-gray-900";
export const TABLE_ROW_HOVER = "hover:bg-gray-50";
export const TABLE_ROW_SELECTED = "bg-blue-50 hover:bg-blue-100";
export const TABLE_CONTAINER =
	"relative overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white";

// ========== 密度相关样式 ==========
export const DENSITY_PADDING = {
	compact: "px-4 py-2",
	default: "px-6 py-4",
	comfortable: "px-8 py-6",
} as const;

export const DENSITY_HEADER_PADDING = {
	compact: "px-4 py-2",
	default: "px-6 py-4",
	comfortable: "px-8 py-5",
} as const;

// ========== 文本对齐样式 ==========
export const TEXT_ALIGN = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
} as const;

// ========== 图标尺寸 ==========
export const ICON_SIZE = {
	xs: "w-3 h-3",
	sm: "w-3.5 h-3.5",
	md: "w-4 h-4",
	lg: "w-5 h-5",
	xl: "w-6 h-6",
} as const;

// ========== 固定列边框样式 ==========
export const FIXED_COLUMN_BORDER_LEFT =
	"after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[1px] after:bg-gray-300 after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]";
export const FIXED_COLUMN_BORDER_RIGHT =
	"before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-[1px] before:bg-gray-300 before:pointer-events-none before:shadow-[-2px_0_4px_rgba(0,0,0,0.08)]";
export const COLUMN_BORDER =
	"after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[1px] after:bg-gray-200 after:pointer-events-none";

// ========== 工具函数 ==========

/**
 * 合并多个 className
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

/**
 * 获取对齐样式类
 */
export function getAlignClass(
	align: "left" | "center" | "right" = "left",
): string {
	return TEXT_ALIGN[align];
}

/**
 * 获取密度内边距类
 */
export function getDensityPadding(
	density: "compact" | "default" | "comfortable" = "default",
): string {
	return DENSITY_PADDING[density];
}

/**
 * 获取密度表头内边距类
 */
export function getDensityHeaderPadding(
	density: "compact" | "default" | "comfortable" = "default",
): string {
	return DENSITY_HEADER_PADDING[density];
}

/**
 * 获取状态背景色
 * @param state 状态类型
 * @param variant 背景色变体 (light/base/hover)
 */
export function getStateBgColor(
	state: keyof typeof STATE_BG_COLORS,
	variant: "light" | "base" | "hover" = "light",
): string {
	return STATE_BG_COLORS[state][variant];
}

/**
 * 获取表格行背景色类名
 * @param isSelected 是否选中
 * @param isStriped 是否启用条纹
 * @param rowIndex 行索引
 */
export function getRowBgClasses(
	isSelected: boolean,
	isStriped: boolean = false,
	rowIndex: number = 0,
): string {
	// 选中状态优先级最高
	if (isSelected) {
		return cn(ROW_BG_COLORS.selected, HOVER_BG_COLORS.blue);
	}

	// 条纹行
	if (isStriped) {
		const bgColor = rowIndex % 2 === 0 ? ROW_BG_COLORS.even : ROW_BG_COLORS.odd;
		return cn(bgColor, HOVER_BG_COLORS.gray);
	}

	// 默认背景
	return cn(ROW_BG_COLORS.default, HOVER_BG_COLORS.white);
}

/**
 * 获取百分比/进度对应的背景色
 * @param percentage 百分比值 (0-100)
 * @param reverse 是否反转颜色（值越小颜色越好）
 */
export function getPercentageBgColor(
	percentage: number,
	reverse = false,
): { text: string; bg: string } {
	const value = reverse ? 100 - percentage : percentage;
	if (value >= 80)
		return { text: "text-emerald-600", bg: STATE_BG_COLORS.success.base };
	if (value >= 60)
		return { text: "text-blue-600", bg: STATE_BG_COLORS.info.base };
	if (value >= 40)
		return { text: "text-amber-600", bg: STATE_BG_COLORS.warning.base };
	if (value >= 20)
		return { text: "text-orange-600", bg: STATE_BG_COLORS.low.base };
	return { text: "text-red-600", bg: STATE_BG_COLORS.error.base };
}

/**
 * 获取进度条渐变色配置
 * @param progress 进度值 (0-100)
 * @param reverse 是否反转颜色（值越小颜色越好）
 */
export function getProgressGradient(
	progress: number,
	reverse = false,
): { gradient: string; text: string } {
	const value = reverse ? 100 - progress : progress;
	if (value >= 80)
		return {
			gradient: "from-emerald-500 to-emerald-400",
			text: "text-emerald-600",
		};
	if (value >= 60)
		return { gradient: "from-blue-500 to-blue-400", text: "text-blue-600" };
	if (value >= 40)
		return { gradient: "from-amber-500 to-amber-400", text: "text-amber-600" };
	if (value >= 20)
		return {
			gradient: "from-orange-500 to-orange-400",
			text: "text-orange-600",
		};
	return { gradient: "from-red-500 to-red-400", text: "text-red-600" };
}

// ========== 分页器样式常量 ==========

/** 分页器容器 */
export const PAGINATION_CONTAINER = "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm";

/** 分页器信息区 */
export const PAGINATION_INFO = "flex flex-wrap items-center gap-3 text-sm";

/** 分页器控制区 */
export const PAGINATION_CONTROLS = "flex flex-wrap items-center gap-2 w-full lg:w-auto";

/** 分页按钮组 */
export const PAGINATION_BUTTON_GROUP = "flex items-center gap-1";

/** 页码显示 */
export const PAGINATION_PAGE_DISPLAY = "px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md min-w-25 text-center";

/** 跳转按钮（CTA 样式） */
export const PAGINATION_JUMP_BUTTON = `px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${TRANSITION_BASE} ${FOCUS_RING} focus:ring-orange-500`;

/** 页码输入框 */
export const PAGINATION_INPUT = `w-16 px-2 py-1.5 text-sm text-left border border-gray-300 rounded-md ${TRANSITION_BASE} ${FOCUS_RING} focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`;

/** 每页条数选择器 */
export const PAGINATION_SELECT = `px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer ${TRANSITION_BASE} ${FOCUS_RING} focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60`;

/** 已选择项徽章 */
export const SELECTED_BADGE = "inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium";
