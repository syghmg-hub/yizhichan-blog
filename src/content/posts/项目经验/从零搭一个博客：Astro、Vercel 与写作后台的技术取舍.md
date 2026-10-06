---
title: 如何零成本搭一个个人博客
description: 用 AI 辅助、零预算、零服务器，从选型到上线完整复盘一次个人博客的搭建。
date: 2026-10-06
slug: ji-shu-bi-ji-cong-ling-da-yi-ge-bo-ke-astrovercel-yu-xie-zuo-hou-tai-de-ji-shu-qu-she
category: 项目经验
tags:
  - Astro
  - Vercel
  - 静态博客
  - Decap CMS
  - 踩坑记录
  - AI辅助开发
---

做这个博客的条件很苛刻：**零预算、不买服务器、不写代码、还要能像发朋友圈一样更新**。

有意思的是，真正花时间的不是写功能，而是几个"看起来能跑其实不能跑"的坑。这篇复盘记录完整流程，重点放在**为什么这么做**和**踩了什么坑**上——纯操作步骤网上一堆，比推理过程更值钱的是判断依据。

<!-- more -->

## 一、选型：先问对问题

动手前我先确认了四件事，它们直接决定了后面的技术选择：

| 约束 | 内容 |
|---|---|
| 技术基础 | 几乎不写代码 |
| 内容类型 | 生活随笔 + 摄影 + 技术笔记 |
| 预算 | 0 元 |
| 更新方式 | 要像发朋友圈一样简单 |

最终方案：**Astro 7 + Vercel + GitHub + Decap CMS**。

排除掉的选项和原因：

- **WordPress** —— 要买服务器、要装环境、还容易被挂马，个人博客不值当
- **掘金 / 知乎专栏** —— 内容不在自己手里，随时可能调整规则或关停
- **Next.js 自建全栈** —— 对不写代码的人来说，维护成本太高

选 Astro 的核心理由是**内容与表现彻底分离**：文章就是纯 Markdown 文件，构建时编译成静态 HTML。没有数据库、没有运行时服务器，托管方只负责发静态文件——这让成本和故障率都降到最低。

## 二、第一个坑：Node 版本

装完依赖直接构建，报错：

```
Node.js v20.12.2 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.12.0"
```

Astro 7 要求 Node ≥ 22.12，而本机是 20.12。

**我的处理方式**：不升级系统 Node，改为在项目内放一份便携版（`.tools/`），所有命令通过它调用。

```bat
set PATH=%~dp0.tools\node-v22.23.3-win-x64;%PATH%
call "%~dp0.tools\node-v22.23.3-win-x64\npm.cmd" run build
```

这个选择的好处是不影响电脑上其他项目。代价是紧接着踩了第二个坑——npm 的一个已知 bug 导致**可选依赖没装上**，报 `Cannot find native binding`。解法是删掉 `node_modules` 和 `package-lock.json` 后重装。

> 教训：跨大版本升级框架时，先确认本地运行时版本，能省掉一连串连环错误。

## 三、中文网址：一个小参数的代价

中文标题直接当文件名，生成的 URL 会是一串百分号编码，非常难看。

解决方案是用 `pinyin-pro` 在构建时把文件名转拼音。但第一次实现出来是错的：

```
「用 Markdown 写作的最佳实践」→ /posts/ji-shu-bi-ji-yong-m-a-r-k-d-o-w-n-.../
                                     ↑ 英文被拆成了单个字母
```

原因是拼音库的默认行为会把所有非中文字符逐个转换。补上一个参数就对了：

```ts
pinyin(text, {
  toneType: 'none',
  type: 'array',
  nonZh: 'consecutive',  // ← 关键：让连续的英文/数字作为一个整体
})
```

改完就正常了：`/posts/ji-shu-bi-ji-yong-markdown-xie-zuo-de-zui-jia-shi-jian/`。

## 四、部署时撞到的网络墙

本地构建没问题，推送时：

```
fatal: unable to access 'https://github.com/...': Recv failure: Connection was reset
```

直连 GitHub 被重置。解决方式是给**这个仓库单独**配代理，不污染全局配置：

```bash
git config --local http.proxy http://127.0.0.1:7897
git config --local https.proxy http://127.0.0.1:7897
```

用 `--local` 而不是 `--global` 是有意的——代理是本机环境的属性，不该跟着项目跑到别人电脑上。

另外提交身份用了 GitHub 的**隐私邮箱**（`username@users.noreply.github.com`），这样真实邮箱不会进入任何提交历史。

## 五、最花时间的部分：写作后台

"像发朋友圈一样发文章"是这个项目最难的部分。目标是在浏览器里编辑 Markdown、上传图片、保存即发布，而且**界面最好是中文**。

我评估了四个方案，最后的结果和最初预期不同。

### 否决 Keystatic 的过程

Keystatic 看起来很合适：免费、自托管在网站里、后台直接嵌在自己的站点上。但我解压了它的 npm 包检查字段定义，发现：

