# ReactTable 使用示例

## 新的参数结构

重构后的组件使用配置对象来组织相关参数，使代码更加清晰和易于维护。

### 基础用法

```tsx
import ReactTable from 'react-table'

// 简单表格
<ReactTable
  data={data}
  columns={columns}
/>

// 自定义分页大小
<ReactTable
  data={data}
  columns={columns}
  pagination={{ pageSize: 20 }}
/>
```

### 功能配置

```tsx
// 禁用某些功能
<ReactTable
  data={data}
  columns={columns}
  features={{
    sorting: false,
    pagination: false,
    columnDragging: false,
  }}
/>

// 启用所有功能（默认）
<ReactTable
  data={data}
  columns={columns}
  features={{
    sorting: true,
    filtering: true,
    pagination: true,
    columnDragging: true,
    columnResizing: true,
    autoFitColumns: true,
  }}
/>
```

### 回调函数

```tsx
<ReactTable
  data={data}
  columns={columns}
  callbacks={{
    onColumnOrderChange: (order) => console.log('列顺序变更:', order),
    onColumnSizingChange: (sizing) => console.log('列宽变更:', sizing),
  }}
/>
```

### 完整配置示例

```tsx
<ReactTable
  data={data}
  columns={columns}
  className="custom-table"
  features={{
    sorting: true,
    filtering: true,
    pagination: true,
    columnDragging: true,
    columnResizing: true,
    autoFitColumns: true,
  }}
  pagination={{
    pageSize: 15,
  }}
  callbacks={{
    onColumnOrderChange: handleColumnOrderChange,
    onColumnSizingChange: handleColumnSizingChange,
  }}
/>
```

## 类型定义

```tsx
import type {
  ReactTableProps,
  TableFeatures,
  PaginationConfig,
  TableCallbacks,
} from 'react-table'

// 功能配置类型
const features: TableFeatures = {
  sorting: true,
  filtering: false,
  // ...
}

// 分页配置类型
const paginationConfig: PaginationConfig = {
  pageSize: 20,
}

// 回调配置类型  
const callbacks: TableCallbacks = {
  onColumnOrderChange: (order) => console.log(order),
  onColumnSizingChange: (sizing) => console.log(sizing),
}
```

## 迁移指南

### 旧 API → 新 API

```tsx
// 旧写法
<ReactTable
  data={data}
  columns={columns}
  enableSorting={false}
  enablePagination={true}
  pageSize={20}
  onColumnOrderChange={handleOrderChange}
/>

// 新写法
<ReactTable
  data={data}
  columns={columns}
  features={{
    sorting: false,
    pagination: true,
  }}
  pagination={{
    pageSize: 20,
  }}
  callbacks={{
    onColumnOrderChange: handleOrderChange,
  }}
/>
```

## 优势

1. **参数分组**：相关参数归类到对象中，更加清晰
2. **更好的扩展性**：未来添加新配置无需修改接口
3. **类型安全**：每个配置对象都有明确的类型定义
4. **向后兼容**：通过默认值保持API的易用性