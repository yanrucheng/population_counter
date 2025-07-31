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
   - 如果这是第一次部署，可能需要几分钟时间来初始化Pages环境
   - **重要**：确保在第一次部署前完成此步骤，否则Actions会因为没有权限而失败

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

## 故障排除
如果在部署到GitHub Pages时遇到问题，请检查以下几点：

1. **确保已启用GitHub Actions和Pages**
   - 在仓库设置中确认GitHub Actions和Pages功能已启用
   - 确认Pages设置中选择了"GitHub Actions"作为源

2. **检查GitHub Actions权限设置**
   - 进入仓库的 Settings → Actions → General
   - 在"Workflow permissions"部分选择"Read and write permissions"
   - 确保勾选"Allow GitHub Actions to create and approve pull requests"

3. **首次部署可能需要更长时间**
   - 第一次部署可能需要几分钟来初始化环境
   - 如果部署失败，请尝试重新运行工作流

4. **检查分支名称**
   - 确保代码推送到main分支以触发部署
   - 检查工作流文件中的分支配置是否正确

5. **权限问题**
   - 确保工作流文件包含正确的权限设置（已更新为contents: write）
   - 确认GitHub Actions有权限写入Pages

6. **构建问题**
   - 确保npm run build命令能成功执行
   - 检查是否有足够的资源完成构建

7. **手动触发部署**
   - 如果自动部署失败，可以手动触发：
     - 进入Actions标签页
     - 选择Deploy to GitHub Pages工作流
     - 点击"Run workflow"手动执行

如果问题仍然存在，请查看GitHub Actions的详细日志以获取更多信息。