```js
// 富文本字段只有这些
markdoc, mdx, blocks, document, ...
// 没有 markdown
```

**它没有纯 Markdown 编辑器**。用了它就意味着要把现有文章全部转成别的格式，还要额外装 markdoc 渲染器。为了一个编辑器迁移全部内容，不值得。

### 为什么是 Decap CMS

决定性因素是两点，且都经过实际验证：

1. **官方语言包含 `zh_Hans`** —— 我下载语言包解包确认里面有真实的简体中文翻译（"登录"、"正在登录"等）
2. **`markdown` 组件直接编辑 `.md` 原文** —— 与现有内容零冲突，不用迁移

配置里几个关键项：

```yaml
locale: zh_Hans              # 简体中文界面
backend:
  name: turbo-github         # 托管登录，免自建 OAuth 服务
  turbo_site_id: <uuid>
media_folder: public/uploads # 图片进仓库
media_processing:            # 上传时自动压缩，防止仓库膨胀
  format: { enabled: true, default: webp }
  quality: 82
  width: 1600
publish_mode: simple         # 保存即发布，不做审核流
```

图片自动压缩这条很值得：原图直接传进仓库会让仓库体积失控，转成 WebP + 限宽后，一张手机照片从几 MB 降到一百多 KB。

## 六、后台接入的三个坑

这部分排错花了最久，而且**每次报错信息都指向不同层面**。

### 坑 1：配置文件 404

```
Error: Failed to load config.yml (404)
```

直觉上像是文件没部署上去。但实测发现 `/admin/config.yml` 能正常返回 200。

真因是：**Vercel 不会把 `/admin` 自动重定向到 `/admin/`**。CMS 用相对路径找配置文件，在地址是 `/admin`（无尾斜杠）时，相对路径就解析到了根目录的 `/config.yml`。

修法是显式声明绝对路径，不依赖相对路径解析：

```html
<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
```

### 坑 2：后端不存在

```
Error: Backend not found: turbo-github
```

查官方文档才发现，托管登录后端**只在 beta 版发布**，稳定版里根本没有这个后端。

按官方说明改用 beta 加载。这里我做了个选择：**不用 `@beta` 标签，固定具体版本号**。

```html
<script src="https://cdn.jsdelivr.net/npm/decap-cms@3.17.0-beta.2/dist/decap-cms.js"></script>
```

因为 beta 可能在 minor 版本里引入破坏性变更，跟踪标签意味着某天早上代码突然坏掉，而你昨天还是好的。

### 坑 3：登录弹窗被拦

```
Your browser blocked the login popup.
```

这时改配置已经没有意义了。我用 **CDP（Chrome DevTools Protocol）** 直接连浏览器抓取页面状态，对比了两个浏览器：

- Chrome：弹窗正常打开，显示登录表单 ✅
- Edge：拦截弹窗 ❌

结论是**浏览器兼容问题，不是代码问题**。装 Chrome 作为后台入口解决。

> 这里值得记一笔：前端问题先用工具**观测实际状态**，再下结论。凭报错文案猜方向会浪费时间——这次如果继续改配置，方向就完全错了。

## 七、样式改不动的问题

Decap v3 用 CSS-in-JS 生成类名。我解包了整个 JS 想找可覆写的选择器，结果：

```bash
# 搜 "nc-" 前缀的类名
nc-root
nc-widgetPreview
# 就这 2 个
```

**它没有稳定的类名可供外部样式覆写**。所以界面调整只能走两条路：元素级安全覆写（字体、圆角、边框、配色）+ 自己搭一层外壳（顶栏 / 工作区 / 底栏）。

也正因如此，后来遇到配色问题时，我意识到改自己博客的主题色根本影响不到后台按钮的颜色。

## 八、配色：一次失败的实验

后台主色是蓝色（实测 `rgb(58,105,199)` = `#3a69c7`），博客原色是绿色，摆在一起有点撞。

我决定"顺应后台"，把博客全站改成蓝色系。上线后实际用下来**并不喜欢**，于是回退绿色。

但这次实验留下了一个有价值的东西：**双配色切换**。

实现方式是四套 CSS 变量组合：

```css
:root         { /* 蝉绿 · 浅色 */ }
html.sky      { /* 晴蓝 · 浅色 */ }
html.dark     { /* 蝉绿 · 深色 */ }
html.dark.sky { /* 晴蓝 · 深色 */ }  /* 放最后，优先级最高 */
```

两个按钮独立控制明暗和配色，共四种组合。状态存 `localStorage`，并且**在首帧渲染前用内联脚本应用**，否则会闪白：

```html
<script is:inline>
  (function () {
    var d = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') d.classList.add('dark');
    if (localStorage.getItem('palette') === 'sky') d.classList.add('sky');
  })();
</script>
```

因为 `localStorage` 同源共享，后台页面读同一个值，配色**全局联动**，不用在两处各调一次。

> 教训：失败的实验不一定白做。把"改 A"变成"A 和 B 都能选"，约束条件就从死路变成了自由度。

## 九、一个真实的 CSS Bug

