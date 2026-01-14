import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RequestModeExample } from "./examples/RequestModeExample";
import { ServerPaginationExample } from "./examples/ServerPaginationExample";
import { RefApiExample } from "./examples/RefApiExample";
import { Navigation } from "./components/Navigation";
import { useHashRouter } from "./hooks/useHashRouter";

function App() {
	const { currentRoute } = useHashRouter();

	// 根据当前路由渲染对应的示例组件
	const renderContent = () => {
		switch (currentRoute) {
			case "/":
				return <RequestModeExample />;
			case "/server-pagination":
				return <ServerPaginationExample />;
			case "/ref-api":
				return <RefApiExample />;
			default:
				return (
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							页面未找到
						</h2>
						<p className="text-gray-600">请选择上方的示例查看</p>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<Navigation currentRoute={currentRoute} />
			<div className="max-w-7xl mx-auto">
				<section>{renderContent()}</section>
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
