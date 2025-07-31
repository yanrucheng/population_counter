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

本项目已配置 GitHub Actions 自动部署到 GitHub Pages，使用官方推荐的部署方式。

#### 启用GitHub Pages

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

3. **启用GitHub Pages**（关键步骤）
   - 进入仓库的 Settings → Pages
   - 在 "Build and deployment" 部分
   - **Source**: 选择 "GitHub Actions"（不是 "Deploy from a branch"）
   - 点击 **Save**
   - 页面会显示 "Your site is ready to be published" 或类似提示
   - 如果这是第一次部署，可能需要几分钟时间来初始化Pages环境
   - **关键步骤**：确保在第一次部署前完成此步骤，否则即使构建成功，页面也不会自动部署

#### 部署流程

我们使用 GitHub 官方推荐的部署方式，包含两个阶段：
- **Build阶段**：构建项目并上传制品
- **Deploy阶段**：将制品部署到 GitHub Pages

#### 自动部署
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

#### 6.3 部署问题

**问题**：GitHub Actions 构建成功但页面未更新

**解决方案**：
1. 检查仓库的 **Settings → Pages** 中是否选择了 **GitHub Actions** 作为 Source
2. 确保在 **Settings → Actions → General** 中启用了 "Read and write permissions"
3. 检查构建日志是否有错误
4. 等待几分钟，首次部署可能需要更长时间

#### 6.4 找不到部署后的页面

如果GitHub Pages设置正确但找不到页面：

1. **访问地址**：`https://yanrucheng.github.io/population_counter/`
2. **确认部署成功**：在仓库的 **Actions** 标签中查看最近的workflow运行状态
   - 应该看到两个job：**build** 和 **deploy** 都成功完成
3. **查看环境**：在仓库侧边栏的 **Environments** 中查看 `github-pages` 环境状态
   - 应该显示绿色勾号 ✅ 和部署URL
4. **等待时间**：首次部署可能需要5-10分钟

#### 6.5 构建问题

**问题**：`npm run build` 失败

**解决方案**：
1. 确保所有依赖已安装：`npm ci`
2. 检查 `rsbuild.config.ts` 配置是否正确
3. 查看构建日志获取具体错误信息

#### 6.6 官方部署方式说明

我们已更新为使用 GitHub 官方推荐的部署方式，包含：
- `actions/configure-pages@v4`：配置Pages环境
- `actions/upload-pages-artifact@v3`：上传构建产物
- `actions/deploy-pages@v4`：执行部署

这种分离式部署方式更安全、更可靠，符合GitHub最佳实践。