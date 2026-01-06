await Bun.build({
	entrypoints: ["./src/index.html"],
	outdir: "./build",
});

export {};
