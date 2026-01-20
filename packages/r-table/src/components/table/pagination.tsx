/**
 * 分页器组件
 * 独立封装的分页控件，支持页码跳转、每页条数选择等功能
 */

import type { Table } from "@tanstack/react-table";
import React from "react";
import {
	PAGINATION_BUTTON,
	PAGINATION_BUTTON_GROUP,
	PAGINATION_CONTAINER,
	PAGINATION_CONTROLS,
	PAGINATION_INFO,
	PAGINATION_INPUT,
	PAGINATION_JUMP_BUTTON,
	PAGINATION_PAGE_DISPLAY,
	PAGINATION_SELECT,
	SELECTED_BADGE,
} from "../../styles/constants";
import {
	CheckIcon,
	FirstPageIcon,
	LastPageIcon,
	NextPageIcon,
	PrevPageIcon,
} from "../ui/icons";

// ========== 类型定义 ==========

export interface PaginationProps<TData> {
	/** TanStack Table 实例 */
	table: Table<TData>;
	/** 数据总数 */
	total: number;
	/** 当前选中的行数量 */
	selectedCount: number;
	/** 是否加载中 */
	loading?: boolean;
	/** 每页条数选项 */
	pageSizeOptions?: number[];
	/** 自定义类名 */
	className?: string;
}

interface PaginationButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode;
	label: string;
}

interface PaginationInfoProps {
	total: number;
	selectedCount: number;
}

interface PaginationButtonGroupProps {
	currentPage: number;
	totalPages: number;
	loading: boolean;
	onFirstPage: () => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
	onLastPage: () => void;
	canPreviousPage: boolean;
	canNextPage: boolean;
}

interface PageJumperProps {
	currentPage: number;
	totalPages: number;
	loading: boolean;
	onJump: (page: number) => void;
}

interface PageSizeSelectorProps {
	pageSize: number;
	pageSizeOptions: number[];
	loading: boolean;
	onChange: (pageSize: number) => void;
}

// ========== 基础组件 ==========

/**
 * 分页按钮组件
 */
function PaginationButton({ icon, label, ...props }: PaginationButtonProps) {
	return (
		<button
			type="button"
			className={PAGINATION_BUTTON}
			title={label}
			aria-label={label}
			{...props}
		>
			{icon}
		</button>
	);
}

/**
 * 分页信息显示组件
 */
function PaginationInfo({ total, selectedCount }: PaginationInfoProps) {
	return (
		<div className={PAGINATION_INFO}>
			<span className="text-gray-600">
				共 <span className="font-semibold text-gray-900">{total}</span> 条数据
			</span>
			{selectedCount > 0 && (
				<span className={SELECTED_BADGE}>
					<CheckIcon className="w-4 h-4" aria-hidden="true" />
					已选 {selectedCount} 条
				</span>
			)}
		</div>
	);
}

/**
 * 分页按钮组
 */
function PaginationButtonGroup({
	currentPage,
	totalPages,
	loading,
	onFirstPage,
	onPreviousPage,
	onNextPage,
	onLastPage,
	canPreviousPage,
	canNextPage,
}: PaginationButtonGroupProps) {
	return (
		<div className={PAGINATION_BUTTON_GROUP}>
			<PaginationButton
				icon={<FirstPageIcon />}
				label="第一页"
				onClick={onFirstPage}
				disabled={loading || !canPreviousPage}
			/>
			<PaginationButton
				icon={<PrevPageIcon />}
				label="上一页"
				onClick={onPreviousPage}
				disabled={loading || !canPreviousPage}
			/>

			{/* 页码显示 */}
			<span className={PAGINATION_PAGE_DISPLAY}>
				{currentPage} / {totalPages}
			</span>

			<PaginationButton
				icon={<NextPageIcon />}
				label="下一页"
				onClick={onNextPage}
				disabled={loading || !canNextPage}
			/>
			<PaginationButton
				icon={<LastPageIcon />}
				label="最后一页"
				onClick={onLastPage}
				disabled={loading || !canNextPage}
			/>
		</div>
	);
}

/**
 * 页码跳转组件（核心改进）
 * 使用本地状态管理输入值，仅在提交时触发跳转
 */
