// 打包脚本 - 将组件库编译为可分发的包
import { rmSync } from "node:fs";

console.log("🧹 清理旧的构建文件...");
rmSync("dist", { recursive: true, force: true });

console.log("📦 开始构建库...");

// 构建 ESM 格式
await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	format: "esm",
	target: "browser",
	minify: false,
	sourcemap: "external",
	external: [
		"react",
		"react-dom",
		"@tanstack/react-table",
		"tailwindcss",
	],
	naming: {
		entry: "index.js",
	},
});

console.log("✅ 构建完成!");
console.log("\n📂 输出目录: ./dist");
console.log("  - index.js (ESM 格式)");
console.log("  - index.js.map (Source Map)");
console.log("\n💡 提示:");
console.log("  1. 运行 'bun run build:types' 生成类型声明文件");
console.log("  2. 确保在使用项目中安装了 Tailwind CSS");
console.log("  3. 确保配置了 @tanstack/react-table 依赖");
