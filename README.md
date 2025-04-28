## 项目简介

md2wx 是一个将 Markdown 文件转换为微信公众号文章格式的在线工具。它允许用户编写 Markdown 内容，并实时预览在微信公众号中的显示效果，支持多种主题样式，使得内容创作更加高效和便捷。

## 功能特点

- ✨ Markdown 实时预览和编辑
- 🎨 多种主题样式可选
- 📋 一键复制 HTML 代码到微信公众号
- 🔒 密码保护功能
- 📊 访问统计功能
- 💾 自动保存编辑内容到本地

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- markdown-it

## 安装和使用

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/yourusername/md2wx.git
cd md2wx
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问 `http://localhost:5173`

### 构建部署

1. 构建项目
```bash
pnpm build
```

2. 预览构建结果
```bash
pnpm preview
```

3. 部署 `dist` 目录内容到你的服务器

## 使用方法

1. 在左侧编辑器中编写 Markdown 内容
2. 右侧实时预览微信公众号效果
3. 使用顶部工具栏选择不同主题样式
4. 点击复制按钮将 HTML 代码复制到微信公众号编辑器中

## 贡献指南

欢迎提交 Pull Request 或创建 Issue 来帮助改进这个项目！

## 许可证

[MIT 许可证](LICENSE)
