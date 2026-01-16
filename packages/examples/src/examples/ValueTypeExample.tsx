import { faker } from "@faker-js/faker";
import type { ProColumnDef } from "r-table";
import { DataTable, type DataTableRef } from "r-table";
import React from "react";

type Product = {
	id: string;
	name: string;
	avatar: string;
	price: number;
	discount: number;
	stock: number;
	status: "available" | "outOfStock" | "discontinued";
	category: string;
	sales: number;
	progress: number;
	rating: number;
	createdAt: string;
	updatedAt: string;
	lastSyncTime: string;
	image: string;
	code: string;
	metadata: Record<string, unknown>;
};

/**
 * 生成模拟产品数据
 */
function generateMockProducts(count: number): Product[] {
	const categories = [
		"手机",
		"笔记本",
		"耳机",
		"平板",
		"手表",
		"相机",
		"音箱",
		"键盘",
	];
	const statuses: Product["status"][] = [
		"available",
		"outOfStock",
		"discontinued",
	];

	return Array.from({ length: count }, (_, index) => {
		const category = faker.helpers.arrayElement(categories);
		const status = faker.helpers.arrayElement(statuses);
		const createdAt = faker.date.past({ years: 1 });
		const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

		return {
			id: `${index + 1}`,
			name: faker.commerce.productName(),
			avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${faker.string.alphanumeric(5)}`,
			price: Number.parseFloat(faker.commerce.price({ min: 100, max: 50000 })),
			discount: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
			stock:
				status === "outOfStock" ? 0 : faker.number.int({ min: 10, max: 500 }),
			status,
			category,
			sales: faker.number.int({ min: 100, max: 10000 }),
			progress: faker.number.float({ min: 0.1, max: 1, fractionDigits: 2 }),
			rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString(),
			lastSyncTime: faker.date.recent({ days: 1 }).toISOString(),
			image: faker.image.url({ width: 60, height: 60 }),
			code: `SKU-${faker.string.alphanumeric({ length: 8, casing: "upper" })}`,
			metadata: {
				brand: faker.company.name(),
				model: faker.commerce.productName(),
				warranty: `${faker.number.int({ min: 1, max: 3 })}年`,
				origin: faker.location.country(),
			},
		};
	});
}

/**
 * ValueType 示例
 * 展示如何使用 valueType 自动格式化列数据
 */
export function ValueTypeExample() {
	const tableRef = React.useRef<DataTableRef<Product>>(null);

	// 模拟产品数据 - 使用 faker 生成 100 条数据
	const [data] = React.useState<Product[]>(() => generateMockProducts(100));

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
				accessorKey: "avatar",
				header: "头像",
				valueType: "avatar",
				fixed: "left",
				fieldProps: {
					size: "default",
					shape: "circle",
				},
			},
			{
				accessorKey: "name",
				header: "产品名称",
				fixed: "left",
				valueType: "text",
			},
			{
				accessorKey: "price",
				header: "价格",
				valueType: "money",
				fieldProps: {
					symbol: "¥",
					precision: 3,
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
					showProgressBar: true,
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
						手机: "bg-blue-50 text-blue-700",
						笔记本: "bg-purple-50 text-purple-700",
						耳机: "bg-pink-50 text-pink-700",
						平板: "bg-green-50 text-green-700",
						手表: "bg-orange-50 text-orange-700",
					},
				},
			},
			{
				accessorKey: "rating",
				header: "评分",
				valueType: "rating",
				fieldProps: {
					max: 5,
					showValue: true,
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
			{
				accessorKey: "lastSyncTime",
				header: "同步时间",
				valueType: "time",
				fieldProps: {
					format: "HH:mm:ss",
				},
			},
		],
		[],
	);

	return (
		<div className="space-y-4 space-x-3">
			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
				<h3 className="font-semibold text-purple-900 mb-3">
					🎨 ValueType 示例
				</h3>
				<ul className="text-sm text-purple-800 space-y-1">
					<li>• 使用 valueType 自动格式化列数据</li>
					<li>• 支持 money、percent、digit、select、tag、rating 等类型</li>
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
						<div>• rating（评分）⭐</div>
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
				enableStripedRows
				stripedRowColors={{ even: "bg-gray-50", odd: "bg-white" }}
				onSelectionChange={(selectedRows) => {
					console.log("选中的产品:", selectedRows);
				}}
			/>
		</div>
	);
}
