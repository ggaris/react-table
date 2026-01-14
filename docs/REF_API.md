# Ref API 使用指南

## 概述

DataTable 组件现在支持通过 ref 暴露常用方法，让你可以在父组件中直接控制表格行为。

## 功能更新

### 1. 默认启用的功能

- ✅ **列配置**: 当提供 `storageKey` 时自动启用列可见性控制
- ✅ **刷新按钮**: 当提供 `onRefresh` 回调时自动显示刷新按钮
- ✅ **默认分页器**: 默认启用内置分页器（`enablePagination={true}`）

### 2. Ref API 方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `refresh()` | 触发刷新（调用 onRefresh 回调） | `tableRef.current?.refresh()` |
| `resetSelection()` | 清除所有行选择 | `tableRef.current?.resetSelection()` |
| `resetPagination()` | 重置分页到第一页 | `tableRef.current?.resetPagination()` |
| `getSelectedRows()` | 获取选中的行数据 | `const rows = tableRef.current?.getSelectedRows()` |
| `getSelectedRowIds()` | 获取选中的行ID列表 | `const ids = tableRef.current?.getSelectedRowIds()` |
| `setPageIndex(n)` | 跳转到指定页 | `tableRef.current?.setPageIndex(2)` |
| `setPageSize(n)` | 设置每页大小 | `tableRef.current?.setPageSize(20)` |
| `getPaginationState()` | 获取当前分页状态 | `const state = tableRef.current?.getPaginationState()` |

## 基础使用

### 1. 创建 ref

```tsx
import { useRef } from 'react';
import { DataTable, type DataTableRef } from 'r-table';

function MyComponent() {
  // 创建表格 ref
  const tableRef = useRef<DataTableRef<YourDataType>>(null);

  return (
    <DataTable
      ref={tableRef}
      data={data}
      columns={columns}
      rowKey="id"
      storageKey="my-table"  // 自动启用列配置
      onRefresh={() => fetchData()}  // 自动显示刷新按钮
    />
  );
}
```

### 2. 调用方法

```tsx
function MyComponent() {
  const tableRef = useRef<DataTableRef<Person>>(null);

  const handleAction = () => {
    // 刷新数据
    tableRef.current?.refresh();

    // 清除选择
    tableRef.current?.resetSelection();

    // 回到第一页
    tableRef.current?.resetPagination();

    // 获取选中数据
    const selectedRows = tableRef.current?.getSelectedRows();
    console.log('已选中:', selectedRows);

    // 获取选中ID
    const selectedIds = tableRef.current?.getSelectedRowIds();
    console.log('已选中ID:', selectedIds);

    // 跳转到第3页
    tableRef.current?.setPageIndex(2);

    // 获取分页信息
    const pagination = tableRef.current?.getPaginationState();
    console.log('当前页:', pagination?.pageIndex + 1);
    console.log('每页大小:', pagination?.pageSize);
  };

  return (
    <>
      <button onClick={handleAction}>执行操作</button>
      <DataTable ref={tableRef} {...props} />
    </>
  );
}
```

## 实际场景

### 场景 1: 批量操作后刷新

```tsx
function UserManagement() {
  const tableRef = useRef<DataTableRef<User>>(null);

  const handleBatchDelete = async () => {
    const selectedIds = tableRef.current?.getSelectedRowIds();

    if (!selectedIds || selectedIds.length === 0) {
      alert('请先选择要删除的用户');
      return;
    }

    await deleteUsers(selectedIds);

    // 删除成功后刷新表格
    tableRef.current?.refresh();
    // 清除选择状态
    tableRef.current?.resetSelection();
  };

  return (
    <div>
      <button onClick={handleBatchDelete}>批量删除</button>
      <DataTable
        ref={tableRef}
        data={users}
        columns={columns}
        rowKey="id"
        enableRowSelection
        onRefresh={fetchUsers}
      />
    </div>
  );
}
```

### 场景 2: 导出选中数据

```tsx
function DataExport() {
  const tableRef = useRef<DataTableRef<Order>>(null);

  const handleExport = () => {
    const selectedRows = tableRef.current?.getSelectedRows();

    if (!selectedRows || selectedRows.length === 0) {
      alert('请先选择要导出的数据');
      return;
    }

    // 转换为 CSV
    const csv = convertToCSV(selectedRows);
    downloadFile(csv, 'orders.csv');

    // 导出后清除选择
    tableRef.current?.resetSelection();
  };

  return (
    <div>
      <button onClick={handleExport}>导出选中数据</button>
      <DataTable
        ref={tableRef}
        data={orders}
        columns={columns}
        rowKey="orderId"
        enableRowSelection
      />
    </div>
  );
}
```

### 场景 3: 后端分页刷新当前页

