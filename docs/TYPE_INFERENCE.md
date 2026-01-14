# 泛型类型推断测试

## 类型推断验证

DataTable 组件现在支持完整的泛型类型推断。当你传入 `data` 时，TypeScript 会自动推断出类型，并确保 `columns` 和 `rowKey` 与数据类型匹配。

## 测试用例

### ✅ 正确的类型推断

```tsx
type User = {
  id: string;
  name: string;
  age: number;
  email: string;
};

const users: User[] = [
  { id: '1', name: 'Alice', age: 25, email: 'alice@example.com' },
  { id: '2', name: 'Bob', age: 30, email: 'bob@example.com' },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: '姓名' },
  { accessorKey: 'age', header: '年龄' },
  { accessorKey: 'email', header: '邮箱' },
];

// ✅ 类型推断正确
<DataTable
  data={users}
  columns={columns}
  rowKey="id"  // TypeScript 知道 rowKey 必须是 'id' | 'name' | 'age' | 'email'
/>

// ❌ TypeScript 会报错：rowKey 必须是 User 的键
<DataTable
  data={users}
  columns={columns}
  rowKey="invalidKey"  // 错误！
/>
```

### ✅ Ref 类型推断

```tsx
// ✅ ref 的类型会自动推断
const tableRef = useRef<DataTableRef<User>>(null);

<DataTable
  ref={tableRef}
  data={users}
  columns={columns}
  rowKey="id"
/>

// ✅ 获取选中数据时，返回类型是 User[]
const selectedUsers = tableRef.current?.getSelectedRows();
// selectedUsers 的类型是 User[]

// ✅ 可以安全地访问 User 的属性
selectedUsers?.forEach(user => {
  console.log(user.name, user.email);
});
```

### ✅ 列定义类型检查

```tsx
// ✅ accessorKey 必须是 User 的键
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: '姓名' },  // ✅
  { accessorKey: 'age', header: '年龄' },   // ✅
];

// ❌ TypeScript 会报错
const badColumns: ColumnDef<User>[] = [
  { accessorKey: 'invalidKey', header: '无效' },  // 错误！
];
```

### ✅ 复杂嵌套类型

```tsx
type Product = {
  productId: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  tags: string[];
};

const products: Product[] = [...];

const columns: ColumnDef<Product>[] = [
  { accessorKey: 'name', header: '产品名' },
  { accessorKey: 'price', header: '价格' },
  {
    id: 'category',
    header: '分类',
    // ✅ cell 函数的参数类型自动推断为 CellContext<Product>
    cell: (info) => {
      // info.row.original 的类型是 Product
      return info.row.original.category.name;
    },
  },
];

// ✅ rowKey 可以是顶层属性
<DataTable
  data={products}
  columns={columns}
  rowKey="productId"  // ✅
/>

// ❌ rowKey 不能是嵌套属性
<DataTable
  data={products}
  columns={columns}
  rowKey="category.id"  // 错误！rowKey 必须是 keyof Product
/>
```

### ✅ 可选属性处理

```tsx
type Order = {
  orderId: string;
  amount: number;
  note?: string;  // 可选属性
  customer?: {
    name: string;
  };
};

const orders: Order[] = [...];

// ✅ rowKey 可以是可选属性
<DataTable
  data={orders}
  columns={columns}
  rowKey="note"  // ✅ 虽然是可选的，但仍然是有效的 key
/>
```

### ✅ 联合类型

```tsx
type Item = {
  id: string;
  type: 'product' | 'service';
  name: string;
};

const items: Item[] = [...];

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'type',
    header: '类型',
    // ✅ getValue() 返回 'product' | 'service'
    cell: (info) => {
      const type = info.getValue();  // type: 'product' | 'service'
      return type === 'product' ? '产品' : '服务';
    },
  },
];
```

## 不需要手动指定泛型

由于类型推断的存在，大多数情况下你不需要手动指定泛型类型：

```tsx
// ✅ 推荐：让 TypeScript 自动推断
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
/>

// ⚠️ 不推荐但有效：手动指定
<DataTable<User>
  data={users}
  columns={columns}
  rowKey="id"
/>
```

## 类型错误示例

### 错误 1: rowKey 类型不匹配

```tsx
type User = {
  userId: string;
  name: string;
};

// ❌ 错误：'id' 不是 User 的键
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
/>
// TypeScript 错误：Type '"id"' is not assignable to type 'keyof User'
```

### 错误 2: columns 类型不匹配

```tsx
type User = {
  id: string;
  name: string;
};

type Product = {
  productId: string;
  title: string;
};

const productColumns: ColumnDef<Product>[] = [...];

// ❌ 错误：columns 是 Product 的，但 data 是 User
<DataTable
  data={users}
  columns={productColumns}
  rowKey="id"
/>
// TypeScript 错误：Type 'ColumnDef<Product>[]' is not assignable to type 'ColumnDef<User>[]'
```

### 错误 3: ref 类型不匹配

```tsx
const tableRef = useRef<DataTableRef<Product>>(null);

// ❌ 错误：ref 期望 Product 但 data 是 User
<DataTable
  ref={tableRef}
  data={users}
  columns={userColumns}
  rowKey="id"
/>
```

## 最佳实践

### 1. 定义清晰的类型

```tsx
// ✅ 好：明确的类型定义
type User = {
  id: string;
  name: string;
  age: number;
};

const users: User[] = [...];
const columns: ColumnDef<User>[] = [...];
```

### 2. 使用 const assertion

```tsx
// ✅ 好：使用 as const 获得更精确的类型
const columns = [
  { accessorKey: 'name' as const, header: '姓名' },
  { accessorKey: 'age' as const, header: '年龄' },
] satisfies ColumnDef<User>[];
```

### 3. 提取常量

```tsx
// ✅ 好：提取为常量以便重用
const USER_COLUMNS: ColumnDef<User>[] = [...];
const USER_ROW_KEY: keyof User = 'id';

<DataTable
  data={users}
  columns={USER_COLUMNS}
  rowKey={USER_ROW_KEY}
/>
```

### 4. 使用辅助函数

```tsx
// ✅ 好：创建类型安全的辅助函数
function createUserTable(users: User[]) {
  const columns: ColumnDef<User>[] = [...];

  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
    />
  );
}
```

## 类型声明位置

生成的类型声明文件位于：
- `dist/components/table/table.d.ts`
- `dist/index.d.ts`

你可以查看这些文件来确认类型定义是否符合预期。

## TypeScript 配置建议

为了获得最佳的类型检查体验，建议在 `tsconfig.json` 中启用严格模式：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

这样 TypeScript 会更积极地检查类型错误，帮助你在编译时发现问题。