function PageJumper({
	currentPage,
	totalPages,
	loading,
	onJump,
}: PageJumperProps) {
	// 本地状态管理输入值
	const [inputValue, setInputValue] = React.useState<string>("");

	// 处理跳转逻辑
	const handleJump = React.useCallback(() => {
		const page = Number(inputValue);

		// 更严格的数字验证：排除NaN、小数、负数
		const isValidNumber = !Number.isNaN(page) && Number.isInteger(page) && page > 0;

		// 验证输入：必须是有效整数且在范围内（允许跳转到当前页）
		if (isValidNumber && page >= 1 && page <= totalPages) {
			onJump(page); // ✅ 仅在此处触发一次
			setInputValue(""); // 清空输入框
		} else if (inputValue !== "") {
			// 无效输入，清空输入框（视觉反馈）
			setInputValue("");
		}
	}, [inputValue, totalPages, onJump]);

	// 键盘事件处理
	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleJump(); // Enter 键提交
			} else if (e.key === "Escape") {
				setInputValue(""); // ESC 清空输入
			}
		},
		[handleJump],
	);

	// 失焦时，如果输入为空，不做处理（placeholder 会显示当前页码）
	const handleBlur = React.useCallback(() => {
		// 失焦时不做自动跳转，仅清空输入
		if (inputValue !== "") {
			setInputValue("");
		}
	}, [inputValue]);

	// 跳转按钮是否禁用
	const isJumpDisabled = React.useMemo(() => {
		if (loading || inputValue === "") return true;

		const page = Number(inputValue);
		const isValidNumber = !Number.isNaN(page) && Number.isInteger(page);

		return !isValidNumber || page < 1 || page > totalPages;
	}, [loading, inputValue, totalPages]);

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-gray-600 hidden sm:inline">跳至</span>
			<input
				type="number"
				min="1"
				max={totalPages}
				value={inputValue}
				onChange={(e) => {
					const value = e.target.value;
					// 只允许纯数字输入
					if (value === '' || /^\d+$/.test(value)) {
						setInputValue(value);
					}
				}}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				placeholder={String(currentPage)}
				disabled={loading}
				className={PAGINATION_INPUT}
				aria-label="跳转到指定页码"
			/>
			<span className="text-sm text-gray-600 hidden sm:inline">页</span>
			<button
				type="button"
				onClick={handleJump}
				disabled={isJumpDisabled}
				className={PAGINATION_JUMP_BUTTON}
				aria-label="跳转"
			>
				跳转
			</button>
		</div>
	);
}

/**
 * 每页条数选择器
 */
function PageSizeSelector({
	pageSize,
	pageSizeOptions,
	loading,
	onChange,
}: PageSizeSelectorProps) {
	return (
		<select
			value={pageSize}
			onChange={(e) => onChange(Number(e.target.value))}
			disabled={loading}
			className={PAGINATION_SELECT}
			aria-label="选择每页显示条数"
		>
			{pageSizeOptions.map((size) => (
				<option key={size} value={size}>
					{size} 条/页
				</option>
			))}
		</select>
	);
}

// ========== 主组件 ==========

/**
 * 分页器主组件
 */
export function Pagination<TData>({
	table,
	total,
	selectedCount,
	loading = false,
	pageSizeOptions = [10, 20, 50, 100],
	className,
}: PaginationProps<TData>) {
	const paginationState = table.getState().pagination;
	const currentPage = paginationState.pageIndex + 1; // TanStack Table 使用 0-based index
	const totalPages = table.getPageCount();

	// 处理页码跳转
	const handleJump = React.useCallback(
		(page: number) => {
			// page 是 1-based，需要转换为 0-based
			table.setPageIndex(page - 1);
		},
		[table],
	);

	// 处理每页条数变化
	const handlePageSizeChange = React.useCallback(
		(pageSize: number) => {
			table.setPageSize(pageSize);
		},
		[table],
	);

	return (
		<div className={className || PAGINATION_CONTAINER}>
			{/* 信息显示 */}
			<PaginationInfo total={total} selectedCount={selectedCount} />

			{/* 分页控制 */}
			<div className={PAGINATION_CONTROLS}>
				{/* 分页按钮组 */}
				<div className="order-1">
					<PaginationButtonGroup
						currentPage={currentPage}
						totalPages={totalPages}
						loading={loading}
						onFirstPage={() => table.setPageIndex(0)}
						onPreviousPage={() => table.previousPage()}
						onNextPage={() => table.nextPage()}
						onLastPage={() => table.setPageIndex(totalPages - 1)}
						canPreviousPage={table.getCanPreviousPage()}
						canNextPage={table.getCanNextPage()}
					/>
				</div>

				{/* 跳转页码 */}
				<div className="order-2 lg:order-3">
					<PageJumper
						currentPage={currentPage}
						totalPages={totalPages}
						loading={loading}
						onJump={handleJump}
					/>
				</div>

				{/* 每页条数 */}
				<div className="order-3 lg:order-2">
					<PageSizeSelector
						pageSize={paginationState.pageSize}
						pageSizeOptions={pageSizeOptions}
						loading={loading}
						onChange={handlePageSizeChange}
					/>
				</div>
			</div>
		</div>
	);
}
