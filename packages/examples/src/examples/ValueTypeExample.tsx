import type { ProColumnDef } from "r-table";
import React from "react";
import { DataTable, type DataTableRef } from "r-table";

type Product = {
	id: string;
	name: string;
	price: number;
	discount: number;
	stock: number;
	status: "available" | "outOfStock" | "discontinued";
	category: string;
	sales: number;
	createdAt: string;
	updatedAt: string;
	rating: number;
	image: string;
};

/**
 * ValueType 示例
 * 展示如何使用 valueType 自动格式化列数据
 */
export function ValueTypeExample() {
	const tableRef = React.useRef<DataTableRef<Product>>(null);

	// 模拟产品数据
	const [data] = React.useState<Product[]>([
		{
			id: "1",
			name: "iPhone 15 Pro",
			price: 7999,
			discount: 0.1,
			stock: 128,
			status: "available",
			category: "手机",
			sales: 1250,
			createdAt: "2024-01-15T10:30:00Z",
			updatedAt: "2024-01-20T14:20:00Z",
			rating: 0.92,
			image: "https://via.placeholder.com/60",
		},
		{
			id: "2",
			name: "MacBook Pro 16",
			price: 19999,
			discount: 0.05,
			stock: 45,
			status: "available",
			category: "笔记本",
			sales: 856,
			createdAt: "2024-01-10T09:15:00Z",
			updatedAt: "2024-01-22T11:30:00Z",
			rating: 0.95,
			image: "https://via.placeholder.com/60",
		},
		{
			id: "3",
			name: "AirPods Pro",
			price: 1999,
			discount: 0.15,
			stock: 0,
			status: "outOfStock",
			category: "耳机",
			sales: 3420,
			createdAt: "2023-12-20T16:45:00Z",
			updatedAt: "2024-01-18T09:10:00Z",
			rating: 0.88,
			image: "https://via.placeholder.com/60",
		},
		{
			id: "4",
			name: "iPad Air",
			price: 4799,
			discount: 0.08,
			stock: 230,
			status: "available",
			category: "平板",
			sales: 1680,
			createdAt: "2024-01-05T13:20:00Z",
			updatedAt: "2024-01-19T15:40:00Z",
			rating: 0.9,
			image: "https://via.placeholder.com/60",
		},
		{
			id: "5",
			name: "Apple Watch Ultra",
			price: 6299,
			discount: 0,
			stock: 75,
			status: "available",
			category: "手表",
			sales: 542,
			createdAt: "2024-01-12T11:00:00Z",
			updatedAt: "2024-01-21T10:25:00Z",
			rating: 0.94,
			image: "https://via.placeholder.com/60",
		},
	]);

	// 定义列 - 使用 valueType 自动格式化
	const columns = React.useMemo<ProColumnDef<Product>[]>(
		() => [
			{
				accessorKey: "image",
				header: "图片",
				valueType: "image",
				fieldProps: {
					width: 60,
					height: 60,
				},
			},
			{
				accessorKey: "name",
				header: "产品名称",
				valueType: "text",
			},
			{
				accessorKey: "price",
				header: "价格",
				valueType: "money",
				fieldProps: {
					symbol: "¥",
					precision: 2,
					separator: true,
				},
			},
			{
				accessorKey: "discount",
				header: "折扣",
				valueType: "percent",
				fieldProps: {
					precision: 0,
					showSymbol: true,
				},
			},
			{
				accessorKey: "stock",
				header: "库存",
				valueType: "digit",
			},
			{
				accessorKey: "status",
				header: "状态",
				valueType: "select",
				fieldProps: {
					valueEnum: {
						available: {
							text: "有货",
							status: "success",
						},
						outOfStock: {
							text: "缺货",
							status: "error",
						},
						discontinued: {
							text: "已下架",
							status: "default",
						},
					},
				},
			},
			{
				accessorKey: "category",
				header: "类别",
				valueType: "tag",
				fieldProps: {
					colorMap: {
						手机: "bg-blue-100 text-blue-800",
						笔记本: "bg-purple-100 text-purple-800",
						耳机: "bg-pink-100 text-pink-800",
						平板: "bg-green-100 text-green-800",
						手表: "bg-orange-100 text-orange-800",
					},
				},
			},
			{
				accessorKey: "rating",
				header: "评分",
				valueType: "progress",
				fieldProps: {
					showInfo: true,
					color: "bg-yellow-500",
				},
			},
			{
				accessorKey: "createdAt",
				header: "创建时间",
				valueType: "dateTime",
				fieldProps: {
					format: "YYYY-MM-DD HH:mm",
				},
			},
			{
				accessorKey: "updatedAt",
				header: "更新时间",
				valueType: "date",
				fieldProps: {
					format: "YYYY-MM-DD",
				},
			},
		],
		[],
	);

	return (
		<div className="space-y-4">
			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
				<h3 className="font-semibold text-purple-900 mb-3">
					🎨 ValueType 示例
				</h3>
				<ul className="text-sm text-purple-800 space-y-1">
					<li>• 使用 valueType 自动格式化列数据</li>
					<li>• 支持 money、percent、digit、select、tag、progress 等类型</li>
					<li>• 支持 date、dateTime、time 等日期时间类型</li>
					<li>• 支持 image、avatar、code、jsonCode 等特殊类型</li>
					<li>• 通过 fieldProps 配置各类型的展示参数</li>
				</ul>

				<div className="mt-3 p-3 bg-white rounded border border-purple-200">
					<p className="text-sm font-semibold text-purple-900 mb-2">
						支持的 ValueType 类型：
					</p>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-purple-700">
						<div>• text（文本）</div>
						<div>• digit（数字）</div>
						<div>• money（金额）</div>
						<div>• percent（百分比）</div>
						<div>• date（日期）</div>
						<div>• dateTime（日期时间）</div>
						<div>• time（时间）</div>
						<div>• select（选择器）</div>
						<div>• progress（进度条）</div>
						<div>• tag（标签）</div>
						<div>• avatar（头像）</div>
						<div>• image（图片）</div>
						<div>• code（代码块）</div>
						<div>• jsonCode（JSON）</div>
					</div>
				</div>
			</div>

			<DataTable
				ref={tableRef}
				data={data}
				columns={columns}
				rowKey="id"
				storageKey="valuetype-demo"
				enableRowSelection
				enableSorting
				enablePagination
				initialPageSize={10}
				showToolBar
				onSelectionChange={(selectedRows) => {
					console.log("选中的产品:", selectedRows);
				}}
			/>

			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-2">代码示例：</h4>
				<pre className="text-xs text-gray-700 overflow-x-auto bg-gray-900 text-gray-100 p-3 rounded">
					{`const columns: ProColumnDef<Product>[] = [
  {
    accessorKey: "price",
    header: "价格",
    valueType: "money",
    fieldProps: {
      symbol: "¥",
      precision: 2,
      separator: true,
    },
  },
  {
    accessorKey: "discount",
    header: "折扣",
    valueType: "percent",
    fieldProps: {
      precision: 0,
      showSymbol: true,
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    valueType: "select",
    fieldProps: {
      valueEnum: {
        available: { text: "有货", status: "success" },
        outOfStock: { text: "缺货", status: "error" },
      },
    },
  },
];`}
				</pre>
			</div>
		</div>
	);
}
