# 极简天气预报

一个简洁的天气预报网页。

## GitHub Pages 部署步骤

### 1. 创建 GitHub 仓库

```powershell
gh repo create pane --public --source=. --push
```

### 2. 启用 GitHub Pages (workflow 模式)

```powershell
gh api "repos/JacobNg1/pane/pages" -X POST -f "build_type=workflow"
```

### 3. 创建 workflow 文件

创建 `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4. 推送并触发部署

```powershell
git add .github/workflows/pages.yml
git commit -m "Add GitHub Pages workflow"
git push
```

### 5. 手动触发 workflow

```powershell
gh workflow run "pages.yml"
```

### 6. 查看部署状态

```powershell
gh run view <run-id> --web
```

## 访问

部署完成后访问: https://JacobNg1.github.io/pane/
