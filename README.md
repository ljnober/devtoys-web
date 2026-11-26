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

部署工作流与自定义域名（`tool.nober.cn`）说明将在后续任务中补充。
