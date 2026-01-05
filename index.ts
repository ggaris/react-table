import index from "./src/index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
  },
  development: {
    hmr: true, // 启用热模块替换
    console: true, // 在浏览器中显示控制台日志
  },
});

console.log(`🚀 服务器运行在 http://localhost:${server.port}`);