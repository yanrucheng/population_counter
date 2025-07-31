# 人流量统计器

一个基于React的人流量统计应用，专为店铺客流分析设计。

## 功能特点

- 🎯 实时统计路过、注意、咨询、购买四类数据
- 👥 支持人群细分（性别、年龄组）
- 📊 实时数据可视化与统计报告
- 💾 本地数据持久化存储
- ⌨️ 键盘快捷键支持
- 📱 响应式设计，支持移动端
- 📈 数据导出功能（JSON/CSV格式）

## 部署到GitHub Pages

### 方法1：使用GitHub Actions自动部署（推荐）

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库，命名为 `population_counter`
   - 不要初始化README，直接创建空仓库

2. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/population_counter.git
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库的 Settings → Pages
   - 在 "Source" 下拉菜单中选择 "GitHub Actions"
   - 保存设置

4. **自动部署**
   - 每次推送到 `main` 分支，GitHub Actions会自动构建并部署
   - 部署完成后，应用将可通过 `https://YOUR_USERNAME.github.io/population_counter/` 访问

### 方法2：手动部署

1. **安装依赖**
   ```bash
   npm install
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到gh-pages分支**
   ```bash
   npm run deploy
   ```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

## 键盘快捷键

- **数字键 1-4**：女性青年快速计数（路过/注意/咨询/购买）
- **字母键 Q/W/E/R**：男性青年快速计数（路过/注意/咨询/购买）

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Rsbuild
- **UI库**：NextUI + TailwindCSS
- **图标**：Lucide React
- **动画**：Framer Motion

## 注意事项

- 数据存储在浏览器本地存储中，清除浏览器数据会丢失统计信息
- 建议在正式使用前导出重要数据进行备份
- 移动端使用时，建议添加到主屏幕以获得更好的体验