```tsx
function ServerPaginatedTable() {
  const tableRef = useRef<DataTableRef<Product>>(null);
  const [pageData, setPageData] = useState<Product[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchPage = async () => {
    const data = await fetchProducts(pageIndex, pageSize);
    setPageData(data);
  };

  useEffect(() => {
    fetchPage();
  }, [pageIndex, pageSize]);

  return (
    <div>
      <button onClick={() => tableRef.current?.refresh()}>
        刷新当前页
      </button>
      <DataTable
        ref={tableRef}
        data={pageData}
        columns={columns}
        rowKey="productId"
        enablePagination={false}  // 使用自定义分页
        onRefresh={fetchPage}
      />
      <CustomPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

### 场景 4: 表单提交后重置表格

```tsx
function AddUserForm() {
  const tableRef = useRef<DataTableRef<User>>(null);
  const [users, setUsers] = useState<User[]>([]);

  const handleSubmit = async (formData: UserFormData) => {
    const newUser = await createUser(formData);

    // 添加到列表
    setUsers([newUser, ...users]);

    // 回到第一页查看新添加的数据
    tableRef.current?.resetPagination();
  };

  return (
    <div>
      <UserForm onSubmit={handleSubmit} />
      <DataTable
        ref={tableRef}
        data={users}
        columns={columns}
        rowKey="id"
        initialPageSize={10}
      />
    </div>
  );
}
```

### 场景 5: 监控选中状态

```tsx
function SelectionMonitor() {
  const tableRef = useRef<DataTableRef<Item>>(null);
  const [selectionInfo, setSelectionInfo] = useState('未选择');

  const updateSelectionInfo = () => {
    const rows = tableRef.current?.getSelectedRows();
    const ids = tableRef.current?.getSelectedRowIds();

    if (!rows || rows.length === 0) {
      setSelectionInfo('未选择');
    } else {
      setSelectionInfo(`已选中 ${rows.length} 条数据，ID: ${ids?.join(', ')}`);
    }
  };

  return (
    <div>
      <div className="p-4 bg-blue-50 rounded">
        {selectionInfo}
      </div>
      <button onClick={updateSelectionInfo}>更新选中信息</button>
      <DataTable
        ref={tableRef}
        data={items}
        columns={columns}
        rowKey="id"
        enableRowSelection
        onSelectionChange={updateSelectionInfo}  // 自动更新
      />
    </div>
  );
}
```

## 类型定义

```tsx
// DataTableRef 接口
export interface DataTableRef<TData = unknown> {
  refresh: () => void;
  resetSelection: () => void;
  resetPagination: () => void;
  getSelectedRows: () => TData[];
  getSelectedRowIds: () => string[];
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  getPaginationState: () => { pageIndex: number; pageSize: number };
}

// 使用时指定数据类型
const tableRef = useRef<DataTableRef<YourDataType>>(null);
```

## 注意事项

### 1. ref 可能为 null

始终使用可选链操作符 `?.` 来调用方法：

```tsx
// ✅ 推荐
tableRef.current?.refresh();

// ❌ 不推荐（可能报错）
tableRef.current.refresh();
```

### 2. 方法调用时机

确保在组件挂载后调用 ref 方法：

```tsx
// ✅ 正确：在 useEffect 或事件处理器中调用
useEffect(() => {
  tableRef.current?.refresh();
}, []);

// ❌ 错误：在渲染期间调用
const tableRef = useRef<DataTableRef>(null);
tableRef.current?.refresh();  // 此时 ref 还未绑定
```

### 3. 刷新方法依赖 onRefresh

`refresh()` 方法实际上是调用传入的 `onRefresh` 回调：

```tsx
// 必须提供 onRefresh
<DataTable
  ref={tableRef}
  onRefresh={fetchData}  // 必需
/>

// 调用时会触发 fetchData
tableRef.current?.refresh();
```

### 4. 后端分页的选中数据

使用后端分页时，`getSelectedRows()` 只返回当前 `data` 中的选中行：

```tsx
// 如果需要所有页的选中数据，使用 ID 列表
const selectedIds = tableRef.current?.getSelectedRowIds();

// 然后从后端获取完整数据
const fullData = await fetchDataByIds(selectedIds);
```

## 完整示例

查看 `src/example/RefApiExample.tsx` 获取完整的交互式示例。

## 最佳实践

1. **总是使用可选链**: `tableRef.current?.method()`
2. **类型安全**: 指定泛型类型 `DataTableRef<YourType>`
3. **及时清理**: 批量操作后调用 `resetSelection()`
4. **合理刷新**: 在数据变更后调用 `refresh()`
5. **分页控制**: 使用 `setPageIndex()` 和 `setPageSize()` 实现自定义分页