文章页代码块几乎无法阅读——浅色背景上显示浅色的语法高亮文字，底部还漏出一条深色边。

肉眼判断容易得出"配色没调好"的结论，但**量一下就知道不是**。取计算样式：

```
pre 背景: rgb(36, 41, 46)     ← 深色，正确
pre 的 color: rgb(43,43,43)   ← 深色
```

`pre` 本身完全正常。再往里看一层：

```
块级 <code> 的 class = ""      ← 空！
它的背景: rgb(241, 239, 233)   ← 浅色，问题在这
它命中了: .article-body code:not([class*='language-']):not(.ec-code)
```

根因清楚了：为了给**行内代码**加样式，我写了个选择器排除 `language-` 和 `ec-code`。但 expressive-code 生成的块级 `code` 元素**没有任何 class**，两个 `:not()` 都命中不了，于是被套上了行内代码的浅色背景，正好盖住下面深色的 `pre`。

修法是换一种表达方式，按**结构**而不是按 class 排除：

```css
/* 只作用于行内代码 */
.article-body :not(pre) > code {
  background: var(--bg-soft);
  padding: 2px 6px;
  border-radius: 5px;
}
```

> 这是个典型的"防御性写法反噬"：用 `:not([class*=...])` 猜测对方的类名约定，不如直接按父子结构判断。后者不依赖任何外部约定，也不会因为对方改名而失效。

## 十、验证链接不能只看状态码

给 RSS 订阅页写推荐时，我推荐了一款阅读器。验证时只检查了链接能否打开（HTTP 200），结果读者点进去发现是一个 **"There aren't any releases here"** 的空页面——那个项目早就不在 Releases 发包了。

修正后的验证方式：

```bash
# 1. 页面里是否真有下载链接
grep -oE '/releases/download/[^"]+\.apk'

# 2. 直链是否真的能下载
curl -I <apk-url>
# → HTTP 200
# → Content-Type: application/vnd.android.package-archive
# → Content-Length: 11xxxxxx
```

最后换成 Read You（F-Droid），确认可下载后才写进页面。

> **200 只说明服务器愿意响应，不说明内容有用。** 涉及具体资源时，要验证内容本身。

## 十一、顺手做的体验优化

除了修 bug，还做了几处调整，思路一致：**先量数据再改**。

| 问题 | 数据 | 改法 |
|---|---|---|
| 目录框太笨重 | 高度 200px，右侧空一半 | 去灰盒改细线 + 双列，降到 **112px** |
| 主题图标跨平台不一致 | emoji 各系统渲染不同 | 换手绘内联 SVG |
| 日期格式两套 | 列表 `2026/10/06`，详情 `2026年9月20日` | 全局统一 `YYYY.MM.DD` |
| 卡片只能点标题 | — | `::after` 撑满整卡 + hover 反馈 |
| 照片不能放大 | — | 加灯箱，支持 ✕ / 点遮罩 / Esc 三种关闭 |
| 内容少时页脚下沉 | — | body 改 flex 纵向布局 |

其中"整卡可点"有个细节：撑满整卡的链接层会盖住卡片里的标签链接，需要给标签单独提升层级：

```css
.post-card-link::after { content: ''; position: absolute; inset: 0; }
.post-card-tags { position: relative; z-index: 1; }
```

## 十二、给非技术用户的交付

考虑到使用者不写代码，最后做了三个双击即用的脚本，把技术操作包成日常动作：

- **启动预览** —— 本地起服务并自动开浏览器
- **一键更新** —— 构建 + 提交 + 推送，一步上线
- **打开检查** —— 同时打开博客和后台

其中"打开检查"会**优先查找 Chrome 并用它打开**，因为后台登录依赖弹窗授权，Edge 会拦（见第六节的坑 3）。

## 十三、当前状态与成本

| 项 | 情况 |
|---|---|
| 成本 | **0 元** |
| 服务器 | 不需要（纯静态托管） |
| 部署 | Git 推送自动触发，约 1 分钟 |
| 依赖 | 6 个：astro、@astrojs/rss、@astrojs/sitemap、astro-expressive-code、marked、pinyin-pro |

---

## 复盘：如果重做一次

**做得对的**：
- 一开始就问清楚约束（不写代码 / 零预算 / 要简单），避免走弯路
- 遇到诡异报错先用工具观测实际状态，而不是顺着报错文案猜
- 解包第三方包检查真实实现（否决 Keystatic、发现 CSS-in-JS、定位代码块 bug 都靠这个）

**下次要注意**：
- 第三方服务的 beta 版本，务必固定版本号
- 涉及他人资源的链接，验证内容而不只验证状态码
- 用 class 名猜测外部库的结构很脆弱，按结构（父子关系）写选择器更稳

**这个项目最重要的收获**：AI 能极大加速"写出来"，但**判断对不对**仍然要靠人。当它给出一个看似合理的方案时（比如 Keystatic），你需要有办法验证它是否真的成立——而验证的手段，往往是回到源码和实际数据。
