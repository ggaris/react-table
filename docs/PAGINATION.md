# 分页和行选择优化说明

## 问题修复

### 1. 全选只选中当前页数据

**问题**: 之前的全选checkbox会选中所有数据（包括其他页面的）

**解决方案**:
- 将 `toggleAllRowsSelected()` 改为 `toggleAllPageRowsSelected()`
- 将 `getIsAllRowsSelected()` 改为 `getIsAllPageRowsSelected()`
- 将 `getIsSomeRowsSelected()` 改为 `getIsSomePageRowsSelected()`

**代码位置**: `src/components/table/table.tsx:213-219`

```tsx
<Checkbox
  checked={table.getIsAllPageRowsSelected()}
  indeterminate={
    table.getIsSomePageRowsSelected() &&
    !table.getIsAllPageRowsSelected()
  }
  onChange={(checked) =>
    table.toggleAllPageRowsSelected(checked)
  }
  ariaLabel="全选当前页"
/>
```

### 2. 优化后端分页状态管理

**问题**: 后端分页时，行选择状态保存不正确

**解决方案**:
添加 `getRowId` 配置，使用 `rowKey` 作为每行的唯一标识符

**代码位置**: `src/components/table/table.tsx:141`

```tsx
const table = useReactTable({
  // ...其他配置
  getRowId: (row) => String(row[rowKey]),
  // ...
});
```

**为什么重要**:
- 前端分页：基于数组索引管理选中状态（默认行为）
- 后端分页：每次切换页面，data 数组会完全替换，索引会重置
- 使用 `getRowId` 后：基于唯一ID管理选中状态，跨页选择能正确保存

## 使用示例

### 前端分页（默认）

适用于所有数据都在前端的场景：

```tsx
<DataTable
  data={allData}              // 所有数据
  columns={columns}
  rowKey="id"                 // 唯一标识字段
  enableRowSelection
  enablePagination            // 前端自动分页
  initialPageSize={10}
/>
```

**特点**:
- ✅ 全选当前页：只选中当前显示的10条
- ✅ 跨页选择：可以在第1页选3条，第2页选5条
- ✅ 状态保持：切换页面后，之前的选择不会丢失

### 后端分页

适用于数据量大，需要从后端按页获取的场景：

```tsx
import { ServerPaginationExample } from './example/ServerPaginationExample';

// 查看完整示例: src/example/ServerPaginationExample.tsx
```

**关键点**:
1. **必须设置 rowKey**: 指向数据的唯一标识字段（如 id、uuid）
2. **data 只包含当前页数据**: 每次翻页从后端获取新数据
3. **禁用前端分页**: 设置 `enablePagination={false}`
4. **自定义分页控件**: 使用自己的分页控件来控制后端请求

**工作原理**:
```
用户点击第2页
  ↓
前端请求后端 API (page=2, pageSize=10)
  ↓
后端返回第2页的10条数据
  ↓
前端更新 data 状态
  ↓
DataTable 重新渲染，但保持之前选中的行（基于 rowKey）
```

## 选中状态说明

### 选中数量统计

显示在分页信息中的"已选 X 条"：
- 显示的是跨所有页面选中的总数
- 基于 rowSelection 对象的键数量
- 对前端分页和后端分页都有效

```tsx
{Object.keys(rowSelection).length > 0 && (
  <span>已选 {Object.keys(rowSelection).length} 条</span>
)}
```

### 获取选中的行数据

通过 `onSelectionChange` 回调：

```tsx
<DataTable
  onSelectionChange={(selectedRows) => {
    console.log('选中的行:', selectedRows);
    console.log('选中的ID:', selectedRows.map(r => r.id));
  }}
/>
```

**注意**:
- **前端分页**: `selectedRows` 包含所有选中行的完整数据
- **后端分页**: `selectedRows` 只包含当前 `data` 中被选中的行
  - 如果需要获取所有选中行的ID，需要自己维护一个ID列表

### 后端分页时维护完整选中列表

```tsx
function MyComponent() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <DataTable
      data={currentPageData}
      rowKey="id"
      onSelectionChange={(rows) => {
        // 获取当前选中的ID
        const currentIds = rows.map(r => r.id);

        // 合并到总列表（需要自己实现合并逻辑）
        setSelectedIds(prev => {
          const newIds = new Set([...prev, ...currentIds]);
          // 移除取消选中的
          const currentPageIds = currentPageData.map(d => d.id);
          currentPageIds.forEach(id => {
            if (!currentIds.includes(id)) {
              newIds.delete(id);
            }
          });
          return Array.from(newIds);
        });
      }}
    />
  );
}
```

## 最佳实践

### 1. 始终设置 rowKey

```tsx
// ❌ 不推荐：没有设置 rowKey
<DataTable data={data} columns={columns} />

// ✅ 推荐：设置唯一的 rowKey
<DataTable
  data={data}
  columns={columns}
  rowKey="id"  // 或 "uuid", "userId" 等唯一字段
/>
```

### 2. 后端分页使用自定义控件

```tsx
// ✅ 推荐
<DataTable
  data={currentPageData}
  enablePagination={false}  // 禁用内置分页
/>
<CustomPagination
  onPageChange={fetchPage}
/>

// ❌ 不推荐：让 DataTable 自己分页后端数据
<DataTable
  data={currentPageData}  // 只有10条
  enablePagination={true}  // 会对这10条再分页
/>
```

### 3. 清除选择

添加一个清除按钮：

```tsx
const [rowSelection, setRowSelection] = useState({});

<button onClick={() => setRowSelection({})}>
  清除选择
</button>

<DataTable
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
  // ... 其他props
/>
```

## 测试建议

### 测试场景

1. **前端分页测试**
   - [ ] 全选当前页，翻页，再全选，验证总数是 20
   - [ ] 选中几条，翻页，再回来，验证选中状态保持
   - [ ] 取消全选，验证所有页都被清除

2. **后端分页测试**
   - [ ] 在第1页选中3条
   - [ ] 切换到第2页（模拟API请求）
   - [ ] 验证第1页的选择仍然存在
   - [ ] 在第2页选中2条
   - [ ] 验证总共选中5条

3. **边界情况**
   - [ ] 最后一页数据不满一页时的全选
   - [ ] 数据为空时的全选按钮状态
   - [ ] 快速切换页面时的状态一致性

## 常见问题

### Q: 为什么后端分页时选中的数据看不到完整信息？

A: 因为 `onSelectionChange` 回调只能访问当前 `data` 中的行。如果需要完整信息，有两个方案：
1. 在前端维护一个完整的选中行数据映射
2. 只维护选中的ID列表，需要时从后端查询完整信息

### Q: 可以实现"全选所有页"的功能吗？

A: 可以，但需要知道所有数据的ID：

```tsx
const [rowSelection, setRowSelection] = useState({});

// 全选所有（需要所有ID）
const selectAll = () => {
  const allIds = {}; // 从后端获取所有ID
  allDataIds.forEach(id => {
    allIds[id] = true;
  });
  setRowSelection(allIds);
};
```

### Q: 切换页面大小时，选中状态会丢失吗？

A: 不会。因为使用了 `getRowId`，选中状态基于唯一ID，不受分页大小影响。
