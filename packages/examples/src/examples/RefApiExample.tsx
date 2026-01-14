import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable, type DataTableRef } from "r-table";
import { makeData } from "./makeData";

type Person = {
	id: string;
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	status: string;
	progress: number;
};

/**
 * DataTable Ref API 示例
 * 展示如何使用 ref 调用表格方法
 */
export function RefApiExample() {
	const [data, setData] = React.useState(() => {
		const rawData = makeData(50);
		return rawData.map((item, index) => ({
			...item,
			id: `user-${index + 1}`,
		}));
	});
	const [loading, setLoading] = React.useState(false);

	// 创建表格 ref
	const tableRef = React.useRef<DataTableRef<Person>>(
		{} as DataTableRef<Person>,
	);

	// 定义列
	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				size: 100,
			},
			{
				accessorKey: "firstName",
				header: "名",
			},
			{
				accessorKey: "lastName",
				header: "姓",
			},
			{
				accessorKey: "age",
				header: "年龄",
			},
			{
				accessorKey: "visits",
				header: "访问次数",
			},
			{
				accessorKey: "status",
				header: "状态",
				cell: (info) => {
					const status = info.getValue() as string;
					const statusColors: Record<string, string> = {
						relationship: "bg-green-100 text-green-800",
						complicated: "bg-yellow-100 text-yellow-800",
						single: "bg-blue-100 text-blue-800",
					};
					return (
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${
								statusColors[status] || "bg-gray-100 text-gray-800"
							}`}
						>
							{status}
						</span>
					);
				},
			},
			{
				accessorKey: "progress",
				header: "进度",
				cell: (info) => {
					const progress = info.getValue() as number;
					return (
						<div className="flex items-center gap-2">
							<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-blue-500 transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<span className="text-xs text-gray-600 w-10">{progress}%</span>
						</div>
					);
				},
			},
		],
		[],
	);

	// 刷新数据
	const handleRefresh = () => {
		setLoading(true);
		setTimeout(() => {
			const rawData = makeData(50);
			setData(
				rawData.map((item, index) => ({
					...item,
					id: `user-${index + 1}`,
				})),
			);
			setLoading(false);
		}, 1000);
	};

	return (
		<div className="space-y-4">
			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
				<h3 className="font-semibold text-purple-900 mb-3">
					🎯 Ref API 使用示例
				</h3>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => tableRef.current?.refresh()}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
					>
						📡 刷新数据
					</button>
					<button
						type="button"
						onClick={() => tableRef.current?.resetSelection()}
						className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
					>
						🔄 清除选择
					</button>
					<button
						type="button"
						onClick={() => tableRef.current?.resetPagination()}
						className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
					>
						🏠 回到第一页
					</button>
					<button
						type="button"
						onClick={() => {
							const selected = tableRef.current?.getSelectedRows();
							console.log("选中的行数据:", selected);
							alert(`已选中 ${selected?.length || 0} 条数据，请查看控制台`);
						}}
						className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
					>
						📊 获取选中数据
					</button>
					<button
						type="button"
						onClick={() => {
							const ids = tableRef.current?.getSelectedRowIds();
							console.log("选中的ID:", ids);
							alert(`选中的ID: ${ids?.join(", ") || "无"}`);
						}}
						className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm"
					>
						🆔 获取选中ID
					</button>
					<button
						type="button"
						onClick={() => tableRef.current?.setPageIndex(2)}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
					>
						➡️ 跳到第3页
					</button>
					<button
						type="button"
						onClick={() => {
							const pagination = tableRef.current.getPaginationState();
							alert(
								`当前页码: ${pagination.pageIndex + 1}\n每页大小: ${pagination?.pageSize}`,
							);
						}}
						className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm"
					>
						ℹ️ 获取分页信息
					</button>
				</div>
				<div className="mt-3 p-3 bg-white rounded border border-purple-200">
					<code className="text-xs text-gray-700">
						const tableRef = useRef&lt;DataTableRef&gt;(null);
						<br />
						&lt;DataTable ref={"{tableRef}"} ... /&gt;
						<br />
						tableRef.current?.refresh();
					</code>
				</div>
			</div>

			<DataTable
				ref={tableRef}
				data={data}
				columns={columns}
				rowKey="id"
				storageKey="ref-api-demo"
				loading={loading}
				enableRowSelection
				enableSorting
				enablePagination
				initialPageSize={10}
				showToolBar
				onRefresh={handleRefresh}
				onSelectionChange={(selectedRows) => {
					console.log("选择变化:", selectedRows);
				}}
			/>
		</div>
	);
}
