export default defineConfig(() => {
  return {
    base: './', // 💡 新增这一行：支持 GitHub Pages 子路径部署
    plugins: [react(), tailwindcss()],
    ...
  }
})
