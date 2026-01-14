import { useEffect, useState } from "react";

/**
 * 简单的Hash路由钩子
 * 监听URL hash变化并返回当前路由
 */
export function useHashRouter() {
	const [currentRoute, setCurrentRoute] = useState(() => {
		// 获取当前hash,去掉开头的#号
		return window.location.hash.slice(1) || "/";
	});

	useEffect(() => {
		// 监听hash变化
		const handleHashChange = () => {
			setCurrentRoute(window.location.hash.slice(1) || "/");
		};

		window.addEventListener("hashchange", handleHashChange);

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, []);

	// 导航函数
	const navigate = (path: string) => {
		window.location.hash = path;
	};

	return { currentRoute, navigate };
}
