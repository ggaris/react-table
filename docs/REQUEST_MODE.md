# Request 模式使用指南

## 概述

DataTable 组件支持两种数据源模式：
1. **Data 模式**: 直接传入数据数组（前端分页）
2. **Request 模式**: 传入异步请求函数（后端分页） ✨ 新功能

Request 模式适合数据量大、需要后端分页、筛选和排序的场景。

## 基础用法

### 1. 定义 request 函数

```tsx
import type { RequestParams, RequestResult } from 'r-table';

const fetchData = async (params: RequestParams): Promise<RequestResult<User>> => {
  // params 包含:
  // - current: 当前页码（从1开始）
  // - size: 每页大小
  // - ...其他自定义参数

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  return {
    data: result.list,    // 当前页的数据
    total: result.total,  // 数据总数
    success: true,        // 可选，表示请求是否成功
  };
};
```

### 2. 使用 request 模式

```tsx
<DataTable
  request={fetchData}
  columns={columns}
  rowKey="id"
  enableRowSelection
  enablePagination
  initialPageSize={10}
/>
```

## 类型定义

### RequestParams

```typescript
interface RequestParams {
  /** 当前页码（从1开始） */
  current: number;
  /** 每页大小 */
  size: number;
  /** 额外的搜索/筛选参数 */
  [key: string]: any;
}
```

### RequestResult<TData>

```typescript
interface RequestResult<TData> {
  /** 当前页的数据 */
  data: TData[];
  /** 数据总数 */
  total: number;
  /** 是否成功（可选） */
  success?: boolean;
}
```

## 功能特性

### 1. 自动分页管理

```tsx
<DataTable
  request={fetchData}
  columns={columns}
  rowKey="id"
  initialPageSize={20}  // 初始每页20条
  pageSizeOptions={[10, 20, 50, 100]}
/>
```

当用户切换页码或每页大小时，组件会自动调用 `request` 函数。

### 2. 搜索参数传递

```tsx
function UserTable() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    department: '',
  });

  return (
    <>
      {/* 搜索表单 */}
      <input
        value={searchParams.keyword}
        onChange={(e) => setSearchParams({
          ...searchParams,
          keyword: e.target.value
        })}
      />

      {/* 表格 */}
      <DataTable
        request={fetchData}
        params={searchParams}  // 传递搜索参数
        columns={columns}
        rowKey="id"
      />
    </>
  );
}
```

`params` 变化时会自动重新请求数据。

### 3. 自动 Loading 状态

Request 模式下，组件会自动管理 loading 状态：
- 请求开始时显示加载动画
- 请求完成后隐藏加载动画
- 无需手动管理 `loading` 状态

### 4. 自动刷新按钮

Request 模式下，工具栏会自动显示刷新按钮。

### 5. 显示数据总数

Request 模式下，分页信息会显示后端返回的 `total`，而不是前端数据数组的长度。

## 完整示例

### 示例 1: 基础用法

```tsx
import { DataTable, type RequestParams, type RequestResult } from 'r-table';
import type { ColumnDef } from '@tanstack/react-table';

type User = {
  userId: string;
  name: string;
  email: string;
  role: string;
};

function UserManagement() {
  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: '姓名' },
    { accessorKey: 'email', header: '邮箱' },
    { accessorKey: 'role', header: '角色' },
  ];

  const fetchUsers = async (params: RequestParams): Promise<RequestResult<User>> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    const { list, total } = await response.json();

    return { data: list, total, success: true };
  };

  return (
    <DataTable
      request={fetchUsers}
      columns={columns}
      rowKey="userId"
      storageKey="users-table"
      enableRowSelection
    />
  );
}
```

### 示例 2: 带搜索和筛选

```tsx
function ProductTable() {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });

  const tableRef = useRef<DataTableRef<Product>>(null);

  const fetchProducts = async (params: RequestParams): Promise<RequestResult<Product>> => {
    // params 包含 { current, size, keyword, category, minPrice, maxPrice }
    const response = await fetch('/api/products/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    const result = await response.json();
    return { data: result.items, total: result.totalCount };
  };

  const handleSearch = () => {
    // 重置到第一页并刷新
    tableRef.current?.resetPagination();
    tableRef.current?.refresh();
  };

  return (
    <div>
      {/* 搜索表单 */}
      <div>
        <input
          placeholder="搜索产品..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">全部分类</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
        </select>
        <button onClick={handleSearch}>搜索</button>
      </div>

      {/* 表格 */}
      <DataTable
        ref={tableRef}
        request={fetchProducts}
        params={filters}
        columns={columns}
        rowKey="productId"
      />
    </div>
  );
}
```

### 示例 3: 错误处理

```tsx
const fetchData = async (params: RequestParams): Promise<RequestResult<User>> => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      // 后端业务错误
      console.error('业务错误:', result.message);
      return { data: [], total: 0, success: false };
    }

    return {
      data: result.data,
      total: result.total,
      success: true,
    };
  } catch (error) {
    console.error('请求失败:', error);
    // 返回空数据，组件会正常显示"暂无数据"
    return { data: [], total: 0, success: false };
  }
};
```

