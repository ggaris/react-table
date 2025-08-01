import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ command }) => {
	const isLib = command === 'build'
	
	return {
		plugins: [
			react(),
			...(isLib ? [dts({
				include: ["src/**/*"],
				exclude: ["src/**/*.test.*", "src/**/*.stories.*", "src/demo/**/*"],
			})] : [])
		],
		...(isLib ? {
			build: {
				lib: {
					entry: resolve(__dirname, "src/index.ts"),
					name: "PaaTable",
					formats: ["es", "cjs"],
					fileName: (format) => `index.${format === "es" ? "es.js" : "js"}`,
				},
				rollupOptions: {
					external: [
						"react", 
						"react-dom", 
						"@tanstack/react-table",
						"@dnd-kit/core",
						"@dnd-kit/sortable", 
						"@dnd-kit/utilities"
					],
					output: {
						globals: {
							react: "React",
							"react-dom": "ReactDOM",
							"@tanstack/react-table": "ReactTable",
							"@dnd-kit/core": "DndKitCore",
							"@dnd-kit/sortable": "DndKitSortable",
							"@dnd-kit/utilities": "DndKitUtilities",
						},
					},
				},
			},
		} : {}),
		css: {
			postcss: {
				plugins: [tailwindcss, autoprefixer],
			},
		},
	}
});
