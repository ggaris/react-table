import React from "react";

interface NavLinkProps {
	to: string;
	children: React.ReactNode;
	active?: boolean;
}

/**
 * 导航链接组件
 */
function NavLink({ to, children, active }: NavLinkProps) {
	return (
		<a
			href={`#${to}`}
			className={`px-4 py-2 rounded-lg font-medium transition-colors ${
				active
					? "bg-blue-600 text-white"
					: "bg-white text-gray-700 hover:bg-gray-100"
			}`}
		>
			{children}
		</a>
	);
}

interface NavigationProps {
	currentRoute: string;
}

/**
 * 顶部导航栏组件
 */
export function Navigation({ currentRoute }: NavigationProps) {
	const routes = [
		{ path: "/", label: "Request 模式", icon: "🌐" },
		{ path: "/server-pagination", label: "后端分页", icon: "📡" },
		{ path: "/ref-api", label: "Ref API", icon: "🎯" },
	];

	return (
		<nav className="bg-gray-100 border-b border-gray-200 mb-8 -mx-8 px-8 py-4">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							DataTable 组件示例
						</h1>
						<p className="text-gray-600 mt-1">
							基于 @tanstack/react-table 封装的企业级表格组件
						</p>
					</div>
				</div>
				<div className="flex gap-3">
					{routes.map((route) => (
						<NavLink
							key={route.path}
							to={route.path}
							active={currentRoute === route.path}
						>
							<span className="mr-1">{route.icon}</span>
							{route.label}
						</NavLink>
					))}
				</div>
			</div>
		</nav>
	);
}