## Ref API 在 Request 模式下的使用

### refresh() 方法

在 Request 模式下，`refresh()` 会重新调用 `request` 函数：

```tsx
const tableRef = useRef<DataTableRef<User>>(null);

// 刷新数据
const handleRefresh = () => {
  tableRef.current?.refresh();
};

// 或使用 reload() 方法（request 模式专用）
const handleReload = () => {
  tableRef.current?.reload();
};
```

### 其他方法

所有 ref 方法在 Request 模式下都正常工作：

```tsx
// 重置到第一页
tableRef.current?.resetPagination();

// 清除选择
tableRef.current?.resetSelection();

// 跳转到指定页
tableRef.current?.setPageIndex(2);

// 获取选中数据
const selected = tableRef.current?.getSelectedRows();
```

## Data 模式 vs Request 模式

| 特性 | Data 模式 | Request 模式 |
|------|----------|-------------|
| 数据源 | `data` 属性 | `request` 函数 |
| 分页方式 | 前端分页 | 后端分页 |
| Loading 管理 | 手动（`loading` 属性） | 自动管理 |
| 总数显示 | `data.length` | 后端返回的 `total` |
| 刷新按钮 | 需要 `onRefresh` | 自动显示 |
| 搜索筛选 | 前端实现 | 后端实现 |
| 适用场景 | 数据量小（< 1000条） | 数据量大（> 1000条） |

## 注意事项

### 1. Data 和 Request 二选一

```tsx
// ❌ 错误：不能同时使用
<DataTable
  data={users}
  request={fetchUsers}
  columns={columns}
  rowKey="id"
/>

// ✅ 正确：使用 data
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
/>

// ✅ 正确：使用 request
<DataTable
  request={fetchUsers}
  columns={columns}
  rowKey="id"
/>
```

### 2. params 变化会触发重新请求

```tsx
// params 对象引用变化会触发重新请求
const [params, setParams] = useState({ keyword: '' });

// ✅ 正确：创建新对象
setParams({ keyword: 'new value' });

// ❌ 错误：直接修改（不会触发重新请求）
params.keyword = 'new value';
```

### 3. current 从 1 开始

```tsx
// request 函数接收的 current 是从 1 开始的
const fetchData = async (params: RequestParams) => {
  console.log(params.current);  // 1, 2, 3, ...

  // 如果后端API需要从 0 开始，需要转换
  const apiParams = {
    page: params.current - 1,  // 0, 1, 2, ...
    pageSize: params.size,
  };

  // 调用API...
};
```

### 4. 禁用前端分页

Request 模式下，组件内部会自动禁用前端分页逻辑。你不需要设置 `enablePagination={false}`。

### 5. 排序功能

Request 模式下，通常排序应该在后端实现。可以通过 `params` 传递排序参数：

```tsx
const [params, setParams] = useState({
  sortField: '',
  sortOrder: '',
});

// 在 request 函数中使用
const fetchData = async (params: RequestParams) => {
  // params 包含 sortField 和 sortOrder
  const response = await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  // ...
};
```

## 常见问题

### Q: 如何实现搜索后回到第一页？

```tsx
const handleSearch = () => {
  tableRef.current?.resetPagination();
  // params 变化会自动触发请求
  setParams({ ...params, keyword: searchValue });
};
```

### Q: 如何实现防抖搜索？

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback((value: string) => {
  setParams({ ...params, keyword: value });
}, 500);

<input
  onChange={(e) => debouncedSearch(e.target.value)}
/>
```

### Q: request 失败后如何处理？

```tsx
const fetchData = async (params: RequestParams) => {
  try {
    const result = await api.fetchData(params);
    return { data: result.list, total: result.total };
  } catch (error) {
    // 显示错误提示
    message.error('加载失败');
    // 返回空数据
    return { data: [], total: 0, success: false };
  }
};
```

### Q: 如何实现手动刷新保持当前页？

```tsx
// refresh() 会保持当前页码和每页大小
tableRef.current?.refresh();

// 如果想回到第一页再刷新
tableRef.current?.resetPagination();
```

## 完整交互示例

查看 `src/example/RequestModeExample.tsx` 获取完整的交互式示例，包括：
- 搜索功能
- 状态筛选
- 手动刷新
- 分页控制
- 选中行管理

## 最佳实践

1. **使用 TypeScript**: 定义清晰的数据类型，获得完整的类型检查
2. **错误处理**: 总是 catch 错误并返回合法的 RequestResult
3. **Loading 提示**: Request 模式会自动显示 loading，无需额外处理
4. **参数管理**: 使用 `params` 传递所有搜索筛选参数
5. **重置操作**: 重置搜索时记得调用 `resetPagination()`
