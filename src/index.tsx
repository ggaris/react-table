import React from "react";
import ReactDOM from "react-dom/client";
import type { ColumnDef } from "@tanstack/react-table";

import "./index.css";
import { DataTable } from "./components/table";
import { makeData } from "./components/table/makeData";

type Person = {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	status: string;
	progress: number;
};

function App() {
	const [data] = React.useState(() => makeData(50));
	const [loading, setLoading] = React.useState(false);

	// 定义列
	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "firstName",
				header: "名",
				enableSorting: true,
				enableColumnFilter: true,
			},
			{
				accessorKey: "lastName",
				header: "姓",
				enableSorting: true,
				enableColumnFilter: true,
			},
			{
				accessorKey: "age",
				header: "年龄",
				enableSorting: true,
				enableColumnFilter: false,
			},
			{
				accessorKey: "visits",
				header: "访问次数",
				enableSorting: true,
				enableColumnFilter: false,
			},
			{
				accessorKey: "status",
				header: "状态",
				enableSorting: true,
				enableColumnFilter: true,
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
				enableColumnFilter: false,
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
		[]
	);

	// 模拟加载
	const handleToggleLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						DataTable 组件示例
					</h1>
					<p className="text-gray-600">
						基于 @tanstack/react-table 封装的企业级表格组件
					</p>
				</div>

				<div className="mb-4">
					<button
						type="button"
						onClick={handleToggleLoading}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						模拟加载效果
					</button>
				</div>

				<DataTable
					data={data}
					columns={columns}
					storageKey="demo-table"
					loading={loading}
					enableRowSelection
					enableSorting
					enableFiltering
					enablePagination
					initialPageSize={10}
					onRowClick={(row) => {
						console.log("点击行:", row);
					}}
					onSelectionChange={(selectedRows) => {
						console.log("选择变化:", selectedRows);
					}}
				/>
			</div>
		</div>
	);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
