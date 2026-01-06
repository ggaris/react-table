# DataTable 企业级表格组件

基于 `@tanstack/react-table` 封装的功能完整、易用的企业级表格组件。

## 📁 项目结构

```
src/
├── components/               # 组件实现
│   └── table/               # 表格组件
│       ├── checkbox.tsx            # 复选框组件
│       ├── column-filter.tsx       # 列筛选组件
│       ├── column-header.tsx       # 列头组件
│       ├── column-visibility.tsx   # 列可见性配置组件
│       ├── data-table.tsx          # 主表格组件
│       ├── table-skeleton.tsx      # 加载骨架屏组件
│       ├── toolbar.tsx             # 工具栏组件
│       └── index.ts                # 统一导出
│
├── example/                 # 示例代码
│   ├── BasicExample.tsx            # 基础示例
│   └── makeData.ts                 # 模拟数据生成
│
├── index.tsx                # 应用入口
└── index.css                # 全局样式
```

## ✨ 功能特性

### 核心功能
- ✅ **分页** - 完整的分页控件,支持跳转、每页条数调整
- ✅ **排序** - 单列排序,点击列头切换升序/降序
- ✅ **筛选** - 列头筛选,支持文本关键词筛选
- ✅ **行选择** - Checkbox + 行点击混合模式,支持全选
- ✅ **列配置** - 显示/隐藏列,配置持久化到 localStorage

### 工具栏功能
- ✅ **刷新** - 重新加载表格数据
- ✅ **密度调整** - 三种密度(紧凑/默认/宽松)
- ✅ **列设置** - 管理列的显示/隐藏

### UI/UX 优化
- ✅ **企业级设计** - 清晰的视觉层次和专业交互
- ✅ **流畅动画** - 150ms 过渡动画,微交互反馈
- ✅ **Loading 状态** - 波浪式 shimmer 骨架屏
- ✅ **空状态** - 优雅的空数据提示
- ✅ **响应式** - 水平滚动支持

## 🚀 快速开始

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun run dev
```

### 基础用法

```tsx
import { DataTable } from './components/table';
import type { ColumnDef } from '@tanstack/react-table';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

function MyTable() {
  const data = [
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

## 📖 API 文档

### DataTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | TData[] | required | 表格数据 |
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

### 密度类型

```typescript
type DensityType = 'compact' | 'default' | 'comfortable';
```

| 密度 | 间距 | 适用场景 |
|------|------|----------|
| compact | px-4 py-2 | 数据密集,需要在一屏显示更多内容 |
| default | px-6 py-4 | 平衡的阅读体验(推荐) |
| comfortable | px-8 py-6 | 强调可读性,内容较少时 |

## 🛠️ 技术栈

- React 19
- TypeScript 5
- @tanstack/react-table 8
- Tailwind CSS 4
- Bun (运行时和包管理器)

## 📝 开发命令

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建
bun run build
```

## 📄 License

MIT
