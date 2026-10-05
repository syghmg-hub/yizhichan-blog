# 一只蝉 · 个人博客

用 Astro 7 搭建的静态博客，部署在 Vercel，免费运行。

## 网站结构

```
src/
├── content/posts/      ← 文章都在这里（Markdown 文件）
│   ├── 随笔/
│   └── 技术笔记/
├── pages/              ← 页面
│   ├── index.astro     首页（可按栏目筛选）
│   ├── gallery.astro   相册
│   ├── about.astro     关于
│   ├── tags/           标签
│   └── rss.xml.ts      RSS 订阅
├── components/         Header / Footer / 文章卡片
├── layouts/            页面骨架
├── styles/global.css   全站样式（含深色模式）
├── data/photos.ts      相册照片列表
└── utils/slug.ts       中文标题自动转拼音网址
```

## 怎么发一篇文章

1. 在 `src/content/posts/随笔/`（或 `技术笔记/`）里新建 `.md` 文件，文件名即文章标题
2. 文件开头写信息：

```markdown
---
title: 文章标题
description: 一句话摘要，显示在首页列表
date: 2026-10-05
category: 随笔
tags: [随笔, 随想]
---

正文从这里开始，用 Markdown 书写。
```

3. 双击 `一键更新.cmd`，几秒后线上自动更新

`draft: true` 可以先存草稿不发布。

## 本地预览

双击 `启动预览.cmd`，浏览器打开 http://localhost:4321/

## 环境说明

项目自带 Node 22（`.tools/` 目录，不影响系统环境），因为 Astro 7 要求 Node ≥ 22.12。

## 常用命令

```bash
npm run dev      # 本地预览
npm run build    # 构建静态页面到 dist/
npm run preview  # 预览构建结果
```
