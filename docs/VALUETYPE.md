# ValueType 使用指南

## 概述

ValueType 是一个强大的列配置功能，参考了 Ant Design Pro Components 的设计理念，允许你通过简单的配置自动格式化列数据的显示。

## 基本用法

使用 `ProColumnDef` 类型定义列，通过 `valueType` 属性指定列的类型：

```tsx
import { ProColumnDef } from 'r-table';

const columns: ProColumnDef<Product>[] = [
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
];
```

## 支持的 ValueType 类型

### 1. 文本和数字类型

#### text - 文本
最基本的文本显示类型（默认）。

```tsx
{
  accessorKey: "name",
  header: "产品名称",
  valueType: "text",
}
```

#### digit - 数字
自动格式化数字，添加千分位分隔符。

```tsx
{
  accessorKey: "stock",
  header: "库存",
  valueType: "digit",
}
```

#### money - 金额
格式化金额，支持货币符号、小数位数和千分位分隔符。

```tsx
{
  accessorKey: "price",
  header: "价格",
  valueType: "money",
  fieldProps: {
    symbol: "¥",        // 货币符号，默认 ¥
    precision: 2,       // 小数位数，默认 2
    separator: true,    // 千分位分隔符，默认 true
  },
}
```

#### percent - 百分比
格式化百分比数据。

```tsx
{
  accessorKey: "discount",
  header: "折扣",
  valueType: "percent",
  fieldProps: {
    precision: 0,       // 小数位数，默认 2
    showSymbol: true,   // 是否显示 % 符号，默认 true
  },
}
```

### 2. 日期时间类型

#### date - 日期
格式化日期显示。

```tsx
{
  accessorKey: "createdAt",
  header: "创建日期",
  valueType: "date",
  fieldProps: {
    format: "YYYY-MM-DD",  // 日期格式，默认 YYYY-MM-DD
  },
}
```

#### dateTime - 日期时间
格式化日期时间显示。

```tsx
{
  accessorKey: "updatedAt",
  header: "更新时间",
  valueType: "dateTime",
  fieldProps: {
    format: "YYYY-MM-DD HH:mm:ss",  // 日期时间格式，默认 YYYY-MM-DD HH:mm:ss
  },
}
```

#### time - 时间
格式化时间显示。

```tsx
{
  accessorKey: "time",
  header: "时间",
  valueType: "time",
  fieldProps: {
    format: "HH:mm:ss",  // 时间格式，默认 HH:mm:ss
  },
}
```

### 3. 选择器和标签类型

#### select - 选择器
将数据值映射为带状态的标签显示。

```tsx
{
  accessorKey: "status",
  header: "状态",
  valueType: "select",
  fieldProps: {
    valueEnum: {
      available: {
        text: "有货",
        status: "success",  // success | error | warning | processing | default
      },
      outOfStock: {
        text: "缺货",
        status: "error",
      },
    },
  },
}
```

#### tag - 标签
显示彩色标签。

```tsx
{
  accessorKey: "category",
  header: "类别",
  valueType: "tag",
  fieldProps: {
    colorMap: {
      "手机": "bg-blue-100 text-blue-800",
      "笔记本": "bg-purple-100 text-purple-800",
      "耳机": "bg-pink-100 text-pink-800",
    },
  },
}
```

### 4. 进度和图表类型

#### progress - 进度条
显示进度条（值范围 0-100）。

```tsx
{
  accessorKey: "rating",
  header: "评分",
  valueType: "progress",
  fieldProps: {
    color: "bg-yellow-500",  // 进度条颜色，默认 bg-blue-500
    showInfo: true,          // 是否显示百分比文本，默认 true
  },
}
```

### 5. 媒体类型

#### image - 图片
显示图片。

```tsx
{
  accessorKey: "image",
  header: "图片",
  valueType: "image",
  fieldProps: {
    width: 60,   // 图片宽度
    height: 60,  // 图片高度
  },
}
```

#### avatar - 头像
显示头像。

```tsx
{
  accessorKey: "avatar",
  header: "头像",
  valueType: "avatar",
  fieldProps: {
    size: "default",  // small | default | large 或数字
    shape: "circle",  // circle | square
  },
}
```

### 6. 代码类型

#### code - 代码块
显示代码块。

```tsx
{
  accessorKey: "code",
  header: "代码",
  valueType: "code",
  fieldProps: {
    language: "javascript",  // 语言类型
  },
}
```

#### jsonCode - JSON 代码
显示格式化的 JSON 代码。

```tsx
{
  accessorKey: "config",
  header: "配置",
  valueType: "jsonCode",
}
```

## 自定义渲染

如果内置的 valueType 不满足需求，可以使用 `render` 函数自定义渲染（优先级高于 valueType）：

```tsx
{
  accessorKey: "status",
  header: "状态",
  render: (value, record, index) => {
    return (
      <span className="custom-status">
        {value} - {record.name}
      </span>
    );
  },
}
```

## 辅助函数

### defineColumn

提供更好的类型提示来定义单个列：

```tsx
import { defineColumn } from 'r-table';

const priceColumn = defineColumn<Product>({
  accessorKey: "price",
  header: "价格",
  valueType: "money",
  fieldProps: { symbol: "¥" },
});
```

### defineColumns

提供更好的类型提示来定义列数组：

```tsx
import { defineColumns } from 'r-table';

const columns = defineColumns<Product>([
  {
    accessorKey: "price",
    header: "价格",
    valueType: "money",
  },
  {
    accessorKey: "status",
    header: "状态",
    valueType: "select",
  },
]);
```

## 完整示例

```tsx
import type { ProColumnDef } from "r-table";
import { DataTable } from "r-table";

type Product = {
  id: string;
  name: string;
  price: number;
  discount: number;
  status: "available" | "outOfStock";
  createdAt: string;
};

export function ProductTable() {
  const columns: ProColumnDef<Product>[] = [
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
    {
      accessorKey: "createdAt",
      header: "创建时间",
      valueType: "dateTime",
      fieldProps: {
        format: "YYYY-MM-DD HH:mm",
      },
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      rowKey="id"
      enablePagination
      showToolBar
    />
  );
}
```

## 注意事项

1. **优先级**：`render` > `valueType` > `cell`
2. **配置传递**：所有 valueType 的配置通过 `fieldProps` 传递
3. **类型安全**：使用 `ProColumnDef<TData>` 类型获得完整的类型提示
4. **兼容性**：完全兼容 TanStack Table 的 `ColumnDef`，可以混合使用

## 扩展

如果需要添加自定义的 valueType，可以参考 `src/components/table/value-type-render.tsx` 文件添加新的渲染组件。
