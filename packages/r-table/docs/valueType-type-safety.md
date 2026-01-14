# ValueType 类型安全优化

本文档说明了 ValueType 配置的类型安全优化方案。

## 优化内容

### 1. 类型映射（ValueTypeConfigMap）

创建了一个类型映射，将每个 `ValueType` 映射到对应的配置类型：

```typescript
export interface ValueTypeConfigMap {
  text: never;
  digit: never;
  money: MoneyConfig;
  percent: PercentConfig;
  date: DateConfig;
  dateTime: DateTimeConfig;
  time: TimeConfig;
  select: SelectConfig;
  progress: ProgressConfig;
  avatar: AvatarConfig;
  image: ImageConfig;
  code: CodeConfig;
  jsonCode: never;
  tag: TagConfig;
  option: never;
}
```

### 2. 工具类型（GetConfigByValueType）

根据 `ValueType` 自动推断对应的配置类型：

```typescript
export type GetConfigByValueType<T extends ValueType> =
  ValueTypeConfigMap[T] extends never ? undefined : ValueTypeConfigMap[T];
```

### 3. 函数重载

为 `getValueTypeRender` 函数添加了多个重载签名，支持类型推断：

```typescript
// money 类型
export function getValueTypeRender(
  valueType: "money",
  value: unknown,
  config?: GetConfigByValueType<"money">, // 推断为 MoneyConfig
): React.ReactNode;

// percent 类型
export function getValueTypeRender(
  valueType: "percent",
  value: unknown,
  config?: GetConfigByValueType<"percent">, // 推断为 PercentConfig
): React.ReactNode;

// ... 更多重载
```

### 4. 类型安全的列配置

添加了 `TypedColumnValueTypeConfig` 类型，根据 `valueType` 自动约束 `fieldProps` 类型：

```typescript
export type TypedColumnValueTypeConfig<
  TData = unknown,
  T extends ValueType = ValueType,
> = {
  valueType?: T;
  fieldProps?: GetConfigByValueType<T>; // 根据 T 自动推断
  render?: (value: unknown, record: TData, index: number) => React.ReactNode;
};
```

## 使用示例

### 直接使用 getValueTypeRender

```typescript
// 类型安全：config 参数会被推断为 MoneyConfig
const moneyElement = getValueTypeRender("money", 12345, {
  symbol: "¥",
  precision: 2,
  separator: true,
});

// 类型安全：config 参数会被推断为 PercentConfig
const percentElement = getValueTypeRender("percent", 0.85, {
  precision: 2,
  showSymbol: true,
});

// 类型错误：TypeScript 会提示错误，因为 symbol 不是 PercentConfig 的属性
const wrongElement = getValueTypeRender("percent", 0.85, {
  symbol: "¥", // ❌ TypeScript 错误
});
```

### 在列定义中使用

```typescript
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
    accessorKey: "discount",
    header: "折扣",
    valueType: "percent",
    fieldProps: {
      precision: 0,
      showSymbol: true,
    },
  },
];
```

## 技术细节

### 函数重载 vs 实现

函数重载只影响**调用侧**的类型检查，不影响**实现侧**。在实现中，我们使用类型断言来确保类型安全：

```typescript
switch (valueType) {
  case "money":
    return <MoneyRender value={value} config={config as MoneyConfig} />;
  case "percent":
    return <PercentRender value={value} config={config as PercentConfig} />;
  // ...
}
```

### 为什么需要类型断言

在运行时，TypeScript 无法在 switch 语句中自动缩窄联合类型。虽然我们知道当 `valueType === "money"` 时，`config` 应该是 `MoneyConfig`，但 TypeScript 编译器无法自动推断这一点。因此，我们需要使用类型断言 `as MoneyConfig` 来告诉编译器这是安全的。

## 未来改进

虽然当前的类型系统已经提供了很好的类型安全保证，但在某些场景下（如动态的 `valueType`），TypeScript 仍然无法自动推断类型。可以考虑以下改进：

1. **使用 discriminated union**：创建一个判别联合类型，将 `valueType` 和 `config` 绑定在一起
2. **使用 builder pattern**：提供类型安全的构建器函数，确保类型在编译时就被确定

## 总结

本次类型优化提供了以下好处：

1. ✅ **编译时类型检查**：在编写代码时就能发现类型错误
2. ✅ **更好的 IDE 提示**：编辑器可以提供精确的类型提示和自动完成
3. ✅ **减少运行时错误**：类型安全减少了配置错误的可能性
4. ✅ **更好的文档**：类型本身就是最好的文档
