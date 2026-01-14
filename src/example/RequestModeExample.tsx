import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import {
	DataTable,
	type DataTableRef,
	type RequestParams,
	type RequestResult,
} from "../components/table";
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
 * Request 模式示例
 * 展示如何使用 request 函数从后端获取数据
 */
export function RequestModeExample() {
	const tableRef = React.useRef<DataTableRef<Person>>(null);

	// 模拟后端数据（实际应用中这会在服务器端）
	// 使用 faker 生成 155 条真实的测试数据
	const [backendData] = React.useState(() => {
		const rawData = makeData(155);
		return rawData.map((item, index) => ({
			...item,
			id: `person-${index + 1}`,
		}));
	});

	// 搜索参数状态
	const [searchParams, setSearchParams] = React.useState({
		keyword: "",
		status: "",
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
		console.log("请求参数:", params);

		// 模拟网络延迟
		await new Promise((resolve) => setTimeout(resolve, 800));

		// 模拟筛选
		let filteredData = [...backendData];

		if (params.keyword) {
			filteredData = filteredData.filter(
				(item) =>
					item.firstName.toLowerCase().includes(params.keyword.toLowerCase()) ||
					item.lastName.toLowerCase().includes(params.keyword.toLowerCase()),
			);
		}

		if (params.status) {
			filteredData = filteredData.filter(
				(item) => item.status === params.status,
			);
		}

		// 分页
		const start = (params.current - 1) * params.size;
		const end = start + params.size;
		const pageData = filteredData.slice(start, end);
		console.log(filteredData, "filteredData");

		return {
			data: pageData,
			total: filteredData.length,
			success: true,
		};
	};

	return (
		<div className="space-y-4">
			<div className="bg-green-50 border border-green-200 rounded-lg p-4">
				<h3 className="font-semibold text-green-900 mb-3">
					🌐 Request 模式示例
				</h3>
				<ul className="text-sm text-green-800 space-y-1 mb-3">
					<li>• 使用 request 函数异步获取数据</li>
					<li>• 自动管理 loading 状态</li>
					<li>• 分页参数自动传递 (current, size)</li>
					<li>• 支持额外的搜索参数 (params)</li>
					<li>• 显示后端返回的总数 (total)</li>
				</ul>

				{/* 搜索控件 */}
				<div className="flex flex-wrap gap-2">
					<input
						type="text"
						placeholder="搜索姓名..."
						value={searchParams.keyword}
						onChange={(e) =>
							setSearchParams({ ...searchParams, keyword: e.target.value })
						}
						className="px-3 py-2 border border-green-300 rounded-md text-sm"
					/>
					<select
						value={searchParams.status}
						onChange={(e) =>
							setSearchParams({ ...searchParams, status: e.target.value })
						}
						className="px-3 py-2 border border-green-300 rounded-md text-sm"
					>
						<option value="">全部状态</option>
						<option value="single">single</option>
						<option value="relationship">relationship</option>
						<option value="complicated">complicated</option>
					</select>
					<button
						type="button"
						onClick={() => tableRef.current?.refresh()}
						className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
					>
						手动刷新
					</button>
					<button
						type="button"
						onClick={() => {
							setSearchParams({ keyword: "", status: "" });
							tableRef.current?.resetPagination();
						}}
						className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
					>
						重置搜索
					</button>
				</div>
			</div>

			<DataTable
				ref={tableRef}
				request={fetchData}
				params={searchParams}
				columns={columns}
				rowKey="id"
				storageKey="request-demo"
				enableRowSelection
				enableSorting
				enablePagination
				initialPageSize={10}
				showToolBar
				onSelectionChange={(selectedRows) => {
					console.log("选中的行:", selectedRows);
				}}
			/>

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-2">代码示例：</h4>
				<pre className="text-xs text-gray-700 overflow-x-auto"></pre>
			</div>
		</div>
	);
}
