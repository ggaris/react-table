import type { ColumnDef } from "@tanstack/react-table";
import {
	DataTable,
	type DataTableRef,
	type RequestParams,
	type RequestResult,
} from "r-table";
import React from "react";
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
 * 默认示例
 * 展示表格的推荐默认行为和最佳实践
 */
export function DefaultExample() {
	const tableRef = React.useRef<DataTableRef<Person>>(null);

	// 模拟后端数据
	const [backendData] = React.useState(() => {
		const rawData = makeData(100);
		return rawData.map((item, index) => ({
			...item,
			id: `user-${index + 1}`,
		}));
	});

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

	// 模拟后端请求
	const fetchData = async (
		params: RequestParams,
	): Promise<RequestResult<Person>> => {
		// 模拟网络延迟
		await new Promise((resolve) => setTimeout(resolve, 500));

		// 分页
		const current = params.current ?? 1;
		const size = params.size ?? 10;
		const start = (current - 1) * size;
		const end = start + size;
		const pageData = backendData.slice(start, end);

		return {
			data: pageData,
			total: backendData.length,
			success: true,
		};
	};

	return (
		<div className="space-y-4">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-3">
					✨ 表格默认行为示例
				</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>
						• <strong>Request 模式</strong>：使用后端分页，适合大数据量场景
					</li>
					<li>
						• <strong>默认不开启行选择</strong>：简洁的展示模式
					</li>
					<li>
						• <strong>工具栏默认显示</strong>：支持列管理、刷新等功能
					</li>
					<li>
						• <strong>列管理</strong>：通过 storageKey 持久化列配置
					</li>
					<li>
						• <strong>自动 loading</strong>：请求期间自动显示加载状态
					</li>
				</ul>
			</div>

			<DataTable
				ref={tableRef}
				request={fetchData}
				columns={columns}
				rowKey="id"
				storageKey="default-table"
				enableSorting
				enablePagination
				enableRowSelection
				initialPageSize={10}
			/>

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-2">💡 使用提示：</h4>
				<ul className="text-sm text-gray-700 space-y-1">
					<li>• 点击工具栏的列图标可以管理列的显示/隐藏</li>
					<li>• 点击刷新按钮可以重新加载数据</li>
					<li>• 列配置会自动保存到 localStorage</li>
					<li>• request 函数会自动接收分页参数（current、size）</li>
				</ul>
			</div>
		</div>
	);
}
