# My Table - 打包与使用指南

## 📦 如何打包组件库

### 1. 构建库文件

```bash
# 构建 JavaScript 文件
bun run build:lib

# 生成 TypeScript 类型声明文件
bun run build:types

# 一键构建所有文件（推荐）
bun run build:all
```

构建完成后，会在 `dist/` 目录下生成：
- `index.js` - ESM 格式的 JavaScript 文件
- `index.d.ts` - TypeScript 类型声明文件
- `index.js.map` - Source Map 文件

### 2. 本地测试

在发布到 npm 之前，你可以在本地测试：

```bash
# 在组件库项目根目录下
bun link

# 在其他项目中链接
cd /path/to/your-project
bun link my-table
```

### 3. 发布到 npm

```bash
# 首次发布前，确保已登录 npm
npm login

# 构建并发布（prepublishOnly 会自动运行 build:all）
npm publish

# 如果是私有包
npm publish --access=restricted

# 如果是公开包
npm publish --access=public
```

### 4. 使用 Git + npm 安装（不发布到 npm）

如果不想发布到 npm，可以直接从 Git 仓库安装：

```bash
# 在你的项目中
bun add github:yourusername/my-table

# 或使用特定分支/标签
bun add github:yourusername/my-table#v0.1.0
```

## 🚀 在其他项目中使用

### 安装依赖

```bash
# 从 npm 安装（发布后）
bun add my-table

# 同时安装 peer dependencies
bun add @tanstack/react-table react react-dom tailwindcss
```

### 配置 Tailwind CSS

在你的项目中，确保 Tailwind CSS 配置包含了组件库的样式：

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // 包含 node_modules 中的组件库
    "./node_modules/my-table/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 使用示例

```tsx
import { DataTable, type DataTableProps } from 'my-table';
import type { ColumnDef } from '@tanstack/react-table';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  status: string;
};

function App() {
  const data: Person[] = [
    { firstName: "张", lastName: "三", age: 25, status: "active" },
    { firstName: "李", lastName: "四", age: 30, status: "inactive" },
  ];

  const columns: ColumnDef<Person>[] = [
    { accessorKey: "firstName", header: "名" },
    { accessorKey: "lastName", header: "姓" },
    { accessorKey: "age", header: "年龄" },
    { accessorKey: "status", header: "状态" },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="age"
      enableRowSelection
      enableSorting
      enablePagination
      storageKey="my-app-table"
      onSelectionChange={(selectedRows) => {
        console.log("已选择:", selectedRows);
      }}
    />
  );
}
```

## 📋 可用组件和类型

```tsx
import {
  // 主要组件
  DataTable,           // 主表格组件
  ToolBar,             // 工具栏组件
  Checkbox,            // 复选框组件
  ColumnVisibility,    // 列可见性控制
  ColumnFilter,        // 列筛选
  ColumnHeader,        // 列标题
  TableSkeleton,       // 加载骨架屏

  // TypeScript 类型
  type DataTableProps,
  type DensityType,
} from 'my-table';
```

## 🔧 DataTable Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `data` | `TData[]` | 是 | - | 表格数据 |
| `columns` | `ColumnDef<TData>[]` | 是 | - | 列定义 |
| `rowKey` | `keyof TData` | 是 | - | 行的唯一标识字段 |
| `storageKey` | `string` | 否 | - | localStorage 存储 key |
| `loading` | `boolean` | 否 | `false` | 加载状态 |
| `enableRowSelection` | `boolean` | 否 | `false` | 启用行选择 |
| `enableSorting` | `boolean` | 否 | `true` | 启用排序 |
| `enablePagination` | `boolean` | 否 | `true` | 启用分页 |
| `initialPageSize` | `number` | 否 | `10` | 初始分页大小 |
| `pageSizeOptions` | `number[]` | 否 | `[10,20,30,40,50]` | 分页选项 |
| `showToolBar` | `boolean` | 否 | `true` | 显示工具栏 |
| `onRowClick` | `(row: TData) => void` | 否 | - | 行点击回调 |
| `onSelectionChange` | `(rows: TData[]) => void` | 否 | - | 选择变化回调 |
| `onRefresh` | `() => void` | 否 | - | 刷新回调 |
| `emptyState` | `ReactNode` | 否 | - | 自定义空状态 |

## 🎨 样式定制

组件使用 Tailwind CSS，你可以通过以下方式定制样式：

1. **修改 Tailwind 主题**
```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // 自定义主题色
        primary: {...},
      },
    },
  },
}
```

2. **覆盖组件样式**
```css
/* 在你的全局样式中 */
.data-table tr:hover {
  background-color: your-color;
}
```

## 📝 注意事项

1. **必须安装 peer dependencies**：组件库依赖 React、React DOM、Tanstack Table 和 Tailwind CSS
2. **Tailwind 配置**：确保 Tailwind 配置包含了组件库的文件路径
3. **类型支持**：完整的 TypeScript 类型定义，提供良好的开发体验
4. **浏览器兼容性**：支持所有现代浏览器（Chrome、Firefox、Safari、Edge）

## 🐛 故障排除

### 样式不显示
- 检查 `tailwind.config.js` 是否包含了 `node_modules/my-table` 路径
- 确保在入口文件中导入了 Tailwind CSS

### TypeScript 类型错误
- 确保安装了 `@types/react` 和 `@types/react-dom`
- 检查 TypeScript 版本是否 >= 5.0

### 组件不渲染
- 确保所有 peer dependencies 都已正确安装
- 检查 React 版本是否兼容（>= 18.0.0）

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
