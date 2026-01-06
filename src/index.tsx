import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// 主应用组件
function App() {
	return (
		<div className="app">
			<header className="header">
				<h1 className="text-amber-200">React Table 示例</h1>
				<p>使用 Bun + React + TanStack Table 构建</p>
			</header>
			<main className="main">
				<div className="welcome">
					<h2>欢迎使用!</h2>
					<p>项目已成功初始化,现在可以开始开发了。</p>
				</div>
			</main>
		</div>
	);
}

// 渲染应用
const rootElement = document.getElementById("root");
if (rootElement) {
	const root = createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
