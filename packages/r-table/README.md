# r-table

一个功能丰富的 React 数据表格组件，基于 @tanstack/react-table 和 Tailwind CSS 构建。

## ✨ 功能特性

### 核心功能
- ✅ **分页** - 完整的分页控件，支持跳转、每页条数调整
- ✅ **排序** - 单列排序，点击列头切换升序/降序
- ✅ **筛选** - 列头筛选，支持文本关键词筛选
- ✅ **行选择** - Checkbox + 行点击混合模式，支持全选
- ✅ **列配置** - 显示/隐藏列，配置持久化到 localStorage

### 工具栏功能
- ✅ **刷新** - 重新加载表格数据
- ✅ **密度调整** - 三种密度（紧凑/默认/宽松）
- ✅ **列设置** - 管理列的显示/隐藏

### UI/UX 优化
- ✅ **企业级设计** - 清晰的视觉层次和专业交互
- ✅ **流畅动画** - 150ms 过渡动画，微交互反馈
- ✅ **Loading 状态** - 波浪式 shimmer 骨架屏
- ✅ **空状态** - 优雅的空数据提示
- ✅ **响应式** - 水平滚动支持

### 数据模式
- ✅ **Data 模式** - 直接传入数据数组（前端分页）
- ✅ **Request 模式** - 传入异步请求函数（后端分页）
- ✅ **Ref API** - 命令式控制表格

## 📦 安装

```bash
# 使用 bun
bun add r-table @tanstack/react-table

# 使用 npm
npm install r-table @tanstack/react-table

# 使用 yarn
yarn add r-table @tanstack/react-table

# 使用 pnpm
pnpm add r-table @tanstack/react-table
```

**Peer Dependencies**：
- React 18+ 或 19+
- @tanstack/react-table ^8.21.0
- Tailwind CSS 4+

## 🚀 快速开始

### 基础用法

```tsx
import { DataTable } from 'r-table';
import type { ColumnDef } from '@tanstack/react-table';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

function MyTable() {
  const data: Person[] = [
    { firstName: '张', lastName: '三', age: 28 },
    { firstName: '李', lastName: '四', age: 32 },
  ];

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: '名',
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'lastName',
      header: '姓',
      enableSorting: true,
    },
    {
      accessorKey: 'age',
      header: '年龄',
      enableSorting: true,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      storageKey="my-table"
      enableRowSelection
      enableSorting
      enableFiltering
      enablePagination
      showToolBar
      onRefresh={() => {
        // 刷新数据
      }}
    />
  );
}
```

### Request 模式（后端分页）

```tsx
import { DataTable, type RequestParams, type RequestResult } from 'r-table';

function ServerPaginationTable() {
  const fetchData = async (params: RequestParams): Promise<RequestResult<Person>> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    const result = await response.json();
    return {
      data: result.data,
      total: result.total,
    };
  };

  return (
    <DataTable
      columns={columns}
      request={fetchData}
      storageKey="server-table"
    />
  );
}
```

### 使用 Ref API

```tsx
import { useRef } from 'react';
import { DataTable, type DataTableRef } from 'r-table';

function RefApiTable() {
  const tableRef = useRef<DataTableRef<Person>>(null);

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  const getSelectedRows = () => {
    const selected = tableRef.current?.getSelectedRows();
    console.log('Selected rows:', selected);
  };

  return (
    <>
      <button onClick={handleRefresh}>刷新</button>
      <button onClick={getSelectedRows}>获取选中行</button>
      <DataTable
        ref={tableRef}
        data={data}
        columns={columns}
      />
    </>
  );
}
```

## 📖 API 文档

### DataTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | TData[] | - | 表格数据（Data 模式） |
| request | (params: RequestParams) => Promise<RequestResult<TData>> | - | 异步请求函数（Request 模式） |
| columns | ColumnDef<TData>[] | required | 列定义 |
| storageKey | string | - | localStorage 存储 key |
| loading | boolean | false | 加载状态 |
| enableRowSelection | boolean | false | 启用行选择 |
| enableSorting | boolean | true | 启用排序 |
| enableFiltering | boolean | false | 启用筛选 |
| enablePagination | boolean | true | 启用分页 |
| showToolBar | boolean | true | 显示工具栏 |
| emptyState | ReactNode | - | 自定义空状态 |
| onRowClick | (row: TData) => void | - | 行点击回调 |
| onSelectionChange | (rows: TData[]) => void | - | 选择变化回调 |
| onRefresh | () => void | - | 刷新回调 |
| initialPageSize | number | 10 | 初始分页大小 |
| pageSizeOptions | number[] | [10,20,30,40,50] | 分页选项 |

### DataTableRef

```typescript
interface DataTableRef<TData> {
  refresh: () => void;              // 刷新表格数据
  getSelectedRows: () => TData[];   // 获取选中的行
  clearSelection: () => void;       // 清空选择
  setPageSize: (size: number) => void;  // 设置分页大小
  getTable: () => Table<TData>;     // 获取 TanStack Table 实例
}
```

### RequestParams

```typescript
interface RequestParams {
  pageIndex: number;      // 当前页索引（从 0 开始）
  pageSize: number;       // 每页条数
  sorting?: SortingState; // 排序状态
  filters?: Record<string, string>; // 筛选条件
}
```

### RequestResult

```typescript
interface RequestResult<TData> {
  data: TData[];  // 当前页数据
  total: number;  // 总条数
}
```

### 密度类型

```typescript
type DensityType = 'compact' | 'default' | 'comfortable';
```

| 密度 | 间距 | 适用场景 |
|------|------|----------|
| compact | px-4 py-2 | 数据密集，需要在一屏显示更多内容 |
| default | px-6 py-4 | 平衡的阅读体验（推荐） |
| comfortable | px-8 py-6 | 强调可读性，内容较少时 |

## 🛠️ 技术栈

- React 18+ / 19+
- TypeScript 5
- @tanstack/react-table 8
- Tailwind CSS 4
- Bun（运行时和包管理器）

## 📚 更多文档

- [分页功能详解](../../docs/PAGINATION.md)
- [Ref API 使用指南](../../docs/REF_API.md)
- [Request 模式详解](../../docs/REQUEST_MODE.md)
- [类型推断说明](../../docs/TYPE_INFERENCE.md)
- [打包发布指南](../../docs/PACKAGING.md)

## 📄 License

MIT
