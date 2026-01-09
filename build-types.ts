// 生成类型声明文件的脚本
import { rmSync, writeFileSync } from "node:fs";
import { $ } from "bun";

console.log("📝 生成 TypeScript 类型声明文件...");

try {
	// 创建专用的 tsconfig 用于类型生成
	const buildConfig = {
		compilerOptions: {
			lib: ["ESNext", "DOM"],
			target: "ESNext",
			module: "ESNext",
			moduleResolution: "bundler",
			jsx: "react-jsx",
			declaration: true,
			emitDeclarationOnly: true,
			outDir: "./dist",
			skipLibCheck: true,
			strict: true,
			noEmit: false,
			allowImportingTsExtensions: false,
		},
		include: ["src/index.ts", "src/components/**/*"],
		exclude: ["src/example/**/*", "node_modules", "dist"],
	};

	// 写入临时配置文件
	writeFileSync(
		"tsconfig.build.json",
		JSON.stringify(buildConfig, null, 2),
	);

	// 使用 tsc 生成类型声明
	await $`bunx tsc -p tsconfig.build.json`;
	console.log("✅ 类型声明文件生成完成!");
} catch (error) {
	console.error("❌ 生成类型声明失败:", error);
	process.exit(1);
} finally {
	// 清理临时配置文件
	rmSync("tsconfig.build.json", { force: true });
}
