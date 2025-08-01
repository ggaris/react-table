# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 TanStack Table 的 React 表格组件库，使用 TypeScript 开发，TailwindCSS 编写样式，使用 Vite 作为构建工具，Bun 作为包管理器，Biome 进行代码格式化和检查。

## 核心架构

- **主组件**: `src/components/PaaTable.tsx` - 基于 TanStack Table 的核心表格组件
- **入口文件**: `src/index.ts` - 导出主要组件和类型定义
- **样式文件**: `src/index.css` - TailwindCSS 基础样式

### 技术栈
- React 18+ (peerDependency)
- TanStack Table v8 - 表格功能核心
- TailwindCSS - 样式系统  
- TypeScript - 类型安全
- Vite - 构建工具和开发服务器
- Biome - 代码格式化和检查
- Vitest - 测试框架

## 常用命令

### 开发
```bash
bun install              # 安装依赖
bun run dev             # 启动开发服务器
bun run build           # 构建生产版本
bun run build:watch     # 监听模式构建
bun run preview         # 预览构建结果
```

### 代码质量
```bash
bun run lint            # 运行 Biome 代码检查
bun run lint:fix        # 自动修复 Biome 检查问题
bun run format          # 检查代码格式
bun run format:fix      # 自动格式化代码
bun run check           # 运行完整检查（格式+lint）
bun run check:fix       # 自动修复所有问题
bun run type-check      # TypeScript 类型检查
```

### 测试
```bash
bun run test            # 运行测试
bun run test:ui         # 运行测试 UI
bun run test:coverage   # 运行测试覆盖率
```

## 组件库结构

### PaaTable 组件特性
- 基于 TanStack Table 的完整表格功能
- 支持排序、过滤、分页
- 使用 TailwindCSS 样式，支持自定义样式
- TypeScript 完整类型支持
- 响应式设计

### 关键配置文件
- `vite.config.ts` - Vite 构建配置，包含库模式设置
- `biome.json` - Biome 代码格式化和检查配置
- `tailwind.config.js` - TailwindCSS 配置
- `tsconfig.json` - TypeScript 编译配置
- `package.json` - 包信息和依赖，配置为 ESM 模块

## 开发指南

### 添加新组件
1. 在 `src/components/` 下创建新组件文件
2. 使用 TypeScript 编写，遵循现有命名约定
3. 在 `src/index.ts` 中导出新组件
4. 使用 TailwindCSS 类进行样式设计

### 样式约定
- 使用 TailwindCSS 实用类
- 遵循响应式设计原则
- 保持一致的色彩和间距规范

### 代码风格
- 使用 Biome 自动格式化代码
- 单引号字符串，双引号 JSX 属性
- 2 空格缩进
- 80 字符行宽限制

### 构建输出
- ESM 和 CJS 双格式输出
- 自动生成 TypeScript 声明文件
- CSS 单独输出供外部引用