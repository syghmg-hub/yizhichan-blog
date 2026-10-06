# 一只蝉 · 个人博客

用 Astro 7 搭建的静态博客，部署在 Vercel，免费运行。带一个中文网页版写作后台（Decap CMS）。

## 两种写作方式

**方式一：网页后台（推荐，无需代码）**

访问 `https://yizhichan-blog.vercel.app/admin`，用 GitHub 登录后即可像发朋友圈一样发文章、传图片。
详细说明见站内 `/write/` 页面。

**方式二：直接改文件**

1. 在 `src/content/posts/随笔/`（或 `项目经验/`）里新建 `.md` 文件，文件名即文章标题
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

## 写作后台（Decap CMS）

| 位置 | 用途 |
|---|---|
| `public/admin/index.html` | 后台页面（已配 `noindex`，不被搜索引擎收录） |
| `public/admin/config.yml` | 后台配置：字段、栏目、登录、图片压缩 |
| `public/uploads/` | 后台上传的图片（自动转 WebP、限宽 1600px） |
| `/write/` | 站内中文写作说明页 |

后台配置要点：

- 界面语言 `locale: zh_Hans`
- 两个栏目分别对应 `src/content/posts/随笔` 与 `src/content/posts/项目经验`
- `category` 是隐藏字段，按栏目自动填写，手动不用管
- `backend` 段决定登录方式：托管登录（Decap Turbo）填 `turbo_site_id`；自托管用 `github` + OAuth 中转
- 改完 `config.yml` 需要 `npm run build` 并推送才生效

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
