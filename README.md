# r-table Monorepo

一个功能丰富的 React 数据表格组件开发环境，采用 Bun Workspace 结构管理。

## 📦 包结构

- **[r-table](./packages/r-table)** - 核心表格组件库（可发布到 npm）
- **[examples](./packages/examples)** - 演示和开发环境（私有包）

## 🚀 快速开始

### 安装依赖

```bash
bun install
```

### 启动开发环境

```bash
bun run dev
```

访问 http://localhost:3000 查看示例。

### 构建所有包

```bash
bun run build
```

## 📚 文档

- [分页功能详解](./docs/PAGINATION.md) - 分页和行选择优化说明
- [Ref API 使用指南](./docs/REF_API.md) - 命令式 API 文档
- [Request 模式详解](./docs/REQUEST_MODE.md) - 异步数据获取模式
- [ValueType 使用指南](./docs/VALUETYPE.md) - 列类型自动格式化功能
- [类型推断说明](./docs/TYPE_INFERENCE.md) - TypeScript 类型推断
- [打包发布指南](./docs/PACKAGING.md) - 发布到 npm 的流程

## 🛠️ 开发

### 同时开发库和示例

示例应用通过 TypeScript 路径映射直接引用库源码（`packages/r-table/src`），修改库代码后会实时生效，无需重新构建。

### 类型检查

```bash
# 检查所有包
bun run typecheck

# 仅检查库
bun run typecheck:lib

# 仅检查示例
bun run typecheck:examples
```

### 代码规范

```bash
# 检查代码规范
bun run lint

# 自动修复
bun run lint:fix
```

### 构建命令

```bash
# 构建库
bun run build:lib

# 构建示例应用
bun run build:examples

# 清理所有构建产物和依赖
bun run clean
```

## 📦 发布流程

1. 确保所有测试通过和代码规范检查通过
2. 构建库：`cd packages/r-table && bun run build`
3. 更新版本号（手动编辑 `packages/r-table/package.json`）
4. 发布到 npm：`cd packages/r-table && npm publish`

## ✨ 功能特性

### 核心功能
- ✅ **分页** - 完整的分页控件，支持跳转、每页条数调整
- ✅ **排序** - 单列排序，点击列头切换升序/降序
- ✅ **筛选** - 列头筛选，支持文本关键词筛选
- ✅ **行选择** - Checkbox + 行点击混合模式，支持全选
- ✅ **列配置** - 显示/隐藏列，配置持久化到 localStorage
- ✅ **ValueType** - 列类型自动格式化，支持 money、percent、date、select 等 14 种类型

### 数据模式
- ✅ **Data 模式** - 直接传入数据数组（前端分页）
- ✅ **Request 模式** - 传入异步请求函数（后端分页）
- ✅ **Ref API** - 命令式控制表格

### UI/UX 优化
- ✅ **企业级设计** - 清晰的视觉层次和专业交互
- ✅ **流畅动画** - 150ms 过渡动画，微交互反馈
- ✅ **Loading 状态** - 波浪式 shimmer 骨架屏
- ✅ **空状态** - 优雅的空数据提示
- ✅ **响应式** - 水平滚动支持

## 🛠️ 技术栈

- React 19
- TypeScript 5
- @tanstack/react-table 8
- Tailwind CSS 4
- Bun（运行时和包管理器）

## 📄 License

MIT
