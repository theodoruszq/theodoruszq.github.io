# Digital Reality

一个部署在 GitHub Pages 上的双语个人博客。保留当前页面样式，使用 **Markdown 源文件 + 本地生成脚本 + 静态 HTML**。每篇文章的中文和英文都由文件维护，不依赖在线翻译服务。

## 第一次准备

需要 Python 3.10 或更新版本。在仓库根目录执行：

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

只需安装一次。之后所有生成命令都使用 `.venv/bin/python`。生成器使用固定版本的 [Python-Markdown](https://python-markdown.github.io/)，没有运行时服务器依赖。

## 新增一篇帖子

### 1. 创建本地草稿

```sh
.venv/bin/python scripts/new_post.py 20260901-weekend-notes --date 2026-09-01
```

得到：

```text
.drafts/20260901-weekend-notes/
├── post.json   # 日期、两种语言的标题和简介
├── zh.md       # 中文正文
└── en.md       # 英文正文
```

`20260901-weekend-notes` 是文章的固定标识，也是网址的一部分。请使用小写英文、数字、连字符或下划线；发表以后尽量不要改名，否则旧链接会失效。命令遇到同名草稿或已发表文章会停止，不会覆盖。

`.drafts/` 已加入 `.gitignore`，生成器也不会读取它。还没决定公开的文字、照片和笔记先留在这里，或者放在仓库外。不要使用 `git add -f` 强行加入草稿。

### 2. 写标题、简介和正文

编辑 `post.json`，例如：

```json
{
  "date": "2026-09-01",
  "draft": true,
  "title": {
    "zh": "周末的一点记录",
    "en": "A Few Weekend Notes"
  },
  "summary": {
    "zh": "散步、听音乐，以及最近做的一点小东西。",
    "en": "Walks, music, and a small thing I have been making."
  }
}
```

- `date`：文章原始发布日期，格式为 `YYYY-MM-DD`。
- `draft`：写作期间保持 `true`；确定发布时改成 `false`。
- `title` / `summary`：中英文都要填，简介以一两句话为宜。
- 可选 `image`：列表缩略图，例如 `/images/20260901-weekend-notes/cover.jpg`。不需要封面时直接省略。
- 可选 `published`：更精确的发布时间，例如 `2026-09-01T20:00:00+08:00`，用于 RSS。省略时使用 `date` 当天北京时间零点。
- 可选 `original`：WordPress 原文的 HTTPS 链接；已有迁入文章保留了这个字段。

在 `zh.md`、`en.md` 中分别写完整正文。可以先写熟悉的语言，再翻译，但**发布前两种语言都必须完成**。删除模板中的 `TODO`，生成器遇到缺失版本、空标题/简介/正文或遗留 `TODO` 会报错，不会用中文冒充英文。

正文不用重复文章标题：

````markdown
这是第一段，可以使用 **加粗**、*斜体* 和 [链接](https://example.com/)。

## 周末散步 {#weekend-walk}

这里是这一节的内容。

![散步时拍到的树](/images/20260901-weekend-notes/tree.jpg)

```python
print("Hello, weekend!")
```
````

英文对应小节可以写 `## A Weekend Walk {#weekend-walk}`。两种语言保留相同的 `{#...}`，分享章节链接时更方便。普通 Markdown 支持段落、列表、引用、链接、图片、代码块和表格。

已有文章为完整保留原文和相册，部分 `.md` 中使用了 HTML；这是支持的，新文章一般直接写 Markdown 即可。HTML 仅用于你信任的内容，不要直接粘贴来历不明的脚本。英文版可以翻译图片说明和代码注释，但不要无意修改命令、变量、链接或数据。

### 3. 准备发布并生成页面

确认两种版本都适合公开后：

1. 将 `post.json` 的 `draft` 改为 `false`。
2. 把准备公开的配图放到 `images/20260901-weekend-notes/`，正文使用以 `/images/` 开头的路径。中英文共用同一张图片，不需要复制两份。未准备公开的图片不要放到这个公共目录。
3. 移入正式内容目录并运行生成器：

```sh
mv .drafts/20260901-weekend-notes content/posts/
.venv/bin/python scripts/build_posts.py
.venv/bin/python scripts/build_posts.py --check
```

生成器会自动更新：

- 中文文章：`/posts/20260901-weekend-notes/`
- 英文文章：`/en/posts/20260901-weekend-notes/`
- 首页最近 8 篇文章、完整 Blogs 列表（按日期倒序）
- 中文 RSS：`/index.xml`、`/posts/index.xml`
- 英文 RSS：`/index.en.xml`、`/posts/index.en.xml`
- `sitemap.xml`、`index.json` 和生成文件清单 `.generated-posts.json`

生成器不会调用 AI 或自动翻译；`en.md` 是需要维护和审阅的正式版本。两种语言分别计算阅读时间。Creations 仍在 `creations/index.html` 维护；生成命令会把最近 4 项同步到首页。

### 4. 本地预览

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>。如果本地预览服务已经启动，直接刷新页面即可，不必重复启动。修改 Markdown 后需要再次运行生成命令，再刷新浏览器。

检查标题、日期、简介、配图、代码块、所有链接，以及右上角的 `中文 / EN` 切换。两种文章地址都可以直接打开；禁用 JavaScript 时仍能阅读对应版本，并通过顶部链接切换。

### 5. 提交并发布到 GitHub Pages

```sh
git status --short
git diff --stat
.venv/bin/python scripts/build_posts.py --check
```

在 Git 客户端中检查并提交本次文章相关的源文件、配图和生成文件，再推送到仓库配置的 Pages 发布分支。生成出的 HTML、RSS、索引等**也需要提交**；只推送 Markdown 不会更新当前网站。

当前方案不依赖 GitHub Actions 来运行这个生成器。GitHub Pages 可使用 **Settings → Pages → Build and deployment → Deploy from a branch**，选择发布分支和 `/(root)`；仓库中的 `.nojekyll` 让它直接提供静态文件。具体以你仓库现有的 Pages 设置为准，参见 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

这个改版目前在本地 `codex/simple-blog` 分支，旧版保存在本地 `archived/0831`。**本次修改没有替你推送、合并或修改 GitHub 的发布设置。** 首次发布改版时，需要把完整改版内容一并提交到你选定的发布分支；之后更新文章按上面的流程即可。

## 修改或撤下已有文章

修改 `content/posts/<slug>/post.json`、`zh.md`、`en.md`，重新生成、预览并提交。不要直接改 `posts/<slug>/index.html` 或 `en/posts/<slug>/index.html`，下次生成会覆盖它们。

正式内容设为 `draft: true` 后，生成器会将其从列表、RSS 和 sitemap 移除，并依据 `.generated-posts.json` 删除它之前生成的中英文文章 HTML。未列入清单或缺少生成标记的文件不会被擅自删除。

**撤下页面不等于删除公开记录。** 如果仓库是公开的，源文件、配图、Git 历史，以及第三方缓存仍可能被看到。`draft: true` 只是构建开关，不是权限或加密机制。真正的私人内容不要提交到公开仓库。

## 语言行为

- 首页、Blogs 和其他普通页面：默认使用英文，不跟随浏览器语言；手动切换后会记住选择。
- 文章链接明确指定版本：原来的 `/posts/.../` 是中文，`/en/posts/.../` 是英文。直接打开英文地址时，正文和界面都使用英文，不被旧的中文偏好覆盖。
- 右上角切换会同时更新文章标题、正文、阅读时间、元信息和网址；当前页不重新请求文章，也不会增加一次浏览统计。
- 列表里的标题、简介和文章链接随语言切换；RSS 入口也选择对应语言。
- 两种版本均为预先生成的 HTML，没有在线翻译请求。复制地址就能分享指定语言。链接带章节锚点时，建议两种正文使用相同的小节 ID。
- Creations 的项目介绍目前保留原始中文，界面按钮和链接正常切换。本文档说明的是 Posts 的完整双语支持。

## 文件分工与检查

- `content/posts/`：已准备公开的文章源文件。
- `.drafts/`：本地草稿，不提交、不参与构建。
- `templates/post.html`：文章共用外壳；修改后重新生成。
- `scripts/new_post.py`：创建一份中英文草稿。
- `scripts/build_posts.py`：生成所有双语文章与索引；`--check` 只检查是否需要重新生成。
- `index.html` / `posts/index.html`：页面外壳可编辑；生成标记之间的文章列表由脚本维护。
- `scripts/update_home.py`：旧的首页摘录助手；新增/修改文章请使用 `build_posts.py`，不要只运行旧助手。
- `css/site.css` / `js/site.js`：共享样式、语言切换和计数器。
- `fonts/lato-*.woff2`：本地 Lato 字体，许可证见 `fonts/Lato-OFL.txt`。

运行生成器回归检查：

```sh
.venv/bin/python -m unittest discover -s tests -v
.venv/bin/python scripts/build_posts.py --check
```

## Shared view counter


The footer shows **cumulative site page views**, not unique people or button clicks. It uses the JSON API of [soxft's Busuanzi service](https://github.com/soxft/busuanzi/wiki/api), hosted at `https://busuanzi.9420.ltd/api`. No account, API key, or third-party executable script is required.

- Counting is restricted to the exact production origin `https://theodoruszq.github.io`. Each full page load makes at most one increment request; language switches do not count again. Local previews make no requests and show a dash with an explanation.
- There is no local-storage visit counter or invented initial value. Unavailable/invalid responses show a dash, never a misleading zero. The endpoint is not retried automatically, avoiding accidental double increments.
- Only the canonical site origin is supplied, not the current article path, query string, or fragment. Fetch uses `credentials: 'omit'` and `referrerPolicy: 'no-referrer'`; no visitor identifier or analytics cookie is stored by this integration. The external service still receives visitors' IP addresses and browser network information. The footer links to the service and describes this in its title.
- Do Not Track and Global Privacy Control opt-outs are respected by skipping statistics requests.
- This is a lightweight public counter, not audited analytics: reloads can count again, blockers/opt-outs can undercount, and bots can affect totals. The provider explicitly offers no availability or data-integrity guarantee. It cannot recover historical traffic from before integration. A change to the production domain requires updating the guard and counter origin in `js/site.js` and may start a separate total.

The endpoint's read-only GET response and production-origin CORS preflight were checked during development. Live increments are intentionally not exercised in local preview; verify the number after an authorized production deployment.
