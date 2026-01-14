import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RequestModeExample } from "./examples/RequestModeExample";
import { ServerPaginationExample } from "./examples/ServerPaginationExample";

function App() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						DataTable 组件示例
					</h1>
					<p className="text-gray-600">
						基于 @tanstack/react-table 封装的企业级表格组件
					</p>
				</div>

				{/* 基础示例 */}
				<section>
					<h2 className="text-xl font-semibold text-gray-900 mb-4">基础示例</h2>
					{/* <ServerPaginationExample /> */}
					<RequestModeExample />
				</section>
			</div>
		</div>
	);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
