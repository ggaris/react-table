import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "../components/table";
import { makeData } from "./makeData";

type Person = {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	status: string;
	progress: number;
	id: string; // 添加唯一ID用于后端分页
};

/**
 * 模拟后端分页的 DataTable 示例
 * 展示如何处理后端分页场景下的状态管理
 */
export function ServerPaginationExample() {
	// 模拟后端数据总数
	const [totalData] = React.useState(() => {
		const data = makeData(100);
		return data.map((item, index) => ({
			...item,
			id: `user-${index + 1}`,
		}));
	});

	// 当前页面显示的数据
	const [pageData, setPageData] = React.useState<Person[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [pageIndex, setPageIndex] = React.useState(0);
	const [pageSize, setPageSize] = React.useState(10);

	// 模拟从后端获取分页数据
	const fetchPageData = React.useCallback(
		(page: number, size: number) => {
			setLoading(true);
			// 模拟网络延迟
			setTimeout(() => {
				const start = page * size;
				const end = start + size;
				const data = totalData.slice(start, end);
				setPageData(data);
				setLoading(false);
			}, 500);
		},
		[totalData],
	);

	// 初始加载数据
	React.useEffect(() => {
		fetchPageData(pageIndex, pageSize);
	}, [fetchPageData, pageIndex, pageSize]);

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
				enableSorting: false, // 后端分页通常在后端排序
			},
			{
				accessorKey: "lastName",
				header: "姓",
				enableSorting: false,
			},
			{
				accessorKey: "age",
				header: "年龄",
				enableSorting: false,
			},
			{
				accessorKey: "visits",
				header: "访问次数",
				enableSorting: false,
			},
			{
				accessorKey: "status",
				header: "状态",
				enableSorting: false,
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
				enableSorting: false,
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

	return (
		<div className="space-y-4">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">📡 后端分页模式</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>• 总数据量: {totalData.length} 条（模拟后端数据）</li>
					<li>• 每次只加载当前页的数据</li>
					<li>• 使用唯一ID (rowKey) 管理选中状态</li>
					<li>• 跨页选择会被正确保存</li>
					<li>• 全选只会选中当前页的数据</li>
				</ul>
			</div>

			<DataTable<Person>
				data={pageData}
				columns={columns}
				rowKey="id"
				loading={loading}
				showToolBar
				enableRowSelection
				enableSorting={false} // 后端分页通常在后端排序
				// enablePagination={false} // 使用自定义分页控制
				onRefresh={fetchPageData.bind(null, pageIndex, pageSize)}
				onSelectionChange={(selectedRows) => {
					console.log("已选择的行:", selectedRows);
					console.log(
						"已选择的ID:",
						selectedRows.map((r) => r.id),
					);
				}}
			/>
		</div>
	);
}
