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
};

/**
 * DataTable 基础示例
 */
export function BasicExample() {
	const [data, setData] = React.useState(() => makeData(50));
	const [loading, setLoading] = React.useState(false);

	// 定义列
	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "firstName",
				header: "名",
				enableSorting: true,
				accessorFn: (row) => row.firstName.toUpperCase(),
			},
			{
				accessorKey: "lastName",
				header: "姓",
				enableSorting: true,
			},
			{
				accessorKey: "age",
				header: "年龄",
				enableSorting: true,
			},
			{
				accessorKey: "visits",
				header: "访问次数",
				enableSorting: true,
			},
			{
				accessorKey: "status",
				header: "状态",
				enableSorting: true,
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
				enableSorting: true,
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

	// 模拟加载
	const handleToggleLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	// 刷新数据
	const handleRefresh = () => {
		setLoading(true);
		setTimeout(() => {
			setData(makeData(50));
			setLoading(false);
		}, 1000);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={handleToggleLoading}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					模拟加载效果
				</button>
			</div>

			<DataTable
				data={data}
				columns={columns}
				rowKey={"age"}
				storageKey="demo-table"
				loading={loading}
				enableRowSelection
				enableSorting
				enablePagination
				initialPageSize={10}
				showToolBar
				onRefresh={handleRefresh}
				onRowClick={(row) => {
					console.log("点击行:", row);
				}}
				onSelectionChange={(selectedRows) => {
					console.log("选择变化:", selectedRows);
				}}
			/>
		</div>
	);
}
