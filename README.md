# DevToys Web

纯浏览器本地运行的中文开发者工具箱：所有计算在浏览器内完成，无后端、无数据上传，覆盖转换、编解码、格式化、生成、文本、网络、测试、颜色、图片与参考查询等 40 款工具。

## 本地开发

需要 Node.js 20 及以上版本。

```bash
npm install
npm run dev      # 本地开发
npm run build    # 类型检查 + 构建，产物在 dist/
npm run preview  # 预览构建产物
```

## 技术栈

Vue 3 + TypeScript + Vite + Element Plus + Pinia + vue-router。产物使用相对路径（`base: './'`），可同时部署在 GitHub 项目页与自定义域名根路径。

## 隐私说明

站点不包含 `fetch`、`XMLHttpRequest`、`axios` 等用户数据外发逻辑，不引入外链脚本、字体或 CDN 资源；全部逻辑在浏览器本地执行。

## 许可证与署名

本项目衍生自 [HeHang0/devtoys](https://github.com/HeHang0/devtoys)，遵循 MIT License，Copyright (c) 2023 He Hang。详见 [NOTICE.md](NOTICE.md) 与 [LICENSE.md](LICENSE.md)。

## 部署

仓库为公开仓库，托管在 GitHub Pages，线上地址：<https://tool.nober.cn/>

部署流程已自动化：

1. 推送 `main` 分支后，`.github/workflows/deploy.yml` 会执行类型检查、构建与「无外链 CDN」校验。
2. 校验通过后，`peaceiris/actions-gh-pages@v4` 把 `dist/` 发布到 `gh-pages` 分支。
3. `public/CNAME` 内容为 `tool.nober.cn`，因此 `dist/` 与 `gh-pages` 分支根目录都带有正确的 CNAME 文件。
4. 仓库 Settings → Pages 的 Source 选择 `Deploy from a branch`，Branch 选择 `gh-pages` / `/(root)`。

### 自定义域名 DNS 配置

在 `nober.cn` 的 DNS 服务商处添加一条记录：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `tool` | `ljnober.github.io` |

等待 DNS 生效后，在仓库 Settings → Pages 中确认 Custom domain 为 `tool.nober.cn`，并勾选 `Enforce HTTPS`。GitHub 会自动为该域名签发 HTTPS 证书。

> 注意：由于项目已绑定自定义域名，访问 `https://ljnober.github.io/devtoys-web/` 会跳转到 `tool.nober.cn`。DNS 未生效前该跳转会显示 502，属正常现象。

### 测试

```bash
npm test                 # 纯函数与注册表单测（95 条）
node tests/e2e-smoke.mjs # 浏览器端到端冒烟（需先 npm run build）
node tests/audit.mjs     # 静态与部署配置审计
```

详细的需求、架构与测试报告见 `docs/` 目录。
